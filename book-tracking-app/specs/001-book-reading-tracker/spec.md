# Feature Specification: Seguimiento de libros leídos

**Feature Branch**: `001-book-reading-tracker`

**Created**: 2026-10-25

**Status**: Draft

**Input**: User description: "Bookify es una aplicación de seguimiento de libros leidos y por leer. El usuario podrá guardar libros y marcar si los ha leido o no. En la home se tendrá la lista de libros apareciendo primero los libros no leidos y luego los leidos. Al hacer click en un libro debe aparecer la página de detalle del libro desde donde se pondrá cambiar su estado a leido o no leido o eliminarlo. Desde la home se podrá añadir un nuevo libro."

## Clarifications

### Session 2026-10-25

- Q: ¿Debe Bookify permitir una imagen de portada opcional, guardarla en Base64 con límite menor a 2 MB y guardar el libro sin imagen si excede el límite? → A: Sí. La portada es opcional; se conserva codificada en Base64 si el archivo mide menos de 2 MB. Si mide 2 MB o más, el libro se guarda sin imagen.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Añadir y consultar libros (Priority: P1)

Como lector, quiero guardar libros y verlos en la página principal, para tener una lista sencilla de mis lecturas pendientes y completadas.

**Why this priority**: Crear y consultar la lista es el propósito central de Bookify y permite empezar a organizar lecturas.

**Independent Test**: Se puede añadir un libro con título, volver a la página principal y comprobar que aparece en la lista con estado pendiente.

**Acceptance Scenarios**:

1. **Given** que estoy en la página principal, **When** añado un libro con un título válido, **Then** el libro queda guardado como pendiente y aparece en la lista.
2. **Given** que no hay libros guardados, **When** abro la página principal, **Then** veo un estado vacío que explica que aún no hay libros y ofrece la opción de añadir uno.
3. **Given** que hay libros guardados, **When** abro la página principal, **Then** veo primero todos los libros pendientes y después todos los leídos.
4. **Given** que intento añadir un libro sin título, **When** confirmo el formulario, **Then** el libro no se guarda y se me indica que el título es obligatorio.
5. **Given** que añado un libro con título y autor, **When** se guarda correctamente, **Then** ambos datos aparecen en su detalle.
6. **Given** que he guardado libros, **When** vuelvo a abrir la aplicación en el mismo navegador y origen local, **Then** los libros y sus estados siguen disponibles.
7. **Given** que selecciono una imagen de portada de menos de 2 MB, **When** guardo el libro, **Then** la portada se conserva y aparece en su detalle.
8. **Given** que selecciono una imagen de portada de 2 MB o más, **When** guardo el libro, **Then** el libro se guarda sin imagen y se me informa de que la portada superó el límite.

---

### User Story 2 - Consultar y cambiar el estado de un libro (Priority: P2)

Como lector, quiero abrir el detalle de un libro y cambiar si lo he leído, para mantener actualizada mi lista.

**Why this priority**: El cambio de estado hace que la lista refleje el progreso de lectura y mantenga su orden por estado.

**Independent Test**: Se puede abrir un libro desde la lista, cambiar su estado y comprobar que el nuevo estado se muestra en el detalle y en la lista.

**Acceptance Scenarios**:

1. **Given** que un libro aparece en la página principal, **When** lo selecciono, **Then** veo su detalle, incluido el título y si está pendiente o leído.
2. **Given** que estoy en el detalle de un libro pendiente, **When** lo marco como leído, **Then** el detalle muestra el nuevo estado y el libro aparece en el grupo de leídos en la página principal.
3. **Given** que estoy en el detalle de un libro leído, **When** lo marco como pendiente, **Then** el detalle muestra el nuevo estado y el libro aparece en el grupo de pendientes en la página principal.

---

### User Story 3 - Eliminar un libro (Priority: P3)

Como lector, quiero eliminar de mi lista un libro que ya no quiero seguir, para mantenerla relevante.

**Why this priority**: La eliminación permite corregir o depurar la lista, aunque no es necesaria para comenzar a registrar lecturas.

**Independent Test**: Se puede eliminar un libro desde su detalle y comprobar que ya no aparece en la lista.

**Acceptance Scenarios**:

1. **Given** que estoy en el detalle de un libro guardado, **When** confirmo su eliminación, **Then** el libro se elimina de la lista y regreso a la página principal.
2. **Given** que se solicita confirmar la eliminación, **When** cancelo la acción, **Then** el libro permanece guardado y no cambia su estado.

### Edge Cases

- Si un libro deja de existir mientras se muestra su detalle, la aplicación informa que no está disponible y ofrece volver a la página principal.
- Si el título contiene solo espacios, se trata como vacío y no se permite guardar el libro.
- Si el navegador no permite guardar los datos o se alcanza su límite de almacenamiento, la aplicación informa del error y no muestra el cambio como guardado.
- Si la aplicación no puede recuperar la lista, informa del error en lugar de mostrar una lista vacía como si no hubiera libros.
- Si la imagen de portada seleccionada mide 2 MB o más, se omite la imagen, se guarda el libro sin ella y se informa al usuario.
- Cuando cambia el estado de un libro, la lista vuelve a agruparlo correctamente: pendientes antes de leídos.
- Si se elimina el último libro, la página principal muestra el estado vacío y la opción de añadir un libro.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La aplicación MUST permitir añadir un libro desde la página principal.
- **FR-002**: Cada libro MUST tener un título no vacío; el formulario MUST rechazar títulos vacíos o compuestos únicamente por espacios e indicar el motivo.
- **FR-003**: La aplicación MUST permitir registrar el nombre del autor como dato opcional.
- **FR-004**: La aplicación MUST asignar a cada libro nuevo el estado pendiente.
- **FR-005**: La página principal MUST mostrar todos los libros guardados, agrupando primero los pendientes y después los leídos.
- **FR-006**: La aplicación MUST permitir abrir el detalle de un libro desde la página principal y mostrar su título, autor si está disponible y estado.
- **FR-007**: Desde el detalle, el usuario MUST poder cambiar un libro entre pendiente y leído; el cambio MUST reflejarse también en la página principal.
- **FR-008**: Desde el detalle, el usuario MUST poder solicitar la eliminación de un libro y confirmar o cancelar esa acción.
- **FR-009**: Tras confirmar la eliminación, la aplicación MUST quitar el libro de la lista y mostrar la página principal.
- **FR-010**: La aplicación MUST conservar los libros, sus estados y sus imágenes de portada entre visitas posteriores en el mismo navegador y origen local.
- **FR-011**: Si no hay libros, la página principal MUST mostrar un estado vacío con una opción para añadir uno.
- **FR-012**: Si ocurre un error al guardar o recuperar libros, la aplicación MUST informar al usuario y MUST NOT indicar que una operación fallida se completó correctamente.
- **FR-013**: La aplicación MUST funcionar localmente, sin requerir cuentas ni componentes de servidor o servicios remotos, y MUST poder utilizarse sin conexión de red.
- **FR-014**: La aplicación MUST permitir adjuntar una imagen de portada opcional a un libro. Si el archivo de imagen mide menos de 2 MB, MUST conservarlo codificado en Base64; si mide 2 MB o más, MUST guardar el libro sin imagen e informar al usuario.

### Key Entities

- **Libro**: Elemento de la lista de lectura. Tiene un título obligatorio, un autor opcional, un estado que indica si está pendiente o leído y una imagen de portada opcional.
- **Estado de lectura**: Clasificación de un libro como pendiente o leído; determina el grupo en que aparece en la página principal.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: En una prueba de aceptación, el usuario puede añadir un libro con título y encontrarlo en la página principal en no más de 3 acciones principales.
- **SC-002**: En todos los casos de prueba con libros pendientes y leídos, el 100 % de los pendientes aparece antes que cualquier libro leído.
- **SC-003**: En todos los casos de prueba, cambiar el estado desde el detalle actualiza correctamente el estado mostrado y el grupo correspondiente en la página principal.
- **SC-004**: En todos los casos de prueba, cada libro confirmado como eliminado deja de aparecer en la lista; los intentos cancelados no eliminan el libro.
- **SC-005**: En una prueba de aceptación con al menos un libro, el 100 % de los libros y estados guardados siguen disponibles al volver a abrir la aplicación en el mismo navegador y origen local.
- **SC-006**: En las pruebas de operaciones correctas, los usuarios pueden completar las tareas de añadir, cambiar estado y eliminar sin ayuda externa.
- **SC-007**: En las pruebas de portadas, las imágenes menores de 2 MB se conservan y las imágenes de 2 MB o más se omiten mientras el libro se guarda con una notificación clara.

## Assumptions

- La aplicación está destinada a una sola persona en un navegador local; no necesita perfiles ni compartir listas.
- Un título identifica visualmente un libro, pero no se impide añadir varias entradas con el mismo título.
- El autor y la imagen de portada son opcionales; no se solicitan ISBN, reseñas, notas ni fechas de lectura en esta función.
- El límite de 2 MB se mide sobre el archivo de imagen seleccionado antes de codificarlo en Base64.
- Los libros pendientes se muestran en el orden en que fueron añadidos; los leídos también conservan ese orden. No se requiere ordenar ni buscar la lista.
- La eliminación requiere confirmación para reducir pérdidas accidentales; cancelar conserva el libro sin cambios.
- Los datos están asociados al navegador y al origen local utilizados. Pueden dejar de estar disponibles si se borran los datos del navegador y no se sincronizan ni se comparten.
- Si el guardado falla, la aplicación comunica el problema y no presenta como persistido el cambio que no pudo conservarse.
