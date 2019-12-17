(function() {
    "use strict";

    function creditSrv( URLS, $q, $http, ErrorMessagesSrv ) {
        /**
         *  prospect service
         */
        function Credit(){}

        Credit.prototype.quotation = function ( _model ) {

            return $q(function( resolve, reject ){
                $http({
                    method: 'POST',
                    url: URLS.getCreditDetail,
                    params:{
                        language : 'SPA'
                    },
                    data: _model
                }).then(function(response) {
                    if( response.data.status === 1){
                        resolve( response.data.result );
                    }
                    else {
                        ErrorMessagesSrv( response.data.messages );
                        reject();
                    }
                });
            });
        };


        Credit.prototype.getSimPayment = function ( _model ) {

            return $q(function( resolve, reject ){
                $http({
                    method: 'POST',
                    url: URLS.getSimPayment,
                    params:{
                        language : 'SPA'
                    },
                    data: (_model || {})
                }).then(function(response) {
                    if( response.data.status === 1){
                        resolve( response.data.result );
                    }
                    else {
                        ErrorMessagesSrv( response.data.messages );
                        reject();
                    }
                });
            });
        };


        return new Credit();
    }

    angular.module('actinver.services')
        .service('creditSrv', creditSrv);
})();
