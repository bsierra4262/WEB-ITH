// Receptor de correo para probar en local (no se publica). PHP en Windows manda mail() por SMTP al servidor que le
// indica servir.cmd (127.0.0.1:2525); sin un receptor, mail() devuelve false y api/contact.php corta con 500.
// Acepta todo, no reenvía nada y muestra en la consola solo el destinatario y el asunto (el cuerpo trae datos
// personales y no se guarda).
// Uso: node dev/smtp-local.mjs [puerto]
import net from 'node:net';

const PUERTO = Number(process.argv[2]) || 2525;

/** Asunto legible: decodifica el =?UTF-8?B?...?= que arma contact.php. */
function asunto(crudo) {
  return crudo.replace(/=\?UTF-8\?B\?([^?]+)\?=/gi, (_, b64) => Buffer.from(b64, 'base64').toString('utf8'));
}

net.createServer((socket) => {
  let buffer = '';
  let enDatos = false;
  let mensaje = '';
  let para = [];
  const decir = (linea) => socket.write(`${linea}\r\n`);
  decir('220 smtp-local listo');

  socket.on('data', (chunk) => {
    buffer += chunk.toString('utf8');
    let fin;
    while ((fin = buffer.indexOf('\r\n')) >= 0) {
      const linea = buffer.slice(0, fin);
      buffer = buffer.slice(fin + 2);
      if (enDatos) {
        if (linea === '.') {
          enDatos = false;
          const subject = (mensaje.match(/^Subject: (.*)$/im) || [])[1] || '(sin asunto)';
          console.log(`[smtp-local] ${new Date().toLocaleTimeString('es-AR')} para ${para.join(', ')}: ${asunto(subject)}`);
          mensaje = '';
          para = [];
          decir('250 recibido');
        } else {
          mensaje += `${linea}\n`;
        }
        continue;
      }
      const cmd = linea.slice(0, 4).toUpperCase();
      if (cmd === 'EHLO' || cmd === 'HELO') decir('250 smtp-local');
      else if (cmd === 'MAIL') decir('250 ok');
      else if (cmd === 'RCPT') { para.push(linea.replace(/^RCPT TO:\s*/i, '')); decir('250 ok'); }
      else if (cmd === 'DATA') { enDatos = true; decir('354 terminar con <CRLF>.<CRLF>'); }
      else if (cmd === 'QUIT') { decir('221 chau'); socket.end(); }
      else decir('250 ok'); // RSET, NOOP y el resto
    }
  });
  socket.on('error', () => {});
}).listen(PUERTO, '127.0.0.1', () => console.log(`[smtp-local] escuchando en 127.0.0.1:${PUERTO}`));
