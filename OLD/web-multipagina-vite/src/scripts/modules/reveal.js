// Aparición escalonada al hacer scroll, igual que el código original: cada .rv
// se anima al entrar en pantalla y se "resetea" al salir, así vuelve a animarse
// cada vez que el usuario pasa por ahí. data-d="0.25" fija la demora; si no, se
// escalona según la posición entre hermanos .rv.
export function initReveal() {
  const els = [...document.querySelectorAll('.rv')];
  if (!els.length || !('IntersectionObserver' in window)) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const { target: el, isIntersecting } of entries) {
        if (isIntersecting) {
          let d = parseFloat(el.dataset.d);
          if (Number.isNaN(d)) {
            const sibs = [...(el.parentElement?.children ?? [])].filter((c) => c.classList.contains('rv'));
            d = Math.max(0, sibs.indexOf(el)) * 0.09;
          }
          el.style.animationDelay = `${d}s`;
          el.classList.remove('pre');
          el.classList.add('show');
        } else {
          el.classList.remove('show');
          el.classList.add('pre');
        }
      }
    },
    { threshold: 0.1, rootMargin: '0px 0px -4% 0px' },
  );

  for (const el of els) {
    el.classList.add('pre');
    io.observe(el);
  }
}
