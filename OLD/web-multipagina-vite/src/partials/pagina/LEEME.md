# Páginas internas: cómo se arma una

Modelo completo: `servicios/outsourcing-y-service-desk/index.html`. Copialo y cambiá el contenido.

## Receta

1. **Carpeta y archivo.** Creá `<ruta>/index.html` en la raíz del proyecto, por ejemplo `soluciones/seguridad/index.html`. `vite.config.js` la encuentra solo, tanto para el build como para el servidor de desarrollo. No hay que registrarla.
2. **`<html lang="es-AR">` y head.** Primero va `<include src="partials/pagina/head.html" titulo="…" descripcion="…"></include>`. Los dos textos son únicos por página: servicio, ciudad y "| Intellihelp" en el título, de 140 a 160 caracteres en la descripción. La canonical y `og:url` salen solas.
3. **JSON-LD propio de la página** después del head: `Service` en soluciones y servicios, `CollectionPage` en los índices, `AboutPage` en Nosotros, `ContactPage` en Contacto. El `BreadcrumbList` lo pone el parcial de migas y el `FAQPage` el de FAQ. Usá los tokens `{{page.url}}`, `{{site.url}}`, `{{site.name}}` y `{{site.phone.display}}`. El proveedor se referencia con `"@id": "{{site.url}}#organizacion"`.
4. **`<body data-wa-texto="Hola Intellihelp, quiero consultar por …">`.** Es el mensaje de WhatsApp de la página. Lo toman el botón flotante, la banda de contacto y el footer.
5. **Esqueleto del body.** Va igual en todas las páginas:
   ```html
   <a class="skip-link" href="#contenido">Saltar al contenido</a>
   <include src="partials/header.html"></include>
   <main id="contenido"> …bloques… </main>
   <include src="partials/footer.html"></include>
   <include src="partials/whatsapp.html"></include>
   ```
6. **Bloques dentro de `<main>`.** Este es el orden del informe para soluciones y servicios. Cada parcial explica su uso en el comentario de arriba.
   | Bloque | Parcial | Notas |
   |---|---|---|
   | Hero oscuro + migas + h1 | `pagina/hero.html` + `pagina/migas.html` (o `migas-raiz.html`) | Un solo `<h1 id="pagina-titulo">` con la keyword principal |
   | Respuesta corta (40 a 60 palabras) | `pagina/respuesta.html` | Qué es, para quién y dónde |
   | Qué incluye, cómo trabajamos, etc. | `pagina/bloque.html` | Adentro van `servicios__grid`, `pasos__grid`, `problema__split` o `casos__grid` de la home |
   | Datos clave | `pagina/datos.html` + `pagina/dato.html` | Tamaño, modalidad, SLA y horario, cobertura y precio. Lo que no está confirmado va con `.nota`. El precio va envuelto en `<div data-draft>` |
   | Caso real con tecnologías | `pagina/caso.html` | Slots `panel` (cifra + chips) y `extra` (casos chicos) |
   | FAQ de 5 a 8 preguntas | `pagina/faq.html` | El schema se arma solo. Las preguntas sin respuesta llevan `data-draft` |
   | Formulario + WhatsApp | `pagina/cta.html` | Última del main, con las props `titulo` y `necesidad` |
7. **Verificá.**
   - Captura: `node scripts/shot.mjs full <png> 1440 http://localhost:5173/<ruta>/` y lo mismo con `390`. Tiene que dar `errors: []` y `horizontalOverflowPx: 0`.
   - Build a una carpeta temporal: `npx vite build --outDir <tmp>`. En el HTML generado no tiene que quedar ni `{{`, ni `<include`, ni `.nota`.

## Motor de parciales (`plugins/vite-plugin-partials.js`)

- `<include src="partials/…">` resuelve rutas relativas a `src/` desde cualquier página. Desde un parcial, son relativas al parcial.
- **Props:** `<include src="…" titulo="Hola">`.
  - En el parcial: `{{props.titulo}}` (obligatoria) o `{{props.titulo|por defecto}}` (opcional).
  - Sin comillas dobles adentro. Evitá el `&` en props que terminan en JSON-LD.
- **Slots:** el contenido entre `<include>` y `</include>` va a `<slot></slot>`. Los slots con nombre son `<template slot="x">…</template>` en la página y `<slot name="x"></slot>` en el parcial.
- **Tokens:**
  - `{{site.*}}`: datos de `src/data/site.json`. Los teléfonos, los mails, la dirección y los años salen siempre de acá: `{{site.years}}` y `{{site.since}}`.
  - `{{page.path}}`: `/servicios/x/`.
  - `{{page.url}}`: la URL canónica.
  - `{{page.origin}}`: el dominio sin barra final.
- **Links con `data-nav`** (footer) reciben `aria-current="page"` si apuntan a la página actual. Con `data-nav="seccion"` (menú del header), además se marca la sección madre.
- **Ejemplos de uso en comentarios.** Dentro de un comentario `<!-- -->` los `<include>` no se procesan, así que se pueden dejar ejemplos de uso.
- **Build.** Se quitan `.nota`, `[data-draft]` y los comentarios. Para un build de revisión que los conserve: `VITE_NOTAS=1`.

## Reglas que no cambian

- **Estilos.**
  - Solo clases existentes: `components.css`, `sections/*.css` y lo propio de internas en `sections/pagina.css`.
  - Sin estilos inline.
  - Lima sobre oscuro, violeta sobre claro.
- **Animaciones.**
  - `.rv` en lo que aparece al hacer scroll.
  - `.in .dN` en el hero.
  - `.ico` y `.svc-ico` en los íconos.
  - `.card-h` en las tarjetas.
  - `data-count` en las cifras.
- **Contenido.**
  - Solo de `DOCS/marketing/brief-intellihelp.pdf` y `DOCS/contenido/fuentes/`.
  - Lo no confirmado va como `.nota`: título de 1 a 3 palabras y una frase con qué falta y a quién preguntar.
- **Clientes perdidos** (GCBA/ASI/AGIP, Correo, Gendarmería): solo en pasado. El Cronista no aparece.
- **Capacidades internas y herramientas propias:** aprobadas por Dirección (oct. 2026). Se presentan como desarrollo propio de Intellihelp hecho por el equipo de sistemas ("nuestro equipo de sistemas desarrolló…"); solo la tarjeta de Brian dice que las desarrolla él. No se venden ni se les inventan cifras o clientes.
- **Nunca:** IPs, hostnames, subdominios internos, usuarios, puertos, versiones ni reglas.
- **CTA "Agendá una reunión" del header.** Sin JS lleva a `/diagnostico/#agenda`. Si la página tiene la banda `pagina/cta.html` (`#agenda`), baja hasta ahí.
- **Medición** (`src/scripts/modules/analytics.js`):
  - Los IDs se cargan en `site.json`, en `analytics.gtm`, `analytics.ga4` y `analytics.clarity`.
  - Los eventos ya están: `generate_lead` (con `origen`), `click_whatsapp`, `click_phone` y `click_email`.
