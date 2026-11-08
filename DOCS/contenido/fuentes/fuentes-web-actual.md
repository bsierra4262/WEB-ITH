# Fuente: web actual en vivo — www.intellihelp.tech (WordPress + Elementor)

Lo relevé el 22/10/2026 con `curl` sobre los sitemaps (`sitemap_index.xml` → post, page, history_post, template, category, client-types, author): bajé 67 URLs, limpié el HTML y leí también los documentos que la web enlaza (PDF/PPTX en `/wp-content/uploads/`), las imágenes de testimonios (el texto está dentro de la imagen) y la ficha pública de LinkedIn que enlaza el footer.

**Ojo con la vigencia.** Casi todo el contenido es de 2018 a 2023. La home se modificó por última vez el 02/10/2025 (`dateModified` en el JSON-LD), con logos nuevos de clientes y marcas en 2025. "12 años de experiencia" está escrito en 2022: si la fundación fue el 10/03/2010, hoy (oct-2026) son **16 años**.

---

## 1. Identidad de la empresa

| Dato | Valor | Fuente |
|---|---|---|
| Razón social | **INTELLIHELP SA** | Código de Ética PDF, portada (`/wp-content/uploads/2022/10/codigo-de-etica-cb.pdf`) |
| Marca corta | ITH ("Agendá una reunión con un especialista de ITH") | /outsourcing/, /videoseguridad/ |
| Fundación | **10 de marzo de 2010** | /quienes-somos/ (timeline "Nuestra historia") |
| Origen del capital | "De capital de origen nacional, ITH está liderada por profesionales con una amplia trayectoria y conocimiento en el mercado de la Tecnología." | ith-triptico.pdf (enlazado en /servici0s/) |
| Claim | "Tecnología que genera valor" (home y todas las landings); también "Soluciones de alto desempeño tecnológico" | home |
| Claim del tríptico | "CAPITAL HUMANO + KNOW HOW"; "DESARROLLAMOS TALENTOS"; "APRENDEMOS DE CADA DESAFÍO" | ith-triptico.pdf |
| Claim de outsourcing | "Colaborando con la formación de los líderes del futuro" / "Colaboramos con los líderes del futuro brindando outsourcing de TI" | PDF de outsourcing y /outsourcing/ |
| LinkedIn | IT Services and IT Consulting; fundada en 2010; 11-50 empleados (13 en el JSON-LD); tipo Partnership; 2.681 seguidores; sede en CABA, Dorrego 1789, CP 1414 | linkedin.com/company/intellihelp (ficha pública) |
| Especialidades (LinkedIn) | Redes, Recursos Humanos, Service Desk, Soluciones HUAWEI, Desarrollo de Software, Consultoría, Capacitación, IOT, Smart Cities | LinkedIn |
| Dominio anterior | intelihelp.com.ar / info@intelihelp.com.ar (con una sola "l") | ith-triptico.pdf (está desactualizado) |

### Quiénes somos (texto original, para reformular)
- "Intellihelp representa nuestra vocación de ayuda y actitud innovadora presentes en cada servicio prestado."
- "Somos una Empresa Innovadora con amplia experiencia en la gestión de proyectos tecnológicos para empresas privadas y organismos de gobierno." Los PDF y la versión en inglés dicen "empresa joven" en lugar de "Empresa Innovadora".
- "Junto con nuestros Partners Tecnológicos integramos soluciones de alto valor agregado a nuestros clientes, garantizando un TCO óptimo."
- "…convertirnos en un Integrador Estratégico con capacidad de resolver todo el ciclo de negocio."

### Misión, visión y valores (/quienes-somos/ y Código de Ética, revisión de ago-2022)
- **Misión:** "Desarrollar soluciones innovadoras que aporten valor y permitan optimizar los procesos de negocio de nuestros clientes."
- **Visión:** "Destacarnos en el mercado por la calidad de nuestros servicios, la gestión de talentos, y la cercanía con el cliente." El Código agrega el compromiso con estándares "tales como ITIL, ISO9001, y otros". No hay evidencia de certificación ISO: el Código solo los nombra como estándares de referencia.
- **Valores:** la comunicación, los equipos motivados y la calidad humana. El Código desarrolla cada uno: la comunicación "hacia nuestros clientes como internamente", la motivación "para encarar … tecnologías de punta y dentro de un entorno económico cambiante" y el cuidado de que "cada ingreso se identifique con nuestras creencias y nuestros valores".

### Diferenciales y puntos fuertes (aparecen repetidos en varias páginas)
- Home: RAPIDEZ en el armado de soluciones · CONOCIMIENTO en los servicios que desarrollamos · FLEXIBILIDAD para hacer de cada necesidad un servicio a medida · EFICACIA en encontrar la mejor ecuación costo-beneficio · EXPERIENCIA en el armado de soluciones · ALIANZAS ESTRATÉGICAS.
- Home antigua y landing de Huawei Cloud: PROFESIONALES adecuados para cada proyecto · MOTIVACIÓN por los nuevos desafíos, los proyectos exigentes.
- PDFs y PPTX: Experiencia en proyectos llave en mano · Know how con "profesionales certificados en cada tecnología" · Training center · Alianzas estratégicas con los principales fabricantes.
- Diferenciales de outsourcing (/outsourcing/):
  - La calidad del proceso de selección.
  - Los tiempos de búsqueda.
  - La capacitación continua en habilidades duras y blandas.
  - El cuidado de los recursos asignados.
  - "Las mejores tarifas de mercado manteniendo el compromiso en servicio / precio / calidad".
- Banca (/outsourcing-bancos/):
  - "Más de diez años trabajando para el segmento bancario y financiero."
  - "Tenemos experiencia en trabajar con los Bancos más importantes de Argentina."
  - Los bancos de los casos de éxito no tienen nombre: figuran como "Banco Internacional" (Outsourcing de TI) y "Banco Nacional" (Búsqueda de recursos IT).

---

## 2. Cifras

| Cifra | Valor | Fuente | Vigencia |
|---|---|---|---|
| Años de experiencia | 12 | /quienes-somos/ ("Nuestra historia – 12 años de experiencia"); ith-presentacion-institucional.pdf ("Presentación 2022") | 2022. Hoy son 16 desde 2010 |
| Años de experiencia | 11 | intellihelp-servicio-de-outsourcing.pdf; ith-outsourcing-vertical.pptx; ith-video-seguridad.pptx | ~2021/22 |
| Facturación anual | "+200 millones de facturación anual" (sin moneda; se asume ARS) | presentación institucional 2022, PDF de outsourcing, PPTX | 2022. Desactualizada y sensible: no conviene publicarla sin validar |
| Proyectos implementados | "+60 proyectos implementados exitosamente" | ídem | 2022 |
| Cursos e-learning | "más de 50 cursos y talleres disponibles" (plataforma propia ITH-Learn / "Intellihelp Learning") | /quienes-somos/ (hito 2020) | 2020 |
| Oficinas AGIP conectadas | 33 | /quienes-somos/ (2017) | 2017 |
| Plan Sarmiento | "red de fibra óptica de aproximadamente 300 puntos" | /clientes/ | ~2016-18 |
| Red GPON (ASI) | "conectar mil locaciones en topología estrella en un tiempo récord de 4 meses" | /clientes/ | ~2017-18 |
| SLA de ASI | De 5x8 a 7x24, con respuesta máxima de 2 horas ante incidentes | /clientes/ (3 casos de consultoría ASI) | ~2013-18 |
| Inversión del caso de bases de datos ASI | 2,4 millones de pesos anuales | ith-caso-de-exito-gcba-base-datos.pdf | ~2021 (en pesos de entonces) |
| Inversión del caso Huawei Argentina | ~5 millones de pesos; servicio de 2 años | ith-caso-de-exito-huawei.pdf | ~2021 |
| Mantenimiento de la red AGIP | 24 meses | /clientes/ | — |
| Equipo de reconocimiento facial | "hasta 20.000 imágenes" | /control-de-accesos/ | 2021 (es dato del producto) |
| Empleados | 11-50 (LinkedIn); 13 en el JSON-LD de LinkedIn | LinkedIn | actual (dato autodeclarado) |

No aparecen en la web: cantidad de técnicos, cantidad de provincias, clientes activos ni certificaciones ISO.

---

## 3. Historia (timeline de /quienes-somos/, ES y EN coinciden)

| Año | Hito |
|---|---|
| 2010 | **10 de marzo – Fundación** |
| 2012 | Primeras oficinas: Quartier Madero, Puerto Madero |
| 2013 | Primer caso de éxito: Agencia de Sistemas de Información (ASI), GCBA. Outsourcing de mantenimiento de plataformas |
| 2015 | Segundo caso de éxito: ASI. Instalación y tendido de una red de fibra óptica en las líneas de subte B y C |
| 2016 | **Gold Partner de HUAWEI** "para la comercialización de todas sus soluciones" |
| 2017 | Nueva unidad de negocio de soluciones IoT e IIoT |
| 2017 | AGIP: red de fibra óptica para conectar 33 oficinas, mantenimiento correctivo y preventivo, servicio 24/7 con soporte de niveles 1 y 2 |
| 2017 | Senado de la Nación: servidores on-premise con tecnología HUAWEI |
| 2017 | Cablevisión-FiberCorp: consultoría para implementar OpenStack |
| 2017 | Sedronar: storage HUAWEI (OceanStor 2200 V3) |
| 2018 | Ministerio de Educación GCBA: prototipo IoT para medir variables en escuelas de CABA |
| 2018 | **Gold Partner de Hikvision** para soluciones de seguridad |
| 2018 | CAME: app mobile para capacitación a distancia |
| 2018 | ASI: mantenimiento correctivo y preventivo 7x24 de la red de conectividad de escuelas, hospitales y comisarías |
| 2018 | Segundas oficinas: duplican el espacio en el Edificio Mirabilia, Palermo Hollywood |
| 2019 | Unidad de negocio de Energías Renovables, con tecnología HUAWEI |
| 2019 | Bodega en el Valle de Uco (Mendoza): solución on-grid de energía solar. La bodega no tiene nombre en la web |
| 2020 | Nueva unidad de negocio de soluciones Cloud con HUAWEI (HUAWEI Cloud) |
| 2020 | Plataforma de e-learning nueva, con más de 50 cursos y talleres |
| 2021 | El Cronista Comercial: solución integral de seguridad Hikvision |
| 2022 | Lojack: mesa de ayuda en las oficinas del cliente (nivel 1, "One-Site", según la presentación) |
| 2022 | Pfizer: outsourcing de TI |

**Entradas del CPT `history_post` (/history/…).** Son 9 entradas, todas fechadas el 06/02/2018 salvo "Mudanza nuevas oficinas" (27/03/2019). El autor es "Kanerito". No tienen cuerpo de texto, solo título y subtítulo:
- Fundación
- Primer negocio: "Outsourcing de mantenimiento de plataformas ASI"
- Primeras oficinas
- Segundo negocio: "Instalación y tendido de FO en línea de subterráneo B y C"
- Nuevas oficinas Puerto Madero
- Negocio Sedronar
- Plan Sarmiento: "Conexión de Escuelas de la Ciudad de Buenos Aires con tecnologías FTTH y GPON"
- Consultoría CAME
- Mudanza nuevas oficinas (2019)

Los tipos de cliente (`/client-types/01/` y `/02/`) están vacíos.

**Mudanzas.** Las oficinas pasaron de Puerto Madero (2012) a Mirabilia en Palermo Hollywood (2018-19). Hoy la dirección es Dorrego 1789, piso 6, of. 604 (Palermo, CABA, CP 1414), que según su ubicación sería el Edificio Mirabilia (esto es una inferencia). La web nunca dice explícitamente que Dorrego 1789 sea Mirabilia.

---

## 4. Servicios (/servici0s/ — la URL tiene un cero; también servicios-antigua)

**Servicios de Outsourcing** (Outsourcing de personal de TI, Desarrollo de aplicaciones, Consultorías, Service Desk, Búsqueda de personal)
- Outsourcing TIC: "armado de equipos de trabajo con profesionales calificados … aportando la supervisión, el control, y el espacio físico si es requerido, en forma 'Cross' a los diversos estándares tecnológicos vigentes".
- Reclutamiento y selección con psicodiagnóstico laboral, inducción en el cliente y capacitación continua.
- Proceso distintivo (PDF de outsourcing):
  - Herramientas específicas de búsqueda.
  - Preselección por screening telefónico y videollamada.
  - Selección presencial con analistas en psicodiagnóstico laboral.
  - Informe de entrevista para el cliente.
  - Acompañamiento en entrevistas.
  - Encuestas de inicio y de salida de cada recurso.
  - Inducción en el cliente y en ITH, con "Kit de bienvenida de INTELLIHELP".
  - Coaching proactivo.
  - Asistencia técnica y psicológica de los recursos asignados.
  - People Care.
  - Feedback continuo del cliente.
  - Modelo "Triángulo virtuoso": co-responsabilidad, capacitación, anticipación y excelencia.
  - "equipo de selectoras de IT", con una "amplia red de contactos" y "amplia base de datos de candidatos ya trabajada".
  - Para clientes: sistema de registro de incidentes y app mobile de seguimiento del servicio.
- Recursos en nómina del cliente: acompañamiento y contención coordinados con los líderes del cliente.
- Soluciones técnicas llave en mano, desde el relevamiento hasta el mantenimiento correctivo y preventivo.
- **Service Desk:** mesa de ayuda y soporte de infraestructura por niveles de atención, "llave en mano", con SLA y OLA y consultoría ITIL. Puede prestarse "en las oficinas del cliente o en nuestras instalaciones".

**Búsqueda de recursos:** búsqueda de personal, executive search (altos mandos) y assessment centers. "Nuestro equipo de selección posee procesos depurados y certificados".

**Consultoría:** procesos de negocio (ITIL, COBIT, que la web escribe "COBIS", metodologías ágiles, calidad), gestión de proyectos PMI/PMO, planes de negocio, planes estratégicos y planes estratégicos de IT.

**Desarrollo de apps / Software Factory**
- Sistemas real time para alto volumen de transacciones financieras: "sistemas de 'Postnet' y software a nivel capa de red", con pruebas de estrés.
- Soluciones mobile: PDAs de recolección de datos en la industria energética, control de inventario y stock, apps de consulta y dashboards para tablets.
- Sistemas transaccionales a medida "en diversas industrias tales como alimentos, laboratorios, seguros, medios de comunicación, finanzas, energía".
- Time & Material ("Software factory").
- Desarrollo de aplicaciones: Tunning, Arquitectura TI, Best practices, Capacitaciones y mentoring, Auditorías y métricas.
- La presentación de 2022 detalla la Software Factory: consultoría (gestión de productos y proyectos, ingeniería de software, ágiles), desarrollo llave en mano (arquitectura, calidad, DevOps, UX, Google HEART, análisis de datos, automatización L1/L2) y soporte de aplicaciones ITIL (incidentes y problemas).

**Capacitación / Training Center**
- Plataforma e-learning propia "ITH-Learn", con cursos presenciales y virtuales.
- Talleres de aplicación práctica: transferencia de conocimiento y team building.
- Acuerdos con universidades.
- "plantel de docentes calificados" para cursos ad-hoc.

---

## 5. Soluciones (/soluciones/ y landings)

- **HUAWEI** (Gold Partner desde 2016): redes empresariales, redes empresariales ópticas (OptiX), almacenamiento (OceanStor), redes inalámbricas, HUAWEI Cloud y seguridad de red. La presentación de 2022 distingue un frente para Sector público (nube, LTE, acceso GPON, Smart City, energías renovables, networking, data center, servidores y storage) y otro Enterprise (switches, routers, WLAN, servers, storage, cloud, data center, energías renovables).
- **HIKVISION** (Gold Partner desde 2018):
  - Control de acceso biométrico y convencional.
  - Control de temperatura y uso de barbijo.
  - Videovigilancia IP.
  - Seguridad con drones.
  - Cercos perimetrales.
  - Tótems de seguridad.
  - Reconocimiento facial y de patentes con IA.
  - Parking inteligente.
  - Portería para consorcios.
  - Rayos X y detección de metales y armas.
  - Plataforma HikCentral.
- **Videoseguridad** (/videoseguridad/): "nos encargamos de todo". Proveen cámaras, NVR, switch y cableado; instalan, configuran y capacitan al personal. Hay dos casos con nombre: **El Cronista** y **Universidad del Litoral**.
- **Control de accesos** (/control-de-accesos/): ingreso contactless por reconocimiento facial con cámara dual anti-foto, pantalla táctil y hasta 20.000 imágenes. Promete prevenir la sustitución de asistencia. La landing es del contexto COVID ("evita el contagio").
- **IoT:** integración con asistentes (Siri, Alexa, Google, Cortana), protocolos WiFi, LoRa, LoRaWAN, Bluetooth y TCP/IP, plataforma en la nube con indicadores en tiempo real. La "S. Inteligentes" del brochure incluye smart house y smart farming.
- **Redes FTTH**: GPON y PON.
- **Acceso:** CATV, HFC, 3-play, IPTV, VoIP y CDN.
- **Enlaces inalámbricos:** radioenlaces y microondas SHF.
- **Seguridad integral de red:** NGFW, DDoS, email y web security, control de contenidos.
- **Data center:** hiperconvergencia, SDN, servers y switches.
- **Cloud:** privada, pública e híbrida (Huawei Cloud Stack con integración a AWS y Azure), orquestación y automatización.
- **Energías renovables / eficiencia energética** (unidad de negocio desde 2019): solar on-grid, off-grid e híbrida llave en mano, eólica, Fusion Module 5000, datacenter modular Huawei, asesoramiento en subsidios. El PPTX de eficiencia energética suma consultoría (huella de carbono, factibilidad, cálculo de repago, ISO 50001, IPMVP) y "forman parte de nuestras iniciativas de Responsabilidad Empresaria". Casos con potencia (PPTX):
  - Offal Exp.: 250 kWp, Burzaco.
  - PEALCO: 15 kWp, CABA.
  - Craveri: 50 kWp, CABA.
  - Autonomía de telecomunicaciones en Corrientes.
- **Landing de HUAWEI Cloud** (/soluciones-cloud-huawei/, 2020): pago por uso, baja latencia, soporte en español, data center local con acceso global y cumplimiento de la legislación local. Trae el dato "Para 2021, el 67% de la infraestructura…", que ya quedó viejo.

---

## 6. Casos de éxito con detalle (/clientes/ + presentación institucional 2022 + PDFs de caso)

**ASI – Agencia de Sistemas de Información, GCBA** (es el cliente ancla)
1. *Consultoría en gestión de sistemas operativos*:
   - Instalación, administración, monitoreo, actualizaciones y base de conocimiento.
   - El servicio pasó de 5x8 a 7x24, con respuesta máxima de 2 h.
   - Logro: bajar la tasa de incidentes.
   - Tecnologías: VMware ESX y vCenter, Linux, zLinux, z/VM, Windows Server 2003/2008.
2. *Consultoría en administración de bases de datos*:
   - Mismo esquema 7x24 y 2 h.
   - Tecnologías: Oracle Database 12c, Secure Backup, ZDLRA, RAC, Active Data Guard y GoldenGate.
   - Inversión: 2,4 M$ anuales (PDF).
3. *Consultoría en administración TSM*:
   - Storage high-end Hitachi/IBM, IBM Tivoli Storage Manager 5.x/6.x, IBM TS3500 y VTL.
   - Políticas de backup con pruebas periódicas de recupero.
4. *Red de fibra en las líneas de subte C y E*. El timeline dice **B y C**: ver contradicciones.
   - Cierre del anillo de FO del GCBA conectando dependencias críticas como el Cementerio de la Recoleta y el SAME.
   - Presupuesto limitado y plazos acotados. Se entregó el final de obra "en forma anticipada".
   - FO monomodo de 12/24/48 hilos, aérea.
5. *Plan Sarmiento*: conectividad por FO para establecimientos de los Ministerios de Educación, Justicia y Seguridad y Salud de la Zona 1 de CABA. Unos 300 puntos "en tiempo récord".
6. *Dependencias AGIP*: conexión de las dependencias de AGIP a la red de FO del GCBA y mantenimiento por 24 meses.
7. *GPON Network*:
   - Red privada GPON Huawei para todos los establecimientos educativos, de salud y de seguridad de CABA.
   - Mil locaciones en topología estrella en 4 meses.
   - Equipos: ONT HG8245H y OLT SmartAX MA5608T (en la web figura como "AXNA5608T").
8. *Anillo*: cierres de anillo de la red de FO del GCBA, ampliación del despliegue, relevamiento y documentación de la ingeniería.
- La presentación de 2022 suma para el GCBA (ASI): outsourcing de perfiles multiplataforma, app para turneros, red core con networking Huawei y mantenimiento 7x24 de la red GPON "de todas las delegaciones de la CABA".

**Otros casos con nombre** (presentación institucional 2022, "Casos de negocio", salvo donde se indica)
- **Sedronar:** storage Huawei OceanStor 2200 V3, el primero de ese estándar en el organismo (/clientes/).
- **Senado de la Nación:** provisión e instalación de servidores Huawei.
- **Ministerio de Salud GCBA:** provisión, instalación y configuración de switches HUAWEI core y de borde para la Red de Hospitales.
- **Ministerio de Educación GCBA:** prototipo IoT en escuelas (2018, timeline).
- **Huawei Argentina:** outsourcing de gestión técnica de negocios, con soporte de preventa en la oficina del cliente para proyectos de gobierno (acceso, networking, procesamiento de datos, seguridad, comunicaciones). Duró 2 años e implicó unos 5 M$ (PDF de caso).
- **Cablevisión / FiberCorp:** implementación y consultoría de OpenStack.
- **CAME:** consultoría para desarrollar una app mobile de e-learning.
- **El Cronista:** diseño, implementación y mantenimiento de videovigilancia y control de accesos HIKVISION.
- **Lojack:** mesa de ayuda nivel 1 "One-Site".
- **Pfizer:** outsourcing de TI.
- **MSD (Merck Sharp & Dohme):** outsourcing de mesa de ayuda TI. En /outsourcing/ figura como "laboratorio internacional".
- **Ituran:** solución IoT de tracking de personas.
- **Los Noques:** diseño de una solución de energías renovables.
- **Los Cardales (country):** luminarias LED para la zona de parques.
- **Sophenia:** catálogo de vinos digital en la nube.
- **Universal Credit:** sistema en la nube para gestionar microcréditos.
- **Nic.ar:** sistema de administración y gestión de dominios.
- **Boletín Oficial:** sistema para la administración del BORA.
- **Petropack:** sistema IIoT automatizado de arranque y parada de laminadoras.
- **Reckitt Benckiser:** sistema de patrimonio y suministros.
- **Asociación Argentina de Golf:** sistema integral en la nube.
- **Gestión Compartida:** búsqueda de recursos IT.
- **Grupo Libertad:** búsqueda y selección de personal IT. Las búsquedas de 2022 del blog corresponden a este cliente (Córdoba, Grupo Éxito).
- **Avalian:** búsqueda y selección de personal IT.
- **Universidad del Litoral:** videoseguridad (/videoseguridad/, solo título).

---

## 7. Clientes por sector (logos con alt en home y /clientes/)

- **Sector público nacional:**
  - Senado de la Nación.
  - Sedronar.
  - Télam.
  - Boletín Oficial.
  - SRT (Superintendencia de Riesgos del Trabajo).
  - APN (Administración de Parques Nacionales).
  - Correo Argentino.
  - Gendarmería Nacional.
  - Nic.ar.
- **Gobierno de la Ciudad de Buenos Aires:**
  - Ciudad de Buenos Aires.
  - ASI.
  - AGIP.
  - Ministerios de Educación, Salud y Cultura.
  - BA Salud.
  - Museo Moderno.
- **Cámaras y asociaciones:** CAME, AAG (Asociación Argentina de Golf).
- **Salud, laboratorios y obras sociales:** Pfizer, Laboratorio Bagó, Medifé, Avalian, OSDIPP, ASE Nacional y MSD (en un caso).
- **Seguros y finanzas:** Nación Seguros, Universal Credit, Sistran, Gestión Compartida, más bancos sin nombre.
- **Telecomunicaciones, medios y tecnología:** Cablevisión-Fibertel, El Cronista, Télam, Global Hitss, Huawei, Mymtec ("Myntec" en el archivo), Strix.
- **Seguridad y rastreo:** Lojack, Ituran.
- **Industria, consumo y retail:** Reckitt Benckiser, Petropack, Spec Chem, Beilox, Grupo Libertad, Eve Joyerías, Gemez, Ayassa Fombella, Sophenia.
- **Real estate y countries:** Los Cardales Country Club, Los Noques.
- **Logos sumados en 2025** (fuera del carrusel principal): OCRL, Dahua Technology, Zyxel y MikroTik. Dahua, Zyxel y MikroTik parecen marcas o partners más que clientes. Hay que confirmarlo.

---

## 8. Partners y vendors (/partners-y-vendors/, todos son logos sin texto)

- **Socios tecnológicos:**
  - Infraestructura: Huawei, Hikvision, Cisco, Furukawa, Panduit, Grandstream, Ubiquiti, Aruba, APC, Dell, HP, HPE, Lenovo, Samsung.
  - Software y plataformas: Intel, Microsoft, Apple, Digifort, Multitech, Selnet, SolutionBox, Security One, Tecnocode, Itokii, Bring, Efergia, FIESA, Clean Energy.
- **"Nuestras tecnologías":** Android, Apple, GNU/Linux, Microsoft Partner, Node.js, Office, Power BI, SharePoint, SQL Server, SUSE, TFS, Unity, Visual Studio, Vuforia, Windows, Azure, Xamarin.
- **Aliados estratégicos** en las landings y PDFs de caso: Huawei, Solution Box y Soluciones Enterprise.
- **Categorías declaradas:** Gold Partner de HUAWEI (2016) y Gold Partner de Hikvision (2018). No se encontró otra certificación formal.

## 9. Cobertura y presencia
- "Presencia regional a través de partners": Buenos Aires, Montevideo, Santiago, Lima, Bogotá y Miami (PPTX y PDF de outsourcing). La home tiene una sección "REGIONES – Intellihelp global" con un video de mapamundi.
- Energía: "Soluciones escalables instaladas en cualquier lugar del país" (/soluciones/). Hay casos en CABA, Burzaco, Corrientes y Mendoza (Valle de Uco).
- La web no menciona cantidad de provincias.

## 10. Equipo y personas
- La web no tiene página de equipo ni nombres de directivos.
- Aparece "Yanina Brea" en el slug de una landing de webinar: `/webinar-claves-outsourcing-tecnologico-2022-yanina-brea/` ("Claves del outsourcing tecnológico 2022"). Su rol no figura.
- El Código de Ética está "Elaborado por Recursos Humanos y Dirección", con última revisión en agosto de 2022.
- **Carrera y talento:**
  - Universidades (/universidades/): "Nuestros empleados cuentan con un plan de carrera individualizado con un sistema de movilidad entre distintos proyectos y clientes"; "reuniones mensuales de desempeño y evolución".
  - Acuerdo con el **ITBA**: patrocinio de las tesis de estudiantes de la Licenciatura en Administración y Sistemas.
- **Búsquedas publicadas en 2022 (blog):**
  - Puestos: Analista de Plataformas, Arquitecto de Soluciones, Developer Java/Angular, Java/.Net, Java SSR/SR, Node Senior, Android Senior, iOS Sr/Ssr, Analista BI, Analista Funcional, QA y Analista Desarrollador.
  - Uno de los clientes es una empresa de cobranzas y pagos "con más de 30 años" y "el sólido respaldo de tres de los bancos más importantes" (proyectos E-cheq y FCE). La web no da su nombre.
  - Trabajo 100 % remoto para toda la Argentina.
- **Testimonios** (imágenes en /soluciones-cloud-huawei/, 2020):
  - **Roberto Demarco**, Project Lider en Tecnet S.A.: "En Intellihelp, son excelentes Profesionales no solo a nivel técnico si también a nivel humano. He trabajado con ellos en diferentes Proyectos de altísima complejidad técnico-ejecutiva resultando exitosos."
  - **Octavio Trocca**, Jefe Comercial en Sanatorio Finochietto: "…fueron durante mas de un año, a quienes reporte en forma directa. Son líderes nato, que dan ordenes claras, y poseen un excelente manejo de grupo humano… Son profesionales, que no solo permiten trabajar sino aprender día a día."
  - **Raúl Leonardo D'Angelo**, Director Regional en Grupo Arquinec: "En Intellihelp son excelentes profesionales, constantes en sus objetivos, buenos compañeros y muy creativos… por sobre todo lo expuesto son grandes seres humano."
  - **Fabián Sagaro**, socio de SETYCOM (en inglés): "I strongly recommend Intellihelp, first of all because they are such good people. They are the ones you can always trust. As professionals, they are proactive, responsible and open-minded…"
  - **Alberto Cid**, Director en MaC Group Efficiency Improvement (en inglés): "At Intellihelp they have initiative, creativity and ability to deliver projects on time and manner…"

## 11. Contacto

| Canal | Valor | Fuente |
|---|---|---|
| Dirección | Dorrego 1789, piso 6, of. 604, Palermo, CABA (CP 1414 según LinkedIn), Buenos Aires, Argentina | footer y /contacto/ |
| Teléfono (web) | +54 11 7700-6868 | /contacto/ ("+54 1177006868") |
| Teléfono (PDF y PPTX) | (+54 11) 3886-0462. La presentación institucional dice "+54 1139860462" | PDFs y PPTX (ver contradicciones) |
| WhatsApp (botón flotante actual, en 67 páginas) | +54 9 11 5027-4827, con mensaje predefinido "Hola!, quisiera consultar por …" | plugin Click-to-Chat (ht_ctc) |
| WhatsApp (viejo) | +54 9 11 3374-6956 | /soluciones-cloud-huawei/ y PDFs |
| Mails | info@intellihelp.tech, rrhh@intellihelp.tech (footer); contacto@intellihelp.tech (PDFs) | — |
| Agenda | calendly.com/intellihelp/30min ("Agendá una reunión con un especialista de ITH") | landings |
| Redes | linkedin.com/company/intellihelp · facebook.com/Intelihelp · twitter.com/intelihelp | footer |
| Diseño de la web actual | Barco Design Studio, "Copyright © 2018" | footer |

## 12. Código de Ética (resumen)
- Tres principios: trato digno y seguro a los empleados, respeto por el medio ambiente y relaciones comerciales libres de corrupción y prácticas ilegales.
- Criterios: trabajo infantil, trabajo forzoso, acoso, discriminación, libertad de asociación y negociación colectiva, jornada, remuneración, higiene y seguridad, corrupción, lavado de activos, medio ambiente y protección animal.

## 13. Contradicciones y cosas a revisar
1. **Líneas de subte.** El timeline (2015) y el history_post dicen "líneas B y C". La ficha del caso en /clientes/ dice "Red de fibra líneas de subtes **C y E**", y su descripción habla del Cementerio de la Recoleta y el SAME, no del subte.
2. **Años de experiencia.** Hay 11 en algunos PDF y PPTX y 12 en la web y la presentación de 2022. Desde 2010 hoy son 16.
3. **Teléfonos.** La web dice +54 11 7700-6868. Los PDF y PPTX dicen (011) 3886-0462 y la presentación institucional "+54 1139860462", lo que sugiere un error de tipeo en uno de los dos. Además hay dos WhatsApp distintos: 11 5027-4827 (actual) y 11 3374-6956 (viejo).
4. **"Empresa joven" (PDFs) vs "Empresa Innovadora" (web).** La web ya corrigió esa frase.
5. **2020.** El timeline repite "Desarrollamos la unidad de negocios de Energías Renovables" en 2019 y 2020, y en 2020 la pega al texto de la plataforma e-learning: es un error de carga.
6. **Puntos fuertes.** Cambian según la página: Experiencia, Know how, Training center, Alianzas, Profesionales, Motivación. No hay una lista única.
7. **COBIS.** La web escribe "COBIS"; probablemente quiso decir COBIT.
8. **ISO9001.** El Código de Ética lo menciona como estándar de referencia, pero no hay certificación declarada en ninguna parte.
9. **Logos de 2025.** Dahua, Zyxel y MikroTik aparecen en el carrusel de "Clientes – Confían en nosotros" pero son fabricantes. Probablemente son marcas que comercializan, no clientes.
10. **Dominio.** El tríptico usa intelihelp.com.ar e info@intelihelp.com.ar (una sola "l"); hoy es intellihelp.tech.
11. **Vigencia de cifras.** "+200 millones de facturación" y "+60 proyectos" son de 2022, sin moneda ni fecha de corte.
12. **"Bancos más importantes".** En los casos de banca no hay ningún banco con nombre, así que no se puede citar ninguno.
