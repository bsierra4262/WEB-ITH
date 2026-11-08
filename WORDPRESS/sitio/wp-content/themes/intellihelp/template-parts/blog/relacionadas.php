<?php
/**
 * "Notas relacionadas": hasta 3 notas de la misma categoría (o las más recientes) al final de cada nota.
 *
 * Argumentos: post (ID de la nota actual).
 *
 * @package Intellihelp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$ith_id    = (int) ( $args['post'] ?? get_the_ID() );
$ith_notas = ith_blog_relacionadas( $ith_id, 3 );
if ( ! $ith_notas ) {
	return;
}
?>
<section class="section bg-white post-related" aria-labelledby="relacionadas-titulo">
	<div class="wrap">
		<div class="post-related__head">
			<div class="section-head rv rv-seq">
				<p class="eyebrow">Blog</p>
				<h2 id="relacionadas-titulo" class="section-title">Notas relacionadas</h2>
			</div>
			<a class="next-link rv" href="<?php echo esc_url( ith_url_novedades() ); ?>">Ver todas las notas <span class="arr" aria-hidden="true">→</span></a>
		</div>
		<div class="post-grid">
			<?php
			foreach ( $ith_notas as $ith_i => $ith_nota ) {
				get_template_part(
					'template-parts/blog/tarjeta',
					null,
					array(
						'post'  => $ith_nota,
						'nivel' => 3,
						'd'     => (string) ( $ith_i * 0.08 ),
					)
				);
			}
			?>
		</div>
	</div>
</section>
