## Variables

Las variables son la esencia de cualquier lenguaje de programación. Nos permiten reutilizar valores sin tener que copiarlos una y otra vez. Y lo más importante, permiten actualizar cualquier valor de manera sencilla. No más buscar y reemplazar valores de manera manual.

Sin embargo CSS no es más que una cesta enorme que contiene todos nuestros elementos. A diferencia de muchos lenguajes, no hay scopes reales en CSS. Debido a esto, debemos prestar especial atención cuando añadimos variables ya que pueden existir conflictos.

Mi consejo sería que solo crearas variables cuando tenga sentido hacerlo. No inicies nuevas variables solo por el gusto de hacerlo, no será de ayuda. Una nueva variable debe crearse solo cuando se cumplen los siguientes criterios:

- el valor se repite al menos dos veces;
- es probable que el valor se actualice al menos una vez;
- todas las ocurrencias del valor están vinculadas a la variable (es decir, no por casualidad).

Básicamente, no hay ningún sentido en declarar una variable que nunca se actualizará o que sólo se usará en un solo lugar.


Scoping

En Sass, el ámbito (scoping) de las variables ha cambiado a lo largo de los años. Hasta hace muy poco, las declaraciones de variables dentro de los conjuntos de reglas y otros ámbitos eran locales por defecto. Sin embargo cuando ya había una variable global con el mismo nombre, la asignación local cambiaría dicha variable global. Desde la versión 3.4, Sass aborda correctamente el concepto de ámbitos y crea una nueva variable local en su lugar.

Los documentos hablan de ocultar o sombrear la variable global. Cuando se declara una variable que ya existe en el marco global dentro de un ámbito interno (selector, función, mixin…), se dice que la variable local esta sombreando a la variable global. Básicamente, la sobrescribe solo en el ámbito local.

El siguiente fragmento de código explica el concepto de sombreado de variable:

```css
// Inicializar una variable global a nivel raiz.
$variable: 'valor inicial';

// Crear un *mixin* que sobrescribe la variable global.
@mixin global-variable-overriding {
  $variable: 'mixin value' !global;
}

.local-scope::before {
  // Crear una variable local que oculte la variable global.
  $variable: 'local value';

  // Incluir el *mixin*: sobrescribe la variable global.
  @include global-variable-overriding;

  // Imprimir el valor de la variable.
  // Es la variable **local** puesto que sobrescribe la global.
  content: $variable;
}

// Imprime la variable en otro selector que no la está sombreando.
// Es la variable **global**, como se esperaba.
.other-local-scope::before {
  content: $variable;
}
```

#### El Flag !default

Cuando se construye una librería, un framework, un sistema de retícula o cualquier bloque de Sass que está destinado a ser distribuido y usado por desarrolladores externos, todas las variables de configuración deben estar definidas con el flag !default para que puedan sobrescribirse.

```css
$baseline: 1em !default;
```

Gracias a esto, cualquier desarrollador puede definir su propia variable $baseline antes de importar tu librería sin que su valor sea redefinido.

```css
// La variable del desarrollador
$baseline: 2em;

// Tu librería declarando la variable `$baseline`
@import 'your-library';

// $baseline == 2em;
```

#### El Flag !global

El flag !global solo se debe utilizar cuando se sobrescribe una variable global desde un marco local. Cuando se define una variable a nivel raiz, el flag !global debe ser omitido.

```csss
// Yep
$baseline: 2em;

// Nope
$baseline: 2em !global;
```

#### Variables Múltiples O Mapas

Existen varias ventajas al utilizar mapas en lugar de variables múltiples. La principal de ellas es la de poder iterar sobre un mapa, lo que no es posible con múltiples variables.

Otra ventaja de utilizar un mapa es la de tener la capacidad de crear una pequeña función getter para proporcionar una API más amigable. Por ejemplo, echa un vistazo al siguiente código Sass:

```css
/// Mapa de Z-indexes, reuniendo todos las capas Z de la aplicación
/// @access private
/// @type Map
/// @prop {String} key - Nombre de la capa
/// @prop {Number} value - Valor Z asignada a la clave
$z-indexes: (
  'modal': 5000,
  'dropdown': 4000,
  'default': 1,
  'below': -1,
);

/// Obtener todos los z-index a partir del nombre de una capa
/// @access public
/// @param {String} $layer - Nombre de la capa
/// @return {Number}
/// @require $z-indexes
@function z($layer) {
  @return map-get($z-indexes, $layer);
}
```
