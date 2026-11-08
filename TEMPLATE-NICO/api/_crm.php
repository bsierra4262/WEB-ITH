<?php
/**
 * Conexión de la web con el CRM de Intellihelp (agenda y consultas).
 *
 * Biblioteca de api/agenda.php y api/contact.php: no responde por
 * HTTP (si se la pide directo devuelve 404, y además .htaccess niega /api/_*).
 * Contrato del otro lado: CRM, md/INTEGRACION-WEB.md §5 y §9.
 *
 * - Configuración fuera del webroot, en este orden: variable ITH_CRM_CONFIG,
 *   la del servidor (variable ITH_CRM_CONFIG_SERVIDOR o, si no está, la carpeta
 *   ith_web_config/ al lado de public_html: <home>/ith_web_config/crm.php) y
 *   ../config/crm.local.php
 *   (una carpeta arriba de la página, fuera de lo que se publica; ignorado por
 *   git). En local, servir.cmd apunta ITH_CRM_CONFIG a la configuración de
 *   pruebas del sitio (WEB/config/crm.local.php; modelo en
 *   WEB/config/crm.example.php). Lleva la clave y el secreto de la API: nunca
 *   se copian a esta carpeta ni a otro lado.
 * - Cada pedido va firmado: X-ITH-Signature = HMAC-SHA256(secreto,
 *   ts \n MÉTODO \n ruta \n idempotencia \n hash de IP \n cuerpo), con las
 *   dos cabeceras vacías en un GET. La ruta incluye la carpeta del CRM
 *   (/crm o /crm-pruebas), así que una firma de pruebas no sirve en
 *   producción; la idempotencia y el hash de IP van firmados para que un
 *   pedido copiado no se pueda reenviar como si fuera otro.
 * - La IP del visitante nunca sale de la web: el CRM recibe un HMAC con la sal
 *   propia de la web (ip_sal), de la IP o de su red /64 en IPv6.
 * - Si el CRM no responde, la consulta del formulario queda en una cola
 *   (un archivo por consulta, permisos 600, fuera del webroot) y se reenvía
 *   con la misma clave de idempotencia: el CRM no la duplica. La reserva de un
 *   horario no se encola nunca: no se puede confirmar a ciegas.
 *
 * Línea de comandos (sirve para un cron de hPanel cuando se publique):
 *   php api/_crm.php reenviar
 */

declare(strict_types=1);

// Pedido directo por HTTP: no hay nada que ver acá.
if (PHP_SAPI !== 'cli' && realpath((string) ($_SERVER['SCRIPT_FILENAME'] ?? '')) === __FILE__) {
    http_response_code(404);
    exit;
}

// En el hosting, la página vive en <home>/public_html/api: dos carpetas arriba queda <home>, fuera del webroot.
define('CRM_CONFIG_SERVIDOR', getenv('ITH_CRM_CONFIG_SERVIDOR') ?: dirname(__DIR__, 2) . '/ith_web_config/crm.php');
const CRM_ZONA = 'America/Argentina/Buenos_Aires';
const CRM_COLA_DIAS = 30;          // nada queda más que esto en la cola (datos personales)
const CRM_COLA_VIGENCIA = 82800;   // 23 h: el CRM rechaza un consentimiento de más de 24 h

// Texto que acepta la persona al marcar la casilla del formulario. Tiene que
// ser idéntico al de las dos casillas de #agenda en index.html (la de la
// agenda y la del formulario de consulta). Si cambia el texto, se
// agrega una versión nueva y se deja la anterior: el CRM guarda la huella del
// texto que aceptó cada persona.
const CRM_CONSENTIMIENTOS = [
    'web-2026-11' => 'Acepto que Intellihelp use estos datos para responder mi consulta y coordinar la reunión, según el aviso de privacidad.',
    // Formulario "Dejanos tu consulta": no agenda reunión, así que el texto no la menciona
    'web-2026-11-consulta' => 'Acepto que Intellihelp use estos datos para responder mi consulta, según el aviso de privacidad.',
];
const CRM_CONSENTIMIENTO_VIGENTE = 'web-2026-11';

// Mismas opciones (y mismo texto) que los select "¿Qué servicio te interesa?"
// de #agenda en index.html. Si llega vacío o con
// otro valor, el mail dice NECESIDAD_VACIA para no clasificar mal la consulta.
const NECESIDADES = [
    'Cámaras de seguridad y control de acceso',
    'Soporte IT, mesa de ayuda u outsourcing IT',
    'Redes, fibra o data center',
    'Ciberseguridad',
    'Búsqueda de perfiles IT',
    'Desarrollo de software o automatización con IA',
    'Licitación o proyecto para un organismo público',
    'Otro proyecto',
];
const NECESIDAD_VACIA = 'Sin especificar';

// Texto de los formularios ------------------------------------------------------

function input(string $key): string
{
    $value = $_POST[$key] ?? '';
    return is_string($value) ? $value : '';
}

/** Texto de una línea: sin caracteres de control (incluye \r y \n), recortado. */
function single_line(string $value): string
{
    return trim((string) preg_replace('/[\p{Cc}\p{Zl}\p{Zp}]+/u', ' ', $value));
}

/** Texto multilínea: normaliza saltos y quita el resto de caracteres de control. */
function multi_line(string $value): string
{
    $value = str_replace(["\r\n", "\r"], "\n", $value);
    return trim((string) preg_replace('/[^\P{Cc}\n\t]+/u', '', $value));
}

function too_long(string $value, int $max): bool
{
    // Cuenta caracteres UTF-8 sin depender de mbstring.
    return (int) preg_match_all('/./su', $value) > $max;
}

/** Corta a $max caracteres UTF-8 sin depender de mbstring. */
function cut(string $value, int $max): string
{
    return preg_match('/^.{0,' . $max . '}/su', $value, $m) === 1 ? $m[0] : '';
}

/** Ruta interna simple (/, /servicios/x/); si no, ''. */
function crm_ruta(string $value): string
{
    $value = single_line($value);
    return strlen($value) <= 200 && preg_match('#^/[A-Za-z0-9/_.-]*$#', $value) === 1
        && !str_contains($value, '..') && !str_contains($value, '//') ? $value : '';
}

/**
 * Datos de la persona que llegan del formulario (los mismos nombres de campo
 * en contact.php y en agenda.php), validados con las reglas del CRM
 * (INTEGRACION-WEB.md §6.2) para que el CRM no rechace lo que la web aceptó.
 *
 * @return array{0: array, 1: string, 2: string} [datos, mensaje de error, campo con error]
 */
function crm_persona_del_formulario(): array
{
    $d = [
        'nombre' => single_line(input('nombre')),
        'empresa' => single_line(input('empresa')),
        'mail' => strtolower(single_line(input('mail'))),
        'telefono' => single_line(input('telefono')),
        'necesidad' => single_line(input('necesidad')),
        'mensaje' => multi_line(input('mensaje')),
    ];

    // Formularios con nombre y apellido separados y cargo (/diagnostico-sin-cargo/).
    // El CRM recibe nombre y apellido juntos (los separa él al crear el
    // contacto) y el cargo en la primera línea del mensaje: la API v1 no tiene
    // un campo para el cargo. Si el formulario no manda "apellido" (el de una
    // sola casilla), no cambia nada.
    if (array_key_exists('apellido', $_POST)) {
        $apellido = single_line(input('apellido'));
        if ($d['nombre'] === '') {
            return [$d, 'Escribí tu nombre.', 'nombre'];
        }
        if ($apellido === '') {
            return [$d, 'Escribí tu apellido.', 'apellido'];
        }
        if (too_long($apellido, 60) || !preg_match('/\p{L}/u', $apellido) || preg_match('#://|\bwww\.#i', $apellido)) {
            return [$d, 'Escribí solo tu apellido.', 'apellido'];
        }
        $d['nombre'] .= ' ' . $apellido;
    }
    $cargo = single_line(input('cargo'));
    if ($cargo !== '') {
        if (too_long($cargo, 100) || preg_match('#://|\bwww\.#i', $cargo)) {
            return [$d, 'Escribí solo tu cargo, en pocas palabras.', 'cargo'];
        }
        $d['mensaje'] = 'Cargo: ' . $cargo . ($d['mensaje'] !== '' ? "\n\n" . $d['mensaje'] : '');
    }

    if ($d['nombre'] === '' || $d['empresa'] === '' || $d['mail'] === '') {
        $campo = $d['nombre'] === '' ? 'nombre' : ($d['empresa'] === '' ? 'empresa' : 'mail');
        return [$d, 'Completá tu nombre y apellido, la empresa y el mail laboral.', $campo];
    }
    if (too_long($d['nombre'], 120) || too_long($d['empresa'], 120) || too_long($d['mail'], 190)
        || too_long($d['telefono'], 40) || too_long($d['mensaje'], 3000)) {
        return [$d, 'Alguno de los datos es demasiado largo. Revisalos y probá de nuevo.', ''];
    }
    // Como en el CRM: al menos dos caracteres y alguna letra.
    if (!too_long($d['nombre'], 1) || !preg_match('/\p{L}/u', $d['nombre'])) {
        return [$d, 'Escribí tu nombre y apellido.', 'nombre'];
    }
    // Como en el CRM: nombre y empresa vuelven en el mail de confirmación, que
    // sale con la marca de Intellihelp; no pueden llevar direcciones web.
    if (preg_match('#://|\bwww\.#i', $d['nombre'])) {
        return [$d, 'Escribí solo tu nombre y apellido.', 'nombre'];
    }
    if (preg_match('#://|\bwww\.#i', $d['empresa'])) {
        return [$d, 'Escribí solo el nombre de la empresa.', 'empresa'];
    }
    if (filter_var($d['mail'], FILTER_VALIDATE_EMAIL) === false) {
        return [$d, 'Revisá el mail: tiene que ser del tipo nombre@empresa.com.', 'mail'];
    }
    if ($d['telefono'] !== '' && (!preg_match('/^[0-9+()\s.\-\/]{6,40}$/', $d['telefono'])
        || strlen((string) preg_replace('/\D/', '', $d['telefono'])) < 6)) {
        return [$d, 'Revisá el teléfono: usá solo números, espacios y los signos + ( ) -.', 'telefono'];
    }
    if (!in_array($d['necesidad'], NECESIDADES, true)) {
        $d['necesidad'] = '';
    }
    return [$d, '', ''];
}

/** Cuerpo `persona` del contrato de la API. */
function crm_persona(array $d): array
{
    return [
        'nombre' => $d['nombre'],
        'empresa' => $d['empresa'],
        'email' => $d['mail'],
        'telefono' => $d['telefono'],
        'servicio' => $d['necesidad'],
        'mensaje' => $d['mensaje'],
    ];
}

/**
 * Canal de origen de la primera visita (campos ocultos del formulario, los
 * completa js/agenda.js con la primera visita que guarda en localStorage).
 * Nunca rechaza el envío: lo que no tiene el formato esperado queda vacío,
 * con las mismas reglas que api_limpiar_origen() del CRM.
 */
function crm_origen(array $post): array
{
    $get = static fn (string $key): string => is_string($post[$key] ?? null) ? $post[$key] : '';
    $text = static function (string $key, int $max) use ($get): string {
        $value = single_line($get($key));
        return too_long($value, $max) ? cut($value, $max) : $value;
    };
    $id = static function (string $key) use ($get): string {
        $value = single_line($get($key));
        return preg_match('/^[A-Za-z0-9._~-]{1,200}$/', $value) === 1 ? $value : '';
    };

    $referrer = $text('referrer', 300);
    if ($referrer !== '' && (filter_var($referrer, FILTER_VALIDATE_URL) === false || !preg_match('#^https?://#i', $referrer))) {
        $referrer = '';
    }
    $visitas = single_line($get('visitas_landing'));
    $visitas = ctype_digit($visitas) && (int) $visitas <= 999 ? (int) $visitas : 0;

    return [
        'pagina' => crm_ruta($get('origen')),
        'canal' => $text('canal', 80),
        'utm_source' => $text('utm_source', 150),
        'utm_medium' => $text('utm_medium', 150),
        'utm_campaign' => $text('utm_campaign', 150),
        'utm_term' => $text('utm_term', 150),
        'utm_content' => $text('utm_content', 150),
        'gclid' => $id('gclid'),
        'li_fat_id' => $id('li_fat_id'),
        'referrer' => $referrer,
        'landing' => crm_ruta($get('landing')),
        'visitas_landing' => $visitas,
    ];
}

/** Líneas del canal de origen para el final de los mails a info@. */
function crm_origen_lineas(array $o): array
{
    $utm = [];
    foreach (['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as $key) {
        if ($o[$key] !== '') {
            $utm[] = $key . '=' . $o[$key];
        }
    }
    return [
        'Canal: ' . ($o['canal'] !== '' ? $o['canal'] : '(sin datos)'),
        'Campaña: ' . ($utm !== [] ? implode(' · ', $utm) : '(sin UTM)'),
        'Vino desde: ' . ($o['referrer'] !== '' ? $o['referrer'] : '(sin sitio de origen)'),
        'Primera página que vio: ' . ($o['landing'] !== '' ? 'https://www.intellihelp.tech' . $o['landing'] : '(sin datos)'),
        ...($o['gclid'] !== '' ? ['Clic de Google Ads (gclid): ' . $o['gclid']] : []),
        ...($o['li_fat_id'] !== '' ? ['Clic de LinkedIn Ads (li_fat_id): ' . $o['li_fat_id']] : []),
    ];
}

/**
 * Consentimiento (Ley 25.326, art. 5) para el CRM. La fecha la pone el
 * servidor de la web, no el navegador. Null si la versión no existe.
 */
function crm_consentimiento(string $version, ?string $fecha = null): ?array
{
    if (!isset(CRM_CONSENTIMIENTOS[$version])) {
        return null;
    }
    return [
        'aceptado' => true,
        'fecha' => $fecha ?? (new DateTimeImmutable('now', new DateTimeZone(CRM_ZONA)))->format('c'),
        'version' => $version,
        'texto' => CRM_CONSENTIMIENTOS[$version],
    ];
}

/**
 * Fecha del consentimiento de un envío, la misma en cada reintento.
 *
 * El CRM reconoce un reintento porque llega con la misma clave de
 * idempotencia y el mismo cuerpo. Si la fecha se tomara de nuevo en cada
 * intento (doble clic, o la red que se cortó justo después de reservar), el
 * cuerpo cambiaría y el CRM lo rechazaría como otro pedido con la misma
 * clave. Se guarda la primera, un día como máximo.
 */
function crm_fecha_consentimiento(array $cfg, string $idem): string
{
    $ahora = (new DateTimeImmutable('now', new DateTimeZone(CRM_ZONA)))->format('c');
    $dir = crm_carpeta($cfg['cache']);
    if ($dir === null) {
        return $ahora;
    }
    $file = $dir . DIRECTORY_SEPARATOR . 'c-' . hash('sha256', $idem) . '.txt';
    $previa = @is_file($file) && filemtime($file) > time() - 86400 ? trim((string) @file_get_contents($file)) : '';
    if ($previa !== '' && preg_match('/^\d{4}-\d{2}-\d{2}T[\d:]{8}[+-]\d{2}:\d{2}$/', $previa)) {
        return $previa;
    }
    @file_put_contents($file, $ahora, LOCK_EX);
    @chmod($file, 0600);
    // De paso, se borran las de más de un día.
    if (random_int(1, 20) === 1) {
        foreach (glob($dir . DIRECTORY_SEPARATOR . 'c-*.txt') ?: [] as $vieja) {
            if (filemtime($vieja) < time() - 86400) {
                @unlink($vieja);
            }
        }
    }
    return $ahora;
}

/** ¿La persona marcó la casilla de consentimiento? */
function crm_acepto(): bool
{
    return in_array(input('acepto'), ['1', 'on', 'si', 'true'], true);
}

// Límite de envíos por IP ---------------------------------------------------------

/**
 * La IP reducida a la red que identifica a un visitante: en IPv4 la IP, en
 * IPv6 su /64 (cualquier conexión tiene un /64 entero; contando por dirección
 * completa, cada pedido podía salir de una nueva). Igual que ip_red() del CRM.
 */
function crm_ip_red(string $ip): string
{
    $bin = @inet_pton(trim($ip));
    if ($bin === false) {
        return trim($ip);
    }
    if (strlen($bin) === 4) {
        return trim($ip);
    }
    return (string) inet_ntop(substr($bin, 0, 8) . str_repeat("\0", 8)) . '/64';
}

/**
 * Carpeta privada de los contadores de envíos: la caché del CRM si está
 * configurado; si no, una carpeta propia (700) junto a la configuración del
 * servidor o, como último recurso, en el temporal.
 */
function limite_carpeta(): string
{
    $cfg = crm_config();
    $candidatas = array_filter([
        $cfg !== null ? $cfg['cache'] : '',
        dirname(CRM_CONFIG_SERVIDOR) . '/cache-web',
        sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'ith-web-limites',
    ]);
    foreach ($candidatas as $dir) {
        if (@is_dir(dirname($dir)) && crm_carpeta($dir) !== null) {
            return $dir;
        }
    }
    return sys_get_temp_dir();
}

/**
 * Sal de los contadores: la del CRM (ip_sal) o, sin configuración, una propia
 * generada una vez en la carpeta de los contadores. Sin sal, el hash de una
 * IPv4 se revierte probando las 2^32 direcciones: sería la IP en claro.
 */
function limite_sal(string $dir): string
{
    $cfg = crm_config();
    if ($cfg !== null) {
        return (string) $cfg['ip_sal'];
    }
    $file = rtrim($dir, '/\\') . DIRECTORY_SEPARATOR . '.sal';
    $sal = @is_file($file) ? trim((string) @file_get_contents($file)) : '';
    if (strlen($sal) < 32) {
        $sal = bin2hex(random_bytes(32));
        @file_put_contents($file, $sal, LOCK_EX);
        @chmod($file, 0600);
    }
    return $sal;
}

/**
 * Devuelve true si la IP superó el límite; si no, registra este pedido.
 *
 * Queda solo un HMAC de la IP (o de su red /64) con sal, en una carpeta
 * privada, y los archivos de más de un día se borran solos de vez en cuando:
 * la IP es un dato personal (Ley 25.326) y no hay por qué conservarla. Si no
 * se puede escribir, no se bloquea a nadie.
 */
function limite_ip(string $prefijo, string $ip, int $max, int $ventana, ?string $dir = null): bool
{
    $dir = $dir !== null && is_dir($dir) ? $dir : limite_carpeta();
    $base = rtrim($dir, '/\\') . DIRECTORY_SEPARATOR;
    $file = $base . 'ith-' . $prefijo . '-' . hash_hmac('sha256', crm_ip_red($ip), limite_sal($dir)) . '.json';

    if (random_int(1, 20) === 1) {
        foreach (glob($base . 'ith-*.json') ?: [] as $viejo) {
            if (@filemtime($viejo) < time() - 86400) {
                @unlink($viejo);
            }
        }
    }

    $fh = @fopen($file, 'c+');
    if ($fh === false) {
        return false;
    }

    try {
        flock($fh, LOCK_EX);
        $raw = stream_get_contents($fh);
        $now = time();
        $hits = json_decode($raw !== false && $raw !== '' ? $raw : '[]', true);
        $hits = array_values(array_filter(
            is_array($hits) ? $hits : [],
            static fn ($t) => is_int($t) && $t > $now - $ventana
        ));

        if (count($hits) >= $max) {
            return true;
        }

        $hits[] = $now;
        ftruncate($fh, 0);
        rewind($fh);
        fwrite($fh, json_encode($hits));
        fflush($fh);
        return false;
    } finally {
        flock($fh, LOCK_UN);
        fclose($fh);
    }
}

/**
 * Responde ya al navegador y sigue trabajando (mail, CRM, cola) sin hacerlo
 * esperar. En Hostinger (LiteSpeed) y en PHP-FPM corta la conexión; si no hay
 * cómo, el navegador espera un poco más, nada más.
 */
function cerrar_conexion(): void
{
    ignore_user_abort(true);
    if (function_exists('litespeed_finish_request')) {
        litespeed_finish_request();
    } elseif (function_exists('fastcgi_finish_request')) {
        fastcgi_finish_request();
    } else {
        while (ob_get_level() > 0) {
            ob_end_flush();
        }
        flush();
    }
}

// Configuración ---------------------------------------------------------------------

/** La configuración del CRM, o null si falta o está incompleta (la web sigue con el mail). */
function crm_config(): ?array
{
    static $cache = false;
    if ($cache !== false) {
        return $cache;
    }
    $cache = null;

    $candidatos = array_filter([
        getenv('ITH_CRM_CONFIG') ?: '',
        CRM_CONFIG_SERVIDOR,
        dirname(__DIR__, 2) . '/config/crm.local.php',
    ]);
    foreach ($candidatos as $file) {
        if (!@is_file($file) || !@is_readable($file)) {
            continue;
        }
        $cfg = require $file;
        if (!is_array($cfg)) {
            error_log('[crm] la configuración no devuelve un arreglo');
            return null;
        }
        $ok = is_string($cfg['url'] ?? null) && preg_match('#^https://[a-z0-9.-]+(:\d+)?(/[A-Za-z0-9_-]+)*$#i', $cfg['url'])
            && is_string($cfg['clave'] ?? null) && preg_match('/^crm_[0-9a-f]{40}$/', $cfg['clave'])
            && is_string($cfg['secreto'] ?? null) && preg_match('/^[0-9a-f]{64}$/', $cfg['secreto'])
            && is_string($cfg['ip_sal'] ?? null) && strlen($cfg['ip_sal']) >= 32
            && is_array($cfg['tipos'] ?? null) && $cfg['tipos'] !== [];
        if (!$ok) {
            // Sin decir qué valor falló: el log no lleva datos de la configuración.
            error_log('[crm] configuración incompleta o con formato inválido');
            return null;
        }
        $cfg['url'] = rtrim($cfg['url'], '/');
        $cfg['timeout'] = max(1, min(15, (int) ($cfg['timeout'] ?? 5)));
        $cfg['timeout_reserva'] = max(2, min(20, (int) ($cfg['timeout_reserva'] ?? 10)));
        $cfg['cola'] = is_string($cfg['cola'] ?? null) ? $cfg['cola'] : dirname($file) . '/cola-crm';
        $cfg['cache'] = is_string($cfg['cache'] ?? null) ? $cfg['cache'] : dirname($file) . '/cache-crm';
        return $cache = $cfg;
    }
    return null;
}

/** Carpeta privada (700) para la cola o la caché; null si no se puede crear. */
function crm_carpeta(string $dir): ?string
{
    if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) {
        return null;
    }
    return is_writable($dir) ? $dir : null;
}

/**
 * Hash de la IP del visitante (o de su red /64) con la sal propia de la web:
 * el CRM nunca ve la IP.
 */
function crm_ip_hash(string $ip, array $cfg): string
{
    return hash_hmac('sha256', crm_ip_red($ip), (string) $cfg['ip_sal']);
}

// Token del formulario de la agenda ---------------------------------------------------

/**
 * Token que la página recibe con los horarios y devuelve al reservar:
 * marca de tiempo + número al azar + HMAC con el secreto de la web. Prueba
 * que antes de reservar se pidieron los horarios desde esta web, y mide el
 * tiempo: una reserva a los dos segundos de cargar los horarios no la hizo
 * una persona. Es el equivalente al token de la agenda pública del CRM.
 */
function crm_form_token(array $cfg): string
{
    $ts = (string) time();
    $nonce = bin2hex(random_bytes(8));
    return $ts . '.' . $nonce . '.' . hash_hmac('sha256', 'agenda-web|' . $ts . '|' . $nonce, (string) $cfg['secreto']);
}

/**
 * Válido entre 3 segundos y 2 horas después de generado, y para una sola
 * reserva: puede volver con hasta tres claves de idempotencia distintas (el
 * reintento de la misma reserva o el cambio de horario después de un
 * «justo lo tomaron»), no más. Si no hay dónde registrarlo, valen la firma y
 * el tiempo.
 *
 * @param string|null $motivo rapido | vencido | invalido | usado
 */
function crm_form_token_valido(array $cfg, string $token, string $idem, ?string &$motivo = null): bool
{
    $motivo = null;
    if (!preg_match('/^(\d{9,11})\.([0-9a-f]{16})\.([0-9a-f]{64})$/', $token, $m)) {
        $motivo = 'invalido';
        return false;
    }
    $esperada = hash_hmac('sha256', 'agenda-web|' . $m[1] . '|' . $m[2], (string) $cfg['secreto']);
    if (!hash_equals($esperada, $m[3])) {
        $motivo = 'invalido';
        return false;
    }
    $edad = time() - (int) $m[1];
    if ($edad < -60) {
        $motivo = 'invalido';
        return false;
    }
    if ($edad < 3) {
        $motivo = 'rapido';
        return false;
    }
    if ($edad > 7200) {
        $motivo = 'vencido';
        return false;
    }

    $dir = crm_carpeta($cfg['cache']);
    if ($dir === null) {
        return true;
    }
    $file = $dir . DIRECTORY_SEPARATOR . 'ft-' . $m[2] . '.json';
    $fh = @fopen($file, 'c+');
    if ($fh === false) {
        return true;
    }
    try {
        flock($fh, LOCK_EX);
        $raw = stream_get_contents($fh);
        $usos = json_decode($raw !== false && $raw !== '' ? $raw : '[]', true);
        $usos = is_array($usos) ? array_values(array_filter($usos, 'is_string')) : [];
        if (!in_array($idem, $usos, true)) {
            if (count($usos) >= 3) {
                $motivo = 'usado';
                return false;
            }
            $usos[] = $idem;
            ftruncate($fh, 0);
            rewind($fh);
            fwrite($fh, json_encode($usos));
            fflush($fh);
        }
        return true;
    } finally {
        flock($fh, LOCK_UN);
        fclose($fh);
        @chmod($file, 0600);
        if (random_int(1, 20) === 1) {
            foreach (glob($dir . DIRECTORY_SEPARATOR . 'ft-*.json') ?: [] as $viejo) {
                if (@filemtime($viejo) < time() - 7300) {
                    @unlink($viejo);
                }
            }
        }
    }
}

/** Clave de idempotencia para el CRM a partir de la que genera el navegador. */
function crm_idem(string $idemNavegador, string $ipHash): string
{
    if (!preg_match('/^[A-Za-z0-9_-]{16,80}$/', $idemNavegador)) {
        $idemNavegador = bin2hex(random_bytes(16));
    }
    return 'web-' . substr(hash('sha256', $idemNavegador . $ipHash), 0, 40);
}

// Pedidos al CRM -----------------------------------------------------------------

/**
 * Firma del pedido (igual que api_firma() del CRM). $idem y $ipHash son las
 * cabeceras X-ITH-Idempotency y X-ITH-Client-IP-Hash tal cual viajan; en un
 * GET van vacías.
 */
function crm_firmar(string $secreto, string $ts, string $metodo, string $ruta, string $idem,
                    string $ipHash, string $cuerpo): string
{
    return hash_hmac('sha256', $ts . "\n" . strtoupper($metodo) . "\n" . $ruta . "\n" . $idem . "\n"
        . $ipHash . "\n" . $cuerpo, $secreto);
}

/**
 * Pedido firmado a la API v1 del CRM.
 *
 * $rutaApi va sin barra inicial y, en los GET, con la consulta ya armada
 * (`disponibilidad?tipo=…`). La ruta firmada es exactamente la que viaja en
 * la línea del pedido: por eso no se siguen redirecciones.
 *
 * @return array{status: int, json: ?array, error: ?string} status 0 si no hubo respuesta
 */
function crm_pedir(array $cfg, string $metodo, string $rutaApi, ?array $cuerpo,
                   ?string $idem, ?string $ipHash, int $timeout): array
{
    $metodo = strtoupper($metodo);
    $partes = parse_url($cfg['url']);
    $origen = $partes['scheme'] . '://' . $partes['host'] . (isset($partes['port']) ? ':' . $partes['port'] : '');
    $ruta = ($partes['path'] ?? '') . '/api/v1/' . $rutaApi;
    $json = $cuerpo === null ? '' : (string) json_encode($cuerpo, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    $ts = (string) time();
    // Las dos cabeceras van firmadas: en un GET no viajan y se firman vacías.
    $idemFirma = $metodo !== 'GET' ? (string) $idem : '';
    $ipFirma = $metodo !== 'GET' ? (string) $ipHash : '';

    $headers = [
        'Accept: application/json',
        'User-Agent: intellihelp-web/1.0',
        'X-ITH-Key: ' . $cfg['clave'],
        'X-ITH-Timestamp: ' . $ts,
        'X-ITH-Signature: ' . crm_firmar($cfg['secreto'], $ts, $metodo, $ruta, $idemFirma, $ipFirma, $json),
    ];
    if ($metodo !== 'GET') {
        $headers[] = 'Content-Type: application/json';
        if ($idem !== null) {
            $headers[] = 'X-ITH-Idempotency: ' . $idem;
        }
        if ($ipHash !== null) {
            $headers[] = 'X-ITH-Client-IP-Hash: ' . $ipHash;
        }
    }

    $status = 0;
    $respuesta = false;
    $error = null;

    if (function_exists('curl_init')) {
        $ch = curl_init($origen . $ruta);
        $opts = [
            CURLOPT_CUSTOMREQUEST => $metodo,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => false,
            CURLOPT_CONNECTTIMEOUT => min(4, $timeout),
            CURLOPT_TIMEOUT => $timeout,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_SSL_VERIFYHOST => 2,
            CURLOPT_PROTOCOLS => CURLPROTO_HTTPS,
        ];
        if ($metodo !== 'GET') {
            $opts[CURLOPT_POSTFIELDS] = $json;
        }
        // Certificados de una máquina local sin el almacén del sistema (opcional).
        if (is_string($cfg['cainfo'] ?? null) && is_file($cfg['cainfo'])) {
            $opts[CURLOPT_CAINFO] = $cfg['cainfo'];
        }
        curl_setopt_array($ch, $opts);
        $respuesta = curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        if ($respuesta === false) {
            $error = 'curl ' . curl_errno($ch);
            $status = 0;
        }
        curl_close($ch);
    } else {
        $ssl = ['verify_peer' => true, 'verify_peer_name' => true];
        if (is_string($cfg['cainfo'] ?? null) && is_file($cfg['cainfo'])) {
            $ssl['cafile'] = $cfg['cainfo'];
        }
        $ctx = stream_context_create([
            'http' => [
                'method' => $metodo,
                'header' => implode("\r\n", $headers),
                'content' => $metodo !== 'GET' ? $json : '',
                'timeout' => $timeout,
                'ignore_errors' => true,
                'follow_location' => 0,
            ],
            'ssl' => $ssl,
        ]);
        $respuesta = @file_get_contents($origen . $ruta, false, $ctx);
        $linea = $http_response_header[0] ?? '';
        if (preg_match('#^HTTP/\S+\s+(\d{3})#', $linea, $m)) {
            $status = (int) $m[1];
        }
        if ($respuesta === false) {
            $error = 'sin respuesta';
            $status = 0;
        }
    }

    $datos = is_string($respuesta) && $respuesta !== '' ? json_decode($respuesta, true) : null;
    if ($status > 0 && !is_array($datos)) {
        $error ??= 'respuesta sin JSON';
    }
    return ['status' => $status, 'json' => is_array($datos) ? $datos : null, 'error' => $error];
}

// Cola de consultas pendientes --------------------------------------------------------

/** ¿Vale la pena reintentar ese resultado más tarde? */
function crm_reintentable(array $r): bool
{
    $error = (string) ($r['json']['error'] ?? '');
    return $r['status'] === 0 || $r['status'] >= 500
        || $r['json'] === null                       // no contestó el CRM (página de error del hosting, URL mal escrita)
        || in_array($r['status'], [401, 403, 404, 408, 429], true) // clave vencida o regenerada: se corrige la configuración y entra
        || ($r['status'] === 409 && $error === 'en_proceso');
}

/**
 * Guarda una consulta que el CRM no pudo recibir. Un archivo por consulta,
 * con la clave de idempotencia original: al reenviarla el CRM no la duplica.
 */
function crm_encolar(array $cfg, string $rutaApi, array $cuerpo, string $idem, string $ipHash): void
{
    $dir = crm_carpeta($cfg['cola']);
    if ($dir === null || !preg_match('/^[A-Za-z0-9_-]{16,80}$/', $idem)) {
        error_log('[crm] no se pudo encolar la consulta ' . substr($idem, 0, 12));
        return;
    }
    $file = $dir . DIRECTORY_SEPARATOR . $idem . '.json';
    $datos = json_encode([
        'ruta' => $rutaApi,
        'cuerpo' => $cuerpo,
        'idem' => $idem,
        'ip_hash' => $ipHash,
        'creado' => time(),
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    $tmp = $file . '.tmp';
    if (@file_put_contents($tmp, (string) $datos, LOCK_EX) === false) {
        error_log('[crm] no se pudo encolar la consulta ' . substr($idem, 0, 12));
        return;
    }
    @chmod($tmp, 0600);
    @rename($tmp, $file);
}

/**
 * Reenvía hasta $max consultas de la cola. Lo que lleva más de 30 días se
 * borra sin enviar: son datos personales y la consulta ya llegó por mail.
 * Devuelve cuántas entraron.
 */
function crm_reenviar_pendientes(array $cfg, int $max = 3): int
{
    $dir = crm_carpeta($cfg['cola']);
    if ($dir === null) {
        return 0;
    }
    $lock = @fopen($dir . DIRECTORY_SEPARATOR . '.lock', 'c');
    if ($lock === false || !flock($lock, LOCK_EX | LOCK_NB)) {
        return 0; // ya hay otro proceso reenviando
    }

    $enviadas = 0;
    try {
        $archivos = glob($dir . DIRECTORY_SEPARATOR . '*.json') ?: [];
        usort($archivos, static fn ($a, $b) => filemtime($a) <=> filemtime($b));
        foreach ($archivos as $file) {
            $item = json_decode((string) @file_get_contents($file), true);
            $creado = is_array($item) ? (int) ($item['creado'] ?? 0) : 0;
            if (!is_array($item) || $creado < time() - CRM_COLA_DIAS * 86400) {
                @unlink($file);
                continue;
            }
            // El CRM acepta el consentimiento hasta 24 h después de la fecha en
            // que se dio (§6.2). Pasado eso la consulta ya no puede entrar: la
            // fecha no se cambia, porque es la del consentimiento real. Queda
            // el mail que recibió info@.
            if ($creado < time() - CRM_COLA_VIGENCIA) {
                error_log('[crm] consulta vencida en la cola ' . substr((string) ($item['idem'] ?? ''), 0, 12));
                @unlink($file);
                continue;
            }
            if ($max-- <= 0) {
                break;
            }
            $r = crm_pedir($cfg, 'POST', (string) $item['ruta'], (array) $item['cuerpo'],
                (string) $item['idem'], (string) $item['ip_hash'], $cfg['timeout']);
            if ($r['status'] >= 200 && $r['status'] < 300) {
                @unlink($file);
                $enviadas++;
            } elseif (!crm_reintentable($r)) {
                // El CRM la rechaza por su contenido: reintentarla no cambia nada.
                error_log('[crm] consulta descartada de la cola ' . substr((string) $item['idem'], 0, 12)
                    . ' (' . $r['status'] . ' ' . ($r['json']['error'] ?? '') . ')');
                @unlink($file);
            } else {
                break; // el CRM sigue sin responder: no tiene sentido probar las demás ahora
            }
        }
    } finally {
        flock($lock, LOCK_UN);
        fclose($lock);
    }
    return $enviadas;
}

// Línea de comandos --------------------------------------------------------------------

if (PHP_SAPI === 'cli' && realpath((string) ($_SERVER['SCRIPT_FILENAME'] ?? '')) === __FILE__) {
    $cfg = crm_config();
    if ($cfg === null) {
        fwrite(STDERR, "Falta la configuración del CRM.\n");
        exit(1);
    }
    if (($argv[1] ?? '') === 'reenviar') {
        $n = crm_reenviar_pendientes($cfg, 20);
        echo "Consultas reenviadas al CRM: $n\n";
        exit(0);
    }
    fwrite(STDERR, "Uso: php api/_crm.php reenviar\n");
    exit(2);
}
