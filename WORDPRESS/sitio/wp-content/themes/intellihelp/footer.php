<?php
/**
 * Pie común y botón flotante de WhatsApp. Es la copia del pie del sitio principal (TEMPLATE-NICO/index.html, entre
 * footer:inicio y footer:fin): mismo marcado y mismas clases. Los enlaces a secciones de la home y a Postulate se arman
 * sobre la URL del sitio principal, igual que Privacidad (<principal>/privacidad/); Blog es la portada de este WordPress.
 * Los datos de contacto salen del Personalizador (los mismos del JSON-LD de la home). Cierra el <main> que abre
 * header.php.
 *
 * @package Intellihelp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
</main>

<footer class="site-footer">
  <div class="wrap footer__inner">
    <div class="footer__cols">
      <div class="footer__about">
        <div class="footer__brand">
          <img src="<?php echo esc_url( ith_img( 'logo-intellihelp.png' ) ); ?>" alt="ITH, Intellihelp" width="82" height="44" loading="lazy">
          <span class="footer__tag">Servicios IT<br>desde <?php echo esc_html( (string) ith_fundacion() ); ?></span>
        </div>
        <p class="footer__text">Servicios IT para empresas y organismos públicos. <?php echo esc_html( (string) ith_anios() ); ?>&nbsp;años en la Argentina y la región.</p>
      </div>
      <nav class="footer__col" aria-label="Qué ofrecemos">
        <span class="eyebrow eyebrow--lime">Qué ofrecemos</span>
        <a href="<?php echo esc_url( ith_ancla( 'servicios' ) ); ?>">Servicios</a>
        <a href="<?php echo esc_url( ith_ancla( 'soluciones' ) ); ?>">Soluciones</a>
        <a href="<?php echo esc_url( ith_ancla( 'presencia' ) ); ?>">Presencia</a>
        <a href="<?php echo esc_url( ith_principal( '/diagnostico-sin-cargo/' ) ); ?>">Diagnóstico sin cargo</a>
      </nav>
      <nav class="footer__col" aria-label="Empresa">
        <span class="eyebrow eyebrow--lime">Empresa</span>
        <a href="<?php echo esc_url( ith_ancla( 'quienes-somos' ) ); ?>">Quiénes somos</a>
        <a href="<?php echo esc_url( ith_ancla( 'casos' ) ); ?>">Casos</a>
        <a href="<?php echo esc_url( ith_url_novedades() ); ?>">Blog</a>
        <a href="<?php echo esc_url( ith_ancla( 'preguntas' ) ); ?>">FAQ</a>
        <a href="<?php echo esc_url( ith_principal( '/postulate/' ) ); ?>">Postulate</a>
      </nav>
      <div class="footer__col footer__col--wide">
        <span class="eyebrow eyebrow--lime">Contacto</span>
        <a href="<?php echo esc_url( ith_url_telefono() ); ?>"><?php echo esc_html( (string) ith_opt( 'ith_telefono' ) ); ?></a>
        <a href="mailto:<?php echo esc_attr( antispambot( (string) ith_opt( 'ith_mail' ) ) ); ?>"><?php echo esc_html( antispambot( (string) ith_opt( 'ith_mail' ) ) ); ?></a>
        <a href="mailto:<?php echo esc_attr( antispambot( (string) ith_opt( 'ith_mail_rrhh' ) ) ); ?>"><?php echo esc_html( antispambot( (string) ith_opt( 'ith_mail_rrhh' ) ) ); ?></a>
        <a href="<?php echo esc_url( (string) ith_opt( 'ith_linkedin' ) ); ?>" target="_blank" rel="noopener">LinkedIn</a>
        <address class="footer__address"><?php echo esc_html( ith_opt( 'ith_direccion' ) . ', ' . ith_opt( 'ith_codigo_postal' ) . ', ' . ith_opt( 'ith_ciudad' ) ); ?><br><?php echo esc_html( (string) ith_opt( 'ith_horario' ) ); ?></address>
      </div>
    </div>
    <div class="footer__bottom">
      <span>© <?php echo esc_html( wp_date( 'Y' ) ); ?> Intellihelp S.A. Todos los derechos reservados. <a href="<?php echo esc_url( ith_principal( '/privacidad/' ) ); ?>">Privacidad</a></span>
      <span>Gold Partner Huawei · Gold Partner Hikvision</span>
    </div>
  </div>
</footer>

<!-- WhatsApp comercial (mismo número que el cierre de la home y el JSON-LD). Lima con el logo blanco; al pasar el mouse,
     blanco con el logo carbón. Con JS abre el globo con el mensaje del blog (?text=), editable antes de enviar (main.js);
     sin JS es el link directo. -->
<a href="<?php echo esc_url( ith_url_whatsapp() . '?text=' . rawurlencode( 'Hola, vengo de las novedades de Intellihelp y quiero hacer una consulta.' ) ); ?>" target="_blank" rel="noopener" class="wa-float" aria-label="Escribinos por WhatsApp (se abre en una pestaña nueva)">
  <?php echo ith_icono( 'whatsapp', 30 ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- SVG fijo. ?>
</a>

<?php wp_footer(); ?>
</body>
</html>
