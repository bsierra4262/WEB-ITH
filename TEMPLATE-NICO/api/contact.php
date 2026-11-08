<?php
/**
 * Formulario de consulta de la home (#contact-form en #agenda; PHP 8, Hostinger).
 * Es lo que se ve sin JS y el respaldo de la agenda del CRM (api/agenda.php)
 * cuando el CRM no responde o no quedan horarios.
 *
 * - Solo acepta POST.
 * - Honeypot: si el campo oculto "website" viene completo, responde OK sin enviar.
 * - Valida en el servidor (requeridos, longitudes, mail) y no deja pasar saltos
 *   de línea a las cabeceras del mail.
 * - Límite simple por IP: RATE_MAX envíos cada RATE_WINDOW segundos.
 * - Respuesta: JSON {ok:true} / {ok:false,error} si el pedido viene del JS
 *   (Accept: application/json o X-Requested-With: fetch). Si no (formulario
 *   sin JS), redirige con 303 a la página de origen (campo oculto "origen")
 *   o muestra una página de error simple.
 *
 * - Canal de origen: campos ocultos opcionales (canal, utm_*, gclid, li_fat_id,
 *   referrer, landing) que completa el JS con la primera visita. Se limpian y
 *   recortan; si vienen vacíos o con otro formato se descartan sin dar error.
 *   Van al final del mail.
 *
 * - Consentimiento (Ley 25.326, art. 5): la casilla "acepto" es obligatoria.
 * - CRM: después del mail a info@ (que es lo que decide la respuesta) contesta
 *   al navegador, corta la conexión y manda la consulta firmada al CRM
 *   (POST api/v1/entrada, 5 s como máximo): queda el contacto, la empresa,
 *   una nota con el mensaje y la tarea "Responder consulta web", con la
 *   página y el canal de origen. Si el CRM no responde, la consulta queda en
 *   la cola de _crm.php (fuera del webroot) y entra con el próximo envío o
 *   con el cron. Sin configuración del CRM, solo sale el mail, como antes.
 *
 * No guarda secretos: usa mail() del hosting y la configuración del CRM vive
 * fuera del webroot (ver _crm.php). Si los mails caen en spam, revisar
 * SPF/DKIM del dominio en hPanel → Emails.
 */

declare(strict_types=1);

// Los avisos van al log del servidor, nunca a la respuesta (rompería el JSON).
ini_set('display_errors', '0');

// Texto de los campos, opciones de "¿Qué necesitás?", canal de origen,
// consentimiento y conexión con el CRM (compartido con agenda.php).
require __DIR__ . '/_crm.php';

// Configuración ---------------------------------------------------------------
const MAIL_TO = 'info@intellihelp.tech';
const MAIL_FROM = 'no-reply@intellihelp.tech';
const MAIL_FROM_NAME = 'Web Intellihelp';
// Las redirecciones vuelven a la página desde la que se envió (campo "origen",
// validado con origin_path()); si no llega, a la home. El ancla del envío
// correcto es el aviso de recibido (#contact-success): en una página HTML sin
// JS, el CSS lo muestra con :target (ver css/diagnostico.css). Con JS lo
// muestra js/agenda.js al ver ?enviado=1.
const REDIRECT_OK = '?enviado=1#contact-success';
const REDIRECT_BACK = '#agenda';
const RATE_MAX = 5;
const RATE_WINDOW = 600; // segundos


// Respuestas ------------------------------------------------------------------
/** Ruta de la página que envió el formulario: solo rutas internas simples. */
function origin_path(): string
{
    $value = $_POST['origen'] ?? '/';
    if (!is_string($value) || strlen($value) > 200 || !preg_match('#^/[a-z0-9/_.-]*$#', $value) || str_contains($value, '..') || str_starts_with($value, '//')) {
        return '/';
    }
    return $value;
}

function wants_json(): bool
{
    $accept = $_SERVER['HTTP_ACCEPT'] ?? '';
    $xrw = strtolower($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '');
    return str_contains($accept, 'application/json') || $xrw === 'fetch';
}

/**
 * Responde y termina. Con $seguir = true (solo para el envío correcto) corta
 * la conexión y deja que el script siga: el CRM se avisa sin hacer esperar
 * a la persona.
 */
function respond(bool $ok, int $status = 200, string $error = '', bool $seguir = false): void
{
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');

    if (wants_json()) {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        $body = $ok ? ['ok' => true] : ['ok' => false, 'error' => $error];
        echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        if ($ok && $seguir) {
            cerrar_conexion();
            return;
        }
        exit;
    }

    if ($ok) {
        header('Location: ' . origin_path() . REDIRECT_OK, true, 303);
        if ($seguir) {
            cerrar_conexion();
            return;
        }
        exit;
    }

    http_response_code($status);
    header('Content-Type: text/html; charset=utf-8');
    $msg = htmlspecialchars($error, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $mail = htmlspecialchars(MAIL_TO, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $back = htmlspecialchars(origin_path() . REDIRECT_BACK, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    echo <<<HTML
    <!doctype html>
    <html lang="es-AR">
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>No pudimos enviar tus datos | Intellihelp</title></head>
    <body style="margin:0;font-family:system-ui,sans-serif;background:#F0EBF5;color:#2A2A2A">
    <main style="max-width:560px;margin:15vh auto;padding:32px 24px;background:#FFFFFF;border-radius:16px">
    <h1 style="margin:0 0 12px;font-size:24px">No pudimos enviar tus datos</h1>
    <p style="margin:0 0 12px;line-height:1.6">{$msg}</p>
    <p style="margin:0 0 24px;line-height:1.6">También podés escribirnos a <a href="mailto:{$mail}" style="color:#663399">{$mail}</a>.</p>
    <p style="margin:0"><a href="{$back}" style="color:#663399;font-weight:600">← Volver al formulario</a></p>
    </main>
    </body>
    </html>
    HTML;
    exit;
}

// Pedido ----------------------------------------------------------------------
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    if (!wants_json()) {
        header('Location: ' . origin_path() . REDIRECT_BACK, true, 303);
        exit;
    }
    respond(false, 405, 'Método no permitido.');
}

// Solo se aceptan envíos desde el propio sitio (si el navegador manda Origin).
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && strtolower((string) parse_url($origin, PHP_URL_HOST)) !== strtolower(explode(':', $_SERVER['HTTP_HOST'] ?? '')[0])) {
    respond(false, 403, 'El envío no se pudo verificar. Recargá la página y probá de nuevo.');
}

// Honeypot: un bot completó el campo oculto. Se responde OK y no se envía nada.
if (single_line(input('website')) !== '') {
    respond(true);
}

[$persona, $error] = crm_persona_del_formulario();
if ($error !== '') {
    respond(false, 422, $error);
}
['nombre' => $nombre, 'empresa' => $empresa, 'mail' => $mail, 'telefono' => $telefono, 'mensaje' => $mensaje] = $persona;
$necesidad = $persona['necesidad'] !== '' ? $persona['necesidad'] : NECESIDAD_VACIA;
$origen = origin_path();

// Consentimiento expreso (Ley 25.326, art. 5): la casilla no viene marcada.
if (!crm_acepto()) {
    respond(false, 422, 'Para enviar la consulta, aceptá el uso de tus datos.');
}

// La IP solo se usa para el límite de envíos (queda un HMAC con sal, en una
// carpeta privada, y se borra al día: ver limite_ip()) y, como HMAC con la sal
// de la web, para el límite del CRM. No va en el mail.
// REMOTE_ADDR y nunca X-Forwarded-For ni Client-IP, que los escribe el que
// hace el pedido. En este hosting el CDN deja en REMOTE_ADDR la IP del
// visitante (comprobado con cabeceras inventadas: se agregan a
// X-Forwarded-For pero REMOTE_ADDR sigue siendo la real).
$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
if (limite_ip('contact', $ip, RATE_MAX, RATE_WINDOW)) {
    respond(false, 429, 'Recibimos varios envíos seguidos desde tu conexión. Esperá unos minutos y probá de nuevo.');
}

$canal = crm_origen($_POST);

// Mail ------------------------------------------------------------------------
$subject = 'Nueva solicitud de reunión — ' . $empresa;
$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
$fromName = '=?UTF-8?B?' . base64_encode(MAIL_FROM_NAME) . '?=';

$lines = [
    'Nueva solicitud de reunión desde www.intellihelp.tech',
    '',
    'Nombre y apellido: ' . $nombre,
    'Empresa: ' . $empresa,
    'Mail laboral: ' . $mail,
    'Teléfono: ' . ($telefono !== '' ? $telefono : '(no lo dejó)'),
    '¿Qué necesita?: ' . $necesidad,
    'Página: https://www.intellihelp.tech' . $origen,
    '',
    'Mensaje:',
    $mensaje !== '' ? $mensaje : '(sin mensaje)',
    '',
    '--',
    'Enviado: ' . (new DateTimeImmutable('now', new DateTimeZone(CRM_ZONA)))->format('d/m/Y H:i'),
    'Respondé este mail para contestarle directamente.',
    '',
    'Cómo llegó al sitio (primera visita):',
    ...crm_origen_lineas($canal),
];
$body = implode("\r\n", $lines);

$headers = [
    'From' => $fromName . ' <' . MAIL_FROM . '>',
    'Reply-To' => $mail,
    'MIME-Version' => '1.0',
    'Content-Type' => 'text/plain; charset=UTF-8',
    'Content-Transfer-Encoding' => '8bit',
    'X-Mailer' => 'intellihelp-web',
];

$sent = @mail(MAIL_TO, $encodedSubject, $body, $headers, '-f' . MAIL_FROM);

if (!$sent) {
    error_log('[contact.php] mail() devolvió false');
    respond(false, 500, 'No pudimos enviar tus datos en este momento. Probá de nuevo en unos minutos.');
}

respond(true, 200, '', true);

// CRM -------------------------------------------------------------------------
// La persona ya tiene su respuesta: lo que sigue no la hace esperar. Si el CRM
// no está configurado, la consulta queda solo en el mail, como antes.
$cfg = crm_config();
if ($cfg === null) {
    exit;
}

$version = single_line(input('consentimiento_version'));
if ($version === '' || crm_consentimiento($version) === null) {
    $version = CRM_CONSENTIMIENTO_VIGENTE;
}
$ipHash = crm_ip_hash($ip, $cfg);
$idem = crm_idem(single_line(input('idem')), $ipHash);
$consentimiento = crm_consentimiento($version, crm_fecha_consentimiento($cfg, $idem));
$cuerpo = [
    'persona' => crm_persona($persona),
    'consentimiento' => $consentimiento,
    'novedades' => false,
    'origen' => $canal,
];

$r = crm_pedir($cfg, 'POST', 'entrada', $cuerpo, $idem, $ipHash, $cfg['timeout']);
if ($r['status'] === 200 || $r['status'] === 201) {
    crm_reenviar_pendientes($cfg, 3);
    exit;
}

// Sin datos personales en el log: solo el código y el comienzo de la idempotencia.
error_log('[contact.php] CRM entrada ' . substr($idem, 0, 16) . ': ' . $r['status'] . ' '
    . (string) ($r['json']['error'] ?? $r['error'] ?? ''));
if (crm_reintentable($r)) {
    crm_encolar($cfg, 'entrada', $cuerpo, $idem, $ipHash);
}
