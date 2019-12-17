# declaracion de variables

Para todo el código generado se deben seguir las siguientes reglas

1.- Las variables se declaran siempre al principio de cada método o archivo (Usar la menor cantidad de variables globales).

2.- Todas las variables se deben declarar usando la palabra reservada `var`. p.e.:
```javascript
// variable inicializada
var x = null;
```

3.- Todas las variables deben ser inicializadas con un null en caso de ser objetos, cadenas o listas si no se necesitan inicializar objetos vacíos o listas vacías y con un 0 si son de tipo entero o flotante. p.e.:
```javascript
// tipo string
var myString = null;
// tipo object
var myObject = {};
// tipo lista
var myList = [];
// tipo numero
var myInt = 0;
```

4.- Todas las declaraciones de variables deben estar en camel-case iniciando la primer letra con minúscula. p.e.:
```javascript
// declaración correcta de una variable
var myPrettyVar = null;

// declaraciones incorrectas de una variable
var my_pretty_var = null;

var my_prettyVar = null;

var MyPrettyVar = null;
```
