# Fuente: perfil de Brian Sierra para la web

Textos listos para la tarjeta del equipo (home) y para /nosotros/. Salen de `DOCS/privado/perfil/perfil-tecnico-brian.md` (sección 0, "Cargo definitivo"), de `fuentes-linkedin-brian.md`, de `analisis-titulaciones.md` y de la definición del puesto: dirijo y estoy a cargo del equipo de soporte técnico, además del trabajo de sysadmin.

Fecha: 23/10/2026.

Qué no entra en estos textos: las herramientas internas que desarrollé (la autoría está pendiente de acuerdo con Carlos), que la red o el servidor los diseñé yo (capacidad interna, va en `data-draft`), datos de los recibos de sueldo, antigüedad exacta y cursos vencidos.

---

## 1. Cargo para la tarjeta

**Jefe de sistemas y soporte técnico**

- Tiene 34 caracteres, menos que el actual (37), así que entra en los mismos dos renglones como máximo.
- Va con minúscula inicial como el resto de los cargos del sitio; la clase `eyebrow` lo muestra en mayúsculas.
- Reemplaza a "Jefe de sistemas e infraestructura IT". Por qué se eligió este y no otro: sección 0.3 del perfil técnico. En corto: nombra las dos cosas que hace (los sistemas de la empresa y el equipo de soporte que dirige), es el área que el cliente de Intellihelp conoce y no promete más de lo que hay.
- Cambiar también el `alt` de la foto: "Brian Sierra, jefe de sistemas y soporte técnico de Intellihelp".

## 2. Descripción para la tarjeta (36 palabras)

> Lidera el equipo de soporte técnico de Intellihelp, el mismo en el que empezó en 2024. También administra la infraestructura de la empresa, del servidor a la red de la oficina. Estudia Redes Informáticas en Teclab.

- Tercera persona, sin marcas (las certificaciones van en la línea de abajo, así no se repiten).
- Dice que administra la infraestructura, no que la diseñó. Lo segundo queda en el párrafo `data-draft` hasta que Carlos lo apruebe.
- Reemplaza al párrafo publicado de hoy ("Lidera el equipo de soporte técnico. Está certificado en control de acceso Hikvision…"). El párrafo `data-draft` de la home sigue como está.

## 3. Certificaciones a mostrar

**Hikvision HCSA · Dahua DHCA · Zyxel ZCNA · Suprema BioStar 2**

Es la línea que ya está en el sitio y sigue valiendo: todas vigentes o sin vencimiento.

| Credencial | Estado | En la web |
|---|---|---|
| Hikvision HCSA Access Control | Vigente hasta ene. 2027 | Sí |
| Dahua DHCA-ACS y DHCA-IPVSS | Vigentes hasta jul. 2027 y oct. 2028 | Sí, como "Dahua DHCA" |
| Zyxel ZCNA (Switch, WLAN, Nebula, Security) | Vigentes hasta ene. 2027 | Sí |
| Suprema BioStar 2 (introducción a avanzado) | Cursos sin vencimiento | Sí |
| Asterisk Certified Essentials | Vigente hasta jun. 2027 | Todavía no: el certificado salió sin apellido. Se suma cuando Sangoma lo reemita |
| Furukawa Laserway y Grandstream | Vencidas en 2026 | No, hasta renovar |
| Integrador Certificado Suprema | Vencido en nov. 2025 | No, hasta renovar |
| Cursos de IA, productividad y desarrollo web de 2020 | Sin vencimiento | No |

En enero de 2027 vencen Hikvision y Zyxel. Si no se renuevan, hay que sacarlas de la línea.

## 4. Detalle humano

> Le apasiona el japonés: lo estudió un par de años, lee hiragana y katakana, y los kanji siguen siendo su materia pendiente.

Versión corta, si el diseño pide una sola línea:

> Le encanta el japonés y ya lee hiragana y katakana.

- Es fiel a lo real: dos años de clases, no muy seguido, hiragana y katakana, algo de vocabulario y casi nada de kanji. No dice que lo habla ni le pone un nivel.
- Va como dato personal, nunca como competencia. Responde al pedido del Trello de humanizar la marca.
- **Antes de publicarlo lo tengo que confirmar.** Es un dato personal y en el análisis de titulaciones había quedado afuera de la web. En el sitio va con una `.nota` hasta entonces.
- Si se suma, conviene pedirle lo mismo al resto del equipo (un hobby o algo que les guste), para que mi tarjeta no sea la única con un detalle así.

## 5. Versión larga para /nosotros/ (65 palabras)

> Lidera el equipo de soporte técnico de Intellihelp, el mismo al que se sumó en 2024 para hacer soporte y redes en clientes corporativos. También administra la infraestructura de la empresa, del servidor a la red de la oficina. Está certificado por Hikvision y Dahua en control de acceso y videovigilancia, y por Zyxel en redes. Estudia la Tecnicatura Superior en Redes Informáticas en Teclab.

- Con el detalle humano corto al final queda en 75 palabras. Si se quiere sumar, mejor como línea aparte debajo y no dentro del párrafo.
- Acá sí se nombran las marcas, porque en /nosotros/ hay más lugar y la línea de certificaciones puede quedar o no.

## 6. Cómo quedaría en el código

Mismo marcado y mismas clases que hoy (`equipo__*`), solo cambian los textos. Hay que tocar los dos archivos: `src/partials/equipo.html` y `src/partials/pagina/nosotros/equipo.html`.

```html
<h3 class="equipo__name">Brian Sierra</h3>
<p class="equipo__role eyebrow">Jefe de sistemas y soporte técnico</p>
<p class="equipo__text">Lidera el equipo de soporte técnico de Intellihelp, el mismo en el que empezó en 2024. También administra la infraestructura de la empresa, del servidor a la red de la oficina. Estudia Redes Informáticas en Teclab.</p>
<p class="equipo__certs"><span class="visually-hidden">Certificaciones y cursos: </span>Hikvision HCSA · Dahua DHCA · Zyxel ZCNA · Suprema BioStar 2</p>
<p class="equipo__text" data-draft>Le apasiona el japonés: lo estudió un par de años, lee hiragana y katakana, y los kanji siguen siendo su materia pendiente.</p>
<p class="nota"><b>Pendiente mío</b>El dato del japonés sale cuando lo confirme. Si se publica, pedirle algo parecido al resto del equipo.</p>
```

En la home, el párrafo `data-draft` de herramientas internas y su nota "Autoría pendiente" quedan igual. En /nosotros/, el párrafo largo de la sección 5 reemplaza a la descripción corta.

## 7. Datos de respaldo (no van a la web)

- Ingreso: enero de 2024. Antigüedad al 23/10/2026: 2 años y 9 meses. Por eso el texto dice "en 2024" y no da una cifra.
- A cargo de sistemas desde enero de 2026, según LinkedIn y la dirección.
- El recibo de sueldo lo registra en la categoría "Soporte Técnico" con calificación Semi Senior, sin reflejar la jefatura. Está anotado en el perfil técnico privado para que lo regularice RRHH. Nada de eso se menciona en el sitio.
