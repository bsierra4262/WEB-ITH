// Mensaje de WhatsApp propio de cada página.
// La página lo declara en el <body>:
//   <body data-wa-texto="Hola Intellihelp, quiero consultar por outsourcing IT.">
// y este módulo lo pone en el ?text= de todos los links a WhatsApp de la página
// (botón flotante, fila de contacto del formulario, footer y los botones que
// tenga la página). Un link puntual puede llevar su propio data-wa-texto, que
// tiene prioridad sobre el de la página.
// Sin JS, o si la página no declara nada, queda el mensaje general de
// site.whatsapp.url (src/data/site.json).
const WA = /^https:\/\/(wa\.me|api\.whatsapp\.com)\//;

export function initWaTexto() {
  const general = document.body.dataset.waTexto?.trim();
  for (const link of document.querySelectorAll('a[href]')) {
    if (!WA.test(link.getAttribute('href'))) continue;
    const texto = link.dataset.waTexto?.trim() || general;
    if (!texto) continue;
    // encodeURIComponent (espacios como %20): con "+" algunas versiones de
    // WhatsApp muestran el signo literal.
    const url = new URL(link.href);
    url.search = `?text=${encodeURIComponent(texto)}`;
    link.href = url.toString();
  }
}
