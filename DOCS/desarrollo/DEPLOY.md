# Deploy en Hostinger

El sitio es estático y multipágina (HTML/CSS/JS), más un PHP para el formulario. No hace falta
Node.js en el servidor: se compila en la PC y se sube el contenido de `dist/` a `public_html`.

En `public_html` conviven tres cosas, y un deploy del sitio solo toca la primera:

| Qué | Dónde | Quién lo maneja |
| --- | --- | --- |
| Sitio institucional (este repo) | raíz de `public_html` | este procedimiento |
| Blog (WordPress) | `public_html/blog/` | WordPress; el `.htaccess` del sitio no lo intercepta |
| App de `desarrollo.intellihelp.tech` | `public_html/desarrollo/` | aparte; **no tocar** |

## 1. Antes de compilar

- [ ] **`src/data/site.json`:** mails, teléfono, WhatsApp, LinkedIn, dirección, `years` y
      `year` al día. Los datos estructurados (JSON-LD) de `index.html` los toman de ahí.
- [ ] **Medición:** `site.json` → `analytics.gtm` = `"GTM-54S82VL3"` (el contenedor de Clau
      Cave). GA4, Clarity, Google Ads y LinkedIn se configuran **dentro de GTM**, así que
      `ga4` y `clarity` quedan vacíos: si se completan, se cuenta doble. Eventos, campos
      ocultos del formulario y pruebas: `DOCS/marketing/medicion-embudo.md`. Condiciones:
  - el aviso de privacidad (`/privacidad/#medicion`) tiene que estar publicado en el mismo
    deploy: nombra GTM, GA4, Clarity y el remarketing de Google y LinkedIn;
  - GTM solo se carga en `intellihelp.tech` (el dominio de `site.json` → `url`). En local
    o en `vite preview` no carga nada salvo que se abra con `?analytics` (y `?analytics=0`
    lo apaga en esa pestaña, también en el sitio publicado);
  - la CSP de `public/.htaccess` ya permite GTM y su vista previa, GA4, Google Ads,
    Clarity, LinkedIn Insight, YouTube y el calendario (Calendly o Google Calendar); si se
    suma otra herramienta, agregar su dominio ahí.
- [ ] **Notas internas:** abrir el build con `?notas` (ver paso 2), resolver cada `.nota` y
      quitar `data-draft` de los bloques aprobados. El build ya saca las notas del HTML
      publicado; los bloques con `data-draft` (por ejemplo, testimonios) no se muestran.
- [ ] **Imágenes nuevas** pasadas por `npm run images`.
- [ ] Página nueva: además de su carpeta con `index.html`, sumarla a `public/sitemap.xml` con
      su `lastmod`.
- [ ] Conservar en `public/` el archivo de verificación de Google Search Console del sitio
      viejo (`google9ffcbef7277c41a3.html`, está en `DOCS/wordpress-anterior/`) para no perder la propiedad.

## 2. Compilar y revisar en local

```bash
npm install
npm run build
npm run preview        # http://localhost:4173
```

Revisar en 360, 390, 768, 1024 y 1440 px: home, una página de servicio, una de solución,
`/privacidad/` y una URL inexistente (`/no-existe/` tiene que mostrar la 404 propia). El
formulario no se puede probar en el preview (no ejecuta PHP): en `npm run dev` responde un
simulador que no manda mails, y el envío real se prueba ya publicado (paso 5). Desde el celular:
`npm run preview -- --host` y entrar por la IP de la PC; cerrarlo al terminar.

Queda todo en `dist/`:

```
dist/
├── index.html                 Home
├── soluciones/, servicios/,   Una carpeta por página, cada una con su index.html
│   clientes/, nosotros/,      (/soluciones/seguridad/, /servicios/outsourcing-y-service-desk/…)
│   contacto/, privacidad/
├── 404.html                   Página de error propia (rutas absolutas: se ve bien en cualquier URL)
├── assets/                    CSS, JS, fuentes e imágenes con hash en el nombre
├── api/contact.php            Envío del formulario (PHP mail())
├── api/.htaccess              Deja pasar solo contact.php dentro de /api/
├── .htaccess                  HTTPS + www, 301 del WordPress viejo, caché, seguridad, 404
├── robots.txt, sitemap.xml, llms.txt, site.webmanifest
└── favicon.svg, favicon-32.png, apple-touch-icon.png, og-image.png
```

> Los dos `.htaccess` empiezan con punto: en Windows pueden quedar ocultos. Verificá que se
> suban.

## 3. Subir a `public_html` (hPanel → Administrador de archivos o FTP)

1. Comprimir **el contenido** de `dist/` (no la carpeta) en un `.zip`.
2. hPanel → Sitios web → intellihelp.tech → Administrador de archivos → `public_html`.
3. Subir el zip y "Extraer" ahí mismo. Confirmar que `.htaccess`, `index.html`, `404.html`,
   `assets/`, `api/` y las carpetas de cada página quedaron directamente dentro de
   `public_html`.
4. En deploys siguientes, antes de extraer borrar solo `assets/` (los nombres con hash
   cambian y los viejos ocupan lugar). **Nunca** borrar `blog/` ni `desarrollo/`.
5. Purgar la caché de Hostinger (hPanel → Rendimiento → Caché / CDN) para que el HTML nuevo
   se vea enseguida.

## 4. El día del cambio: reemplazar el WordPress viejo

`public_html` hoy tiene el WordPress viejo (con Wordfence y LiteSpeed Cache) y la carpeta
`desarrollo/`.

1. **Backup completo** desde hPanel (archivos + base de datos).
2. Mover los archivos del WordPress viejo (`wp-admin/`, `wp-content/`, `wp-includes/`,
   `wp-*.php`, `index.php`, `xmlrpc.php`, `wordfence-waf.php`, `.user.ini`, su `.htaccess`)
   a una carpeta fuera de `public_html`, o borrarlos después del backup.
   **No tocar `desarrollo/`** (ni `blog/`, si el WordPress nuevo ya estuviera instalado).
3. Revisar `.user.ini` / `php.ini`: si tiene `auto_prepend_file = …wordfence-waf.php`, quitar
   esa línea; si no, al borrar Wordfence el PHP del formulario da error 500.
4. Purgar la caché de LiteSpeed (hPanel → Rendimiento → Caché).
5. Subir el build (paso 3).
6. **Las 301 se activan con este deploy:** viven en el `.htaccess` del sitio, así que empiezan
   a funcionar en el momento en que ese archivo reemplaza al del WordPress viejo. Por eso el
   `.htaccess` nuevo se sube **ese mismo día**, nunca antes en un servidor de pruebas que use
   el dominio real. Probarlas enseguida (paso 7).
7. **Desactivar el bloqueo de bots de IA del panel.** Hostinger trae una opción de seguridad
   que bloquea a los robots de IA (hPanel → Seguridad o CDN, según el plan). El sitio los
   quiere adentro (`robots.txt` les da permiso explícito y existe `llms.txt`): dejar esa
   opción apagada. Comprobarlo con:

   ```bash
   curl -I -A "GPTBot" https://www.intellihelp.tech/
   curl -I -A "ClaudeBot" https://www.intellihelp.tech/
   ```

   Tienen que responder `200`, no `403` ni una página de desafío.

## 5. Formulario: límite de envíos e IP real detrás del CDN

`api/contact.php` limita a 5 envíos cada 10 minutos por IP. Usa `REMOTE_ADDR`, y con el CDN de
Hostinger delante esa IP puede ser la del nodo del CDN: en ese caso **todos** los visitantes
que pasan por el mismo nodo comparten el cupo y, con poco tráfico, el formulario empieza a
rechazar consultas reales.

Probarlo una vez publicado:

1. Subir a `public_html` un archivo temporal con nombre difícil de adivinar (por ejemplo,
   `ip-prueba-7f3a.php`) que muestre `$_SERVER['REMOTE_ADDR']` y los encabezados
   `HTTP_X_FORWARDED_FOR`, `HTTP_X_REAL_IP` y `HTTP_CF_CONNECTING_IP` (los que existan).
2. Abrirlo desde el celular con datos móviles y desde la PC, y comparar con la IP pública de
   cada conexión (por ejemplo, la que muestra https://ifconfig.me).
3. **Borrar el archivo apenas termina la prueba.**
4. Si `REMOTE_ADDR` es tu IP real, no hay nada que cambiar. Si es una IP del CDN, ajustar
   `contact.php` para tomar la IP del encabezado que pone el CDN **solo cuando `REMOTE_ADDR`
   pertenezca a los rangos del CDN** (nunca confiar en `X-Forwarded-For` de cualquiera: se
   falsifica). El lugar está marcado en el código, antes de `rate_limited()`.

Después, mandar una consulta de prueba real y confirmar que llega a la casilla (y que no cae
en spam; si cae, revisar SPF/DKIM del dominio en hPanel → Emails).

## 6. `/blog/` (WordPress)

El blog se instala aparte en `public_html/blog/`, con su propio `.htaccess` (el que genera
WordPress, con `RewriteBase /blog/`). El `.htaccess` del sitio:

- no redirige nada que empiece con `/blog/` (solo le aplica http → https y sin www → con www);
- no le manda la CSP, la `Permissions-Policy` ni las reglas de caché (romperían `wp-admin` y
  el editor); sí le aplica `nosniff`, `Referrer-Policy`, `X-Frame-Options` y HSTS;
- el 410 de `/wp-admin`, `/wp-content`, etc. vale solo en la raíz: no afecta al blog.

Cuando el blog esté funcionando:

- [ ] En `public/.htaccess`, cambiar a `https://www.intellihelp.tech/blog/` los tres destinos
      del bloque "Novedades y las 2 notas de 2018".
- [ ] En `public/robots.txt`, descomentar la línea del sitemap del blog.
- [ ] Recompilar y subir. Nunca sumar `blog` a las listas de redirecciones.

## 7. Qué hace `.htaccess`

| Bloque | Detalle |
| --- | --- |
| Dominio canónico | `http://` y `intellihelp.tech` → **`https://www.intellihelp.tech`** (301) |
| URLs del WordPress viejo | 301 a la página nueva equivalente, en un solo salto (tabla abajo) |
| URLs duplicadas | `/x/index.html` → `/x/` y carpeta sin barra → con barra, en el mismo salto que https y www |
| `/blog/` y `/desarrollo/` | No se interceptan (ver paso 6); `desarrollo` no recibe ninguna cabecera |
| Restos de WordPress | `/wp-admin`, `/wp-content`, `/wp-login.php`, `/xmlrpc.php`, `/feed` → 410 Gone (solo en la raíz) |
| Archivos ocultos | 403, salvo `/.well-known/` (SSL y verificaciones) |
| `/api/` | Solo responde `contact.php` (lo resuelve `api/.htaccess`); `robots.txt` lo excluye |
| Compresión | brotli (si existe) y gzip para HTML, CSS, JS, JSON, SVG, XML |
| Caché | `/assets/*` con hash: 1 año `immutable` · imágenes/íconos sin hash: 30 días · HTML, manifest, robots, sitemap, llms.txt: `no-cache` · PHP: `no-store` |
| Seguridad | CSP (propio + GTM, GA4, Google Ads, Clarity, LinkedIn, YouTube y calendario), HSTS (1 año, sin subdominios), `nosniff`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` |
| 404 | `ErrorDocument 404 /404.html`: la página propia, con `noindex` |

### Redirecciones de URLs viejas

Tabla del informe de visibilidad (cap. 9), más las URLs relevadas del backup
`DOCS/wordpress-anterior/wp-content/ai1wm-backups/…20240319….wpress`. Aceptan el prefijo `/es/` y la barra final
opcional. Todas van directo a `https://www.intellihelp.tech/…`.

| URL vieja | Destino |
| --- | --- |
| `/contacto/` | se mantiene (la usa el perfil de Google) |
| `/?page_id=32`, `/es/contacto/`, `/contacto-2/`, `/contacto-us/`, `/contact-us/` | `/contacto/` |
| `/servicios/empresas.html`, `/servicios/home.html`, `/servici0s/`, `/servicios-antigua/`, `/services/` | `/servicios/` |
| `/outsourcing/`, `/outsourcing-bancos/`, `/webinar-claves-outsourcing-tecnologico-2022-yanina-brea/` | `/servicios/outsourcing-y-service-desk/` |
| `/universidades/`, `/universities/` | `/servicios/` (pasa a `/servicios/capacitacion/` cuando exista) |
| `/soluciones-antigua/`, `/soluciones-v1-antigua/`, `/solutions/` | `/soluciones/` |
| `/soluciones-cloud-huawei/` | `/soluciones/` (pasa a `/soluciones/cloud/` cuando exista) |
| `/control-de-accesos/`, `/videoseguridad/` | `/soluciones/seguridad/` |
| `/clientes-antigua/`, `/clients/`, `/history/primer-negocio/` | `/clientes/` |
| `/quienes-somos/`, `/who-we-are(-2)/`, `/partners-y-vendors/`, `/partners-and-vendors/` | `/nosotros/` |
| `/history/` | `/nosotros/#historia` |
| `/busquedas/`, `/searches/`, `/rrhh/`, avisos `/analista-…/`, `/developer-…/`, `/desarrollador-…/`, `/arquitecto-de-soluciones/` | `/nosotros/#trabaja-con-nosotros` |
| `/novedades/`, `/news/` | `/` (pasa a `/blog/` cuando el blog esté instalado) |
| Las 2 notas de fibra óptica de 2018 | `/soluciones/redes-ftth/` (después, `/blog/`) |
| La nota de evaluaciones de desempeño | `/servicios/` (después, `/blog/`) |
| `/en/` y todo `/en/*`, `/es/`, `/home/`, `/home-antigua/`, `/author/*`, `/category/*` | `/` |
| `/wp-content/uploads/2019/07/ITH-servicios-digital.pdf` | `/servicios/` |

Para agregar otra: copiar una línea `RewriteRule` del bloque "URLs del WordPress viejo" en
`public/.htaccess` (siempre antes del bloque "Dominio canónico"). Nunca sumar `blog`.

### Si se agrega contenido externo

La CSP permite el propio dominio, lo que carga GTM (GA4, Google Ads, Clarity y LinkedIn
Insight, más la vista previa de Tag Assistant) y los iframes de la landing `/diagnostico/`
(YouTube y Calendly o Google Calendar). Si en el futuro se embebe un mapa de Google u otro
script externo, hay que sumar su dominio en `public/.htaccess` (`frame-src`, `script-src`,
`connect-src` o `img-src` según corresponda). En GTM no corren las etiquetas de "HTML
personalizado" ni las variables de "JavaScript personalizado" (la CSP no tiene
`'unsafe-inline'` ni `'unsafe-eval'` en scripts, a propósito): se usan las plantillas
oficiales. Los enlaces salientes (WhatsApp, LinkedIn, Google Maps en pestaña nueva) no
necesitan cambios.

## 8. Pruebas después de publicar

Dominio y redirecciones

- [ ] https://www.intellihelp.tech abre la home; `http://intellihelp.tech` y
      `https://intellihelp.tech` terminan en `https://www.intellihelp.tech/` en un solo salto
      (`curl -I`).
- [ ] Cada página del sitemap abre con barra final; sin barra (`/soluciones/seguridad`)
      redirige con barra; `/soluciones/index.html` redirige a `/soluciones/`.
- [ ] URLs viejas: `/quienes-somos/`, `/outsourcing/`, `/videoseguridad/`, `/en/`,
      `/es/contacto/`, `/history/` → 301 al destino de la tabla. `/contacto/` responde 200.
- [ ] `/wp-login.php` y `/wp-admin/` → 410.
- [ ] `/no-existe/` y `/soluciones/no-existe/` → estado **404** con la página propia, bien
      armada (estilos, logo y links funcionando).

Páginas y contenido

- [ ] `/privacidad/` abre y está enlazada desde el pie y desde el formulario.
- [ ] Recorrer home e internas en el celular y en escritorio: menú, links del pie, anclas
      (botones "Agendá una reunión" → `#agenda`), mapa de provincias, preguntas frecuentes y
      botón de WhatsApp.
- [ ] Consola del navegador sin errores (en especial, avisos de CSP).
- [ ] Ver el código fuente: no aparecen notas internas (`.nota`) ni bloques en borrador.

Formulario

- [ ] Envío de prueba con JS: aparece el mensaje de enviado y el mail llega a la casilla.
- [ ] Prueba de IP real detrás del CDN (paso 5) hecha y archivo temporal borrado.
- [ ] `/api/` y `/api/.htaccess` → 403; `GET /api/contact.php` → redirige a la home.

Cabeceras y caché

- [ ] `curl -I https://www.intellihelp.tech/` muestra `content-security-policy`,
      `strict-transport-security` y `cache-control: no-cache`.
- [ ] `curl -I https://www.intellihelp.tech/assets/<archivo>.css` muestra
      `max-age=31536000, immutable`. Si LiteSpeed no aplicara alguna cabecera, revisar que
      mod_headers esté activo.

Otros sitios del hosting

- [ ] `desarrollo.intellihelp.tech` sigue funcionando.
- [ ] Si el blog ya está instalado: `/blog/` y `/blog/wp-admin/` funcionan y no reciben la CSP.

Robots, medición y buscadores

- [ ] `robots.txt`, `sitemap.xml` y `llms.txt` responden 200.
- [ ] Bloqueo de bots de IA del panel apagado (las pruebas con `curl -A` del paso 4).
- [ ] Medición: con Tag Assistant (https://tagassistant.google.com) conectado al sitio
      publicado se ve el contenedor `GTM-54S82VL3` sin avisos de CSP en la consola; en GA4 →
      Tiempo real aparece la visita, y un envío del formulario genera `generate_lead`.
- [ ] Formulario: el mail de prueba termina con "Cómo llegó al sitio (primera visita)" y
      el canal correcto (probar entrando con `?utm_source=prueba&utm_medium=test` en una
      ventana privada).
- [ ] PageSpeed Insights (https://pagespeed.web.dev) en móvil y escritorio, home y una interna.
- [ ] **Google Search Console:** enviar `https://www.intellihelp.tech/sitemap.xml`, pedir
      indexación de la home y, en las semanas siguientes, controlar la cobertura (las URLs
      viejas deben figurar como "Página con redirección").
