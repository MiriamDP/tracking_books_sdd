# tracking_books_sdd
Aplicación desarrollada siguiendo la metología de GitHib Spec

# Paso 1. Indicar restricciones de la aplicación
* La aplicacion debe ser sencilla de mantener
* Evitar un diseño complejo, optando por la solucion mas sencilla en cada caso
* No debe tener una base de datos
* No debe tener una API
* La información se guardara en localStorage
* La aplicacion debe funcionar en local exclusivamente
* No hay roles, ni autenticacion y autorizacion de ningun tipo

# Paso 2. Qué se va a construir
Bookify es una aplicación de seguimiento de libros leidos y por leer. El usuario podrá guardar libros y marcar si los ha leido o no. En la home se tendrá la lista de libros apareciendo primero los libros no leidos y luego los leidos. Al hacer click en un libro debe aparecer la página de detalle del libro desde donde se pondrá cambiar su estado a leido o no leido o eliminarlo. Desde la home se podrá ñadir un nuevo libro. 

# Paso 3. Resolución de dudas del agente

# Paso 4. Planificación técnica (Plan)

Se ha utilizado el comando `/speckit-plan` de GitHub Spec Kit para generar la planificación técnica de Bookify a partir de la especificación y la constitución del proyecto.

Se ha decidido desarrollar una aplicación web estática utilizando HTML, CSS y JavaScript, sin frameworks, backend, API ni base de datos. La información se almacenará exclusivamente en `localStorage`.

Se han generado los siguientes documentos en `book-tracking-app/specs/001-book-reading-tracker/`:

- `plan.md`: planificación técnica y estructura del proyecto.
- `research.md`: decisiones técnicas y su justificación.
- `data-model.md`: modelo de datos de los libros.
- `quickstart.md`: instrucciones de ejecución y validación.
- `contracts/ui-contract.md`: comportamiento esperado de la interfaz.

# Paso 5. Desglose de tareas (Tasks)

Se ha ejecutado `/speckit-tasks` para transformar la especificación y el plan técnico en tareas concretas de implementación.

Se ha generado el archivo `tasks.md`, que contiene **35 tareas**, organizadas en seis fases:

1. Preparación del proyecto (Setup).
2. Componentes y lógica fundamentales (Foundational).
3. Historia de usuario 1: añadir y consultar libros.
4. Historia de usuario 2: cambiar el estado de lectura.
5. Historia de usuario 3: eliminar libros.
6. Revisión y mejoras finales (Polish).

Las tareas incluyen la implementación de funcionalidades, la persistencia local y las pruebas unitarias y de aceptación.

# Paso 6. Análisis de consistencia (Analyze)

Se ha utilizado `/speckit-analyze` para comprobar la coherencia entre la especificación, la constitución, el plan técnico y las tareas.

El primer análisis detectó seis incidencias relacionadas con las pruebas, los criterios de aceptación, la ejecución local, la paralelización de tareas y la terminología utilizada.

Se corrigieron los documentos de planificación y se ejecutó nuevamente el análisis.

**Resultados finales:**

- 14 requisitos funcionales analizados.
- 7 criterios de éxito analizados.
- 21 de 21 requisitos cubiertos por tareas (100 %).
- 0 incidencias críticas.
- 0 incidencias altas.
- 1 incidencia media pendiente: diferencia terminológica entre MB y MiB en la especificación original y los documentos de planificación.

La especificación original se ha conservado sin modificaciones. La interpretación de 2 MiB para el límite de las portadas queda pendiente de confirmación por el equipo.

Tras el análisis, la planificación queda preparada para continuar con la implementación mediante `/speckit-implement`.