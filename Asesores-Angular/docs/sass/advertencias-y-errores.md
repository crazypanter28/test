## Advertencias Y Errores

Si hay una característica que a menudo es pasada por alto por los desarrolladores Sass, es la capacidad de generar advertencias e informes de errores de manera dinámica. De hecho, Sass viene con tres directivas personalizadas para imprimir contenido en el sistema de salida estándar (CLI, compiling app…):

- @debug;
- @warn;
- @error.

Dejemos @debug de lado, ya que claramente está pensado para depurar SassScript, lo que no es nuestro propósito aquí. Entonces nos quedamos con @warn y @error los cuales son notablemente idénticos, salvo porque uno detiene el compilador, mientras que el otro no. Te voy a dejar advinar cuál hace qué.

Ahora, siempre hay sitio en cualquer proyecto Sass para advertencias y errores. Básicamente cualquier mixin o función que espera un tipo o argumento específico podría lanzar un error si algo sale mal, o mostrar una advertencia cuando se hace una suposición.

#### Advertencias

Toma como ejemplo esta función de [Sass-MQ](https://github.com/sass-mq/sass-mq) que intenta convertir un valor de px a em:

```css
@function mq-px2em($px, $base-font-size: $mq-base-font-size) {
  @if unitless($px) {
    @warn 'Assuming #{$px} to be in pixels, attempting to convert it into pixels.';
    @return mq-px2em($px + 0px);
  } @else if unit($px) == em {
    @return $px;
  }

  @return ($px / $base-font-size) * 1em;
}
```

Si el valor no tiene unidades, la función asume que el valor estará expresado en píxeles. En este punto, hacer este tipo de hipótesis puede ser arriesgado, por lo que el usuario debe recibir una advertencia de que el software ha hecho algo que podría considerarse inesperado.

#### Errores

Los errores, a diferencia de las advertencias, impiden continuar al compilador. Básicamente paran la compilación y muestran un mensaje en la consola de salida, así como el rastro de seguimiento del error, lo que suele ser muy útil para la depuración. Debido a esto, los errores aparecerán cuando no hay manera de que el programa continúe funcionando. Cuando sea posible, trata de evitar el problema y mostrar una advertencia en su lugar.

Como ejemplo, digamos que construyes una función getter para acceder a los valores de un mapa específico. Se podría producir un error si la clave solicitada no existe en el mapa.

```css
/// Z-indexes map, gathering all Z layers of the application
/// @access private
/// @type Map
/// @prop {String} key - Layer’s name
/// @prop {Number} value - Z value mapped to the key
$z-indexes: (
  'modal': 5000,
  'dropdown': 4000,
  'default': 1,
  'below': -1,
);

/// Get a z-index value from a layer name
/// @access public
/// @param {String} $layer - Layer's name
/// @return {Number}
/// @require $z-indexes
@function z($layer) {
  @if not map-has-key($z-indexes, $layer) {
    @error 'There is no layer named `#{$layer}` in $z-indexes. '
         + 'Layer should be one of #{map-keys($z-indexes)}.';
  }

  @return map-get($z-indexes, $layer);
}
```

Para más información sobre cómo usar @error de manera eficiente, [ésta introducción acerca del manejo de errores -En inglés](http://webdesign.tutsplus.com/tutorials/an-introduction-to-error-handling-in-sass--cms-19996) puede serte de ayuda
