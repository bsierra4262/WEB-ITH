// Capturas del README (DOCS/capturas/*.webp), sacadas del sitio publicado.
// Uso: desde tools/verificacion (usa su puppeteer-core):  node ../capturas/web.mjs [prefijo]
//   Con un prefijo (por ejemplo "postulate") rehace solo las capturas cuyo nombre empieza así.
// - Escritorio 1280 × 800 y celular 390 × 844, con el movimiento activo: se espera a que termine la animación de carga
//   y a que entren las secciones antes de sacar cada captura.
// - Tres tipos de captura: la primera pantalla de cada página, la página completa (recorrida de arriba abajo) y cada
//   sección por separado, en escritorio y en celular.
// - Tag Manager, Analytics y Clarity se bloquean: las capturas no suman visitas a las estadísticas.
// - La página de reunión confirmada se ve con una reserva de ejemplo (datos inventados en sessionStorage).
// - Las páginas completas se reducen con Python (Pillow) para que el archivo quede liviano.
// - El servidor frena los pedidos muy seguidos (HTTP 429): se espera entre páginas y, si igual pasa, se reintenta.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

// puppeteer-core está instalado en tools/verificacion
const puppeteer = createRequire(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../verificacion/package.json'))('puppeteer-core');

const BASE = 'https://www.intellihelp.tech';
const SALIDA = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../DOCS/capturas');
const TEMPORAL = fs.mkdtempSync(path.join(os.tmpdir(), 'ith-capturas-'));
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const NOTA = '/novedades/caso-gobierno-de-la-ciudad/';
const RESERVA = { nombre: 'Martina Gómez', mail: 'martina.gomez@empresa.com.ar', cuando: 'martes 17 de noviembre a las 10:30', duracion: 30 };
const MEDICION = /googletagmanager\.com|google-analytics\.com|analytics\.google\.com|clarity\.ms|doubleclick\.net/;

const PAGINAS = [
  ['home', '/'], ['diagnostico', '/diagnostico-sin-cargo/'], ['gracias-reserva', '/gracias-reserva/'],
  ['postulate', '/postulate/'], ['privacidad', '/privacidad/'], ['blog', '/novedades/'], ['blog-nota', NOTA], ['404', '/no-existe/'],
];
// [nombre, página, selector, sin movimiento]. Las secciones con carruseles van quietas (el sitio las muestra completas
// con "reducir movimiento"): así no salen a mitad de un cambio de tarjeta.
const SECCIONES = [
  ['home-02-que-ofrecemos', '/', '#que-ofrecemos', true], ['home-03-presencia', '/', '#presencia'],
  ['home-04-equipo', '/', '#equipo'], ['home-05-socios', '/', '#socios'], ['home-06-clientes', '/', '#clientes'],
  ['home-07-historia', '/', '#historia', true], ['home-08-casos', '/', '#casos'], ['home-09-cita', '/', '#como-trabajamos'],
  ['home-10-preguntas', '/', '#preguntas'], ['home-11-agenda', '/', '#agenda'], ['home-12-pie', '/', '.site-footer'],
  ['diagnostico-reserva', '/diagnostico-sin-cargo/', '#agendar'], ['diagnostico-clientes', '/diagnostico-sin-cargo/', '.dx-clientes'],
  ['diagnostico-casos', '/diagnostico-sin-cargo/', '.dx-casos'],
  ['postulate-por-que', '/postulate/', '#por-que'], ['postulate-perfiles', '/postulate/', '#perfiles'],
  ['postulate-busquedas', '/postulate/', '#busquedas'],
];
const TAMANOS = [['escritorio', 1280, 800, false], ['celular', 390, 844, true]];
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const FILTRO = process.argv[2] || '';
const toca = (nombre) => nombre.startsWith(FILTRO);

const navegador = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--autoplay-policy=no-user-gesture-required'] });
async function abrir(ruta, ancho, alto, movil, quieto = false) {
  const p = await navegador.newPage();
  await p.setRequestInterception(true);
  p.on('request', (r) => (MEDICION.test(r.url()) ? r.abort() : r.continue()));
  await p.emulate({
    viewport: { width: ancho, height: alto, deviceScaleFactor: 1, isMobile: movil, hasTouch: movil },
    userAgent: movil ? 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/130 Mobile Safari/537.36' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36',
  });
  await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: quieto ? 'reduce' : 'no-preference' }]);
  await p.evaluateOnNewDocument((r) => { try { sessionStorage.setItem('ith_reserva', JSON.stringify(r)); } catch (e) {} }, RESERVA);
  for (let intento = 1; ; intento++) {
    await espera(1500);
    const r = await p.goto(BASE + ruta, { waitUntil: 'networkidle2', timeout: 60000 });
    if (r.status() !== 429) break;
    if (intento === 4) throw new Error(`${ruta}: el servidor sigue respondiendo 429`);
    console.log(`${ruta}: 429, espero ${intento * 30} s`);
    await espera(intento * 30000);
  }
  await espera(2600); // animación de carga y entrada del hero
  return p;
}
// Recorre la página hasta `hasta` (o hasta el final) para que se armen carruseles y entren las animaciones; con
// html.cv-todo todas las secciones quedan calculadas, como cuando se salta a un ancla.
async function recorrer(p, hasta) {
  await p.evaluate(async (sel) => {
    document.documentElement.classList.add('cv-todo');
    const el = sel && document.querySelector(sel);
    const fin = el ? el.getBoundingClientRect().top + scrollY + el.offsetHeight : document.body.scrollHeight;
    for (let y = 0; y < fin; y += 350) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 110)); }
  }, hasta || null);
}
const ocultarFlotantes = (p) => p.evaluate(() => document.querySelectorAll('.site-header, .wa-float, .wa-globo').forEach((el) => { el.style.visibility = 'hidden'; }));

// Imagen principal del README: el inicio en escritorio grande, con el video andando
if (toca('home-principal')) {
  const p = await abrir('/', 1440, 860, false);
  await espera(1500);
  await p.screenshot({ path: path.join(SALIDA, 'home-principal.webp'), type: 'webp', quality: 84 });
  console.log('home-principal.webp');
  await p.close();
}

for (const [nombre, ruta] of PAGINAS.filter(([n]) => toca(n))) {
  for (const [sufijo, ancho, alto, movil] of TAMANOS) {
    const p = await abrir(ruta, ancho, alto, movil);
    await p.screenshot({ path: path.join(SALIDA, `${nombre}-${sufijo}.webp`), type: 'webp', quality: 82 });
    console.log(`${nombre}-${sufijo}.webp`);
    // Página completa: se recorre entera, se vuelve arriba (el header queda en su lugar) y se captura todo el alto
    await recorrer(p);
    await p.evaluate(() => window.scrollTo(0, 0));
    await espera(2200);
    await p.evaluate(() => document.querySelectorAll('.wa-float, .wa-globo').forEach((el) => { el.style.visibility = 'hidden'; }));
    const png = path.join(TEMPORAL, `${nombre}-${sufijo}.png`);
    await p.screenshot({ path: png, fullPage: true, captureBeyondViewport: true });
    // Escritorio a la mitad del ancho; el alto queda por debajo del límite de WebP (16.383 px)
    execFileSync('python', ['-c', `
import sys
from PIL import Image
im = Image.open(sys.argv[1]).convert('RGB')
ancho = int(sys.argv[3])
esc = min(1, ancho / im.width, 16000 / im.height)
if esc < 1: im = im.resize((round(im.width * esc), round(im.height * esc)), Image.LANCZOS)
im.save(sys.argv[2], 'WEBP', quality=78, method=6)
`, png, path.join(SALIDA, `${nombre}-completa-${sufijo}.webp`), movil ? '390' : '720']);
    console.log(`${nombre}-completa-${sufijo}.webp`);
    await p.close();
  }
}

for (const [nombre, ruta, selector, quieto] of SECCIONES.filter(([n]) => toca(n))) {
  for (const [sufijo, ancho, alto, movil] of TAMANOS) {
    const p = await abrir(ruta, ancho, alto, movil, quieto);
    await recorrer(p, selector);
    await p.evaluate((sel) => document.querySelector(sel).scrollIntoView({ block: 'start' }), selector);
    await espera(2800);
    // La barra superior fija y el botón de WhatsApp no tienen que tapar la sección
    await ocultarFlotantes(p);
    const el = await p.$(selector);
    await el.screenshot({ path: path.join(SALIDA, `${nombre}-${sufijo}.webp`), type: 'webp', quality: 82 });
    console.log(`${nombre}-${sufijo}.webp`);
    await p.close();
  }
}
await navegador.close();
fs.rmSync(TEMPORAL, { recursive: true, force: true });
