<?php
/**
 * Router para el servidor embebido de PHP (php -S) del WordPress local.
 *
 * Si la ruta pedida es un archivo real (CSS, JS, imágenes, wp-login.php, etc.)
 * lo sirve tal cual; si no, pasa todo por index.php para que funcionen los
 * enlaces permanentes (/categoria/casos/, /<nota>/, ...), igual que el .htaccess
 * de Apache en el hosting.
 *
 * Este WordPress es solo el blog. En producción vive en /novedades/ del dominio
 * (https://www.intellihelp.tech/novedades/); en local está en la raíz de
 * 127.0.0.1:5180. El Vite del sitio principal ya manda /novedades/... a la
 * misma ruta sin el prefijo; igual, para que las rutas de producción anden si
 * se entra directo a este puerto, /novedades y todo lo que cuelga de ahí
 * redirige a la misma ruta sin el prefijo.
 */

$raiz = $_SERVER['DOCUMENT_ROOT'];
$ruta = urldecode( parse_url( $_SERVER['REQUEST_URI'], PHP_URL_PATH ) );

if ( preg_match( '#^/novedades(?:/(.*))?$#', $ruta, $m ) ) {
	$consulta = isset( $_SERVER['QUERY_STRING'] ) && $_SERVER['QUERY_STRING'] !== '' ? '?' . $_SERVER['QUERY_STRING'] : '';
	header( 'Location: /' . ( $m[1] ?? '' ) . $consulta, true, 302 );
	header( 'Cache-Control: no-store' );
	exit;
}
$archivo = realpath( $raiz . $ruta );

// No se sirve nada fuera de la carpeta del sitio.
if ( $archivo !== false && strpos( $archivo, realpath( $raiz ) ) !== 0 ) {
	http_response_code( 403 );
	exit;
}

if ( $archivo !== false && is_dir( $archivo ) ) {
	// /wp-admin sin barra final: redirige como haría Apache.
	if ( substr( $ruta, -1 ) !== '/' ) {
		header( 'Location: ' . $ruta . '/' . ( isset( $_SERVER['QUERY_STRING'] ) && $_SERVER['QUERY_STRING'] !== '' ? '?' . $_SERVER['QUERY_STRING'] : '' ), true, 301 );
		exit;
	}
	if ( is_file( $archivo . DIRECTORY_SEPARATOR . 'index.php' ) ) {
		$archivo = $archivo . DIRECTORY_SEPARATOR . 'index.php';
	}
}

if ( $archivo !== false && is_file( $archivo ) ) {
	if ( substr( $archivo, -4 ) === '.php' ) {
		$_SERVER['SCRIPT_FILENAME'] = $archivo;
		$_SERVER['SCRIPT_NAME']     = str_replace( DIRECTORY_SEPARATOR, '/', substr( $archivo, strlen( realpath( $raiz ) ) ) );
		$_SERVER['PHP_SELF']        = $_SERVER['SCRIPT_NAME'];
		chdir( dirname( $archivo ) );
		require $archivo;
		return true;
	}
	return false; // Archivo estático: lo sirve php -S directamente.
}

// Cualquier otra ruta va a WordPress.
$_SERVER['SCRIPT_FILENAME'] = $raiz . '/index.php';
$_SERVER['SCRIPT_NAME']     = '/index.php';
$_SERVER['PHP_SELF']        = '/index.php';
chdir( $raiz );
require $raiz . '/index.php';
