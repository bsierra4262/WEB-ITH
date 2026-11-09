# Tema Intellihelp Novedades

Este WordPress es **solo el blog "Novedades"**. El sitio principal (home, `/diagnostico-sin-cargo/`, `/postulate/`)
es HTML y vive en `TEMPLATE-NICO`; WordPress no tiene páginas propias ni la home.

Tema clásico, en PHP, sin page builders ni plugins. Header y pie son copia del sitio principal (identidad de Nico:
Saira, carbón `#2A2A2A`, violeta `#663399`, lima `#98CC32`, header carbón y fondo lavanda con el brillo de marca), así
que pasar de la home al blog no se nota.

## Dónde corre

| | Blog (WordPress) | Sitio principal (HTML) |
|---|---|---|
| Local | http://127.0.0.1:5180/ (`WORDPRESS/servir.cmd`) | http://127.0.0.1:5174/ (Vite de `TEMPLATE-NICO`) |
| Producción | https://www.intellihelp.tech/novedades/ | https://www.intellihelp.tech/ |

En local `http://127.0.0.1:5174/novedades/...` redirige a `127.0.0.1:5180/...` sin el prefijo (`/novedades/categoria/casos/`
→ `/categoria/casos/`). Si se entra directo a `127.0.0.1:5180/novedades/...`, el router de PHP (`WORDPRESS/php/router.php`)
hace lo mismo. Así las rutas de producción también andan en local.

El header es el componente único del sitio: barra carbón, menú en mayúsculas espaciadas, CTA lima y, hasta 1100 px, el
panel propio del menú. Se compacta pasados 24 px y se esconde al bajar, con la misma regla, curva y tiempo que el sitio
principal (bloques "Menú en pantallas angostas" y "Header" de `TEMPLATE-NICO/js/main.js` y "Header (componente único de
todas las páginas)" de `css/styles.css`, copiados tal cual en `assets/js/main.js` y `assets/css/main.css`). Con
"reducir movimiento" se compacta y se esconde igual, pero sin transición (solo el color se funde). `data-header-fijo` en el `<header>` lo deja quieto en todo momento.

Cada pantalla abre con la misma animación de carga que el sitio principal (`assets/css/carga.css` y `assets/js/carga.js`,
copias de `TEMPLATE-NICO/css/carga.css` y `js/carga.js`): telón carbón con el logo centrado en cada carga, recarga y al
volver con Atrás. El script va en el `<head>` sin `defer` y los revelados de `main.js` esperan su aviso `ith:intro-salida`.
Con "reducir movimiento" (también si Windows tiene apagados los efectos de animación) aparece en su versión quieta: el
mismo telón con el logo, unos 0,6 s, y salida con fundido. Igual que en la home.

No se publica nada en Hostinger desde acá.

## Configuración de WordPress

- Ajustes > Lectura: la portada muestra **las últimas entradas** (`show_on_front=posts`). No hay página de inicio ni
  página "Novedades": la portada del WordPress es el listado.
- Enlaces permanentes: `/%postname%/`, base de categorías `categoria`, base de etiquetas `etiqueta`.
  Nota: `/<slug>/`. Categoría: `/categoria/<slug>/`. En producción, todo debajo de `/novedades/`.
- Sin páginas (se borraron Inicio, Novedades, Diagnóstico sin cargo, Postulate y Privacidad) y sin menús en
  Apariencia > Menús: el menú está en código para que quede igual al del HTML.
- Categorías: Novedades de la empresa (predeterminada), Casos y Tecnología.

### Producción: WordPress en /novedades/

1. Instalar WordPress en la carpeta `novedades/` del `public_html` del dominio (al lado del HTML del sitio principal).
2. `siteurl` y `home`: `https://www.intellihelp.tech/novedades`.
   Si se migra esta base local: `wp search-replace 'http://127.0.0.1:5180' 'https://www.intellihelp.tech/novedades' --all-tables`
   y después `wp rewrite flush`.
3. `.htaccess` dentro de `novedades/` (el que genera WordPress para una subcarpeta):

   ```apache
   # BEGIN WordPress
   <IfModule mod_rewrite.c>
   RewriteEngine On
   RewriteBase /novedades/
   RewriteRule ^index\.php$ - [L]
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule . /novedades/index.php [L]
   </IfModule>
   # END WordPress
   ```

4. Apariencia > Personalizar > Intellihelp > Sitio principal: `https://www.intellihelp.tech` (si queda vacío, el tema
   usa el mismo dominio del blog, que da lo mismo).
5. Ajustes > Lectura: destildar "Disuadir a los motores de búsqueda" (en local está tildado, por eso las pantallas
   salen con `noindex, nofollow`).

## URL del sitio principal

Todo enlace hacia el HTML sale de `ith_url_principal()`: opción del Personalizador "URL del sitio principal"; vacía,
`http://127.0.0.1:5174` en local y el mismo dominio del blog en el hosting. De ahí salen el logo, el menú (Qué
ofrecemos, Quiénes somos, Casos, FAQ, Postulate), el pie, los "Agendá reunión" (`/diagnostico-sin-cargo/`) y el 404.

**Enlaces dentro de las notas:** se escriben como en producción, relativos al dominio, y el tema los resuelve
(`ith_blog_resolver_enlaces()`, filtro de `the_content`):

| En la nota | Local | Producción |
|---|---|---|
| `/#casos`, `/diagnostico-sin-cargo/`, `/postulate/` | `http://127.0.0.1:5174/...` | `https://www.intellihelp.tech/...` |
| `/novedades/categoria/casos/`, `/novedades/<nota>/` | `http://127.0.0.1:5180/...` | `https://www.intellihelp.tech/novedades/...` |

## Archivos

| Archivo | Qué hace |
|---|---|
| `style.css` | Solo identifica el tema. |
| `functions.php` | Carga `inc/` y `template-parts/blog/modulo.php`. |
| `header.php` / `footer.php` | Copia del header y del pie de `TEMPLATE-NICO/index.html` (bloques `header:inicio/fin` y `footer:inicio/fin`), con los enlaces sobre la URL del sitio principal. Blog queda marcado (`aria-current="page"`). Si cambian allá, se cambian acá igual. |
| `home.php` | Portada del blog: encabezado, filtro por categoría, nota destacada, grilla y cierre. |
| `single.php` | Nota: migas, título, autor, fecha, lectura, imagen, texto, compartir, "Notas relacionadas" y cierre "Conversemos sobre tu proyecto" con el botón a `<sitio principal>/diagnostico-sin-cargo/`. |
| `archive.php`, `search.php` | Categorías/etiquetas y búsqueda, con el mismo listado. |
| `404.php`, `page.php`, `index.php` | No encontrada, página suelta (por si algún día se carga una) y respaldo. |
| `inc/helpers.php` | Funciones para las plantillas (abajo). |
| `inc/setup.php` | Soportes, CSS/JS, fuente, GTM y script del `<head>`. |
| `inc/customizer.php` | Personalizar > Intellihelp: Sitio principal, Datos de contacto y Empresa (año de fundación). |
| `inc/menu.php` | Ítems del menú, en código. |
| `inc/seo.php` | Title, description, canonical, Open Graph y JSON-LD `Blog` del listado. |
| `template-parts/blog/` | Piezas del blog; `modulo.php` tiene las funciones, la consulta del listado, el filtro de enlaces y el JSON-LD `BlogPosting`. |
| `assets/css/main.css` | Solo lo común con el sitio principal: fuente, tokens, botones, header, pie, encabezados, `.prose`, cierre y revelados. Copiado de `TEMPLATE-NICO/css/styles.css` sin el CSS de la home. |
| `assets/css/blog.css` | Listado, tarjetas, nota, compartir y paginación ("Anteriores" a la izquierda y "Siguientes" a la derecha, nunca juntas). Tarjetas sin caja, fondo ni sombra (aire y filetes finos). Filtro con "Todas las notas" primero (marcada en el listado general) y la categoría activa en violeta. Ningún enlace lleva subrayado (`:root a` en main.css): se distinguen por color y peso. |
| `assets/css/carga.css`, `assets/js/carga.js` | Animación de carga común del sitio (copias de TEMPLATE-NICO: si cambian allá, se copian igual). |
| `assets/js/main.js` | Globo de WhatsApp (mensaje del blog editable, `click_whatsapp`), origen de la visita (`ith_origen`, el mismo de la agenda), menú angosto, medición y revelados. |
| `assets/img/`, `assets/fonts/` | Logo, favicons, imagen para redes ("desde 2010") y Saira. |

## Funciones para las plantillas

| Función | Devuelve / hace |
|---|---|
| `ith_url_principal()` / `ith_principal( '/#casos' )` | URL del sitio principal (sin barra final) y una ruta dentro de él. |
| `ith_url_agendar()` | `<sitio principal>/diagnostico-sin-cargo/` (filtro `ith_url_agendar`). |
| `ith_url_novedades()` | Portada del blog (`home_url( '/' )`). |
| `ith_ancla( 'casos' )` | `<sitio principal>/#casos`. |
| `ith_cta( $id, $seccion, $args )` | Botón "Agendá reunión" con `id` y `data-cta`. |
| `ith_opt( 'ith_telefono' )` | Valor del Personalizador con su respaldo (`ith_defaults()`). |
| `ith_fundacion()` / `ith_anios()` | 2010 y los años de trayectoria (16 en 2026). |
| `ith_texto( $s )` | Texto escapado con `*palabra*` como resaltador y `{anios}` reemplazado. |
| `ith_encabezado_pagina( $args )` | Encabezado de pantalla (rótulo, título, bajada). |
| `ith_url_whatsapp()`, `ith_url_telefono()`, `ith_icono()`, `ith_asset()`, `ith_img()` | Enlaces de contacto, íconos y rutas de assets. |

## Medición

- Google Tag Manager `GTM-54S82VL3` en el `<head>` y el `noscript` después de `<body>`, en todas las pantallas.
- `cta_click`: los "Agendá reunión" (header, cierre del listado, cierre de la nota, 404). Cada uno con `id` y `data-cta`
  (`cta-header`, `cta-novedades`, `cta-nota`, `cta-404`).
- `internal_nav`: clics hacia el sitio principal desde el header, el pie o el texto de una nota (`link_target` sin
  dominio, por ejemplo `/#casos`; `link_from`: `header`, `footer` o `nota`).
- `click_calendar`, `schedule_meeting` y `cf7_enviado` los publica la agenda de `/diagnostico-sin-cargo/` (sitio
  principal). El blog guarda el origen de la visita (`ith_origen`) para que la agenda lo encuentre si se entra por una nota.

## SEO

Sin plugin. Title, description, canonical y Open Graph en todas las pantallas; en cada nota `article:published_time`,
JSON-LD `BlogPosting` + `BreadcrumbList` (Inicio del sitio principal → Novedades → nota); en el listado y las
categorías, `Blog` + `BreadcrumbList`. La organización se referencia por `@id` (`<sitio principal>/#organizacion`), que
está definida en el JSON-LD de la home HTML. Por nota se puede pisar el título y la description con los campos
personalizados `ith_titulo_seo` e `ith_descripcion`.

## Movimiento

Movimiento igual al de la home (TEMPLATE-NICO/README-movimiento.md, sección 14):
- Apariciones: `.rv`, `.rv-seq` y `data-d` (pasa a `--rv-d`) en el marcado; el bloque "Animaciones" de `main.css` (copia
  del de `styles.css`: `rise`, `riseSm`, `focusIn`, `pop`, `draw`, `--seq`, `--stagger`) y el módulo de revelado de
  `main.js` (copia del de la home). Cada elemento entra una sola vez, cuando empieza a abrirse el telón de la carga
  (`ith:intro-salida`); lo que queda a la vista después de una recarga entra animado y al volver con "atrás" se
  repite (aviso `ith:replay` de `carga.js`). El cierre "Agendá una reunión" se expande desde el 94 % (`mGrow`).
- Íconos que levitan (`mLevita`, ±7 px, 3,6 s, curva senoidal, con `translate` suelto): el calendario del cierre, el
  ícono del aviso sin notas y los círculos de "Compartir", con la ola ordenada (0, −0,45 y −0,9 s, `--lev-d`).
- Hover: el `.btn` común, el título de la nota en violeta y los círculos de "Compartir" que solo cambian de color.
  Los íconos no suben ni se agrandan con el mouse.
- Con "reducir movimiento" no se pone `.anim`: todo queda visible y quieto (solo aparece el telón quieto de la carga).
- Nunca un área en blanco (mismo revelado que la home): solo entra animado lo que el visitante ve llegar (su borde
  cruza el 90 % de la pantalla). Lo que se descubre ya adentro de la pantalla (scroll rápido, ancla) o quedó arriba
  (recarga a mitad, Atrás) aparece quieto en el mismo cuadro (clase `rv-ya`, sus entradas se adelantan a su final), con
  un respaldo a los 2 s de abrirse el telón y cada vez que se detiene el scroll. `html` también va en lavanda.
Si algún día se suman las recetas de `motion.js` de la home (títulos por líneas, fotos que se descubren), alcanza con
dejar `assets/css/motion.css` y `assets/js/motion.js` en el tema: se cargan solos (ver `inc/setup.php`).

## WhatsApp flotante

Siempre visible en todas las pantallas (el blog no tiene lógica que lo oculte). Sin JS es el link directo a wa.me con el
mensaje del blog (`?text=Hola, vengo de las novedades de Intellihelp y quiero hacer una consulta.`, en `footer.php`).
Con JS abre el mismo globo que la home (copia del módulo de `TEMPLATE-NICO/js/main.js` y del CSS `.wa-globo*`): el
mensaje se puede editar y "Enviar por WhatsApp →" abre wa.me con el texto final. Mouse: se abre al apoyarse; toque y
teclado: el botón abre y cierra (con Enter el foco va al mensaje; Escape cierra y devuelve el foco). Medición:
`click_whatsapp` con `link_location: "flotante"` al enviar.
