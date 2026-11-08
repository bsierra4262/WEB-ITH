// Verificación de todas las páginas del sitio a 1440 y 390 px, con y sin "reducir movimiento".
// Revisa: errores de JavaScript propios, scroll horizontal, subrayados, controles nativos a la vista (select, casillas,
// tiradores de campos de texto, controles de video, tooltips de title y <title> en SVG, marcadores de summary), cajas
// con scroll interno sin diseño, la animación de carga común (telón y logo entero, centrado) y el header común.
// Guarda una captura de página completa por página y ancho, y un resumen en verificacion.json.
//
// Uso: node verificar.mjs [carpeta-de-salida]        (por defecto ./resultados)
// Variables: SITIO_URL (por defecto http://127.0.0.1:5174), CHROME_PATH (ruta del ejecutable de Chrome o Edge).
// Las búsquedas de HiringRoom se simulan con datos de ejemplo y GTM se bloquea: la prueba no sale a internet.
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const OUT = path.resolve(process.argv[2] || 'resultados');
const BASE = (process.env.SITIO_URL || 'http://127.0.0.1:5174').replace(/\/$/, '');
const CHROME = process.env.CHROME_PATH || {
  win32: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  linux: '/usr/bin/google-chrome',
}[process.platform];
fs.mkdirSync(OUT, { recursive: true });

const PAGINAS = [['home', '/'], ['diagnostico-sin-cargo', '/diagnostico-sin-cargo/'], ['gracias-reserva', '/gracias-reserva/'], ['postulate', '/postulate/'], ['privacidad', '/privacidad/'], ['404', '/404.html']];
const ANCHOS = [[1440, 900, false], [390, 844, true]];
const MODOS = ['no-preference', 'reduce'];
const FIXTURE = { vacancies: [
  { name: 'Técnico de soporte en sitio', locality: 'CABA, Buenos Aires', descript: '<p>Soporte a usuarios en las oficinas de un cliente, de lunes a viernes.</p>', requirements: '', benefits: '', details: '', link: 'https://intellihelp.hiringroom.com/jobs/get_vacancy/1', form_link: 'https://intellihelp.hiringroom.com/jobs/get_vacancy/1/apply' },
  { name: 'Analista de mesa de ayuda', locality: 'CABA', descript: '<p>Atención a usuarios internos y registro de incidentes.</p>', requirements: '', benefits: '', details: '', link: 'https://intellihelp.hiringroom.com/jobs/get_vacancy/2', form_link: 'https://intellihelp.hiringroom.com/jobs/get_vacancy/2/apply' },
] };

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
const resumen = [];
let fallas = 0;
for (const modo of MODOS) {
  for (const [w, h, mob] of ANCHOS) {
    for (const [nombre, ruta] of PAGINAS) {
      const p = await browser.newPage();
      await p.setViewport({ width: w, height: h, isMobile: mob, hasTouch: mob, deviceScaleFactor: 1 });
      await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: modo }]);
      const errs = [];
      p.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
      p.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
      await p.setRequestInterception(true);
      p.on('request', (r) => {
        const u = r.url();
        if (/googletagmanager/.test(u)) return r.respond({ status: 200, contentType: 'text/javascript', body: '' });
        if (/get_vacancy_list/.test(u)) return r.respond({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(FIXTURE) });
        return r.continue();
      });
      const resp = await p.goto(BASE + ruta, { waitUntil: 'domcontentloaded' });
      await sleep(120);
      // Carga común: telón y logo en el primer momento
      const carga = await p.evaluate(() => {
        const a = getComputedStyle(document.body, '::after');
        const f = getComputedStyle(document.body, '::before');
        const cw = parseFloat(a.getPropertyValue('--carga-w'));
        const bs = a.backgroundSize.split(',').pop().trim().split(' ').map(parseFloat);
        return {
          telon: document.documentElement.classList.contains('m-intro') && f.content !== 'none',
          logo: a.content !== 'none' && /data:image\/png/.test(a.backgroundImage),
          logoEntero: Math.abs(bs[0] - cw) < 0.5 && parseFloat(a.width) >= cw - 0.5,
          centrado: a.position === 'fixed' && a.marginLeft === a.marginRight && a.top === '0px' && a.bottom === '0px',
        };
      });
      await p.waitForFunction(() => !document.documentElement.classList.contains('m-intro'), { timeout: 5000 }).catch(() => {});
      await sleep(500);
      await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 350) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 90)); } });
      await sleep(1000);
      await p.evaluate(() => window.scrollTo(0, 0));
      await sleep(700);
      const r = await p.evaluate(() => {
        const vis = (el) => { const b = el.getBoundingClientRect(); const s = getComputedStyle(el); return b.width > 1 && b.height > 1 && s.visibility !== 'hidden' && s.display !== 'none' && !el.closest('[hidden]') && !el.closest('.sr-only'); };
        const desc = (el) => (el.id ? '#' + el.id : '') + '.' + String(el.className).trim().split(/\s+/).slice(0, 2).join('.') + '<' + el.tagName.toLowerCase() + '>';
        const subrayados = [...document.querySelectorAll('body *')].filter((x) => vis(x) && /underline|line-through|overline/.test(getComputedStyle(x).textDecorationLine)).map(desc);
        const nativos = [];
        document.querySelectorAll('select').forEach((x) => vis(x) && nativos.push('select ' + desc(x)));
        document.querySelectorAll('input[type=checkbox], input[type=radio], input[type=date], input[type=time], input[type=file], input[type=range], input[type=color]').forEach((x) => { if (vis(x) && getComputedStyle(x).appearance !== 'none' && getComputedStyle(x).opacity !== '0') nativos.push('input ' + x.type + ' ' + desc(x)); });
        document.querySelectorAll('textarea').forEach((x) => { if (vis(x) && getComputedStyle(x).resize !== 'none') nativos.push('textarea con tirador ' + desc(x)); });
        document.querySelectorAll('video[controls], audio[controls]').forEach((x) => vis(x) && nativos.push('controles ' + desc(x)));
        document.querySelectorAll('body [title]').forEach((x) => { if (x.tagName !== 'IFRAME') nativos.push('title ' + desc(x)); });
        document.querySelectorAll('svg title').forEach((x) => nativos.push('svg title: ' + x.textContent));
        document.querySelectorAll('summary').forEach((x) => { const s = getComputedStyle(x); if (vis(x) && s.display === 'list-item' && s.listStyleType !== 'none') nativos.push('marcador de summary ' + desc(x)); });
        const scrollInterno = [...document.querySelectorAll('body *')].filter((el) => { const s = getComputedStyle(el); if (!vis(el)) return false; const y = /(auto|scroll)/.test(s.overflowY) && el.scrollHeight > el.clientHeight + 2; const x = /(auto|scroll)/.test(s.overflowX) && el.scrollWidth > el.clientWidth + 2; return (x || y) && s.scrollbarWidth !== 'none'; }).map(desc);
        const header = document.querySelector('.site-header');
        return {
          hscroll: document.documentElement.scrollWidth > document.documentElement.clientWidth,
          subrayados, nativos, scrollInterno,
          header: !!header && !!header.querySelector('.brand__tag') && !!header.querySelector('#cta-header'),
        };
      });
      const sufijo = modo === 'reduce' ? '-reducir-movimiento' : '';
      await p.screenshot({ path: path.join(OUT, `${nombre}-${w}${sufijo}.png`), fullPage: true });
      const propios = errs.filter((e) => !/hiringroom|googletagmanager|clarity|ERR_BLOCKED_BY_CLIENT|favicon|api\/agenda|api\/contact|Failed to load resource/i.test(e));
      const ok = resp.ok() || resp.status() === 304;
      const bien = ok && !propios.length && !r.hscroll && !r.subrayados.length && !r.nativos.length && !r.scrollInterno.length && r.header && Object.values(carga).every(Boolean);
      if (!bien) fallas++;
      const fila = { pagina: nombre, ancho: w, movimiento: modo, estado: resp.status(), errores: propios, scrollHorizontal: r.hscroll, subrayados: r.subrayados, nativos: r.nativos, scrollInterno: r.scrollInterno, header: r.header, carga, resultado: bien ? 'OK' : 'FALLA' };
      resumen.push(fila);
      console.log(`${bien ? 'OK   ' : 'FALLA'} ${nombre.padEnd(22)} ${String(w).padStart(4)} ${modo}` + (bien ? '' : ' ' + JSON.stringify(fila)));
      await p.close();
    }
  }
}
await browser.close();
fs.writeFileSync(path.join(OUT, 'verificacion.json'), JSON.stringify(resumen, null, 2));
console.log(`\n${resumen.length - fallas}/${resumen.length} comprobaciones OK. Capturas y resumen en ${OUT}`);
process.exit(fallas ? 1 : 0);
