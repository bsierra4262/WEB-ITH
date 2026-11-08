// Pide al Vite local (SITIO_HOST/SITIO_PUERTO, por defecto 127.0.0.1:5174) cada URL vieja de la lista del test del .htaccess y compara el 301 con el
// mismo destino (relativo), con y sin UTM.
'use strict';
const fs = require('fs'); const http = require('http');
const src = fs.readFileSync(__dirname + '/test-htaccess.cjs', 'utf8');
const R = eval(src.slice(src.indexOf('const R = [') + 10, src.indexOf('];', src.indexOf('const R = [')) + 1));
const extra = [['/blog', '/novedades/'], ['/blog/', '/novedades/'], ['/blog/una-nota/', '/novedades/una-nota/'],
  ['/servicios/', '/#servicios'], ['/servicios', '/#servicios'], ['/servicios/empresas.html', '/#servicios'],
  ['/servicios/index.html', '/#servicios'], ['/servicios/home.html', '/#servicios']];
const UTM = 'utm_source=google&utm_medium=cpc&utm_campaign=vieja';
const conUtm = (d) => d.includes('#') ? d.replace('#', '?' + UTM + '#') : d + '?' + UTM;
const head = (p) => new Promise((ok, mal) => http.request({ host: process.env.SITIO_HOST || '127.0.0.1', port: Number(process.env.SITIO_PUERTO || 5174), path: p, method: 'HEAD', headers: { accept: 'text/html' } }, (r) => { r.resume(); ok({ s: r.statusCode, l: r.headers.location }); }).on('error', mal).end());
(async () => {
  let n = 0; const f = [];
  for (const [o, d] of [...R, ...extra]) for (const [url, esp] of [[o, d], [o + '?' + UTM, conUtm(d)]]) {
    n++; const r = await head(url);
    if (r.s !== 301 || r.l !== esp) f.push(`FALLA ${url}: ${r.s} ${r.l} (esperado 301 ${esp})`);
  }
  for (const [url, s] of [['/', 200], ['/postulate/', 200], ['/diagnostico-sin-cargo/', 200], ['/privacidad/', 200], ['/no-existe/', 404], ['/google9ffcbef7277c41a3.html', 200]]) {
    n++; const r = await head(url); if (r.s !== s) f.push(`FALLA ${url}: ${r.s} (esperado ${s})`);
  }
  console.log(f.join('\n')); console.log(`${n - f.length}/${n} pedidos a Vite OK`); process.exit(f.length ? 1 : 0);
})();
