document.addEventListener('DOMContentLoaded', function () {
  var nav = document.querySelector('nav.ltx_TOC.ltx_toc_toc');
  if (!nav) return;
  var title = nav.querySelector('.ltx_title_contents');   // la barra (el h6)
  if (!title) return;

  // --- Botón del índice: ícono ☰ + texto "Índice general" ---
  var textoIndice = title.textContent.trim();
  title.textContent = '';

  var boton = document.createElement('span');
  boton.className = 'barra-boton';
  boton.setAttribute('role', 'button');
  boton.setAttribute('tabindex', '0');
  boton.setAttribute('aria-expanded', 'false');

  var icono = document.createElement('span');
  icono.className = 'barra-icono';
  icono.textContent = '☰';

  var etiqueta = document.createElement('span');
  etiqueta.textContent = textoIndice;
  etiqueta.className = 'barra-etiqueta';

  boton.appendChild(icono);
  boton.appendChild(etiqueta);
  title.appendChild(boton);

  function setOpen(open) {
    nav.classList.toggle('open', open);
    boton.setAttribute('aria-expanded', open);
    boton.setAttribute('aria-label', textoIndice);
    icono.textContent = open ? '✕' : '☰';
  }

  boton.addEventListener('click', function () {
    setOpen(!nav.classList.contains('open'));
  });
  boton.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(!nav.classList.contains('open'));
    }
  });

  // Cerrar al elegir una entrada, al hacer clic fuera o con Escape
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });
  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target)) setOpen(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });

  // --- Título del documento ---
  var docTitle = document.querySelector('.ltx_title_document');
  var span = document.createElement('span');
  span.className = 'barra-titulo';
  span.textContent = docTitle ? docTitle.textContent.trim() : document.title;
  title.appendChild(span);

  // --- Flecha para regresar (antes de los logos) ---
  var urlAtras = '#';   // cambia '#' por la dirección de la página anterior cuando exista
  var atras = document.createElement('a');
  atras.className = 'barra-atras';
  atras.href = urlAtras;
  atras.title = 'Regresar';
  atras.setAttribute('aria-label', 'Regresar');
  atras.textContent = 'Regresar';   // si elegiste una flecha SVG, pon aquí tu línea atras.innerHTML = '...'
  title.appendChild(atras);

  // --- Dos logos a la derecha ---
  var logos = document.createElement('span');
  logos.className = 'barra-logos';
  ['logo1.svg', 'logo2.svg'].forEach(function (archivo, i) {   // cambia por tus nombres
    var img = document.createElement('img');
    img.className = 'barra-logo ltx_no_dark_filter barra-logo-' + (i + 1);
    img.src = archivo;
    img.alt = '';
    img.onerror = function () { img.remove(); };
    logos.appendChild(img);
  });
  title.appendChild(logos);
});
