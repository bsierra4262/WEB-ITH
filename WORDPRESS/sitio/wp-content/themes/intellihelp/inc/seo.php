<?php
/**
 * SEO propio, sin plugin: title, description, canonical, Open Graph / Twitter y JSON-LD del listado.
 *
 * - ith_seo() arma los datos de la pantalla actual. Se pueden cambiar de tres maneras:
 *   1. En cada nota, con los campos personalizados `ith_titulo_seo` y `ith_descripcion`.
 *   2. Para una plantilla entera, con el filtro `ith_seo` (recibe y devuelve el array).
 *   3. El extracto de la nota se usa como description si no hay `ith_descripcion`.
 * - La organización (Organization, foundingDate 2010) está en el JSON-LD de la home del sitio principal: acá solo se
 *   la referencia por su @id (<URL del sitio principal>/#organizacion), así no hay dos versiones de los mismos datos.
 *   El listado lleva Blog y cada nota, BlogPosting (template-parts/blog/modulo.php).
 *
 * @package Intellihelp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** @id de la organización en el JSON-LD del sitio principal. */
function ith_seo_id_organizacion(): string {
	return ith_principal( '/#organizacion' );
}

/** Descripción del blog. */
function ith_seo_descripcion_blog(): string {
	return 'Blog de Intellihelp: casos de clientes, novedades de la compañía y artículos sobre soporte, redes, seguridad física e infraestructura IT. Servicios IT para empresas y organismos públicos desde ' . ith_fundacion() . '.';
}

/** Datos SEO de la pantalla actual: titulo, descripcion, canonical, tipo, imagen, imagen_alt, noindex. */
function ith_seo(): array {
	static $datos = null;
	if ( null !== $datos ) {
		return $datos;
	}
	$sitio = 'Intellihelp';
	$datos = array(
		'titulo'      => 'Novedades | ' . $sitio,
		'descripcion' => ith_seo_descripcion_blog(),
		'og_titulo'   => '',
		'og_desc'     => '',
		'canonical'   => ith_url_novedades(),
		'tipo'        => 'website',
		'imagen'      => ith_img( 'og-image.png' ),
		'imagen_alt'  => $sitio . ', servicios IT desde ' . ith_fundacion(),
		'noindex'     => false,
	);

	if ( is_singular() ) {
		$id                 = get_queried_object_id();
		$titulo             = get_post_meta( $id, 'ith_titulo_seo', true );
		$desc               = get_post_meta( $id, 'ith_descripcion', true );
		$datos['titulo']    = ( $titulo ? $titulo : single_post_title( '', false ) ) . ' | ' . $sitio;
		$datos['canonical'] = (string) get_permalink( $id );
		if ( ! $desc && has_excerpt( $id ) ) {
			$desc = get_the_excerpt( $id );
		}
		if ( ! $desc ) {
			$desc = wp_trim_words( wp_strip_all_tags( (string) get_post_field( 'post_content', $id ) ), 28, '…' );
		}
		if ( $desc ) {
			$datos['descripcion'] = wp_strip_all_tags( (string) $desc );
		}
		if ( is_singular( 'post' ) ) {
			$datos['tipo'] = 'article';
		}
		if ( has_post_thumbnail( $id ) ) {
			$img = wp_get_attachment_image_src( get_post_thumbnail_id( $id ), 'ith-portada' );
			if ( $img ) {
				$datos['imagen']     = $img[0];
				$datos['imagen_alt'] = get_post_meta( get_post_thumbnail_id( $id ), '_wp_attachment_image_alt', true ) ?: get_the_title( $id );
			}
		}
	} elseif ( is_category() || is_tag() || is_tax() ) {
		$termino              = get_queried_object();
		$datos['titulo']      = single_term_title( '', false ) . ' | Novedades | ' . $sitio;
		$datos['canonical']   = (string) get_term_link( $termino );
		$datos['descripcion'] = term_description() ? wp_strip_all_tags( term_description() ) : 'Notas de ' . single_term_title( '', false ) . ' en Novedades de Intellihelp.';
	} elseif ( is_404() ) {
		$datos['titulo']  = 'Página no encontrada | ' . $sitio;
		$datos['noindex'] = true;
	} elseif ( is_search() ) {
		$datos['titulo']    = 'Búsqueda | Novedades | ' . $sitio;
		$datos['canonical'] = (string) get_search_link();
		$datos['noindex']   = true;
	} elseif ( is_archive() ) {
		$datos['titulo']    = wp_strip_all_tags( get_the_archive_title() ) . ' | Novedades | ' . $sitio;
		$datos['noindex']   = true; // autor y fecha: duplican el listado
	}

	if ( is_paged() && ! is_search() ) {
		$pagina             = max( 1, (int) get_query_var( 'paged' ) );
		$datos['canonical'] = (string) get_pagenum_link( $pagina );
		$datos['titulo']    = preg_replace( '/ \| /', ', página ' . $pagina . ' | ', $datos['titulo'], 1 );
	}

	$datos = (array) apply_filters( 'ith_seo', $datos );
	return $datos;
}

/* El <title> lo da ith_seo() (el tema declara title-tag). */
add_filter( 'pre_get_document_title', static fn() => ith_seo()['titulo'] );

/* Meta, canonical y Open Graph. */
add_action(
	'wp_head',
	static function (): void {
		$s       = ith_seo();
		$og_tit  = $s['og_titulo'] ? $s['og_titulo'] : $s['titulo'];
		$og_desc = $s['og_desc'] ? $s['og_desc'] : $s['descripcion'];
		?>
<meta name="description" content="<?php echo esc_attr( $s['descripcion'] ); ?>">
		<?php if ( ! is_404() ) : // una página 404 no declara canonical ?>
<link rel="canonical" href="<?php echo esc_url( $s['canonical'] ); ?>">
		<?php endif; ?>
		<?php if ( $s['noindex'] && ! ith_es_local() ) : ?>
<meta name="robots" content="noindex, follow">
		<?php endif; ?>
<meta property="og:type" content="<?php echo esc_attr( $s['tipo'] ); ?>">
<meta property="og:locale" content="es_AR">
<meta property="og:site_name" content="Intellihelp">
<meta property="og:url" content="<?php echo esc_url( $s['canonical'] ); ?>">
<meta property="og:title" content="<?php echo esc_attr( $og_tit ); ?>">
<meta property="og:description" content="<?php echo esc_attr( $og_desc ); ?>">
<meta property="og:image" content="<?php echo esc_url( $s['imagen'] ); ?>">
		<?php if ( ith_img( 'og-image.png' ) === $s['imagen'] ) : ?>
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
		<?php endif; ?>
<meta property="og:image:alt" content="<?php echo esc_attr( $s['imagen_alt'] ); ?>">
<meta name="twitter:card" content="summary_large_image">
		<?php
		if ( is_singular( 'post' ) ) :
			?>
<meta property="article:published_time" content="<?php echo esc_attr( (string) get_the_date( 'c' ) ); ?>">
<meta property="article:modified_time" content="<?php echo esc_attr( (string) get_the_modified_date( 'c' ) ); ?>">
			<?php
		endif;
	},
	5
);

/* JSON-LD del listado (portada del blog y categorías): Blog, con las notas de la pantalla, y migas. */
add_action(
	'wp_head',
	static function (): void {
		if ( ! ( is_home() || is_category() ) ) {
			return;
		}
		$url   = ith_seo()['canonical'];
		$blog  = ith_url_novedades();
		$notas = array();
		foreach ( array_filter( array_merge( array( ith_blog_destacada() ), (array) $GLOBALS['wp_query']->posts ) ) as $nota ) {
			$notas[ $nota->ID ] = array(
				'@type'         => 'BlogPosting',
				'@id'           => get_permalink( $nota ) . '#nota',
				'headline'      => wp_strip_all_tags( get_the_title( $nota ) ),
				'url'           => get_permalink( $nota ),
				'datePublished' => get_the_date( 'c', $nota ),
			);
		}
		$migas = array(
			array(
				'@type'    => 'ListItem',
				'position' => 1,
				'name'     => 'Inicio',
				'item'     => ith_principal( '/' ),
			),
			array(
				'@type'    => 'ListItem',
				'position' => 2,
				'name'     => 'Novedades',
				'item'     => $blog,
			),
		);
		if ( is_category() ) {
			$migas[] = array(
				'@type'    => 'ListItem',
				'position' => 3,
				'name'     => single_term_title( '', false ),
				'item'     => $url,
			);
		}
		$grafo = array(
			'@context' => 'https://schema.org',
			'@graph'   => array(
				array(
					'@type'       => 'Blog',
					'@id'         => $blog . '#blog',
					'name'        => 'Novedades de Intellihelp',
					'url'         => $blog,
					'description' => ith_seo_descripcion_blog(),
					'inLanguage'  => 'es-AR',
					'publisher'   => array(
						'@type' => 'Organization',
						'@id'   => ith_seo_id_organizacion(),
						'name'  => 'Intellihelp',
						'url'   => ith_principal( '/' ),
					),
					'blogPost'    => array_values( $notas ),
				),
				array(
					'@type'           => 'BreadcrumbList',
					'itemListElement' => $migas,
				),
			),
		);
		echo "<script type=\"application/ld+json\">\n" . wp_json_encode( $grafo, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT ) . "\n</script>\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- JSON codificado.
	},
	6
);
