## Mixins

Los mixins son una de las características más utilizadas dentro de todo el lenguaje Sass. Son la clave para la reutilización y los componentes DRY. Y por una buena razón: los mixins permiten a los autores definir estilos CSS que pueden volver a usarse a lo largo de toda la hoja de estilo sin necesidad de recurrir a las clases no semánticas, como por ejemplo .float-left.

Pueden contener reglas CSS completas y casi todo lo que se permite en cualquier parte de un documento Sass. Incluso pueden pasarse argumentos, al igual que en las funciones. Sobra decir que las posibilidades son infinitas.

Pero creo que debo advertirte contra el abuso del poder los mixins. De nuevo, la clave aquí es la simplicidad. Puede ser tentador contruir mixins extremadamente poderosos y con grandes cantidades de lógica. Esto se llama exceso de ingeniería y la mayoría de los desarrolladores la padecen. No pienses demasiado tu código y sobre todo haz que sea simple. Si un mixin ocupa mas o menos unas 20 líneas, debes dividirlo en partes más pequeñas o revisarlo completamente.

#### Fundamentos

Dicho esto, los mixins son extremadamente útiles y deberías estar usando algunos. La regla de oro es que si detectas un grupo de propiedades CSS que están siempre juntas por alguna razón (es decir, no es una coincidencia), puedes crear un mixin en su lugar. Por ejemplo, el hack micro-clearfix de Nicolas Gallagher merece ser puesto en un mixin sin argumentos.

```css
/// Ayuda a limpiar floats internos
/// @author Nicolas Gallagher
/// @link http://nicolasgallagher.com/micro-clearfix-hack/ Micro Clearfix
@mixin clearfix {
  &::after {
    content: '';
    display: table;
    clear: both;
  }
}
```

Otro ejemplo válido sería un mixin para darle tamaño a un elemento, definiendo tanto width como height al mismo tiempo. No solo hace que el código sea más fácil de escribir, sino que también será más fácil de leer.

```css
/// Asigna un tamaño a un elemento
/// @author Hugo Giraudel
/// @param {Length} $width
/// @param {Length} $height
@mixin size($width, $height: $width) {
  width: $width;
  height: $height;
}
```

Para ejemplos más complejos, echa un vistazo a éste [mixin para generar triángulos CSS](https://www.sitepoint.com/sass-mixin-css-triangles/), éste [mixin para crear sombras largas](http://www.sitepoint.com/ultimate-long-shadow-sass-mixin/) o éste [mixin para mantener gradientes CSS](http://www.sitepoint.com/building-linear-gradient-mixin-sass/) en navegadores antiguos (polyfill).

#### Mixins Sin Argumentos

Algunas veces, los mixins se utilizan solo para evitar la repetición del mismo grupo de declaraciones una y otra vez, sin embargo, no necesitan ningun parámetro o tienen los suficientes argumentos por defecto como para tener que pasarle otros adicionales.

En estos casos, podemos omitir sin problema los paréntesis cuando invocamos el mixin. La palabra clave @include (o el signo + en la sintáxis con tabulación) actúa como un indicador de que la línea es una llamada a un mixin; no hay necesidad de paréntesis adicionales aquí.

```css
// Yep
.foo {
  @include center;
}

// Nope
.foo {
  @include center();
}
```

#### Lista De Argumentos

Cuando se trabaja con un número indeterminado de argumentos en un mixin, utiliza siempre una arglist (lista de argumentos) en lugar de una lista. Piensa en un arglist como en el octavo tipo de dato no documentado y oculto de Sass que se usa implicitamente cuando se pasa un número arbitrario de argumentos a un mixin o una a función que contiene ....

```css
@mixin shadows($shadows...) {
  // type-of($shadows) == 'arglist'
  // …
}
```

Ahora, cuando se contruye un mixin que acepta un puñado de argumentos (entiéndase 3 o más), piénsalo dos veces antes de fusionarlos en una lista o mapa pensando que será más sencillo que pasarlos uno a uno.

Sass es de hecho muy inteligente con los mixins y las declaraciones de funciones, tanto, que puedes pasarle una lista o un mapa como un arglist a una función o mixin para que sea tomado como una serie de argumentos.

```css
@mixin dummy($a, $b, $c) {
  // …
}

// Yep
@include dummy(true, 42, 'kittens');

// Yep but nope
$params: (true, 42, 'kittens');
$value: dummy(nth($params, 1), nth($params, 2), nth($params, 3));

// Yep
$params: (true, 42, 'kittens');
@include dummy($params...);

// Yep
$params: (
  'c': 'kittens',
  'a': true,
  'b': 42,
);
@include dummy($params...);
```

Para más información acerca de cuál es la mejor opción entre usar múltiples argumentos, una lista o una lista de argumentos, [SitePoint tiene una buen artículo sobre el tema.](https://www.sitepoint.com/sass-multiple-arguments-lists-or-arglist/)

#### Mixins Y Prefijos De Proveedores

Puede ser tentador definir mixins personalizados para manejar prefijos de vendors en propiedades CSS que no son compatibles o totalmente soportadas. Pero no queremos esto. Primero, si puedes usar [Autoprefixer](https://github.com/postcss/autoprefixer), usa Autoprefixer. Eliminará código Sass de tu proyecto, siempre estará al día y hará un trabajo mejor de lo que lo puedes hacer tu al poner prefijos a los atributos.

Desafortunadamente, Autoprefixer no siempre es una opción. Si usas [Bourbon](http://bourbon.io/) o [Compass](http://compass-style.org/), seguramente sabrás que ambos proporcinan una coleción de mixins que manejan los prefijos de los vendors por ti. Úsalos.

Si no puedes usar Autoprefixer, ni Bourbon, ni Compass, entonces y sólo entonces, puedes tener tu propio mixin para añadir prefijos a las propiedades CSS. Pero. Por favor, no construyas un mixin por propiedad, imprimiendo manualmente cada vendor.

```css
// Nope
@mixin transform($value) {
  -webkit-transform: $value;
  -moz-transform: $value;
  transform: $value;
}
Hazlo de la manera inteligente.

/// Mixin para producir prefijos de proveedores
/// @access public
/// @author HugoGiraudel
/// @param {String} $property - propiedad CSS sin prefijo
/// @param {*} $value - Valor CSS en crudo
/// @param {List} $prefixes - Lista de prefijos a producir
@mixin prefix($property, $value, $prefixes: ()) {
  @each $prefix in $prefixes {
    -#{$prefix}-#{$property}: $value;
  }

  #{$property}: $value;
}
```

Entonces usar este mixin debería ser directo y sencillo:

```css
.foo {
  @include prefix(transform, rotate(90deg), ('webkit', 'ms'));
}
```

Por favor, ten en cuenta que es una solución pobre. Por ejemplo, no puede trabajar con polyfills complejos como los necesarios para Flexbox. En ese sentido, utilizar Autoprefixer sería una solución mucho mejor.
