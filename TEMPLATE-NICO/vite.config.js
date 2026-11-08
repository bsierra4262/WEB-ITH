// Solo para ver la página en local con recarga en vivo (no se publica: el hosting sirve los PHP de api/ directo).
// Vite no ejecuta PHP: /api va al `php -S` que levanta servir.cmd en 127.0.0.1:5176, con la configuración del CRM
// de pruebas en ITH_CRM_CONFIG. Para el navegador la página y la API quedan en el mismo origen (5174), como en el
// hosting; con puertos distintos no podría leer las respuestas.
// CommonJS (module.exports): la carpeta no tiene package.json y Vite carga este archivo como CommonJS.

// Blog "Novedades": en producción vive en /novedades/ del mismo dominio, pero es un WordPress aparte (solo el blog;
// el resto del sitio es este HTML). En local ese WordPress corre en la raíz de 127.0.0.1:5180 (WORDPRESS/servir.cmd):
// el listado de notas es su portada y las notas y categorías cuelgan de ahí (/<nota>/, /categoria/<slug>/). Por eso
// /novedades y todo lo que cuelga de ahí se redirige allá sacando el prefijo y conservando el resto de la ruta y la
// consulta (/novedades/page/2/ -> 127.0.0.1:5180/page/2/). El router del WordPress local (WORDPRESS/php/router.php)
// también acepta /novedades/... y hace lo mismo, para cuando se entra directo al 5180 con una ruta de producción.
// Es una redirección y no un proxy a propósito: WordPress arma sus enlaces, estilos y cookies con su propia URL
// (127.0.0.1:5180) y detrás de un proxy en otro puerto se rompen. Va como middleware propio, antes de los de Vite, y
// no toca el proxy de /api.
const BLOG_LOCAL = 'http://127.0.0.1:5180';

const blogNovedades = {
  name: 'ith-blog-novedades',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const url = req.url || '';
      if (!/^\/novedades(\/|\?|$)/.test(url)) return next();
      res.statusCode = 302;
      res.setHeader('Location', BLOG_LOCAL + '/' + url.replace(/^\/novedades\/?/, ''));
      res.setHeader('Cache-Control', 'no-store');
      res.end();
    });
  },
};

// URLs del sitio anterior y página de error: en el hosting las resuelve el .htaccess de la raíz (301 a su equivalente
// y ErrorDocument 404 /404.html). Acá se copia la misma lista para que en local se comporte igual; si se cambia una,
// cambiar la otra. Sin esto, Vite devuelve la home con 200 para cualquier ruta que no existe.
// [patrón, destino]: un destino con /#ancla conserva la consulta antes del ancla (/?utm_source=...#servicios).
// Mismo orden que el .htaccess (gana la primera que coincide) y mismo prefijo /es/ opcional. Diferencias, porque en
// local no aplican: el host de los subdominios, las carpetas de las apps, la mini web física de /servicios/ (acá no
// existe, así que todo /servicios/... va a /#servicios) y /?page_id=32 (la regla mira la consulta, y esta lista solo
// la ruta). En el hosting los destinos van con https://www.intellihelp.tech adelante; acá, relativos.
const RUTAS_VIEJAS = [
  // Blog anterior, novedades en inglés y notas de 2018 -> Novedades
  [/^\/blog\/?$/i, '/novedades/'],
  [/^\/blog\/(.+)$/i, '/novedades/$1'],
  [/^\/(?:es\/)?(?:news|la-ciudad-buenos-aires-contara-una-red-fibra-optica-unica|la-ciudad-de-buenos-aires-contara-con-una-red-de-fibra-optica-propia-y-unica|claves-que-hay-que-tener-en-cuenta-en-las-evaluaciones-de-desempeno)\/?$/i, '/novedades/'],
  // Contacto -> Diagnóstico sin cargo
  [/^\/(?:es\/)?(?:diagnostico|contacto)(?:\/.*)?$/i, '/diagnostico-sin-cargo/'],
  [/^\/(?:es\/)?(?:contacto-2|contacto-us|contact-us)\/?$/i, '/diagnostico-sin-cargo/'],
  // Búsquedas laborales y avisos de empleo -> Postulate
  [/^\/(?:es\/)?(?:trabaja-con-nosotros|nosotros\/trabaja-con-nosotros)(?:\/.*)?$/i, '/postulate/'],
  [/^\/(?:es\/)?(?:busquedas|searches|rrhh|category\/rrhh|dejanos-tu-cv|arquitecto-de-soluciones)\/?$/i, '/postulate/'],
  [/^\/(?:es\/)?(?:analista|developer|desarrollador)-[a-z0-9-]+\/?$/i, '/postulate/'],
  // Secciones de la home
  [/^\/servicios(?:\/.*)?$/i, '/#servicios'],
  [/^\/(?:es\/servicios(?:\/.*)?|(?:es\/)?(?:servici0s|servicios-antigua|services|outsourcing|webinar-claves-outsourcing-tecnologico-2022-yanina-brea)\/?)$/i, '/#servicios'],
  [/^\/(?:es\/)?(?:soluciones(?:\/.*)?|(?:soluciones-antigua|soluciones-v1-antigua|solutions|control-de-accesos|videoseguridad|soluciones-cloud-huawei)\/?)$/i, '/#soluciones'],
  [/^\/(?:es\/)?(?:(?:sectores|casos)(?:\/.*)?|(?:outsourcing-bancos|universidades|universities)\/?)$/i, '/#casos'],
  [/^\/(?:es\/)?(?:(?:clientes|clientes-antigua|clients)\/?|(?:client-types|client|download)(?:\/.*)?)$/i, '/#clientes'],
  [/^\/(?:es\/)?(?:quienes-somos|nosotros|who-we-are|who-we-are-2)\/?$/i, '/#quienes-somos'],
  [/^\/(?:es\/)?(?:partners-y-vendors|partners-and-vendors)\/?$/i, '/#socios'],
  [/^\/(?:es\/)?history(?:\/.*)?$/i, '/#historia'],
  [/^\/(?:es\/)?preguntas-frecuentes\/?$/i, '/#preguntas'],
  // Home vieja, autor, categoría, inglés y lo que quede de /es/ -> home
  [/^\/(?:es\/)?(?:home|home-2|home-antigua)\/?$/i, '/'],
  [/^\/(?:es\/)?(?:author|category)(?:\/.*)?$/i, '/'],
  [/^\/(?:en|es)(?:\/.*)?$/i, '/'],
];

const ithRutasViejas = {
  name: 'ith-rutas-viejas',
  configureServer(server) {
    const fs = require('fs');
    const path = require('path');
    const raiz = server.config.root;
    server.middlewares.use((req, res, next) => {
      if (req.method !== 'GET' && req.method !== 'HEAD') return next();
      const [ruta, consulta = ''] = (req.url || '').split('?');
      if (/^\/(@|__|node_modules\/|api\/|novedades(\/|$))/.test(ruta)) return next();
      const regla = RUTAS_VIEJAS.find(([patron]) => patron.test(ruta));
      if (regla) {
        let destino = ruta.replace(regla[0], regla[1]);
        if (consulta) destino = destino.includes('#') ? destino.replace('#', `?${consulta}#`) : `${destino}?${consulta}`;
        res.statusCode = 301;
        res.setHeader('Location', destino);
        res.setHeader('Cache-Control', 'no-store');
        return res.end();
      }
      // Solo pedidos de página (el navegador pide HTML): los módulos, estilos e imágenes siguen con Vite
      if (!String(req.headers.accept || '').includes('text/html')) return next();
      let archivo;
      try { archivo = path.join(raiz, decodeURIComponent(ruta)); } catch (e) { return next(); }
      const existe = (f) => { try { return fs.statSync(f).isFile(); } catch (e) { return false; } };
      if (existe(archivo) || existe(path.join(archivo, 'index.html'))) return next();
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store');
      res.end(fs.readFileSync(path.join(raiz, '404.html')));
    });
  },
};

module.exports = {
  plugins: [blogNovedades, ithRutasViejas],
  server: {
    proxy: {
      '/api': { target: 'http://127.0.0.1:5176', changeOrigin: false },
    },
  },
  // Multipágina: en desarrollo Vite ya sirve cada carpeta con su index.html (/diagnostico-sin-cargo/, /privacidad/);
  // esto es para `vite build`, que si no solo toma la home. Se listan las páginas que existan.
  build: {
    rollupOptions: {
      input: ['index.html', 'diagnostico-sin-cargo/index.html', 'gracias-reserva/index.html', 'privacidad/index.html', 'postulate/index.html', '404.html']
        .map((pagina) => require('path').resolve(__dirname, pagina))
        .filter((ruta) => require('fs').existsSync(ruta)),
    },
  },
};
