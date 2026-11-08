# WordPress local: blog "Novedades"

Este WordPress es **solo el blog "Novedades"**. El sitio principal de Intellihelp (la home, `/diagnostico-sin-cargo/`,
`/postulate/` y `/privacidad/`) es HTML y vive en `../TEMPLATE-NICO`. WordPress no tiene la home ni páginas propias:
su portada es el listado de notas.

| | Blog (esta carpeta) | Sitio principal (`TEMPLATE-NICO`) |
|---|---|---|
| Local | <http://127.0.0.1:5180/> | <http://127.0.0.1:5174/> |
| Producción | `https://www.intellihelp.tech/novedades/` | `https://www.intellihelp.tech/` |

Header y pie son los mismos del sitio principal (identidad de Nico), así que pasar de la home al blog no se nota. El
tema propio está en `sitio/wp-content/themes/intellihelp/`, con su documentación en `README-TEMA.md`.

## Carpetas

```
servir.cmd        Levanta MariaDB (3307) y PHP (5180), cada uno en su ventana
detener.cmd       Corta los dos (solo esos dos; no toca otros servicios)
php/              php.ini local y router.php (enlaces permanentes con php -S, y /novedades/... -> misma ruta sin prefijo)
sitio/            WordPress. Lo único propio es wp-content/themes/intellihelp/; el resto es el núcleo
datos/mariadb/    Base de datos local (no se versiona)
herramientas/     wp-cli.phar (no se versiona)
CREDENCIALES-LOCALES.txt  Usuario y claves del entorno local (no se versiona ni se copia a ningún lado)
```

## Levantarlo

Doble clic en `servir.cmd` (o correrlo desde una consola). Si MariaDB o el sitio ya están corriendo, no los levanta de
nuevo. Al terminar muestra las direcciones y espera una tecla.

- Sitio: <http://127.0.0.1:5180/>
- Administración: <http://127.0.0.1:5180/wp-admin/> (usuario y clave en `CREDENCIALES-LOCALES.txt`)
- Para cortar todo: `detener.cmd`.

Desde el sitio principal, `http://127.0.0.1:5174/novedades/...` redirige al 5180 sacando el prefijo
(`/novedades/categoria/casos/` → `127.0.0.1:5180/categoria/casos/`). Si se entra directo al 5180 con una ruta de
producción (`/novedades/...`), `php/router.php` hace lo mismo. Así los enlaces se escriben una sola vez, como en
producción, y andan en local.

Requisitos: PHP 8.2 de winget (`winget install PHP.PHP.8.2`) y MariaDB en `C:\Program Files\MariaDB 13.0`.

## Cargar una nota

En **Entradas > Añadir nueva**:

1. **Título**: es el H1 de la nota y el título de la tarjeta en el listado.
2. **Texto**: con subtítulos (Encabezado 2) para cortar en partes. Los enlaces al sitio principal se escriben relativos
   al dominio, como en producción: `/#casos`, `/diagnostico-sin-cargo/`, `/postulate/`. Los enlaces a otras notas,
   `/novedades/<nota>/`. El tema los resuelve solo en local y en el hosting.
3. **Extracto**: la bajada debajo del título y el texto de la tarjeta. Si queda vacío, se toman las primeras palabras.
4. **Imagen destacada**: 1280 × 720 (16:9). Es la de la tarjeta, la de la nota y la que se ve al compartir.
5. **Categoría**: Novedades de la empresa (predeterminada), Casos o Tecnología. Las **etiquetas** son opcionales.
6. **SEO** (opcional): campos personalizados `ith_titulo_seo` e `ith_descripcion` para pisar el título y la descripción
   que ven los buscadores.

La nota más reciente sale destacada arriba del listado. El autor, la fecha y el tiempo de lectura salen solos.

## URL del sitio principal

Todo enlace del blog hacia el HTML (logo, menú, pie, "Agendá reunión", 404) sale de **Apariencia > Personalizar >
Intellihelp > Sitio principal**:

- En local se deja vacío: el tema usa `http://127.0.0.1:5174`.
- En producción va `https://www.intellihelp.tech` (vacío también funciona, porque usa el mismo dominio del blog).

En el mismo panel están los datos de contacto y el año de fundación (2010), del que salen los 16 años del pie.

## Producción: el blog en /novedades/ (más adelante)

No está instalado en el hosting. Cuando se haga, los pasos son:

1. Instalar WordPress en la carpeta `novedades/` del `public_html`, al lado del HTML del sitio principal.
2. Subir el tema `sitio/wp-content/themes/intellihelp/` (sin `README-TEMA.md`) y activarlo.
3. `siteurl` y `home`: `https://www.intellihelp.tech/novedades`. Si se migra esta base local en vez de cargar las
   notas de nuevo: `wp search-replace 'http://127.0.0.1:5180' 'https://www.intellihelp.tech/novedades' --all-tables`
   y después `wp rewrite flush`.
4. Enlaces permanentes: `/%postname%/`, base de categorías `categoria` y de etiquetas `etiqueta`. El `.htaccess` de
   `novedades/` es el que arma WordPress para una subcarpeta (`RewriteBase /novedades/`, está completo en
   `README-TEMA.md`). El `.htaccess` del sitio principal ya deja pasar `/novedades/` sin tocarlo.
5. Personalizador > Intellihelp > Sitio principal: `https://www.intellihelp.tech`.
6. Ajustes > Lectura: destildar "Disuadir a los motores de búsqueda" (en local está tildado a propósito).
7. Sacar `WP_DEBUG` del `wp-config.php` del hosting y usar claves nuevas, distintas de las locales.

El `robots.txt` del sitio principal ya declara el sitemap del blog (`/novedades/wp-sitemap.xml`) y cierra
`/novedades/wp-admin/`.

## Últimos ajustes (noviembre 2026)

- **Textos:** tono corporativo en todo el tema. El cierre de las pantallas es el mismo de la home ("Agendá una
  reunión", con ícono de calendario, botón a `/diagnostico-sin-cargo/` y WhatsApp). La nota cierra con "Notas
  relacionadas". La 404 dice "Página no encontrada" y ofrece volver al inicio o ir al blog.
- **Header y pie:** iguales a los del sitio principal, con "Servicios IT desde 2010", la columna "Qué ofrecemos"
  (Servicios, Soluciones, Presencia, Diagnóstico sin cargo) y el enlace a Privacidad.
- **Sin subrayados animados:** el título de cada tarjeta solo cambia de color con el mouse encima.
- **Paginación:** "Anteriores" a la izquierda y "Siguientes" a la derecha.
- **Notas de muestra:** se revisaron las tres (certificaciones 2026, caso Gobierno de la Ciudad y relevamiento sin
  cargo) con el mismo criterio de tono.
- **Capturas** del listado y de una nota, a 1440 y 390: `DOCS/diseno/capturas-blog/`.

## Pendientes

- [ ] Instalar el blog en `/novedades/` del hosting (pasos de arriba).
- [ ] Revisar y aprobar las tres notas de muestra (certificaciones 2026, caso Gobierno de la Ciudad y cómo es el
      relevamiento sin cargo) antes de publicarlas.
- [ ] Definir quién carga las notas y con qué usuario (en producción, uno por persona, con rol Autor o Editor).
