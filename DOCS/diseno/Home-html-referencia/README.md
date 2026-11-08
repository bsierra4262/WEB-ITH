# Home: referencia de diseño

Maqueta de la home exportada desde la herramienta de diseño como página independiente. Es una **referencia**, no código de producción: del marcado y los estilos en línea salen los valores exactos del diseño (colores, tamaños de letra, espaciados, radios, sombras y layout), que el sitio replica con sus propios componentes y estilos, sin copiar el archivo.

## Contenido

- `Main.dc.html`: la mesa de trabajo (un componente de diseño: una plantilla `<x-dc>` más una clase chica con la lógica). Los valores a replicar están en los atributos `style="…"` y en el bloque `<helmet><style>`.
- `assets/`: los archivos subidos al diseño (en esta exportación, una imagen). Las rutas que arma un script mientras corre la página (por ejemplo, `"/_blob/" + id`) no se reescriben y no cargan desde esta carpeta.
- `support.js` y `vendor/react*.js`: el runtime que dibuja el componente en el navegador. No forman parte del diseño: son archivos de terceros, minificados, y no se editan. Para compartir la referencia de diseño alcanza con `Main.dc.html`, `assets/` y este README.

## Cómo verla

Servir la carpeta (por ejemplo, `python3 -m http.server`) y abrir `Main.dc.html`. Algunos navegadores bloquean los scripts si se abre con `file://`.
