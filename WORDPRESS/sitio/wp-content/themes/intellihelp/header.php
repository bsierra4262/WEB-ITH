<?php
/**
 * Cabecera común: <head> y barra superior. Es la copia del header del sitio principal (TEMPLATE-NICO/index.html,
 * entre header:inicio y header:fin): barra carbón, menú en mayúsculas espaciadas y CTA lima, con el mismo marcado y
 * las mismas clases; los enlaces se arman sobre la URL del sitio principal (Apariencia > Personalizar > Intellihelp >
 * Sitio principal) y "Blog" queda marcado (aria-current="page", en lima). Si cambia allá, se cambia acá igual.
 * Abre <main id="contenido">, que cierra footer.php.
 *
 * @package Intellihelp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link" href="#contenido">Saltar al contenido</a>

<header id="inicio" class="site-header">
  <div class="wrap site-header__inner">
    <a href="<?php echo esc_url( ith_principal( '/' ) ); ?>" class="brand" aria-label="Intellihelp, volver al inicio">
      <img src="<?php echo esc_url( ith_img( 'logo-intellihelp.png' ) ); ?>" alt="ITH, Intellihelp" width="74" height="40">
      <span class="brand__tag"><span>Servicios IT</span><span>desde <?php echo esc_html( (string) ith_fundacion() ); ?></span></span>
    </a>
    <nav id="menu" class="nav" aria-label="Principal">
      <?php ith_menu_principal(); ?>
      <?php ith_cta( 'cta-header', 'header-agendar', array( 'clase' => 'btn btn-lime btn-sm site-header__cta' ) ); ?>
    </nav>
    <button type="button" class="nav-toggle" aria-expanded="false" aria-controls="menu" data-nav-toggle>
      <span class="nav-toggle__bars" aria-hidden="true"><span></span><span></span><span></span></span>
      <span class="sr-only">Menú</span>
    </button>
  </div>
</header>

<main id="contenido">
