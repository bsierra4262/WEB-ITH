// Emulador de las reglas del .htaccess de TEMPLATE-NICO (mod_rewrite, SetEnvIf, <If> ErrorDocument, Header en
// <FilesMatch>/<Files>, mod_dir y Options -Indexes) sobre un public_html simulado. Lee el .htaccess real y aplica
// sus mismas expresiones regulares. Uso: node test-htaccess.cjs [ruta/al/.htaccess] (por defecto, el de TEMPLATE-NICO)
'use strict';
const fs = require('fs');
const path = require('path');

const HTACCESS = process.argv[2] || path.join(__dirname, '..', '..', 'TEMPLATE-NICO', '.htaccess');
const SITIO = path.dirname(HTACCESS);
const DOCROOT = '/pub';

// ---------------------------------------------------------------------------------------------- parseo del .htaccess
function tokens(line) {
  const out = []; let i = 0;
  while (i < line.length) {
    while (i < line.length && /\s/.test(line[i])) i++;
    if (i >= line.length) break;
    if (line[i] === '"' || line[i] === "'") {
      const q = line[i++]; let s = '';
      while (i < line.length && line[i] !== q) { if (line[i] === '\\' && line[i + 1] === q) i++; s += line[i++]; }
      i++; out.push(s);
    } else { let s = ''; while (i < line.length && !/\s/.test(line[i])) s += line[i++]; out.push(s); }
  }
  return out;
}
function flags(str) {
  const f = {};
  if (!str) return f;
  str.replace(/^\[|\]$/g, '').split(',').forEach((x) => { const [k, v] = x.split('='); f[k.trim().toUpperCase()] = v === undefined ? true : v; });
  return f;
}

const conf = { rules: [], setenv: [], ifs: [], headers: [], errorDocGlobal: null, addType: {} };
let pendingConds = [];
let bloque = null; // { tipo, re }
let ifExpr = null;
for (const raw of fs.readFileSync(HTACCESS, 'utf8').split(/\r?\n/)) {
  const line = raw.trim();
  if (!line || line.startsWith('#')) continue;
  const t = tokens(line);
  const d = t[0];
  if (/^<FilesMatch/i.test(d)) { bloque = { tipo: 'match', re: new RegExp(t[1].replace(/>$/, '')) }; continue; }
  if (/^<Files$/i.test(d) || /^<Files\b/i.test(d)) { bloque = { tipo: 'nombre', nombre: t[1].replace(/>$/, '') }; continue; }
  if (/^<\/Files/i.test(d)) { bloque = null; continue; }
  if (/^<If$/i.test(d)) { ifExpr = line.slice(line.indexOf('"') + 1, line.lastIndexOf('"')); continue; }
  if (/^<\/If>/i.test(d)) { ifExpr = null; continue; }
  if (/^<\/?IfModule/i.test(d)) continue;
  if (d === 'RewriteCond') { pendingConds.push({ test: t[1], pat: t[2], fl: flags(t[3]) }); continue; }
  if (d === 'RewriteRule') { conf.rules.push({ pat: t[1], sub: t[2], fl: flags(t[3]), conds: pendingConds, src: line }); pendingConds = []; continue; }
  if (d === 'SetEnvIf' || d === 'SetEnvIfNoCase') { conf.setenv.push({ attr: t[1], re: new RegExp(t[2], d === 'SetEnvIfNoCase' ? 'i' : ''), set: t[3] }); continue; }
  if (d === 'ErrorDocument') { if (ifExpr) conf.ifs.push({ expr: ifExpr, code: t[1], doc: t[2] }); else conf.errorDocGlobal = { code: t[1], doc: t[2] }; continue; }
  if (d === 'Header') {
    const always = t[1] === 'always'; const k = always ? 2 : 1;
    const envTok = t.slice(k + 3).find((x) => x.startsWith('env='));
    conf.headers.push({ bloque, always, accion: t[k], nombre: t[k + 1], valor: t[k + 2], env: envTok ? envTok.slice(4) : null });
    continue;
  }
  if (d === 'AddType') { conf.addType[t[2]] = t[1]; continue; }
}

// Expresión del <If>: %{HTTP_HOST} =~ /re/i && %{REQUEST_URI} !~ m#re#
function evalIf(expr, req) {
  const m = expr.match(/^%\{HTTP_HOST\} =~ \/(.+?)\/(i?) && %\{REQUEST_URI\} !~ m#(.+)#$/);
  if (!m) throw new Error('Expresión <If> no reconocida: ' + expr);
  return new RegExp(m[1], m[2]).test(req.host) && !new RegExp(m[3]).test(req.uri);
}

// ---------------------------------------------------------------------------------------------- public_html simulado
function listar(dir, base = '') {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.vite', 'dev'].includes(e.name)) continue;
    const rel = base ? base + '/' + e.name : e.name;
    if (e.isDirectory()) out.push(...listar(path.join(dir, e.name), rel)); else out.push(rel);
  }
  return out;
}
function crearFS({ conServicios = true } = {}) {
  const archivos = new Set(listar(SITIO));
  [
    'wp-content/uploads/2019/07/ITH-servicios-digital.pdf',
    'assets/index-Bx3k9_aQ.js',
    '.well-known/acme-challenge/token123', '.git/config',
    'novedades/index.php', 'novedades/.htaccess',
    'crm/index.php', 'crm/.htaccess', 'crm-pruebas/index.php', 'desarrollo/index.php', 'Desarrollo/index.php',
    'GLPI/index.php', 'inventario/index.php', 'remitos/index.php', 'tickets/index.php', 'demo/index.html',
    'learning/index.php', 'learningtest/index.php', 'comprobantes/index.php', 'marketing/index.html',
    'landing-page-OLD/index.html', 'wp-snapshots/x.zip', 'cgi-bin/.keep',
  ].forEach((f) => archivos.add(f));
  if (conServicios) ['servicios/index.html', 'servicios/empresas.html', 'servicios/home.html', 'servicios/css/estilos.css', 'servicios/img/logo.png'].forEach((f) => archivos.add(f));
  const dirs = new Set(['']);
  for (const f of archivos) { const p = f.split('/'); for (let i = 1; i < p.length; i++) dirs.add(p.slice(0, i).join('/')); }
  // Carpetas con su propio .htaccess con "RewriteEngine On": las reglas de la raíz no se ejecutan ahí adentro.
  const reescrituraPropia = new Set(['novedades', 'crm']);
  return { archivos, dirs, reescrituraPropia };
}
// Docroot de cada subdominio dentro de public_html
const SUBDOMINIOS = { 'servicios.intellihelp.tech': 'servicios', 'desarrollo.intellihelp.tech': 'desarrollo', 'tickets.intellihelp.tech': 'tickets', 'crm.intellihelp.tech': 'crm' };

// ---------------------------------------------------------------------------------------------- motor
function variable(nombre, req, env) {
  if (nombre.startsWith('ENV:')) return env[nombre.slice(4)] || req.env[nombre.slice(4)] || '';
  if (nombre.startsWith('HTTP:')) { const h = nombre.slice(5).toLowerCase(); return req.headers[h] || ''; }
  switch (nombre) {
    case 'HTTP_HOST': return req.host;
    case 'HTTPS': return req.https ? 'on' : 'off';
    case 'QUERY_STRING': return req.query;
    case 'REQUEST_URI': return req.uri;
    case 'REQUEST_FILENAME': return DOCROOT + '/' + req.rel;
    case 'THE_REQUEST': return 'GET ' + req.uri + (req.query ? '?' + req.query : '') + ' HTTP/1.1';
    default: throw new Error('Variable no emulada: ' + nombre);
  }
}
function expandir(s, req, env, rm, cm) {
  return s
    .replace(/%\{([^}]+)\}/g, (_, v) => variable(v, req, env))
    .replace(/\$(\d)/g, (_, n) => (rm && rm[n]) || '')
    .replace(/%(\d)/g, (_, n) => (cm && cm[n]) || '');
}
function evalCond(c, req, env, rm, prevCm, fsim) {
  const test = expandir(c.test, req, env, rm, prevCm);
  let pat = c.pat; let neg = false;
  if (pat.startsWith('!')) { neg = true; pat = pat.slice(1); }
  let ok; let cm = null;
  const rel = test.startsWith(DOCROOT + '/') ? test.slice(DOCROOT.length + 1).replace(/\/$/, '') : null;
  if (pat === '-f') ok = rel !== null && fsim.archivos.has(rel);
  else if (pat === '-d') ok = rel !== null && fsim.dirs.has(rel);
  else if (pat.startsWith('=')) ok = c.fl.NC ? test.toLowerCase() === pat.slice(1).toLowerCase() : test === pat.slice(1);
  else { const m = new RegExp(pat, c.fl.NC ? 'i' : '').exec(test); ok = !!m; if (m) cm = m; }
  return { ok: neg ? !ok : ok, cm };
}
function reescribir(req, fsim) {
  const env = {};
  const primero = req.rel.split('/')[0];
  if (fsim.reescrituraPropia.has(primero) && req.rel.includes('/') === false && fsim.dirs.has(primero)) {
    // la carpeta en sí también lee su propio .htaccess
    return { env, saltada: true };
  }
  if (fsim.reescrituraPropia.has(primero) && fsim.dirs.has(primero)) return { env, saltada: true };
  for (const r of conf.rules) {
    let pat = r.pat; let neg = false;
    if (pat.startsWith('!')) { neg = true; pat = pat.slice(1); }
    const rm = new RegExp(pat, r.fl.NC ? 'i' : '').exec(req.rel);
    if (neg ? rm : !rm) continue;
    // condiciones (con [OR])
    let okTotal = true; let cm = null; let i = 0;
    while (i < r.conds.length) {
      let grupo = false;
      while (true) {
        const c = r.conds[i];
        const res = evalCond(c, req, env, rm, cm, fsim);
        if (res.ok) { grupo = true; if (res.cm) cm = res.cm; }
        i++;
        if (!c.fl.OR) break;
      }
      if (!grupo) { okTotal = false; break; }
    }
    if (!okTotal) continue;
    if (r.fl.E) { const [k, v] = r.fl.E.split(':'); env[k] = v; }
    if (r.fl.F) return { env, status: 403, regla: r.src };
    if (r.fl.G) return { env, status: 410, regla: r.src };
    if (r.sub === '-') { if (r.fl.L) return { env, regla: r.src }; continue; }
    let sub = expandir(r.sub, req, env, rm, cm);
    if (r.fl.R) {
      let destino; let qs;
      const q = sub.indexOf('?');
      if (q >= 0) { destino = sub.slice(0, q); qs = sub.slice(q + 1); } else { destino = sub; qs = req.query; }
      if (!r.fl.NE) destino = destino.replace(/#/g, '%23').replace(/ /g, '%20');
      return { env, status: Number(r.fl.R === true ? 302 : r.fl.R), location: destino + (qs ? '?' + qs : ''), regla: r.src };
    }
    throw new Error('Reescritura interna no emulada: ' + r.src);
  }
  return { env };
}
function pedir(url, opciones = {}) {
  const fsim = opciones.fs || FS;
  const u = new URL(url);
  const host = opciones.host || u.host;
  const req = {
    host, https: u.protocol === 'https:', uri: decodeURIComponent(u.pathname), query: u.search.replace(/^\?/, ''),
    headers: Object.fromEntries(Object.entries(opciones.headers || {}).map(([k, v]) => [k.toLowerCase(), v])), env: opciones.env || {},
  };
  const sub = SUBDOMINIOS[host.toLowerCase()];
  req.rel = (sub ? sub + '/' : '') + req.uri.replace(/^\//, '');
  const res = reescribir(req, fsim);
  const out = { status: 200, location: null, headers: {}, cuerpo: null, regla: res.regla || null, saltada: !!res.saltada };
  // SetEnvIf (Host y Request_URI)
  const env = { ...res.env };
  for (const s of conf.setenv) {
    const val = s.attr === 'Host' ? req.host : s.attr === 'Request_URI' ? req.uri : null;
    if (val === null) throw new Error('SetEnvIf no emulado: ' + s.attr);
    if (s.re.test(val)) { if (s.set.startsWith('!')) delete env[s.set.slice(1)]; else env[s.set.split('=')[0]] = s.set.split('=')[1] || '1'; }
  }
  let archivo = null;
  const relSinBarra = req.rel.replace(/\/$/, '');
  if (res.status) { out.status = res.status; out.location = res.location || null; }
  else if (res.saltada) {
    // La resuelve la app o WordPress con su propio .htaccess. mod_dir agrega la barra a la carpeta si falta.
    if (fsim.dirs.has(relSinBarra) && !req.rel.endsWith('/') && req.rel !== '') { out.status = 301; out.location = (req.https ? 'https://' : 'http://') + req.host + req.uri + '/' + (req.query ? '?' + req.query : ''); }
    else out.status = 200, out.cuerpo = 'app:' + req.rel.split('/')[0];
  } else if (req.rel.startsWith('api/') && !/^api\/(contact|agenda)\.php$/.test(req.rel)) {
    out.status = 403; // api/.htaccess
  } else if (fsim.archivos.has(req.rel)) { archivo = req.rel; out.cuerpo = archivo; }
  else if (fsim.dirs.has(relSinBarra)) {
    if (!req.rel.endsWith('/') && req.rel !== '' && relSinBarra !== '') { out.status = 301; out.location = (req.https ? 'https://' : 'http://') + req.host + req.uri + '/' + (req.query ? '?' + req.query : ''); }
    else {
      const idx = ['index.html', 'index.php'].map((n) => (relSinBarra ? relSinBarra + '/' : '') + n).find((f) => fsim.archivos.has(f));
      if (idx) { archivo = idx; out.cuerpo = idx; } else out.status = 403; // Options -Indexes
    }
  } else out.status = 404;
  if (out.status === 404) {
    const ed = conf.ifs.find((x) => x.code === '404' && evalIf(x.expr, req)) || conf.errorDocGlobal;
    out.cuerpo = ed ? ed.doc : 'default';
    if (ed) archivo = ed.doc.replace(/^\//, '');
  }
  // Cabeceras
  if (archivo) {
    const base = archivo.split('/').pop();
    for (const h of conf.headers) {
      if (!h.bloque) continue;
      if (h.bloque.tipo === 'match' && !h.bloque.re.test(base)) continue;
      if (h.bloque.tipo === 'nombre' && h.bloque.nombre !== base) continue;
      if (!h.always && (out.status < 200 || out.status > 299)) continue;
      if (h.env && !env[h.env]) continue;
      out.headers[h.nombre.toLowerCase()] = h.valor;
    }
  }
  return out;
}
let FS = crearFS();

// ---------------------------------------------------------------------------------------------- casos
const W = 'https://www.intellihelp.tech';
const UTM = 'utm_source=google&utm_medium=cpc&utm_campaign=vieja';
const casos = [];
const caso = (nombre, url, esperado, opciones) => casos.push({ nombre, url, esperado, opciones });
const conUtm = (destino) => destino.includes('#') ? destino.replace('#', '?' + UTM + '#') : destino + (destino.includes('?') ? '&' : '?') + UTM;

// Dominio canónico, un salto
caso('http sin www -> https www', 'http://intellihelp.tech/', { status: 301, location: W + '/' });
caso('https sin www -> https www', 'https://intellihelp.tech/', { status: 301, location: W + '/' });
caso('http www -> https www', 'http://www.intellihelp.tech/', { status: 301, location: W + '/' });
caso('http www con consulta', 'http://www.intellihelp.tech/?' + UTM, { status: 301, location: W + '/?' + UTM });
caso('http sin www a página', 'http://intellihelp.tech/privacidad/', { status: 301, location: W + '/privacidad/' });
caso('http sin www a página con UTM', 'http://intellihelp.tech/postulate/?' + UTM, { status: 301, location: W + '/postulate/?' + UTM });
caso('http www con X-Forwarded-Proto https (CDN)', 'http://www.intellihelp.tech/', { status: 200 }, { headers: { 'X-Forwarded-Proto': 'https' } });
caso('http www con HTTPS=on (CDN)', 'http://www.intellihelp.tech/', { status: 200 }, { env: { HTTPS: 'on' } });
caso('http www con X-Forwarded-SSL on', 'http://www.intellihelp.tech/', { status: 200 }, { headers: { 'X-Forwarded-SSL': 'on' } });
caso('http sin www aunque el CDN diga https', 'http://intellihelp.tech/', { status: 301, location: W + '/' }, { headers: { 'X-Forwarded-Proto': 'https' } });
caso('home https www', W + '/', { status: 200, cuerpo: 'index.html', cc: 'no-cache' });
caso('carpeta sin barra (un salto)', 'http://intellihelp.tech/postulate', { status: 301, location: W + '/postulate/' });
caso('carpeta sin barra https', W + '/diagnostico-sin-cargo', { status: 301, location: W + '/diagnostico-sin-cargo/' });
caso('carpeta sin barra con UTM', W + '/postulate?' + UTM, { status: 301, location: W + '/postulate/?' + UTM });
caso('/index.html -> /', W + '/index.html', { status: 301, location: W + '/' });
caso('/postulate/index.html -> /postulate/ con UTM', W + '/postulate/index.html?' + UTM, { status: 301, location: W + '/postulate/?' + UTM });
caso('páginas nuevas 200: diagnóstico', W + '/diagnostico-sin-cargo/', { status: 200, cuerpo: 'diagnostico-sin-cargo/index.html', cc: 'no-cache' });
caso('páginas nuevas 200: postulate', W + '/postulate/', { status: 200, cuerpo: 'postulate/index.html' });
caso('páginas nuevas 200: privacidad', W + '/privacidad/', { status: 200, cuerpo: 'privacidad/index.html' });
caso('páginas nuevas 200: gracias-reserva', W + '/gracias-reserva/', { status: 200, cuerpo: 'gracias-reserva/index.html' });

// Subdominios: nada de este archivo los toca
caso('subdominio servicios: portada', 'http://servicios.intellihelp.tech/', { status: 200, cuerpo: 'servicios/index.html', cc: null });
caso('subdominio servicios: empresas.html', 'https://servicios.intellihelp.tech/empresas.html', { status: 200, cuerpo: 'servicios/empresas.html' });
caso('subdominio servicios: home.html con UTM', 'https://servicios.intellihelp.tech/home.html?' + UTM, { status: 200, cuerpo: 'servicios/home.html' });
caso('subdominio servicios: css sin cabecera', 'https://servicios.intellihelp.tech/css/estilos.css', { status: 200, cc: null });
caso('subdominio servicios: inexistente -> 404 del sitio', 'https://servicios.intellihelp.tech/no-existe/', { status: 404, cuerpo: '/404.html' });
caso('subdominio desarrollo por http (sin forzar https)', 'http://desarrollo.intellihelp.tech/', { status: 200, cuerpo: 'desarrollo/index.php' });
caso('subdominio tickets', 'https://tickets.intellihelp.tech/', { status: 200 });
caso('subdominio tickets inexistente', 'https://tickets.intellihelp.tech/x/y', { status: 404, cuerpo: '/404.html' });
caso('subdominio: ruta que en www sería 301 (/blog)', 'https://desarrollo.intellihelp.tech/blog/', { status: 404, cuerpo: '/404.html' });

// Apps del host principal
for (const app of ['crm', 'crm-pruebas', 'Desarrollo', 'desarrollo', 'GLPI', 'inventario', 'remitos', 'tickets', 'demo', 'learning', 'learningtest', 'comprobantes', 'marketing', 'landing-page-OLD']) {
  caso('app /' + app + '/ sin www ni https queda igual', 'http://intellihelp.tech/' + app + '/', { status: 200 });
}
caso('CRM sin www por https (login con Google)', 'https://intellihelp.tech/crm/', { status: 200, cuerpo: 'app:crm' });
caso('CRM ruta interna la resuelve el CRM', 'https://intellihelp.tech/crm/clientes/12', { status: 200, cuerpo: 'app:crm' });
caso('app GLPI inexistente: 404 del sitio', W + '/GLPI/no-existe', { status: 404, cuerpo: '/404.html' });
caso('cgi-bin', W + '/cgi-bin/x', { status: 404, cuerpo: '/404.html' });
caso('wp-snapshots', W + '/wp-snapshots/x.zip', { status: 200, cc: null });
caso('app sin cabecera de caché', W + '/marketing/index.html', { status: 200, cc: null });

// /servicios/ en el host principal (con la carpeta física de la mini web)
caso('www /servicios/ (directorio) -> /#servicios', W + '/servicios/', { status: 301, location: W + '/#servicios' });
caso('www /servicios/ con UTM', W + '/servicios/?' + UTM, { status: 301, location: W + '/?' + UTM + '#servicios' });
caso('www /servicios sin barra', W + '/servicios', { status: 301, location: W + '/#servicios' });
caso('http sin www /servicios/ un salto', 'http://intellihelp.tech/servicios/', { status: 301, location: W + '/#servicios' });
for (const p of ['index', 'empresas', 'home']) {
  caso('www /servicios/' + p + '.html (existe) -> /#servicios', W + '/servicios/' + p + '.html', { status: 301, location: W + '/#servicios' });
  caso('www /servicios/' + p + '.html con UTM', W + '/servicios/' + p + '.html?' + UTM, { status: 301, location: W + '/?' + UTM + '#servicios' });
}
caso('www /servicios/css/estilos.css (archivo físico) se sirve', W + '/servicios/css/estilos.css', { status: 200, cuerpo: 'servicios/css/estilos.css', cc: null });
caso('www /servicios/img/logo.png (archivo físico) se sirve', W + '/servicios/img/logo.png', { status: 200 });
caso('www /servicios/outsourcing-it/ (no existe) -> /#servicios', W + '/servicios/outsourcing-it/', { status: 301, location: W + '/#servicios' });
caso('sin carpeta servicios: /servicios/', W + '/servicios/', { status: 301, location: W + '/#servicios' }, { fs: crearFS({ conServicios: false }) });
caso('sin carpeta servicios: /servicios/css/estilos.css', W + '/servicios/css/estilos.css', { status: 301, location: W + '/#servicios' }, { fs: crearFS({ conServicios: false }) });

// Blog y API
caso('/novedades/ intacto', W + '/novedades/', { status: 200, cuerpo: 'app:novedades' });
caso('/novedades/nota/ intacto', W + '/novedades/una-nota/', { status: 200, cuerpo: 'app:novedades' });
caso('/novedades/categoria/x/ con UTM intacto', W + '/novedades/categoria/x/?' + UTM, { status: 200, cuerpo: 'app:novedades' });
caso('/novedades/page/2/ intacto', W + '/novedades/page/2/', { status: 200 });
caso('/novedades sin barra: barra del servidor, sin 301 propio', W + '/novedades', { status: 301, location: W + '/novedades/' });
caso('/api/contact.php pasa', W + '/api/contact.php', { status: 200 });
caso('/api/agenda.php pasa por http sin redirigir (POST del formulario)', 'http://intellihelp.tech/api/agenda.php', { status: 200 });
caso('/api/_crm.php 403 (api/.htaccess)', W + '/api/_crm.php', { status: 403 });
caso('/blog -> /novedades/', W + '/blog', { status: 301, location: W + '/novedades/' });
caso('/blog/ -> /novedades/', W + '/blog/', { status: 301, location: W + '/novedades/' });
caso('/blog/ con UTM', W + '/blog/?' + UTM, { status: 301, location: W + '/novedades/?' + UTM });
caso('/blog/una-nota/ -> /novedades/una-nota/', W + '/blog/una-nota/', { status: 301, location: W + '/novedades/una-nota/' });
caso('/blog/una-nota/ con UTM', W + '/blog/una-nota/?' + UTM, { status: 301, location: W + '/novedades/una-nota/?' + UTM });
caso('http sin www /blog/x un salto', 'http://intellihelp.tech/blog/x/', { status: 301, location: W + '/novedades/x/' });
caso('/BLOG/ mayúsculas', W + '/BLOG/', { status: 301, location: W + '/novedades/' });

// 301 del sitio anterior
const R = [
  ['/servici0s/', '/#servicios'], ['/servici0s', '/#servicios'], ['/servicios-antigua/', '/#servicios'],
  ['/outsourcing/', '/#servicios'], ['/outsourcing-bancos/', '/#casos'],
  ['/webinar-claves-outsourcing-tecnologico-2022-yanina-brea/', '/#servicios'],
  ['/soluciones-antigua/', '/#soluciones'], ['/soluciones-v1-antigua/', '/#soluciones'],
  ['/control-de-accesos/', '/#soluciones'], ['/videoseguridad/', '/#soluciones'], ['/soluciones-cloud-huawei/', '/#soluciones'],
  ['/clientes-antigua/', '/#clientes'], ['/client-types/01/', '/#clientes'], ['/client-types/02/', '/#clientes'],
  ['/home-antigua/', '/'], ['/author/intelihelp/', '/'],
  ['/en/', '/'], ['/en', '/'], ['/en/contact-us/', '/'], ['/en/services/', '/'], ['/en/who-we-are-2/', '/'], ['/en/news/', '/'],
  ['/es/', '/'], ['/es', '/'], ['/es/contacto/', '/diagnostico-sin-cargo/'], ['/es/servicios/', '/#servicios'],
  ['/es/quienes-somos/', '/#quienes-somos'], ['/es/clientes/', '/#clientes'], ['/es/history/fundacion/', '/#historia'],
  ['/es/pagina-sin-equivalente/', '/'],
  ['/partners-y-vendors/', '/#socios'], ['/partners-and-vendors/', '/#socios'],
  ['/history/', '/#historia'], ['/history', '/#historia'], ['/history/primer-negocio/', '/#historia'], ['/history/fundacion/', '/#historia'],
  ['/busquedas/', '/postulate/'], ['/category/rrhh/', '/postulate/'], ['/universidades/', '/#casos'],
  ['/la-ciudad-buenos-aires-contara-una-red-fibra-optica-unica/', '/novedades/'],
  ['/la-ciudad-de-buenos-aires-contara-con-una-red-de-fibra-optica-propia-y-unica/', '/novedades/'],
  ['/claves-que-hay-que-tener-en-cuenta-en-las-evaluaciones-de-desempeno/', '/novedades/'],
  ['/news/', '/novedades/'],
  ['/trabaja-con-nosotros/', '/postulate/'], ['/nosotros/trabaja-con-nosotros/', '/postulate/'],
  ['/contacto/', '/diagnostico-sin-cargo/'], ['/contacto', '/diagnostico-sin-cargo/'], ['/diagnostico/', '/diagnostico-sin-cargo/'],
  ['/contact-us/', '/diagnostico-sin-cargo/'], ['/contacto-2/', '/diagnostico-sin-cargo/'],
  ['/soluciones/', '/#soluciones'], ['/soluciones/seguridad/', '/#soluciones'],
  ['/sectores/', '/#casos'], ['/sectores/seguros-y-bancos/', '/#casos'], ['/casos/', '/#casos'],
  ['/quienes-somos/', '/#quienes-somos'], ['/nosotros/', '/#quienes-somos'], ['/who-we-are/', '/#quienes-somos'],
  ['/clientes/', '/#clientes'], ['/clients/', '/#clientes'], ['/client/acme/', '/#clientes'], ['/download/caso-x.pdf', '/#clientes'],
  ['/preguntas-frecuentes/', '/#preguntas'],
  ['/analista-bi/', '/postulate/'], ['/developer-node-senior/', '/postulate/'], ['/desarrollador-php-sr/', '/postulate/'],
  ['/arquitecto-de-soluciones/', '/postulate/'], ['/dejanos-tu-cv/', '/postulate/'], ['/searches/', '/postulate/'], ['/rrhh/', '/postulate/'],
  ['/services/', '/#servicios'], ['/solutions/', '/#soluciones'], ['/universities/', '/#casos'],
  ['/home/', '/'], ['/home-2/', '/'], ['/category/novedades/', '/'], ['/author/otro/', '/'],
  ['/Outsourcing/', '/#servicios'], ['/VideoSeguridad', '/#soluciones'],
];
for (const [origen, destino] of R) {
  caso('301 ' + origen, W + origen, { status: 301, location: W + destino, unSalto: true });
  caso('301 ' + origen + ' con UTM', W + origen + '?' + UTM, { status: 301, location: conUtm(W + destino), unSalto: true });
}
for (const [origen, destino] of R.filter((_, i) => i % 6 === 0)) {
  caso('301 ' + origen + ' por http sin www (un salto)', 'http://intellihelp.tech' + origen, { status: 301, location: W + destino, unSalto: true });
}
caso('/?page_id=32 -> diagnóstico', W + '/?page_id=32', { status: 301, location: W + '/diagnostico-sin-cargo/', unSalto: true });
caso('/?page_id=32 con UTM (se descarta la consulta)', W + '/?page_id=32&' + UTM, { status: 301, location: W + '/diagnostico-sin-cargo/' });
caso('/?' + 'utm sin page_id: home 200', W + '/?' + UTM, { status: 200 });
caso('/?page_id=320 no es el contacto', W + '/?page_id=320', { status: 200 });
caso('http sin www /?page_id=32 un salto', 'http://intellihelp.tech/?page_id=32', { status: 301, location: W + '/diagnostico-sin-cargo/' });

// Archivos que se mantienen
caso('PDF de servicios 2019 accesible', W + '/wp-content/uploads/2019/07/ITH-servicios-digital.pdf', { status: 200, cc: 'public, max-age=86400' });
caso('verificación de Search Console', W + '/google9ffcbef7277c41a3.html', { status: 200, cuerpo: 'google9ffcbef7277c41a3.html' });
caso('robots.txt', W + '/robots.txt', { status: 200, cc: 'no-cache' });
caso('llms.txt', W + '/llms.txt', { status: 200, cc: 'no-cache' });
caso('sitemap.xml', W + '/sitemap.xml', { status: 200, cc: 'no-cache' });
caso('.well-known', W + '/.well-known/acme-challenge/token123', { status: 200 });
caso('.git oculto -> 403', W + '/.git/config', { status: 403 });
caso('.htaccess -> 403', W + '/.htaccess', { status: 403 });
caso('wp-admin viejo -> 410', W + '/wp-admin/', { status: 410 });
caso('wp-login.php -> 410', W + '/wp-login.php', { status: 410 });
caso('xmlrpc.php -> 410', W + '/xmlrpc.php', { status: 410 });
caso('wp-content inexistente -> 404 propio', W + '/wp-content/plugins/x/x.php', { status: 404, cuerpo: '/404.html' });
caso('carpeta sin index -> 403 (sin listado)', W + '/img/', { status: 403 });

// 404
caso('404 propio', W + '/no-existe/', { status: 404, cuerpo: '/404.html', robots: 'noindex, follow' });
caso('404 propio en subcarpeta', W + '/postulate/no-existe', { status: 404, cuerpo: '/404.html', robots: 'noindex, follow' });
caso('404 propio con consulta', W + '/no-existe/?' + UTM, { status: 404, cuerpo: '/404.html' });
caso('/404.html directo (noindex)', W + '/404.html', { status: 200, robots: 'noindex, follow' });

// Caché
caso('css sin versión: 1 hora', W + '/css/styles.css', { status: 200, cc: 'public, max-age=3600' });
caso('css con ?v=: 1 año', W + '/css/styles.css?v=20261108', { status: 200, cc: 'public, max-age=31536000, immutable' });
caso('js sin versión', W + '/js/main.js', { status: 200, cc: 'public, max-age=3600' });
caso('js con ?v= y otra consulta', W + '/js/main.js?x=1&v=3', { status: 200, cc: 'public, max-age=31536000, immutable' });
caso('js con ?version= no cuenta', W + '/js/main.js?version=3', { status: 200, cc: 'public, max-age=3600' });
caso('png sin versión: 30 días', W + '/img/logo-intellihelp.png', { status: 200, cc: 'public, max-age=2592000' });
caso('png con versión', W + '/img/logo-intellihelp.png?v=2', { status: 200, cc: 'public, max-age=31536000, immutable' });
caso('woff2 sin versión', W + '/fonts/saira-latin.woff2', { status: 200, cc: 'public, max-age=2592000' });
caso('woff2 con versión', W + '/fonts/saira-latin.woff2?v=1', { status: 200, cc: 'public, max-age=31536000, immutable' });
caso('png de clientes con guiones no se toma como hash', W + '/img/clientes/gemez-depositos-fiscales.png', { status: 200, cc: 'public, max-age=2592000' });
caso('asset con hash en /assets/', W + '/assets/index-Bx3k9_aQ.js', { status: 200, cc: 'public, max-age=31536000, immutable' });
caso('video', W + '/video/hero-placeholder.mp4', { status: 200, cc: 'public, max-age=2592000' });
caso('HTML de página', W + '/privacidad/', { status: 200, cc: 'no-cache' });
caso('/novedades/ sin cabeceras del sitio', W + '/novedades/', { status: 200, cc: null });

// ---------------------------------------------------------------------------------------------- ejecución
let ok = 0; const fallas = [];
for (const c of casos) {
  FS = c.opciones && c.opciones.fs ? c.opciones.fs : crearFS();
  const r = pedir(c.url, c.opciones || {});
  const e = c.esperado; const errores = [];
  if (r.status !== e.status) errores.push(`status ${r.status} (esperado ${e.status})`);
  if ('location' in e && r.location !== e.location) errores.push(`location ${r.location} (esperado ${e.location})`);
  if ('cuerpo' in e && r.cuerpo !== e.cuerpo) errores.push(`sirve ${r.cuerpo} (esperado ${e.cuerpo})`);
  if ('cc' in e && (r.headers['cache-control'] || null) !== e.cc) errores.push(`cache-control ${r.headers['cache-control']} (esperado ${e.cc})`);
  if ('robots' in e && r.headers['x-robots-tag'] !== e.robots) errores.push(`x-robots-tag ${r.headers['x-robots-tag']}`);
  if (r.location && r.location.includes('%23')) errores.push('el ancla quedó codificada como %23');
  if (r.location && /#[^?]*\?/.test(r.location)) errores.push('la consulta quedó después del ancla');
  if (e.unSalto && r.location) {
    // El destino (sin el ancla, que no viaja al servidor) tiene que responder 200: un solo salto, sin cadenas.
    const r2 = pedir(r.location.replace(/#.*$/, ''), {});
    if (r2.status !== 200) errores.push(`el destino responde ${r2.status} ${r2.location || ''}: más de un salto`);
  }
  if (errores.length) fallas.push(`FALLA  ${c.nombre}  [${c.url}]\n        ${errores.join('\n        ')}\n        regla: ${r.regla}`);
  else ok++;
}
FS = crearFS();
console.log(`Reglas leídas: ${conf.rules.length} RewriteRule, ${conf.setenv.length} SetEnvIf, ${conf.headers.length} Header, ${conf.ifs.length} ErrorDocument en <If>`);
console.log(fallas.join('\n'));
console.log(`\n${ok}/${casos.length} casos OK${fallas.length ? `, ${fallas.length} con falla` : ''}`);
process.exit(fallas.length ? 1 : 0);
