# Espaciados, argumentos y parametros

Esta estandarización se debe seguir en todo momento para que los desarrolladores puedan tener un código homogéneo en todo el desarrollo.

1.- Debe existir un espacio antes y después de un igual, de un igual-igual-igual, de un menor que y de un mayor que. p.e.:

```javascript
// antes y después de un igual
var x = 0;
let y = 0;
const z = 0;

// antes y después de un igual-igual-igual
if ( x === 12 ) { ... }

// antes y después de un menor que
if ( y <= 12 ) { ... }

// antes y después de un mayor que
if ( z >= 12 ) { ... }
```

2.- Siempre se deben escribir triples iguales. p.e.:

```javascript
// igual a ...
if ( x === 1 ) { ... }

// diferente de
if ( y !== 1 ) { ... }
```
3.- Siempre debe existir un espacio antes y uno después de cada parametro en un método o condicional. p.e.:

```javascript
// declarando un método/función
function myFunction ( _param1, _param2, ..., _paramN ) { ... }

// declaración de una función arrow
const myFunction = ( _param1, _param2, ..., _paramN ) => { ... }

// en typescript
myFunction ( _param1: string, _param2:number, ..., _paramN:boolean ) { ... }

// ejecutando un método/función
myFunction( param1, param2, ..., paramN );

// en un condicional
if ( conditionalExpression ) { ... }

while( conditionalExpression ) { ... }

for ( initialization ; conditionalExpression ; afterExecution ) { ... }

do { ... } while( conditionalExpression );
```

4.- Siempre debe existir un espacio entre la declaración del condicional o del método/función y la llave de su contenido de instrucciones.p.e.:
```javascript
// declaración de un método/función
function myFunction () { ... }

// declaración de un condicional y ciclos
while ( conditionalExpression ) { ... }
```

5.- Si un método/función no necesita parametros, los paréntesis deben permanecer sin espacios, sin embardo debe existir un espacio entre el nombre del método/función y el primer paréntesis aunque el método/función necesite parametros o no. p.e.:

```javascript
// declaración de método/función
function myFunction () { ... }
```

6.- Los parametros de un método siempre deben iniciar con un guión bajo (_) para poder identificar entre las variables locales y los parametros. p.e.:

```javascript
// declaración de método
function myFunction ( _param1, _param2, ..., _paramN ) { ... }

// declaración de una función arrow ( siempre como const )
const myFunction = () => { ... }
```

7.- Las funciones arrow deben llevar siempre los parentecis sin importar la cantidad de argumentos que se le pasarán

```javascript
// si no lleva argumentos
const myFunction = () => { ... }

// si lleva un sólo argumento
const myFunction = ( _param1 ) => { ... }

// si lleva N argumentos
const myFunction = ( _param1, _param2, ..., _paramN ) => { ... }
```

8.- uando un método se ejecuta, si necesita parametros, estos se deben colocar con un espacio antes del primer parametro, también un espacio después de la coma y un espacio después del último parametro. p.e.:

```javascript
// ejecución de un método
myFunction( param1, param2, ..., paramN );
```
