# loops e iteraciones

1.- Ninguna variable debe ser declarada dentro del ciclo, todas las variables que se deban usar ya sea en la iteracion o en las condiciones se deben declarar antes de que comience la iteración. p.e.:
```javascript
var i = 0;
var iteration = 9;
for ( i = 0 ; iteration <= 10 ; i++ ) { ... }
```

2 .- Para los ciclos `foreach` también las variables se deben declarar antes. p.e.:
```javascript
var index = null;
for ( index in myArray ) { ... }
```
