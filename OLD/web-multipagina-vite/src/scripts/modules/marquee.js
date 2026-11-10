// Cinta infinita de logos ([data-marquee]).
// El HTML trae la lista UNA vez (y sin JS se ve como grilla). Acá:
//   1. se envuelve la lista en .logos__track y, cuando la cinta se acerca a
//      la pantalla, se agregan las copias necesarias (aria-hidden, imágenes
//      con alt="") para que siempre haya logos a la vista;
//   2. la pista se corre exactamente el ancho de UNA lista (--marquee-shift,
//      en px) y vuelve a empezar: en ese momento la copia ocupa justo el
//      lugar del original, así que el reinicio no se nota;
//   3. la duración sale del mismo ancho, así la velocidad es constante.
// Se detiene sola con el cursor encima o con un logo enfocado (CSS) y cuando
// queda fuera de pantalla (ahorra CPU). No hay botón: al sacar el cursor o
// el foco sigue corriendo.
// Con "movimiento reducido" no se arma (o se desarma si cambia en vivo).
// Velocidad del original: su cinta recorría media pista (8 fichas de 132px
// + 14px de separación = 1168px) en 34s, unos 34 px/s. Con los logos reales
// la pista es más larga, así que se conserva la velocidad y no los 34s.
const SPEED = 34; // px por segundo

function setupBelt(belt) {
  const viewport = belt.querySelector('.logos__viewport');
  const list = viewport?.querySelector('ul');
  if (!viewport || !list) return null;

  const track = document.createElement('div');
  track.className = 'logos__track';
  list.replaceWith(track);
  track.append(list);

  // Con teclado: cada logo de la lista original recibe foco (las copias no).
  // Enfocar un logo detiene la cinta y lo muestra a color, igual que el cursor.
  const items = [...list.children];
  for (const li of items) li.tabIndex = 0;

  // Las copias no entran en el primer cálculo de la página: se agregan la
  // primera vez que la cinta se acerca a la pantalla (en el celular, recién
  // al scrollear). Mientras tanto la cinta recién arranca y lo que se ve es
  // el principio de la lista original, así que no hay ningún hueco.
  const clones = [];
  let near = false;
  let shift = 0;

  const makeClone = () => {
    const clone = list.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.removeAttribute('aria-label');
    for (const li of clone.children) li.removeAttribute('tabindex');
    for (const img of clone.querySelectorAll('img')) {
      img.alt = '';
      img.loading = 'eager';
    }
    return clone;
  };

  // Ancho de una lista (incluye el hueco final, igual al gap entre logos):
  // es lo que se corre la pista en cada vuelta. Se pide al menos una copia y
  // las que hagan falta para cubrir el ancho visible durante toda la vuelta.
  const layout = () => {
    const w = list.getBoundingClientRect().width;
    if (w <= 0) return;
    if (w !== shift) {
      shift = w;
      belt.style.setProperty('--marquee-shift', `${w}px`);
      belt.style.setProperty('--marquee-dur', `${(w / SPEED).toFixed(2)}s`);
    }
    if (!near) return;
    const needed = 1 + Math.ceil(viewport.clientWidth / w);
    while (clones.length < needed) {
      const clone = makeClone();
      clones.push(clone);
      track.append(clone);
    }
  };

  // El ancho no se lee acá: hacerlo en el arranque obligaría a calcular el
  // layout de toda la página dentro de esta misma tarea, que en la home se
  // vuelve una tarea larga. El ResizeObserver avisa por primera vez después del layout
  // del primer frame, y de nuevo si cambia el ancho (redimensión, cambio de
  // tamaño de los logos en el corte de 768px).
  const ro = 'ResizeObserver' in window ? new ResizeObserver(layout) : null;
  if (ro) {
    ro.observe(list);
    ro.observe(viewport);
  } else {
    requestAnimationFrame(layout);
  }

  // Un logo enfocado con Tab puede estar fuera de la parte visible de la
  // cinta: se lleva la animación (que ya está detenida por el foco) hasta el
  // punto en que ese logo queda en el centro.
  const onFocus = (e) => {
    const li = e.target.closest('.logos__item');
    if (!li || !shift) return;
    const anim = track.getAnimations?.()[0];
    const dur = anim?.effect?.getComputedTiming().duration;
    if (!anim || !dur) return;
    const center = li.offsetLeft + li.offsetWidth / 2 - viewport.clientWidth / 2;
    const offset = Math.min(Math.max(center, 0), shift - 0.01);
    anim.currentTime = (offset / shift) * dur;
  };
  track.addEventListener('focusin', onFocus);

  belt.classList.add('is-running');

  const io =
    'IntersectionObserver' in window
      ? new IntersectionObserver(
          ([entry]) => {
            belt.classList.toggle('is-offscreen', !entry.isIntersecting);
            if (!entry.isIntersecting) return;
            near = true;
            // Los logos recortados por overflow no cargarían solos (lazy):
            // al acercarse la cinta se piden todos para que no aparezcan "en blanco".
            for (const img of list.querySelectorAll('img[loading="lazy"]')) img.loading = 'eager';
            layout();
          },
          { rootMargin: '200px 0px' },
        )
      : null;
  if (io) io.observe(belt);
  else {
    near = true;
    requestAnimationFrame(layout);
  }

  return () => {
    ro?.disconnect();
    io?.disconnect();
    track.removeEventListener('focusin', onFocus);
    for (const clone of clones) clone.remove();
    for (const li of items) li.removeAttribute('tabindex');
    track.replaceWith(list);
    belt.classList.remove('is-running', 'is-offscreen');
    belt.style.removeProperty('--marquee-dur');
    belt.style.removeProperty('--marquee-shift');
  };
}

export function initMarquee() {
  const belts = [...document.querySelectorAll('[data-marquee]')];
  if (!belts.length) return;

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let teardowns = [];

  const apply = () => {
    teardowns.forEach((fn) => fn());
    teardowns = [];
    if (motion.matches) return;
    teardowns = belts.map(setupBelt).filter(Boolean);
  };

  apply();
  motion.addEventListener?.('change', apply);
}
