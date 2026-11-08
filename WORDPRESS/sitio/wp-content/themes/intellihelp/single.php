<?php
/**
 * Nota de Novedades: volver a Novedades, categoría, título grande, autor, fecha y tiempo de lectura, imagen destacada a
 * lo ancho, el texto en una columna de lectura con "Compartir" al costado (en celular, al final), "Notas relacionadas" y el
 * cierre con el botón a /diagnostico-sin-cargo/. El JSON-LD BlogPosting lo agrega template-parts/blog/modulo.php.
 *
 * @package Intellihelp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();

while ( have_posts() ) :
	the_post();
	$ith_cat = ith_blog_categoria();
	?>
	<article id="post-<?php the_ID(); ?>" <?php post_class( 'post-single' ); ?> aria-labelledby="nota-titulo">
		<header class="post-hero">
			<div class="wrap">
				<div class="post-hero__head rv rv-seq">
					<p class="post-hero__crumbs">
						<a class="post-hero__back" href="<?php echo esc_url( ith_url_novedades() ); ?>"><span aria-hidden="true">←</span> Novedades</a>
						<?php if ( $ith_cat ) : ?>
							<span aria-hidden="true">/</span>
							<a href="<?php echo esc_url( get_category_link( $ith_cat ) ); ?>"><?php echo esc_html( $ith_cat->name ); ?></a>
						<?php endif; ?>
					</p>
					<h1 id="nota-titulo" class="post-hero__title"><?php echo esc_html( wp_strip_all_tags( get_the_title() ) ); ?></h1>
					<?php if ( has_excerpt() ) : ?>
						<p class="post-hero__lead"><?php echo esc_html( get_the_excerpt() ); ?></p>
					<?php endif; ?>
					<?php
					get_template_part(
						'template-parts/blog/meta',
						null,
						array(
							'post'  => get_post(),
							'autor' => true,
							'clase' => 'post-meta--hero',
						)
					);
					?>
				</div>
			</div>
		</header>

		<div class="wrap">
			<figure class="post-media post-media--hero rv">
				<?php
				echo ith_blog_imagen( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- HTML de WordPress.
					get_post(),
					'full',
					array(
						'loading'       => 'eager',
						'fetchpriority' => 'high',
						'sizes'         => '(max-width: 1240px) 100vw, 1160px',
					)
				);
				$ith_leyenda = has_post_thumbnail() ? wp_get_attachment_caption( (int) get_post_thumbnail_id() ) : '';
				if ( $ith_leyenda ) :
					?>
					<figcaption><?php echo esc_html( $ith_leyenda ); ?></figcaption>
				<?php endif; ?>
			</figure>
		</div>

		<div class="wrap post-layout">
			<aside class="post-layout__rail rv" aria-label="Compartir esta nota">
				<?php
				get_template_part(
					'template-parts/blog/compartir',
					null,
					array(
						'post'  => get_post(),
						'clase' => 'post-share--rail',
					)
				);
				?>
			</aside>
			<div class="post-layout__body">
				<div class="prose post-prose">
					<?php
					the_content();
					wp_link_pages(
						array(
							'before' => '<nav class="page-links" aria-label="Páginas de la nota">',
							'after'  => '</nav>',
						)
					);
					?>
				</div>
				<footer class="post-end rv">
					<?php
					$ith_etiquetas = get_the_tags();
					if ( $ith_etiquetas ) :
						?>
						<ul class="chips list-reset post-end__tags" aria-label="Etiquetas">
							<?php foreach ( $ith_etiquetas as $ith_tag ) : ?>
								<li><a class="chip" href="<?php echo esc_url( get_tag_link( $ith_tag ) ); ?>"><?php echo esc_html( $ith_tag->name ); ?></a></li>
							<?php endforeach; ?>
						</ul>
					<?php endif; ?>
					<?php
					get_template_part(
						'template-parts/blog/compartir',
						null,
						array(
							'post'  => get_post(),
							'clase' => 'post-share--fila',
						)
					);
					?>
				</footer>
			</div>
		</div>
	</article>
	<?php
	get_template_part( 'template-parts/blog/relacionadas', null, array( 'post' => get_the_ID() ) );
endwhile;

get_template_part(
	'template-parts/blog/cta',
	null,
	array(
		'id'      => 'cta-nota',
		'seccion' => 'nota-agendar',
		'titulo'  => 'Conversemos sobre *tu proyecto.*',
	)
);

get_footer();
