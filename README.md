# Bookify

Bookify es una aplicación web local para organizar libros pendientes y leídos. Se ha desarrollado con HTML, CSS y JavaScript, siguiendo los documentos de especificación de GitHub Spec Kit del repositorio.

## Funcionalidad

- Añadir libros con título obligatorio y autor opcional.
- Adjuntar una portada opcional. Se conserva si ocupa menos de 2 MiB; si ocupa 2 MiB o más, el libro se guarda sin portada y se muestra un aviso.
- Consultar los libros agrupados: primero los pendientes y después los leídos.
- Abrir el detalle, cambiar el estado de lectura y eliminar libros con confirmación.
- Guardar libros, estados y portadas en `localStorage` del navegador.

La aplicación no requiere cuentas, backend, API, base de datos ni servicios remotos. Los datos permanecen en el navegador y origen local utilizados; borrar los datos del navegador puede eliminarlos.

## Requisitos

- Windows y PowerShell (los comandos siguientes están escritos para PowerShell).
- Node.js 20 o posterior. La instalación de Node.js incluye `npm`; se necesita para instalar las dependencias de pruebas y ejecutar los scripts del proyecto.
- Un navegador moderno.

Comprueba que Node.js y npm están disponibles:

```powershell
node --version
npm --version
```

Si alguno no se reconoce, instala la versión LTS desde [nodejs.org](https://nodejs.org/) y abre una nueva terminal para que se actualice el `PATH`. Si Node.js ya está instalado en la ubicación estándar pero esta sesión no tiene esa ruta, puedes añadirla temporalmente en PowerShell:

```powershell
$env:Path = "C:\Program Files\nodejs;$env:Path"
node --version
npm --version
```

El cambio solo afecta a la ventana actual de PowerShell.

## Instalar, probar y arrancar

Desde la raíz del repositorio:

```powershell
cd .\book-tracking-app
npm install
npm test
npm start
```

`npm install` instala las dependencias de desarrollo utilizadas por las pruebas. Para ejecutar la aplicación, `npm start` inicia el servidor estático local en **http://localhost:8000**. Mantén abierta esa terminal mientras uses la app y pulsa `Ctrl+C` para detenerlo. Puedes ejecutar `npm test` desde otra terminal.

Abre [http://localhost:8000](http://localhost:8000) en el navegador. Usa siempre el mismo origen (`localhost:8000`) para conservar y consultar los mismos datos de `localStorage`.

## Si PowerShell no reconoce `npm` o `node`

Node.js puede estar instalado pero no incluido en el `PATH` de la terminal. Cierra y vuelve a abrir PowerShell después de instalarlo o utiliza el bloque temporal de `PATH` anterior. Si está instalado en la ubicación estándar, también puedes iniciar la app sin npm así:

```powershell
cd .\book-tracking-app
& "C:\Program Files\nodejs\node.exe" .\server.js
```

Si la carpeta de instalación es distinta, sustituye la ruta de `node.exe` por la ruta real. Si `node.exe` no existe, instala Node.js antes de continuar.

### Para ver los cambios de la rama `feature/pagina-creacion-libro`

Los cambios de esta funcionalidad están en la rama `feature/pagina-creacion-libro`. Para probarlos, abre PowerShell en la raíz del repositorio y cambia a esa rama:

```powershell
git status
git switch feature/pagina-creacion-libro
git branch --show-current
```

El último comando debe mostrar `feature/pagina-creacion-libro`. Si Git indica que la rama no existe localmente, actualiza las referencias remotas y crea una rama local que siga a la remota:

```powershell
git fetch origin
git switch --track origin/feature/pagina-creacion-libro
```

Antes de cambiar de rama, guarda o aparta cualquier cambio local que quieras conservar. Una vez en la rama, inicia la aplicación desde `book-tracking-app`:

```powershell
cd .\book-tracking-app
npm install
npm start
```

Abre [http://localhost:8000](http://localhost:8000). En la página principal, pulsa **Añadir libro** para abrir la página de creación; al guardar o cancelar volverás a la lista. Mantén la misma dirección (`localhost:8000`) para consultar los datos guardados en ese origen del navegador.


## Pruebas

La suite incluye pruebas unitarias para el modelo y la persistencia, además de pruebas de aceptación para los flujos principales:

```powershell
cd .\book-tracking-app
npm install
npm test
```

## Documentación del proyecto

La especificación y los artefactos de diseño están en [`book-tracking-app/specs/001-book-reading-tracker/`](./book-tracking-app/specs/001-book-reading-tracker/), incluidos la especificación funcional, el plan, las tareas, el modelo de datos, los contratos de interfaz y la guía de validación rápida.
