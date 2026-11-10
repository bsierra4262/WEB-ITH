// Notas internas de revisión (.nota) y borradores ([data-draft]).
// - En desarrollo (npm run dev) o con ?notas en la URL: se muestran y aparece
//   un botón flotante para alternarlas.
// - En cualquier otro caso se quitan del DOM. El CSS ya las oculta, pero así
//   tampoco llegan al modo lectura, al traductor, a copiar y pegar ni a
//   lectores o bots que ejecutan JS sin aplicar estilos.
// El filtrado definitivo del HTML publicado (código fuente) corresponde al
// build; si el build ya las quitó, ?notas no muestra el botón porque no hay
// nada que revisar.
const KEY = 'ith-notas';
const SELECTOR = '.nota, [data-draft]';

export function initNotes() {
  const params = new URLSearchParams(location.search);
  const enabled = import.meta.env.DEV || params.has('notas');

  if (!enabled) {
    for (const el of document.querySelectorAll(SELECTOR)) el.remove();
    return;
  }

  if (!document.querySelector(SELECTOR)) return;

  const root = document.documentElement;
  let visible = true;
  try {
    visible = localStorage.getItem(KEY) !== 'off';
  } catch {}
  root.classList.toggle('show-notes', visible);

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'notes-toggle';
  const label = () => (visible ? 'Ocultar notas' : 'Mostrar notas');
  btn.title = 'Notas de revisión. No salen en la web publicada.';
  btn.setAttribute('aria-pressed', String(visible));
  btn.textContent = label();
  btn.addEventListener('click', () => {
    visible = !visible;
    root.classList.toggle('show-notes', visible);
    btn.textContent = label();
    btn.setAttribute('aria-pressed', String(visible));
    try {
      localStorage.setItem(KEY, visible ? 'on' : 'off');
    } catch {}
  });

  document.body.append(btn);
}
