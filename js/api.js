/**
 * api.js
 * Servicio que consume la API REST pública JSONPlaceholder.
 * Convierte cada "todo" de la API al formato de tarea de la aplicación.
 *
 * JSONPlaceholder devuelve los títulos en latín (texto de relleno "lorem ipsum").
 * Para que la aplicación se entienda, cada título se reemplaza por uno en español
 * según el id de la tarea. El id y el estado (completed) se conservan de la API.
 */

const URL_API = 'https://jsonplaceholder.typicode.com/todos';
const CANTIDAD_TAREAS = 15;
const PRIORIDADES_API = ['alta', 'media', 'baja'];

// Títulos en español para las tareas de la API (posición 0 = id 1).
const TITULOS_ES = [
    'Revisar el temario de Programación de Sistemas Web',
    'Leer la documentación de fetch y async/await',
    'Practicar métodos de arreglos: filter, map y sort',
    'Preparar la presentación del proyecto final',
    'Estudiar los módulos ES6 (import y export)',
    'Repasar el uso de localStorage y JSON',
    'Organizar las carpetas del proyecto en Visual Studio Code',
    'Hacer un commit con el avance del día',
    'Probar la aplicación en el teléfono',
    'Corregir los errores encontrados en la consola',
    'Investigar sobre eventos del DOM',
    'Completar el informe de la actividad integradora',
    'Revisar los comentarios del docente',
    'Actualizar el archivo README del repositorio',
    'Publicar el sitio en GitHub Pages',
];

/**
 * Consulta las tareas de la API usando fetch y async/await.
 * Lanza un error si hay un fallo de red o si el servidor responde con error.
 * @returns {Promise<Array<object>>}
 */
export async function obtenerTareasAPI() {
    const respuesta = await fetch(`${URL_API}?_limit=${CANTIDAD_TAREAS}`);

    if (!respuesta.ok) {
        throw new Error(`El servidor respondió con el estado ${respuesta.status}`);
    }

    const datos = await respuesta.json();
    const ahora = Date.now();

    // La API no trae prioridad ni fecha: se asignan para poder ordenar y filtrar.
    return datos.map((todo, indice) => ({
        id: `api-${todo.id}`,
        titulo: TITULOS_ES[todo.id - 1] ?? todo.title,
        prioridad: PRIORIDADES_API[todo.id % PRIORIDADES_API.length],
        completada: todo.completed,
        fechaCreacion: new Date(ahora - (datos.length - indice) * 60 * 60 * 1000).toISOString(),
    }));
}
