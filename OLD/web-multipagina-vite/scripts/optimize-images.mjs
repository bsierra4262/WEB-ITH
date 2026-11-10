// Genera los recursos gráficos del sitio: logo de marca, íconos, imagen para redes y logos de clientes y fabricantes.
// Uso: npm run images        (o: node scripts/optimize-images.mjs [--only=logos|marcas|brand|icons|og])
//
// Qué produce:
//   src/assets/img/brand/ith-logo.webp     logo de marca, 88 px de alto (2x de 44 px)
//   src/assets/img/logos/<slug>.webp       logos de clientes, 96 px de alto (2x de 48 px), color original
//   src/assets/img/marcas/<slug>.webp      logos de fabricantes, mismo tratamiento que los de clientes
//   public/favicon.svg, favicon-32.png     ícono de pestaña
//   public/apple-touch-icon.png            180x180
//   public/og-image.png                    1200x630 para compartir en redes
//
// Fuentes:
//   - El logo de marca sale de src/assets/img/brand/ith-logo.svg (vector extraído del PDF
//     DOCS/wordpress-anterior/wp-content/uploads/2021/10/ith-caso-de-exito-gcba.pdf; idéntico al PNG ITH-logo.png).
//   - Los 40 logos de clientes y fabricantes salen de recursos/logos-fuentes/clientes/ y
//     .../marcas/: archivo oficial A COLOR, descargado del sitio de la marca u organismo o de
//     Wikimedia (SVG siempre que exista; si no, el PNG más grande). El README de esa carpeta dice de
//     dónde salió cada uno y cuándo. Si falta un archivo, se avisa y se conserva el .webp ya generado.
//   - El sitio los pasa a gris por CSS y los pinta con sus colores al pasar el cursor o con foco.
// Ver recursos/logos-fuentes/README.md.

import sharp from 'sharp';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BRAND_DIR = join(ROOT, 'src/assets/img/brand');
const LOGOS_DIR = join(ROOT, 'src/assets/img/logos');
const MARCAS_DIR = join(ROOT, 'src/assets/img/marcas');
const FUENTES = join(ROOT, 'recursos/logos-fuentes');
const FUENTES_CLIENTES = join(FUENTES, 'clientes');
const FUENTES_MARCAS = join(FUENTES, 'marcas');
const PUBLIC_DIR = join(ROOT, 'public');
const BRAND_SVG = join(BRAND_DIR, 'ith-logo.svg');

// Paleta (tokens.css). Solo se usan estos colores.
const C = { white: '#FFFFFF', carbon: '#2A2A2A', violet: '#663399', cream: '#F0EBF5', lime: '#98CC32' };

const LOGO_HEIGHT = 96; // 2x de 48 px
const LOGO_WEBP = { quality: 90, alphaQuality: 100, effort: 6, smartSubsample: true };
const BRAND_HEIGHT = 88; // 2x de 44 px

/**
 * Logos de clientes. Siempre la versión oficial vigente A COLOR (el sitio los pasa a gris por CSS
 * y los muestra a color en hover/foco). Origen y fecha de cada archivo: README de logos-fuentes.
 * `fuente`  = archivo en recursos/logos-fuentes/clientes/ (o /marcas/ en MARCAS).
 * `partes`  = varios archivos que se ponen uno al lado del otro (Cablevisión + Fibertel).
 * `alpha: 'white'` = JPG con fondo blanco: el blanco se convierte en alfa, sin halos.
 * `quitar`  = elementos del SVG que no van (un eslogan o una bajada que no se leen a 32 px).
 * `soloHasta` = en un PNG, fracción del ancho que se conserva desde la izquierda (lo mismo que
 *             `quitar`, para una bajada que está a la derecha de la sigla).
 */
const LOGOS = [
  { slug: 'senado-argentina', name: 'Senado de la Nación Argentina', fuente: 'senado-argentina.jpg', alpha: 'white' },
  { slug: 'agencia-sistemas', name: 'Agencia de Sistemas de Información (GCBA)', fuente: 'agencia-sistemas.jpg', alpha: 'white' },
  { slug: 'nacion-seguros', name: 'Nación Seguros', fuente: 'nacion-seguros.png' },
  { slug: 'pfizer', name: 'Pfizer', fuente: 'pfizer.svg' },
  { slug: 'bago', name: 'Laboratorios Bagó', fuente: 'bago.svg' },
  { slug: 'medife', name: 'Medifé', fuente: 'medife.svg' },
  // Sin la bajada "by Spireon" (es de LoJack Estados Unidos).
  { slug: 'lojack', name: 'LoJack', fuente: 'lojack.svg', quitar: /<g id="tag">[\s\S]*?<\/g>/ },
  { slug: 'petropack', name: 'Petropack', fuente: 'petropack.png' },
  // Solo la sigla: la bajada "Administración Gubernamental de Ingresos Públicos" (a la derecha de
  // la barra) mide 5 px a la altura de la cinta. El nombre completo va en el alt.
  { slug: 'agip', name: 'AGIP', fuente: 'agip.png', soloHasta: 0.33 },
  { slug: 'cablevision-fibertel', name: 'Cablevisión Fibertel', partes: ['cablevision.svg', 'fibertel.svg'] },
  { slug: 'el-cronista', name: 'El Cronista', fuente: 'el-cronista.svg' },
  { slug: 'correo-argentino', name: 'Correo Argentino', fuente: 'correo-argentino.svg' },
  { slug: 'reckitt-benckiser', name: 'Reckitt', fuente: 'reckitt.svg' },
  { slug: 'srt', name: 'Superintendencia de Riesgos del Trabajo', fuente: 'srt.png' },
  { slug: 'came', name: 'CAME', fuente: 'came.svg' },
  { slug: 'gendarmeria-nacional', name: 'Gendarmería Nacional', fuente: 'gendarmeria-nacional.png' },
  { slug: 'parques-nacionales', name: 'Administración de Parques Nacionales', fuente: 'parques-nacionales.jpg', alpha: 'white' },
  { slug: 'strix', name: 'Strix, grupo LoJack', fuente: 'strix.svg' },
  // SVG oficial (blanco, apilado) pasado a la versión a color y horizontal que usa Arcor: ver cartocorColor.
  { slug: 'cartocor', name: 'Cartocor (Grupo Arcor)', fuente: 'cartocor.svg', armar: (svg) => cartocorColor(svg) },
];

/**
 * Logos de fabricantes (brief §5.1). Mismo tratamiento y mismas claves que los de clientes.
 * `horizontal` = arma la versión horizontal a partir del SVG oficial apilado (ver grandstreamHorizontal).
 */
const MARCAS = [
  { slug: 'huawei', name: 'Huawei', fuente: 'huawei.svg' },
  { slug: 'hikvision', name: 'Hikvision', fuente: 'hikvision.svg' },
  { slug: 'dahua', name: 'Dahua Technology', fuente: 'dahua.svg' },
  // Sin el eslogan "Security & Biometrics" (gris, ilegible a 32 px).
  { slug: 'suprema', name: 'Suprema', fuente: 'suprema.svg', quitar: /<path class="cls-1"[^>]*\/>/g },
  { slug: 'furukawa', name: 'Furukawa Electric', fuente: 'furukawa.svg' },
  { slug: 'microsoft', name: 'Microsoft', fuente: 'microsoft.svg' },
  { slug: 'fortinet', name: 'Fortinet', fuente: 'fortinet.svg' },
  { slug: 'ubiquiti', name: 'Ubiquiti', fuente: 'ubiquiti.svg' },
  { slug: 'aruba', name: 'HPE Aruba Networking', fuente: 'aruba.svg' },
  { slug: 'hp', name: 'HP', fuente: 'hp.svg' },
  { slug: 'dell', name: 'Dell', fuente: 'dell.svg' },
  { slug: 'lenovo', name: 'Lenovo', fuente: 'lenovo.svg' },
  { slug: 'apc', name: 'APC by Schneider Electric', fuente: 'apc.svg' },
  { slug: 'cisco', name: 'Cisco', fuente: 'cisco.svg' },
  { slug: 'panduit', name: 'Panduit', fuente: 'panduit.svg' },
  { slug: 'mikrotik', name: 'MikroTik', fuente: 'mikrotik.svg' },
  { slug: 'eaton', name: 'Eaton', fuente: 'eaton.svg' },
  { slug: 'suse', name: 'SUSE', fuente: 'suse.svg' },
  { slug: 'red-hat', name: 'Red Hat', fuente: 'red-hat.svg' },
  { slug: 'commscope', name: 'CommScope', fuente: 'commscope.svg' },
  // Versión horizontal (isotipo a la izquierda), la del encabezado de grandstream.com.
  { slug: 'grandstream', name: 'Grandstream', fuente: 'grandstream.svg', horizontal: true },
];

const rel = (p) => relative(ROOT, p).replaceAll('\\', '/');
const report = [];
const ensureDir = (d) => mkdirSync(d, { recursive: true });

async function logInfo(file) {
  const m = await sharp(file).metadata();
  const kb = (readFileSync(file).length / 1024).toFixed(1);
  report.push({ file: rel(file), size: `${m.width}x${m.height}`, kb });
}

/* ------------------------------------------------------------------ brand */

/** Devuelve las piezas del logo vectorial: silueta violeta y letras (blancas + punto lima). */
function readBrandSvg() {
  const svg = readFileSync(BRAND_SVG, 'utf8');
  const paths = [...svg.matchAll(/<path fill="([^"]+)" d="([^"]+)"\/>/g)].map(([, fill, d]) => ({ fill, d }));
  const [shape, ...letters] = paths;
  return { svg, shape, letters };
}

// Caja de las letras "iTH" dentro del viewBox del logo (111.71 x 60.2).
const LETTERS_BOX = { x: 42.71, y: 17.19, w: 60.54, h: 34.41 };

/** Letras escaladas para que ocupen `w` de ancho, con su esquina superior izquierda en (x, y). */
function lettersGroup(letters, x, y, w) {
  const s = w / LETTERS_BOX.w;
  const tx = (x - LETTERS_BOX.x * s).toFixed(2);
  const ty = (y - LETTERS_BOX.y * s).toFixed(2);
  const inner = letters.map((p) => `<path fill="${p.fill}" d="${p.d}"/>`).join('');
  return `<g transform="matrix(${s.toFixed(4)} 0 0 ${s.toFixed(4)} ${tx} ${ty})">${inner}</g>`;
}

async function buildBrand() {
  ensureDir(BRAND_DIR);
  const { svg } = readBrandSvg();
  const out = join(BRAND_DIR, 'ith-logo.webp');
  await sharp(Buffer.from(svg), { density: 1200 })
    .resize({ height: BRAND_HEIGHT, kernel: 'lanczos3' })
    .webp({ quality: 92, alphaQuality: 100, effort: 6, smartSubsample: true })
    .toFile(out);
  await logInfo(out);
}

/* ------------------------------------------------------------------ icons */

function faviconSvg() {
  const { letters } = readBrandSvg();
  // Cuadrado con la misma silueta del logo: esquina inferior izquierda curva.
  const shape = `<path fill="${C.violet}" d="M0 0h64v64H33C32.4 64 0 64 0 12Z"/>`;
  const w = 50;
  const h = (LETTERS_BOX.h * w) / LETTERS_BOX.w;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${shape}${lettersGroup(letters, 11, (64 - h) / 2 + 1, w)}</svg>\n`;
}

function appleTouchSvg() {
  const { letters } = readBrandSvg();
  // iOS redondea las esquinas solo: fondo violeta lleno, sin transparencia.
  const size = 180;
  const w = 112;
  const h = (LETTERS_BOX.h * w) / LETTERS_BOX.w;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" fill="${C.violet}"/>${lettersGroup(letters, (size - w) / 2, (size - h) / 2, w)}</svg>`;
}

async function buildIcons() {
  ensureDir(PUBLIC_DIR);
  const fav = faviconSvg();
  const favFile = join(PUBLIC_DIR, 'favicon.svg');
  writeFileSync(favFile, fav);
  await logInfo(favFile);

  const png32 = join(PUBLIC_DIR, 'favicon-32.png');
  await sharp(Buffer.from(fav), { density: 600 }).resize(32, 32).png({ compressionLevel: 9, palette: true }).toFile(png32);
  await logInfo(png32);

  const apple = join(PUBLIC_DIR, 'apple-touch-icon.png');
  await sharp(Buffer.from(appleTouchSvg()), { density: 300 }).resize(180, 180).flatten({ background: C.violet }).png({ compressionLevel: 9 }).toFile(apple);
  await logInfo(apple);
}

/* ------------------------------------------------------------------ og image */

const OG_TEXT = 'Un equipo con nombre y apellido que mantiene tu tecnología andando.';

function ogHtml(fontDataUrl) {
  const { svg } = readBrandSvg();
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>
@font-face{font-family:Saira;src:url(${fontDataUrl}) format('woff2');font-weight:100 900}
*{margin:0;box-sizing:border-box}
html,body{width:1200px;height:630px;background:${C.carbon};overflow:hidden}
body{font-family:Saira,'Segoe UI',Arial,sans-serif;color:${C.white};padding:72px 88px;display:flex;flex-direction:column;justify-content:space-between}
.top{display:flex;align-items:center;gap:20px}
.top svg{height:76px;width:auto;display:block}
.tag{font-size:22px;line-height:1.2;letter-spacing:.04em;color:${C.cream}}
h1{font-size:68px;line-height:1.08;font-weight:700;letter-spacing:-.01em;max-width:960px}
.foot{display:flex;align-items:center;gap:18px;font-size:22px;letter-spacing:.14em;text-transform:uppercase;color:${C.cream};font-weight:600}
.bar{width:56px;height:4px;background:${C.violet};border-radius:2px}
</style></head><body>
<div class="top">${svg}<span class="tag">Servicios IT<br>desde 2012</span></div>
<h1>${OG_TEXT}</h1>
<div class="foot"><span class="bar"></span>intellihelp.tech</div>
</body></html>`;
}

async function ogWithChrome(out) {
  const candidates = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/usr/bin/google-chrome',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ].filter(Boolean);
  const executablePath = candidates.find((p) => existsSync(p));
  if (!executablePath) return false;
  const { default: puppeteer } = await import('puppeteer-core');
  const font = join(ROOT, 'node_modules/@fontsource-variable/saira/files/saira-latin-wght-normal.woff2');
  const fontUrl = `data:font/woff2;base64,${readFileSync(font).toString('base64')}`;
  const browser = await puppeteer.launch({ executablePath, headless: true });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
    await page.setContent(ogHtml(fontUrl), { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const buf = await page.screenshot({ type: 'png' });
    await sharp(buf).png({ compressionLevel: 9, palette: true, quality: 95 }).toFile(out);
  } finally {
    await browser.close();
  }
  return true;
}

async function ogWithSharp(out) {
  // Alternativa sin navegador: tipografía del sistema.
  const { svg } = readBrandSvg();
  const logo = await sharp(Buffer.from(svg), { density: 1200 }).resize({ height: 76 }).png().toBuffer();
  const lines = ['Un equipo con nombre y apellido', 'que mantiene tu tecnología', 'andando.'];
  const text = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <style>.h{font:700 66px 'Saira','Segoe UI',Arial,sans-serif;fill:${C.white}}.s{font:600 22px 'Saira','Segoe UI',Arial,sans-serif;fill:${C.cream};letter-spacing:3px}</style>
  ${lines.map((l, i) => `<text class="h" x="88" y="${300 + i * 72}">${l}</text>`).join('')}
  <rect x="88" y="545" width="56" height="4" rx="2" fill="${C.violet}"/>
  <text class="s" x="162" y="555">INTELLIHELP.TECH</text></svg>`;
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: C.carbon } })
    .composite([{ input: logo, left: 88, top: 72 }, { input: Buffer.from(text), left: 0, top: 0 }])
    .png({ compressionLevel: 9 })
    .toFile(out);
}

async function buildOg() {
  ensureDir(PUBLIC_DIR);
  const out = join(PUBLIC_DIR, 'og-image.png');
  let ok = false;
  try {
    ok = await ogWithChrome(out);
  } catch (e) {
    console.warn(`  ! og-image con navegador falló (${e.message}); uso la versión sin navegador.`);
  }
  if (!ok) await ogWithSharp(out);
  await logInfo(out);
}

/* ------------------------------------------------------------------ client logos */

/** Rasteriza un SVG a unos 600 px de alto, para recortar y reducir sin perder nitidez. */
async function svgToPng(buf) {
  const base = await sharp(buf, { limitInputPixels: false }).metadata();
  const density = Math.min(2400, Math.max(72, (72 * 600) / base.height));
  return sharp(buf, { density, limitInputPixels: false }).png().toBuffer();
}

/**
 * Vuelve transparente el fondo blanco sin dejar halo: cada píxel pasa a ser su color "puro" con la
 * opacidad necesaria para verse igual sobre blanco (como "color a alfa" de GIMP).
 */
async function whiteToAlpha(input) {
  const { data, info } = await sharp(input).flatten({ background: C.white }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const a = Math.max(255 - data[i], 255 - data[i + 1], 255 - data[i + 2]) / 255;
    if (a < 0.04) {
      data[i + 3] = 0;
      continue;
    }
    for (let c = 0; c < 3; c++) data[i + c] = Math.max(0, Math.min(255, Math.round(255 - (255 - data[i + c]) / a)));
    data[i + 3] = Math.round(a * 255);
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
}

/**
 * Grandstream publica en vector solo la versión apilada (isotipo arriba, nombre abajo); la de su
 * encabezado (isotipo a la izquierda) es un PNG de 300 x 43. Esta función arma la horizontal con
 * las piezas del SVG oficial sin tocarlas: solo las reubica con transform, como en el encabezado
 * de grandstream.com (referencia: logos-fuentes/marcas/grandstream-referencia-encabezado.png).
 */
function grandstreamHorizontal(svg) {
  const body = svg.slice(svg.indexOf('>', svg.indexOf('<svg')) + 1, svg.lastIndexOf('</svg>'));
  const iso = body.indexOf('<g>'); // primero va el nombre (path + línea), después los tres grupos del isotipo
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 717.1 102.8" width="717.1" height="102.8">
<g transform="matrix(0.662 0 0 0.662 -148.42 -209.45)">${body.slice(iso)}</g>
<g transform="translate(121.9 -493.33)">${body.slice(0, iso)}</g></svg>`;
}

/**
 * Cartocor publica en vector (cartocor.com/images/logo-cartocor.svg) solo la versión apilada y en
 * blanco, para su encabezado oscuro. La versión a color y horizontal (isotipo a la izquierda) es la
 * que usa Arcor en arcor.com, pero solo como PNG de 180 x 120 (referencia:
 * logos-fuentes/clientes/cartocor-referencia-color.png). Esta función arma esa versión con las piezas
 * del SVG oficial sin tocar su forma: les pone los colores de la marca y las reubica con transform,
 * con las proporciones medidas sobre la referencia (isotipo 2,17 veces el alto del nombre).
 * Piezas del SVG, en orden: 8 letras de "CARTOCOR" y 5 del isotipo (engranaje izquierdo, banda
 * inferior, contorno, engranaje derecho, banda superior). Las dos últimas van en verde.
 */
function cartocorColor(svg) {
  const GRIS = '#7A7A78';
  const VERDE = '#4FA800';
  const piezas = [...svg.matchAll(/<(?:path|polygon)\b[^>]*\/>/g)].map(([p]) => p.replace(/\sclass="[^"]*"/, ''));
  if (piezas.length !== 13) throw new Error(`cartocor.svg cambió: se esperaban 13 piezas y hay ${piezas.length}`);
  const pintar = (p, color) => p.replace(/^<(path|polygon)/, `<$1 fill="${color}"`);
  const letras = piezas.slice(0, 8).map((p) => pintar(p, GRIS)).join('');
  const iso = piezas.slice(8).map((p, i) => pintar(p, i >= 3 ? VERDE : GRIS)).join('');
  // Cajas en el viewBox original (204.77 x 116.5): nombre x 0-204.8, y 88.1-116.5; isotipo x 54.7-146.9, y 0-75.7.
  const k = 0.814; // isotipo: 61,6 de alto (2,17 x 28,4 del nombre)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 283.8 61.6" width="283.8" height="61.6">
<g transform="matrix(${k} 0 0 ${k} ${(-54.7 * k).toFixed(2)} 0)">${iso}</g>
<g transform="translate(79 -64.4)">${letras}</g></svg>`;
}

/** Lee un archivo de logo y lo devuelve como PNG (los SVG se rasterizan) recortado y con alfa. */
async function loadLogo(src, opts) {
  let input = readFileSync(src);
  if (src.endsWith('.svg')) {
    let svg = input.toString('utf8');
    if (opts.quitar) svg = svg.replace(opts.quitar, '');
    if (opts.horizontal) svg = grandstreamHorizontal(svg);
    if (opts.armar) svg = opts.armar(svg);
    input = await svgToPng(Buffer.from(svg));
  }
  if (opts.alpha === 'white') input = await whiteToAlpha(input);
  const trimmed = await sharp(input, { limitInputPixels: false }).ensureAlpha().trim({ threshold: 12 }).png().toBuffer({ resolveWithObject: true });
  if (!opts.soloHasta) return trimmed.data;
  // Se queda con la parte izquierda (la sigla) y deja afuera la bajada de la derecha.
  const width = Math.round(trimmed.info.width * opts.soloHasta);
  const left = await sharp(trimmed.data).extract({ left: 0, top: 0, width, height: trimmed.info.height }).png().toBuffer();
  return sharp(left).trim({ threshold: 12 }).png().toBuffer();
}

/** Pone varias piezas una al lado de la otra, al mismo alto, con un espacio de 8 % del alto. */
async function joinParts(buffers) {
  const H = 600;
  const parts = await Promise.all(buffers.map((b) => sharp(b).resize({ height: H }).png().toBuffer({ resolveWithObject: true })));
  const gap = Math.round(H * 0.08);
  const width = parts.reduce((w, p) => w + p.info.width, 0) + gap * (parts.length - 1);
  let left = 0;
  const composite = parts.map((p) => {
    const c = { input: p.data, left, top: 0 };
    left += p.info.width + gap;
    return c;
  });
  return sharp({ create: { width, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite(composite).png().toBuffer();
}

/** Recorta márgenes, lleva a 96 px de alto y guarda en WebP calidad 90, con fondo transparente. */
async function buildLogo(srcs, out, opts = {}) {
  const pieces = await Promise.all(srcs.map((s) => loadLogo(s, opts)));
  const input = pieces.length > 1 ? await joinParts(pieces) : pieces[0];
  await sharp(input).resize({ height: LOGO_HEIGHT, kernel: 'lanczos3' }).webp(LOGO_WEBP).toFile(out);
  await logInfo(out);
}

/** Resuelve los archivos de origen de un logo; null (con aviso) si falta alguno. */
function logoSources(item, dir) {
  const srcs = (item.partes ?? [item.fuente]).map((f) => join(dir, f));
  const missing = srcs.find((s) => !existsSync(s));
  if (missing) {
    console.warn(`  ! Falta el origen de ${item.slug}: ${rel(missing)} (se conserva el .webp ya generado)`);
    return null;
  }
  return srcs;
}

async function buildLogos() {
  ensureDir(LOGOS_DIR);
  for (const logo of LOGOS) {
    const srcs = logoSources(logo, FUENTES_CLIENTES);
    if (srcs) await buildLogo(srcs, join(LOGOS_DIR, `${logo.slug}.webp`), logo);
  }
}

/* ------------------------------------------------------------------ brand logos (fabricantes) */

async function buildMarcas() {
  ensureDir(MARCAS_DIR);
  for (const m of MARCAS) {
    const srcs = logoSources(m, FUENTES_MARCAS);
    if (srcs) await buildLogo(srcs, join(MARCAS_DIR, `${m.slug}.webp`), m);
  }
}

/* ------------------------------------------------------------------ main */

const only = process.argv.find((a) => a.startsWith('--only='))?.split('=')[1];
const steps = { brand: buildBrand, icons: buildIcons, og: buildOg, logos: buildLogos, marcas: buildMarcas };
for (const [name, fn] of Object.entries(steps)) {
  if (only && only !== name) continue;
  console.log(`> ${name}`);
  await fn();
}
console.table(report);
