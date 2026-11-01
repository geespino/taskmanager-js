/**
 * ui.js
 * Módulo de interfaz visual: todo lo que lee o modifica el DOM.
 */

export const elementos = {
    formulario: document.querySelector('#form-tarea'),
    inputTitulo: document.querySelector('#titulo'),
    selectPrioridad: document.querySelector('#prioridad'),
    botonGuardar: document.querySelector('#btn-guardar'),
    errorFormulario: document.querySelector('#error-formulario'),
    lista: document.querySelector('#lista-tareas'),
    mensajeVacio: document.querySelector('#mensaje-vacio'),
    tituloFormulario: document.querySelector('#titulo-formulario'),
    botonCancelar: document.querySelector('#btn-cancelar'),
    metricaTotal: document.querySelector('#metrica-total'),
    metricaPendientes: document.querySelector('#metrica-pendientes'),
    metricaCompletadas: document.querySelector('#metrica-completadas'),
    metricaPorcentaje: document.querySelector('#metrica-porcentaje'),
    barraProgreso: document.querySelector('#barra-progreso'),
    filtros: document.querySelector('#filtros'),
    inputBusqueda: document.querySelector('#busqueda'),
    selectOrden: document.querySelector('#orden'),
    contadorVisible: document.querySelector('#contador-visible'),
    estadoCarga: document.querySelector('#estado-carga'),
    estadoConexion: document.querySelector('#estado-conexion'),
    notificaciones: document.querySelector('#notificaciones'),
};

const ETIQUETAS_PRIORIDAD = { alta: 'Alta', media: 'Media', baja: 'Baja' };
const formatoFecha = new Intl.DateTimeFormat('es-EC', { dateStyle: 'medium', timeStyle: 'short' });

/**
 * Crea un elemento HTML con clase y texto opcionales.
 * Se usa textContent para evitar que el texto del usuario se interprete como HTML.
 */
function crearElemento(etiqueta, clase, texto) {
    const elemento = document.createElement(etiqueta);
    if (clase) elemento.className = clase;
    if (texto !== undefined) elemento.textContent = texto;
    return elemento;
}

function crearBoton(texto, accion, claseExtra = '') {
    const boton = crearElemento('button', `boton-accion ${claseExtra}`.trim(), texto);
    boton.type = 'button';
    boton.dataset.accion = accion;
    return boton;
}

/**
 * Construye el <li> de una tarea.
 * @param {object} tarea
 * @returns {HTMLLIElement}
 */
function crearElementoTarea(tarea) {
    const item = crearElemento('li', `tarea tarea--${tarea.prioridad}`);
    item.dataset.id = tarea.id;

    if (tarea.completada) {
        item.classList.add('tarea--completada');
    }

    const casilla = document.createElement('input');
    casilla.type = 'checkbox';
    casilla.className = 'tarea__casilla';
    casilla.checked = tarea.completada;
    casilla.dataset.accion = 'completar';
    casilla.setAttribute('aria-label', `Marcar "${tarea.titulo}" como completada`);
    item.append(casilla);

    const contenido = crearElemento('div', 'tarea__contenido');
    const titulo = crearElemento('p', 'tarea__titulo', tarea.titulo);
    const meta = crearElemento('div', 'tarea__meta');
    const etiqueta = crearElemento('span', `etiqueta etiqueta--${tarea.prioridad}`, ETIQUETAS_PRIORIDAD[tarea.prioridad]);
    const fecha = crearElemento('time', 'tarea__fecha', formatoFecha.format(new Date(tarea.fechaCreacion)));
    fecha.dateTime = tarea.fechaCreacion;
    meta.append(etiqueta, fecha);
    contenido.append(titulo, meta);

    const acciones = crearElemento('div', 'tarea__acciones');
    acciones.append(crearBoton('Editar', 'editar'));
    acciones.append(crearBoton('Eliminar', 'eliminar', 'boton-accion--peligro'));

    item.append(contenido, acciones);
    return item;
}

/**
 * Dibuja la lista de tareas visibles.
 * @param {Array<object>} tareas Tareas a mostrar.
 * @param {number} total Cantidad total de tareas guardadas.
 */
export function renderizarTareas(tareas, total = tareas.length) {
    elementos.lista.replaceChildren(...tareas.map(crearElementoTarea));

    elementos.mensajeVacio.hidden = tareas.length > 0;
    elementos.mensajeVacio.textContent =
        total === 0
            ? 'Aún no tienes tareas. ¡Agrega la primera!'
            : 'Ninguna tarea coincide con el filtro o la búsqueda.';

    elementos.contadorVisible.textContent = `Mostrando ${tareas.length} de ${total}`;
}

/** Devuelve los valores escritos en el formulario. */
export function leerFormulario() {
    return {
        titulo: elementos.inputTitulo.value,
        prioridad: elementos.selectPrioridad.value,
    };
}

/** Vacía el formulario y deja el cursor en el título. */
export function limpiarFormulario() {
    elementos.formulario.reset();
    elementos.inputTitulo.focus();
}

/** Muestra un mensaje de validación debajo del formulario. */
export function mostrarErrorFormulario(mensaje) {
    elementos.errorFormulario.textContent = mensaje;
    elementos.inputTitulo.classList.add('campo--error');
    elementos.inputTitulo.focus();
}

/** Quita el mensaje de validación. */
export function limpiarErrorFormulario() {
    elementos.errorFormulario.textContent = '';
    elementos.inputTitulo.classList.remove('campo--error');
}

/**
 * Actualiza las tarjetas del dashboard.
 * @param {{total: number, pendientes: number, completadas: number, porcentaje: number}} metricas
 */
export function actualizarDashboard({ total, pendientes, completadas, porcentaje }) {
    elementos.metricaTotal.textContent = total;
    elementos.metricaPendientes.textContent = pendientes;
    elementos.metricaCompletadas.textContent = completadas;
    elementos.metricaPorcentaje.textContent = `${porcentaje}%`;
    elementos.barraProgreso.style.width = `${porcentaje}%`;
}

/** Carga una tarea en el formulario para editarla. */
export function activarModoEdicion(tarea) {
    elementos.inputTitulo.value = tarea.titulo;
    elementos.selectPrioridad.value = tarea.prioridad;
    elementos.tituloFormulario.textContent = 'Editar tarea';
    elementos.botonGuardar.textContent = 'Guardar cambios';
    elementos.botonCancelar.hidden = false;
    elementos.formulario.classList.add('formulario--edicion');
    elementos.inputTitulo.focus();
}

/** Devuelve el formulario a su estado de "Nueva tarea". */
export function desactivarModoEdicion() {
    elementos.formulario.reset();
    elementos.tituloFormulario.textContent = 'Nueva tarea';
    elementos.botonGuardar.textContent = 'Agregar tarea';
    elementos.botonCancelar.hidden = true;
    elementos.formulario.classList.remove('formulario--edicion');
}

/** Resalta el botón del filtro seleccionado. */
export function marcarFiltroActivo(estado) {
    elementos.filtros.querySelectorAll('[data-filtro]').forEach((boton) => {
        boton.setAttribute('aria-pressed', String(boton.dataset.filtro === estado));
    });
}

/**
 * Muestra una notificación visual temporal.
 * @param {string} mensaje
 * @param {'exito'|'error'|'info'} tipo
 * @param {number} duracion Milisegundos antes de ocultarse.
 */
export function mostrarNotificacion(mensaje, tipo = 'info', duracion = 4000) {
    const notificacion = crearElemento('div', `notificacion notificacion--${tipo}`);
    notificacion.setAttribute('role', tipo === 'error' ? 'alert' : 'status');

    const texto = crearElemento('p', 'notificacion__texto', mensaje);
    const cerrar = crearElemento('button', 'notificacion__cerrar', '×');
    cerrar.type = 'button';
    cerrar.setAttribute('aria-label', 'Cerrar notificación');

    const quitar = () => notificacion.remove();
    cerrar.addEventListener('click', quitar);
    setTimeout(quitar, duracion);

    notificacion.append(texto, cerrar);
    elementos.notificaciones.append(notificacion);
}

/** Muestra u oculta el aviso de carga. */
export function mostrarCargando(activo) {
    elementos.estadoCarga.hidden = !activo;
}

/** Actualiza la etiqueta de conexión del encabezado. */
export function actualizarEstadoConexion(enLinea) {
    elementos.estadoConexion.textContent = enLinea ? 'En línea' : 'Sin conexión';
    elementos.estadoConexion.classList.toggle('estado-conexion--offline', !enLinea);
}
