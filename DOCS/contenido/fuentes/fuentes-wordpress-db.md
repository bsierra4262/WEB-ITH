# Fuentes: base de datos del WordPress viejo (backup .wpress, 19-03-2024)

**Fuente única de este documento:** `DOCS/wordpress-anterior/wp-content/ai1wm-backups/www.intellihelp.tech-20240319-154406-94hwua.wpress` (All-in-One WP Migration, WordPress 6.0.7, tema BeTheme + Elementor Pro + WPML ES/EN).
Datos tomados de `database.sql` (247 MB), extraído del backup.
Tablas leídas: `posts`, `postmeta` (incluye `_elementor_data`), `options`, `terms`, `term_taxonomy`, `term_relationships` e `icl_translations`.
Las cifras del home estaban **dentro de dos videos** (`DOCS/wordpress-anterior/wp-content/uploads/2023/03/CONTADOR-1.mp4` y `MAPAMUNDI.mp4`), no en texto; las tomé de ahí.

Convención de fuente: `posts#ID` = fila de `wp_posts` con ese ID; `elementor#ID` = `postmeta._elementor_data` de ese post; `rev#ID` = revisión vieja; `options.X` = fila de `wp_options`.
**Vigencia:** el sitio se editó por última vez en marzo de 2024. Todo lo que diga "actual" significa "vigente en marzo de 2024". Hay que confirmar con ITH antes de publicarlo.

---

## 0. Mapa del sitio viejo (qué páginas existían)

Menú principal (`nav_menu` "Principal" / "Main", ES/EN): Quienes Somos · Servicios · Soluciones · Clientes · Partners y Vendors · Universidades · Búsquedas · Novedades · Contacto.

| Página | ID ES / EN | Estado | Última versión |
|---|---|---|---|
| Home | 3743 / 4222 | publicada | mar-2023 (logos actualizados en mar-2024) |
| Quienes Somos | 1770 / 3441 | publicada | oct-2022 |
| Servicios | 3280 / 3542 | publicada | ene-2023 |
| Soluciones | 3204 / 3564 | publicada | ene-2023 |
| Clientes | 2733 / 3548 | publicada | ene-2023, logos mar-2024 |
| Partners y Vendors | 2093 / 3427 | publicada | dic-2022 |
| Contacto | 32 / 3558 | publicada | mar-2024 |
| Universidades | 462 / 3581 | publicada | 2019 |
| Búsquedas | 28 / 4229 | publicada | iframe de HiringRoom |
| Landings | Outsourcing 869, Outsourcing Bancos 1661, Videoseguridad 1188, Control de accesos 1245, Soluciones Cloud Huawei 622, Webinar 1283 | publicadas | 2020-2022 |
| Borradores viejos | Servicios-Antigua 20, Quienes Somos-Antigua 18, Partners-Antigua 26 | draft | 2018, con mucho texto propio |

Custom post types con datos: `history_post` (9 hitos, 2018), `client` (33 clientes), `wpl_logo_carousel` (9), `dlm_download` (PDFs de casos), `post` (13 avisos de búsqueda + 2 notas).

---

## 1. Empresa: identidad

- **Nombre:** INTELLIHELP; sigla ITH (`options.blogname`; los textos usan "ITH" todo el tiempo).
- **Tagline oficial del sitio:** "Tecnología que genera valor" (`options.blogdescription`; también es el H1 del home, posts#3743).
- **Meta description del home viejo (Yoast):** "Prestación de soluciones de alto desempeño tecnológico desarrolladas por equipos de profesionales destacados en cada disciplina." (posts#16, `_yoast_wpseo_metadesc`).
- **Capital nacional:** "De capital de origen nacional, ITH está liderada por profesionales con una amplia trayectoria y conocimiento en el mercado de la Tecnología." (posts#18, borrador de 2018).
- **Cómo se definen (2022):** "Empresa de Servicios Tecnológicos", "Empresa Innovadora con amplia experiencia en la gestión de proyectos tecnológicos para empresas privadas y organismos de gobierno". Su objetivo es convertirse en "Integrador Estratégico con capacidad de resolver todo el ciclo de negocio" (posts#1770). En la revisión de oct-2022 (rev#1871) decía "Somos una **empresa joven**…", y después lo cambiaron por "Empresa Innovadora".
- **Origen del nombre:** "Intellihelp representa nuestra vocación de ayuda y actitud innovadora presentes en cada servicio prestado" (home y Quienes Somos).
- **Dominio anterior:** intelihelp.com.ar (con una sola "l"), que figura como perfil de Google Search Console en `options.wpseo-gsc`. La página de Facebook también usa una sola "l": facebook.com/Intelihelp/.
- **Diseño del sitio viejo:** Barco Design Studio (footer, elementor#1579).

### Misión, visión y valores (posts#1770; los mismos en posts#18 de 2018)
- Misión: desarrollar soluciones innovadoras que aporten valor y permitan optimizar los procesos de negocio de los clientes.
- Visión: destacarse por la calidad de los servicios, la gestión de talentos y la cercanía con el cliente.
- Valores: la comunicación, equipos motivados y la calidad humana.

### "Por qué elegirnos" / puntos fuertes (aparecen en el home, en Quienes Somos y en las landings)
- Home 2023 (posts#3743): Rapidez, Conocimiento, Flexibilidad, Eficacia ("mejor ecuación costo beneficio"), Experiencia y **Alianzas estratégicas**.
- Home 2018 (posts#16): en lugar de Experiencia y Alianzas tenía **Profesionales** ("adecuados para cada proyecto") y **Motivación** ("por los nuevos desafíos, los proyectos exigentes").
- Quienes Somos: "Por qué elegirnos" (Rapidez, Conocimiento, Eficacia, Flexibilidad) y "Puntos fuertes" (Experiencia, Know How, Eficacia, Flexibilidad).
- Landing Outsourcing (posts#869), diferenciales concretos: calidad del proceso de selección, tiempos de búsqueda, capacitación continua en habilidades duras y blandas, cuidado de los recursos asignados y tarifas competitivas.
- Landing Bancos (posts#1661): "Más de diez años trabajando para el segmento bancario y financiero" y "experiencia en trabajar con los Bancos más importantes de Argentina".

---

## 2. Cifras (con su fuente)

| Cifra | Dónde | Vigencia |
|---|---|---|
| **+60 proyectos implementados exitosamente** | video del contador del home (`uploads/2023/03/CONTADOR-1.mp4` y `contador.mp4`, último cuadro) | mar-2023 |
| **+13 años de experiencia** | mismo video | mar-2023. Contando desde 2010, en 2026 serían 16 |
| "12 años de experiencia" | Quienes Somos, encabezado de la historia (posts#1770) | oct-2022 |
| Fundación: **10 de marzo de 2010** | Quienes Somos (posts#1770, ES y EN) y history_post#202 ("2010") | dato fijo |
| AGIP: red de FO para conectar **33 oficinas**, soporte 24/7 de niveles 1 y 2 | timeline 2017 (posts#1770) | 2017 |
| Plan Sarmiento: red de FO de **~300 puntos** en Zona 1 de CABA, en tiempo récord | caso "Plan Sarmiento" (posts#2733) | 2017 |
| GPON Huawei: **1.000 locaciones** en topología estrella en **4 meses** | caso "GPON Network" (posts#2733) | ~2017-2018 |
| ASI: servicio que pasó de 5x8 a **7x24**, con respuesta máxima de **2 horas** ante incidentes | casos ASI (posts#2733) | 2013 en adelante |
| E-learning: **+50 cursos y talleres** (otra versión: "+50 contenidos y ambientes de capacitación") | timeline 2020 (posts#1770; rev#1871) | 2020 |
| Outsourcing: "Más de 2 años y 30 clientes nos respaldan" (ES) / "More than 30 clients in almost 3 years of work" (EN) | Partners, flip-box "Servicios de Outsourcing" (posts#2093 / posts#3427) | dic-2022; ver contradicciones |
| Banca: "Más de diez años trabajando para el segmento bancario y financiero" | posts#1661 | ago-2022 |

---

## 3. Historia año por año (Quienes Somos 2022, posts#1770; confirmada en la versión EN posts#3441)

- **2010**: el 10 de marzo se funda la empresa.
- **2012**: primeras oficinas en Quartier Madero, Puerto Madero. *(history_post#204 dice 2013; ver contradicciones.)*
- **2013**: primer caso de éxito con la Agencia de Sistemas de Información (ASI) del GCBA: **outsourcing de mantenimiento de plataformas**.
- **2015**: segundo caso con ASI-GCBA: **instalación y tendido de fibra óptica en las líneas B y C de subte**. *(history_post#205 dice 2016; en Clientes el caso se llama "Red de fibra líneas de subtes C y E".)*
- **2016**: **Gold Partner de HUAWEI** "para la comercialización de todas sus soluciones".
- **2017**:
  - Nueva unidad de negocio de **IoT e IIoT**.
  - **AGIP**: red de fibra óptica para conectar 33 oficinas, con mantenimiento correctivo y preventivo y servicio 24/7 de niveles 1 y 2.
  - **Senado de la Nación**: solución de servidores on-premise con tecnología Huawei.
  - **Cablevisión-FiberCorp**: consultoría para implementar OpenStack.
  - **Sedronar**: solución de storage Huawei (OceanStor 2200 V3).
  - Según los history_post de 2018 también son de 2017 la **consultoría para CAME** y el **Plan Sarmiento**, que conectó escuelas de CABA con FTTH y GPON.
- **2018**:
  - **Ministerio de Educación del GCBA**: prototipo IoT para medir variables en escuelas de CABA.
  - **Gold Partner de Hikvision** (soluciones de seguridad).
  - **CAME**: app mobile para sus iniciativas de capacitación a distancia.
  - **ASI-GCBA**: mantenimiento correctivo y preventivo 7x24 de la red de conectividad de escuelas, hospitales y comisarías.
  - **Segundas oficinas**: "duplicamos espacio físico" en el Edificio Mirabilia, Palermo Hollywood.
- **2019**:
  - Unidad de negocio de **Energías Renovables** con tecnología Huawei.
  - **Bodega en Valle de Uco, Mendoza**: solución solar on-grid.
  - Acuerdo con el **ITBA** (página Universidades, posts#462, creada en mar-2019).
- **2020**:
  - Nueva unidad de negocio de **Soluciones Cloud Huawei** (landing posts#622, sep-2020).
  - **Nueva plataforma de e-learning** con +50 cursos y talleres. El título de ese hito quedó mal copiado ("Desarrollamos la unidad de negocios de Energías Renovables").
- **2021**: **El Cronista Comercial**, solución integral de seguridad con Hikvision.
- **2022**: **LoJack**, mesa de ayuda en las oficinas del cliente. **Pfizer**, outsourcing de TI.
- **2023-2024 (no está en el timeline; sale de los logos)**: suman logos de SRT, Parques Nacionales, Correo Argentino, Gendarmería Nacional, Nación Seguros, Laboratorio Bagó, Medifé y otros (ver sección 6). La última modificación fue en mar-2024.

Versión anterior de la historia (history_post de 2018, IDs 202-212 y 498): Fundación 2010 · Primer negocio 2013 ("Outsourcing de mantenimiento de plataformas ASI") · Primeras oficinas 2013 · Segundo negocio 2016 ("Instalación y tendido de FO en línea de subterráneo B y C") · Nuevas oficinas Puerto Madero 2016 · Negocio Sedronar 2017 · Consultoría CAME 2017 · Plan Sarmiento 2017 · Mudanza a nuevas oficinas 2018.

---

## 4. Servicios (lo que ITH hace con su propia gente)

### Página Servicios 2023 (posts#3280)
- **Servicios de Outsourcing**: outsourcing de personal de TI, desarrollo de aplicaciones, consultorías, Service Desk y búsqueda de personal.
  - Diferenciales: proceso de selección depurado y completo, con analistas en psicodiagnóstico laboral (la landing de bancos agrega "y presencial"); inducción del candidato en la empresa del cliente; programa de capacitación continua.
- **Búsqueda de recursos**: búsqueda de personal, búsqueda de ejecutivos y assessment centers.
- **Capacitación**.
- **Consultoría**: estándares ITIL, metodologías ágiles, COBIS-Calidad y procesos. *(Dice "COBIS"; probablemente quisieron poner COBIT.)*
- **Desarrollo de Apps**: tuning, arquitectura TI, best practices, capacitaciones y mentoring, auditorías y métricas.
- Descargables: Presentación institucional, Guía de servicios y Brochure de outsourcing (`uploads/2021/11/ith-brochure-outsourcing.pdf`, `uploads/2022/12/intellihelp-servicio-de-outsourcing.pdf`).

### Texto propio y detallado de 2018 (borrador Servicios-Antigua, posts#20). Es la mejor fuente de texto "de la casa".
- **Outsourcing**: arman equipos de profesionales TIC y aportan supervisión, control y espacio físico si hace falta, de forma "cross" a los distintos estándares. Cubren todo el proceso: relevamiento, implementación y mantenimiento correctivo y preventivo. Cuando su gente se integra al equipo del cliente, programan actividades con los líderes para acompañar y contener.
- **Service Desk**: outsourcing de mesa de ayuda y soporte de infraestructura con recursos por nivel de atención. Puede ser llave en mano, con SLAs y OLAs, herramientas, espacio físico y consultoría ITIL. Se presta en las oficinas del cliente o en las de ITH.
- **Desarrollo**:
  - Sistemas en tiempo real para alto volumen de transacciones financieras: sistemas "Postnet" y software a nivel capa de red para las tramas transaccionales, con pruebas de estrés.
  - Apps mobile: PDAs de recolección de datos en la industria energética, control de inventario y stock, apps de consulta y dashboards para tablets.
  - Software a medida para alimentos, laboratorios, seguros, medios, finanzas y energía.
  - Modalidad "Software factory" de esfuerzo continuo.
- **Modalidades de contratación** (pestañas): soluciones técnicas llave en mano, recursos en nómina del cliente, Time & Material, coaching proactivo y Service Desk.
- **Capacitación**: plataforma propia de e-learning **ITH-Learn**, contenidos presenciales y virtuales, trabajo con universidades e instituciones que certifican los cursos, y talleres prácticos (transferencia de conocimiento, nuevas tecnologías, team building).
- **Búsqueda**: "procesos depurados y certificados", executive search y assessment centers.
- **Consultoría**: procesos de negocio, gestión de proyectos PMI/PMO, planes de negocio, planes estratégicos y planes estratégicos de IT.

### Tecnologías que nombran (Partners, "Nuestras tecnologías", posts#2093)
Microsoft Partner, Azure, Unity, Android, Visual Studio, Xamarin, Power BI, TFS, Office, SharePoint, Vuforia, Node, SQL Server, GNU/Linux, Windows y Apple.
Los avisos de búsqueda de 2022 (posts#1324-1468) piden Java (Spring Boot), Angular, .NET, Node, Android, iOS, BI y QA funcional, para un cliente fintech de pagos y cobranzas.
Flip-box: "Junto con nuestra **coding factory** y de la mano de MICROSOFT, integramos soluciones de software…".

---

## 5. Soluciones (integración con fabricantes)

Página Soluciones 2023 (posts#3204):
- **Huawei**: redes empresariales (switches, routers, WLAN, seguridad), redes empresariales ópticas (OptiX), almacenamiento (OceanStor), redes inalámbricas (eLTE) y Huawei Cloud.
  - Los textos de detalle (elementor_library 3216-3235) son **marketing de Huawei traducido**, no de ITH. No conviene reutilizarlos.
  - Texto ITH: "ofrecemos una combinación ganadora de tecnología de vanguardia y experiencia en implementación…".
- **Seguridad con Hikvision**: control de acceso biométrico y convencional, control de temperatura y uso de barbijo, videovigilancia IP, seguridad con drones, cercos perimetrales, tótems, reconocimiento facial y de patentes con IA, parking inteligente, portería para consorcios y lectores de rayos X para detectar metales y armas.
- **IoT**: integración con asistentes virtuales (Siri, Alexa, Google, Cortana), hardware y software en la nube, protocolos WiFi, LoRa/LoRaWAN, Bluetooth y TCP/IP, plataforma cloud con indicadores en tiempo real. El partner es **ITOKII** (posts#2093).
- **Redes FTTH**: mayor capacidad, inmunes a interferencias, más seguras y con bajo mantenimiento. Experiencia GPON/FTTH+ "con el respaldo del fabricante".
- **Energías renovables**: solar autónoma llave en mano, on-grid, off-grid e híbridos; Huawei Fusion Module 5000 (datacenter modular); "instaladas en cualquier lugar del país"; asesoramiento en trámites de subsidios.
- Guías descargables: Eficiencia energética, Seguridad/video control y Videoseguridad (`uploads/2022/06/intellihelp-video-seguridad.pdf`, `uploads/2022/07/intellihelp-control-de-acceso.pdf`).
- **Landing Videoseguridad** (posts#1188): "nos encargamos de todo": proveen cámaras, NVR, switch y cableado, instalan, configuran y capacitan al personal. Usan **HikCentral**. Casos: El Cronista y Universidad (Nacional) del Litoral.
- **Landing Control de accesos** (posts#1245): reconocimiento facial "contactless" con cámaras duales antifoto, hasta 20.000 imágenes y registro por foto o USB.
- **Landing Cloud Huawei** (posts#622, 2020): pago por uso, baja latencia, soporte en español, data center local y cumplimiento de la legislación local. La cifra "67% para 2021" es externa y ya está vencida.
- Esquema de 2018 (posts#26): Sector Público (GPON, LTE, nube, Smart Cities) y Enterprise (switches, routers, WLAN, servers, storage, cloud, data center energy).

---

## 6. Clientes y sectores

### Logos del carrusel del home y de Clientes (elementor#3743 y #2733, actualizados en mar-2024)
- **Gobierno y sector público**: Gobierno de la Ciudad de Buenos Aires (Buenos Aires Ciudad), ASI-GCBA, Ministerio de Educación GCBA, Ministerio de Salud GCBA, Ministerio de Cultura GCBA, BA Salud, Boletín Oficial, AGIP, Senado de la Nación, Sedronar, Télam, SRT (Superintendencia de Riesgos del Trabajo), APN (Administración de Parques Nacionales), Correo Argentino, Gendarmería Nacional, Museo Moderno y AR (sin identificar).
- **Salud, laboratorios y obras sociales**: Pfizer, Laboratorio Bagó, Medifé, Avalian, OSDIPP, Reckitt Benckiser y ASE Nacional.
- **Finanzas y seguros**: Nación Seguros, Universal Credit, Sistran y Gestión Compartida.
- **Telecomunicaciones, medios y tecnología**: Huawei, Cablevisión-Fibertel, Global Hitss, El Cronista, Ituran, LoJack, Myntec, Strix, Sophenia y Beilox.
- **Industria, consumo y otros**: Grupo Libertad, Petro Pack, Spec Chem, Los Cardales, Los Noques, Eve Joyerías, Gemez, Ayassa Fombella, AAG y CAME.

El CPT `client` (33 entradas, 2018-2023) coincide con esta lista. Las dos "client-types" (01 y 02) son solo dos filas del carrusel, no sectores.

### Casos de éxito con detalle (Clientes, posts#2733; los títulos de las pestañas salen del shortcode)
1. **Consultoría en gestión de sistemas operativos** (ASI-GCBA): instalación, administración, monitoreo, parches y documentación. Se pasó de 5x8 a 7x24, con respuesta máxima de 2 h. Tecnologías: VMware ESX/vCenter, Linux, zLinux/zVM y Windows Server 2003/2008. Logro: menos incidentes y mejor tiempo de respuesta.
2. **Administración de bases de datos** (ASI-GCBA): monitoreo, backup, tuning y KPIs. Tecnologías: Oracle Database 12c, Secure Backup, ZDLRA, RAC, Active Data Guard y GoldenGate.
3. **Administración TSM/backup** (ASI-GCBA): storage high-end Hitachi/IBM, IBM Tivoli Storage Manager 5.x/6.x, IBM TS3500 y VTL, pruebas periódicas de recupero.
4. **Cierre de anillo de FO** (ASI-GCBA): conectar dependencias críticas como el Cementerio de la Recoleta y el SAME. Logro: "en tiempo récord, entregando el final de obra en forma anticipada", con presupuesto acotado. Usaron FO monomodo de 12, 24 y 48 hilos.
5. **Plan Sarmiento** (ASI-GCBA): FO a establecimientos de Educación, Justicia y Seguridad y Salud en la Zona 1 de CABA, con unos 300 puntos en tiempo récord.
6. **Dependencias AGIP** (ASI-GCBA): conectar a la red de FO del GCBA las dependencias donde se prestan servicios de AGIP, con mantenimiento correctivo y preventivo por 24 meses.
7. **GPON Network** (ASI-GCBA): GPON Huawei para todos los establecimientos educativos, de salud y de seguridad de la Ciudad; 1.000 locaciones en estrella en 4 meses. Equipos: ONT HG8245H y OLT SmartAX MA5608T (el sitio dice "AXNA5608T").
8. **Anillo**: cierres de anillo en varios puntos, nuevos vínculos de gran capacidad, puesta en valor de tramos y relevamiento de la red del GCBA.
9. **Sedronar**: storage Huawei OceanStor 2200 V3 ("OceanStore" en el sitio), primera vez que se implementaba ese estándar en el organismo.

### Casos que solo aparecen en landings y PDFs descargables (`dlm_download`)
- Huawei Argentina: "Outsourcing de servicios de gestión técnica de negocios" (`uploads/2021/10/ith-caso-de-exito-huawei.pdf`).
- Pfizer: outsourcing de TI. MSD (Merck Sharp & Dohme): outsourcing de mesa de ayuda TI. Aparecen como "Laboratorio internacional" (posts#869; `uploads/2022/11/ith-casos-de-exito-2022-laboratorio.pdf`).
- "Banco internacional": outsourcing de TI. "Banco nacional": búsqueda de recursos IT (posts#1661; `uploads/2022/08/ith-casos-de-exito-2022.pdf`).
- El Cronista y Universidad del Litoral: videoseguridad (`uploads/2022/02/…_VIDEOSEG.pdf`).
- Cablevisión-FiberCorp (OpenStack), Senado (servidores Huawei), CAME (app mobile), Ministerio de Educación (IoT) y Bodega de Valle de Uco (solar on-grid) figuran solo en el timeline.

---

## 7. Partners y vendors (posts#2093, dic-2022 / ene-2023)

- **Galería de socios (29)**: Huawei, Microsoft, Hewlett Packard Enterprise, Lenovo, Dell, HP, Intel, Samsung, Cisco, Solution Box, Hikvision, SUSE, Ubiquiti, Grandstream, Bring, Multitech, Security One, Furukawa, Clean Energy, FIESA, Aruba, ITOKII, APC, Efergia, Panduit, Tecnocode, Apple, Digifort y Selnet.
- **Footer "Vendors"** (los principales): Huawei, ITOKII, Hikvision, Grandstream, Dell, Cisco y Microsoft.
- **Categorías formales**: Gold Partner de Huawei (2016) y Gold Partner de Hikvision (2018), ambas en el timeline. "Microsoft Partner" aparece como logo, sin nivel.
- Textos de las flip-box:
  - Huawei acceso/FTTH: "Poseemos la experiencia y el respaldo del fabricante para desarrollar soluciones GPON y redes FTTH+".
  - Conectividad: routers, switches y APs Huawei.
  - Energía solar: Huawei FusionSolar.
  - IoT: ITOKII.
  - Videoseguridad y control de acceso: Hikvision.

---

## 8. Equipo, cultura y talento

- No hay página de equipo ni nombres de directivos en la base. La única persona nombrada en contenido público es **Yanina Brea**, que dio el webinar "Claves para el Outsourcing Tecnológico en 2022" (slug de posts#1283 y mail del formulario 1291). La base no dice su cargo.
- **Búsquedas** (posts#28): "Nuestros empleados cuentan con un plan de carrera individualizado con un sistema de movilidad entre distintos proyectos y clientes… seguimiento individualizado, a través de reuniones mensuales de desempeño". Las vacantes se publicaban con un iframe de HiringRoom (`hiringroom.com/.../intellihelp`).
- **Universidades** (posts#462, 2019): acuerdo con el **ITBA**. ITH patrocina a estudiantes de la Licenciatura en Administración y Sistemas próximos a recibirse y colabora con sus tesis.
- **Código de Ética** (posts#1770 y `uploads/2022/10/codigo-de-etica-cb.pdf`): respeto y dignidad, cuidado del ambiente y relaciones comerciales sin corrupción. Trabaja 14 criterios: trabajo infantil, trabajo forzoso, acoso, discriminación, libertad de asociación, negociación colectiva, jornada, remuneración, higiene, salud y seguridad, corrupción, lavado de activos, ambiente y protección animal.
- Los beneficios de los avisos de 2022 (100% remoto, OSDE 210, Udemy, etc.) son **del cliente fintech**, no de ITH. No usarlos como beneficios de ITH.

---

## 9. Presencia y regiones

- **Oficinas en CABA**:
  - 2012-2013: Quartier Madero, Puerto Madero.
  - 2018 (dirección en el sitio): Azopardo 770, piso 10, of. 7 (Contacto, revisiones de feb-abr 2018).
  - Desde mar-2019 hasta mar-2024: **Dorrego 1789, piso 6, of. 604**, que corresponde a las "segundas oficinas" del Edificio Mirabilia en Palermo Hollywood.
- **"Regiones / Intellihelp global"** (home 2023): el video `MAPAMUNDI.mp4` marca 4 pines sin rótulo: sur de América del Norte (EE.UU./México), Argentina (Buenos Aires), península ibérica y Australia. **La base no tiene texto que nombre esos países**, así que hay que confirmarlos con ITH.
- **Alcance nacional en energía**: "instaladas en cualquier lugar del país" (Soluciones). El caso solar fue en Mendoza y el de videoseguridad en la Universidad del Litoral (Santa Fe).

---

## 10. Contacto (vigente a mar-2024)

- Teléfono: **+54 11 7700-6868** (Contacto ES/EN, actualizado el 04-03-2024). Antes figuraban +54 11 3986-0462 (2019-2023) y +54 11 5769-0543 (mar-2019).
- WhatsApp (plugin Click to Chat, `options.ht_ctc_chat_options`): **+54 9 11 5027-4827**, con el mensaje "Hola!, quisiera consultar por {title}".
- Mails: info@intellihelp.tech, rrhh@intellihelp.tech (footer). Todos los formularios llegan a contactoweb@intellihelp.tech.
- Redes: linkedin.com/company/intellihelp y facebook.com/Intelihelp/.
- Formularios que había: Contacto (nombre, organización, mail, consulta), "Dejanos tu CV" (PDF/DOC/JPG hasta 5 MB), Partners (incluye "solución/producto de interés"), landing Cloud y Webinars.

---

## 11. Contradicciones e inconsistencias

1. **Primeras oficinas**: 2012 en Quienes Somos 2022 y 2013 en history_post#204 (2018). Además, history_post#206 habla de "Nuevas Oficinas Puerto Madero" en 2016.
2. **Fibra en subte**: 2015 en el timeline 2022 y 2016 en history_post#205. Las líneas también cambian: "B y C" en el timeline y "C y E" en el título del caso en Clientes. Encima, el texto de esa pestaña describe el cierre del anillo (Recoleta y SAME), no el subte.
3. **Segundas oficinas / mudanza**: 2018 en el timeline. history_post#498 dice 2018, pero su fecha interna es 15-11-2017. La dirección Dorrego aparece en el sitio recién en mar-2019.
4. **Años de experiencia**: "12 años" (oct-2022) y "+13" (video de mar-2023). Contando desde 2010, en 2026 son 16. Hay que recalcular, no copiar.
5. **Outsourcing**: "Más de 2 años y 30 clientes" (ES) contra "More than 30 clients in almost 3 years" (EN). Una revisión anterior (rev#2168) decía "Más de 2 años y más de 30 clientes". Se refiere a la línea de outsourcing, no a toda la empresa. Contrasta con "+10 años en banca" (posts#1661) y con el primer outsourcing en 2013.
6. **Hito 2020 mal titulado**: el ítem de e-learning dice "Desarrollamos la unidad de negocios de Energías Renovables". Es un error de copy; el hito real es la plataforma de e-learning (+50 cursos y talleres, o "+50 contenidos" según la versión).
7. **Erratas en nombres**: "COBIS" (probablemente COBIT), "OceanStore" (es OceanStor), "AXNA5608T" (es MA5608T), "Merk Sharp & Dhome" (es Merck Sharp & Dohme), "Hikvison". ASI aparece como "Agencia de Sistemas Informáticos" en el timeline y como "Agencia de Sistemas de Información" en los casos. El nombre oficial es el segundo.
8. **Dominio y marca**: intellihelp.tech (actual) frente a intelihelp.com.ar y facebook.com/Intelihelp (con una "l").
9. **"Empresa joven" contra "Empresa innovadora"**: cambió en oct-2022.
10. **Regiones**: el mapa del home sugiere presencia internacional (4 pines), pero ningún texto la nombra ni la sostiene.

---

## 12. Ideas para reescribir (no literal), apoyadas en datos reales

- **Hero**: en lugar de "soluciones de alto desempeño", algo como "Desde 2010 armamos equipos y redes que sostienen servicios críticos: de las escuelas y hospitales de la Ciudad a la mesa de ayuda de laboratorios globales". Se apoya en los casos ASI/GCBA y en Pfizer/MSD.
- **Prueba social con números verificables**: fundada en 2010; +60 proyectos (2023); 1.000 sitios GPON en 4 meses; ~300 puntos de FO en tiempo récord; soporte 7x24 con respuesta máxima de 2 h; Gold Partner de Huawei y de Hikvision.
- **Historia en 5 o 6 hitos** (no 20): 2010 fundación → 2013 primer outsourcing para el GCBA → 2015-2017 fibra (subte, AGIP, Plan Sarmiento, GPON) → 2016 y 2018 Gold Partner de Huawei y Hikvision → 2019-2020 energía solar, cloud y e-learning → 2021-2024 seguridad (El Cronista), mesa de ayuda (LoJack, MSD) y nuevos clientes nacionales (Correo Argentino, SRT, Parques Nacionales, Gendarmería, Bagó, Medifé).
- **Servicios contados como "cómo trabajamos"**: selección con psicodiagnóstico laboral, inducción en la empresa del cliente, capacitación continua (ITH-Learn), seguimiento mensual de desempeño y movilidad entre proyectos. Es concreto y es de ellos.
- **Sectores** a partir de los logos reales: gobierno (Ciudad y Nación), salud y laboratorios, banca y seguros, telecomunicaciones y medios, industria.
- **Evitar**: los textos de Huawei de las fichas de soluciones, la estadística del 67% de cloud, los beneficios de los avisos (son del cliente) y cualquier país del mapa sin confirmar.
