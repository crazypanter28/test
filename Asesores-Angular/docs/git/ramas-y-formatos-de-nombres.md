# Ramas y formatos de nombres

Los nombres de las ramas deben tener coherencia con respecto a lo que se va a resolver o desarrollar en una rama, la forma correcta de crear una rama nueva lleva el siguiente orden:

1. tipo
* módulo
* las diagonales

## 1. tipo

El tipo de rama se refiere a lo que se llevará a cabo, por ejemplo una nueva caracteristica, solución a algún “bug”, actualización de algún bloque, etc.

Los tipos aceptados para las ramas son:

* feat (para nuevas características)
* fix (para solución a problemas)
* doc (para documentación)
* refactor (para reconstrucción de alguna característica)
* test (cuando se agregan tests)
* chore (tareas de mantenimiento)

## 2. módulo

El módulo al que se está haciendo referencia en el desarrollo, por ejemplo puede ser el login.

## 3. las diagonales

Los nombres de las rámas deben tener todas las partes de su nombre separado por diagonales.

El formato final debería ser así:

```bash
<tipo>/<módulo>
```

## ejemplos

Un ejemplo podría ser el siguiente:

> _Se está desarrollando el  login, en la parte front-end._

La rama debería tener un nombre aproximado a:

```bash
feat/front-end/login
```
