<?php
/**
 * Tema Intellihelp Novedades: carga de módulos.
 *
 * Este WordPress es solo el blog "Novedades". El sitio principal (home, /diagnostico-sin-cargo/, /postulate/) es HTML
 * aparte; acá se arman los enlaces hacia allá con la "URL del sitio principal" del Personalizador (ith_url_principal()).
 *
 * Cada archivo de inc/ hace una sola cosa. helpers.php va primero porque lo usan todos los demás.
 *
 * - helpers.php     Rutas de assets, años de trayectoria, URLs (sitio principal, agenda, anclas), datos de contacto y CTA.
 * - setup.php       Soportes del tema, CSS/JS, fuente, GTM y el script del <head> que marca .js y .anim.
 * - customizer.php  Apariencia > Personalizar > Intellihelp: URL del sitio principal, contacto y año de fundación.
 * - menu.php        Menú de la barra superior: los mismos ítems que el header del sitio principal.
 * - seo.php         Title, description, canonical, Open Graph y JSON-LD del listado, sin plugin.
 * - template-parts/blog/modulo.php  Funciones del blog, blog.css y JSON-LD BlogPosting de cada nota.
 *
 * @package Intellihelp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'ITH_TEMA_VERSION', '2.0.0' );

require_once get_theme_file_path( 'inc/helpers.php' );
require_once get_theme_file_path( 'inc/setup.php' );
require_once get_theme_file_path( 'inc/customizer.php' );
require_once get_theme_file_path( 'inc/menu.php' );
require_once get_theme_file_path( 'inc/seo.php' );
require_once get_theme_file_path( 'template-parts/blog/modulo.php' );
