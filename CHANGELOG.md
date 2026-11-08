# Changelog

Todos los cambios notables de este proyecto se documentan acá.
El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/)
y el versionado, [SemVer](https://semver.org/lang/es/).

## [2.0.0] - 2026-11-08

Nueva versión del sitio: la home y las páginas en HTML, CSS y JavaScript sin frameworks
(`TEMPLATE-NICO/`) y el blog en WordPress (`WORDPRESS/`).

### Added

- **Home en HTML** sobre el diseño de Nico: hero con fondo de luces (placeholder del video), ¿Qué
  ofrecemos? con Servicios y Soluciones en carruseles, Presencia con mapas de Argentina y Latam que
  recorren todas sus zonas, Equipo, Socios tecnológicos, Clientes por rubro con bandas en movimiento
  y avance automático, Nuestra historia, Casos con transición coordinada y barra de avance, la cita
  de Carlos Baldelli, 13 preguntas frecuentes con su `FAQPage` y el cierre "Agendá una reunión".
- **/diagnostico-sin-cargo/**: bloque de reserva propio con el calendario primero (día y horario,
  tus datos, confirmación) conectado a la agenda del CRM propio, consulta sin turno como
  alternativa, casos y pie mínimo.
- **/gracias-reserva/**: confirmación de la reunión con día, horario, invitación y qué tener a mano.
- **/postulate/**: búsquedas abiertas de HiringRoom con el diseño del sitio (sin formulario propio),
  perfiles que se buscan y motivos para sumarse.
- **/privacidad/** (Ley 25.326) y **página 404** propia.
- **Blog "Novedades"** en WordPress en `/novedades/`, con tema propio que replica el header, el pie
  y la carga del sitio.
- **Animación de carga común** a todas las páginas, con versión quieta para "reducir movimiento".
- **Navbar única** en todas las páginas: barra carbón, logo con "Servicios IT / desde 2010", menú
  en mayúsculas, CTA "Agendá reunión →" y panel propio en celular.
- **Botón único** `.btn` con la misma animación de hover, foco y clic en todo el sitio.
- **`.htaccess` de lanzamiento** para Hostinger: subdominios y aplicaciones del hosting intactos,
  un solo salto a `https://www`, 301 del sitio anterior con UTM, caché por tipo de archivo y 404
  propia; con emulador de 287 casos.
- **Verificación automatizada** (`tools/verificacion/`): páginas a 1440 y 390 px, con y sin
  "reducir movimiento", y emulador del `.htaccess`.
- WhatsApp con mensaje precargado distinto por página, JSON-LD en todas las páginas y archivo de
  verificación de Search Console.

### Changed

- La configuración del CRM en el servidor se busca por variable de entorno o junto a
  `public_html`, sin rutas del hosting escritas en el código.

## [1.0.0] - 2026-10-30

### Added

- Primera versión del sitio nuevo, multipágina en Vite (`WEB/`), con la agenda del CRM y el
  formulario de contacto. Se conserva como referencia y porque aporta Vite (`WEB/node_modules`) y
  la configuración local de la API al entorno de desarrollo.
