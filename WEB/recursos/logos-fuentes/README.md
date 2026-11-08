# Fuentes de los logos

Archivos originales, a color y en su versión oficial vigente, de los 40 logos que el sitio muestra en
gris y pinta con sus colores al pasar el cursor (o con foco). Se descargaron todos de nuevo el
**23/10/2026** (Cartocor, el 24/10/2026), del sitio de cada marca u organismo o de Wikimedia: SVG siempre que existe; si no, el
PNG más grande publicado.

`scripts/optimize-images.mjs` los lee de `clientes/` y `marcas/`, recorta márgenes, los lleva a 96 px
de alto y guarda WebP calidad 90 con fondo transparente en `src/assets/img/logos/` (clientes) o
`src/assets/img/marcas/` (fabricantes), con el mismo nombre de siempre.

Para regenerarlos: `node scripts/optimize-images.mjs --only=logos` y `--only=marcas`.
Si cambia el ancho de un WebP, hay que actualizar el `width` de sus `<img>` (ancho / 2, alto 48).

## Clientes (`clientes/`)

| Archivo | Logo | De dónde salió | Formato |
|---|---|---|---|
| `senado-argentina.jpg` | Senado de la Nación Argentina | Wikimedia Commons, `LOGO SENADO 2023.jpg`: https://commons.wikimedia.org/wiki/File:LOGO_SENADO_2023.jpg (senado.gob.ar no deja descargar: pide captcha). El script vuelve transparente el fondo blanco. | JPG 1250 x 1250 |
| `agencia-sistemas.jpg` | Agencia de Sistemas de Información (GCBA) | Imagen de perfil de la página oficial de la ASI en LinkedIn: https://ar.linkedin.com/company/asigcba . Es el isotipo (la "A"). buenosaires.gob.ar no publica el logo de la ASI; es la única versión oficial vigente que se encontró. | JPG 200 x 200 |
| `nacion-seguros.png` | Nación Seguros | Sitio oficial (nacion-seguros.com.ar), logo del encabezado: `wp-content/uploads/2026/03/Logo-Nacion-Seguros.png` | PNG 1000 x 200 |
| `pfizer.svg` | Pfizer | Wikimedia Commons, `Pfizer (2021).svg` (logo vigente desde 2021): https://commons.wikimedia.org/wiki/File:Pfizer_(2021).svg | SVG |
| `bago.svg` | Laboratorios Bagó | Sitio oficial, logo del encabezado: https://www.bago.com.ar/wp-content/uploads/2025/08/logo-bago.svg | SVG |
| `medife.svg` | Medifé | Sitio oficial, logo del encabezado: https://www.medife.com.ar/themes/custom/medifetema/images/logo-nh.svg | SVG |
| `lojack.svg` | LoJack | Wikimedia Commons, `LoJack-rgb-tag.svg` (identidad LoJack vigente, isotipo naranja): https://commons.wikimedia.org/wiki/File:LoJack-rgb-tag.svg . El script saca la bajada "by Spireon" (es de LoJack Estados Unidos). lojack.com.ar no respondió. | SVG |
| `petropack.png` | Petropack | Sitio oficial, logo del encabezado: https://petropack.com/wp-content/themes/petropack/assets/img/logo.png (no publican SVG) | PNG 400 x 122 |
| `agip.png` | AGIP | Sitio oficial, logo del encabezado: https://www.agip.gob.ar/logo.png . El script se queda con la sigla "AGIP" (la bajada de la derecha no se lee a la altura de la cinta). | PNG 3503 x 900 |
| `cablevision.svg` + `fibertel.svg` | Cablevisión Fibertel | Wikimedia Commons, `Cablevisión logo.svg` y `Fibertel.svg`: https://commons.wikimedia.org/wiki/File:Cablevisi%C3%B3n_logo.svg y https://commons.wikimedia.org/wiki/File:Fibertel.svg . Las marcas se dieron de baja en 2021 (hoy son Personal y Flow): son sus últimos logos oficiales. El script los pone uno al lado del otro, como los usaba la empresa. | SVG |
| `el-cronista.svg` | El Cronista | Sitio oficial: SVG del encabezado de https://www.cronista.com/ (clase `logo-elcronista-icon`), guardado tal cual. | SVG |
| `correo-argentino.svg` | Correo Argentino | Wikimedia Commons, `Correo Argentino Logo.svg`: https://commons.wikimedia.org/wiki/File:Correo_Argentino_Logo.svg (el del sitio oficial es un PNG chico). | SVG |
| `reckitt.svg` | Reckitt (Reckitt Benckiser) | Sitio oficial: SVG del encabezado de https://www.reckitt.com/ . Desde 2021 la empresa firma "Reckitt"; es el logo vigente. | SVG |
| `srt.png` | Superintendencia de Riesgos del Trabajo | Versión horizontal a color del "Manual de identidad SRT" (Res. SRT 19/2023, Boletín Oficial del 04/05/2023, anexo IF-2023-44894077-APN-SCI#SRT, página 7): https://www.boletinoficial.gob.ar/detalleAviso/primera/285732/20230504 . El logo es vectorial en el PDF; se rasterizó a 600 ppp con fondo transparente. Colores oficiales #0A72BA y #21B7EA. argentina.gob.ar/srt solo publica la versión blanca. | PNG 4750 x 1334 |
| `came.svg` | CAME | Sitio oficial: https://www.redcame.org.ar/images/logos/logo-came-lite.svg (versión compacta del encabezado; la completa suma "Confederación Argentina de la Mediana Empresa" en letra chica). | SVG |
| `gendarmeria-nacional.png` | Gendarmería Nacional Argentina | Wikimedia Commons, `Gendarmeria nacional escudo.png`: https://commons.wikimedia.org/wiki/File:Gendarmeria_nacional_escudo.png . Es el mismo escudo que usa argentina.gob.ar/gendarmeria, que lo publica a 265 x 125. | PNG 995 x 496 |
| `parques-nacionales.jpg` | Administración de Parques Nacionales | Isologotipo oficial "Parques Nacionales · Argentina", Boletín Oficial del 05/02/2021, anexo 5 (IF-2020-75835253-APN-DDEIAV#APNAC): https://www.boletinoficial.gob.ar/detalleAviso/primera/240471/20210205 . Es la imagen que trae el PDF, sin cambios. El script vuelve transparente el fondo blanco. | JPG 3390 x 2362 |
| `strix.svg` | Strix (grupo LoJack) | Sitio oficial, logo del encabezado: https://www.strix.com.ar/img/general/logo.svg | SVG |
| `cartocor.svg` | Cartocor (Grupo Arcor) | Sitio oficial, logo del encabezado: https://cartocor.com/images/logo-cartocor.svg (descargado el 24/10/2026). Cartocor solo publica en vector la versión apilada y en blanco. El script arma la versión a color y horizontal con las piezas de ese SVG, sin cambiarles la forma: gris #7A7A78 para el nombre y la mitad inferior del isotipo, verde #4FA800 para la banda y el engranaje superiores (función `cartocorColor`). | SVG |
| `cartocor-referencia-color.png` | Cartocor (Grupo Arcor) | Referencia de colores y disposición: la versión a color y horizontal que usa Arcor en su sitio, https://www.arcor.com/ar/dist/images/logos/logo-cartocor.png (descargado el 24/10/2026). Es chica (180 x 120), por eso no se usa directo. Los colores se midieron sobre el logo a color que usó Cartocor en la preventa de 2022, más grande y sin compresión. | PNG 180 x 120 |

## Fabricantes (`marcas/`)

| Archivo | Logo | De dónde salió | Formato |
|---|---|---|---|
| `huawei.svg` | Huawei | Sitio oficial: https://consumer.huawei.com/.resources/huawei-cbg-site-lm-basic/webresources/mkt/etc/designs/huawei-cbg-site/clientlib-campaign-v4/common-v4/images/logo.svg (horizontal, flor roja). | SVG |
| `hikvision.svg` | Hikvision | Wikimedia Commons: https://commons.wikimedia.org/wiki/File:Hikvision_logo.svg | SVG |
| `dahua.svg` | Dahua Technology | Wikimedia Commons: https://commons.wikimedia.org/wiki/File:Dahua_Technology_logo.svg | SVG |
| `suprema.svg` | Suprema | Sitio oficial: https://www.supremainc.com/en/asset/images/common/suprema-logo-slogan.svg . El script saca el eslogan gris "Security & Biometrics". | SVG |
| `furukawa.svg` | Furukawa Electric | Wikimedia Commons: https://commons.wikimedia.org/wiki/File:Furukawa_Electric_en_logo.svg | SVG |
| `microsoft.svg` | Microsoft | Wikimedia Commons: https://commons.wikimedia.org/wiki/File:Microsoft_logo_(2012).svg | SVG |
| `fortinet.svg` | Fortinet | Wikimedia Commons: https://commons.wikimedia.org/wiki/File:Fortinet_logo.svg | SVG |
| `ubiquiti.svg` | Ubiquiti | Wikimedia Commons: https://commons.wikimedia.org/wiki/File:Ubiquiti_Logo_2023.svg | SVG |
| `aruba.svg` | HPE Aruba Networking | Wikimedia Commons: https://commons.wikimedia.org/wiki/File:Hpe-aruba-networking-logo.svg | SVG |
| `hp.svg` | HP | Wikimedia Commons: https://commons.wikimedia.org/wiki/File:HP_logo_2012.svg | SVG |
| `dell.svg` | Dell | Wikimedia Commons: https://commons.wikimedia.org/wiki/File:Dell_logo_2016.svg | SVG |
| `lenovo.svg` | Lenovo | Wikimedia Commons: https://commons.wikimedia.org/wiki/File:Lenovo_logo_2015.svg | SVG |
| `apc.svg` | APC by Schneider Electric | Wikimedia Commons: https://commons.wikimedia.org/wiki/File:LogoAPC.svg (apc.com bloquea las descargas automáticas). | SVG |
| `cisco.svg` | Cisco | Wikimedia Commons: https://commons.wikimedia.org/wiki/File:Cisco_logo_blue_2016.svg | SVG |
| `panduit.svg` | Panduit | Sitio oficial, logo del encabezado: https://www.panduit.com/content/dam/panduit/logos/Panduit%20Logo%20Desktop%20header.svg | SVG |
| `mikrotik.svg` | MikroTik | Página oficial de marca: https://mikrotik.com/logo/library/logo/SVG/MT_Black.svg (MikroTik publica su logo solo en negro). | SVG |
| `eaton.svg` | Eaton | Wikimedia Commons: https://commons.wikimedia.org/wiki/File:Eaton_Corporation_logo.svg | SVG |
| `suse.svg` | SUSE | Wikipedia, `SUSE S.A. logo.svg` (versión 2025): https://en.wikipedia.org/wiki/File:SUSE_S.A._logo.svg . suse.com solo publica en el encabezado la versión con letras blancas. | SVG |
| `red-hat.svg` | Red Hat | Sitio oficial, kit de marca: https://static.redhat.com/libs/redhat/brand-assets/2/corp/logo.svg | SVG |
| `commscope.svg` | CommScope | Sitio oficial, logo del encabezado de https://www.commscope.com/ (`CS_Amphenol_Color_RGB`: "CommScope, an Amphenol company", el vigente desde que la compró Amphenol). | SVG |
| `grandstream.svg` | Grandstream | Wikipedia, `Grandstream Networks logo.svg` (versión apilada, actualizada en 2026): https://en.wikipedia.org/wiki/File:Grandstream_Networks_logo.svg . Grandstream no publica en vector la versión horizontal de su encabezado: el script la arma con las piezas de este SVG sin tocarlas, solo reubicadas (función `grandstreamHorizontal`). | SVG |
| `grandstream-referencia-encabezado.png` | Grandstream | Referencia de la disposición horizontal: logo del encabezado de grandstream.com (`hubfs/raw_assets/public/Grandstream_Feb_2021/images/logo-grandstream-low-web.png`). Es chico (300 x 43), por eso no se usa directo. | PNG 300 x 43 |

## Logos que son de un solo color por diseño

MikroTik, Ubiquiti y Panduit son negros en su versión oficial: al pasar el cursor no cambian de
color, y está bien así. LoJack es gris pizarra con el isotipo naranja; Fortinet, Aruba, Dahua y
CommScope combinan negro con un color de marca.
