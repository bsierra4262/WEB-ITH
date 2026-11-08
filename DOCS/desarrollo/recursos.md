# Recursos gráficos y datos de contacto

Todo se regenera con `npm run images` (script `scripts/optimize-images.mjs`). Lee los originales de `DOCS/wordpress-anterior/wp-content/uploads` (si `DOCS/wordpress-anterior/` no está, saltea los logos de clientes y conserva los `.webp` existentes). Con `--only=brand|icons|og|logos` corre un solo paso.

## Marca

| Archivo final | Tamaño (px) | Origen |
|---|---|---|
| `src/assets/img/brand/ith-logo.svg` | viewBox 111.71 × 60.2 | Vector extraído de `DOCS/wordpress-anterior/wp-content/uploads/2021/10/ith-caso-de-exito-gcba.pdf` (pág. 1, arriba a la derecha). Es idéntico al PNG del sitio viejo y usa los colores de la paleta: violeta `#663399`, lima `#98CC32` (el punto de la "i") y blanco. |
| `src/assets/img/brand/ith-logo.webp` | 164 × 88 | Generado a partir del SVG. Se muestra a 44 px de alto (82 × 44). |

- El PNG original del sitio viejo es `DOCS/wordpress-anterior/wp-content/uploads/2018/01/ITH-logo.png` (217 × 117). El de la referencia (`DOCS/diseno/Home-html-referencia/assets/629c15b2….png`) tiene el mismo tamaño y los mismos colores.
- **No existe una variante para fondo oscuro** en `DOCS/wordpress-anterior/`, y no hace falta: el logo es un bloque violeta con letras blancas, así que funciona igual sobre carbón. Por eso no hay `ith-logo-dark.webp`.
- En las secciones conviene usar el SVG (`/src/assets/img/brand/ith-logo.svg`, `width="82" height="44"`), porque se ve nítido en cualquier densidad y pesa menos de 1 KB (776 bytes). El `.webp` queda como alternativa.

## Íconos y redes

| Archivo final | Tamaño (px) | Cómo se hizo |
|---|---|---|
| `public/favicon.svg` | 64 × 64 (viewBox) | Cuadrado violeta con la misma silueta del logo (curva abajo a la izquierda) y las letras "iTH" vectoriales del logo. |
| `public/favicon-32.png` | 32 × 32 | Render del favicon SVG. |
| `public/apple-touch-icon.png` | 180 × 180 | Fondo violeta lleno (iOS redondea las esquinas) con "iTH" centrado. |
| `public/og-image.png` | 1200 × 630 | Fondo carbón, logo, "Servicios IT desde 2012" en cremita, el titular "Un equipo con nombre y apellido que mantiene tu tecnología andando." en blanco (Saira 700) y "intellihelp.tech". Se renderiza con Chrome/Edge (puppeteer-core) para usar la Saira real. Si no hay navegador, el script lo arma con sharp y una tipografía del sistema. |

El favicon del sitio viejo (`DOCS/wordpress-anterior/wp-content/uploads/2018/01/favicon.png`, 32 × 32) era el logo horizontal achicado y no se leía, por eso se rehízo.

Etiquetas sugeridas para `<head>` (las agrega quien edita `index.html`):

```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta property="og:image" content="https://www.intellihelp.tech/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
```

## Logos de clientes

Todos tienen 96 px de alto (2x de 48 px), van recortados y en WebP con calidad 85. Se usa la **versión a color** cuando existe: el sitio los pasa a gris con CSS y los muestra a color en hover. Si en `DOCS/wordpress-anterior/` solo está la versión desaturada del sitio actual, se usa esa. Los que vienen de un JPG conservan el fondo blanco recortado (no se nota sobre la franja blanca de logos). Los PNG son transparentes.

Los logos que trae el PDF de marketing son los mismos del sitio actual, ya pasados a gris y agrandados, así que no sirven como fuente.

| Archivo final | Tamaño (px) | Fondo | Origen en `DOCS/wordpress-anterior/wp-content/uploads/` | Alternativa descartada |
|---|---|---|---|---|
| `src/assets/img/logos/senado-argentina.webp` | 100 × 96 | blanco | `2022/12/senado-argentina.jpg` (color) | `2019/02/ith-cliente-senado-argentina.png` (gris) |
| `src/assets/img/logos/agencia-sistemas.webp` | 251 × 96 | blanco | `2022/12/gencia-sistemas.jpg` (color) | `2024/03/ASI-Agencia-de-sistema-de-la-Informacion-…png` (gris) |
| `src/assets/img/logos/nacion-seguros.webp` | 465 × 96 | transparente | `2024/03/Nacion-Seguros.png` | — |
| `src/assets/img/logos/pfizer.webp` | 230 × 96 | blanco | `2022/12/pfizer.jpg` (color) | `2022/09/pfizer.png` (gris) |
| `src/assets/img/logos/bago.webp` | 290 × 96 | transparente | `2024/03/Laboratorio-Bago.png` | — |
| `src/assets/img/logos/medife.webp` | 429 × 96 | transparente | `2024/03/Medife.png` (solo existe en gris) | — |
| `src/assets/img/logos/lojack.webp` | 310 × 96 | blanco | `2022/12/lojack.jpg` (color, nítido) | `2024/03/Lojack.png` (borroso) |
| `src/assets/img/logos/petropack.webp` | 255 × 96 | blanco | `2023/01/petro-pack.jpg` (el del PDF) | `2022/12/petro-pack.jpg` (azul, versión anterior y más chica) |
| `src/assets/img/logos/agip.webp` | 190 × 96 | blanco | `2022/12/agip.jpg` (color, con la bajada "Administración Gubernamental…") | `2018/02/ith-cliente-agip.png` (gris, solo "AGIP" como en el PDF) |
| `src/assets/img/logos/cablevision-fibertel.webp` | 436 × 96 | blanco | `2022/12/cablevision-fibertel.jpg` (color). Es el logo doble Cablevisión + Fibertel. | `2023/01/cablevision-fibertel.jpg` (gris) |
| `src/assets/img/logos/el-cronista.webp` | 734 × 96 | blanco | `2022/02/elcronista.png` (color, 512 px de ancho: la mejor resolución) | `2023/01/el-cronista.jpg` (gris) |
| `src/assets/img/logos/correo-argentino.webp` | 384 × 96 | transparente | `2024/03/Correo-Argentino.png` | — |
| `src/assets/img/logos/reckitt-benckiser.webp` | 216 × 96 | blanco | `2023/01/reckitt-benckiser.jpg` (el del PDF) | `2022/12/reckitt.jpg`: la marca actual "reckitt" en rosa. Si Carlos prefiere la marca vigente, se cambia en el mapa `LOGOS`. |
| `src/assets/img/logos/srt.webp` | 399 × 96 | transparente | `2024/03/SRT-Superintendencia-de-Riesgos-del-Trabajo.png` | — |
| `src/assets/img/logos/came.webp` | 196 × 96 | blanco | `2022/12/came.jpg` (color) | `2018/02/ith-cliente-came.png` (gris) |
| `src/assets/img/logos/gendarmeria-nacional.webp` | 167 × 96 | transparente | `2024/03/Gendarmeria-Nacional.png` (solo existe en gris claro) | — |

El caso destacado ("Agencia de Sistemas de Información") usa el mismo `agencia-sistemas.webp`.

Para mostrarlos a 48 px de alto, el ancho es `ancho × 0,5` (por ejemplo, Pfizer: `width="115" height="48"`).

### Qué falta o hay que confirmar

- Están los 16 logos del PDF. **Cartocor y ODI** (la nota "sumar si dan permiso") **no existen en `DOCS/wordpress-anterior/`**: hay que pedirlos.
- Todos los originales del sitio viejo son chicos (75 a 150 px de alto con márgenes), así que llevarlos a 96 px implica agrandarlos 1,5 a 3 veces. A 48 px de pantalla se ven bien en densidad 1x. En 2x se ven algo suaves, sobre todo Medifé, SRT, Gendarmería y AGIP. Si los clientes pasan sus logos en SVG o PNG grande, se reemplazan en el mapa y se vuelve a correr `npm run images`.
- Gendarmería y Medifé solo existen en gris en `DOCS/wordpress-anterior/`, así que no tienen versión a color para el hover.
- Hay que validar con Carlos cuáles se pueden seguir mostrando (ya lo indica la nota del diseño).

## Datos de contacto

Se buscaron en los archivos `.php/.js/.json` del tema, en los plugins y en los backups de All-in-One WP Migration (`DOCS/wordpress-anterior/wp-content/ai1wm-backups/*.wpress`, el más nuevo es del 19/03/2024). El archivo `Sin confirmar 283978.crdownload` (10 GB) no se abrió.

| Dato | Valor elegido | Fuente | Confianza |
|---|---|---|---|
| WhatsApp | `5491150274827` → **+54 9 11 5027-4827** | Opción `ht_ctc_chat_options.number` del plugin **Click to Chat** (botón flotante en todo el sitio, `global_display = show`, en escritorio y móvil) en el backup más reciente, `www.intellihelp.tech-20240319-154406-94hwua.wpress`. | Alta para el sitio a marzo de 2024. **Confirmar con Carlos que siga vigente.** |
| LinkedIn | **https://www.linkedin.com/company/intellihelp/** | 30 apariciones en el backup de 2024: íconos de redes del pie/encabezado (`<a href="https://www.linkedin.com/company/intellihelp…">`). | Alta |

Ya están cargados en `src/data/site.json` (`whatsapp.number`, `whatsapp.display`, `whatsapp.url` con el texto "Hola Intellihelp, quiero hacer una consulta." y `linkedin`).

Otros números que aparecen (no se usaron):

- `5491132308355`: botones "Contactar por whatsapp" de Elementor en páginas de soluciones cloud (113 apariciones, incluidas revisiones). Es un número de comercial o de campaña, no el general.
- `5491133746956`: el número del Click to Chat en el backup de enero de 2023 (con el botón oculto), más algunos botones de Elementor. Es el anterior.
- `+54 11 7700-6868` (escrito `+54 1177006868`): teléfono fijo en bloques de texto de WPBakery (745 apariciones). Puede servir si el pie lleva un teléfono fijo.
- `linkedin.com/company/ith-intelihelp/about/`: una sola aparición, como enlace dentro de un PDF. Es una página vieja o mal escrita.
