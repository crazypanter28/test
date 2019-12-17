




(function(){
    'use strict';

    function range(){
        return function(input, total) {
          total = parseInt(total);

          for (var i=0; i < total; i++) {
            input.push(i);
          }

          return input;
        };
    }

    angular.module( 'actinver.filters' )
        .filter( 'range', range );
})();
