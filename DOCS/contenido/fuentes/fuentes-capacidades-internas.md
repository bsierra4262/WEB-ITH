# Fuente: capacidades internas demostradas de Intellihelp (documentación de infraestructura)

Material de trabajo para redactar la web nueva. Sale de documentos **internos y sensibles** (carpeta `DOCS/privado/infra/`). Acá solo hay frases ya depuradas: no copiar nada más de los originales.

**Documentos analizados**

| Abreviatura | Documento | Qué es |
|---|---|---|
| **INFRA** | `IntelliHelp_Infraestructura_2026-09.md` (rev. 2, 10/09/2026) | Documentación de infraestructura de la empresa: router, switch, servidor, directorio, DNS, VPN, servicios autohospedados, respaldos, procedimientos y mediciones. Es la fuente principal. |
| **AUDIT** | `Auditoria_TOTAL_Intellihelp_v2.ps1` | Script propio de auditoría en PowerShell. Acá se describe, sin copiar código. |
| **HOME** | Documentación técnica de mi red doméstica (segundo archivo `.md` de la misma carpeta) | Ver nota abajo: **no es de la empresa**. |
| **PERFIL** | Mis datos de rol y formación, más `fuentes-linkedin-brian.md` | Rol, formación, certificaciones y desarrollos internos. |

**Sobre HOME (qué es y qué relación tiene):** es la documentación de mi **red doméstica personal**. Router MikroTik propio, implementado en septiembre de 2026 y configurado entero por línea de comandos desde una base vacía. **No es un proyecto de Intellihelp ni de un cliente.** Lo que lo vincula con la empresa es el método: aplica las mismas técnicas que la red de la oficina, en la misma época (DNS cifrado con filtrado, firewall de lista blanca, endurecimiento, NTP, respaldos rotativos automatizados con el mismo esquema). Sirve solo como referencia del criterio y de la forma de documentar (qué se hizo, cómo y por qué, con los problemas encontrados y cómo se resolvieron). **No usarlo como caso de la empresa ni citarlo en la web.** Además tiene datos personales y del domicilio, así que **todo su contenido entra en la lista negra.**

**Sobre el ZIP de auditoría:** el script AUDIT genera un ZIP con el volcado completo de usuarios, configuración y red. Es **altamente sensible**: va fuera de cualquier carpeta pública o del repositorio del sitio, y no se usa como fuente.

---

## 1. Capacidades demostradas (prueba real para la web)

Regla de uso: cada frase tiene un alcance definido y **no se amplía, ni se suman capacidades que no figuren en esta lista.** Donde dice "Alcance", se respeta tal cual.

Servicios de ITH usados en la columna 2: outsourcing/mesa de ayuda · redes e infraestructura · seguridad (física: cámaras y control de acceso) · ciberseguridad · cloud · desarrollo de aplicaciones · automatización con IA.

### 1.1 Redes y seguridad

| # | Frase lista para la web | Servicio de ITH que respalda | Fuente |
|---|---|---|---|
| R1 | Diseñamos e implementamos desde cero la red de nuestra oficina: router MikroTik en el perímetro y switching Huawei administrable. | Redes e infraestructura | INFRA §1 (arquitectura general), §2 (router), §3 (switch) |
| R2 | Segmentamos la red por función: estaciones de trabajo, impresión, telefonía IP y cámaras/control de acceso viajan en VLANs separadas. | Redes e infraestructura · Ciberseguridad | INFRA §1 y §3.2 (segmentación) |
| R3 | Endurecemos el perímetro: firewall con lista blanca y descarte por defecto, servicios de administración innecesarios apagados y gestión de los equipos accesible solo desde redes autorizadas. | Ciberseguridad · Redes e infraestructura | INFRA §2.1, §2.8, §2.11, §3.1 |
| R4 | Publicamos a internet solo lo imprescindible, detrás de un proxy inverso con certificados HTTPS que se renuevan solos. | Ciberseguridad · Cloud | INFRA §1 (servicios publicados), §7.1 (arquitectura Caddy + Let's Encrypt) |
| R5 | Nuestro DNS sale cifrado (DNS sobre HTTPS) y filtra decenas de miles de dominios de publicidad y rastreo para toda la red, sin instalar nada en cada equipo. | Ciberseguridad · Redes e infraestructura | INFRA §2.7, §6.1 (arquitectura DNS) |
| R6 | Unificamos la resolución de nombres: los equipos en la oficina y los que trabajan remoto por VPN pasan por el mismo filtrado y resuelven los mismos servicios internos. | Redes e infraestructura · Ciberseguridad | INFRA §6.1, §8.1 (reenvío condicional) |
| R7 | Cuando la oficina "andaba lenta", medimos antes de cambiar nada: el problema no era el ancho de banda sino la resolución DNS. Lo corregimos con DNS cifrado, caché y filtrado, sin cambiar el plan de internet. | Redes e infraestructura · Outsourcing/mesa de ayuda | INFRA §15 (mediciones de referencia: interpretación) |
| R8 | Sincronizamos la hora de todo el equipamiento de red y del servidor, para que los registros se puedan cruzar entre equipos cuando hay que investigar un incidente. | Redes e infraestructura · Ciberseguridad | INFRA §2.6, §3.4 |
| R9 | Integramos las cámaras y el control de acceso a la red en un segmento propio, con gestión centralizada. | Seguridad (física) · Redes e infraestructura | INFRA §3.2, §9.1, §11.4 |

### 1.2 Servidores y directorio

| # | Frase lista para la web | Servicio de ITH que respalda | Fuente |
|---|---|---|---|
| S1 | Administramos nuestro propio servidor Windows Server 2025 como controlador de dominio con Active Directory: cuentas, grupos, equipos y DNS interno. | Redes e infraestructura · Outsourcing/mesa de ayuda | INFRA §4, §5, §6 |
| S2 | Trabajamos con criterio de mínimo privilegio: accesos por grupo en las carpetas compartidas y en la VPN, y una política de contraseñas más estricta para las cuentas administrativas. | Ciberseguridad | INFRA §4.4 (recursos compartidos), §5.4 (política de contraseñas por grupo), §7.7 (ACL de la VPN) |
| S3 | El acceso remoto de administración está restringido a orígenes autorizados y protegido con autenticación a nivel de red. | Ciberseguridad | INFRA §4.2 |
| S4 | Mantenemos la higiene del directorio y del DNS: auditamos cuentas de equipo, depuramos registros obsoletos y estandarizamos impresoras con direcciones fijas en lugar de descubrimiento automático. | Outsourcing/mesa de ayuda · Redes e infraestructura | INFRA §4.5, §5.3, §6.6 |
| S5 | El servidor se recupera solo: después de un reinicio levantan automáticamente los servicios, los contenedores y el software de cámaras. Lo probamos con un reinicio real. | Redes e infraestructura | INFRA §9 (arranque automático) |
| S6 | Documentamos cada configuración: qué se hizo, con qué comandos y por qué, con procedimientos operativos y mediciones de referencia para comparar después. | Outsourcing/mesa de ayuda · Redes e infraestructura | INFRA completo (en especial §13 procedimientos, §14 notas técnicas, §15 mediciones) |

### 1.3 Servicios open source autohospedados

| # | Frase lista para la web | Servicio de ITH que respalda | Fuente |
|---|---|---|---|
| O1 | Tenemos nuestra propia VPN autohospedada (Headscale + Tailscale): el equipo se conecta a los recursos internos desde cualquier lugar, sin depender de un servicio de terceros. | Redes e infraestructura · Cloud · Ciberseguridad | INFRA §7 (VPN), §10 (alta de clientes VPN) |
| O2 | Inicio de sesión único con Google Workspace: para entrar a la VPN y a la base de conocimientos se usa la cuenta corporativa de Google, y solo se admiten cuentas de la empresa. | Cloud · Ciberseguridad | INFRA §7.6 (OIDC con Google), §7.8 (OAuth), §10.3 |
| O3 | Dentro de la VPN, cada usuario ve solo lo que le corresponde: permisos por grupo y perfiles distintos para usuarios y administradores. | Ciberseguridad | INFRA §7.7 (ACL), §10.1 (perfiles por rol) |
| O4 | Nuestra base de conocimientos interna corre sobre Outline, autohospedado y con acceso por Google Workspace. | Outsourcing/mesa de ayuda · Cloud | INFRA §7 |
| O5 | Filtrado DNS propio con AdGuard Home para los equipos conectados por VPN, estén en la oficina o fuera de ella. | Ciberseguridad | INFRA §6.1, §8 (AdGuard Home) |
| O6 | Gestionamos tareas internas con un tablero kanban autohospedado (Planka). | Outsourcing/mesa de ayuda | INFRA §7.2, §9.2, §11.3 |
| O7 | Todos estos servicios corren en contenedores Docker, con reinicio automático y una arquitectura que se puede replicar. | Cloud · Redes e infraestructura | INFRA §7.4, §7.5, §9.2, §11.3 |

### 1.4 Automatización

| # | Frase lista para la web | Servicio de ITH que respalda | Fuente |
|---|---|---|---|
| A1 | Auditamos servidores Windows con una herramienta propia en PowerShell, en modo solo lectura: en una pasada relevamos sistema y hardware, roles, red, firewall, servicios, software, Active Directory (usuarios, grupos, unidades organizativas, GPO), DNS, contenedores, puertos, tareas programadas, discos, carpetas compartidas, certificados, actualizaciones y VPN, y generamos un resumen ejecutivo. | Ciberseguridad · Outsourcing/mesa de ayuda · Automatización con IA | AUDIT (ver detalle abajo) |
| A2 | Automatizamos el alta y la baja de equipos en la VPN con un script propio: instala el cliente, asigna el perfil según el grupo del usuario en Active Directory, deja el acceso remoto con autenticación a nivel de red y, cuando alguien se va, limpia el equipo sin dejar rastros. | Automatización con IA · Outsourcing/mesa de ayuda · Ciberseguridad | INFRA §10 (script de alta VPN) |
| A3 | Respaldos semanales automatizados de la configuración del equipamiento de red, con nombres ordenables y limpieza automática según la política de retención. | Redes e infraestructura | INFRA §12.1 a §12.3. **Alcance:** solo configuración del equipamiento de red. No extender la frase a servidores, datos ni "toda la infraestructura". |
| A4 | Tareas programadas que mantienen los servicios sanos sin intervención: recarga semanal de la lista de filtrado y reacomodo automático de servicios después de un reinicio. | Automatización con IA · Redes e infraestructura | INFRA §8.3, §9, §12.3 |
| A5 | Antes de tocar reglas críticas de firewall dejamos armado un rescate automático: si el cambio nos deja sin acceso, el equipo vuelve solo a la configuración anterior. | Redes e infraestructura · Ciberseguridad | INFRA §13.8 (ventana de cambios en el firewall) |

**Qué demuestra el script AUDIT (descripción, sin código):**

- **Alcance:** 24 secciones de lectura sobre un servidor Windows: sistema y hardware; roles y características; configuración de red y DNS de cliente; perfiles y reglas de firewall con sus puertos; servicios (con cuenta de inicio y ruta del binario); software instalado de 32 y 64 bits; usuarios, grupos y membresías de Active Directory; dominio, bosque, controladores, unidades organizativas y GPO; zonas, registros y reenviadores del DNS de Windows; Docker (contenedores, imágenes, volúmenes, redes, uso de disco y puertos); puertos en escucha con el proceso que los abre y conexiones establecidas; tareas programadas que no son de Microsoft; discos, volúmenes y particiones; carpetas compartidas con sus permisos; certificados; variables de entorno; tabla de ruteo; archivo hosts; programas de inicio; actualizaciones instaladas; procesos que más memoria usan; estado de la VPN; y un resumen ejecutivo final.
- **Criterio de diseño:** es 100 % de solo lectura y no cambia ninguna configuración. Verifica si corre con privilegios de administrador y avisa qué secciones pueden quedar incompletas. Pide confirmación explícita antes de empezar. Si una sección falla, la registra y sigue con las demás. Guarda una transcripción completa de consola y errores, escribe la salida en UTF-8 compatible con distintas versiones de PowerShell, organiza un archivo numerado por área y comprime todo en un ZIP para el análisis.
- **Capacidad que demuestra:** relevamiento automatizado y repetible de un servidor. Sirve como línea base para diagnóstico y como insumo para auditorías de seguridad y para recibir infraestructura nueva. Muestra dominio de PowerShell, de Active Directory, de DNS, de Docker y de redes en Windows.
- **Ojo:** la salida del script contiene información crítica. En la web se cuenta la capacidad, nunca se muestran resultados ni capturas.

### 1.5 Desarrollo de software interno

| # | Frase lista para la web | Servicio de ITH que respalda | Fuente |
|---|---|---|---|
| D1 | Desarrollamos nuestro propio CRM y reemplazamos a Zoho: gestión comercial a medida de cómo trabajamos. | Desarrollo de aplicaciones | PERFIL, `fuentes-linkedin-brian.md` (proyectos internos) |
| D2 | Construimos una plataforma de comprobantes fiscales con lectura OCR e integración con ARCA. | Desarrollo de aplicaciones · Automatización con IA | PERFIL, `fuentes-linkedin-brian.md` |
| D3 | Creamos ITHOS, un asistente de IA para nuestra mesa de ayuda, desarrollado en Python y FastAPI. | Automatización con IA · Outsourcing/mesa de ayuda | PERFIL, `fuentes-linkedin-brian.md` |
| D4 | Desarrollamos Asset Vault, un inventario multiempresa de activos IT. | Desarrollo de aplicaciones · Outsourcing/mesa de ayuda | PERFIL, `fuentes-linkedin-brian.md` |
| D5 | Migramos nuestros servicios internos a herramientas open source autohospedadas, con identidad centralizada en Google Workspace. | Cloud · Redes e infraestructura | PERFIL, INFRA §7, `fuentes-linkedin-brian.md` |

Criterio de uso: de D1 a D4 son herramientas **internas**. No presentarlas como productos a la venta ni inventarles cifras, clientes o funciones que no estén acá. Sí sirven como prueba de que ITH desarrolla software a medida y lo usa en su propia operación.

---

## 2. Perfil profesional de Brian Sierra para la web

**Nombre y rol:** Brian Sierra, Jefe de Sistemas e Infraestructura IT | Redes y Automatización. También se define como SysAdmin.

**Qué construyó y administra (en términos generales):**
- Diseñó desde cero la red de la oficina y la administra: perímetro, switching y segmentación por VLANs.
- Gestiona en solitario el servidor de la empresa: Windows Server con Active Directory, DNS y carpetas compartidas.
- Montó y opera los servicios internos autohospedados: VPN propia, base de conocimientos, filtrado DNS y gestión de tareas, todos con inicio de sesión de Google Workspace.
- Escribe las automatizaciones de la empresa (PowerShell, scripts de red) y la documentación técnica de toda la infraestructura.
- Desarrolla las herramientas internas: CRM propio, plataforma de comprobantes con OCR y ARCA, ITHOS y Asset Vault.

**Formación:** Técnico Superior en Redes Informáticas en Teclab (en curso). Áreas cursadas: fundamentos de redes, interconexión de redes, servidores y servicios de red, gestión operativa en la nube (Cloud Practitioner), automatización y programabilidad de redes, scripting, lógica de programación, diseño de sistemas de información, gestión de personas, comunicación efectiva, organización del trabajo y toma de decisiones. En la web van las áreas, no las notas ni el estado de cada materia.

**Certificaciones relevantes:**
- Hikvision: HCSA Access Control
- Suprema: BioStar 2 (cursos básico e intermedio)
- Furukawa: Laserway
- Zyxel: ZCNA
- Cisco: Introduction to Cybersecurity

**Versiones para la tarjeta del equipo:**

- **Corta (~25 palabras):**
  > Brian lidera Sistemas e Infraestructura IT. Diseñó desde cero nuestra red y nuestro servidor, y hoy los administra junto con la VPN y las automatizaciones internas.

- **Media (~45 palabras):**
  > Brian es nuestro Jefe de Sistemas e Infraestructura IT. Diseñó desde cero la red y el servidor de Intellihelp y los administra como SysAdmin: directorio, VPN propia, servicios open source y automatización. También desarrolla las herramientas internas de la empresa, entre ellas un asistente de IA para la mesa de ayuda, y estudia Redes Informáticas en Teclab.

(Si la tarjeta tiene espacio para insignias, sumar debajo: Hikvision HCSA · Suprema BioStar 2 · Furukawa Laserway · Zyxel ZCNA · Cisco Intro to Cybersecurity.)

---

## 3. LISTA NEGRA: nunca publicar

Nada de lo siguiente puede aparecer en la web, ni en textos, ni en capturas, ni en diagramas, ni en metadatos, ni en el código fuente del sitio. Los ejemplos son **genéricos e inventados**, no los valores reales.

| Tipo de dato | Ejemplo genérico de lo que NO va |
|---|---|
| Direcciones IP de cualquier tipo (LAN, VPN, pública, del proveedor) | "el servidor está en la dirección n.n.n.n" |
| Rangos y subredes, máscaras, numeración de VLANs, pools DHCP | "la VLAN NN usa la red n.n.n.0 con máscara /nn" |
| Nombres de host de servidores, switches, routers y estaciones | "SERVIDOR-01", "PC-AREA-01", el nombre de sistema de un router |
| Dominio interno y subdominios de servicios internos (VPN, wiki, tareas, panel DNS y similares) | "servicio.dominio-de-la-empresa" |
| Nombres de usuario, cuentas de servicio, nombres de grupos de AD y de la VPN, correos de administradores | "la cuenta usuario.admin pertenece al grupo X" |
| Contraseñas, secretos, claves de OAuth, hashes, frases de WiFi | cualquier credencial, aunque esté "tachada" |
| Puertos de servicios y de administración | "la VPN escucha en el puerto NNNNN" |
| Reglas de firewall, NAT, ACL, listas de acceso y su orden | "se permite X desde Y" |
| Versiones exactas de sistema operativo, firmware o software (build, release, parche, KB) | "RouterOS n.nn.n", "build NNNNN", "KBnnnnnnn" |
| Modelos exactos, números de serie y direcciones MAC de equipos | "switch modelo XXXX-NN", "SN ABC123" (en la web, solo marca: MikroTik, Huawei, Zyxel, Hikvision) |
| Proveedor de internet, velocidad contratada, IP pública, DDNS | "enlace de NNN Mbps con el proveedor X" |
| Ubicación, frecuencia, horario, formato y retención de los respaldos | "los respaldos se guardan en X los días Y a las Z" |
| Rutas de archivos y carpetas, nombres de contenedores, de tareas programadas y de scripts | "unidad:\...\carpeta", "contenedor-x" |
| Qué software corre en qué equipo y cómo arranca | "el servidor X ejecuta el software Y al iniciar" |
| Inventario: cantidad y tipo de equipos, puertos del switch, nodos de VPN, teléfonos, cámaras | "N cámaras y un grabador en el puerto X" |
| Nombres de empleados que figuran en los documentos (salvo Brian, con su nombre y cargo) | cualquier otro nombre del directorio |
| Recursos compartidos, permisos, estructura de carpetas | "la carpeta X la puede leer el grupo Y" |
| Mediciones internas de equipos (memoria, CPU, cantidad de servicios o puertos abiertos) | "el servidor tiene N GB libres" |
| Cualquier pendiente, riesgo, debilidad, credencial expuesta o mejora a futuro de la infraestructura | "todavía falta implementar X" |
| Comparaciones "antes y después" que revelen cómo estaba configurado algo antes | "antes cualquier equipo podía acceder a X" |
| Comandos, fragmentos de configuración, salidas de consola o del script de auditoría | capturas de terminal, bloques de código |
| Todo el contenido de la documentación de mi red doméstica (es personal) | cualquier dato de ese documento |
| El ZIP de auditoría y cualquier archivo que genere el script | — |

Regla práctica: **si una frase le sirve a un atacante para entender cómo está armada la red, no va.** La web cuenta *qué sabemos hacer*, nunca *cómo está configurado lo nuestro*.

---

## 4. Párrafo para Servicios o Historia

> Lo que hacemos para nuestros clientes lo hacemos primero en casa. La red, el servidor y los servicios internos de Intellihelp los diseñamos y administramos nosotros: directorio, VPN propia con acceso por Google Workspace, filtrado DNS, base de conocimientos y automatización con scripts propios. Así, cuando recomendamos una solución, es porque ya la configuramos, la documentamos y la usamos todos los días.
