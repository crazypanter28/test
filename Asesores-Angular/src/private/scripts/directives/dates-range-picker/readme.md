# Date Range Picker

#### Uso

Para hacer uso de la diretiva "Date Range Picker" agregala como un elemento o como un atributo.

```html
<dates-range-picker></dates-range-picker>
```
o
```html
<div dates-range-picker> </div>
```


#### Atributos

Los atributos que recibe la directiva para su cofiguracion se enlistan a continuacion.

- label :  Es el texto que se escribira como leyenda para el calendario (Opcional).

- placeholder : Es el texto que se agregara como placeholder (Opcional)

- date : Es una variable en donde se seteara con el rango de fecha seleccionada (Opcional).

- options : Es un objeto con las opciones para el calendario, si necesita reemplacar la configuracion por default puede ver todas las opciones disponibles en https://github.com/fragaria/angular-daterangepicker (Opcional).

- on-change : Pase una funcion la cual se llamara cuando se haya seteado un nuevo rango de fechas y recibira como parametro una variable con el nuevo rango de fecha(Opcional).


#### Ejemplo.


Controller

```js
$scope.date = null;


$scope.foo = function ( _date ) {
    console.log(_date);
}

$scope.options = {
    locale: {
        format: "DD/MM/YYYY",
    }
};
```

Template
```html
<dates-range-picker label="Periodo de búsqueda" placeholder="dd/mm/aaaa - dd/mm/aaaa" date="date" on-change="foo" options="options"></dates-range-picker>
```
