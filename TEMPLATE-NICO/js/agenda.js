/* Intellihelp — Home: agenda de #agenda contra el CRM (sin dependencias).
   Servidor: api/agenda.php (horarios y reserva) y api/contact.php (consulta), que firman cada pedido al CRM; el
   navegador no ve claves. Marcado: la card [data-agenda] de #agenda en index.html.

   Módulos, en orden: origen de la visita · medición · validación · CTA "Agendá reunión" · formulario de consulta ·
   agenda del CRM.

   - Origen: la primera visita (utm_*, gclid, li_fat_id, referrer, página de entrada y canal) se guarda 90 días en
     localStorage (`ith_origen`, la misma clave que el sitio multipágina) y viaja en los campos ocultos de los dos
     formularios: llega al CRM (entradas_web) y al mail.
   - Medición (dataLayer): `schedule_meeting` al confirmar una reunión y `cf7_enviado` cuando la consulta se envía bien
     (pedido de marketing: con ese evento Tag Manager arma generate_lead). `click_calendar` la primera vez que se elige
     un horario. Los CTA miden `cta_click` en main.js.
   - Agenda: con JS, la card pone delante el selector de día y hora (template [data-agenda-crm]) y deja el formulario
     de consulta oculto como respaldo. Los horarios se piden cuando #agenda se acerca a la pantalla (o al tocar un CTA)
     y no al cargar la página. Si el CRM no responde o no hay horarios, vuelve el formulario de consulta (con los datos
     cargados si falló la reserva).
   - Sin JS se ve el formulario de consulta, que hace un POST normal a api/contact.php. */
(() => {
  'use strict';

  const panel = document.querySelector('[data-agenda]');
  if (!panel) return;

  const motion = document.documentElement.classList.contains('anim'); // ver script en <head>
  // data-api en la card: ruta a api/agenda.php desde una página en una subcarpeta (/diagnostico-sin-cargo/ usa
  // "../api/agenda.php"). Sin el atributo, la de la raíz.
  const API_AGENDA = panel.dataset.api || 'api/agenda.php';
  const DIAS_POR_PAGINA = 5;
  const RANGO_DIAS = 20; // la ventana del tipo de reunión en el CRM es de 21 días
  const TIMEOUT_HORARIOS_MS = 12000;
  const TIMEOUT_RESERVA_MS = 25000;
  const TIMEOUT_CONSULTA_MS = 15000;

  const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const DIAS_CORTOS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
  const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

  const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ---------- Origen de la visita ---------- */
  const ORIGEN_KEY = 'ith_origen';
  const ORIGEN_DIAS = 90;
  const PARAMS_ORIGEN = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'li_fat_id'];

  // El almacenamiento puede fallar (modo privado, cookies bloqueadas): la página anda igual.
  const leer = (key) => {
    try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch (e) { return null; }
  };
  const guardar = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* queda solo para esta página */ }
  };
  const sinWww = (host) => host.replace(/^www\./, '');
  const hostDe = (url) => {
    try { return sinWww(new URL(url).hostname.toLowerCase()); } catch (e) { return ''; }
  };
  const recortar = (value, max) => String(value == null ? '' : value).replace(/[\u0000-\u001f\u007f]+/g, ' ').trim().slice(0, max);

  // Asistentes conversacionales como fuente de tráfico: por el referrer o por utm_source (ChatGPT agrega
  // utm_source=chatgpt.com a sus enlaces). Mismos nombres que el sitio multipágina, para que el CRM sume igual.
  const ASISTENTES = [
    [/(^|\.)(chatgpt\.com|openai\.com)$/, 'IA: ChatGPT'],
    [/(^|\.)perplexity\.ai$/, 'IA: Perplexity'],
    [/^gemini\.google\.com$|^bard\.google\.com$/, 'IA: Gemini'],
    [/(^|\.)copilot\.microsoft\.com$/, 'IA: Copilot'],
    [/(^|\.)claude\.ai$/, 'IA: Claude'],
  ];

  /** Nombre del canal en castellano, el mismo en el CRM, el mail y los eventos. */
  function canalDe(o) {
    const source = (o.utm_source || '').toLowerCase();
    const medium = (o.utm_medium || '').toLowerCase();
    const ref = hostDe(o.referrer);
    const pago = /cpc|ppc|paid|pago|ads?$|display|remarketing|retargeting/.test(medium);
    if (o.gclid) return 'Google Ads';
    if (o.li_fat_id) return 'LinkedIn Ads';
    for (const [re, nombre] of ASISTENTES) if (re.test(source) || re.test(ref)) return nombre;
    if (source) {
      if (/linkedin|lnkd/.test(source)) return pago ? 'LinkedIn Ads' : 'LinkedIn';
      if (/google/.test(source)) return pago ? 'Google Ads' : 'Google';
      if (/mail|newsletter/.test(medium) || /mail/.test(source)) return 'Mail';
      return `Campaña: ${o.utm_source}${o.utm_medium ? ` / ${o.utm_medium}` : ''}`;
    }
    if (ref) {
      if (/(^|\.)linkedin\.|^lnkd\.in$|com\.linkedin\.android/.test(ref)) return 'LinkedIn';
      if (/^mail\.google\.|android\.gm$|outlook\.(live|office)|mail\.yahoo/.test(ref)) return 'Mail';
      if (/(^|\.)google\.[a-z.]+$|googlequicksearchbox/.test(ref)) return 'Google (búsqueda)';
      if (/(^|\.)bing\.com$/.test(ref)) return 'Bing (búsqueda)';
      if (/(^|\.)(duckduckgo\.com|search\.yahoo\.com|ecosia\.org|search\.brave\.com)$/.test(ref)) return `Buscador: ${ref}`;
      return `Otro sitio: ${ref}`;
    }
    return 'Directo';
  }

  // La primera visita manda: una vuelta posterior por otro canal no pisa el origen (90 días).
  const origen = (() => {
    const previo = leer(ORIGEN_KEY);
    if (previo && typeof previo === 'object' && Date.now() - Number(previo.t || 0) < ORIGEN_DIAS * 864e5) return previo;
    const query = new URLSearchParams(location.search);
    const externo = document.referrer && hostDe(document.referrer) !== sinWww(location.hostname);
    const datos = { t: Date.now(), landing: location.pathname, referrer: externo ? recortar(document.referrer, 300) : '' };
    PARAMS_ORIGEN.forEach((k) => { datos[k] = recortar(query.get(k), k === 'gclid' || k === 'li_fat_id' ? 200 : 150); });
    datos.canal = canalDe(datos);
    guardar(ORIGEN_KEY, datos);
    return datos;
  })();

  /** Completa los campos ocultos de origen de un formulario (sin pisar los que ya tienen valor). */
  function completarOrigen(form, extra = {}) {
    const valores = { ...origen, visitas_landing: '', ...extra };
    delete valores.t;
    Object.entries(valores).forEach(([name, value]) => {
      const input = form.elements.namedItem(name);
      if (input instanceof HTMLInputElement && input.type === 'hidden' && value) input.value = String(value);
    });
  }

  /* ---------- Medición ---------- */
  function track(event, params = {}) {
    (window.dataLayer = window.dataLayer || []).push({ event, page_path: location.pathname, canal: origen.canal, ...params });
  }

  /* ---------- Validación (mensajes en castellano, aria-invalid y foco en el primer error) ---------- */
  const MENSAJES = {
    nombre: 'Escribí tu nombre y apellido.',
    apellido: 'Escribí tu apellido.', // formularios con nombre y apellido separados (/diagnostico-sin-cargo/)
    empresa: 'Escribí el nombre de tu empresa u organismo.',
    mail: 'Escribí tu mail laboral.',
    mailInvalido: 'Revisá el mail: tiene que tener la forma nombre@empresa.com.',
    acepto: 'Para continuar, aceptá el uso de tus datos.',
    otro: 'Completá este campo.',
  };
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  // Un campo puede traer su propio mensaje para cuando falta (data-mensaje); si no, el de MENSAJES.
  function validar(input) {
    const falta = input.dataset.mensaje || MENSAJES[input.name] || MENSAJES.otro;
    if (input.type === 'checkbox') return input.required && !input.checked ? falta : '';
    const valor = input.value.trim();
    if (input.required && !valor) return falta;
    if (input.type === 'email' && valor && !EMAIL.test(valor)) return MENSAJES.mailInvalido;
    return '';
  }

  function marcarError(input, mensaje) {
    const id = `${input.id}-error`;
    let error = document.getElementById(id);
    const describe = new Set((input.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean));
    if (mensaje) {
      if (!error) {
        error = document.createElement('p');
        error.id = id;
        error.className = 'agenda-form__error';
        (input.closest('.agenda-form__check') || input).after(error);
      }
      error.textContent = mensaje;
      input.setAttribute('aria-invalid', 'true');
      describe.add(id);
    } else {
      if (error) error.remove();
      input.removeAttribute('aria-invalid');
      describe.delete(id);
    }
    if (describe.size) input.setAttribute('aria-describedby', [...describe].join(' '));
    else input.removeAttribute('aria-describedby');
  }

  /** Valida todos los campos; devuelve el primero con error (o null). */
  function validarTodo(campos) {
    let primero = null;
    campos.forEach((campo) => {
      const msg = validar(campo);
      marcarError(campo, msg);
      if (msg && !primero) primero = campo;
    });
    return primero;
  }

  /** Clave de un envío (idempotencia): la misma mientras no cambien los datos. */
  function nuevoIdem() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    const bytes = new Uint8Array(16);
    if (window.crypto && crypto.getRandomValues) crypto.getRandomValues(bytes);
    return [...bytes].map((b) => (b || Math.floor(Math.random() * 256)).toString(16).padStart(2, '0')).join('');
  }

  /** Texto en una región role="status" (vacía la región si no hay texto). Acepta nodos además de texto. */
  function avisar(region, ...partes) {
    if (!region) return;
    if (!partes.length || (partes.length === 1 && !partes[0])) return region.replaceChildren();
    const span = document.createElement('span');
    span.append(...partes);
    region.replaceChildren(span);
  }

  /** Muestra un paso de la card con una entrada corta (sin movimiento con "reducir movimiento"). */
  function mostrar(el) {
    el.hidden = false;
    if (!motion) return;
    el.classList.remove('is-entering');
    void el.offsetWidth;
    el.classList.add('is-entering');
  }

  async function pedir(url, opciones, timeout) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      const res = await fetch(url, {
        ...opciones,
        headers: { Accept: 'application/json', 'X-Requested-With': 'fetch' },
        credentials: 'same-origin',
        signal: controller.signal,
      });
      const datos = await res.json().catch(() => null);
      return { status: res.status, datos };
    } catch (e) {
      return { status: 0, datos: null };
    } finally {
      clearTimeout(timer);
    }
  }

  const titulo = document.getElementById('agenda-titulo');
  const contacto = document.getElementById('contact-form');
  const gracias = document.getElementById('contact-success');

  /* ---------- CTA "Agendá reunión" ---------- */
  // El enlace (#agenda) baja a la sección; acá el foco pasa a la card para que con teclado o lector de pantalla se
  // siga desde la agenda y no desde el principio de la sección. Además adelanta el pedido de horarios.
  // En pantallas angostas la card va debajo del texto de la sección: al principio de #agenda solo asomaría su
  // borde. Si al bajar a la sección la mitad de la card (o la card entera, si es más baja) no entra en pantalla,
  // se baja directo a la card (scroll-margin-top en el CSS deja lugar para la barra fija). En escritorio, con la
  // card al lado del texto, queda el salto normal del ancla.
  let cargarAgenda = () => {};
  const seccion = document.getElementById('agenda');
  document.addEventListener('click', (e) => {
    const link = e.target instanceof Element ? e.target.closest('a[data-cta][href="#agenda"]') : null;
    if (!link) return;
    cargarAgenda();
    if (seccion) {
      const margen = parseFloat(getComputedStyle(seccion).scrollMarginTop) || 0;
      const r = panel.getBoundingClientRect();
      const arriba = margen + (r.top - seccion.getBoundingClientRect().top); // top de la card tras el salto normal
      if (arriba + Math.min(r.height, innerHeight / 2) > innerHeight) {
        e.preventDefault();
        // A mano y no con scrollIntoView: la card puede estar todavía corrida por su entrada (.rv, translateY) y
        // quedaría desplazada lo que mide ese corrimiento. margen de la card: scroll-margin-top en el CSS.
        const corrimiento = new DOMMatrixReadOnly(getComputedStyle(panel).transform).m42;
        const margenCard = parseFloat(getComputedStyle(panel).scrollMarginTop) || 0;
        scrollTo({ top: scrollY + r.top - corrimiento - margenCard, behavior: motion ? 'smooth' : 'auto' });
        if (location.hash !== '#agenda') history.pushState(null, '', '#agenda');
      }
    }
    if (titulo) setTimeout(() => titulo.focus({ preventScroll: true }), 0);
  });

  /* ---------- Formulario de consulta (respaldo y versión sin JS) ---------- */
  if (contacto) {
    contacto.noValidate = true;
    completarOrigen(contacto);
    const estado = contacto.querySelector('[role="status"]');
    const enviar = contacto.querySelector('[type="submit"]');
    const etiqueta = enviar.querySelector('[data-label]');
    const textoBoton = etiqueta.textContent;
    const campos = [...contacto.querySelectorAll('input:not([type="hidden"]):not([name="website"]), select, textarea')];
    const idem = contacto.elements.namedItem('idem');
    const renovarIdem = () => { idem.value = nuevoIdem(); };
    renovarIdem();
    let enviando = false;
    let intentado = false;

    const exito = () => {
      contacto.hidden = true;
      mostrar(gracias);
      gracias.focus();
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'cf7_enviado', cf7_form_id: `contacto-${location.pathname}` });
    };

    // Volvió del POST sin JS (api/contact.php redirige con ?enviado=1#agenda).
    const params = new URLSearchParams(location.search);
    if (params.get('enviado') === '1') {
      exito();
      params.delete('enviado');
      const query = params.toString();
      history.replaceState(history.state, '', `${location.pathname}${query ? `?${query}` : ''}${location.hash}`);
    }

    const revalidar = (e) => {
      renovarIdem(); // datos nuevos, envío nuevo
      if (intentado && campos.includes(e.target)) marcarError(e.target, validar(e.target));
    };
    contacto.addEventListener('input', revalidar);
    contacto.addEventListener('change', revalidar);

    contacto.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (enviando) return;
      intentado = true;
      avisar(estado);
      const primero = validarTodo(campos);
      if (primero) return primero.focus();

      enviando = true;
      contacto.setAttribute('aria-busy', 'true');
      enviar.setAttribute('aria-disabled', 'true');
      etiqueta.textContent = 'Enviando…';
      const { status, datos } = await pedir(contacto.action, { method: 'POST', body: new FormData(contacto) }, TIMEOUT_CONSULTA_MS);
      enviando = false;
      contacto.removeAttribute('aria-busy');
      enviar.removeAttribute('aria-disabled');
      etiqueta.textContent = textoBoton;

      if (status >= 200 && status < 300 && datos && datos.ok) {
        contacto.reset();
        renovarIdem();
        return exito();
      }
      const mail = document.createElement('a');
      mail.href = 'mailto:info@intellihelp.tech';
      mail.textContent = 'info@intellihelp.tech';
      avisar(estado, (datos && datos.error) || 'No pudimos enviar tus datos. Probá de nuevo en unos minutos.', ' También podés escribirnos a ', mail, '.');
    });
  }

  /* ---------- Agenda del CRM ---------- */
  const tpl = panel.querySelector('template[data-agenda-crm]');
  // Volvió de un envío sin JS: queda el mensaje de gracias, sin agenda.
  if (!tpl || !contacto || (gracias && !gracias.hidden)) return;

  /** Partes de una fecha AAAA-MM-DD (sin zona horaria de por medio). */
  const partes = (fecha) => {
    const [a, m, d] = fecha.split('-').map(Number);
    return { a, m, d, dia: new Date(Date.UTC(a, m - 1, d)).getUTCDay() };
  };
  const fechaLarga = (fecha) => {
    const { m, d, dia } = partes(fecha);
    return `${DIAS[dia]} ${d} de ${MESES[m - 1]}`;
  };
  /** Hoy en Argentina (UTC-3, sin horario de verano), AAAA-MM-DD. */
  const hoyArgentina = (sumarDias = 0) => new Date(Date.now() - 3 * 3600e3 + sumarDias * 864e5).toISOString().slice(0, 10);
  const rango = (dias) => {
    if (!dias.length) return '';
    const a = partes(dias[0].fecha);
    const b = partes(dias[dias.length - 1].fecha);
    if (dias.length === 1) return `${a.d} de ${MESES[a.m - 1]}`;
    return a.m === b.m ? `${a.d} al ${b.d} de ${MESES[b.m - 1]}` : `${a.d} de ${MESES[a.m - 1]} al ${b.d} de ${MESES[b.m - 1]}`;
  };

  /** Flechas, Inicio y Fin dentro de un grupo de botones (tabindex móvil). */
  function navegable(grupo, alElegir) {
    grupo.addEventListener('keydown', (e) => {
      const botones = [...grupo.querySelectorAll('button:not([disabled])')];
      const i = botones.indexOf(document.activeElement);
      if (i < 0) return;
      const destino = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: botones.length - 1 }[e.key];
      if (destino === undefined) return;
      e.preventDefault();
      const boton = botones[Math.max(0, Math.min(botones.length - 1, destino))];
      botones.forEach((b) => { b.tabIndex = b === boton ? 0 : -1; });
      boton.focus();
    });
    grupo.addEventListener('click', (e) => {
      const boton = e.target instanceof Element ? e.target.closest('button') : null;
      if (boton && grupo.contains(boton)) alElegir(boton);
    });
  }

  // 1. La agenda va delante; el formulario de consulta queda oculto como respaldo.
  const caja = tpl.content.firstElementChild.cloneNode(true);
  tpl.after(caja);
  contacto.hidden = true;
  panel.classList.add('agenda-panel--crm');

  const $ = (sel) => caja.querySelector(sel);
  const pasoHorario = $('[data-paso="horario"]');
  const pasoTitulo = $('#ag-titulo');
  const diasEl = $('[data-dias]');
  const horasEl = $('[data-horas]');
  const diaTitulo = $('[data-dia]');
  const rangoEl = $('[data-rango]');
  const anterior = $('[data-anterior]');
  const siguiente = $('[data-siguiente]');
  const avisoHorario = $('[data-aviso]');
  const form = $('[data-agenda-form]');
  const elegidoEl = $('[data-elegido]');
  const elegidoTitulo = $('#ag-elegido');
  const estado = $('[data-estado-envio]');
  const ok = $('[data-ok]');
  const submit = form.querySelector('[type="submit"]');
  const etiqueta = submit.querySelector('[data-label]');
  const textoBoton = etiqueta.textContent;
  const campos = [...form.querySelectorAll('input:not([type="hidden"]):not([name="website"]), select, textarea')];

  const tipoPedido = (panel.dataset.tipo || '').trim();
  const vendedorPedido = (panel.dataset.vendedor || '').trim();
  completarOrigen(form, { origen: location.pathname });

  let dias = [];
  let pagina = 0;
  let diaElegido = null;
  let horario = null; // { ts, hora, fecha }
  let medidoHorario = false;
  let intentado = false;
  let enviando = false;
  let firma = '';
  let formToken = ''; // llega con cada carga de horarios
  let cargaInicial = null;

  /** Saca la agenda y deja el formulario de consulta (con los datos cargados, si los hay). */
  function alFormulario(aviso = '', datos = null) {
    if (datos) {
      ['nombre', 'apellido', 'empresa', 'cargo', 'mail', 'telefono', 'necesidad', 'mensaje'].forEach((name) => {
        const destino = contacto.elements.namedItem(name);
        if (destino && 'value' in destino) destino.value = datos.get(name) || '';
      });
      const acepto = contacto.elements.namedItem('acepto');
      if (acepto) acepto.checked = datos.get('acepto') === '1';
      contacto.elements.namedItem('idem').value = nuevoIdem();
    }
    caja.remove();
    panel.classList.remove('agenda-panel--crm');
    mostrar(contacto);
    if (aviso) {
      // El aviso va arriba del formulario, a la vista, y recibe el foco para que lo lea el lector de pantalla.
      const nota = document.createElement('p');
      nota.className = 'agenda-status agenda-status--nota';
      nota.tabIndex = -1;
      nota.textContent = aviso;
      contacto.prepend(nota);
      nota.focus();
    }
  }

  // 3. Días y horarios --------------------------------------------------------------------------------------------
  function pintarDias() {
    const desde = pagina * DIAS_POR_PAGINA;
    const visibles = dias.slice(desde, desde + DIAS_POR_PAGINA);
    rangoEl.textContent = rango(visibles);
    anterior.disabled = pagina === 0;
    siguiente.disabled = desde + DIAS_POR_PAGINA >= dias.length;
    const elegidoVisible = visibles.some((d) => d.fecha === diaElegido);
    diasEl.replaceChildren(...visibles.map((dia, i) => {
      const { m, d, dia: semana } = partes(dia.fecha);
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'agenda-crm__dia';
      b.dataset.fecha = dia.fecha;
      const elegido = dia.fecha === diaElegido;
      b.setAttribute('aria-pressed', String(elegido));
      b.tabIndex = elegido || (!elegidoVisible && i === 0) ? 0 : -1;
      b.setAttribute('aria-label', `${fechaLarga(dia.fecha)}, ${dia.horarios.length} ${dia.horarios.length === 1 ? 'horario' : 'horarios'}`);
      ['semana', 'num', 'mes'].forEach((parte, k) => {
        const span = document.createElement('span');
        span.className = `agenda-crm__dia-${parte}`;
        span.textContent = [DIAS_CORTOS[semana], String(d), MESES_CORTOS[m - 1]][k];
        b.append(span);
      });
      return b;
    }));
  }

  function pintarHoras() {
    const dia = dias.find((d) => d.fecha === diaElegido);
    if (!dia) {
      diaTitulo.textContent = 'Horarios disponibles';
      horasEl.replaceChildren();
      return;
    }
    diaTitulo.textContent = `Horarios del ${fechaLarga(dia.fecha)}`;
    const elegidoEnDia = dia.horarios.some((h) => horario && h.ts === horario.ts);
    horasEl.replaceChildren(...dia.horarios.map((h, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'agenda-crm__hora';
      b.dataset.ts = String(h.ts);
      b.textContent = h.hora;
      b.setAttribute('aria-label', `${h.hora} h`);
      const elegido = Boolean(horario) && h.ts === horario.ts;
      b.setAttribute('aria-pressed', String(elegido));
      b.tabIndex = elegido || (!elegidoEnDia && i === 0) ? 0 : -1;
      return b;
    }));
  }

  function elegirDia(fecha, enfocar = false) {
    diaElegido = fecha;
    const i = dias.findIndex((d) => d.fecha === fecha);
    if (i >= 0) pagina = Math.floor(i / DIAS_POR_PAGINA);
    pintarDias();
    pintarHoras();
    if (enfocar) {
      const boton = diasEl.querySelector(`[data-fecha="${fecha}"]`);
      if (boton) boton.focus();
    }
  }

  function aPasoHorario(enfocarHorario = true) {
    form.hidden = true;
    mostrar(pasoHorario);
    if (enfocarHorario && horario) {
      elegirDia(horario.fecha);
      const boton = horasEl.querySelector(`[data-ts="${horario.ts}"]`);
      if (boton) boton.focus();
    }
  }

  function elegirHorario(boton) {
    const ts = Number(boton.dataset.ts);
    const dia = dias.find((d) => d.fecha === diaElegido);
    const h = dia && dia.horarios.find((x) => x.ts === ts);
    if (!h) return;
    horario = { ts, hora: h.hora, fecha: dia.fecha };
    form.elements.namedItem('inicio').value = String(ts);
    elegidoEl.textContent = `${fechaLarga(dia.fecha)} a las ${h.hora} h`;
    avisar(avisoHorario);
    avisar(estado);
    pintarHoras();
    if (!medidoHorario) {
      medidoHorario = true;
      track('click_calendar', { click_target: 'horario', calendar_type: 'crm', link_location: 'agenda' });
    }
    pasoHorario.hidden = true;
    mostrar(form);
    elegidoTitulo.focus();
  }

  navegable(diasEl, (b) => elegirDia(b.dataset.fecha, true));
  navegable(horasEl, elegirHorario);
  // Para vistas propias de una página (el calendario mensual de /diagnostico-sin-cargo/): elegir un día desde
  // afuera. La home no lo usa.
  panel.addEventListener('agenda:elegir-dia', (e) => {
    const fecha = e.detail && e.detail.fecha;
    if (dias.some((d) => d.fecha === fecha)) elegirDia(fecha);
  });
  anterior.addEventListener('click', () => {
    pagina = Math.max(0, pagina - 1);
    pintarDias();
    (diasEl.querySelector('[tabindex="0"]') || anterior).focus();
  });
  siguiente.addEventListener('click', () => {
    pagina += 1;
    pintarDias();
    (diasEl.querySelector('[tabindex="0"]') || siguiente).focus();
  });
  $('[data-cambiar]').addEventListener('click', () => aPasoHorario(true));

  // 2. Horarios -------------------------------------------------------------------------------------------------
  async function cargar() {
    caja.dataset.estado = 'cargando';
    const query = new URLSearchParams({ tipo: tipoPedido, vendedor: vendedorPedido, desde: hoyArgentina(), hasta: hoyArgentina(RANGO_DIAS) });
    const { status, datos } = await pedir(`${API_AGENDA}?${query}`, { method: 'GET' }, TIMEOUT_HORARIOS_MS);
    const lista = status === 200 && datos && datos.ok && Array.isArray(datos.dias) ? datos.dias.filter((d) => d.horarios && d.horarios.length) : [];
    if (!lista.length) return false;

    dias = lista;
    const feriados = Array.isArray(datos.feriados) ? datos.feriados.filter((f) => f && typeof f.fecha === 'string' && typeof f.nombre === 'string') : [];
    formToken = typeof datos.form_token === 'string' ? datos.form_token : '';
    // El par tipo/vendedor que resolvió el servidor (el pedido o el primero de su configuración).
    form.elements.namedItem('tipo').value = datos.tipo || tipoPedido;
    form.elements.namedItem('vendedor').value = datos.vendedor || vendedorPedido;
    $('[data-duracion]').textContent = String(datos.duracion_min || 30);
    caja.dataset.estado = 'listo';
    // El día que estaba elegido, si sigue con horarios; si no, el primero.
    const sigue = dias.some((d) => d.fecha === diaElegido);
    if (horario && !dias.some((d) => d.horarios.some((h) => h.ts === horario.ts))) horario = null;
    elegirDia(sigue ? diaElegido : dias[0].fecha);
    // Aviso con todos los días que tienen horarios (la tira solo muestra cinco); lo usa el calendario mensual de
    // /diagnostico-sin-cargo/. La home no lo escucha.
    panel.dispatchEvent(new CustomEvent('agenda:horarios', {
      detail: { dias: dias.map((d) => ({ fecha: d.fecha, horarios: d.horarios.length })), elegido: diaElegido, feriados },
    }));
    return true;
  }

  // Primera carga: cuando #agenda se acerca a la pantalla o al tocar un CTA, no al abrir la página.
  cargarAgenda = () => {
    if (cargaInicial) return;
    cargaInicial = cargar().then((hay) => {
      if (!hay) alFormulario();
    });
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      cargarAgenda();
    }, { rootMargin: '0px 0px 800px 0px' });
    io.observe(panel);
  } else {
    cargarAgenda();
  }

  // 5. Reserva --------------------------------------------------------------------------------------------------
  const setEnviando = (on) => {
    enviando = on;
    form.setAttribute('aria-busy', String(on));
    if (on) submit.setAttribute('aria-disabled', 'true');
    else submit.removeAttribute('aria-disabled');
    etiqueta.textContent = on ? 'Confirmando…' : textoBoton;
  };

  const revalidar = (e) => {
    if (intentado && campos.includes(e.target)) marcarError(e.target, validar(e.target));
  };
  form.addEventListener('input', revalidar);
  form.addEventListener('change', revalidar);

  /** Misma clave mientras no cambien los datos ni el horario: un reintento no duplica la reunión en el CRM. */
  function claveDelEnvio(datos) {
    const actual = JSON.stringify([...datos.entries()].filter(([k]) => k !== 'idem' && k !== 'form_token'));
    const idem = form.elements.namedItem('idem');
    if (actual !== firma || !idem.value) {
      firma = actual;
      idem.value = nuevoIdem();
    }
    datos.set('idem', idem.value);
  }

  async function enviar(datos, reintentos = 2) {
    const { status, datos: r } = await pedir(API_AGENDA, { method: 'POST', body: datos }, TIMEOUT_RESERVA_MS);
    if (status === 409 && r && r.error === 'en_proceso' && reintentos > 0) {
      await esperar(2500);
      return enviar(datos, reintentos - 1);
    }
    if (status === 409 && r && r.error === 'reintentar' && reintentos > 0) {
      firma = '';
      claveDelEnvio(datos);
      return enviar(datos, 0);
    }
    return { status, r };
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (enviando || !horario) return;
    intentado = true;
    avisar(estado);
    const primero = validarTodo(campos);
    if (primero) return primero.focus();

    const datos = new FormData(form);
    claveDelEnvio(datos);
    datos.set('form_token', formToken);
    setEnviando(true);
    const { status, r } = await enviar(datos);
    setEnviando(false);

    // 201: reunión confirmada en el CRM (y en Google Calendar del vendedor, con Meet).
    if (status === 201 && r && r.ok) {
      $('[data-ok-cuando]').textContent = r.cuando || `${fechaLarga(horario.fecha)} a las ${horario.hora} h`;
      form.hidden = true;
      pasoHorario.hidden = true;
      mostrar(ok);
      ok.focus();
      track('schedule_meeting', { calendar_type: 'crm', servicio: String(datos.get('necesidad') || '') });
      return;
    }

    // 202: el servidor no supo si quedó. Si quedó, llega el mail; ni otro intento ni el formulario (duplicarían).
    if (status === 202 && r && r.error === 'confirmando') {
      submit.disabled = true;
      return avisar(estado, r.mensaje || 'Estamos confirmando tu reunión. Revisá tu correo en unos minutos.');
    }

    if (status === 409 && r && (r.error === 'recargar_horarios' || r.error === 'horario_tomado')) {
      const hay = await cargar();
      if (!hay) return alFormulario('Ya no quedan horarios disponibles en las próximas semanas. Envianos la consulta y coordinamos la reunión por mail.', datos);
      const sigue = r.error === 'recargar_horarios' && horario && dias.some((d) => d.horarios.some((h) => h.ts === horario.ts));
      if (sigue) return avisar(estado, r.mensaje || 'Confirmá de nuevo, por favor.');
      aPasoHorario(false);
      avisar(avisoHorario, r.error === 'horario_tomado' ? 'Ese horario acaba de reservarse. Elegí otro, por favor.' : (r.mensaje || 'Los horarios se actualizaron. Elegí el horario de nuevo, por favor.'));
      return pasoTitulo.focus();
    }

    // 429 limite: tope de reservas del CRM (por correo o del día). Queda el formulario con los datos.
    if (status === 429 && r && r.error === 'limite') {
      return alFormulario(`${r.mensaje || 'En este momento no podemos tomar más reservas desde la agenda.'} Completamos el formulario con tus datos para que nos envíes la consulta.`, datos);
    }

    if (status === 422 && r && r.campos && typeof r.campos === 'object') {
      let foco = null;
      Object.entries(r.campos).forEach(([name, msg]) => {
        const campo = form.elements.namedItem(name);
        if (campo instanceof Element && campos.includes(campo)) {
          marcarError(campo, String(msg));
          foco = foco || campo;
        }
      });
      if (foco) return foco.focus();
      if (r.campos.inicio) {
        aPasoHorario(false);
        avisar(avisoHorario, r.mensaje || 'Elegí un día y un horario de la lista.');
        return pasoTitulo.focus();
      }
    }
    if (status === 422 || status === 429) return avisar(estado, (r && r.mensaje) || 'Revisá los datos y probá de nuevo.');

    // 503, error de red o demora: el horario no se puede confirmar. Queda el formulario de consulta con lo que ya
    // escribió y el horario que eligió en el mensaje.
    const mensaje = String(datos.get('mensaje') || '').trim();
    datos.set('mensaje', `${mensaje ? `${mensaje}\n\n` : ''}Horario que había elegido: ${fechaLarga(horario.fecha)} a las ${horario.hora} h.`.slice(0, 3000));
    alFormulario('No pudimos confirmar la reunión en este momento. Cargamos tus datos en este formulario: envialo y te escribimos para coordinar el horario.', datos);
  });
})();
