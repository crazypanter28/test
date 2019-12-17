# Tab table

#### Uso

Para hacer uso de la directuuva "Tab Table" agregala como un elemento o como un atributo.

```html
<tab-table></tab-table>
```
o
```html
<div tab-table></div>
```

### Atributos

Los atributos que recibe la directiva para su configuracion se enlistan a continuacion.

- label-button-back-tab : Es un texto que se mostrara en el boton de regresar tab (Opcional).

- label-button-next-tab : Es un texto que se mostrara en el boton de siguiente tab (Opcional).

- number-cols-by-tab : Debe ser un numero, el cual representa el numero de columnas que se mostraran por tab (Si no se establece esta propiedad no tendra tabs)(Opcional).

- number-row-by-pag : Debe ser un numero, el cual representa el numero de filas que se mostraran por pagina (Si no se establece esta propiedad no tendra paginado)(Opcional).

- set-data : Sera la variable de una funcion, que al ejecutarla desde el controller se le pasara como argumentos el arreglo del listado a pintar en la tabla (Obligatorio).

- order : Es un valor booleano, para definir si las columnas tendras la capacidad de ordenarse (Opcional).


#### Ejemplo.


Controller

```js
var list = [
    { name: 'Oscar', age: '27'}
    { name: 'Oscar1', age: '26'}
    { name: 'Oscar2', age: '25'}
    { name: 'Oscar3', age: '24'}
]
vm.setData( list );
```

Template

```html
tab-table( set-data="ctrl.setData" number-cols-by-tab="4" number-row-by-pag="10" label-button-next-tab="Más info" label-button-back-tab="Menos" order="true")
    table
        thead
            tr
                th( orderBy="name" ) Nombre
                th( orderBy="age" ) Edad
        tbody
            tr
                td {{ item.name }}
                td {{ item.age }}

```
