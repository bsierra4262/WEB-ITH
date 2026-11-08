<?php
/**
 * Línea de datos de una nota: fecha y tiempo de lectura (y el autor, si se pide).
 *
 * Argumentos: post (WP_Post o ID), autor (bool), clase (string).
 *
 * @package Intellihelp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$ith_post  = get_post( $args['post'] ?? null );
$ith_autor = ! empty( $args['autor'] );
$ith_clase = (string) ( $args['clase'] ?? '' );
if ( ! $ith_post ) {
	return;
}
?>
<p class="post-meta <?php echo esc_attr( $ith_clase ); ?>">
	<?php if ( $ith_autor ) : ?>
		<span class="post-meta__autor">Por <?php echo esc_html( get_the_author_meta( 'display_name', (int) $ith_post->post_author ) ); ?></span>
	<?php endif; ?>
	<time datetime="<?php echo esc_attr( get_the_date( 'c', $ith_post ) ); ?>"><?php echo esc_html( wp_date( 'j \d\e F \d\e Y', get_post_timestamp( $ith_post ) ) ); ?></time>
	<span><?php echo esc_html( ith_blog_minutos( $ith_post ) ); ?> min de lectura</span>
</p>
