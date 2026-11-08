<?php
/**
 * Archivos de Novedades: categoría (/categoria/<slug>/), etiqueta, autor y fecha. Mismo listado que /novedades/; en
 * las categorías el filtro marca la actual y la primera página lleva la nota destacada de esa categoría.
 *
 * @package Intellihelp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();

if ( is_category() || is_tag() || is_tax() ) {
	$ith_titulo = single_term_title( '', false );
	$ith_bajada = wp_strip_all_tags( (string) term_description() );
} elseif ( is_author() ) {
	$ith_titulo = 'Notas de ' . get_the_author_meta( 'display_name', (int) get_queried_object_id() );
	$ith_bajada = '';
} else {
	$ith_titulo = wp_strip_all_tags( (string) get_the_archive_title() );
	$ith_bajada = '';
}

ith_encabezado_pagina(
	array(
		'rotulo' => 'Novedades',
		'titulo' => $ith_titulo,
		'bajada' => $ith_bajada,
		'id'     => 'novedades-titulo',
		'clase'  => 'page-head--blog',
	)
);

get_template_part(
	'template-parts/blog/listado',
	null,
	array(
		'filtro' => is_category(),
		'vacio'  => 'Todavía no hay notas publicadas en esta sección.',
	)
);

get_template_part(
	'template-parts/blog/cta',
	null,
	array(
		'id'      => 'cta-novedades',
		'seccion' => 'novedades-agendar',
	)
);

get_footer();
