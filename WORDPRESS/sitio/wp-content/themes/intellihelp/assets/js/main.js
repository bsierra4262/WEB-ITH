/* Intellihelp Novedades — interacciones del blog (sin dependencias).
   Es el subconjunto de TEMPLATE-NICO/js/main.js que necesita el blog, con la misma lógica (el menú angosto y el
   header están copiados tal cual):
   origen de la visita · menú angosto · header que se compacta y se esconde · medición (cta_click e internal_nav) ·
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
    const reveal = (el) => {
      const group = el.matches('[data-carousel-track] .rv') ? el.closest('[data-carousel-track]').querySelectorAll('.rv') : [el];
      group.forEach((item) => {
        item.classList.add('show');
        io.unobserve(item);
        ioTall.unobserve(item);
      });
    };
    const onEntries = (entries) => entries.forEach(({ target, isIntersecting }) => { if (isIntersecting) reveal(target); });
    const margin = '0px 0px -8% 0px';
    const io = new IntersectionObserver(onEntries, { threshold: 0.15, rootMargin: margin });
    // Bloques más altos que la pantalla (grilla de clientes en celular, por ejemplo): con 0.15 podrían no llegar
    // nunca al umbral, así que se muestran apenas asoman.
    const ioTall = new IntersectionObserver(onEntries, { threshold: 0, rootMargin: margin });
    // Se observa al abrirse los telones. Con el scroll restaurado por el navegador (recarga a mitad de página) solo se
    // revela lo que está a la vista; lo de arriba entra cuando se vuelve a subir.
    const observar = () => items.forEach((el) => {
      if (!el.classList.contains('show')) (el.offsetHeight > innerHeight * 0.8 ? ioTall : io).observe(el);
    });
    alAbrir(observar);
    alRepetir(() => {
      io.disconnect();
      ioTall.disconnect();
      items.forEach((el) => el.classList.remove('show'));
      alAbrir(observar);
    });
  }
})();
