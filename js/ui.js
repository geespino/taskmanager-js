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

    const contenido = crearElemento('div', 'tarea__contenido');
    const titulo = crearElemento('p', 'tarea__titulo', tarea.titulo);
    const meta = crearElemento('div', 'tarea__meta');
    const etiqueta = crearElemento('span', `etiqueta etiqueta--${tarea.prioridad}`, ETIQUETAS_PRIORIDAD[tarea.prioridad]);
    const fecha = crearElemento('time', 'tarea__fecha', formatoFecha.format(new Date(tarea.fechaCreacion)));
    fecha.dateTime = tarea.fechaCreacion;
    meta.append(etiqueta, fecha);
    contenido.append(titulo, meta);

    const acciones = crearElemento('div', 'tarea__acciones');
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
