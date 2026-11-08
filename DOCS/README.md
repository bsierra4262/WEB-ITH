# Documentación del proyecto

| Carpeta | Qué hay |
|---|---|
| `empresa/` | Material institucional de Intellihelp: la presentación institucional (`presentacion-institucional/`, PPTX y PDF del 04/11/2026), de donde salen los íconos y los datos de la empresa. |
| `marketing/` | Brief de la empresa, informe de visibilidad web e IA, kickoff del plan de 90 días, embudo de ventas, el resumen de requisitos (`requisitos-marketing.md`), el informe contrastado con la web nueva (`informe-vs-web-nueva.md`) y la guía de medición (`medicion-embudo.md`). |
| `diseno/` | Diseño de la home de marketing (`home-intellihelp-2026-10.pdf` y sus recortes en `pdf-secciones/`), el código original de referencia (`home-html-referencia/`, también en zip), la página original de Nico (`template-nico-original/`), la guía de estilo Globant, la especificación de Diagnóstico sin cargo y las capturas de cada versión. |
| `contenido/` | Guía de redacción (`guia-de-estilo.md`), textos de la home (`textos-home.md`), datos pendientes de confirmar (`pendientes-contenido.md`) y las fuentes de cada dato (`fuentes/`). |
| `desarrollo/` | Cómo publicar (`DEPLOY.md`) e inventario de imágenes y recursos (`recursos.md`). Los originales de los logos están en `WEB/recursos/logos-fuentes/`. |
| `capturas/` y `banner.svg` | Capturas finales del sitio y del blog (escritorio y celular, WebP) y el banner que usa el `README.md` de la raíz. |
| `privado/` | Material interno que **no se versiona ni se publica**: documentación de infraestructura, base de conocimientos (Outline), perfil técnico, LinkedIn, marca de herramientas internas, los certificados del equipo (`equipo/certificaciones/`) y los zips entregados (`entregas/`). Está en `.gitignore`. |
| `wordpress-anterior/` | Backup del WordPress publicado hoy (solo consulta; no se versiona). |

Regla: nada de `privado/` se copia a la web. Si algún dato de ahí sirve para un texto público, primero se pasa en limpio a `contenido/fuentes/`, sin IPs, nombres de equipos, usuarios ni configuraciones.
