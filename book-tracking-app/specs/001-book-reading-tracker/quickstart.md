# Guía de validación rápida

## Prerrequisitos

- Navegador moderno con JavaScript habilitado.
- No se necesita cuenta, base de datos, API ni conexión de red.
- Abrir el proyecto desde un origen local estable. Puede utilizarse un servidor estático local
  si el navegador restringe módulos ES al abrir `index.html` directamente; ese servidor solo
  sirve archivos durante el desarrollo, no es un backend ni un servicio remoto del producto.

## Arranque

1. Servir la carpeta raíz del proyecto con cualquier servidor estático local, si el navegador lo
   requiere. El servidor es únicamente una herramienta local de desarrollo y no participa en la
   lógica, persistencia ni funcionamiento normal de Bookify.
2. Abrir la URL local en el navegador.
3. Confirmar que la aplicación muestra el estado vacío y el aviso sobre el alcance de
   `localStorage`.

## Escenarios de aceptación

1. Añadir solo un título válido en no más de 3 acciones principales: el libro aparece como
   pendiente (SC-001).
2. Intentar guardar un título vacío y uno compuesto solo por espacios: ambos se rechazan con
   error visible.
3. Añadir título y autor: ambos aparecen en el detalle.
4. Añadir varios libros, marcar uno como leído y volver al inicio: todos los pendientes aparecen
   antes que todos los leídos.
5. Recargar la página o cerrarla y abrirla en el mismo origen: libros, estados y portadas
   siguen disponibles.
6. Abrir un detalle, cancelar la eliminación y verificar que el libro permanece; confirmar otra
   eliminación y verificar el retorno al inicio. El último eliminado deja el estado vacío.
7. Seleccionar una imagen menor de 2 MiB (2 × 1024 × 1024 bytes): se muestra en el detalle.
   Seleccionar una de 2 MiB o mayor: se guarda el libro sin imagen y aparece la notificación de
   omisión (SC-007).
8. Simular o provocar un fallo de lectura/escritura del almacenamiento en las pruebas: debe
   mostrarse un error y no un resultado exitoso ni una lista vacía engañosa.

## Validación automatizada recomendada

- Ejecutar las pruebas unitarias de `tests/unit/` para validar el modelo y el repositorio.
- Ejecutar las pruebas de aceptación de `tests/acceptance/` en un navegador limpio.
- Relacionar los casos de alta en tres acciones, orden, persistencia, cambio de estado,
  eliminación, operación sin ayuda y portadas con los criterios `SC-001` a `SC-007` de
  [spec.md](./spec.md).
- Usar [data-model.md](./data-model.md) para comprobar el esquema serializado y
  [contracts/ui-contract.md](./contracts/ui-contract.md) para comprobar mensajes y estados de
  interfaz.
