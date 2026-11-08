<?php
/**
 * Filtro por categoría arriba del listado: "Todas las notas" y una pastilla por categoría con notas. En el listado
 * general queda marcada "Todas las notas"; en una categoría, la suya (en violeta, aria-current="page"). Para volver al
 * listado completo está "Todas las notas", así que la activa no lleva "×". La regla de no tener una opción "Todos"
 * aplica solo a los selectores de Casos y Clientes de la home, no a este filtro.
 * Son enlaces comunes (cada categoría tiene su URL, /categoria/<slug>/), así se pueden compartir y los indexa Google.
 *
 * @package Intellihelp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$ith_cats   = get_categories(
	array(
		'hide_empty' => true,
		'orderby'    => 'name',
	)
);
$ith_actual = is_category() ? get_queried_object_id() : 0;
if ( count( $ith_cats ) < 2 && ! $ith_actual ) {
	return; // Con una sola categoría el filtro no aporta nada.
}
?>
<nav class="post-filter rv" aria-label="Categorías de Novedades">
	<ul class="post-filter__list list-reset">
		<li><a class="post-filter__item" href="<?php echo esc_url( ith_url_novedades() ); ?>"<?php echo is_home() ? ' aria-current="page"' : ''; ?>>Todas las notas</a></li>
		<?php foreach ( $ith_cats as $ith_cat ) : ?>
			<li><a class="post-filter__item" href="<?php echo esc_url( get_category_link( $ith_cat ) ); ?>"<?php echo (int) $ith_cat->term_id === $ith_actual ? ' aria-current="page"' : ''; ?>><?php echo esc_html( $ith_cat->name ); ?></a></li>
		<?php endforeach; ?>
	</ul>
</nav>
