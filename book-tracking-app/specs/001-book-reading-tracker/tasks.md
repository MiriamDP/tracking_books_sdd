---

description: "Tareas de implementación de Bookify"
---

# Tasks: Seguimiento de libros leídos

**Input**: Documentos de diseño de `/specs/001-book-reading-tracker/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md),
[data-model.md](./data-model.md), [contracts/ui-contract.md](./contracts/ui-contract.md)

**Organization**: Las tareas están agrupadas por historia de usuario y siguen las prioridades
P1, P2 y P3 de la especificación. Las tareas de pruebas automatizadas no implementan las pruebas
en este momento: describen el trabajo posterior necesario para verificar el plan, la constitución
y los criterios de éxito.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Crear la estructura mínima de una aplicación web estática sin dependencias de
ejecución, backend ni API.

- [ ] T001 Crear la estructura de proyecto `index.html`, `src/`, `src/model/`, `src/persistence/`, `src/views/`, `tests/unit/` y `tests/acceptance/` según `specs/001-book-reading-tracker/plan.md`
- [ ] T002 [P] Crear `index.html` con el contenedor principal de Bookify, carga del módulo `src/app.js` y metadatos básicos de una aplicación local
- [ ] T003 [P] Crear `src/styles.css` con estilos base accesibles para encabezado, tarjetas, formularios, estado vacío, mensajes y acciones

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implementar el modelo y la persistencia compartidos que todas las historias
necesitan. Ninguna historia puede completarse antes de esta fase.

- [ ] T004 Implementar `src/model/book.js` con la entidad Libro y sus campos `id`, `title`, `author`, `status`, `coverDataUrl` y `createdAt`, validando que el título tras aplicar `trim()` no esté vacío y que `status` solo sea `"pending"` o `"read"`
- [ ] T005 Implementar en `src/model/book.js` la creación de libros nuevos con estado `"pending"`, autor opcional normalizado, portada opcional y fecha ISO de creación
- [ ] T006 Implementar en `src/model/book.js` la agrupación de libros con todos los `"pending"` antes que los `"read"`, conservando el orden ascendente de `createdAt` y usando `id` como desempate determinista
- [ ] T007 Implementar `src/persistence/book-repository.js` con una clave privada de `localStorage`, documento JSON versionado `{ "version": 1, "books": [] }`, lectura que distinga lista vacía de error y escritura que vuelva a leer y verifique el valor guardado
- [ ] T008 Implementar en `src/persistence/book-repository.js` errores explícitos para acceso bloqueado, JSON inválido, cuota excedida y escritura fallida, sin devolver una colección vacía ni confirmar un cambio no persistido
- [ ] T009 Implementar en `src/persistence/book-repository.js` operaciones de añadir, actualizar estado y eliminar por `id`, preservando la colección sin relaciones y sin persistir un estado `"deleted"`

**Checkpoint**: El modelo y el repositorio están listos para que las historias de usuario se
implementen sin introducir almacenamiento alternativo, API o lógica de servidor.

---

## Phase 3: User Story 1 - Añadir y consultar libros (Priority: P1) 🎯 MVP

**Goal**: Permitir añadir libros desde el inicio y consultar la colección agrupada, con
persistencia local y portadas opcionales.

**Independent Test**: Desde una colección vacía, añadir un título válido y comprobar que aparece
como pendiente; añadir autor y portada válida y comprobar el detalle; recargar en el mismo origen
y verificar que libros, estados y portada continúan disponibles; intentar título vacío y portada
de al menos 2 MiB y comprobar los mensajes requeridos.

- [ ] T010 [US1] Implementar `src/views/home-view.js` para leer el repositorio, renderizar el estado vacío con acción de alta y mostrar las secciones Pendientes y Leídos en ese orden
- [ ] T011 [US1] Implementar en `src/views/home-view.js` tarjetas de libro que muestren título, autor cuando exista y estado, y permitan seleccionar un libro para abrir su detalle
- [ ] T012 [US1] Implementar en `src/views/home-view.js` el formulario de alta con título obligatorio, autor opcional, selector de portada y mensajes de validación visibles
- [ ] T013 [US1] Implementar en `src/views/home-view.js` la validación del título vacío o compuesto solo por espacios, evitando llamar al repositorio y mostrando que el título es obligatorio
- [ ] T014 [US1] Implementar en `src/views/home-view.js` la lectura de portada con `FileReader`, conservando como `coverDataUrl` los archivos cuyo tamaño original sea menor de `2 MiB (2 * 1024 * 1024 bytes)` y omitiendo los de tamaño igual o superior con una notificación clara
- [ ] T015 [US1] Integrar `src/views/home-view.js` con `src/model/book.js` y `src/persistence/book-repository.js` para guardar el libro como `"pending"`, mostrar errores de lectura/escritura sin falsos éxitos y volver a renderizar solo después de confirmar la persistencia
- [ ] T016 [US1] Implementar `src/views/detail-view.js` para mostrar título, autor, estado y `coverDataUrl` cuando exista, y mostrar un mensaje de libro no disponible con enlace al inicio cuando el `id` no exista
- [ ] T017 [US1] Implementar `src/app.js` para inicializar Bookify, seleccionar la vista de inicio o detalle mediante navegación local y manejar errores iniciales del repositorio como mensajes visibles en vez de estado vacío

**Checkpoint**: La historia P1 funciona de forma independiente: alta, consulta, agrupación,
persistencia local, validación de título y tratamiento de portadas.

---

## Phase 4: User Story 2 - Consultar y cambiar el estado de un libro (Priority: P2)

**Goal**: Permitir alternar un libro entre pendiente y leído desde su detalle y reflejar el
cambio en la agrupación de la página principal.

**Independent Test**: Abrir un libro pendiente, marcarlo como leído, volver al inicio y comprobar
que está en Leídos; repetir desde Leídos a Pendientes y comprobar el orden de agrupación tras
recargar.

- [ ] T018 [US2] Implementar en `src/views/detail-view.js` la acción para alternar `status` entre `"pending"` y `"read"` usando solo los valores permitidos por el modelo
- [ ] T019 [US2] Integrar en `src/views/detail-view.js` la actualización mediante `book-repository.js`, mostrando el nuevo estado solo después de confirmar la escritura y mostrando un error visible si falla
- [ ] T020 [US2] Integrar en `src/app.js` la navegación de retorno al inicio después de cambiar el estado y la recarga de la colección mediante `home-view.js` para que pendientes precedan a leídos
- [ ] T021 [US2] Revisar `src/styles.css` para diferenciar visualmente los estados Pendientes y Leídos sin depender de servicios externos ni alterar el orden semántico de las secciones

**Checkpoint**: Las historias P1 y P2 funcionan: el estado cambia desde el detalle y la lista
persiste y reagrupa correctamente.

---

## Phase 5: User Story 3 - Eliminar un libro (Priority: P3)

**Goal**: Permitir solicitar la eliminación desde el detalle, confirmarla o cancelarla, y volver
al inicio tras una eliminación confirmada.

**Independent Test**: Abrir un libro, cancelar la confirmación y comprobar que permanece; abrirlo
de nuevo, confirmar la eliminación y comprobar que desaparece y que el último libro deja el estado
vacío.

- [ ] T022 [US3] Implementar en `src/views/detail-view.js` la acción Eliminar con confirmación explícita antes de llamar al repositorio y sin modificar el libro cuando el usuario cancela
- [ ] T023 [US3] Integrar en `src/views/detail-view.js` la eliminación confirmada por `id` mediante `book-repository.js`, mostrando un error visible y manteniendo el detalle si la escritura falla
- [ ] T024 [US3] Integrar en `src/app.js` el retorno a la página principal después de una eliminación confirmada y la renderización del estado vacío cuando ya no queden libros

**Checkpoint**: Las tres historias de usuario están implementadas y cada una conserva el
comportamiento de las anteriores.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verificar cumplimiento constitucional, accesibilidad, documentación y criterios de
aceptación sin añadir complejidad arquitectónica.

- [ ] T025 [P] Añadir en `index.html` y `src/views/home-view.js` el aviso visible de que los datos pertenecen al navegador y origen local, pueden perderse al borrar los datos y no están protegidos por autenticación
- [ ] T026 [P] Revisar `src/views/home-view.js` y `src/views/detail-view.js` para etiquetas accesibles, foco de formularios, mensajes perceptibles y navegación por teclado
- [ ] T027 [P] Revisar `src/app.js`, `src/model/book.js` y `src/persistence/book-repository.js` para confirmar que no existen llamadas de red, endpoints, backend, autenticación ni almacenamiento distinto de `localStorage`
- [ ] T028 Ejecutar manualmente los escenarios de `specs/001-book-reading-tracker/quickstart.md` usando un origen local estable y verificar explícitamente SC-001 (alta en no más de 3 acciones), SC-002 (pendientes antes que leídos), SC-003 (cambio de estado), SC-004 (eliminación y cancelación), SC-005 (persistencia), SC-006 (flujos sin ayuda) y SC-007 (límite de portadas), registrando cualquier incumplimiento antes de considerar terminada la implementación
- [ ] T029 Revisar `src/model/book.js`, `src/persistence/book-repository.js`, `src/views/home-view.js` y `src/views/detail-view.js` contra `specs/001-book-reading-tracker/data-model.md` y `specs/001-book-reading-tracker/contracts/ui-contract.md`, corrigiendo solo desviaciones relacionadas con esta funcionalidad
- [ ] T030 [P] Crear pruebas unitarias en `tests/unit/book.test.js` para validación de título, estado inicial `"pending"`, campos opcionales, agrupación estable y transición permitida entre `"pending"` y `"read"`
- [ ] T031 [P] Crear pruebas unitarias en `tests/unit/book-repository.test.js` para lectura vacía, serialización versionada, persistencia mediante `localStorage`, verificación posterior a escritura, JSON inválido, acceso bloqueado, cuota excedida y ausencia de falsos éxitos
- [ ] T032 Crear pruebas de aceptación en `tests/acceptance/book-tracker.spec.js` para US1 y verificar SC-001 (alta en no más de 3 acciones), SC-002 (orden de grupos), SC-005 (recarga en el mismo origen) y SC-007 (portada menor de 2 MiB conservada y portada de 2 MiB o mayor omitida con aviso)
- [ ] T033 Crear pruebas de aceptación en `tests/acceptance/book-tracker.spec.js` para US2 y verificar SC-003 al cambiar un libro de pendiente a leído y de leído a pendiente, incluyendo el estado mostrado y la agrupación resultante
- [ ] T034 Crear pruebas de aceptación en `tests/acceptance/book-tracker.spec.js` para US3 y verificar SC-004 al cancelar y confirmar la eliminación, incluido el estado vacío tras eliminar el último libro
- [ ] T035 Crear pruebas de aceptación en `tests/acceptance/book-tracker.spec.js` para SC-006 y FR-012, verificando que los flujos correctos se completan sin ayuda y que los errores de lectura/escritura se muestran sin presentar operaciones fallidas como guardadas

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No depende de otras fases; T002 y T003 pueden ejecutarse en paralelo tras
  crear la estructura de T001.
- **Foundational (Phase 2)**: Depende de T001; T004-T006 pueden avanzar en paralelo con T007-T008,
  y T009 depende de T007.
- **User Stories (Phases 3-5)**: Dependen de toda la Phase 2. Se recomienda completar P1 antes
  de P2 y P3 porque P2 y P3 integran la navegación y detalle creados en P1.
- **Polish (Phase 6)**: Depende de las historias que se quieran entregar; T025-T027 pueden
  ejecutarse en paralelo, y T028-T029 deben ejecutarse después de la implementación.

### User Story Dependencies

- **US1 (P1)**: Puede comenzar después de Phase 2; es el MVP y no depende de otra historia.
- **US2 (P2)**: Depende de las vistas y navegación de US1 para reutilizar el detalle y la lista,
  aunque sus reglas de estado se apoyan en el modelo fundacional.
- **US3 (P3)**: Depende del detalle y navegación implementados para US1/US2; añade únicamente la
  operación de eliminación y su confirmación.

### Parallel Opportunities

- T002 y T003 pueden ejecutarse en paralelo.
- T004-T006 y T007-T008 pueden ejecutarse en paralelo; T009 espera a T007.
- En US1, las tareas T010-T016 modifican archivos compartidos o dependen del mismo flujo de vista y deben ejecutarse secuencialmente o coordinarse explícitamente; T015 espera al modelo y repositorio.
- En Phase 6, T025-T027 son independientes entre sí.
- T030 y T031 pueden ejecutarse en paralelo porque modifican archivos de prueba distintos. T032-T035 modifican el mismo archivo de aceptación y deben ejecutarse secuencialmente o consolidarse en una única edición coordinada.

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1 y Phase 2.
2. Completar Phase 3 (US1).
3. Ejecutar el escenario independiente de US1 y los escenarios de persistencia y portadas del
   `quickstart.md`.
4. Entregar el MVP antes de iniciar cambio de estado o eliminación.

### Incremental Delivery

1. Añadir US2 y verificar que no rompe alta, consulta ni persistencia.
2. Añadir US3 y verificar confirmación, cancelación y estado vacío.
3. Completar Phase 6 y repetir la guía completa.

## Traceability Summary

- **US1**: FR-001 a FR-006, FR-010 a FR-014; contrato de inicio y formulario.
- **US2**: FR-007, FR-010, FR-012; contrato de detalle y agrupación.
- **US3**: FR-008, FR-009, FR-011, FR-012; contrato de eliminación y estado vacío.
- **Constitución**: T007-T008 y T025-T027 cubren persistencia local, errores visibles,
  funcionamiento sin red y ausencia de autenticación.
