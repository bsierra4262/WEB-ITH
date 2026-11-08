# Requisitos de marketing para la web nueva

Resumen de lo que piden estos documentos de `DOCS/diseno/`:

- `home-intellihelp-2026-10.pdf`: el diseño de la home.
- `DOCS/marketing/informe-visibilidad-web-ia-2026-10.pdf`: Claudio Cavezzali, 15/10/2026. Capítulos 2, 3, 4, 7 y 9.
- `DOCS/marketing/kickoff-plan-90-dias.pdf`: kickoff del 09/10/2026.
- La tarjeta de Trello "Estructura | Home".

Las casillas marcan qué está resuelto en el código. Lo que depende de Intellihelp está en la última sección.

## Objetivo

Sumar 5 clientes con abono recurrente: soporte, mesa de ayuda, outsourcing y mantenimiento. La web es lo primero, porque Google Ads y LinkedIn terminan en ella.

## Home (Trello + diseño)

- [ ] Humanizar la marca: equipo, oficina, edificio e historia de 14 años.
- [ ] Mostrar en la home los 3 servicios que más se venden y llevar a una sección o página con **todas** las soluciones y servicios.
- [ ] Mostrar a las empresas que nos eligieron: franja de logos debajo del titular, por sector.
- [ ] Reseñas de Google en la home cuando existan. Hoy la sección queda como `data-draft`.

## SXO: de la visita al contacto

- [ ] Propuesta de valor arriba que diga servicio, público y lugar.
- [ ] Botón "Agendá una reunión" y WhatsApp arriba.
- [ ] Un formulario corto (nombre, empresa, mail, teléfono, servicio) en la home y en cada servicio.
- [ ] WhatsApp flotante **a la derecha**, más chico, con mensaje prellenado según la página.
- [ ] Teléfono con clic para llamar.
- [ ] Un caso destacado por servicio y 2 o 3 testimonios con nombre y cargo.
- [ ] Equipo con foto y cargo.

## SEO técnico y on-page

- [ ] `lang="es-AR"`, sin hreflang hasta tener inglés real y sin detección automática de idioma.
- [ ] Título y meta descripción únicos por página, con marca, servicio y ciudad. Keyword de la home: "servicios informaticos" (390/mes). Secundarias: "servicios it para empresas", "empresas it argentina", "intellihelp".
- [ ] Un solo H1 con la keyword principal.
- [ ] Todo el contenido en texto, nada dentro de videos. Los logos de clientes también en texto (lista de sectores y clientes).
- [x] `robots.txt` con el sitemap declarado y **permiso explícito a los robots de IA**: GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User, PerplexityBot, Google-Extended, Applebot-Extended y Bingbot.
- [x] `sitemap.xml` del sitio. El blog de WordPress genera el suyo.
- [ ] Schema:
  - Organization + LocalBusiness: nombre, CUIT 30-71140975-7, dirección, teléfono, horarios, `sameAs` a LinkedIn y al perfil de Google.
  - Service.
  - FAQPage.
  - Person para los fundadores.
  - BreadcrumbList en las páginas internas.
- [x] `llms.txt` en la raíz con:
  - La descripción de la empresa.
  - **La aclaración del homónimo** IntelliHelp SpA (Chile, otra empresa).
  - Los servicios, los casos y el contacto.
- [x] Página 404 propia en español con enlaces a servicios y contacto.
- [ ] Copyright del año en curso.
- [ ] NAP idéntico en todo el sitio.
- [ ] Alt descriptivo en todas las imágenes.
- [x] Un solo salto de redirección a `https://www.intellihelp.tech/`.

## Velocidad

- [ ] Home de menos de 1,5 MB.
- [ ] LCP de menos de 2,5 s en celular.
- [ ] Lighthouse móvil de 85 o más. Hoy está en 62, con 7,6 s y 11 MB.
- [ ] Imágenes WebP o AVIF, sin videos de fondo y con caché activa.

## Medición desde el día 1

- [ ] GA4, Google Tag Manager, Microsoft Clarity y Search Console verificado por DNS.
- [ ] Conversiones como eventos de GA4: envío del formulario, clic en WhatsApp, clic en teléfono y clic en mail.
- [ ] Los accesos se dan a la cuenta de Clau (consultora de marketing). Los IDs se cargan en `src/data/site.json`.

## IA (GEO, AEO y AIO)

- [ ] FAQ con respuestas cortas y schema FAQPage. Preguntas que tiene que contestar la web:
  - ¿Cuántos empleados o PC tiene tu empresa? (para qué tamaño atendemos)
  - ¿Abono mensual o pago por visita? ¿Técnico fijo o a demanda?
  - ¿Qué SLA o tiempo de respuesta?
  - ¿Cuánto cuesta por usuario, por PC o por técnico dedicado?
  - ¿Cubren CABA, AMBA o el interior?
  - ¿Cumplen la Ley 25.326 de datos personales?
  - ¿Qué pasa al terminar el contrato?
- [ ] Modelo o rango de precio publicado, por ejemplo "abono mensual por puesto, desde X equipos".
- [ ] Una sección o página "Quiénes somos" que aclare que no somos la empresa chilena.

## Arquitectura (fase 1 = lanzamiento, día 36)

| Página | URL | Keyword principal |
|---|---|---|
| Home | `/` | servicios informaticos |
| Soluciones (índice) | `/soluciones/` | — |
| Seguridad | `/soluciones/seguridad/` | instalacion de camaras de seguridad (1.600) |
| Ciberseguridad | `/soluciones/ciberseguridad/` | ciberseguridad empresas |
| Redes indoor | `/soluciones/redes-indoor/` | cableado estructurado (480) |
| Redes outdoor (FTTH) | `/soluciones/redes-ftth/` | ftth (720) |
| Data Center | `/soluciones/data-center/` | data center (2.900) |
| Servicios (índice) | `/servicios/` | — |
| Outsourcing y Service Desk | `/servicios/outsourcing-y-service-desk/` | outsourcing it, service desk |
| Clientes y casos | `/clientes/` | — |
| Nosotros | `/nosotros/` | intellihelp (con aclaración del homónimo) |
| Contacto | `/contacto/` (**se mantiene**: la usa el perfil de Google) | intellihelp |
| Blog | `/blog/` (WordPress, mismo dominio, **no** en un subdominio) | — |

Fase 2 (días 45 a 75):

- Soluciones: Cloud, IoT, Acceso (CATV/PON/HFC) y Energías renovables.
- Servicios: Consultoría, Búsqueda de recursos, Capacitación, Desarrollo de apps, Automatización y Transformación digital.
- Sectores: público, seguros y bancos, salud y laboratorios.

Cada página de servicio lleva:

1. Una respuesta corta arriba, de 40 a 60 palabras.
2. Para qué tamaño de empresa.
3. Modalidad, SLA y horario.
4. Cobertura.
5. Modelo de precio.
6. Un caso real con las tecnologías usadas.
7. Una FAQ de 5 a 8 preguntas con schema.
8. Formulario y WhatsApp con un mensaje propio de esa página.

## Redirecciones 301 (capítulo 9)

| URL vieja | Destino |
|---|---|
| `/contacto/` · `/?page_id=32` | `/contacto/` (se mantiene) |
| `/servicios/` (+ `index.html`, `empresas.html`, `home.html`) · `/servici0s/` · `/servicios-antigua/` | `/servicios/` |
| `/outsourcing/` · `/outsourcing-bancos/` · `/webinar-claves-outsourcing-tecnologico-2022-yanina-brea/` | `/servicios/outsourcing-y-service-desk/` |
| `/soluciones/` · `/soluciones-antigua/` · `/soluciones-v1-antigua/` | `/soluciones/` |
| `/soluciones-cloud-huawei/` | `/soluciones/cloud/` |
| `/control-de-accesos/` · `/videoseguridad/` | `/soluciones/seguridad/` |
| `/clientes/` · `/clientes-antigua/` · `/history/primer-negocio/` | `/clientes/` |
| `/quienes-somos/` · `/partners-y-vendors/` | `/nosotros/` |
| `/busquedas/` y las entradas de empleo de 2022 | `/nosotros/trabaja-con-nosotros/` |
| `/novedades/` y las 2 notas de 2018 | `/blog/` |
| `/universidades/` | `/servicios/capacitacion/` |
| `/home-antigua/` · `/author/intelihelp/` · `/en/` y `/en/*` | `/` |
| `/wp-content/uploads/2019/07/ITH-servicios-digital.pdf` | PDF actualizado o `/servicios/` |
| `http://` y sin www | un solo salto a `https://www.intellihelp.tech/` |

Mientras no existan las páginas internas, cada destino apunta a la sección equivalente de la home.

- El subdominio `soporte.intellihelp.tech` (tickets) lleva `noindex` si es solo para clientes.
- **El .htaccess no tiene que interceptar `/blog/`**, que es del WordPress.

## Hostinger (fuera del código)

- [x] Los 404 del WordPress actual están corregidos. Verificado el 22/10/2026: `/`, `/contacto/`, `/servicios/`, `/clientes/`, `/quienes-somos/`, `/soluciones/`, `robots.txt` y `sitemap_index.xml` responden 200. Como esas URLs vuelven a estar vivas y Google las va a reindexar, **las 301 de arriba son obligatorias** el día que la web nueva reemplace al WordPress.
- [ ] Desactivar el bloqueo de bots de IA en el CDN. Verificado el 22/10/2026: GPTBot sigue recibiendo **429**.
- [ ] Perfil de Google:
  - Enlace a la home y no a `/contacto/` (404).
  - Categoría de servicios informáticos.
  - Fotos.
  - Reseñas, a cargo de Laura.

## Brief de Intellihelp (`DOCS/marketing/brief-intellihelp.pdf`): es la fuente oficial

Cuando el brief y el diseño o el informe no coinciden, **manda el brief**: lo completó la empresa.

**Qué hace.** Es una empresa de servicios tecnológicos para grandes clientes:

- Privados: corporaciones y empresas medianas y grandes. Pymes según el caso y el servicio.
- Públicos: organismos nacionales, provinciales y municipales.

La palabra que la define es **"Compromiso"**.

**Equipo (7 personas), cargos oficiales:**

| Persona | Cargo en el brief | En el diseño de la home |
|---|---|---|
| Carlos Baldelli | Presidente y socio | "CEO y dirección comercial" |
| Nicolás Baldelli | Director de Operaciones y socio | "Técnico y comercial" |
| Brian Sierra | Responsable de Servicio a Clientes | "Postventa", solo con el nombre |
| Alejandro Ayala | Responsable de Instalaciones y Post Venta | "Preventa e instalaciones", solo con el nombre |
| Laura Zaltron | Responsable de Marketing y Comunicaciones | "Preventa y postventa" (no coincide) |
| Lisandro Campos | Preventa y Servicios | no aparece |
| Raúl Nasif | Administración | no aparece |

La web usa nombre completo y cargo del brief. Las descripciones del diseño se conservan donde no contradicen el brief. Lo que falte o no coincida queda como `.nota`.

**Servicio de entrada:** video seguridad y control de acceso. Es el que más demanda trae, de pymes a grandes. **Para crecer** se priorizan los recurrentes:

- Outsourcing, con personal en nómina de ITH.
- Soporte técnico y mesa de ayuda (help desk).

**Catálogo completo.** Va a la sección o página de "todos los servicios".

- **Servicios** (los da el staff de ITH):
  - Outsourcing: mesa de ayuda, soporte técnico y service desk; TICS.
  - Reclutamiento y selección: soluciones técnicas llave en mano; recursos en nómina del cliente.
  - Automatización con IA: agente experto, automatización de procesos, bots de atención.
  - Desarrollo de aplicaciones: software factory, soluciones mobile, sistemas transaccionales, time & material.
  - Capacitación: training center, Intellihelp-Learning, acuerdos con universidades, talleres prácticos.
  - Búsqueda de recursos, incluida executive search.
  - Consultoría: transformación digital, procesos de negocio, gestión de proyectos PMI/PMO, calidad y certificación de procesos, planes de negocio, planes estratégicos, planes estratégicos de IT.
- **Soluciones** (integración de fabricantes, con ITH como único proveedor):
  - Inteligentes: energías renovables, IoT e I2oT, smart city.
  - Huawei: acceso (redes ópticas pasivas para empresas, ISP y MSO), networking, data center, storage y servidores, cloud, nube privada FusionCloud.
  - Hikvision: videovigilancia con IA y reconocimiento facial; biométricos (huella, palma, QR, facial, molinetes, barreras); control de accesos; integración HikCentral con sistemas de nómina.
  - Suprema: videovigilancia, biométricos, control de accesos, integración BioStar con nómina.
  - Dahua: video IoT inteligente, AI Powered Surveillance (WizMind), Efficient Meeting Rooms, control de accesos, integración con nómina.
  - Furukawa: Laserway, una red GPON para cableado estructurado.
  - Fortinet: redes seguras y ciberseguridad, incluida OT.

**Fabricantes (partners y certificaciones):** Huawei, Hikvision, Dahua, Suprema, Furukawa, Microsoft, Fortinet, Ubiquiti, Aruba, HP, Dell, Lenovo, APC, Cisco, Panduit, MikroTik, Eaton, SUSE, Red Hat, Comscore y Grandstream.

**Certificaciones:**

- En todos los partners.
- ITIL y Microsoft.

**Prueba para la web:**

- **Más de 40 licitaciones públicas** ganadas y ejecutadas.
- Referencias comerciales.

**Clientes:**

- Principales: Gobierno de la Ciudad de Buenos Aires, grupo Lojack/Strix/Autos del Mar/Torres del Sol, Superintendencia de Riesgos del Trabajo (SRT) y **Administración de Parques Nacionales** (no está en los logos del diseño).
- **Ojo, clientes perdidos en los últimos 2 años:**
  - GCBA, por cambio de autoridades.
  - **El Cronista, que se fue disconforme.**
  - Gendarmería, por cambio de autoridades.
  - Correo Argentino, que internalizó el servicio.

  Hay que confirmar con Carlos si se siguen mostrando sus logos y el hito 2021 "Seguridad para un diario: El Cronista". El caso más delicado es El Cronista.
- Todos los clientes son de Buenos Aires, pero la cobertura llega al interior y a países limítrofes.

**Cómo deciden los clientes:**

- Los grandes deciden por CIO o gerente de tecnología, con procesos largos que arrancan con los pliegos.
- El resto decide por trato con el dueño o el gerente, en unos 3 meses.
- Llaman por proyectos o porque están disconformes con su proveedor actual.
- Se ganan las licitaciones por prestación y precio.

**Promesa:**

- Tiempos de respuesta e inmediatez.
- Conocimiento.
- Precios competitivos.
- Acompañamiento.
- Relaciones de largo plazo, cumpliendo lo comprometido.

**Competidores:**

- Huawei: DataStar, SystemNet, Datco, Sonda, Tecnored, IPLAN, BGH, Logicalis, IT Partners, Znet.
- Seguridad: Dyna Group, Domonet, Tech Security, Sekuron, Redvision, Intelektron.
- Outsourcing: Stefanini, Manpower, Teleperformance, Baufest, Novatium.
- Mesa de ayuda: PwC, Sonda, BGH Tech Partner, Exo, Grupo Datco, Axxon y otros.

## Decisiones tomadas (22/10/2026)

- **Regla de diseño:**
  - Del PDF de marketing salen las estructuras y los diseños de cada elemento: layout, tarjetas, íconos (por ejemplo el logo de WhatsApp), placeholders y filas de contacto.
  - Del código original (`DOCS/diseno/Home-html-referencia`) salen solo las animaciones (fondo, hover, apariciones, contadores, anillos), los colores y el énfasis de cada elemento: header y footer #333, CTA lima, acentos lima sobre carbón, cierre carbón.
  - La "paleta estricta" quedó descartada.
- **No se publica en Hostinger antes del lanzamiento.** Todo se prueba en local.
- **Presencia nacional:** se mantiene el mapa interactivo y no la grilla del PDF.
- **Alcance del lanzamiento:** la home más las páginas de fase 1 del informe:
  - Soluciones: índice, Seguridad, Ciberseguridad, Redes indoor, Redes FTTH y Data Center.
  - Servicios: índice y Outsourcing y Service Desk.
  - Clientes, Nosotros, Contacto y una 404 propia.
  - Lo que falte de texto queda como `.nota` para Claudio.
- **NAP:** se usa la propuesta del informe.
  - Fijo: +54 11 7700-6868.
  - WhatsApp: +54 9 11 5027-4827.
  - Dirección: Av. Dorrego 1789, piso 6, oficina 604, C1414CKM, CABA.
  - Mail: info@intellihelp.tech.
  - Todo vive en `src/data/site.json`.

## A definir por Intellihelp

1. **NAP.** El informe propone:
   - Dirección: "Intellihelp · Av. Dorrego 1789, piso 6, oficina 604, C1414CKM, CABA".
   - Fijo: +54 11 7700-6868.
   - WhatsApp: +54 9 11 5027-4827.
   - Mail comercial a definir (info@ o soporte@).
   - Falta decidir si se da de baja el 011 15-3230-8355.
2. **Foco de la web.** La propuesta es abono (Outsourcing + Service Desk, soporte y mantenimiento) primero, y Seguridad, Ciberseguridad, Redes y Data Center como segunda línea. También hay que decidir si sigue la línea para pymes y particulares.
3. Modelo o rango de precio publicable.
4. Logos y casos que se pueden mostrar, y 2 o 3 testimonios con nombre y cargo.
5. Las 10 a 15 provincias donde se opera.
6. Los años de trayectoria (se usa 14).
7. Los IDs de GA4, GTM y Clarity.
8. Los horarios de atención para el schema.
