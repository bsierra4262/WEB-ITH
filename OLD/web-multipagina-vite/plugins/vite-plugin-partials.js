import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { quitarBorradores } from './strip-borradores.js';

// Mini motor de parciales para todas las páginas del sitio (home e internas).
// Guía completa con ejemplos: src/partials/pagina/LEEME.md
//
// 1. <include src="partials/x.html"></include>
//    Rutas relativas al archivo que incluye. Desde una página (index.html,
//    servicios/x/index.html, 404.html…) siempre son relativas a src/, sin
//    importar la carpeta de la página.
// 2. Props: <include src="…" titulo="Hola" seccion-url="/servicios/"></include>
//    Dentro del parcial: {{props.titulo}} (obligatoria: si falta, el build
//    falla) o {{props.titulo|texto por defecto}} (opcional; "{{props.x|}}" queda
//    vacía). Las props se reemplazan antes de expandir los includes del parcial,
//    así que sirven para armar rutas: <include src="iconos/{{props.icono}}.html">.
// 3. Slots: lo que va entre <include …> y </include> reemplaza a <slot></slot>
//    dentro del parcial. Slots con nombre: <template slot="panel">…</template>
//    en la página y <slot name="panel"></slot> en el parcial. El contenido se
//    expande en el contexto de la página (puede tener sus propios includes).
// 4. {{site.clave.subclave}}: datos de src/data/site.json, la única fuente de
//    verdad para teléfonos, mails, direcciones y redes.
// 5. {{page.path}}, {{page.url}} y {{page.origin}}: ruta de la página
//    ("/servicios/x/"), URL canónica ("https://www.intellihelp.tech/servicios/x/")
//    y dominio sin barra final ("https://www.intellihelp.tech"), para armar URLs
//    absolutas a otras páginas: "{{page.origin}}/servicios/".
// 6. Links con data-nav: si apuntan a la página actual reciben
//    aria-current="page". Con data-nav="seccion" (menú del header), también
//    se marca el link de la sección que contiene a la página (por ejemplo
//    /servicios/ desde /servicios/x/) con aria-current="true".
// 7. <script type="application/ld+json" data-faq-auto></script>: se reemplaza
//    por el schema FAQPage armado con las preguntas .faq__item publicadas de la
//    página (sin borradores ni notas), con el mismo texto que se ve.
// En el build de producción, además, se quitan .nota, [data-draft] y comentarios.
// Editar un parcial o site.json recarga el navegador.

const OPEN = /<include\b([^>]*?)\s*>/g;
const TAG = /<(\/?)include\b[^>]*>/g;
const ATTR = /([\w-]+)\s*=\s*"([^"]*)"/g;
const SITE_TOKEN = /\{\{\s*site\.([\w.]+)\s*\}\}/g;
const PAGE_TOKEN = /\{\{\s*page\.(path|url|origin)\s*\}\}/g;
const PROP_TOKEN = /\{\{\s*props\.([\w-]+)\s*(?:\|([^}]*))?\}\}/g;
const NAMED_SLOT_CONTENT = /<template\s+slot="([\w-]+)"\s*>([\s\S]*?)<\/template>/g;

function parseAttrs(raw) {
  const attrs = {};
  for (const [, key, value] of raw.matchAll(ATTR)) attrs[key] = value;
  return attrs;
}

/** Busca el </include> que cierra el <include> abierto en `from` (respeta anidados). */
function findClose(html, from) {
  TAG.lastIndex = from;
  let depth = 1;
  let m;
  while ((m = TAG.exec(html))) {
    depth += m[1] ? -1 : 1;
    if (depth === 0) return { start: m.index, end: TAG.lastIndex };
  }
  return null;
}

function fillProps(html, props, file) {
  return html.replace(PROP_TOKEN, (_, key, fallback) => {
    if (key in props) return props[key];
    if (fallback !== undefined) return fallback;
    throw new Error(`[partials] ${file} necesita la prop "${key}" y el include no la pasa`);
  });
}

function fillSlots(html, inner, file) {
  const named = {};
  const rest = inner.replace(NAMED_SLOT_CONTENT, (_, name, content) => {
    named[name] = content;
    return '';
  });
  let out = html.replace(/<slot\s+name="([\w-]+)"\s*><\/slot>/g, (_, name) => named[name] ?? '');
  out = out.replace(/<slot\s*><\/slot>/g, () => rest.trim());
  if (rest.trim() && !/<slot\s*><\/slot>/.test(html)) {
    throw new Error(`[partials] ${file} no tiene <slot></slot> y el include le pasa contenido`);
  }
  return out;
}

// Los comentarios HTML se apartan antes de procesar: así un ejemplo de uso
// dentro de un comentario no se expande ni exige props.
let maskId = 0;
function maskComments(html) {
  const id = maskId++;
  const saved = [];
  const masked = html.replace(/<!--[\s\S]*?-->/g, (c) => `\u0000c${id}:${saved.push(c) - 1}\u0000`);
  const re = new RegExp(`\u0000c${id}:([0-9]+)\u0000`, 'g');
  return { masked, restore: (s) => s.replace(re, (_, i) => saved[Number(i)]) };
}

function expand(source, baseDir, seen = new Set()) {
  const { masked: html, restore } = maskComments(source);
  let out = '';
  let cursor = 0;
  OPEN.lastIndex = 0;
  let m;
  while ((m = OPEN.exec(html))) {
    const close = findClose(html, OPEN.lastIndex);
    if (!close) throw new Error(`[partials] <include> sin cerrar: ${m[0]}`);
    const { src, ...props } = parseAttrs(m[1]);
    if (!src) throw new Error(`[partials] <include> sin src: ${m[0]}`);
    const file = resolve(baseDir, src);
    if (seen.has(file)) throw new Error(`[partials] include circular: ${file}`);

    // El contenido del slot se expande con la carpeta de quien incluye.
    const inner = expand(html.slice(OPEN.lastIndex, close.start), baseDir, seen);
    const raw = maskComments(readFileSync(file, 'utf8'));
    let content = fillProps(raw.masked, props, src);
    content = raw.restore(expand(content, dirname(file), new Set(seen).add(file)));
    content = fillSlots(content, inner, src);

    out += html.slice(cursor, m.index) + content;
    cursor = close.end;
    OPEN.lastIndex = close.end;
  }
  return restore(out + html.slice(cursor));
}

function fillSite(html, site) {
  return html.replace(SITE_TOKEN, (match, path) => {
    const value = path.split('.').reduce((obj, key) => obj?.[key], site);
    if (value === undefined || typeof value === 'object') {
      throw new Error(`[partials] falta site.${path} en src/data/site.json`);
    }
    return String(value);
  });
}

/** "/servicios/x/index.html" → "/servicios/x/"; "/404.html" queda igual. */
export function pagePath(ctxPath = '/') {
  const clean = ctxPath.split('?')[0].replace(/\\/g, '/');
  const path = clean.replace(/(^|\/)index\.html$/, '$1');
  return path.startsWith('/') ? path : `/${path}`;
}

function fillPage(html, path, site) {
  const origin = site.url.replace(/\/$/, '');
  const values = { path, url: origin + path, origin };
  return html.replace(PAGE_TOKEN, (_, key) => values[key]);
}

/** aria-current en los links con data-nav (header, footer) según la página. */
function markNav(html, path) {
  return html.replace(/<a\b([^>]*\bdata-nav\b[^>]*)>/g, (tag, attrs) => {
    const href = attrs.match(/\bhref="([^"#?]*)/)?.[1];
    if (!href || !href.startsWith('/') || /aria-current=/.test(attrs)) return tag;
    let current = null;
    if (href === path) current = 'page';
    else if (/\bdata-nav="seccion"/.test(attrs) && href !== '/' && path.startsWith(href)) current = 'true';
    return current ? `<a${attrs} aria-current="${current}">` : tag;
  });
}

const decode = (s) =>
  s
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/&#8288;|&#x2060;|⁠/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
const plain = (s) => decode(s.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').replace(/\s([.,;:)])/g, '$1').trim();

/** Arma el FAQPage con las preguntas publicadas (sin notas ni borradores). */
function faqSchema(html) {
  const marker = /<script\b[^>]*\bdata-faq-auto\b[^>]*>\s*<\/script>/;
  if (!marker.test(html)) return html;
  const { html: publicado } = quitarBorradores(html);
  const items = [];
  for (const [, body] of publicado.matchAll(/<details\b[^>]*class="[^"]*\bfaq__item\b[^"]*"[^>]*>([\s\S]*?)<\/details>/g)) {
    const q = body.match(/class="faq__q-text"[^>]*>([\s\S]*?)<\/span>/)?.[1];
    const a = body.match(/class="faq__a"[^>]*>([\s\S]*)<\/div>/)?.[1];
    if (!q || !a || !plain(a)) continue;
    items.push({ '@type': 'Question', name: plain(q), acceptedAnswer: { '@type': 'Answer', text: plain(a) } });
  }
  const json = JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items }, null, 2).replace(/</g, '\\u003c');
  return html.replace(marker, `<script type="application/ld+json">\n${json}\n</script>`);
}

export default function partials({ dir }) {
  const dataFile = resolve(dir, 'data/site.json');
  return {
    name: 'ith-partials',
    transformIndexHtml: {
      order: 'pre',
      handler: (html, ctx) => {
        const site = JSON.parse(readFileSync(dataFile, 'utf8'));
        const path = pagePath(ctx.path);
        let listo = fillPage(fillSite(expand(html, dir), site), path, site);
        listo = markNav(listo, path);
        // En el build de producción se quitan notas, borradores y comentarios.
        if (!ctx.server && process.env.VITE_NOTAS !== '1') {
          const { html: limpio, quitados } = quitarBorradores(listo);
          console.log(`[partials] ${path}: ${quitados} notas/borradores internos quitados del HTML`);
          listo = limpio;
        }
        return faqSchema(listo);
      },
    },
    configureServer(server) {
      server.watcher.add([resolve(dir, 'partials'), dataFile]);
      server.watcher.on('change', (file) => {
        const f = file.replace(/\\/g, '/');
        if (f.includes('/src/partials/') || f.endsWith('/src/data/site.json')) {
          server.ws.send({ type: 'full-reload' });
        }
      });
    },
  };
}
