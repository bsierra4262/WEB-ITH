// Captura de pantalla para revisar el diseño contra el PDF.
// Uso: node scripts/shot.mjs <selector|full> <salida.png> [ancho=1440] [url=http://localhost:5173/]
// Fuerza el estado final de las animaciones para que todo quede visible.
// Nota: Chrome no captura páginas enteras de más de ~16384 px de alto: en
// celular, capturar por selector.
import puppeteer from 'puppeteer-core';
import { existsSync } from 'node:fs';

const [selector = 'full', out = 'shot.png', width = '1440', url = 'http://localhost:5173/'] = process.argv.slice(2);
const candidates = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
];
const executablePath = process.env.CHROME_PATH || candidates.find((p) => existsSync(p));

const browser = await puppeteer.launch({ executablePath, headless: true, args: ['--hide-scrollbars'] });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: Number(width), height: 900, deviceScaleFactor: 1 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  await page.evaluate(() => document.fonts.ready);
  // Las animaciones de aparición (.rv) dejan contenido transparente
  // en una captura estática; se fuerza el estado final de todo.
  await page.addStyleTag({ content: `
    .rv, .rv.pre, .rv.show, .in { opacity: 1 !important; transform: none !important; animation: none !important; }
    .ico, .num, .ic, .ring-c, .svc-ico { opacity: 1 !important; transform: none !important; animation: none !important; }
    .ico :is(path, circle, rect), .ring-p { stroke-dashoffset: 0 !important; animation: none !important; }
  ` });
  await new Promise((r) => setTimeout(r, 300));
  // Las imágenes con carga diferida no cargan en una captura sin scroll.
  await page.evaluate(async () => {
    const imgs = [...document.images];
    imgs.forEach((i) => (i.loading = 'eager'));
    await Promise.all(imgs.map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; }))));
  });
  // Contadores en su valor final (se reinician a 0 cuando salen de pantalla)
  await page.evaluate(() => document.querySelectorAll('[data-count]').forEach((e) => { const c = e.cloneNode(false); c.textContent = e.dataset.count; c.removeAttribute('data-count'); e.replaceWith(c); }));
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (selector === 'full') {
    await page.screenshot({ path: out, fullPage: true });
  } else {
    const el = await page.$(selector);
    if (!el) throw new Error(`No existe el selector ${selector}`);
    await el.screenshot({ path: out });
  }
  console.log(JSON.stringify({ out, width: Number(width), horizontalOverflowPx: overflow, errors }));
} finally {
  await browser.close();
}
