<?php
/**
 * Plantilla de respaldo: la usa WordPress cuando no hay una más específica (listados, búsquedas, archivos). Novedades
 * (home.php), la nota (single.php) y los archivos (archive.php) tienen su propia plantilla; esta solo evita que una
 * URL inesperada se vea rota.
 *
 * @package Intellihelp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();

ith_encabezado_pagina(
	array(
		'rotulo' => is_search() ? 'Búsqueda' : 'Novedades',
		'titulo' => is_search() ? 'Resultados para “' . get_search_query( false ) . '”' : wp_strip_all_tags( (string) ( is_archive() ? get_the_archive_title() : 'Novedades' ) ),
	)
);
?>
<section class="section page-body bg-white">
	<div class="wrap">
		<?php if ( have_posts() ) : ?>
			<ul class="post-list list-reset">
				<?php
				while ( have_posts() ) :
					the_post();
					?>
					<li <?php post_class( 'post-list__item' ); ?>>
						<p class="post-list__date"><time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo esc_html( get_the_date() ); ?></time></p>
						<h2 class="post-list__title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
						<p class="post-list__excerpt"><?php echo esc_html( wp_strip_all_tags( get_the_excerpt() ) ); ?></p>
					</li>
				<?php endwhile; ?>
			</ul>
			<?php
			the_posts_pagination(
				array(
					'mid_size'           => 1,
					'prev_text'          => '<span aria-hidden="true">←</span><span class="post-pager__txt">Anteriores</span>',
					'next_text'          => '<span class="post-pager__txt">Siguientes</span><span aria-hidden="true">→</span>',
					'screen_reader_text' => 'Más páginas',
					'class'              => 'post-pager',
				)
			);
			?>
		<?php else : ?>
			<p class="lead">Todavía no hay notas publicadas en esta sección.</p>
			<p><a class="next-link" href="<?php echo esc_url( ith_url_novedades() ); ?>">Volver al blog <span class="arr" aria-hidden="true">→</span></a></p>
		<?php endif; ?>
	</div>
</section>
<?php
get_footer();
