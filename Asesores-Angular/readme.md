# **Actinver**

Este repositorio está pensado para que se pueda descargar y continuar con el desarrollo sin ninguna compilación

##### dependencias

- nodejs 4.0+
- npm 3.10.8+
- gulp
- bower 1.8.0+


##### directorio build

Build es el directorio en donde se mantiene la compilación durante el desarrollo es en donde se tendrán todas las compilaciones y donde el servidor tendrá su `RootDirectory`.

##### directorio dist

El directorio `dist` es en donde se obtendrá la compilación final del sistema. En este directorio podrán encontrar los archivos minimisados, concatenados y listos para poder subirlos a producción.

***

## **Construcción**

Para la compilación existen 3 fases:

##### 1.- instalación

Esta fase es la más sencilla de todas, solo hace falta una conexión a internet
y ejecutar el siguiente comando:

```bash
bower install
npm install
```
Este comando ejecutara el script `npm build` la cual dejará el sistema
construido y con todas las dependencias listas para ser usadas en cualquier
parte.

##### 2 .- desasrrollo

Se cuenta con una tarea especializada para la construcción de la aplicación la
cual se encargará de mantener siempre actualizada la aplicación por medio del
navegador.

Para entrar en modo desarrollo se tiene que ejecutar el siguiente comando:

```bash
npm run dev
```

Este comando lanzará las tareas necesarias para que se pueda realizar cualquier
modificación a cualquier parte de los archivo y que en automático se compilen
y se actualice el navegador en donde se está visualizando el sistema.


##### 3 .- producción

Esta hace lo mismo que `npm dev` pero con la pequeña diferencia de que no deja
funcionando un _watcher_ que esté escuchando los cambios en los archivos, Esta
solo se encarga de construir todo y dejar los archivos listos para subirlos
al servidor de producción. Para poder realizar esta tareas sólo será necesario
ejecutar el siguiente comando:

```bash
npm run dist
```

##### 4 .- Reporte
Para generar reporte de mantenibilidad, ejecutar el siguiente comando.

```bash
npm run report
```
***

## Estandarización para GIT

* [Ramas y los formatos de nombres](docs/git/ramas-y-formatos-de-nombres.md)
* [Commits y los formatos](docs/git/commits-y-formatos.md)

## Estandarización para código

* [Espaciados, argumentos y parametros](docs/code/espaciados-argumentos-y-parametros.md)
* [Declaración de variables](docs/code/declaracion-de-variables.md)
* [Loops e iteraciones](docs/code/loops-e-iteraciones.md)
* [Métodos y funciones](docs/code/metodos-y-funciones.md)

## Estandarización SASS

* [Sintaxis y formato](docs/sass/sintaxis-y-formato.md)
* [Convenciones de nomenglatura](docs/sass/convenciones-de-nomenglatura.md)
* [Comentarios](docs/sass/comentario.md)
* [Variables](docs/sass/variables.md)
* [Extend](docs/sass/extend.md)
* [Mixin](docs/sass/mixins.md)
* [Sentencias Condicionales](docs/sass/sentencias-condicionales.md)
* [Bucles](docs/sass/loops.md)
* [Advertencias y errores](docs/sass/advertencias-y-errores.md)

# **Documentación Angular**
