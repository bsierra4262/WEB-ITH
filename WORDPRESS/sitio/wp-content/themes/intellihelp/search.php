<?php
/**
 * Búsqueda (?s=...): mismo listado que Novedades, sin nota destacada ni filtro, con el formulario arriba para buscar
 * otra cosa.
 *
 * @package Intellihelp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();

$ith_total = (int) $GLOBALS['wp_query']->found_posts;

ith_encabezado_pagina(
	array(
		'rotulo' => 'Búsqueda',
		'titulo' => get_search_query() ? 'Resultados para “' . get_search_query( false ) . '”' : 'Buscar en Novedades',
		// Con resultados, cuántos; sin resultados no va bajada: el mensaje está en el cuerpo, debajo del buscador.
		'bajada' => ( get_search_query() && $ith_total ) ? sprintf( 1 === $ith_total ? '%d nota encontrada.' : '%d notas encontradas.', $ith_total ) : '',
		'id'     => 'novedades-titulo',
		'clase'  => 'page-head--blog',
	)
);
?>
<div class="wrap post-search-wrap">
	<form role="search" method="get" class="post-search rv" action="<?php echo esc_url( home_url( '/' ) ); ?>">
		<label class="sr-only" for="buscar-notas">Buscar en Novedades</label>
		<input id="buscar-notas" class="post-search__input" type="search" name="s" value="<?php echo esc_attr( get_search_query() ); ?>" placeholder="Buscar notas">
		<button type="submit" class="btn btn-light btn-sm">Buscar</button>
	</form>
</div>
<?php
get_template_part(
	'template-parts/blog/listado',
	null,
	array(
		'filtro' => false,
		'vacio'  => get_search_query() ? 'No encontramos notas para esta búsqueda. Probá con otras palabras o consultá todas las notas.' : 'Escribí una palabra clave para buscar entre las notas publicadas.',
	)
);

get_template_part(
	'template-parts/blog/cta',
	null,
	array(
		'id'      => 'cta-novedades',
		'seccion' => 'busqueda-agendar',
	)
);

get_footer();
