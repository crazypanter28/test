# métodos y funciones

Hay diferentes formas de crear métodos o funciones, para el proyecto, la forma correcta de hacer la declaración de las funciones es la siguiente:

> - **Todos los archivos deben ser una función anónima**
> - **La tabulación siempre con 4 "espacios", no debe haber caracteres TAB dentro de ninguno de los archivos**

Así como en Java que cada clase tiene su propio archivo Java, en JS ahora cada funcionalidad (  _controller, factory, directive, etc._ ) debe tener su propio archivo para poder identificar de que se trata cada parte de la funcionalidad. Esto hace mucho más sencilla la forma de hacer un debug y en su caso realizar modificaciones o actualizaciones.

Cada archivo debe consituirse de la siguiente forma:
```javascript
// Todo encapsulado en una función anónima para evitar variables globales
( function() => {
    // IMPORTANTE: un espaciado de 3 saltos de linea entre cada método o función



    // beg: métodos y funciones
    function MyParentController( $scope ){




        // el primer método siempre tiene que ser el setup
        function setup(){ ... }



        // beg: espacio para métodos públicos o que se agregan al scope de la vista
        $scope.myPublicMethod = function(){ ... }



        this.myOtherPublicMethod = function(){ ... }
        // end: espacio para métodos públicos o que se agregan al scope de la vista



        // beg: espacio para métodos privados
        functionmyPrivateMethod(){ ... }
        // end: espacio para métodos privados



        // finalmente la ejecución del método de setup
        setup()
    }
    // end: métodos y funciones

} )()
```
