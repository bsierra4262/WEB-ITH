// Desplegable propio para los <select data-select> (hoy, "¿Qué necesitás?"
// del formulario de reunión). Mejora progresiva: sin JS queda el <select>
// nativo; con JS se arma un botón + lista con el patrón de la APG de WAI-ARIA
// (botón con aria-haspopup="listbox" y lista role="listbox" con
// aria-activedescendant). El <select> real sigue en el formulario, oculto,
// con su name: es el que viaja en el envío. Cada elección lo actualiza y
// dispara input/change, así la validación de contact-form.js sigue igual.
//
// Teclado
//   en el botón: ↓ ↑ Enter Espacio abren · Home/End abren en la primera/última
//                · una letra abre en la opción que empieza con esa letra
//   en la lista: ↓ ↑ mueven · Home/End primera/última · letras buscan
//                · Enter/Espacio eligen y cierran · Escape cierra sin cambiar
//                · Tab elige la opción marcada, cierra y sigue al próximo campo
// Mouse: clic en el botón abre/cierra, clic en una opción la elige, clic
// afuera cierra.

const CHEVRON =
  '<svg class="select__chev" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';
const CHECK =
  '<svg class="select__check" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

const TYPEAHEAD_MS = 600;

// "Cámaras" y "camaras" tienen que coincidir al buscar por letra.
const normalize = (text) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();

function enhance(select) {
  const id = select.id || `select-${Math.random().toString(36).slice(2, 8)}`;
  select.id = id;
  const label = document.querySelector(`label[for="${id}"]`);
  const labelId = label ? label.id || `${id}-label` : '';
  if (label) label.id = labelId;

  // Opciones de la lista: todas menos la vacía ("Elegí una opción"), que
  // queda como texto de ayuda del botón mientras no haya nada elegido.
  const placeholderOption = [...select.options].find((o) => o.value === '');
  const placeholder = placeholderOption?.text ?? 'Elegí una opción';
  const items = [...select.options].filter((o) => o.value !== '' && !o.disabled);

  const wrapper = document.createElement('div');
  wrapper.className = 'select';

  const button = document.createElement('button');
  button.type = 'button';
  button.id = `${id}-button`;
  button.className = 'field select__button';
  button.setAttribute('aria-haspopup', 'listbox');
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', `${id}-list`);

  const value = document.createElement('span');
  value.className = 'select__value';
  value.id = `${id}-value`;
  button.append(value);
  button.insertAdjacentHTML('beforeend', CHEVRON);
  button.setAttribute('aria-labelledby', [labelId, value.id].filter(Boolean).join(' '));

  const list = document.createElement('ul');
  list.className = 'select__list';
  list.id = `${id}-list`;
  list.setAttribute('role', 'listbox');
  list.tabIndex = -1;
  if (labelId) list.setAttribute('aria-labelledby', labelId);
  list.hidden = true;

  const optionEls = items.map((option, index) => {
    const li = document.createElement('li');
    li.className = 'select__option';
    li.id = `${id}-opt-${index}`;
    li.setAttribute('role', 'option');
    li.setAttribute('aria-selected', 'false');
    li.dataset.index = String(index);
    const text = document.createElement('span');
    text.textContent = option.text;
    li.append(text);
    li.insertAdjacentHTML('beforeend', CHECK);
    list.append(li);
    return li;
  });

  // Armado: el <select> se oculta (sin foco ni lector de pantalla) y queda
  // dentro del contenedor, al lado del botón y la lista.
  select.before(wrapper);
  wrapper.append(select, button, list);
  select.classList.add('select__native');
  select.tabIndex = -1;
  select.setAttribute('aria-hidden', 'true');
  select.dataset.enhancedBy = button.id;
  if (label) {
    label.htmlFor = button.id;
    // Clic en la etiqueta: foco en el botón, sin abrir la lista (como el nativo).
    label.addEventListener('click', (event) => {
      event.preventDefault();
      button.focus();
    });
  }

  let active = -1;
  let typed = '';
  let typedTimer = 0;

  const selectedIndex = () => items.findIndex((o) => o.selected && o.value !== '');
  const isOpen = () => !list.hidden;

  // Del <select> real a la vista (al iniciar, al reiniciar el formulario o
  // si otro script cambia el valor).
  const render = () => {
    const current = selectedIndex();
    value.textContent = current >= 0 ? items[current].text : placeholder;
    value.toggleAttribute('data-placeholder', current < 0);
    optionEls.forEach((li, i) => li.setAttribute('aria-selected', String(i === current)));
  };

  const setActive = (index, { scroll = true } = {}) => {
    if (!optionEls.length) return;
    active = Math.max(0, Math.min(index, optionEls.length - 1));
    optionEls.forEach((li, i) => li.classList.toggle('is-active', i === active));
    list.setAttribute('aria-activedescendant', optionEls[active].id);
    if (scroll) optionEls[active].scrollIntoView({ block: 'nearest' });
  };

  // Abre hacia abajo; solo va hacia arriba si abajo no entra y arriba (sin
  // contar el header fijo) entra entera.
  const place = () => {
    wrapper.classList.remove('is-up');
    const rect = button.getBoundingClientRect();
    const needed = Math.min(list.scrollHeight, 392) + 12;
    const below = window.innerHeight - rect.bottom;
    const headerBottom = Math.max(0, document.querySelector('.site-header')?.getBoundingClientRect().bottom ?? 0);
    const above = rect.top - headerBottom;
    if (below < needed && above >= needed) wrapper.classList.add('is-up');
  };

  const open = (start) => {
    if (!isOpen()) {
      list.hidden = false;
      wrapper.classList.add('is-open');
      button.setAttribute('aria-expanded', 'true');
      place();
    }
    const current = selectedIndex();
    let index = current >= 0 ? current : 0;
    if (start === 'first') index = 0;
    else if (start === 'last') index = optionEls.length - 1;
    else if (typeof start === 'number') index = start;
    setActive(index);
    list.focus({ preventScroll: true });
  };

  const close = ({ focusButton = true } = {}) => {
    if (!isOpen()) return;
    list.hidden = true;
    wrapper.classList.remove('is-open', 'is-up');
    button.setAttribute('aria-expanded', 'false');
    list.removeAttribute('aria-activedescendant');
    if (focusButton) button.focus({ preventScroll: true });
  };

  const choose = (index) => {
    const option = items[index];
    if (!option) return;
    const changed = !option.selected;
    option.selected = true;
    render();
    if (changed) {
      select.dispatchEvent(new Event('input', { bubbles: true }));
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  // Búsqueda por letra: acumula lo tecleado; si se repite la misma letra,
  // recorre las opciones que empiezan con ella.
  const typeahead = (char) => {
    clearTimeout(typedTimer);
    typedTimer = setTimeout(() => (typed = ''), TYPEAHEAD_MS);
    typed += normalize(char);
    const labels = items.map((o) => normalize(o.text));
    const repeated = typed.length > 1 && [...typed].every((c) => c === typed[0]);
    const query = repeated ? typed[0] : typed;
    // Una letra (o la misma repetida) arranca después de la actual; una
    // palabra en curso arranca en la actual.
    const from = isOpen() ? active : selectedIndex();
    const start = from < 0 ? 0 : from + (repeated || typed.length === 1 ? 1 : 0);
    for (let step = 0; step < labels.length; step++) {
      const i = (start + step) % labels.length;
      if (labels[i].startsWith(query)) return i;
    }
    return -1;
  };

  const isPrintable = (event) =>
    event.key.length === 1 && event.key !== ' ' && !event.ctrlKey && !event.metaKey && !event.altKey;

  button.addEventListener('click', () => {
    if (isOpen()) close();
    else open();
  });

  button.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
      case 'Enter':
      case ' ':
        event.preventDefault();
        open();
        break;
      case 'Home':
        event.preventDefault();
        open('first');
        break;
      case 'End':
        event.preventDefault();
        open('last');
        break;
      default:
        if (isPrintable(event)) {
          event.preventDefault();
          const match = typeahead(event.key);
          open(match >= 0 ? match : undefined);
        }
    }
  });

  list.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActive(active + 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActive(active - 1);
        break;
      case 'Home':
      case 'PageUp':
        event.preventDefault();
        setActive(0);
        break;
      case 'End':
      case 'PageDown':
        event.preventDefault();
        setActive(optionEls.length - 1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        choose(active);
        close();
        break;
      case 'Escape':
        event.preventDefault();
        event.stopPropagation(); // que no cierre también otra cosa (menú)
        close();
        break;
      case 'Tab':
        // Elige la marcada y deja que el Tab siga su curso desde el botón.
        choose(active);
        close();
        break;
      default:
        if (isPrintable(event)) {
          event.preventDefault();
          const match = typeahead(event.key);
          if (match >= 0) setActive(match);
        }
    }
  });

  // Mouse: el hover marca la opción, el clic la elige.
  list.addEventListener('pointermove', (event) => {
    const li = event.target.closest('.select__option');
    if (li && Number(li.dataset.index) !== active) setActive(Number(li.dataset.index), { scroll: false });
  });

  // pointerdown sin foco: la lista no pierde el foco antes del clic.
  list.addEventListener('pointerdown', (event) => event.preventDefault());

  list.addEventListener('click', (event) => {
    const li = event.target.closest('.select__option');
    if (!li) return;
    choose(Number(li.dataset.index));
    close();
  });

  // Clic afuera o foco que se va a otro lado: cierra sin cambiar.
  document.addEventListener('pointerdown', (event) => {
    if (isOpen() && !wrapper.contains(event.target)) close({ focusButton: false });
  });

  wrapper.addEventListener('focusout', (event) => {
    if (isOpen() && event.relatedTarget && !wrapper.contains(event.relatedTarget)) close({ focusButton: false });
  });

  window.addEventListener('resize', () => isOpen() && place());

  // Sincronía con el <select> real.
  select.addEventListener('change', render);
  select.form?.addEventListener('reset', () => setTimeout(render));

  // Si contact-form.js marca el campo con error, el botón lo refleja.
  new MutationObserver(() => {
    for (const attr of ['aria-invalid', 'aria-describedby']) {
      const v = select.getAttribute(attr);
      if (v === null) button.removeAttribute(attr);
      else button.setAttribute(attr, v);
    }
  }).observe(select, { attributes: true, attributeFilter: ['aria-invalid', 'aria-describedby'] });

  render();
}

// root: para los formularios que se agregan después de iniciar la página (el
// selector de la agenda en /diagnostico/). Los que ya tienen su desplegable
// (data-enhanced-by) no se vuelven a armar.
export function initSelect(root = document) {
  root.querySelectorAll('select[data-select]:not([data-enhanced-by])').forEach(enhance);
}
