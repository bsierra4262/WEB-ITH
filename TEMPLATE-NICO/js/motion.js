/* Intellihelp — movimiento (títulos por líneas, fotos y slider; el header va en main.js y la carga en js/carga.js). Sin dependencias.
   Va después de main.js (los dos con defer, en ese orden) y junto con css/motion.css. Detalle: README-movimiento.md.

   Convivencia con main.js: main.js sigue siendo el dueño del revelado (.rv → .show, una sola vez), de los contadores,
   de la cinta de clientes (que nunca frena), del slider y del menú. motion.js no observa el scroll por su cuenta para las
   entradas: escucha cuándo main.js pone .show en un bloque y recién ahí suma su receta (títulos por líneas, telón de
   las fotos). Así no hay dos disparadores para el mismo elemento ni entradas repetidas. Si un bloque ya estaba
   revelado cuando carga este archivo, se lo deja como está.

   Con "reducir movimiento" (o sin IntersectionObserver) el <head> no pone .anim y este archivo solo borra el preloader. */
(() => {
  'use strict';

  const root = document.documentElement;

  // La animación de carga es un componente aparte (js/carga.js): avisa ith:intro-salida, ith:intro-fin e ith:replay.
  if (!root.classList.contains('anim')) return;

  /* ---------- Enganche con el revelado de main.js ---------- */
  // whenShown(rv, fn): corre fn cuando main.js le pone .show a `rv`. Devuelve false si ya estaba revelado.
  const pending = new Map();
  const mo = new MutationObserver((records) => {
    records.forEach(({ target }) => {
      const fns = pending.get(target);
      if (!fns || !target.classList.contains('show')) return;
      pending.delete(target);
      fns.forEach((fn) => fn());
    });
  });
  const whenShown = (rv, fn) => {
    if (rv.classList.contains('show')) return false;
    if (!pending.has(rv)) {
      pending.set(rv, []);
      mo.observe(rv, { attributes: true, attributeFilter: ['class'] });
    }
    pending.get(rv).push(fn);
    return true;
  };
  // Demora de entrada que main.js le dio al bloque (--rv-d, en segundos)
  const rvDelay = (rv) => parseFloat(rv.style.getPropertyValue('--rv-d')) || 0;

  /* ---------- Títulos por líneas con máscara ---------- */
  // Solo títulos dentro de un encabezado .rv-seq (rótulo + título + bajada): ahí main.js los mantiene ocultos hasta
  // revelarlos, así que partirlos en ese instante no produce ningún parpadeo. Un título suelto, fuera de .rv-seq,
  // queda con la entrada de styles.css.
  const STEP = 0.08;     // --m-step: demora entre una línea y la siguiente
  const LINE = 0.9;      // --m-t-line
  const ATOMIC = '[data-count], [data-anios]'; // los cambia main.js por textContent: van enteros dentro de una máscara

  const wrapWord = (node) => {
    const mask = document.createElement('span');
    mask.className = 'm-w';
    const inner = document.createElement('span');
    inner.className = 'm-w__in';
    node.replaceWith(mask);
    inner.append(node);
    mask.append(inner);
    return mask;
  };

  const split = (el) => {
    const masks = [];
    const atomics = new Set();
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const texts = [];
    while (walker.nextNode()) texts.push(walker.currentNode);
    texts.forEach((t) => {
      const atomic = t.parentElement.closest(ATOMIC);
      if (atomic && el.contains(atomic)) {
        if (!atomics.has(atomic)) { atomics.add(atomic); masks.push(wrapWord(atomic)); }
        return;
      }
      const parts = t.textContent.split(/(\s+)/);
      if (parts.every((p) => !p.trim())) return;
      const frag = document.createDocumentFragment();
      parts.forEach((p) => {
        if (!p) return;
        if (!p.trim()) { frag.append(p); return; }
        const word = document.createTextNode(p);
        frag.append(word);
      });
      const words = [...frag.childNodes].filter((n) => n.textContent.trim());
      t.replaceWith(frag);
      words.forEach((w) => masks.push(wrapWord(w)));
    });
    return masks;
  };

  const unsplit = (el, masks) => {
    masks.forEach((m) => { if (m.isConnected) m.replaceWith(...m.firstChild.childNodes); });
    el.normalize();
  };

  const lineTargets = document.querySelectorAll('.rv-seq .section-title, .rv-seq .quote__text');
  const armarTitulos = () => lineTargets.forEach((el) => {
    const seq = el.closest('.rv-seq');
    let host = el;
    while (host.parentElement && host.parentElement !== seq) host = host.parentElement;
    if (host.parentElement !== seq) return;
    const armed = whenShown(seq, () => {
      try {
        const masks = split(el);
        if (!masks.length) return;
        // Línea de cada palabra: todas van alineadas arriba, así que comparten el mismo top
        const tops = [];
        masks.forEach((m) => {
          const top = Math.round(m.getBoundingClientRect().top);
          let i = tops.findIndex((t) => Math.abs(t - top) < 4);
          if (i < 0) { tops.push(top); i = tops.length - 1; }
          m.dataset.line = i;
        });
        const order = [...tops].sort((a, b) => a - b);
        const base = rvDelay(seq) + STEP; // el título es el segundo del encabezado: un paso después del rótulo
        masks.forEach((m) => {
          const line = order.indexOf(tops[m.dataset.line]);
          m.removeAttribute('data-line');
          m.firstChild.style.setProperty('--m-d', `${(base + line * STEP).toFixed(2)}s`);
        });
        const total = base + (order.length - 1) * STEP + LINE;
        setTimeout(() => unsplit(el, masks), Math.ceil(total * 1000) + 80);
      } catch (err) {
        host.classList.remove('m-host'); // ante cualquier sorpresa, la entrada original de styles.css
      }
    });
    if (armed) host.classList.add('m-host');
  });
  armarTitulos();

  /* ---------- Fotos que se descubren ---------- */
  // Fotos del equipo y de la cita: arrancan con el revelado de su tarjeta (el .rv más cercano), un poco después.
  const fotos = document.querySelectorAll('.member__photo, .quote__photo');
  const armarFotos = () => fotos.forEach((photo) => {
    const rv = photo.closest('.rv');
    if (!rv) return;
    photo.classList.remove('m-in');
    const armed = whenShown(rv, () => {
      photo.style.setProperty('--m-d', `${(rvDelay(rv) + 0.1).toFixed(2)}s`);
      photo.classList.add('m-in');
    });
    if (armed) photo.classList.add('m-photo');
  });
  armarFotos();

  /* ---------- Volver a la página desde la caché del navegador (Atrás / Adelante) ---------- */
  // js/carga.js repite la animación de carga y avisa con ith:replay: main.js vuelve a ocultar lo revelado y lo revela de
  // nuevo al abrirse el telón; acá se vuelven a armar títulos y fotos, y el texto del hero repite su entrada.
  document.addEventListener('ith:replay', () => {
    armarTitulos();
    armarFotos();
    document.querySelectorAll('.hero__line, .hero__lead').forEach((el) => {
      if (typeof el.getAnimations !== 'function') return;
      el.getAnimations().forEach((a) => { a.cancel(); a.play(); });
    });
  });

  /* ---------- Slider de Presencia: sentido del cambio ---------- */
  // main.js cambia aria-selected en las pestañas; acá se anota hacia dónde fue (data-m-dir) para que el indicador y
  // la vista entrante se muevan en ese sentido (ver motion.css).
  const pres = document.querySelector('[data-pres-slider]');
  if (pres) {
    const tabs = [...pres.querySelectorAll('[role="tab"]')];
    const selected = () => tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true');
    let current = selected();
    new MutationObserver(() => {
      const i = selected();
      if (i < 0 || i === current) return;
      pres.dataset.mDir = i > current ? 'next' : 'prev';
      current = i;
    }).observe(pres, { subtree: true, attributes: true, attributeFilter: ['aria-selected'] });
  }
})();
