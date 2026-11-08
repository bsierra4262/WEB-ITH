<?php
/**
 * Menú de la barra superior: los mismos ítems y el mismo marcado que el header del sitio principal
 * (TEMPLATE-NICO/index.html, entre header:inicio y header:fin).
 *
 * Qué ofrecemos · Quiénes somos · Casos · Blog · FAQ · Postulate. Las secciones de la home y Postulate apuntan al sitio
 * principal (ith_url_principal()); Blog es la portada de este WordPress y queda siempre marcado (aria-current="page"),
 * porque todo el WordPress es el blog. El botón "Agendá reunión" no es parte del menú: lo imprime header.php.
 *
 * El menú va en código y no en Apariencia > Menús a propósito: tiene que quedar igual al del HTML.
 *
 * @package Intellihelp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Ítems del menú principal, en orden: [ título, URL, ¿es la sección actual? ]. */
function ith_menu_items(): array {
	return array(
		array( 'Qué ofrecemos', ith_ancla( 'que-ofrecemos' ), false ),
		array( 'Quiénes somos', ith_ancla( 'quienes-somos' ), false ),
		array( 'Casos', ith_ancla( 'casos' ), false ),
		array( 'Blog', ith_url_novedades(), true ),
		array( 'FAQ', ith_ancla( 'preguntas' ), false ),
		array( 'Postulate', ith_principal( '/postulate/' ), false ),
	);
}

/** Imprime el menú principal (lo usa header.php). */
function ith_menu_principal(): void {
	echo '<ul class="list-reset">';
	foreach ( ith_menu_items() as $item ) {
		printf(
			'<li><a href="%1$s"%3$s>%2$s</a></li>',
			esc_url( $item[1] ),
			esc_html( $item[0] ),
			$item[2] ? ' aria-current="page"' : ''
		);
	}
	echo '</ul>';
}
