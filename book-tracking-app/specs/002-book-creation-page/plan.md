# Implementation Plan: Página independiente para crear libros

**Date**: 2026-10-26 | **Spec**: [spec.md](./spec.md)

## Summary

Bookify ya es una aplicación web cliente estática con vistas JavaScript nativas, navegación hash y persistencia encapsulada en `localStorage`. Se conservará esa arquitectura y se moverá el flujo existente de creación a una vista independiente accesible desde una nueva ruta hash. La página principal conservará su lista, su estado vacío y una única acción visible para añadir libros. El alta mantendrá los campos, validaciones, tratamiento de portadas y errores de persistencia actuales.

## Technical Context

**Language/Version**: JavaScript moderno del navegador (ES2022+), HTML5 y CSS3  
**Primary Dependencies**: Sin dependencias de ejecución; módulos JavaScript nativos  
**Storage**: `localStorage` existente, mediante `src/persistence/book-repository.js`; no se cambia el modelo persistente  
**Testing**: Node.js `node:test` y JSDOM existentes; validación del flujo visible en navegador con Playwright como herramienta de desarrollo  
**Target Platform**: Navegador moderno ejecutando la aplicación localmente  
**Performance Goals**: La navegación entre la lista y el formulario debe sentirse inmediata para una lista personal de libros  
**Constraints**: Mantener aplicación cliente local, módulos nativos, navegación hash y persistencia existente; no introducir framework, router, backend, API, base de datos ni servicios remotos

## Constitution Check

| Principio | Resultado | Evidencia del plan |
|---|---|---|
| I. Mantenibilidad mediante simplicidad | PASS | Se amplían el enrutamiento hash y las vistas nativas existentes; no se añade una capa de navegación ni dependencias de ejecución. |
| II. Ejecución exclusivamente local | PASS | La vista y las pruebas del flujo no requieren servicios remotos durante el uso de la aplicación. |
| III. Persistencia local con localStorage | PASS | La nueva vista seguirá utilizando el repositorio existente y mantendrá los errores de guardado visibles. |
| IV. Sin backend ni API | PASS | No se añaden endpoints ni componentes de servidor de producto. |
| V. Sin autenticación, autorización ni roles | PASS | El flujo conserva el mismo usuario y contexto local, sin cuentas ni controles de acceso. |

**Revisión tras diseño**: PASS; el cambio se limita a presentación, navegación y pruebas, sin modificar las restricciones arquitectónicas.

## Applied Guidelines

- No se identificaron guías de migración o transformación aplicables. Las guías disponibles corresponden a migraciones Java y no aplican a esta aplicación JavaScript nativa.
- Se mantienen las convenciones establecidas en el plan de `001-book-reading-tracker`: vistas por responsabilidad, navegación hash en `src/app.js` y acceso a datos a través del repositorio existente.

## Implementation Steps

### Phase 1: User Story 1 — Crear un libro en una página independiente (P1)

#### Step 1.1: Implementar la vista dedicada de creación

- **Requirements**: REQ-003, REQ-006
- **Design inputs**: `spec.md`; `specs/001-book-reading-tracker/contracts/ui-contract.md`; `src/views/home-view.js`; `src/model/book.js`; `src/persistence/book-repository.js`
- **Description**: Extraer el formulario del flujo de inicio a `src/views/create-view.js`, conservando título obligatorio, autor y portada opcionales, el límite de portada existente, creación con estado pendiente, guardado mediante el repositorio y mensajes de validación o persistencia. La vista debe ofrecer una acción para volver sin guardar. No cambiar el modelo del libro ni el formato almacenado.

#### Step 1.2: Conectar la ruta y simplificar la página principal

- **Requirements**: REQ-001, REQ-002, REQ-004, REQ-005
- **Design inputs**: `spec.md`; `src/app.js`; `src/views/home-view.js`; `src/views/detail-view.js`
- **Description**: En `src/app.js`, resolver `#/books/new` antes de la ruta de detalle existente y renderizar la nueva vista con el mismo mecanismo de navegación hash. En `src/views/home-view.js`, eliminar el formulario y ofrecer la acción de añadir libro tanto con lista vacía como con libros; mantener las secciones, tarjetas, errores de lectura y enlaces al detalle. Al confirmar un guardado, volver a `#/`; cancelar también vuelve sin modificar libros.

#### Step 1.3: Verificar los recorridos de creación y regresión

- **Requirements**: REQ-001, REQ-002, REQ-003, REQ-004, REQ-005, REQ-006
- **Design inputs**: `spec.md`; pruebas existentes en `tests/acceptance/book-tracker.spec.js`; `package.json`
- **Description**: Adaptar las pruebas de aceptación existentes al formulario independiente y comprobar estados vacíos y con libros, navegación de ida y vuelta, guardado como pendiente, rechazo de títulos vacíos, cancelación y error de persistencia sin falso éxito. Añadir verificación en navegador de que el inicio no expone campos del formulario y que la acción de alta funciona en ambos estados de lista.

### Tasks

La descomposición detallada, orden de dependencias, criterios de verificación y mapeo por requisito se mantienen en [tasks.md](./tasks.md).

## Project Structure

```text
book-tracking-app/
├── index.html
├── src/
│   ├── app.js
│   ├── model/
│   │   └── book.js
│   ├── persistence/
│   │   └── book-repository.js
│   ├── views/
│   │   ├── create-view.js       # nueva vista del formulario
│   │   ├── detail-view.js
│   │   └── home-view.js         # lista y navegación hacia alta
│   └── styles.css
├── tests/
│   └── acceptance/
│       └── book-tracker.spec.js # pruebas existentes actualizadas
├── e2e/
│   └── book-creation.spec.js    # recorrido de navegador
├── playwright.config.js         # configuración de pruebas de navegador
└── package.json                 # herramienta y scripts de pruebas de desarrollo
```

La ruta de creación será `#/books/new`; las rutas de detalle `#/books/:id` y la estructura de persistencia permanecen sin cambios. El formulario se convierte en una vista del flujo de cliente existente, no en una página servida por un backend.

## Testing Strategy

### Critical Journeys

1. Desde el inicio, con la lista vacía, abrir la creación, guardar un libro válido y comprobar que aparece como pendiente al volver al inicio.
2. Con libros existentes, comprobar que el inicio muestra la lista y la acción para añadir, pero ningún campo del formulario.
3. Abrir la creación, cancelar o volver al inicio y comprobar que la colección permanece intacta.
4. Intentar guardar un título vacío o provocar un error de persistencia y comprobar que se muestra el error sin confirmar una creación.

### Tooling

- **appType**: Aplicación web cliente estática con navegación hash y vistas renderizadas en el navegador.
- **primaryValidationStack**: `npm test` para pruebas con `node:test`/JSDOM y Playwright contra la aplicación iniciada con `npm start` para los recorridos de navegador.
- **Infra tier**: No aplica; el producto no usa base de datos, broker, caché ni servicios externos. La persistencia de aceptación se ejecuta en `localStorage` del navegador.
- **Browser tier**: Playwright/Chromium para comprobar rutas y comportamiento observable de la UI.
- **Fallback matrix**:
  - `infra-tier`: No hay infraestructura externa que provisionar o sustituir.
  - `browser-tier`: Si Playwright o Chromium no pueden instalarse por un error reproducible, ejecutar las pruebas existentes de integración de vistas con JSDOM; la brecha será no verificar renderizado y comportamiento en un navegador real y debe reportarse, no asumirse como equivalente.
- **Environment requirements**: Node.js/npm; servidor estático local del proyecto; Playwright y sus binarios de Chromium para las pruebas de navegador. Docker no es necesario.
- **knownGaps**: JSDOM no reemplaza validación de renderizado, navegación y selección de archivos en un navegador. No hay brecha de fidelidad de infraestructura porque no existe una dependencia externa.

### Test Data and Execution

- Inicializar el `localStorage` de prueba vacío antes de cada caso y limpiar el contexto del navegador al finalizar.
- Usar títulos/identificadores únicos para evitar colisiones; no depender de libros preexistentes.
- No hay servicios externos ni contratos de API que simular.
- Ejecutar las pruebas existentes con el comando canónico `npm test`; ejecutar los escenarios Playwright mediante el script de navegador incorporado al proyecto y verificar que ambas suites son repetibles.

### Acceptance Criteria

- La home nunca contiene el formulario, ni con lista vacía ni con libros.
- La acción de alta desde ambos estados abre `#/books/new`.
- Un guardado válido conserva los atributos y estado inicial existentes, vuelve a la home y muestra el libro.
- Cancelación, título inválido y error de persistencia no crean ni anuncian un libro como guardado.
- El flujo de detalle y las pruebas no relacionadas con la creación continúan funcionando.

### Validation Review Expectations

- Confirmar que la ruta nueva no se confunde con `#/books/:id` y que las rutas existentes siguen resolviéndose.
- Revisar que el repositorio `localStorage`, el formato del libro y el flujo de detalle no se hayan duplicado ni cambiado.
- Confirmar resultados de `npm test` y de Playwright, con códigos de salida y fallos reportados explícitamente.
- Si se activa la alternativa JSDOM, documentar el error reproducible de Playwright y la brecha de navegador real.

## Requirement Mapping

| REQ ID | Description | Plan Items | Implementation Evidence |
|--------|-------------|-------------|--------------------------|
| REQ-001 | La home muestra lista/estado vacío y no muestra campos de creación | 1.2, 1.3 | `src/views/home-view.js`, `e2e/book-creation.spec.js` |
| REQ-002 | Acción de alta disponible desde home con o sin libros | 1.2, 1.3 | `src/views/home-view.js`, `e2e/book-creation.spec.js` |
| REQ-003 | Formulario dedicado conserva campos y validaciones | 1.1, 1.3 | `src/views/create-view.js`, `tests/acceptance/book-tracker.spec.js` |
| REQ-004 | Guardado exitoso vuelve a home y muestra el libro pendiente | 1.1, 1.2, 1.3 | `src/views/create-view.js`, `src/app.js`, `tests/acceptance/book-tracker.spec.js` |
| REQ-005 | Cancelar vuelve sin crear ni modificar libros | 1.1, 1.2, 1.3 | `src/views/create-view.js`, `src/app.js`, `tests/acceptance/book-tracker.spec.js` |
| REQ-006 | Errores de validación/persistencia son visibles y no simulan éxito | 1.1, 1.3 | `src/views/create-view.js`, `tests/acceptance/book-tracker.spec.js` |
