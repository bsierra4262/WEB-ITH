<?php
/**
 * Página no encontrada: enlaces al inicio del sitio principal, a "Qué ofrecemos" y al blog, y el botón a
 * /diagnostico-sin-cargo/.
 *
 * @package Intellihelp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();

ith_encabezado_pagina(
	array(
		'rotulo' => 'Error 404',
		'titulo' => 'No encontramos *esta página.*',
		'bajada' => 'Es posible que la dirección haya cambiado con la actualización del sitio o que contenga un error. Podés continuar desde las secciones principales.',
	)
);
?>
<section class="section page-body bg-white">
	<div class="wrap">
		<ul class="links-404 list-reset rv">
			<li><a class="next-link" href="<?php echo esc_url( ith_principal( '/' ) ); ?>">Ir al inicio <span class="arr" aria-hidden="true">→</span></a></li>
			<li><a class="next-link" href="<?php echo esc_url( ith_ancla( 'que-ofrecemos' ) ); ?>">Ver qué ofrecemos <span class="arr" aria-hidden="true">→</span></a></li>
			<li><a class="next-link" href="<?php echo esc_url( ith_url_novedades() ); ?>">Ir al blog <span class="arr" aria-hidden="true">→</span></a></li>
		</ul>
		<div class="section-cta rv">
			<?php ith_cta( 'cta-404', '404-agendar' ); ?>
			<p class="section-cta__note">El relevamiento y la propuesta no tienen costo.</p>
		</div>
	</div>
</section>
<?php
get_footer();
