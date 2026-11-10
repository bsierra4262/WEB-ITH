<?php
/**
 * Búsquedas de Intellihelp para /postulate/ (sección "Perfiles").
 *
 * GET /api/busquedas.php  ->  JSON con las búsquedas publicadas hoy en HiringRoom y, por perfil del catálogo
 * (data/perfiles.json), cuántas hay publicadas ahora y cuántas se publicaron desde que se lleva el historial.
 *
 * - Fuente: la API pública de HiringRoom, la misma que usa su script de inserción (embed.js):
 *   https://hiringroom.com/api/vacancies/get_vacancy_list?cuenta=<cuenta>. Responde {"vacancies":[...]} con las
 *   búsquedas externas publicadas EN ESE MOMENTO (name, locality, descript, requirements, benefits, details, link y
 *   form_link). No trae las búsquedas cerradas: el histórico se arma acá, guardando cada búsqueda que se ve.
 * - Caché: se consulta a HiringRoom como mucho cada 30 minutos (CACHE_SEGUNDOS), sin importar cuántas visitas haya.
 *   Si HiringRoom no responde se sigue sirviendo la última respuesta buena y se reintenta a los 5 minutos.
 * - Historial: historial.json guarda, por búsqueda, título, lugar y fechas de la primera y la última vez que se vio
 *   publicada. Con el tiempo queda el registro de las búsquedas anteriores. Sin datos personales: solo lo que
 *   HiringRoom publica en el aviso (ni descripciones, ni postulantes, ni claves).
 * - Clasificación: cada título se compara con las palabras clave de cada perfil del catálogo (sin tildes ni
 *   mayúsculas, por palabra completa). Gana el perfil con más puntaje: 10 por palabra de cada clave que aparece, 1 si
 *   la clave empieza con "~" (genérica, solo desempata). Empate: el que va primero en el catálogo. Sin coincidencias:
 *   "otros". Se clasifica en cada respuesta, así un cambio en el catálogo se aplica también al historial.
 *
 * Carpeta de datos (caché e historial), la primera que se pueda usar:
 *   1. La variable de entorno ITH_BUSQUEDAS_DATOS (ruta completa).
 *   2. busquedas-web/ al lado de la configuración del CRM (ITH_CRM_CONFIG o ITH_CRM_CONFIG_SERVIDOR): en local queda
 *      en config/ (no se versiona) y en el hosting, fuera de public_html.
 *   3. ith_web_config/busquedas-web/ al lado de public_html (dos carpetas arriba de api/), si ith_web_config existe.
 *   4. datos-busquedas/ en la raíz del sitio, con un .htaccess que niega el acceso y un .gitignore que la deja afuera
 *      del repositorio. Es el último recurso: conviene cualquiera de las anteriores.
 *
 * Respuesta (200 siempre que el script corra; el navegador usa el orden por defecto si algo falla):
 *   {
 *     "estado": "ok" | "desactualizado" | "sin-datos",
 *     "consultado": "2026-11-08T19:30:00-03:00" | null,   // última respuesta buena de HiringRoom
 *     "historial_desde": "2026-11-08" | null,
 *     "vigentes": [{ "titulo": "...", "ubicacion": "...", "perfil": "mesa-de-ayuda" | "otros" }],
 *     "perfiles": [{ "id": "mesa-de-ayuda", "vigentes": 1, "historico": 4 }, ...],   // en el orden del catálogo
 *     "otros": { "vigentes": 0, "historico": 2 }
 *   }
 *
 * En el hosting, api/.htaccess tiene que permitir este archivo (ver README, "Postulate").
 */

declare(strict_types=1);

date_default_timezone_set('America/Argentina/Buenos_Aires');

const HR_CUENTA_PREDETERMINADA = '624f426f360d76345973b26a'; // id público de la cuenta (el mismo de postulate/index.html)
const HR_URL = 'https://hiringroom.com/api/vacancies/get_vacancy_list?cuenta=';
const CACHE_SEGUNDOS = 1800;      // 30 minutos entre consultas a HiringRoom
const REINTENTO_SEGUNDOS = 300;   // si HiringRoom falló, no se vuelve a probar antes de 5 minutos
const HR_TIEMPO_MAXIMO = 6;       // segundos de espera por HiringRoom
const HISTORIAL_MAXIMO = 1000;    // búsquedas que se conservan (se descartan las vistas hace más tiempo)
const TEXTO_MAXIMO = 160;

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Robots-Tag: noindex');

$metodo = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($metodo !== 'GET' && $metodo !== 'HEAD') {
    http_response_code(405);
    header('Allow: GET, HEAD');
    echo json_encode(['estado' => 'error']);
    exit;
}

/* ---------- Catálogo ---------- */

/** @return array<int, array{id: string, palabras: array<int, array{0: string, 1: int}>}> */
function catalogo(): array
{
    $archivo = dirname(__DIR__) . '/data/perfiles.json';
    $datos = is_file($archivo) ? json_decode((string) file_get_contents($archivo), true) : null;
    $perfiles = [];
    foreach ((is_array($datos) ? ($datos['perfiles'] ?? []) : []) as $p) {
        if (!is_array($p) || !is_string($p['id'] ?? null) || $p['id'] === '') {
            continue;
        }
        $palabras = [];
        foreach ((array) ($p['palabras'] ?? []) as $clave) {
            if (!is_string($clave)) {
                continue;
            }
            $generica = str_starts_with($clave, '~');
            $norm = trim(normalizar($generica ? substr($clave, 1) : $clave));
            if ($norm !== '') {
                $palabras[] = [$norm, $generica ? 1 : 10 * (substr_count($norm, ' ') + 1)];
            }
        }
        $perfiles[] = ['id' => $p['id'], 'palabras' => $palabras];
    }
    return $perfiles;
}

/** Minúsculas, sin tildes, ".net" como palabra, todo lo que no sea letra o número pasa a espacio. */
function normalizar(string $texto): string
{
    // Sin depender de mbstring: mayúsculas acentuadas a mano y el resto con strtolower (solo toca ASCII).
    $texto = strtolower(strtr($texto, ['Á' => 'á', 'É' => 'é', 'Í' => 'í', 'Ó' => 'ó', 'Ú' => 'ú', 'Ü' => 'ü', 'Ñ' => 'ñ']));
    $texto = strtr($texto, ['á' => 'a', 'é' => 'e', 'í' => 'i', 'ó' => 'o', 'ú' => 'u', 'ü' => 'u', 'ñ' => 'n', 'à' => 'a', 'è' => 'e', 'ì' => 'i', 'ò' => 'o', 'ù' => 'u']);
    $texto = str_replace(['.net', 'c#', 'c++'], [' dotnet ', ' csharp ', ' cplusplus '], $texto);
    $texto = (string) preg_replace('/[^a-z0-9]+/', ' ', $texto);
    return ' ' . trim($texto) . ' ';
}

function clasificar(string $titulo, array $catalogo): string
{
    $t = normalizar($titulo);
    $mejor = 'otros';
    $puntaje = 0;
    foreach ($catalogo as $perfil) {
        $suma = 0;
        foreach ($perfil['palabras'] as [$clave, $peso]) {
            if (str_contains($t, ' ' . $clave . ' ')) {
                $suma += $peso;
            }
        }
        if ($suma > $puntaje) { // estrictamente mayor: en el empate queda el primero del catálogo
            $mejor = $perfil['id'];
            $puntaje = $suma;
        }
    }
    return $mejor;
}

/* ---------- Carpeta de datos ---------- */

function carpeta_datos(): ?string
{
    $candidatas = [];
    $env = getenv('ITH_BUSQUEDAS_DATOS');
    if (is_string($env) && $env !== '') {
        $candidatas[] = [$env, false];
    }
    foreach (['ITH_CRM_CONFIG', 'ITH_CRM_CONFIG_SERVIDOR'] as $var) {
        $cfg = getenv($var);
        if (is_string($cfg) && $cfg !== '' && is_dir(dirname($cfg))) {
            $candidatas[] = [dirname($cfg) . '/busquedas-web', false];
        }
    }
    if (is_dir(dirname(__DIR__, 2) . '/ith_web_config')) {
        $candidatas[] = [dirname(__DIR__, 2) . '/ith_web_config/busquedas-web', false];
    }
    $candidatas[] = [dirname(__DIR__) . '/datos-busquedas', true];

    foreach ($candidatas as [$dir, $enElSitio]) {
        if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) {
            continue;
        }
        if (!is_writable($dir)) {
            continue;
        }
        if ($enElSitio) {
            proteger_carpeta($dir);
        }
        return $dir;
    }
    return null;
}

/** Dentro del sitio: sin acceso desde la web (Apache 2.2 y 2.4, LiteSpeed) y fuera del repositorio. */
function proteger_carpeta(string $dir): void
{
    $htaccess = $dir . '/.htaccess';
    if (!is_file($htaccess)) {
        @file_put_contents($htaccess, "# Caché e historial de api/busquedas.php: no se sirven.\n"
            . "<IfModule mod_authz_core.c>\n  Require all denied\n</IfModule>\n"
            . "<IfModule !mod_authz_core.c>\n  Order allow,deny\n  Deny from all\n</IfModule>\n");
    }
    $gitignore = $dir . '/.gitignore';
    if (!is_file($gitignore)) {
        @file_put_contents($gitignore, "*\n");
    }
}

function leer_json(string $archivo): ?array
{
    if (!is_file($archivo)) {
        return null;
    }
    $datos = json_decode((string) @file_get_contents($archivo), true);
    return is_array($datos) ? $datos : null;
}

/** Escritura atómica: primero a un temporal y después se renombra. */
function guardar_json(string $archivo, array $datos): void
{
    $tmp = $archivo . '.' . bin2hex(random_bytes(4)) . '.tmp';
    $json = json_encode($datos, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    if ($json === false || @file_put_contents($tmp, $json, LOCK_EX) === false || !@rename($tmp, $archivo)) {
        @unlink($tmp);
        error_log('[busquedas] no se pudo guardar ' . basename($archivo));
    }
}

/* ---------- HiringRoom ---------- */

function texto_plano(mixed $valor): string
{
    if (!is_string($valor) && !is_numeric($valor)) {
        return '';
    }
    $t = html_entity_decode(strip_tags((string) $valor), ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $t = trim((string) preg_replace('/\s+/u', ' ', $t));
    if ($t === 'undefined' || $t === 'null') {
        return '';
    }
    if (preg_match_all('/./su', $t, $letras) > TEXTO_MAXIMO) { // sin mbstring: se corta por caracteres, no por bytes
        $t = rtrim(implode('', array_slice($letras[0], 0, TEXTO_MAXIMO - 1))) . '…';
    }
    return $t;
}

/** Id estable de una búsqueda: el que trae HiringRoom o, si no viene, uno derivado de su enlace o de su título. */
function id_busqueda(array $v, string $titulo, string $ubicacion): string
{
    foreach (['id', 'vacancy_id', 'id_vacancy', 'code'] as $campo) {
        $valor = $v[$campo] ?? null;
        if ((is_string($valor) || is_int($valor)) && preg_match('/^[A-Za-z0-9_-]{1,64}$/', (string) $valor)) {
            return 'hr-' . $valor;
        }
    }
    $link = is_string($v['link'] ?? null) ? $v['link'] : '';
    $base = $link !== '' ? $link : $titulo . '|' . $ubicacion;
    return 'h-' . substr(hash('sha256', $base), 0, 20);
}

/** @return array<int, array{id: string, titulo: string, ubicacion: string}>|null  null si HiringRoom no respondió bien */
function consultar_hiringroom(): ?array
{
    $cuenta = getenv('ITH_HIRINGROOM_CUENTA') ?: HR_CUENTA_PREDETERMINADA;
    if (!preg_match('/^[a-f0-9]{24}$/i', $cuenta)) {
        return null;
    }
    $url = HR_URL . rawurlencode($cuenta);
    $cuerpo = null;
    $codigo = 0;
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => false,
            CURLOPT_CONNECTTIMEOUT => 4,
            CURLOPT_TIMEOUT => HR_TIEMPO_MAXIMO,
            CURLOPT_HTTPHEADER => ['Accept: application/json'],
            CURLOPT_USERAGENT => 'Intellihelp-Web/1.0 (+https://www.intellihelp.tech/postulate/)',
        ]);
        $r = curl_exec($ch);
        $codigo = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        curl_close($ch);
        $cuerpo = is_string($r) ? $r : null;
    } else {
        $ctx = stream_context_create(['http' => [
            'method' => 'GET',
            'timeout' => HR_TIEMPO_MAXIMO,
            'header' => "Accept: application/json\r\nUser-Agent: Intellihelp-Web/1.0\r\n",
            'ignore_errors' => true,
        ]]);
        $r = @file_get_contents($url, false, $ctx);
        $cuerpo = is_string($r) ? $r : null;
        $codigo = (isset($http_response_header[0]) && preg_match('/\s(\d{3})\s/', $http_response_header[0], $m)) ? (int) $m[1] : 0;
    }
    if ($cuerpo === null || $codigo !== 200) {
        error_log('[busquedas] HiringRoom no respondió (HTTP ' . $codigo . ')');
        return null;
    }
    $datos = json_decode($cuerpo, true);
    if (!is_array($datos) || !is_array($datos['vacancies'] ?? null)) {
        error_log('[busquedas] respuesta de HiringRoom con otro formato');
        return null;
    }
    $lista = [];
    $vistos = [];
    foreach ($datos['vacancies'] as $v) {
        if (!is_array($v)) {
            continue;
        }
        $titulo = texto_plano($v['name'] ?? '');
        if ($titulo === '') {
            continue;
        }
        $ubicacion = texto_plano($v['locality'] ?? '');
        $id = id_busqueda($v, $titulo, $ubicacion);
        if (isset($vistos[$id])) {
            continue;
        }
        $vistos[$id] = true;
        $lista[] = ['id' => $id, 'titulo' => $titulo, 'ubicacion' => $ubicacion];
    }
    return $lista;
}

/*
 * ---------- Histórico completo (API privada de HiringRoom): punto de integración ----------
 * La API pública solo devuelve lo publicado en el momento. Para traer también las búsquedas cerradas o pausadas
 * hace falta la API privada de HiringRoom, con las credenciales de la cuenta administradora (las tiene Carlos).
 * Cuando estén:
 *   1. Guardar las credenciales en un archivo fuera de public_html (por ejemplo ith_web_config/hiringroom.php, que
 *      devuelva ['client_id' => ..., 'client_secret' => ...]); nunca en este archivo ni en el repositorio.
 *   2. Completar historial_api_privada(): pedir el token y listar las búsquedas con los endpoints que indique la
 *      documentación de la API de HiringRoom para esa cuenta, y devolverlas con la misma forma que
 *      consultar_hiringroom() más las fechas: ['id' => 'hr-<id>', 'titulo', 'ubicacion', 'primera_vez' => 'AAAA-MM-DD',
 *      'ultima_vez' => 'AAAA-MM-DD'].
 *   3. Descomentar la llamada en actualizar(): sumar_historial_privado() las incorpora al historial sin duplicar.
 * Conviene correrlo una vez por día (las búsquedas cerradas no cambian), no en cada actualización de 30 minutos.
 *
 * function historial_api_privada(): ?array
 * {
 *     $archivo = getenv('ITH_HIRINGROOM_CONFIG') ?: dirname(__DIR__, 2) . '/ith_web_config/hiringroom.php';
 *     $cfg = is_file($archivo) ? require $archivo : null;
 *     if (!is_array($cfg) || empty($cfg['client_id']) || empty($cfg['client_secret'])) {
 *         return null;
 *     }
 *     // 1) token con client_id y client_secret; 2) listado de búsquedas (todas, no solo las publicadas);
 *     // 3) devolver cada una con id, titulo, ubicacion, primera_vez y ultima_vez (sin datos de postulantes).
 *     return null;
 * }
 *
 * function sumar_historial_privado(array &$historial, array $busquedas): void
 * {
 *     foreach ($busquedas as $b) {
 *         $previa = $historial[$b['id']] ?? null;
 *         $historial[$b['id']] = [
 *             'titulo' => $b['titulo'],
 *             'ubicacion' => $b['ubicacion'],
 *             'primera_vez' => min($previa['primera_vez'] ?? $b['primera_vez'], $b['primera_vez']),
 *             'ultima_vez' => max($previa['ultima_vez'] ?? $b['ultima_vez'], $b['ultima_vez']),
 *         ];
 *     }
 * }
 */

/* ---------- Actualización con caché y bloqueo ---------- */

/**
 * Devuelve [vigentes, historial, consultado, estado]. Solo un pedido por vez consulta a HiringRoom: los demás, si no
 * consiguen el bloqueo, responden con lo que ya hay guardado.
 */
function actualizar(?string $dir): array
{
    if ($dir === null) {
        $vigentes = consultar_hiringroom();
        return [$vigentes ?? [], [], $vigentes !== null ? time() : null, $vigentes !== null ? 'ok' : 'sin-datos'];
    }
    $archivoCache = $dir . '/vigentes.json';
    $archivoHistorial = $dir . '/historial.json';
    $cache = leer_json($archivoCache) ?? [];
    $historial = (leer_json($archivoHistorial) ?? [])['busquedas'] ?? [];
    $consultado = is_int($cache['consultado'] ?? null) ? $cache['consultado'] : null;
    $intento = is_int($cache['intento'] ?? null) ? $cache['intento'] : 0;
    $vigentes = is_array($cache['vigentes'] ?? null) ? $cache['vigentes'] : [];
    $ahora = time();

    $vencida = $consultado === null || $ahora - $consultado >= CACHE_SEGUNDOS;
    $puedeReintentar = $ahora - $intento >= REINTENTO_SEGUNDOS;
    if ($vencida && $puedeReintentar) {
        $lock = @fopen($dir . '/.bloqueo', 'c');
        if ($lock !== false && flock($lock, LOCK_EX | LOCK_NB)) {
            $nuevas = consultar_hiringroom();
            if ($nuevas !== null) {
                $hoy = date('Y-m-d', $ahora);
                foreach ($nuevas as $b) {
                    $previa = is_array($historial[$b['id']] ?? null) ? $historial[$b['id']] : null;
                    $historial[$b['id']] = [
                        'titulo' => $b['titulo'],
                        'ubicacion' => $b['ubicacion'],
                        'primera_vez' => is_string($previa['primera_vez'] ?? null) ? $previa['primera_vez'] : $hoy,
                        'ultima_vez' => $hoy,
                    ];
                }
                // if (date('H', $ahora) === '06') { $privadas = historial_api_privada(); if ($privadas) sumar_historial_privado($historial, $privadas); }
                if (count($historial) > HISTORIAL_MAXIMO) {
                    uasort($historial, static fn ($a, $b) => strcmp((string) ($b['ultima_vez'] ?? ''), (string) ($a['ultima_vez'] ?? '')));
                    $historial = array_slice($historial, 0, HISTORIAL_MAXIMO, true);
                }
                $vigentes = $nuevas;
                $consultado = $ahora;
                guardar_json($archivoHistorial, ['version' => 1, 'busquedas' => $historial]);
            }
            guardar_json($archivoCache, ['consultado' => $consultado, 'intento' => $ahora, 'vigentes' => $vigentes]);
            flock($lock, LOCK_UN);
        }
        if ($lock !== false) {
            fclose($lock);
        }
    }

    if ($consultado === null) {
        $estado = 'sin-datos';
    } elseif ($ahora - $consultado > CACHE_SEGUNDOS + REINTENTO_SEGUNDOS) {
        $estado = 'desactualizado';
    } else {
        $estado = 'ok';
    }
    return [$vigentes, $historial, $consultado, $estado];
}

/* ---------- Respuesta ---------- */

$catalogo = catalogo();
[$vigentes, $historial, $consultado, $estado] = actualizar(carpeta_datos());

$conteo = [];
foreach ($catalogo as $p) {
    $conteo[$p['id']] = ['id' => $p['id'], 'vigentes' => 0, 'historico' => 0];
}
$otros = ['vigentes' => 0, 'historico' => 0];

$salidaVigentes = [];
$idsVigentes = [];
foreach ($vigentes as $b) {
    if (!is_array($b) || !is_string($b['titulo'] ?? null)) {
        continue;
    }
    $perfil = clasificar($b['titulo'], $catalogo);
    $salidaVigentes[] = ['titulo' => $b['titulo'], 'ubicacion' => (string) ($b['ubicacion'] ?? ''), 'perfil' => $perfil];
    if (isset($conteo[$perfil])) {
        $conteo[$perfil]['vigentes']++;
    } else {
        $otros['vigentes']++;
    }
    if (is_string($b['id'] ?? null)) {
        $idsVigentes[$b['id']] = true;
    }
}

$desde = null;
foreach ($historial as $id => $b) {
    if (!is_array($b) || !is_string($b['titulo'] ?? null)) {
        continue;
    }
    $perfil = clasificar($b['titulo'], $catalogo);
    if (isset($conteo[$perfil])) {
        $conteo[$perfil]['historico']++;
    } else {
        $otros['historico']++;
    }
    $primera = (string) ($b['primera_vez'] ?? '');
    if ($primera !== '' && ($desde === null || $primera < $desde)) {
        $desde = $primera;
    }
}

header('Cache-Control: public, max-age=300');
if ($metodo === 'HEAD') {
    exit;
}
echo json_encode([
    'estado' => $estado,
    'consultado' => $consultado !== null ? date('c', $consultado) : null,
    'historial_desde' => $desde,
    'vigentes' => $salidaVigentes,
    'perfiles' => array_values($conteo),
    'otros' => $otros,
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
