( function(){
    'use strict';

    function capitalize(){

		return function( text ) {
      		return ( !!text ) ? text.charAt(0).toUpperCase() + text.substr(1).toLowerCase() : '';
    	};
    }

    angular
        .module( 'actinver.filters' )
        .filter( 'capitalize', capitalize );

})();