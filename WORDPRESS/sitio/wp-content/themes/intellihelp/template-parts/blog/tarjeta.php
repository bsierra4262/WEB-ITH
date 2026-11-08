<?php
/**
 * Tarjeta de una nota en la grilla (listado, categorías, búsqueda y "Notas relacionadas").
 *
 * Toda la tarjeta es clickeable: el enlace va en el título y su ::after cubre la tarjeta (un solo enlace por nota para
 * lectores de pantalla). La categoría se muestra como texto, sin enlace, para no anidar enlaces.
 *
 * Argumentos: post (WP_Post o ID), nivel (2 o 3: nivel del título), d (demora de la animación de entrada).
 *
 * @package Intellihelp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$ith_post  = get_post( $args['post'] ?? null );
$ith_nivel = 3 === (int) ( $args['nivel'] ?? 2 ) ? 'h3' : 'h2';
$ith_d     = (string) ( $args['d'] ?? '' );
if ( ! $ith_post ) {
	return;
}
$ith_cat = ith_blog_categoria( $ith_post );
?>
<article class="post-card rv"<?php echo $ith_d ? ' data-d="' . esc_attr( $ith_d ) . '"' : ''; ?>>
	<div class="post-media">
		<?php echo ith_blog_imagen( $ith_post, 'ith-portada', array( 'sizes' => '(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 400px' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- HTML de WordPress. ?>
	</div>
	<div class="post-card__body">
		<?php if ( $ith_cat ) : ?>
			<p class="eyebrow post-card__cat"><?php echo esc_html( $ith_cat->name ); ?></p>
		<?php endif; ?>
		<<?php echo $ith_nivel; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- h2 o h3 fijo. ?> class="post-card__title">
			<a class="post-card__link" href="<?php echo esc_url( get_permalink( $ith_post ) ); ?>"><?php echo esc_html( wp_strip_all_tags( get_the_title( $ith_post ) ) ); ?></a>
		</<?php echo $ith_nivel; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
		<p class="post-card__excerpt"><?php echo esc_html( ith_blog_extracto( $ith_post, 24 ) ); ?></p>
		<?php get_template_part( 'template-parts/blog/meta', null, array( 'post' => $ith_post ) ); ?>
	</div>
</article>
