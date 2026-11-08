# Íconos de la presentación institucional 2026

Íconos sacados de "Presentación Institucional ITH-20261104 v1.pptx" (carpeta `ppt/media` del archivo), con el nombre que tienen en la presentación. La diapositiva es la del PDF (1 a 36). La columna "Origen" es el nombre del archivo dentro del pptx, por si hace falta volver a buscarlo.

## Cosas a tener en cuenta antes de usarlos

- **Verde** = `#99cc33` (verde lima de la marca). **Violeta** = `#663399` en los PNG y `#6c3e99` en los SVG; algunos tienen otro tono (`#8a64b1`, `#835bad`, `#8c65b2`), igual que en la presentación.
- **Los SVG** son de trazo (`stroke`) o de relleno (`fill`) con el color fijo en el atributo. Para usarlos en la web conviene cambiar ese color por `currentColor` y que tomen el color del CSS, como los íconos que ya tiene la plantilla.
- **Los PNG** son chicos (entre 36 y 151 px de lado) y tienen fondo transparente. Se ven bien hasta unos 48 px; para la tarjeta grande o pantallas retina hay que redibujarlos en SVG con el mismo dibujo. Los escudos de seguridad y el de "mayor seguridad" tienen relleno blanco adentro.
- De **Servicios** está el juego completo en SVG verde (diapositiva 9). De **Soluciones** solo está en SVG "Tecnología colaborativa"; el resto viene en PNG violeta (diapositiva 8).
- Los íconos de **Nuestros pilares** (comunicación, equipos motivados, calidad humana, diapositiva 6) no vienen sueltos: forman parte de una sola imagen con los tres círculos (`image23.png`), por eso no se copiaron.

## Servicios (`servicios/`)

| Archivo | Qué representa | Diapositiva | Formato | Color | Tarjeta de la web |
|---|---|---|---|---|---|
| mesa-de-ayuda.svg | Service Desk (monitor) | 9 | SVG | verde | #servicios › 01 Mesa de ayuda |
| mesa-de-ayuda-violeta.svg | Service Desk (monitor) | 12 | SVG | violeta | #servicios › 01 Mesa de ayuda (variante oscura); casos con etiqueta "Mesa de ayuda" |
| mesa-de-ayuda-equipo-violeta.png | Service Desk en "Servicios de Outsourcing" (tres personas) | 10 | PNG 73×50 | violeta | alternativa para Mesa de ayuda |
| manpower-outsourcing.svg | Manpower: reclutamiento, tercerización de personal (persona en red) | 9 | SVG | verde | #servicios › 02 Outsourcing |
| manpower-outsourcing-violeta.png | Manpower | 10 y 11 | PNG 78×66 | violeta | 02 Outsourcing; casos "Outsourcing" |
| busqueda-de-recursos.svg | Búsqueda de recursos (lupa) | 9 | SVG | verde | #servicios › 03 Búsqueda de recursos |
| busqueda-de-recursos-violeta.png | Búsqueda de recursos (lupa) | 10 y 15 | PNG 64×63 | violeta | 03 Búsqueda de recursos; casos "Búsqueda de personal" |
| automatizacion.svg | Automatización (dos nodos unidos) | 9 | SVG | verde | #servicios › 04 Automatización |
| automatizacion-violeta.svg | Automatización | 16 | SVG | violeta | 04 Automatización |
| consultoria.svg | Consultoría (globos de diálogo) | 9 | SVG | verde | #servicios › 05 Consultoría |
| consultoria-violeta.png | Consultoría | 10 y 14 | PNG 63×52 | violeta | 05 Consultoría; casos "Consultoría" |
| desarrollo-de-apps.svg | Desarrollo de App's (celular) | 9 | SVG | verde | #servicios › 06 Desarrollo de apps |
| desarrollo-de-apps-violeta.png | Desarrollo de aplicaciones | 10 y 13 | PNG 36×60 | violeta | 06 Desarrollo de apps; casos "Desarrollo" |
| capacitacion.svg | Capacitación (lápiz) | 9 | SVG | verde | #servicios › 07 Capacitación |
| capacitacion-violeta.png | Capacitación (lápiz) | 18 y 19 | PNG 60×61 | violeta | 07 Capacitación |
| transformacion-digital.svg | Transformación Digital (ubicación con flecha) | 9 | SVG | verde | **no tiene tarjeta**: la web no incluye este servicio |
| transformacion-digital-violeta.svg | Transformación Digital | 17 | SVG | violeta | ídem |

## Soluciones (`soluciones/`)

| Archivo | Qué representa | Diapositiva | Formato | Color | Tarjeta de la web |
|---|---|---|---|---|---|
| cloud.png | Cloud (nube con flecha) | 8 y 24 | PNG 86×51 | violeta | #soluciones › 01 Cloud; casos "Cloud" |
| seguridad-videovigilancia.png | Seguridad (cámara domo) | 8 y 22 | PNG 58×44 | violeta | #soluciones › 02 Video seguridad; casos "Seguridad física" |
| iot.png | IOT (nodo central con conexiones) | 8 y 26 | PNG 70×65 | violeta | #soluciones › 03 IoT; casos "IoT" |
| data-center.png | Data Center (servidores en rack) | 8 y 20 | PNG 73×49 | violeta | #soluciones › 04 Data center; casos "Data center" |
| energias-renovables.png | Energías renovables (hojas) | 8 y 27 | PNG 62×58 | violeta | #soluciones › 05 Energías renovables; casos "Energías renovables" y "Energía" |
| redes-outdoor.png | Redes outdoor FTTx (casa, edificio y poste unidos) | 8 y 25 | PNG 75×48 | violeta | #soluciones › 06 Redes outdoor; casos "Fibra óptica" |
| redes-indoor.png | Redes indoor (organigrama de red) | 8 y 20 | PNG 84×57 | violeta | #soluciones › 07 Redes indoor; casos "Redes" |
| redes-de-acceso.png | Acceso (globo terráqueo) | 8 y 20 | PNG 64×64 | violeta | #soluciones › 08 Redes de acceso |
| ciberseguridad.png | Ciberseguridad (escudo) | 8 y 21 | PNG 78×77 | violeta claro `#835bad` | #soluciones › 09 Ciberseguridad |
| tecnologia-colaborativa.svg | Tecnología Colaborativa (pantalla con personas) | 8 y 23 | SVG | violeta | **no tiene tarjeta**: la web no incluye esta solución; serviría para casos "Telefonía IP" |

## Seguridad física (`seguridad/`, diapositiva 22 "Soluciones de Seguridad")

Sirven para los chips o el detalle de la tarjeta "Video seguridad" y para los casos de seguridad física (El Cronista, Ayassa Fombella, EVE, SRT, Nación Seguros).

| Archivo | Qué representa | Formato | Color |
|---|---|---|---|
| control-de-acceso.png | Control de acceso biométrico y convencional (escudo con ojo) | PNG 59×66 | violeta, escudo blanco |
| videovigilancia-ip.png | Vigilancia por video IP (escudo con cámara) | PNG 60×67 | violeta, escudo blanco |
| reconocimiento-facial.png | Reconocimiento facial y de patentes con IA | PNG 59×53 | violeta |
| control-de-temperatura.png | Control de temperatura y uso de barbijo | PNG 46×62 | violeta |
| totems-de-seguridad.png | Tótems de seguridad | PNG 55×59 | violeta |
| parking-inteligente.png | Parking inteligente (auto) | PNG 67×52 | violeta |
| drones.png | Seguridad con drones | PNG 74×33 | violeta |
| porteria-consorcios.png | Portería para consorcios y barrios (edificios) | PNG 62×63 | violeta |
| cercos-perimetrales.png | Seguridad para cercos perimetrales | PNG 62×55 | violeta |
| detector-de-metales.png | Arco detector de metales y armas / rayos X | PNG 59×55 | violeta |

## Valores y diferenciales (`valores/`)

| Archivo | Qué representa | Diapositiva | Formato | Color | Dónde va en la web |
|---|---|---|---|---|---|
| rapidez.png | Rapidez en el armado de soluciones (cronómetro) | 4 | PNG 89×109 | violeta | #como-trabajamos › 03 Implementar |
| eficacia.png | Eficacia: mejor ecuación costo/beneficio (diana) | 4 | PNG 109×108 | violeta | #como-trabajamos › 02 Proponer |
| conocimiento.png | Conocimiento en los servicios (libro abierto) | 4 | PNG 107×107 | violeta | #equipo (certificaciones) o capacitación |
| flexibilidad.png | Flexibilidad: servicio a medida (regla curva) | 4 | PNG 151×52 | violeta | #preguntas o #como-trabajamos |
| experiencia.png | Experiencia, más de 15 años (medalla) | 5 | PNG 81×127 | violeta | #historia (cifra de años) y cifras del hero |
| know-how-equipo.png | Know how: profesionales certificados (grupo de personas) | 5 | PNG 141×100 | violeta | #equipo |
| acompanamiento.svg | Acompañamiento a los clientes (dos personas conversando) | 5 | SVG | violeta `#8a64b1` | #equipo o #como-trabajamos |
| alianzas-estrategicas.png | Alianzas con fabricantes (apretón de manos) | 5 | PNG 104×68 | violeta | #socios |

Para "01 Detectar" de #como-trabajamos la presentación no tiene un ícono propio; el más cercano es la lupa (`servicios/busqueda-de-recursos-violeta.png`).

## Redes outdoor FTTx (`redes-outdoor/`, diapositiva 25)

| Archivo | Qué representa | Formato |
|---|---|---|
| capacidad-y-alcance.png | Mayor capacidad, flexibilidad y alcance (barras); se repite en la 27 como "Soluciones escalables" | PNG 96×89 |
| inmune-a-interferencias.png | Inmunes a interferencias electromagnéticas (antena tachada) | PNG 113×113 |
| mayor-seguridad.png | Mayor seguridad (escudo con cruz, relleno blanco) | PNG 102×113 |
| bajo-costo-de-mantenimiento.png | Bajos costos de mantenimiento (flecha con signo $) | PNG 89×112 |

Todos violeta. Van en el detalle de la tarjeta "Redes outdoor".

## IoT (`iot/`, diapositiva 26)

| Archivo | Qué representa | Formato |
|---|---|---|
| asistentes-virtuales.png | Integración con asistentes virtuales (cabeza con circuito) | PNG 89×99 |
| hardware-software-en-la-nube.png | Soluciones integrales de hardware y software en la nube | PNG 130×110 |
| protocolos-inalambricos.png | Diversos protocolos: WiFi, LoRa, LoRaWAN, Bluetooth, TCP/IP (antena) | PNG 83×113 |
| plataforma-en-la-nube.png | Plataforma en la nube con seguimiento en tiempo real (celular con ubicación) | PNG 69×113 |

Todos violeta. Van en el detalle de la tarjeta "IoT" y en los casos Ituran, Petropack y Ministerio de Educación.

## Energías renovables (`energias-renovables/`, diapositiva 27)

| Archivo | Qué representa | Formato |
|---|---|---|
| energia-solar.png | Generación de energía solar autónoma llave en mano (panel solar) | PNG 93×106 |
| sistemas-on-off-grid.png | Sistemas on grid, off grid e híbridos (panel con poste de red) | PNG 106×75 |
| datacenter-modular.png | Fusion Module 5000, datacenter modular Huawei (rack) | PNG 76×93 |
| asesoramiento-subsidios.png | Asesoramiento en trámites de subsidios (documentos) | PNG 91×90 |

Todos violeta. Van en el detalle de la tarjeta "Energías renovables" y en el caso Los Noques. "Soluciones escalables" usa el mismo dibujo que `redes-outdoor/capacidad-y-alcance.png`.

## Contacto (`contacto/`, diapositiva 35)

| Archivo | Qué representa | Formato | Dónde va en la web |
|---|---|---|---|
| ubicacion.png | Dirección (pin) | PNG 77×113 | #agenda (dirección); también #presencia y #presencia-regional |
| telefono.png | Teléfono | PNG 85×104 | #agenda (WhatsApp / teléfono) |
| email.png | Correo | PNG 127×91 | #agenda (mail) |

Los tres en violeta `#663399`, solo trazo.

## Casos (`casos/`)

| Archivo | Qué representa | Diapositiva | Formato | Color | Dónde va en la web |
|---|---|---|---|---|---|
| casos-de-exito-red.png | Red de personas conectadas, junto al título "Casos de Éxito" | 31, 33 y 34 | PNG 180×180 | gris muy claro `#f2f2f2` (para fondo oscuro o marca de agua) | #casos (encabezado) |

## Secciones de la web sin ícono en la presentación

- **#presencia / #presencia-regional**: no hay mapa ni ícono de cobertura; se puede usar `contacto/ubicacion.png`.
- **#historia**: solo la medalla de "Experiencia".
- **#preguntas**: nada específico.
- **Mantenimiento 7x24** (etiqueta de casos): no tiene ícono propio; lo más cercano es `servicios/mesa-de-ayuda-violeta.svg`.
