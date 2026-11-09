<?php
/**
 * Portada del blog: el listado de notas (Ajustes > Lectura, "Tus últimas entradas"; en producción,
 * https://www.intellihelp.tech/novedades/). Encabezado, filtro por categoría, nota destacada, grilla y cierre con el
 * botón a /diagnostico-sin-cargo/ del sitio principal. Las piezas están en template-parts/blog/.
 *
 * @package Intellihelp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();

ith_encabezado_pagina(
	array(
		'rotulo' => 'Novedades',
		'titulo' => 'Novedades, casos y *perspectivas técnicas.*',
		'bajada' => 'Casos de clientes, novedades de la compañía y artículos sobre soporte, redes, seguridad física e infraestructura IT.',
		'id'     => 'novedades-titulo',
		'clase'  => 'page-head--blog',
	)
);

get_template_part( 'template-parts/blog/listado' );

get_template_part(
	'template-parts/blog/cta',
	null,
	array(
		'id'      => 'cta-novedades',
		'seccion' => 'novedades-agendar',
	)
);

get_footer();
