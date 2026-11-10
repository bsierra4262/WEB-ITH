// Preguntas frecuentes: <details name="faq"> ya es un acordeón exclusivo en los
// navegadores actuales. Esto solo lo replica donde el atributo name no existe
// (Safari < 17.2, Firefox < 130): al abrir una pregunta se cierran las demás.
export function initFaq() {
  if ('name' in HTMLDetailsElement.prototype) return;

  const items = [...document.querySelectorAll('details.faq__item[name]')];
  if (items.length < 2) return;

  for (const item of items) {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      const group = item.getAttribute('name');
      for (const other of items) {
        if (other !== item && other.open && other.getAttribute('name') === group) other.open = false;
      }
    });
  }
}
