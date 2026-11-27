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

  var yAbierto = 0;   // posición de la página cuando se abrió el menú
  function setOpen(open) {
    nav.classList.toggle('open', open);
    boton.setAttribute('aria-expanded', open);
    boton.setAttribute('aria-label', textoIndice);
    icono.textContent = open ? '✕' : '☰';
    if (open) yAbierto = window.scrollY;
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

  // Cerrar al hacer scroll en la página
window.addEventListener('scroll', function () {
  if (nav.classList.contains('open') && Math.abs(window.scrollY - yAbierto) > 10) {
    setOpen(false);
  }
}, { passive: true });

  // --- Título del documento (enlace) ---
  var urlTitulo = '#';   // cambia '#' por la dirección que quieras
  var docTitle = document.querySelector('.ltx_title_document');
  var span = document.createElement('span');
  span.className = 'barra-titulo';
  var enlaceTitulo = document.createElement('a');
  enlaceTitulo.href = urlTitulo;
  enlaceTitulo.textContent = docTitle ? docTitle.textContent.trim() : document.title;
  span.appendChild(enlaceTitulo);
  title.appendChild(span);

/*
  // --- Boton para regresar (antes de los logos) ---
  var urlAtras = '#';   // cambia '#' por la dirección de la página anterior cuando exista
  var atras = document.createElement('a');
  atras.className = 'barra-atras';
  atras.href = urlAtras;
  atras.title = 'Regresar';
  atras.setAttribute('aria-label', 'Regresar');
  atras.textContent = 'Regresar';   // si elegiste una flecha SVG, pon aquí tu línea atras.innerHTML = '...'
  title.appendChild(atras);
  */

  // --- Dos logos a la derecha, cada uno con su enlace ---
  var logosInfo = [
    { archivo: 'logo1.svg', url: 'https://texedores.matem.unam.mx/', nombre: 'Texedores' },
    { archivo: 'logo2.svg', url: 'https://www.matem.unam.mx/', nombre: 'Matem' }
  ];

  var logos = document.createElement('span');
  logos.className = 'barra-logos';
  logosInfo.forEach(function (info, i) {
    var enlace = document.createElement('a');
    enlace.className = 'barra-logo-enlace';
    enlace.href = info.url;
    enlace.target = '_blank';
    enlace.rel = 'noopener noreferrer';
    enlace.title = info.nombre;
    enlace.setAttribute('aria-label', info.nombre);

    var img = document.createElement('img');
    img.className = 'barra-logo ltx_no_dark_filter barra-logo-' + (i + 1);
    img.src = info.archivo;
    img.alt = '';
    img.onerror = function () { enlace.remove(); };   // si falta el archivo, se quita el enlace completo

    enlace.appendChild(img);
    logos.appendChild(enlace);
  });
  title.appendChild(logos);

  // --- Ruta de navegación (migas de pan) bajo la barra ---
var elTitulo = document.querySelector('.ltx_title_document');
var tituloLibro = elTitulo ? elTitulo.textContent.trim() : document.title;

// Saca un nombre legible de una dirección:
// .../index.html -> "Inicio", .../papyros -> "Papyros"
function nombreDeUrl(url) {
  var partes;
  try {
    partes = new URL(url, window.location.href).pathname.split('/').filter(Boolean);
  } catch (e) { return url; }
  var nombre = partes.pop() || '';
  nombre = nombre.replace(/\.(html?|php)$/i, '');
  if (nombre.toLowerCase() === 'index') nombre = partes.pop() || '';   // index -> usa la carpeta
  if (!nombre) return 'Inicio';
  try { nombre = decodeURIComponent(nombre); } catch (e) {}
  nombre = nombre.replace(/[-_]+/g, ' ');
  return nombre.charAt(0).toUpperCase() + nombre.slice(1);
}

var ruta = [   // el nombre sale de la dirección
  { url: 'https://texedores.matem.unam.mx/index.html', nueva: false },
  { url: 'https://texedores.matem.unam.mx/colecciones.html', nueva: true },
  { url: '#',    nueva: true },
  { texto: tituloLibro, url: '#' }
];

var migas = document.createElement('nav');
migas.className = 'barra-migas';
migas.setAttribute('aria-label', 'Ruta de navegación');
var lista = document.createElement('ol');
ruta.forEach(function (paso, i) {
  var li = document.createElement('li');
  var a = document.createElement('a');
  a.href = paso.url;
  a.textContent = paso.texto || nombreDeUrl(paso.url);
  if (paso.nueva) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
  if (i === ruta.length - 1) a.setAttribute('aria-current', 'page');
  li.appendChild(a);
  lista.appendChild(li);
});
migas.appendChild(lista);
document.body.appendChild(migas);

  // --- Ocultar la barra al bajar, mostrarla al subir ---
  var ultimoY = window.scrollY;
  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    if (Math.abs(y - ultimoY) < 8) return;          // ignora movimientos pequeños
    var bajando = y > ultimoY;
    migas.classList.toggle('oculta', bajando && y > 80);
    ultimoY = y;
  }, { passive: true });

});
