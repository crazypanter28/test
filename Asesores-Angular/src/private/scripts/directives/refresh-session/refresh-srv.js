(function() {
    "use strict";

    function RefreshSrv ( $http, $q, URLS, csrfSrv ) {

        function Refresh(){}


        Refresh.prototype.getTime = function () {
            return $q(function( resolve ){
                $http({
                    method: 'GET',
                    url: URLS.getTimeSession,
                }).then(function (response) {
                    resolve( response.data );
                });
            });
        };

        Refresh.prototype.updateSession = function () {
            return $q( function ( resolve, reject ) {
                csrfSrv.csrfHead()
                    .then( successCallback )
                    .catch();

                function successCallback () {
                    $http.post(URLS.updateSession)
                        .then(successCallback)
                        .catch(errorCallback);

                    function successCallback (response) {
                        resolve({
                            success : true,
                            token : response.data.access_token
                        });
                    }

                    function errorCallback (error) {
                        reject(error);
                    }
                }
            } );
        };

        return new Refresh();
    }

    angular.module('actinver.services')
        .service( 'RefreshSrv', RefreshSrv );
})();
