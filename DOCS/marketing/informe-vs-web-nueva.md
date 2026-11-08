# Informe de Clau vs. web nueva: mi checklist

Revisión del 30/10/2026. Crucé cada hallazgo del informe de visibilidad, el kickoff, el brief, el embudo y `requisitos-marketing.md` contra la web nueva: el código y `http://localhost:5173`. Todo eso se armó sobre el WordPress que está publicado hoy.

Referencias:

- **inf. p.X:** página de `informe-visibilidad-web-ia-2026-10.pdf` (40 páginas).
- **emb. p.X:** página de `embudo-ventas-intellihelp.pdf`.
- **kick. p.X:** página de `kickoff-plan-90-dias.pdf`.

Estados:

- **Resuelto:** está en el código y lo verifiqué.
- **Parcial:** está, pero le falta algo.
- **Falta:** no está.

Cómo lo verifiqué:

- Build en una carpeta temporal: 25 páginas, sin `{{`, sin `<include` y sin `.nota` en el HTML.
- Capturas a 1440 y 390 de home, `/diagnostico/`, Seguridad y Outsourcing: 0 errores de consola y 0 px de overflow.
- Un script que lee título, meta, H1, JSON-LD, palabras y `alt` de cada página del build.
- Una simulación de las 301 del `.htaccess` con las 23 URLs viejas del informe y del embudo.

## Lo más urgente

1. **Nada del sitio lleva a `/diagnostico/`.** La landing existe, pero 0 enlaces apuntan a ella. El CTA del header y las bandas de cada servicio bajan al formulario de la misma página. El embudo de Clau (emb. p.3) dice "páginas de servicio → landing de diagnóstico".
2. **Medifé aparece con logo y nombre** en la home y en `/clientes/`. Según `fuentes-drive-clientes.md`, hay un NDA firmado que pide "solo sin nombre". `confian.html` ya la saca, pero la home no (inf. p.8: "si alguno pidió no figurar").
3. **Keyword del ejemplo del embudo: "control de accesos para empresas"** (emb. p.7). `/control-de-accesos/` redirige bien a `/soluciones/seguridad/`, pero esa página se ordena por "instalación de cámaras" y la frase no aparece en ningún lado.
4. **Verificación de Search Console.** `DOCS/wordpress-anterior/google9ffcbef7277c41a3.html` es el archivo de verificación del WordPress y no está en `public/`. El día del cambio, Search Console puede perder la verificación.
5. **Del lado de Intellihelp:** URL del calendario, video de Carlos, fotos del equipo y testimonios. Sin eso, el CONVENCER del embudo queda a medias.

---

## HOME (`index.html` y `src/partials/*.html`)

| Hallazgo del informe | Cómo está en la web nueva | Estado | Archivo a tocar | Arreglo concreto |
|---|---|---|---|---|
| Título "Home - INTELLIHELP" sin servicio ni lugar (inf. p.5) | "Servicios informáticos para empresas en CABA \| Intellihelp" (58 caracteres) | Resuelto | — | — |
| Falta la meta descripción (inf. p.5) | Tiene 144 caracteres con servicios y CABA, pero no dice "servicios informáticos" ni "Intellihelp" | Parcial | `index.html` | Llevarla a 150-160 caracteres con la keyword y la marca, por ejemplo: "Intellihelp: servicios informáticos para empresas de CABA. Soporte IT, mesa de ayuda, outsourcing IT, cámaras y control de acceso, desde {{site.since}}." (medir el largo después del build) |
| Falta el H1; "Tecnología que genera valor" es genérico (inf. p.5) | Un solo H1: "Servicios informáticos para empresas y organismos públicos de Buenos Aires, desde 2012" | Resuelto | — | — |
| 273 palabras, servicios dentro de videos (inf. p.5, p.26) | 2.656 palabras en texto, sin videos | Resuelto | — | — |
| Años inconsistentes: +13, 15 y 14 (inf. p.5, p.25) | En el HTML todo sale de `{{site.years}}` y `{{site.since}}` | Resuelto | — | `public/` no usa tokens: ver PUBLIC |
| Copyright 2018 (inf. p.5, p.26) | `© {{site.year}}`, con "2026" fijo en `site.json`. El día 90 del plan (13/01/2027) ya queda viejo | Parcial | `src/partials/footer.html` + `plugins/vite-plugin-partials.js` | Que el token del año salga de la fecha del build (`new Date().getFullYear()`) y no de `site.json` |
| Propuesta de valor sin servicio, público ni lugar (inf. p.8) | Hero con servicio, público y CABA | Resuelto | — | — |
| No hay botón de contacto arriba (inf. p.7-8) | CTA lima "Agendá una reunión" en el header y WhatsApp en el hero | Resuelto | — | — |
| WhatsApp a la izquierda, tapa contenido (inf. p.8, p.26) | `.wa-float` a la derecha, más chico, con el mensaje de `data-wa-texto` de cada página | Resuelto | — | — |
| Teléfono con clic para llamar (inf. p.26) | `tel:` en el footer y en la banda de agenda | Resuelto | — | — |
| Formulario corto en la home (inf. p.8) | `agenda.html`: nombre, empresa, mail, teléfono opcional y servicio, con campos ocultos de origen y canal | Resuelto | — | — |
| **Embudo: de las páginas de servicio a `/diagnostico/`** (emb. p.3, p.7) | **0 enlaces a `/diagnostico/`.** El CTA del header va a `/contacto/#agenda`, y `header.js` lo cambia a `#agenda` porque todas las páginas tienen la banda | **Falta** | `src/partials/agenda.html`, `src/partials/header.html` (+ `src/scripts/modules/header.js`) | 1) En `agenda.html` (cierre de la home, contacto y cada servicio vía `pagina/cta.html`), sumar una línea con un link a `/diagnostico/`: "¿Preferís verlo con Carlos por videollamada? Elegí día y hora". Ocultarla con una prop en la propia landing. 2) Cuando esté el calendario, decidir con Clau si el CTA del header va a `/diagnostico/` en todas las páginas. `analytics.js` ya mide ese clic como `click_calendar` / `link_diagnostico` |
| Logos debajo del titular, por sector y en texto (inf. p.8, p.19) | Franja `logos.html` debajo del hero, con la línea de clientes en texto | Resuelto | — | — |
| **Algún cliente pidió no figurar** (inf. p.8) | **Medifé** está con logo y nombre en `logos.html` (línea 22 y texto de la línea 47). La fuente dice NDA: "solo sin nombre" | **Falta** | `src/partials/logos.html` (y `clientes/`, ver INSTITUCIONALES) | Sacar el logo y el nombre de Medifé, o cambiarlo por "una prepaga de salud", hasta que Dirección confirme el permiso por escrito |
| Cero testimonios (inf. p.8) | `testimonios.html` completo en `data-draft`: no se publica | Falta (Intellihelp) | `src/partials/testimonios.html` | Cargar 2 o 3 con nombre y cargo cuando lleguen. Las reseñas de Google entran al llegar a 5-10 |
| Cero personas en el sitio (inf. p.8, kick. p.3) | Equipo con nombre y cargo del brief, sin fotos (no existe `src/assets/img/equipo/`) | Parcial | `src/partials/equipo.html` | Subir las fotos en WebP y descomentar los `<img>` que ya están preparados |
| Las 7 preguntas que las IA le hacen al comprador (inf. p.20) | En `faq.html` sí están tamaño, abono o proyecto, interior y Ley 25.326. "Cuánto tarda en arrancar" quedó en borrador. El precio no va (regla del sitio) | Parcial | `src/partials/faq.html` | Publicar "¿Cuánto tarda en arrancar un servicio?" cuando Nicolás pase el plazo. El SLA y el fin de contrato van en Outsourcing (ver SERVICIOS) |
| Schema Organization + LocalBusiness con `sameAs` a LinkedIn y Google (inf. p.5, p.26) | Está en la home con CUIT, dirección, horario, teléfono, `disambiguatingDescription` y catálogo. `sameAs` tiene solo LinkedIn y `hasMap` es una búsqueda de Maps, no el perfil | Parcial | `index.html` (y `nosotros`, `contacto`) + `src/data/site.json` | Nuevo token `site.googleProfile` con el link "Compartir" del perfil de Google (`maps.app.goo.gl/…` o `?cid=`), usarlo en `sameAs` y en `hasMap`. Sumar Wikidata cuando Clau dé de alta la ficha |
| Conversiones como eventos (inf. p.8, p.26) y métricas del embudo (emb. p.8) | `analytics.js` ya manda `generate_lead`, `click_whatsapp`, `click_phone`, `click_email`, `click_calendar`, `schedule_meeting`, `scroll_depth`, `video_progress` y `view_diagnostico` con canal de origen. GTM-54S82VL3 carga solo en el dominio publicado. `ga4` y `clarity` vacíos para no contar doble | Resuelto (código) | — | Del lado de Clau: crear en GTM las etiquetas GA4 de cada evento con `DOCS/marketing/medicion-embudo.md`. Opcional: cargar GTM inline en el `<head>`, como el snippet oficial, en vez de desde `main.js` |
| Home de 11 MB, LCP de 7,6 s y Lighthouse móvil de 62 (inf. p.6, p.26) | La home pesa unos 470 KB con todo lo que referencia (build). Todas las imágenes son WebP, no hay videos, la caché está en el `.htaccess` y las fuentes se precargan | Parcial | — | Correr Lighthouse móvil sobre el build publicado (meta: 85 o más, LCP de menos de 2,5 s). Hoy no lo puedo medir en producción |
| Alt en todas las imágenes (inf. p.6, p.26) | 0 imágenes sin `alt` en las 25 páginas. Las que lo tienen vacío son decorativas | Resuelto | — | — |

## INSTITUCIONALES (nosotros, clientes, contacto, privacidad, 404, diagnóstico y `src/partials/pagina/*.html` compartidos)

| Hallazgo del informe | Cómo está en la web nueva | Estado | Archivo a tocar | Arreglo concreto |
|---|---|---|---|---|
| `/contacto/` da 404 y es el destino del perfil de Google y de las IA (inf. p.3, p.7, p.21) | `/contacto/` existe en la misma URL, con ContactPage, FAQ, formulario, WhatsApp, teléfono y dirección | Resuelto | — | — |
| `/clientes/` en 404, casos enterrados (inf. p.3, p.8) | `/clientes/` con sectores y más de 20 casos en texto (CollectionPage + FAQ) | Resuelto | — | — |
| **Medifé con NDA** (inf. p.8) | Logo y nombre en `clientes/index.html` (líneas 128 y 130) | **Falta** | `clientes/index.html` | Lo mismo que en la home: sacarla o dejarla sin nombre |
| Desambiguación con IntelliHelp SpA de Chile (inf. p.3, p.15, p.20-21) | Aclaración en el footer de todas las páginas, FAQ en Nosotros y Contacto, `disambiguatingDescription` en el schema y `llms.txt` | Resuelto (código) | — | Wikidata, LinkedIn y directorios son de Clau |
| Quiénes somos con equipo, trayectoria y partners (inf. p.25) | `/nosotros/` con historia, equipo, marcas, AboutPage y la sección `#trabaja-con-nosotros` | Resuelto | — | El informe pide `/nosotros/trabaja-con-nosotros/`; quedó como ancla y la 301 apunta ahí |
| Person para los fundadores (inf. p.26) | `/nosotros/` lista a las 7 personas como `employee`, sin `founder` ni `sameAs` | Parcial | `nosotros/index.html` | Si Dirección confirma que Carlos y Nicolás son fundadores (el brief dice "socio"), sumar `founder`. Agregar `sameAs` a su LinkedIn personal, con su permiso: Carlos es la cara del embudo |
| NAP: "un solo bloque idéntico en todos lados" (inf. p.4) | Todo sale de `site.json`, pero hay dos direcciones: `site.address` ("oficina 604, C1414CKM, CABA") y `site.addressShort` ("of. 604, CABA", sin CP). La corta se usa en el footer, el hero, la 404, Nosotros y la meta de Contacto | Parcial | `src/partials/footer.html`, `src/partials/hero.html`, `404.html`, `nosotros/index.html`, `contacto/index.html` | Usar `{{site.address}}` en todo lo visible. Dejar `addressShort` solo donde no entre, o borrarlo |
| Página 404 propia en español (inf. p.26) | `404.html` en español, `noindex`, con links a servicios, soluciones y contacto | Resuelto | — | — |
| Ley 25.326 (inf. p.20) | `/privacidad/` y una FAQ por servicio | Resuelto | — | — |
| Landing `/diagnostico/`: video corto de Carlos (emb. p.4) | `site.diagnostico.video` vacío: se ve la tarjeta de Carlos sin foto. La fachada de YouTube y la medición del video ya están programadas | Falta (Intellihelp) | `src/data/site.json` | Cargar el link de YouTube cuando Clau y Carlos graben el video |
| Landing: clientes reales a la vista (emb. p.4) | `confian.html`: 6 logos vigentes y una línea de texto | Resuelto | — | Pendiente de Nico: logos de INCUCAI y Magistratura |
| Landing: calendario en la misma página (emb. p.4-5) | `site.diagnostico.calendario` vacío: queda el formulario. Con la URL, `diagnostico.js` arma el iframe | Falta (Clau) | `src/data/site.json` | Cargar la URL. Ojo: el evento `schedule_meeting` (reunión agendada, emb. p.8) solo existe con **Calendly**. Con la página de citas de Google Calendar se mide el clic, pero no la reserva. Definirlo con Clau antes de elegir |
| Confirmación por mail con recordatorio (emb. p.5) | Con el calendario sale sola. En el modo formulario el prospecto no recibe nada: `contact.php` solo le escribe a info@ | Parcial | `src/data/site.json` (o `public/api/contact.php`) | Lo mejor es cargar el calendario. Si se demora, sumar una respuesta automática corta al remitente, con el mismo límite de envíos que ya tiene el script |
| Mensaje de Carlos por LinkedIn (emb. p.6-7) | La tarjeta de Carlos no enlaza a su LinkedIn | Falta | `src/partials/pagina/diagnostico/reunion.html` | Link a su perfil en la tarjeta, con su OK |
| Duración y costo de la reunión | FAQ y línea "sin cargo" en `data-draft` | Falta (Carlos) | `diagnostico/index.html` | Publicarlas cuando Carlos confirme. El informe dice "Agendá 20 minutos" (inf. p.17) |
| Comentario viejo en `/diagnostico/` | Dice "antes de cargar las URL hay que abrir la CSP", pero el `.htaccess` ya tiene YouTube, Calendly y Google Calendar | Parcial (menor) | `diagnostico/index.html` | Actualizar el comentario |
| Contenido citable con fechas y autoría (inf. p.18-21) | Ninguna página, salvo Privacidad, tiene fecha de actualización ni `dateModified` | Falta | `src/partials/pagina/head.html` (+ `index.html`) | JSON-LD `WebPage` con `dateModified` (fecha del build o el `lastmod` del sitemap) y `publisher` → `#organizacion`. En el blog, autor con nombre y cargo |
| Sectores: público, seguros y bancos, salud y laboratorios (inf. p.24-25, fase 2) | No existen. Hoy está `/clientes/#sectores` | Falta (fase 2) | Carpeta nueva `sectores/` | Tres páginas con los casos que ya están en `/clientes/`, con la receta de `LEEME.md` y el sitemap |
| Tiempo de respuesta comercial (inf. p.20) | FAQ "¿Cuánto tardan en responder?" en borrador, en Contacto | Falta (Intellihelp) | `contacto/index.html` | Publicarla con el dato de Carlos o Nicolás |

## SOLUCIONES (`soluciones/**`)

| Hallazgo del informe | Cómo está en la web nueva | Estado | Archivo a tocar | Arreglo concreto |
|---|---|---|---|---|
| Una página por solución con su keyword en título y H1 (inf. p.9-10, p.24-25) | Las 9 están publicadas: Seguridad (cámaras), Ciberseguridad, Redes indoor (cableado estructurado), FTTH, Data Center, Cloud (servicios en la nube), IoT, Acceso (GPON) y Energías (paneles solares). Cada una con su `Service`, migas y FAQPage | Resuelto | — | — |
| Estructura de cada página (inf. p.26) | Las 9 tienen respuesta corta, datos clave, caso, FAQ y banda con formulario y WhatsApp propio | Resuelto | — | — |
| **"Control de accesos para empresas"** (emb. p.7) y "control de acceso para empresas" con AI Overview (inf. p.20) | La 301 `/control-de-accesos/` → `/soluciones/seguridad/` funciona, pero el título y el H1 se ordenan por cámaras. La frase "control de acceso(s) para empresas" no aparece. "Control de acceso" (720/mes, KD 0) solo figura como secundaria | **Parcial** | `soluciones/seguridad/index.html` | Mínimo: 1) una tarjeta o H2 "Control de accesos para empresas" en `#incluye` (molinetes, barreras, biometría, integración con sueldos, que ya están en el texto); 2) una FAQ "¿Qué control de accesos conviene para una empresa?"; 3) una meta descripción que arranque con "Cámaras de seguridad y control de accesos para empresas…"; 4) sumarla a `alternateName`. Más fuerte, para decidir con Clau: una página propia `/soluciones/control-de-accesos/`, con la 301 apuntando ahí. Depósitos o logística solo si hay un caso real |
| `/videoseguridad/` → Seguridad (emb. p.3, inf. p.27) | 301 en un salto | Resuelto | — | — |
| `/soluciones-cloud-huawei/` → Cloud (emb. p.3, inf. p.27) | 301 en un salto a `/soluciones/cloud/` | Resuelto | — | — |
| Un caso real por solución (inf. p.26) | A Ciberseguridad le falta el caso (nota "Falta caso"), y también el SLA y cómo se cotiza (en borrador) | Parcial | `soluciones/ciberseguridad/index.html` | Que Nicolás pase un proyecto Fortinet con cliente, año, alcance y equipos, y el permiso para nombrarlo |
| Modelo o rango de precio (inf. p.3, p.26) | Se explica cómo se cotiza, sin montos (regla del sitio: nada de precios) | Parcial (decisión) | — | Sigue pendiente la decisión 2 del informe. Si Dirección aprueba un "desde", va en `data-draft` hasta que lo confirme |
| URL de Acceso: el informe propone `/soluciones/acceso-catv-pon/` (inf. p.25) | `/soluciones/acceso/` | Resuelto (decisión) | — | No hay una URL vieja que redirigir |

## SERVICIOS (`servicios/**`)

| Hallazgo del informe | Cómo está en la web nueva | Estado | Archivo a tocar | Arreglo concreto |
|---|---|---|---|---|
| `/servicios/` era otra web y otra marca, para pymes y personas (inf. p.5, p.7) | Índice nuevo con la misma marca: 7 servicios, CollectionPage y FAQ | Resuelto | — | Sigue pendiente decidir si hay línea para pymes chicas y particulares (inf. p.3) |
| `/outsourcing/` → Outsourcing y Service Desk (emb. p.3, inf. p.26) | 301 en un salto, igual que `/outsourcing-bancos/` y el webinar de 2022 | Resuelto | — | — |
| `/servicios` sin barra (emb. p.3) | La regla de carpetas agrega la barra, `https` y `www` en un solo salto | Resuelto | — | — |
| Keyword "outsourcing it" + service desk, mesa de ayuda tercerizada y soporte IT para empresas (inf. p.25) | En el título, el H1 y el texto | Resuelto | — | — |
| "Help desk" (1.000/mes, inf. p.15, y el brief lo nombra) | No aparece en ninguna página | Parcial | `servicios/outsourcing-y-service-desk/index.html` | Sumarlo como sinónimo en la respuesta corta o en una FAQ ("¿Help desk o service desk?"), sin tocar el H1 |
| "¿Qué pasa al terminar el contrato?" (inf. p.20) | FAQ en borrador | Falta (Intellihelp) | `servicios/outsourcing-y-service-desk/index.html` | Publicarla con la respuesta de Carlos |
| SLA y horario (inf. p.20, p.26) | Publicado en Outsourcing (FAQ de tiempo de respuesta y datos clave) | Resuelto | — | — |
| Desarrollo: la keyword principal es "empresas de desarrollo de software" (inf. p.25) | Está en el texto, pero el título y el H1 dicen "software a medida" | Parcial | `servicios/desarrollo-de-aplicaciones/index.html` | Título: "Empresa de desarrollo de software en CABA \| Intellihelp" (55 caracteres). El H1 puede quedar como está |
| Transformación digital con página propia (inf. p.25, fase 2) | Está dentro de Consultoría | Parcial | `servicios/consultoria/index.html` | Un H2 "Transformación digital para empresas" (480/mes), o una página propia en la fase 2 |
| `/universidades/` → Capacitación (inf. p.27) | 301 en un salto | Resuelto | — | — |
| Fase 2: Consultoría, Búsqueda, Capacitación, Desarrollo y Automatización (inf. p.24-25) | Las 5 ya están publicadas, más Reclutamiento y selección | Resuelto | — | — |

## PUBLIC (`public/*`: robots, sitemap, llms.txt, `.htaccess` y api)

| Hallazgo del informe | Cómo está en la web nueva | Estado | Archivo a tocar | Arreglo concreto |
|---|---|---|---|---|
| `robots.txt` en 404, falta el permiso a las IA (inf. p.5, p.20, p.26) | `robots.txt` con el sitemap y permiso explícito para GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User, PerplexityBot, Google-Extended, Applebot-Extended, Bingbot y CCBot | Resuelto | — | Cuando el blog funcione, sumar la línea de su sitemap (ya está comentada) |
| No hay sitemap (inf. p.5) | `sitemap.xml` con las 24 URLs publicables, sin la 404 | Resuelto | `public/sitemap.xml` | Actualizar el `lastmod` a mano cada vez que se publiquen cambios |
| No hay `llms.txt` (inf. p.20, p.26) | Tiene descripción, CUIT, la aclaración del homónimo, servicios, soluciones, casos y contacto | Parcial | `public/llms.txt` | 1) Es estático: no usa `site.json`, así que si cambia el NAP o los años queda desfasado. Generarlo en el build con un plugin, o revisarlo en cada cambio. 2) Sumar "14 años de trayectoria (desde 2012)" y "Dirección: Carlos Baldelli (presidente y socio) y Nicolás Baldelli (director de operaciones y socio)" para la exactitud de la entidad (inf. p.18, C2: 1/7) |
| 301 del capítulo 9 (inf. p.26-27) y las URLs del embudo (emb. p.3) | Simulé las 23: `/outsourcing/`, `/control-de-accesos/`, `/videoseguridad/`, `/soluciones-cloud-huawei/`, `/servici0s/`, `/quienes-somos/`, `/partners-y-vendors/`, `/busquedas/`, `/universidades/`, `/home-antigua/`, `/author/…`, `/en/*`, el PDF de 2019 y `/es/*`. Todas van al destino correcto en un salto. `/blog/` no se toca | Resuelto | — | — |
| `/novedades/` y las 2 notas de 2018 → `/blog/` (inf. p.27) | Mientras no haya blog, van a la home, a FTTH y a Servicios | Parcial (a propósito) | `public/.htaccess` | Cambiar los 3 destinos a `/blog/` cuando el WordPress responda |
| Las 13 entradas de empleo de 2022 (inf. p.27) | Las cubre un patrón (`analista-*`, `developer-*`, `desarrollador-*`, `arquitecto-de-soluciones`) | Parcial | `public/.htaccess` | Antes de publicar, cruzar los 13 slugs reales con Search Console o el backup y sumar los que no entren en el patrón (inf. p.27: "URL con impresiones de los últimos 16 meses") |
| HTTPS en un solo salto a `https://www.` (inf. p.5, p.27) | Reglas de www y https en un solo salto | Resuelto | — | — |
| Caché activa (inf. p.26) | 1 año `immutable` para los archivos con hash, 30 días para las imágenes y `no-cache` para el HTML | Resuelto | — | — |
| Medición desde el día 1 (inf. p.4-5, p.26) | La CSP ya permite GTM, GA4, Google Ads, Clarity, LinkedIn Insight, YouTube, Calendly y Google Calendar | Resuelto | — | Si Clau suma otra herramienta en GTM, hay que agregar su dominio. La CSP no corre etiquetas de "HTML personalizado": avisarle |
| **Search Console verificado** (inf. p.26) | El archivo `DOCS/wordpress-anterior/google9ffcbef7277c41a3.html` del WordPress no está en `public/`. Al reemplazar el WP, esa verificación se cae | **Falta** | `public/google9ffcbef7277c41a3.html` | Copiarlo tal cual a `public/`, o confirmar con Clau que la propiedad quedó verificada por DNS, como pide el informe |
| Confirmación al prospecto (emb. p.5) | `contact.php` no responde al remitente | Parcial | `public/api/contact.php` | Ver INSTITUCIONALES: primero el calendario y, si se demora, una respuesta automática corta |

## Fuera del código (nada se toca ni se publica sin aviso)

- **GPTBot recibe 429** en el CDN de Hostinger (inf. p.4). Al 22/10 seguía así: hay que desactivar el bloqueo de bots de IA en el panel.
- **Perfil de Google** (inf. p.4):
  - Enlace a la home.
  - Categoría de servicios informáticos.
  - Fotos.
  - Reseñas, a cargo de Laura.
  - Pasarme el link del perfil para `sameAs`.
- **Search Console por DNS** y envío del sitemap el día del lanzamiento (inf. p.26, p.29).
- **Wikidata, directorios y LinkedIn** (inf. p.19, p.21, p.29): Clutch, The Manifest, ensun, dir.ar, el "Acerca de" de la página de empresa y SIPRO/CESSI. Eso lo maneja Clau.
- **Dominio viejo** `intelihelp.com.ar`: figura en la base del WP (`fuentes-wordpress-db.md`). Si sigue siendo nuestro, va con una 301 a `https://www.intellihelp.tech/` desde el DNS o el hosting.
- **`soporte.intellihelp.tech`** con `noindex` si es solo para clientes (inf. p.27).
- **Blog en `/blog/`** con el mismo contenedor de GTM (inf. p.26). El link del footer sale cuando funcione.
- **Anuncios y LinkedIn:** cuando la web nueva esté publicada, las URLs finales tienen que ser las nuevas (`/servicios/outsourcing-y-service-desk/`, `/soluciones/seguridad/`, `/diagnostico/`) y no las viejas que redirigen.
- **Material de Intellihelp:**
  - Video de Carlos.
  - URL del calendario.
  - Fotos del equipo, la oficina y el edificio (kick. p.3).
  - 2 o 3 testimonios.
  - Duración y costo de la reunión.
  - Plazo de arranque.
  - Qué pasa al terminar el contrato.
  - Caso de Fortinet.
  - Decisión sobre el precio "desde".
- **Lighthouse móvil sobre producción**, con meta de 85 o más.
