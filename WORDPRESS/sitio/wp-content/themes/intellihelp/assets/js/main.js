/* Intellihelp Novedades — interacciones del blog (sin dependencias).
   Es el subconjunto de TEMPLATE-NICO/js/main.js que necesita el blog, con la misma lógica (el menú angosto y el
   header están copiados tal cual):
   origen de la visita · menú angosto · header que se compacta y se esconde · medición (cta_click e internal_nav) ·
   fondo vivo (brillos de las secciones claras) · globo de WhatsApp (con la medición click_whatsapp) ·
   revelado al scrollear (copiado tal cual del sitio principal: espera al telón de la animación de carga y se repite
   al volver desde el historial).
   Nada se mueve solo: el blog no tiene carruseles, cintas ni botones de pausa. */
(() => {
  'use strict';

  const root = document.documentElement;
  const motion = root.classList.contains('anim'); // ver script en <head>
  // URL del sitio principal (la pone el <head> con la opción del Personalizador): http://127.0.0.1:5174 en local.
  const principal = (root.dataset.principal || '').replace(/\/+$/, '');
  const push = (datos) => (window.dataLayer = window.dataLayer || []).push(datos);

  // Animación de carga (assets/js/carga.js, la misma del sitio principal): mientras está el telón (html.m-intro), las
  // entradas esperan a que empiece a salir (`ith:intro-salida`). Respaldo de 1,6 s por si carga.js no llega.
  const alAbrir = (fn) => {
    if (!root.classList.contains('m-intro')) { fn(); return; }
    let hecho = false;
    const listo = () => {
      if (hecho) return;
      hecho = true;
      document.removeEventListener('ith:intro-salida', listo);
      fn();
    };
    document.addEventListener('ith:intro-salida', listo);
    setTimeout(listo, 1600);
  };
  // Al volver desde la caché del navegador, carga.js repite el telón y avisa con `ith:replay`.
  const alRepetir = (fn) => document.addEventListener('ith:replay', fn);

  /* ---------- Origen de la visita ---------- */
  // Igual que en el sitio principal: la primera visita (utm_*, gclid, li_fat_id, referrer, página de entrada y canal) se
  // guarda 90 días en localStorage con la clave `ith_origen`, la que lee la agenda de /diagnostico-sin-cargo/. En
  // producción el blog está en el mismo dominio (/novedades/), así que si alguien entra por una nota con una campaña y
  // después agenda, el origen es esa nota. La primera visita manda.
  (() => {
    const KEY = 'ith_origen';
    const DIAS = 90;
    const PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'li_fat_id'];
    let previo = null;
    try { previo = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return; }
    if (previo && typeof previo === 'object' && Date.now() - Number(previo.t || 0) < DIAS * 864e5) return;
    const sinWww = (host) => host.replace(/^www\./, '');
    const hostDe = (url) => { try { return sinWww(new URL(url).hostname.toLowerCase()); } catch (e) { return ''; } };
    const recortar = (v, max) => String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f]+/g, ' ').trim().slice(0, max);
    const ASISTENTES = [
      [/(^|\.)(chatgpt\.com|openai\.com)$/, 'IA: ChatGPT'],
      [/(^|\.)perplexity\.ai$/, 'IA: Perplexity'],
      [/^gemini\.google\.com$|^bard\.google\.com$/, 'IA: Gemini'],
      [/(^|\.)copilot\.microsoft\.com$/, 'IA: Copilot'],
      [/(^|\.)claude\.ai$/, 'IA: Claude'],
    ];
    // Mismos nombres de canal que la agenda y el CRM.
    const canalDe = (o) => {
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
    };
    const query = new URLSearchParams(location.search);
    const externo = document.referrer && hostDe(document.referrer) !== sinWww(location.hostname);
    const datos = { t: Date.now(), landing: location.pathname, referrer: externo ? recortar(document.referrer, 300) : '' };
    PARAMS.forEach((k) => { datos[k] = recortar(query.get(k), k === 'gclid' || k === 'li_fat_id' ? 200 : 150); });
    datos.canal = canalDe(datos);
    try { localStorage.setItem(KEY, JSON.stringify(datos)); } catch (e) { /* modo privado: la agenda lo vuelve a armar */ }
  })();

  /* ---------- Menú en pantallas angostas ---------- */
  const navToggle = document.querySelector('[data-nav-toggle]');
  const nav = navToggle && document.getElementById(navToggle.getAttribute('aria-controls'));
  if (navToggle && nav) {
    // Al abrir, el foco pasa al primer link: en el DOM el menú va antes que el botón, así que el Tab siguiente
    // saltearía los links y seguiría por el contenido con el panel abierto arriba.
    const setOpen = (open) => {
      nav.classList.toggle('is-open', open);
      navToggle.setAttribute('aria-expanded', String(open));
      if (open) nav.querySelector('a')?.focus({ preventScroll: true });
    };
    navToggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape' || !nav.classList.contains('is-open')) return;
      setOpen(false);
      navToggle.focus();
    });
  }

  /* ---------- Header: se compacta al scrollear y se esconde al bajar (todas las páginas; estilos en main.css) ---------- */
  // Compacto pasados 24 px. Se esconde bajando (12 px seguidos) pasada la tercera altura de barra y vuelve apenas se
  // sube. No se esconde con el menú abierto, con el foco adentro ni mientras se viaja a un ancla tocada en la página
  // (el destino queda justo debajo de la barra, como prevé scroll-margin). data-header-fijo en el <header> la deja quieta.
  const head = document.querySelector('.site-header');
  if (head && !head.hasAttribute('data-header-fijo')) {
    const menu = document.getElementById('menu');
    let lastY = scrollY;
    let acc = 0;
    let travel = false;
    let travelTimer = 0;
    let raf = 0;
    const show = () => head.classList.remove('is-hidden');
    const update = () => {
      raf = 0;
      const y = Math.max(0, scrollY);
      const dy = y - lastY;
      lastY = y;
      head.classList.toggle('is-compact', y > 24);
      const busy = travel || (menu && menu.classList.contains('is-open')) || head.contains(document.activeElement);
      if (busy || y < head.offsetHeight * 3) { acc = 0; show(); return; }
      if (!dy) return;
      acc = Math.sign(dy) === Math.sign(acc) ? acc + dy : dy;
      if (acc > 12) head.classList.add('is-hidden');
      else if (acc < -12) show();
    };
    const request = () => { if (!raf) raf = requestAnimationFrame(update); };
    addEventListener('scroll', request, { passive: true });
    head.addEventListener('focusin', show);
    // Viaje a un ancla de esta misma página: la barra queda visible hasta que termina el scroll
    const endTravel = () => { travel = false; clearTimeout(travelTimer); lastY = scrollY; acc = 0; };
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href*="#"]');
      if (!a || a.origin !== location.origin || a.pathname !== location.pathname || !a.hash) return;
      travel = true;
      show();
      clearTimeout(travelTimer);
      travelTimer = setTimeout(endTravel, 2000);
    }, true);
    addEventListener('scrollend', () => { if (travel) endTravel(); });
    update();
  }

  /* ---------- Medición ---------- */
  // cta_click: los "Agendá reunión" (llevan id y data-cta, que también usa GTM como trigger de clic).
  // internal_nav: enlaces del blog hacia el sitio principal (secciones de la home, Postulate), desde el header, el pie o
  // el texto de una nota. link_target va sin dominio ("/#casos"), igual en local y en producción.
  const zonaDe = (el) => (el.closest('.site-header') ? 'header' : el.closest('.site-footer') ? 'footer'
    : el.closest('.post-prose') ? 'nota' : (el.closest('section[id], article[id]') || {}).id || '');
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    if (link.dataset.cta) {
      push({ event: 'cta_click', cta_id: link.id, cta_section: link.dataset.cta, cta_url: link.href });
      return;
    }
    if (!principal || (link.href !== principal && !link.href.startsWith(principal + '/'))) return;
    push({
      event: 'internal_nav',
      link_text: link.textContent.replace(/[→←]/g, '').trim(),
      link_target: link.href.slice(principal.length) || '/',
      link_from: zonaDe(link),
    });
  });

  /* ---------- Revelado al hacer scroll ---------- */
  if (motion) {
    const items = document.querySelectorAll('.rv');
    // Demora: `data-d` (segundos) o, si no hay, escalonada según la posición entre hermanos `.rv`, con tope: en listas
    // largas (la línea de tiempo) cada ítem aparece apenas entra en pantalla, sin arrastrar la espera de los anteriores.
    // `items` viene en orden de documento, así que basta contar cuántos `.rv` ya pasaron por cada padre.
    // La demora va en --rv-d (no en animation-delay) para que la hereden los hijos: los encabezados `.rv-seq` y los
    // íconos de adentro suman su propio paso a esa demora (ver "Animaciones" en styles.css).
    const seen = new Map();
    items.forEach((el) => {
      const index = seen.get(el.parentElement) || 0;
      seen.set(el.parentElement, index + 1);
      const delay = parseFloat(el.dataset.d);
      el.style.setProperty('--rv-d', `${Number.isNaN(delay) ? Math.min(index, 4) * 0.08 : delay}s`);
    });
    // Cada elemento aparece una sola vez: al mostrarlo se deja de observar y al volver a subir ya está ahí.
    // En un carrusel de tarjetas, mostrar una muestra todo el carrusel: las tarjetas de los otros grupos terminan su
    // entrada fuera de vista y al pasar con las flechas ya están quietas (sin escalonado repetido).
    //
    // Nada puede quedar oculto (pedido de Brian: nunca una pantalla en blanco al scrollear o al recargar):
    // - Umbral 0: un bloque entra (con su animación) apenas su borde cruza la línea del 90 % de la pantalla, sea del
    //   alto que sea. Es lo que pasa al scrollear a un ritmo normal.
    // - Lo que se descubre ya metido en la pantalla (scroll muy rápido, salto a un ancla) o lo que el visitante pasó sin
    //   llegar a verlo (recarga a mitad de página, vuelta con Atrás) aparece ya quieto, sin entrada (`ya`), en el mismo
    //   cuadro del scroll: nunca se ve una pantalla vacía esperando animaciones, ni al bajar rápido ni al volver a subir.
    // - Respaldo: a los 2 s de abrirse el telón y cada vez que el scroll se detiene, todo lo que esté a la vista o más
    //   arriba se muestra, haya avisado o no el IntersectionObserver.
    const pendientes = new Set();
    // Entradas que dejan algo oculto mientras corren; al mostrar "ya", se adelantan a su final. Las animaciones que
    // no son de entrada (bandas, avance de rubros, mapa, levitación) siguen su curso.
    const ENTRADAS = /^(rise|riseSm|focusIn|fadeIn|pop|popSoft|draw|histRing|mLine|mUncover|mZoom|mGrow)$/;
    const terminar = (el) => {
      if (typeof el.getAnimations !== 'function') return;
      el.getAnimations({ subtree: true }).forEach((a) => {
        if (!ENTRADAS.test(a.animationName || '')) return;
        try { a.finish(); } catch (err) { /* animación infinita: no es de entrada */ }
      });
    };
    const reveal = (el, { ya = false, sinDemora = false } = {}) => {
      const group = el.matches('[data-carousel-track] .rv') ? [...el.closest('[data-carousel-track]').querySelectorAll('.rv')] : [el];
      const nuevos = group.filter((item) => !item.classList.contains('show'));
      nuevos.forEach((item) => {
        if (ya) item.classList.add('rv-ya'); // motion.js no parte el título de un bloque que aparece ya quieto
        else if (sinDemora) item.style.setProperty('--rv-d', '0s');
        item.classList.add('show');
        pendientes.delete(item);
        io.unobserve(item);
      });
      // Después de los observadores de motion.js (microtareas), que suman sus propias entradas al ver .show
      if (ya && nuevos.length) Promise.resolve().then(() => nuevos.forEach(terminar));
    };
    let primeraTanda = false; // la primera respuesta del observer: lo que se ve al abrirse el telón entra escalonado
    const io = new IntersectionObserver((entries) => {
      const alto = innerHeight;
      entries.forEach(({ target, isIntersecting, boundingClientRect: r }) => {
        if (!isIntersecting) return;
        // Ya adentro de la pantalla al descubrirlo: el visitante llegó de un salto o va muy rápido
        reveal(target, primeraTanda ? {} : { ya: r.top < alto * 0.72 });
      });
      primeraTanda = false;
    }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });
    let abierto = false;
    // modo 'arriba': solo lo que quedó por encima de la pantalla (ya quieto). 'scroll': además, lo que ya está metido en
    // la pantalla (ya quieto, en el mismo cuadro del scroll, antes de pintarse). 'forzar' (respaldo): además, todo lo que
    // esté a la vista, con su entrada sin demora.
    const barrer = (modo) => {
      if (!abierto || !pendientes.size) return;
      const alto = innerHeight;
      const ya = [];
      const visibles = [];
      pendientes.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom <= 0 && r.top < 0) ya.push(el);
        else if (r.top < alto && r.bottom > 0) {
          if (modo !== 'arriba' && r.top < alto * 0.72) ya.push(el);
          else if (modo === 'forzar') visibles.push(el);
        }
      });
      ya.forEach((el) => reveal(el, { ya: true }));
      visibles.forEach((el) => reveal(el, { sinDemora: true }));
    };
    let barrerRaf = 0;
    let quieto = 0;
    const alScrollear = () => {
      if (!barrerRaf) barrerRaf = requestAnimationFrame(() => { barrerRaf = 0; barrer('scroll'); });
      clearTimeout(quieto);
      quieto = setTimeout(() => barrer('forzar'), 1200);
    };
    addEventListener('scroll', alScrollear, { passive: true });
    addEventListener('resize', alScrollear);
    // Se observa al abrirse los telones. Con el scroll restaurado por el navegador (recarga a mitad de página) lo que
    // está a la vista entra delante del visitante y lo de arriba ya está en su lugar al volver a subir.
    const observar = () => {
      abierto = true;
      primeraTanda = true;
      items.forEach((el) => { if (!el.classList.contains('show')) { pendientes.add(el); io.observe(el); } });
      barrer('arriba');
      setTimeout(() => barrer('forzar'), 2000);
    };
    alAbrir(observar);
    alRepetir(() => {
      io.disconnect();
      pendientes.clear();
      abierto = false;
      items.forEach((el) => el.classList.remove('show', 'rv-ya'));
      alAbrir(observar);
    });
  }

  /* ---------- Brillos de marca en todas las secciones ---------- */
  // Cada sección de primer nivel con fondo propio (blanca o lavanda) recibe como primer hijo una capa .brillos con 1 a 4
  // puntos de luz (violeta y lima) que se desplazan despacio (CSS, "Luces de cada sección"). data-luces="N" en la
  // sección fija la cantidad; si no, sale de su alto. Fuera de pantalla se detienen. El hero
  // carbón tiene su propio fondo de luces; lo que no tiene fondo propio muestra el de main::before.
  {
    const conFondo = (el) => {
      let m = getComputedStyle(el).backgroundColor.match(/[\d.]+/g);
      // Sin fondo propio: cuenta el de la página (encabezados, bloque de reserva y casos del diagnóstico)
      if (!m || (m.length > 3 && Number(m[3]) === 0)) m = getComputedStyle(document.body).backgroundColor.match(/[\d.]+/g);
      if (!m || (m.length > 3 && Number(m[3]) === 0)) return false;
      const [r, g, b] = m.map(Number);
      return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.7; // claro (no el carbón)
    };
    // En el blog: encabezados de pantalla y de nota (transparentes: muestran main::before), listado, cuerpo del 404,
    // notas relacionadas, cierre y pie.
    const capas = [...document.querySelectorAll('main section, main .page-head, main .post-hero, main .page-body, .site-footer')]
      .filter((el) => !el.parentElement.closest('section, .page-body') && !el.matches('.hero, .tech, .section--dark') && conFondo(el));
    const io = 'IntersectionObserver' in window
      ? new IntersectionObserver((entries) => entries.forEach((en) => en.target.classList.toggle('is-quieto', !en.isIntersecting)), { rootMargin: '10% 0px' })
      : null;
    // Puntos de luz de una sección: cantidad por data-luces o por alto; violeta y lima alternados (los dos colores en
    // toda sección con 2 o más); posición, tamaño, recorrido (siempre hacia adentro), duración y desfase variados con
    // una secuencia fija por página (mismo resultado en cada carga, distinto entre secciones).
    let semilla = [...location.pathname].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
    const azar = () => { semilla = (semilla * 1664525 + 1013904223) >>> 0; return semilla / 4294967296; };
    const entre = (a, b) => a + (b - a) * azar();
    const luces = (capa, sec, i) => {
      const pedido = parseInt(sec.dataset.luces, 10);
      const alto = sec.offsetHeight;
      const n = Math.max(1, Math.min(4, Number.isNaN(pedido) ? (alto < 520 ? 2 : alto < 1100 ? 3 : 4) : pedido));
      for (let k = 0; k < n; k++) {
        const luz = document.createElement('i');
        const violeta = (k + i) % 2 === 0;
        luz.className = `luz luz--${violeta ? 'violeta' : 'lima'}`;
        // Repartidos de arriba abajo, alternando lados, con algo de variación
        const izquierda = (k + i) % 2 === 0;
        const x = izquierda ? entre(3, 34) : entre(52, 80);
        const y = ((k + 0.25) / n) * 100 + entre(-6, 6);
        luz.style.setProperty('--x', `${x.toFixed(1)}%`);
        luz.style.setProperty('--y', `${Math.max(2, y).toFixed(1)}%`);
        luz.style.setProperty('--k', entre(0.55, 1).toFixed(2));
        luz.style.setProperty('--dx', `${Math.round((x < 45 ? 1 : -1) * entre(60, 150))}px`);
        luz.style.setProperty('--dy', `${Math.round((y < 50 ? 1 : -1) * entre(16, 60))}px`);
        luz.style.setProperty('--t', `${entre(14, 21).toFixed(1)}s`);
        luz.style.setProperty('--d', `${(-entre(0, 12)).toFixed(1)}s`);
        capa.append(luz);
      }
    };
    capas.forEach((sec, i) => {
      const capa = document.createElement('div');
      capa.className = 'brillos';
      capa.setAttribute('aria-hidden', 'true');
      sec.classList.add('con-brillos');
      sec.prepend(capa);
      luces(capa, sec, i);
      if (io) io.observe(capa);
    });
  }

  /* ---------- WhatsApp flotante: botón y estado ----------
     En el sitio principal, waActualizar también oculta el botón donde taparía flechas o controles; el blog no tiene
     esos controles, así que solo queda el estado del globo (abierto o cerrado). zonaDe es la de "Medición". */
  const waFloat = document.querySelector('.wa-float');
  let waAbierto = false;
  const waActualizar = () => {};

  /* ---------- WhatsApp flotante: globo con el mensaje de la página ---------- */
  // Mejora progresiva del enlace flotante (.wa-float, el mismo en todas las páginas): sin JS sigue siendo el link
  // directo a wa.me con el mensaje de la página (?text=). Con JS, al pasar el mouse (o al tocarlo en el celular, o con
  // Enter) se abre un globo de conversación con ese mensaje en un campo editable y el botón "Enviar por WhatsApp →",
  // que abre wa.me con el texto que quedó (la app o WhatsApp Web, según el dispositivo, como el link de siempre).
  // - Mouse: se abre al apoyarse sobre el botón y se cierra solo al salir, salvo que el visitante ya haya entrado al
  //   globo (clic o foco adentro); desde ahí queda abierto hasta la X, Escape o un clic afuera.
  // - Toque y teclado: el botón abre y cierra el globo. Con teclado, el foco va al mensaje; con el dedo no (el teclado
  //   del celular no aparece hasta tocar el mensaje). Escape cierra y devuelve el foco al botón; salir con Tab, también
  //   cierra. Ctrl/Cmd + Enter en el mensaje envía.
  // - El campo crece con el texto, sin tirador de tamaño; recién pasados unos 7 renglones muestra una barra fina con
  //   los colores del sitio.
  // - Medición: click_whatsapp (link_location "flotante") al enviar; el resto de los enlaces a WhatsApp lo publica con
  //   su sección (módulo siguiente).
  if (waFloat) {
    let destino = null;
    try { destino = new URL(waFloat.href); } catch (err) { /* sin href válido: queda el link tal cual */ }
    if (destino && /(^|\.)wa\.me$|(^|\.)whatsapp\.com$/.test(destino.hostname)) {
      const mensaje = destino.searchParams.get('text') || '';
      const base = destino.origin + destino.pathname;
      const reducido = matchMedia('(prefers-reduced-motion: reduce)');
      const globo = document.createElement('div');
      globo.className = 'wa-globo';
      globo.id = 'wa-globo';
      globo.hidden = true;
      globo.setAttribute('role', 'dialog');
      globo.setAttribute('aria-labelledby', 'wa-globo-titulo');
      globo.innerHTML = '<div class="wa-globo__cab"><span class="wa-globo__avatar" aria-hidden="true"></span><div>'
        + '<p class="wa-globo__titulo" id="wa-globo-titulo">Escribinos por WhatsApp</p>'
        + '<p class="wa-globo__sub">Podés editarlo antes de enviar.</p></div></div>'
        + '<label class="sr-only" for="wa-globo-texto">Mensaje</label>'
        + '<textarea id="wa-globo-texto" class="wa-globo__texto" rows="3"></textarea>'
        + '<a class="btn btn-lime wa-globo__enviar" target="_blank" rel="noopener">Enviar por WhatsApp <span class="arr" aria-hidden="true">→</span></a>'
        + '<button type="button" class="wa-globo__cerrar" aria-label="Cerrar"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button>';
      const logo = waFloat.querySelector('svg');
      if (logo) globo.querySelector('.wa-globo__avatar').append(logo.cloneNode(true));
      const texto = globo.querySelector('textarea');
      const enviar = globo.querySelector('.wa-globo__enviar');
      const cerrarBtn = globo.querySelector('.wa-globo__cerrar');
      texto.value = mensaje;
      const armarEnlace = () => {
        const t = texto.value.trim();
        enviar.href = t ? `${base}?text=${encodeURIComponent(t)}` : base;
      };
      const ajustarAlto = () => {
        texto.style.height = 'auto';
        texto.style.height = `${texto.scrollHeight}px`; // el CSS lo limita (max-height)
      };
      armarEnlace();
      waFloat.after(globo);
      waFloat.setAttribute('aria-expanded', 'false');
      waFloat.setAttribute('aria-controls', globo.id);
      waFloat.setAttribute('aria-haspopup', 'dialog');
      waFloat.setAttribute('aria-label', 'Escribinos por WhatsApp');

      let fijo = false; // el visitante entró al globo: no se cierra al sacar el mouse
      let tAbrir = 0;
      let tCerrar = 0;
      let tOcultar = 0;
      let tipo = 'mouse'; // con qué se tocó el botón por última vez
      const abrir = ({ foco = false, fijar = false } = {}) => {
        clearTimeout(tCerrar);
        clearTimeout(tOcultar);
        if (fijar) fijo = true;
        if (!waAbierto) {
          waAbierto = true;
          globo.hidden = false;
          ajustarAlto();
          void globo.offsetWidth; // la transición de apertura arranca desde el estado cerrado
          globo.classList.add('is-abierto');
          waFloat.classList.add('is-activo');
          waFloat.setAttribute('aria-expanded', 'true');
          waActualizar();
        }
        if (foco) {
          texto.focus({ preventScroll: true });
          texto.setSelectionRange(texto.value.length, texto.value.length);
        }
      };
      const cerrar = ({ devolverFoco = false } = {}) => {
        clearTimeout(tAbrir);
        clearTimeout(tCerrar);
        if (!waAbierto) return;
        waAbierto = false;
        fijo = false;
        globo.classList.remove('is-abierto');
        waFloat.classList.remove('is-activo');
        waFloat.setAttribute('aria-expanded', 'false');
        if (devolverFoco) waFloat.focus({ preventScroll: true });
        tOcultar = setTimeout(() => { if (!waAbierto) globo.hidden = true; }, reducido.matches ? 160 : 360);
        waActualizar();
      };

      const esMouse = (e) => e.pointerType === 'mouse';
      waFloat.addEventListener('pointerdown', (e) => { tipo = e.pointerType || 'mouse'; });
      waFloat.addEventListener('pointerenter', (e) => {
        if (!esMouse(e)) return;
        clearTimeout(tCerrar);
        if (!waAbierto) tAbrir = setTimeout(() => abrir(), 120);
      });
      const salir = (e) => {
        if (!esMouse(e)) return;
        clearTimeout(tAbrir);
        if (!waAbierto || fijo) return;
        tCerrar = setTimeout(() => { if (!fijo) cerrar(); }, 380);
      };
      waFloat.addEventListener('pointerleave', salir);
      globo.addEventListener('pointerleave', salir);
      globo.addEventListener('pointerenter', (e) => { if (esMouse(e)) clearTimeout(tCerrar); });
      globo.addEventListener('pointerdown', () => { fijo = true; });
      globo.addEventListener('focusin', () => { fijo = true; });
      waFloat.addEventListener('click', (e) => {
        e.preventDefault(); // con JS, el botón abre el globo; el envío lo hace "Enviar por WhatsApp"
        clearTimeout(tAbrir);
        const teclado = e.detail === 0;
        if (waAbierto && (fijo || teclado || tipo !== 'mouse')) { cerrar({ devolverFoco: teclado }); return; }
        abrir({ foco: teclado || tipo === 'mouse', fijar: true });
      });
      cerrarBtn.addEventListener('click', () => cerrar({ devolverFoco: true }));
      texto.addEventListener('input', () => { armarEnlace(); ajustarAlto(); });
      texto.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); enviar.click(); }
      });
      enviar.addEventListener('click', () => { armarEnlace(); setTimeout(() => cerrar(), 0); });
      document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape' || !waAbierto) return;
        const adentro = globo.contains(document.activeElement) || document.activeElement === waFloat;
        cerrar({ devolverFoco: adentro });
      });
      // Clic o toque afuera (en captura, antes que cualquier otro manejador)
      document.addEventListener('pointerdown', (e) => {
        if (!waAbierto || !(e.target instanceof Node)) return;
        if (globo.contains(e.target) || waFloat.contains(e.target)) return;
        cerrar();
      }, true);
      // Tab fuera del globo y del botón
      const alSalirFoco = (e) => {
        const a = e.relatedTarget;
        if (!waAbierto || !a || globo.contains(a) || waFloat.contains(a)) return;
        cerrar();
      };
      globo.addEventListener('focusout', alSalirFoco);
      waFloat.addEventListener('focusout', alSalirFoco);
    }
  }

  /* ---------- Medición: clics a WhatsApp ---------- */
  // click_whatsapp con link_location: "flotante" (el botón de envío del globo, o el botón flotante sin el globo) o la
  // sección del enlace (agenda, footer...). No cuenta el clic que solo abre el globo (ese no sale a WhatsApp).
  document.addEventListener('click', (e) => {
    const a = e.target instanceof Element ? e.target.closest('a[href*="wa.me/"], a[href*="api.whatsapp.com/"]') : null;
    if (!a || e.defaultPrevented) return;
    (window.dataLayer = window.dataLayer || []).push({
      event: 'click_whatsapp',
      link_location: a.closest('.wa-globo, .wa-float') ? 'flotante' : (zonaDe(a) || 'contenido'),
      page_path: location.pathname,
    });
  });
})();
