// Quita del HTML de producción todo lo interno: elementos .nota, bloques con
// data-draft y comentarios HTML. Así no quedan en el código publicado (con
// ?notas cualquiera podría verlos). Para un build de revisión que los conserve:
//   VITE_NOTAS=1 npm run build
const APERTURA = /<([a-zA-Z][\w-]*)\b([^>]*)>/g;
const esInterno = (attrs) =>
  /\sdata-draft(\s|=|$|\/)/.test(` ${attrs}`) || /\sclass\s*=\s*"(?:[^"]*\s)?nota(?:\s[^"]*)?"/.test(` ${attrs}`);

function cierre(html, tag, desde) {
  const re = new RegExp(`<(/?)${tag}\\b[^>]*>`, 'gi');
  re.lastIndex = desde;
  let nivel = 1;
  let m;
  while ((m = re.exec(html))) {
    if (m[0].endsWith('/>')) continue;
    nivel += m[1] ? -1 : 1;
    if (nivel === 0) return re.lastIndex;
  }
  return -1;
}

export function quitarBorradores(html) {
  let out = html.replace(/<!--(?!\[if)[\s\S]*?-->/g, '');
  let quitados = 0;
  for (;;) {
    APERTURA.lastIndex = 0;
    let m;
    let hecho = false;
    while ((m = APERTURA.exec(out))) {
      if (!esInterno(m[2])) continue;
      const fin = cierre(out, m[1], APERTURA.lastIndex);
      if (fin < 0) throw new Error(`[borradores] <${m[1]}> sin cierre cerca de: ${out.slice(m.index, m.index + 80)}`);
      out = out.slice(0, m.index) + out.slice(fin);
      quitados++;
      hecho = true;
      break;
    }
    if (!hecho) break;
  }
  return { html: out, quitados };
}
