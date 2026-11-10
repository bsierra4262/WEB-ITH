<?php
// Configuración de la conexión con el CRM. Se copia a crm.local.php (local,
// ignorado por git) o a <home del hosting>/ith_web_config/crm.php (servidor,
// carpeta 700 y archivo 600) y se completa. Este modelo no lleva secretos.
// La leen public/api/_crm.php, agenda.php y contact.php.
return [
    'url'      => 'https://intellihelp.tech/crm-pruebas',  // producción: https://intellihelp.tech/crm
    'clave'    => '',          // crm_… (pantalla API del CRM, permiso «Escritura (web)»)
    'secreto'  => '',          // 64 hex, se muestra una sola vez junto con la clave
    'ip_sal'   => '',          // bin2hex(random_bytes(32)), propia de la web
    'tipos'    => ['bsierra/diagnostico'],   // vendedor/slug permitidos; producción: el usuario de Carlos
    'timeout'  => 5,           // segundos para la consulta y los horarios
    'timeout_reserva' => 10,   // segundos para la reserva
    'cola'     => __DIR__ . '/cola-crm',     // servidor: <home del hosting>/ith_web_config/cola-crm
    'cache'    => __DIR__ . '/cache-crm',    // servidor: <home del hosting>/ith_web_config/cache-crm
    // 'cainfo' => 'C:/Program Files/Git/mingw64/etc/ssl/certs/ca-bundle.crt', // solo si el PHP local no trae certificados
];
