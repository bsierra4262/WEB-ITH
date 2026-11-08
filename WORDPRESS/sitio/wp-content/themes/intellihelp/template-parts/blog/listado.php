<?php
/**
 * Cuerpo del listado de Novedades (lo usan home.php, archive.php y search.php): filtro por categoría, nota destacada,
 * grilla de 3 columnas, paginación (flechas a los costados, ver blog.css) y estado vacío.
 *
 * Argumentos: filtro (bool, muestra las categorías), vacio (texto cuando no hay notas).
 *
 * @package Intellihelp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$ith_filtro    = $args['filtro'] ?? true;
$ith_vacio     = (string) ( $args['vacio'] ?? 'Todavía no hay notas publicadas en esta sección.' );
$ith_destacada = ith_blog_destacada();
?>
<section class="section page-body bg-white blog-list" aria-label="Notas">
	<div class="wrap">
		<?php
		if ( $ith_filtro ) {
			get_template_part( 'template-parts/blog/categorias' );
		}

		if ( $ith_destacada ) {
			get_template_part( 'template-parts/blog/destacada', null, array( 'post' => $ith_destacada ) );
		}

		if ( have_posts() ) :
			?>
			<div class="post-grid">
				<?php
				$ith_i = 0;
				while ( have_posts() ) :
					the_post();
					get_template_part(
						'template-parts/blog/tarjeta',
						null,
						array(
							'post' => get_post(),
							'd'    => (string) ( ( $ith_i % 3 ) * 0.08 ),
						)
					);
					++$ith_i;
				endwhile;
				?>
			</div>
			<?php
			the_posts_pagination(
				array(
					'mid_size'           => 1,
					'prev_text'          => '<span aria-hidden="true">←</span><span class="post-pager__txt">Anteriores</span>',
					'next_text'          => '<span class="post-pager__txt">Siguientes</span><span aria-hidden="true">→</span>',
					'screen_reader_text' => 'Más notas',
					'class'              => 'post-pager',
				)
			);
		elseif ( ! $ith_destacada ) :
			?>
			<div class="post-empty rv">
				<span class="icon-circle" aria-hidden="true"><svg class="ico" width="26" height="26" viewBox="0 0 24 24" stroke-width="1.8"><path d="M5 4h11l3 3v13H5z"/><path d="M9 10h6M9 14h6M9 18h3"/></svg></span>
				<p class="post-empty__text"><?php echo esc_html( $ith_vacio ); ?></p>
				<a class="next-link" href="<?php echo esc_url( ith_url_novedades() ); ?>">Ver todas las notas <span class="arr" aria-hidden="true">→</span></a>
			</div>
			<?php
		endif;
		?>
	</div>
</section>
