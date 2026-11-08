# /diagnostico-sin-cargo/ y /gracias-reserva/: especificación y textos

Páginas propias de Intellihelp para reservar un diagnóstico sin cargo. La referencia de forma es la página que armó la
agencia de Clau (https://claucave.com/diagnostico-sin-cargo/ y su paso siguiente, https://claucave.com/gracias-reserva/),
relevada el 6/11 a 1440×900 y 390×844. De ahí se toman **el recorrido en dos pantallas, la estructura y lo que la hace
clara**; los textos son nuestros. **El formulario no es el de la referencia:** es un bloque de reserva propio, con el
calendario primero (día y horario → tus datos → confirmación), conectado a la agenda del CRM (`js/agenda.js` +
`api/agenda.php`). La consulta sin turno queda como alternativa dentro del mismo bloque.

Capturas de la referencia: capturas de referencia guardadas fuera del repositorio (página completa y pantalla de
gracias, a 1440 y 390, con los datos medidos).

---

## 1. Cómo está armada la referencia (medido)

**Recorrido en dos pantallas.** La página pide los datos primero y recién después muestra el calendario:

1. `/diagnostico-sin-cargo/`: título, bajada, video de la persona que atiende, formulario en una franja, casos y un pie mínimo.
2. Al enviar: el botón pasa a "Guardando...", el lead se guarda (`POST /wp-json/.../lead`), aparece "Listo. Te llevo al
   calendario..." y a los **900 ms** redirige a `/gracias-reserva/`.
3. `/gracias-reserva/`: rótulo "Datos recibidos", título personalizado con el nombre, qué esperar de la reunión, una lista
   de **tres cosas para tener a mano**, el calendario de turnos embebido (644×660) con la alternativa "si no elegís, te
   escribo dentro de 24 h" y una firma.

**Orden de la primera pantalla (1440):**

| # | Bloque | Medidas |
|---|---|---|
| 1 | Header oscuro de 68 px con un único CTA "Agendar diagnóstico →" (abre el mismo formulario en un modal) | Modal de 520 px, radio 16, fondo casi negro |
| 2 | Hero en 2 columnas: título + bajada a la izquierda, video de la persona a la derecha (600×338) | H1 52 px / 800 / lh 1.14 / −1.3 px, 556 px de ancho; en 390: 30 px |
| 3 | Formulario en una franja horizontal debajo del hero, a 593 px del borde superior | 4 campos + botón en una fila, inputs de 46 px, borde 1 px `rgba(0,0,0,.22)`, radio 0; labels de 13 px arriba |
| 4 | Nota de privacidad debajo del botón | 13.5 px, gris |
| 5 | Casos: rótulo, h2 de 26 px y bajada; carrusel con scroll-snap de 5 tarjetas | Tarjeta de 360 px, gap 20, contador "02/05", bloques "Antes / Qué se hizo / Hoy" |
| 6 | Línea "Los nombres se publican con autorización de cada cliente." | — |
| 7 | Pie mínimo con aviso de la Ley 25.326 | — |

**Formulario:** nombre y apellido*, empresa, mail laboral*, WhatsApp con código de país*, "¿Cómo nos conociste?"
(opcional: LinkedIn, Google, ChatGPT u otro asistente, YouTube, Instagram, Recomendación, Otro), trampa para bots oculta,
UTM y gclid guardados en `sessionStorage`. Valida en el navegador con mensajes en primera persona, uno por vez.

**No tiene:** pasos, preguntas frecuentes, testimonios, logos ni cifras. La prueba social son los casos con nombre.

**Movimiento:** el formulario **nunca** se anima ni se demora. El header se compacta pasados 48 px de scroll
(`translate .45s cubic-bezier(.23,1,.32,1)`). La frase clave del título se "escribe" con `clip-path` en 0.95 s. Los casos entran
con 18 px y opacidad (`.7s` / `.9s`, la misma curva) escalonados cada 90 ms, solo si están debajo del pliegue. En hover las
tarjetas suben 4 px en 0.35 s.

### Qué la hace profesional y clara
1. **Una sola promesa medible en el título:** duración + "sin cargo".
2. **Para quién es y con qué te vas,** en una oración.
3. **Una cara:** se ve a la persona con la que vas a hablar.
4. **La acción está arriba:** el formulario aparece en la primera pantalla y el CTA del header lleva al mismo lugar.
5. **Pocos campos y mensajes humanos:** el error dice qué falta y cómo corregirlo.
6. **Expectativa explícita después de enviar:** qué pasa, cuánto dura, qué no va a pasar ("no hay presentación de venta") y qué
   conviene preparar.
7. **Una salida si no querés elegir horario:** te contactan ellos.
8. **Privacidad dicha en criollo** junto al botón, más la ley al pie.
9. **Prueba con nombre propio y aclaración de permiso.**

### Qué hacemos distinto (y por qué)
- **Calendario primero, datos después.** Nuestro CRM ya ofrece los turnos libres. Elegir el horario es lo que más
  compromete y lo más fácil de hacer, así que va antes de pedir datos, en un bloque de reserva propio de tres pasos.
- **Sin modal.** El CTA del header baja al bloque de reserva (`#agendar`) y deja el foco en el paso que se ve.
- **La pantalla de gracias confirma, no pide.** En la referencia el calendario aparece recién en `/gracias-reserva/`; acá la
  reunión ya está agendada al llegar, y esa pantalla confirma día, horario e invitación y dice qué tener a mano.
- **Header y pie del sitio.** La barra es la misma de todas las páginas (carbón, menú completo y un único CTA).

---

## 2. Cómo quedó la página de Intellihelp (implementada)

Dos pantallas en HTML (no WordPress): `TEMPLATE-NICO/diagnostico-sin-cargo/index.html` y
`TEMPLATE-NICO/gracias-reserva/index.html`, con `css/diagnostico.css` y `js/diagnostico.js` además de `styles.css`,
`main.js` y, en la primera, `agenda.js`. Usan el **header común del sitio** (barra carbón con el logo y "Servicios IT /
desde 2010", menú en mayúsculas y el CTA "Agendá reunión →"), la **animación de carga común** (`css/carga.css` +
`js/carga.js`) y el **botón común** `.btn` (misma animación de hover, foco y clic que la home). Colores, tipografía y logo
de Intellihelp; ningún control nativo a la vista y ningún subrayado.

### 2.1 /diagnostico-sin-cargo/ (fondo lavanda)

| # | Bloque | Contenido |
|---|---|---|
| 1 | Header común | En esta página el CTA es `href="#agendar"` (`data-dx-ir="agenda"`): baja al bloque de reserva y deja el foco en el título del paso que se ve. Sin modal. |
| 2 | Primera pantalla | Título "Diagnóstico IT: **30 minutos** sin cargo" (la frase clave se "escribe" con `clip-path` cuando sale el telón de la carga), bajada y video de presentación 16:9 a la derecha (en celular, debajo). Mientras no hay video se ve el marco con la marca y "Video de presentación (próximamente)". |
| 3 | Bloque de reserva `#agendar` | Franja de borde a borde debajo del hero. A la izquierda, en carbón: "Reservá tu reunión" y los datos (30 minutos · Videollamada por Google Meet · Con un especialista de Intellihelp · Sin cargo y sin compromiso) y la alternativa "¿Preferís que te contactemos? Dejanos tu consulta →". A la derecha, el indicador de pasos (01 Día y horario · 02 Tus datos · 03 Confirmación) y el paso que corresponde. |
| 4 | Casos | Carrusel con flechas a los costados y cinco casos (LoJack/Grupo Strix, SRT, Parques Nacionales, Nación Seguros, AGIP) con los bloques Antes / Qué se hizo / Hoy, y la nota "Los nombres se publican con autorización de cada cliente." |
| 5 | Pie mínimo | Logo, © y aviso de la Ley 25.326 con enlace a `/privacidad/`. |

**Paso 1, día y horario (calendario primero).** Calendario mensual propio (`[data-dx-mes]`, lo arma `diagnostico.js` con los
días que trae `agenda.js`) y, al lado, los horarios del día elegido. Teclado: flechas (día y semana), Inicio y Fin. Hora de
Argentina (GMT−3). Si ningún horario sirve: WhatsApp (con mensaje precargado) o info@intellihelp.tech.

**Paso 2, tus datos.** El turno elegido arriba con "Cambiar". Campos: nombre y apellido, empresa u organismo, mail laboral,
WhatsApp con código de país, "¿Cómo nos conociste?" en chips propios (LinkedIn, Google, ChatGPT u otro asistente, YouTube,
Instagram, Recomendación, Ya somos clientes, Otro; tocar de nuevo la elegida la suelta), casilla de consentimiento propia
(texto idéntico a `CRM_CONSENTIMIENTOS['web-2026-11']`) y trampa para bots oculta. Validación de a un mensaje, debajo del
campo. Botón "Confirmar reunión →" (`.btn .btn-lime`).

**Paso 3, confirmación.** Con la reunión confirmada, `diagnostico.js` guarda nombre, mail, horario y duración en
`sessionStorage` (`ith_reserva`) y pasa a `/gracias-reserva/`. Si no se puede guardar, la confirmación queda en el bloque.

**Consulta sin turno.** "Dejanos tu consulta" cambia el bloque al formulario de consulta (`api/contact.php`) con "Volver a
los horarios". Si el CRM no responde o no quedan horarios, el bloque abre directamente la consulta. Sin JS se ve la
consulta y funciona con un POST normal.

**Origen y medición.** UTM, gclid y li_fat_id de la URL se guardan también en `sessionStorage` (`ith_campana`) como
respaldo de `ith_origen`. Eventos: `cta_click`, `click_calendar`, `schedule_meeting` y `cf7_enviado`.

### 2.2 /gracias-reserva/ (fondo carbón)

- Rótulo "Reunión confirmada", título "Listo, {nombre}." y el día y horario elegidos, con el mail al que se mandó la
  invitación de Google Calendar con el enlace de Meet.
- Qué esperar: 30 minutos, un panorama claro y los próximos pasos; no es una presentación comercial.
- "Para que la reunión rinda, tené a mano" (tres ítems numerados a la izquierda) y "¿Necesitás cambiar el horario?"
  (responder la invitación, WhatsApp con mensaje precargado o mail).
- Firma "El equipo de Intellihelp".
- Si alguien entra directo (sin reserva en la pestaña), ve "Reservá tu diagnóstico." con el botón "Ir a la agenda →".
- `noindex`: no está en el sitemap.

### 2.3 Movimiento

- El bloque de reserva **no se anima nunca**: está quieto desde el primer pintado.
- La animación de carga común corre en cada carga, recarga y al volver con Atrás (con "reducir movimiento", su versión
  quieta). La frase del título espera a que salga el telón.
- Los casos entran escalonados al bajar y suben 4 px en hover. Con "reducir movimiento", todo quieto.

---

## 3. Textos

Todos en voseo y en tono institucional; son los que están publicados en las dos páginas (la fuente es el HTML). Lo que
sigue abierto para confirmar:

- Que después de la reunión se manda un resumen por mail.
- La nota "Los nombres se publican con autorización de cada cliente."
- El campo "¿Cómo nos conociste?" viaja hoy en el mensaje al CRM; conviene que el CRM tenga un campo propio.
