# Movimiento del sitio (carga común y recetas)

Este documento explica cómo se mueve el sitio HTML (la home y las páginas internas) y cómo sumar el movimiento a una
página nueva. Vive en estos archivos:

- `css/carga.css` + `js/carga.js`: la **animación de carga común** de todas las páginas (también la usa el tema del
  blog, que tiene una copia).
- `css/motion.css`: las recetas, los tiempos y la curva.
- `js/motion.js`: lo que el CSS no puede hacer solo, como partir títulos en líneas y marcar el sentido del slider.
- `js/main.js` + `css/styles.css`: el header (compactarse y esconderse), los carruseles, el mapa, socios, clientes y
  casos, porque también son diseño y comportamiento de cada sección.

La identidad de Nico queda igual: colores, Saira, botones y rótulos. De Globant se toma el ritmo: una sola curva,
entradas cortas, máscaras y cada cosa aparece una vez.

## Reglas

- **Una curva:** `cubic-bezier(.22, 1, .36, 1)` (easeOutQuint), la misma `--ease-out` de `styles.css`, en todas las
  transiciones y entradas. Solo es lineal lo que tiene que serlo: las bandas de clientes, la barra de avance de Casos
  y el parallax atado al scroll. Las luces del fondo y el brillo del fondo lavanda van y vuelven con `ease-in-out`.
- **Sin subrayados** ni líneas que se dibujan debajo de textos o títulos. Los links del menú, del pie y de texto solo
  cambian de color; el ítem activo del menú va en lima sobre la barra carbón.
- **Íconos quietos:** no flotan ni suben con el hover; quedan siempre centrados en su círculo.
- **Solo `transform` y `opacity`**, más `translate` y `scale` sueltos. Ninguna animación cambia el layout.
- **Una vez:** cada elemento entra una sola vez. Al volver a subir ya está quieto.
- **Nunca en blanco:** una entrada solo corre si el visitante la ve llegar (el bloque cruza la línea del 90 % de la
  pantalla scrolleando a un ritmo normal). Lo que se descubre ya metido en la pantalla (scroll muy rápido, salto con un
  ancla) o lo que quedó arriba sin verse (recarga a mitad de página, vuelta con Atrás) aparece quieto en el mismo cuadro
  (`main.js` le pone `.rv-ya` y adelanta sus animaciones de entrada al final; `motion.js` no parte su título). Respaldo:
  a los 2 s de abrirse el telón y cada vez que el scroll se detiene, se muestra todo lo que esté a la vista o más arriba.
  Los casos de `/diagnostico-sin-cargo/` siguen la misma regla en `diagnostico.js`.
- **Reducir movimiento:** con `prefers-reduced-motion: reduce` el `<head>` no pone `.anim` y `motion.js` no hace nada:
  todo queda visible y quieto. La **carga común sí aparece**, en su versión quieta (ver 1). Todas las reglas de
  `motion.css` están dentro de `prefers-reduced-motion: no-preference`.
- **Sin botones de pausa.** Lo que se mueve solo se frena con el mouse encima, con el foco adentro o fuera de pantalla.
- **Sin librerías.**

## Escala de tiempos

| Token | Valor | Uso |
|---|---|---|
| `--m-t-hover` | .2 s | color y flecha |
| `--m-t-lift` | .35 s | elevación |
| `--m-t-head` | .45 s | header: compactarse, ocultarse y volver |
| `--m-t-line` | .9 s | cada línea de un título; bloque de cierre que se expande |
| `--m-t-photo` | .9 s | telón que descubre una foto |
| `--m-t-zoom` | 1.4 s | la foto pasa de 106 % a su tamaño |
| `--m-step` | .08 s | paso entre líneas (igual que `--stagger`) |

## Recetas aplicadas

### 1. Animación de carga común (`css/carga.css` + `js/carga.js`)

Es una sola pieza para todas las páginas: home, `/diagnostico-sin-cargo/`, `/gracias-reserva/`, `/postulate/`,
`/privacidad/`, la 404 y el blog. **Ya no hay preloader "una vez por sesión"**: corre en cada carga, en cada recarga y
al volver con Atrás. No lleva marcado en el `<body>`: el telón es `body::before` y el logo con la línea es
`body::after`, así se pintan desde el primer cuadro sin esperar a ningún script diferido.

| Tramo | Qué pasa (versión animada, 1,05 s) |
|---|---|
| 0 – .35 s | telón carbón y, en el centro exacto de la pantalla, el logo original completo (217 × 117; 160 px de ancho en celular) que aparece con un fundido y una escala mínima (96 % → 100 %) |
| .1 – .7 s | debajo del logo, una línea lima de 2 px crece desde el centro hacia los dos lados sobre un riel lavanda |
| .7 – 1.05 s | salida: el logo se funde y crece apenas (100 % → 103 %) y el telón se desvanece hacia el contenido |

- **Con "reducir movimiento"** (por ejemplo, Windows con los efectos de animación apagados) aparece igual, en versión
  quieta: el mismo telón con el logo entero y centrado, sin la línea, sin escalas ni desplazamientos; a los 0,3 s se
  funde (solo opacidad) y a los 0,6 s ya no está.
- **Centrado exacto:** la caja del logo va con `inset: 0` y `margin: auto` (sin `translate`), y deja el mismo aire
  arriba y abajo del logo, así el logo (y no el conjunto con la línea) queda en el centro.
- **Logo embebido** en base64 en una variable (`--carga-logo`): está desde el primer cuadro y el archivo sirve igual
  desde cualquier carpeta. Colores escritos sin variables, para que funcione también en páginas sin `styles.css`.
- **Nunca bloquea:** `pointer-events: none`. Al imprimir no aparece.
- **`js/carga.js`** (en el `<head>`, sin `defer`): pone `html.m-intro` antes del primer pintado y la saca al terminar.
  Sigue los eventos de las propias animaciones (no un reloj propio), con un respaldo a los 1,1 s / 1,6 s desde que el
  documento está armado. Al irse con `pagehide` (página que queda en la caché del navegador) deja el telón quieto
  (`html.carga-quieta`), así al volver con Atrás lo primero que se pinta es el telón y la animación corre completa.
- **Eventos en `document`** (los usan `main.js`, `motion.js` y `diagnostico.js`):

  | Evento | Cuándo | Para qué |
  |---|---|---|
  | `ith:intro-salida` | empieza la salida del telón | las entradas de la página arrancan acá, delante del visitante (el texto del hero, la frase del diagnóstico) |
  | `ith:intro-fin` | terminó la animación | respaldo para quien no llegó a escuchar la salida |
  | `ith:replay` | se volvió a la página desde la caché | cada módulo vuelve a su estado inicial |

- Pone también `html.m-hero-tarde` (queda puesta): el texto del hero de la home corre su entrada para verse al abrirse
  el telón.

### 2. Títulos que entran por líneas con máscara

Aplica a `.section-title` y `.quote__text` dentro de un encabezado `.rv-seq`.

- **Cómo entra:** `motion.js` parte el título en palabras justo cuando `main.js` lo revela. Mide en qué línea cayó
  cada palabra y les da la misma demora por línea. Cada renglón sube desde abajo de su máscara (`translateY(120%) → 0`,
  .9 s, .08 s entre líneas).
- **Después:** al terminar se deshace el partido y queda el HTML exacto que había.
- **Cifras:** los `[data-count]` y `[data-anios]` van enteros dentro de una máscara, así el contador sigue funcionando.
- **Otros títulos:** un título fuera de `.rv-seq` y el H1 del hero quedan con la entrada de `styles.css`.

### 3. Fotos que se descubren

Aplica a `.member__photo` (equipo) y `.quote__photo` (cita de Carlos). Un telón del color de la sección (lavanda) se
retira hacia abajo en .9 s y, al mismo tiempo, la imagen pasa de `scale: 1.06` a 1 en 1.4 s.

### 4. Header que se compacta y se esconde (componente común)

El header es uno solo para todas las páginas (estilos en "Header" de `styles.css`, comportamiento en `main.js`). Todo
con `transform`: la barra no cambia de alto en el flujo y la página no salta.

- **Compacto:** pasados 24 px de scroll, la barra sube 10 px, el contenido baja 5 px y la marca queda al 90 %. Va en .45 s.
- **Oculto:** bajando, después de 12 px seguidos y pasada la tercera altura de barra. Vuelve apenas se sube.
- **No se esconde:** con el panel del menú abierto, con el foco adentro ni mientras se viaja a un ancla de la misma página.
- **Panel del menú (hasta 1100 px):** el botón de tres líneas se cruza en una X; el panel baja con un fundido corto y los
  ítems entran escalonados (.03 s entre uno y otro). Escape lo cierra y devuelve el foco al botón.
- **Para dejarla quieta:** `data-header-fijo` en el `<header class="site-header">`.

### 5. Transiciones de sección

- **Rótulo:** la barrita del rótulo (`.eyebrow::before`) entra junto con el rótulo; no se dibuja.
- **Cierre:** la card blanca "Agendá una reunión" se expande a su lugar desde el 94 %, antes que su contenido (.9 s).
- **Salida del hero:** parallax suave atado al scroll (scroll-driven animations; donde no las hay, no pasa).

### 6. Hover y clic

- **Menú, pie y links de texto:** solo cambian de color (.2 s). Sin subrayados.
- **Tarjetas:** sin caja, sin sombra, sin filetes y sin elevación: al pasar el mouse solo el título toma el color de la
  familia de la sección.
- **Botones (`.btn`, uno solo en todo el sitio, también en el header y en el diagnóstico):** hover con cambio de
  color, 1 px de elevación, sombra suave, el brillo que cruza el botón y la flecha que avanza 4 px; al hacer clic se
  hunde apenas (escala .97 en .12 s). Con "reducir movimiento", solo el cambio de color.

### 7. Contadores

Los cuenta `main.js` (1,4 s, ease-out cúbico, una vez). `motion.css` pone cifras de ancho fijo (`tabular-nums`).

### 8. Slider y mapas de Presencia

Cada mapa empieza con su presentación (2,6 s): el nombre del país o de la región en un globo al costado del mapa,
separado y con la pestaña hacia el mapa, sin señalar ninguna zona, mientras la silueta entera toma un halo suave del color
del mapa. Arranca en el acto al prenderse el mapa o al tocar la pestaña o la flecha. Después recorre **todas** sus zonas
con presencia, una por una (unos 2 s cada una; Buenos Aires y CABA son un solo paso, "Buenos Aires"), y recién al terminar
el recorrido pasa a la otra vista (Argentina → Latam → Argentina…), en bucle. Se pausa con el mouse sobre el mapa, fuera
de pantalla o con la pestaña oculta, y sigue desde la zona en la que quedó. En cada cambio de vista, la entrante llega
de costado (28 px) en el sentido del cambio.

### 9. Fondo de luces del hero y brillos de marca

- **Luces (solo el hero, único fondo oscuro del sitio, placeholder del video):** carbón con cuatro luces difusas (violeta, violeta, lima y lavanda) y un grano fino; órbitas, derivas y
  respiraciones de 30 a 60 s con duraciones distintas. Reglas en `styles.css` (`.tech`, `.fondo`, `.fondo__luz`).
- **Brillos de marca (todas las secciones, todas las páginas):** cada sección con fondo propio (blanca o lavanda) lleva
  la misma textura: dos halos chicos (≈40 % del ancho), violeta .07 y lima .09, muy difuminados, que se desvanecen antes
  del borde (la capa además se funde arriba y abajo), con deriva lenta y corta (30–38 s, solo `transform`). Las
  secciones siguen alternando blanco y lavanda. `main.js` agrega la capa `.brillos`; lo que no tiene fondo propio usa
  `main::before`. Con "reducir movimiento", quietos pero visibles.

### 10. Carruseles: flechas a los costados

En Servicios, Soluciones, Presencia y Casos las flechas van una a cada lado del contenido, centradas en alto (en
celular, más chicas y sobre el borde). En Casos, la barra de avance junto al contador "01 / 17" se llena con el tiempo
del caso; el cambio de caso es coordinado (sale el anterior y entran escalonados logo, nombre, sector, etiquetas y la
lista "Qué hicimos").

### 11. Preguntas frecuentes

El signo `+` / `–` son dos barras de 2 px dibujadas con CSS: al abrir, la vertical gira .4 s y se acuesta. Una sola
abierta por vez (`<details name>`).

### 12. Socios y clientes

- **Socios tecnológicos:** cada tanto cambia una fila entera de logos en ola (110 ms entre logo y logo): el que sale
  sube y se funde, el que entra llega desde abajo. Sin cajas: los logos van directo sobre el fondo. Con "reducir
  movimiento", todos quietos.
- **Clientes:** solapas de rubro en una fila (sin "Todos") que avanzan solas cada 7 s, sin indicador a la vista (un
  reloj invisible en la solapa activa marca el paso al rubro siguiente); el panel sale con un fundido corriéndose 16 px a la
  izquierda (.26 s) y el nuevo llega desde la derecha (.5 s). Un clic elige el rubro y el ciclo sigue desde ahí. Los
  logos pasan en bandas continuas a 34 px/s que siempre llenan el ancho: una fila hacia la izquierda o, desde 10
  logos, dos filas en sentidos opuestos (arriba a la izquierda, abajo a la derecha). No se detienen con el mouse: solo
  fuera de pantalla. Con "reducir movimiento", grilla quieta por rubro y sin avance automático.

### 13. Blog

Al pasar el mouse por una nota, el título cambia a violeta y la foto se acerca apenas (4 %).

### 14. Subpáginas: el mismo sistema que la home

Las subpáginas usan las mismas clases y recetas que la home, sin piezas propias:

| Página | Apariciones (`.rv` / `.rv-seq`, main.js) | Íconos que levitan (`mLevita`, motion.css) | Hover |
|---|---|---|---|
| `/postulate/` | encabezados `.rv-seq`, tarjetas `.rv` escalonadas con `data-d` | los círculos de "Por qué" y "Perfiles" y el del aviso sin búsquedas, con la ola ordenada (0, −0,45, −0,9 y −1,35 s) | título en violeta como en Servicios; botones `.btn` |
| `/privacidad/` | encabezado `.rv-seq`, índice y "En síntesis" `.rv` | — (no tiene íconos) | botones y links como la home |
| `/404.html` | encabezado `.rv-seq`, botones `.section-cta.rv` y links `.rv` | — | botones `.btn` |
| `/gracias-reserva/` | todo el bloque en `.rv-seq` (rótulo, título, textos, cards y firma, escalonados) | — | botones `.btn` |
| `/diagnostico-sin-cargo/` | video `.rv`; los casos entran escalonados (`data-dx-entra`, la misma subida corta) | — | botones `.btn` |

- El bloque de reserva del diagnóstico (calendario, horarios y formulario) **no se anima nunca**.
- Con "reducir movimiento", todo queda quieto y visible.
- **Para replicarlo en el tema del blog:**
  - Apariciones: en `<html>`, las clases `js` y `anim` (script del `<head>`); en el marcado, `.rv`, `.rv-seq` y
    `data-d="0.1"` (demora en segundos, pasa a `--rv-d`); el CSS de "Animaciones" de `styles.css` (`.anim .rv:not(.show)`,
    `.rv.show`, `.rv-seq.show > *`, `--seq`, `--stagger` y los `@keyframes` `rise`, `riseSm`, `focusIn`, `pop`, `draw`);
    y el módulo de revelado de `main.js` (IntersectionObserver que pone `.show` una sola vez y espera a
    `ith:intro-salida` si está el telón de la carga).
  - Levitación: `@keyframes mLevita` (±7 px con `translate`, 3,6 s, `cubic-bezier(.37, 0, .63, 1)`, infinita) en el
    `.icon-circle`, con `--lev-d` para la ola (0, −.45 s, −.9 s, −1.35 s por posición), dentro de
    `@media (prefers-reduced-motion: no-preference)` y con `.anim` (motion.css, bloque 8).
  - Hover: `.btn` común y el título de la tarjeta en violeta (`transition: color .2s`).

## Convivencia con main.js

`main.js` es el dueño del revelado (`.rv` → `.show`, una sola vez), los contadores, el header, los carruseles, el mapa,
socios, clientes y el hero. `motion.js` no tiene un observer propio: escucha con un `MutationObserver` cuándo `main.js`
le pone `.show` a un bloque y recién ahí suma su receta (títulos por líneas y fotos). Si se saca `motion.js` entero, el
sitio vuelve a las entradas de `styles.css` sin romperse.

## Cómo enlazarlo en una página nueva

En el `<head>`, después de `styles.css`, de `main.js` y del script que pone `.js` y `.anim`:

```html
<!-- MOVIMIENTO: recetas (títulos por líneas, fotos). -->
<link rel="stylesheet" href="/css/motion.css">
<script src="/js/motion.js" defer></script>
<!-- CARGA: la misma animación de carga de todo el sitio, en cada carga y recarga. Sin defer. -->
<link rel="stylesheet" href="/css/carga.css">
<script src="/js/carga.js"></script>
```

- **Header:** con el bloque común (`header:inicio … header:fin`) ya se compacta, se esconde y tiene su panel.
- **Formularios y agenda:** quedan quietos siempre. Ninguna receta los toca.
- **Blog:** el tema de WordPress (`/novedades/`) tiene copias de `carga.css`/`carga.js` y del header. Si se cambian
  acá, recopiarlos allá.

## Pendientes

- **Fotos reales:** con las fotos del equipo y la de Carlos se va a ver el zoom de 106 % a 100 %.
- **Video del hero:** hoy el hero usa el fondo de luces. Cuando llegue el video, el comentario del hero explica dónde
  va. Si `play()` falla, `main.js` cambia el video por su poster (nunca se ve el botón de play nativo).
