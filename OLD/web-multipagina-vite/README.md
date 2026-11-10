# Intellihelp: sitio institucional

> La documentación del proyecto está en `../DOCS/` (ver `../README.md`).

Sitio de **Intellihelp (ITH)**: mesa de ayuda, outsourcing IT, redes e infraestructura y
seguridad física, desde 2012. Reemplaza al WordPress que hoy está en
**https://www.intellihelp.tech** (Hostinger). Son 25 páginas: la home, los índices y las páginas
de Soluciones y Servicios, Clientes, Nosotros, Contacto, Privacidad, la 404 y la landing
`/diagnostico/`, que es el destino del embudo de ventas (reunión por videollamada con Carlos).

- **Stack:** HTML + CSS + JavaScript sin frameworks, armado con [Vite 8](https://vite.dev).
- **Resultado:** un sitio estático (HTML, CSS y JS minificados, con nombres con hash) más tres
  PHP en `api/`: el formulario de contacto (`contact.php`), la agenda de reuniones de
  `/diagnostico/` (`agenda.php`) y la conexión firmada con el CRM (`_crm.php`).
- **Diseño:** estructura de cada sección según el diseño de marketing; colores, énfasis y
  animaciones de la marca (ver [Colores](#colores)).

---

## Requisitos

- **Node.js ≥ 20.19** (recomendado: la LTS actual). Comprobalo con `node -v`.
- npm (viene con Node).
- Para las capturas de `scripts/shot.mjs`: Google Chrome o Microsoft Edge instalado.

## Comandos

```bash
npm install          # una sola vez (o cuando cambie package.json)
npm run dev          # servidor de desarrollo con recarga en vivo
npm run build        # genera dist/ listo para subir a Hostinger
npm run preview      # sirve dist/ en http://localhost:4173 para probar el build
npm run images       # optimiza imágenes de src/assets/img (sharp → .webp)
```

### Desarrollo con recarga en vivo

`npm run dev` levanta **http://localhost:5173** (no abre pestañas nuevas: la que ya tengas abierta se actualiza sola). Cada vez que guardás un
archivo (HTML, parcial, CSS, JS o `src/data/site.json`) la página se actualiza sola: los
cambios de CSS se aplican sin recargar y conservando el scroll. Reemplaza a la extensión
"Live Server" de VS Code (por eso está marcada como no recomendada en `.vscode/`).

- **Desde el celular:** con la PC y el teléfono en la misma red Wi-Fi, abrí la dirección
  `Network:` que imprime la terminal (por ejemplo `http://192.168.0.23:5173`). Si Windows
  pregunta por el firewall, permití el acceso en redes privadas.
- **Desde VS Code:** `Ctrl+Shift+B` ejecuta la tarea "ITH: servidor de desarrollo".
- En desarrollo el formulario de contacto no envía mails: un mock
  (`plugins/vite-plugin-contact-mock.js`) responde OK y muestra los datos en la terminal.

## Estructura

```
.
├── index.html                 Home: <head> (SEO, OG, JSON-LD) e <include> de cada sección
├── soluciones/, servicios/,   Páginas internas: una carpeta con su index.html por página. vite.config.js
│   clientes/, nosotros/,      las encuentra solas. La receta está en src/partials/pagina/LEEME.md
│   contacto/, privacidad/,
│   diagnostico/
├── 404.html                   Página de error propia (noindex)
├── src/
│   ├── partials/              Una sección de la home por archivo (hero.html, servicios.html, …) + fondo.html
│   │   └── pagina/            Bloques de las páginas internas (head, hero, migas, bloque, caso, faq, cta…)
│   ├── styles/
│   │   ├── main.css           Punto de entrada: tokens → base → componentes → secciones → animaciones
│   │   ├── tokens.css         Paleta, tipografía, espaciados, radios, sombras (variables CSS)
│   │   ├── fonts.css          @font-face de Saira y Source Sans 3 (solo latin/latin-ext) + fallbacks métricos
│   │   ├── base.css           Reset y estilos de elementos
│   │   ├── components.css     Piezas reutilizables: .btn, .card, .chip, .eyebrow, .nota…
│   │   ├── animations.css     .rv (aparecer al scrollear), .in (entrada al cargar), .float…
│   │   └── sections/          Un CSS por sección, con prefijo propio (BEM)
│   ├── scripts/
│   │   ├── main.js            Importa estilos/fuentes e inicia los módulos
│   │   ├── diagnostico.js     Solo para /diagnostico/: calendario y video si están cargados en site.json
│   │   └── modules/           Un módulo ES por comportamiento (header, reveal, counters, faq, contact-form, analytics…)
│   ├── data/site.json         FUENTE ÚNICA de datos (contacto, dirección, horario, años, GTM, calendario y video)
│   └── assets/img/            Imágenes de marca y logos (Vite las optimiza y les pone hash)
├── public/                    Se copia tal cual a la raíz del sitio: .htaccess, robots.txt, sitemap.xml,
│                              llms.txt, site.webmanifest, íconos, el archivo de verificación de Search
│                              Console (google9ffcbef7277c41a3.html) y api/ (contact.php, agenda.php y _crm.php)
├── plugins/                   Plugins de Vite propios: parciales + {{site.*}} y mock del formulario
├── scripts/                   Utilidades de Node: shot.mjs (capturas para comparar con el PDF), optimize-images.mjs
├── recursos/logos-fuentes/    Originales de los logos (los usa npm run images)
├── config/                    crm.example.php: modelo de la conexión con el CRM (la real, crm.local.php, no se versiona)
└── vite.config.js             Configuración de Vite (+ preload de fuentes en el build)
```

### Cómo funcionan los parciales y los datos

`index.html` incluye cada sección con `<include src="partials/servicios.html"></include>`.
Dentro de cualquier HTML se pueden usar tokens que salen de `src/data/site.json`:

| Token | Ejemplo |
| --- | --- |
| `{{site.email}}`, `{{site.emailRrhh}}` | info@intellihelp.tech |
| `{{site.address}}`, `{{site.mapsUrl}}` | Av. Dorrego 1789, piso 6, oficina 604, C1414CKM, CABA |
| `{{site.phone.display}}`, `{{site.phone.tel}}` | +54 11 7700-6868 |
| `{{site.whatsapp.url}}`, `{{site.whatsapp.display}}` | enlace wa.me y número visible |
| `{{site.years}}`, `{{site.since}}` | 14 y 2012 |
| `{{site.horario.texto}}`, `{{site.horario.corto}}` | de lunes a viernes, de 9 a 18 |
| `{{site.linkedin}}`, `{{site.year}}` | página de LinkedIn y año del copyright |

**Nunca escribas a mano un mail, teléfono o dirección en el HTML:** cambialo en `site.json` y
se actualiza en todo el sitio. Si falta una clave, el build falla con un mensaje claro.

Los archivos de `public/` no pasan por el motor de tokens: si cambian la dirección, el horario o
los años, hay que corregir `llms.txt` a mano.

### Medición

El sitio carga solo el contenedor de Google Tag Manager (`analytics.gtm` en `site.json`), y
únicamente en `www.intellihelp.tech`. GA4, Clarity, Search Console y los anuncios se configuran
dentro de GTM, por eso `analytics.ga4` y `analytics.clarity` quedan vacíos (si no, se cuenta
doble). En desarrollo no carga nada salvo con `?analytics`; `?analytics=0` lo apaga en esa
pestaña, también en el sitio publicado. Los eventos y el canal de origen están documentados en
`../DOCS/marketing/medicion-embudo.md`.

La landing `/diagnostico/` ofrece los horarios libres de la agenda del CRM
(`diagnostico.calendario = "crm"`, con `tipo` y `vendedor` del CRM) y el video de
`diagnostico.video` (YouTube). Si el CRM no responde o no hay horarios, muestra el formulario
de siempre. Cada consulta y cada reserva llegan al CRM con la página de origen, la página de
entrada, el canal y las UTM. La conexión se configura fuera del repositorio: ver
`config/crm.example.php`.

## Convenciones

### Colores

En el CSS se usan siempre las variables de `src/styles/tokens.css`, nunca hex sueltos.

| Color | Hex | Variable | Uso |
| --- | --- | --- | --- |
| Blanco | `#FFFFFF` | `--c-white` | Fondo de la página y tarjetas |
| Carbón | `#2A2A2A` / `#333333` | `--c-carbon` / `--c-carbon-2` | Texto, header, pie y secciones oscuras |
| Violeta | `#663399` | `--c-violet` | Marca, íconos, eyebrows y énfasis sobre fondos claros |
| Violeta cremita | `#F0EBF5` | `--c-cream` | Franjas suaves y texto secundario sobre oscuro |
| Lima | `#98CC32` | `--c-lime` | Botón principal (CTA) y énfasis sobre fondos oscuros |
| Gris de línea | `#444444` | `--c-line` | Divisores y texto secundario sobre fondos claros |

Contraste WCAG AA: sobre carbón el texto va en blanco, cremita o lima; el violeta se usa sobre
fondos claros.

### Tipografía

Saira (`var(--font-display)`) para títulos, números, eyebrows, botones y nombres; Source Sans 3
(`var(--font-body)`) para el texto corrido. Ambas se sirven desde el propio sitio (sin Google
Fonts ni CDNs), solo con los subsets latin y latin-ext, y con fallbacks métricos de Arial para
que la página no "salte" mientras cargan.

### Notas para revisión: `.nota` y `data-draft`

- `<div class="nota"><b>Para Nico</b>Texto</div>`: pregunta interna sobre un dato que falta.
  El `<b>` lleva a quién va dirigida: "Para Nico", "Para Carlos", "Para Clau", "Para Nico y
  Carlos" o "Pendiente mío". Se escriben en primera persona, cortas y con la opción por
  defecto ("Si no me decís nada, queda así.").
- `data-draft` en cualquier bloque: contenido que **no se publica** todavía.
- Las dos cosas se ven solo en `npm run dev`. El build las borra del HTML, junto con los
  comentarios (`plugins/strip-borradores.js`), así que nunca llegan al sitio publicado. Para
  un build de revisión que las conserve: `VITE_NOTAS=1 npm run build` (y abrirlo con `?notas`).
- La lista completa de lo que falta, por persona, está en `../DOCS/contenido/pendientes-contenido.md`.

### Agregar una página interna

Seguí `src/partials/pagina/LEEME.md`. Después sumala a `public/sitemap.xml` (con su `lastmod`)
y a `public/llms.txt`.

### Agregar una sección a la home

1. Crear `src/partials/mi-seccion.html` con
   `<section id="mi-seccion" class="section" aria-labelledby="mi-seccion-titulo">` y su
   `<h2 id="mi-seccion-titulo">`.
2. Crear `src/styles/sections/mi-seccion.css` (clases con prefijo `.mi-seccion__…`, mobile-first)
   e importarlo en `src/styles/main.css`.
3. Si necesita comportamiento, crear `src/scripts/modules/mi-seccion.js` que exporte
   `initMiSeccion()` y sumarlo a la lista de `src/scripts/main.js`. El contenido tiene que verse
   y funcionar sin JavaScript.
4. Incluirla en `index.html` con `<include src="partials/mi-seccion.html"></include>`.
5. Revisarla en 360, 390, 768, 1024 y 1440 px. Para comparar con el PDF:
   `node scripts/shot.mjs "#mi-seccion" captura.png 1440` (con `npm run dev` corriendo).

### Reglas generales

- HTML semántico, un único `<h1>` (en el hero), sin estilos ni handlers inline.
- Imágenes con `width`, `height`, `alt` en español y `loading="lazy" decoding="async"` (salvo las
  que están sobre el pliegue).
- Sin dependencias nuevas salvo que sean imprescindibles.
- `.editorconfig`: UTF-8, LF, 2 espacios.

## Rendimiento

- CSS y JS minificados en un solo archivo cada uno, con hash en el nombre (caché de 1 año).
- Fuentes variables self-hosted, solo latin/latin-ext (~62 KB las dos que se usan siempre),
  con `<link rel="preload">` agregado automáticamente en el build.
- Imágenes en WebP con medidas explícitas (sin saltos de layout) y carga diferida.
- Animaciones con `IntersectionObserver`, respetando `prefers-reduced-motion`.
- `public/.htaccess`: compresión brotli/gzip, caché agresiva para assets con hash y cabeceras
  de seguridad (CSP, HSTS, etc.).

## Deploy

Resumen: `npm run build` y subir **el contenido** de `dist/` a `public_html` en Hostinger.
El paso a paso, el checklist previo y las redirecciones del WordPress viejo están en
**[../DOCS/desarrollo/DEPLOY.md](../DOCS/desarrollo/DEPLOY.md)**.

Antes de publicar, actualizar el `lastmod` de `sitemap.xml` y la fecha del final de `llms.txt`.
Después de publicar, mandar el sitemap en Search Console y medir con Lighthouse móvil sobre el
sitio real (la meta del informe de visibilidad es 85 o más).

## Desarrollo

Desarrollo y mantenimiento: **Brian Sierra**, jefe de sistemas y soporte técnico de Intellihelp.
La estructura de cada sección parte del diseño de marketing (`../DOCS/diseno/`) y cada dato de los
textos tiene su fuente en `../DOCS/contenido/fuentes/`.
