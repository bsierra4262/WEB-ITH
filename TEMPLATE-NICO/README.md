# Intellihelp — Sitio principal

Sitio institucional de Intellihelp (ITH) hecho sobre la página de Nico: HTML, CSS y JavaScript estáticos, sin
dependencias ni paso de build. Se conserva su identidad (Saira, carbón, violeta y lima, botones y rótulos) y se toma
de Globant el ritmo: secciones amplias y tipografía grande. **Fondo oscuro únicamente en el hero (placeholder del
video de fondo)**; el resto alterna blanco y lavanda liso (nunca dos iguales seguidos) con brillos de marca muy suaves.
Header carbón común a todas las páginas y tarjetas sin caja, sin sombra y sin filetes.

**Qué es HTML y qué es WordPress.** Todo el sitio es este HTML: la home, `/diagnostico-sin-cargo/`, `/gracias-reserva/`,
`/postulate/`, `/privacidad/` y la página de error `404.html`.
WordPress (carpeta `WORDPRESS/`, en local en <http://127.0.0.1:5180>) es **solo el blog "Novedades"**, que en producción
vive en `/novedades/` del mismo dominio.

## Estructura

```
index.html               Home completa (contenido, mapas en SVG inline, JSON-LD)
css/styles.css           Estilos del sitio: tokens en :root, base, componentes por sección, animaciones al final y
                         estilos de páginas internas (.page-head, .prose)
js/main.js               Módulos independientes (ver "Comportamiento"); cada uno no hace nada si falta su HTML, así sirve
                         para la home y para las páginas internas
js/agenda.js             Agenda del CRM, formulario de consulta, origen de la visita y su medición. La usa la página
                         /diagnostico-sin-cargo/; la home ya no la carga
api/                     agenda.php (horarios y reserva), contact.php (consulta) y _crm.php (firma de pedidos al CRM, cola)
diagnostico-sin-cargo/   Diagnóstico sin cargo: bloque de reserva propio con el calendario primero (ver "Diagnóstico sin cargo")
gracias-reserva/         Confirmación después de reservar (noindex; fuera del sitemap)
css/diagnostico.css, js/diagnostico.js  Estilos y comportamiento propios de esas dos pantallas
postulate/               Página para postularse, con las búsquedas abiertas de HiringRoom (ver "Postulate")
css/postulate.css, js/postulate.js  Estilos y comportamiento propios de esa página
css/carga.css, js/carga.js  Animación de carga común a todas las páginas (también copiada en el tema del blog)
css/motion.css, js/motion.js  Recetas de movimiento al estilo Globant (ver README-movimiento.md)
privacidad/              Política de privacidad (indexable, en el sitemap y enlazada desde el pie de todas las páginas)
404.html                 Página de error (header, pie, GTM y CTA; noindex). Rutas absolutas: se sirve en cualquier profundidad
.htaccess                Listo para el lanzamiento en Hostinger: no toca subdominios ni carpetas de apps, un solo salto a
                         https://www, 301 del sitio anterior, caché y ErrorDocument 404 (ver "Lanzamiento en Hostinger").
                         No toca /novedades/ ni /api/. Las 301 están copiadas en vite.config.js para que en local ande igual
google9ffcbef7277c41a3.html  Verificación de Search Console (copia exacta del archivo del sitio anterior)
vite.config.js, servir.cmd, dev/smtp-local.mjs, .vite/  Solo para ver el sitio en local; no se publican
README.md, README-movimiento.md  Documentación interna; no se publica
img/logo-intellihelp.png Logo
img/clientes/*.webp      Logos de clientes (la cinta usa 50: 19 del sector público y 31 del privado; strix.webp queda
                         sin uso, ver "Clientes")
img/socios/*.webp        Logos de socios tecnológicos (35)
img/iconos/*.svg         Íconos de Transformación digital y Tecnología colaborativa (hoy van embebidos en el HTML;
                         los archivos quedan como fuente)
img/equipo/carlos-cita.jpg  Foto de la cita de Carlos (hoy, una silueta provisoria de 880 × 1100)
img/hero-poster.webp     Imagen fija para cuando el hero vuelva a tener video (ver "Hero")
video/hero-placeholder.mp4  Video provisorio, hoy sin uso: el hero usa el fondo de luces
favicon-32.png (el original del sitio publicado), apple-touch-icon.png (logo original sobre blanco), og-image.png  Íconos e imagen para compartir (1200×630, "desde 2010")
robots.txt, sitemap.xml, llms.txt  robots.txt cierra /novedades/wp-admin/ y declara los dos sitemaps (este, con las
                         páginas HTML, y el del blog en /novedades/wp-sitemap.xml). llms.txt: 16 años / 2010 y los
                         enlaces de la estructura actual (anclas de la home, /diagnostico-sin-cargo/, /novedades/, /postulate/)
fonts/saira-latin.woff2  Saira variable 400–700, subconjunto latino, servida desde acá (sin Google Fonts)
```

## Ver localmente

Doble clic en `servir.cmd` y entrar a <http://127.0.0.1:5174/>. Abre una ventana por servidor y cada una queda abierta
aunque el servidor se corte, así se lee el error (para cortar uno: Ctrl+C en su ventana y cerrarla). Si un servidor ya
está corriendo, no lo levanta de nuevo. La ventana de `servir.cmd` muestra las direcciones y espera una tecla.

- **Correo local** en `127.0.0.1:2525` (`dev/smtp-local.mjs`), para que `mail()` de PHP no falle.
- **PHP** en `127.0.0.1:5176` para `api/`, con `ITH_CRM_CONFIG` apuntando a la configuración del CRM de pruebas (la clave
  y el secreto no se copian a esta carpeta).
- **Vite** en `127.0.0.1:5174` con recarga en vivo. `vite.config.js` manda `/api` al PHP (mismo origen para el
  navegador, como en el hosting) y `/novedades` al blog (abajo).

Requisitos: Node.js 20.19 o superior con las dependencias de `../WEB` instaladas (`npm install` en esa carpeta: de ahí
se toma Vite) y PHP 8.2 de winget (`winget install PHP.PHP.8.2`).

| Página | Local |
|---|---|
| Home | <http://127.0.0.1:5174/> |
| Diagnóstico sin cargo | <http://127.0.0.1:5174/diagnostico-sin-cargo/> |
| Gracias por reservar | <http://127.0.0.1:5174/gracias-reserva/> |
| Postulate | <http://127.0.0.1:5174/postulate/> |
| Privacidad | <http://127.0.0.1:5174/privacidad/> |
| Error 404 | <http://127.0.0.1:5174/no-existe/> |
| Blog | <http://127.0.0.1:5174/novedades/> (redirige al WordPress local) |

Lo que se reserve en local desde `/diagnostico-sin-cargo/` es real en el CRM de pruebas.

## Blog "Novedades" (/novedades/)

El blog es un WordPress aparte (`../WORDPRESS`, instrucciones en `WORDPRESS/README.md`); este HTML no tiene nada del
blog, solo los enlaces a `/novedades/`.

- **En desarrollo:** el WordPress corre en la raíz de `127.0.0.1:5180` (se levanta con `WORDPRESS/servir.cmd`).
  `vite.config.js` redirige `/novedades` y todo lo que cuelga de ahí a ese puerto, sacando el prefijo y conservando el
  resto de la ruta y la consulta (`/novedades/page/2/` → `127.0.0.1:5180/page/2/`). Es redirección y no proxy porque
  WordPress arma sus enlaces y cookies con su propia URL. Si el WordPress no está levantado, el blog no responde.
- **En producción:** WordPress se instala en la carpeta `novedades/` del mismo dominio, al lado de este HTML
  (`https://www.intellihelp.tech/novedades/`), con su propio `.htaccess`. El `.htaccess` de este sitio deja pasar
  `/novedades/` sin tocarlo, `robots.txt` declara el sitemap del blog y el menú ya apunta a `/novedades/`. Todavía no
  está instalado (ver pendientes).

## Bloques compartidos: header, footer y carga

El encabezado y el pie son bloques HTML delimitados con comentarios:

- `<!-- header:inicio ... -->` … `<!-- header:fin -->`: **un solo header para todo el sitio** (home, diagnóstico,
  gracias, postulate, privacidad, 404 y el tema del blog). Barra carbón con el logo original y "Servicios IT / desde
  2010" en dos líneas, el menú en mayúsculas espaciadas y el CTA lima "Agendá reunión →" (el mismo `.btn` de todo el
  sitio, con la misma animación). Estilos en "Header" de `styles.css`; comportamiento en `main.js`: se compacta pasados
  24 px, se esconde al bajar y vuelve al subir; hasta 1100 px el menú y el CTA van en un panel propio que abre el
  botón de tres líneas. Entre páginas solo cambian los atributos del CTA: en `/diagnostico-sin-cargo/` baja al bloque de
  reserva (`href="#agendar"`, `data-dx-ir="agenda"`) y en `/gracias-reserva/` vuelve a ese bloque.
- `<!-- footer:inicio ... -->` … `<!-- footer:fin -->`: pie y botón flotante de WhatsApp (sin `title`; el nombre va en
  `aria-label`). Las dos pantallas del diagnóstico usan un pie mínimo propio.
- **Animación de carga:** `css/carga.css` + `js/carga.js` en el `<head>` de todas las páginas, en cada carga, recarga y
  al volver con Atrás; con "reducir movimiento", en versión quieta (ver `README-movimiento.md`).

Las páginas internas los **copian igual**, de punta a punta. Por eso las anclas van como `/#seccion`: funcionan desde
cualquier página, y en la home `main.js` las trata como anclas de la misma página (ítem activo en lima,
`internal_nav`). En una página interna, el link de Blog o Postulate queda marcado con `aria-current="page"` (lo pone
`main.js` si no está en el HTML).

Menú: Qué ofrecemos (`/#que-ofrecemos`) · Quiénes somos (`/#quienes-somos`) · Casos (`/#casos`) · Blog (`/novedades/`) ·
FAQ (`/#preguntas`) · Postulate (`/postulate/`), y el botón "Agendá reunión →" (`/diagnostico-sin-cargo/`).

**WhatsApp:** todos los enlaces a `wa.me/5491150274827` llevan un mensaje precargado (`?text=`) distinto por página
(home, diagnóstico, gracias, postulate, privacidad y 404), para saber desde dónde escriben.

**Fondos y tarjetas:** regla acordada con Brian: **fondo oscuro únicamente en el hero (placeholder del video de
fondo)**. El resto alterna blanco (`.bg-white`) y lavanda liso (`.bg-gray`) para que dos secciones seguidas nunca sean
iguales; paleta acotada (carbón para el texto, violeta, lima solo como acento, blanco y lavanda). Algunas secciones llevan
`.toque`: una mancha difusa de marca (violeta y lima) detrás del título y, con `.toque--esquina`, otra en la esquina de
abajo; sutiles, con deriva lentísima y quietas con "reducir movimiento" (ver "Ritmo de fondos" en `styles.css`). Las
tarjetas no llevan caja, sombra ni filetes: se separan por aire y tipografía, con el número arriba a la izquierda. Los
círculos de íconos y los chips van en lavanda sobre blanco y en blanco sobre lavanda. Barra de desplazamiento de la
página en violeta sobre lavanda.

## Secciones de la home, en orden

| Sección | id | Fondo |
|---|---|---|
| Hero (fondo de luces, cifras 16 años · +100 proyectos · +12 provincias) | — | carbón con luces |
| ¿Qué ofrecemos? (Servicios y Soluciones, dos carruseles) | `que-ofrecemos` (`servicios`, `soluciones`) | blanco, con brillo |
| Presencia (slider Argentina / Latam) | `presencia` (`presencia-pais`, `presencia-regional`) | lavanda, con brillos |
| Quiénes somos: Equipo · Socios tecnológicos · Clientes · Nuestra historia | `quienes-somos` (`equipo`, `socios`, `clientes`, `historia`) | blanco · lavanda · blanco · lavanda |
| Casos | `casos` | blanco, con brillo |
| Cita de Carlos | `como-trabajamos` | lavanda |
| Preguntas frecuentes (13) | `preguntas` | blanco, con brillo |
| Cierre "Agendá una reunión" | `agenda` | lavanda con card blanca (CTA lima) |

`#como-trabajamos` y `#agenda` se conservan para que no se rompan enlaces viejos. En cada carga corre la animación de
carga común (1 s, ver `README-movimiento.md`).

Capturas de referencia (1440 y 390, por sección y completas): `DOCS/diseno/capturas-template/`; las del blog, en
`DOCS/diseno/capturas-blog/`.

## Cómo editar

- **Años**: todo número de años lleva `data-anios` y `main.js` lo calcula desde 2010 (`FUNDACION`), así en 2027 pasa
  solo a 17. El HTML trae 16 para que sin JS se lea igual; el © del pie usa `data-anio`. "Desde 2010" es fijo (header,
  historia, pie, meta, og:image y `foundingDate` del JSON-LD).
- **Hero**: el H1 empieza con la palabra clave de Marketing, "Servicios IT para empresas y organismos" (con aspecto de
  rótulo, arriba), y sigue con el lema "Tecnología confiable para tu organización. 16 años de trayectoria en servicios
  IT." en las dos líneas grandes; la bajada, los dos botones y las tres cifras (16 años, +100 proyectos implementados con éxito, +12 provincias). El fondo es el de luces de
  la página anterior (carbón con cuatro luces que se mueven muy despacio), sin imagen ni video. Cuando llegue el video
  real, el comentario del hero en `index.html` explica dónde va y qué clase sacar.
- **Servicios y Soluciones**: 8 servicios (el último, Transformación digital) y 10 soluciones (la última, Tecnología
  colaborativa), en grupos de tres. Tarjeta como la del original de Nico: número arriba a la izquierda (sin centrar) y,
  centrados en la tarjeta, el ícono en su círculo, el título (`h4`) y "Ver más". Flechas a los costados, centradas en alto sobre las tarjetas, y puntos
  abajo; avanzan solas cada 5 s. Los íconos son los de la presentación institucional 2026
  (`DOCS/empresa/presentacion-institucional/iconos/`):
  - Servicios: los SVG originales con el color pasado a `currentColor` (violeta sobre círculo blanco).
  - Soluciones: redibujo en SVG de los PNG de la presentación, con el mismo trazo y las mismas puntas que los de
    servicios (carbón sobre lima).
  - Todos a la misma escala (0,7 px por unidad del dibujo, trazo de 2,2 unidades) en un círculo de 64 px. Cada figura
    lleva `pathLength="64"` para que el trazo se dibuje completo en la entrada.
- **Presencia**: una sola sección con dos vistas (mapa de Argentina y mapa regional). Pestañas con el nombre, flechas a
  los costados del mapa (una de cada lado, centradas en alto) y deslizar con el dedo. Cada mapa recorre todas sus zonas
  con presencia, una por una, y recién al terminar pasa a la otra vista, en bucle; se frena con el mouse encima, con el
  foco adentro o fuera de pantalla. Las provincias y los países se nombran en el `aria-label` de cada mapa (sin
  `<title>` en los trazos: no hay tooltips nativos). Para sumar una zona, agregar `on` a su clase en el SVG.
- **Equipo**: primero "Nuestro equipo técnico" a todo el ancho y después Carlos, Nicolás, Laura, Lisandro, Brian Sierra y
  Alejandro Ayala. Las certificaciones son solo las vigentes del zip de certificados 2026 (las vencidas pasan a
  "Formación"). Sin foto, `.member__photo` muestra la caja gris con la silueta; para poner la foto va un `<img>` adentro.
- **Socios tecnológicos**: grilla de 35 logos sin cajas; cada tanto cambia una fila entera en ola, con fundido cruzado y
  un leve desplazamiento. Se detiene con el mouse encima, con el foco adentro o fuera de pantalla. Sin botón de pausa.
- **Clientes**: los rubros del fichero original de Nico, sin "Todos", como solapas en una fila arriba (en celular, en
  renglones centrados, sin scroll): Sector público (18), Seguros y salud (6), Laboratorios e industria (8), Medios y
  tecnología (9) y Servicios y comercio (9). Los rubros avanzan solos cada 7 s, con una línea lima fina en la solapa
  activa que se llena con el tiempo; el cambio es un fundido con un corrimiento corto. Un clic elige el rubro y el ciclo
  sigue desde ahí; sin botón de pausa (con "reducir movimiento" no avanza solo). Debajo, los logos del rubro en bandas
  continuas que siempre llenan el ancho: una fila hacia la izquierda o, desde 10 logos, dos filas (arriba hacia la
  izquierda y abajo hacia la derecha). Las bandas no se detienen con el mouse: solo fuera de pantalla. Logos en gris que
  toman su color con el mouse encima. Las listas del HTML son la fuente (un `li` por cliente en su rubro); `main.js`
  suma las repeticiones y la copia del loop (con `aria-hidden` y sin foco). Con "reducir movimiento", una grilla quieta
  por rubro.
- **Nuestra historia**: colores acordados (los de Nico): fondo lavanda, texto carbón, años, anillos y cuadrado en violeta, y el número de años gigante;
  a la izquierda (fija al scrollear desde 960 px) título y cifra, a la derecha la línea de tiempo con 16 hitos, de 2010
  (fundación) a 2026.
- **Casos**: 40 casos. A la izquierda, un menú con el sector ("Sector público" / "Sector privado", sin "Todos"; arranca
  en público) y los logos de los clientes de ese sector, en gris, que toman color al pasar el mouse; el del caso a la
  vista queda a color con una barrita lima. Los casos pasan solos con una transición coordinada (sale el anterior y
  entran escalonados logo, nombre, sector, etiquetas y la lista "Qué hicimos"), una barra de avance que se llena con el
  tiempo del caso y el contador "01 / 17". Si un cliente tiene varios proyectos (`data-steps`), se pasan de a uno.
  Flechas a los costados de la tarjeta, centradas. La pista toma el alto del caso activo: sin caja con scroll.
- **Cita de Carlos**: «Anticiparse y resolver antes de que el cliente lo pida es mucho más fácil que recuperar una
  relación que se rompió.», firmada en una línea "Carlos Baldelli · CEO de Intellihelp" (en celular, nombre arriba y
  cargo abajo), y la foto a la derecha. Es una adaptación de una idea de Mark Cuban sobre ponerse en el lugar del
  cliente, sin nombrarlo; la eligió Brian el 08/11 y falta la aprobación de Carlos (está en el comentario del HTML).
  Para poner la foto real, reemplazar `img/equipo/carlos-cita.jpg` (de frente, vertical 4:5, 880 × 1100) con el mismo
  nombre.
- **Preguntas frecuentes**: 13 preguntas, con el diseño de la página anterior: título a la izquierda (fijo al
  scrollear), lista a la derecha, signo + / – dibujado con CSS y exactamente centrado, una respuesta abierta por vez. Se
  sumaron tamaño de empresa y cantidad de puestos, tiempos de respuesta (SLA), Ley 25.326 y qué pasa al terminar el
  contrato, con datos de los documentos de la empresa (los que no tenían fuente se redactaron sin cifras). Si se cambia
  una pregunta, se cambia igual en el bloque `FAQPage` del `<head>` (el texto tiene que ser idéntico, sin los enlaces). No hay más links "Preguntas frecuentes →"
  en otras secciones.
- **Cierre**: "Agendá una reunión", las dos frases, botón a `/diagnostico-sin-cargo/` y WhatsApp. La agenda y el
  formulario viven en esa página.

## Medición

- Google Tag Manager `GTM-54S82VL3`: script arriba del `<head>` y `noscript` justo después de `<body>`.
- `cta_click` (`cta_id`, `cta_section`, `cta_url`): cada "Agendá reunión" lleva `id` y `data-cta`:

  | id | data-cta |
  |---|---|
  | `cta-header` | `header-agendar` |
  | `cta-hero` | `hero-agendar` |
  | `cta-servicios` | `servicios-agendar` |
  | `cta-soluciones` | `soluciones-agendar` |
  | `cta-cierre` | `cierre-agendar` |

  `cta-como-trabajamos` ya no existe (se fue con "Cómo empezamos"): si GTM tenía un disparador con ese id, avisar a marketing.
- `internal_nav` (`link_text`, `link_target`, `link_from`): clic en un ancla de la misma página, incluidas las `/#...`
  del header y del pie.
- `click_calendar`, `schedule_meeting` y `cf7_enviado`: los publica `js/agenda.js` en `/diagnostico-sin-cargo/`.
- Origen de la visita: `main.js` guarda la primera visita (UTM, gclid, li_fat_id, referrer, página de entrada y canal)
  90 días en `localStorage['ith_origen']`, con el mismo formato que la agenda. Así, quien entra a la home por una campaña
  y agenda después no queda como "Directo".

## Diagnóstico sin cargo (`/diagnostico-sin-cargo/` y `/gracias-reserva/`)

Adonde llevan todos los "Agendá reunión". Estructura y textos: `DOCS/diseno/diagnostico-sin-cargo.md` (la referencia
de forma es la página de Clau; el formulario es un bloque de reserva propio, con el calendario primero).

- **Primera pantalla** (fondo lavanda): título "Diagnóstico IT: 30 minutos sin cargo" (la frase clave se escribe cuando
  sale el telón de la carga), bajada y video de presentación (mientras no esté, el marco con "próximamente").
- **Bloque de reserva `#agendar`:** a la izquierda, en carbón, "Reservá tu reunión" con la duración, Google Meet, el
  especialista y "sin cargo"; a la derecha, los pasos 01 Día y horario · 02 Tus datos · 03 Confirmación.
  - Paso 1: calendario mensual propio (`diagnostico.js`, con los días que trae `agenda.js` del CRM) y los horarios del
    día elegido. Teclado: flechas, Inicio y Fin.
  - Paso 2: nombre y apellido, empresa, mail laboral, WhatsApp, "¿Cómo nos conociste?" en chips propios y la casilla de
    consentimiento propia (link a `/privacidad/`). Validación de a un mensaje. Botón `.btn .btn-lime`.
  - Paso 3: con la reunión confirmada, guarda nombre, mail, horario y duración en `sessionStorage` (`ith_reserva`) y
    pasa a `/gracias-reserva/` (si no puede guardar, confirma en el bloque).
  - "¿Preferís que te contactemos?" cambia el bloque a la consulta sin turno (`api/contact.php`), con "Volver a los
    horarios". Si el CRM no responde o no quedan horarios, abre directamente la consulta. Sin JS, la consulta funciona
    con un POST normal.
- **Casos:** carrusel de cinco casos (Antes / Qué se hizo / Hoy), flechas a los costados. **Pie mínimo** con la Ley 25.326.
- **`/gracias-reserva/`** (fondo carbón, noindex): "Listo, {nombre}.", día y horario, a qué mail llegó la invitación,
  qué tener a mano, cómo cambiar el horario y la firma. Si se entra directo, invita a ir a la agenda.
- **Header:** el común. En esta página "Agendá reunión →" no recarga: baja al bloque y deja el foco en el paso que se ve.
- **Otros:** `?servicio=` deja elegido el servicio; la duración (30) se actualiza con la del tipo de reunión del CRM.
- **Origen y medición:** origen, canal y UTM viajan en los campos ocultos (`ith_origen`, con respaldo en
  `sessionStorage['ith_campana']`) a `entradas_web` del CRM. Eventos: `cta_click`, `click_calendar`,
  `schedule_meeting` (con `canal`) y `cf7_enviado`.

## Postulate (`/postulate/`)

Página para postularse, sin formulario propio: las postulaciones entran por HiringRoom, nuestra plataforma de
selección (portal: <https://intellihelp.hiringroom.com/jobs>).

- **Búsquedas abiertas:** `js/postulate.js` carga el script de inserción de HiringRoom
  (`https://hiringroom.com/assets/js/api/embed.js`) recién cuando la sección `#busquedas` se acerca a la pantalla y
  llama a `embed()` con la cuenta de `data-hiringroom-cuenta`. El script escribe una tarjeta `li.microsite_vacancy` por
  cada búsqueda externa publicada dentro de `#embeded_code`; `postulate.js` las limpia (saca scripts, estilos en línea
  y enlaces que no sean http/https) y les pone los botones del sitio ("Postularme →" lima y "Ver la búsqueda"), y
  `css/postulate.css` las muestra como las tarjetas de Servicios de la home: sin caja, sin sombra y sin filete, con el
  número arriba a la izquierda, dos columnas en escritorio y una en celular. Mientras consulta se ve "Consultando las
  búsquedas publicadas…" con un indicador propio. La hoja propia de HiringRoom (una regla global sobre todos los `h3`)
  se quita apenas aparece.
- **Resto de la página:** hero con la card carbón "Cómo te acompañamos", "Por qué trabajar con nosotros" y "Perfiles que
  solemos buscar", todo con tarjetas sin caja y la misma escala y ritmo de la home.
- **Sin búsquedas o sin HiringRoom:** si no hay búsquedas publicadas, o el script no carga o no responde en 8 segundos
  (bloqueador, sin red), se ve el aviso "En este momento no hay búsquedas abiertas" con el botón de mail a
  rrhh@intellihelp.tech. Sin JS se ve ese mismo aviso.
- **Política de seguridad:** el hosting hoy no manda Content-Security-Policy. Si se agrega, permitir
  `https://hiringroom.com` en `script-src` y `connect-src`.
- **Medición:** además de `cta_click` e `internal_nav`, los botones de la página publican `postulate_click`.

## Comportamiento

- **Sin botones de pausa en ningún lado.** Lo que se mueve solo (carruseles, mapa, socios, casos) se detiene con el
  mouse encima, con el foco adentro, fuera de pantalla o con la pestaña oculta; las bandas y el avance de rubros de
  Clientes solo se detienen fuera de pantalla. Con "reducir
  movimiento" nada se mueve (la carga aparece en su versión quieta).
- **Sin subrayados**, ni fijos ni animados. Menú, pie y enlaces cambian de color.
- **Nada nativo del navegador a la vista:** sin barras de scroll internas (carruseles con `scrollbar-width: none`, con o
  sin JS), barra de la página con los colores del sitio, sin destello al tocar en el celular, sin `title` (tooltips) ni
  `<title>` en los mapas, sin el botón de play de Safari sobre el video del hero (si `play()` falla, `main.js` cambia
  el video por su poster), sin selects ni casillas del sistema y sin el tirador de tamaño de los campos de texto.
- **Flechas siempre a los costados** en todos los carruseles (Servicios, Soluciones, Presencia y Casos), una de cada
  lado; en celular, más chicas y sobre el borde.
- **Un solo botón:** `.btn` (con `.btn-lime`, `.btn-light`, `.btn-soft`, `.btn-gray`) en todo el sitio, también en el
  header y en el diagnóstico: hover con cambio de color, brillo y flecha que avanza; al hacer clic se hunde apenas.
- **Animaciones de entrada**: los `.rv` aparecen al entrar en pantalla, una sola vez. El script del `<head>` pone en
  `<html>` las clases `js` y `anim`; sin `anim` todo se ve quieto.
- **Texto del hero**: entra cuando empieza a salir el telón de la carga (`ith:intro-salida`).
- **Escala de títulos**: tokens `--h1`, `--h2` y `--h2-big` en `:root` de `styles.css` (copiados en el `main.css` del
  tema del blog). El H1 de cada página usa `--h1` y siempre es lo más grande de la pantalla.
- **Menú en celular**: al abrirlo, el foco pasa al primer link; Escape lo cierra y devuelve el foco al botón.

## Pendientes

- [ ] Frase de Carlos: adaptación de una idea de Mark Cuban, elegida por Brian el 08/11; pendiente de su aprobación. Falta su foto y
      las del equipo.
- [ ] Preguntas frecuentes nuevas: confirmar con Carlos cómo es la transición al terminar un contrato. (La cifra de la
      SRT ya está confirmada: 1.800 personas en 20 edificios, de la presentación institucional 2026.)
- [ ] Video real del hero.
- [ ] Blog: instalar el WordPress en `/novedades/` del hosting (pasos en `WORDPRESS/README.md`).
- [ ] `/privacidad/`: ya es indexable y está en el pie y en el sitemap; conviene que el área legal haga una lectura
      final antes de publicar.
- [ ] Diagnóstico sin cargo: confirmar con el equipo que después de la reunión se manda un resumen por mail (lo dice la
      confirmación) y la frase "Los nombres se publican con autorización de cada cliente" antes de sumarla a los casos.
- [ ] Campo "¿Cómo nos conociste?" del diagnóstico: queda afuera hasta que el CRM tenga dónde guardarlo. También
      convendría que la API del CRM reciba el cargo en su propio campo.
- [ ] Archivos sin uso que no hace falta subir: `img/clientes/strix.webp`, `video/hero-placeholder.mp4` y
      `img/iconos/*.svg` (los íconos ya van embebidos en el HTML).
- [ ] Configuración del CRM de producción en el servidor (`ith_web_config/crm.php`) y SMTP del CRM.
- [ ] Al subir, no publicar `vite.config.js`, `servir.cmd`, `dev/`, `.vite/`, `README.md` ni `README-movimiento.md`
      (la documentación tiene pendientes internos y rutas de configuración del servidor).
- [ ] `sitemap.xml`: actualizar `lastmod` al publicar.
- [ ] Validar qué logos de clientes y qué casos se pueden publicar con nombre.
- [ ] Redirecciones del `.htaccess`: antes de publicar, cruzar la lista con las páginas que Search Console muestra
      con tráfico o enlaces y probarlas en el hosting con el checklist de "Lanzamiento en Hostinger".
- [ ] Tema del blog: recopiar `css/carga.css`, `js/carga.js` y el header nuevo (barra carbón) en el tema de WordPress.

## Lanzamiento en Hostinger

Todo se hace en la carpeta `public_html` de intellihelp.tech (hPanel → Administrador de archivos, o por SSH). En esa
carpeta también viven los subdominios y las apps: **no se mueve ni se borra ninguna de estas carpetas**: `crm/`,
`crm-pruebas/`, `Desarrollo/`, `desarrollo/`, `GLPI/`, `inventario/`, `remitos/`, `tickets/`, `demo/`, `learning/`,
`learningtest/`, `comprobantes/`, `marketing/`, `servicios/` (la mini web de servicios.intellihelp.tech),
`landing-page-OLD/`, `wp-snapshots/` y `cgi-bin/`.

**Qué hace el `.htaccess` del sitio** (comentado en el propio archivo):

- Antes de cualquier regla, todo pedido que no sea de `intellihelp.tech` o `www.intellihelp.tech` pasa sin tocar
  (`RewriteCond %{HTTP_HOST} !^(www\.)?intellihelp\.tech$ [NC]` → `RewriteRule ^ - [L]`): los subdominios cuya carpeta
  está dentro de `public_html` no heredan las reglas del sitio.
- Las carpetas de apps quedan afuera de todas las reglas del sitio (incluido el salto a www, así no se rompe el login
  con Google del CRM). La excepción de `/desarrollo` está marcada para no borrarla.
- **`/servicios/`:** la carpeta física sirve servicios.intellihelp.tech y no se borra. En el host principal, las URLs
  `/servicios/*` del sitio anterior van con 301 a `/#servicios` **solo si no existe un archivo físico** con esa ruta
  (`RewriteCond %{REQUEST_FILENAME} !-f`); como `/servicios/` es un directorio y no un archivo, la portada de la mini web
  no se ve en www (sería contenido duplicado del subdominio). Los archivos físicos (css, imágenes, PDF) se sirven tal
  cual por si algo los enlaza desde el dominio principal; las viejas `index.html`, `empresas.html` y `home.html`
  redirigen igual porque eran las indexadas. Si `public_html/servicios/` tiene su propio `.htaccess` con
  `RewriteEngine On`, las reglas de la raíz no corren ahí: copiar a ese archivo el bloque "/servicios/" (comentado).
- Un solo salto de http o sin www a `https://www.intellihelp.tech` (respeta `HTTPS=on`, `X-Forwarded-Proto` y
  `X-Forwarded-SSL` del CDN), y todas las 301 apuntan directo al destino final.
- 301 del sitio anterior (con y sin UTM) a la sección o página nueva; `/blog` y `/blog/*` → `/novedades/`;
  `/novedades/` y `/api/` no se tocan.
- Caché: HTML, txt y xml con `no-cache`; css/js sin versión 1 hora; imágenes, fuentes y video sin versión 30 días; con
  `?v=` o con hash en `/assets/`, 1 año `immutable`. `AddType 'text/plain; charset=UTF-8' .txt`.
- `ErrorDocument 404 /404.html` solo para el host principal (dentro de un `<If>`); la 404 lleva `X-Robots-Tag: noindex`.
- Bloque comentado para el `auto_prepend_file` de Wordfence (no se activa).

### 1. Respaldo

- [ ] El respaldo completo ya está hecho (08/11) en `~/respaldos/web-20261108` del servidor. Antes de mover nada,
      confirmar que la carpeta está y tiene contenido (`ls -la ~/respaldos/web-20261108`).
- [ ] Guardar aparte el `.htaccess` actual de `public_html` y leerlo: si tiene algún bloque que no sea de WordPress,
      Wordfence o LiteSpeed Cache (por ejemplo, algo de un subdominio o de una app), pasarlo al `.htaccess` nuevo
      antes de subirlo.

### 2. Sacar el núcleo del WordPress anterior

Se mueve a una carpeta de respaldo fuera de `public_html` (no se borra). Por SSH, parado en `public_html`:

    RESP=~/respaldos/wp-anterior-$(date +%Y%m%d)
    mkdir -p "$RESP"
    cp -p .htaccess "$RESP/htaccess-anterior"
    ls -d wp-admin wp-includes wp-*.php index.php xmlrpc.php license.txt readme.html wordfence-waf.php 2>/dev/null
    mv wp-admin wp-includes wp-*.php index.php xmlrpc.php "$RESP"/
    mv license.txt readme.html wordfence-waf.php "$RESP"/ 2>/dev/null

    # wp-content: todo al respaldo, salvo el PDF de servicios (está indexado y se mantiene en la misma URL)
    mv wp-content "$RESP"/
    mkdir -p wp-content/uploads/2019/07
    cp -p "$RESP/wp-content/uploads/2019/07/ITH-servicios-digital.pdf" wp-content/uploads/2019/07/

- [ ] Revisar la salida del `ls` antes del `mv`: solo tienen que aparecer archivos del WordPress anterior.
- [ ] `.user.ini` de `public_html`: si tiene `auto_prepend_file` (el firewall de Wordfence), quitar esa línea. Si no,
      todo PHP de `public_html` (la API del formulario y de la agenda, y las apps) da error 500. En el `.htaccess`
      nuevo el bloque de Wordfence está comentado a propósito.
- [ ] `google9ffcbef7277c41a3.html` (verificación de Search Console) se queda en la raíz. También viene en el sitio
      nuevo, con el mismo contenido.

### 3. Subir el sitio

Subir a la raíz de `public_html` el contenido de `TEMPLATE-NICO/` (no la carpeta):

- Sí: `.htaccess`, `index.html`, `404.html`, `google9ffcbef7277c41a3.html`, `robots.txt`, `sitemap.xml` (con
  `lastmod` del día), `llms.txt`, `favicon-32.png`, `apple-touch-icon.png`, `og-image.png`, `api/` (con su
  `.htaccess`), `css/`, `js/`, `fonts/`, `img/`, `diagnostico-sin-cargo/`, `gracias-reserva/`, `postulate/` y
  `privacidad/`.
- No: `dev/`, `.vite/`, `node_modules/`, `servir.cmd`, `vite.config.js`, `README.md`, `README-movimiento.md`, ni
  los archivos sin uso de "Pendientes" (`img/clientes/strix.webp`, `video/hero-placeholder.mp4`, `img/iconos/*.svg`).
- [ ] Los `.htaccess` empiezan con punto y en Windows pueden quedar ocultos: confirmar que se subieron los dos (raíz
      y `api/`).
- [ ] Configuración del CRM de producción cargada fuera de `public_html`: por defecto `api/_crm.php` la busca en
      `ith_web_config/crm.php` al lado de `public_html` (dos carpetas arriba de `api/`). Si va en otro lugar, definir la
      variable de entorno `ITH_CRM_CONFIG_SERVIDOR` con la ruta completa (o `ITH_CRM_CONFIG`, que tiene prioridad).
      La ruta real del servidor no se escribe en el repositorio.
- [ ] Si la carpeta `servicios/` tiene su propio `.htaccess` con `RewriteEngine On`, copiar ahí el bloque
      "/servicios/" del `.htaccess` del sitio (comentado en el archivo).

### 4. Blog en /novedades/

- [ ] Instalar WordPress en `public_html/novedades/` y seguir los pasos de `WORDPRESS/README.md` (tema,
      `siteurl` y `home` en `https://www.intellihelp.tech/novedades`, enlaces permanentes, su `.htaccess` con
      `RewriteBase /novedades/`, destildar "Disuadir a los motores de búsqueda"). El `.htaccess` del sitio no lo toca.

### 5. Caché, CDN y rastreadores

- [ ] Purgar la caché del CDN en hPanel para que se vea el HTML nuevo.
- [ ] Encender la caché del servidor. Después verificar que `/crm/` (login con Google incluido) y los subdominios
      siguen funcionando. Si alguna app queda cacheada, excluir su carpeta de la caché.
- [ ] Desactivar en hPanel la opción **bloqueo de rastreadores de IA** del CDN (hoy GPTBot recibe 429): `robots.txt`
      les da permiso explícito y existe `llms.txt`.
- [ ] Si el panel ofrece "forzar HTTPS", no hace falta: el `.htaccess` ya lo hace en un solo salto.

### 6. Verificación después de publicar

    S=https://www.intellihelp.tech
    # Dominio canónico: 301 a https://www.intellihelp.tech/ en un salto
    for u in http://intellihelp.tech/ https://intellihelp.tech/ http://www.intellihelp.tech/; do
      curl -s -o /dev/null -w "%{http_code} %{redirect_url}  <- $u\n" "$u"; done
    # Un solo salto hasta el 200 (num_redirects tiene que ser 1)
    curl -s -o /dev/null -L -w "%{num_redirects} %{http_code} %{url_effective}\n" http://intellihelp.tech/servici0s/

    # 301 del sitio anterior, con y sin UTM
    for p in /servici0s/ /servicios/ /servicios/empresas.html /outsourcing/ /outsourcing-bancos/ /videoseguridad/ \
             /control-de-accesos/ /soluciones-cloud-huawei/ /clientes-antigua/ /client-types/01/ /home-antigua/ \
             /author/intelihelp/ /en/ /en/contact-us/ /es/contacto/ /partners-y-vendors/ /history/ \
             /history/primer-negocio/ /busquedas/ /category/rrhh/ /universidades/ /contacto/ /blog/ "/?page_id=32"; do
      curl -s -o /dev/null -w "%{http_code} %{redirect_url}  <- $p\n" "$S$p"; done
    curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" "$S/outsourcing/?utm_source=prueba&utm_medium=test"
    # -> 301 https://www.intellihelp.tech/?utm_source=prueba&utm_medium=test#servicios

    # Lo que no se redirige
    curl -sI $S/novedades/ | head -1                           # 200 (WordPress)
    curl -sI https://intellihelp.tech/crm/ | head -1             # sin 301 a www
    curl -sI https://servicios.intellihelp.tech/ | head -1       # 200, la mini web
    curl -sI $S/wp-content/uploads/2019/07/ITH-servicios-digital.pdf | head -1   # 200
    curl -sI $S/google9ffcbef7277c41a3.html | head -1           # 200

    # 404 propia con noindex, y restos del WordPress anterior
    curl -sI $S/no-existe/ | grep -iE "^HTTP|x-robots-tag"     # 404 + noindex, follow
    curl -s $S/no-existe/ | grep -i "<title>"                   # el título de la 404 del sitio
    curl -sI $S/wp-login.php | head -1                          # 410

    # Cabeceras
    curl -sI $S/ | grep -i cache-control                        # no-cache
    curl -sI $S/css/styles.css | grep -i cache-control          # public, max-age=3600
    curl -sI "$S/css/styles.css?v=1" | grep -i cache-control    # public, max-age=31536000, immutable
    curl -sI $S/llms.txt | grep -i content-type                 # text/plain; charset=UTF-8

    # Rastreadores
    curl -s -o /dev/null -w "%{http_code}\n" -A "GPTBot/1.2" $S/   # 200
    curl -s -o /dev/null -w "%{http_code}\n" -A "ClaudeBot" $S/    # 200

- [ ] Que LiteSpeed respete el `<If>` del `ErrorDocument` (si `/no-existe/` muestra la 404 genérica, aplicar la
      alternativa comentada en el `.htaccess`).
- [ ] Los subdominios y las apps del hosting responden como antes (`Options -Indexes` y `DirectoryIndex` del
      `.htaccess` se heredan en sus carpetas).
- [ ] Formulario de `/diagnostico-sin-cargo/` y agenda: una consulta y una reserva de prueba llegan al CRM.
- [ ] Search Console: la propiedad sigue verificada; enviar `https://www.intellihelp.tech/sitemap.xml` y pedir la
      indexación de la home.
