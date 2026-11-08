# Fuentes: brief, informe, kickoff y la home nueva actual

Relevamiento del 22/10/2026 para reescribir los textos de la home con datos reales.

**Regla de marketing:** el PDF de diseño (`home-intellihelp-2026-10.pdf`) define la estructura, no los textos. Hoy la home copia casi palabra por palabra ese PDF (ver la sección 3). Cada texto nuevo tiene que salir de un dato real con fuente.

## Fuentes y jerarquía

| Sigla | Archivo | Qué es | Fecha | Peso |
|---|---|---|---|---|
| **BRIEF** | `DOCS/marketing/brief-intellihelp.pdf` | Lo completó Intellihelp (Carlos, Nicolás y Laura) | ~14/10/2026 | **Manda** sobre todo lo demás |
| **INF** | `DOCS/marketing/informe-visibilidad-web-ia-2026-10.pdf` | Diagnóstico de Claudio Cavezzali, 40 páginas | 15/10/2026 (medido el 14/10) | Define las keywords, el AEO, la arquitectura y los requisitos |
| **KICK** | `DOCS/marketing/kickoff-plan-90-dias.pdf` | Resumen del kickoff y plan a 90 días | 09/10/2026 | Contexto y roles del proyecto |
| **HOME-PDF** | `DOCS/diseno/home-intellihelp-2026-10.pdf` | Diseño de la home (maqueta) | oct-2026 | Solo estructura. Sus textos son de maqueta |
| **REQ** | `DOCS/marketing/requisitos-marketing.md` | Resumen ya hecho de las cuatro fuentes | 22/10/2026 | Secundaria |
| *(cruce)* | `DOCS/contenido/fuentes/fuentes-web-actual.md` y `fuentes-pdfs-old.md` | Notas previas sobre la web vieja | 22/10/2026 | Las uso solo para validar el origen de un dato |

Notación: `BRIEF §8.1` es la pregunta del brief; `INF p.9` es la página del informe; `KICK p.2` es la página del kickoff.

---

## 1. Hechos de Intellihelp (brief, informe y kickoff)

### 1.1 Empresa

- **Qué es, en palabras de la empresa** (BRIEF §1.1): "Somos una Empresa de Servicios Tecnológicos con una fuerte vocación de colaboración, acompañamiento constante y calidad hacia nuestros clientes". Atiende a:
  - **Privados:** corporaciones y empresas medianas y grandes. Pymes "dependiendo el caso y el servicio" (BRIEF §6).
  - **Públicos:** organismos nacionales, provinciales y municipales.
- **Una palabra:** **"Compromiso"** (BRIEF §15.6).
- **Dos negocios** (BRIEF §4):
  - **SERVICIOS:** "brindados íntegramente por ITH a través de su estructura de STAFF".
  - **SOLUCIONES:** integración de uno o más fabricantes o provisión vía mayorista, "con ITH como único proveedor (Integrador)". Este es el argumento real del "único responsable": sale del modelo de integrador, no de una promesa inventada.
- **Trayectoria:**
  - El kickoff dice "14 años de trayectoria, presencia en todo el país y clientes de primer nivel" (KICK p.2).
  - El informe registra que la web vieja decía +13 en la home y 15 en /servicios/, y 14 en el kickoff: es un dato inconsistente (INF p.5 y p.25).
  - **Ojo:** la web vieja fecha la fundación el **10/03/2010**, y 2012 es el año de las "primeras oficinas" (cruce: `fuentes-web-actual.md` §timeline). Ver las contradicciones.
- **Razón fiscal:** CUIT 30-71140975-7, para el schema (INF p.26). Razón social INTELLIHELP SA (cruce: Código de Ética).
- **NAP propuesto** (INF p.4):
  - "Intellihelp · Av. Dorrego 1789, piso 6, oficina 604, C1414CKM, CABA".
  - Fijo +54 11 7700-6868 y WhatsApp +54 9 11 5027-4827.
  - El mail comercial lo define Intellihelp (info@ o soporte@).
- **Perfil de Google** (INF p.4): verificado, 5,0 estrellas con 3 reseñas, 2 fotos y la categoría equivocada ("Tienda de informática").
- **Homónimo:** IntelliHelp SpA (Chile), del mismo rubro, ocupa los resultados 1 a 3 de "intellihelp". La web tiene que aclararlo en Nosotros, en el schema y en llms.txt (INF p.3 y p.15).
- **Objetivos:**
  - Comercial: sumar **5 clientes con abono recurrente** (INF p.2; KICK p.2).
  - Ventas del Q1: 350 millones de pesos (BRIEF §1.3). **Es interno, no se publica.**
- **Frase del kickoff:** "Los negocios están. Lo que pasa es que no llego." (Carlos, KICK p.2). Sirve de contexto, no se publica.

### 1.2 Equipo: los 7 del brief (cargos oficiales) y los roles del kickoff

| Persona | Cargo oficial (BRIEF §1.2) | Rol en el kickoff (KICK p.2) | Qué muestra hoy la home | Estado |
|---|---|---|---|---|
| Carlos Baldelli | Presidente y socio | CEO, contacto principal y cara comercial en LinkedIn | "CEO y dirección comercial" | Corregir el cargo a "Presidente y socio" (se puede sumar "dirección comercial") |
| Nicolás Baldelli | Director de Operaciones y socio | Técnico y comercial | "Técnico y comercial" | **Corregir:** cargo de maqueta. Pasa a "Director de Operaciones y socio" |
| Brian Sierra | Responsable de Servicio a Clientes | Postventa y desarrollo de la web | "Brian · Postventa" (sin apellido) | **Falta:** apellido y cargo |
| Alejandro Ayala | Responsable de Instalaciones y Post Venta | — | "Alejandro · Preventa e instalaciones" | **Falta:** apellido y cargo |
| Laura Zaltron | Responsable de Marketing y Comunicaciones | Pre y postventa, Marketing, reseñas | "Preventa y postventa" | **Corregir:** contradice el brief |
| Lisandro Campos | Preventa y Servicios | — | **No aparece** | **Falta** |
| Raúl Nasif | Administración | — | **No aparece** | **Falta** |

- Hay una séptima tarjeta, "Nuestro equipo técnico", que no es una persona.
- El brief dice "Staff. 7 personas". El staff de outsourcing que trabaja en los clientes (personal en nómina de ITH) **no se cuenta ahí**. No hay un número publicado de técnicos.

### 1.3 Servicio de entrada y foco de la web

- **Servicio de entrada:** video seguridad y control de acceso. "El servicio que más demanda genera y que permite trabajar en todos los segmentos de mercado, desde pymes hasta grandes empresas" (BRIEF §3).
- **Para crecer:** los servicios que facturan todos los meses (BRIEF §3):
  - "SERVICIOS DE OUTSOURCING, incorporar personal en nómina de ITH, lo que permite lograr un flujo de facturación recurrente".
  - "SERVICIOS DE SOPORTE TÉCNICO Y MESA DE AYUDA O HELP DESK".
- **Foco propuesto** (INF p.3):
  - Eje: abono, es decir Outsourcing con Service Desk, soporte y mantenimiento.
  - Segunda línea: Seguridad, Ciberseguridad, Redes y Data Center.
  - Queda pendiente decidir si sigue la línea para pymes y particulares.

### 1.4 Catálogo completo (BRIEF §2 y §4)

**SERVICIOS**, con detalles concretos que se pueden usar:

- **Outsourcing**
  - Mesa de ayuda, soporte técnico y service desk: "equipos de trabajo dinámicos certificados y capacitados".
  - TICS: equipos de profesionales con "supervisión, control y el espacio físico si es requerido".
- **Reclutamiento y selección**
  - Soluciones técnicas llave en mano: "desde el relevamiento de las necesidades hasta la implementación y su mantenimiento correctivo y preventivo".
  - Recursos en nómina del cliente.
  - Coaching proactivo.
- **Automatización con IA:** agente experto, automatización de procesos y bots de atención. **Ojo:** solo están listados, no tienen descripción ni caso.
- **Desarrollo de aplicaciones**
  - Software factory: "sistemas en tiempo real para un alto volumen de transacciones financieras", sistemas de "Postnet", software a nivel de capa de red y pruebas de estrés.
  - Mobile: "sistemas para PDA's de recolección de datos en la industria energética, control de inventarios y stock, dashboards para tabletas".
  - Sistemas transaccionales: "planta de desarrollo de software", con soluciones a medida para alimentos, laboratorios, seguros, medios de comunicación, finanzas y energía.
  - Time & material.
- **Capacitación**
  - Training center.
  - **INTELLIHELP-Learning**, una plataforma de e-learning propia.
  - Acuerdos con universidades "que certifican y convalidan nuestros contenidos".
  - Talleres prácticos y team building.
- **Búsqueda de recursos:** "procesos depurados y certificados", **executive search** y búsquedas para todas las áreas.
- **Consultoría**
  - Transformación digital.
  - Procesos de negocio: ITIL, "COBIS" (probablemente quiso decir COBIT), metodologías ágiles, calidad y gestión de procesos.
  - Gestión de proyectos PMI/PMO.
  - Calidad: certificación de procesos.
  - Planes de negocio, planes estratégicos y planes estratégicos de IT.

**SOLUCIONES** (ITH como integrador):

- **Inteligentes**
  - Energías renovables.
  - IoT e I2oT: sensores, tableros de monitoreo, gateways IoT, servidores de borde y software en la nube; estándar o a medida, con desarrollo de hardware y software propio.
  - Smart city: plazas, vía pública, edificios gubernamentales.
- **Huawei**
  - Acceso: redes ópticas pasivas para empresas, ISP y MSO.
  - Networking, data center, storage y servidores.
  - Cloud: virtualización de puestos de trabajo sobre la nube Huawei.
  - Nube privada FusionCloud.
- **Hikvision**
  - Videovigilancia con IA y reconocimiento facial.
  - Biométricos: huella, palma, QR y facial; molinetes, pasarelas, escáneres de objetos y personas, barreras y estacionamientos inteligentes.
  - Control de accesos: "proveemos, instalamos y mantenemos".
  - **Integración de HikCentral con sistemas de nómina** para el control de presentismo.
- **Suprema:** lo mismo, con **BioStar** integrado a la nómina.
- **Dahua**
  - Video IoT.
  - AI Powered Surveillance con **WizMind**: búsqueda de eventos en NVR "para instalaciones con un gran número de cámaras".
  - Efficient Meeting Rooms.
  - Control de accesos.
  - Integración con nómina. **Ojo:** el brief dice BioStar en Dahua, probablemente por copiar el bloque de Suprema.
- **Furukawa:** **Laserway**, red GPON totalmente pasiva para cableado estructurado. "INTELLIHELP desarrolla, implementa y mantiene estas soluciones para empresas, organismos públicos y corporaciones".
- **Fortinet:** redes seguras y ciberseguridad, incluida OT. "Aportando el conocimiento de nuestros profesionales certificados".

### 1.5 Fabricantes y mayoristas (BRIEF §5)

- **Fabricantes ("trabajamos y estamos certificados"):** Huawei, Hikvision, Dahua, Suprema, Furukawa, Microsoft, Fortinet, Ubiquiti, Aruba, HP, Dell, Lenovo, APC, Cisco, Panduit, MikroTik, Eaton, SUSE, Red Hat, CommScope y Grandstream. (El brief decía "Comscore": era CommScope, lo confirmó el cliente.)
- **Mayoristas:** Solution Box, Tecnocode, Selnet, Productos Efergia, Bring, Isecom, Integra, Security One, Multitech, Teletex, Fiesa, Clean Energy, Itokii y OCRL. Son proveedores, no van a la home.
- **El informe suma Zyxel** a los partners que podrían enlazar a la web (INF p.30: "Huawei, Zyxel, Dahua, MikroTik"). Zyxel no está en el brief.

### 1.6 Prueba y certificaciones (BRIEF §15.5)

- "Certificaciones en todos los partners enumerados".
- "Certificaciones ITIL, Microsoft".
- "**Más de 40 licitaciones** participadas, ganadas y ejecutadas correctamente en diversos organismos públicos". Es la cifra más fuerte y verificable del brief, y **hoy no está en la home**.
- "Desarrollo de proyectos de gran envergadura en grandes clientes".
- "Referencias comerciales de clientes".
- **ISO (a confirmar):** el informe la deja "A DEFINIR" (INF p.30). No hay certificación ISO declarada.
- **Gold Partner (a confirmar):** el brief no habla de "Gold Partner". Ese dato viene de la web vieja (Huawei 2016 y Hikvision 2018) y hay que confirmar que siga vigente.

### 1.7 Clientes

- **Principales** (BRIEF §7): Gobierno de la Ciudad de Buenos Aires ("cliente más importante"), el grupo Lojack/Strix/Autos del Mar/Torres del Sol ("grupo empresario entero"), la Superintendencia de Riesgos del Trabajo y la **Administración de Parques Nacionales**. Parques Nacionales no está en la home.
- **Perdidos en los últimos 2 años** (BRIEF §11):
  - GCBA, por cambio de autoridades.
  - **El Cronista**, por "disconformidad en una mudanza".
  - Gendarmería Nacional, por cambio de autoridades.
  - Correo Argentino, porque el tercero que los contrataba internalizó el servicio.
- **Logos de la web vieja que nombra el informe** (INF p.8, de 46 en total): Senado de la Nación, AGIP, ASI GCBA, Boletín Oficial, SRT, Correo Argentino, Nación Seguros, Medifé, Bagó, Pfizer, Lojack, Cablevisión Fibertel, El Cronista y NIC Argentina, "entre otros".
- **Casos con nombre que propone mostrar el informe** (INF p.3): Petropack, Cartocor, ODI, ASI GCBA y Nación Seguros.
- **El activo escondido** (INF p.3): "Senado, AGIP, Nación Seguros, Pfizer, Bagó, Medifé y casos escritos como el de la ASI porteña" están en páginas con 404 o en imágenes que ni Google ni las IA leen.
- **Sectores con historia** (INF p.19): sector público, seguros, bancos y laboratorios. Hoy las IA nombran a Accenture o Globant para esos sectores porque ningún texto conecta a Intellihelp con ellos.
- **Ubicación** (BRIEF §13): "Todos los clientes son de Buenos Aires, pero en muchos de ellos la cobertura del servicio abarca una o más provincias del interior o países limítrofes".
- **Testimonios:** el brief no aporta ninguno. Dice que "hay muchas [historias] no documentadas" (§15.4) y que los clientes "en general no dicen mucho, pero sí lo demuestran a la hora de renovar" (§15.2).

### 1.8 Cómo compran los clientes y por qué eligen a ITH (BRIEF §8 a §10 y §14)

- **Sector público:** "competimos en las licitaciones y las ganamos. Luego supimos generar un vínculo que permitió renovar los servicios".
- **Privados:** "por mejor precio, pero luego de años logramos que nos vayan contratando otros servicios y renovando los existentes".
- **Quién decide:**
  - En los clientes grandes, el CIO o el gerente o director de tecnología. "Son procesos de decisión largos que arrancan con la colaboración en las especificaciones de los pliegos".
  - En el resto, trato directo con los dueños o el gerente, con un promedio de **tres meses** hasta la aprobación.
- **Por qué llaman:** "una necesidad nueva a cubrir o la disconformidad con un proveedor existente… **Nos llaman por proyectos, no por cosas que no andan**".
  - **Ojo:** la sección "Problema" de la home está construida al revés, sobre lo que se rompe. Ver el inventario.
- **Cuando compiten:** "En general cuando competimos ganamos por prestación/precio" (§14.3).
- **La alternativa del cliente:** contratar un freelancer, resolverlo internamente o no hacerlo por presupuesto (§14.5).
- **Clientes que no quieren** (§12): el "conflictivo irracional", el que no tiene presupuesto aprobado y el que tiene riesgo alto de incobrabilidad. Es interno.
- **De dónde vinieron los últimos clientes** (§16): conocidos, licitaciones públicas, recomendaciones y email marketing. Nunca pagaron publicidad.

### 1.9 Diferencial y promesa, con las palabras de la empresa

- **§15.1:** "No somos los únicos en nada pero… Somos de los pocos que buscamos que nuestros clientes puedan canalizar sus necesidades tecnológicas en forma eficiente, ágil, rápida y a un costo competitivo y accesible. Nuestro valor está en una vocación de servicio genuina… aportando nuestro conocimiento en proyectos técnicamente desafiantes que impliquen incorporar innovación tecnológica **integrando el hard y el soft en una sola empresa**… Construimos relaciones de largo plazo con nuestros clientes sobre la base de mantener los compromisos asumidos."
- **Valores declarados (§15.1):**
  - Compromiso.
  - Comunicación y escucha activa.
  - Conocimiento.
  - Anticipación y seguimiento.
  - "Frontalidad y verdad en la formulación y ajuste de las expectativas".
  - Calidad humana.
- **Lo que dicen los clientes contentos (§15.2):** "Nos manifiestan la seguridad y confianza de llevar adelante tanto los servicios como los proyectos sabiendo que vamos a estar siempre cumpliendo nuestros compromisos".
- **Promesa (§15.3):** "Tiempos de respuesta, inmediatez, conocimiento, precios competitivos y acompañamiento".
- **No hay SLA publicable en el brief.** El único SLA con número es el del caso ASI de la web vieja: de 5x8 a 7x24, con 2 h de respuesta máxima.

### 1.10 Competidores (BRIEF §14; INF p.22 y p.23)

- **Del brief:**
  - Huawei: DataStar, Trans, SystemNet, Datco, Sonda, Tecnored, Arquinec, IPLAN, BGH, Logicalis, IT Partners, Znet y SDH.
  - Seguridad: Dyna Group, Domonet, Tech Security, Seguridad Artemis, Sekuron, Redvision, CyR e Intelektron.
  - Outsourcing: Stefanini, Manpower, Teleperformance, BairesDev, Adecco, Baufest, Novatium, GDA, Snoop, IT Patagonia, ASAP y Ecosistemas.
  - Mesa de ayuda: PwC, Stefanini, Sonda, BGH Tech Partner, Teleperformance, Novatium, Exo, Grupo Datco, IT Partner, Yel, Axxon, Atos, ITS, Grupo IT Argentina y Soluciones Informáticas Online.
- **En las IA** (INF p.18 y p.19):
  - HelpIT aparece en 23 de 65 respuestas. Publica precio ("planes desde ARS 160.300 + IVA hasta 5 PC"), el tamaño que atiende ("hasta 300 PC") y una página por servicio.
  - Tecnobrain aparece en 21 de 65.
  - Intellihelp aparece en **0 de 65**.
  - "Perplexity leyó la página de LinkedIn de Intellihelp y le atribuyó ese contenido a HelpIT, porque el texto era tan genérico que encajaba con cualquiera" (INF p.19). **Es el mejor argumento contra el copy genérico.**
- **Lo que tiene que superar la web** (INF p.23): "Igualar lo básico de helpit.com.ar el día del lanzamiento y superarlo con lo que ellos no tienen: casos con clientes de primer nivel y presencia en sector público, seguros y salud".

---

## 2. Requisitos de copy, SEO y AEO

### 2.1 La home (INF p.5, 7, 24 y 26)

- **Keyword principal: "servicios informaticos"** (390/mes).
  - Secundarias: "servicios it para empresas", "empresas it argentina" e "intellihelp".
  - Del anexo: "servicios informaticos para empresas", "servicios it", "proveedor it", "empresas de it en argentina" y "empresas de tecnologia argentina".
- **Un solo H1, con la keyword.** El informe propone esta propuesta de valor para arriba: **"Outsourcing IT, mesa de ayuda y seguridad física para empresas y organismos en Buenos Aires"** (INF p.8). Tiene que decir servicio, público y lugar.
- **Title y meta description únicos**, con marca, servicio y ciudad. El ejemplo que cita el informe es el de HelpIT: "Soporte IT para PyMEs en CABA y Argentina" (INF p.22).
- **Todo en texto.** Nada dentro de videos ni imágenes, y los logos de clientes también en texto, por sector.
- **NAP idéntico en todo el sitio**, teléfono con clic para llamar y copyright del año.
- **CTA arriba:** "Agendá una reunión" y WhatsApp. Formulario corto con nombre, empresa, mail, teléfono y servicio.
- **Prueba social:** franja de logos debajo del titular, por sector; un caso destacado por servicio; 2 o 3 testimonios con nombre y cargo; equipo con foto y cargo, separando dirección, equipo comercial y equipo técnico (INF p.8).
- **CTA por etapa del embudo** (INF p.17): "Ver casos", "Pedí el diagnóstico IT sin cargo", "Pedí cotización", "Agendá 20 minutos" y "Agendá la reunión". En el embudo también aparece "cómo cotizamos" como contenido BOFU.

### 2.2 Keyword principal por página (INF p.9 a 11 y p.24 a 25)

| Sección o página | Keyword principal (búsq./mes) | Secundarias |
|---|---|---|
| Seguridad | instalacion de camaras de seguridad (1.600, KD 0, puntaje 100) | control de acceso (720), videovigilancia (140), sistemas biometricos (70), colocacion de camaras de seguridad (BOFU, 91), camaras de seguridad empresas |
| Ciberseguridad | ciberseguridad empresas (50) | empresas de ciberseguridad (110), servicios de ciberseguridad (40), seguridad informatica (2.900), ciberseguridad para empresas |
| Redes indoor | cableado estructurado (480) | wifi para empresas, routers empresariales, sd wan (320), redes lan (1.000), instalacion de redes |
| Redes outdoor (FTTH) | ftth (720) | instalacion de fibra optica (70), tendido de fibra optica (50), red ftth (50) |
| Data Center | data center (2.900) | servidores para empresas, hiperconvergencia, sdn (320), virtualizacion |
| Outsourcing y Service Desk | outsourcing it (30) | service desk (480), mesa de ayuda tercerizada, soporte it para empresas (20 en la tabla; 590 "cabeza" en AIO), help desk (1.000, mezcla empleo), managed services |
| Cloud (F2) | servicios en la nube (70) | nube privada/publica/hibrida, migracion a la nube, microsoft 365 empresas |
| IoT (F2) | soluciones iot (20) | sensores iot (320), monitoreo remoto |
| Acceso (F2) | gpon (320) | catv (170), triple play (110), red hfc (50) |
| Energías renovables (F2) | instalacion de paneles solares (480) | sistema on grid (140), off grid (110) |
| Búsqueda de recursos (F2) | seleccion de personal (320) | assessment center (720), headhunting (170), busqueda de ejecutivos |
| Consultoría (F2) | consultoria it (210) | itil (590), metodologias agiles (1.000), sistema de gestion de calidad (320) |
| Capacitación (F2) | capacitacion empresarial (40) | capacitacion it, in company, curso itil |
| Desarrollo de apps (F2) | empresas de desarrollo de software (210) | software a medida (140), desarrollo de aplicaciones moviles (70), sistemas transaccionales (20) |
| Automatización (F2) | automatizacion de procesos (210) | rpa (3.600), automatizacion con ia (210) |
| Transformación digital (F2) | transformacion digital (480) | transformacion digital empresas |
| Nosotros y Contacto | intellihelp | aclarar el homónimo chileno |

**Dos trampas del informe** (INF p.15):

- "Mesa de ayuda" (1.600) la buscan sobre todo personas que quieren entrar a la mesa de ayuda de un trámite.
- "Help desk" mezcla búsquedas de empleo.

Por eso los textos tienen que usar las variantes con **"empresa", "servicio" o "tercerizada"**.

### 2.3 Preguntas que la web tiene que contestar (AEO, INF p.20)

| Pregunta | ¿La responde la home hoy? | Dato real disponible |
|---|---|---|
| ¿Cuántos empleados o PC tiene tu empresa? (para qué tamaño atienden) | No | Brief: medianas, grandes y corporaciones; pymes según el caso. **Falta el rango de PC o usuarios** |
| ¿Abono mensual o pago por visita? ¿Técnico fijo o a demanda? | No | Brief: outsourcing con personal en nómina de ITH, recursos en nómina del cliente y llave en mano. **Falta la modalidad publicable** |
| ¿Qué SLA o tiempo de respuesta? | Solo en el caso ASI (2 h, 7x24) | **Falta un SLA estándar** |
| ¿Cuánto cuesta por usuario, por PC o por técnico dedicado? | No | **A definir** ("abono mensual por puesto, desde X equipos") |
| ¿Cubren CABA, AMBA o el interior? | Parcialmente | Brief: clientes de Buenos Aires con cobertura en provincias y países limítrofes. **Faltan las 10 a 15 provincias** |
| ¿Cumplen la Ley 25.326 de datos personales? | No | **Sin dato.** La web vieja tiene un Código de Ética 2022, que no es lo mismo |
| ¿Qué pasa al terminar el contrato? | No | **Sin dato** |

Formato: respuestas cortas con schema FAQPage. Cada página de servicio lleva una respuesta de 40 a 60 palabras arriba, el tamaño de empresa, la modalidad, el SLA y el horario, la cobertura, el precio, un caso real con tecnologías y una FAQ de 5 a 8 preguntas (INF p.26).

### 2.4 Schema y llms.txt (INF p.26)

- **Schema:** Organization + LocalBusiness, con nombre, CUIT, dirección, teléfono, horarios y `sameAs` a LinkedIn y a Google. Además Service, FAQPage, Person para los fundadores y BreadcrumbList.
- **llms.txt:** la descripción de la empresa, la aclaración del homónimo, los servicios, los casos y el contacto.

---

## 3. Inventario de la home nueva tal como está (22/10/2026)

**Hallazgo general.** Comparé `pdftotext` de `home-intellihelp-2026-10.pdf` con `src/partials/*.html`: **todos los textos visibles son copia literal del PDF de diseño**, salvo los comentarios y los atributos `alt`. Eso confirma el reclamo de marketing.

Algunos de esos textos de maqueta sí tienen respaldo real (vienen de la web vieja). Otros son genéricos o no tienen fuente. Códigos de la columna "Estado":

- **R:** dato real, con fuente.
- **R?:** real pero viejo, o a confirmar si sigue vigente.
- **G:** genérico o de relleno, sirve para cualquier empresa.
- **SF:** sin fuente; puede estar inventado por la maqueta.
- **X:** contradice el brief.

Todos son "PDF literal" salvo que se indique lo contrario.

### 3.0 `index.html` y `src/data/site.json`

| Elemento | Texto actual | Estado | Qué falta |
|---|---|---|---|
| `<title>` | "Intellihelp \| Mesa de ayuda, outsourcing IT, redes y seguridad física" | G para SEO | No tiene la keyword "servicios informáticos" ni la ciudad. Propuesta de forma: "Servicios informáticos para empresas en Buenos Aires \| Intellihelp" + servicio |
| meta description | "Un equipo con nombre y apellido que mantiene tu tecnología andando desde 2012. Mesa de ayuda…" | G + X | "desde 2012" (ver las contradicciones). Faltan la keyword, el público real (organismos y corporaciones) y una prueba (+40 licitaciones) |
| og:title | "Servicios IT con nombre y apellido, desde 2012" | G | Igual que arriba |
| og:description | "…Un solo responsable, de Buenos Aires al interior." | G | Respaldo real: ITH como "único proveedor (Integrador)" (BRIEF §4) |
| JSON-LD | Solo `Organization`: name, alternateName ITH, `foundingDate` "2012", email, dirección "Dorrego 1789, piso 6, of. 604", areaServed AR | Incompleto | Falta LocalBusiness, `taxID` (CUIT 30-71140975-7), `telephone`, `postalCode` C1414CKM, "Av." (el NAP no coincide con site.json), `sameAs` (LinkedIn y Google), `openingHours` (a definir), `legalName` (INTELLIHELP SA), `founder`/Person y `disambiguatingDescription` (no es IntelliHelp SpA de Chile). Hay que revisar `foundingDate` |
| site.json `years` | "14" | R? | Sale del kickoff. Ver las contradicciones (2010 o 2012) |
| site.json `phone` | +54 11 7700-6868 | R (INF p.4) | **No se muestra en ninguna parte de la home**: no hay `tel:` visible. Lo pide el informe |
| site.json `emailRrhh` | rrhh@intellihelp.tech | R (web vieja) | Va en el footer. Puede reforzar la lectura de "empleador" que el informe critica; evaluar |
| site.json `address` / `addressShort` | "Av. Dorrego 1789, piso 6, oficina 604, C1414CKM, CABA" / "Av. Dorrego 1789, piso 6, of. 604, CABA" | R | El JSON-LD dice "Dorrego" sin "Av." y el PDF del footer dice "Dorrego 1789, piso 6, CABA": es un NAP inconsistente |

### 3.1 Header (`header.html`)

| Elemento | Texto | Estado | Dato real para reemplazar |
|---|---|---|---|
| Tag del logo | "Servicios IT / desde 2012" | X o R? | 2012 son las primeras oficinas y 2010 la fundación. Alternativas: "Servicios tecnológicos" (BRIEF §1.1) o un año confirmado |
| Nav | Servicios · Nuestra historia · Equipo · Casos · Preguntas | OK | Cuando existan las páginas internas, apuntar a /soluciones/, /servicios/, /clientes/, /nosotros/ y /contacto/ |
| CTA | "Agendá una reunión" | OK (lo pide el informe) | — |
| alt del logo | "ITH, Intellihelp" | OK | — |

### 3.2 Hero (`hero.html`)

| Elemento | Texto | Estado | Dato real para reemplazar |
|---|---|---|---|
| Nota | "ACÁ VA IMAGEN · El equipo completo en la oficina de Dorrego 1789…" | Nota | Lista de 7 personas reales (BRIEF §1.2) |
| **H1** | "Un equipo con nombre y apellido / que mantiene tu tecnología andando. / Hace 14 años." | **G** | No tiene keyword, servicio, público ni lugar. Base del informe: "Outsourcing IT, mesa de ayuda y seguridad física para empresas y organismos en Buenos Aires" + "servicios informáticos" |
| Lead | "Mesa de ayuda, outsourcing IT, redes y seguridad física para empresas medianas, grandes y organismos públicos. Desde Buenos Aires hasta las sucursales del interior, con un solo responsable." | R parcial | El público es real (BRIEF §1.1). Se puede reforzar con "integramos hardware y software en una sola empresa" (BRIEF §15.1) y con el personal en nómina de ITH (BRIEF §3) |
| Botones | "Agendá una reunión →" · "Conocé al equipo" | OK | — |
| Nota bajo los botones | "La primera charla es sin cargo: te asesoramos aunque todavía estés evaluando." | SF | El brief no lo dice. El informe propone "Pedí el diagnóstico IT sin cargo" como CTA, pero **Intellihelp tiene que confirmarlo** |
| Stat 1 | "14 años · trabajando con empresas y organismos" | R? | Años sin resolver |
| Stat 2 | "+10 provincias · con proyectos y partners locales" | **SF** | No hay fuente: el informe pide "la lista de las 10 a 15 provincias" como pendiente y el mapa marca solo 7. Reemplazo posible: **"+40 licitaciones públicas ganadas y ejecutadas"** (BRIEF §15.5.3) |
| Stat 3 | "Gold Partner · de Huawei y de Hikvision" | R? | Real en 2016 y 2018 (web vieja); falta confirmar la vigencia. El brief habla de "certificaciones en todos los partners", más ITIL y Microsoft |

### 3.3 Logos (`logos.html`)

| Elemento | Texto | Estado | Dato real |
|---|---|---|---|
| Título | "Organizaciones que confiaron su tecnología en nosotros" | G | Puede ir "Clientes" + sector. El informe pide los logos "por sector" y también en texto |
| Logos (alt) | Senado, ASI GCBA, Nación Seguros, Pfizer, Bagó, Medifé, LoJack, Petropack, AGIP, Cablevisión Fibertel, El Cronista, Correo Argentino, Reckitt Benckiser, SRT, CAME, Gendarmería (atenuado) | R, a confirmar | Hay **3 clientes perdidos** (El Cronista se fue disconforme, Correo Argentino y Gendarmería), además del GCBA/ASI. **Falta Parques Nacionales**, que es cliente principal del brief. Faltan Strix, Autos del Mar y Torres del Sol (grupo Lojack). Cartocor y ODI no tienen logo |
| Chips de sector | Sector público · Seguros y salud · Laboratorios · Industria · Medios y telecomunicaciones | R | Coinciden con INF p.19 y BRIEF §2.2.3.3 (alimentos, laboratorios, seguros, medios, finanzas, energía). Falta la lista de clientes en texto por sector |
| Nota | "Confirmar con Carlos…" | Nota | — |

### 3.4 Problema (`problema.html`)

| Elemento | Texto | Estado | Comentario y dato real |
|---|---|---|---|
| Eyebrow | "Lo que cuesta un mal soporte" | G | — |
| H2 | "Cuando la tecnología se frena, se frena tu empresa." | **G** | Sirve para cualquier empresa |
| Lead | "Cada hora con la red caída… Y casi siempre llega en el peor momento." | **G** | **Contradice el brief**: "Nos llaman por proyectos, no por cosas que no andan"; los motivos son una necesidad nueva, la disconformidad con el proveedor actual o un presupuesto acotado (BRIEF §10) |
| Columna "Así se vive hoy" | "Tres proveedores, ningún responsable" / "Uno para la red… se pasan la pelota." · "El interior, a la buena de Dios" / "Cada sucursal con su técnico suelto…" · "Cada vez, una cara nueva" / "El técnico rota…" | G + SF | La alternativa real según el brief es "el freelancer", "lo resuelven internamente" o "no lo hacen por presupuesto" (§14.5) |
| Columna "Así trabajamos con vos" | "Un solo equipo responsable" / "Redes, soporte y seguridad física con un único interlocutor…" · "El mismo estándar en todo el país" / "Partners locales que trabajan con nuestros procesos…" · "Personas que ya conocen tu empresa" / "Profesionales asignados… inducción… capacitación continua." | R parcial | "Único proveedor (Integrador)" (BRIEF §4); inducción y capacitación continua (web vieja); "integrando el hard y el soft en una sola empresa" (BRIEF §15.1). "Partners locales" **no tiene fuente** en el brief ni en el informe |

### 3.5 Servicios (`servicios.html`)

| Elemento | Texto | Estado | Dato real |
|---|---|---|---|
| Eyebrow y H2 | "Qué hacemos" · "Tres frentes, un mismo equipo." | G | — |
| Lead | "Lo que tu empresa necesita para trabajar tranquila todos los días, resuelto por la misma gente de punta a punta." | **G** | Usar la distinción real Servicios (staff propio) y Soluciones (integración de fabricantes) del BRIEF §4 |
| Tarjeta 01 | "Mesa de ayuda y outsourcing IT" / "…psicodiagnóstico laboral, inducción… capacitación continua." Chips: Service desk · Soporte y mantenimiento · Outsourcing de TI · Búsqueda de perfiles IT | R (web vieja) | Sumar: personal en nómina de ITH o del cliente (BRIEF §2.2.2.2 y §3), equipos certificados ITIL (BRIEF §15.5.2), el caso ASI 5x8 → 7x24 y la keyword "outsourcing it / service desk / soporte it para empresas" |
| Tarjeta 02 | "Redes e infraestructura" / "Fibra óptica, redes empresariales e inalámbricas, servidores, almacenamiento y nube… Huawei…" Chips: Fibra óptica · Redes y wifi · Servidores y storage · Huawei Cloud | R | Sumar: GPON Laserway de Furukawa, data center, Fortinet o ciberseguridad (es la segunda línea del informe) y los casos AGIP (33 oficinas), subte y Senado (servidores Huawei). Keywords: cableado estructurado, ftth, data center |
| Tarjeta 03 | "Seguridad física y control de acceso" / "…biométrico y por reconocimiento facial, videovigilancia IP y monitoreo centralizado con Hikvision…" Chips: Control de acceso · Videovigilancia IP · Reconocimiento facial · HikCentral | R | Es el **servicio de entrada** (BRIEF §3). Sumar: Dahua WizMind y Suprema BioStar, integración con la nómina para presentismo, molinetes y barreras. Keyword: "instalación de cámaras de seguridad" (1.600) |
| Línea extra | "Además: desarrollo de aplicaciones, soluciones IoT y energía solar…" | R incompleto | Faltan consultoría, capacitación (INTELLIHELP-Learning), búsqueda de recursos y automatización con IA. Llevar a "todos los servicios" (lo pide Trello) |

### 3.6 Historia (`historia.html`)

| Elemento | Texto | Estado | Fuente o comentario |
|---|---|---|---|
| Eyebrow, H2 y lead | "Nuestra historia" · "14 años, contados por lo que hicimos." · "Empezamos en una oficina de Puerto Madero con una idea simple: que la tecnología de nuestros clientes funcione…" | G + R? | La "idea simple" es de relleno. Puerto Madero es real (2012) |
| Número grande | "14 años · proyecto a proyecto" | R? | Años sin resolver |
| 2012 | Primeras oficinas, Quartier Madero | R | Web vieja. **Ojo:** no es el año de fundación |
| 2013 | Primer gran cliente: ASI GCBA | R | Web vieja. GCBA está perdido (BRIEF §11.1) |
| 2015 | Fibra en las líneas B y C del subte | R? | Hay contradicción B y C contra C y E en la web vieja |
| 2016 | Gold Partner de Huawei | R | — |
| 2017 | AGIP, 33 oficinas, 24/7, y servidores para el Senado | R | — |
| 2018 | Gold Partner de Hikvision; Palermo Hollywood | R | — |
| 2019 | Energía solar, bodega del Valle de Uco | R | — |
| 2021 | "Seguridad para un diario: El Cronista" | R, a confirmar | **Cliente perdido y disconforme** (BRIEF §11.2): confirmar con Carlos |
| 2022 | Mesa de ayuda Lojack y outsourcing para Pfizer | R | Lojack sigue como cliente principal |
| Hoy | "Proyectos en Paraná y Córdoba, soporte a sucursales del interior y partners en Mendoza, Salta y Rosario." | **SF** | Paraná y Córdoba salen de Petropack y Cartocor (el informe los nombra). Los "partners en Mendoza, Salta y Rosario" **no tienen fuente** en el brief, el informe, el kickoff ni la web vieja |

Hitos reales que faltan, de la web vieja (cruce): fundación del 10/03/2010; IoT en 2017; Cablevisión-FiberCorp OpenStack y Sedronar storage en 2017; ASI 7x24 en escuelas, hospitales y comisarías, y CAME app en 2018; Huawei Cloud en 2020; e-learning con más de 50 cursos en 2020. Del brief: **+40 licitaciones** y Parques Nacionales.

### 3.7 Equipo (`equipo.html`)

| Elemento | Texto | Estado | Dato real |
|---|---|---|---|
| Eyebrow, H2 y lead | "Quiénes somos" · "Las personas que vas a tener del otro lado." · "A una empresa de tecnología se la elige por su gente… la que se queda hasta que todo funciona." | G | El kickoff dice "La gente compra a personas, y más en servicios de tecnología" (KICK p.3). Usar la estructura real: 7 personas de staff más el personal en nómina en los clientes |
| Carlos | "CEO y dirección comercial" / "La cara comercial… la primera charla es con él." | R parcial | Cargo del brief: **Presidente y socio**. La cara comercial y LinkedIn son reales (KICK) |
| Nicolás | "Técnico y comercial" / "Entiende la red y entiende el negocio…" | X + G | **Director de Operaciones y socio** |
| Laura | "Preventa y postventa" / "Está cerca de cada cliente…" | **X** | **Responsable de Marketing y Comunicaciones** |
| Brian | "Brian · Postventa" / "Parte del equipo desde hace muchos años…" | X + G | **Brian Sierra · Responsable de Servicio a Clientes**. "Muchos años" no tiene dato |
| Alejandro | "Alejandro · Preventa e instalaciones" / "…releva, planifica y pone en marcha…" | X parcial | **Alejandro Ayala · Responsable de Instalaciones y Post Venta** |
| (falta) | — | — | **Lisandro Campos · Preventa y Servicios** |
| (falta) | — | — | **Raúl Nasif · Administración** |
| Equipo técnico | "En tus oficinas" / "Los profesionales que trabajan todos los días en…" | G | Real: outsourcing con personal en nómina de ITH (BRIEF §3), equipos certificados (§2.2.1.1) |
| Cita | "Si hoy tenemos que dar un servicio de comunicaciones, de control de acceso o de desarrollo de software en cualquier lugar del país, lo podemos hacer." — Carlos Baldelli, CEO | **SF** | No está en ninguna fuente escrita. Si no la aprueba Carlos, usar frases reales del BRIEF §15.1 o §15.3 (son respuestas de la empresa, pero hay que confirmar la atribución) |
| alt (comentados) | "Carlos Baldelli, CEO de Intellihelp", "Brian, postventa…" | X | Corregir con los cargos del brief |

### 3.8 Presencia (`presencia.html`)

| Elemento | Texto | Estado | Dato real |
|---|---|---|---|
| Eyebrow, H2 y lead | "Presencia nacional" · "De Buenos Aires al interior, con el mismo estándar." · "El técnico local resuelve lo puntual, pero a una empresa grande le hace falta estructura…" | G | El brief dice: "Todos los clientes son de Buenos Aires pero en muchos de ellos la cobertura… abarca una o más provincias del interior o países limítrofes" |
| Lista | "Ideal para empresas con sucursales…" · "Partners locales en Mendoza, Salta y Rosario…" · "Intellihelp responde por todo: contratos, equipamiento y tiempos…" | G / **SF** / R parcial | Partners **sin fuente**. "Responde por todo" se apoya en el modelo integrador (BRIEF §4). Caso real con sucursales: ODI, 4 sucursales (lo nombra el informe; el detalle sale de la maqueta) |
| Mapa activo | CABA, Buenos Aires, Córdoba, Santa Fe, Entre Ríos, Mendoza, Salta (7) | R? | Mendoza (Valle de Uco), Córdoba (Cartocor), Entre Ríos (Petropack) y Santa Fe (¿Rosario o la U. del Litoral?) se pueden justificar con casos. **Salta no tiene fuente.** Los países limítrofes no aparecen. La web vieja nombra Burzaco y Corrientes (energía) |
| Leyenda | "Con proyectos o partners" / "A sumar" | G | "A sumar" expone las provincias vacías |

### 3.9 Casos (`casos.html`)

| Elemento | Texto | Estado | Dato real |
|---|---|---|---|
| H2 | "Casos reales, con nombre y apellido." | G | — |
| Destacado ASI GCBA | "De horario de oficina a cobertura permanente." Desafío, qué hicimos y resultado; **5x8 → 7x24; 2 h** de respuesta máxima | **R** (web vieja) | Es el mejor caso con números. **Ojo:** el GCBA se perdió por cambio de autoridades: se puede contar como caso histórico, con año. Faltan año y tecnologías (el informe pide "tecnologías usadas") |
| Petropack | "Paraná, Entre Ríos · Sistema de control automatizado para el fabricante de envases, en el polo tecnológico de Paraná." | R | Web vieja: "sistema IIoT automatizado de arranque y parada de laminadoras". Usar ese detalle, que es más concreto |
| Cartocor | "Córdoba · Proyecto para la empresa que fabrica las cajas de cartón de los productos de Arcor." | **G / SF** | **No dice qué se hizo.** El informe lo nombra como caso, pero no hay detalle en ninguna fuente: hay que pedirlo |
| ODI | "Interior del país · Soporte técnico para sus 4 sucursales del interior, a través de nuestros representantes locales." | R? | El informe lo nombra. "4 sucursales" y "representantes locales" solo están en la maqueta: confirmar |
| AGIP | "CABA · Red de fibra óptica para conectar sus 33 oficinas, con mantenimiento y soporte 24/7." | R | Web vieja, 2017: niveles 1 y 2 |
| Faltan | — | — | **Nación Seguros** (caso nombrado por el informe), Senado (servidores Huawei), Lojack (mesa de ayuda en sitio), Pfizer (outsourcing) y el caso de seguridad de servicio de entrada |

### 3.10 Testimonios (`testimonios.html`, `data-draft`)

- **Textos:** "Lo que dicen nuestros clientes" · "La mejor carta de presentación la escriben ellos." · tres notas "Testimonio real a pedir" · placeholders "Nombre y apellido / Cargo, empresa" · nota "Reseñas verificadas de Google".
- **Estado:** borrador oculto. No hay testimonios reales (el brief dice que no están documentados; Laura pide reseñas).
- **Material real disponible (cruce, `fuentes-web-actual.md` §10):** recomendaciones de LinkedIn de Octavio Trocca (Sanatorio Finochietto), Raúl D'Angelo (Grupo Arquinec), Fabián Sagaro (SETYCOM) y Alberto Cid (MaC Group).
  - **Ojo:** son recomendaciones viejas a la empresa y no todos son clientes: Arquinec figura como **competidor** en el brief.
  - Hay que pedir permiso antes de usarlas.

### 3.11 Pasos (`pasos.html`)

| Elemento | Texto | Estado | Dato real |
|---|---|---|---|
| Eyebrow y H2 | "Cómo empezamos" · "Empezar con nosotros es simple." | G | — |
| Paso 1 | "Una charla para entender tu operación / Nos contás… Escuchamos primero." | G | Valor real: "comunicación y escucha activa" (BRIEF §15.1) |
| Paso 2 | "Una propuesta a tu medida / Alcance, tiempos y responsables por escrito… costo y beneficio." | G | Real: "frontalidad y verdad en la formulación y ajuste de las expectativas" (§15.1); llave en mano "desde el relevamiento" (§2.2.2.1). En lo público el camino real es el pliego y la licitación (§9.1) |
| Paso 3 | "Un equipo asignado desde el primer día / Inducción… una persona responsable de tu cuenta…" | R parcial | Inducción, sí. "Persona responsable de tu cuenta" es plausible (Brian es Responsable de Servicio a Clientes), pero no hay fuente explícita |
| Banda | "La primera charla y el asesoramiento son sin cargo. Decidís con toda la información sobre la mesa." | SF | Confirmar con Intellihelp |

### 3.12 FAQ (`faq.html`, con schema FAQPage)

| Pregunta | Respuesta actual | Estado |
|---|---|---|
| ¿Trabajan con empresas del interior del país? | "Sí. Tenemos partners locales en Mendoza, Salta y Rosario…" | **SF** (partners) |
| ¿Pueden sumar profesionales a mi área de sistemas? | "Sí. Outsourcing de TI y búsqueda de perfiles IT… psicodiagnóstico…" | R |
| ¿Qué tecnologías implementan? | "Fibra óptica… Huawei; control de acceso y videovigilancia IP con Hikvision; y las marcas que tu operación necesite." | R incompleto: puede nombrar Fortinet, Dahua, Suprema, Furukawa, Microsoft, Cisco y el resto (BRIEF §5) |
| ¿Atienden organismos públicos? | "Sí. …desde 2013… ASI… AGIP y el Senado." | R. Falta "+40 licitaciones" y Parques Nacionales y SRT (clientes actuales del brief) |
| ¿Cuánto tarda en arrancar un servicio? (borrador) | Nota "Definir con Carlos" | Pendiente |

**Faltan las 7 preguntas AEO del informe** (ver 2.3): tamaño, modalidad, SLA, precio, cobertura, Ley 25.326 y fin del contrato. Ninguna está hoy.

### 3.13 Agenda o cierre (`agenda.html`)

| Elemento | Texto | Estado | Dato real |
|---|---|---|---|
| Eyebrow | "Hablemos" | OK | — |
| H2 | "En 14 años la tecnología cambió mucho. Nuestra forma de trabajar, poco: escuchar, ir y resolver." | G | Real: "Construimos relaciones de largo plazo… sobre la base de mantener los compromisos asumidos" (BRIEF §15.1); "Compromiso" (§15.6) |
| Lead | "Contanos qué necesitás. Te responde una persona del equipo, con nombre y apellido." | G | Podría nombrar quién responde (¿Carlos? ¿Brian, Servicio a Clientes?), si lo confirman |
| Filas de contacto | WhatsApp · info@ · dirección | R | **Falta el teléfono fijo +54 11 7700-6868 con `tel:`** |
| Formulario | "Agendá una reunión" / "Dejanos tus datos y coordinamos…" / campos / select: Mesa de ayuda u outsourcing IT · Redes e infraestructura · Seguridad física y control de acceso · Otro proyecto / "Quiero agendar la reunión" / "Usamos tus datos solo para responderte." / "¡Gracias! Recibimos tus datos." | OK | Coincide con el formulario corto del informe. Falta Ciberseguridad o Data Center en el select (segunda línea del informe). La línea legal podría citar la Ley 25.326 |

### 3.14 Footer (`footer.html`)

| Elemento | Texto | Estado | Dato real |
|---|---|---|---|
| Tag | "Servicios IT / desde 2012" | X o R? | Igual que el header |
| About | "Servicios IT para empresas y organismos. 14 años en Buenos Aires y en el interior del país." | G | Sumar la razón social, el CUIT y la aclaración "No somos IntelliHelp SpA (Chile)" |
| Columnas | Servicios (3) · Empresa (Historia, Equipo, Casos, Blog en borrador) · Contacto (info@, rrhh@, LinkedIn, dirección corta) | OK / incompleto | Falta el teléfono. La dirección corta no coincide con el NAP completo |
| Fila inferior | "© 2026 Intellihelp. Todos los derechos reservados." · "Gold Partner Huawei · Gold Partner Hikvision" | R? | Gold Partner a confirmar; se podría sumar la lista de fabricantes del brief |

### 3.15 WhatsApp flotante (`whatsapp.html`)

- **aria-label:** "Escribinos por WhatsApp".
- **Mensaje:** "Hola Intellihelp, quiero hacer una consulta." (site.json).
- **Estado:** OK. El informe pide un mensaje prellenado **por página**.

---

## 4. Contradicciones y alertas

1. **Año de origen y años de trayectoria.**
   - La home dice "desde 2012" (header, footer, meta y JSON-LD `foundingDate`) y "14 años" (site.json). Sale del kickoff.
   - La web vieja dice: fundación el 10/03/2010 y primeras oficinas en Puerto Madero en 2012.
   - El informe registra +13 y 15 años en la web vieja y 14 en el kickoff, y lo deja "A DEFINIR".
   - Si la fundación es 2010, son 16 años. "Desde 2012" mezcla la apertura de la oficina con la fundación.
2. **Cargos del equipo.** La home usa los roles de la maqueta y del kickoff, no los del brief:
   - Laura figura como "Preventa y postventa" y es Responsable de Marketing y Comunicaciones.
   - Nicolás figura como "Técnico y comercial" y es Director de Operaciones.
   - Carlos figura como "CEO" y es Presidente.
   - Faltan Lisandro Campos y Raúl Nasif, y los apellidos de Brian y Alejandro.
3. **"+10 provincias"** en el hero contra **7** provincias en el mapa. El informe pide la lista de provincias como dato pendiente: hoy no hay fuente para "+10".
4. **"Partners locales en Mendoza, Salta y Rosario"** (historia, presencia y FAQ): no aparece en el brief, el informe, el kickoff ni la web vieja. Solo está en la maqueta.
5. **Clientes perdidos que se muestran como vigentes:**
   - El Cronista se fue disconforme y figura en un hito de 2021 y en los logos.
   - Correo Argentino y Gendarmería figuran en los logos.
   - El GCBA (ASI) es el caso destacado y el hito de 2013.
6. **Falta un cliente principal del brief:** Administración de Parques Nacionales. El resto del grupo Lojack (Strix, Autos del Mar, Torres del Sol) tampoco aparece.
7. **Enfoque de "Problema":** la home vende contra fallas ("cuando la tecnología se frena"), pero el brief dice "Nos llaman por proyectos, no por cosas que no andan".
8. **"Primera charla sin cargo" o "asesoramiento sin cargo":** no está en el brief. El informe propone "diagnóstico IT sin cargo" como CTA, pero no confirma que la empresa lo ofrezca.
9. **Gold Partner:** el brief no lo menciona; habla de "certificaciones en todos los partners", más ITIL y Microsoft. Es un dato de 2016 y 2018 que hay que confirmar.
10. **NAP en tres formatos:**
    - site.json: "Av. Dorrego 1789, piso 6, oficina 604, C1414CKM, CABA".
    - JSON-LD: "Dorrego 1789, piso 6, of. 604".
    - Footer del PDF: "Dorrego 1789, piso 6, CABA".

    El teléfono está en site.json pero no se muestra.
11. **El brief contra sí mismo:**
    - Dahua aparece integrado con "BIOSTAR", que es de Suprema.
    - "COBIS" probablemente es COBIT.
    - "UBIQUITY" y "MICROTICK" son typos de Ubiquiti y MikroTik.
    - Zyxel aparece en el informe pero no en el brief.
12. **Subte:** la home dice líneas B y C (como el timeline viejo); la ficha de /clientes/ de la web vieja dice C y E.
13. **Cita de Carlos** en la sección Equipo: no tiene fuente escrita y está atribuida como "CEO".
14. **El informe propone "seguridad física" en el H1, el brief prioriza otra cosa.** El brief pone video seguridad y control de acceso como servicio de entrada y outsourcing y mesa de ayuda como prioridad de crecimiento; el H1 propuesto por el informe incluye las tres cosas. No es una contradicción grave, pero el orden del H1 hay que decidirlo.

## 5. Lo que hay que pedirle a Intellihelp para cerrar los textos

1. El año de fundación (2010 o 2012) y los años que se publican.
2. Las provincias reales (10 a 15) y si hay partners o representantes locales, con ciudades.
3. Rango de tamaño que atienden (PC o usuarios), modelo de precio ("abono mensual por puesto desde X"), SLA estándar y horario.
4. Política de datos (Ley 25.326) y qué pasa al terminar el contrato.
5. Qué se hizo en Cartocor, ODI (las 4 sucursales) y Nación Seguros, con año y tecnologías.
6. Qué logos se siguen mostrando (El Cronista, Correo, Gendarmería, GCBA) y el logo de Parques Nacionales.
7. Si sigue vigente el Gold Partner de Huawei y Hikvision, y cuáles certificaciones ITIL y Microsoft se pueden nombrar.
8. Si la primera charla o el diagnóstico es sin cargo.
9. Si Carlos aprueba la cita (o una frase propia) y los cargos que se publican: los del brief.
10. 2 o 3 testimonios con nombre y cargo, o permiso para usar las recomendaciones de LinkedIn.
