(function(){
    'use strict';

    function remainingTime(){
        return function(input) {
            function time( _time ){
                var hr = parseInt( _time/60);
                var min =  _time - (hr * 60);
                return  (hr < 10 ? ('0'+hr) : hr ) + ':'+ (min < 10 ? ('0'+min) : min );
            }

          return time( input );
        };
    }

    angular.module( 'actinver.filters' )
        .filter( 'remainingTime', remainingTime );
})();
