/**
 * storage.js
 * Módulo gestor de localStorage (Web Storage API).
 * Es el único módulo que lee y escribe datos en el navegador.
 */

const CLAVE_TAREAS = 'taskmanager_tareas';

/**
 * Indica si ya existen tareas guardadas en el navegador.
 * @returns {boolean}
 */
export function hayTareasGuardadas() {
    return localStorage.getItem(CLAVE_TAREAS) !== null;
}

/**
 * Recupera las tareas guardadas.
 * @returns {Array<object>} Lista de tareas (vacía si no hay datos o están dañados).
 */
export function cargarTareas() {
    try {
        const tareas = JSON.parse(localStorage.getItem(CLAVE_TAREAS));
        return Array.isArray(tareas) ? tareas : [];
    } catch (error) {
        console.error('Los datos de localStorage no son válidos:', error);
        return [];
    }
}

/**
 * Guarda la lista completa de tareas serializada como JSON.
 * @param {Array<object>} tareas
 */
export function guardarTareas(tareas) {
    localStorage.setItem(CLAVE_TAREAS, JSON.stringify(tareas));
}
