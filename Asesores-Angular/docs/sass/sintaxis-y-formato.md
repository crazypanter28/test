### Sintaxis Y Formato

En mi opinión, la primera cosa que debe hacer una guía de estilo es describir la forma en que queremos que luzca nuestro código.

Cuando varios desarrolladores están involucrados en la escritura CSS dentro del mismo proyecto o proyectos, es sólo cuestión de tiempo antes de que uno de ellos empiece a hacer las cosas a su manera. Las guías de estilo de código que fomentan la coherencia no solo previenen esto, sino que también ayudan a la hora de leer y actualizar el código.

A grandes rasgos, lo que queremos (humildemente inspirados en CSS Guidelines es):

- dos(2) espacios en blanco, en lugar de tabulaciones;
- idealmente, líneas de 80 caracteres;
- reglas CSS multilínea correctamente escritas;
- buen uso de los espacios en blanco.

```css
    // Yep
    .foo {
        display: block;
        overflow: hidden;
        padding: 0 1em;
    }

    // Nope
    .foo {
        display: block; overflow: hidden;
        padding: 0 1em;
    }
```

Adicionalmente a esas guías CSS, queremos prestar especial atención a las siguientes pautas:

- Las variables locales se declaran antes que cualquier otra y están espaciadas por un salto de línea;
- Las llamadas a los mixin sin @content deben ir antes de cualquier declaración;
- Los selectores anidados van siempre después de un salto de línea;
- Las llamadas a los mixin con @content deben ir después de cualquier selector anidado;
- No usar un salto de línea antes de una llave de cierre (}).

Ejemplo:
```css
.foo, .foo-bar,
.baz {
  $length: 42em;

  @include ellipsis;
  @include size($length);
  display: block;
  overflow: hidden;
  margin: 0 auto;

  &:hover {
    color: red;
  }

  @include respond-to('small') {
    overflow: visible;
  }
}
```

#### Clasificación De Declaraciones

No se me ocurren muchos temas donde las opiniones estén tan divididas como en lo que respecta a la clasificación de las declaraciones en CSS. En concreto, hay dos bandos aquí:

- Mantener un estricto orden alfabético;
- Ordenar las declaraciones por tipo (posición, display, colores, tipografía, varios…).

Hay pros y contras para estas dos posturas. Por una parte, el orden alfabético es universal (por lo menos para los idiomas que usan el alfabeto latino) así que no hay discusión posible a la hora de poner una propiedad antes que otra. Sin embargo, me parece extremadamente raro ver que propiedades como, bottom y top no estén la una justo después de la otra. ¿Por qué las animaciones deben aparecer antes que el tipo de display? Hay muchas singularidades con respecto al orden alfabético.

```css
.foo {
  background: black;
  bottom: 0;
  color: white;
  font-weight: bold;
  font-size: 1.5em;
  height: 100px;
  overflow: hidden;
  position: absolute;
  right: 0;
  width: 100px;
}
```

Por otra parte, ordenar las propiedades por tipo tiene mucho sentido. Cada declaración relacionada está reunida, top y bottom están una debajo de la otra y leer un conjunto de reglas parece como leer un cuento corto. Pero a menos que mantengas algunas convenciones como las que se exponen en CSS idiomático, hay mucho espacio para la interpretación en esta forma de escribir CSS. ¿Dónde debería ir white-space: en tipografía o en display?, ¿Dónde pertenece overflow exactamente?, ¿Cuál es el orden de una propiedad dentro de un grupo? (podría ser en orden alfabético, ¡oh! ironía)

```css
.foo {
  height: 100px;
  width: 100px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  right: 0;
  background: black;
  color: white;
  font-weight: bold;
  font-size: 1.5em;
}
```

También hay otra rama interesante en cuanto al orden de propiedades, llamado CSS concéntrico, que parece ser bastante popular. Básicamente el CSS concéntrico se basa en el modelo de caja para definir un orden: se empieza fuera y se mueve hacia dentro.

```css
.foo {
  width: 100px;
  height: 100px;
  position: absolute;
  right: 0;
  bottom: 0;
  background: black;
  overflow: hidden;
  color: white;
  font-weight: bold;
  font-size: 1.5em;
}
```

Debo decir que ni yo mismo puedo decidirme. Una encuesta reciente en CSS-Tricks determinó que más de un 45% de los desarrolladores ordenan sus declaraciones por tipo, frente el 14% que lo hace alfabéticamente. También hay un 39% que lo hace completamente al azar, incluido yo mismo.

Gráfico que muestra cómo los desarrolladores ordenan sus declaraciones CSS
Gráfico que muestra cómo los desarrolladores ordenan sus declaraciones CSS
Debido a esto, no voy a imponer una opción en concreto en esta guía de estilo. Elige la que más te guste, siempre y cuando sea coherente con el resto de tus hojas de estilo (es decir, no la opción al azar).

>Un estudio reciente muestra que usando CSS Comb (que ordena por tipo) para clasificar las declaraciones CSS termina acortando el tamaño promedio de los archivos bajo compresión Gzip en un 2.7% frente al 1.3% cuando se ordenan alfabéticamente.

#### Anidamiento De Selectores

Una característica particular que aporta Sass y que está siendo muy mal utilizada por muchos desarrolladores es el anidamiento de selectores. El anidamiento de selectores ofrece una forma para que los autores de las hojas de estilo puedan calcular selectores largos anidando selectores más cortos dentro de ellos.

###### REGLA GENERAL

Por ejemplo, el siguiente anidamiento Sass:

```css
.foo {
  .bar {
    &:hover {
      color: red;
    }
  }
}
```

…generará el siguiente CSS:

```css
.foo .bar:hover {
  color: red;
}
```

En la misma línea, desde Sass 3.3 es posible usar la referencia al selector actual (&) para generar selectores avanzados. Por ejemplo:

```
.foo {
  &-bar {
    color: red;
  }
}
```

…generará el siguiente CSS:

```css
.foo-bar {
  color: red;
}
```
Este método se utiliza a menudo junto con las convenciones de nombrado BEM para generar los selectores .block__element y .block--modifier basados en los selectores originales (por ejemplo, .block en este caso).

>Aunque podría ser anecdótico, generar nuevos selectores a partir de la referencia del selector actual (&) hace que dichos selectores no se puedan buscar en la base del código ya que no existen per se.

El problema con la anidación de selectores es que en última instancia hace que el código sea más difícil de leer. Se debe calcular mentalmente el selector resultante de los distintos niveles de sangría; no siempre resulta obvio conocer el código resultante en CSS.

Esta afirmación se vuelve más verdadera en cuanto los selectores se hacen más largos y las referencias al selector actual (&) más frecuentes. En algún punto, el riesgo de perder la pista y no poder entender lo que está pasando es tan alto que no merece la pena.

Para evitar estas situaciónes, hemos hablado mucho sobre la regla de Orgien - En inglés desde hace algunos años. Recomendaba no anidar los selectores más allá de 3 niveles de profundidad, como referencia a la película Inception de Christopher Nolan. Yo sería mucho más drástico y recomendaría evitar la anidación de selectores tanto como sea posible.

Sin embargo, es evidente que hay algunas excepciones a esta regla como se verá en la siguiente sección, esta opinión es bastante popular y puedes leer más sobre ella en Ten cuidado con la anidación de selectores - En inglés y Evita la anidación de selectores para obtener un CSS más modular - En inglés.

EXCEPCIONES

Para los principiantes, se permite e incluso se recomienda anidar pseudo-clases y pseudo-elementos dentro del selector inicial.

```css
.foo {
  color: red;

  &:hover {
    color: green;
  }

  &::before {
    content: 'pseudo-element';
  }
}
```

Usar la anidación para las pseudo-clases y los pseudo-elementos no solo tiene sentido (porque trata con selectores relacionados), sino que también ayuda a mantener todo lo relacionado con un componente en un mismo lugar.

Además, cuando se utilizan clases de estado independientes del dispositivo como .is-active, está perfectamente bien anidar dentro del selector del componente para mantenerlo todo ordenado.

```css
.foo {
  // …

  &.is-active {
    font-weight: bold;
  }
}
```

Por último, pero no menos importante, cuando se da estilo a un elemento, este pasa a estar contenido en otro elemento específico, también está bien utilizar la anidación para mantener todo lo relacionado con el componente en el mismo lugar.

```css
.foo {
  // …

  .no-opacity & {
    display: none;
  }
}
```

Como en todo, los detalles son algo irrelevante, la coherencia es la clave. Si te sientes completamente confiado con la anidaciones de selectores, entonces utilizala. Sólo asegurate de que todo tu equipo está de acuerdo con ello.
