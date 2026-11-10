// Header: sombra al scrollear, menú mobile accesible y, en la home, link de la
// sección visible marcado (aria-current="true"). El CTA "Agendá una reunión"
// también se marca mientras se ve #agenda (en cualquier página que lo tenga):
// en escritorio se oculta ahí (header.css), porque el visitante ya está en el
// formulario.
// Sin JS el header funciona igual: la navegación queda siempre visible
// (ver header.css).
const MOBILE = '(max-width: 959.98px)';

export function initHeader() {
  const header = document.querySelector('[data-header]');
  if (!header) return;

  initScrollShadow(header);
  initMenu(header);
  initCta(header);
  initActiveLink(header);
}

function initScrollShadow(header) {
  let ticking = false;
  const update = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 4);
    ticking = false;
  };
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  // La primera lectura de scrollY va en el próximo frame: leída acá, dentro del
  // arranque de main.js, obliga a calcular todo el layout en esa misma tarea.
  ticking = true;
  requestAnimationFrame(update);
}

function initMenu(header) {
  const toggle = header.querySelector('[data-header-toggle]');
  const menu = header.querySelector('[data-header-menu]');
  if (!toggle || !menu) return;

  const mq = window.matchMedia(MOBILE);
  const focusables = () => [toggle, ...menu.querySelectorAll('a[href]')];
  let open = false;

  toggle.hidden = false;
  header.classList.add('is-enhanced');

  const setOpen = (next, { returnFocus = false } = {}) => {
    if (next === open) return;
    open = next;
    header.classList.toggle('is-open', open);
    // Con el menú abierto la página de atrás no se desplaza.
    document.documentElement.style.overflow = open ? 'hidden' : '';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    if (open) {
      // Fuerza el recálculo de estilos para que el panel ya sea visible
      // (visibility) y el primer link se pueda enfocar.
      void menu.offsetHeight;
      menu.querySelector('a[href]')?.focus({ preventScroll: true });
    } else if (returnFocus) {
      // preventScroll: con scroll-padding-top el navegador da al botón del
      // header sticky por tapado y movería la página hacia arriba.
      toggle.focus({ preventScroll: true });
    }
  };

  toggle.addEventListener('click', () => setOpen(!open));

  menu.addEventListener('click', (e) => {
    if (e.target.closest('a[href]')) setOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (!open) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false, { returnFocus: true });
      return;
    }
    // Foco atrapado entre el botón y los links del panel.
    if (e.key === 'Tab') {
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (!header.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // Toque afuera: cae sobre el velo (pseudo-elemento del header, e.target es
  // el propio header), así solo cierra el menú y no activa lo que hay debajo.
  document.addEventListener('pointerdown', (e) => {
    if (open && (e.target === header || !header.contains(e.target))) setOpen(false);
  });

  mq.addEventListener('change', (e) => {
    if (!e.matches) setOpen(false);
  });
}

// CTA "Agendá una reunión": sin JS va a /contacto/#agenda. Si esta página tiene
// su propio formulario (#agenda), baja hasta ahí sin cambiar de página.
function initCta(header) {
  const cta = header.querySelector('[data-cta-agenda]');
  if (cta && document.getElementById('agenda')) cta.setAttribute('href', '#agenda');
}

// Link marcado mientras se ve su sección (aria-current="true"). Los links
// declaran en data-section los ids de las secciones que les corresponden.
// En la home se aplica a la navegación; en todas las páginas, al CTA (que se
// oculta en escritorio mientras se ve #agenda). En las páginas internas el
// link de la página actual ya viene marcado desde el build (aria-current="page",
// plugin de parciales) y no se toca.
function initActiveLink(header) {
  if (!('IntersectionObserver' in window)) return;
  const isHome = Boolean(document.getElementById('inicio'));
  const links = new Map();
  for (const a of header.querySelectorAll('[data-section]')) {
    if (!isHome && !a.hasAttribute('data-cta-agenda')) continue;
    if (a.getAttribute('aria-current') === 'page') continue;
    for (const id of a.dataset.section.split(/\s+/)) {
      if (!links.has(id)) links.set(id, []);
      links.get(id).push(a);
    }
  }
  // Se observan todas las secciones con id para que, en las que no están en
  // el menú (hero, problema, pasos…), no quede marcado ningún link.
  const sections = [...document.querySelectorAll('main section[id]')];
  if (!links.size || !sections.length) return;
  const managed = new Set([...links.values()].flat());

  let current = null;
  const mark = (id) => {
    if (id === current) return;
    current = id;
    const on = new Set(links.get(id) ?? []);
    for (const a of managed) {
      if (on.has(a)) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    }
  };

  // Franja de detección: el 10% de la pantalla que queda a ~40% de altura.
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) mark(entry.target.id);
      }
    },
    { rootMargin: '-40% 0px -50% 0px', threshold: 0 },
  );
  sections.forEach((s) => io.observe(s));
}
