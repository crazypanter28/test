( function(){
    'use strict';

    function showAsDate(){

        return function( date ){
            return date ? date.substring(6,8) + '/' + date.substring(4,6) + '/' + date.substring(0,4) : '';
        };
    }

    angular
        .module( 'actinver.filters' )
        .filter( 'showAsDate', showAsDate );

})();
