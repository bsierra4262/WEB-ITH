// Landing /diagnostico/: agenda, calendario y video de Carlos según
// site.diagnostico. Los valores llegan en los data-* de <main> (tokens
// {{site.diagnostico.*}}). El build no tiene condicionales, así que el HTML
// publicado trae siempre el formulario y la tarjeta de Carlos; este módulo los
// cambia solo si corresponde. Sin JS queda la versión de formulario.
//
// - Agenda del CRM (data-calendario="crm"): pone el template
//   [data-diagnostico-crm] en #agenda .agenda__panel, delante del formulario
//   de siempre (que queda oculto como respaldo), y lo llena con los horarios
//   de /api/agenda.php. La persona elige día y hora, completa sus datos y
//   confirma; la reserva queda en el CRM con la página y el canal de origen y
//   el CRM le manda la invitación con el enlace de Meet. Si el CRM no responde
//   o no hay horarios, vuelve el formulario de siempre (con los datos ya
//   cargados si falló la reserva). Mide click_calendar (horario) y
//   schedule_meeting (reunión confirmada) con analytics.js.
// - Calendario externo (URL de Google Calendar o Calendly): reemplaza el
//   contenido del panel por el template [data-diagnostico-calendario] (iframe
//   #diagnostico-calendario). Avisa con el evento "ith:diagnostico-calendario".
// - Video: cambia la tarjeta de Carlos por una fachada (miniatura + botón).
//   El iframe de youtube-nocookie.com (#diagnostico-video, enablejsapi=1) se
//   crea recién al clic. Avisa con el evento "ith:diagnostico-video".
// La sección #agenda no se toca: el header, reveal.js y analytics.js la siguen
// encontrando.
//
// Corre después de main.js (los dos son módulos y main.js va antes en el
// <head>), así que lo que se crea acá aparece después de initAnalytics: para
// medirlo hay que escuchar estos eventos o usar delegación, no buscarlo al iniciar.
import '../styles/sections/diagnostico.css';
import { initWaTexto } from './modules/wa-texto.js';
import { initAgendaCrm } from './modules/agenda-crm.js';

const CALENDARIOS = /^(calendar\.google\.com|(?:[\w-]+\.)?calendly\.com)$/i;
const YOUTUBE_ID = /^[\w-]{11}$/;

function avisar(nombre, detail) {
  document.dispatchEvent(new CustomEvent(nombre, { detail }));
}

/** URL https de una página de citas de Google Calendar o de Calendly; si no, null. */
function urlCalendario(valor) {
  try {
    const url = new URL(valor.trim());
    if (url.protocol !== 'https:' || !CALENDARIOS.test(url.hostname)) return null;
    // Las páginas de citas de Google se embeben con gv=true.
    if (/google\.com$/i.test(url.hostname) && !url.searchParams.has('gv')) url.searchParams.set('gv', 'true');
    return url;
  } catch {
    return null;
  }
}

/** Id del video de YouTube (watch?v=, youtu.be/, /embed/, /shorts/, /live/). */
function idYoutube(valor) {
  try {
    const url = new URL(valor.trim());
    const host = url.hostname.replace(/^(www|m)\./i, '').toLowerCase();
    let id = null;
    if (host === 'youtu.be') id = url.pathname.slice(1).split('/')[0];
    else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      id = url.searchParams.get('v') ?? url.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]+)/)?.[1] ?? null;
    }
    return id && YOUTUBE_ID.test(id) ? id : null;
  } catch {
    return null;
  }
}

function initCalendario(main) {
  if ((main.dataset.calendario ?? '').trim() === 'crm') return initAgendaCrm(main);
  const url = urlCalendario(main.dataset.calendario ?? '');
  const panel = document.querySelector('#agenda .agenda__panel');
  const tpl = document.querySelector('template[data-diagnostico-calendario]');
  if (!url || !panel || !tpl) return;

  const contenido = tpl.content.cloneNode(true);
  const iframe = contenido.querySelector('#diagnostico-calendario');
  iframe.src = url.href;
  iframe.dataset.calendario = url.hostname;
  panel.replaceChildren(contenido);
  panel.classList.add('diagnostico-agenda__panel');
  main.dataset.agenda = 'calendario';
  // El link de WhatsApp del panel es nuevo: toma el mensaje de la página.
  initWaTexto();
  avisar('ith:diagnostico-calendario', { iframe, proveedor: url.hostname });
}

function initVideo(main) {
  const id = idYoutube(main.dataset.video ?? '');
  const media = document.querySelector('[data-diagnostico-media]');
  const tpl = document.querySelector('template[data-diagnostico-video]');
  if (!id || !media || !tpl) return;

  const contenido = tpl.content.cloneNode(true);
  const caja = contenido.querySelector('.diagnostico-video');
  const boton = contenido.querySelector('.diagnostico-video__play');
  const img = contenido.querySelector('.diagnostico-video__img');
  img.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

  boton.addEventListener(
    'click',
    () => {
      const src = new URL(`https://www.youtube-nocookie.com/embed/${id}`);
      src.search = new URLSearchParams({ enablejsapi: '1', autoplay: '1', rel: '0', playsinline: '1', origin: location.origin }).toString();
      const iframe = document.createElement('iframe');
      iframe.id = 'diagnostico-video';
      iframe.className = 'diagnostico-video__iframe';
      iframe.src = src.href;
      iframe.title = 'Carlos Baldelli cuenta cómo es la reunión de diagnóstico';
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      caja.replaceChildren(iframe);
      iframe.focus();
      avisar('ith:diagnostico-video', { iframe, id });
    },
    { once: true },
  );

  media.replaceChildren(contenido);
  media.classList.add('diagnostico-reunion__media--video');
}

function init() {
  const main = document.querySelector('main.diagnostico');
  if (!main) return;
  for (const paso of [initCalendario, initVideo]) {
    try {
      paso(main);
    } catch (err) {
      console.error(`[ith] fallo al iniciar ${paso.name}`, err);
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
