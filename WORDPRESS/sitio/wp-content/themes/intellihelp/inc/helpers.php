<?php
/**
 * Funciones para las plantillas. Todas llevan el prefijo ith_. Ver README-TEMA.md.
 *
 * @package Intellihelp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/* ---------------------------------------------------------------------------------------------------------------
 * Assets del tema
 * ------------------------------------------------------------------------------------------------------------- */

/** URL de un archivo dentro de assets/ (por ejemplo ith_asset( 'css/blog.css' )). */
function ith_asset( string $ruta ): string {
	return get_theme_file_uri( 'assets/' . ltrim( $ruta, '/' ) );
}

/** URL de una imagen de assets/img/ (por ejemplo ith_img( 'logo-intellihelp.png' )). */
function ith_img( string $ruta ): string {
	return ith_asset( 'img/' . ltrim( $ruta, '/' ) );
}

/** Versión de un asset para el cache: fecha de modificación del archivo (o la del tema si no existe). */
function ith_version( string $ruta ): string {
	$archivo = get_theme_file_path( 'assets/' . ltrim( $ruta, '/' ) );
	return file_exists( $archivo ) ? (string) filemtime( $archivo ) : ITH_TEMA_VERSION;
}

/* ---------------------------------------------------------------------------------------------------------------
 * Datos editables (Personalizador)
 * ------------------------------------------------------------------------------------------------------------- */

/**
 * Valores por defecto de lo editable desde Apariencia > Personalizar > Intellihelp. Son los mismos datos que el header,
 * el pie y el JSON-LD del sitio principal. `ith_url_principal` vacío = automático (ver ith_url_principal()).
 */
function ith_defaults(): array {
	return array(
		'ith_url_principal' => '',
		'ith_fundacion'     => 2010,
		'ith_telefono'      => '+54 11 7700-6868',
		'ith_whatsapp'      => '+54 9 11 5027-4827',
		'ith_mail'          => 'info@intellihelp.tech',
		'ith_mail_rrhh'     => 'rrhh@intellihelp.tech',
		'ith_direccion'     => 'Av. Dorrego 1789, piso 6, of. 604',
		'ith_codigo_postal' => 'C1414CKM',
		'ith_ciudad'        => 'CABA',
		'ith_horario'       => 'Lunes a viernes de 9 a 18',
		'ith_linkedin'      => 'https://www.linkedin.com/company/intellihelp/',
	);
}

/** Valor editable con su respaldo por defecto. Un campo vaciado en el Personalizador vuelve al valor por defecto. */
function ith_opt( string $clave ) {
	$defaults = ith_defaults();
	$valor    = get_theme_mod( $clave, $defaults[ $clave ] ?? '' );
	if ( '' === $valor || null === $valor ) {
		$valor = $defaults[ $clave ] ?? '';
	}
	return $valor;
}

/**
 * Texto listo para imprimir: escapa el HTML, reemplaza {anios} y convierte *palabra* en el resaltador
 * (<span class="hl">). Devuelve HTML seguro.
 */
function ith_texto( string $texto ): string {
	$html = esc_html( str_replace( '{anios}', (string) ith_anios(), $texto ) );
	return (string) preg_replace( '/\*([^*]+)\*/u', '<span class="hl">$1</span>', $html );
}

/* ---------------------------------------------------------------------------------------------------------------
 * Trayectoria
 * ------------------------------------------------------------------------------------------------------------- */

/** Año de fundación (2010: el 10 de marzo nace Intellihelp). */
function ith_fundacion(): int {
	$anio = (int) ith_opt( 'ith_fundacion' );
	return $anio > 1990 ? $anio : 2010;
}

/** Años de trayectoria: año actual menos el de fundación (16 en 2026). */
function ith_anios(): int {
	// Fundación: 10/03/2010. Entre el 1/1 y el 9/3 todavía no se cumplió el año.
	$anios = (int) wp_date( 'Y' ) - ith_fundacion();
	if ( (int) wp_date( 'md' ) < 310 ) {
		--$anios;
	}
	return max( 1, $anios );
}

/* ---------------------------------------------------------------------------------------------------------------
 * URLs
 * ------------------------------------------------------------------------------------------------------------- */

/** ¿WordPress corre en la máquina local (127.0.0.1, localhost o *.local)? */
function ith_es_local(): bool {
	$host = strtolower( (string) wp_parse_url( home_url(), PHP_URL_HOST ) );
	return in_array( $host, array( '127.0.0.1', 'localhost', '::1' ), true ) || str_ends_with( $host, '.local' );
}

/**
 * URL del sitio principal (el HTML con la home, /diagnostico-sin-cargo/ y /postulate/), sin barra final.
 * Sale del Personalizador; si está vacío: http://127.0.0.1:5174 en local (Vite de TEMPLATE-NICO) y, en el hosting,
 * el mismo dominio del blog (https://www.intellihelp.tech cuando el blog está en /novedades/).
 */
function ith_url_principal(): string {
	$url = trim( (string) get_theme_mod( 'ith_url_principal', '' ) );
	if ( '' === $url ) {
		if ( ith_es_local() ) {
			$url = 'http://127.0.0.1:5174';
		} else {
			$partes = wp_parse_url( home_url() );
			$url    = ( $partes['scheme'] ?? 'https' ) . '://' . ( $partes['host'] ?? 'www.intellihelp.tech' ) . ( isset( $partes['port'] ) ? ':' . $partes['port'] : '' );
		}
	}
	return untrailingslashit( $url );
}

/** URL dentro del sitio principal: ith_principal( '/#casos' ), ith_principal( '/postulate/' ). */
function ith_principal( string $ruta = '/' ): string {
	return ith_url_principal() . '/' . ltrim( $ruta, '/' );
}

/** Destino de todos los "Agendá reunión": /diagnostico-sin-cargo/ del sitio principal. */
function ith_url_agendar(): string {
	return (string) apply_filters( 'ith_url_agendar', ith_principal( '/diagnostico-sin-cargo/' ) );
}

/** Portada del blog (el listado de notas). */
function ith_url_novedades(): string {
	return home_url( '/' );
}

/** Ancla de una sección de la home del sitio principal: ith_ancla( 'casos' ) → <principal>/#casos. */
function ith_ancla( string $id ): string {
	return ith_principal( '/#' . ltrim( $id, '#' ) );
}

/** Enlace de WhatsApp (wa.me con solo los dígitos del número del Personalizador). */
function ith_url_whatsapp(): string {
	return 'https://wa.me/' . preg_replace( '/\D+/', '', (string) ith_opt( 'ith_whatsapp' ) );
}

/** href tel: del teléfono del Personalizador. */
function ith_url_telefono(): string {
	return 'tel:' . preg_replace( '/[^\d+]+/', '', (string) ith_opt( 'ith_telefono' ) );
}

/* ---------------------------------------------------------------------------------------------------------------
 * Piezas de marcado reutilizables
 * ------------------------------------------------------------------------------------------------------------- */

/**
 * Botón "Agendá reunión" con medición. Cada CTA lleva un id único y data-cta (GTM lo usa como trigger de clic y
 * main.js publica cta_click en el dataLayer).
 *
 * @param string $id      id único del botón (por ejemplo 'cta-nota').
 * @param string $seccion valor de data-cta (por ejemplo 'nota-agendar').
 * @param array  $args    label, clase (clases del botón), flecha (bool), url.
 */
function ith_cta( string $id, string $seccion, array $args = array() ): void {
	$args = wp_parse_args(
		$args,
		array(
			'label'  => 'Agendá reunión',
			'clase'  => 'btn btn-lime',
			'flecha' => true,
			'url'    => ith_url_agendar(),
		)
	);
	printf(
		'<a id="%1$s" data-cta="%2$s" href="%3$s" class="%4$s">%5$s%6$s</a>',
		esc_attr( $id ),
		esc_attr( $seccion ),
		esc_url( $args['url'] ),
		esc_attr( $args['clase'] ),
		esc_html( $args['label'] ),
		$args['flecha'] ? ' <span class="arr" aria-hidden="true">→</span>' : ''
	);
}

/** Íconos SVG chicos que se repiten (trazo; el color sale de `color`). */
function ith_icono( string $nombre, int $tam = 20 ): string {
	$trazos = array(
		'check' => '<path d="M20 6 9 17l-5-5"/>',
		'mail'  => '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
	);
	if ( 'whatsapp' === $nombre ) {
		return '<svg class="ico ico--fill" aria-hidden="true" width="' . $tam . '" height="' . $tam . '" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>';
	}
	if ( ! isset( $trazos[ $nombre ] ) ) {
		return '';
	}
	return '<svg class="ico" aria-hidden="true" width="' . $tam . '" height="' . $tam . '" viewBox="0 0 24 24" stroke-width="2.2">' . $trazos[ $nombre ] . '</svg>';
}

/**
 * Encabezado de pantalla del blog (listado, categoría, búsqueda, 404): rótulo, título grande y bajada, con el mismo
 * lenguaje que los encabezados de sección del sitio principal.
 *
 * @param array $args rotulo, titulo, bajada (texto plano; *palabra* resalta), id del título, clase extra.
 */
function ith_encabezado_pagina( array $args ): void {
	$args = wp_parse_args(
		$args,
		array(
			'rotulo' => '',
			'titulo' => '',
			'bajada' => '',
			'id'     => 'titulo-pagina',
			'clase'  => '',
		)
	);
	?>
	<header class="page-head <?php echo esc_attr( $args['clase'] ); ?>">
		<div class="wrap">
			<div class="section-head section-head--wide rv rv-seq">
				<?php if ( $args['rotulo'] ) : ?>
					<p class="eyebrow"><?php echo esc_html( $args['rotulo'] ); ?></p>
				<?php endif; ?>
				<h1 id="<?php echo esc_attr( $args['id'] ); ?>" class="section-title section-title--big"><?php echo ith_texto( (string) $args['titulo'] ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- ith_texto() escapa. ?></h1>
				<?php if ( $args['bajada'] ) : ?>
					<p class="lead"><?php echo ith_texto( (string) $args['bajada'] ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></p>
				<?php endif; ?>
			</div>
		</div>
	</header>
	<?php
}
