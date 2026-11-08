import { defineConfig } from 'vite';
import { resolve, relative } from 'node:path';
import { readdirSync, existsSync, readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import partials from './plugins/vite-plugin-partials.js';
import contactMock from './plugins/vite-plugin-contact-mock.js';

const root = import.meta.dirname;

// Herramientas locales opcionales, fuera del sitio (../.orion/): solo se cargan
// en desarrollo y si la carpeta existe. El sitio no depende de ellas.
const herramientaLocal = resolve(root, '../.orion/vite-plugin-progreso.js');
const herramientas = existsSync(herramientaLocal)
  ? [(await import(pathToFileURL(herramientaLocal).href)).default({ root: resolve(root, '..') })]
  : [];

// Páginas del sitio: index.html de la raíz, 404.html y cada carpeta/index.html
// (soluciones/, servicios/outsourcing-y-service-desk/, clientes/…). Se buscan
// solas: para sumar una página alcanza con crear su carpeta con un index.html.
// Si es publicable, sumarla también a public/sitemap.xml (con su lastmod).
// Estas carpetas no son páginas y no se recorren:
const NO_PAGINAS = new Set(['node_modules', 'dist', 'plugins', 'scripts', 'src', 'public', 'recursos', 'config']);

function buscarPaginas(dir = root) {
  const paginas = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      if (dir === root && NO_PAGINAS.has(entry.name)) continue;
      paginas.push(...buscarPaginas(full));
    } else if (entry.name === 'index.html' || (dir === root && entry.name === '404.html')) {
      paginas.push(full);
    }
  }
  return paginas;
}

const aPosix = (p) => p.split('\\').join('/');
const paginas = buscarPaginas();
// Clave de cada entrada: "index", "404", "servicios/outsourcing-y-service-desk/index"…
const input = Object.fromEntries(
  paginas.map((file) => [aPosix(relative(root, file)).replace(/\.html$/, ''), file]),
);

// Prefijo relativo desde una página hasta la raíz del sitio publicado:
// "index.html" → "./", "servicios/x/index.html" → "../../".
const haciaRaiz = (htmlPath) => {
  const depth = htmlPath.replace(/^\//, '').split('/').length - 1;
  return depth ? '../'.repeat(depth) : './';
};

// Solo en el build: agrega <link rel="preload"> para el subset "latin" de las
// dos fuentes (lo que se pinta sobre el pliegue). Vite les pone hash al nombre,
// así que se buscan en el bundle final. latin-ext no se precarga: casi nunca se usa.
function fontPreload() {
  const LATIN = /(?:^|\/)(?:saira|source-sans-3)-latin-wght-normal-[\w-]+\.woff2$/;
  let base = '/';
  return {
    name: 'ith-font-preload',
    apply: 'build',
    configResolved(config) {
      base = config.base;
    },
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const files = Object.keys(ctx.bundle ?? {}).filter((f) => LATIN.test(f));
        if (files.length !== 2) {
          this.warn(`[font-preload] se esperaban 2 fuentes latin y hay ${files.length}`);
        }
        // Con base relativa ('./') el prefijo depende de la profundidad de la página.
        const prefix = base === './' || base === '' ? haciaRaiz(ctx.path) : base;
        const links = files
          .sort()
          .map((file) => `<link rel="preload" as="font" type="font/woff2" href="${prefix}${file}" crossorigin />`);
        // Justo después del viewport: <meta charset> sigue primero y los preload
        // salen antes que el CSS y el JS.
        const VIEWPORT = /(<meta\s+name="viewport"[^>]*>)/;
        if (!VIEWPORT.test(html)) {
          return html.replace('</head>', `${links.join('\n')}\n</head>`);
        }
        return html.replace(VIEWPORT, `$1\n    ${links.join('\n    ')}`);
      },
    },
  };
}

// La 404 la sirve el hosting en cualquier URL inexistente (/algo/que/no/existe):
// sus rutas relativas ("./assets/…") se romperían, así que en el build pasan a
// absolutas desde la raíz. En desarrollo, una URL sin página muestra la 404.
function pagina404() {
  let outDir = resolve(root, 'dist');
  return {
    name: 'ith-404',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    // `vite preview` (el build): una URL sin archivo ni carpeta con index.html
    // responde la 404 propia con estado 404, como hace el hosting con ErrorDocument.
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = decodeURIComponent((req.url ?? '/').split('?')[0]);
        const html = req.headers.accept?.includes('text/html');
        const destino = resolve(outDir, `.${url}`);
        const existe = existsSync(destino) && (/\.\w+$/.test(url) || existsSync(resolve(destino, 'index.html')));
        if (req.method !== 'GET' || !html || existe) return next();
        const pagina = resolve(outDir, '404.html');
        if (!existsSync(pagina)) return next();
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(readFileSync(pagina));
      });
    },
    configureServer(server) {
      return () => {
        server.middlewares.use((req, _res, next) => {
          const url = (req.url ?? '/').split('?')[0];
          const html = req.headers.accept?.includes('text/html');
          if (req.method === 'GET' && html && !/\.\w+$/.test(url) && !url.startsWith('/@') && !url.startsWith('/__')) {
            const carpeta = resolve(root, `.${decodeURIComponent(url)}`);
            if (!existsSync(resolve(carpeta, 'index.html'))) req.url = '/404.html';
          }
          next();
        });
      };
    },
    generateBundle: {
      order: 'post',
      handler(_options, bundle) {
        const page = bundle['404.html'];
        if (page?.type === 'asset') {
          page.source = String(page.source).replace(/(\s(?:src|href|content)=")\.\//g, '$1/');
        }
      },
    },
  };
}

export default defineConfig({
  root,
  base: './',
  // 'mpa': cada carpeta con index.html es una página; una URL sin página no cae
  // en la home (pagina404() muestra la 404, como en el hosting).
  appType: 'mpa',
  plugins: [partials({ dir: resolve(root, 'src') }), contactMock(), fontPreload(), pagina404(), ...herramientas],
  server: {
    // Solo en esta máquina. Para probar desde el celular en la misma red,
    // levantarlo a mano con `npm run dev -- --host` y cerrarlo al terminar.
    // 127.0.0.1 y no 'localhost': en Windows 'localhost' escucha solo en ::1 y
    // dejaría de responder en 127.0.0.1. http://localhost:5173 anda igual.
    host: '127.0.0.1',
    port: 5173,
    // Las cuatro primeras son las que Vite trae por defecto; config/ lleva la
    // conexión local con el CRM y no se sirve.
    fs: {
      deny: ['.env', '.env.*', '*.{crt,pem}', '**/.git/**', '**/config/**'],
    },
    open: false, // no abre pestañas nuevas: la que ya está abierta se actualiza sola
    watch: {
      ignored: ['**/dist/**', '**/recursos/**', '**/config/**'],
    },
  },
  optimizeDeps: {
    entries: paginas.map((file) => aPosix(relative(root, file))),
  },
  preview: {
    host: true,
    port: 4173,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsInlineLimit: 2048,
    cssMinify: true,
    rollupOptions: {
      input,
    },
  },
});
