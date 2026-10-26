# Feature Specification: Seguimiento de libros leÃ­dos

**Feature Branch**: `001-book-reading-tracker`

**Created**: 2026-10-25

**Status**: Completed

**Input**: User description: "Bookify es una aplicaciÃ³n de seguimiento de libros leidos y por leer. El usuario podrÃ¡ guardar libros y marcar si los ha leido o no. En la home se tendrÃ¡ la lista de libros apareciendo primero los libros no leidos y luego los leidos. Al hacer click en un libro debe aparecer la pÃ¡gina de detalle del libro desde donde se pondrÃ¡ cambiar su estado a leido o no leido o eliminarlo. Desde la home se podrÃ¡ aÃ±adir un nuevo libro."

## Clarifications

### Session 2026-10-25

- Q: Â¿Debe Bookify permitir una imagen de portada opcional, guardarla en Base64 con lÃ­mite menor a 2 MB y guardar el libro sin imagen si excede el lÃ­mite? â†’ A: SÃ­. La portada es opcional; se conserva codificada en Base64 si el archivo mide menos de 2 MB. Si mide 2 MB o mÃ¡s, el libro se guarda sin imagen.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - AÃ±adir y consultar libros (Priority: P1)

Como lector, quiero guardar libros y verlos en la pÃ¡gina principal, para tener una lista sencilla de mis lecturas pendientes y completadas.

**Why this priority**: Crear y consultar la lista es el propÃ³sito central de Bookify y permite empezar a organizar lecturas.

**Independent Test**: Se puede aÃ±adir un libro con tÃ­tulo, volver a la pÃ¡gina principal y comprobar que aparece en la lista con estado pendiente.

**Acceptance Scenarios**:

1. **Given** que estoy en la pÃ¡gina principal, **When** aÃ±ado un libro con un tÃ­tulo vÃ¡lido, **Then** el libro queda guardado como pendiente y aparece en la lista.
2. **Given** que no hay libros guardados, **When** abro la pÃ¡gina principal, **Then** veo un estado vacÃ­o que explica que aÃºn no hay libros y ofrece la opciÃ³n de aÃ±adir uno.
3. **Given** que hay libros guardados, **When** abro la pÃ¡gina principal, **Then** veo primero todos los libros pendientes y despuÃ©s todos los leÃ­dos.
4. **Given** que intento aÃ±adir un libro sin tÃ­tulo, **When** confirmo el formulario, **Then** el libro no se guarda y se me indica que el tÃ­tulo es obligatorio.
5. **Given** que aÃ±ado un libro con tÃ­tulo y autor, **When** se guarda correctamente, **Then** ambos datos aparecen en su detalle.
6. **Given** que he guardado libros, **When** vuelvo a abrir la aplicaciÃ³n en el mismo navegador y origen local, **Then** los libros y sus estados siguen disponibles.
7. **Given** que selecciono una imagen de portada de menos de 2 MB, **When** guardo el libro, **Then** la portada se conserva y aparece en su detalle.
8. **Given** que selecciono una imagen de portada de 2 MB o mÃ¡s, **When** guardo el libro, **Then** el libro se guarda sin imagen y se me informa de que la portada superÃ³ el lÃ­mite.

---

### User Story 2 - Consultar y cambiar el estado de un libro (Priority: P2)

Como lector, quiero abrir el detalle de un libro y cambiar si lo he leÃ­do, para mantener actualizada mi lista.

**Why this priority**: El cambio de estado hace que la lista refleje el progreso de lectura y mantenga su orden por estado.

**Independent Test**: Se puede abrir un libro desde la lista, cambiar su estado y comprobar que el nuevo estado se muestra en el detalle y en la lista.

**Acceptance Scenarios**:

1. **Given** que un libro aparece en la pÃ¡gina principal, **When** lo selecciono, **Then** veo su detalle, incluido el tÃ­tulo y si estÃ¡ pendiente o leÃ­do.
2. **Given** que estoy en el detalle de un libro pendiente, **When** lo marco como leÃ­do, **Then** el detalle muestra el nuevo estado y el libro aparece en el grupo de leÃ­dos en la pÃ¡gina principal.
3. **Given** que estoy en el detalle de un libro leÃ­do, **When** lo marco como pendiente, **Then** el detalle muestra el nuevo estado y el libro aparece en el grupo de pendientes en la pÃ¡gina principal.

---

### User Story 3 - Eliminar un libro (Priority: P3)

Como lector, quiero eliminar de mi lista un libro que ya no quiero seguir, para mantenerla relevante.

**Why this priority**: La eliminaciÃ³n permite corregir o depurar la lista, aunque no es necesaria para comenzar a registrar lecturas.

**Independent Test**: Se puede eliminar un libro desde su detalle y comprobar que ya no aparece en la lista.

**Acceptance Scenarios**:

1. **Given** que estoy en el detalle de un libro guardado, **When** confirmo su eliminaciÃ³n, **Then** el libro se elimina de la lista y regreso a la pÃ¡gina principal.
2. **Given** que se solicita confirmar la eliminaciÃ³n, **When** cancelo la acciÃ³n, **Then** el libro permanece guardado y no cambia su estado.

### Edge Cases

- Si un libro deja de existir mientras se muestra su detalle, la aplicaciÃ³n informa que no estÃ¡ disponible y ofrece volver a la pÃ¡gina principal.
- Si el tÃ­tulo contiene solo espacios, se trata como vacÃ­o y no se permite guardar el libro.
- Si el navegador no permite guardar los datos o se alcanza su lÃ­mite de almacenamiento, la aplicaciÃ³n informa del error y no muestra el cambio como guardado.
- Si la aplicaciÃ³n no puede recuperar la lista, informa del error en lugar de mostrar una lista vacÃ­a como si no hubiera libros.
- Si la imagen de portada seleccionada mide 2 MB o mÃ¡s, se omite la imagen, se guarda el libro sin ella y se informa al usuario.
- Cuando cambia el estado de un libro, la lista vuelve a agruparlo correctamente: pendientes antes de leÃ­dos.
- Si se elimina el Ãºltimo libro, la pÃ¡gina principal muestra el estado vacÃ­o y la opciÃ³n de aÃ±adir un libro.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La aplicaciÃ³n MUST permitir aÃ±adir un libro desde la pÃ¡gina principal.
- **FR-002**: Cada libro MUST tener un tÃ­tulo no vacÃ­o; el formulario MUST rechazar tÃ­tulos vacÃ­os o compuestos Ãºnicamente por espacios e indicar el motivo.
- **FR-003**: La aplicaciÃ³n MUST permitir registrar el nombre del autor como dato opcional.
- **FR-004**: La aplicaciÃ³n MUST asignar a cada libro nuevo el estado pendiente.
- **FR-005**: La pÃ¡gina principal MUST mostrar todos los libros guardados, agrupando primero los pendientes y despuÃ©s los leÃ­dos.
- **FR-006**: La aplicaciÃ³n MUST permitir abrir el detalle de un libro desde la pÃ¡gina principal y mostrar su tÃ­tulo, autor si estÃ¡ disponible y estado.
- **FR-007**: Desde el detalle, el usuario MUST poder cambiar un libro entre pendiente y leÃ­do; el cambio MUST reflejarse tambiÃ©n en la pÃ¡gina principal.
- **FR-008**: Desde el detalle, el usuario MUST poder solicitar la eliminaciÃ³n de un libro y confirmar o cancelar esa acciÃ³n.
- **FR-009**: Tras confirmar la eliminaciÃ³n, la aplicaciÃ³n MUST quitar el libro de la lista y mostrar la pÃ¡gina principal.
- **FR-010**: La aplicaciÃ³n MUST conservar los libros, sus estados y sus imÃ¡genes de portada entre visitas posteriores en el mismo navegador y origen local.
- **FR-011**: Si no hay libros, la pÃ¡gina principal MUST mostrar un estado vacÃ­o con una opciÃ³n para aÃ±adir uno.
- **FR-012**: Si ocurre un error al guardar o recuperar libros, la aplicaciÃ³n MUST informar al usuario y MUST NOT indicar que una operaciÃ³n fallida se completÃ³ correctamente.
- **FR-013**: La aplicaciÃ³n MUST funcionar localmente, sin requerir cuentas ni componentes de servidor o servicios remotos, y MUST poder utilizarse sin conexiÃ³n de red.
- **FR-014**: La aplicaciÃ³n MUST permitir adjuntar una imagen de portada opcional a un libro. Si el archivo de imagen mide menos de 2 MB, MUST conservarlo codificado en Base64; si mide 2 MB o mÃ¡s, MUST guardar el libro sin imagen e informar al usuario.

### Key Entities

- **Libro**: Elemento de la lista de lectura. Tiene un tÃ­tulo obligatorio, un autor opcional, un estado que indica si estÃ¡ pendiente o leÃ­do y una imagen de portada opcional.
- **Estado de lectura**: ClasificaciÃ³n de un libro como pendiente o leÃ­do; determina el grupo en que aparece en la pÃ¡gina principal.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: En una prueba de aceptaciÃ³n, el usuario puede aÃ±adir un libro con tÃ­tulo y encontrarlo en la pÃ¡gina principal en no mÃ¡s de 3 acciones principales.
- **SC-002**: En todos los casos de prueba con libros pendientes y leÃ­dos, el 100 % de los pendientes aparece antes que cualquier libro leÃ­do.
- **SC-003**: En todos los casos de prueba, cambiar el estado desde el detalle actualiza correctamente el estado mostrado y el grupo correspondiente en la pÃ¡gina principal.
- **SC-004**: En todos los casos de prueba, cada libro confirmado como eliminado deja de aparecer en la lista; los intentos cancelados no eliminan el libro.
- **SC-005**: En una prueba de aceptaciÃ³n con al menos un libro, el 100 % de los libros y estados guardados siguen disponibles al volver a abrir la aplicaciÃ³n en el mismo navegador y origen local.
- **SC-006**: En las pruebas de operaciones correctas, los usuarios pueden completar las tareas de aÃ±adir, cambiar estado y eliminar sin ayuda externa.
- **SC-007**: En las pruebas de portadas, las imÃ¡genes menores de 2 MB se conservan y las imÃ¡genes de 2 MB o mÃ¡s se omiten mientras el libro se guarda con una notificaciÃ³n clara.

## Assumptions

- La aplicaciÃ³n estÃ¡ destinada a una sola persona en un navegador local; no necesita perfiles ni compartir listas.
- Un tÃ­tulo identifica visualmente un libro, pero no se impide aÃ±adir varias entradas con el mismo tÃ­tulo.
- El autor y la imagen de portada son opcionales; no se solicitan ISBN, reseÃ±as, notas ni fechas de lectura en esta funciÃ³n.
- El lÃ­mite de 2 MB se mide sobre el archivo de imagen seleccionado antes de codificarlo en Base64.
- Los libros pendientes se muestran en el orden en que fueron aÃ±adidos; los leÃ­dos tambiÃ©n conservan ese orden. No se requiere ordenar ni buscar la lista.
- La eliminaciÃ³n requiere confirmaciÃ³n para reducir pÃ©rdidas accidentales; cancelar conserva el libro sin cambios.
- Los datos estÃ¡n asociados al navegador y al origen local utilizados. Pueden dejar de estar disponibles si se borran los datos del navegador y no se sincronizan ni se comparten.
- Si el guardado falla, la aplicaciÃ³n comunica el problema y no presenta como persistido el cambio que no pudo conservarse.

