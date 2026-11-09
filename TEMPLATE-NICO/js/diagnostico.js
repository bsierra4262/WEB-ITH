/* Intellihelp — diagnóstico sin cargo en dos pantallas (sin dependencias). Corre después de main.js (años, origen de
   la visita en localStorage "ith_origen", menú en celular y cta_click) y, en /diagnostico-sin-cargo/, después de
   agenda.js (agenda del CRM, reserva, consulta y los eventos click_calendar, schedule_meeting y cf7_enviado).

   Común a las dos pantallas
   - El header es el componente común del sitio: se compacta y se esconde desde main.js (no se maneja acá).
   - Parámetros de campaña (utm_*, gclid, li_fat_id) de la URL en sessionStorage ("ith_campana"), por si localStorage
     no anda; completan los campos de origen que agenda.js deje vacíos.

   /diagnostico-sin-cargo/ (bloque de reserva #agendar)
   - Calendario mensual propio con los días que avisa agenda.js ("agenda:horarios"); al elegir un día se lo pasa
     ("agenda:elegir-dia") y agenda.js pinta los horarios. Teclado: flechas (día y semana), Inicio y Fin.
   - Validación de a un mensaje, antes que la de agenda.js (que marca todos juntos), en la reserva y en la consulta.
   - Indicador de pasos (01 Día y horario · 02 Tus datos · 03 Confirmación) según el paso que se ve.
   - "¿Preferís que te contactemos?": cambia la agenda por la consulta sin turno, con "Volver a los horarios".
   - "¿Cómo nos conociste?" (chips): tocar de nuevo la opción elegida la suelta; va al CRM en el mensaje.
   - Reunión confirmada: guarda nombre, mail, horario y duración en sessionStorage ("ith_reserva") y pasa a
     /gracias-reserva/. Si no se puede guardar, la confirmación queda en el bloque.
   - CTA del header: baja al bloque y deja el foco en el título del paso que se ve.
   - Video (si [data-video] trae data-video-src) y casos (carrusel, flechas y entrada escalonada).

   /gracias-reserva/
   - Completa el horario, el mail y la duración de la reunión que se acaba de confirmar. */
(() => {
  'use strict';

  const motion = document.documentElement.classList.contains('anim'); // ver script en <head>
  const RESERVA_KEY = 'ith_reserva';
  const CAMPANA_KEY = 'ith_campana';
  const PARAMS_CAMPANA = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'li_fat_id'];

  // sessionStorage y localStorage pueden fallar (modo privado, cookies bloqueadas): la página anda igual.
  const leerSesion = (k) => { try { return JSON.parse(sessionStorage.getItem(k) || 'null'); } catch (e) { return null; } };
  const guardarSesion = (k, v) => { try { sessionStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } };
  const leerLocal = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } };
  const limpio = (v, max) => String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f]+/g, ' ').trim().slice(0, max);

  /** Corre fn cuando empieza a salir el telón de la carga común (carga.js: html.m-intro y el evento ith:intro-salida en
      document); si no hay telón, enseguida. Respaldo de 3,5 s por si el evento no llega. */
  function trasIntro(fn) {
    if (!document.documentElement.classList.contains('m-intro')) return fn();
    let hecho = false;
    const una = () => { if (!hecho) { hecho = true; fn(); } };
    document.addEventListener('ith:intro-salida', una, { once: true });
    document.addEventListener('ith:intro-fin', una, { once: true });
    setTimeout(una, 3500);
  }

  /* ---------- Parámetros de campaña de esta visita (respaldo de ith_origen) ---------- */
  (() => {
    const query = new URLSearchParams(location.search);
    const nuevos = {};
    PARAMS_CAMPANA.forEach((k) => { const v = limpio(query.get(k), k === 'gclid' || k === 'li_fat_id' ? 200 : 150); if (v) nuevos[k] = v; });
    if (Object.keys(nuevos).length) guardarSesion(CAMPANA_KEY, nuevos);
  })();

  /** Completa los campos ocultos de origen que hayan quedado vacíos (primera visita o campaña de la sesión). */
  function completarOrigen(form) {
    if (!form) return;
    const origen = leerLocal('ith_origen') || {};
    const campana = leerSesion(CAMPANA_KEY) || {};
    ['canal', 'referrer', 'landing', ...PARAMS_CAMPANA].forEach((name) => {
      const input = form.elements.namedItem(name);
      if (!(input instanceof HTMLInputElement) || input.value) return;
      const v = origen[name] || campana[name] || '';
      if (v) input.value = String(v);
    });
  }

  /* =================================================================================================================
     1. /diagnostico-sin-cargo/
     ================================================================================================================= */
  const reserva = document.getElementById('agendar');
  const panel = reserva && reserva.querySelector('[data-agenda]');
  if (panel) iniciarReserva(panel);
  if (reserva) {
    iniciarVideo(document.querySelector('[data-video]'));
    iniciarCasos(document.querySelector('[data-dx-carrusel]'));
  }

  function iniciarReserva(panel) {
    const caja = panel.querySelector('.agenda-crm'); // la armó agenda.js (corre antes); sin CRM o sin JS no está
    const contacto = document.getElementById('contact-form');
    const recibido = document.getElementById('contact-success');
    const pasos = reserva.querySelector('[data-dx-pasos]');
    const alt = reserva.querySelector('[data-dx-alt]');
    const volver = contacto && contacto.querySelector('[data-volver]');
    const agendaForm = caja && caja.querySelector('[data-agenda-form]');
    const visible = (el) => Boolean(el) && el.isConnected && !el.hidden && !el.closest('[hidden]');

    completarOrigen(agendaForm);
    completarOrigen(contacto);

    /** El título del paso que se ve (para el foco del CTA y de los cambios de vista). */
    function tituloVisible() {
      if (visible(caja)) {
        const horario = caja.querySelector('[data-paso="horario"]');
        if (visible(horario)) return caja.querySelector('#ag-titulo');
        const ok = caja.querySelector('[data-ok]');
        if (visible(ok)) return ok;
        return caja.querySelector('#ag-elegido');
      }
      if (visible(recibido)) return recibido;
      return document.getElementById('cf-titulo');
    }

    const cta = document.querySelector('[data-dx-ir="agenda"]');
    if (cta) {
      cta.addEventListener('click', (e) => {
        e.preventDefault();
        reserva.scrollIntoView({ behavior: motion ? 'smooth' : 'auto', block: 'start' });
        const t = tituloVisible();
        if (t) t.focus({ preventScroll: true });
        if (location.hash !== '#agendar') history.replaceState(history.state, '', '#agendar');
      });
    }

    /* ----- Validación de a un mensaje (antes que agenda.js, en la fase de captura) ----- */
    const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const telOk = (v) => /^\+[0-9\s().\-/]+$/.test(v) && v.replace(/\D/g, '').length >= 10 && v.length <= 40;
    const REGLAS = [
      ['nombre', (v) => v.length >= 2 && /\p{L}/u.test(v), null],
      ['empresa', (v) => v.length >= 2, null],
      ['mail', (v) => v.length > 0, null],
      ['mail', (v) => EMAIL.test(v), 'Revisá el mail: tiene que tener la forma nombre@empresa.com.'],
      ['telefono', (v) => v.length > 0, null],
      ['telefono', telOk, 'El WhatsApp tiene que empezar con + y el código de país, por ejemplo +54 9 11 1234 5678.'],
      ['acepto', (v, input) => input.checked, null],
    ];

    function primerError(form) {
      for (const [name, ok, texto] of REGLAS) {
        const input = form.elements.namedItem(name);
        if (!(input instanceof HTMLInputElement) || input.disabled) continue;
        const v = input.type === 'checkbox' ? '' : input.value.trim();
        if (!ok(v, input)) return { input, texto: texto || input.dataset.mensaje || 'Completá este campo.' };
      }
      return null;
    }

    function limpiarErrores(form) {
      form.querySelectorAll('.agenda-form__error').forEach((el) => el.remove());
      form.querySelectorAll('[aria-invalid]').forEach((el) => {
        el.removeAttribute('aria-invalid');
        el.removeAttribute('aria-describedby');
      });
    }

    function mostrarError(form, input, texto) {
      limpiarErrores(form);
      const error = document.createElement('p');
      error.id = `${input.id}-error`;
      error.className = 'agenda-form__error';
      error.textContent = texto;
      (input.closest('.dx-check') || input).after(error);
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', error.id);
    }

    panel.addEventListener('submit', (e) => {
      const form = e.target;
      if (!(form instanceof HTMLFormElement)) return;
      const err = primerError(form);
      if (err) {
        e.preventDefault();
        e.stopImmediatePropagation(); // agenda.js no llega a marcar todos los campos juntos
        mostrarError(form, err.input, err.texto);
        err.input.focus();
        return;
      }
      limpiarErrores(form);
      if (form === agendaForm) {
        const como = form.querySelector('input[name="como_nos_conociste"]:checked');
        form.elements.namedItem('mensaje').value = como ? `¿Cómo nos conoció?: ${como.value}` : '';
      }
    }, true);

    // Al corregir el campo marcado, el mensaje se va (o pasa al siguiente problema del mismo campo).
    const alCorregir = (e) => {
      const input = e.target;
      if (!(input instanceof HTMLInputElement) || input.getAttribute('aria-invalid') !== 'true') return;
      const form = input.form;
      const err = primerError(form);
      if (err && err.input === input) mostrarError(form, input, err.texto);
      else if (!err || err.input !== input) limpiarErrores(form);
    };
    panel.addEventListener('input', alCorregir);
    panel.addEventListener('change', alCorregir);

    /* ----- Chips "¿Cómo nos conociste?": tocar la elegida la suelta ----- */
    panel.querySelectorAll('.dx-chip').forEach((chip) => {
      const radio = chip.querySelector('input');
      chip.addEventListener('pointerdown', () => { chip.dataset.estaba = String(radio.checked); });
      radio.addEventListener('click', () => {
        if (chip.dataset.estaba === 'true') radio.checked = false;
        chip.dataset.estaba = 'false';
      });
    });

    /* ----- Salida "¿Preferís que te contactemos?" y vuelta a los horarios ----- */
    const aConsulta = reserva.querySelector('[data-a-consulta]');
    if (aConsulta) {
      aConsulta.addEventListener('click', () => {
        if (!contacto) return;
        if (visible(caja)) {
          caja.hidden = true;
          if (volver) volver.hidden = false;
        }
        if (recibido) recibido.hidden = true;
        contacto.hidden = false;
        const t = document.getElementById('cf-titulo');
        if (t) t.focus();
      });
    }
    const aHorarios = contacto && contacto.querySelector('[data-a-horarios]');
    if (aHorarios) {
      aHorarios.addEventListener('click', () => {
        if (!caja || !caja.isConnected) return;
        contacto.hidden = true;
        volver.hidden = true;
        caja.hidden = false;
        const t = tituloVisible();
        if (t) t.focus();
      });
    }

    /* ----- Indicador de pasos y salida discreta, según lo que se ve ----- */
    const ORDEN = ['horario', 'datos', 'ok'];
    function pintarPasos() {
      const conAgenda = visible(caja);
      if (pasos) pasos.hidden = !conAgenda;
      let actual = 'horario';
      if (conAgenda) {
        if (visible(caja.querySelector('[data-ok]'))) actual = 'ok';
        else if (visible(agendaForm)) actual = 'datos';
      }
      if (alt) alt.hidden = !contacto || visible(contacto) || visible(recibido) || actual === 'ok';
      if (!pasos) return;
      const i = ORDEN.indexOf(actual);
      pasos.querySelectorAll('[data-dx-paso]').forEach((li) => {
        const j = ORDEN.indexOf(li.dataset.dxPaso);
        if (j === i) li.setAttribute('aria-current', 'step');
        else li.removeAttribute('aria-current');
        li.classList.toggle('is-hecho', j < i);
      });
    }
    new MutationObserver(pintarPasos).observe(panel, { attributes: true, attributeFilter: ['hidden'], subtree: true, childList: true });
    pintarPasos();

    /* ----- Duración del tipo de reunión del CRM (agenda.js la pone en el primer [data-duracion] de la agenda) ----- */
    const duracion = caja && caja.querySelector('[data-duracion]');
    if (duracion) {
      new MutationObserver(() => {
        const min = duracion.textContent.trim();
        if (/^\d{1,3}$/.test(min)) document.querySelectorAll('[data-duracion]').forEach((el) => { if (el !== duracion) el.textContent = min; });
      }).observe(duracion, { childList: true, characterData: true, subtree: true });
    }

    /* ----- Reunión confirmada: a /gracias-reserva/ ----- */
    const ok = caja && caja.querySelector('[data-ok]');
    if (ok) {
      let enviado = false;
      new MutationObserver(() => {
        if (enviado || ok.hidden) return;
        enviado = true;
        const valor = (n) => { const el = agendaForm.elements.namedItem(n); return el && 'value' in el ? el.value : ''; };
        const guardado = guardarSesion(RESERVA_KEY, {
          nombre: limpio(valor('nombre'), 120),
          mail: limpio(valor('mail'), 190).toLowerCase(),
          cuando: limpio(ok.querySelector('[data-ok-cuando]').textContent, 120),
          duracion: limpio(duracion ? duracion.textContent : '30', 3),
          t: Date.now(),
        });
        // Un instante para leer la confirmación y para que Tag Manager mande schedule_meeting.
        if (guardado) setTimeout(() => { location.href = new URL('../gracias-reserva/', location.href).href; }, 1200);
      }).observe(ok, { attributes: true, attributeFilter: ['hidden'] });
    }

    if (caja) iniciarMes(caja);
  }

  /* ---------- Calendario mensual ---------- */
  function iniciarMes(caja) {
    const box = caja.querySelector('[data-dx-mes]');
    const diasEl = caja.querySelector('[data-dias]');
    if (!box || !diasEl) return;
    const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const pad = (n) => String(n).padStart(2, '0');
    const aFecha = (d) => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
    const deFecha = (f) => { const [a, m, d] = f.split('-').map(Number); return new Date(Date.UTC(a, m - 1, d)); };
    const hoy = new Date(Date.now() - 3 * 3600e3).toISOString().slice(0, 10); // Argentina, UTC-3

    let disponibles = new Map(); // fecha -> cantidad de horarios
    let feriados = new Map(); // fecha -> nombre del feriado (sin turnos ese día)
    let elegido = null;
    let mes = hoy.slice(0, 7); // AAAA-MM que se muestra
    let cargado = false;

    // Estructura fija: cabecera con una flecha a cada lado, los días de la semana y la grilla.
    box.innerHTML = `
      <div class="dx-mes__cab">
        <button type="button" class="dx-mes__flecha" data-mes-ant disabled><svg aria-hidden="true" focusable="false" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 5-7 7 7 7"/></svg><span class="sr-only">Mes anterior</span></button>
        <p class="dx-mes__titulo" id="dx-mes-titulo" aria-live="polite"></p>
        <button type="button" class="dx-mes__flecha" data-mes-sig disabled><svg aria-hidden="true" focusable="false" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 5 7 7-7 7"/></svg><span class="sr-only">Mes siguiente</span></button>
      </div>
      <div class="dx-mes__semana" aria-hidden="true"><span>Lu</span><span>Ma</span><span>Mi</span><span>Ju</span><span>Vi</span><span>Sá</span><span>Do</span></div>
      <div class="dx-mes__grilla" role="group" aria-labelledby="dx-mes-titulo" data-mes-grilla></div>
      <p class="dx-mes__feriados" data-mes-feriados hidden></p>`;
    const titulo = box.querySelector('.dx-mes__titulo');
    const grilla = box.querySelector('[data-mes-grilla]');
    const ant = box.querySelector('[data-mes-ant]');
    const sig = box.querySelector('[data-mes-sig]');
    const notaFeriados = box.querySelector('[data-mes-feriados]');

    const meses = () => [...disponibles.keys()].map((f) => f.slice(0, 7)).sort();
    function pintar() {
      const [a, m] = mes.split('-').map(Number);
      titulo.textContent = `${MESES[m - 1]} de ${a}`;
      const lista = meses();
      ant.disabled = !cargado || !lista.length || mes <= lista[0];
      sig.disabled = !cargado || !lista.length || mes >= lista[lista.length - 1];
      const primero = new Date(Date.UTC(a, m - 1, 1));
      const vacios = (primero.getUTCDay() + 6) % 7; // semana de lunes a domingo
      const total = new Date(Date.UTC(a, m, 0)).getUTCDate();
      const delMes = [...disponibles.keys()].filter((f) => f.startsWith(mes));
      const conFoco = delMes.includes(elegido) ? elegido : delMes[0];
      const celdas = [];
      for (let i = 0; i < vacios; i++) {
        const s = document.createElement('span');
        s.className = 'dx-mes__dia';
        s.setAttribute('aria-hidden', 'true');
        celdas.push(s);
      }
      for (let d = 1; d <= total; d++) {
        const fecha = `${mes}-${pad(d)}`;
        const n = disponibles.get(fecha);
        let el;
        if (n) {
          el = document.createElement('button');
          el.type = 'button';
          el.dataset.fecha = fecha;
          el.setAttribute('aria-pressed', String(fecha === elegido));
          el.setAttribute('aria-label', `${DIAS[deFecha(fecha).getUTCDay()]} ${d} de ${MESES[m - 1]}, ${n} ${n === 1 ? 'horario' : 'horarios'}`);
          el.tabIndex = fecha === conFoco ? 0 : -1;
        } else {
          el = document.createElement('span');
          el.setAttribute('aria-hidden', 'true');
        }
        el.className = `dx-mes__dia${fecha === hoy ? ' is-hoy' : ''}${!n && feriados.has(fecha) ? ' is-feriado' : ''}`;
        el.textContent = String(d);
        celdas.push(el);
      }
      grilla.replaceChildren(...celdas);
      // Debajo del mes, qué feriados tiene (esos días no se pueden elegir).
      const delMesFeriados = [...feriados].filter(([f]) => f.startsWith(mes)).sort(([x], [y]) => x.localeCompare(y));
      notaFeriados.hidden = !delMesFeriados.length;
      notaFeriados.textContent = delMesFeriados.length
        ? `${delMesFeriados.length === 1 ? 'Feriado' : 'Feriados'}: ${delMesFeriados.map(([f, nombre]) => `${Number(f.slice(8))}/${Number(f.slice(5, 7))} ${nombre}`).join(' · ')}`
        : '';
    }

    function elegir(fecha, enfocar) {
      if (!disponibles.has(fecha)) return;
      if (fecha.slice(0, 7) !== mes) mes = fecha.slice(0, 7);
      elegido = fecha;
      pintar();
      panel.dispatchEvent(new CustomEvent('agenda:elegir-dia', { detail: { fecha } }));
      if (enfocar) { const b = grilla.querySelector(`[data-fecha="${fecha}"]`); if (b) b.focus(); }
    }

    grilla.addEventListener('click', (e) => {
      const b = e.target instanceof Element ? e.target.closest('button[data-fecha]') : null;
      if (!b) return;
      elegir(b.dataset.fecha, true);
      // En celular los horarios van debajo del calendario: si no se ven, se acercan (sin mover el foco).
      const horas = caja.querySelector('.dx-horas');
      if (horas && horas.getBoundingClientRect().top > innerHeight - 140) {
        horas.scrollIntoView({ behavior: motion ? 'smooth' : 'auto', block: 'start' });
      }
    });
    // Teclado: flechas (un día o una semana, salteando los días sin horarios), Inicio y Fin del mes.
    grilla.addEventListener('keydown', (e) => {
      const b = e.target instanceof Element ? e.target.closest('button[data-fecha]') : null;
      if (!b) return;
      const paso = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7 }[e.key];
      const delMes = [...disponibles.keys()].filter((f) => f.startsWith(mes)).sort();
      let destino = null;
      if (paso) {
        const d = deFecha(b.dataset.fecha);
        for (let i = 0; i < 70 && !destino; i++) {
          d.setUTCDate(d.getUTCDate() + paso);
          const f = aFecha(d);
          if (disponibles.has(f)) destino = f;
        }
      } else if (e.key === 'Home') destino = delMes[0];
      else if (e.key === 'End') destino = delMes[delMes.length - 1];
      else return;
      e.preventDefault();
      if (!destino) return;
      if (destino.slice(0, 7) !== mes) { mes = destino.slice(0, 7); pintar(); }
      grilla.querySelectorAll('button').forEach((x) => { x.tabIndex = x.dataset.fecha === destino ? 0 : -1; });
      const objetivo = grilla.querySelector(`[data-fecha="${destino}"]`);
      if (objetivo) objetivo.focus();
    });
    const cambiarMes = (dir) => {
      const [a, m] = mes.split('-').map(Number);
      const d = new Date(Date.UTC(a, m - 1 + dir, 1));
      mes = aFecha(d).slice(0, 7);
      pintar();
    };
    ant.addEventListener('click', () => cambiarMes(-1));
    sig.addEventListener('click', () => cambiarMes(1));

    // Los días con horarios llegan de agenda.js (también cuando recarga los horarios).
    panel.addEventListener('agenda:horarios', (e) => {
      const lista = (e.detail && e.detail.dias) || [];
      disponibles = new Map(lista.map((d) => [d.fecha, d.horarios]));
      feriados = new Map(((e.detail && e.detail.feriados) || []).map((f) => [f.fecha, f.nombre]));
      elegido = e.detail.elegido || (lista[0] && lista[0].fecha) || null;
      if (elegido) mes = elegido.slice(0, 7);
      cargado = true;
      pintar();
    });
    // Si agenda.js elige otro día (por ejemplo al volver con "Cambiar"), el calendario lo acompaña.
    new MutationObserver(() => {
      const p = diasEl.querySelector('[aria-pressed="true"]');
      if (!p || p.dataset.fecha === elegido || !disponibles.has(p.dataset.fecha)) return;
      elegido = p.dataset.fecha;
      mes = elegido.slice(0, 7);
      pintar();
    }).observe(diasEl, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-pressed'] });
    pintar();
  }

  /* ---------- Video de presentación ---------- */
  function iniciarVideo(caja) {
    if (!caja) return;
    const src = (caja.dataset.videoSrc || '').trim();
    if (!src) return; // sin video todavía: queda el aviso "próximamente"
    const marco = caja.querySelector('.dx-video__marco');
    const aviso = caja.querySelector('[data-video-aviso]');
    const titulo = caja.dataset.videoTitulo || 'Video de presentación';

    const yt = src.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/);
    const vimeo = src.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (yt || vimeo) {
      const iframe = document.createElement('iframe');
      iframe.src = yt ? `https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0` : `https://player.vimeo.com/video/${vimeo[1]}`;
      iframe.title = titulo;
      iframe.loading = 'lazy';
      iframe.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
      iframe.allowFullscreen = true;
      aviso.replaceWith(iframe);
      return;
    }

    // Archivo propio: arranca sin sonido y en bucle recién después de la carga (no compite con el resto de la página),
    // con "Activar sonido" (vuelve al principio, con sonido y sin bucle). Se frena fuera de pantalla. Con "reducir
    // movimiento" no arranca solo: el botón lo reproduce con sonido.
    const video = document.createElement('video');
    video.src = src;
    if (caja.dataset.videoPoster) video.poster = caja.dataset.videoPoster;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'none';
    video.controls = true;
    video.setAttribute('aria-label', titulo);
    aviso.replaceWith(video);

    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'dx-video__sonido';
    boton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"/></svg><span></span>';
    const label = boton.querySelector('span');
    marco.append(boton);

    let conSonido = false;
    let visible = true;
    const conAudio = () => {
      conSonido = true;
      video.muted = false;
      video.loop = false;
      video.currentTime = 0;
      video.play().catch(() => {});
      boton.hidden = true;
    };
    boton.addEventListener('click', conAudio);

    if (!motion) {
      label.textContent = 'Ver el video';
      boton.classList.add('is-play');
      video.addEventListener('play', () => { boton.hidden = true; });
      return;
    }
    label.textContent = 'Activar sonido';
    const arrancar = () => { if (visible && !conSonido) video.play().catch(() => {}); };
    if (document.readyState === 'complete') arrancar();
    else addEventListener('load', arrancar, { once: true });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        visible = entries[entries.length - 1].isIntersecting;
        if (conSonido) return;
        if (visible) arrancar();
        else video.pause();
      }).observe(caja);
    }
  }

  /* ---------- Casos ---------- */
  function iniciarCasos(carrusel) {
    if (!carrusel) return;
    const pista = carrusel.querySelector('[data-dx-pista]');
    const rail = carrusel.querySelector('[data-dx-rail]');
    const casos = [...rail.querySelectorAll('[data-dx-caso]')];
    const n = casos.length;
    if (!n) return;
    const dd = (x) => String(x).padStart(2, '0');

    // Numeración: 01/05 y el número de fondo, en el orden en que estén en el HTML.
    casos.forEach((c, i) => {
      c.querySelectorAll('[data-dx-num]').forEach((el) => { el.textContent = dd(i + 1); });
      c.querySelectorAll('[data-dx-total]').forEach((el) => { el.textContent = dd(n); });
      const fondo = c.querySelector('.dx-caso__fondo');
      if (fondo) fondo.textContent = dd(i + 1);
      c.setAttribute('aria-label', `Caso ${i + 1} de ${n}`);
      c.setAttribute('role', 'group');
    });

    const paso = () => {
      const c = casos[0];
      return c.getBoundingClientRect().width + (parseFloat(getComputedStyle(c).marginRight) || 0);
    };
    const anchoSet = () => paso() * n;

    // Copias para el bucle (solo con movimiento): las necesarias para que nunca se vea el final de la pista.
    const copias = [];
    const asegurarCopias = () => {
      if (!motion) return;
      const necesarias = Math.max(1, Math.ceil(pista.clientWidth / anchoSet()) + 1);
      while (copias.length < necesarias) {
        const set = casos.map((c) => {
          const copia = c.cloneNode(true);
          copia.setAttribute('aria-hidden', 'true');
          copia.setAttribute('inert', '');
          copia.removeAttribute('role');
          copia.removeAttribute('aria-label');
          copia.dataset.dxCopia = '';
          return copia;
        });
        rail.append(...set);
        copias.push(set);
      }
    };
    asegurarCopias();

    let pos = pista.scrollLeft; // posición que lleva el avance automático (con decimales)
    let pausaHasta = 0;
    let mouse = false;
    let foco = false;
    let dedo = false;
    let enPantalla = true;
    const VELOCIDAD = 40; // px por segundo: una tarjeta cada 9 s, como el original

    function mover(dir) {
      const p = paso();
      pausaHasta = performance.now() + 4000;
      let actual = pista.scrollLeft;
      const max = pista.scrollWidth - pista.clientWidth;
      if (motion) {
        // Hacia atrás desde el principio: salta a la misma posición de la copia y sigue desde ahí.
        if (dir < 0 && actual < p - 2) {
          actual += anchoSet();
          pista.scrollLeft = actual;
        }
        pista.scrollTo({ left: (Math.round(actual / p) + dir) * p, behavior: 'smooth' });
        return;
      }
      // Sin movimiento: de a una tarjeta y, en los extremos, vuelve al otro lado.
      let destino = (Math.round(actual / p) + dir) * p;
      if (dir > 0 && actual >= max - 2) destino = 0;
      if (dir < 0 && actual <= 2) destino = max;
      pista.scrollTo({ left: destino, behavior: 'auto' });
    }
    carrusel.querySelector('[data-dx-ant]').addEventListener('click', () => mover(-1));
    carrusel.querySelector('[data-dx-sig]').addEventListener('click', () => mover(1));

    if (motion) {
      pista.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') mouse = true; });
      pista.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') mouse = false; });
      carrusel.addEventListener('focusin', () => { foco = true; });
      carrusel.addEventListener('focusout', (e) => { if (!carrusel.contains(e.relatedTarget)) foco = false; });
      let soltar = 0;
      pista.addEventListener('touchstart', () => { clearTimeout(soltar); dedo = true; }, { passive: true });
      pista.addEventListener('touchend', () => { clearTimeout(soltar); soltar = setTimeout(() => { dedo = false; }, 2500); }, { passive: true });
      if ('IntersectionObserver' in window) {
        new IntersectionObserver((entries) => { enPantalla = entries[entries.length - 1].isIntersecting; }).observe(pista);
      }
      addEventListener('resize', asegurarCopias);

      let antes = performance.now();
      const cuadro = (ahora) => {
        const dt = Math.min(0.1, (ahora - antes) / 1000);
        antes = ahora;
        const quieto = mouse || foco || dedo || !enPantalla || document.hidden || ahora < pausaHasta;
        const set = anchoSet();
        if (quieto) {
          pos = pista.scrollLeft; // sigue lo que haya movido la persona
          if (ahora >= pausaHasta && pos >= set) { pos -= set; pista.scrollLeft = pos; }
        } else {
          pos += VELOCIDAD * dt;
          if (pos >= set) pos -= set;
          pista.scrollLeft = pos;
        }
        requestAnimationFrame(cuadro);
      };
      requestAnimationFrame(cuadro);
    }

    // Entrada escalonada: el encabezado de la sección y las tarjetas, solo si están debajo del pliegue.
    if (!motion) return;
    const alto = innerHeight;
    const abajo = (el) => el.getBoundingClientRect().top > alto * 0.98;
    const revelar = (el, demora) => {
      el.style.setProperty('--dx-d', `${demora}s`);
      el.setAttribute('data-dx-entra', 'in');
      setTimeout(() => { el.removeAttribute('data-dx-entra'); el.style.removeProperty('--dx-d'); }, demora * 1000 + 1000);
    };
    const encabezado = [...document.querySelectorAll('.dx-casos [data-dx-entra]')];
    encabezado.forEach((el) => { if (abajo(el)) el.setAttribute('data-dx-entra', 'espera'); else el.removeAttribute('data-dx-entra'); });
    const tarjetas = [...rail.querySelectorAll('.dx-caso')];
    const tarjetasAbajo = abajo(pista);
    if (tarjetasAbajo) tarjetas.forEach((c) => c.setAttribute('data-dx-entra', 'espera'));
    const enEspera = () => [...encabezado, ...tarjetas].filter((el) => el.getAttribute('data-dx-entra') === 'espera');
    const yaQuieto = (el) => { el.removeAttribute('data-dx-entra'); el.style.removeProperty('--dx-d'); };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        // Si ya está metido en la pantalla (scroll muy rápido o salto), aparece quieto: nunca un hueco esperando
        const tarde = e.boundingClientRect.top < innerHeight * 0.72;
        const grupo = e.target === pista ? tarjetas : [e.target];
        grupo.forEach((c, i) => { if (tarde) yaQuieto(c); else revelar(c, e.target === pista ? Math.min(i, 8) * 0.09 : 0); });
      });
    }, { rootMargin: '0px 0px -6% 0px' });
    // Nada queda oculto: lo que el visitante pasó sin verlo (scroll rápido, recarga a mitad de página con el scroll
    // restaurado) aparece ya quieto, y como respaldo, a los 2 s de abrirse el telón y cada vez que el scroll se
    // detiene, entra todo lo que esté a la vista.
    let abierto = false;
    // modo 'arriba': solo lo que quedó por encima; 'scroll': también lo que ya está metido en la pantalla; 'forzar':
    // además, lo que esté a la vista, con su entrada.
    const barrer = (modo) => {
      if (!abierto) return;
      const alto = innerHeight;
      enEspera().forEach((el) => {
        const r = (tarjetas.includes(el) ? pista : el).getBoundingClientRect();
        if (r.bottom <= 0 || (modo !== 'arriba' && r.top < alto * 0.72 && r.bottom > 0)) { yaQuieto(el); io.unobserve(tarjetas.includes(el) ? pista : el); }
        else if (modo === 'forzar' && r.top < alto) revelar(el, 0);
      });
    };
    let quieto = 0;
    addEventListener('scroll', () => {
      barrer('scroll');
      clearTimeout(quieto);
      quieto = setTimeout(() => barrer('forzar'), 1200);
    }, { passive: true });
    // Recién cuando sale el telón de la carga común: nada entra debajo de él.
    trasIntro(() => {
      abierto = true;
      encabezado.forEach((el) => { if (el.getAttribute('data-dx-entra') === 'espera') io.observe(el); });
      if (tarjetasAbajo) io.observe(pista);
      barrer('arriba');
      setTimeout(() => barrer('forzar'), 2000);
    });
  }

  /* =================================================================================================================
     2. /gracias-reserva/
     ================================================================================================================= */
  const confirmada = document.querySelector('.gx');
  if (!confirmada) return;
  const datos = leerSesion(RESERVA_KEY);
  if (!datos) return;
  const poner = (sel, v) => document.querySelectorAll(sel).forEach((el) => { el.textContent = v; });
  if (datos.cuando) poner('[data-dx-cuando]', limpio(datos.cuando, 120));
  if (datos.mail) poner('[data-dx-mail]', limpio(datos.mail, 190));
  else document.querySelectorAll('[data-dx-mail-wrap]').forEach((el) => el.remove());
  if (/^\d{1,3}$/.test(String(datos.duracion || ''))) poner('[data-duracion]', String(datos.duracion));
})();
