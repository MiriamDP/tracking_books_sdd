# Modelo de datos

## Libro

Representa una entrada de la lista de lectura.

| Campo | Tipo | Obligatorio | Reglas |
|---|---|---:|---|
| `id` | string | Sí | Identificador único generado al crear el libro |
| `title` | string | Sí | Tras aplicar `trim()`, no puede estar vacío |
| `author` | string | No | Texto opcional; se conserva normalizado |
| `status` | enum | Sí | Solo `"pending"` o `"read"`; los nuevos libros usan `"pending"` |
| `coverDataUrl` | string/null | No | Data URL Base64 de una imagen cuyo archivo original mide menos de 2 MiB |
| `createdAt` | string | Sí | Fecha ISO de creación usada como orden estable |

La persistencia almacena una colección de libros en un documento versionado, por ejemplo
`{ "version": 1, "books": [] }`. La clave exacta se definirá como constante del repositorio y no
se expondrá a las vistas.

## Relaciones y orden

No existen relaciones entre libros. La página principal divide la colección en dos grupos:
`pending` primero y `read` después. Cada grupo conserva el orden ascendente de `createdAt` (con
`id` como desempate determinista si fuera necesario).

## Transiciones de estado

```text
new -> pending
pending <-> read
pending/read -> deleted
```

La transición `deleted` elimina el elemento de la colección; no se persiste un estado borrado.
La eliminación solo ocurre después de confirmación explícita.

## Validaciones y errores

- Título vacío o compuesto solo por espacios: rechazo del formulario y mensaje de campo.
- Autor ausente: válido.
- Portada menor de 2 MiB: conversión a Base64 y conservación.
- Portada de 2 MiB o mayor: libro válido sin portada y notificación informativa.
- Error de lectura, parseo, cuota o acceso a `localStorage`: operación fallida, mensaje visible
  y ningún cambio de UI presentado como persistido.
- Libro inexistente al abrir detalle: mensaje de indisponibilidad y enlace para volver a inicio.
