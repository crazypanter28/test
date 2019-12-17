(function() {
    "use strict";

    function EconomicSrv( URLS, $q, $http, csrfSrv ) {
        /**
         *  prospect service
         */
        function Economic(){}

        Economic.prototype.getEconomicEnvironment = function () {
            return $q(function( resolve, reject ){
                $http({
                    method: 'GET',
                    url: URLS.getEconomicEnvironment,
                    params:{
                        language: 'SPA'
                    }
                }).then(function(response) {
                    resolve( response.data );
                })
                .catch( reject );
            });
        };

        Economic.prototype.saveCSV = function ( _csv ) {
            return $q(function( resolve, reject ){

                csrfSrv.csrfValidate()
                .then(successCsrf)
                .catch(errorCsrf);

                function successCsrf() {

                    var parametersSubmit = { 
                        economicEnvironment: _csv
                    };

                    $http({
                        method: 'POST',
                        url: URLS.updateEconomicEnvironment,
                        data: $.param(parametersSubmit),
                        transformResponse: function(data){
                            data = {"status":data==='success' ? 1:2,"messages":[{"type":null,"criticality":null,"code":null,"description":data}],"result":null};
                            return data;
                        }
                    }).then(function(response) {                      
                        resolve(response.data);                        
                    });
                }

                function errorCsrf(error) {
                    reject(error);
                }
                
            });
        };

        return new Economic();
    }

    angular.module('actinver.services')
        .service('EconomicSrv', EconomicSrv);
})();
