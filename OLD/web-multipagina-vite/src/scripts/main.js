// Fuentes propias: solo subsets latin + latin-ext (ver src/styles/fonts.css).
import '../styles/fonts.css';
import '../styles/main.css';

import { initReveal } from './modules/reveal.js';
import { initCounters } from './modules/counters.js';
import { initNotes } from './modules/notes.js';
import { initHeader } from './modules/header.js';
import { initMarquee } from './modules/marquee.js';
import { initMap } from './modules/map.js';
import { initFaq } from './modules/faq.js';
import { initContactForm } from './modules/contact-form.js';
import { initSelect } from './modules/select.js';
import { initWaFloat } from './modules/wa-float.js';
import { initWaTexto } from './modules/wa-texto.js';
import { initAnalytics } from './modules/analytics.js';

// Cada módulo revisa si su sección existe en la página: el mismo main.js
// sirve para la home y para todas las páginas internas.
// initAnalytics va primero para no perder clics; initWaTexto antes que
// initWaFloat para que el flotante ya tenga el mensaje de la página;
// initSelect después de initContactForm para tomar la opción preelegida.
const modules = [
  initAnalytics,
  initNotes,
  initHeader,
  initReveal,
  initCounters,
  initMarquee,
  initMap,
  initFaq,
  initContactForm,
  initSelect,
  initWaTexto,
  initWaFloat,
];

function boot() {
  for (const init of modules) {
    try {
      init();
    } catch (err) {
      console.error(`[ith] fallo al iniciar ${init.name}`, err);
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
