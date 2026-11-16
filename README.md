<p align="center">
  <img src="DOCS/banner.svg" alt="WEB ITH — Sitio institucional de Intellihelp" width="100%">
</p>

<p align="center">
  <b>Sitio institucional de Intellihelp: servicios IT de soporte, redes, infraestructura y seguridad, con agenda de reuniones conectada al CRM propio.</b><br>
  HTML, CSS y JavaScript sin frameworks, una API mínima en PHP y el blog en WordPress, listos para Hostinger.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5%20%C2%B7%20CSS%20%C2%B7%20JS-sin%20frameworks-E34F26?logo=html5&logoColor=white" alt="HTML5, CSS y JavaScript sin frameworks">
  <img src="https://img.shields.io/badge/Vite-desarrollo%20local-646CFF?logo=vite&logoColor=white" alt="Vite para desarrollo local">
  <img src="https://img.shields.io/badge/PHP-8.2%20(API)-777BB4?logo=php&logoColor=white" alt="PHP 8.2 para la API">
  <img src="https://img.shields.io/badge/WordPress-blog-21759B?logo=wordpress&logoColor=white" alt="WordPress para el blog">
  <img src="https://img.shields.io/badge/Hosting-Hostinger-673DE6?logo=hostinger&logoColor=white" alt="Hostinger">
  <img src="https://img.shields.io/badge/licencia-propietaria-663399" alt="Licencia propietaria">
</p>

<p align="center">
  <b><a href="https://www.intellihelp.tech">www.intellihelp.tech</a></b>
</p>

<p align="center"><img src="DOCS/capturas/home-principal.webp" alt="Inicio del sitio con el video institucional de fondo" width="100%"></p>

---

## Índice

- [Descripción](#descripción)
- [Capturas](#capturas)
- [Características](#características)
- [Arquitectura](#arquitectura)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Desarrollo local](#desarrollo-local)
- [Lanzamiento](#lanzamiento)
- [Pruebas y verificación](#pruebas-y-verificación)
- [Seguridad](#seguridad)
- [Licencia](#licencia)
- [Autor](#autor)

## Descripción

**WEB ITH** es el sitio nuevo de **www.intellihelp.tech**, la empresa de servicios IT con 16 años
de trayectoria (desde 2010) en mesa de ayuda, outsourcing IT, redes, infraestructura y seguridad
física para empresas y organismos públicos.

El sitio está hecho para convertir visitas en reuniones: cada "Agendá reunión" lleva a
`/diagnostico-sin-cargo/`, donde el visitante elige día y horario en un **calendario propio
conectado a la agenda del CRM de la empresa** y la reunión queda creada con su invitación de
Google Meet, sin pasar por servicios de terceros.

| Página | Qué hay |
|---|---|
| `/` | Home: hero, qué ofrecemos (servicios y soluciones), presencia en Argentina y Latam, equipo, socios, clientes, historia, casos de éxito, cita del CEO, preguntas frecuentes y cierre |
| `/diagnostico-sin-cargo/` | Reserva de un diagnóstico de 30 minutos: calendario, horarios, datos y confirmación |
| `/gracias-reserva/` | Confirmación de la reunión y qué tener a mano |
| `/postulate/` | Búsquedas abiertas publicadas en HiringRoom, perfiles y motivos para sumarse |
| `/privacidad/` | Política de privacidad (Ley 25.326) |
| `/novedades/` | Blog en WordPress, con el mismo header, pie y animación de carga |
| `404` | Página de error propia |

> Las versiones anteriores del sitio están en `OLD/`: la multipágina en Vite
> (`OLD/web-multipagina-vite/`, referencia; aporta Vite al entorno local) y el respaldo del WordPress
> anterior (`OLD/wordpress-anterior/`, no se versiona). Ninguna se publica.

## Capturas

Todas salen del sitio publicado en www.intellihelp.tech, con las animaciones terminadas. Se rehacen con
`tools/capturas/web.mjs` después de cada cambio visible.

### Primera pantalla de cada página

| Escritorio | Celular |
|---|---|
| <img src="DOCS/capturas/home-escritorio.webp" alt="Home en escritorio" width="560"> | <img src="DOCS/capturas/home-celular.webp" alt="Home en celular" width="190"> |
| <img src="DOCS/capturas/diagnostico-escritorio.webp" alt="Diagnóstico sin cargo en escritorio" width="560"> | <img src="DOCS/capturas/diagnostico-celular.webp" alt="Diagnóstico sin cargo en celular" width="190"> |
| <img src="DOCS/capturas/gracias-reserva-escritorio.webp" alt="Gracias por reservar en escritorio" width="560"> | <img src="DOCS/capturas/gracias-reserva-celular.webp" alt="Gracias por reservar en celular" width="190"> |
| <img src="DOCS/capturas/postulate-escritorio.webp" alt="Postulate en escritorio" width="560"> | <img src="DOCS/capturas/postulate-celular.webp" alt="Postulate en celular" width="190"> |
| <img src="DOCS/capturas/privacidad-escritorio.webp" alt="Privacidad en escritorio" width="560"> | <img src="DOCS/capturas/privacidad-celular.webp" alt="Privacidad en celular" width="190"> |
| <img src="DOCS/capturas/blog-escritorio.webp" alt="Blog en escritorio" width="560"> | <img src="DOCS/capturas/blog-celular.webp" alt="Blog en celular" width="190"> |
| <img src="DOCS/capturas/blog-nota-escritorio.webp" alt="Nota del blog en escritorio" width="560"> | <img src="DOCS/capturas/blog-nota-celular.webp" alt="Nota del blog en celular" width="190"> |
| <img src="DOCS/capturas/404-escritorio.webp" alt="Página 404 en escritorio" width="560"> | <img src="DOCS/capturas/404-celular.webp" alt="Página 404 en celular" width="190"> |

### La home, sección por sección

| Sección | Escritorio | Celular |
|---|---|---|
| Qué ofrecemos: servicios y soluciones | <img src="DOCS/capturas/home-02-que-ofrecemos-escritorio.webp" alt="Qué ofrecemos: servicios y soluciones en escritorio" width="460"> | <img src="DOCS/capturas/home-02-que-ofrecemos-celular.webp" alt="Qué ofrecemos: servicios y soluciones en celular" width="170"> |
| Presencia en Argentina y Latam | <img src="DOCS/capturas/home-03-presencia-escritorio.webp" alt="Presencia en Argentina y Latam en escritorio" width="460"> | <img src="DOCS/capturas/home-03-presencia-celular.webp" alt="Presencia en Argentina y Latam en celular" width="170"> |
| Quiénes somos: el equipo y nuestras oficinas | <img src="DOCS/capturas/home-04-equipo-escritorio.webp" alt="Quiénes somos: el equipo y nuestras oficinas en escritorio" width="460"> | <img src="DOCS/capturas/home-04-equipo-celular.webp" alt="Quiénes somos: el equipo y nuestras oficinas en celular" width="170"> |
| Socios tecnológicos | <img src="DOCS/capturas/home-05-socios-escritorio.webp" alt="Socios tecnológicos en escritorio" width="460"> | <img src="DOCS/capturas/home-05-socios-celular.webp" alt="Socios tecnológicos en celular" width="170"> |
| Clientes por rubro | <img src="DOCS/capturas/home-06-clientes-escritorio.webp" alt="Clientes por rubro en escritorio" width="460"> | <img src="DOCS/capturas/home-06-clientes-celular.webp" alt="Clientes por rubro en celular" width="170"> |
| Nuestra historia | <img src="DOCS/capturas/home-07-historia-escritorio.webp" alt="Nuestra historia en escritorio" width="460"> | <img src="DOCS/capturas/home-07-historia-celular.webp" alt="Nuestra historia en celular" width="170"> |
| Casos de éxito | <img src="DOCS/capturas/home-08-casos-escritorio.webp" alt="Casos de éxito en escritorio" width="460"> | <img src="DOCS/capturas/home-08-casos-celular.webp" alt="Casos de éxito en celular" width="170"> |
| Palabras de Carlos Baldelli, CEO | <img src="DOCS/capturas/home-09-cita-escritorio.webp" alt="Palabras de Carlos Baldelli, CEO en escritorio" width="460"> | <img src="DOCS/capturas/home-09-cita-celular.webp" alt="Palabras de Carlos Baldelli, CEO en celular" width="170"> |
| Preguntas frecuentes | <img src="DOCS/capturas/home-10-preguntas-escritorio.webp" alt="Preguntas frecuentes en escritorio" width="460"> | <img src="DOCS/capturas/home-10-preguntas-celular.webp" alt="Preguntas frecuentes en celular" width="170"> |
| Cierre: agendá una reunión | <img src="DOCS/capturas/home-11-agenda-escritorio.webp" alt="Cierre: agendá una reunión en escritorio" width="460"> | <img src="DOCS/capturas/home-11-agenda-celular.webp" alt="Cierre: agendá una reunión en celular" width="170"> |
| Pie del sitio | <img src="DOCS/capturas/home-12-pie-escritorio.webp" alt="Pie del sitio en escritorio" width="460"> | <img src="DOCS/capturas/home-12-pie-celular.webp" alt="Pie del sitio en celular" width="170"> |

### Diagnóstico y Postulate, por secciones

| Sección | Escritorio | Celular |
|---|---|---|
| Diagnóstico: calendario de reserva | <img src="DOCS/capturas/diagnostico-reserva-escritorio.webp" alt="Diagnóstico: calendario de reserva en escritorio" width="460"> | <img src="DOCS/capturas/diagnostico-reserva-celular.webp" alt="Diagnóstico: calendario de reserva en celular" width="170"> |
| Diagnóstico: clientes | <img src="DOCS/capturas/diagnostico-clientes-escritorio.webp" alt="Diagnóstico: clientes en escritorio" width="460"> | <img src="DOCS/capturas/diagnostico-clientes-celular.webp" alt="Diagnóstico: clientes en celular" width="170"> |
| Diagnóstico: casos | <img src="DOCS/capturas/diagnostico-casos-escritorio.webp" alt="Diagnóstico: casos en escritorio" width="460"> | <img src="DOCS/capturas/diagnostico-casos-celular.webp" alt="Diagnóstico: casos en celular" width="170"> |
| Postulate: por qué sumarse | <img src="DOCS/capturas/postulate-por-que-escritorio.webp" alt="Postulate: por qué sumarse en escritorio" width="460"> | <img src="DOCS/capturas/postulate-por-que-celular.webp" alt="Postulate: por qué sumarse en celular" width="170"> |
| Postulate: perfiles que buscamos | <img src="DOCS/capturas/postulate-perfiles-escritorio.webp" alt="Postulate: perfiles que buscamos en escritorio" width="460"> | <img src="DOCS/capturas/postulate-perfiles-celular.webp" alt="Postulate: perfiles que buscamos en celular" width="170"> |
| Postulate: búsquedas abiertas | <img src="DOCS/capturas/postulate-busquedas-escritorio.webp" alt="Postulate: búsquedas abiertas en escritorio" width="460"> | <img src="DOCS/capturas/postulate-busquedas-celular.webp" alt="Postulate: búsquedas abiertas en celular" width="170"> |

<details>
<summary><b>Páginas completas, de arriba abajo</b></summary>

| Página | Escritorio | Celular |
|---|---|---|
| Home | <img src="DOCS/capturas/home-completa-escritorio.webp" alt="Home: página completa en escritorio" width="360"> | <img src="DOCS/capturas/home-completa-celular.webp" alt="Home: página completa en celular" width="170"> |
| Diagnóstico sin cargo | <img src="DOCS/capturas/diagnostico-completa-escritorio.webp" alt="Diagnóstico sin cargo: página completa en escritorio" width="360"> | <img src="DOCS/capturas/diagnostico-completa-celular.webp" alt="Diagnóstico sin cargo: página completa en celular" width="170"> |
| Gracias por reservar | <img src="DOCS/capturas/gracias-reserva-completa-escritorio.webp" alt="Gracias por reservar: página completa en escritorio" width="360"> | <img src="DOCS/capturas/gracias-reserva-completa-celular.webp" alt="Gracias por reservar: página completa en celular" width="170"> |
| Postulate | <img src="DOCS/capturas/postulate-completa-escritorio.webp" alt="Postulate: página completa en escritorio" width="360"> | <img src="DOCS/capturas/postulate-completa-celular.webp" alt="Postulate: página completa en celular" width="170"> |
| Privacidad | <img src="DOCS/capturas/privacidad-completa-escritorio.webp" alt="Privacidad: página completa en escritorio" width="360"> | <img src="DOCS/capturas/privacidad-completa-celular.webp" alt="Privacidad: página completa en celular" width="170"> |
| Blog | <img src="DOCS/capturas/blog-completa-escritorio.webp" alt="Blog: página completa en escritorio" width="360"> | <img src="DOCS/capturas/blog-completa-celular.webp" alt="Blog: página completa en celular" width="170"> |
| Nota del blog | <img src="DOCS/capturas/blog-nota-completa-escritorio.webp" alt="Nota del blog: página completa en escritorio" width="360"> | <img src="DOCS/capturas/blog-nota-completa-celular.webp" alt="Nota del blog: página completa en celular" width="170"> |
| Página 404 | <img src="DOCS/capturas/404-completa-escritorio.webp" alt="Página 404: página completa en escritorio" width="360"> | <img src="DOCS/capturas/404-completa-celular.webp" alt="Página 404: página completa en celular" width="170"> |

</details>

> En celulares el inicio muestra una imagen fija del video institucional. La reunión confirmada usa
> una reserva de ejemplo, las búsquedas son las que hay publicadas en HiringRoom ese día y los
> formularios están vacíos.

## Características

- **Agenda propia, conectada al CRM.** Calendario mensual con los horarios libres reales, datos,
  confirmación y pantalla de gracias; consulta sin turno como alternativa y cola de reenvío si el
  CRM no responde.
- **Sin frameworks ni dependencias en el navegador.** HTML, CSS y JavaScript propios; Vite se usa
  solo para servir en local con recarga en vivo.
- **Un solo sistema visual.** Header y botón únicos en todas las páginas (también en el blog),
  animación de carga común, tarjetas sin caja, fondo oscuro únicamente en el hero y paleta acotada
  (carbón, violeta, lima, blanco y lavanda).
- **Movimiento cuidado.** Apariciones escalonadas, íconos que levitan, mapas que recorren todas las
  zonas con presencia, bandas de clientes por rubro con avance automático y casos con transición
  coordinada; todo respeta "reducir movimiento" y no hay botones de pausa.
- **Video institucional en el inicio.** 720p o 1080p según la pantalla; en celulares y tablets, una
  imagen fija del mismo video, liviana y en vertical para celular.
- **Rápido sin resignar nada.** El JavaScript arranca después del primer pintado, carruseles y
  bandas se arman al acercarse, las secciones de abajo se calculan recién cuando hacen falta, cada
  foto se pide según su ancho real y Tag Manager se carga al terminar la página.
- **Nada nativo a la vista.** Calendario, chips, casillas, barras y controles con diseño propio.
- **SEO y medición.** JSON-LD en todas las páginas (organización, servicio, `FAQPage`, migas),
  sitemap, `llms.txt`, 301 del sitio anterior con UTM y Google Tag Manager con eventos de cada CTA,
  reserva y consulta; origen de la visita guardado para el CRM.
- **Postulaciones por HiringRoom**, cargado recién al acercarse a la sección y con su contenido
  limpiado antes de mostrarse.
- **WhatsApp con mensaje precargado** distinto por página.

## Arquitectura

```mermaid
flowchart LR
    V["Visitante"] -->|HTTPS| H["Hostinger<br/>public_html"]
    H --> S["Sitio estático<br/>HTML · CSS · JS"]
    H --> B["Blog en /novedades/<br/>WordPress"]
    S -->|fetch| A["API PHP<br/>agenda.php · contact.php"]
    A -->|"firma HMAC-SHA256"| C[("CRM propio<br/>agenda y entradas web")]
    C --> G["Google Calendar<br/>y Meet"]
    S --> T["Google Tag Manager<br/>GA4 · Clarity"]
    S --> R["HiringRoom<br/>búsquedas"]
```

- El sitio es estático: el servidor solo ejecuta PHP en `api/` (agenda y consulta).
- La API firma cada pedido al CRM con HMAC-SHA256 y nunca le manda la IP del visitante.
- El blog es un WordPress aparte en `/novedades/`, con su propio `.htaccess` y un tema que
  replica el header, el pie y la carga del sitio.

## Estructura del proyecto

```
TEMPLATE-NICO/        Sitio principal (lo que se publica en public_html)
  index.html            Home
  diagnostico-sin-cargo/, gracias-reserva/, postulate/, privacidad/, 404.html
  css/                  styles.css (sistema común), carga.css, motion.css y una hoja por página
  js/                   main.js (módulos comunes), carga.js, motion.js, agenda.js, diagnostico.js, postulate.js
  api/                  agenda.php, contact.php y _crm.php (firma y cola), con su .htaccess
  img/                  Recursos: equipo/ (retratos), oficina/ (galerías), hero/ (escena del inicio), clientes/ y
                        socios/ (logos en WebP); cada foto con variantes de 320 y 480 px
  fonts/, video/        Saira servida desde el sitio y el video institucional del inicio (720p y 1080p)
  .htaccess             Reglas de lanzamiento en Hostinger
  README.md, README-movimiento.md   Documentación del sitio y del movimiento
WORDPRESS/            Blog "Novedades": tema propio (wp-content/themes/intellihelp) y scripts locales
OLD/                  Versiones anteriores, no se publican: web-multipagina-vite/ y wordpress-anterior/
config/               Configuración local de la API (no se versiona; modelo en crm.example.php)
DOCS/                 Documentación: diseño, contenido, marketing, desarrollo, capturas y banner
tools/
  publicar/           construir.py (CSS y JS minificados con versión) y calentar.sh (precarga la CDN)
  capturas/           web.mjs: rehace las capturas de DOCS/capturas desde el sitio publicado
  verificacion/       Pruebas automáticas (páginas en el navegador y emulador del .htaccess)
levantar.cmd, detener.cmd   Entorno local completo (opcional: hoy se trabaja sobre producción)
```

## Desarrollo local

Doble clic en `levantar.cmd` (en segundo plano, sin ventanas) y `detener.cmd` para cortar todo.

| Servicio | Dirección |
|---|---|
| Sitio principal (Vite, con recarga en vivo) | <http://127.0.0.1:5174/> |
| API PHP (`api/`, detrás de Vite) | `127.0.0.1:5176` |
| Correo local (para `mail()` de PHP) | `127.0.0.1:2525` |
| Blog WordPress | <http://127.0.0.1:5180/> (desde el sitio, el menú "Blog" lleva ahí) |
| Base del blog (MariaDB) | `127.0.0.1:3307` |

Requisitos: Node.js 20.19 o superior (con `npm install` en `OLD/web-multipagina-vite/`), PHP 8.2 y MariaDB. Los
registros de cada servidor quedan en `%TEMP%\ith-servidores\`. Lo que se reserve en local va al
CRM de pruebas. Detalle en [TEMPLATE-NICO/README.md](TEMPLATE-NICO/README.md) y
[WORDPRESS/README.md](WORDPRESS/README.md).

## Lanzamiento

El sitio se publica en el `public_html` de intellihelp.tech, que también contiene subdominios y
aplicaciones de la empresa. Resumen:

1. Respaldo del sitio anterior (ya hecho) y del `.htaccess` actual.
2. Mover el núcleo del WordPress anterior a una carpeta de respaldo, sin tocar las carpetas de
   las aplicaciones; conservar el PDF de servicios y la verificación de Search Console.
3. Subir el contenido de `TEMPLATE-NICO/` (sin los archivos de desarrollo) y cargar la
   configuración del CRM fuera de `public_html`.
4. Instalar el blog en `/novedades/`.
5. Purgar el CDN, encender la caché del servidor y verificar las aplicaciones y los subdominios.
6. Correr el checklist de verificación con `curl` (301, 404, caché y rastreadores).

El `.htaccess` deja pasar sin tocar los subdominios y las aplicaciones, hace un solo salto a
`https://www.intellihelp.tech` y redirige con 301 las URLs del sitio anterior. Paso a paso
completo en [TEMPLATE-NICO/README.md → Lanzamiento en Hostinger](TEMPLATE-NICO/README.md#lanzamiento-en-hostinger).

### Publicar un cambio

El sitio ya está publicado; cada cambio se sube directo a producción:

1. `python tools/publicar/construir.py`: pone la versión (`?v=`) a CSS, JS y fuente en cada página y arma en
   `tools/publicar/dist/` la copia minificada.
2. Respaldo en el servidor de los archivos que se reemplazan; después se suben las páginas de `TEMPLATE-NICO/`
   y `css/` y `js/` desde `tools/publicar/dist/` (nunca los de `TEMPLATE-NICO`, que van sin minificar).
3. Limpiar la caché del hosting (vacía también la CDN) y correr `bash tools/publicar/calentar.sh`.
4. Si cambió algo visible, rehacer las capturas con `node ../capturas/web.mjs` desde `tools/verificacion/`.

## Pruebas y verificación

En [`tools/verificacion/`](tools/verificacion/README.md):

```bash
cd tools/verificacion
npm install
npm run todo
```

- **Emulador del `.htaccess`**: 287 casos (subdominios, aplicaciones, `/servicios/`, un solo
  salto, cada 301 con y sin UTM, blog, 404, caché).
- **Rutas viejas en el servidor local**: 180 pedidos.
- **Páginas en el navegador**: las 6 páginas a 1440 y 390 px, con y sin "reducir movimiento"
  (24 comprobaciones): errores de JavaScript, scroll horizontal, subrayados, controles nativos a
  la vista, scroll interno, header común y animación de carga.

## Seguridad

- La clave y el secreto de la API del CRM viven fuera del web root (variable de entorno o
  `ith_web_config/` junto a `public_html`). Nunca se versionan.
- Pedidos al CRM firmados con HMAC-SHA256, con idempotencia; la IP del visitante no sale de la web.
- `api/.htaccess` solo expone `agenda.php` y `contact.php`; el `.htaccess` del sitio niega
  archivos ocultos y no publica índices de carpetas.
- Formularios con límite por IP, trampa para bots y consentimiento versionado (Ley 25.326).
- Política completa en [SECURITY.md](SECURITY.md).

## Licencia

Software **propietario**, desarrollado **íntegramente por Brian Sierra**. Todos los derechos
reservados. El código se publica solo para consulta; se prohíbe su redistribución o uso fuera
del sitio de Intellihelp sin autorización expresa y por escrito del autor. Marcas, textos y logos
pertenecen a sus titulares. El autor conserva su derecho moral de reconocimiento de autoría
(Ley 11.723 art. 52; Convenio de Berna art. 6 bis). Ver [LICENSE](LICENSE).

## Autor

**Brian Sierra** — Administrador de sistemas (SysAdmin) en Intellihelp · [LinkedIn](https://www.linkedin.com/in/brian-gabriel-sierra/) · [GitHub](https://github.com/bsierra4262)

Diseño de la implementación, desarrollo e integración completos: sitio, agenda conectada al CRM, API, blog en WordPress, `.htaccess` de lanzamiento y verificación automatizada.
