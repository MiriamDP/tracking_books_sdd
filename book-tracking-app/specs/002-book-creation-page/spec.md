# Feature Specification: Página independiente para crear libros

**Feature Branch**: `002-book-creation-page`  
**Created**: 2026-10-26  
**Status**: Draft  
**Input**: User description: "Mover la creación de un libro a una nueva página para que no aparezca en la home"

## Scope Baseline *(mandatory)*

- **Discovery method**: Revisión de la descripción de la funcionalidad y de la especificación y el contrato de interfaz existentes.
- **Total items discovered**: 1 cambio de flujo.
- **Items in scope**: 1: trasladar el formulario de creación desde la página principal a una página independiente, conservando el alta de libros.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Crear un libro en una página independiente (Priority: P1)

Como lector, quiero abrir una página dedicada para añadir un libro, para que la página principal se centre en mostrar mi lista de lectura.

**Why this priority**: Separar el alta de la consulta hace que la página principal cumpla su propósito de mostrar la lista sin perder la posibilidad de añadir libros.

**Independent Test**: Desde la página principal, abrir la opción para añadir un libro, completar y guardar el formulario, y comprobar que se vuelve a la lista con el libro nuevo.

**Acceptance Scenarios**:

1. **Given** que estoy en la página principal, **When** selecciono la acción para añadir un libro, **Then** se abre una página independiente con el formulario de creación.
2. **Given** que estoy en la página principal, **When** la página termina de mostrarse, **Then** no veo campos ni controles del formulario de creación, tanto si la lista está vacía como si contiene libros.
3. **Given** que estoy en la página de creación y completo un título válido, **When** guardo el libro, **Then** se conserva como pendiente y vuelvo a la página principal, donde aparece en la lista.
4. **Given** que estoy en la página de creación, **When** cancelo o vuelvo a la página principal sin guardar, **Then** no se añade ningún libro.
5. **Given** que estoy en la página de creación y dejo el título vacío o compuesto solo por espacios, **When** intento guardar, **Then** no se crea el libro y se indica que el título es obligatorio.
6. **Given** que se produce un error al guardar, **When** intento crear un libro, **Then** se informa del error y la interfaz no presenta el libro como guardado.

### Edge Cases

- La acción para añadir un libro está disponible en la página principal tanto cuando hay libros como cuando se muestra el estado vacío.
- Si el guardado falla, el usuario permanece en la página de creación o recibe un estado de error equivalente que le permite corregir o reintentar sin perder silenciosamente el formulario.
- Cancelar o abandonar el formulario no modifica la lista ni crea un libro parcial.

## Requirements *(mandatory)*

### Functional Requirements

- **REQ-001**: La página principal MUST mostrar la lista de libros o su estado vacío y MUST NOT mostrar campos ni controles del formulario de creación.
- **REQ-002**: La página principal MUST ofrecer una acción identificable para abrir la página independiente de creación, tanto con una lista vacía como con libros existentes.
- **REQ-003**: La página independiente MUST permitir crear un libro con los campos y validaciones ya establecidos para el alta de libros.
- **REQ-004**: Al guardar correctamente, la aplicación MUST conservar el libro nuevo como pendiente y volver a la página principal, donde el libro aparecerá en la lista.
- **REQ-005**: El usuario MUST poder abandonar la página de creación y volver a la página principal sin guardar; esta acción MUST NOT crear ni modificar libros.
- **REQ-006**: Si la validación o la persistencia impide guardar, la aplicación MUST informar del resultado y MUST NOT indicar que el libro se guardó correctamente.

### Key Entities

- **Libro**: Entrada de la lista de lectura creada desde la página independiente. Sus campos, estado inicial, validaciones y persistencia permanecen sujetos a las reglas ya definidas para los libros.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: En el 100 % de los estados de la página principal (lista vacía o con libros), no se muestran campos del formulario de creación.
- **SC-002**: Una persona puede abrir el formulario de creación desde la página principal con una sola acción visible.
- **SC-003**: En el 100 % de las pruebas de guardado exitoso, el libro nuevo aparece como pendiente en la lista después de volver a la página principal.
- **SC-004**: En el 100 % de las pruebas de cancelación o error de guardado, no se añade ni se anuncia como guardado ningún libro.

## Assumptions

- La página independiente conserva los campos y reglas de creación existentes: título obligatorio, autor opcional y portada opcional con sus límites y mensajes actuales.
- La página principal continúa siendo el punto de entrada y conserva la lista, el estado vacío y la acción de añadir.
- La navegación y la persistencia siguen cumpliendo la constitución del proyecto: funcionamiento local, datos en el navegador y sin backend ni servicios remotos.
- Después de un guardado confirmado, el flujo vuelve a la página principal; cancelar o volver sin guardar no altera los datos.
