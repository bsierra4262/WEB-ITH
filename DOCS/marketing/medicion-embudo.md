# Medición del embudo en la web nueva

Clau, te dejo cómo quedó la medición en la web nueva, para que armes las etiquetas en GTM sobre esto. Todo lo que mide el sitio sale por el `dataLayer`; vos decidís en el contenedor qué se manda a GA4, a Google Ads y a LinkedIn.

## Contenedor

- **ID:** `GTM-54S82VL3`, el mismo que ya está en el WordPress.
- Se carga igual que el snippet oficial (`dataLayer` + `gtm.start` y `gtm.js` async), solo en `intellihelp.tech`. En local no carga nada salvo que abras la página con `?analytics`.
- **GA4 y Clarity van solo por GTM.** El sitio no los carga directo, así que no se cuenta doble.
- **Sin `<noscript>`.** Sin JavaScript no corre ninguna de las etiquetas que vamos a usar (GA4, Clarity, Ads y LinkedIn necesitan JS), así que el iframe no sumaba datos. Por lo mismo, la verificación de Search Console "por Tag Manager" no va a andar (ver abajo).

## Lo que no corre en GTM

La web tiene una política de seguridad (CSP) que solo deja cargar scripts de dominios conocidos:

- **No corren** las etiquetas de **HTML personalizado** ni las variables de **JavaScript personalizado**.
- **Sí corren** las plantillas oficiales: etiqueta de Google (GA4), conversiones y remarketing de Google Ads, la plantilla oficial de Microsoft Clarity y la de LinkedIn Insight Tag.
- **Ya habilitados:** GA4, Google Ads, Clarity, LinkedIn, YouTube, Calendly, Google Calendar y la vista previa de Tag Assistant. Si necesitás otra herramienta, pasame el dominio y lo agrego.
- **Conversiones mejoradas con datos del usuario:** te pido que no las actives. El sitio nunca pone nombre ni mail en el `dataLayer`, y el aviso de privacidad dice que esas herramientas no los reciben.

## Eventos del dataLayer

Todos llevan `page_path` y, si se conoce, `canal`: el canal de la primera visita, explicado más abajo.

| Evento | Cuándo | Parámetros |
|---|---|---|
| `generate_lead` | Envío correcto del formulario "Agendá una reunión" | `form_id`, `origen` (página del formulario), `servicio` (lo que eligió en "¿Qué necesitás?") |
| `schedule_meeting` | Reunión confirmada en la agenda de `/diagnostico/` (o en Calendly, si algún día se usa) | `calendar_type` (`crm`), `landing_visit`, `servicio` |
| `click_whatsapp` | Clic en cualquier link a WhatsApp | `link_location` |
| `click_phone` | Clic en el teléfono | `link_location` |
| `click_email` | Clic en un mail | `link_location` |
| `click_calendar` | Clic que lleva al calendario | `click_target`, `calendar_type`, `link_location` |
| `scroll_depth` | Bajó al 25, 50, 75 y 90 % de la página (una vez cada uno) | `percent_scrolled` |
| `video_progress` | Video de la landing: inicio, 25, 50, 75 y final | `video_status` (`start`, `progress`, `complete`), `video_percent` (0 a 100), `video_title`, `video_provider` (`youtube` o `propio`) |
| `view_diagnostico` | Cada visita a `/diagnostico/` | `landing_visit` (1 la primera vez, 2 o más si volvió) |

**Valores de los parámetros:**

- **`link_location`:** `header`, `footer`, `flotante` (el botón de WhatsApp) o el id de la sección (`agenda`, `faq`…).
- **`click_target`:**
  - `link_diagnostico`: un botón de cualquier página que lleva a `/diagnostico/`.
  - `ancla_calendario`: un botón de la landing que baja al calendario.
  - `calendario`: el primer clic dentro del calendario embebido.
  - `horario`: eligió día y hora en la agenda de la landing (una vez por página) o en Calendly.
  - `link_calendario`: un link directo a la agenda.
- **`calendar_type`:** `crm` (la agenda de la landing), `calendly`, `google_calendar`, `diagnostico` u `otro`.
- **`landing_visit`:** se cuenta una vez por sesión del navegador, así que recargar no suma. Sirve para "regresos a la landing" y "reuniones en la segunda visita".

**El calendario:**

- **La landing usa la agenda de nuestro CRM.** El selector de día y hora es parte de la página, no un iframe, así que medimos todo: `click_calendar` con `click_target: horario` al elegir un horario y `schedule_meeting` con `calendar_type: crm` cuando el CRM confirma la reunión. Esa es la conversión de "reunión agendada". Una reserva no dispara `generate_lead`, para no contarla dos veces.
- **Si el CRM no responde o no hay horarios,** la landing muestra el formulario de siempre y la conversión es `generate_lead`.
- **En el CRM queda cada reunión y cada consulta** con la página, el canal, las UTM, el `gclid` y la cantidad de visitas a la landing (pantalla "Entradas desde la web"). Sirve para cruzar "reuniones agendadas", "reuniones realizadas" y "canal de origen" con lo que muestra GA4.
- **Con Calendly**, el sitio escucha el aviso `calendly.event_scheduled` y dispara `schedule_meeting`: es la conversión real de reunión agendada.
- **Con la página de citas de Google Calendar**, Google no avisa nada a la página. No hay forma de saber si agendó, así que la conversión queda en `generate_lead` (el formulario) y `click_calendar` sirve como señal de intención. Las reuniones agendadas se cuentan en el calendario de Carlos.

**El video:** sirve un YouTube embebido (el de la landing es `youtube-nocookie` con `enablejsapi=1`) o un `<video>` propio. La API de YouTube se carga solo cuando hay video.

## Canal de origen

La primera vez que alguien entra, el navegador guarda durante 90 días:

- `utm_source`, `utm_medium`, `utm_campaign`, `utm_term` y `utm_content`;
- `gclid` y `li_fat_id`;
- el sitio de donde vino y la primera página que vio.

Con eso arma `canal`:

- **Anuncios:** `Google Ads` (si hay `gclid` o un UTM pago de Google) y `LinkedIn Ads`.
- **Orgánico y directo:** `LinkedIn`, `Google (búsqueda)`, `Bing (búsqueda)`, `Mail` y `Directo`.
- **Asistentes de IA:** `IA: ChatGPT`, `IA: Perplexity`, `IA: Gemini`, `IA: Copilot` e `IA: Claude`.
- **Otros:** `Campaña: fuente / medio` para cualquier otro UTM y `Otro sitio: dominio`.

Todo eso viaja en campos ocultos del formulario y de la agenda, y queda registrado en el CRM junto con la consulta o la reunión. El mail que recibe Carlos termina con "Cómo llegó al sitio (primera visita)": canal, UTM, sitio de origen, primera página y el `gclid` si vino de un anuncio. Para los posts de Carlos conviene usar UTM, por ejemplo `?utm_source=linkedin&utm_medium=social&utm_campaign=post-carlos`.

## Qué marcar en GA4

**Eventos clave (conversiones):**

- `generate_lead`
- `schedule_meeting`
- `click_whatsapp`

El informe de visibilidad también cuenta `click_phone` y `click_email`; si querés tener las cuatro, marcalos también.

**Para no contar doble**, en la medición mejorada del flujo web apagá:

- **Desplazamientos**: ya está `scroll_depth`, con más cortes.
- **Interacciones con videos**: ya está `video_progress`.
- **Interacciones con formularios**: la conversión buena es `generate_lead`.

**Dimensiones personalizadas** (de evento), para poder verlos en los informes: `canal`, `link_location`, `click_target`, `calendar_type`, `percent_scrolled`, `video_status`, `video_percent`, `video_title`, `servicio` y `landing_visit`.

## Activadores sugeridos en GTM

**Variables:**

- Una **variable de capa de datos** por cada parámetro de la tabla.
- `Event`, que ya viene incluida.

**GA4:**

- Un activador de **evento personalizado** con la expresión regular `^(generate_lead|schedule_meeting|click_whatsapp|click_phone|click_email|click_calendar|scroll_depth|video_progress|view_diagnostico)$`.
- Una sola etiqueta de **evento de GA4** con nombre `{{Event}}` y los parámetros mapeados a sus variables.

**Google Ads:**

- **Conversiones:** una por cada evento, `generate_lead` y `schedule_meeting`, cada una con su propio activador de evento personalizado.
- **Remarketing:** la etiqueta de Google (`AW-…`) y el vinculador de conversiones, en todas las páginas.

**LinkedIn:**

- La plantilla de Insight Tag en todas las páginas.
- Las conversiones de `generate_lead` y `schedule_meeting` con el mismo tipo de activador.

**Audiencias de remarketing** (el "Recuperar" del embudo):

- Visitó `/diagnostico/` (`view_diagnostico`) y no tiene `generate_lead` ni `schedule_meeting`.
- Vio al menos el 50 % del video y no agendó.

## Cómo probar

1. **En local:**
   - Con `npm run dev`, abrí `http://localhost:5173/?analytics`. La marca queda activa en esa pestaña al navegar, y `?analytics=0` la apaga.
   - En la consola del navegador cada evento sale como `[analytics] nombre {parámetros}`.
   - Con `dataLayer` en la consola ves la cola completa.
2. **Tag Assistant:** en GTM tocá **Vista previa** y conectá `http://localhost:5173/?analytics`, o el sitio publicado.
   - Ojo: lo que pruebes en local con `?analytics` llega a GA4 con el host `localhost`. Si molesta, filtralo por nombre de host.
   - En el sitio publicado, `?analytics=0` apaga GTM en esa pestaña. Nos sirve para no contar nuestras propias visitas.
3. **Canal:**
   - Entrá en una ventana privada con `?utm_source=prueba&utm_medium=test`, navegá a otra página y mandá el formulario. En local el envío es simulado: los campos se ven en la terminal de `npm run dev`.
   - Para volver a empezar, borrá `ith_origen` en Herramientas para desarrolladores → Aplicación → Almacenamiento local.

## Search Console

- **Verificación:** por **DNS**, como pide el informe. Es una propiedad de dominio y cubre `www`, sin `www`, `http` y `https`. El registro TXT lo cargo yo en Hostinger cuando me lo pases.
- La verificación por Tag Manager no sirve acá: pide el snippet con `<noscript>` en el HTML.
- Antes de publicar copio al sitio nuevo el archivo de verificación HTML que ya existía (`google9ffcbef7277c41a3.html`), para no perder la propiedad actual.
- **Cuando se publique:** enviar `https://www.intellihelp.tech/sitemap.xml` y pedir la indexación de la home. En las semanas siguientes, las URL viejas del WordPress tienen que figurar como "Página con redirección".

Cualquier evento o parámetro que quieras sumar, decime y lo agrego en el sitio.

Brian
