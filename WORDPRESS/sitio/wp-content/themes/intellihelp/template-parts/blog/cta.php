<?php
/**
 * Cierre de Novedades y de cada nota: card carbón con el botón a /diagnostico-sin-cargo/ (mismo lenguaje que el
 * cierre de la home: ícono de calendario, mismas frases y WhatsApp).
 *
 * Argumentos: id (id del botón, para medir cta_click), seccion (data-cta), titulo.
 *
 * @package Intellihelp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$ith_id      = (string) ( $args['id'] ?? 'cta-novedades' );
$ith_seccion = (string) ( $args['seccion'] ?? 'novedades-agendar' );
$ith_titulo  = (string) ( $args['titulo'] ?? 'Agendá una reunión' );
?>
<section class="section bg-gray blog-cta" aria-labelledby="<?php echo esc_attr( $ith_id ); ?>-titulo">
	<div class="wrap">
		<div class="cta-card card-dark closing rv rv-seq">
			<div class="closing__text">
				<span class="icon-circle" aria-hidden="true"><svg class="ico" aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" stroke-width="1.8"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M8 3v4"/><path d="M16 3v4"/></svg></span>
				<h2 id="<?php echo esc_attr( $ith_id ); ?>-titulo" class="cta-card__title"><?php echo ith_texto( $ith_titulo ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- ith_texto() escapa. ?></h2>
				<p class="closing__free"><?php echo ith_icono( 'check', 20 ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- SVG fijo. ?>El relevamiento y la propuesta no tienen costo.</p>
				<p class="closing__lead">Elegí el día y el horario que te resulten convenientes y conversemos sobre las necesidades de <span class="hl">tu organización.</span></p>
			</div>
			<div class="closing__actions">
				<?php ith_cta( $ith_id, $ith_seccion ); ?>
				<a href="<?php echo esc_url( ith_url_whatsapp() ); ?>" target="_blank" rel="noopener" class="btn btn-gray closing__wa"><?php echo ith_icono( 'whatsapp', 20 ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- SVG fijo. ?>Contactanos por WhatsApp<span class="sr-only"> (se abre en una pestaña nueva)</span></a>
			</div>
		</div>
	</div>
</section>
