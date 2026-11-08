# Guía de contribución

Convenciones del proyecto **WEB ITH** (sitio institucional de Intellihelp).

## Flujo de trabajo

1. Crear una rama desde `main`: `git checkout -b feat/mi-cambio`.
2. Levantar el entorno local con `levantar.cmd` (sitio en <http://127.0.0.1:5174/>).
3. Realizar cambios atómicos. Las reglas de diseño del sitio están en `TEMPLATE-NICO/README.md` y
   las de movimiento en `TEMPLATE-NICO/README-movimiento.md`.
4. Antes de abrir el Pull Request, correr la verificación (ver `tools/verificacion/README.md`):
   `npm run todo` dentro de `tools/verificacion/` (emulador del `.htaccess`, rutas viejas en Vite y
   las páginas a 1440 y 390 px, con y sin "reducir movimiento").
5. Abrir un Pull Request describiendo el qué y el porqué del cambio, con capturas si cambia algo
   visible.

## Reglas del sitio que no se negocian

- Fondo oscuro únicamente en el hero de la home (placeholder del video de fondo).
- Ningún subrayado, ni fijo ni animado.
- Nada nativo del navegador a la vista: selects, casillas, barras de scroll, tooltips de `title`
  ni botones de play.
- Tarjetas sin caja, sin sombra y sin filetes; número arriba a la izquierda e íconos centrados.
- Flechas de carruseles a los costados, una a cada lado; sin botones de pausa ni pestañas "Todos".
- Animación de carga común (`css/carga.css` + `js/carga.js`) en todas las páginas.
- Textos en español rioplatense, con voseo y tono profesional.

## Mensajes de commit — [Conventional Commits](https://www.conventionalcommits.org/es/)

```
<tipo>(ámbito opcional): <descripción en imperativo, minúscula, sin punto>
```

Tipos: `feat`, `fix`, `docs`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`.

Ejemplos:

```
feat(sitio): bandas de clientes por rubro con avance automático
fix(htaccess): no redirigir /servicios/ cuando existe el archivo físico
docs(readme): agrega el paso a paso del lanzamiento en Hostinger
test(verificacion): controla la carga común con reducir movimiento
```
