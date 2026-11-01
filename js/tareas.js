/**
 * tareas.js
 * Lógica de negocio de las tareas: creación, validación,
 * métricas, filtros y ordenamiento. No toca el DOM ni localStorage.
 */

// Valor numérico de cada prioridad para poder ordenarlas.
export const PRIORIDADES = { alta: 3, media: 2, baja: 1 };
export const LONGITUD_MINIMA = 3;
export const LONGITUD_MAXIMA = 120;

/**
 * Genera un identificador único para una tarea nueva.
 * @returns {string}
 */
function generarId() {
    const tiempo = Date.now().toString(36);
    const aleatorio = Math.random().toString(36).slice(2, 7);
    return `t-${tiempo}-${aleatorio}`;
}

/**
 * Valida los datos del formulario.
 * @param {string} titulo
 * @param {string} prioridad
 * @returns {string|null} Mensaje de error, o null si los datos son válidos.
 */
export function validarTarea(titulo, prioridad) {
    const texto = typeof titulo === 'string' ? titulo.trim() : '';

    if (texto === '') {
        return 'El título de la tarea no puede estar vacío.';
    }
    if (texto.length < LONGITUD_MINIMA) {
        return `El título debe tener al menos ${LONGITUD_MINIMA} caracteres.`;
    }
    if (texto.length > LONGITUD_MAXIMA) {
        return `El título no puede superar los ${LONGITUD_MAXIMA} caracteres.`;
    }
    if (!Object.hasOwn(PRIORIDADES, prioridad)) {
        return 'Selecciona una prioridad válida.';
    }
    return null;
}

/**
 * Crea un objeto tarea nuevo.
 * @param {string} titulo
 * @param {string} prioridad
 * @returns {object}
 */
export function crearTarea(titulo, prioridad) {
    return {
        id: generarId(),
        titulo: titulo.trim(),
        prioridad,
        completada: false,
        fechaCreacion: new Date().toISOString(),
    };
}
