<?php
/**
 * Agenda de la home (#agenda, js/agenda.js; PHP 8, Hostinger): horarios
 * libres y reserva de la reunión de diagnóstico, contra la agenda del CRM.
 *
 * El navegador solo conoce este archivo (mismo origen, sin claves). Acá se
 * firma cada pedido con la clave de la web y se habla con el CRM servidor a
 * servidor (_crm.php). Contrato: CRM, md/INTEGRACION-WEB.md §5 y §9.3.
 *
 * GET ?tipo=&vendedor=&desde=Y-m-d&hasta=Y-m-d
 *   Horarios libres del vendedor (Google Calendar + reservas del CRM, con el
 *   margen entre reuniones). El par vendedor/tipo tiene que estar en la
 *   configuración: lo que manda el navegador no se usa sin comprobarlo.
 *   Al CRM se le pide siempre la misma ventana (hoy + RANGO_DEFECTO días) y
 *   el rango del navegador se recorta acá: así hay una sola entrada de caché
 *   por vendedor y tipo (60 s), y variar las fechas no sirve para mandar cada
 *   pedido al CRM y de ahí a Google. Si el CRM no responde o corta por
 *   límite, se sirve la última respuesta buena de menos de 5 minutos.
 *   Límite: 60 consultas por IP cada 10 minutos.
 *   200 {ok, zona, duracion_min, con_meet, form_token, dias:[{fecha, horarios:[{ts, hora}]}]}
 *   503 {ok:false, error:"sin_agenda"} si el CRM no responde o no pudo leer el
 *   calendario: la página deja el formulario de siempre.
 *
 * POST (reserva): los campos del formulario de siempre (nombre, empresa, mail,
 *   telefono, necesidad, mensaje), más inicio (segundos Unix), tipo, vendedor,
 *   acepto (casilla de consentimiento), consentimiento_version, idem (lo genera
 *   el navegador una vez por envío), form_token (el que vino con los
 *   horarios: firmado, de al menos 3 s, para una sola reserva), website
 *   (honeypot) y los ocultos de origen.
 *   Límite: 3 reservas por IP (o red /64) cada 10 minutos.
 *   201 {ok, inicio, cuando} · 202 confirmando · 409 horario_tomado |
 *   en_proceso · 422 · 429 · 503 sin_agenda. Si el CRM no responde, se
 *   reintenta una vez con la misma clave de idempotencia (no duplica nada);
 *   si sigue sin respuesta, 202 «estamos confirmando, revisá tu correo»: la
 *   reserva pudo haber entrado y no se puede ofrecer el formulario como si
 *   no. La reserva NO se encola: un horario no se confirma a ciegas.
 *   Además manda el aviso a info@ con el día y la hora, como el formulario.
 *
 * La confirmación al invitado (mail con la invitación y el enlace de Meet,
 * recordatorio 24 h antes) la manda el CRM, no la web.
 */

declare(strict_types=1);

// Los avisos van al log del servidor, nunca a la respuesta (rompería el JSON).
ini_set('display_errors', '0');

require __DIR__ . '/_crm.php';

const MAIL_TO = 'info@intellihelp.tech';
const MAIL_FROM = 'no-reply@intellihelp.tech';
const MAIL_FROM_NAME = 'Web Intellihelp';
const CACHE_SEG = 60;
const CACHE_RESPALDO_SEG = 300; // si el CRM no responde, la última respuesta buena sirve hasta 5 min
const RANGO_DIAS = 30;      // hasta 31 días por consulta, como el CRM
const RANGO_DEFECTO = 20;   // la ventana del tipo de reunión es de 21 días
const AVISO_SIN_AGENDA = 'No pudimos consultar la agenda en este momento.';

const DIAS_SEMANA = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

// Respuestas ------------------------------------------------------------------

function enviar_json(int $status, array $body): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

function responder(int $status, array $body): never
{
    enviar_json($status, $body);
    exit;
}

function fallar(int $status, string $error, string $mensaje, array $extra = []): never
{
    responder($status, ['ok' => false, 'error' => $error, 'mensaje' => $mensaje] + $extra);
}

function zona(): DateTimeZone
{
    return new DateTimeZone(CRM_ZONA);
}

/** "martes 3 de noviembre a las 09:30 h" (hora de Argentina). */
function cuando(int $ts): string
{
    $d = (new DateTimeImmutable('@' . $ts))->setTimezone(zona());
    return DIAS_SEMANA[(int) $d->format('w')] . ' ' . $d->format('j') . ' de '
        . MESES[(int) $d->format('n') - 1] . ' a las ' . $d->format('H:i') . ' h';
}

/** Fecha Y-m-d válida o null. */
function fecha(string $valor): ?DateTimeImmutable
{
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $valor)) {
        return null;
    }
    $d = DateTimeImmutable::createFromFormat('!Y-m-d', $valor, zona());
    return $d && $d->format('Y-m-d') === $valor ? $d : null;
}

/** El par vendedor/tipo pedido, si la configuración lo permite. */
function tipo_permitido(array $cfg, string $tipo, string $vendedor): ?array
{
    $permitidos = array_values(array_filter($cfg['tipos'], 'is_string'));
    if ($tipo === '' && $vendedor === '' && $permitidos !== []) {
        [$vendedor, $tipo] = array_pad(explode('/', $permitidos[0], 2), 2, '');
    }
    if (!preg_match('/^[a-z0-9-]{1,60}$/', $tipo) || !preg_match('/^[a-z0-9._-]{1,64}$/', $vendedor)) {
        return null;
    }
    return in_array($vendedor . '/' . $tipo, $permitidos, true) ? [$vendedor, $tipo] : null;
}

/** Borra la caché de horarios (después de una reserva o de un choque). */
function limpiar_cache(array $cfg): void
{
    foreach (glob(rtrim($cfg['cache'], '/\\') . DIRECTORY_SEPARATOR . 'h-*.json') ?: [] as $file) {
        @unlink($file);
    }
}

// Pedido ----------------------------------------------------------------------

$metodo = $_SERVER['REQUEST_METHOD'] ?? '';
if ($metodo !== 'GET' && $metodo !== 'POST') {
    header('Allow: GET, POST');
    fallar(405, 'metodo_no_permitido', 'Método no permitido.');
}

// Solo se aceptan pedidos desde el propio sitio (si el navegador manda Origin).
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && strtolower((string) parse_url($origin, PHP_URL_HOST)) !== strtolower(explode(':', $_SERVER['HTTP_HOST'] ?? '')[0])) {
    fallar(403, 'origen', 'El envío no se pudo verificar. Recargá la página y probá de nuevo.');
}

$cfg = crm_config();
if ($cfg === null) {
    fallar(503, 'sin_agenda', AVISO_SIN_AGENDA);
}

// REMOTE_ADDR y nunca X-Forwarded-For ni Client-IP, que los escribe el que
// hace el pedido. En este hosting el CDN deja en REMOTE_ADDR la IP del
// visitante (comprobado con cabeceras inventadas: se agregan a
// X-Forwarded-For pero REMOTE_ADDR sigue siendo la real).
$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$cache = crm_carpeta($cfg['cache']);

// GET: horarios libres ----------------------------------------------------------

if ($metodo === 'GET') {
    $par = tipo_permitido($cfg, (string) ($_GET['tipo'] ?? ''), (string) ($_GET['vendedor'] ?? ''));
    if ($par === null) {
        fallar(400, 'parametros_invalidos', 'El tipo de reunión no es válido.');
    }
    [$vendedor, $tipo] = $par;

    $hoy = new DateTimeImmutable('today', zona());
    $desdeTxt = (string) ($_GET['desde'] ?? '');
    $hastaTxt = (string) ($_GET['hasta'] ?? '');
    $desde = $desdeTxt === '' ? $hoy : fecha($desdeTxt);
    $hasta = $hastaTxt === '' ? null : fecha($hastaTxt);
    if ($desde === null || ($hastaTxt !== '' && $hasta === null)) {
        fallar(400, 'parametros_invalidos', 'Las fechas tienen que tener la forma AAAA-MM-DD.');
    }
    if ($desde < $hoy) {
        $desde = $hoy;
    }
    $hasta ??= $desde->modify('+' . RANGO_DEFECTO . ' days');
    if ($hasta < $desde) {
        fallar(400, 'parametros_invalidos', 'El rango de fechas está invertido.');
    }
    if ($hasta > $desde->modify('+' . RANGO_DIAS . ' days')) {
        $hasta = $desde->modify('+' . RANGO_DIAS . ' days');
    }

    if (limite_ip('agenda-h', $ip, 60, 600, $cache)) {
        header('Retry-After: 600');
        fallar(429, 'demasiados_pedidos', 'Recibimos muchas consultas seguidas desde tu conexión. Esperá unos minutos y probá de nuevo.');
    }

    // Una sola consulta al CRM por vendedor y tipo: la ventana fija, desde hoy.
    $ventanaDesde = $hoy;
    $ventanaHasta = $hoy->modify('+' . RANGO_DEFECTO . ' days');
    $clave = hash('sha256', $vendedor . '|' . $tipo . '|' . $ventanaDesde->format('Y-m-d'));
    $archivo = $cache !== null ? $cache . DIRECTORY_SEPARATOR . 'h-' . $clave . '.json' : null;

    /** La respuesta para el navegador: el rango pedido, sin horarios pasados, con su token. */
    $servir = static function (array $guardado) use ($cfg, $desde, $hasta): never {
        $limite = time() + 60;
        $dias = [];
        foreach ($guardado['dias'] as $dia) {
            if ($dia['fecha'] < $desde->format('Y-m-d') || $dia['fecha'] > $hasta->format('Y-m-d')) {
                continue;
            }
            // Un horario que pasó mientras estaba en la caché ya no se ofrece.
            $horarios = array_values(array_filter($dia['horarios'], static fn ($h) => $h['ts'] > $limite));
            if ($horarios !== []) {
                $dias[] = ['fecha' => $dia['fecha'], 'horarios' => $horarios];
            }
        }
        $guardado['dias'] = $dias;
        $guardado['form_token'] = crm_form_token($cfg);
        responder(200, $guardado);
    };
    $leerCache = static function (int $edadMax) use ($archivo): ?array {
        if ($archivo === null || !is_file($archivo) || filemtime($archivo) <= time() - $edadMax) {
            return null;
        }
        $guardado = json_decode((string) @file_get_contents($archivo), true);
        return is_array($guardado) && ($guardado['ok'] ?? false) === true && is_array($guardado['dias'] ?? null) ? $guardado : null;
    };

    $guardado = $leerCache(CACHE_SEG);
    if ($guardado !== null) {
        $servir($guardado);
    }

    $consulta = http_build_query([
        'tipo' => $tipo,
        'vendedor' => $vendedor,
        'desde' => $ventanaDesde->format('Y-m-d'),
        'hasta' => $ventanaHasta->format('Y-m-d'),
    ], '', '&', PHP_QUERY_RFC3986);
    $r = crm_pedir($cfg, 'GET', 'disponibilidad?' . $consulta, null, null, null, $cfg['timeout']);

    if ($r['status'] !== 200 || ($r['json']['ok'] ?? false) !== true || !is_array($r['json']['dias'] ?? null)) {
        error_log('[agenda.php] disponibilidad: ' . $r['status'] . ' ' . ($r['json']['error'] ?? $r['error'] ?? ''));
        // El CRM cortó por límite o no responde: la última respuesta buena
        // todavía sirve un rato. La reserva igual se verifica en el CRM.
        $respaldo = $leerCache(CACHE_RESPALDO_SEG);
        if ($respaldo !== null) {
            $servir($respaldo);
        }
        fallar(503, 'sin_agenda', AVISO_SIN_AGENDA);
    }

    $dias = [];
    foreach ($r['json']['dias'] as $dia) {
        if (!is_array($dia) || !is_string($dia['fecha'] ?? null) || fecha($dia['fecha']) === null) {
            continue;
        }
        $horarios = [];
        foreach ((array) ($dia['horarios'] ?? []) as $h) {
            $ts = is_array($h) ? (int) ($h['ts'] ?? 0) : 0;
            if ($ts > time()) {
                $horarios[] = ['ts' => $ts, 'hora' => (new DateTimeImmutable('@' . $ts))->setTimezone(zona())->format('H:i')];
            }
        }
        if ($horarios !== []) {
            $dias[] = ['fecha' => $dia['fecha'], 'horarios' => $horarios];
        }
    }

    $tipoCrm = is_array($r['json']['tipo'] ?? null) ? $r['json']['tipo'] : [];
    $respuesta = [
        'ok' => true,
        'zona' => CRM_ZONA,
        'tipo' => $tipo,
        'vendedor' => $vendedor,
        'duracion_min' => max(5, (int) ($tipoCrm['duracion_min'] ?? 30)),
        'con_meet' => (bool) ($tipoCrm['con_meet'] ?? true),
        'dias' => $dias,
    ];
    if ($archivo !== null) {
        @file_put_contents($archivo, json_encode($respuesta, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), LOCK_EX);
        @chmod($archivo, 0600);
    }
    $servir($respuesta);
}

// POST: reserva -------------------------------------------------------------------

$inicioTxt = single_line(input('inicio'));
$inicio = ctype_digit($inicioTxt) ? (int) $inicioTxt : 0;

// Honeypot: un bot completó el campo oculto. Se responde como si hubiera
// salido bien y no se reserva nada.
if (single_line(input('website')) !== '') {
    responder(201, ['ok' => true, 'inicio' => $inicio, 'cuando' => $inicio > 0 ? cuando($inicio) : '']);
}

[$persona, $error, $campo] = crm_persona_del_formulario();
if ($error !== '') {
    fallar(422, 'datos_invalidos', $error, $campo !== '' ? ['campos' => [$campo => $error]] : []);
}

if (!crm_acepto()) {
    $aviso = 'Para agendar la reunión, aceptá el uso de tus datos.';
    fallar(422, 'falta_consentimiento', $aviso, ['campos' => ['acepto' => $aviso]]);
}
$version = single_line(input('consentimiento_version'));
$version = $version !== '' ? $version : CRM_CONSENTIMIENTO_VIGENTE;
if (crm_consentimiento($version) === null) {
    fallar(422, 'falta_consentimiento', 'El texto del formulario cambió. Recargá la página y probá de nuevo.');
}

if ($inicio < time() || $inicio > time() + 62 * 86400) {
    fallar(422, 'datos_invalidos', 'Elegí un día y un horario de la lista.', ['campos' => ['inicio' => 'Elegí un horario.']]);
}

$par = tipo_permitido($cfg, single_line(input('tipo')), single_line(input('vendedor')));
if ($par === null) {
    fallar(422, 'datos_invalidos', 'El tipo de reunión no es válido. Recargá la página y probá de nuevo.');
}
[$vendedor, $tipo] = $par;

if (limite_ip('agenda-r', $ip, 3, 600, $cache)) {
    header('Retry-After: 600');
    fallar(429, 'demasiados_pedidos', 'Recibimos varias reservas seguidas desde tu conexión. Esperá unos minutos y probá de nuevo.');
}

$ipHash = crm_ip_hash($ip, $cfg);
$idem = crm_idem(single_line(input('idem')), $ipHash);

// El token que vino con los horarios: la reserva se hace desde esta página,
// después de ver los horarios, y no a los dos segundos. Un vencido o usado
// vuelve a pedir horarios (que traen uno nuevo).
$motivoToken = null;
if (!crm_form_token_valido($cfg, single_line(input('form_token')), $idem, $motivoToken)) {
    fallar(409, 'recargar_horarios', $motivoToken === 'rapido'
        ? 'Confirmaste antes de que termináramos de cargar. Revisá el horario y confirmá de nuevo.'
        : 'Los horarios se actualizaron. Elegí el horario de nuevo, por favor.');
}
$origen = crm_origen($_POST);
$consentimiento = crm_consentimiento($version, crm_fecha_consentimiento($cfg, $idem));

$cuerpo = [
    'tipo' => $tipo,
    'vendedor' => $vendedor,
    'inicio' => $inicio,
    'persona' => crm_persona($persona),
    'consentimiento' => $consentimiento,
    'novedades' => false,
    'origen' => $origen,
];
$r = crm_pedir($cfg, 'POST', 'reserva', $cuerpo, $idem, $ipHash, $cfg['timeout_reserva']);
if ($r['status'] === 0) {
    // Sin respuesta: el CRM pudo haber reservado igual. Se pregunta otra vez
    // con la misma clave de idempotencia; si ya estaba, contesta «repetida»
    // con la misma reserva, y si no, la toma ahora.
    $r = crm_pedir($cfg, 'POST', 'reserva', $cuerpo, $idem, $ipHash, $cfg['timeout_reserva']);
}
$err = (string) ($r['json']['error'] ?? '');

if ($r['status'] === 0) {
    // Dos veces sin respuesta: no se sabe si quedó. Ofrecer el formulario
    // como si no hubiera pasado nada terminaba en una consulta duplicada y una
    // invitación que la persona no esperaba. Si entró, le llega el mail.
    error_log('[agenda.php] reserva ' . substr($idem, 0, 16) . ': sin respuesta del CRM en dos intentos');
    responder(202, ['ok' => false, 'error' => 'confirmando',
        'mensaje' => 'Estamos confirmando tu reunión. Revisá tu correo en unos minutos: si quedó agendada, '
            . 'te llega la invitación. Si no te llega, escribinos a ' . MAIL_TO . ' y la coordinamos.']);
}
if ($r['status'] === 429 && $err === 'limite_reservas') {
    // Tope por correo o del día en el CRM: el mensaje es para la persona, y
    // la página le deja el formulario de siempre.
    fallar(429, 'limite', (string) ($r['json']['mensaje'] ?? 'En este momento no podemos tomar más reservas por acá.'));
}
if ($r['status'] === 409 && $err === 'horario_tomado') {
    limpiar_cache($cfg);
    fallar(409, 'horario_tomado', 'Justo tomaron ese horario. Elegí otro, por favor.');
}
if ($r['status'] === 409 && $err === 'en_proceso') {
    fallar(409, 'en_proceso', 'Estamos confirmando tu reunión.');
}
if ($r['status'] === 409 && $err === 'idempotencia_reusada') {
    // La misma clave con otros datos: el navegador genera otra y vuelve a mandar.
    fallar(409, 'reintentar', 'Volvé a confirmar la reunión, por favor.');
}
if ($r['status'] === 422) {
    // Los nombres de los campos del CRM pasan a los del formulario.
    $nombres = ['email' => 'mail', 'servicio' => 'necesidad', 'consentimiento' => 'acepto'];
    $campos = [];
    foreach ((array) ($r['json']['campos'] ?? []) as $k => $v) {
        $k = (string) $k;
        $campos[$nombres[$k] ?? $k] = is_string($v) ? $v : 'Revisá este dato.';
    }
    error_log('[agenda.php] reserva rechazada por el CRM: 422 ' . implode(',', array_keys($campos)));
    fallar(422, $err === 'falta_consentimiento' ? 'falta_consentimiento' : 'datos_invalidos',
        'Revisá los datos marcados.', ['campos' => $campos]);
}
if ($r['status'] === 429) {
    fallar(429, 'demasiados_pedidos', 'Recibimos varias reservas seguidas desde tu conexión. Probá de nuevo más tarde.');
}
if (!in_array($r['status'], [200, 201], true) || ($r['json']['ok'] ?? false) !== true) {
    // Sin datos personales en el log: solo el código y el comienzo de la idempotencia.
    error_log('[agenda.php] reserva ' . substr($idem, 0, 16) . ': ' . $r['status'] . ' ' . ($err !== '' ? $err : (string) $r['error']));
    fallar(503, 'sin_agenda', 'No pudimos confirmar la reunión en este momento.');
}

// Reservada. El inicio que vale es el que confirmó el CRM.
$confirmado = $inicio;
$inicioCrm = $r['json']['reserva']['inicio'] ?? null;
if (is_string($inicioCrm)) {
    try {
        $confirmado = (new DateTimeImmutable($inicioCrm))->getTimestamp();
    } catch (Throwable) {
        // queda el pedido
    }
}
$repetida = ($r['json']['repetida'] ?? false) === true;

enviar_json(201, ['ok' => true, 'inicio' => $confirmado, 'cuando' => cuando($confirmado)]);
cerrar_conexion();

limpiar_cache($cfg);
if ($repetida) {
    exit; // el aviso a info@ ya salió con el primer pedido
}

// Aviso a info@ -----------------------------------------------------------------
$subject = 'Reunión agendada — ' . $persona['empresa'];
$lines = [
    'Nueva reunión de diagnóstico agendada desde www.intellihelp.tech',
    '',
    'Día y hora: ' . cuando($confirmado) . ' (hora de Argentina)',
    'Nombre y apellido: ' . $persona['nombre'],
    'Empresa: ' . $persona['empresa'],
    'Mail laboral: ' . $persona['mail'],
    'Teléfono: ' . ($persona['telefono'] !== '' ? $persona['telefono'] : '(no lo dejó)'),
    '¿Qué necesita?: ' . ($persona['necesidad'] !== '' ? $persona['necesidad'] : NECESIDAD_VACIA),
    'Página: https://www.intellihelp.tech' . ($origen['pagina'] !== '' ? $origen['pagina'] : '/'),
    '',
    'Mensaje:',
    $persona['mensaje'] !== '' ? $persona['mensaje'] : '(sin mensaje)',
    '',
    '--',
    'Enviado: ' . (new DateTimeImmutable('now', zona()))->format('d/m/Y H:i'),
    'La reunión, el contacto y la empresa quedaron registrados en el CRM. La invitación con el enlace de Meet la envía el CRM.',
    '',
    'Cómo llegó al sitio (primera visita):',
    ...crm_origen_lineas($origen),
];
$headers = [
    'From' => '=?UTF-8?B?' . base64_encode(MAIL_FROM_NAME) . '?= <' . MAIL_FROM . '>',
    'Reply-To' => $persona['mail'],
    'MIME-Version' => '1.0',
    'Content-Type' => 'text/plain; charset=UTF-8',
    'Content-Transfer-Encoding' => '8bit',
    'X-Mailer' => 'intellihelp-web',
];
if (!@mail(MAIL_TO, '=?UTF-8?B?' . base64_encode($subject) . '?=', implode("\r\n", $lines), $headers, '-f' . MAIL_FROM)) {
    error_log('[agenda.php] mail() devolvió false (reserva ' . substr($idem, 0, 16) . ')');
}

// Aprovecha que el CRM respondió para mandar consultas que quedaron en la cola.
crm_reenviar_pendientes($cfg, 3);
