// Contadores animados, igual que el código original: cuentan de 0 al valor
// cada vez que entran en pantalla y vuelven a 0 al salir.
// Marcado: <span data-count="14" data-count-delay="1200">14</span>
// El valor final queda escrito en el HTML (SEO, sin JS, lectores de pantalla).
export function initCounters() {
  const els = [...document.querySelectorAll('[data-count]')];
  if (!els.length || !('IntersectionObserver' in window)) return;

  const state = new Map();
  const DUR = 2200;

  const stop = (el) => {
    const s = state.get(el);
    if (s) {
      cancelAnimationFrame(s.raf);
      clearTimeout(s.timer);
    }
  };

  const run = (el) => {
    const target = parseInt(el.dataset.count, 10);
    if (Number.isNaN(target)) return;
    stop(el);
    el.textContent = '0';
    const s = { raf: 0, timer: 0 };
    state.set(el, s);
    s.timer = setTimeout(() => {
      const t0 = performance.now();
      const step = (now) => {
        const k = Math.min(1, (now - t0) / DUR);
        el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3))).toLocaleString('es-AR');
        if (k < 1) s.raf = requestAnimationFrame(step);
      };
      s.raf = requestAnimationFrame(step);
    }, parseInt(el.dataset.countDelay ?? '300', 10));
  };

  const io = new IntersectionObserver(
    (entries) => {
      for (const { target, isIntersecting } of entries) {
        if (isIntersecting) run(target);
        else {
          stop(target);
          target.textContent = '0';
        }
      }
    },
    { threshold: 0.35 },
  );
  els.forEach((el) => io.observe(el));
}
