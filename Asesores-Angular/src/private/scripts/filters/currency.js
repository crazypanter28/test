(function(){
    'use strict';

    function filterCurrency(){
        return function( _number,  _index ){
            if( _number !== null && !isNaN(_number) ){
                var number = _number.toString();
                var index = number.indexOf('.');
                if( index === -1){
                    return number;
                }
                else if( _index === 0 ){
                    return number.substr( 0, index );
                }
                else{
                    return number.substr( 0, index + ( _index || 2 ) + 1 );
                }
            }
            return null;
        };
    }

    angular.module( 'actinver.filters' )
        .filter( 'currencyCustom', filterCurrency );
})();
