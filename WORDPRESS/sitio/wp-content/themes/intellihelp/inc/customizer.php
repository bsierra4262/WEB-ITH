<?php
/**
 * Apariencia > Personalizar > Intellihelp: URL del sitio principal, datos de contacto del pie y año de fundación.
 *
 * Solo se exponen campos de texto, así el diseño no se rompe: el marcado y las clases quedan en las plantillas. Un
 * campo vacío vuelve al valor por defecto (ver ith_defaults() en helpers.php).
 *
 * @package Intellihelp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action(
	'customize_register',
	static function ( WP_Customize_Manager $wp_customize ): void {
		$d = ith_defaults();

		$wp_customize->add_panel(
			'ith',
			array(
				'title'       => 'Intellihelp',
				'description' => 'Datos que el blog comparte con el sitio principal. Si dejás un campo vacío, vuelve el valor original.',
				'priority'    => 30,
			)
		);

		$secciones = array(
			'ith_sitio'    => 'Sitio principal',
			'ith_contacto' => 'Datos de contacto',
			'ith_empresa'  => 'Empresa',
		);
		foreach ( $secciones as $id => $titulo ) {
			$wp_customize->add_section(
				$id,
				array(
					'title' => $titulo,
					'panel' => 'ith',
				)
			);
		}

		$texto = static function ( string $clave, string $seccion, string $etiqueta, string $tipo = 'text', string $ayuda = '' ) use ( $wp_customize, $d ): void {
			$wp_customize->add_setting(
				$clave,
				array(
					'default'           => $d[ $clave ] ?? '',
					'sanitize_callback' => 'url' === $tipo ? 'esc_url_raw' : 'sanitize_text_field',
					'transport'         => 'refresh',
				)
			);
			$wp_customize->add_control(
				$clave,
				array(
					'section'     => $seccion,
					'label'       => $etiqueta,
					'type'        => $tipo,
					'description' => $ayuda,
				)
			);
		};

		// Sitio principal.
		$texto(
			'ith_url_principal',
			'ith_sitio',
			'URL del sitio principal',
			'url',
			'Sin barra final. En local: http://127.0.0.1:5174. En producción: https://www.intellihelp.tech. Vacío: 127.0.0.1:5174 en local y el mismo dominio del blog en el hosting. De acá salen el logo, el menú, el pie, "Agendá reunión" (/diagnostico-sin-cargo/) y los enlaces de las notas que empiezan con "/".'
		);

		// Contacto.
		$texto( 'ith_telefono', 'ith_contacto', 'Teléfono' );
		$texto( 'ith_whatsapp', 'ith_contacto', 'WhatsApp comercial', 'text', 'Con código de país: +54 9 11 5027-4827.' );
		$texto( 'ith_mail', 'ith_contacto', 'Mail comercial', 'email' );
		$texto( 'ith_mail_rrhh', 'ith_contacto', 'Mail de RR. HH.', 'email' );
		$texto( 'ith_direccion', 'ith_contacto', 'Dirección' );
		$texto( 'ith_codigo_postal', 'ith_contacto', 'Código postal' );
		$texto( 'ith_ciudad', 'ith_contacto', 'Ciudad' );
		$texto( 'ith_horario', 'ith_contacto', 'Horario de atención' );
		$texto( 'ith_linkedin', 'ith_contacto', 'LinkedIn', 'url' );

		// Empresa.
		$wp_customize->add_setting(
			'ith_fundacion',
			array(
				'default'           => $d['ith_fundacion'],
				'sanitize_callback' => 'absint',
			)
		);
		$wp_customize->add_control(
			'ith_fundacion',
			array(
				'section'     => 'ith_empresa',
				'label'       => 'Año de fundación',
				'type'        => 'number',
				'description' => 'Los años de trayectoria del pie salen de acá (año actual menos este). "Servicios IT desde" usa este año.',
				'input_attrs' => array(
					'min' => 1990,
					'max' => 2100,
				),
			)
		);
	}
);
