# Tareas: Página independiente para crear libros

**Entrada**: Documentos de diseño de `specs/002-book-creation-page/`  
**Prerequisitos**: `plan.md`, `spec.md`; arquitectura y contrato de interfaz existentes en `specs/001-book-reading-tracker/`  
**Organización**: Las tareas se agrupan por historia de usuario.  
**Restricción arquitectónica**: Mantener la aplicación cliente estática actual, las vistas nativas de JavaScript, la navegación hash y el repositorio basado en `localStorage`. No añadir frameworks de ejecución, routers, backend, API ni servicios remotos.

## Notas de ejecución

- La aplicación, el comando de pruebas de npm y las capas de persistencia y modelo ya existen; no se requiere configurar el proyecto ni implementar fundamentos nuevos.
- Se incluyen pruebas automatizadas porque el plan de implementación requiere explícitamente validación con JSDOM y en navegador.
- Los identificadores de las tareas son secuenciales; cada tarea hace referencia a los requisitos y al elemento del plan que le corresponden.

## Fase 1: Preparación

**Propósito**: No se necesitan cambios de preparación. Se utilizarán el proyecto `npm` y el servidor estático local existentes.

## Fase 2: Fundamentos

**Propósito**: No se necesitan cambios fundamentales. El modelo actual, el repositorio de `localStorage` y la estructura de navegación hash siguen siendo la base.

## Fase 3: Historia de usuario 1 - Crear un libro en una página independiente (Prioridad: P1)

**Objetivo**: La página principal muestra únicamente la colección y una acción para crear libros; el usuario puede crear un libro en una página dedicada y volver a la lista.

**Prueba independiente**: Abrir la aplicación con la colección vacía y con un libro guardado. Confirmar que la página principal no contiene campos de creación, que la acción para añadir abre `#/books/new`, que guardar un libro válido vuelve al inicio y lo muestra como pendiente, y que cancelar o producirse errores de validación o almacenamiento no presenta como guardado un libro que no se guardó.

### Pruebas

- [ ] T001 [P] [US1] Ampliar `tests/acceptance/book-tracker.spec.js` con casos de aceptación en JSDOM para el formulario de creación dedicado: guardar un libro válido lo persiste como pendiente y navega al inicio; un título vacío o compuesto solo por espacios muestra un error de campo sin guardar; cancelar deja intactos los libros guardados; provocar un error en `localStorage.setItem` y comprobar que el error permanece visible sin mostrar un mensaje de éxito. [REQ-003, REQ-004, REQ-005, REQ-006; Plan:1.3]
- [ ] T002 [P] [US1] Añadir la configuración de desarrollo de Playwright en `playwright.config.js`, el recorrido de navegador en `e2e/book-creation.spec.js` y la dependencia y los scripts de desarrollo necesarios en `package.json`/`package-lock.json`; comprobar que la página principal no muestra campos de título, autor ni portada, tanto si la lista está vacía como si contiene libros, y que la acción para añadir abre `#/books/new`. [REQ-001, REQ-002; Plan:1.3]

### Implementación

- [x] T003 [US1] Extraer el flujo de creación existente a `src/views/create-view.js`, tomando como referencia su implementación en `src/views/home-view.js`; conservar la validación del título con `trim()`, el autor y la portada opcionales, la regla y las notificaciones existentes para portadas de 2 MiB, `createBook`/`addBook` y los errores de persistencia visibles; además, ofrecer acciones para guardar y volver sin guardar. [REQ-003, REQ-004, REQ-005, REQ-006; Plan:1.1]
- [x] T004 [US1] Actualizar `src/views/home-view.js` para quitar el formulario de creación y la lógica de envío; conservar la colección, el estado vacío, los errores de lectura y la navegación al detalle de los libros, y hacer que la acción visible «Añadir libro» invoque la función de navegación existente con `#/books/new`, tanto si la lista está vacía como si contiene libros. [REQ-001, REQ-002; Plan:1.2]
- [x] T005 [US1] Actualizar `src/app.js` para importar y mostrar `src/views/create-view.js` cuando la ruta sea exactamente `#/books/new`, antes de resolver las rutas `#/books/:id`; conservar el comportamiento actual de las rutas de inicio y detalle, y pasar a la vista de creación la función existente de navegación hash. [REQ-004, REQ-005; Plan:1.2]

### Verificación

- [ ] T006 [US1] Ejecutar `npm test` desde la raíz del repositorio después de los cambios en JSDOM, Playwright, las vistas y el enrutamiento; confirmar que pasan `tests/acceptance/book-tracker.spec.js`, `e2e/book-creation.spec.js` y las pruebas existentes del modelo, el repositorio y el detalle, incluidos el regreso al inicio y la ausencia de falsos mensajes de éxito ante errores de validación o almacenamiento. [REQ-001, REQ-002, REQ-003, REQ-004, REQ-005, REQ-006; Plan:1.3]

**Criterio de finalización**: La historia de usuario 1 estará completa cuando la página principal no contenga campos de creación, la creación se realice únicamente en la ruta dedicada, cancelar o producirse errores no cree ningún libro y todas las suites automatizadas pasen.

## Dependencias y orden de ejecución

### Dependencias entre fases

- **Fase 1: Preparación**: No hay tareas; el proyecto npm ya existe.
- **Fase 2: Fundamentos**: No hay tareas; se reutilizan sin cambios el modelo, el repositorio y la estructura cliente actuales.
- **Fase 3: Historia de usuario 1**: Puede comenzar de inmediato. T001 y T002 son tareas independientes de pruebas y configuración, y pueden iniciarse en paralelo. T003 y T004 modifican archivos de vista distintos y pueden desarrollarse en paralelo una vez acordadas las expectativas de las pruebas. T005 depende de la exportación/interfaz de `create-view.js` definida en T003. T006 depende de T001-T005.

### Dependencias entre historias de usuario

- **US1 (P1)**: No depende de otra historia; es la única historia y constituye el producto mínimo viable.

### Oportunidades de trabajo en paralelo

- T001 y T002 pueden ejecutarse en paralelo porque modifican archivos de pruebas/configuración distintos.
- T003 y T004 pueden ejecutarse en paralelo porque modifican módulos de vista independientes y comparten la función de navegación acordada para `#/books/new`.
- T005 se realiza después de T003 porque importa la vista nueva.
- T006 se ejecuta después de integrar todo el trabajo de implementación y pruebas.

## Estrategia de implementación

### Primero el producto mínimo viable

1. Añadir pruebas de aceptación para el comportamiento de creación existente y la nueva ruta.
2. Crear la vista dedicada del formulario y quitar el formulario de la página principal.
3. Conectar la ruta hash, ejecutar `npm test` y verificar el recorrido de usuario independiente.

### Entrega incremental

Entregar la única historia P1 como un incremento coherente. No modificar el almacenamiento de libros, el modelo ni el comportamiento del detalle como parte de esta funcionalidad.

## Trazabilidad de requisitos

| ID del requisito | Tarea(s) | Elemento(s) del plan |
|--------|---------|--------------|
| REQ-001 | T001, T002, T004, T006 | 1.2, 1.3 |
| REQ-002 | T001, T002, T004, T006 | 1.2, 1.3 |
| REQ-003 | T001, T003, T006 | 1.1, 1.3 |
| REQ-004 | T001, T003, T005, T006 | 1.1, 1.2, 1.3 |
| REQ-005 | T001, T003, T005, T006 | 1.1, 1.2, 1.3 |
| REQ-006 | T001, T003, T006 | 1.1, 1.3 |
