# Investigación técnica: Bookify

## Decisión: aplicación web estática con JavaScript nativo

**Rationale:** La funcionalidad es local, pequeña y no necesita componentes de servidor. HTML,
CSS y módulos JavaScript del navegador reducen dependencias, configuración y superficie de
mantenimiento, cumpliendo el principio de simplicidad.

**Alternativas consideradas:** Un framework frontend (React/Vue) aportaría estructura y
ecosistema, pero añadiría dependencias y un proceso de compilación sin un beneficio necesario
para dos vistas y un formulario. Un backend o una API contradicen directamente la constitución.

## Decisión: repositorio único sobre `localStorage`

**Rationale:** Un módulo de persistencia con una clave estable y un documento JSON versionado
conserva libros entre visitas en el mismo origen. Las operaciones de lectura y escritura deben
capturar errores explícitos; después de escribir se debe volver a leer y comprobar el valor para
no mostrar como guardado una operación fallida. El repositorio debe distinguir una lista vacía
válida de un error de recuperación.

**Alternativas consideradas:** IndexedDB sería más escalable, pero es innecesario para la escala
de una lista personal y no cumple la restricción de que `localStorage` sea el mecanismo de
persistencia. Cookies tienen menor capacidad y no son adecuadas para una colección con imágenes.

## Decisión: Base64 para portadas menores de 2 MiB

**Rationale:** La especificación fija el umbral sobre el tamaño del archivo original. El flujo
valida `file.size < 2 * 1024 * 1024` (2 MiB), lee el archivo como data URL y guarda el resultado
dentro del libro. Para `file.size >= 2 * 1024 * 1024` (2 MiB), se omite la portada, se guarda el
resto del libro y se notifica claramente. Un error de lectura de la imagen debe impedir el
guardado, porque no se puede afirmar que la operación solicitada se completó correctamente.

**Alternativas consideradas:** Guardar el `File` directamente no sobrevive a la serialización de
`localStorage`. Comprimir o redimensionar cambiaría el comportamiento especificado y añadiría
complejidad.

## Decisión: estado derivado de una colección ordenada estable

**Rationale:** Cada libro tendrá `status: "pending" | "read"` y un `createdAt`/orden de inserción.
La vista separará pendientes y leídos, conservando el orden de inserción dentro de cada grupo.
Tras cualquier cambio, se volverá a leer la colección y a aplicar la misma agrupación.

**Alternativas consideradas:** Ordenar por título no está solicitado. Mantener dos colecciones
persistidas duplicaría datos y podría desincronizar estados.

## Decisión: validación y errores visibles en la interfaz

**Rationale:** El título se valida con `trim()` y el autor se normaliza como opcional. Los
errores de `localStorage`, JSON corrupto, ausencia de un libro y eliminación cancelada tienen
resultados explícitos en la UI. La aplicación no sustituirá un error de lectura por una lista
vacía.

**Alternativas consideradas:** Valores por defecto silenciosos mejorarían la apariencia
inmediata, pero ocultarían pérdida o corrupción de datos y violarían la constitución.

## Decisión: pruebas unitarias y de aceptación en navegador

**Rationale:** Las pruebas unitarias cubrirán validación, agrupación, serialización y fallos del
almacenamiento. Las pruebas de aceptación cubrirán los escenarios de las tres historias, la
persistencia, la confirmación de borrado y el umbral de portadas.

**Alternativas consideradas:** Solo pruebas manuales no demostrarían los criterios medibles de
persistencia, orden y manejo de errores.
