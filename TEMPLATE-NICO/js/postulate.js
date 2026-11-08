/* =========================================================
   Postulate (/postulate/). Se carga solo en esa página, después de main.js. Sin dependencias propias.
   - Búsquedas de HiringRoom: carga el script de inserción de HiringRoom (embed.js) recién cuando la sección
     #busquedas se acerca a la pantalla, así no compite con la carga de la página, y llama a embed() con la cuenta
     de data-hiringroom-cuenta. embed.js pide las búsquedas publicadas y escribe una tarjeta li.microsite_vacancy por
     cada una en #embeded_code. Acá se ordenan, se limpian y reciben los botones del sitio.
     Estados de #hiringroom-busquedas (los estilos están en css/postulate.css):
       is-cargando  consultando a HiringRoom.
       is-cargado   hay búsquedas: se ven las tarjetas y la línea de mail como alternativa.
       is-vacio     no hay búsquedas publicadas, o el script no cargó o no respondió en 8 segundos (bloqueador, sin
                    red, HiringRoom caído): se ve el aviso con el botón de mail a rrhh@intellihelp.tech.
     Si una búsqueda llega tarde (después de los 8 segundos), igual se muestra.
   - Hoja de HiringRoom: embed.js agrega hiringroom.com/assets/css/api/embed.css, que trae una sola regla global
     sobre todos los h3 (tamaño, color y alto fijo). Se quita apenas aparece para que no toque los títulos del sitio;
     que aparezca también avisa que la consulta terminó, aunque no haya búsquedas.
   - Medición: publica postulate_click en el dataLayer al tocar los botones con data-postulate (incluidos los de cada
     búsqueda). Como el resto del sitio, GTM decide qué hacer con el evento.
   ========================================================= */
(function () {
  'use strict';

  var SCRIPT_HIRINGROOM = 'https://hiringroom.com/assets/js/api/embed.js?v=2';
  var HOJA_HIRINGROOM = 'hiringroom.com/assets/css/api/embed.css';
  var ESPERA_MAXIMA = 8000;

  var caja = document.getElementById('hiringroom-busquedas');
  var destino = document.getElementById('embeded_code');
  var cuenta = caja ? (caja.getAttribute('data-hiringroom-cuenta') || '').trim() : '';

  /* ---------- Estados ---------- */
  function estado(nombre) {
    if (!caja) return;
    ['is-cargando', 'is-cargado', 'is-vacio'].forEach(function (c) { caja.classList.toggle(c, c === nombre); });
    caja.setAttribute('aria-busy', nombre === 'is-cargando' ? 'true' : 'false');
  }
  function hayBusquedas() {
    return !!destino && destino.querySelector('.microsite_vacancy') !== null;
  }
  var resuelto = false;
  function resolver() {
    resuelto = true;
    estado(hayBusquedas() ? 'is-cargado' : 'is-vacio');
  }

  /* ---------- Tarjetas: limpieza y botones del sitio ---------- */
  var PIN = '<svg class="ico" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" stroke-width="2"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>';
  var BLOQUEADOS = 'script, style, link, meta, iframe, frame, object, embed, form, input, button, textarea, select, svg:not(.ico), base';

  function enlaceSeguro(a) {
    var href = a.getAttribute('href') || '';
    if (!/^(https?:|mailto:)/i.test(href)) a.removeAttribute('href');
  }

  // El texto de cada búsqueda viene de HiringRoom como HTML. Se le sacan las etiquetas que pueden ejecutar código o
  // cambiar estilos del sitio, los atributos on* y los estilos en línea; el resto queda como texto con formato.
  function limpiar(el) {
    el.querySelectorAll(BLOQUEADOS).forEach(function (n) { n.remove(); });
    el.querySelectorAll('*').forEach(function (n) {
      Array.prototype.slice.call(n.attributes).forEach(function (at) {
        var nombre = at.name.toLowerCase();
        if (nombre.indexOf('on') === 0 || nombre === 'style' || nombre === 'srcset' || nombre === 'formaction') n.removeAttribute(at.name);
      });
      if (n.tagName === 'A') enlaceSeguro(n);
    });
  }

  // Saca el rótulo de HiringRoom ("Lugar:", "Descripcion:") a texto para lectores de pantalla y marca vacío el dato
  // que llega sin contenido.
  function rotulo(li, texto) {
    if (!li) return;
    var strong = li.querySelector(':scope > strong');
    if (strong) {
      strong.className = 'sr-only';
      strong.textContent = texto + ': ';
    }
    var contenido = li.textContent.replace(texto + ':', '').trim();
    // Un dato que falta en HiringRoom llega como texto vacío o como "undefined"/"null" (embed.js lo pega tal cual).
    li.classList.toggle('is-vacio', contenido === '' || contenido === 'undefined' || contenido === 'null');
  }

  function boton(li, clase, texto, idMedicion, titulo) {
    if (!li) return null;
    var a = li.querySelector('a');
    if (!a || !a.getAttribute('href')) { li.remove(); return null; }
    a.className = 'btn btn-sm ' + clase;
    a.target = '_blank';
    a.rel = 'noopener';
    a.setAttribute('data-postulate', idMedicion);
    a.textContent = texto;
    var extra = document.createElement('span');
    extra.className = 'sr-only';
    extra.textContent = (titulo ? ': ' + titulo : '') + ' (se abre en una pestaña nueva)';
    a.appendChild(extra);
    if (clase === 'btn-lime') {
      var flecha = document.createElement('span');
      flecha.className = 'arr';
      flecha.setAttribute('aria-hidden', 'true');
      flecha.textContent = '→';
      a.insertBefore(flecha, extra);
      a.insertBefore(document.createTextNode(' '), flecha);
    }
    return li;
  }

  function preparar(card) {
    if (card.hasAttribute('data-ith-lista')) return;
    card.setAttribute('data-ith-lista', '');
    limpiar(card);
    card.classList.add('card-h');

    var titulo = card.querySelector('.microsite_title');
    var nombre = titulo ? titulo.textContent.trim() : '';

    var lugar = card.querySelector('.data_location');
    rotulo(lugar, 'Lugar');
    if (lugar && !lugar.classList.contains('is-vacio')) lugar.insertAdjacentHTML('afterbegin', PIN);
    rotulo(card.querySelector('.data_desc'), 'Descripción');
    rotulo(card.querySelector('.data_req'), 'Requerimientos');
    rotulo(card.querySelector('.data_benefits'), 'Beneficios');
    rotulo(card.querySelector('.data_details'), 'Detalles');

    // Los dos enlaces pasan a su propia fila al pie: primero Postularme (principal), después Ver la búsqueda.
    var postular = boton(card.querySelector('.data_form_link'), 'btn-lime', 'Postularme', 'vacante-postular', nombre);
    var ver = boton(card.querySelector('.data_link'), 'btn-light', 'Ver la búsqueda', 'vacante-ver', nombre);
    if (postular || ver) {
      var acciones = document.createElement('ul');
      acciones.className = 'postulate-jobs__acciones list-reset';
      if (postular) acciones.appendChild(postular);
      if (ver) acciones.appendChild(ver);
      card.appendChild(acciones);
    }
  }

  function revisarDestino() {
    if (!destino) return;
    destino.querySelectorAll('.microsite_vacancy').forEach(preparar);
    // Si llegaron búsquedas, se muestran aunque ya se haya resuelto como vacío por la espera.
    if (hayBusquedas()) estado('is-cargado');
  }

  /* ---------- Hoja de HiringRoom: quitarla y tomarla como aviso de fin ---------- */
  function vigilarHoja() {
    if (!('MutationObserver' in window)) return;
    var obs = new MutationObserver(function (cambios) {
      cambios.forEach(function (c) {
        c.addedNodes.forEach(function (n) {
          if (n.tagName === 'LINK' && (n.getAttribute('href') || '').indexOf(HOJA_HIRINGROOM) !== -1) {
            n.remove();
            // embed.js agrega la hoja después de recibir la respuesta y antes de escribir las tarjetas, en la misma
            // tarea: se espera a que termine para ver si llegó alguna búsqueda.
            setTimeout(function () { revisarDestino(); resolver(); }, 0);
          }
        });
      });
    });
    obs.observe(document.head, { childList: true });
  }

  /* ---------- Carga diferida del script de HiringRoom ---------- */
  var iniciado = false;
  function cargar() {
    if (iniciado) return;
    iniciado = true;
    var espera = setTimeout(function () { if (!resuelto) resolver(); }, ESPERA_MAXIMA);
    var s = document.createElement('script');
    s.src = SCRIPT_HIRINGROOM;
    s.async = true;
    s.onload = function () {
      if (typeof window.embed !== 'function') { clearTimeout(espera); resolver(); return; }
      try {
        window.embed(cuenta);
      } catch (e) {
        clearTimeout(espera);
        resolver();
      }
    };
    s.onerror = function () { clearTimeout(espera); resolver(); };
    document.body.appendChild(s);
  }

  if (caja && destino && cuenta) {
    estado('is-cargando');
    if ('MutationObserver' in window) {
      new MutationObserver(revisarDestino).observe(destino, { childList: true });
    }
    vigilarHoja();

    var seccion = document.getElementById('busquedas') || caja;
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entradas) {
        if (entradas.some(function (e) { return e.isIntersecting; })) {
          io.disconnect();
          cargar();
        }
      }, { rootMargin: '600px 0px' });
      io.observe(seccion);
    } else if (document.readyState === 'complete') {
      cargar();
    } else {
      window.addEventListener('load', cargar);
    }
  } else if (caja) {
    estado('is-vacio');
  }

  /* ---------- Medición ---------- */
  document.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('[data-postulate]') : null;
    if (!el) return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'postulate_click',
      postulate_id: el.getAttribute('data-postulate'),
      postulate_url: el.getAttribute('href') || ''
    });
  });
})();
