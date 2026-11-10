# Política de seguridad

## Reporte de vulnerabilidades

Ante una vulnerabilidad de seguridad, **no debe abrirse un issue público**. El reporte se
realiza de forma privada a **bsierra@intellihelp.tech**.

Se solicita incluir, en la medida de lo posible: descripción, pasos de reproducción, impacto
y una posible mitigación. El reporte recibirá respuesta a la brevedad.

## Manejo de secretos y datos

- La clave y el secreto de la API del CRM **no se versionan**. `TEMPLATE-NICO/api/_crm.php` los
  lee de una configuración **fuera del web root**: la variable `ITH_CRM_CONFIG`, la variable
  `ITH_CRM_CONFIG_SERVIDOR` o, por defecto, `ith_web_config/crm.php` al lado de `public_html`.
  En el repositorio solo hay un modelo sin datos (`config/crm.example.php`).
- Cada pedido de la web al CRM va **firmado con HMAC-SHA256** (hora, método, ruta, idempotencia,
  hash de IP y cuerpo), con tolerancia de ±5 minutos: una firma de pruebas no sirve en producción
  y un pedido copiado no se puede reenviar como si fuera otro.
- **La IP del visitante nunca sale de la web**: el CRM recibe un HMAC con una sal propia.
- Si el CRM no responde, la consulta queda en una cola fuera del web root (permisos `600`) y se
  reenvía con la misma clave de idempotencia; se borra a los 30 días.
- Los formularios tienen límite de envíos por IP, trampa para bots y consentimiento versionado
  (Ley 25.326).
- `api/.htaccess` solo deja pasar `contact.php` y `agenda.php`; la biblioteca `_crm.php` devuelve
  404 si se la pide directo.
- El `.htaccess` del sitio niega los archivos ocultos (`.git`, `.env`, `.user.ini`), deja pasar
  sin tocar los subdominios y las aplicaciones del hosting y no publica índices de carpetas.
- El contenido de HiringRoom se limpia antes de mostrarse (sin scripts, estilos en línea, atributos
  `on*` ni enlaces que no sean http/https).
- No se versionan: credenciales locales del WordPress, la base del blog, el material interno de la
  empresa ni el respaldo del sitio anterior (ver `.gitignore`).
