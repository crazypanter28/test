(function() {
    'use strict';

    function reportoSrv( $http, URLS ){

        /**
        *  Reporto Service
        */
        function Reporto(){}

        Reporto.prototype.getReporto = function( _contract ){
            return $http({
                method: 'get',
                url: URLS.getReporto + _contract +'/1/0/0/0',
                params: {
                    language: 'SPA'
                }
            });
        };

        return new Reporto();
    }

    angular
        .module( 'actinver.services' )
        .service( 'reportoSrv', reportoSrv );

})();