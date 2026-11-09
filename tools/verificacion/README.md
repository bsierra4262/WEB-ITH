# Verificación del sitio

Pruebas automáticas del sitio, para correr antes de cada cambio que se publique.

| Script | Qué verifica | Necesita |
|---|---|---|
| `test-htaccess.cjs` | Emula las reglas de `TEMPLATE-NICO/.htaccess` (mod_rewrite, `SetEnvIf`, `<If>` del `ErrorDocument`, cabeceras, `mod_dir` y `-Indexes`) sobre un `public_html` simulado con subdominios, aplicaciones y el blog. **287 casos**: subdominios intactos, apps sin redirección, `/servicios/` con y sin archivo físico, un solo salto a `https://www`, cada 301 del sitio anterior con y sin UTM, `/novedades/` intacto, 404 con `noindex`, 403/410 y caché. | Solo Node.js |
| `rutas-viejas-vite.cjs` | Pide al servidor local cada URL vieja de la misma lista y compara el 301 con el destino (con y sin UTM), más las páginas que tienen que dar 200 y una inexistente que tiene que dar 404. **180 pedidos**. | El sitio levantado en local |
| `verificar.mjs` | Abre las 6 páginas (home, diagnóstico, gracias, postulate, privacidad y 404) a 1440 y 390 px, con y sin "reducir movimiento" (**24 comprobaciones**) y controla: errores de JavaScript propios, scroll horizontal, subrayados, controles nativos a la vista, cajas con scroll interno, header común y animación de carga (telón y logo entero, centrado). Guarda una captura de página completa por página y ancho, y `verificacion.json`. | El sitio levantado en local y Chrome o Edge |
| `responsive.mjs` | Abre las 6 páginas en 22 tamaños: 320, 360, 375, 390, 412, 414, 430, 768, 820, 834, 1024, 1180, 1280, 1366, 1440, 1536, 1680, 1920 y 2560 px de ancho, más celulares en horizontal (667×375, 844×390 y 932×430) (**132 comprobaciones**). Controla: scroll horizontal, elementos que se salen de la pantalla (teniendo en cuenta los recortes de carruseles y bandas), controles superpuestos (también en el header), tocables de menos de 44 px en celular (salvo enlaces dentro de un texto corrido y los días del calendario, que miden 44 px de alto y lo que da la grilla de ancho), textos de menos de 12 px, imágenes estiradas por encima de su tamaño real y que el globo de WhatsApp abierto entre en la pantalla. Guarda `responsive.json`; con `CAPTURAS=1`, una captura de la primera pantalla por página y tamaño. `SOLO=home,postulate` y `TAMANOS=390x844,1440x900` acotan la corrida. | El sitio levantado en local y Chrome o Edge |

## Cómo correrlo

```bash
cd tools/verificacion
npm install          # solo la primera vez (puppeteer-core, sin descargar navegador)
npm run htaccess     # emulador del .htaccess
npm run rutas-viejas # 301 en el servidor local
npm run verificar    # páginas en el navegador (capturas en ./resultados)
npm run todo         # las tres, en ese orden
npm run responsive   # las 6 páginas en 22 tamaños de pantalla (capturas: CAPTURAS=1)
```

Variables opcionales:

- `SITIO_URL` (por defecto `http://127.0.0.1:5174`): dirección del sitio para `verificar.mjs`.
- `SITIO_HOST` y `SITIO_PUERTO` (por defecto `127.0.0.1` y `5174`): para `rutas-viejas-vite.cjs`.
- `CHROME_PATH`: ejecutable de Chrome o Edge si no está en la ubicación estándar del sistema.

`verificar.mjs` no sale a internet: bloquea Google Tag Manager y simula las búsquedas de HiringRoom
con datos de ejemplo. La carpeta `resultados/` no se versiona.
