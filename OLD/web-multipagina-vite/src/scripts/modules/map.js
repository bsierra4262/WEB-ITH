// Mapa de Argentina (sección Presencia). Al pasar el mouse por una provincia
// (o tocarla en el celular) el lector de abajo muestra su nombre y estado.
// Tocar fuera del mapa lo limpia. Sin JS el mapa y la lista de provincias
// activas se ven igual; solo falta el lector.
// Teclado: las provincias activas (.on) se recorren con Tab. El foco muestra
// la provincia en el lector igual que el hover, Enter o espacio la dejan
// fijada igual que el clic y Escape la suelta. Las demás no son enfocables:
// la lista .presencia__provs ya nombra las activas para los lectores de
// pantalla.
// Mismos textos que la leyenda del mapa (src/partials/presencia.html).
const STATUS_ON = 'Con proyectos realizados';
const STATUS_OFF = 'Sin proyectos todavía';
// Texto del lector cuando no hay ninguna provincia elegida.
const HINT = 'Elegí una provincia en el mapa';

export function initMap() {
  const root = document.querySelector('[data-map]');
  if (!root) return;

  const provs = [...root.querySelectorAll('.prov')];
  const nameEl = root.querySelector('[data-map-name]');
  const statusEl = root.querySelector('[data-map-status]');
  if (!provs.length || !nameEl || !statusEl) return;

  let pinned = null;
  let focused = null;

  const status = (el) => (el.classList.contains('on') ? STATUS_ON : STATUS_OFF);

  const show = (el) => {
    nameEl.textContent = el ? el.dataset.name || '' : '';
    statusEl.textContent = el ? status(el) : HINT;
  };

  // Sin hover ni foco, el lector vuelve a la provincia enfocada o fijada.
  const rest = () => show(focused || pinned);

  const pin = (el) => {
    pinned?.classList.remove('is-active');
    pinned = el;
    pinned?.classList.add('is-active');
    show(pinned);
  };

  show(null);

  // Con role="img" el lector de pantalla trata el SVG como una imagen y no
  // anuncia nada de adentro: como grupo (mismo aria-label) expone los botones.
  const svg = root.querySelector('svg');
  if (svg?.getAttribute('role') === 'img') svg.setAttribute('role', 'group');

  for (const el of provs) {
    el.addEventListener('mouseenter', () => show(el));
    el.addEventListener('mouseleave', rest);
    el.addEventListener('click', () => pin(el));

    // Las no activas quedan como dibujo: sin esto, dentro del grupo cada una
    // se anunciaría como un gráfico sin nombre.
    if (!el.classList.contains('on')) {
      el.setAttribute('role', 'none');
      continue;
    }

    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', `${el.dataset.name}: ${status(el).toLowerCase()}`);
    el.addEventListener('focus', () => {
      focused = el;
      show(el);
    });
    el.addEventListener('blur', () => {
      focused = null;
      rest();
    });
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault(); // el espacio no scrollea la página
        pin(el);
      } else if (e.key === 'Escape' && pinned) {
        pin(null);
        show(el);
      }
    });
  }

  document.addEventListener('click', (e) => {
    if (pinned && !e.target.closest?.('.prov')) pin(null);
  });
}
