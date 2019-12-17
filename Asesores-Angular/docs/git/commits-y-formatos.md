# commits y formatos

Los commits en los repositorios de git son muy importantes para que se puedan
identificar los cambios que se están agregando al desarrollo. Ayuda a saber
en donde se pudieron haber cometido errores o agregado features que no debieron haberse agregado.

Los commits también tienen tipos y los identificamos de la siguiente forma:

## formato de commits

Los commits tienen un formato el cual ayuda a la identificación de los cambios
que este incluye. El formato más común de mensaje de commit es el siguiente:

```bash
<tipo>(<ámbito>): <asunto>
<LÍNEA EN BLANCO>
<cuerpo del mensaje>
<LÍNEA EN BLANCO>
<pie del mensaje>
```
> _tipos habituales: feat(feature/nueva característica), fix, doc (documentación), style, refactor, test (si faltaban tests), chore (tareas de mantenimiento)_

#### ejemplo:

```bash
feat(archivo_01.js): Manejo de las cookies

Se agrega el manejo de las cookies en el archivo para poder guardar, actualizar y borrar cookies en el navegado ...
```

## tipos de commits

Los tipos de commits aceptados son:

```bash
- feat
- fix
- doc
- style ( para acomodar/reorganizar/identar código sin cambiar funcionalidad )
- refactor
- test ( por si faltaban tests )
- chore ( para tareas de mantenimiento )
```

> _Este formato es obligatorio para todas los commits que se tengan que realizar durante el desarrollo._

Se pueden usar herramientas como [SourceTree](http://www.atlassian.com/SourceTree-Git-GUI%E2%80%8E), [Smartgit](http://www.syntevo.com/smartgit/), etc.
