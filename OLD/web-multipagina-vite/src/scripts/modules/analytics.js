// Medición del sitio y del embudo de ventas (informe de visibilidad, "Medición
// desde el día 1", y embudo de Clau Cave). Guía para marketing con los eventos
// y cómo probarlos: DOCS/marketing/medicion-embudo.md.
//
// Qué se carga
// - Los IDs viven en src/data/site.json → analytics: { gtm, ga4, clarity }.
//   Hoy solo está GTM (GTM-54S82VL3): GA4, Clarity, Google Ads y LinkedIn se
//   configuran adentro del contenedor, así que ga4 y clarity quedan vacíos
//   (si se completan además, se cuenta doble).
// - GTM se carga igual que el snippet oficial: dataLayer + { 'gtm.start',
//   event: 'gtm.js' } y gtm.js async. Sin <noscript>: ver medicion-embudo.md.
// - Solo en el dominio publicado (site.json → url). En desarrollo, en un build
//   probado en local o en otro dominio no se carga nada de terceros, salvo que
//   la URL tenga ?analytics; queda activo en esa pestaña al navegar
//   (sessionStorage) hasta abrir una página con ?analytics=0.
//
// Eventos (siempre en window.dataLayer, aunque no haya nada cargado; si GA4 se
// cargara directo, también con gtag). Todos llevan page_path y, si se conoce,
// canal (el de la primera visita, ver abajo).
//   generate_lead     envío correcto del formulario (contact-form.js); una
//                     reserva de la landing no lo dispara (es schedule_meeting)
//   click_whatsapp    clic en un link a WhatsApp          · link_location
//   click_phone       clic en un link tel:                · link_location
//   click_email       clic en un link mailto:             · link_location
//   click_calendar    clic que lleva al calendario        · click_target, calendar_type, link_location
//                     (agenda del CRM: click_target "horario" al elegir un
//                     horario, una vez por página, calendar_type "crm")
//   schedule_meeting  reunión agendada (agenda del CRM o Calendly) · calendar_type, landing_visit, servicio
//   scroll_depth      25, 50, 75 y 90 % de la página, una vez cada uno · percent_scrolled
//   video_progress    start, 25, 50, 75 y complete        · video_status, video_percent, video_title, video_provider
//   view_diagnostico  visita a /diagnostico/              · landing_visit (1 = primera vez)
//   link_location: flotante, header, footer o el id de la sección del link.
//
// Canal de origen: la primera visita (utm_*, gclid, li_fat_id, referrer y
// página de entrada) se guarda 90 días en localStorage (ith_origen). El
// formulario la manda en campos ocultos y llega al final del mail.
// En desarrollo cada evento se muestra en la consola (console.debug).
import { analytics, url as siteUrl } from '../../data/site.json';

const IDS = {
  gtm: /^GTM-[A-Z0-9]+$/,
  ga4: /^G-[A-Z0-9]+$/,
  clarity: /^[a-z0-9]{6,16}$/,
};

const DIAGNOSTICO = '/diagnostico/';
const ORIGEN_KEY = 'ith_origen';
const ORIGEN_DIAS = 90;
const VISITAS_KEY = 'ith_diagnostico';
const PARAMS_ORIGEN = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'li_fat_id'];

// Calendario: el selector de horarios de la agenda del CRM
// ([data-calendario-crm]) o el iframe de la landing (#diagnostico-calendario,
// con data-calendario), los dos creados por src/scripts/diagnostico.js, o
// cualquier iframe de Calendly o de la página de citas de Google Calendar. El
// <main> de la landing también tiene data-calendario y adentro está el video:
// por eso el atributo solo cuenta en un iframe.
const SEL_CALENDARIO = '[data-calendario-crm], iframe[data-calendario], iframe[src*="calendly.com"], iframe[src*="calendar.google.com"]';
const SEL_YOUTUBE = 'iframe[src*="youtube.com/embed/"], iframe[src*="youtube-nocookie.com/embed/"]';

let ga4Directo = false;
let habilitado = false;
let origen = null;
let visitasDiagnostico = 0;

const sinWww = (host) => host.replace(/^www\./, '');
const esDiagnostico = () => location.pathname.startsWith(DIAGNOSTICO);

const valido = (key) => {
  const id = String(analytics?.[key] ?? '').trim();
  return IDS[key].test(id) ? id : '';
};

// Almacenamiento: puede fallar (modo privado, cookies bloqueadas) y el sitio
// tiene que andar igual.
function leer(key, storage = 'localStorage') {
  try {
    return JSON.parse(window[storage].getItem(key) ?? 'null');
  } catch {
    return null;
  }
}

function guardar(key, value, storage = 'localStorage') {
  try {
    window[storage].setItem(key, JSON.stringify(value));
  } catch {
    /* sin almacenamiento: queda solo para esta página */
  }
}

function cargarScript(src) {
  const s = document.createElement('script');
  s.async = true;
  s.src = src;
  document.head.append(s);
}

function cargarGtm(id) {
  window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
  cargarScript(`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`);
}

function cargarGa4(id) {
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', id);
  cargarScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`);
  ga4Directo = true;
}

function cargarClarity(id) {
  window.clarity =
    window.clarity ||
    function clarity() {
      (window.clarity.q = window.clarity.q || []).push(arguments);
    };
  cargarScript(`https://www.clarity.ms/tag/${encodeURIComponent(id)}`);
}

/** Registra un evento. Seguro de llamar aunque no haya nada cargado. */
export function track(event, params = {}) {
  const data = { page_path: location.pathname, ...(origen?.canal ? { canal: origen.canal } : {}), ...params };
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...data });
  if (ga4Directo && typeof window.gtag === 'function') window.gtag('event', event, data);
  if (import.meta.env.DEV) console.debug('[analytics]', event, data);
}

// Canal de origen -------------------------------------------------------------

function hostDe(url) {
  try {
    return sinWww(new URL(url).hostname.toLowerCase());
  } catch {
    return '';
  }
}

const recortar = (value, max) =>
  String(value ?? '')
    .replace(/[\u0000-\u001f\u007f]+/g, ' ')
    .trim()
    .slice(0, max);

// Asistentes de IA: por el referrer o por utm_source (ChatGPT agrega
// utm_source=chatgpt.com a sus links).
const IAS = [
  [/(^|\.)(chatgpt\.com|openai\.com)$/, 'IA: ChatGPT'],
  [/(^|\.)perplexity\.ai$/, 'IA: Perplexity'],
  [/^gemini\.google\.com$|^bard\.google\.com$/, 'IA: Gemini'],
  [/(^|\.)copilot\.microsoft\.com$/, 'IA: Copilot'],
  [/(^|\.)claude\.ai$/, 'IA: Claude'],
];

/** Nombre del canal en castellano, el mismo en el mail y en los eventos. */
function canalDe({ utm_source: s = '', utm_medium: m = '', gclid, li_fat_id, referrer }) {
  const source = s.toLowerCase();
  const medium = m.toLowerCase();
  const ref = hostDe(referrer);
  const pago = /cpc|ppc|paid|pago|ads?$|display|remarketing|retargeting/.test(medium);

  if (gclid) return 'Google Ads';
  if (li_fat_id) return 'LinkedIn Ads';
  for (const [re, nombre] of IAS) if (re.test(source) || re.test(ref)) return nombre;
  if (source) {
    if (/linkedin|lnkd/.test(source)) return pago ? 'LinkedIn Ads' : 'LinkedIn';
    if (/google/.test(source)) return pago ? 'Google Ads' : 'Google';
    if (/mail|newsletter/.test(medium) || /mail/.test(source)) return 'Mail';
    return `Campaña: ${s}${m ? ` / ${m}` : ''}`;
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

function registrarOrigen() {
  const ahora = Date.now();
  const previo = leer(ORIGEN_KEY);
  if (previo && typeof previo === 'object' && ahora - Number(previo.t || 0) < ORIGEN_DIAS * 864e5) {
    origen = previo;
    return;
  }

  const query = new URLSearchParams(location.search);
  const externo = document.referrer && hostDe(document.referrer) !== sinWww(location.hostname);
  const datos = { t: ahora, landing: location.pathname, referrer: externo ? recortar(document.referrer, 300) : '' };
  for (const key of PARAMS_ORIGEN) datos[key] = recortar(query.get(key), key === 'gclid' || key === 'li_fat_id' ? 200 : 150);
  datos.canal = canalDe(datos);
  origen = datos;
  guardar(ORIGEN_KEY, datos);
}

/** Visitas a la landing /diagnostico/ (0 si nunca entró), para el formulario y los eventos. */
export function visitasLanding() {
  if (!visitasDiagnostico) visitasDiagnostico = Number(leer(VISITAS_KEY)?.visitas) || 0;
  return visitasDiagnostico;
}

/** Primera visita registrada, para los campos ocultos del formulario. */
export function origenVisita() {
  if (!origen) return {};
  const { t, ...datos } = origen;
  return datos;
}

// Clics ----------------------------------------------------------------------

function ubicacion(link) {
  if (link.closest('.wa-float')) return 'flotante';
  if (link.closest('.site-header')) return 'header';
  if (link.closest('.site-footer')) return 'footer';
  return link.closest('section[id]')?.id ?? 'pagina';
}

function tipoCalendario(src) {
  const host = hostDe(src);
  if (/(^|\.)calendly\.com$/.test(host)) return 'calendly';
  if (host === 'calendar.google.com' || host === 'calendar.app.google') return 'google_calendar';
  return 'otro';
}

const esLinkCalendario = (u) =>
  /(^|\.)calendly\.com$/.test(u.hostname) ||
  u.hostname === 'calendar.app.google' ||
  (u.hostname === 'calendar.google.com' && u.pathname.includes('/appointments'));

function calendarioEnPagina() {
  if (document.querySelector('[data-calendario-crm]')) return 'crm';
  const iframe = document.querySelector(SEL_CALENDARIO);
  return iframe?.src ? tipoCalendario(iframe.src) : 'otro';
}

function escucharClics() {
  document.addEventListener(
    'click',
    (e) => {
      const link = e.target instanceof Element ? e.target.closest('a[href]') : null;
      if (!link) return;
      const href = link.getAttribute('href') ?? '';
      const link_location = ubicacion(link);
      if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href)) return track('click_whatsapp', { link_location });
      if (href.startsWith('tel:')) return track('click_phone', { link_location });
      if (href.startsWith('mailto:')) return track('click_email', { link_location });

      let u;
      try {
        u = new URL(href, location.href);
      } catch {
        return;
      }
      if (esLinkCalendario(u)) {
        return track('click_calendar', { click_target: 'link_calendario', calendar_type: tipoCalendario(u.href), link_location });
      }
      if (u.origin !== location.origin) return;
      // "Agendar" desde cualquier página hacia la landing de diagnóstico.
      if (u.pathname.startsWith(DIAGNOSTICO) && !esDiagnostico()) {
        return track('click_calendar', { click_target: 'link_diagnostico', calendar_type: 'diagnostico', link_location });
      }
      // Ancla de la misma página que baja hasta el calendario.
      if (u.pathname === location.pathname && u.hash.length > 1) {
        const destino = document.getElementById(decodeURIComponent(u.hash.slice(1)));
        if (destino && (destino.matches(SEL_CALENDARIO) || destino.querySelector(SEL_CALENDARIO))) {
          track('click_calendar', { click_target: 'ancla_calendario', calendar_type: calendarioEnPagina(), link_location });
        }
      }
    },
    { capture: true },
  );
}

// Calendario embebido --------------------------------------------------------
// Un clic dentro de un iframe no llega a la página: se detecta porque la
// ventana pierde el foco y el elemento activo pasa a ser el iframe.
// Calendly avisa por postMessage cuando se elige horario y cuando se agenda.
// La página de citas de Google Calendar no avisa nada: ahí la conversión es
// el clic en el calendario y el generate_lead del formulario.
// La agenda del CRM no es un iframe: el selector es de la página y
// agenda-crm.js llama a track() al elegir horario y al confirmar la reunión.

function escucharCalendario() {
  const hechos = new Set();
  const unaVez = (clave, fn) => {
    if (hechos.has(clave)) return;
    hechos.add(clave);
    fn();
  };

  window.addEventListener('blur', () => {
    setTimeout(() => {
      const activo = document.activeElement;
      if (!(activo instanceof HTMLIFrameElement)) return;
      if (!activo.matches(SEL_CALENDARIO)) return;
      unaVez('calendario', () =>
        track('click_calendar', { click_target: 'calendario', calendar_type: tipoCalendario(activo.src), link_location: ubicacion(activo) }),
      );
    }, 0);
  });

  // Calendly solo avisa por postMessage si la URL del iframe dice en qué sitio
  // está embebido (embed_domain y embed_type, como hace su widget.js).
  document.addEventListener('ith:diagnostico-calendario', (e) => {
    const iframe = e.detail?.iframe;
    if (!(iframe instanceof HTMLIFrameElement) || tipoCalendario(iframe.src) !== 'calendly') return;
    try {
      const u = new URL(iframe.src);
      if (u.searchParams.has('embed_domain')) return;
      u.searchParams.set('embed_domain', location.hostname);
      u.searchParams.set('embed_type', 'Inline');
      iframe.src = u.href;
    } catch {
      /* URL rara: queda como vino */
    }
  });

  window.addEventListener('message', (e) => {
    if (!/^https:\/\/([a-z0-9-]+\.)?calendly\.com$/.test(e.origin)) return;
    const evento = e.data && typeof e.data === 'object' ? e.data.event : '';
    if (evento === 'calendly.date_and_time_selected') {
      unaVez('horario', () => track('click_calendar', { click_target: 'horario', calendar_type: 'calendly' }));
    } else if (evento === 'calendly.event_scheduled') {
      track('schedule_meeting', { calendar_type: 'calendly', landing_visit: visitasDiagnostico });
    }
  });
}

// Scroll ---------------------------------------------------------------------

function medirScroll() {
  const marcas = [25, 50, 75, 90];
  let siguiente = 0;
  let pendiente = false;

  const revisar = () => {
    pendiente = false;
    const alto = document.documentElement.scrollHeight;
    if (!alto) return;
    const visto = ((window.scrollY + window.innerHeight) / alto) * 100;
    while (siguiente < marcas.length && visto >= marcas[siguiente]) {
      track('scroll_depth', { percent_scrolled: marcas[siguiente] });
      siguiente += 1;
    }
    if (siguiente >= marcas.length) window.removeEventListener('scroll', alScroll);
  };
  const alScroll = () => {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(revisar);
  };
  window.addEventListener('scroll', alScroll, { passive: true });
}

// Video ----------------------------------------------------------------------
// <video> propio: el <video data-video> o uno dentro de un contenedor
// [data-video]. YouTube: iframe /embed/ (youtube.com o youtube-nocookie.com);
// se le agrega enablejsapi=1 si no lo tiene y la API de YouTube se carga solo
// si hay un video en la página y la medición está habilitada. En la landing el
// iframe aparece al tocar la miniatura (diagnostico.js avisa con el evento
// ith:diagnostico-video); en otras páginas se detecta dentro de [data-video].

const medidos = new WeakSet();
let apiYoutube = null;

function tituloVideo(el, extra = '') {
  return recortar(el.closest('[data-video-titulo]')?.dataset.videoTitulo || extra || el.getAttribute('title') || 'video', 100);
}

function seguidor(el, proveedor) {
  const hitos = new Set();
  const enviar = (video_status, video_percent, titulo) =>
    track('video_progress', { video_status, video_percent, video_title: titulo ?? tituloVideo(el), video_provider: proveedor });
  return {
    inicio(titulo) {
      if (hitos.has(0)) return;
      hitos.add(0);
      enviar('start', 0, titulo);
    },
    avance(actual, total, titulo) {
      if (!total || !Number.isFinite(total)) return;
      const pct = (actual / total) * 100;
      for (const marca of [25, 50, 75]) {
        if (pct >= marca && !hitos.has(marca)) {
          hitos.add(marca);
          enviar('progress', marca, titulo);
        }
      }
    },
    fin(titulo) {
      if (hitos.has(100)) return;
      hitos.add(100);
      enviar('complete', 100, titulo);
    },
  };
}

function medirVideoPropio(video) {
  if (medidos.has(video)) return;
  medidos.add(video);
  const s = seguidor(video, 'propio');
  video.addEventListener('play', () => s.inicio());
  video.addEventListener('timeupdate', () => s.avance(video.currentTime, video.duration));
  video.addEventListener('ended', () => s.fin());
}

function cargarApiYoutube() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  apiYoutube ||= new Promise((resolve) => {
    const previo = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof previo === 'function') previo();
      resolve(window.YT);
    };
    cargarScript('https://www.youtube.com/iframe_api');
  });
  return apiYoutube;
}

function medirYoutube(iframe) {
  if (medidos.has(iframe) || !habilitado) return;
  medidos.add(iframe);
  try {
    const u = new URL(iframe.src);
    if (u.searchParams.get('enablejsapi') !== '1') {
      u.searchParams.set('enablejsapi', '1');
      u.searchParams.set('origin', location.origin);
      iframe.src = u.href;
    }
  } catch {
    return;
  }

  cargarApiYoutube().then((YT) => {
    const s = seguidor(iframe, 'youtube');
    let reloj = 0;
    const titulo = () => player.getVideoData?.()?.title || '';
    const avance = () => s.avance(player.getCurrentTime?.() ?? 0, player.getDuration?.() ?? 0, tituloVideo(iframe, titulo()));
    const reproduciendo = () => {
      s.inicio(tituloVideo(iframe, titulo()));
      clearInterval(reloj);
      reloj = setInterval(avance, 1000);
    };
    const player = new YT.Player(iframe, {
      events: {
        // El video de la landing arranca solo al tocar la miniatura: puede
        // estar sonando antes de que la API se conecte.
        onReady: () => {
          if (player.getPlayerState?.() === YT.PlayerState.PLAYING) reproduciendo();
        },
        onStateChange: (e) => {
          if (e.data === YT.PlayerState.PLAYING) return reproduciendo();
          clearInterval(reloj);
          if (e.data === YT.PlayerState.ENDED) {
            s.fin(tituloVideo(iframe, titulo()));
          } else {
            avance();
          }
        },
      },
    });
  });
}

function medirVideos() {
  const revisar = (raiz) => {
    if (!(raiz instanceof Element)) return;
    const propios = raiz.matches('video') ? [raiz] : [...raiz.querySelectorAll('video')];
    propios.filter((v) => v.matches('video[data-video], [data-video] video')).forEach(medirVideoPropio);
    const youtube = raiz.matches(SEL_YOUTUBE) ? [raiz] : [...raiz.querySelectorAll(SEL_YOUTUBE)];
    youtube.forEach(medirYoutube);
  };
  revisar(document.body);
  document.addEventListener('ith:diagnostico-video', (e) => revisar(e.detail?.iframe));

  const contenedores = document.querySelectorAll('[data-video]');
  if (!contenedores.length || !('MutationObserver' in window)) return;
  const observer = new MutationObserver((cambios) => cambios.forEach((c) => c.addedNodes.forEach(revisar)));
  contenedores.forEach((c) => observer.observe(c, { childList: true, subtree: true }));
}

// Regresos a la landing --------------------------------------------------------

function contarVisitaDiagnostico() {
  if (!esDiagnostico()) return;
  visitasDiagnostico = Number(leer(VISITAS_KEY)?.visitas) || 0;
  // Una visita por sesión del navegador (recargar no suma).
  if (!leer(VISITAS_KEY, 'sessionStorage')) {
    visitasDiagnostico += 1;
    guardar(VISITAS_KEY, { visitas: visitasDiagnostico });
    guardar(VISITAS_KEY, 1, 'sessionStorage');
  }
  track('view_diagnostico', { landing_visit: Math.max(visitasDiagnostico, 1) });
}

// Inicio -----------------------------------------------------------------------

function medicionHabilitada() {
  const query = new URLSearchParams(location.search);
  const marca = 'ith_analytics';
  if (query.get('analytics') === '0') {
    guardar(marca, 0, 'sessionStorage');
    return false;
  }
  if (query.has('analytics')) {
    guardar(marca, 1, 'sessionStorage');
    return true;
  }
  const guardado = leer(marca, 'sessionStorage');
  if (guardado === 1) return true;
  if (guardado === 0 || import.meta.env.DEV) return false;
  return sinWww(location.hostname) === hostDe(siteUrl);
}

export function initAnalytics() {
  window.dataLayer = window.dataLayer || [];
  habilitado = medicionHabilitada();
  registrarOrigen();

  // Primero gtm.js, para que los eventos de la página queden después en la cola.
  if (habilitado) {
    const gtm = valido('gtm');
    const ga4 = valido('ga4');
    const clarity = valido('clarity');
    if (gtm) cargarGtm(gtm);
    if (ga4) cargarGa4(ga4);
    if (clarity) cargarClarity(clarity);
  }

  escucharClics();
  escucharCalendario();
  medirScroll();
  contarVisitaDiagnostico();
  medirVideos();
}
