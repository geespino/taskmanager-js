/**
 * main.js
 * Punto de entrada de TaskManager. Coordina los módulos:
 *  - tareas.js  → lógica de las tareas
 *  - storage.js → persistencia en localStorage
 *  - api.js     → consumo de la API REST
 *  - ui.js      → interfaz visual (DOM)
 */

import { hayTareasGuardadas, cargarTareas, guardarTareas } from './storage.js';
import {
    validarTarea,
    crearTarea,
    calcularMetricas,
    filtrarTareas,
    ordenarTareas,
    eliminarDuplicados,
} from './tareas.js';
import { obtenerTareasAPI } from './api.js';
import * as ui from './ui.js';

// ---------- Estado de la aplicación ----------
let tareas = [];
let idEnEdicion = null;
const vista = { estado: 'todas', busqueda: '', orden: 'recientes' };

// ---------- Renderizado ----------
function renderizar() {
    const filtradas = filtrarTareas(tareas, vista.estado, vista.busqueda);
    const visibles = ordenarTareas(filtradas, vista.orden);
    ui.renderizarTareas(visibles, tareas.length);
    ui.actualizarDashboard(calcularMetricas(tareas));
}

/** Guarda en localStorage y vuelve a dibujar la interfaz. */
function guardarYRenderizar() {
    guardarTareas(tareas);
    renderizar();
}

// ---------- Acciones CRUD ----------
function manejarEnvio(evento) {
    evento.preventDefault();
    const { titulo, prioridad } = ui.leerFormulario();

    const error = validarTarea(titulo, prioridad);
    if (error) {
        ui.mostrarErrorFormulario(error);
        return;
    }
    ui.limpiarErrorFormulario();

    if (idEnEdicion !== null) {
        guardarEdicion(titulo, prioridad);
        return;
    }

    tareas.unshift(crearTarea(titulo, prioridad));
    ui.limpiarFormulario();
    guardarYRenderizar();
    ui.mostrarNotificacion('Tarea agregada correctamente.', 'exito');
}

function eliminarTarea(id) {
    tareas = tareas.filter((tarea) => tarea.id !== id);
    if (idEnEdicion === id) {
        salirDeEdicion();
    }
    guardarYRenderizar();
    ui.mostrarNotificacion('Tarea eliminada.', 'info');
}

function alternarCompletada(id) {
    tareas = tareas.map((tarea) =>
        tarea.id === id ? { ...tarea, completada: !tarea.completada } : tarea
    );
    guardarYRenderizar();
}

function iniciarEdicion(id) {
    const tarea = tareas.find((item) => item.id === id);
    if (!tarea) return;
    idEnEdicion = id;
    ui.limpiarErrorFormulario();
    ui.activarModoEdicion(tarea);
}

function guardarEdicion(titulo, prioridad) {
    tareas = tareas.map((tarea) =>
        tarea.id === idEnEdicion ? { ...tarea, titulo: titulo.trim(), prioridad } : tarea
    );
    salirDeEdicion();
    guardarYRenderizar();
    ui.mostrarNotificacion('Cambios guardados.', 'exito');
}

function salirDeEdicion() {
    idEnEdicion = null;
    ui.limpiarErrorFormulario();
    ui.desactivarModoEdicion();
}

/** Delegación de eventos: un solo listener para todos los botones de la lista. */
function manejarAccionLista(evento) {
    const control = evento.target.closest('[data-accion]');
    if (!control) return;

    const id = control.closest('.tarea').dataset.id;
    const acciones = {
        eliminar: eliminarTarea,
        completar: alternarCompletada,
        editar: iniciarEdicion,
    };
    acciones[control.dataset.accion]?.(id);
}

// ---------- Filtros, búsqueda y ordenamiento ----------
function manejarFiltro(evento) {
    const boton = evento.target.closest('[data-filtro]');
    if (!boton) return;
    vista.estado = boton.dataset.filtro;
    ui.marcarFiltroActivo(vista.estado);
    renderizar();
}

// ---------- Eventos ----------
function registrarEventos() {
    ui.elementos.formulario.addEventListener('submit', manejarEnvio);
    ui.elementos.lista.addEventListener('click', manejarAccionLista);
    ui.elementos.botonCancelar.addEventListener('click', salirDeEdicion);
    ui.elementos.filtros.addEventListener('click', manejarFiltro);
    ui.elementos.inputBusqueda.addEventListener('input', (evento) => {
        vista.busqueda = evento.target.value;
        renderizar();
    });
    ui.elementos.selectOrden.addEventListener('change', (evento) => {
        vista.orden = evento.target.value;
        renderizar();
    });
    window.addEventListener('offline', () => {
        ui.actualizarEstadoConexion(false);
        ui.mostrarNotificacion('Sin conexión a internet. Tus cambios se siguen guardando en este navegador.', 'info');
    });
    window.addEventListener('online', () => {
        ui.actualizarEstadoConexion(true);
        ui.mostrarNotificacion('Conexión restablecida.', 'exito');
    });
}

// ---------- Carga inicial desde la API ----------
async function importarDesdeAPI() {
    ui.mostrarCargando(true);
    try {
        const tareasAPI = await obtenerTareasAPI();
        tareas = eliminarDuplicados(tareasAPI);
        guardarTareas(tareas);
        ui.mostrarNotificacion(`Se importaron ${tareas.length} tareas desde la API.`, 'exito');
    } catch (error) {
        console.error('Error al consultar la API:', error);
        tareas = [];
        ui.mostrarNotificacion(
            'No se pudieron cargar las tareas del servidor. Revisa tu conexión; puedes seguir creando tareas y se guardarán en este navegador.',
            'error',
            7000
        );
    } finally {
        ui.mostrarCargando(false);
    }
}

// ---------- Inicio ----------
async function inicializar() {
    registrarEventos();
    ui.actualizarEstadoConexion(navigator.onLine);

    if (hayTareasGuardadas()) {
        // Ya hay datos: se usan los del navegador (funciona sin internet).
        tareas = cargarTareas();
    } else {
        // localStorage vacío: se importan las tareas de la API una sola vez.
        await importarDesdeAPI();
    }
    renderizar();
}

inicializar();
