<?php
/**
 * Novedades (blog): funciones, CSS y datos estructurados. Lo carga functions.php; no es una parte de plantilla.
 *
 * - blog.css se encola en el listado (la portada de este WordPress), las categorías, la búsqueda y las notas.
 * - Listado: la primera nota de la primera página va destacada (grande) y el resto en una grilla de 3 columnas. Para
 *   que la grilla quede pareja, cada página muestra ITH_BLOG_POR_PAGINA notas y la destacada va aparte (por eso el
 *   offset de ith_blog_ajustar_consulta()).
 * - Nota: tiempo de lectura, compartir (enlaces simples a LinkedIn, WhatsApp y mail, sin scripts de terceros), notas
 *   relacionadas y JSON-LD BlogPosting.
 *
 * - Enlaces dentro de las notas: los que empiezan con "/" se escriben como si fueran del dominio de producción y el
 *   filtro de the_content los resuelve (ith_blog_resolver_enlaces()): "/novedades/..." va a otra pantalla del blog y
 *   cualquier otro ("/#casos", "/diagnostico-sin-cargo/") va al sitio principal. Así la misma nota anda en local y
 *   en el hosting sin tocar el contenido.
 *
 * Categorías (se crean en el admin, Entradas > Categorías): Novedades de la empresa (la predeterminada), Casos y
 * Tecnología. La URL de cada categoría es /categoria/<slug>/ (en producción, /novedades/categoria/<slug>/).
 *
 * @package Intellihelp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Notas por página en la grilla (sin contar la destacada de la primera página). Múltiplo de 3. */
const ITH_BLOG_POR_PAGINA = 6;

/** ¿Es una pantalla de Novedades? (listado, categoría, etiqueta, autor, fecha, búsqueda o nota). */
function ith_es_blog(): bool {
	return is_home() || is_archive() || is_search() || is_singular( 'post' );
}

/** ¿El listado actual lleva nota destacada? Solo la primera página de Novedades y de cada categoría. */
function ith_blog_con_destacada(): bool {
	return ( is_home() || is_category() ) && ! is_paged();
}

/* ---------- CSS ---------- */
add_action(
	'wp_enqueue_scripts',
	static function (): void {
		if ( ith_es_blog() ) {
			wp_enqueue_style( 'ith-blog', ith_asset( 'css/blog.css' ), array( 'ith-main' ), ith_version( 'css/blog.css' ) );
		}
	},
	25
);

/* ---------- Consulta del listado: la destacada aparte y la grilla pareja ---------- */
add_action(
	'pre_get_posts',
	static function ( WP_Query $q ): void {
		if ( is_admin() || ! $q->is_main_query() || ! ( $q->is_home() || $q->is_category() ) ) {
			return;
		}
		$pagina = max( 1, (int) $q->get( 'paged' ) );
		$q->set( 'posts_per_page', ITH_BLOG_POR_PAGINA );
		$q->set( 'ignore_sticky_posts', true );
		// La nota más reciente es la destacada de la primera página: la grilla arranca desde la segunda.
		$q->set( 'offset', 1 + ( $pagina - 1 ) * ITH_BLOG_POR_PAGINA );
		$q->set( 'ith_con_offset', true );
	}
);

/* La búsqueda del sitio busca solo en Novedades (las páginas tienen su lugar en el menú). */
add_action(
	'pre_get_posts',
	static function ( WP_Query $q ): void {
		if ( ! is_admin() && $q->is_main_query() && $q->is_search() ) {
			$q->set( 'post_type', 'post' );
			$q->set( 'posts_per_page', ITH_BLOG_POR_PAGINA );
		}
	}
);

/* Con offset WordPress cuenta mal las páginas: se descuenta la destacada del total. */
add_filter(
	'found_posts',
	static function ( int $total, WP_Query $q ): int {
		return $q->get( 'ith_con_offset' ) ? max( 0, $total - 1 ) : $total;
	},
	10,
	2
);

/**
 * La nota destacada del listado actual (la más reciente de Novedades o de la categoría), o null.
 */
function ith_blog_destacada(): ?WP_Post {
	if ( ! ith_blog_con_destacada() ) {
		return null;
	}
	$args = array(
		'post_type'           => 'post',
		'posts_per_page'      => 1,
		'ignore_sticky_posts' => true,
		'no_found_rows'       => true,
	);
	if ( is_category() ) {
		$args['cat'] = get_queried_object_id();
	}
	$q = new WP_Query( $args );
	return $q->have_posts() ? $q->posts[0] : null;
}

/* ---------- Datos de cada nota ---------- */

/** Minutos de lectura (200 palabras por minuto, mínimo 1). */
function ith_blog_minutos( $post = null ): int {
	$texto    = wp_strip_all_tags( strip_shortcodes( (string) get_post_field( 'post_content', $post ) ) );
	$palabras = count( preg_split( '/\s+/u', trim( $texto ), -1, PREG_SPLIT_NO_EMPTY ) ?: array() );
	return max( 1, (int) ceil( $palabras / 200 ) );
}

/** Categoría principal de la nota (la primera que no sea la predeterminada, si tiene más de una). */
function ith_blog_categoria( $post = null ): ?WP_Term {
	$cats = get_the_category( $post ? ( is_object( $post ) ? $post->ID : (int) $post ) : 0 );
	if ( ! $cats ) {
		return null;
	}
	$pred = (int) get_option( 'default_category' );
	foreach ( $cats as $cat ) {
		if ( (int) $cat->term_id !== $pred ) {
			return $cat;
		}
	}
	return $cats[0];
}

/** Extracto limpio para tarjetas y meta (el extracto manual o las primeras 28 palabras). */
function ith_blog_extracto( $post = null, int $palabras = 28 ): string {
	$post = get_post( $post );
	if ( ! $post ) {
		return '';
	}
	$texto = has_excerpt( $post ) ? $post->post_excerpt : wp_strip_all_tags( strip_shortcodes( $post->post_content ) );
	return wp_trim_words( $texto, $palabras, '…' );
}

/**
 * Notas relacionadas: primero las de la misma categoría y, si no alcanzan, las más recientes.
 *
 * @return WP_Post[]
 */
function ith_blog_relacionadas( int $id, int $cantidad = 3 ): array {
	$notas = array();
	$cat   = ith_blog_categoria( $id );
	if ( $cat ) {
		$notas = get_posts(
			array(
				'post_type'           => 'post',
				'numberposts'         => $cantidad,
				'cat'                 => $cat->term_id,
				'post__not_in'        => array( $id ),
				'ignore_sticky_posts' => true,
			)
		);
	}
	if ( count( $notas ) < $cantidad ) {
		$excluir = array_merge( array( $id ), wp_list_pluck( $notas, 'ID' ) );
		$notas   = array_merge(
			$notas,
			get_posts(
				array(
					'post_type'           => 'post',
					'numberposts'         => $cantidad - count( $notas ),
					'post__not_in'        => $excluir,
					'ignore_sticky_posts' => true,
				)
			)
		);
	}
	return $notas;
}

/**
 * Enlaces para compartir la nota: LinkedIn, WhatsApp y mail. Son enlaces comunes (sin SDK ni scripts de terceros).
 *
 * @return array<int, array{red: string, etiqueta: string, url: string}>
 */
function ith_blog_compartir_enlaces( $post = null ): array {
	$url    = (string) get_permalink( $post );
	$titulo = wp_strip_all_tags( get_the_title( $post ) );
	return array(
		array(
			'red'      => 'linkedin',
			'etiqueta' => 'LinkedIn',
			'url'      => 'https://www.linkedin.com/sharing/share-offsite/?url=' . rawurlencode( $url ),
		),
		array(
			'red'      => 'whatsapp',
			'etiqueta' => 'WhatsApp',
			'url'      => 'https://wa.me/?text=' . rawurlencode( $titulo . ' ' . $url ),
		),
		array(
			'red'      => 'mail',
			'etiqueta' => 'Mail',
			'url'      => 'mailto:?subject=' . rawurlencode( $titulo ) . '&body=' . rawurlencode( $url ),
		),
	);
}

/**
 * Imagen destacada de la nota, o el placeholder de marca (carbón con el logo) si no tiene.
 *
 * @param int|WP_Post $post   Nota.
 * @param string      $tamano Tamaño de WordPress.
 * @param array       $attr   Atributos extra del <img> (loading, fetchpriority, sizes...).
 */
function ith_blog_imagen( $post, string $tamano = 'ith-portada', array $attr = array() ): string {
	$attr = wp_parse_args(
		$attr,
		array(
			'loading'  => 'lazy',
			'decoding' => 'async',
			'sizes'    => '(max-width: 760px) 100vw, (max-width: 1240px) 50vw, 600px',
		)
	);
	if ( has_post_thumbnail( $post ) ) {
		return (string) get_the_post_thumbnail( $post, $tamano, $attr );
	}
	// Sin imagen: caja de marca (el logo sale del CSS). Decorativa.
	return '<span class="post-media__vacia" aria-hidden="true"></span>';
}

/* ---------- Enlaces de las notas ---------- */

/**
 * Resuelve los enlaces relativos al dominio ("/...") del contenido de una nota:
 * - "/novedades" y "/novedades/<ruta>": pantallas del blog → home_url( '/<ruta>' ).
 * - "/wp-...": archivos de WordPress, quedan como están.
 * - Cualquier otro ("/#casos", "/diagnostico-sin-cargo/", "/postulate/"): sitio principal → ith_principal( ruta ).
 */
function ith_blog_resolver_enlaces( string $html ): string {
	return (string) preg_replace_callback(
		'#\bhref=(["\'])(/(?!/)[^"\']*)\1#i',
		static function ( array $m ): string {
			$ruta = html_entity_decode( $m[2], ENT_QUOTES );
			if ( preg_match( '#^/wp-#', $ruta ) ) {
				return $m[0];
			}
			if ( preg_match( '#^/novedades(?=[/?\#]|$)/?(.*)$#', $ruta, $b ) ) {
				$url = home_url( '/' . $b[1] );
			} else {
				$url = ith_principal( $ruta );
			}
			return 'href=' . $m[1] . esc_url( $url ) . $m[1];
		},
		$html
	);
}
add_filter( 'the_content', 'ith_blog_resolver_enlaces', 20 );

/* ---------- JSON-LD BlogPosting en la nota ---------- */
add_action(
	'wp_head',
	static function (): void {
		if ( ! is_singular( 'post' ) ) {
			return;
		}
		$id     = get_queried_object_id();
		$url    = (string) get_permalink( $id );
		$cat    = ith_blog_categoria( $id );
		$autor  = (int) get_post_field( 'post_author', $id );
		$imagen = has_post_thumbnail( $id ) ? wp_get_attachment_image_src( get_post_thumbnail_id( $id ), 'ith-portada' ) : false;
		$texto  = wp_strip_all_tags( strip_shortcodes( (string) get_post_field( 'post_content', $id ) ) );

		$nota = array(
			'@type'            => 'BlogPosting',
			'@id'              => $url . '#nota',
			'mainEntityOfPage' => array(
				'@type' => 'WebPage',
				'@id'   => $url,
			),
			'headline'         => wp_strip_all_tags( get_the_title( $id ) ),
			'description'      => ith_blog_extracto( $id, 40 ),
			'datePublished'    => get_the_date( 'c', $id ),
			'dateModified'     => get_the_modified_date( 'c', $id ),
			'inLanguage'       => 'es-AR',
			'wordCount'        => count( preg_split( '/\s+/u', trim( $texto ), -1, PREG_SPLIT_NO_EMPTY ) ?: array() ),
			'timeRequired'     => 'PT' . ith_blog_minutos( $id ) . 'M',
			'author'           => array(
				'@type' => 'Person',
				'name'  => get_the_author_meta( 'display_name', $autor ),
			),
			'publisher'        => array(
				'@type' => 'Organization',
				'@id'   => ith_seo_id_organizacion(),
				'name'  => 'Intellihelp',
				'url'   => ith_principal( '/' ),
				'logo'  => array(
					'@type' => 'ImageObject',
					'url'   => ith_img( 'logo-intellihelp.png' ),
				),
			),
			'isPartOf'         => array(
				'@type' => 'Blog',
				'@id'   => ith_url_novedades() . '#blog',
				'name'  => 'Novedades de Intellihelp',
				'url'   => ith_url_novedades(),
			),
		);
		if ( $cat ) {
			$nota['articleSection'] = $cat->name;
		}
		// Sin imagen destacada va la imagen para redes del sitio (BlogPosting siempre lleva imagen).
		$nota['image'] = $imagen ? array(
			'@type'  => 'ImageObject',
			'url'    => $imagen[0],
			'width'  => $imagen[1],
			'height' => $imagen[2],
		) : array(
			'@type'  => 'ImageObject',
			'url'    => ith_img( 'og-image.png' ),
			'width'  => 1200,
			'height' => 630,
		);

		$migas = array(
			'@type'           => 'BreadcrumbList',
			'itemListElement' => array(
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
					'item'     => ith_url_novedades(),
				),
				array(
					'@type'    => 'ListItem',
					'position' => 3,
					'name'     => wp_strip_all_tags( get_the_title( $id ) ),
					'item'     => $url,
				),
			),
		);

		$grafo = array(
			'@context' => 'https://schema.org',
			'@graph'   => array( $nota, $migas ),
		);
		echo "<script type=\"application/ld+json\">\n" . wp_json_encode( $grafo, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT ) . "\n</script>\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- JSON codificado.
	},
	6
);
