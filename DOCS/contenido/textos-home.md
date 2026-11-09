# Textos nuevos de la home de Intellihelp (versión final)

Versión final del 22/10/2026. Dos criterios: **datos** (cada afirmación tiene fuente y no dice más de lo que la fuente dice) y **tono y SEO** (sin frases copiadas o casi copiadas de la maqueta, ideas repetidas ni palabras genéricas). Cuando chocaron, ganó el dato.

El PDF de diseño (`home-intellihelp-2026-10.pdf`) define **qué bloques hay y cuánto espacio ocupan**. Los textos salen de la información real de Intellihelp: la web vieja (intellihelp.tech), la base del WordPress, los PDF de casos y presentaciones de 2021-2022, el brief que completó la empresa, el kickoff y el LinkedIn de Brian. De la maqueta solo quedan los rótulos funcionales ("Agendá una reunión", "Preguntas frecuentes", los nombres del menú).

## Estado al 30/10/2026

Este documento quedó como registro de cómo se escribió la home. **El texto que vale es el de `src/partials/` e `index.html`**: varios puntos de acá cambiaron después con las respuestas de Intellihelp, y no los voy a reescribir todos. Lo que cambió desde la versión del 22/10:

- **Decisión 1:** el sitio usa 2012 y 14 años (`site.since` y `site.years`). Ya se publican todos los textos con esos tokens.
- **Decisiones 2, 3 y 5:** los clientes vigentes van en presente, Gold Partner de Huawei y de Hikvision también, y la cifra quedó en "+20 contratos adjudicados por organismos públicos".
- **Medifé** no va ni en la cinta ni en la línea de clientes: tiene un NDA firmado y solo se puede contar sin nombre (`fuentes-drive-clientes.md`).
- **UNL, Offal y Corrientes** salieron de todo el sitio (ver la tabla de resueltos de `pendientes-contenido.md`).
- **Horario:** de lunes a viernes, de 8 a 18 (`site.horario`).
- **Cierre:** la banda de agenda suma una fila que lleva a `/diagnostico/`, la landing de la reunión con Carlos.

Lo que sigue abierto está en `DOCS/contenido/pendientes-contenido.md`, ordenado por persona.

## Cómo leer este documento

- Cada texto está listo para pegar. El largo máximo va entre paréntesis, en caracteres con espacios, y respeta el bloque actual de `src/partials/` para no romper el layout. Todos los textos de este documento se midieron y entran en su máximo.
- `[fuente: …]` va al final de cada afirmación concreta. **No se pega en la página.**
- `{{PENDIENTE: …}}`: falta un dato. Ese texto no se publica hasta tenerlo; cuando se puede, va también una versión sin el dato.
- `{{CONFIRMAR CON DIRECCIÓN: …}}`: el dato es real, pero es sensible o puede no estar vigente (clientes perdidos, clientes que no sabemos si siguen, certificaciones, frases firmadas por una persona).
- `{{site.years}}` y `{{site.since}}` son variables de `src/data/site.json`. **Ningún texto que las use se publica hasta que Dirección cierre la decisión 1.**
- Criterio de escritura: "IT" siempre (no "TI"), voseo, cargos en minúscula salvo la inicial, "posventa" sin espacio, y el cliente se escribe "grupo LoJack-Strix" (en el alt del logo, "Strix, grupo LoJack").
- Los datos que faltan están también, en lenguaje simple y con a quién preguntar, en `DOCS/contenido/pendientes-contenido.md`.

Siglas de las fuentes (todas en `DOCS/contenido/` o `DOCS/diseno/`):

| Sigla | Archivo |
|---|---|
| WEB | `fuentes-web-actual.md` (intellihelp.tech: /quienes-somos/, /clientes/, /outsourcing/, /videoseguridad/, etc.) |
| PDF-OLD | `fuentes-pdfs-old.md` (presentación institucional 2022, casos de éxito 2021-2022, brochures) |
| WP | `fuentes-wordpress-db.md` (base de datos del WordPress viejo) |
| PPTX-EE | `ith-eficiencia-energetica.pptx` (presentación de eficiencia energética, en `DOCS/wordpress-anterior/wp-content/uploads/2023/01/`) |
| BRIEF | `DOCS/marketing/brief-intellihelp.pdf`, completado por Intellihelp (manda sobre todo lo demás) |
| INF | `DOCS/marketing/informe-visibilidad-web-ia-2026-10.pdf` |
| KICK | `DOCS/marketing/kickoff-plan-90-dias.pdf` |
| LI-BRIAN | `fuentes-linkedin-brian.md` |

---

## 0. Decisiones que hay que tomar antes de publicar

1. **Año de fundación y años de trayectoria.** La web vieja fecha la fundación el **10 de marzo de 2010** [fuente: WEB /quienes-somos/ timeline; WP posts#1770 y history_post#202]. El kickoff habla de 14 años [fuente: KICK p.2], la web vieja decía "12 años de experiencia" en 2022 y el informe lo deja "A DEFINIR" [fuente: INF p.25].
   - Recomendación: `since` = **2010** y `years` = **16**, porque es el dato documentado. `{{CONFIRMAR CON DIRECCIÓN}}`
   - Hasta que se confirme, **no se publica ningún texto con `{{site.years}}` ni `{{site.since}}`**: header, H1, número de Historia, meta, og:title y footer.
   - Primera oficina: el timeline de la web en vivo dice **2012** (Quartier Madero) y una entrada vieja del WordPress dice 2013 [fuente: WP history_post#204]. Se usa 2012, que es lo que la web muestra hoy.
2. **Vigencia de los clientes "de hoy".** El brief nombra a SRT, Parques Nacionales y el grupo LoJack-Strix entre sus mejores clientes "de hoy o de antes", en la misma lista que el GCBA, que ya se perdió [fuente: BRIEF §7 y §11]. No hay una fuente que diga que siguen en 2026. Por eso ningún texto dice "hoy trabajamos para…": dicen "clientes como…" o "lo hicimos para…". Si Dirección confirma cuáles siguen, se puede volver al presente. `{{CONFIRMAR CON DIRECCIÓN}}`
3. **"Gold Partner de Huawei y de Hikvision".** Es real como hecho histórico (Huawei 2016, Hikvision 2018) [fuente: WEB /quienes-somos/; WP posts#1770], pero el brief no lo menciona y no se sabe si sigue vigente. Queda solo en la historia, con su año. Si sigue vigente, vuelve al hero y al footer. `{{CONFIRMAR CON DIRECCIÓN}}`
4. **Clientes perdidos.** El GCBA (y con él la ASI y la AGIP), El Cronista, Gendarmería y Correo Argentino ya no son clientes [fuente: BRIEF §11]. En los textos el GCBA aparece solo como **proyecto realizado**, en pasado. El Cronista no aparece en ningún texto. Gendarmería y Correo Argentino quedan fuera de la cinta de logos.
5. **"+40 licitaciones".** El brief dice "más de 40 licitaciones participadas, ganadas y ejecutadas correctamente" [fuente: BRIEF §15.5.3]: no queda claro si las 40 se ganaron. Por defecto la métrica dice "en organismos públicos", sin decir "ganadas". `{{CONFIRMAR CON DIRECCIÓN: ¿más de 40 ganadas y ejecutadas?}}`
6. **Certificaciones.** El brief dice "certificaciones en todos los partners" [fuente: BRIEF §15.5.1], pero lo único documentado son las certificaciones y cursos de una persona (Brian) [fuente: LI-BRIAN]. Por eso los textos dicen "marcas con las que trabajamos" y no "equipo certificado en 21 marcas". `{{CONFIRMAR CON DIRECCIÓN: certificaciones vigentes por marca}}`
7. **Cargo de Brian.** Va el de su LinkedIn, "Jefe de sistemas e infraestructura IT", porque es posterior al brief [fuente: LI-BRIAN]. El brief decía "Responsable de Servicio a Clientes" [fuente: BRIEF §1.2].
8. **Datos que se sacaron por no tener fuente:** "+12 provincias", "partners en Mendoza, Salta y Rosario", la cita de Carlos de la maqueta, "la primera charla es sin cargo", la mudanza a Palermo como hito, la "primera" instalación solar y el seguimiento mensual de desempeño como servicio vigente.

---

## 1. Metadatos (`index.html`)

**`<title>`** (máx. 60)
> Servicios informáticos para empresas en CABA | Intellihelp

(57) [fuente: INF p.8 y p.24: keyword "servicios informáticos", marca, servicio y ciudad]

**`meta description`** (máx. 155)
> Soporte IT para empresas, mesa de ayuda tercerizada, outsourcing IT e instalación de cámaras de seguridad y control de acceso. En CABA desde {{site.since}}.

(145 con `since` = 2010) [fuente: BRIEF §3 y §4; INF p.9-15 (keywords "soporte IT para empresas" e "instalación de cámaras de seguridad"); WEB fundación 2010 (decisión 1)]

**`og:title`** (máx. 70)
> Intellihelp | Servicios IT para empresas y organismos desde {{site.since}}

**`og:description`** (máx. 200)
> Empresa argentina de servicios informáticos: mesa de ayuda, outsourcing IT, redes, fibra, cámaras de seguridad y control de acceso para empresas y organismos públicos. Staff en Palermo, CABA.

(193) [fuente: BRIEF §1.1, §1.2 y §4; WEB /contacto/ (Dorrego 1789)]

**JSON-LD (notas para quien lo edite, no es texto visible)**
- `foundingDate`: "2010-03-10" `{{CONFIRMAR CON DIRECCIÓN}}` [fuente: WEB /quienes-somos/]
- `legalName`: "INTELLIHELP SA"; `taxID`: "30-71140975-7" [fuente: WEB código de ética; INF p.26]
- `telephone`: "+54 11 7700-6868"; dirección "Av. Dorrego 1789, piso 6, oficina 604, C1414CKM, CABA" [fuente: INF p.4; site.json]
- `description` (máx. 300): "Intellihelp (INTELLIHELP SA) es una empresa argentina de servicios informáticos con sede en Buenos Aires, fundada en 2010. Presta soporte IT, mesa de ayuda, outsourcing IT, redes, fibra óptica, data center, cámaras de seguridad y control de acceso a empresas y organismos públicos." (275) [fuente: BRIEF §1.1 y §4]
- `disambiguatingDescription`: "No tiene relación con IntelliHelp SpA de Chile." [fuente: INF p.3 y p.15, homónimo]. Va acá y no en `description`, que es lo que Google y las IA usan como resumen de la empresa.

---

## 2. Header

| Elemento | Texto | Largo máx. | Fuente |
|---|---|---|---|
| Etiqueta junto al logo | `Servicios IT` / `CABA · {{site.since}}` | 2 líneas de 14 | WEB /contacto/ y fundación 2010 (decisión 1). La segunda línea suma la ciudad, que ayuda al SEO local |
| Nav 1 | Servicios | 12 | estructura |
| Nav 2 | Historia | 16 | estructura |
| Nav 3 | Equipo | 12 | estructura |
| Nav 4 | Casos | 12 | estructura |
| Nav 5 | Preguntas | 12 | estructura |
| CTA | Agendá una reunión | 20 | INF p.17 (CTA "Agendá la reunión") |
| aria-label del menú móvil | Abrir menú / Cerrar menú | — | — |

---

## 3. Hero

**Título H1** (3 renglones; máx. 40 + 40 + 20)
> Servicios informáticos para empresas
> y organismos públicos de Buenos Aires,
> **desde {{site.since}}.**

[fuente: INF p.8 y p.24 (un solo H1 con "servicios informáticos"); BRIEF §1.1 y §6 (sector privado y organismos públicos) y §13 (todos los clientes son de Buenos Aires)]. La idea de "personas con nombre" ya no va en el H1: la desarrolla la sección Equipo.

**Bajada** (máx. 240)
> Soporte IT y mesa de ayuda tercerizada con profesionales propios, redes y fibra, e instalación de cámaras de seguridad y control de acceso, para empresas y organismos con sede en Buenos Aires y operaciones en el interior.

(218) [fuente: BRIEF §3 (servicio de entrada: videoseguridad y control de acceso; recurrentes: outsourcing y mesa de ayuda con personal en nómina de ITH), §4 y §13 (clientes de Buenos Aires con cobertura en provincias)]

Variante con clientes, solo si Dirección confirma que siguen vigentes (decisión 2):
> Soporte IT y mesa de ayuda tercerizada, redes y fibra, e instalación de cámaras de seguridad y control de acceso. Clientes con sede en Buenos Aires, como la SRT, Parques Nacionales y el grupo LoJack-Strix.

(203) [fuente: BRIEF §7] `{{CONFIRMAR CON DIRECCIÓN: vigencia}}`

**Botones**
- Principal: `Agendá una reunión →` [fuente: INF p.17]
- Secundario: `Conocé al equipo` (lleva a #equipo)

**Nota bajo los botones** (máx. 90)
> Te atienden Carlos, Nicolás y el resto del equipo desde Av. Dorrego 1789, Palermo.

(82) [fuente: BRIEF §1.2 (staff); KICK p.2 (Carlos y Nicolás, contactos comerciales); WEB /contacto/]

**Métricas** (número máx. 14; rótulo máx. 45)

| Número | Rótulo | Fuente |
|---|---|---|
| `+60 proyectos` | implementados para empresas y organismos | PDF-OLD presentación 2022 y WP contador 2023 ("+60 proyectos implementados exitosamente"). Es la cifra de 2022: sigue siendo cierta como mínimo. `{{PENDIENTE: cifra actualizada}}` |
| `+40 licitaciones` | en organismos públicos | BRIEF §15.5.3. Si Dirección confirma que las 40 se ganaron, el rótulo pasa a "ganadas y ejecutadas en organismos públicos" (43). `{{CONFIRMAR CON DIRECCIÓN}}` |
| `21 marcas` | con las que trabajamos, de Huawei a Fortinet | BRIEF §5 ("la constelación de marcas con las cuales trabajamos y estamos certificados") y §5.1 (lista de 21). No dice "certificado" hasta cerrar la decisión 6 |

Los años ya no van en las métricas: están en el H1, en la etiqueta del header, en el número de Historia y en el footer. Los contadores animados cuentan hasta 60, 40 y 21 con el "+" fijo en los dos primeros.

**Nota "ACÁ VA IMAGEN"** (solo para desarrollo, no se publica)
> El staff en la oficina de Av. Dorrego 1789: Carlos, Nicolás, Laura, Lisandro, Brian, Alejandro y Raúl. Luz natural, trabajando.

---

## 4. Logos de clientes

**Título** (máx. 60)
> Organismos y empresas que eligieron a Intellihelp

(49) [fuente: BRIEF §7 y §11. El pasado "eligieron" es honesto con los clientes que ya no están]

**Sectores** (5 rótulos, máx. 28 cada uno)
- Sector público
- Seguros y salud
- Laboratorios
- Industria y consumo
- Seguridad vehicular

[fuente: INF p.19 (sector público, seguros, bancos y laboratorios); logos de WEB y WP]. "Medios" se sacó: sin El Cronista, ningún cliente del bloque lo respalda. Si queda el logo de Cablevisión-Fibertel, el quinto rótulo puede ser "Telecom y seg. vehicular" (24).

**Línea de clientes en texto, debajo de los sectores** (máx. 260; para Google y las IA, que no leen los logos)
> Entre otros: Superintendencia de Riesgos del Trabajo, Administración de Parques Nacionales, Senado de la Nación, Sedronar, Nación Seguros, Pfizer, Laboratorios Bagó, Reckitt Benckiser, Petropack, LoJack y Strix.

(211) [fuente: BRIEF §7 (SRT, Parques Nacionales, grupo LoJack-Strix); WEB y WP logos 2024 (Senado, Sedronar, Nación Seguros, Pfizer, Bagó, Reckitt Benckiser, Petropack); INF p.3 y p.8]. Medifé salió de la línea y de la cinta: tiene un NDA firmado que pide no nombrarla [fuente: `fuentes-drive-clientes.md`, ASE / Medifé]. Si Carlos consigue el permiso por escrito, vuelve.

**Cinta de logos: qué cambia**
- Sacar: El Cronista, Correo Argentino y Gendarmería Nacional [fuente: BRIEF §11].
- Agregar: Administración de Parques Nacionales y Strix [fuente: BRIEF §7]. `{{PENDIENTE: archivos de logo}}`
- Mantener con aviso: ASI-GCBA y AGIP, como proyectos realizados [fuente: BRIEF §11]. `{{CONFIRMAR CON DIRECCIÓN}}`
- Cartocor y ODI, solo si dan permiso y hay logo [fuente: INF p.3]. `{{PENDIENTE: permiso y logo}}`

**Textos alternativos de los logos nuevos**
- "Administración de Parques Nacionales"
- "Strix, grupo LoJack"

---

## 5. Problema

El brief dice que a Intellihelp la llaman "por proyectos, no por cosas que no andan": una necesidad nueva, la disconformidad con un proveedor o un presupuesto acotado. Si no los contratan, los clientes recurren a un freelancer, lo resuelven internamente o no lo hacen [fuente: BRIEF §10 y §14.5]. Por eso la sección no vende contra la falla, como la maqueta, sino que habla del proyecto nuevo.

**Eyebrow** (máx. 30)
> Cuándo nos llaman

**H2** (máx. 70)
> Para proyectos que el área de sistemas no llega a cubrir.

**Bajada** (máx. 200)
> Nos llaman por proyectos: una sede nueva para cablear, un control de acceso con presentismo para toda la planta, una mesa de ayuda para tercerizar.

(148) [fuente: BRIEF §10 ("Nos llaman por proyectos no por cosas que no andan"), §3 y §2.1.3.4 (presentismo integrado)]

**Columna izquierda.** Rótulo (máx. 30): `Las alternativas de siempre` [fuente: BRIEF §14.5]

| # | Título (máx. 40) | Texto (máx. 110) |
|---|---|---|
| 1 | El técnico de confianza | Resuelve lo puntual, pero si el proyecto crece no hay quién lo cubra ni quién firme un acuerdo de servicio. |
| 2 | El área de sistemas, a pulmón | Tu equipo ya tiene el día completo. El proyecto nuevo compite con la operación y se atrasa. |
| 3 | Cámaras, red y software por separado | Tres contratos y tres plazos. Si el lector no marca, nadie sabe si falla la red, el equipo o el sistema. |

**Columna derecha.** Rótulo (máx. 30): `Cómo lo resolvemos`

| # | Título (máx. 40) | Texto (máx. 110) | Fuente |
|---|---|---|---|
| 1 | Un solo proveedor, varias marcas | Hikvision, Suprema, Huawei o Furukawa en el mismo proyecto, con un solo contrato y un solo responsable. | BRIEF §4 (ITH como único proveedor integrador). **Es el único lugar de la página donde va la idea de "un solo proveedor".** |
| 2 | Hard y soft en la misma empresa | La red, los accesos, su integración con tu sistema de personal y el soporte, con el mismo equipo. | BRIEF §15.1 ("integrando el hard y el soft en una sola empresa") y §2.1.3.4 |
| 3 | Gente elegida y acompañada | Selección con psicodiagnóstico laboral, inducción en tu empresa y seguimiento de cada profesional asignado. | WEB /outsourcing/ y PDF de outsourcing (psicodiagnóstico, inducción con kit de bienvenida, coaching proactivo, feedback continuo del cliente) |

---

## 6. Servicios

**Eyebrow** (máx. 20)
> Qué hacemos

**H2** (máx. 60)
> Servicios IT para empresas, del soporte a las cámaras.

**Bajada** (máx. 200)
> La mesa de ayuda y el outsourcing los cubren profesionales que selecciona Intellihelp. Las cámaras, los accesos y las redes los instalamos nosotros, con equipos de cada fabricante.

(178) [fuente: BRIEF §4 (servicios con staff de ITH; soluciones con equipamiento de fabricantes, con ITH como integrador); BRIEF §2.2.2 (reclutamiento y selección)]

El orden sigue las prioridades del brief: lo recurrente primero (outsourcing y mesa de ayuda) y la puerta de entrada al lado (cámaras y control de acceso) [fuente: BRIEF §3].

### Tarjeta 01. Mesa de ayuda tercerizada y outsourcing IT

- **Título** (máx. 45): Mesa de ayuda tercerizada y outsourcing IT
- **Texto** (máx. 230):
  > Soporte IT para empresas: service desk de niveles 1 y 2 con SLA, en tus oficinas o en las nuestras, y profesionales IT que se suman a tu equipo. Lo hicimos para el grupo LoJack-Strix, MSD y Pfizer.

  (200) [fuente: WEB /servicios-antigua/ y ith-service-brochure.pdf (SLA y OLA, oficinas del cliente o de ITH); PDF-OLD casos laboratorio 2022 (MSD: mesa de ayuda niveles 1 y 2; Pfizer: outsourcing IT); PDF-OLD presentación p.28 (LoJack: mesa de ayuda nivel 1 on-site); BRIEF §7 (grupo LoJack-Strix)]. "Lo hicimos" no afirma que sigan: ver decisión 2.
- **Chips** (4, máx. 24 cada uno): `Service desk N1 y N2` · `Soporte técnico` · `Outsourcing IT` · `Búsqueda IT y ejecutiva`
  [fuente: PDF-OLD (MSD niveles 1 y 2); BRIEF §2.2.5 (búsqueda de recursos y executive search)]

### Tarjeta 02. Cámaras de seguridad y control de acceso

- **Título** (máx. 45): Cámaras de seguridad y control de acceso
- **Texto** (máx. 230):
  > Instalación de cámaras de seguridad IP con analítica, biometría facial y de huella, molinetes y barreras Hikvision, Suprema y Dahua. Integramos HikCentral o BioStar con tu sistema de personal y capacitamos a tu gente.

  (217) [fuente: BRIEF §2.1.3 (Hikvision: videovigilancia con IA, biométricos, molinetes, barreras, integración de HikCentral con nómina), §2.1.4 (Suprema BioStar) y §2.1.5 (Dahua); WEB /videoseguridad/ (proveemos, instalamos, configuramos y capacitamos)]
- **Chips**: `Control de acceso` · `Cámaras de seguridad IP` · `HikCentral y BioStar` · `Presentismo integrado`

### Tarjeta 03. Redes, fibra y data center

- **Título** (máx. 45): Redes, fibra y data center
- **Texto** (máx. 230):
  > Cableado estructurado, fibra FTTH y GPON con Furukawa Laserway y Huawei, wifi empresarial, servidores, storage y nube. Instalamos los servidores Huawei del Senado y el storage OceanStor de Sedronar.

  (196) [fuente: BRIEF §2.1.2 (Huawei) y §2.1.6 (Furukawa Laserway, GPON); WEB /quienes-somos/ y /clientes/ (2017: servidores Huawei para el Senado; storage OceanStor 2200 V3 para Sedronar)]. La red GPON de la Ciudad queda solo como caso chico, para no repetirla.
- **Chips**: `Cableado estructurado` · `FTTH y GPON` · `Servidores y storage` · `Ciberseguridad Fortinet`
  [fuente: INF p.9-15 (keywords "cableado estructurado", "ftth", "data center"); BRIEF §2.1.7 (Fortinet)]

### Línea "Además" (máx. 200)
> Además: **desarrollo de software a medida**, **automatización con IA**, **consultoría ITIL y PMO**, **capacitación con INTELLIHELP-Learning**, **IoT** y **energía solar**.

[fuente: BRIEF §2.1.1, §2.2 y §4.1.3 (catálogo completo)]

---

## 7. Historia

**Eyebrow** (máx. 20)
> Nuestra historia

**H2** (máx. 60)
> Clientes que llegaron por un servicio y sumaron otros.

(53) [fuente: BRIEF §8.2 ("luego de años logramos que nos vayan contratando otros servicios y renovando los existentes")]

**Bajada** (máx. 230)
> Somos una empresa argentina de capital nacional. Nuestro primer caso de éxito fue un outsourcing para la Agencia de Sistemas de Información porteña; después vinieron la fibra, los servidores, las cámaras y la mesa de ayuda.

(220) [fuente: ith-triptico.pdf (capital nacional); WEB /quienes-somos/ timeline (2013, primer caso de éxito: ASI); WEB timeline 2017-2022 (fibra AGIP, servidores Senado, videoseguridad, mesa de ayuda)]. La fecha de fundación no se repite acá: está en el hito 2010.

**Número grande**: `{{site.years}}` · rótulo `años` · sub-rótulo (máx. 24): `desde marzo de 2010` (19) [fuente: WEB /quienes-somos/]. Como la cifra de "+60 proyectos" ahora va en el hero, no se repite acá.

**Hitos** (9; año, título máx. 36, texto máx. 115)

| Año | Título | Texto | Fuente |
|---|---|---|---|
| 2010 | Nace Intellihelp | Fundada el 10 de marzo en Buenos Aires. En 2012 abrimos la primera oficina, en Quartier Madero. | WEB /quienes-somos/ timeline; WP posts#1770. Discrepancia: WP history_post#204 dice 2013 para la primera oficina |
| 2013 | Primer caso de éxito | Outsourcing para la Agencia de Sistemas de Información porteña: nos ocupamos del mantenimiento de sus plataformas. | WEB /quienes-somos/ ("Primer caso de éxito"); WP history_post#203 ("Primer negocio: outsourcing de mantenimiento de plataformas ASI"). `{{CONFIRMAR CON DIRECCIÓN}}` (GCBA perdido) |
| 2016 | Gold Partner de Huawei | Huawei nos nombra Gold Partner: podemos comercializar toda su línea de soluciones. | WEB /quienes-somos/ ("Gold Partner de HUAWEI para la comercialización de todas sus soluciones"). Decisión 3 |
| 2017 | Fibra, servidores y storage | Red de fibra para las 33 oficinas de AGIP, servidores Huawei para el Senado y storage OceanStor para Sedronar. | WEB /quienes-somos/ y /clientes/; WP posts#2733. AGIP: `{{CONFIRMAR CON DIRECCIÓN}}` (GCBA) |
| 2018 | Escuelas, hospitales y comisarías | Mantenimiento 7x24 de la red de conectividad de la Ciudad. Ese año, Hikvision nos nombra Gold Partner. | WEB /quienes-somos/ timeline 2018 ("Mantenimiento correctivo y preventivo 7x24 de la red de conectividad de escuelas, hospitales y comisarías"; "Gold Partner de Hikvision") |
| 2019 | Energías renovables | Nace la unidad de energías renovables: solución solar on-grid para una bodega del Valle de Uco, Mendoza. | WEB /quienes-somos/ timeline 2019 (unidad de Energías Renovables; caso de éxito bodega Valle de Uco, solución on-grid) |
| 2020 | Nube y capacitación propia | Unidad de soluciones Huawei Cloud y plataforma de e-learning con más de 50 cursos y talleres. | WEB /quienes-somos/; WP posts#622 |
| 2022 | Mesa de ayuda y laboratorios | Mesa de ayuda en las oficinas de LoJack, outsourcing IT para Pfizer y mesa de ayuda de niveles 1 y 2 para MSD. | WEB /quienes-somos/ y /outsourcing/; PDF-OLD casos laboratorio 2022 |
| Hoy | Sector público y privado | Integramos Huawei, Hikvision, Suprema, Furukawa y Fortinet para organismos públicos y empresas privadas. | BRIEF §1.1 (sector privado y público), §2.1 y §5.1 (fabricantes) |

Notas:
- **El hito "Hoy" no nombra clientes** porque no está confirmado que SRT, Parques Nacionales y LoJack-Strix sigan (decisión 2). Si Dirección lo confirma, el texto pasa a: "Clientes como la SRT, Parques Nacionales y el grupo LoJack-Strix, con Huawei, Hikvision, Suprema y Fortinet." (108).
- **No dice "sumamos" Suprema, Furukawa y Fortinet:** Furukawa ya figuraba como socio en 2022 [fuente: WP posts#2093; PDF-OLD presentación 2022 p.25] y no hay fecha de alta para Suprema ni Fortinet. `{{PENDIENTE: año de alta de Suprema y Fortinet}}`
- **La línea de tiempo pasa de 10 a 9 hitos.** Se sacaron:
  - La Universidad Nacional del Litoral en 2021: el único documento es el PDF del caso, subido en febrero de 2022, y no da el año del proyecto. Sigue en Casos y en Presencia, sin año. `{{PENDIENTE: año del proyecto UNL}}`. Con el año, vuelve como hito: "Videovigilancia Hikvision con monitoreo 24/7 en las sedes de la Universidad Nacional del Litoral, Santa Fe."
  - La red GPON de mil sedes en 2018: el "1.000 locaciones en 4 meses" sale de una ficha de /clientes/ sin año. Queda solo como caso chico. `{{PENDIENTE: año de la red GPON}}`
  - La mudanza a Palermo: la web en vivo la pone en 2018 (Edificio Mirabilia, Palermo Hollywood) y el WordPress en 2019. No aporta al visitante y las fuentes se contradicen.
  - La fibra en el subte (2015): las fuentes no coinciden en las líneas (B y C contra C y E). `{{PENDIENTE: líneas de subte}}`. Si se confirma, vuelve: "Tendido de fibra óptica en las líneas X e Y del subte porteño."
  - El hito de El Cronista (decisión 4).

---

## 8. Equipo

**Eyebrow** (máx. 20)
> Quiénes somos

**H2** (máx. 60)
> Siete personas que dan la cara por cada proyecto.

[fuente: BRIEF §1.2 ("Staff. 7 personas"); KICK p.3 ("La gente compra a personas")]

**Bajada** (máx. 230)
> En la oficina de Palermo está el staff. En las oficinas de nuestros clientes trabajan los técnicos y analistas que Intellihelp tiene en nómina. Estos son los nombres que vas a ver en tus mails y en tu WhatsApp.

(206) [fuente: BRIEF §1.2 y §3 (personal en nómina de ITH)]

**Tarjetas** (nombre; cargo máx. 45; texto máx. 120). La grilla pasa de 6 a 8 tarjetas: 7 personas y el equipo técnico, en 4 columnas por 2 filas.

| Nombre | Cargo | Texto | Fuente |
|---|---|---|---|
| Carlos Baldelli | Presidente y socio | Es la cara comercial de Intellihelp y el primer contacto para proyectos nuevos y licitaciones. | BRIEF §1.2 (cargo); KICK p.2 ("Contacto principal y cara comercial"). `{{CONFIRMAR con Carlos}}` |
| Nicolás Baldelli | Director de operaciones y socio | Dirige las operaciones de Intellihelp y combina el perfil técnico con el comercial. | BRIEF §1.2 (cargo); KICK p.2 ("Técnico y comercial"). `{{PENDIENTE: confirmar la descripción con Nicolás}}` |
| Laura Zaltron | Responsable de marketing y comunicaciones | Lleva el marketing y la comunicación de Intellihelp, y acompaña a los clientes en la preventa y la posventa. | BRIEF §1.2; KICK p.2 ("Pre y postventa / Marketing") |
| Lisandro Campos | Preventa y servicios | Releva lo que necesitás y lo traduce en una propuesta técnica concreta. | BRIEF §1.2 (cargo). `{{PENDIENTE: confirmar la descripción con Lisandro}}` |
| Brian Sierra | Jefe de sistemas e infraestructura IT | Lidera el soporte técnico. Certificado HCSA en control de acceso Hikvision, con cursos de Suprema BioStar 2 y Laserway. | LI-BRIAN (cargo actual; "lidero al equipo de soporte técnico"; certificación HCSA Access Control de Hikvision, vigente hasta jun-2027; cursos básico e intermedio de BioStar 2; módulos Furukawa Laserway) |
| Alejandro Ayala | Responsable de instalaciones y posventa | Coordina las instalaciones de cámaras, accesos y cableado, y la posventa de cada proyecto. | BRIEF §1.2 (cargo). `{{PENDIENTE: confirmar el detalle con Alejandro}}` |
| Raúl Nasif | Administración | Lleva la administración de cada contrato: facturación, documentación y seguimiento de pagos. | BRIEF §1.2 (cargo). `{{PENDIENTE: confirmar la descripción con Raúl}}` |
| Nuestro equipo técnico | En las oficinas de nuestros clientes | Técnicos y analistas en nómina de Intellihelp que trabajan dentro de la operación del cliente, con respaldo de Palermo. | BRIEF §3 (personal en nómina de ITH). `{{PENDIENTE: certificaciones del equipo técnico de outsourcing}}` |

Nota: las certificaciones de Hikvision, Suprema, Furukawa, Zyxel y Cisco que figuraban en la tarjeta del equipo técnico eran de Brian, que es staff interno, y la de Cisco es un curso introductorio. Se sacaron de esa tarjeta.

**Cita** (máx. 170). Reemplaza la frase de Carlos de la maqueta, que no tenía fuente.
> Construimos relaciones de largo plazo con nuestros clientes sobre la base de mantener los compromisos asumidos.

(111)
- Firma: "Intellihelp", sin nombre propio. Texto y firma aprobados por Dirección (oct. 2026).
- [fuente: BRIEF §15.1, frase literal. El brief lo completaron Carlos, Nicolás y Laura (KICK p.5), así que no se le puede atribuir a uno solo sin su visto bueno]
- Versión alternativa, si Dirección la aprueba y la firma Carlos: "Construimos relaciones de largo plazo con nuestros clientes, cumpliendo siempre lo que nos comprometimos a hacer. Por eso renuevan." (131) [fuente: BRIEF §15.1 y §15.2]
- **Frase publicada (09/11):** «Resolver un problema antes de que el cliente lo note cuesta mucho menos que recuperar su confianza.» (versión revisada el 09/11, elegida por Brian; falta la aprobación de Carlos), firmada "Carlos Baldelli · CEO de Intellihelp". Adaptación de una idea de
  Mark Cuban sobre ponerse en el lugar del cliente, elegida por Brian el 08/11; pendiente de aprobación de Carlos.

---

## 9. Presencia fuera de CABA

**Eyebrow** (máx. 24)
> Fuera de CABA

("Presencia nacional" exageraba: hay proyectos documentados en cinco jurisdicciones.)

**H2** (máx. 60)
> Clientes de Buenos Aires con sedes en otras provincias.

(54) [fuente: BRIEF §13]

**Bajada** (máx. 230)
> Todos nuestros clientes tienen la casa central en Buenos Aires, y en muchos el servicio cubre sedes del interior o de países limítrofes. Hicimos proyectos en Mendoza, Santa Fe, Corrientes y Burzaco.

(200) [fuente: BRIEF §13 ("Todos los clientes son de buenos aires pero en muchos de ellos la cobertura del servicio abarca una o más provincias del interior o países limítrofes"); WEB /quienes-somos/ (Mendoza); PDF-OLD (UNL, Santa Fe); PPTX-EE slide 17 (Corrientes y Burzaco)]

**Tres puntos** (negrita máx. 40 + texto máx. 110)

1. **Sedes en otras provincias:** el contrato puede cubrir sucursales del interior y de países limítrofes, como con muchos de nuestros clientes. [fuente: BRIEF §13]
2. **Energía en el interior:** solar on-grid en el Valle de Uco (Mendoza) y autonomía energética para telecomunicaciones en Corrientes. [fuente: WEB /quienes-somos/ (Mendoza); PPTX-EE slide 17 ("Autonomía Telecomunicaciones / Corrientes")]
3. **Videovigilancia en Santa Fe:** cámaras Hikvision con monitoreo 24/7 en las sedes de la Universidad Nacional del Litoral. [fuente: PDF-OLD 2022/02 caso Universidad del Litoral]

Petropack se sacó de esta sección: ninguna fuente dice dónde se hizo el proyecto. Si Dirección confirma partners o representantes en el interior, pueden reemplazar el punto 1. `{{PENDIENTE: nombres y ciudades de los partners locales}}`

**Provincias del mapa (estado)**

| Provincia | Estado | Respaldo |
|---|---|---|
| CABA | Con proyectos | Sede y la mayoría de los casos [fuente: WEB, BRIEF] |
| Buenos Aires | Con proyectos | Planta solar de 250 kWp para Offal Exp., en Burzaco [fuente: PPTX-EE slide 17] |
| Mendoza | Con proyectos | Bodega del Valle de Uco, solar on-grid, 2019 [fuente: WEB /quienes-somos/] |
| Santa Fe | Con proyectos | Universidad Nacional del Litoral, videovigilancia [fuente: PDF-OLD] |
| Corrientes | Con proyectos | Autonomía energética para telecomunicaciones [fuente: PPTX-EE slide 17] |
| Entre Ríos | A confirmar | Petropack tiene planta en Paraná, pero ninguna fuente de ITH dice dónde fue el proyecto `{{PENDIENTE}}` |
| Córdoba | A confirmar | Cartocor (lo nombra el informe, sin detalle) y búsquedas IT para Grupo Libertad [fuente: INF p.3; WEB blog 2022] `{{PENDIENTE}}` |
| Salta | Sacar | Sin fuente |

- `aria-label` del mapa (máx. 160): "Mapa de Argentina con las provincias donde Intellihelp hizo proyectos: Ciudad de Buenos Aires, Buenos Aires, Mendoza, Santa Fe y Corrientes." (142)
- Leyenda: `Con proyectos realizados` / `Sin proyectos todavía`.

---

## 10. Casos

**Eyebrow** (máx. 20)
> Casos

**H2** (máx. 60)
> Lo que hicimos para organismos y empresas.

### Caso destacado: ASI, Gobierno de la Ciudad de Buenos Aires

Es el caso con más datos verificables y muestra el servicio recurrente que la empresa quiere vender. Va en pasado, porque el GCBA ya no es cliente. Ojo: fue **administración de servidores y bases de datos**, no una mesa de ayuda; por eso el 7x24 con 2 horas de respuesta aparece solo acá. `{{CONFIRMAR CON DIRECCIÓN}}` [fuente: BRIEF §11]

- **Organismo** (2 líneas): `Agencia de Sistemas de Información` / `Gobierno de la Ciudad de Buenos Aires`
- **Título** (máx. 60): Una guardia 7x24 para los servidores de la Ciudad.
- **El desafío** (máx. 130): Servidores VMware, Linux, zLinux y Windows Server, y bases Oracle 12c con RAC y Data Guard, de un organismo que no puede parar.
- **Qué hicimos** (máx. 130): Sumamos administradores de sistemas y de bases de datos que tomaron el monitoreo, las actualizaciones y la documentación.
- **El resultado** (máx. 130): Menos incidentes, servidores más disponibles y una guardia que ya no dependía del horario de oficina.
- **Panel de cifras**: `5x8` (Antes) · `7x24` (Con Intellihelp) · `2 h` con el texto "tiempo máximo de respuesta acordado ante cualquier incidente" (61; máx. 70)
- [fuente: WEB /clientes/ (consultoría en sistemas operativos, bases de datos y TSM); PDF-OLD 2021/10 ith-caso-de-exito-gcba.pdf y ith-caso-de-exito-gcba-base-datos.pdf; WP posts#2733]

### Cuatro casos chicos (eyebrow máx. 30; nombre máx. 30; texto máx. 120)

| Eyebrow | Nombre | Texto | Fuente |
|---|---|---|---|
| Redes · CABA | Red GPON de la Ciudad | Equipos GPON Huawei para conectar 1.000 establecimientos educativos, de salud y de seguridad, implementados en 4 meses. | WEB /clientes/ (GPON Network: ONT HG8245H y OLT MA5608T; "mil locaciones en topología estrella en 4 meses"); WP posts#2733. Huawei aportó el equipamiento, no la fibra. `{{CONFIRMAR CON DIRECCIÓN}}` (GCBA) |
| Outsourcing IT · Banca | Un banco internacional | Más de 40 posiciones cubiertas en un año: Cobol, .NET, Java, arquitectos, Scrum Masters y testers. | PDF-OLD 2022/08 ith-casos-de-exito-2022.pdf (el caso no nombra al banco) |
| Videoseguridad · Santa Fe | Univ. Nacional del Litoral | Cámaras Hikvision con visión nocturna a color y monitoreo local y remoto 24/7 en las sedes de la universidad. | PDF-OLD 2022/02 ith-caso-de-exito-universidad-del-litoral |
| Industria · IIoT | Petropack | Sistema IIoT que controla el arranque y la parada de las laminadoras del fabricante de envases. | PDF-OLD presentación 2022 p.28; WEB presentación institucional |

Nombre de la universidad: se usa "Universidad Nacional del Litoral" en todos los bloques (en el nombre del caso va abreviado por largo).

**Casos de reemplazo, con datos reales**
- **AGIP:** red de fibra para 33 oficinas, mantenimiento correctivo y preventivo por 24 meses, soporte 24/7 de niveles 1 y 2 [fuente: WEB /quienes-somos/ y /clientes/]. `{{CONFIRMAR CON DIRECCIÓN}}` (GCBA)
- **Sedronar:** storage Huawei OceanStor 2200 V3, el primero de ese estándar en el organismo [fuente: WEB /clientes/].
- **MSD:** mesa de ayuda IT de niveles 1 y 2, presencial en Argentina [fuente: PDF-OLD casos laboratorio 2022].
- **Offal Exp.:** planta solar de 250 kWp en Burzaco [fuente: PPTX-EE slide 17].
- **Huawei Argentina:** dos años de soporte de preventa en la oficina del cliente para proyectos de gobierno [fuente: PDF-OLD 2021/10 ith-caso-de-exito-huawei.pdf].

**Casos que nombra el informe y no tienen detalle:** Cartocor, ODI ("4 sucursales") y Nación Seguros [fuente: INF p.3]. `{{PENDIENTE: qué se hizo, año, tecnologías y una cifra}}`. Hasta tenerlo, no se publican.

---

## 11. Testimonios (borrador, no se publica)

La sección sigue con `data-draft`. Los textos de abajo son para cuando haya testimonios reales.

**Eyebrow** (máx. 36)
> Lo que dicen nuestros clientes

**H2** (máx. 60)
> Nuestros clientes hablan poco. Lo demuestran renovando.

[fuente: BRIEF §15.2 ("en general no dicen mucho pero sí lo demuestran a la hora de renovar los servicios")]

**Pedidos de testimonio** (notas internas)
1. **Mesa de ayuda, grupo LoJack-Strix.** Pedírselo a Sebastián De Pasqua, Supervisor de Help Desk, que recomendó a Brian en LinkedIn por su trabajo en una suplencia en Strix-LoJack [fuente: LI-BRIAN]. `{{CONFIRMAR: para qué empresa trabaja hoy}}`. Que cuente cómo trabaja la mesa de ayuda en sus oficinas y qué cambió.
2. **Organismo público: SRT o Parques Nacionales.** Que diga cuánto hace que trabajan juntos y por qué renovaron [fuente: BRIEF §7 y §8.1]. Antes, confirmar que sigan siendo clientes y si el organismo puede dar testimonios con nombre.
3. **Cámaras o control de acceso: Petropack o un cliente pyme.** Que cuente la instalación: plazos, prolijidad y la capacitación a su gente [fuente: BRIEF §3, servicio de entrada].

**Testimonios que ya existen, de 2020** (son de colegas y socios, no de clientes; usarlos solo con permiso y fecha) [fuente: WEB /soluciones-cloud-huawei/]
- Roberto Demarco (Tecnet S.A.): "Son excelentes profesionales no solo a nivel técnico sino también a nivel humano."
- Octavio Trocca (Sanatorio Finochietto): "Son líderes natos, que dan órdenes claras."
- `{{CONFIRMAR CON DIRECCIÓN}}` si siguen vigentes y si se pueden publicar.

**Reseñas de Google** (nota): el perfil tiene 5,0 estrellas con 3 reseñas [fuente: INF p.4]. Integrarlas cuando haya entre 5 y 10, que es la meta del kickoff [fuente: KICK p.3].

---

## 12. Cómo empezamos

**Eyebrow** (máx. 20)
> Cómo empezamos

**H2** (máx. 60)
> Así arranca un proyecto con Intellihelp.

**Pasos** (título máx. 40; texto máx. 130)

| Paso | Título | Texto | Fuente |
|---|---|---|---|
| 1 | Relevamos tu operación | Vamos a tu oficina o planta y vemos la red, los accesos y cómo trabaja tu gente. | BRIEF §2.2.2.1 ("desde una etapa incipiente de relevamiento de las necesidades") |
| 2 | Te proponemos algo realista | Por escrito: qué incluye, cuánto tarda, qué equipos lleva y qué nivel de servicio acordamos. Si algo no conviene, te lo decimos. | BRIEF §15.1 ("frontalidad y verdad en la formulación y ajuste de las expectativas") |
| 3 | Instalamos y nos quedamos | Implementamos, capacitamos a tu gente y seguimos con mantenimiento preventivo y correctivo, con el mismo equipo. | WEB /servicios-antigua/ (llave en mano con mantenimiento correctivo y preventivo); WEB /videoseguridad/ (capacitación) |

Se sacó "Si sos un organismo, colaboramos con el pliego": sale de una respuesta interna del brief (§9.1) y, publicado, puede leerse como participación en la redacción de pliegos de licitación. Si Dirección quiere mencionar a los organismos, el paso 1 queda: "Vemos tu oficina o planta: la red, los accesos y cómo trabaja tu gente. Con organismos, asesoramos en la especificación técnica." `{{CONFIRMAR CON DIRECCIÓN}}`

**Banda** (máx. 120; lleva enlace a #agenda)
> ¿Tenés un pliego o un proyecto en carpeta? Contanos y coordinamos el relevamiento.

(82) [fuente: BRIEF §8.1 y §9.1 (licitaciones), §2.2.2.1 (relevamiento)]

---

## 13. Preguntas frecuentes

**Eyebrow** (máx. 24)
> Preguntas frecuentes

**H2** (máx. 50)
> Lo que nos preguntan antes de contratar.

Respuestas de 25 a 60 palabras, como pide el informe para que Google y las IA las citen [fuente: INF p.20 y p.26]. Las publicadas van también al schema FAQPage con el mismo texto. Son 8.

**1. ¿Trabajan en el interior del país?** (máx. 330)
> Sí. Todos nuestros clientes tienen la casa central en Buenos Aires, y en muchos casos el contrato cubre sedes en otras provincias o en países limítrofes. Instalamos videovigilancia en la Universidad Nacional del Litoral (Santa Fe) e hicimos proyectos de energía en Mendoza, Corrientes y Burzaco.

(46 palabras) [fuente: BRIEF §13; PDF-OLD (UNL); WEB /quienes-somos/ (Mendoza); PPTX-EE slide 17 (Corrientes y Burzaco)]

**2. ¿Para qué tamaño de empresa trabajan?** (máx. 330)
> Trabajamos sobre todo con empresas medianas y grandes, corporaciones y organismos nacionales, provinciales y municipales. Con pymes trabajamos según el servicio, en especial en instalación de cámaras de seguridad y control de acceso, que es el servicio que se adapta a empresas de cualquier tamaño.

(45 palabras) [fuente: BRIEF §6 y §3 ("permite trabajar en todos los segmentos de mercado, desde pymes hasta grandes empresas")]. `{{PENDIENTE: rango de usuarios o PC, que pide el informe (INF p.20)}}`

**3. ¿Cómo funciona la mesa de ayuda tercerizada?** (máx. 330)
> Armamos un service desk de niveles 1 y 2, con acuerdos de servicio (SLA) y procesos ITIL. Puede funcionar en tus oficinas, como lo hicimos en LoJack y en MSD, o desde las nuestras. El personal puede estar en nómina de Intellihelp o de tu empresa.

(46 palabras) [fuente: WEB /servicios-antigua/ y ith-service-brochure.pdf (SLA, ITIL, oficinas del cliente o de ITH); PDF-OLD (LoJack nivel 1 on-site; MSD niveles 1 y 2 presencial); BRIEF §2.2.2.2 y §3 (nómina del cliente o de ITH)]. `{{PENDIENTE: SLA y horario estándar}}`

**4. ¿Trabajan con organismos públicos?** (máx. 330)
> Sí. Participamos, ganamos y ejecutamos más de 40 licitaciones. Hicimos proyectos para el Senado de la Nación (servidores Huawei), Sedronar (storage Huawei) y la Agencia de Sistemas de Información porteña, y trabajamos con la Superintendencia de Riesgos del Trabajo y Parques Nacionales.

(42 palabras) [fuente: BRIEF §15.5.3 y §7; WEB /quienes-somos/ y /clientes/]. `{{CONFIRMAR CON DIRECCIÓN: que las 40 se ganaron, y vigencia de SRT y Parques Nacionales}}`

**5. ¿Con qué marcas trabajan?** (máx. 330)
> Con Huawei, Hikvision, Suprema, Dahua, Furukawa, Fortinet, Microsoft, Cisco, Aruba, Ubiquiti, MikroTik, Dell, HP y Lenovo, entre otras. No dependemos de una sola marca: elegimos el fabricante según lo que necesita tu proyecto.

(33 palabras) [fuente: BRIEF §5.1 (con los nombres corregidos: Ubiquiti, MikroTik)]. Si Dirección confirma las certificaciones vigentes, se agrega: "El equipo está certificado en …" `{{CONFIRMAR CON DIRECCIÓN}}`. "Comscore", en la lista del brief, es CommScope (confirmado por el cliente): ya figura con su logo.

**6. ¿El control de acceso se integra con el sistema de personal o de sueldos?** (máx. 330)
> Sí. Integramos HikCentral, de Hikvision, y BioStar, de Suprema, con tu sistema de gestión de personal o de liquidación de sueldos. El presentismo sale directo del lector biométrico o del molinete, sin planillas a mano.

(35 palabras) [fuente: BRIEF §2.1.3.4 y §2.1.4.4 (integración con "los productos estándares de mercado en cuanto a gestión de personal")]

**7. ¿Pueden sumar profesionales a mi área de sistemas?** (máx. 330)
> Sí. Hacemos búsquedas de perfiles IT y executive search, y también sumamos profesionales en nómina de Intellihelp que trabajan en tu equipo. Para un banco internacional cubrimos más de 40 posiciones en un año: desarrolladores Cobol, .NET y Java, arquitectos, Scrum Masters y testers.

(44 palabras) [fuente: BRIEF §2.2.5 y §3; PDF-OLD 2022/08 ith-casos-de-exito-2022.pdf]

**8. ¿Instalan cámaras de seguridad y control de acceso en oficinas y plantas?** (máx. 330)
> Sí. Instalamos cámaras de seguridad IP Hikvision y Dahua, lectores biométricos Suprema, molinetes y barreras, y los integramos con HikCentral o BioStar. En la Universidad Nacional del Litoral, por ejemplo, instalamos cámaras con visión nocturna a color y monitoreo 24/7.

(40 palabras) [fuente: BRIEF §2.1.3 a §2.1.5; PDF-OLD caso UNL]

La anterior "¿Cómo empezamos?" se sacó: repetía la sección de pasos y el cierre, y sumaba otra vez el WhatsApp.

**Preguntas en borrador** (con `data-draft` hasta tener la respuesta) [fuente: INF p.20]
- ¿Cuánto tarda en arrancar un servicio? `{{PENDIENTE: plazo típico desde la propuesta aprobada}}`
- ¿Cobran abono mensual o por visita? `{{PENDIENTE: modelo de precio publicable}}`
- ¿Cómo cuidan los datos de mi empresa (Ley 25.326)? `{{PENDIENTE: cómo se tratan los datos del cliente durante un servicio; el aviso del sitio ya está en /privacidad/}}`

---

## 14. Cierre y agenda

**Eyebrow** (máx. 20)
> Hablemos

**H2** (máx. 90; la parte resaltada va en `.agenda__mark`)
> Contanos qué querés resolver. **Te escribimos desde Palermo para coordinar.**

(73) [fuente: WEB /contacto/ (Dorrego 1789, Palermo)]

**Bajada** (máx. 160)
> Escribinos por WhatsApp, llamanos o dejá tus datos. Te contestamos desde la oficina de Palermo, en horario laboral.

El horario ya está confirmado (de lunes a viernes, de 8 a 18, `site.horario`) y sale en el cierre de todas las páginas.

**Fila de la reunión de diagnóstico** (embudo de ventas, p.3 y p.7: de las páginas de servicio a la landing)
- Primera fila de contacto, con link a `/diagnostico/`: la reunión por videollamada con Carlos, donde se elige día y hora. En la propia landing la fila se oculta.
- El formulario sigue en cada página como alternativa para quien prefiere dejar sus datos.

**Filas de contacto** (se suma el teléfono fijo, que hoy no se muestra) [fuente: INF p.4 y p.26: datos de contacto idénticos en todos lados y teléfono con clic para llamar]
1. `Escribinos por WhatsApp` → +54 9 11 5027-4827
2. `+54 11 7700-6868` (enlace `tel:+541177006868`)
3. `info@intellihelp.tech`
4. `Av. Dorrego 1789, piso 6, oficina 604, C1414CKM, CABA`

**Panel del formulario**
- Título (máx. 30): `Agendá una reunión`
- Subtítulo (máx. 110): `Completá el formulario y Carlos o Nicolás te escriben para coordinar la reunión.` (80) [fuente: KICK p.2 (contactos comerciales)] `{{CONFIRMAR CON DIRECCIÓN: quién responde las consultas}}`. Si no se confirma: `Completá el formulario y te escribimos para coordinar día y horario de la reunión.`

**Campos** (los obligatorios llevan asterisco; se saca "(opcional)" del último)

| Campo | Label | Obligatorio |
|---|---|---|
| nombre | Nombre y apellido * | sí |
| empresa | Empresa u organismo * | sí |
| mail | Mail laboral * | sí |
| teléfono | Teléfono | no |
| necesidad | ¿Qué necesitás? | no |
| mensaje | Contanos el proyecto | no |

**Opciones del select "¿Qué necesitás?"** (máx. 45 cada una; el orden sigue las prioridades del brief §3)
1. Cámaras de seguridad y control de acceso
2. Soporte IT, mesa de ayuda u outsourcing IT
3. Redes, fibra o data center
4. Búsqueda de perfiles IT
5. Desarrollo de software o automatización con IA
6. Licitación o proyecto para un organismo público
7. Otro proyecto

**Botón**: `Quiero agendar la reunión →` · mientras envía: `Enviando…`

**Mensajes** (`contact-form.js`)

| Clave | Texto |
|---|---|
| nombre | Escribí tu nombre y apellido. |
| empresa | Escribí el nombre de tu empresa u organismo. |
| mail | Escribí tu mail laboral. |
| mailInvalid | Revisá el mail: tiene que tener la forma nombre@empresa.com. |
| generic | Completá este campo. |
| error de envío | No pudimos enviar tus datos. Probá de nuevo en unos minutos. También podés escribirnos a info@intellihelp.tech. |
| éxito, título | Gracias, ya recibimos tus datos. |
| éxito, texto | Te escribimos en breve para coordinar la reunión. |
| leyenda legal | Usamos estos datos solo para contestarte y coordinar la reunión. Más detalle en el aviso de privacidad (Ley 25.326). |

"aviso de privacidad" enlaza a /privacidad/ (publicada el 23/10/2026).

**WhatsApp**
- Aparece en dos lugares: el botón flotante y la fila del cierre (más el footer). Se sacó de la FAQ.
- `aria-label` del flotante: "Escribinos por WhatsApp (se abre en una pestaña nueva)"
- Mensaje precargado, uno solo para toda la página y tomado de `site.json`: "Hola Intellihelp, quiero hacer una consulta." [fuente: site.json; WP options.ht_ctc_chat_options (número +54 9 11 5027-4827)]

---

## 15. Footer

**Descripción de la marca** (máx. 200)
> Intellihelp (INTELLIHELP SA) es una empresa argentina de servicios informáticos, fundada en Buenos Aires en {{site.since}}.

Debajo, en una línea aparte y en letra chica: "No tenemos relación con IntelliHelp SpA de Chile."

[fuente: WEB código de ética (razón social); WEB /quienes-somos/ (fundación); INF p.3 y p.15 (homónimo)]

**Columna "Servicios"**
- Mesa de ayuda y outsourcing IT
- Cámaras de seguridad y control de acceso
- Redes, fibra y data center
- Desarrollo y automatización

**Columna "Empresa"**
- Historia
- Equipo
- Casos
- Preguntas frecuentes
- Trabajá con nosotros → rrhh@intellihelp.tech [fuente: WEB y site.json]
- (Blog: sigue en borrador, sin cambios)

**Columna "Contacto"**
- info@intellihelp.tech
- +54 11 7700-6868
- WhatsApp +54 9 11 5027-4827
- LinkedIn
- Av. Dorrego 1789, piso 6, of. 604, CABA

**Fila inferior**
- Izquierda: `© {{site.year}} INTELLIHELP SA · CUIT 30-71140975-7` [fuente: INF p.26]
- Derecha (máx. 80): `Integramos Huawei · Hikvision · Suprema · Furukawa · Fortinet` (61) [fuente: BRIEF §2.1 y §5.1]. Si Dirección confirma la vigencia, vuelve "Gold Partner Huawei · Gold Partner Hikvision" (decisión 3).

---

## 16. Textos alternativos de las imágenes

| Imagen | `alt` |
|---|---|
| Logo del header | ITH, Intellihelp |
| Logo del footer | Intellihelp, volver al inicio |
| Foto del hero (cuando exista) | "" (decorativa: el H1 ya dice lo mismo) |
| Carlos | Carlos Baldelli, presidente y socio de Intellihelp |
| Nicolás | Nicolás Baldelli, director de operaciones y socio de Intellihelp |
| Laura | Laura Zaltron, responsable de marketing y comunicaciones de Intellihelp |
| Lisandro | Lisandro Campos, preventa y servicios de Intellihelp |
| Brian | Brian Sierra, jefe de sistemas e infraestructura IT de Intellihelp |
| Alejandro | Alejandro Ayala, responsable de instalaciones y posventa de Intellihelp |
| Raúl | Raúl Nasif, administración de Intellihelp |
| Equipo técnico | Técnicos de Intellihelp trabajando en las oficinas de un cliente |
| Logo del caso destacado | "" (el nombre del organismo ya está en texto al lado) |
| Logos de la cinta | Nombre completo del cliente, como hoy. Nuevos: "Administración de Parques Nacionales", "Strix, grupo LoJack" |
| Mapa | ver el `aria-label` de la sección 9 |

---

## 17. Qué cambió respecto de la maqueta del PDF (resumen para revisar)

| Bloque | Maqueta del PDF | Versión final | De dónde sale |
|---|---|---|---|
| H1 | "Un equipo con nombre y apellido que mantiene tu tecnología andando. Hace 14 años." | "Servicios informáticos para empresas y organismos públicos de Buenos Aires, desde {{site.since}}." | Keyword del informe y fundación 2010 de la web vieja |
| Métricas | "14 años · +12 provincias · Gold Partner" | "+60 proyectos · +40 licitaciones · 21 marcas" | Presentación 2022, brief §15.5.3 y §5.1 |
| Problema | "Cuando la tecnología se frena, se frena tu empresa." | "Para proyectos que el área de sistemas no llega a cubrir." | Brief §10: "nos llaman por proyectos, no por cosas que no andan" |
| Historia, 2018 | "Más espacio, más equipo" (mudanza) | "Escuelas, hospitales y comisarías": mantenimiento 7x24 de la red de la Ciudad y Gold Partner de Hikvision | Timeline de la web en vivo |
| Historia, Hoy | "Proyectos en Paraná y Córdoba… partners en Mendoza, Salta y Rosario" | Integración de Huawei, Hikvision, Suprema, Furukawa y Fortinet | Brief §2.1 y §5.1 (lo de la maqueta no tenía fuente) |
| Equipo, Brian | "Parte del equipo desde hace muchos años." | Jefe de sistemas e infraestructura IT, certificado HCSA en control de acceso Hikvision | LinkedIn de Brian |
| Cita | "Si hoy tenemos que dar un servicio… en cualquier lugar del país, lo podemos hacer." | "Construimos relaciones de largo plazo con nuestros clientes sobre la base de mantener los compromisos asumidos." | Brief §15.1 |
| Caso ASI | "De horario de oficina a cobertura permanente." | "Una guardia 7x24 para los servidores de la Ciudad." | Casos ASI de /clientes/ y PDF 2021 |
| FAQ | 5 preguntas genéricas | 8 preguntas con clientes, marcas y cifras reales | Brief, casos 2021-2022 |
