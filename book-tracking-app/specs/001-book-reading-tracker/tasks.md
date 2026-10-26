---

description: "Tareas de implementaciÃ³n de Bookify"
---

# Tasks: Seguimiento de libros leÃ­dos

**Input**: Documentos de diseÃ±o de `/specs/001-book-reading-tracker/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md),
[data-model.md](./data-model.md), [contracts/ui-contract.md](./contracts/ui-contract.md)

**Organization**: Las tareas estÃ¡n agrupadas por historia de usuario y siguen las prioridades
P1, P2 y P3 de la especificaciÃ³n. Las tareas de pruebas automatizadas no implementan las pruebas
en este momento: describen el trabajo posterior necesario para verificar el plan, la constituciÃ³n
y los criterios de Ã©xito.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Crear la estructura mÃ­nima de una aplicaciÃ³n web estÃ¡tica sin dependencias de
ejecuciÃ³n, backend ni API.

- [x] T001 Crear la estructura de proyecto `index.html`, `src/`, `src/model/`, `src/persistence/`, `src/views/`, `tests/unit/` y `tests/acceptance/` segÃºn `specs/001-book-reading-tracker/plan.md`
- [x] T002 [P] Crear `index.html` con el contenedor principal de Bookify, carga del mÃ³dulo `src/app.js` y metadatos bÃ¡sicos de una aplicaciÃ³n local
- [x] T003 [P] Crear `src/styles.css` con estilos base accesibles para encabezado, tarjetas, formularios, estado vacÃ­o, mensajes y acciones

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implementar el modelo y la persistencia compartidos que todas las historias
necesitan. Ninguna historia puede completarse antes de esta fase.

- [x] T004 Implementar `src/model/book.js` con la entidad Libro y sus campos `id`, `title`, `author`, `status`, `coverDataUrl` y `createdAt`, validando que el tÃ­tulo tras aplicar `trim()` no estÃ© vacÃ­o y que `status` solo sea `"pending"` o `"read"`
- [x] T005 Implementar en `src/model/book.js` la creaciÃ³n de libros nuevos con estado `"pending"`, autor opcional normalizado, portada opcional y fecha ISO de creaciÃ³n
- [x] T006 Implementar en `src/model/book.js` la agrupaciÃ³n de libros con todos los `"pending"` antes que los `"read"`, conservando el orden ascendente de `createdAt` y usando `id` como desempate determinista
- [x] T007 Implementar `src/persistence/book-repository.js` con una clave privada de `localStorage`, documento JSON versionado `{ "version": 1, "books": [] }`, lectura que distinga lista vacÃ­a de error y escritura que vuelva a leer y verifique el valor guardado
- [x] T008 Implementar en `src/persistence/book-repository.js` errores explÃ­citos para acceso bloqueado, JSON invÃ¡lido, cuota excedida y escritura fallida, sin devolver una colecciÃ³n vacÃ­a ni confirmar un cambio no persistido
- [x] T009 Implementar en `src/persistence/book-repository.js` operaciones de aÃ±adir, actualizar estado y eliminar por `id`, preservando la colecciÃ³n sin relaciones y sin persistir un estado `"deleted"`

**Checkpoint**: El modelo y el repositorio estÃ¡n listos para que las historias de usuario se
implementen sin introducir almacenamiento alternativo, API o lÃ³gica de servidor.

---

## Phase 3: User Story 1 - AÃ±adir y consultar libros (Priority: P1) ðŸŽ¯ MVP

**Goal**: Permitir aÃ±adir libros desde el inicio y consultar la colecciÃ³n agrupada, con
persistencia local y portadas opcionales.

**Independent Test**: Desde una colecciÃ³n vacÃ­a, aÃ±adir un tÃ­tulo vÃ¡lido y comprobar que aparece
como pendiente; aÃ±adir autor y portada vÃ¡lida y comprobar el detalle; recargar en el mismo origen
y verificar que libros, estados y portada continÃºan disponibles; intentar tÃ­tulo vacÃ­o y portada
de al menos 2 MiB y comprobar los mensajes requeridos.

- [x] T010 [US1] Implementar `src/views/home-view.js` para leer el repositorio, renderizar el estado vacÃ­o con acciÃ³n de alta y mostrar las secciones Pendientes y LeÃ­dos en ese orden
- [x] T011 [US1] Implementar en `src/views/home-view.js` tarjetas de libro que muestren tÃ­tulo, autor cuando exista y estado, y permitan seleccionar un libro para abrir su detalle
- [x] T012 [US1] Implementar en `src/views/home-view.js` el formulario de alta con tÃ­tulo obligatorio, autor opcional, selector de portada y mensajes de validaciÃ³n visibles
- [x] T013 [US1] Implementar en `src/views/home-view.js` la validaciÃ³n del tÃ­tulo vacÃ­o o compuesto solo por espacios, evitando llamar al repositorio y mostrando que el tÃ­tulo es obligatorio
- [x] T014 [US1] Implementar en `src/views/home-view.js` la lectura de portada con `FileReader`, conservando como `coverDataUrl` los archivos cuyo tamaÃ±o original sea menor de `2 MiB (2 * 1024 * 1024 bytes)` y omitiendo los de tamaÃ±o igual o superior con una notificaciÃ³n clara
- [x] T015 [US1] Integrar `src/views/home-view.js` con `src/model/book.js` y `src/persistence/book-repository.js` para guardar el libro como `"pending"`, mostrar errores de lectura/escritura sin falsos Ã©xitos y volver a renderizar solo despuÃ©s de confirmar la persistencia
- [x] T016 [US1] Implementar `src/views/detail-view.js` para mostrar tÃ­tulo, autor, estado y `coverDataUrl` cuando exista, y mostrar un mensaje de libro no disponible con enlace al inicio cuando el `id` no exista
- [x] T017 [US1] Implementar `src/app.js` para inicializar Bookify, seleccionar la vista de inicio o detalle mediante navegaciÃ³n local y manejar errores iniciales del repositorio como mensajes visibles en vez de estado vacÃ­o

**Checkpoint**: La historia P1 funciona de forma independiente: alta, consulta, agrupaciÃ³n,
persistencia local, validaciÃ³n de tÃ­tulo y tratamiento de portadas.

---

## Phase 4: User Story 2 - Consultar y cambiar el estado de un libro (Priority: P2)

**Goal**: Permitir alternar un libro entre pendiente y leÃ­do desde su detalle y reflejar el
cambio en la agrupaciÃ³n de la pÃ¡gina principal.

**Independent Test**: Abrir un libro pendiente, marcarlo como leÃ­do, volver al inicio y comprobar
que estÃ¡ en LeÃ­dos; repetir desde LeÃ­dos a Pendientes y comprobar el orden de agrupaciÃ³n tras
recargar.

- [x] T018 [US2] Implementar en `src/views/detail-view.js` la acciÃ³n para alternar `status` entre `"pending"` y `"read"` usando solo los valores permitidos por el modelo
- [x] T019 [US2] Integrar en `src/views/detail-view.js` la actualizaciÃ³n mediante `book-repository.js`, mostrando el nuevo estado solo despuÃ©s de confirmar la escritura y mostrando un error visible si falla
- [x] T020 [US2] Integrar en `src/app.js` la navegaciÃ³n de retorno al inicio despuÃ©s de cambiar el estado y la recarga de la colecciÃ³n mediante `home-view.js` para que pendientes precedan a leÃ­dos
- [x] T021 [US2] Revisar `src/styles.css` para diferenciar visualmente los estados Pendientes y LeÃ­dos sin depender de servicios externos ni alterar el orden semÃ¡ntico de las secciones

**Checkpoint**: Las historias P1 y P2 funcionan: el estado cambia desde el detalle y la lista
persiste y reagrupa correctamente.

---

## Phase 5: User Story 3 - Eliminar un libro (Priority: P3)

**Goal**: Permitir solicitar la eliminaciÃ³n desde el detalle, confirmarla o cancelarla, y volver
al inicio tras una eliminaciÃ³n confirmada.

**Independent Test**: Abrir un libro, cancelar la confirmaciÃ³n y comprobar que permanece; abrirlo
de nuevo, confirmar la eliminaciÃ³n y comprobar que desaparece y que el Ãºltimo libro deja el estado
vacÃ­o.

- [x] T022 [US3] Implementar en `src/views/detail-view.js` la acciÃ³n Eliminar con confirmaciÃ³n explÃ­cita antes de llamar al repositorio y sin modificar el libro cuando el usuario cancela
- [x] T023 [US3] Integrar en `src/views/detail-view.js` la eliminaciÃ³n confirmada por `id` mediante `book-repository.js`, mostrando un error visible y manteniendo el detalle si la escritura falla
- [x] T024 [US3] Integrar en `src/app.js` el retorno a la pÃ¡gina principal despuÃ©s de una eliminaciÃ³n confirmada y la renderizaciÃ³n del estado vacÃ­o cuando ya no queden libros

**Checkpoint**: Las tres historias de usuario estÃ¡n implementadas y cada una conserva el
comportamiento de las anteriores.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verificar cumplimiento constitucional, accesibilidad, documentaciÃ³n y criterios de
aceptaciÃ³n sin aÃ±adir complejidad arquitectÃ³nica.

- [x] T025 [P] AÃ±adir en `index.html` y `src/views/home-view.js` el aviso visible de que los datos pertenecen al navegador y origen local, pueden perderse al borrar los datos y no estÃ¡n protegidos por autenticaciÃ³n
- [x] T026 [P] Revisar `src/views/home-view.js` y `src/views/detail-view.js` para etiquetas accesibles, foco de formularios, mensajes perceptibles y navegaciÃ³n por teclado
- [x] T027 [P] Revisar `src/app.js`, `src/model/book.js` y `src/persistence/book-repository.js` para confirmar que no existen llamadas de red, endpoints, backend, autenticaciÃ³n ni almacenamiento distinto de `localStorage`
- [x] T028 Ejecutar manualmente los escenarios de `specs/001-book-reading-tracker/quickstart.md` usando un origen local estable y verificar explÃ­citamente SC-001 (alta en no mÃ¡s de 3 acciones), SC-002 (pendientes antes que leÃ­dos), SC-003 (cambio de estado), SC-004 (eliminaciÃ³n y cancelaciÃ³n), SC-005 (persistencia), SC-006 (flujos sin ayuda) y SC-007 (lÃ­mite de portadas), registrando cualquier incumplimiento antes de considerar terminada la implementaciÃ³n
- [x] T029 Revisar `src/model/book.js`, `src/persistence/book-repository.js`, `src/views/home-view.js` y `src/views/detail-view.js` contra `specs/001-book-reading-tracker/data-model.md` y `specs/001-book-reading-tracker/contracts/ui-contract.md`, corrigiendo solo desviaciones relacionadas con esta funcionalidad
- [x] T030 [P] Crear pruebas unitarias en `tests/unit/book.test.js` para validaciÃ³n de tÃ­tulo, estado inicial `"pending"`, campos opcionales, agrupaciÃ³n estable y transiciÃ³n permitida entre `"pending"` y `"read"`
- [x] T031 [P] Crear pruebas unitarias en `tests/unit/book-repository.test.js` para lectura vacÃ­a, serializaciÃ³n versionada, persistencia mediante `localStorage`, verificaciÃ³n posterior a escritura, JSON invÃ¡lido, acceso bloqueado, cuota excedida y ausencia de falsos Ã©xitos
- [x] T032 Crear pruebas de aceptaciÃ³n en `tests/acceptance/book-tracker.spec.js` para US1 y verificar SC-001 (alta en no mÃ¡s de 3 acciones), SC-002 (orden de grupos), SC-005 (recarga en el mismo origen) y SC-007 (portada menor de 2 MiB conservada y portada de 2 MiB o mayor omitida con aviso)
- [x] T033 Crear pruebas de aceptaciÃ³n en `tests/acceptance/book-tracker.spec.js` para US2 y verificar SC-003 al cambiar un libro de pendiente a leÃ­do y de leÃ­do a pendiente, incluyendo el estado mostrado y la agrupaciÃ³n resultante
- [x] T034 Crear pruebas de aceptaciÃ³n en `tests/acceptance/book-tracker.spec.js` para US3 y verificar SC-004 al cancelar y confirmar la eliminaciÃ³n, incluido el estado vacÃ­o tras eliminar el Ãºltimo libro
- [x] T035 Crear pruebas de aceptaciÃ³n en `tests/acceptance/book-tracker.spec.js` para SC-006 y FR-012, verificando que los flujos correctos se completan sin ayuda y que los errores de lectura/escritura se muestran sin presentar operaciones fallidas como guardadas

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No depende de otras fases; T002 y T003 pueden ejecutarse en paralelo tras
  crear la estructura de T001.
- **Foundational (Phase 2)**: Depende de T001; T004-T006 pueden avanzar en paralelo con T007-T008,
  y T009 depende de T007.
- **User Stories (Phases 3-5)**: Dependen de toda la Phase 2. Se recomienda completar P1 antes
  de P2 y P3 porque P2 y P3 integran la navegaciÃ³n y detalle creados en P1.
- **Polish (Phase 6)**: Depende de las historias que se quieran entregar; T025-T027 pueden
  ejecutarse en paralelo, y T028-T029 deben ejecutarse despuÃ©s de la implementaciÃ³n.

### User Story Dependencies

- **US1 (P1)**: Puede comenzar despuÃ©s de Phase 2; es el MVP y no depende de otra historia.
- **US2 (P2)**: Depende de las vistas y navegaciÃ³n de US1 para reutilizar el detalle y la lista,
  aunque sus reglas de estado se apoyan en el modelo fundacional.
- **US3 (P3)**: Depende del detalle y navegaciÃ³n implementados para US1/US2; aÃ±ade Ãºnicamente la
  operaciÃ³n de eliminaciÃ³n y su confirmaciÃ³n.

### Parallel Opportunities

- T002 y T003 pueden ejecutarse en paralelo.
- T004-T006 y T007-T008 pueden ejecutarse en paralelo; T009 espera a T007.
- En US1, las tareas T010-T016 modifican archivos compartidos o dependen del mismo flujo de vista y deben ejecutarse secuencialmente o coordinarse explÃ­citamente; T015 espera al modelo y repositorio.
- En Phase 6, T025-T027 son independientes entre sÃ­.
- T030 y T031 pueden ejecutarse en paralelo porque modifican archivos de prueba distintos. T032-T035 modifican el mismo archivo de aceptaciÃ³n y deben ejecutarse secuencialmente o consolidarse en una Ãºnica ediciÃ³n coordinada.

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1 y Phase 2.
2. Completar Phase 3 (US1).
3. Ejecutar el escenario independiente de US1 y los escenarios de persistencia y portadas del
   `quickstart.md`.
4. Entregar el MVP antes de iniciar cambio de estado o eliminaciÃ³n.

### Incremental Delivery

1. AÃ±adir US2 y verificar que no rompe alta, consulta ni persistencia.
2. AÃ±adir US3 y verificar confirmaciÃ³n, cancelaciÃ³n y estado vacÃ­o.
3. Completar Phase 6 y repetir la guÃ­a completa.

## Traceability Summary

- **US1**: FR-001 a FR-006, FR-010 a FR-014; contrato de inicio y formulario.
- **US2**: FR-007, FR-010, FR-012; contrato de detalle y agrupaciÃ³n.
- **US3**: FR-008, FR-009, FR-011, FR-012; contrato de eliminaciÃ³n y estado vacÃ­o.
- **ConstituciÃ³n**: T007-T008 y T025-T027 cubren persistencia local, errores visibles,
  funcionamiento sin red y ausencia de autenticaciÃ³n.

