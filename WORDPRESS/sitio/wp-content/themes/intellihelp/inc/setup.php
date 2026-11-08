<?php
/**
 * Soportes del tema, CSS/JS, fuente, Google Tag Manager y el script del <head>.
 *
 * - main.css trae solo lo común con el sitio principal (fuente, tokens, botones, header, pie, encabezados, texto de
 *   las notas, cierre y revelados). No se carga el CSS de la home.
 * - En <html>: clase `js` (hay JavaScript), `anim` (hay IntersectionObserver y no se pidió reducir movimiento) y
 *   data-pagina="novedades|entrada|pagina|404" y data-principal (URL del sitio principal, la usa main.js para medir
 *   internal_nav). Las pone el script inline del <head> antes del primer pintado.
 * - Ganchos para el movimiento del sitio principal, si algún día se suma al blog: acción `ith_head_temprano` (dentro de
 *   ese mismo script, antes del primer pintado) y `ith_body_inicio` (justo después de <body>). Si existen
 *   assets/css/motion.css y assets/js/motion.js se cargan solos, después de main.css y main.js. Hoy no existen.
 *
 * @package Intellihelp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const ITH_GTM_ID = 'GTM-54S82VL3';

add_action(
	'after_setup_theme',
	static function (): void {
		add_theme_support( 'title-tag' );
		add_theme_support( 'post-thumbnails' );
		add_theme_support( 'automatic-feed-links' );
		add_theme_support( 'responsive-embeds' );
		add_theme_support(
			'html5',
			array( 'search-form', 'gallery', 'caption', 'style', 'script', 'navigation-widgets' )
		);
		// Foto de portada de las notas: 16:9.
		add_image_size( 'ith-portada', 1280, 720, true );
	}
);

/* ---------- CSS y JS ---------- */
add_action(
	'wp_enqueue_scripts',
	static function (): void {
		wp_enqueue_style( 'ith-main', ith_asset( 'css/main.css' ), array(), ith_version( 'css/main.css' ) );
		wp_enqueue_script(
			'ith-main',
			ith_asset( 'js/main.js' ),
			array(),
			ith_version( 'js/main.js' ),
			array(
				'strategy'  => 'defer',
				'in_footer' => false,
			)
		);

		// Animación de carga común del sitio (copia de TEMPLATE-NICO/css/carga.css y js/carga.js): el script va en el
		// <head> sin defer, para poner html.m-intro antes del primer pintado. main.js espera su aviso ith:intro-salida.
		wp_enqueue_style( 'ith-carga', ith_asset( 'css/carga.css' ), array( 'ith-main' ), ith_version( 'css/carga.css' ) );
		wp_enqueue_script( 'ith-carga', ith_asset( 'js/carga.js' ), array(), ith_version( 'js/carga.js' ), array( 'in_footer' => false ) );

		if ( file_exists( get_theme_file_path( 'assets/css/motion.css' ) ) ) {
			wp_enqueue_style( 'ith-motion', ith_asset( 'css/motion.css' ), array( 'ith-main' ), ith_version( 'css/motion.css' ) );
		}
		if ( file_exists( get_theme_file_path( 'assets/js/motion.js' ) ) ) {
			wp_enqueue_script(
				'ith-motion',
				ith_asset( 'js/motion.js' ),
				array( 'ith-main' ),
				ith_version( 'js/motion.js' ),
				array(
					'strategy'  => 'defer',
					'in_footer' => false,
				)
			);
		}

		// Los listados no usan bloques: sin los estilos del editor. Las notas y las páginas sí los necesitan.
		if ( ! is_singular() ) {
			wp_dequeue_style( 'wp-block-library' );
			wp_dequeue_style( 'wp-block-library-theme' );
			wp_dequeue_style( 'classic-theme-styles' );
			wp_dequeue_style( 'global-styles' );
		}
	},
	20
);

/* ---------- <head>: lo que tiene que estar antes del primer pintado ---------- */
add_action(
	'wp_head',
	static function (): void {
		?>
<script>
/* Antes del primer pintado: marca que hay JS y habilita las animaciones de entrada (sin "reducir movimiento"). */
(function (root) {
  root.classList.add('js');
  root.dataset.pagina = <?php echo wp_json_encode( ith_tipo_pagina() ); ?>;
  root.dataset.principal = <?php echo wp_json_encode( ith_url_principal(), JSON_UNESCAPED_SLASHES ); ?>;
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) root.classList.add('anim');
})(document.documentElement);
</script>
		<?php
		do_action( 'ith_head_temprano' );
		?>
<!-- Google Tag Manager (<?php echo esc_html( ITH_GTM_ID ); ?>). GA4 y Clarity se cargan desde el contenedor: no agregar gtag.js ni otros snippets a mano. -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer',<?php echo wp_json_encode( ITH_GTM_ID ); ?>);</script>
<!-- End Google Tag Manager -->
<link rel="preload" href="<?php echo esc_url( ith_asset( 'fonts/saira-latin.woff2' ) ); ?>" as="font" type="font/woff2" crossorigin>
<meta name="theme-color" content="#2A2A2A">
		<?php
		if ( ! has_site_icon() ) :
			?>
<link rel="icon" href="<?php echo esc_url( ith_img( 'favicon-32.png' ) ); ?>" type="image/png" sizes="32x32">
<link rel="apple-touch-icon" href="<?php echo esc_url( ith_img( 'apple-touch-icon.png' ) ); ?>">
			<?php
		endif;
	},
	1
);

/* ---------- Justo después de <body> ---------- */
add_action(
	'wp_body_open',
	static function (): void {
		?>
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=<?php echo esc_attr( ITH_GTM_ID ); ?>" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
		<?php
		do_action( 'ith_body_inicio' );
	},
	1
);

/** Tipo de pantalla para data-pagina en <html>. */
function ith_tipo_pagina(): string {
	if ( is_home() || is_archive() || is_search() ) {
		return 'novedades';
	}
	if ( is_singular( 'post' ) ) {
		return 'entrada';
	}
	if ( is_404() ) {
		return '404';
	}
	if ( is_page() ) {
		return 'pagina';
	}
	return 'otra';
}

/* ---------- Limpieza del <head> ---------- */
remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_print_styles', 'print_emoji_styles' );
remove_action( 'wp_head', 'wp_generator' );
remove_action( 'wp_head', 'wlwmanifest_link' );
remove_action( 'wp_head', 'rsd_link' );
remove_action( 'wp_head', 'wp_shortlink_wp_head' );
remove_action( 'wp_head', 'rel_canonical' ); // el canonical lo pone inc/seo.php en todas las pantallas.

/* ---------- Clases de <body> ---------- */
add_filter(
	'body_class',
	static function ( array $clases ): array {
		$clases[] = 'ith';
		return $clases;
	}
);

/* ---------- Extracto: corto y sin "[...]" ---------- */
add_filter( 'excerpt_length', static fn() => 28 );
add_filter( 'excerpt_more', static fn() => '…' );
