// En desarrollo Vite no ejecuta PHP. Este plugin cubre /api/*.php:
//
// - Con la variable ITH_PHP_URL (por ejemplo http://127.0.0.1:8099) reenvía
//   /api/contact.php y /api/agenda.php a un PHP local que sirve public/:
//     php -d extension=curl -d extension=openssl -S 127.0.0.1:8099 -t public
//   (en esta máquina, además, -d extension_dir=<carpeta ext de PHP> y
//   -d curl.cainfo=<ca-bundle.crt>). Así se prueba de punta a punta contra el
//   CRM de pruebas con config/crm.local.php.
// - Sin la variable, los simula:
//   /api/contact.php responde OK y muestra el envío en la consola.
//   /api/agenda.php da horarios inventados (lunes a viernes de 9 a 18, cada
//   30 minutos, algunos ocupados) y acepta la reserva. Un horario reservado
//   deja de ofrecerse y, si se lo vuelve a pedir, responde horario_tomado,
//   como el CRM. Con ITH_AGENDA_MOCK=caida responde 503 (la landing vuelve al
//   formulario de siempre).
// En producción responden los PHP de public/api/.
import { request as httpRequest } from 'node:http';

const ZONA = -3 * 3600; // Argentina, sin horario de verano
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

const reservados = new Set();

function json(res, status, body, demora = 0) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  setTimeout(() => res.end(JSON.stringify(body)), demora);
}

function leerCuerpo(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => resolve(body));
  });
}

/** Campos de un multipart/form-data o urlencoded (lo que manda FormData). */
function campos(body, tipo = '') {
  const out = {};
  const limite = /boundary=(?:"([^"]+)"|([^;]+))/i.exec(tipo);
  if (limite) {
    for (const parte of body.split(`--${limite[1] || limite[2]}`)) {
      const m = /name="([^"]+)"\r?\n\r?\n([\s\S]*?)\r?\n?$/.exec(parte.replace(/\r?\n--$/, ''));
      if (m) out[m[1]] = m[2].replace(/\r?\n$/, '');
    }
    return out;
  }
  return Object.fromEntries(new URLSearchParams(body));
}

const pad = (n) => String(n).padStart(2, '0');
const local = (ts) => new Date((ts + ZONA) * 1000); // se lee con getUTC*

function cuando(ts) {
  const d = local(ts);
  return `${DIAS[d.getUTCDay()]} ${d.getUTCDate()} de ${MESES[d.getUTCMonth()]} a las ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())} h`;
}

/** Horarios inventados para los próximos 21 días, con algunos ocupados. */
function horarios() {
  const ahora = Math.floor(Date.now() / 1000);
  const hoy = local(ahora);
  const base = Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth(), hoy.getUTCDate()) / 1000 - ZONA;
  const dias = [];
  for (let i = 0; i <= 20; i++) {
    const inicioDia = base + i * 86400;
    const d = local(inicioDia);
    if (d.getUTCDay() === 0 || d.getUTCDay() === 6) continue;
    const lista = [];
    for (let m = 9 * 60; m < 18 * 60; m += 30) {
      const ts = inicioDia + m * 60;
      // Ocupados "de Carlos": un patrón fijo para que la grilla no sea perfecta.
      if (ts < ahora + 2 * 3600 || (i * 7 + m / 30) % 5 === 0 || reservados.has(ts)) continue;
      lista.push({ ts, hora: `${pad(Math.floor(m / 60))}:${pad(m % 60)}` });
    }
    if (lista.length) {
      dias.push({ fecha: `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`, horarios: lista });
    }
  }
  return dias;
}

function reenviar(base, req, res) {
  const destino = new URL(req.originalUrl ?? req.url, base);
  const proxy = httpRequest(
    destino,
    { method: req.method, headers: { ...req.headers, host: destino.host } },
    (r) => {
      res.writeHead(r.statusCode ?? 502, r.headers);
      r.pipe(res);
    },
  );
  proxy.on('error', () => json(res, 502, { ok: false, error: 'sin_agenda', mensaje: `No responde el PHP local (${base}).` }));
  req.pipe(proxy);
}

export default function contactMock() {
  return {
    name: 'ith-contact-mock',
    apply: 'serve',
    configureServer(server) {
      const php = process.env.ITH_PHP_URL;
      if (php) {
        server.middlewares.use((req, res, next) => {
          if (/^\/api\/[a-z]+\.php(\?|$)/.test(req.url ?? '')) return reenviar(php, req, res);
          next();
        });
        return;
      }

      server.middlewares.use('/api/contact.php', async (req, res) => {
        if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'Método no permitido' });
        const body = await leerCuerpo(req);
        console.log('\n[contact-mock] formulario recibido:\n', campos(body, req.headers['content-type']), '\n');
        json(res, 200, { ok: true }, 600);
      });

      server.middlewares.use('/api/agenda.php', async (req, res) => {
        if (process.env.ITH_AGENDA_MOCK === 'caida') {
          return json(res, 503, { ok: false, error: 'sin_agenda', mensaje: 'No pudimos consultar la agenda en este momento.' }, 400);
        }
        if (req.method === 'GET') {
          const formToken = `${Math.floor(Date.now() / 1000)}.mock`;
          return json(res, 200, { ok: true, zona: 'America/Argentina/Buenos_Aires', duracion_min: 30, con_meet: true, form_token: formToken, dias: horarios() }, 500);
        }
        if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'metodo_no_permitido', mensaje: 'Método no permitido.' });

        const d = campos(await leerCuerpo(req), req.headers['content-type']);
        console.log('\n[agenda-mock] reserva recibida:\n', d, '\n');
        const ts = Number(d.inicio);
        // Como el servidor: la reserva trae el token que vino con los horarios.
        if (!/^\d+\.mock$/.test(d.form_token ?? '')) {
          return json(res, 409, { ok: false, error: 'recargar_horarios', mensaje: 'Los horarios se actualizaron. Elegí el horario de nuevo, por favor.' }, 400);
        }
        if (d.acepto !== '1') {
          const msg = 'Para agendar la reunión, aceptá el uso de tus datos.';
          return json(res, 422, { ok: false, error: 'falta_consentimiento', mensaje: msg, campos: { acepto: msg } }, 400);
        }
        if (!horarios().some((dia) => dia.horarios.some((h) => h.ts === ts))) {
          return json(res, 409, { ok: false, error: 'horario_tomado', mensaje: 'Justo tomaron ese horario. Elegí otro, por favor.' }, 600);
        }
        reservados.add(ts);
        json(res, 201, { ok: true, inicio: ts, cuando: cuando(ts) }, 900);
      });
    },
  };
}
