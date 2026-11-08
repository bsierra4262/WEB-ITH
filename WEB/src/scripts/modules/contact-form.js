// Formulario "Agendá una reunión" (#contact-form), en la home y en la banda
// CTA de las páginas internas (mismo parcial: src/partials/agenda.html).
// Sin JS el navegador valida con los atributos required/type y hace un POST
// normal a contact.php, que vuelve a la página de origen con ?enviado=1#agenda.
// Con JS:
//  - data-necesidad del formulario deja elegida esa opción del select (antes
//    de que select.js arme el desplegable propio, que la toma de ahí);
//  - validación en español con aria-invalid + mensaje bajo el campo
//    (aria-describedby) y foco en el primer error;
//  - campos ocultos del canal de origen (canal, utm_*, gclid, li_fat_id,
//    referrer, landing, visitas_landing) con la primera visita que guardó
//    analytics.js: llegan al mail y al CRM;
//  - casilla de consentimiento obligatoria (Ley 25.326) y clave del envío
//    (idem): si el mismo envío se repite, el CRM no duplica la consulta;
//  - envío con fetch (el PHP responde JSON por el header X-Requested-With);
//  - éxito: el formulario se reemplaza por el mensaje de gracias, con foco,
//    y se registra la conversión generate_lead con el origen (analytics.js);
//  - error: aviso en la región role="status" con el mail como alternativa.
import { track, origenVisita, visitasLanding } from './analytics.js';

const MESSAGES = {
  nombre: 'Escribí tu nombre y apellido.',
  empresa: 'Escribí el nombre de tu empresa u organismo.',
  mail: 'Escribí tu mail laboral.',
  mailInvalid: 'Revisá el mail: tiene que tener la forma nombre@empresa.com.',
  acepto: 'Para continuar, aceptá el uso de tus datos.',
  generic: 'Completá este campo.',
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TIMEOUT_MS = 15000;

/** Clave de un envío: la misma mientras no cambien los datos. */
export function nuevoIdem() {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID();
  const bytes = new Uint8Array(16);
  globalThis.crypto?.getRandomValues?.(bytes);
  return [...bytes].map((b) => (b || Math.floor(Math.random() * 256)).toString(16).padStart(2, '0')).join('');
}

/** Mensaje de error del campo, o '' si está bien. También lo usa diagnostico.js. */
export function validate(input) {
  if (input.type === 'checkbox') return input.required && !input.checked ? MESSAGES[input.name] ?? MESSAGES.generic : '';
  const value = input.value.trim();
  if (input.required && !value) return MESSAGES[input.name] ?? MESSAGES.generic;
  if (input.type === 'email' && value && !EMAIL.test(value)) return MESSAGES.mailInvalid;
  return '';
}

/** Marca o limpia el error de un campo (aria-invalid + mensaje debajo). */
export function setError(input, message) {
  const id = `${input.id}-error`;
  let error = document.getElementById(id);
  const describedBy = new Set((input.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean));

  if (message) {
    if (!error) {
      error = document.createElement('p');
      error.id = id;
      error.className = 'agenda__error';
      // Un <select> reemplazado por select.js: el mensaje va debajo del
      // desplegable. La casilla de consentimiento: debajo de su texto.
      (input.closest('.select') ?? input.closest('.agenda__check') ?? input).after(error);
    }
    error.textContent = message;
    input.setAttribute('aria-invalid', 'true');
    describedBy.add(id);
  } else {
    error?.remove();
    input.removeAttribute('aria-invalid');
    describedBy.delete(id);
  }

  if (describedBy.size) input.setAttribute('aria-describedby', [...describedBy].join(' '));
  else input.removeAttribute('aria-describedby');
}

export function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.noValidate = true;

  const success = document.getElementById('contact-success');
  const status = form.querySelector('[role="status"]');
  const submit = form.querySelector('[type="submit"]');
  const label = submit?.querySelector('.agenda__submit-label') ?? submit;
  const idleText = label?.textContent ?? '';
  const email = form.dataset.email || '';
  const fields = [...form.querySelectorAll('input:not([name="website"]):not([type="hidden"]), select, textarea')];
  const origen = form.elements.namedItem('origen');
  if (origen && !origen.value) origen.value = location.pathname;

  // Canal de origen (primera visita): llega al final del mail y al CRM.
  for (const [name, value] of Object.entries({ ...origenVisita(), visitas_landing: visitasLanding() })) {
    const input = form.elements.namedItem(name);
    if (input instanceof HTMLInputElement && input.type === 'hidden' && value) input.value = String(value);
  }

  // Clave del envío: se renueva cuando cambian los datos o después de enviar.
  const idem = form.elements.namedItem('idem');
  const renovarIdem = () => {
    if (idem instanceof HTMLInputElement) idem.value = nuevoIdem();
  };
  renovarIdem();
  form.addEventListener('input', renovarIdem);
  form.addEventListener('change', renovarIdem);

  // Opción preelegida según la página (prop "necesidad" de pagina/cta.html).
  const necesidad = form.dataset.necesidad;
  const select = form.elements.namedItem('necesidad');
  if (necesidad && select) {
    const option = [...select.options].find((o) => o.value === necesidad || o.text === necesidad);
    if (option) option.selected = true;
  }
  let sending = false;
  let attempted = false;

  const showSuccess = (focus = true) => {
    if (!success) return;
    form.hidden = true;
    success.hidden = false;
    if (focus) success.focus();
  };

  const showError = (detail) => {
    if (!status) return;
    const parts = [detail || 'No pudimos enviar tus datos. Probá de nuevo en unos minutos.'];
    if (email) {
      const link = document.createElement('a');
      link.href = `mailto:${email}`;
      link.textContent = email;
      parts.push(' También podés escribirnos a ', link, '.');
    }
    // Un solo bloque de texto al lado del ícono del aviso (agenda.css).
    const text = document.createElement('span');
    text.append(...parts);
    status.replaceChildren(text);
  };

  const setSending = (on) => {
    sending = on;
    form.setAttribute('aria-busy', String(on));
    if (!submit) return;
    if (on) submit.setAttribute('aria-disabled', 'true');
    else submit.removeAttribute('aria-disabled');
    if (label) label.textContent = on ? 'Enviando…' : idleText;
  };

  // Volvió del POST sin JS (contact.php redirige con ?enviado=1)
  const params = new URLSearchParams(location.search);
  if (params.get('enviado') === '1') {
    showSuccess();
    track('generate_lead', { form_id: 'contact-form', origen: location.pathname, servicio: '' });
    params.delete('enviado');
    const query = params.toString();
    history.replaceState(history.state, '', `${location.pathname}${query ? `?${query}` : ''}${location.hash}`);
  }

  // Después del primer intento, cada campo se revalida mientras se corrige.
  const revalidar = (event) => {
    if (!attempted || !fields.includes(event.target)) return;
    setError(event.target, validate(event.target));
  };
  form.addEventListener('input', revalidar);
  form.addEventListener('change', revalidar);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending) return;
    attempted = true;
    status?.replaceChildren();

    let firstInvalid = null;
    for (const input of fields) {
      const message = validate(input);
      setError(input, message);
      if (message && !firstInvalid) firstInvalid = input;
    }
    if (firstInvalid) {
      const enhanced = firstInvalid.dataset.enhancedBy && document.getElementById(firstInvalid.dataset.enhancedBy);
      (enhanced || firstInvalid).focus();
      return;
    }

    setSending(true);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json', 'X-Requested-With': 'fetch' },
        credentials: 'same-origin',
        signal: controller.signal,
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok) {
        showError(data?.error);
        return;
      }
      const servicio = select?.value || '';
      form.reset();
      renovarIdem();
      showSuccess();
      track('generate_lead', { form_id: 'contact-form', origen: origen?.value || location.pathname, servicio });
    } catch {
      showError();
    } finally {
      clearTimeout(timer);
      setSending(false);
    }
  });
}
