// Botón flotante de WhatsApp con criterio, para que nunca haya dos a la vista:
// - no aparece mientras se ve el hero (ahí ya están los CTA principales): el de
//   la home (#inicio) o el hero de página de las internas ([data-hero]);
// - se oculta mientras se ve la sección de contacto (#agenda) o el footer,
//   que tienen su propio WhatsApp (en el celular el footer queda solo en
//   pantalla al llegar al fondo, sin #agenda a la vista);
// - se oculta mientras el menú mobile está abierto.
// Sin JS el botón queda siempre visible.
export function initWaFloat() {
  const btn = document.querySelector('.wa-float');
  if (!btn || !('IntersectionObserver' in window)) return;

  const header = document.querySelector('.site-header');
  const visibles = new Set();

  const update = () => {
    const menuOpen = header?.classList.contains('is-open') ?? false;
    const hidden = menuOpen || visibles.size > 0;
    btn.classList.toggle('is-hidden', hidden);
    btn.toggleAttribute('inert', hidden);
    if (hidden) btn.setAttribute('aria-hidden', 'true');
    else btn.removeAttribute('aria-hidden');
  };

  const io = new IntersectionObserver(
    (entries) => {
      for (const { target, isIntersecting } of entries) {
        if (isIntersecting) visibles.add(target);
        else visibles.delete(target);
      }
      update();
    },
    { threshold: 0.12 },
  );
  for (const el of document.querySelectorAll('#inicio, [data-hero], #agenda, .site-footer')) io.observe(el);

  if (header) new MutationObserver(update).observe(header, { attributes: true, attributeFilter: ['class'] });
  update();
}
