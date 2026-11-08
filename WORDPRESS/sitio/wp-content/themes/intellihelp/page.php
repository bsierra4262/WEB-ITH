<?php
/**
 * Página común, por si algún día se carga una página en el admin: encabezado con el título y el contenido del editor
 * con el estilo de texto de las notas (.prose). Hoy el blog no tiene páginas: la home, /diagnostico-sin-cargo/,
 * /postulate/ y /privacidad/ son del sitio principal (HTML), no de WordPress.
 *
 * @package Intellihelp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();

while ( have_posts() ) :
	the_post();
	ith_encabezado_pagina(
		array(
			'titulo' => get_the_title(),
			'bajada' => has_excerpt() ? get_the_excerpt() : '',
		)
	);
	?>
	<section class="section page-body bg-white">
		<div class="wrap">
			<article id="post-<?php the_ID(); ?>" <?php post_class( 'prose' ); ?>>
				<?php
				the_content();
				wp_link_pages(
					array(
						'before' => '<nav class="page-links" aria-label="Páginas">',
						'after'  => '</nav>',
					)
				);
				?>
			</article>
		</div>
	</section>
	<?php
endwhile;

get_footer();
