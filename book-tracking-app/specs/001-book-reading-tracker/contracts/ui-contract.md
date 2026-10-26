# Contrato de interfaz de usuario

Este contrato describe la interfaz observable de Bookify. No hay API HTTP ni interfaz de
backend. Las vistas deben seguir siendo utilizables sin conexión y deben comunicar los errores
de persistencia.

## Inicio (`/` o vista home)

- Muestra el encabezado de Bookify y una acción **Añadir libro**.
- Si no hay libros, muestra un estado vacío explicativo y la misma acción.
- Si hay libros, muestra dos grupos en este orden: **Pendientes** y **Leídos**. Cada tarjeta
  permite abrir el detalle e identifica título, autor si existe y estado.
- El texto informativo indica que los datos pertenecen al navegador/origen local y pueden
  perderse al borrar los datos del navegador; no implica protección de acceso.

## Formulario de alta

- Campos: título obligatorio, autor opcional y portada opcional.
- Confirmar un título vacío o de solo espacios muestra un error junto al título y no persiste.
- Una portada inferior a 2 MiB se conserva. Una portada de 2 MiB o mayor muestra una
  notificación de omisión, pero permite guardar el libro sin imagen.
- Tras un guardado confirmado, vuelve a la lista y el libro aparece en **Pendientes**.
- Si falla la persistencia, permanece en el formulario (o muestra estado de error equivalente)
  y no presenta el libro como guardado.

## Detalle (`/books/:id` o vista detail)

- Muestra título, autor cuando exista, portada cuando exista y estado actual.
- Ofrece una acción para alternar entre pendiente y leído. Tras confirmarse el guardado, muestra
  el nuevo estado.
- Ofrece **Eliminar**. La confirmación explícita elimina y vuelve a inicio; cancelar deja el
  libro sin cambios.
- Si el identificador no existe, muestra que el libro no está disponible y ofrece volver a
  inicio.

## Errores

Los errores de lectura inicial, JSON inválido, cuota o escritura deben ser visibles y no deben
convertirse en una lista vacía ni en un mensaje de éxito. Los mensajes pueden ser texto visible,
alerta accesible o ambos, pero deben poder percibirse sin inspeccionar la consola.
