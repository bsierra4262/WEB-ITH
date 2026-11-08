<?php
/**
 * Nota destacada: la más reciente, arriba de la grilla y a lo ancho (imagen grande a la izquierda y el texto a la
 * derecha; en celular, una debajo de la otra). Solo en la primera página de Novedades y de cada categoría.
 *
 * Argumentos: post (WP_Post).
 *
 * @package Intellihelp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$ith_post = get_post( $args['post'] ?? null );
if ( ! $ith_post ) {
	return;
}
$ith_cat = ith_blog_categoria( $ith_post );
?>
<article class="post-feature rv" aria-labelledby="destacada-<?php echo esc_attr( $ith_post->ID ); ?>">
	<div class="post-media post-media--feature">
		<?php
		// Es lo primero que se ve en la página: sin lazy y con prioridad alta (LCP).
		echo ith_blog_imagen( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- HTML de WordPress.
			$ith_post,
			'ith-portada',
			array(
				'loading'       => 'eager',
				'fetchpriority' => 'high',
				'sizes'         => '(max-width: 900px) 100vw, 720px',
			)
		);
		?>
	</div>
	<div class="post-feature__body">
		<?php // En celular la categoría baja a su propio renglón: así el rótulo no llega a la columna del WhatsApp flotante. ?>
		<p class="eyebrow post-feature__eyebrow"><span>Destacada<?php if ( $ith_cat ) : ?><span class="post-feature__sep"> · </span><span class="post-feature__cat"><?php echo esc_html( $ith_cat->name ); ?></span><?php endif; ?></span></p>
		<h2 id="destacada-<?php echo esc_attr( $ith_post->ID ); ?>" class="post-feature__title">
			<a class="post-card__link" href="<?php echo esc_url( get_permalink( $ith_post ) ); ?>"><?php echo esc_html( wp_strip_all_tags( get_the_title( $ith_post ) ) ); ?></a>
		</h2>
		<p class="post-feature__excerpt"><?php echo esc_html( ith_blog_extracto( $ith_post, 40 ) ); ?></p>
		<?php get_template_part( 'template-parts/blog/meta', null, array( 'post' => $ith_post ) ); ?>
		<span class="next-link post-feature__more" aria-hidden="true">Leer la nota <span class="arr">→</span></span>
	</div>
</article>
