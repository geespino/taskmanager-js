# Declaración de uso de Inteligencia Artificial

**Proyecto:** TaskManager — Actividad Integradora 2
**Estudiante:** Genesis Espinoza
**Asignatura:** Programación de Sistemas Web — Universidad ECOTEC

## 1. ¿Qué herramientas de IA utilicé y en qué momentos?

| Herramienta | Momento del desarrollo | Para qué la usé |
|---|---|---|
| Claude (Anthropic) | Planificación | Interpretar las indicaciones de la actividad y dividir el desarrollo en etapas (una por commit). |
| Claude (Anthropic) | Desarrollo | Proponer la estructura de módulos ES6 (`main`, `ui`, `api`, `storage`, `tareas`) y el código base del CRUD, filtros, ordenamiento, dashboard y consumo de la API. |
| Claude (Anthropic) | Pruebas y documentación | Revisar casos de error (sin conexión, servidor caído), redactar el README y orientarme para subir el proyecto a GitHub por etapas. |

## 2. Prompts clave utilizados

1. > "Desarrolla una aplicación de gestión de tareas en JavaScript Vanilla, sin frameworks, con CRUD, validación de campos vacíos, filtros por estado, búsqueda en tiempo real, ordenamiento por fecha y prioridad, y un dashboard de métricas. Organízala con módulos ES6 separando el DOM, el servicio de la API y el manejo de localStorage."

2. > "¿Cómo consumo la API de JSONPlaceholder con fetch y async/await para importar las tareas solo cuando localStorage está vacío, sin duplicar registros, y cómo muestro un aviso amigable si falla la red?"

3. > "Explícame paso a paso cómo subir el proyecto a GitHub en varios commits desde Visual Studio Code."

## 3. ¿Qué partes del código sugerido requirieron ajustes?

- **Módulos ES6 y `file://`:** al abrir `index.html` con doble clic, el navegador bloqueó la carga de `main.js` por política de CORS. Tuve que ejecutar el proyecto con **Live Server** (y publicarlo en GitHub Pages) para que `import` / `export` funcionaran.
- **Datos de la API incompletos:** JSONPlaceholder no envía prioridad ni fecha de creación. Se agregó una conversión en `api.js` que asigna una prioridad y una fecha a cada tarea para que el ordenamiento y los filtros funcionaran.
- **Títulos en latín:** la API devuelve textos de relleno en latín ("delectus aut autem"), que no se entendían en la aplicación. Se agregó en `api.js` una lista de títulos en español que reemplaza cada título según el `id`, conservando el `id` y el estado `completed` que envía la API.
- **Identificadores repetidos:** los `id` numéricos de la API podían chocar con los de las tareas nuevas. Se usó un prefijo (`api-1`, `t-...`) y la función `eliminarDuplicados()` para no duplicar registros.
- **Seguridad al mostrar texto:** se verificó que los títulos se insertaran con `textContent` y no con `innerHTML`, para que un texto como `<b>hola</b>` se muestre tal cual y no se ejecute como HTML.
- **Recarga de la API:** se ajustó la condición para importar solo cuando la clave de localStorage no existe (`getItem() === null`); así, si el usuario borra todas sus tareas, la API no las vuelve a cargar.

> Revisé y probé cada etapa en el navegador (Live Server y DevTools → Application → Local Storage) antes de subirla a GitHub.
