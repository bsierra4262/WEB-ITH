# Guía de estilo: lenguaje visual de globant.com/es aplicado al template de Intellihelp

Relevamiento hecho sobre https://www.globant.com/es a 1440×900 y 390×844, con valores reales tomados con `getComputedStyle`.
Se usa como referencia de **ritmo, escala, jerarquía y movimiento**. **No** cambia los colores de Nico (`:root` del CSS) ni
los textos o las secciones del template. Donde Globant usa su negro `#0F1014`, acá va el carbón `#2A2A2A`; donde usa su gris
de fondo `#F4F5F2`, acá va el gris `#E6E2EA`; su verde lima de acento se traduce en el lima o el violeta de cada sección,
según la regla de familias que ya está en el template.

---

## 1. Qué define el estilo Globant

1. **Titulares grandes, compactos y en bloque.** Los h2 van en 52 px, peso 700, interlineado 1.04 y tracking −0.03em, con un
   ancho de unos 540 px, así que cortan en 2 o 3 líneas cortas. Cierran con punto, como un titular de diario.
2. **Mucho aire y siempre el mismo.** Todas las secciones llevan 104 px arriba y abajo en escritorio y 64 px en móvil. No hay
   excepciones ni separadores decorativos: el cambio de fondo marca el corte.
3. **Encabezado de sección partido en dos.** El título va a la izquierda y el párrafo de apoyo a la derecha, alineado a la
   base del título. Después vienen 56 px de aire y recién ahí el contenido.
4. **Grilla limpia sobre 1120 px útiles** (contenedor de 1200 px con 40 px de padding). Se usan 2 columnas con 48 px de
   separación, 3 columnas con 24 a 28 px, y un "bento" de 7/5 columnas para los casos.
5. **Listas con líneas finas en lugar de tarjetas.** Filas separadas por un filete de 1 px, con título, una bajada gris y una
   flecha "→" a la derecha. Las tarjetas son la excepción y casi no tienen radio (4 px).
6. **Cero sombras y cero bordes de caja.** Solo hay una sombra en toda la home, y es la de un botón flotante sobre un video.
7. **Blanco y negro con un único acento.** El texto va en negro casi puro y las bajadas en gris azulado. El acento aparece
   solamente en el CTA principal, en el resaltador del hero, en las tarjetas de cifras y en los títulos del pie.
8. **Movimiento mínimo y lento donde importa.** El hover de color dura 0.2 s; el zoom de imagen, 0.8 a 0.9 s con
   easeOutQuint. No hay aparición al scrollear en las secciones: el contenido ya está ahí. La única entrada animada es la
   del hero.

---

## 2. Valores medidos (referencia)

### Tipografía (familia Heebo 400/500/600/700; en el template se mantiene Saira)

| Elemento | Escritorio 1440 | Móvil 390 | Peso | Interlineado | Tracking | Color |
|---|---|---|---|---|---|---|
| h1 del hero | 72 px | 42 px | 700 | 1.08 | −0.035em (−2.52 px) | `#0F1014` |
| h2 de sección | 51.84 px | 32 px | 700 (800 sobre oscuro) | 1.04 | −0.03em | `#0F1014` / blanco |
| h3 de tarjeta | 28 px | 28 px | 700 | 1.2 | −0.02em | `#0F1014` |
| Título de fila de lista | ~22 px | ~20 px | 500 | 1.25 | normal | `#0F1014` |
| Bajada del hero | 19 px | 17 px | 400 | 1.55 | normal | `#3B3E4F` |
| Cuerpo de sección | 17 px (ancho máximo 497 px) | 16–17 px | 400 | 1.6 | normal | `#3B3E4F` (`#B9BECB` sobre oscuro) |
| Texto de tarjeta | 16 px | 16 px | 400 | 1.55 | normal | `#3B3E4F` |
| Metadatos y rótulos | 13–14 px | 13 px | 600 | 1.55–1.7 | normal o +0.01em | `#6A6F87` |
| Cifra grande | 40 / 46 / 56 px | 40–48 px | 700 | 1.0 | −0.03em | negro, o lima sobre oscuro |
| Botón | 16 px | 16 px | 600 | — | normal | — |
| Label de formulario | 13.5 px | 13.5 px | 600 | — | normal | `#3B3E4F` |

Los rótulos ("eyebrows") no van en mayúsculas: son 13–14 px, peso 600, en gris y en frase normal.

### Layout y espaciado
- Contenedor: `max-width: 1200px; padding-inline: 40px` (1120 px útiles); en móvil, `padding-inline: 20px`.
- Secciones: `padding-block: 104px` en escritorio y `64px` en móvil. El hero lleva 56/24 px y mide unos 692 px de alto.
- Encabezado de sección: flex con `gap: 20px 48px`; título de unos 540 px y párrafo a la derecha, alineado abajo; 56 px hasta el contenido.
- Hero: grilla de 2 × 532 px con 56 px de separación; el bloque de texto va en una grilla con `gap: 26px`; acciones con `gap: 26px`.
- Listas en 2 columnas: `grid-template-columns: 1fr 1fr; column-gap: 48px`; cada fila con `padding: 22px 8px`, filete inferior de 1 px y columna de flecha de 24 px.
- Tarjetas en 3 columnas: `gap: 24px`; dentro de cada tarjeta, `gap: 10px` entre imagen, título, texto y etiquetas.
- Casos (bento): una fila de 637 + 455 px (gap de 28–32 px) y otra de 3 × 355 px con 28 px de separación.
- Reconocimientos: rótulo de 180 px + 4 columnas de 206 px, con 28–32 px de separación y un filete arriba.

### Superficies
- Radios: 4 px en tarjetas, 6–10 px en filas clicables, 999 px en botones y 0 en fotos sueltas.
- Sombras: ninguna. La única excepción es el botón sobre el video: `0 10px 30px -10px rgba(0,0,0,.45)`.
- Filetes: 1 px `#E2E3DE` sobre claro y `rgba(255,255,255,.14)` sobre oscuro.
- Fondos: blanco, gris muy claro alternado y un único bloque oscuro (además del pie).

### Botones y links
- Botón principal: píldora `border-radius: 999px`, 48 px de alto, `padding: 16px 24px`, 16 px/600, `gap: 10px` con "→" al final. Fondo negro y letra blanca, o lima con letra negra.
  Hover: el fondo se aclara un paso (`#0F1014 → #2A2D38`) en 0.2 s y la flecha avanza 3 px. No sube, no escala y no tiene brillo ni sombra.
- Link con flecha: 16 px/600 con subrayado dibujado (`background-image` de 1.5 px abajo, `padding-bottom: 3px`, `transition: background-size .25s`) y `gap: 8px` hasta "→".
- Fila de lista: en hover la flecha pasa de gris a negro y avanza 4 px (`transform .2s, color .2s`). El fondo de la fila puede teñirse muy suave (`background-color .2s`, radio de 10 px).

### Header
- Barra `position: fixed; top: 0`, 64 px de alto, fondo sólido negro, filete inferior de 1 px y `z-index` alto.
- **Siempre visible:** no se esconde al scrollear, no cambia de color, no tiene transparencia ni blur.
- Navegación de 15–16 px/500 con chevrons en los desplegables. "Contáctanos" va como texto, separado por filetes verticales de 1 px. En móvil, logo + hamburguesa en 64 px.

### Imágenes y video
- `object-fit: cover`, proporciones 4:3, 1.27 y 16:10, sin radio (o 4 px dentro de una tarjeta).
- Hover de la tarjeta: la imagen escala a 1.04–1.05 en `0.8–0.9s cubic-bezier(.22,1,.36,1)`, dentro de un marco con `overflow: hidden`.
- Video: `muted loop playsinline`, `object-fit: cover` a pantalla completa, o `contain` como pieza de producto.
- Logos de clientes: 44 px de alto, monocromos (`filter: brightness(.15); opacity: .55`), en una cinta con `gap: 56px` que recorre en 70 s lineal, con bordes fundidos (`mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)`).
- Logos de socios: grilla de 2 columnas con separadores de 1 px (`gap: 1px` sobre fondo de línea).

### Movimiento
| Uso | Duración | Curva |
|---|---|---|
| Color, fondo y opacidad (hover) | 0.2 s | `ease` |
| Subrayado del link | 0.25 s | `ease` |
| Elevación de tarjeta (si la hay) | 0.35 s | `ease` |
| Zoom de imagen | 0.8–0.9 s | `cubic-bezier(.22,1,.36,1)` |
| Entrada del hero (subida) | 0.7 s | `cubic-bezier(.22,1,.36,1)` |
| Entrada del hero (enfoque y resaltador) | 0.9–1 s | `cubic-bezier(.22,1,.36,1)` |
| Barra de progreso del carrusel del hero | 16 s | `linear` |
| Cinta de logos | 70 s | `linear` |

No hay aparición al scrollear en las secciones ni animaciones decorativas infinitas (salvo la cinta de logos y la barra del carrusel).

### Lo que **no** se copia de Globant
- El foco: ellos lo dejan en `outline: none`. En el template queda el `:focus-visible` actual.
- `prefers-reduced-motion`: ellos solo lo cubren en formularios. En el template se cubre todo, como hasta ahora.

---

## 3. Tokens propuestos para el template (sin colores nuevos)

```css
:root {
  /* ritmo */
  --wrap-max: 1200px;
  --wrap-pad: 40px;                         /* 20px en <=600px */
  --section-y: clamp(64px, 7.2vw, 104px);
  --head-gap: 56px;                         /* encabezado de sección -> contenido */

  /* escala (Saira es más ancha que Heebo: tracking un poco más cerrado) */
  --fs-hero: clamp(42px, 5vw, 72px);        /* lh 1.06, tracking -0.035em */
  --fs-h2: clamp(32px, 3.6vw, 52px);        /* lh 1.04, tracking -0.03em */
  --fs-h3: clamp(22px, 1.9vw, 28px);        /* lh 1.2, tracking -0.02em */
  --fs-row: clamp(19px, 1.5vw, 22px);       /* títulos de fila, peso 500 */
  --fs-lead: clamp(17px, 1.35vw, 19px);     /* lh 1.55 */
  --fs-body: 17px;                          /* lh 1.6 */
  --fs-meta: 13px;                          /* peso 600 */
  --fs-stat: clamp(40px, 3.9vw, 56px);      /* lh 1, tracking -0.03em */

  /* superficies */
  --radius-card: 4px;
  --radius-row: 8px;
  --radius-pill: 999px;

  /* movimiento */
  --ease-out: cubic-bezier(.22, 1, .36, 1);
  --t-fast: .2s;
  --t-line: .25s;
  --t-img: .85s;
}
```

Traducción de colores, todos de la paleta actual:

| Globant | Template |
|---|---|
| Negro `#0F1014` | `--ink` `#2A2A2A` |
| Cuerpo `#3B3E4F` | `--muted` `#444444` |
| Metadatos `#6A6F87` | `--muted` `#444444` (con 13 px y peso 600 la jerarquía la da el tamaño, no un gris nuevo) |
| Fondo alternado `#F4F5F2` | `--gray-bg` `#E6E2EA` |
| Filete `#E2E3DE` sobre blanco | `--gray-bg` |
| Filete sobre gris | `--white` |
| Filete sobre carbón | `--line-dark` `#4A4A4A` |
| Lima de acento `#D6FD4E` | `--lime` o `--purple`, según la familia de la sección |

---

## 4. Reglas concretas

- **Títulos (h2 `.section-title`):** `font-size: var(--fs-h2); font-weight: 700; line-height: 1.04; letter-spacing: -0.03em; max-width: 14ch` (unos 540 px en escritorio). Pasa de 1.1 a 1.04 y de 52 px de tope a 52 px con piso de 32 px.
  `.section-title--big` y `#historia .section-title` quedan en el mismo tope de 52 px o, como máximo, 64 px. La jerarquía la da el aire, no el tamaño.
- **`.lead`:** baja de 21 px a `var(--fs-lead)` (19 px) con `line-height: 1.55` y `max-width: 500px`.
- **`.section`:** `padding-block: var(--section-y)`. Se unifica `.section--dark` (hoy 104) con el resto, y `.clients` (hoy 48/64) también pasa a `var(--section-y)`.
- **`.wrap`:** `max-width: 1200px; padding-inline: 40px` (hoy 1180/32); 20 px en móvil.
- **`.section-head`:** en ≥1024 px, `display: grid; grid-template-columns: minmax(0, 540px) minmax(0, 500px); justify-content: space-between; align-items: end; column-gap: 48px; margin-bottom: var(--head-gap)`.
  El rótulo y el título van en la columna izquierda y el `.lead` en la derecha. Debajo de 1024 px se apila con `gap: 20px`.
- **`.eyebrow`:** se conserva la barrita de color (es identidad de Nico), pero baja a 13 px/600, `letter-spacing: .06em` (hoy .14em), con `margin-bottom: 16px`. Si se quiere más Globant, `text-transform: none`: no cambia el texto, solo la caja.
- **Botones `.btn`:** `border-radius: var(--radius-pill); min-height: 48px; padding: 0 24px; font-size: 16px; gap: 10px`.
  Hover: solo cambio de fondo y color en `var(--t-fast)` y `.arr` con `translateX(3px)`. Se quitan `translateY(-3px) scale(1.025)`, la sombra y el brillo `::after`.
  Si se quiere conservar un gesto propio, el brillo puede quedar **solo** en el CTA principal del hero y de la agenda.
- **Links "siguiente" (`.next-link`):** subrayado dibujado con `background: linear-gradient(currentColor, currentColor) 0 100% / 100% 1.5px no-repeat; padding-bottom: 3px; text-decoration: none`, con el color de la familia de la sección.
  Hover: `background-size: 0 1.5px → 100%` desde la izquierda (o al revés, que se retire), en `var(--t-line)`, y `.arr` con `translateX(4px)`.
- **Tarjetas (`.card-h`, `.service`):** `border-radius: var(--radius-card)` (hoy 16 px), sin sombra. Hover: sin `translateY(-5px)` ni sombra. Si la tarjeta tiene imagen, la imagen hace zoom 1.04 en `var(--t-img) var(--ease-out)`; si no tiene, el fondo cambia un paso (gris → lila, o carbón → `--line-dark`) en 0.2 s.
- **Filas de lista:** `display: grid; grid-template-columns: 1fr 24px; gap: 18px; padding: 22px 8px; border-bottom: 1px solid <filete>`, título en `var(--fs-row)`/500 y bajada de 16 px en `--muted`.
  Hover y foco: la flecha va de `--muted` al color de acento y avanza 4 px.
- **Cifras (`.num`, contadores):** `font-size: var(--fs-stat); font-weight: 700; line-height: 1; letter-spacing: -0.03em`, con el rótulo de 13 px/600 arriba y la descripción de 15 px abajo.
- **Imágenes:** `object-fit: cover`, `aspect-ratio` fijo (4/3 en destacadas y 16/10 en secundarias), radio de 0 o 4 px y marco con `overflow: hidden`.
- **Aparición al scrollear (`.rv`):** se mantiene, porque sin JS ya se ve todo, pero más sobria: `translateY(16px)` (hoy 26 px), `0.8s var(--ease-out)`, sin el `pop` de escala y sin `float` infinito en los íconos. El trazo `draw` de los íconos puede quedar, ya que es breve y se ejecuta una sola vez.
- **Reduced motion:** todo lo anterior, dentro de `@media (prefers-reduced-motion: no-preference)`. Con `reduce`, el hover cambia solo color y fondo, sin zoom ni desplazamiento de flecha, y la cinta de logos se detiene.

---

## 5. Sección por sección

**Header.** La altura baja de 77 a 64 px (`--header-h: 64px`). Queda sticky, siempre visible, sin ocultarse al bajar y sin
sombra al scrollear: fondo blanco sólido (decisión de Nico) y filete inferior de 1 px en `--gray-bg`. Navegación de 16 px/500.
El CTA del header va como texto con "→", o como píldora de 40 px, separado de la navegación por un filete vertical de 1 px. En
móvil, logo + hamburguesa en 64 px. Foco visible igual que hoy.

**Hero con video.** El video sigue a pantalla completa (`object-fit: cover`, `muted loop playsinline`, póster) con el velo
oscuro actual. El texto se alinea a la izquierda en una columna de unos 600 px: h1 en `var(--fs-hero)`, 700, 1.06 y
−0.035em; bajada de 19 px/1.55; acciones con 26 px de separación (botón píldora y link con flecha subrayado).
Entrada: el título sube 16 px con `opacity` en 0.7 s `var(--ease-out)`, la bajada y las acciones lo siguen con 0.1 s y 0.2 s
de demora, y el video entra con el `heroMedia` actual. La palabra `.hl` puede llevar el **resaltador pintado** de Globant en
versión de paleta: barra lima sólida detrás de la palabra (`background: linear-gradient(var(--lime), var(--lime)) 0 88% / 0% 42% no-repeat; box-decoration-break: clone; padding: 0 .06em`), que crece a `100% 42%` en 0.9 s `var(--ease-out)`, con la letra en blanco o carbón según el contraste sobre el velo.
Sin JS o con reduced motion, el resaltador queda pintado y fijo.

**Servicios (blanco, violeta).** Encabezado partido: título a la izquierda y `.lead` a la derecha. El carrusel se mantiene,
pero las tarjetas grises pasan a radio de 4 px, sin sombra ni elevación, con número en 13 px/600 `--muted`, título en
`var(--fs-h3)` −0.02em y texto de 16 px/1.55. Los controles del carrusel van como círculos de 44 px con filete violeta y
sin relleno; en hover se rellenan en 0.2 s.

**Soluciones (gris, lima).** Mismo encabezado partido. Las tarjetas carbón `.service--dark` quedan como bloque
oscuro (equivalen al bloque Glob.AI de Globant): radio de 4 px, `padding: 28px`, título blanco y texto en lila. El acento
lima va solo en la chapa del ícono y en el CTA. Hover: fondo de carbón a `--line-dark` en 0.2 s y flecha que avanza.

**Presencia nacional (blanco, violeta) y regional (gris, lima).** Título a la izquierda y mapa a la derecha, en una grilla
de 5/7 columnas con 48 px de separación. Las cifras (provincias, países, sedes) usan el estilo de cifra grande (52–56 px, 700,
lh 1, −0.03em) en una fila con filete superior, como la franja de reconocimientos de Globant. La card del mapa regional queda
en carbón con radio de 4 px y sin sombra. El encendido de las provincias se mantiene, con `var(--ease-out)`.

**Clientes (blanco, violeta).** El fichero se mantiene. Los logos de las tarjetas pueden ir en monocromo en reposo
(`filter: grayscale(1); opacity: .7`) y a color en hover o foco en 0.2 s. Pestañas y controles con filetes de 1 px en lugar de cajas
con sombra, y radio de 4 px.

**Socios tecnológicos (gris, lima).** Una grilla de logos con separadores de 1 px, al estilo del panel "Enterprise" de
Globant: contenedor con `background: var(--white); gap: 1px`, celdas en `--gray-bg`, logos de 40–44 px de alto centrados y
`padding: 28px`. Si hay cinta en movimiento: 70 s lineal, bordes fundidos con `mask-image` al 8% y pausa en hover, en foco y con
reduced motion.

**Equipo (blanco, violeta).** Encabezado partido (título a la izquierda y una línea corta a la derecha, alineada abajo).
Las fotos van en un mosaico de 2 columnas, con una foto alta a la izquierda y dos o tres más bajas a la derecha, 12 px de
separación, `object-fit: cover`, radio de 4 px y zoom de 1.05 en 0.9 s en hover. Los perfiles usan nombre en 20–22 px/600 y cargo en 13 px/600 `--muted`.

**Historia (gris, lima con línea violeta).** El título baja al tope común de 52 px. La línea de tiempo pasa a una franja
horizontal con filete superior: años en estilo cifra (40 px, 700, −0.03em) y descripción de 15 px/1.4 en columnas de unos
200 px con 28 px de separación. En móvil queda vertical, con filete a la izquierda. Los hitos aparecen con el `.rv` sobrio y
sin `pop` de escala.

**Cómo trabajamos (blanco, violeta).** Los pasos se arman como lista de filas en 2 columnas, igual que los AI Studios: número
de 13 px/600 violeta, título en `var(--fs-row)`/500, bajada de 16 px `--muted` y filete inferior de 1 px `--gray-bg`. Sin
tarjetas grises; si se mantienen, que sea con radio de 4 px y sin sombra. La barra `stepbar` puede quedar como filete violeta que
se dibuja de izquierda a derecha en 0.8 s.

**Casos (gris, lima).** Es la sección que más se parece a "De las ideas a los resultados". Encabezado partido con el link
"ver todos" a la derecha. El carrusel se mantiene, con las tarjetas al estilo de una historia: cliente arriba en 13 px/600
`--muted`, título en 22–24 px/500 lh 1.3, e imagen o logo en 16:10 con zoom en hover.
Las tarjetas de cifra van en carbón con el número en lima (52–56 px), `padding: 28px` y radio de 4 px. El filtro de casos va
como pestañas de texto 15 px/600 con subrayado de 2 px en el acento para la activa, sin cajas.

**Preguntas (blanco, violeta).** Acordeón de filas: pregunta en 20–22 px/500, `padding: 22px 0`, filete inferior
`--gray-bg` y un ícono "+" de 24 px que gira 45° en 0.2 s. La respuesta va en 17 px/1.6 `--muted`, con un ancho máximo de 720 px.
Encabezado partido con el título a la izquierda.

**Agenda / CTA final (gris, lima, `.section--dark`).** Dos columnas al estilo del contacto de Globant: título grande a la
izquierda (52 px, 3 líneas) con bajada de 17 px, y a la derecha la card o el formulario.
Si hay campos: solo línea inferior (`border: 0; border-bottom: 1px solid var(--line-dark)` o `--ink`), radio 0, 16 px,
`padding: 10px 2px`, labels de 13–14 px/600 y foco con línea de 2 px en el acento. Botón píldora lima con letra carbón.
La card `.card-dark` queda en carbón, con radio de 4 px y sin sombra.

**Footer.** Se mantiene blanco (decisión de Nico) con la estructura de Globant: logo y copyright de 14 px `--muted` arriba;
3 o 4 columnas con títulos de 16 px/600 en carbón (el lima no va como texto fino) y links de 14 px/20 px, separados por 16 px,
subrayados con `text-underline-offset: 3px`. Abajo, una franja legal con filete superior de 1 px `--gray-bg` y links de 14 px
`--muted` repartidos.

---

## 6. Prioridades de aplicación (de mayor a menor impacto)

1. Escala y tracking de h1/h2 + `line-height` 1.04–1.06 + aire uniforme de 104/64 px.
2. Encabezado de sección partido (título a la izquierda y bajada a la derecha) en todas las secciones.
3. Botones píldora sobrios (sin subir, sin escalar, sin brillo) y links con subrayado dibujado.
4. Radios de 16 a 4 px y fin de las sombras en tarjetas.
5. Filas con filete en Cómo trabajamos, Preguntas y Footer.
6. Zoom lento de imágenes en el hover y `.rv` más corto, sin `pop` ni `float`.
7. Header de 64 px y resaltador pintado en el hero.

Capturas de referencia: guardadas fuera del repositorio
(`d-*.png` a 1440 y `m-*.png` a 390). Valores crudos en `estilos.json` e `interaccion.json`, también entre las capturas de referencia guardadas fuera del repositorio.

---

## 7. Receta de animaciones para la home de Nico

Segundo relevamiento de https://www.globant.com/es (6/11), a 1440×900 y 390×844. Se registró cada animación y transición que
arranca el navegador mientras se recorre la página de punta a punta, y se leyeron las hojas de estilo de cada bloque. Las capturas de hover y los
datos crudos están entre las capturas de referencia guardadas fuera del repositorio
(`scroll-1440.json`, `scroll-390.json`, `m2-1440.json`, `mfe-anim-rules.txt` y `hov-*.png`).

### 7.1 Qué hace Globant (medido)

**Aparición al scrollear.** No hay. Al bajar por toda la home a 1440 no arranca ninguna animación fuera del hero: títulos,
textos, tarjetas y logos ya están quietos y visibles. La única pieza ligada al scroll es la notebook del bloque Glob.AI: la tapa
se abre con `rotateX` de −42° a 0 y un desenfoque que va de 7 px a 0 según el avance, con `transition: .08s linear` (en celular
se ve el giro parcial). Todo el movimiento de entrada de la página está concentrado en el hero.

**Coreografía del hero (es su vocabulario de entrada).** Usa tres keyframes y una sola curva, `cubic-bezier(.22,1,.36,1)`
(easeOutQuint):

| Keyframe | Qué hace | Dónde |
|---|---|---|
| `mfeHeroFocus` | `opacity 0 → 1`, `filter: blur(14px) → none`, `translateY(8px) → 0` | Títulos, bajadas, imagen del slide |
| `mfeHeroRise` | `opacity 0 → 1`, `translateY(18px) → 0` | Rótulo, botones, link, insignias |
| `mfeHeroMarkerPaint2` | `background-size: 0% .62em → 100% .62em` | Resaltador detrás de la palabra clave |
| `mfeHeroFade` | `opacity 0 → 1` | Fondo del slide oscuro (1.4 s, `ease`, demora de .3 s) |

Escalonado real del slide claro: título en `1s` con demora de `.1s`, bajada en `.9s` con `.4s`, resaltador en `.9s` con
`.8s`, botón en `.7s` con `.7s` y link en `.7s` con `.85s`. Es decir: el título enfoca, la bajada entra 0.3 s después y las
acciones cierran entre 0.7 y 0.85 s, con 0.15 s entre el botón y el link. En los otros slides el patrón es el mismo: rótulo a
`.05s`, título a `.15–.2s`, bajada a `.45–.5s`, botón a `.75–.85s` e insignia a `.9s`. Nada termina después de ~1.6 s.

Cambio de slide: hay un fundido cruzado con `opacity .7s` (el slide saliente apaga `visibility` recién a los 0.7 s). El bloque de texto e
imagen sube `translateY(16px) → 0` en `.8s` easeOutQuint con `.15s` de demora. La barra de progreso de cada solapa va de `width 0` a `100%`
de forma lineal en 8 s (16 s la primera), sobre un riel de 4 px con radio 4 que se oscurece en hover en 0.2 s.

**Hover (valores computados antes y después):**

| Elemento | Efecto | Duración y curva |
|---|---|---|
| Tarjeta con imagen (historias, core studios, fotos de equipo) | El marco sube `-3px` y toma la sombra `0 22–26px 44–50px -18/-20px rgba(15,16,20,.35–.45)`; la imagen interna escala a `1.04–1.06` | Marco: `.35s ease`; imagen: `.8–.9s` easeOutQuint |
| Tarjeta de cifra (lima) | Sube `-3px` y toma la sombra `0 26px 50px -20px rgba(15,16,20,.35)` | `.35s ease` |
| Título de tarjeta | Subrayado de 1.5 px con `text-underline-offset: 4px` | Instantáneo |
| Fila de lista (noticias, studios) | El fondo se tiñe (`background-color`) y la flecha hace `translateX(4px)` y pasa de gris a negro | `.2s ease` |
| Botón píldora | Solo cambia el fondo un paso; la flecha avanza `3px` | `.2s` |
| Link con flecha | Subrayado fijo de 1.5 px; la flecha avanza `3px` | `.2–.25s ease` |
| Link de texto (equipo) | Subrayado que se dibuja con `background-size: 0 → 100% 1.5px` | `.25s ease` |
| Campos del formulario | La línea inferior pasa de gris a gris oscuro (hover) y a negro (foco) | `.2s ease` |
| Logo de cliente | `opacity .55 → 1` | `.2s ease` |

Corrección respecto de la sección 1: las tarjetas con imagen **sí** se elevan 3 px con una sombra difusa en el hover; lo que
no tienen es sombra en reposo. Los botones no se elevan.

**Logos de clientes.** En la home no tienen título ni filtros. Hay un párrafo de presentación (con la primera oración en negrita) y
debajo una cinta de 18 logos duplicados (36 en el DOM; el recorrido es `translateX(0 → -50%)`). Miden 44 px de alto, con `gap: 56px`,
y la cinta corre a `70s linear infinite`, con bordes fundidos con `mask-image` al 8 % y pausa al pasar el mouse. Son monocromos
(`filter: brightness(.15); opacity: .55`), salvo dos que quedan a color. La cinta solo se anima dentro de
`prefers-reduced-motion: no-preference`; con `reduce` queda quieta.

**Bloques de CTA.** No hay banners, pop-ups ni CTA fijo en pantalla. Usan tres recursos:
1. Bloque oscuro de sección completa (Glob.AI): `padding: 104px 0`, título, bajada y **un solo** botón píldora lima con
   flecha. En hover el lima se aclara un paso y la flecha avanza 3 px.
2. Cierre de contacto sobre gris claro, en dos columnas: título grande y bajada a la izquierda, y a la derecha un formulario de
   campos con línea inferior y un botón negro con flecha. Al enviar, el botón muestra un spinner de `.7s linear` y la tarjeta
   de agradecimiento entra con `translateY(10px)` y `opacity` en `.6s` easeOutQuint.
3. En cada sección, un link con flecha ("Todas las historias", "Todas las noticias") arriba a la derecha, alineado al título.

**Microinteracciones.** En todo lo clicable hay una flecha que avanza 3–4 px. El foco lleva contorno de 2 px con
`outline-offset: 2–3px`. Las únicas animaciones decorativas infinitas son la cinta de logos y el spinner. Con `reduced-motion`
se cortan la cinta, la coreografía del hero y el desplazamiento de la flecha; el resto de la página ya está quieta.

### 7.2 Traducción a la home de Nico

Criterio: Nico **sí** tiene aparición al scrollear (`.rv`), y eso forma parte de cómo se siente su página, así que se mantiene. De
Globant se toma el vocabulario (rise de 18 px, enfoque con blur, easeOutQuint, escalonado corto) y la disciplina:
cada cosa aparece una sola vez, todo termina antes de 1.2 s y no hay movimiento perpetuo que no informe nada. Los componentes de
Nico (botones `.btn-soft`, `.btn-gray`, `.btn-lime` y `.btn-light`, header, tarjetas, fichero, slots de socios, mapas y colores) no se
reemplazan: solo se ajustan tiempos y curvas.

**Tokens** (se suman a `:root`, sin tocar los colores):

```css
:root {
  --ease-out: cubic-bezier(.22, 1, .36, 1);   /* easeOutQuint: curva de entrada y de zoom */
  --t-fast: .2s;     /* color, fondo, opacidad, flecha */
  --t-line: .25s;    /* subrayado dibujado */
  --t-lift: .35s;    /* elevación de tarjeta */
  --t-in: .7s;       /* rise */
  --t-focus: .9s;    /* enfoque de títulos */
  --t-img: .85s;     /* zoom de imagen */
  --stagger: .08s;   /* paso del escalonado */
}
```

**Keyframes.** Reemplazan `rise` y `pop` y suman `focusIn`; `draw`, `stepbar`, `provOn` y `histRing` quedan como están:

```css
@keyframes rise    { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
@keyframes focusIn { from { opacity: 0; filter: blur(10px); transform: translateY(8px); } to { opacity: 1; filter: none; transform: none; } }
@keyframes popSoft { from { opacity: 0; transform: scale(.86); } to { opacity: 1; transform: none; } }
@keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
```

`float` se elimina. `pop`, que hoy arranca en `scale(.4)`, pasa a `popSoft` (`.86`): el ícono sigue apareciendo, pero sin rebote.

**Disparo del revelado (main.js).** Hoy el `IntersectionObserver` hace `toggle('show', isIntersecting)`: cada vez que
algo sale de pantalla se vuelve a ocultar, y repite la entrada al volver. Pasa a dispararse una sola vez, como la entrada del
hero de Globant:

```js
const io = new IntersectionObserver((entries) => {
  entries.forEach(({ target, isIntersecting }) => {
    if (!isIntersecting) return;
    target.classList.add('show');
    io.unobserve(target); // aparece una vez; al volver a subir ya está ahí
  });
}, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
```

En los bloques más altos que la pantalla (fichero, línea de tiempo, carrusel de casos), el umbral de 0.15 puede no alcanzarse
en celular. Para esos va `threshold: 0` con el mismo `rootMargin`, o un segundo observer. El escalonado por defecto pasa a
`Math.min(index, 4) * 0.08` s (hoy es `min(index, 3) * 0.09`). Donde hay `data-d`, sigue mandando ese valor.

**Qué se anima y cómo, por elemento:**

| Elemento | Animación | Duración / demora | Notas |
|---|---|---|---|
| `.section-head.rv` | El contenedor no se mueve; se animan sus hijos | — | Así el título no viaja junto con el rótulo |
| ↳ `.eyebrow` | `rise` | `.7s` / `0s` | |
| ↳ `.section-title` | `focusIn` | `.9s` / `.08s` | Blur de 10 px (14 px en el h1 del hero) |
| ↳ `.lead` | `rise` | `.7s` / `.2s` | |
| Tarjetas `.service.card-h.rv` | `rise` | `.7s` / `.25s + i × .08s`, con tope en `.57s` | Solo las visibles del carrusel; las que entran por las flechas no se escalonan |
| Ícono `.svc-ico` / `.ico` | `popSoft` + trazo `draw` | `.5s` / `+.15s`; `draw .8s` / `+.25s` | Sin `float` |
| Cifras `.num` y contadores | `popSoft` y conteo | El conteo pasa de `2.2s` a `1.4s`, con ease-out cúbico | |
| `.member.rv` (equipo) | `rise` | `.7s` / `i × .08s`, con tope de 4 | |
| `.hist__item.rv` | `rise` con `14px` | `.6s` / `0s` (cada hito al entrar) | El anillo `histRing` queda en `1.1s`, con `--ease-out` |
| `.step.rv` (cómo trabajamos) | `rise` | `.7s` / `i × .08s` | `stepbar`, como filete que se dibuja en `.8s` |
| `.map-card.rv`, `.presence__text.rv` | `rise` | `.7s` / `0s` y `.1s` | Provincias: `provOn .5s` con `--ease-out` y `.05s` entre una y otra |
| `.slots-groups.rv`, `.filecab` | `fadeIn` | `.6s` | Los logos no suben: aparecen en su lugar |
| `.faq.rv` | `rise` | `.7s` | Las filas internas no se escalonan |
| `.section-cta.rv`, `.section-next.rv` | `rise` | `.7s` / `.3s` | Siempre después del contenido de la sección |
| `.cta-card.card-dark.rv` (agenda) | `rise` | `.7s` / `.15s` | |

**Qué no se anima:** el header (siempre quieto), los párrafos dentro de tarjetas y desplegables, los chips sueltos (entran con
su tarjeta), cada logo por separado, los textos legales del pie y todo lo que ya está visible al cargar debajo del hero.
Ninguna animación de `opacity` sola dura menos de `.4s` ni más de `1s`, y ningún desplazamiento supera los 18 px.

**Hero.** Se mantiene la idea de Nico (primero el video; el texto aparece al tocar la flecha o al scrollear), pero con la cadencia
de Globant. Las demoras se miden desde que se abre:

| Pieza | Animación | Duración / demora |
|---|---|---|
| `.hero__media` | `fadeIn` + `scale(1.03 → 1)` | `1.4s ease` / `0s` (hoy es `heroMedia 1.2s` con `1.06`) |
| `.eyebrow` | `rise` | `.7s` / `.05s` |
| Primera línea (`h1 > span`) | `focusIn` (blur de 14 px) | `1s` / `.1s` |
| Segunda línea (`h1 > span`) | `focusIn` (blur de 14 px) | `1s` / `.22s` |
| `.hl` | Mantiene su color; como opción, subrayado pintado en lima (`background-size: 0 → 100% .12em`, en `0 100%`) | `.9s` / `.8s` |
| `.hero__lead` | `focusIn` | `.9s` / `.4s` |
| `.btn-lime` | `rise` | `.7s` / `.7s` |
| `.btn-light` | `rise` | `.7s` / `.85s` |
| `.hero__note` | `rise` | `.7s` / `.95s` |
| `.stats` | `rise` + conteo | `.7s` / `1.05s`; el conteo arranca a `1.2s` |
| `.hero__down` | `nudge` | Pasa de `2.2s infinite` a `2.8s ease-in-out 3` (se mueve tres veces y queda quieto) |

Los `data-d` actuales (`.45 / .6 / .75 / .9 / 1.05 / 1.15 / 1.3`) pasan a `.05 / .1 / .22 / .4 / .7 / .95 / 1.05`. La entrada
completa baja de ~2.2 s a ~1.6 s, como en Globant.

**Hover.** Todo lo que se mueve va siempre dentro de `@media (hover: hover) and (prefers-reduced-motion: no-preference)`:

| Elemento de Nico | Se conserva | Se ajusta |
|---|---|---|
| `.btn-soft`, `.btn-gray`, `.btn-light` | La inversión de colores de cada uno | `transition: background-color var(--t-fast), color var(--t-fast), border-color var(--t-fast), transform var(--t-lift) ease` |
| `.btn-lime` | `brightness(1.06)` | Ídem |
| `.btn` (todos) | El brillo `::after` que cruza el botón | Pasa de `.65s var(--ease)` a `.8s var(--ease-out)`. El gesto pasa de `translateY(-3px) scale(1.025)` con sombra a `translateY(-2px)`, sin escala y sin sombra |
| `.btn .arr`, `.next-link .arr` | La flecha que avanza | De `6px` en `.3s` a `4px` en `var(--t-fast) ease` |
| `.next-link` | Subrayado de 2 px en lima o violeta | Al pasar el mouse, el color pasa a violeta en `var(--t-fast)`. Opcional: `text-underline-offset` de 4 a 6 px en `var(--t-line)` |
| `.card-h` (servicios, soluciones) | La elevación | De `-5px` en `.4s` a `-3px` en `var(--t-lift) ease`, con sombra `0 22px 44px -18px rgba(42,42,42,.30)` (en `.service--dark`, `rgba(0,0,0,.45)`) |
| `.member__photo` | El filete violeta de 2 px | Se suma un zoom de la foto, `scale(1.05)` en `var(--t-img) var(--ease-out)`, dentro del marco con `overflow: hidden` |
| `.logo--link` (fichero, con caso) | La elevación de 2 px | Sombra `0 10px 24px -12px rgba(42,42,42,.25)` en `var(--t-lift) ease` |
| `.slot img` (socios) | El giro sobre el eje horizontal | De `.32s var(--ease)` a `.45s var(--ease-out)`. `STEP_MS` pasa de 1000 a 1800 ms (hoy es la zona más nerviosa de la página) |
| `.wa-float` | El cambio de lima a blanco | Sin `scale(1.06)`: `translateY(-2px)` en `var(--t-lift)`. Entra una sola vez con `rise .5s` a los 1.5 s |
| `.carousel__btn` | El relleno al pasar el mouse | `var(--t-fast)` |
| Filas de `.faq__item` | — | Fondo `--lavender` en `var(--t-fast)` y chevron que gira en `.2s`; apertura con `interpolate-size` en `.35s var(--ease-out)` |

**Logos.** El fichero de clientes (con sus rubros como filtros) y la grilla de socios son de Nico y se quedan: Globant no
tiene un equivalente con filtros. Se les aplica su acabado: los logos van a color (son marcas de clientes reales), sin
monocromo en reposo, y en el fichero la caída de la ficha usa `--ease-out` en `.7s`. No se agrega una cinta en movimiento (sería
una sección nueva). Si en algún momento se quiere, la receta es la de 7.1: 44 px de alto, `gap: 56px`, 70 s lineal,
`mask-image` al 8 %, pausa en hover y en `:focus-within`, y quieta con `reduce`.

**Bloques de CTA.** Los CTA de sección (`.section-cta`) entran después del contenido (`rise .7s` con `.3s` de demora) y nunca
llaman la atención con movimiento propio: sin pulso, sin rebote y sin brillo automático. El brillo del botón queda solo para
el hover. El cierre `#agenda` sigue el esquema de Globant que Nico ya tiene: título y bajada a la izquierda, y a la derecha la card carbón
con un único botón principal lima y el de WhatsApp como secundario.

**Cambios de slide en los carruseles (Casos y Servicios).** Se copia el pase de Globant: la tarjeta saliente se funde en `.7s`
y el contenido de la entrante sube de `16px` a `0` en `.8s var(--ease-out)`, con `.15s` de demora. Dentro de la tarjeta de caso:
logo con `popSoft .5s`; nombre y rótulo con `rise .6s` a `.1s` y `.18s`; chips con `rise .5s` desde `.22s`, con `.06s` entre uno y
otro (tope de 4); y texto con `rise .6s` a `.2s`. Las barras `stepbar` siguen siendo lineales.

**Accesibilidad y sin JS.**
- Todo lo de esta sección va dentro de `@media (prefers-reduced-motion: no-preference)` o depende de `.anim`, que se pone
  desde `<head>` solo si hay `IntersectionObserver` y no se pidió reducir movimiento. Con `reduce`, los hover cambian solo
  color y fondo, sin zoom ni desplazamiento de flecha, y los slots y el fichero quedan quietos.
- Sin JS no existe `.anim`, así que nada arranca oculto.
- El blur de `focusIn` se aplica solo a títulos (son pocos elementos y dura menos de 1 s). No se usa en tarjetas ni listas, para no
  recargar el pintado en celulares.
- El foco visible no se toca: el contorno de 2 px de Nico se mantiene en todo lo que tiene hover.

---

## 8. Recetas para el tema de WordPress

Tercer relevamiento (6/11), a 1440×900 y 390×844, con `prefers-reduced-motion: no-preference`. Se midió la carga, el header en
cuatro posiciones de scroll (0, 900, 2400 y de vuelta a 2000), la alternancia de fondos, la cinta, el mosaico de fotos y los
componentes de cita con foto de su biblioteca. Capturas y datos entre las
capturas de referencia guardadas fuera del repositorio
(`glb-1440-full.png`, `glb-390-full.png`, `glb-load-*.png`, `glb.json`).

Nada de esta sección toca la identidad: colores de `:root` de Nico (`--ink #2A2A2A`, `--purple #663399`, `--lime #98CC32`,
`--lavender #F0EBF5`, `--gray-bg #E6E2EA`, `--line-dark #4A4A4A`, `--white`) y Saira. Lo que cambia es la escala, el ritmo, las
superficies y el movimiento.

### 8.0 Por qué el primer intento no se sintió como Globant

Lo que más pesa en la sensación, por orden. Cada punto se puede comprobar con `getComputedStyle`:

| # | Globant | Cómo se comprueba en el tema |
|---|---|---|
| 1 | Header de **64 px**, fijo, sin cambiar nunca | `header` → `height: 64px`, `position: fixed`; igual a 0 y a 2400 px de scroll |
| 2 | Secciones de **104 / 64 px** y cortes duros por fondo | `section` → `padding-top: 104px` (1440) / `64px` (390); sin separadores ni degradados |
| 3 | h2 de **52 px, lh 1.04, −0.03em**, en 2–3 líneas | `.section-title` → `font-size: 52px; line-height: 54px` |
| 4 | **Encabezado partido**: título a la izquierda y bajada a la derecha, alineada abajo | `.section-head` → `display: grid`, 2 columnas, `align-items: end` |
| 5 | Radios de **4 px** (tarjetas) y **0** (fotos); píldora solo en botones | Ningún `border-radius: 16px` en tarjetas |
| 6 | **Sin sombras en reposo** | `box-shadow: none` en tarjetas fuera del hover |
| 7 | **Filas con filete** en lugar de tarjetas grises | Listas con `border-bottom: 1px` |
| 8 | Rótulos de 13–14 px/600 **en frase normal** | `.eyebrow` → `text-transform: none` (la barrita de color de Nico queda) |
| 9 | Una sola curva: `cubic-bezier(.22,1,.36,1)` | Ningún `ease-in-out` en entradas |
| 10 | Movimiento perpetuo solo en la cinta de logos | Sin `infinite` salvo la cinta (y el anillo del preloader mientras se ve) |

Si el tema cumple estos diez puntos, se siente Globant aunque los colores sean los de Nico.

### 8.1 Tokens del tema

Se suman a los de las secciones 3 y 7 y van en `:root` del CSS del tema (y, si se usa `theme.json`, en `settings.custom`):

```css
:root {
  --header-h: 64px;
  --wrap-max: 1200px;  --wrap-pad: 40px;       /* 20px en <=600px */
  --section-y: clamp(64px, 7.2vw, 104px);
  --head-gap: 56px;
  --radius-card: 4px;  --radius-pill: 999px;
  --rule: 1px solid var(--gray-bg);             /* sobre blanco */
  --rule-on-gray: 1px solid var(--white);
  --rule-on-dark: 1px solid rgba(255,255,255,.14);
  --ease-out: cubic-bezier(.22, 1, .36, 1);
  --t-fast: .2s; --t-line: .25s; --t-lift: .35s; --t-in: .7s; --t-focus: .9s; --t-img: .85s;
  --marquee-a: 70s;  --marquee-b: 84s;          /* las dos filas de la cinta */
}
```

### 8.2 Preloader

**Qué hace Globant (medido).** No es un efecto: es una espera técnica mientras se cargan sus microfrontends.
- Pantalla blanca de `min-height: 100vh` con su isotipo animado de 96 px (arcos verde y lima). Su versión mínima es un anillo de
  40 px con borde de 3 px, `rgba(15,16,20,.12)`, arco superior negro y `rotate` en `.8s linear infinite`.
- Tiempos en una carga real a 1440: el header aparece primero. El loader se ve desde los ~3.0 s hasta los ~5.7 s y se va con
  `data-leaving="true"` → `opacity 1 → 0` en **`.3s ease`**. Recién entonces arranca el hero: el h1 va de opacidad 0 a 1 entre los
  6.25 y los ~7.4 s (`mfeHeroFocus`, 1 s, easeOutQuint).
- Con reduced motion, el anillo gira en 2.4 s y el fundido es instantáneo.

**Receta para el tema.** WordPress entrega el HTML completo, así que no hay nada que esperar. El preloader se usa solo como
**telón corto** que ordena la entrada del hero:
- `<div class="preloader" aria-hidden="true">` fijo, `inset: 0`, `z-index` por encima del header, fondo `--white`, con el
  isotipo de Intellihelp de 72 px centrado y debajo un anillo de 32 px (borde de 3 px `--gray-bg`, arco superior `--purple`,
  `rotate .8s linear infinite`).
- Se muestra **solo en la primera página de la sesión** (`sessionStorage.ith_pre`). En las demás, ni se pinta: el `<script>`
  del `<head>` pone `html.no-pre` antes del primer pintado.
- Se va cuando están listos `DOMContentLoaded` y `document.fonts.ready` (Saira), con un **mínimo de 400 ms** desde que se
  muestra y un **máximo de 1200 ms**: pasado ese tiempo se va igual. Salida: `opacity → 0` en `.3s ease`; después, `display:none`.
  Al empezar la salida se pone `html.is-ready`, que dispara la coreografía del hero de la sección 7.2 (las demoras corren desde ahí).
- Sin JS no existe (`html.js .preloader`). Con `prefers-reduced-motion: reduce` tampoco: el hero se ve quieto.
- El header queda **por debajo** del telón, no encima como en Globant: la entrada se ve completa de una vez.

### 8.3 Header

**Medido.** Barra de 64 px con `position: fixed; top: 0` y fondo sólido `#0F1014`. Se midió igual en las cuatro posiciones:
sin sombra, sin blur, sin `transform` y sin compactarse. En 390, el contenedor es transparente y la barra interna es oscura, con
logo + hamburguesa. El "Contáctanos" va como texto, entre filetes verticales de 1 px de 40 px de alto.

**Receta.**
- `.site-header`: `position: fixed; inset: 0 0 auto; height: var(--header-h); background: var(--white); border-bottom: var(--rule)`.
  Blanco porque es decisión de Nico; el comportamiento es el de Globant.
- `body { padding-top: var(--header-h) }` y `scroll-padding-top: calc(var(--header-h) + 16px)`, para que las anclas (`#casos`,
  `#faq`, `#agenda`) no queden tapadas.
- **No se compacta, no se esconde al bajar y no cambia de color.** La página del diagnóstico de la agencia sí se compacta
  (`translate .45s`); no se copia.
- La navegación va en 15–16 px/500, separada por `gap: 32px`. El ítem activo (sección visible, con `IntersectionObserver`)
  lleva un subrayado de 2 px en `--purple` con `text-underline-offset: 6px`. El CTA "Agendá una reunión" va como píldora de 40 px
  (`.btn-lime`), separado por un filete vertical de 1 px × 32 px.
- Menú móvil: un panel a pantalla completa debajo de la barra, con fundido de `.3s cubic-bezier(.4,0,.6,1)` (el `fade-in` de su
  megamenú), `overflow: hidden` en `html` mientras está abierto y links de 22 px/500 con filete.

### 8.4 Ritmo de secciones y transiciones

**Medido.** La home alterna fondos en cortes secos. El orden es: hero blanco → franja de logos blanca (`18px 0 56px`) → bloque
oscuro `#0F1014` (104 px) → blanco → gris `#F4F5F2` → blanco → gris → blanco → gris (contacto) → pie oscuro. No hay curvas,
diagonales, degradados ni filetes entre secciones: el cambio de fondo es la transición.

**Receta para la home de una página.** Se respeta la alternancia blanco/gris de Nico y su familia de acentos:

| Sección | Fondo |
|---|---|
| Hero (video) | Velo oscuro |
| Clientes (cinta de 2 filas) | Blanco, con `padding-block: 18px 56px` |
| Qué ofrecemos | Blanco, con filete superior de 1 px que separa de la cinta |
| Soluciones | Gris |
| Quiénes somos (equipo e historia) | Blanco |
| Casos | Gris |
| Cita de Carlos | Blanco |
| FAQ | Gris |
| Agendá una reunión | Carbón (`.section--dark`), el único bloque oscuro antes del pie, como Glob.AI |

Dos secciones seguidas nunca comparten fondo, salvo la cinta y la sección que la sigue, que se separan con el filete.

### 8.5 Entradas y máscaras

Valores de la sección 7 (rise de 18 px, `focusIn` con blur de 10–14 px, escalonado de 0.08 s, una sola vez). Lo nuevo:

- **Máscara de la imagen del hero (medida).** Cuando la foto va de un costado, Globant la funde hacia el texto con
  `mask-image: linear-gradient(90deg, #0000 0%, #000 38%)` y `object-position: left center`. En el tema sirve para el hero de
  páginas internas (Blog, Postulate, Diagnóstico) si llevan foto: la foto ocupa el 55 % derecho y se funde al 38 %.
- **Resaltador pintado (medido).** `background-size: 0% .62em → 100% .62em` en `.9s` easeOutQuint, con `.8s` de demora,
  detrás de la palabra clave. En Nico: `--lime` al 100 % detrás de `.hl` sobre el velo, con la letra en `--ink`.
- **Revelado de foto (para la cita y el equipo).** Al entrar en pantalla: `clip-path: inset(0 0 100% 0) → inset(0)` en
  `.9s var(--ease-out)` y la imagen interna `scale(1.06) → 1` en `1.4s var(--ease-out)`, a la vez. Es el mismo gesto lento
  del zoom de sus tarjetas, aplicado a la entrada. Con reduced motion, la foto ya está ahí.
- **Las secciones no se animan como bloque:** se animan rótulo, título, bajada y contenido, en ese orden (tabla de 7.2).
- **Lo que nunca se anima:** formularios y la card de la agenda (están quietos desde el primer pintado), el header, el pie y los
  textos legales.

### 8.6 Cinta de logos en dos filas

**Medido.** Una fila, `.mfeLogosSectionTrack` con `animation: mfeLogosForward 70s linear infinite` (`translateX(0 → -50%)`),
lista duplicada, logos de 44 px de alto con `gap: 56px`, `mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%,
transparent)` en el visor, pausa en hover y quieta con `reduce`.

**Receta (pedido de Brian: dos filas que se desplazan, sin botones de pausa):**

```css
.logos { display: grid; gap: 24px; padding-block: 18px 56px; }
.logos__viewport { overflow: hidden;
  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); }
.logos__track { display: flex; gap: 56px; width: max-content; }
.logos__track img { height: 44px; width: auto; }          /* 36px en <=600px, gap 40px */
@media (prefers-reduced-motion: no-preference) {
  .logos__track--a { animation: logosA var(--marquee-a) linear infinite; }
  .logos__track--b { animation: logosB var(--marquee-b) linear infinite; }  /* sentido contrario */
  .logos:hover .logos__track, .logos:focus-within .logos__track { animation-play-state: paused; }
}
@keyframes logosA { to { transform: translateX(-50%); } }
@keyframes logosB { from { transform: translateX(-50%); } to { transform: none; } }
```

- La fila A va hacia la izquierda en 70 s y la B hacia la derecha en 84 s. Así no se leen sincronizadas.
- Cada fila lleva la mitad de los logos, duplicada. La copia va con `aria-hidden="true"` y `alt=""`. La lista accesible es una
  sola: `<ul>` con `aria-label="Clientes"` sobre la primera copia de cada fila.
- Logos a color (son clientes reales). En hover, el logo pasa de `opacity .85` a `1` en `.2s`.
- **Sin botones de pausa visibles.** La pausa es por hover, por foco dentro de la cinta y por `prefers-reduced-motion`. Con
  `reduce`, las dos filas quedan quietas y centradas con `flex-wrap: wrap`, sin la copia.

### 8.7 Sliders y carruseles

**Medido.** El único slider de la home es el hero: 3 solapas de 64×24 px (52 en 390) sobre un riel de 4 px, la barra de
progreso en `width 0 → 100%` lineal (16 s la primera y 8 s las demás) y un fundido cruzado de `.7s` con el contenido entrante
que sube 16 px en `.8s` easeOutQuint con `.15s` de demora. Las historias y las noticias **no** son carrusel: son grillas.

**Receta.**
- **Casos** (sin la pestaña "Todos"): las pestañas de filtro son texto de 15 px/600 con subrayado de 2 px en el acento para la
  activa, sin cajas. El cambio de pestaña o de caso usa el pase de Globant: sale con `opacity` en `.7s` y el entrante sube 16 px
  en `.8s var(--ease-out)` con `.15s` de demora. **Sin autoplay.** Flechas de 44 px, círculo con filete de 1 px en el acento
  y relleno en hover en `.2s`. Debajo, un riel de 4 px con el segmento del caso actual (no animado en el tiempo).
- **Servicios:** igual que Casos. Si entran todas las tarjetas a 1440, va como grilla, sin carrusel (el criterio de Globant).
- **Teclado:** flechas ← → dentro del grupo, `aria-roledescription="carrusel"`, cada tarjeta con `aria-label="2 de 5"` y el
  contador visible en 13 px/600.

### 8.8 Cita con foto (bloque de Carlos)

**Medido en su biblioteca de componentes.**
- `glb-m-card-testimonial-quote`: fila con la foto a un lado (`269 × 414 px` a ≥ 1200, `194 × 276` a ≥ 768, radio de 30 px,
  `object-fit: cover`) y el texto en una caja negra (radio de 30 px, `padding: 40px`). Lleva un ícono de comillas de 40 × 31 px
  con 16 px de margen inferior, la cita en 20/30 (24/35 en la versión destacada) de peso light, el autor en 22/32 y 500, y el cargo
  en 16/24. Ancho máximo de 1000 px.
- `glb-m-card-quote`: foto **redonda** de 260 px (120 en celular), `gap: 64px`, la cita en 32/40 a ≥ 1200 (24/32 a ≥ 768 y 20/26
  en celular) y el título en 40/48.

**Receta para Intellihelp** (pedido: frase a la izquierda y foto de Carlos de frente a la derecha). Va sobre blanco, sin caja
negra, para no competir con el bloque carbón de la agenda:

```css
.quote { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); column-gap: 64px; align-items: center; }
.quote__mark { font-size: 72px; line-height: .6; color: var(--lime); font-weight: 700; }      /* comilla de apertura */
.quote__text { font-size: clamp(24px, 2.3vw, 32px); line-height: 1.25; font-weight: 500;
               letter-spacing: -.01em; color: var(--ink); max-width: 22em; margin: 16px 0 32px; }
.quote__name { font-size: 18px; font-weight: 600; color: var(--ink); }
.quote__role { font-size: 13px; font-weight: 600; color: var(--muted); }
.quote__photo { aspect-ratio: 4 / 5; overflow: hidden; border-radius: var(--radius-card); max-width: 440px; justify-self: end; }
.quote__photo img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 20%; }
@media (max-width: 1023px) {
  .quote { grid-template-columns: 1fr; row-gap: 32px; }
  .quote__photo { order: -1; max-width: 320px; justify-self: start; }   /* en celular, la foto primero */
}
```

- Marcado: `<figure class="quote"><blockquote>…</blockquote><figcaption>Carlos Baldelli, CEO</figcaption></figure>`, y la foto
  con `alt="Carlos Baldelli, CEO de Intellihelp"`.
- Entrada: la comilla con `popSoft .5s`, la cita con `focusIn .9s` y `.1s` de demora, la firma con `rise .7s` y `.35s`, y la foto
  con el revelado de 8.5 (`clip-path` en `.9s` + `scale 1.06 → 1` en `1.4s`).
- Hover: ninguno (no es clicable).

### 8.9 Mosaico de fotos (Equipo)

**Medido.** Grilla de 6 columnas de 176.6 px y filas de 210 px con `gap: 12px` y radio 0. La primera foto ocupa 3 columnas × 2
filas (554 × 432) y el resto, bloques de 3 × 1 (554 × 210), 2 × 1 (365) y 1 × 1 (177).

**Receta.** `grid-template-columns: repeat(6, 1fr); grid-auto-rows: clamp(140px, 14.6vw, 210px); gap: 12px`. La foto
principal va con `grid-column: span 3; grid-row: span 2` y las demás alternan `span 3`, `span 2` y `span 1`. En celular,
2 columnas con la principal en `span 2`. Usa `object-fit: cover`, radio de 4 px y zoom 1.05 en `var(--t-img)` en el hover.

### 8.10 Formularios (Postulate, consulta y agenda)

**Medido** (contacto de Globant):
- Campos con solo línea inferior y labels de 13.5 px/600 arriba.
- La línea pasa de gris a gris oscuro en hover y a negro en foco, en `.2s ease`.
- Al enviar, el botón muestra un spinner de `.7s linear` y el agradecimiento entra con `translateY(10px)` + `opacity` en `.6s`
  easeOutQuint.

**Receta.**
- Campos `border: 0; border-bottom: 1px solid` (`--line-dark` sobre carbón, `--ink` al 30 % sobre claro), radio 0, 16 px y
  `padding: 10px 2px`.
- Foco: línea de 2 px en el acento de la sección, **más** el contorno `:focus-visible` de Nico.
- Error: línea en `--purple` y mensaje de 13 px debajo.
- Botón píldora con spinner de 16 px (`.7s linear`) mientras envía. El texto cambia a "Enviando…" o "Confirmando…".
- Éxito con `rise` de 10 px en `.6s var(--ease-out)` y foco movido al título del mensaje.

### 8.11 Lista de verificación con puppeteer

Antes de dar por cerrada una sección, se mide a 1440 y a 390:

```js
const v = (sel, props) => page.$eval(sel, (el, props) => {
  const s = getComputedStyle(el); return Object.fromEntries(props.map(p => [p, s[p]]));
}, props);
// header: 64px fijo, igual a 0 y a 2400 de scroll
// .section-title: 52px / 54px / -1.56px a 1440, 32px a 390
// section: padding-top 104px (1440) / 64px (390)
// tarjetas: border-radius 4px, box-shadow none
// .logos__track: animation-duration 70s y 84s; animation-play-state paused en hover
// .quote__photo: aspect-ratio 4 / 5, border-radius 4px
```

Con `prefers-reduced-motion: reduce` se verifica también que la cinta queda quieta, que el preloader no aparece y que nada
arranca con opacidad 0.
