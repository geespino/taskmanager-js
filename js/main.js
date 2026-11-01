/**
 * main.js
 * Punto de entrada de TaskManager. Coordina los módulos:
 *  - tareas.js  → lógica de las tareas
 *  - storage.js → persistencia en localStorage
 *  - ui.js      → interfaz visual (DOM)
 */

import { hayTareasGuardadas, cargarTareas, guardarTareas } from './storage.js';
import {
    validarTarea,
    crearTarea,
    calcularMetricas,
} from './tareas.js';
import * as ui from './ui.js';

// ---------- Estado de la aplicación ----------
let tareas = [];
let idEnEdicion = null;

// ---------- Renderizado ----------
function renderizar() {
    ui.renderizarTareas(tareas);
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
}

function eliminarTarea(id) {
    tareas = tareas.filter((tarea) => tarea.id !== id);
    if (idEnEdicion === id) {
        salirDeEdicion();
    }
    guardarYRenderizar();
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

// ---------- Eventos ----------
function registrarEventos() {
    ui.elementos.formulario.addEventListener('submit', manejarEnvio);
    ui.elementos.lista.addEventListener('click', manejarAccionLista);
    ui.elementos.botonCancelar.addEventListener('click', salirDeEdicion);
}

// ---------- Inicio ----------
function inicializar() {
    registrarEventos();
    tareas = hayTareasGuardadas() ? cargarTareas() : [];
    renderizar();
}

inicializar();
