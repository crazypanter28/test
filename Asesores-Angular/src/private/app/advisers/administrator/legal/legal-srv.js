(function() {
    "use strict";

    function LegalSrv( URLS, $q, $http, csrfSrv ) {
        /**
         *  prospect service
         */
        function Legal(){}

        Legal.prototype.getAnnoucement = function () {
            return $q(function( resolve, reject ){
                $http({
                    method: 'GET',
                    url: URLS.getAnnoucement,
                    params:{
                        language: 'SPA'
                    }
                }).then(function(response) {
                    resolve( response.data );
                }).catch( reject );
            });
        };

        Legal.prototype.saveCSV = function ( _csv ) {
            return $q(function( resolve, reject ){

                csrfSrv.csrfValidate()
                .then(successCsrf)
                .catch(errorCsrf);

                function successCsrf() {
                    var parametersSubmit = {
                        announcement:_csv
                    };
                    $http({
                        method: 'POST',
                        url: URLS.updateAnnouncement,
                        data: $.param(parametersSubmit),
                        transformResponse: function(data){
                            data = {"status":1,"messages":[{"type":null,"criticality":null,"code":null,"description":"OPERACIÓN EXITOSA"}],"result":null};
                            return data;
                        }
                    }).then(function(response) {
                        resolve( response.data );
                    });
                }

                function errorCsrf(error) {
                    reject(error);
                }
                
            });
        };

        return new Legal();
    }

    angular.module('actinver.services')
        .service('LegalSrv', LegalSrv);
})();
