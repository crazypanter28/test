( function(){
    'use strict';

    function split(){

        return function( input, splitChar, splitIndex ){
            return input ? input.split( splitChar )[ splitIndex ] : '';
        };
    }

    angular
        .module( 'actinver.filters' )
        .filter( 'split', split );

})();
