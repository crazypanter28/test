( function(){
    'use strict';

    function groupJSON(){

        return function( xs, key ){

            return xs ? xs.reduce( function( rv, x ){
                ( rv[x[key]] = rv[x[key]] || [] ).push( x );
                return rv;
            }, {} ) : [];
        };
    }

    angular
        .module( 'actinver.filters' )
        .filter( 'groupJSON', groupJSON );

})();
