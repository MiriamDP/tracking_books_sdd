<!--
Sync Impact Report
Version change: unversioned -> 1.0.0
Modified principles: none; this is the initial adoption.
Added sections: Restricciones de arquitectura; Flujo de desarrollo y cumplimiento.
Removed sections: none.
Follow-up TODOs: Confirm the original ratification date.
-->

# Book Tracking App Constitution

## Core Principles

### I. Mantenibilidad mediante simplicidad
La aplicación MUST utilizar la solución más sencilla que satisfaga los requisitos. El diseño
MUST evitar capas, abstracciones, dependencias y configuraciones que no aporten un beneficio
concreto. El código MUST mantenerse organizado y comprensible para facilitar su modificación.
La complejidad adicional MUST justificarse en la documentación o en la revisión del cambio.

### II. Ejecución exclusivamente local
La aplicación MUST ejecutarse en el entorno local del usuario y MUST poder realizar sus funciones
sin conectarse a servicios remotos. El funcionamiento normal MUST NOT depender de recursos,
servicios o conexiones de red externos.

### III. Persistencia local con localStorage
Los datos de la aplicación MUST almacenarse en el `localStorage` del navegador. La aplicación MUST
NOT utilizar bases de datos, almacenamiento remoto, sincronización en la nube ni otro mecanismo
persistente para los datos de usuario. La interfaz MUST informar de errores de lectura o escritura
que impidan conservar los datos. La documentación y la interfaz MUST dejar claro que los datos
pertenecen al navegador y origen local utilizados y que pueden perderse al borrar sus datos.

### IV. Sin backend ni API
El proyecto MUST NOT incluir una API, endpoints de servidor ni un backend para las funciones de la
aplicación. La aplicación MUST NOT consumir APIs externas. Las herramientas locales de desarrollo
o compilación no constituyen un backend del producto siempre que no sean necesarias durante su
uso normal.

### V. Sin autenticación, autorización ni roles
La aplicación MUST NOT implementar cuentas, inicio de sesión, roles ni controles de autorización.
La interfaz y la documentación MUST indicar que la aplicación no protege los datos frente a otras
personas con acceso al mismo navegador o dispositivo: `localStorage` no es un mecanismo de
autenticación ni de protección de acceso.

## Restricciones de arquitectura

- La arquitectura MUST ser cliente y local; no se añadirán componentes de servidor ni servicios
  remotos para implementar funciones del producto.
- `localStorage` será el único mecanismo persistente para los datos de usuario. La aplicación
  MUST tratar explícitamente los errores de acceso y los límites de almacenamiento del navegador,
  sin mostrar un resultado exitoso cuando los datos no se hayan guardado.
- Una propuesta que introduzca una base de datos, una API, un servicio remoto, autenticación o
  autorización requiere modificar primero esta constitución.

## Flujo de desarrollo y cumplimiento

- Las especificaciones, los cambios de diseño y las revisiones MUST comprobar el cumplimiento de
  cada principio afectado.
- Las pruebas pertinentes MUST verificar que los datos se guardan y recuperan mediante
  `localStorage`, y que los flujos cubiertos no dependen de una API o servicio remoto.
- Toda complejidad arquitectónica MUST tener una justificación concreta vinculada a un requisito.
  Las excepciones a esta constitución requieren una enmienda aprobada antes de implementarse.

## Governance

Esta constitución prevalece sobre las decisiones de diseño y desarrollo del proyecto. Para
enmendarla, se debe proponer el cambio con su justificación e impacto, revisar su coherencia con
los demás principios y obtener la aprobación de las personas responsables del proyecto antes de
aplicar cualquier cambio que dependa de él.

La versión sigue SemVer: un cambio incompatible en los principios incrementa la versión mayor;
añadir un principio o ampliar materialmente las obligaciones incrementa la versión menor; las
aclaraciones sin cambio semántico incrementan la versión de parche. Cada cambio aprobado debe
actualizar la fecha de última enmienda y explicar su impacto.

Las revisiones de especificaciones, diseño y código MUST comprobar las reglas aplicables. Las
pruebas y revisiones MUST señalar incumplimientos; un incumplimiento no puede convertirse en una
excepción implícita. El cumplimiento debe reevaluarse cuando se proponga una enmienda.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): confirmar la fecha de adopción original | **Last Amended**: 2026-10-25
