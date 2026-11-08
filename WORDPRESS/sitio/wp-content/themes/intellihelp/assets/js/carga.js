/* Intellihelp — animación de carga (componente único para todas las páginas). Sin dependencias.
   Va en el <head>, SIN defer ni async, después de las hojas de estilo, junto con css/carga.css:
     <link rel="stylesheet" href="/css/carga.css">
     <script src="/js/carga.js"></script>
   - Pone html.m-intro antes del primer pintado en cada carga y en cada recarga (no guarda nada entre visitas) y la saca
     cuando termina la animación. Corre siempre: con "reducir movimiento" carga.css muestra la versión quieta (telón y
     logo, unos 0,6 s, salida con fundido) y los eventos llegan igual.
   - Al volver a la página con Atrás/Adelante desde la caché del navegador (pageshow con persisted) la repite completa.
     Al irse (pagehide) deja el telón quieto, así al volver no se ve un instante la página vieja.
   - Avisa por eventos del document, que usan main.js y motion.js si están en la página:
       ith:intro-salida  empieza la salida del telón (las entradas de la página arrancan ahí, delante del visitante)
       ith:intro-fin     terminó la animación
       ith:replay        se volvió a la página desde la caché: cada módulo vuelve a su estado inicial
   - Pone también html.m-hero-tarde (queda puesta): el texto del hero de la home corre su entrada para verse al abrirse
     el telón. En otras páginas no hace nada. */
(function () {
  'use strict';
  var root = document.documentElement;
  var avisar = function (nombre) {
    var ev;
    try { ev = new CustomEvent(nombre); } catch (e) { ev = document.createEvent('Event'); ev.initEvent(nombre, false, false); }
    document.dispatchEvent(ev);
  };
  var tanda = 0; // cada carga tiene su número: los avisos y respaldos de una carga vieja no cuentan

  var correr = function () {
    var mia = ++tanda;
    var salio = false;
    var termino = false;
    var salida = function () {
      if (salio || mia !== tanda) return;
      salio = true;
      avisar('ith:intro-salida');
    };
    // Salida: arranca ithCargaSale (versión animada) o ithCargaFondo (las dos versiones; en la quieta es la única).
    var alEmpezar = function (e) { if (e.animationName === 'ithCargaSale' || e.animationName === 'ithCargaFondo') salida(); };
    var alTerminar = function (e) { if (e.animationName === 'ithCargaFondo') fin(); };
    var fin = function () {
      if (termino || mia !== tanda) return;
      termino = true;
      salida();
      root.classList.remove('m-intro');
      document.removeEventListener('animationstart', alEmpezar);
      document.removeEventListener('animationend', alTerminar);
      avisar('ith:intro-fin');
    };
    // Se siguen los eventos de las propias animaciones (no un reloj propio): en un equipo lento no se corta a mitad.
    document.addEventListener('animationstart', alEmpezar);
    document.addEventListener('animationend', alTerminar);
    root.classList.add('m-intro', 'm-hero-tarde');
    // Respaldo (carga.css no llegó, pestaña en segundo plano): se cuenta desde que el documento está armado, porque la
    // animación arranca recién cuando se pinta el <body>.
    var respaldo = function () {
      setTimeout(salida, 1100);
      setTimeout(fin, 1600);
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', respaldo, { once: true });
    else respaldo();
  };

  correr();

  window.addEventListener('pagehide', function (e) {
    if (!e.persisted) return;
    tanda++; // lo que quedara pendiente de esta carga ya no cuenta
    root.classList.add('m-intro', 'carga-quieta');
  });
  window.addEventListener('pageshow', function (e) {
    if (!e.persisted) return;
    // Al restaurar desde la caché, el reloj de animaciones del documento recién se pone al día en el primer cuadro: si
    // la animación arrancara acá, ese salto la daría por terminada. Se arranca dos cuadros después; mientras tanto se ve
    // el telón quieto que quedó puesto al salir.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        root.classList.remove('m-intro', 'carga-quieta');
        // Se fuerza el cálculo de estilos sin la clase: al volver a ponerla, el telón y el logo nacen de nuevo y la
        // animación corre desde el principio.
        if (document.body) void window.getComputedStyle(document.body, '::after').opacity;
        correr();
        avisar('ith:replay');
      });
    });
  });
})();
