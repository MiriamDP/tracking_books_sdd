# Guía de validación rápida

## Prerrequisitos

- Node.js 20 o posterior si se desea utilizar el servidor local incluido o ejecutar las pruebas.
- Navegador moderno con JavaScript habilitado.
- No se necesita cuenta, base de datos, API ni conexión de red.
- La aplicación requiere un origen local estable porque utiliza módulos ES y `localStorage`.
  El servidor incluido solo sirve archivos durante el desarrollo; no es un backend ni un
  servicio remoto del producto.

## Arranque

Desde PowerShell, en la carpeta `book-tracking-app`:

```powershell
npm install
npm start
```

Abre `http://localhost:8000` en el navegador. Mantén abierta la terminal mientras uses la
aplicación y pulsa `Ctrl+C` para detener el servidor. `npm install` instala dependencias de
desarrollo para las pruebas; para iniciar la app también se puede ejecutar `node server.js`
sin npm, siempre que Node.js esté instalado.

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
