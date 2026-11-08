// Agenda del CRM en la landing /diagnostico/ (embudo, etapa 03). La llama
// src/scripts/diagnostico.js cuando site.diagnostico.calendario es "crm".
// Marcado: src/partials/pagina/diagnostico/agenda-crm.html. Servidor:
// public/api/agenda.php (en desarrollo lo simula plugins/vite-plugin-contact-mock.js).
//
// Recorrido:
//  1. Pone el template en el panel blanco de #agenda, delante del formulario de
//     siempre (#contact-form), que queda oculto como respaldo.
//  2. Pide los horarios (GET /api/agenda.php). Si fallan o no hay ninguno,
//     saca la agenda y deja el formulario: la consulta sale como siempre.
//  3. Días en páginas de 5 y horarios del día elegido, como botones con
//     aria-pressed. Flechas, Inicio y Fin mueven el foco dentro de cada grupo
//     (un solo botón del grupo en el orden de tabulación).
//  4. Al elegir horario: click_calendar (una vez por página) y paso de datos,
//     con el foco en el resumen del horario elegido.
//  5. Confirmar: POST /api/agenda.php con la clave del envío (idem) y el token
//     que vino con los horarios (form_token). La clave se mantiene mientras no
//     cambien los datos: un reintento no duplica la reunión en el CRM.
//     201 → confirmación en pantalla y schedule_meeting.
//     202 confirmando → el servidor no supo si quedó: aviso de revisar el
//     correo, sin formulario (sería una consulta duplicada).
//     409 horario_tomado → vuelve a los horarios (actualizados) con el aviso.
//     409 recargar_horarios → token vencido o usado: horarios nuevos y aviso.
//     409 en_proceso → espera y reintenta con la misma clave.
//     422 → errores en los campos. 429 → aviso. 429 limite → formulario de
//     siempre con el mensaje del CRM.
//     503, error de red o demora → formulario de siempre con los datos
//     cargados y el horario elegido en el mensaje.
import { track, origenVisita, visitasLanding } from './analytics.js';
import { validate, setError, nuevoIdem } from './contact-form.js';
import { initSelect } from './select.js';
import { initWaTexto } from './wa-texto.js';

const API = '/api/agenda.php';
const DIAS_POR_PAGINA = 5;
const RANGO_DIAS = 20; // la ventana del tipo de reunión es de 21 días
const TIMEOUT_HORARIOS_MS = 12000;
const TIMEOUT_RESERVA_MS = 25000;

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const DIAS_CORTOS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

/** Partes de una fecha AAAA-MM-DD (sin zona horaria de por medio). */
function partes(fecha) {
  const [a, m, d] = fecha.split('-').map(Number);
  return { a, m, d, dia: new Date(Date.UTC(a, m - 1, d)).getUTCDay() };
}

const fechaLarga = (fecha) => {
  const { m, d, dia } = partes(fecha);
  return `${DIAS[dia]} ${d} de ${MESES[m - 1]}`;
};

/** Hoy en Argentina, AAAA-MM-DD. */
function hoyArgentina(sumarDias = 0) {
  const ahora = new Date(Date.now() - 3 * 3600e3 + sumarDias * 864e5);
  return ahora.toISOString().slice(0, 10);
}

function rango(dias) {
  if (!dias.length) return '';
  const a = partes(dias[0].fecha);
  const b = partes(dias.at(-1).fecha);
  if (dias.length === 1) return `${a.d} de ${MESES[a.m - 1]}`;
  return a.m === b.m ? `${a.d} al ${b.d} de ${MESES[b.m - 1]}` : `${a.d} de ${MESES[a.m - 1]} al ${b.d} de ${MESES[b.m - 1]}`;
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
  } catch {
    return { status: 0, datos: null };
  } finally {
    clearTimeout(timer);
  }
}

/** Flechas, Inicio y Fin dentro de un grupo de botones (tabindex móvil). */
function navegable(grupo, alElegir) {
  grupo.addEventListener('keydown', (e) => {
    const botones = [...grupo.querySelectorAll('button:not([disabled])')];
    const i = botones.indexOf(document.activeElement);
    if (i < 0) return;
    const destino = {
      ArrowRight: i + 1,
      ArrowDown: i + 1,
      ArrowLeft: i - 1,
      ArrowUp: i - 1,
      Home: 0,
      End: botones.length - 1,
    }[e.key];
    if (destino === undefined) return;
    e.preventDefault();
    const boton = botones[Math.max(0, Math.min(botones.length - 1, destino))];
    botones.forEach((b) => (b.tabIndex = b === boton ? 0 : -1));
    boton.focus();
  });
  grupo.addEventListener('click', (e) => {
    const boton = e.target instanceof Element ? e.target.closest('button') : null;
    if (boton && grupo.contains(boton)) alElegir(boton);
  });
}

export function initAgendaCrm(main) {
  const panel = document.querySelector('#agenda .agenda__panel');
  const tpl = document.querySelector('template[data-diagnostico-crm]');
  const contacto = document.getElementById('contact-form');
  const gracias = document.getElementById('contact-success');
  if (!panel || !tpl || !contacto) return;
  // Volvió de un envío sin JS (?enviado=1): queda el mensaje de gracias.
  if (gracias && !gracias.hidden) return;

  const tipo = (main.dataset.tipo ?? '').trim();
  const vendedor = (main.dataset.vendedor ?? '').trim();

  // 1. La agenda va delante; lo de siempre queda oculto como respaldo.
  const originales = [...panel.children].map((el) => [el, el.hidden]);
  const caja = tpl.content.firstElementChild.cloneNode(true);
  panel.prepend(caja);
  originales.forEach(([el]) => (el.hidden = true));
  panel.classList.add('diagnostico-agenda__panel');
  main.dataset.agenda = 'calendario';

  const $ = (sel) => caja.querySelector(sel);
  const pasoHorario = $('[data-crm-paso="horario"]');
  const titulo = $('#dc-titulo');
  const diasEl = $('[data-crm-dias]');
  const horasEl = $('[data-crm-horas]');
  const diaTitulo = $('[data-crm-dia]');
  const rangoEl = $('[data-crm-rango]');
  const anterior = $('[data-crm-anterior]');
  const siguiente = $('[data-crm-siguiente]');
  const avisoHorario = $('[data-crm-aviso]');
  const form = $('[data-crm-form]');
  const elegidoEl = $('[data-crm-elegido]');
  const elegidoTitulo = $('#dc-elegido');
  const estado = $('[data-crm-estado]');
  const ok = $('[data-crm-ok]');
  const submit = form.querySelector('[type="submit"]');
  const label = submit.querySelector('.agenda__submit-label');
  const textoBoton = label.textContent;
  const campos = [...form.querySelectorAll('input:not([type="hidden"]):not([name="website"]), select, textarea')];

  // Ocultos: tipo, vendedor, página y canal de origen de la primera visita.
  const ocultos = { tipo, vendedor, origen: location.pathname, ...origenVisita(), visitas_landing: visitasLanding() };
  for (const [name, value] of Object.entries(ocultos)) {
    const input = form.elements.namedItem(name);
    if (input instanceof HTMLInputElement && input.type === 'hidden' && value) input.value = String(value);
  }

  initSelect(caja);
  initWaTexto();

  let dias = [];
  let pagina = 0;
  let diaElegido = null;
  let horario = null; // { ts, hora, fecha }
  let medidoHorario = false;
  let intentado = false;
  let enviando = false;
  let firma = '';
  let formToken = ''; // llega con cada carga de horarios

  /** Saca la agenda y deja el formulario de siempre. */
  function alFormulario(aviso = '', datos = null) {
    if (datos) {
      for (const name of ['nombre', 'empresa', 'mail', 'telefono', 'necesidad', 'mensaje']) {
        const destino = contacto.elements.namedItem(name);
        if (destino && 'value' in destino) destino.value = datos.get(name) ?? '';
      }
      contacto.elements.namedItem('necesidad')?.dispatchEvent(new Event('change'));
      const acepto = contacto.elements.namedItem('acepto');
      if (acepto instanceof HTMLInputElement) acepto.checked = datos.get('acepto') === '1';
    }
    caja.remove();
    originales.forEach(([el, oculto]) => (el.hidden = oculto));
    panel.classList.remove('diagnostico-agenda__panel');
    main.dataset.agenda = 'formulario';
    if (aviso) {
      // El aviso va arriba, a la vista: el status junto al botón puede quedar
      // fuera de pantalla y no se entendería por qué falta la agenda. Va
      // adentro del formulario para que se oculte con él cuando la consulta
      // sale bien, y recibe el foco para que lo lea el lector de pantalla.
      const nota = document.createElement('div');
      nota.className = 'agenda__status diagnostico-crm__aviso-form';
      nota.tabIndex = -1;
      const texto = document.createElement('span');
      texto.textContent = aviso;
      nota.append(texto);
      const requeridos = contacto.querySelector('.agenda__required-note');
      if (requeridos) requeridos.before(nota);
      else contacto.prepend(nota);
      nota.focus();
    }
    document.dispatchEvent(new CustomEvent('ith:diagnostico-calendario', { detail: { proveedor: 'formulario' } }));
  }

  function aviso(el, texto) {
    if (!texto) return el.replaceChildren();
    const span = document.createElement('span');
    span.textContent = texto;
    el.replaceChildren(span);
  }

  // 3. Días y horarios -------------------------------------------------------

  function pintarDias() {
    const desde = pagina * DIAS_POR_PAGINA;
    const visibles = dias.slice(desde, desde + DIAS_POR_PAGINA);
    rangoEl.textContent = rango(visibles);
    anterior.disabled = pagina === 0;
    siguiente.disabled = desde + DIAS_POR_PAGINA >= dias.length;

    const elegidoVisible = visibles.some((d) => d.fecha === diaElegido);
    diasEl.replaceChildren(
      ...visibles.map((dia, i) => {
        const { m, d, dia: semana } = partes(dia.fecha);
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'diagnostico-crm__dia';
        b.dataset.fecha = dia.fecha;
        const elegido = dia.fecha === diaElegido;
        b.setAttribute('aria-pressed', String(elegido));
        b.tabIndex = elegido || (!elegidoVisible && i === 0) ? 0 : -1;
        b.setAttribute('aria-label', `${fechaLarga(dia.fecha)}, ${dia.horarios.length} ${dia.horarios.length === 1 ? 'horario' : 'horarios'}`);
        b.innerHTML = '<span class="diagnostico-crm__dia-semana"></span><span class="diagnostico-crm__dia-num"></span><span class="diagnostico-crm__dia-mes"></span>';
        b.children[0].textContent = DIAS_CORTOS[semana];
        b.children[1].textContent = String(d);
        b.children[2].textContent = MESES_CORTOS[m - 1];
        return b;
      }),
    );
  }

  function pintarHoras() {
    const dia = dias.find((d) => d.fecha === diaElegido);
    if (!dia) {
      diaTitulo.textContent = 'Horarios disponibles';
      horasEl.replaceChildren();
      return;
    }
    diaTitulo.textContent = `Horarios del ${fechaLarga(dia.fecha)}`;
    const elegidoEnDia = dia.horarios.some((h) => h.ts === horario?.ts);
    horasEl.replaceChildren(
      ...dia.horarios.map((h, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'diagnostico-crm__hora';
        b.dataset.ts = String(h.ts);
        b.textContent = h.hora;
        b.setAttribute('aria-label', `${h.hora} h`);
        const elegido = h.ts === horario?.ts;
        b.setAttribute('aria-pressed', String(elegido));
        b.tabIndex = elegido || (!elegidoEnDia && i === 0) ? 0 : -1;
        return b;
      }),
    );
  }

  function elegirDia(fecha, enfocar = false) {
    diaElegido = fecha;
    const i = dias.findIndex((d) => d.fecha === fecha);
    if (i >= 0) pagina = Math.floor(i / DIAS_POR_PAGINA);
    pintarDias();
    pintarHoras();
    if (enfocar) diasEl.querySelector(`[data-fecha="${fecha}"]`)?.focus();
  }

  function aPasoHorario(enfocarHorario = true) {
    form.hidden = true;
    pasoHorario.hidden = false;
    if (enfocarHorario && horario) {
      elegirDia(horario.fecha);
      horasEl.querySelector(`[data-ts="${horario.ts}"]`)?.focus();
    }
  }

  function elegirHorario(boton) {
    const ts = Number(boton.dataset.ts);
    const dia = dias.find((d) => d.fecha === diaElegido);
    const h = dia?.horarios.find((x) => x.ts === ts);
    if (!h) return;
    horario = { ts, hora: h.hora, fecha: dia.fecha };
    form.elements.namedItem('inicio').value = String(ts);
    elegidoEl.textContent = `${fechaLarga(dia.fecha)} a las ${h.hora} h`;
    aviso(avisoHorario, '');
    aviso(estado, '');
    pintarHoras();
    if (!medidoHorario) {
      medidoHorario = true;
      track('click_calendar', { click_target: 'horario', calendar_type: 'crm', link_location: 'agenda' });
    }
    pasoHorario.hidden = true;
    form.hidden = false;
    elegidoTitulo.focus();
  }

  navegable(diasEl, (b) => elegirDia(b.dataset.fecha, true));
  navegable(horasEl, elegirHorario);
  anterior.addEventListener('click', () => {
    pagina = Math.max(0, pagina - 1);
    pintarDias();
    diasEl.querySelector('[tabindex="0"]')?.focus();
  });
  siguiente.addEventListener('click', () => {
    pagina += 1;
    pintarDias();
    diasEl.querySelector('[tabindex="0"]')?.focus();
  });
  $('[data-crm-cambiar]').addEventListener('click', () => aPasoHorario(true));

  // 2. Horarios ----------------------------------------------------------------

  async function cargar() {
    caja.dataset.estado = 'cargando';
    const query = new URLSearchParams({ tipo, vendedor, desde: hoyArgentina(), hasta: hoyArgentina(RANGO_DIAS) });
    const { status, datos } = await pedir(`${API}?${query}`, { method: 'GET' }, TIMEOUT_HORARIOS_MS);
    const lista = status === 200 && datos?.ok && Array.isArray(datos.dias) ? datos.dias.filter((d) => d.horarios?.length) : [];
    if (!lista.length) return false;

    dias = lista;
    formToken = typeof datos.form_token === 'string' ? datos.form_token : '';
    $('[data-crm-duracion]').textContent = String(datos.duracion_min || 30);
    caja.dataset.estado = 'listo';
    // El día que estaba elegido, si sigue con horarios; si no, el primero.
    const sigue = dias.some((d) => d.fecha === diaElegido);
    if (horario && !dias.some((d) => d.horarios.some((h) => h.ts === horario.ts))) horario = null;
    elegirDia(sigue ? diaElegido : dias[0].fecha);
    return true;
  }

  // 5. Reserva -----------------------------------------------------------------

  const setEnviando = (on) => {
    enviando = on;
    form.setAttribute('aria-busy', String(on));
    if (on) submit.setAttribute('aria-disabled', 'true');
    else submit.removeAttribute('aria-disabled');
    label.textContent = on ? 'Confirmando…' : textoBoton;
  };

  const revalidar = (e) => {
    if (intentado && campos.includes(e.target)) setError(e.target, validate(e.target));
  };
  form.addEventListener('input', revalidar);
  form.addEventListener('change', revalidar);

  /** Misma clave mientras no cambien los datos ni el horario. */
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
    const { status, datos: r } = await pedir(API, { method: 'POST', body: datos }, TIMEOUT_RESERVA_MS);
    if (status === 409 && r?.error === 'en_proceso' && reintentos > 0) {
      await esperar(2500);
      return enviar(datos, reintentos - 1);
    }
    if (status === 409 && r?.error === 'reintentar' && reintentos > 0) {
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
    aviso(estado, '');

    let primero = null;
    for (const campo of campos) {
      const msg = validate(campo);
      setError(campo, msg);
      if (msg && !primero) primero = campo;
    }
    if (primero) {
      const propio = primero.dataset.enhancedBy && document.getElementById(primero.dataset.enhancedBy);
      (propio || primero).focus();
      return;
    }

    const datos = new FormData(form);
    claveDelEnvio(datos);
    datos.set('form_token', formToken);
    setEnviando(true);
    const { status, r } = await enviar(datos);
    setEnviando(false);

    if (status === 201 && r?.ok) {
      const servicio = String(datos.get('necesidad') || '');
      $('[data-crm-ok-cuando]').textContent = r.cuando || `${fechaLarga(horario.fecha)} a las ${horario.hora} h`;
      form.hidden = true;
      pasoHorario.hidden = true;
      ok.hidden = false;
      ok.focus();
      track('schedule_meeting', { calendar_type: 'crm', landing_visit: Math.max(visitasLanding(), 1), servicio });
      document.dispatchEvent(new CustomEvent('ith:diagnostico-reunion', { detail: { inicio: r.inicio } }));
      return;
    }

    if (status === 202 && r?.error === 'confirmando') {
      // No se sabe si quedó: si quedó, llega el mail. Ni otro intento ni el
      // formulario, que terminarían en una reunión o una consulta de más.
      submit.setAttribute('aria-disabled', 'true');
      submit.disabled = true;
      return aviso(estado, r.mensaje || 'Estamos confirmando tu reunión. Revisá tu correo en unos minutos.');
    }

    if (status === 409 && r?.error === 'recargar_horarios') {
      const hayHorarios = await cargar();
      if (!hayHorarios) return alFormulario('Ya no quedan horarios disponibles en las próximas semanas. Envianos la consulta y coordinamos la reunión por mail.', datos);
      const sigue = horario && dias.some((d) => d.horarios.some((h) => h.ts === horario.ts));
      if (sigue) return aviso(estado, r.mensaje || 'Confirmá de nuevo, por favor.');
      aPasoHorario(false);
      aviso(avisoHorario, r.mensaje || 'Los horarios se actualizaron. Elegí el horario de nuevo, por favor.');
      titulo.focus();
      return;
    }

    if (status === 429 && r?.error === 'limite') {
      return alFormulario(`${r.mensaje || 'En este momento no podemos tomar más reservas por acá.'} Te dejamos el formulario con tus datos para que nos escribas.`, datos);
    }

    if (status === 409 && r?.error === 'horario_tomado') {
      const hayHorarios = await cargar();
      if (!hayHorarios) return alFormulario('Ya no quedan horarios disponibles en las próximas semanas. Envianos la consulta y coordinamos la reunión por mail.', datos);
      aPasoHorario(false);
      aviso(avisoHorario, 'Justo tomaron ese horario. Elegí otro, por favor.');
      titulo.focus();
      return;
    }

    if (status === 422 && r?.campos && typeof r.campos === 'object') {
      let foco = null;
      for (const [name, msg] of Object.entries(r.campos)) {
        const campo = form.elements.namedItem(name);
        if (campo instanceof Element && campos.includes(campo)) {
          setError(campo, String(msg));
          foco ||= campo;
        }
      }
      if (foco) {
        const propio = foco.dataset.enhancedBy && document.getElementById(foco.dataset.enhancedBy);
        return (propio || foco).focus();
      }
      if (r.campos.inicio) {
        aPasoHorario(false);
        aviso(avisoHorario, r.mensaje || 'Elegí un día y un horario de la lista.');
        return titulo.focus();
      }
    }

    if (status === 422 || status === 429) {
      return aviso(estado, r?.mensaje || 'Revisá los datos y probá de nuevo.');
    }

    // El CRM no respondió: el horario no se puede confirmar. Queda el formulario
    // de siempre con lo que ya escribió y el horario que eligió.
    const mensaje = String(datos.get('mensaje') || '').trim();
    datos.set('mensaje', `${mensaje ? `${mensaje}\n\n` : ''}Horario que había elegido: ${fechaLarga(horario.fecha)} a las ${horario.hora} h.`.slice(0, 3000));
    alFormulario('No pudimos confirmar la reunión en este momento. Cargamos tus datos en este formulario: envialo y te escribimos para coordinar el horario.', datos);
  });

  // 2. Primera carga: si no hay horarios, queda el formulario de siempre.
  cargar().then((hay) => {
    if (!hay) alFormulario();
  });
}
