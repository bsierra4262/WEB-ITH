<?php
/**
 * Compartir la nota: LinkedIn, WhatsApp y mail. Enlaces comunes que abren el sitio de cada red con la URL cargada; no
 * se carga ningún script ni botón de terceros.
 *
 * Argumentos: post (WP_Post o ID), clase (variante: post-share--rail en la columna lateral, post-share--fila al final).
 *
 * @package Intellihelp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$ith_post  = get_post( $args['post'] ?? null );
$ith_clase = (string) ( $args['clase'] ?? '' );
if ( ! $ith_post ) {
	return;
}

$ith_iconos = array(
	'linkedin' => '<svg class="ico ico--fill" aria-hidden="true" width="18" height="18" viewBox="0 0 24 24"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>',
	'whatsapp' => ith_icono( 'whatsapp', 18 ),
	'mail'     => ith_icono( 'mail', 18 ),
);
?>
<div class="post-share <?php echo esc_attr( $ith_clase ); ?>">
	<p class="post-share__label">Compartir</p>
	<ul class="post-share__list list-reset">
		<?php foreach ( ith_blog_compartir_enlaces( $ith_post ) as $ith_red ) : ?>
			<li>
				<a class="post-share__btn" href="<?php echo esc_url( $ith_red['url'] ); ?>"<?php echo 'mail' === $ith_red['red'] ? '' : ' target="_blank" rel="noopener"'; ?> data-compartir="<?php echo esc_attr( $ith_red['red'] ); ?>">
					<?php echo $ith_iconos[ $ith_red['red'] ]; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- SVG fijo. ?>
					<span class="sr-only"><?php echo 'mail' === $ith_red['red'] ? 'Compartir por correo electrónico (abre tu programa de correo)' : esc_html( 'Compartir en ' . $ith_red['etiqueta'] . ' (se abre en una pestaña nueva)' ); ?></span>
				</a>
			</li>
		<?php endforeach; ?>
	</ul>
</div>
