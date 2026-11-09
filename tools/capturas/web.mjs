// Capturas del README (DOCS/capturas/*.webp), sacadas del sitio publicado.
// Uso: desde tools/verificacion (usa su puppeteer-core):  node ../capturas/web.mjs
// - Escritorio 1280 × 800 y celular 390 × 844, con el movimiento activo: se espera a que termine la animación de carga
//   y a que entren las secciones antes de sacar cada captura.
// - La página de reunión confirmada se ve con una reserva de ejemplo (datos inventados en sessionStorage).
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

// puppeteer-core está instalado en tools/verificacion
const puppeteer = createRequire(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../verificacion/package.json'))('puppeteer-core');

const BASE = 'https://www.intellihelp.tech';
const SALIDA = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../DOCS/capturas');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const NOTA = '/novedades/caso-gobierno-de-la-ciudad/';
const RESERVA = { nombre: 'Martina Gómez', mail: 'martina.gomez@empresa.com.ar', cuando: 'martes 17 de noviembre a las 10:30', duracion: 30 };

const PAGINAS = [
  ['home', '/'], ['diagnostico', '/diagnostico-sin-cargo/'], ['gracias-reserva', '/gracias-reserva/'],
  ['postulate', '/postulate/'], ['privacidad', '/privacidad/'], ['blog', '/novedades/'], ['blog-nota', NOTA], ['404', '/no-existe/'],
];
const SECCIONES = [
  ['home-que-ofrecemos', '/', '#que-ofrecemos', true], ['home-presencia', '/', '#presencia'], ['home-clientes', '/', '#clientes'],
  ['home-historia', '/', '#historia', true], ['home-casos', '/', '#casos'], ['home-preguntas', '/', '#preguntas'],
  ['diagnostico-reserva', '/diagnostico-sin-cargo/', '#agendar'], ['postulate-busquedas', '/postulate/', '#busquedas'],
];
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

const navegador = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
async function abrir(ruta, ancho, alto, movil, quieto = false) {
  const p = await navegador.newPage();
  await p.emulate({
    viewport: { width: ancho, height: alto, deviceScaleFactor: 1, isMobile: movil, hasTouch: movil },
    userAgent: movil ? 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/130 Mobile Safari/537.36' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36',
  });
  await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: quieto ? 'reduce' : 'no-preference' }]);
  await p.evaluateOnNewDocument((r) => { try { sessionStorage.setItem('ith_reserva', JSON.stringify(r)); } catch (e) {} }, RESERVA);
  await p.goto(BASE + ruta, { waitUntil: 'networkidle2', timeout: 60000 });
  await espera(2600); // animación de carga y entrada del hero
  return p;
}

for (const [nombre, ruta] of PAGINAS) {
  for (const [sufijo, ancho, alto, movil] of [['escritorio', 1280, 800, false], ['celular', 390, 844, true]]) {
    const p = await abrir(ruta, ancho, alto, movil);
    await p.screenshot({ path: path.join(SALIDA, `${nombre}-${sufijo}.webp`), type: 'webp', quality: 82 });
    console.log(`${nombre}-${sufijo}.webp`);
    await p.close();
  }
}

for (const [nombre, ruta, selector, quieto] of SECCIONES) {
  // Las secciones con carruseles van sin movimiento (el sitio las muestra quietas y completas): así no salen a mitad
  // de un cambio de tarjeta
  const p = await abrir(ruta, 1280, 800, false, quieto);
  // Recorre la página hasta la sección para que entren sus animaciones, y la deja arriba de todo
  await p.evaluate(async (sel) => {
    const el = document.querySelector(sel);
    const fin = el.offsetTop + el.offsetHeight;
    for (let y = 0; y < fin; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
    el.scrollIntoView({ block: 'start' });
  }, selector);
  await espera(2800);
  // La barra superior fija y el botón de WhatsApp no tienen que tapar la sección
  await p.evaluate(() => document.querySelectorAll('.site-header, .wa-float, .wa-globo').forEach((el) => { el.style.visibility = 'hidden'; }));
  const el = await p.$(selector);
  await el.screenshot({ path: path.join(SALIDA, `${nombre}.webp`), type: 'webp', quality: 82 });
  console.log(`${nombre}.webp`);
  await p.close();
}
await navegador.close();
