// Auditoría responsive: las 6 páginas del sitio en los anchos de PC, notebook, tableta y celular (vertical y
// horizontal). Para cada página y tamaño revisa:
//   - scroll horizontal de la página;
//   - elementos que se salen de la pantalla (recortes): textos, botones, enlaces e imágenes cuyo área visible (después de
//     los recortes de sus contenedores, como carruseles y bandas) cae fuera del ancho de la ventana;
//   - controles superpuestos: botones y enlaces que se pisan entre sí (más de 4 px en los dos sentidos);
//   - tocables chicos en celular (lado menor < 44 px), sin contar los enlaces dentro de un texto corrido;
//   - textos de menos de 12 px;
//   - imágenes estiradas por encima de su tamaño real (se verían borrosas).
// Además prueba el globo de WhatsApp abierto (que entre en la pantalla).
// Guarda un resumen en responsive.json y, con CAPTURAS=1, una captura de la primera pantalla por página y tamaño.
//
// Uso: node responsive.mjs [carpeta-de-salida]     (por defecto ./resultados-responsive)
// Variables: SITIO_URL (por defecto http://127.0.0.1:5174), CHROME_PATH, CAPTURAS=1, SOLO=home,postulate (páginas),
//            TAMANOS=390x844,1440x900 (tamaños).
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const OUT = path.resolve(process.argv[2] || 'resultados-responsive');
const BASE = (process.env.SITIO_URL || 'http://127.0.0.1:5174').replace(/\/$/, '');
const CHROME = process.env.CHROME_PATH || {
  win32: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  linux: '/usr/bin/google-chrome',
}[process.platform];
fs.mkdirSync(OUT, { recursive: true });

const TODAS = [['home', '/'], ['diagnostico-sin-cargo', '/diagnostico-sin-cargo/'], ['gracias-reserva', '/gracias-reserva/'], ['postulate', '/postulate/'], ['privacidad', '/privacidad/'], ['404', '/404.html']];
const PAGINAS = process.env.SOLO ? TODAS.filter(([n]) => process.env.SOLO.split(',').includes(n)) : TODAS;
// [ancho, alto, celular (táctil)]
const TODOS = [
  [320, 568, true], [360, 780, true], [375, 667, true], [390, 844, true], [412, 915, true], [414, 896, true], [430, 932, true],
  [768, 1024, true], [820, 1180, true], [834, 1194, true], [1024, 1366, true], [1180, 820, true],
  [1280, 800, false], [1366, 768, false], [1440, 900, false], [1536, 864, false], [1680, 1050, false], [1920, 1080, false], [2560, 1440, false],
  // Celulares en horizontal
  [667, 375, true], [844, 390, true], [932, 430, true],
];
const TAMANOS = process.env.TAMANOS
  ? TODOS.filter(([w, h]) => process.env.TAMANOS.split(',').includes(`${w}x${h}`))
  : TODOS;
const FIXTURE = { vacancies: [
  { name: 'Técnico de soporte en sitio', locality: 'CABA, Buenos Aires', descript: '<p>Soporte a usuarios en las oficinas de un cliente.</p>', requirements: '', benefits: '', details: '', link: 'https://intellihelp.hiringroom.com/jobs/get_vacancy/1', form_link: 'https://intellihelp.hiringroom.com/jobs/get_vacancy/1/apply' },
] };

// Se evalúa dentro de la página
function auditar(movil) {
  const vw = document.documentElement.clientWidth;
  const visible = (el) => {
    if (el.closest('[hidden], [aria-hidden="true"], .sr-only, [inert]')) return false;
    const plegado = el.closest('details:not([open])'); // respuesta o "Ver más" cerrado: no se ve
    if (plegado && !el.closest('summary')) return false;
    const s = getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden' || Number(s.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 1 && r.height > 1;
  };
  // Rectángulo visible: el del elemento recortado por cada ancestro con overflow que no sea visible
  const recortado = (el) => {
    const r = el.getBoundingClientRect();
    let x1 = r.left, y1 = r.top, x2 = r.right, y2 = r.bottom;
    for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
      const s = getComputedStyle(a);
      if (s.overflowX !== 'visible' || s.overflowY !== 'visible' || s.clipPath !== 'none') {
        const ra = a.getBoundingClientRect();
        if (s.overflowX !== 'visible') { x1 = Math.max(x1, ra.left); x2 = Math.min(x2, ra.right); }
        if (s.overflowY !== 'visible') { y1 = Math.max(y1, ra.top); y2 = Math.min(y2, ra.bottom); }
      }
      if (s.position === 'fixed') break;
    }
    return { x1, y1, x2, y2, w: x2 - x1, h: y2 - y1 };
  };
  const desc = (el) => `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}.${String(el.className).trim().split(/\s+/).slice(0, 2).join('.')}${el.textContent ? ' «' + el.textContent.trim().replace(/\s+/g, ' ').slice(0, 30) + '»' : ''}`;
  const res = { scrollX: document.documentElement.scrollWidth - vw, fuera: [], superpuestos: [], chicos: [], letraChica: [], estiradas: [] };

  // Recortes: cosas que se salen del ancho de la ventana
  document.querySelectorAll('h1, h2, h3, h4, p, li, a, button, img, svg.armap, .btn, label, input, textarea').forEach((el) => {
    if (!visible(el)) return;
    const c = recortado(el);
    if (c.w <= 1 || c.h <= 1) return; // totalmente recortado por un contenedor (carrusel, banda): no se ve
    if (c.x1 < -1 || c.x2 > vw + 1) res.fuera.push(`${desc(el)} [${Math.round(c.x1)}..${Math.round(c.x2)}]`);
  });

  // Controles
  const controles = [...document.querySelectorAll('a[href], button, summary, [role="tab"], input:not([type=hidden]), textarea')]
    .filter((el) => visible(el) && !el.closest('.wa-float, .wa-globo, .cinta, .site-header'));
  const cajas = controles.map((el) => ({ el, c: recortado(el) })).filter((x) => x.c.w > 1 && x.c.h > 1);
  for (let i = 0; i < cajas.length; i++) {
    for (let j = i + 1; j < cajas.length; j++) {
      const a = cajas[i], b = cajas[j];
      if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
      const dx = Math.min(a.c.x2, b.c.x2) - Math.max(a.c.x1, b.c.x1);
      const dy = Math.min(a.c.y2, b.c.y2) - Math.max(a.c.y1, b.c.y1);
      if (dx > 4 && dy > 4) res.superpuestos.push(`${desc(a.el)} ⟷ ${desc(b.el)}`);
    }
  }
  // Header: logo, menú y botón no se pisan
  const hd = [...document.querySelectorAll('.site-header__inner > *')].filter(visible);
  for (let i = 0; i < hd.length; i++) for (let j = i + 1; j < hd.length; j++) {
    const a = hd[i].getBoundingClientRect(), b = hd[j].getBoundingClientRect();
    if (Math.min(a.right, b.right) - Math.max(a.left, b.left) > 2 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 2) res.superpuestos.push(`header: ${desc(hd[i])} ⟷ ${desc(hd[j])}`);
  }

  if (movil) {
    cajas.forEach(({ el, c }) => {
      // Enlaces dentro de un texto corrido: excepción de las pautas de accesibilidad (WCAG 2.5.8)
      if (el.tagName === 'A' && el.closest('p, dd, .legal-body li, .faq__a') && !el.matches('.btn, .next-link')) return;
      const r = el.getBoundingClientRect();
      // Días del calendario del diagnóstico: 44 px de alto y el ancho que da la grilla de 7 columnas (en 320 px, 38 px;
      // por encima del mínimo de 24 px de WCAG 2.5.8)
      if (el.matches('.dx-mes__dia') && r.height >= 43.5 && r.width >= 36) return;
      if (Math.min(r.width, r.height) < 43.5) res.chicos.push(`${desc(el)} ${Math.round(r.width)}×${Math.round(r.height)}`);
    });
  }

  // Letra chica (texto propio visible)
  const vistos = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const t = walker.currentNode;
    const el = t.parentElement;
    if (!t.textContent.trim() || !el || vistos.has(el) || !visible(el) || el.closest('svg, script, style, noscript')) continue;
    vistos.add(el);
    const fs = parseFloat(getComputedStyle(el).fontSize);
    if (fs < 11.5) res.letraChica.push(`${desc(el)} ${fs}px`);
  }

  // Imágenes estiradas
  document.querySelectorAll('img').forEach((img) => {
    if (!visible(img) || !img.naturalWidth || img.src.endsWith('.svg')) return;
    const r = img.getBoundingClientRect();
    if (r.width > img.naturalWidth * 1.02 + 1) res.estiradas.push(`${desc(img)} ${Math.round(r.width)}px > ${img.naturalWidth}px reales`);
  });
  return res;
}

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
const resumen = [];
let fallas = 0;
for (const [w, h, movil] of TAMANOS) {
  for (const [nombre, ruta] of PAGINAS) {
    const p = await browser.newPage();
    await p.setViewport({ width: w, height: h, isMobile: movil, hasTouch: movil, deviceScaleFactor: 1 });
    await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
    const errs = [];
    p.on('pageerror', (e) => errs.push(e.message));
    await p.setRequestInterception(true);
    p.on('request', (r) => {
      const u = r.url();
      if (/googletagmanager/.test(u)) return r.respond({ status: 200, contentType: 'text/javascript', body: '' });
      if (/get_vacancy_list/.test(u)) return r.respond({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(FIXTURE) });
      return r.continue();
    });
    await p.goto(BASE + ruta, { waitUntil: 'networkidle2' });
    await p.waitForFunction(() => !document.documentElement.classList.contains('m-intro'), { timeout: 6000 }).catch(() => {});
    await sleep(600);
    if (process.env.CAPTURAS) await p.screenshot({ path: path.join(OUT, `${nombre}-${w}x${h}.jpg`), type: 'jpeg', quality: 70 });
    // Recorrer la página para que aparezca todo
    await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += Math.max(300, innerHeight * 0.8)) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 70)); } });
    await sleep(1400);
    await p.evaluate(() => window.scrollTo(0, 0));
    await sleep(400);
    const movilChico = w <= 480 || h <= 430;
    const r = await p.evaluate(auditar, movilChico);
    // Globo de WhatsApp abierto: entra entero en la pantalla
    const globo = await p.evaluate(() => {
      const f = document.querySelector('.wa-float');
      if (!f) return 'sin botón';
      f.click();
      return new Promise((res) => setTimeout(() => {
        const g = document.querySelector('.wa-globo');
        if (!g || g.hidden) { res('no abre'); return; }
        const b = g.getBoundingClientRect();
        const ok = b.left >= 0 && b.right <= document.documentElement.clientWidth && b.top >= 0 && b.bottom <= innerHeight;
        res(ok ? '' : `globo fuera de pantalla [${Math.round(b.left)},${Math.round(b.top)} – ${Math.round(b.right)},${Math.round(b.bottom)}]`);
      }, 500));
    });
    // Menú en pantallas angostas: el panel entra en la pantalla y el CTA se alcanza
    await p.keyboard.press('Escape');
    await sleep(300);
    const menu = await p.evaluate(() => new Promise((res) => {
      const t = document.querySelector('.nav-toggle');
      if (!t || !t.offsetParent) { res(''); return; }
      window.scrollTo(0, 0);
      t.click();
      setTimeout(() => {
        const nav = document.querySelector('.nav');
        const cta = nav && nav.querySelector('.site-header__cta');
        if (!nav || !cta) { res('sin panel'); return; }
        nav.scrollTop = nav.scrollHeight;
        setTimeout(() => {
          const n = nav.getBoundingClientRect();
          const c = cta.getBoundingClientRect();
          const mal = [];
          if (n.bottom > innerHeight + 1) mal.push(`el panel termina en ${Math.round(n.bottom)} px (pantalla de ${innerHeight})`);
          if (c.bottom > innerHeight + 1 || c.top < 0) mal.push('el CTA "Agendá reunión" queda fuera de pantalla');
          t.click();
          res(mal.join('; '));
        }, 400);
      }, 500);
    }));
    const problemas = [];
    if (menu) problemas.push(`menú: ${menu}`);
    if (r.scrollX > 0) problemas.push(`scroll horizontal de ${r.scrollX}px`);
    if (r.fuera.length) problemas.push(`fuera de pantalla: ${r.fuera.slice(0, 5).join(' | ')}${r.fuera.length > 5 ? ` (+${r.fuera.length - 5})` : ''}`);
    if (r.superpuestos.length) problemas.push(`superpuestos: ${r.superpuestos.slice(0, 5).join(' | ')}${r.superpuestos.length > 5 ? ` (+${r.superpuestos.length - 5})` : ''}`);
    if (r.chicos.length) problemas.push(`tocables < 44px: ${r.chicos.slice(0, 6).join(' | ')}${r.chicos.length > 6 ? ` (+${r.chicos.length - 6})` : ''}`);
    if (r.letraChica.length) problemas.push(`letra < 12px: ${r.letraChica.slice(0, 4).join(' | ')}${r.letraChica.length > 4 ? ` (+${r.letraChica.length - 4})` : ''}`);
    if (r.estiradas.length) problemas.push(`imágenes estiradas: ${r.estiradas.slice(0, 4).join(' | ')}`);
    if (globo) problemas.push(`WhatsApp: ${globo}`);
    if (errs.length) problemas.push(`errores JS: ${errs.join(' | ')}`);
    const etiqueta = `${nombre.padEnd(22)} ${String(w).padStart(4)}x${h}`;
    if (problemas.length) { fallas++; console.log(`FALLA ${etiqueta}\n   - ${problemas.join('\n   - ')}`); } else console.log(`OK    ${etiqueta}`);
    resumen.push({ pagina: nombre, ancho: w, alto: h, problemas, detalle: r });
    await p.close();
  }
}
await browser.close();
fs.writeFileSync(path.join(OUT, 'responsive.json'), JSON.stringify(resumen, null, 2));
console.log(`\n${resumen.length - fallas}/${resumen.length} comprobaciones OK. Resumen en ${path.join(OUT, 'responsive.json')}`);
process.exit(fallas ? 1 : 0);
