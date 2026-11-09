/* Intellihelp — interacciones del sitio (sin dependencias). Se carga en la home y en las páginas HTML internas
   (/diagnostico-sin-cargo/, /postulate/).
   Módulos, en orden: trayectoria (años) · origen de la visita · menú angosto · barra con sección activa · enlaces internos · CTAs
   (medición) · hero con video · párrafos "Ver más" · revelado al scrollear · contadores · carruseles · filtro de casos ·
   cinta de clientes · socios (slots) · slider de presencia · mapas · preguntas · brillos de marca · WhatsApp flotante (y su globo) ·
   medición de WhatsApp. Cada módulo busca sus nodos y, si no están, no hace nada, así el mismo archivo sirve para la
   home y para las páginas internas.
   Sin botones de pausa en ningún lado (pedido de Brian): lo que se mueve solo se detiene con el mouse encima, con el
   foco adentro, fuera de pantalla o con la pestaña oculta, y con "reducir movimiento" no se mueve. */
(() => {
  'use strict';

  const root = document.documentElement;
  const motion = root.classList.contains('anim'); // ver script en <head>
  const lastEntry = (entries) => entries[entries.length - 1];

  // Animación de carga: mientras está el telón (.m-intro, js/carga.js, en cada carga y recarga), las entradas esperan a
  // que empiece a salir (`ith:intro-salida`) y recién ahí se observa qué está a la vista. Así lo que se ve al cargar
  // (el hero, o la sección donde el navegador restauró el scroll) entra delante del visitante y no por debajo del
  // telón. Respaldo de 1,6 s por si carga.js no llega.
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
  // Al volver a la página desde la caché del navegador, js/carga.js repite la carga y avisa con `ith:replay`: cada
  // módulo con entradas vuelve a su estado inicial y se arma de nuevo.
  const alRepetir = (fn) => document.addEventListener('ith:replay', fn);

  // Enlace a un ancla de esta misma página: "#casos" o "/#casos" estando en la home. El header y el pie usan
  // "/#seccion" para que el mismo bloque sirva desde cualquier página. Devuelve el id ("casos") o null.
  const anclaLocal = (a) => {
    if (!a || !a.hash || a.hash === '#') return null;
    if (a.origin !== location.origin || a.pathname !== location.pathname) return null;
    return decodeURIComponent(a.hash.slice(1));
  };

  /* ---------- Trayectoria: años desde la fundación ---------- */
  // El HTML trae el valor del año de publicación (16 años, desde 2010) para que sin JS se lea igual; acá se recalcula
  // para que el número suba solo cada año. Corre antes de los contadores, que leen data-count al animar.
  // El title, la meta, el JSON-LD y el og:image dicen "desde 2010", que no cambia.
  // Se cuenta con la fecha completa de la fundación (10/03/2010): entre el 1/1 y el 9/3 todavía no se cumplió el año.
  const FUNDACION = { anio: 2010, mes: 2, dia: 10 }; // mes base 0: 2 = marzo
  const ahora = new Date();
  const hoy = ahora.getFullYear();
  const cumplido = ahora.getMonth() > FUNDACION.mes || (ahora.getMonth() === FUNDACION.mes && ahora.getDate() >= FUNDACION.dia);
  const anios = String(hoy - FUNDACION.anio - (cumplido ? 0 : 1));
  document.querySelectorAll('[data-anios]').forEach((el) => {
    if (el.hasAttribute('data-count')) el.dataset.count = anios;
    el.textContent = anios;
  });
  document.querySelectorAll('[data-anio]').forEach((el) => { el.textContent = String(hoy); });

  /* ---------- Origen de la visita ---------- */
  // La primera visita (utm_*, gclid, li_fat_id, referrer, página de entrada y canal) se guarda 90 días en localStorage
  // con la misma clave y el mismo formato que usa la agenda (`ith_origen`). Se toma acá, en cualquier página de entrada,
  // porque la agenda está en /diagnostico-sin-cargo/: si el visitante llega a la home con una campaña y después toca
  // "Agendá reunión", el origen tiene que ser el de la home y no "Directo". La primera visita manda.
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

  /* ---------- Header: se compacta al scrollear y se esconde al bajar (todas las páginas; estilos en styles.css) ---------- */
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

  /* ---------- Barra: resalta la sección que se está viendo ---------- */
  // Cada link de la barra cubre una o más secciones de la home. Solo en la home: en las páginas internas los links
  // "/#..." apuntan a otra página y no se marcan; ahí el ítem activo es el de la página (aria-current, abajo).
  // La sección actual es la última (en orden de la página) cuyo borde superior ya pasó una línea imaginaria a un
  // tercio de la pantalla, debajo de la barra. Con secciones más altas que la pantalla (Equipo o Historia en celular)
  // es más confiable que comparar cuánto se ve de cada una.

  // Página interna: el link del menú que lleva a esta misma página (Blog o Postulate) queda marcado
  document.querySelectorAll('.nav a').forEach((a) => {
    if (!a.hash && a.origin === location.origin && a.pathname === location.pathname && a.pathname !== '/' && !a.hasAttribute('aria-current')) a.setAttribute('aria-current', 'page');
  });
  const navLinks = [...document.querySelectorAll('.nav a')].filter((a) => anclaLocal(a));
  if (navLinks.length) {
    const COVERS = {
      '#que-ofrecemos': ['que-ofrecemos', 'presencia'],
      '#quienes-somos': ['equipo', 'socios', 'clientes', 'historia'],
      '#casos': ['casos', 'como-trabajamos'],
      '#preguntas': ['preguntas', 'agenda'],
    };
    const linkFor = {};
    navLinks.forEach((a) => (COVERS['#' + anclaLocal(a)] || [anclaLocal(a)]).forEach((id) => { linkFor[id] = a; }));
    const sections = Object.keys(linkFor).map((id) => document.getElementById(id)).filter(Boolean)
      .sort((x, y) => (x.compareDocumentPosition(y) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
    const barra = document.querySelector('.site-header');
    let raf = 0;
    const paint = () => {
      raf = 0;
      const linea = (barra ? barra.getBoundingClientRect().bottom : 0) + innerHeight * 0.3;
      let best = null;
      sections.forEach((sec) => { if (sec.getBoundingClientRect().top <= linea) best = sec; });
      // Pasado el final de la última sección (el pie), no queda nada marcado
      if (best && best.getBoundingClientRect().bottom < linea) best = null;
      navLinks.forEach((a) => a.classList.toggle('is-active', Boolean(best) && linkFor[best.id] === a));
    };
    const pedir = () => { if (!raf) raf = requestAnimationFrame(paint); };
    addEventListener('scroll', pedir, { passive: true });
    addEventListener('resize', pedir);
    paint();
  }

  /* ---------- Enlaces internos: medición y apertura del texto plegado al llegar ---------- */
  const zonaDe = (link) => (link.closest('section[id]') || {}).id || (link.closest('footer') ? 'footer' : link.closest('header') ? 'header' : '');
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href*="#"]');
    if (!link || link.dataset.cta) return; // los CTA miden cta_click (abajo)
    const id = anclaLocal(link);
    if (!id) {
      // Desde una página interna (/postulate/, /diagnostico-sin-cargo/...) hacia una sección de la home: se mide igual,
      // con link_target "/#seccion", como lo publica el blog. El navegador sigue el enlace normalmente.
      if (link.origin === location.origin && link.pathname === '/' && link.hash.length > 1) {
        (window.dataLayer = window.dataLayer || []).push({
          event: 'internal_nav',
          link_text: link.textContent.replace('→', '').trim(),
          link_target: '/' + link.hash,
          link_from: zonaDe(link),
        });
      }
      return;
    }
    const target = document.getElementById(id);
    if (!target) return;
    const more = target.querySelector('.section-head details.more--text, .presence__text details.more--text, .history__more');
    if (more) more.open = true; // que el visitante no aterrice en un párrafo plegado
    (window.dataLayer = window.dataLayer || []).push({
      event: 'internal_nav',
      link_text: link.textContent.replace('→', '').trim(),
      link_target: '#' + id,
      link_from: zonaDe(link),
    });
  });

  /* ---------- CTAs "Agendá reunión": medición ---------- */
  // Todos llevan a /diagnostico-sin-cargo/ (la agenda conectada al CRM). Los parámetros de campaña de la URL de
  // entrada no viajan en el enlace: el módulo "Origen de la visita" (arriba) los guarda con la primera visita y la
  // agenda los manda en los campos ocultos de la reserva y de la consulta.
  document.querySelectorAll('a[data-cta]').forEach((link) => {
    // Además de los atributos id/data-cta (para triggers de clic en GTM), se publica un evento propio.
    link.addEventListener('click', () => {
      (window.dataLayer = window.dataLayer || []).push({
        event: 'cta_click',
        cta_id: link.id,
        cta_section: link.dataset.cta,
        cta_url: link.href,
      });
    });
  });

  /* ---------- Hero: video de fondo diferido ---------- */
  // El <video> no tiene autoplay ni precarga: se pinta el poster y el video se pide recién después de `load`, para no
  // competir con el texto, la fuente y el CSS. Arranca solo desde 900px, sin movimiento reducido ni ahorro de datos; en
  // celular (o con esas preferencias) queda la imagen fija. Sin botones de reproducir/pausar (pedido de Brian).
  const heroVideo = document.querySelector('[data-hero-video]');
  const ahorroDatos = Boolean(navigator.connection && navigator.connection.saveData);
  const autoVideo = Boolean(heroVideo) && motion && !ahorroDatos && matchMedia('(min-width: 900px)').matches;
  if (heroVideo) {
    // Respaldo propio si el navegador no deja reproducir (ahorro de energía en Safari, políticas de reproducción): el
    // video se cambia por su poster como imagen fija, así nunca aparece el botón de play nativo encima del hero.
    const posterFijo = () => {
      const poster = heroVideo.getAttribute('poster');
      if (poster && heroVideo.isConnected) {
        const img = document.createElement('img');
        img.src = poster;
        img.alt = '';
        img.setAttribute('aria-hidden', 'true');
        img.className = 'hero__poster';
        heroVideo.replaceWith(img);
      } else heroVideo.hidden = true;
    };
    const reproducir = () => {
      heroVideo.preload = 'auto';
      const p = heroVideo.play();
      if (p && p.catch) p.catch(() => posterFijo());
    };
    if (autoVideo) {
      if (document.readyState === 'complete') reproducir();
      else addEventListener('load', reproducir, { once: true });
    }
  }

  /* ---------- Hero: primero el fondo; el texto entra al tocar la flecha, al scrollear o solo, al rato ---------- */
  // Con el fondo de luces (sin video) no hay espera: el H1 y la bajada se pintan desde el primer cuadro (son el LCP) y
  // su entrada es solo CSS. Con la animación de carga (.m-intro), el rótulo, los botones y las cifras entran cuando sale
  // el telón (ver alAbrir, "Revelado" y "Contadores").
  // Con video, el video se ve primero y el texto entra después (este bloque).
  const hero = document.querySelector('[data-hero]');
  if (hero && motion && heroVideo) {
    const openBtn = hero.querySelector('[data-hero-open]');
    const content = hero.querySelector('[data-hero-content]');
    const title = hero.querySelector('.hero__title');
    let opened = false;
    // replay: repetir el revelado escalonado del texto (ya se había disparado, oculto, al cargar). Con el foco de
    // teclado no se repite: el enlace enfocado tiene que verse ya, no después de su demora de entrada.
    const open = (replay = true) => {
      if (opened) return;
      opened = true;
      hero.classList.remove('is-idle');
      if (replay) {
        hero.querySelectorAll('.rv.show').forEach((el) => {
          el.classList.remove('show');
          void el.offsetWidth;
          el.classList.add('show');
        });
      }
      ['wheel', 'touchmove', 'keydown', 'scroll'].forEach((ev) => removeEventListener(ev, onIntent));
      hero.dispatchEvent(new Event('hero:open')); // los contadores del hero arrancan recién acá
      // La flecha se desvanece (.4s en el CSS) y después sale del orden de Tab: si no, el foco pasaría por un
      // "Ver más" invisible. Si tenía el foco, lo toma el título para no perder la posición.
      let hid = false;
      const hideBtn = () => {
        if (hid) return;
        hid = true;
        const hadFocus = document.activeElement === openBtn;
        openBtn.hidden = true;
        if (hadFocus && title) { title.setAttribute('tabindex', '-1'); title.focus({ preventScroll: true }); }
      };
      openBtn.addEventListener('transitionend', hideBtn, { once: true });
      setTimeout(hideBtn, 500); // respaldo si la transición no corre
    };
    const onIntent = (e) => {
      if (e.type === 'wheel' && e.deltaY <= 0) return;
      if (e.type === 'keydown' && !['ArrowDown', 'PageDown', 'End', ' ', 'Spacebar'].includes(e.key)) return;
      if (e.type === 'scroll' && scrollY < 8) return;
      open();
    };
    hero.classList.add('is-idle');
    openBtn.hidden = !heroVideo; // la flecha solo tiene sentido con video; con el preloader, el texto entra solo
    openBtn.addEventListener('click', () => open());
    // Con teclado, el texto aparece apenas el foco entra a un enlace del hero (Tab no es intención de scroll)
    content?.addEventListener('focusin', () => open(false), { once: true });
    if (scrollY > 8) open(); // la página ya venía scrolleada (recarga, ancla)
    else {
      ['wheel', 'touchmove', 'keydown', 'scroll'].forEach((ev) => addEventListener(ev, onIntent, { passive: true }));
      // Sin intención del visitante el texto entra solo: el H1 y el CTA tienen que estar en la primera pantalla. Con el
      // video andando se le da 1,2 s después de `load` para que se vea primero; sin video (celular, poster), 0,4 s.
      const openSolo = () => setTimeout(() => open(), autoVideo ? 1200 : 400);
      if (!autoVideo || document.readyState === 'complete') openSolo();
      else addEventListener('load', openSolo, { once: true });
    }
  }

  /* ---------- Párrafos largos detrás de "Ver más" ---------- */
  // Cada párrafo marcado con `data-more` se envuelve en el mismo desplegable que usan las cards (details.more).
  // Sin JS, el párrafo se ve completo.
  document.querySelectorAll('[data-more]').forEach((par) => {
    const details = document.createElement('details');
    details.className = 'more more--text';
    details.innerHTML = '<summary class="more__btn"><span class="more__label--closed">Ver más</span><span class="more__label--open">Ver menos</span>'
      + '<svg class="more__chev" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></summary>'
      + '<div class="more__body"></div>';
    // Si la tarjeta tiene título, el botón lo nombra para lectores de pantalla ("Ver más sobre Detectar")
    const title = par.parentElement.querySelector(':scope > :is(h3, h4)')
      || par.closest('section')?.querySelector(':is(.offer__sub-title, .section-title, h2)');
    if (title) {
      const sr = document.createElement('span');
      sr.className = 'sr-only';
      sr.textContent = ` sobre ${title.textContent.trim()}`;
      details.querySelector('.more__label--open').after(sr);
    }
    par.replaceWith(details);
    details.querySelector('.more__body').append(par);
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

  /* ---------- Contadores ---------- */
  // Cada `[data-counter="<demora ms>"]` anima sus `[data-count]` de 0 al valor final al entrar en pantalla, una sola
  // vez. Los del hero esperan a que se abra el texto (mientras está solo el video, contarían sin que se vean).
  const DURATION = 1400;
  const runCounters = (group) => {
    const nums = [...group.querySelectorAll('[data-count]')];
    const delay = Number(group.dataset.counter) || 0;
    let raf = 0;
    let timer = 0;
    const render = (k) => nums.forEach((n) => {
      const v = String(Math.round(Number(n.dataset.count) * k));
      if (n.textContent !== v) n.textContent = v;
    });
    const start = () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      render(0);
      timer = setTimeout(() => {
        const t0 = performance.now();
        const step = (now) => {
          const k = Math.min(1, (now - t0) / DURATION);
          render(1 - (1 - k) ** 3); // ease-out cúbico
          if (k < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      }, delay);
    };
    const idleHero = group.closest('[data-hero].is-idle');
    if (idleHero) {
      idleHero.addEventListener('hero:open', start, { once: true });
      return;
    }
    let io = null;
    const armar = () => {
      if (io) io.disconnect();
      io = new IntersectionObserver((entries) => {
        if (!lastEntry(entries).isIntersecting) return;
        io.disconnect();
        start();
      }, { threshold: 0.15 }); // arranca apenas asoma el bloque
      io.observe(group);
    };
    alAbrir(armar);
    alRepetir(() => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      render(0);
      alAbrir(armar);
    });
  };
  if (motion) document.querySelectorAll('[data-counter]').forEach(runCounters);

  /* ---------- Carruseles (servicios de a tres; casos de a uno) ---------- */
  // Sin JS quedan como scroll horizontal con snap; con JS suman flechas, puntos o contador y, salvo
  // `data-carousel-autoplay="off"`, avance automático (sin botón de pausa: frena con mouse, foco o fuera de pantalla). Si una tarjeta tiene una lista `data-steps`
  // (varios proyectos de un cliente), se muestran de a uno antes de pasar a la tarjeta siguiente.
  // Con `data-carousel-order="random"` el avance automático se baraja (y se vuelve a barajar en cada vuelta); las
  // flechas siempre van en orden lineal. Devuelve una API
  // con `setPool(indices, { pinned })` para limitar las tarjetas visibles (la usa el mini menú de casos).
  const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };
  const initCarousel = (carousel) => {
    // `data-carousel-ms`: tiempo por vista; `data-carousel-first`: espera de la primera pasada al entrar en pantalla
    const AUTOPLAY_MS = Number(carousel.dataset.carouselMs) || 7000;
    const FIRST_MS = Number(carousel.dataset.carouselFirst) || AUTOPLAY_MS;
    const STEP_MS = 3500;
    const MAX_DOTS = 10; // con más tarjetas, contador "n de N" en vez de puntos
    const autoplay = motion && carousel.dataset.carouselAutoplay !== 'off';
    carousel.classList.toggle('is-auto', autoplay);
    carousel.style.setProperty('--step-ms', `${STEP_MS}ms`);
    carousel.style.setProperty('--auto-ms', `${AUTOPLAY_MS}ms`);
    const track = carousel.querySelector('[data-carousel-track]');
    const slides = [...track.children];
    const controls = carousel.querySelector('[data-carousel-controls]');
    const dotsBox = carousel.querySelector('[data-carousel-dots]');
    const random = carousel.dataset.carouselOrder === 'random';
    // Tarjetas con "Ver más" (`data-carousel-cards`, Servicios y Soluciones). En celular el CSS desarma los grupos de
    // tres (display: contents) y cada tarjeta pasa a ser una vista: se desliza de a una y asoma el borde de la
    // siguiente. `items` son las vistas navegables en cada momento: los grupos o las tarjetas sueltas.
    const cardsMode = carousel.hasAttribute('data-carousel-cards');
    const cards = cardsMode ? [...track.querySelectorAll('.service')] : [];
    const singles = () => cardsMode && getComputedStyle(slides[0]).display === 'contents';
    let perCard = singles();
    let items = perCard ? cards : slides;
    let dots = [];
    let pool = items.map((_, i) => i); // vistas habilitadas (todas, o las que elige el mini menú)
    let seq = [];                        // orden de reproducción (barajado si `random`)
    let pinned = false;                  // una sola tarjeta elegida: no se pasa a otra
    const buildSeq = (first) => {
      seq = random ? shuffle([...pool]) : [...pool];
      if (first !== undefined && seq.includes(first)) seq.splice(seq.indexOf(first), 1), seq.unshift(first);
    };
    buildSeq();
    const neighbor = (dir) => {
      const p = seq.indexOf(index);
      if (p === -1) return seq[0];
      if (random && dir > 0 && p === seq.length - 1 && seq.length > 1) {
        // Fin de la vuelta: se baraja de nuevo, cuidando que no se repita la última
        do buildSeq(); while (seq[0] === index);
        return seq[0];
      }
      return seq[(p + dir + seq.length) % seq.length];
    };
    // Flechas: orden lineal dentro de las tarjetas habilitadas, aunque el automático sea al azar
    const linear = (dir) => pool[(pool.indexOf(index) + dir + pool.length) % pool.length];
    const firstShown = () => items.find((item) => !item.hidden) || items[0];
    const offset = (i) => items[i].offsetLeft - firstShown().offsetLeft;
    let index = seq[0] || 0;
    let step = 0;
    let timer = 0;
    let hovering = false;
    let focusInside = false;
    let inView = false;
    let fresh = true; // recién entrado en pantalla: la primera pasada usa FIRST_MS

    // Avanza solo si nadie está mirando o usando una tarjeta, y nunca con "reducir movimiento".
    const stepsOf = (i) => [...items[i].querySelectorAll('[data-steps] > li')];
    const setStep = (k) => {
      step = k;
      stepsOf(index).forEach((li, j) => li.setAttribute('aria-current', String(j === k)));
    };
    // Tramo en curso (una vista, o un proyecto dentro de una vista): al pausar se guarda lo que le falta y al retomar
    // sigue desde ahí, así el tiempo coincide con las barras de avance del CSS (que también quedan en pausa).
    let seg = null;
    const schedule = () => {
      clearTimeout(timer);
      const now = performance.now();
      if (seg && seg.started) { seg.left -= now - seg.started; seg.started = 0; }
      const busy = hovering || focusInside || !inView || document.hidden
        || track.querySelector('details[open]');
      carousel.classList.toggle('is-paused', Boolean(busy));
      if (!autoplay || busy) return;
      const steps = stepsOf(index);
      if (pinned) return; // tarjeta elegida a mano: queda quieta, sin barras ni avance automático
      const key = `${index}:${step}`;
      if (!seg || seg.key !== key) seg = { key, left: steps.length > 1 ? STEP_MS : (fresh ? FIRST_MS : AUTOPLAY_MS) };
      seg.started = now;
      timer = setTimeout(() => {
        fresh = false;
        seg = null;
        if (steps.length > 1 && step < steps.length - 1) { setStep(step + 1); schedule(); }
        else go(neighbor(1));
      }, Math.max(0, seg.left));
    };
    // "Ver más": uno abierto por vez y solo en la vista activa. `keep`: el desplegable (o grupo) que no se cierra.
    const closeDetails = (keep) => track.querySelectorAll('details[open]').forEach((d) => {
      if (!keep || !keep.contains(d)) d.open = false;
    });
    // --card-h: alto de la tarjeta cerrada más alta (todas iguales en reposo). --arrow-y: mitad del grupo visible con
    // todo cerrado, para centrar las flechas sin que salten al abrir un "Ver más". En celular (de a una tarjeta) las
    // flechas van a los costados de la tarjeta, centradas en su alto cerrado.
    let cardH = 0;
    const placeArrows = () => {
      if (!cardH) return;
      if (perCard) { carousel.style.setProperty('--arrow-y', `${cardH / 2}px`); return; }
      const slide = slides[index];
      const box = getComputedStyle(slide);
      const n = slide.querySelectorAll('.service').length;
      const y = box.flexDirection === 'column' ? (n * cardH + (n - 1) * (parseFloat(box.rowGap) || 0)) / 2 : cardH / 2;
      carousel.style.setProperty('--arrow-y', `${y}px`);
    };
    // Alto cerrado = alto natural - desplegable + su botón. Vale también para una tarjeta abierta o a mitad de la
    // transición de cierre, que si se midiera tal cual dejaría a todas con el alto de la abierta.
    const closedHeight = (card) => {
      const details = card.querySelector('details');
      const summary = details && details.querySelector('summary');
      return details && summary ? card.offsetHeight - details.offsetHeight + summary.offsetHeight : card.offsetHeight;
    };
    const measure = () => {
      if (!cards.length) return;
      track.querySelectorAll('.service > details.more').forEach((d) => d.style.removeProperty('margin-top')); // ver abajo
      carousel.style.setProperty('--card-h', '0px'); // alto natural, sin el mínimo anterior
      cardH = Math.max(...cards.map(closedHeight));
      carousel.style.setProperty('--card-h', `${cardH}px`);
      placeArrows();
    };
    // `data-carousel-fit` (Casos): la pista toma el alto de la vista activa, así un caso corto no queda dentro de una
    // tarjeta estirada al alto del caso más largo. El cambio de alto se anima por CSS.
    // La pista nunca muestra scroll (overflow-y: hidden en el CSS): si el caso activo cambia de alto (fuente, proyecto
    // elegido, ancho), un ResizeObserver lo vuelve a medir. --case-h queda para centrar las flechas en celular.
    // Casos: alto FIJO, el del caso más largo de todos (de los dos sectores) para el ancho actual. El contenido de cada
    // caso va arriba y la fila contador + barra queda siempre a la misma altura: nada se redimensiona al cambiar de
    // caso. Para medir, los casos ocultos (filtro de sector) se muestran un instante, en el mismo cuadro (no se pintan).
    const fit = carousel.hasAttribute('data-carousel-fit');
    let altoFijo = 0;
    let anchoMedido = -1;
    const medirAlto = () => {
      const ocultos = slides.filter((sl) => sl.hidden);
      ocultos.forEach((sl) => { sl.hidden = false; });
      const box = getComputedStyle(track);
      track.style.height = 'auto';
      altoFijo = Math.max(...slides.map((sl) => sl.offsetHeight)) + parseFloat(box.paddingTop) + parseFloat(box.paddingBottom);
      ocultos.forEach((sl) => { sl.hidden = true; });
      anchoMedido = track.clientWidth;
    };
    const fitHeight = (forzar) => {
      if (!fit || !items[index]) return;
      if (forzar === true || track.clientWidth !== anchoMedido) medirAlto();
      track.style.height = `${altoFijo}px`;
      carousel.style.setProperty('--case-h', `${altoFijo}px`);
    };
    // Casos (data-carousel-fit con avance automático): barra de avance junto al contador, que se llena en el tiempo
    // total del caso a la vista (todos sus proyectos). Se pausa con el carrusel (.is-paused) y se oculta con un cliente
    // elegido a mano (.is-pinned).
    const prog = fit && autoplay && !dotsBox.children.length ? document.createElement('span') : null;
    const progFill = prog ? document.createElement('span') : null;
    if (prog) {
      prog.className = 'carousel__progress';
      prog.setAttribute('aria-hidden', 'true');
      progFill.className = 'carousel__progress-fill';
      prog.append(progFill);
    }
    const barra = () => {
      if (!prog) return;
      const n = stepsOf(index).length;
      const total = n > 1 ? n * STEP_MS : (fresh ? FIRST_MS : AUTOPLAY_MS);
      progFill.style.animationName = 'none';
      void progFill.offsetWidth; // reinicia la animación
      progFill.style.animationDuration = `${total}ms`;
      progFill.style.animationDelay = `${n > 1 ? -step * STEP_MS : 0}ms`;
      progFill.style.animationName = 'stepbar';
    };
    const pad = (n) => String(n).padStart(2, '0');
    let cuenta = null;
    const render = () => {
      // De a una tarjeta no se bloquea ninguna: la siguiente asoma y se puede tocar o recorrer con el teclado.
      slides.forEach((slide, i) => { slide.inert = !perCard && i !== index; });
      fitHeight();
      if (cardsMode) { closeDetails(items[index]); placeArrows(); } // al cambiar de vista se cierra lo abierto
      dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === index)));
      if (!dots.length) {
        const mode = carousel.dataset.carouselCounter;
        const pos = pool.indexOf(index) + 1;
        const texto = mode === 'off' ? '' : mode === 'pad' ? `${pad(pos)} / ${pad(pool.length)}` : `${pos} de ${pool.length}`;
        if (prog) {
          // Contador de ancho fijo y barra al lado: la fila nunca cambia de posición ni de largo (ver CSS)
          if (!cuenta) { cuenta = document.createElement('span'); cuenta.className = 'carousel__count'; }
          cuenta.textContent = texto;
          if (cuenta.parentNode !== dotsBox) { dotsBox.textContent = ''; dotsBox.append(cuenta, prog); }
        } else dotsBox.textContent = texto;
      }
      setStep(0);
      seg = null;
      barra();
      carousel.dispatchEvent(new CustomEvent('carousel:change', { detail: { index } })); // el menú de Casos marca el actual
    };
    // Pase de grupo (Servicios y Soluciones, de a tres): mientras la pista se desliza, las tarjetas que llegan suben 14 px
    // y se encienden una detrás de otra (pase de Globant). Con Web Animations, así no pisa la entrada .rv del CSS.
    const entrar = (item) => {
      if (!cardsMode || perCard || !item || typeof item.animate !== 'function') return;
      [...item.querySelectorAll('.service')].forEach((card, k) => card.animate(
        [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }],
        { duration: 700, delay: 120 + k * 80, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'backwards' },
      ));
    };
    // Casos (data-carousel-fit): en vez de deslizar la pista, el caso que se va sale (logo, título, etiquetas y
    // proyectos suben y se funden, .is-saliendo en el CSS) y recién entonces aparece el nuevo con su entrada escalonada
    // (la del CSS, al perder `inert`). Un nuevo pedido durante la salida la corta y cambia enseguida.
    const SALIDA_MS = 320; // salida escalonada del caso (casoSale en el CSS: .24 s + .06 s de ola)
    let salida = 0;
    const go = (i, instant) => {
      const prev = index;
      const next = pool.includes(i) ? i : seq[0];
      clearTimeout(salida);
      slides.forEach((slide) => slide.classList.remove('is-saliendo'));
      const cambiar = (suave) => {
        index = next;
        track.scrollTo({ left: offset(index), behavior: suave ? 'smooth' : 'auto' });
        render();
        if (motion && !instant && index !== prev) entrar(items[index]);
        schedule();
      };
      if (fit && motion && !instant && next !== prev && items[prev] && !items[prev].hidden) {
        clearTimeout(timer);
        items[prev].classList.add('is-saliendo');
        salida = setTimeout(() => { items[prev].classList.remove('is-saliendo'); cambiar(false); }, SALIDA_MS);
        return;
      }
      cambiar(motion && !instant && !fit);
    };
    // Limita el carrusel a un grupo de tarjetas. `pinned`: una sola, elegida a mano (no se pasa a otra). `first`: la
    // tarjeta con la que arranca (un cliente elegido en el menú); desde ahí la rotación sigue sola.
    const setPool = (indices, opts = {}) => {
      pool = indices.length ? [...indices] : items.map((_, i) => i);
      pinned = Boolean(opts.pinned);
      carousel.classList.toggle('is-pinned', pinned);
      slides.forEach((slide, i) => { slide.hidden = !pool.includes(i); });
      dots.forEach((dot, i) => { dot.hidden = !pool.includes(i); });
      const first = pool.includes(opts.first) ? opts.first : (pool.includes(index) && !pinned ? index : undefined);
      buildSeq(first);
      controls.hidden = seq.length < 2;
      go(first !== undefined ? first : seq[0], true);
    };
    // Un punto por vista: por grupo ("Servicios 1 a 3") o, de a una tarjeta, con el nombre de cada una.
    let buildDots = () => {
      dotsBox.textContent = '';
      dots = items.length > MAX_DOTS ? [] : items.map((item, i) => {
        const dot = document.createElement('button');
        const title = perCard && item.querySelector('.service__title');
        dot.type = 'button';
        dot.className = 'carousel__dot';
        dot.setAttribute('aria-label', title ? title.textContent.trim() : item.getAttribute('aria-label'));
        dot.addEventListener('click', () => go(i));
        dotsBox.append(dot);
        return dot;
      });
    };
    // En pantallas táctiles chicas los puntos son solo indicadores (no llegan a 44 px): fuera del orden de Tab y del
    // árbol de accesibilidad; se navega con las flechas y deslizando (ver "Pantallas táctiles chicas" en el CSS).
    const tactilChico = matchMedia('(max-width: 600px), (max-height: 430px) and (pointer: coarse)');
    const marcarPuntos = () => dots.forEach((dot) => {
      dot.tabIndex = tactilChico.matches ? -1 : 0;
      if (tactilChico.matches) dot.setAttribute('aria-hidden', 'true'); else dot.removeAttribute('aria-hidden');
    });
    const buildDotsBase = buildDots;
    buildDots = () => { buildDotsBase(); marcarPuntos(); };
    tactilChico.addEventListener('change', marcarPuntos);
    buildDots();
    // Cambio de ancho que cruza el corte de celular: se pasa de grupos a tarjetas (o al revés) y queda a la vista la
    // misma tarjeta, o el grupo que la contiene.
    const relayout = () => {
      const next = singles();
      if (next === perCard) return;
      const current = items[index];
      perCard = next;
      items = perCard ? cards : slides;
      index = perCard
        ? Math.max(0, cards.indexOf(current.querySelector('.service') || current))
        : Math.max(0, slides.findIndex((slide) => slide.contains(current)));
      pool = items.map((_, i) => i);
      buildSeq(index);
      buildDots();
      controls.hidden = seq.length < 2;
      go(index, true);
    };

    carousel.querySelector('[data-carousel-prev]').addEventListener('click', () => go(linear(-1)));
    carousel.querySelector('[data-carousel-next]').addEventListener('click', () => go(linear(1)));
    // Elegir un proyecto a mano dentro de la tarjeta activa
    track.addEventListener('click', (e) => {
      const li = e.target.closest('[data-steps] > li');
      if (!li || !items[index].contains(li)) return;
      setStep(stepsOf(index).indexOf(li));
      barra();
      schedule();
    });

    // Deslizar con el dedo: al terminar el scroll, el grupo más cercano pasa a ser el activo.
    let settle = 0;
    track.addEventListener('scroll', () => {
      clearTimeout(settle);
      settle = setTimeout(() => {
        const x = track.scrollLeft;
        const nearest = pool.reduce((best, i) => (Math.abs(offset(i) - x) < Math.abs(offset(best) - x) ? i : best), pool[0]);
        if (nearest === index) return;
        index = nearest;
        render();
        schedule();
      }, 120);
    }, { passive: true });

    track.addEventListener('pointerenter', () => { hovering = true; schedule(); });
    track.addEventListener('pointerleave', () => { hovering = false; schedule(); });
    // El foco que pone el código (al llegar desde un logo de Clientes) no cuenta: la rotación sigue sola.
    track.addEventListener('focusin', (e) => {
      if (e.target.dataset && e.target.dataset.progFocus) { delete e.target.dataset.progFocus; return; }
      focusInside = true;
      schedule();
    });
    track.addEventListener('focusout', (e) => {
      if (track.contains(e.relatedTarget)) return;
      focusInside = false;
      schedule();
    });
    track.addEventListener('toggle', schedule, true); // el `toggle` de <details> no burbujea
    document.addEventListener('visibilitychange', schedule);
    addEventListener('resize', () => { fitHeight(); track.scrollTo({ left: offset(index), behavior: 'auto' }); });
    if (fit && document.fonts) document.fonts.ready.then(() => fitHeight(true)); // la fuente cambia el alto del texto
    if (fit) addEventListener('load', () => fitHeight(true)); // los logos ya tienen su alto
    new IntersectionObserver((entries) => {
      inView = lastEntry(entries).isIntersecting;
      if (inView) fresh = true;
      schedule();
    }, { threshold: 0.4 }).observe(carousel);

    if (cardsMode) {
      // Abrir un "Ver más" cierra el que estaba abierto (el `toggle` no burbujea: se escucha en captura)
      // En celular las tarjetas van apiladas: si el que se cierra está arriba, todo lo de abajo sube y el botón recién
      // tocado se va de debajo del dedo. Ese se cierra sin transición (.is-snap) y se corrige el scroll por lo que se
      // movió el botón, así queda donde estaba. Con las tarjetas en fila no hay nada arriba y el ajuste da 0.
      // El "Ver más" va al pie con margin-top: auto. Al abrir, el texto se come primero ese espacio libre y el botón sube
      // dentro de la propia tarjeta. Al tocarlo se fija el margen en px (el que tenía cerrado): la tarjeta crece hacia
      // abajo y el botón no se mueve. Se libera cuando terminó de cerrarse (0,35 s de transición) o al volver a medir.
      track.addEventListener('click', (e) => {
        const summary = e.target.closest('summary');
        const details = summary && summary.parentElement;
        if (details && details.matches('.service > details.more')) details.style.marginTop = getComputedStyle(details).marginTop;
      }, true);
      track.addEventListener('toggle', (e) => {
        const d = e.target;
        if (d.matches('.service > details.more') && !d.open) setTimeout(() => { if (!d.open) d.style.removeProperty('margin-top'); }, 400);
      }, true);
      track.addEventListener('toggle', (e) => {
        const opened = e.target;
        if (!opened.open || !opened.matches('details')) return;
        const summary = opened.querySelector('summary');
        if (!summary) { closeDetails(opened); return; }
        const y0 = summary.getBoundingClientRect().top;
        track.querySelectorAll('details[open]').forEach((d) => {
          if (d !== opened && !d.contains(opened) && d.getBoundingClientRect().bottom <= y0) d.classList.add('is-snap');
        });
        closeDetails(opened);
        const dy = summary.getBoundingClientRect().top - y0; // fuerza el layout ya con el cierre aplicado
        if (Math.abs(dy) > 1) scrollBy({ top: dy, left: 0, behavior: 'instant' });
        // Dos cuadros después se devuelve la transición, para que la próxima apertura siga siendo suave
        requestAnimationFrame(() => requestAnimationFrame(() => {
          track.querySelectorAll('details.is-snap').forEach((d) => d.classList.remove('is-snap'));
        }));
      }, true);
      // Al salir de la sección se cierra lo abierto: al volver, las tarjetas están parejas y el carrusel avanza
      new IntersectionObserver((entries) => {
        if (!lastEntry(entries).isIntersecting) closeDetails();
      }).observe(carousel.closest('section[id]') || carousel);
      // Se vuelve a medir solo si cambia el ancho (en celular el resize salta con la barra de direcciones)
      let lastW = innerWidth;
      let measureRaf = 0;
      addEventListener('resize', () => {
        if (innerWidth === lastW) return;
        lastW = innerWidth;
        relayout();
        cancelAnimationFrame(measureRaf);
        measureRaf = requestAnimationFrame(measure);
      });
      measure();
      if (document.fonts) document.fonts.ready.then(measure); // la fuente cambia el alto de los títulos
    }

    controls.hidden = seq.length < 2;
    if (random) track.scrollTo({ left: offset(index), behavior: 'auto' }); // arranca en una tarjeta al azar
    render();
    return { slides, setPool, current: () => index };
  };
  const carousels = new Map();
  document.querySelectorAll('[data-carousel]').forEach((c) => carousels.set(c, initCarousel(c)));

  /* ---------- Casos: menú (sector → cliente) ---------- */
  // Se arma con los datos de las tarjetas: sector por el eyebrow, logo por .case-card__logo. Arranca con "Sector
  // público" elegido, así los botones de cliente se ven desde el inicio. Siempre hay un sector elegido (no hay
  // "Todos"): los casos de ese sector pasan solos, en orden aleatorio. Elegir un cliente muestra su caso y la rotación
  // sigue desde ahí. El logo del caso a la vista queda marcado (aria-current) y acompaña la rotación.
  const caseMenu = document.querySelector('[data-case-menu]');
  const caseCarousel = caseMenu && caseMenu.parentElement.querySelector('[data-carousel]');
  if (caseMenu && carousels.has(caseCarousel)) {
    const api = carousels.get(caseCarousel);
    const fileOf = (src) => (src || '').replace(/[?#].*$/, '').replace(/^.*\//, ''); // sin carpeta ni versión (?v=)
    const cases = api.slides.map((slide, i) => {
      const logo = slide.querySelector('.case-card__logo');
      const img = logo && logo.querySelector('img');
      return {
        i,
        name: slide.querySelector('.case-card__name').textContent.trim(),
        sector: /privad/i.test(slide.querySelector('.case-card__who .eyebrow').textContent) ? 'privado' : 'publico',
        logoSrc: img ? img.getAttribute('src') : '',
        // Logos de la cinta que también abren este caso (otro logo del mismo cliente: GCBA → ASI, Medifé → ASE Nacional)
        alias: (slide.dataset.caseLogos || '').split(/\s+/).filter(Boolean),
      };
    });
    const sectorBtns = [...caseMenu.querySelectorAll('[data-sector]')];
    const clientsBox = caseMenu.querySelector('[data-case-clients]');
    const logosList = caseMenu.querySelector('[data-case-logos]');
    const pressed = sectorBtns.find((b) => b.getAttribute('aria-pressed') === 'true');
    let sector = pressed ? pressed.dataset.sector : 'publico';
    let renderedSector = null;

    const renderLogos = () => {
      if (renderedSector === sector) return;
      renderedSector = sector;
      logosList.replaceChildren();
      cases.filter((c) => c.sector === sector).forEach((c, k) => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'case-menu__logo';
        btn.dataset.case = c.i;
        btn.setAttribute('aria-label', `Ver el caso de ${c.name}`); // sin title: nada de globos nativos
        btn.style.animationDelay = `${Math.min(k, 12) * 0.03}s`;
        if (c.logoSrc) {
          const img = document.createElement('img');
          img.src = c.logoSrc; img.alt = ''; img.loading = 'lazy'; img.decoding = 'async';
          btn.append(img);
        } else {
          btn.textContent = c.name;
        }
        li.append(btn);
        logosList.append(li);
      });
    };
    // Marca el logo del caso a la vista. En celular (tira de costado) lo deja visible sin mover la página.
    const markCurrent = (i) => {
      logosList.querySelectorAll('[data-case]').forEach((btn) => {
        const on = Number(btn.dataset.case) === i;
        btn.setAttribute('aria-current', String(on));
        if (on && logosList.scrollWidth > logosList.clientWidth + 2) {
          const left = btn.parentElement.offsetLeft - (logosList.clientWidth - btn.offsetWidth) / 2;
          logosList.scrollTo({ left, behavior: motion ? 'smooth' : 'auto' });
        }
      });
    };
    caseCarousel.addEventListener('carousel:change', (e) => markCurrent(e.detail.index));
    const apply = (first) => {
      sectorBtns.forEach((btn) => btn.setAttribute('aria-pressed', String(btn.dataset.sector === sector)));
      clientsBox.hidden = false;
      renderLogos();
      api.setPool(cases.filter((c) => c.sector === sector).map((c) => c.i), { first });
      markCurrent(api.current());
    };
    caseMenu.addEventListener('click', (e) => {
      const sBtn = e.target.closest('[data-sector]');
      const lBtn = e.target.closest('[data-case]');
      if (sBtn) {
        if (sBtn.dataset.sector === sector) return;
        sector = sBtn.dataset.sector;
        apply();
      } else if (lBtn) {
        apply(Number(lBtn.dataset.case));
      }
    });
    caseMenu.hidden = false;
    caseMenu.parentElement.classList.add('cases-layout--menu');
    apply();
    // Para que otras secciones (la cinta de Clientes) puedan abrir un caso por el archivo del logo
    const byLogo = (src) => {
      const f = fileOf(src);
      return cases.find((x) => x.logoSrc && fileOf(x.logoSrc) === f) || cases.find((x) => x.alias.includes(f));
    };
    caseMenu.selectByLogo = (src) => {
      const c = byLogo(src);
      if (!c) return false;
      sector = c.sector;
      apply(c.i);
      return true;
    };
    // Lleva el foco al caso a la vista (teclado y lectores de pantalla: no hay que recorrer el resto de la cinta).
    // Ese foco puesto por código no detiene la rotación automática (data-prog-focus, ver focusin del carrusel).
    caseMenu.focusCurrent = () => {
      const name = api.slides[api.current()].querySelector('.case-card__name');
      if (!name) return;
      name.tabIndex = -1;
      name.dataset.progFocus = '1';
      name.focus({ preventScroll: true });
      delete name.dataset.progFocus;
    };
    caseMenu.hasLogo = (src) => Boolean(byLogo(src));
  }

  /* ---------- Clientes: fichero por rubro con bandas de logos en movimiento ---------- */
  // Las listas del HTML (una por rubro, en su panel) son la fuente. Arriba, las solapas de rubro en una fila (sin
  // "Todos"; con flechas, Inicio y Fin). Se ve un rubro por vez.
  // - Avance automático: cada rubro dura ROTA_MS; la solapa activa muestra una barra fina que se llena con ese tiempo
  //   (animación CSS) y, al terminar (animationend), pasa al siguiente rubro y vuelve al primero al final. Un clic
  //   elige el rubro y el ciclo sigue desde ahí. Sin botón de pausa: solo se detiene fuera de pantalla (y el navegador
  //   lo frena solo con la pestaña oculta). Con "reducir movimiento" no hay avance automático.
  // - Cambio de rubro: el panel que sale se funde corriéndose apenas a la izquierda y el que entra llega desde la
  //   derecha (CSS: .is-saliendo / .is-entrando).
  // - Bandas: rubros con 10 logos o más van en dos filas (mitad y mitad); con menos, en una. Una fila va hacia la
  //   izquierda; con dos, la de arriba hacia la izquierda y la de abajo hacia la derecha. Cada fila es una pista con su
  //   lista repetida hasta cubrir el ancho y una copia exacta; el CSS la mueve -50% (o al revés) y el loop no salta ni
  //   deja huecos. Las repeticiones y la copia van con aria-hidden y sin foco (cada logo se anuncia una sola vez).
  //   Las bandas no se detienen con el mouse encima: solo fuera de pantalla (.is-offscreen).
  // - Logos en gris; el que está bajo el mouse (o enfocado) toma su color. Los que tienen caso de éxito son enlaces a
  //   #casos que además dejan elegido su caso en el menú de Casos.
  // - Con "reducir movimiento": una grilla quieta y prolija por rubro (sin copias).
  // Cualquier `[data-cinta]` de la página: el fichero de la home (con solapas) o una banda suelta con un solo panel
  // (la de /diagnostico-sin-cargo/, con todos los clientes en dos filas).
  document.querySelectorAll('[data-cinta]').forEach((cinta) => {
    const SPEED = 34; // px por segundo
    const DOS_FILAS = 10; // desde esta cantidad de logos, el rubro va en dos filas
    const panels = [...cinta.querySelectorAll('[data-cinta-panel]')];
    const casesMenu = document.querySelector('[data-case-menu]');
    const sources = new Map(panels.map((panel) => [panel, [...panel.querySelector('.cinta__list').children]]));

    // Logos con caso: el img queda dentro de un enlace con el aviso "Ver caso"
    if (casesMenu && casesMenu.hasLogo) {
      sources.forEach((items) => items.forEach((li) => {
        const img = li.querySelector('img');
        if (!casesMenu.hasLogo(img.getAttribute('src'))) return;
        const a = document.createElement('a');
        a.className = 'cinta__link';
        a.href = '#casos';
        a.setAttribute('aria-label', `${img.alt}: ver caso de éxito`);
        const cue = document.createElement('span');
        cue.className = 'cinta__cue';
        cue.setAttribute('aria-hidden', 'true');
        cue.innerHTML = 'Ver caso <span class="arr">→</span>';
        img.replaceWith(a);
        a.append(img, cue);
      }));
    }

    const quiet = (node) => {
      node.setAttribute('aria-hidden', 'true');
      node.querySelectorAll('a').forEach((a) => { a.tabIndex = -1; });
      node.querySelectorAll('img').forEach((img) => { img.alt = ''; });
      return node;
    };
    const built = new Map(); // panel -> ancho para el que se armó
    // Arma las filas del panel con los li originales (antes devuelve los li a su lista, si ya estaba armado)
    const build = (panel) => {
      const width = cinta.clientWidth;
      if (built.get(panel) === width) return;
      const items = sources.get(panel);
      const source = panel.querySelector(':scope > .cinta__list');
      if (panel.querySelector('.cinta__row')) {
        items.forEach((li) => source.append(li));
        panel.querySelectorAll('.cinta__row').forEach((row) => row.remove());
      }
      built.set(panel, width);
      source.hidden = true; // queda vacía: los li pasan a las filas
      // Quieta (reducir movimiento): todos los logos del rubro en una sola grilla
      const mitad = motion && items.length >= DOS_FILAS ? Math.ceil(items.length / 2) : items.length;
      const filas = mitad < items.length ? [items.slice(0, mitad), items.slice(mitad)] : [items];
      panel.classList.toggle('is-dos-filas', filas.length > 1);
      filas.forEach((grupo, f) => {
        const row = document.createElement('div');
        row.className = `cinta__row cinta__row--${f === 0 ? 'a' : 'b'}`; // a: hacia la izquierda; b: hacia la derecha
        const track = document.createElement('div');
        track.className = 'cinta__track';
        const set = document.createElement('ul');
        set.className = 'cinta__list list-reset';
        set.setAttribute('aria-label', (source.getAttribute('aria-label') || '') + (filas.length > 1 ? ` (${f + 1} de 2)` : ''));
        grupo.forEach((li) => set.append(li));
        track.append(set);
        row.append(track);
        panel.append(row);
        if (!motion) return; // quieta (reducir movimiento): sin repeticiones ni copia
        // Repetir dentro de la fila hasta cubrir el ancho real de la fila con margen (un logo más del ancho de la
        // ventana): así, en cualquier instante del recorrido, la banda llena todo el ancho visible, sin huecos
        const base = [...set.children];
        const fila = Math.max(width, row.clientWidth, panel.clientWidth);
        const margen = Math.max(...base.map((li) => li.offsetWidth)) + 200;
        let guard = 0;
        while (set.scrollWidth < fila + margen && guard++ < 24) base.forEach((li) => set.append(quiet(li.cloneNode(true))));
        track.append(quiet(set.cloneNode(true)));
        track.style.setProperty('--cinta-dur', `${Math.max(20, set.scrollWidth / SPEED).toFixed(1)}s`);
      });
    };

    cinta.classList.add('is-cinta');

    // Solapas de rubro y avance automático
    const fichero = cinta.closest('[data-cl-fichero]');
    const tabs = fichero ? [...fichero.querySelectorAll('[role="tab"]')] : [];
    const panelDe = (tab) => document.getElementById(tab.getAttribute('aria-controls'));
    let actual = tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0];
    let saliendo = 0;
    const elegir = (tab, foco) => {
      if (!tab) return;
      const anterior = actual ? panelDe(actual) : null;
      const nuevo = panelDe(tab);
      actual = tab;
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        t.classList.remove('is-corriendo');
      });
      // La barra de progreso arranca de cero en la solapa nueva
      void tab.offsetWidth;
      tab.classList.add('is-corriendo');
      if (foco) tab.focus();
      if (!nuevo || nuevo === anterior) return;
      const entrar = () => {
        panels.forEach((p) => { p.hidden = p !== nuevo; p.classList.remove('is-saliendo', 'is-entrando'); });
        build(nuevo);
        void nuevo.offsetWidth;
        nuevo.classList.add('is-entrando');
      };
      clearTimeout(saliendo);
      if (motion && anterior && !anterior.hidden) {
        anterior.classList.remove('is-entrando');
        anterior.classList.add('is-saliendo');
        saliendo = setTimeout(entrar, 260);
      } else entrar();
    };
    if (tabs.length) {
      panels.forEach((p) => { p.hidden = p !== panelDe(actual); });
      tabs.forEach((t) => t.addEventListener('click', () => elegir(t, false)));
      tabs[0].parentElement.addEventListener('keydown', (e) => {
        const i = tabs.indexOf(document.activeElement);
        if (i < 0) return;
        const pasos = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
        let j = null;
        if (e.key in pasos) j = (i + pasos[e.key] + tabs.length) % tabs.length;
        else if (e.key === 'Home') j = 0;
        else if (e.key === 'End') j = tabs.length - 1;
        if (j === null) return;
        e.preventDefault();
        elegir(tabs[j], true);
      });
      // Fin de la barra de progreso de la solapa activa: pasa al rubro siguiente
      tabs.forEach((t) => t.addEventListener('animationend', (e) => {
        if (e.animationName !== 'clProgreso' || t !== actual) return;
        elegir(tabs[(tabs.indexOf(t) + 1) % tabs.length], false);
      }));
      if (motion) actual.classList.add('is-corriendo');
    }
    panels.forEach((panel) => { if (!panel.hidden) build(panel); });

    // Se vuelve a armar si cambia el ancho real de la banda (ventana, zoom, barra de desplazamiento que aparece), no solo
    // con el resize de la ventana. Los rubros ocultos se arman de nuevo al mostrarse (build compara el ancho).
    let raf = 0;
    const rearmar = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => panels.forEach((panel) => { if (!panel.hidden) build(panel); }));
    };
    if ('ResizeObserver' in window) new ResizeObserver(rearmar).observe(cinta);
    else addEventListener('resize', rearmar);

    cinta.addEventListener('click', (e) => {
      const a = e.target.closest('.cinta__link');
      if (!a || !casesMenu) return;
      const img = a.querySelector('img');
      if (!casesMenu.selectByLogo(img.getAttribute('src'))) return; // sin caso cruzado: sigue el ancla común
      e.preventDefault();
      e.stopPropagation(); // la medición la hace este módulo, no el listener general de anclas
      document.getElementById('casos').scrollIntoView({ behavior: motion ? 'smooth' : 'auto' });
      // Con teclado (Enter: e.detail 0) el foco pasa al caso; con mouse o dedo solo se desplaza la página
      if (e.detail === 0 && casesMenu.focusCurrent) casesMenu.focusCurrent();
      (window.dataLayer = window.dataLayer || []).push({ event: 'internal_nav', link_text: img.alt || a.getAttribute('aria-label'), link_target: '#casos', link_from: 'clientes' });
    });

    // Fuera de pantalla se detienen las bandas y la barra de progreso (y con ella el avance entre rubros)
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        (fichero || cinta).classList.toggle('is-offscreen', !lastEntry(entries).isIntersecting);
      }).observe(fichero || cinta);
    }
  });

  /* ---------- Socios tecnológicos: slots que rotan en barrido ---------- */
  // Dos grillas (mayoristas arriba, marcas abajo), cada una muestra una fila (tres en celular) y guarda el resto de
  // sus logos en una cola propia. Al entrar en pantalla, a los 3 s arranca el recambio: cada STEP_MS cambia una fila
  // entera, alternando mayoristas y fabricantes, en una ola de izquierda a derecha (WAVE_MS entre un logo y el
  // siguiente). Cada celda toma el próximo logo de su cola y manda el suyo al final.
  // El cambio es un fundido cruzado con un leve desplazamiento y escala (css: .slot img.is-in / .is-out): el logo nuevo
  // se decodifica antes, se apila sobre el actual, el que sale sube y se achica apenas mientras el nuevo entra desde
  // abajo, así la celda nunca queda vacía. Con "reducir movimiento" no hay recambio: se ven todos los logos quietos.
  const slotsWrap = document.querySelector('[data-slots-groups]');
  if (slotsWrap && motion) {
    const START_MS = 3000;  // espera antes del primer giro (la sección se ve quieta primero)
    const STEP_MS = 4200;   // entre el recambio de una fila y el de la siguiente
    const WAVE_MS = 110;    // escalonado entre un logo y el siguiente dentro de la ola
    const FLIP_MS = 700;    // mismo valor que la transición de .slot img en styles.css
    const fill = (img, logo) => {
      img.src = logo.src; img.alt = logo.alt; img.width = logo.w; img.height = logo.h;
      img.style.setProperty('--lf', logo.lf);
    };
    const setLogo = (li, logo) => {
      li.querySelectorAll('img.is-out, img.is-in').forEach((el) => el.remove());
      fill(li.querySelector('img'), logo);
    };
    const grids = [...slotsWrap.querySelectorAll('[data-slots]')].map((grid) => {
      const cells = [...grid.children];
      const logos = cells.map((li) => {
        const img = li.querySelector('img');
        return { src: img.getAttribute('src'), alt: img.alt, w: img.width, h: img.height, lf: img.style.getPropertyValue('--lf') || '.6' };
      });
      return { grid, cells, logos, visible: 0, shown: [], queue: [] };
    });
    let timer = 0;
    let inView = false;
    let cursor = 0;
    let hovering = false;
    let focusInside = false;
    const layout = () => {
      grids.forEach((g) => {
        const cols = getComputedStyle(g.grid).gridTemplateColumns.split(' ').length;
        const n = Math.min(g.cells.length, cols * (cols <= 2 ? 3 : 1));
        if (n === g.visible) return;
        g.visible = n;
        g.shown = g.logos.map((_, i) => i).slice(0, n);
        g.queue = g.logos.map((_, i) => i).slice(n);
        g.cells.forEach((li, i) => { li.hidden = i >= n; if (i < n) setLogo(li, g.logos[i]); });
      });
    };
    const flipCell = (g, cell, delay = 0) => {
      if (!g.queue.length) return;
      const incoming = g.queue.shift();
      g.queue.push(g.shown[cell]);
      g.shown[cell] = incoming;
      const li = g.cells[cell];
      const current = li.querySelector('img:not(.is-out)');
      const next = document.createElement('img');
      next.decoding = 'async';
      next.className = 'is-in';
      fill(next, g.logos[incoming]);
      const swap = () => {
        if (!current || !current.isConnected) return;
        li.append(next);
        current.alt = '';
        next.style.transitionDelay = `${delay + 90}ms`; // el nuevo entra apenas después de que el otro empieza a salir
        current.style.transitionDelay = `${delay}ms`;
        requestAnimationFrame(() => requestAnimationFrame(() => {
          next.classList.remove('is-in');
          current.classList.add('is-out');
          setTimeout(() => { current.remove(); next.style.transitionDelay = ''; }, FLIP_MS + delay + 160);
        }));
      };
      (next.decode ? next.decode() : Promise.resolve()).then(swap, swap);
    };
    const schedule = (first) => {
      clearTimeout(timer);
      if (!inView || document.hidden || hovering || focusInside) return;
      timer = setTimeout(() => {
        const g = grids[cursor % grids.length];
        for (let k = 0; k < g.visible; k++) flipCell(g, k, k * WAVE_MS);
        cursor = (cursor + 1) % grids.length;
        schedule(false);
      }, first ? START_MS : STEP_MS);
    };
    layout();
    addEventListener('resize', layout);
    document.addEventListener('visibilitychange', () => schedule(true));
    // Como en los carruseles: se detiene con el mouse encima o el foco adentro. Al retomar se espera el arranque corto
    // (START_MS), no un paso entero.
    slotsWrap.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { hovering = true; schedule(true); } });
    slotsWrap.addEventListener('pointerleave', () => { hovering = false; schedule(true); });
    slotsWrap.addEventListener('focusin', () => { focusInside = true; schedule(true); });
    slotsWrap.addEventListener('focusout', (e) => {
      if (slotsWrap.contains(e.relatedTarget)) return;
      focusInside = false;
      schedule(true);
    });
    new IntersectionObserver((entries) => {
      inView = lastEntry(entries).isIntersecting;
      schedule(true);
    }, { threshold: 0.3 }).observe(slotsWrap);
  }

  /* ---------- Presencia: slider Argentina / Latam ---------- */
  // Dos vistas apiladas (la grilla del CSS les da el alto de la más alta, así la página no salta al cambiar). Pestañas
  // con el patrón de tabs (flechas, Inicio y Fin), flechas y deslizar con el dedo.
  // Avance automático hasta la primera interacción del visitante (desde ahí queda en la vista elegida): la vista cambia
  // recién cuando el recorrido de su mapa terminó de pasar por TODAS sus zonas (evento map:tour-end, ver Mapas), así
  // Argentina → Latam → Argentina… sin cortar el recorrido a la mitad. AUTO_MS queda solo como respaldo para una vista
  // sin recorrido. Se detiene con el mouse encima, con el foco adentro, fuera de pantalla y con la pestaña oculta
  // (.is-pausa, que también frena el recorrido del mapa); con "reducir movimiento" no avanza. Sin botón de pausa.
  // Al cambiar de vista se suelta la zona fijada del mapa que se va (evento map:clear) y el mapa que entra se "prende"
  // recién cuando se ve (evento pres:show, ver Mapas).
  const presSlider = document.querySelector('[data-pres-slider]');
  if (presSlider) {
    const AUTO_MS = 9000;
    const bar = presSlider.querySelector('[data-pres-bar]');
    const slides = [...presSlider.querySelectorAll('[data-pres-slide]')];
    const tabs = slides.map((sl) => document.getElementById(sl.dataset.presTab));
    let actual = 0;
    let tocado = false; // el visitante ya eligió: no hay más avance automático
    let hovering = false;
    let focusInside = false;
    let inView = false;
    let timer = 0;

    presSlider.classList.add('is-slider');
    bar.hidden = false;
    const stage = presSlider.querySelector('[data-pres-stage]');
    const arrows = [...presSlider.querySelectorAll('[data-pres-prev], [data-pres-next]')];
    arrows.forEach((btn) => { btn.hidden = false; });
    // Flechas a los costados, centradas en alto sobre el mapa de la vista activa (en escritorio coincide con el centro
    // del contenido; en celular, el texto va arriba y el mapa abajo, y las flechas quedan sobre el mapa).
    const placeArrows = () => {
      const card = slides[actual] && slides[actual].querySelector('.map-card');
      if (!stage || !card) return;
      // offsetTop (no getBoundingClientRect): no cuenta el desplazamiento de la animación de entrada de la vista
      let y = card.offsetHeight / 2;
      for (let el = card; el && el !== stage; el = el.offsetParent) y += el.offsetTop;
      stage.style.setProperty('--pres-arrow-y', `${Math.round(y)}px`);
    };
    addEventListener('resize', placeArrows);
    if ('ResizeObserver' in window) new ResizeObserver(placeArrows).observe(stage);
    slides.forEach((sl, i) => {
      sl.setAttribute('role', 'tabpanel');
      sl.setAttribute('aria-labelledby', tabs[i].id);
      sl.tabIndex = -1;
    });

    const mostrar = (i, { foco = false } = {}) => {
      const n = (i + slides.length) % slides.length;
      const prev = slides[actual];
      if (n !== actual) prev.querySelectorAll('[data-map]').forEach((m) => m.dispatchEvent(new Event('map:clear')));
      actual = n;
      slides.forEach((sl, k) => {
        const on = k === n;
        sl.classList.toggle('is-active', on);
        sl.inert = !on;
        tabs[k].setAttribute('aria-selected', String(on));
        tabs[k].tabIndex = on ? 0 : -1;
      });
      presSlider.dataset.presActual = slides[n].id;
      placeArrows();
      slides[n].dispatchEvent(new Event('pres:show'));
      if (foco) tabs[n].focus();
      programar();
    };
    const conRecorrido = (sl) => !!sl.querySelector('[data-map][data-map-tour]');
    const programar = () => {
      clearTimeout(timer);
      const pausa = hovering || focusInside || !inView || document.hidden;
      presSlider.classList.toggle('is-pausa', pausa);
      presSlider.toggleAttribute('data-pres-auto', motion && !tocado);
      if (!motion || tocado || pausa || conRecorrido(slides[actual])) return;
      timer = setTimeout(() => mostrar(actual + 1), AUTO_MS);
    };
    // El mapa de la vista activa terminó de recorrer todas sus zonas: pasa a la otra vista (solo en modo automático).
    // Si el visitante ya eligió una vista, no se cancela el evento y el recorrido vuelve a empezar en la misma.
    presSlider.addEventListener('map:tour-end', (e) => {
      // Con el mouse o el foco en el slider no cambia de vista: el recorrido vuelve a empezar en la misma
      if (!motion || tocado || presSlider.classList.contains('is-pausa') || !slides[actual].contains(e.target)) return;
      e.preventDefault();
      mostrar(actual + 1);
    });
    const elegir = (i, opts) => { tocado = true; mostrar(i, opts); };

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => elegir(i));
      tab.addEventListener('keydown', (e) => {
        const dir = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 1, ArrowUp: -1 }[e.key];
        if (dir) { e.preventDefault(); elegir(i + dir, { foco: true }); } else if (e.key === 'Home') { e.preventDefault(); elegir(0, { foco: true }); } else if (e.key === 'End') { e.preventDefault(); elegir(slides.length - 1, { foco: true }); }
      });
    });
    presSlider.querySelector('[data-pres-prev]').addEventListener('click', () => elegir(actual - 1));
    presSlider.querySelector('[data-pres-next]').addEventListener('click', () => elegir(actual + 1));

    // Deslizar con el dedo sobre la vista (no sobre el mapa vertical de Argentina: ahí el dedo scrollea la página)
    const track = presSlider.querySelector('[data-pres-track]');
    let x0 = null;
    let y0 = null;
    track.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    track.addEventListener('touchend', (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      const dy = e.changedTouches[0].clientY - y0;
      x0 = null;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) elegir(actual + (dx < 0 ? 1 : -1));
    }, { passive: true });

    presSlider.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { hovering = true; programar(); } });
    presSlider.addEventListener('pointerleave', () => { hovering = false; programar(); });
    presSlider.addEventListener('focusin', () => { focusInside = true; programar(); });
    presSlider.addEventListener('focusout', (e) => { if (!presSlider.contains(e.relatedTarget)) { focusInside = false; programar(); } });
    document.addEventListener('visibilitychange', programar);
    new IntersectionObserver((entries) => { inView = lastEntry(entries).isIntersecting; programar(); }, { threshold: 0.4 }).observe(presSlider);

    // Enlaces a una vista (#presencia-regional en las preguntas frecuentes, o la URL con ese ancla)
    const porHash = (hash) => slides.findIndex((sl) => `#${sl.id}` === hash);
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href*="#presencia"]');
      if (!anclaLocal(a)) return;
      const i = porHash(a.hash);
      if (i !== -1) elegir(i);
    });
    const desdeUrl = porHash(location.hash);
    mostrar(desdeUrl === -1 ? 0 : desdeUrl);
    if (desdeUrl !== -1) tocado = true;
  }

  /* ---------- Mapas (provincias y países) ---------- */
  // Cada `[data-map]` pinta sus zonas con `on` y las prende de a una al entrar en pantalla (en el orden de
  // `data-map-order`, o el del documento). Al pasar el mouse, enfocar o tocar una zona (o su chip en
  // `.map-zones`), aparece un indicador (etiqueta con el nombre, línea guía y punto sobre la zona) y el resto del
  // mapa se atenúa y desenfoca.
  // Solo las zonas con presencia responden; las grises quedan como dibujo.
  // Teclado: se recorren los chips (una parada por zona, con aria-pressed); el foco muestra el indicador, Enter o
  // espacio fijan la zona y Escape la suelta. Las zonas del SVG no son paradas de Tab (serían el mismo recorrido
  // dos veces): el SVG queda como imagen con su aria-label, que ya lista las zonas. Tocar fuera también la suelta.
  // Sin leyenda ni chips visibles (reunión del 06/11/2026): las zonas se nombran en el aria-label del mapa y el
  // indicador muestra solo el nombre. Si se vuelven a sumar chips (.map-zones [data-zone]), el código los toma solo.
  // Sin JS queda el mapa con los <title> como tooltip.
  const MAP_ON = 'Con proyectos realizados'; // solo para lectores de pantalla
  const header = document.querySelector('.site-header');
  const headerBottom = () => (header ? header.getBoundingClientRect().bottom : 0);
  // Al scrollear con el mouse quieto, Chrome dispara pointerover/pointerenter sobre lo que queda debajo del cursor
  // (mismas coordenadas que el último movimiento). Esos eventos no son hover real: si se tomaran, el indicador saltaría
  // a otra zona mientras se scrollea hacia la fijada o se recorre con Tab. Se guarda la última posición del puntero
  // (en captura, antes que los handlers del mapa) y solo cuenta el evento que llega con coordenadas nuevas.
  let ptrX = NaN;
  let ptrY = NaN;
  let ptrMoved = false;
  addEventListener('pointermove', (e) => {
    ptrMoved = e.clientX !== ptrX || e.clientY !== ptrY;
    ptrX = e.clientX;
    ptrY = e.clientY;
  }, { capture: true, passive: true });
  const realPointer = (e) => (e.type === 'pointermove' ? ptrMoved : e.clientX !== ptrX || e.clientY !== ptrY);

  document.querySelectorAll('[data-map]').forEach((map) => {
    const zones = [...map.querySelectorAll('.prov')];
    const active = zones.filter((z) => z.classList.contains('on'));
    const order = (map.dataset.mapOrder || '').split('|').filter(Boolean);
    const isRegion = map.classList.contains('armap--region');
    try {
      const names = new Intl.ListFormat('es').format(active.map((p) => p.dataset.name));
      map.setAttribute('aria-label', isRegion
        ? `Mapa de Latinoamérica por países. ${MAP_ON}: ${names}.`
        : `Mapa de Argentina por provincias. ${MAP_ON}: ${names}.`);
    } catch (e) { /* queda la descripción del HTML */ }

    // Paso del recorrido de cada zona ("A+B" es un solo paso con dos zonas): define también el orden en que se prenden
    const rank = (p) => { const i = order.findIndex((paso) => paso.split('+').includes(p.dataset.name)); return i === -1 ? order.length : i; };
    if (motion) {
      [...active].sort((a, b) => rank(a) - rank(b)).forEach((p, i) => { p.style.animationDelay = `${0.3 + i * 0.08}s`; });
      // Se prenden una sola vez, como el resto de las entradas de la página. Si el mapa está en la vista oculta del
      // slider de Presencia, espera a que esa vista se muestre (pres:show).
      const prender = () => {
        map.classList.add('is-lit');
        map.dispatchEvent(new Event('map:lit')); // arranca el recorrido automático (abajo)
      };
      let io = null;
      const armar = () => {
        if (io) io.disconnect();
        io = new IntersectionObserver((entries) => {
          if (!lastEntry(entries).isIntersecting) return;
          io.disconnect();
          const vista = map.closest('[data-pres-slide]');
          if (vista && !vista.classList.contains('is-active') && vista.closest('.is-slider')) vista.addEventListener('pres:show', prender, { once: true });
          else prender();
        }, { threshold: 0.35 });
        io.observe(map);
      };
      alAbrir(armar);
      alRepetir(() => { map.classList.remove('is-lit', 'is-settled'); alAbrir(armar); });
    }

    const card = map.closest('.map-card');
    if (!card) return;
    const byName = new Map(zones.map((z) => [z.dataset.name, z]));
    const chips = [...card.querySelectorAll('.map-zones [data-zone]')].filter((c) => byName.has(c.dataset.zone));

    // El SVG y el indicador comparten caja: el indicador se ubica en coordenadas de esa caja.
    const stage = document.createElement('div');
    stage.className = 'map-stage';
    map.before(stage);
    stage.append(map);
    const pin = document.createElement('div');
    pin.className = 'map-pin';
    pin.hidden = true;
    pin.setAttribute('aria-hidden', 'true'); // el nombre ya lo anuncia la zona o el chip enfocado
    stage.append(pin);

    // role="img" (del HTML) con el aria-label armado arriba: el lector lo anuncia como una sola imagen y las zonas
    // se manejan desde los chips. Mouse y toque siguen funcionando sobre el dibujo.
    zones.forEach((z) => z.querySelector('title')?.remove()); // sin tooltip nativo encima del indicador

    // Punto del indicador, en unidades del SVG: el centro visual de la zona. Se busca la fila más cercana a la
    // mitad del alto que cae dentro de la figura y se toma el medio de su tramo más largo (el centro de la caja
    // puede caer fuera en zonas con forma de L o con islas); CABA (grupo de círculos) usa el centro.
    const anchors = new Map();
    const rowMid = (z, b, y) => {
      const STEPS = 40;
      let run = [];
      let best = [];
      for (let i = 0; i <= STEPS; i++) {
        const x = b.x + (b.width * i) / STEPS;
        if (z.isPointInFill(new DOMPoint(x, y))) {
          run.push(x);
          if (run.length > best.length) best = run;
        } else run = [];
      }
      return best.length ? (best[0] + best[best.length - 1]) / 2 : null;
    };
    const anchorOf = (z) => {
      if (anchors.has(z)) return anchors.get(z);
      const b = z.getBBox();
      let a = { x: b.x + b.width / 2, y: b.y + b.height / 2 };
      if (typeof z.isPointInFill === 'function') {
        for (const f of [0.5, 0.42, 0.58, 0.34, 0.66, 0.25, 0.75]) {
          const y = b.y + b.height * f;
          const x = rowMid(z, b, y);
          if (x !== null) { a = { x, y }; break; }
        }
      }
      anchors.set(z, a);
      return a;
    };

    // Etiqueta arriba del punto, dentro del ancho de la card. Si arriba quedaría tapada por la barra fija
    // (zonas del borde superior del mapa), va debajo del punto.
    const STEM = 16; // largo de la línea guía; mismo valor que --pin-stem en el CSS
    const anchorOnScreen = (z) => {
      const ctm = map.getScreenCTM();
      if (!ctm) return null;
      const a = anchorOf(z);
      return new DOMPoint(a.x, a.y).matrixTransform(ctm);
    };
    // Presentación (intro): el globo va al costado del mapa, separado (GAP px) y sin tocar ninguna zona, del lado de
    // data-map-intro-lado. Primero se prueba a media altura del mapa;
    // si no entra, a la altura de cada fila de data-map-intro-y (fracciones del alto), en orden, contando el borde de la
    // tierra en toda la franja que ocupa el globo. Si no entra en ninguna, va en la primera fila, ajustado al ancho.
    // La pestaña del globo apunta al mapa. El borde de la tierra por fila se mide con isPointInFill y se guarda.
    const GAP = 15; // la misma separación que tenía el globo de Latinoamérica respecto de Chile (pedido de Brian)
    const MARGEN = 14; // aire contra los bordes de la caja (las flechas del slider van sobre el borde en celular)
    const introLado = map.dataset.mapIntroLado === 'izquierda' ? -1 : 1;
    const introFilas = (map.dataset.mapIntroY || '0.5').split(',').map(Number).filter((f) => f > 0 && f < 1);
    const bordes = new Map();
    const bordeEn = (yy) => {
      const y = Math.round(yy);
      if (bordes.has(y)) return bordes.get(y);
      const vb = map.viewBox.baseVal;
      const paso = vb.width / 720; // fino: el borde medido coincide con el que se ve
      const formas = zones.filter((z) => typeof z.isPointInFill === 'function');
      let borde = null;
      for (let x = vb.x; x <= vb.x + vb.width; x += paso) {
        const pt = new DOMPoint(x, y);
        if (formas.some((z) => z.isPointInFill(pt))) {
          borde = x;
          if (introLado < 0) break; // a la izquierda alcanza con el primer punto de tierra
        }
      }
      bordes.set(y, borde);
      return borde;
    };
    const bordeFranja = (y, medio) => {
      let borde = null;
      for (let yy = y - medio; yy <= y + medio; yy += 3) {
        const x = bordeEn(yy);
        if (x !== null) borde = borde === null ? x : (introLado > 0 ? Math.max(borde, x) : Math.min(borde, x));
      }
      return borde;
    };
    const placeIntro = () => {
      const ctm = map.getScreenCTM();
      const vb = map.viewBox && map.viewBox.baseVal;
      if (!ctm || !vb || !ctm.a) return;
      const w = pin.offsetWidth;
      const h = pin.offsetHeight;
      const box = stage.getBoundingClientRect();
      const medio = (h / 2 + 1) / ctm.a; // media altura del globo, en unidades del SVG: la separación se mide en sus mismas filas
      const bb = map.getBBox();
      // Primero a media altura del mapa; después las filas de data-map-intro-y. Siempre a GAP px de la tierra de la
      // franja que ocupa el globo (no de la caja del mapa), así Argentina y Latinoamérica quedan igual de separados.
      const medioY = bb.y + bb.height / 2;
      const candidatos = [{ x: bordeFranja(medioY, medio), y: medioY }]
        .concat(introFilas.map((f) => { const y = vb.y + vb.height * f; return { x: bordeFranja(y, medio), y }; }))
        .filter((c) => c.x !== null);
      let sitio = null;
      for (const c of candidatos) {
        const pt = new DOMPoint(c.x, c.y).matrixTransform(ctm);
        const left = introLado > 0 ? pt.x - box.left + GAP : pt.x - box.left - GAP - w;
        const cand = { left, top: pt.y - box.top - h / 2 };
        if (left >= MARGEN && left + w <= box.width - MARGEN) { sitio = cand; break; }
        if (!sitio && c !== candidatos[0]) sitio = cand;
      }
      if (!sitio) return;
      pin.classList.remove('is-below');
      pin.classList.toggle('is-izq', introLado < 0);
      pin.style.left = `${Math.min(Math.max(sitio.left, 0), Math.max(box.width - w, 0))}px`;
      pin.style.top = `${Math.round(sitio.top)}px`;
    };
    const place = (sel) => {
      if (sel.intro) { placeIntro(); return; }
      const z = sel.zones[0];
      const p = anchorOnScreen(z);
      if (!p) return;
      const w = pin.offsetWidth;
      const h = pin.offsetHeight;
      const box = stage.getBoundingClientRect();
      const below = p.y - h - STEM < headerBottom() + 4;
      const tipX = p.x - box.left;
      const tipY = p.y - box.top;
      const left = Math.min(Math.max(tipX - w / 2, 0), Math.max(box.width - w, 0));
      pin.classList.toggle('is-below', below);
      pin.style.left = `${left}px`;
      pin.style.top = `${below ? tipY + STEM : tipY - h - STEM}px`;
      pin.style.setProperty('--tip-x', `${Math.min(Math.max(tipX - left, 7), w - 7)}px`);
    };

    // Lo que muestra el indicador es una selección: una zona (hover, foco, toque, chip), un paso del recorrido con una
    // o dos zonas ("Buenos Aires y CABA") o la presentación del país o de la región (intro: el globo va al costado del
    // mapa, separado, y no señala ninguna zona). El globo lleva el nombre corto (data-label) si lo hay.
    const labelOf = (z) => z.dataset.label || z.dataset.name;
    // Pasos de data-map-order con varias zonas ("Buenos Aires+CABA"): son una sola selección, con el nombre de la
    // primera, tanto en el recorrido como al pasar el mouse o tocar cualquiera de ellas.
    const grupoDe = new Map();
    order.forEach((paso) => {
      const zs = paso.split('+').map((n) => byName.get(n)).filter((z) => z && z.classList.contains('on'));
      if (zs.length < 2) return;
      const sel = { zones: zs, label: labelOf(zs[0]), key: paso };
      zs.forEach((z) => grupoDe.set(z, sel));
    });
    const selDe = (z) => (z ? grupoDe.get(z) || { zones: [z], label: labelOf(z), key: z.dataset.name } : null);
    // Prioridad: la zona con hover; si no hay, la enfocada; si no, la fijada (clic, toque, Enter o espacio).
    let hovered = null;
    let focused = null;
    let pinned = null;
    let current = null;
    let tourStep = null; // paso que muestra el recorrido automático (la de menor prioridad)
    let tourStop = () => {}; // lo define el recorrido automático (al final de este bloque)
    const show = (sel) => {
      if ((sel && sel.key) === (current && current.key)) return;
      if (current) current.zones.forEach((z) => z.classList.remove('is-active'));
      current = sel;
      stage.classList.toggle('is-focusing', !!sel && !sel.intro);
      stage.classList.toggle('is-intro', !!sel && !!sel.intro);
      chips.forEach((c) => c.classList.toggle('is-active', !!sel && sel.zones.some((z) => c.dataset.zone === z.dataset.name)));
      if (!sel) { pin.hidden = true; return; }
      map.classList.add('is-settled');
      sel.zones.forEach((z) => z.classList.add('is-active'));
      pin.textContent = sel.label; // solo el nombre: el estado ya lo dicen el color y la leyenda
      pin.classList.toggle('is-pais', !!sel.intro);
      pin.hidden = true;
      void pin.offsetWidth; // reinicia la animación de entrada al pasar de una zona a otra
      pin.hidden = false;
      place(sel);
    };
    const update = () => {
      const user = hovered || focused || pinned;
      // Mientras pasa solo, el resto del mapa apenas se atenúa (sin desenfoque): es un recorrido, no una elección
      stage.classList.toggle('is-tour', !user && Boolean(tourStep) && !tourStep.intro);
      show(user ? selDe(user) : tourStep);
      const isPinned = (name) => String(!!pinned && pinned.dataset.name === name);
      chips.forEach((c) => c.setAttribute('aria-pressed', isPinned(c.dataset.zone)));
    };
    const togglePin = (z) => { pinned = pinned === z ? null : z; update(); };
    const clear = () => { hovered = null; focused = null; pinned = null; update(); };
    map.addEventListener('map:clear', () => { tourStop(); clear(); }); // el slider de Presencia cambió de vista
    const zoneOf = (t) => (t instanceof Element ? t.closest('.prov.on') : null); // las grises no muestran indicador
    const isMouse = (e) => e.pointerType !== 'touch'; // en táctil manda el toque (click)
    const hoverTo = (z, e) => { if (z && isMouse(e) && realPointer(e) && hovered !== z) { hovered = z; update(); } };

    // pointermove cubre el caso en que se ignoró el pointerover del scroll y después el mouse se mueve dentro de
    // la misma zona (no llega otro pointerover).
    map.addEventListener('pointerover', (e) => hoverTo(zoneOf(e.target), e));
    map.addEventListener('pointermove', (e) => hoverTo(zoneOf(e.target), e), { passive: true });
    map.addEventListener('pointerout', (e) => {
      const z = zoneOf(e.target);
      if (!z || !isMouse(e) || z.contains(e.relatedTarget)) return;
      hovered = null;
      update();
    });
    map.addEventListener('click', (e) => { const z = zoneOf(e.target); if (z) togglePin(z); });

    chips.forEach((chip) => {
      const z = byName.get(chip.dataset.zone);
      chip.addEventListener('pointerenter', (e) => hoverTo(z, e));
      chip.addEventListener('pointermove', (e) => hoverTo(z, e), { passive: true });
      chip.addEventListener('pointerleave', (e) => { if (isMouse(e)) { hovered = null; update(); } });
      chip.addEventListener('focus', () => { if (chip.matches(':focus-visible')) { hovered = null; focused = z; update(); } });
      chip.addEventListener('blur', () => { if (focused === z) { focused = null; update(); } });
      chip.addEventListener('click', () => {
        hovered = null; // manda la zona fijada aunque el scroll deje otro chip debajo del cursor
        togglePin(z);
        // En pantallas chicas el mapa no entra entero: si la zona quedó fuera de vista, se scrollea lo justo
        // para verla con el indicador arriba, debajo de la barra fija.
        const p = anchorOnScreen(z);
        if (pinned !== z || !p) return;
        const pinTop = p.y - pin.offsetHeight - STEM;
        const room = pinTop - headerBottom() - 12;
        const over = z.getBoundingClientRect().bottom - innerHeight + 12;
        const dy = room < 0 ? room : over > 0 ? Math.min(over, room) : 0;
        if (dy) scrollBy({ top: dy, behavior: motion ? 'smooth' : 'auto' });
      });
    });

    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && current) clear(); });
    document.addEventListener('click', (e) => {
      if (!pinned || !(e.target instanceof Element)) return;
      if (map.contains(e.target) && zoneOf(e.target)) return;
      if (card.contains(e.target) && e.target.closest('.map-zones [data-zone]')) return;
      pinned = null;
      update();
    });
    // El lado de la etiqueta (arriba o debajo) depende de la barra fija: se revisa al scrollear,
    // como máximo una vez por cuadro (place() lee y escribe layout).
    let placeRaf = 0;
    const replace = () => {
      if (!current || placeRaf) return;
      placeRaf = requestAnimationFrame(() => { placeRaf = 0; if (current) place(current); });
    };
    addEventListener('resize', replace);
    addEventListener('scroll', replace, { passive: true });
    // La vista entrante del slider llega con un corrimiento animado: al terminar, el globo se vuelve a ubicar con el
    // mapa ya en su lugar (si no, la separación quedaría medida a mitad del movimiento)
    const vistaDelMapa = map.closest('[data-pres-slide]');
    if (vistaDelMapa) vistaDelMapa.addEventListener('animationend', (e) => { if (e.target instanceof Element && e.target.contains(stage)) replace(); });

    // Recorrido automático: cuando el mapa ya se prendió y está a la vista, el indicador pasa solo por TODAS las zonas
    // con presencia, una por una (una cada TOUR_MS, en el orden de data-map-order), como un mapa que se presenta.
    // Al terminar la última avisa con map:tour-end (cancelable, burbujea): el slider de Presencia lo cancela y cambia de
    // vista; si nadie lo cancela, el recorrido vuelve a empezar. Cada vez que la vista se muestra arranca desde la
    // presentación, en el acto. Se detiene (sin perder el lugar) con el mouse sobre el mapa, con una zona elegida, fuera
    // de pantalla, con la pestaña oculta y en la vista oculta del slider; con "reducir movimiento" no corre. Al soltar,
    // sigue desde donde estaba.
    if (motion && active.length > 1) {
      map.dataset.mapTour = '';
      const TOUR_MS = 2000;
      const INTRO_MS = 2600; // la presentación del país o de la región se queda un poco más
      // Pasos: la presentación (si hay data-map-intro), los de data-map-order ("A+B" juntos) y, al final, cualquier
      // zona con presencia que no figure en el orden.
      const tourList = [];
      const enOrden = new Set();
      order.forEach((paso) => {
        const zs = paso.split('+').map((n) => byName.get(n)).filter((z) => z && z.classList.contains('on'));
        if (!zs.length) return;
        zs.forEach((z) => enOrden.add(z));
        tourList.push(zs.length > 1 ? grupoDe.get(zs[0]) : selDe(zs[0]));
      });
      active.forEach((z) => { if (!enOrden.has(z)) tourList.push(selDe(z)); });
      if (map.dataset.mapIntro) tourList.unshift({ zones: [], label: map.dataset.mapIntro, key: '#intro', intro: true });
      let tourTimer = 0;
      let tourI = -1;
      let enVista = false;
      let encima = false;
      const vistaActiva = () => {
        const vista = map.closest('[data-pres-slide]');
        return !vista || !vista.closest('.is-slider') || vista.classList.contains('is-active');
      };
      const puedeCorrer = () => enVista && !document.hidden && map.classList.contains('is-lit') && vistaActiva();
      tourStop = () => {
        clearTimeout(tourTimer);
        if (tourStep) { tourStep = null; update(); }
      };
      // El recorrido solo se frena con el mouse sobre el mapa (o una zona elegida): el foco en las pestañas o el mouse
      // sobre el texto no lo detienen, así al tocar "Argentina" o "Latam" arranca en el acto.
      const tick = () => {
        if (!puedeCorrer()) { tourStop(); return; }
        if (encima || hovered || focused || pinned) {
          if (tourStep) { tourStep = null; update(); }
        } else {
          if (tourI === tourList.length - 1) {
            // Se vio la última zona su tiempo completo: fin del recorrido de esta vista
            const fin = new Event('map:tour-end', { bubbles: true, cancelable: true });
            if (!map.dispatchEvent(fin)) { tourI = -1; return; } // el slider cambia de vista (map:clear lo frena)
          }
          tourI = (tourI + 1) % tourList.length;
          tourStep = tourList[tourI];
          update();
        }
        tourTimer = setTimeout(tick, tourStep && tourStep.intro ? INTRO_MS : TOUR_MS);
      };
      const tourStart = (espera) => {
        clearTimeout(tourTimer);
        if (!puedeCorrer()) { tourStop(); return; }
        tourTimer = setTimeout(tick, espera);
      };
      // Arranque inmediato: apenas el mapa se prende, o apenas se muestra su vista (al tocar la pestaña o la flecha),
      // aparece la presentación del país o de la región y el recorrido sigue desde ahí, mientras las zonas se encienden.
      map.addEventListener('map:lit', () => { tourI = -1; tourStart(120); });
      const vista = map.closest('[data-pres-slide]');
      // setTimeout 0: después de que el mapa se prenda con el mismo pres:show (ver "Mapas", arriba)
      if (vista) vista.addEventListener('pres:show', () => setTimeout(() => { tourI = -1; tourStart(0); }, 0));
      card.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { encima = true; if (tourStep) { tourStep = null; update(); } } });
      card.addEventListener('pointerleave', () => { encima = false; });
      document.addEventListener('visibilitychange', () => tourStart(TOUR_MS));
      new IntersectionObserver((entries) => {
        enVista = lastEntry(entries).isIntersecting;
        tourStart(tourI === -1 ? 0 : TOUR_MS); // recién mostrado: la presentación aparece en el acto
      }, { threshold: 0.2 }).observe(map);
    }
  });

  /* ---------- Preguntas frecuentes: una respuesta abierta por vez ---------- */
  // <details name="..."> ya es un acordeón exclusivo en los navegadores actuales. Esto solo lo replica donde el
  // atributo `name` no existe (Safari anterior a 17.2, Firefox anterior a 130).
  if (!('name' in HTMLDetailsElement.prototype)) {
    const faqs = [...document.querySelectorAll('details.faq__item[name]')];
    faqs.forEach((item) => item.addEventListener('toggle', () => {
      if (!item.open) return;
      faqs.forEach((otro) => {
        if (otro !== item && otro.open && otro.getAttribute('name') === item.getAttribute('name')) otro.open = false;
      });
    }));
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
    const capas = [...document.querySelectorAll('main section, main .page-head, main .page-body, .site-footer')]
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

  /* ---------- WhatsApp flotante: siempre a la vista, sin tapar controles ---------- */
  // El botón nunca se oculta (pedido de Brian, 09/11). Si debajo de él queda un control chico (la flecha derecha de un
  // carrusel, un día del calendario, un logo del menú de Casos...), el botón sube lo justo para dejarlo libre y vuelve
  // a su lugar cuando ya no tapa nada. Se mide una vez por cuadro al scrollear y al cambiar el ancho o el alto de la
  // página. En celular, los "+" de las preguntas ya dejan libre la columna del botón (padding en el CSS).
  // El desplazamiento va en --wa-lift (en <html>): lo usan el botón y el globo.
  const waFloat = document.querySelector('.wa-float');
  let waAbierto = false;
  if (waFloat) {
    const CONTROLES = 'a[href], button, summary, input, select, textarea, label, [role="button"], [role="tab"], .faq__sign';
    const MARGEN = 10;
    const TOPE = 220; // como mucho sube esto
    let lift = 0;
    let raf = 0;
    // Controles chicos de la página (los que el botón podría tapar). Los logos de las bandas de Clientes no cuentan:
    // pasan en movimiento por debajo y siguen tocables. Una fila de pregunta o una tarjeta tampoco (son anchas).
    let candidatos = [];
    const listar = () => {
      candidatos = [...document.querySelectorAll(CONTROLES)].filter((c) => !c.closest('.wa-float, .wa-globo, .cinta, [aria-hidden="true"]'));
    };
    const tapados = (rect) => candidatos.filter((c) => {
      if (!c.offsetParent || c.closest('[inert]')) return false;
      const r = c.getBoundingClientRect();
      if (r.width > 220 || r.height > 140 || r.width === 0) return false;
      return r.right > rect.left - MARGEN && r.left < rect.right + MARGEN && r.bottom > rect.top - MARGEN && r.top < rect.bottom + MARGEN;
    });
    const medir = () => {
      raf = 0;
      if (waAbierto) return; // con el globo abierto no se mueve
      // Lugar de reposo del botón (sin la subida ni su transición), según su right/bottom fijos
      const cs = getComputedStyle(waFloat);
      const w = waFloat.offsetWidth;
      const h = waFloat.offsetHeight;
      const right = root.clientWidth - parseFloat(cs.right);
      const bottom = root.clientHeight - parseFloat(cs.bottom);
      const r0 = { left: right - w, right, width: w, height: h, top: bottom - h, bottom };
      let nuevo = 0;
      for (let k = 0; k < 4; k++) {
        const r = { ...r0, top: r0.top - nuevo, bottom: r0.bottom - nuevo };
        const debajo = tapados(r);
        if (!debajo.length) break;
        const arriba = Math.min(...debajo.map((c) => c.getBoundingClientRect().top));
        nuevo = Math.min(TOPE, Math.max(nuevo + 8, r0.bottom - arriba + MARGEN));
        if (nuevo >= TOPE) break;
      }
      if (Math.abs(nuevo - lift) < 2) return;
      lift = nuevo;
      root.style.setProperty('--wa-lift', `${Math.round(lift)}px`);
    };
    const pedir = () => { if (!raf) raf = requestAnimationFrame(medir); };
    let relistar = 0;
    const cambio = () => { clearTimeout(relistar); relistar = setTimeout(() => { listar(); pedir(); }, 200); }; // menús y casos que se arman después
    listar();
    addEventListener('scroll', pedir, { passive: true });
    addEventListener('resize', cambio);
    if ('ResizeObserver' in window) new ResizeObserver(cambio).observe(document.body);
    document.addEventListener('transitionend', pedir, true);
    pedir();
  }

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
        + '<p class="wa-globo__sub">Lunes a viernes de 9 a 18</p></div></div>'
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
