(function () {
    "use strict";
    angular
        .module('actinver.services')
        .service( 'csrfSrv', csrfSrv );

    function csrfSrv ( $http, $q, URLS ) {
        return {
            csrfHead : csrfHead,
            csrfValidate : csrfValidate
        };

        function csrfHead () {
            return $q( function ( resolve, reject ) {
                $http.head(location.href)
                    .then( successCallback )
                    .catch( errorCallback );

                function successCallback (csrf) {
                    sessionStorage.setItem('__csrf',csrf.headers('X-CSRF-TOKEN'));
                    resolve({
                        success : true
                    });
                }

                function errorCallback (error) {
                    reject({
                        success: false,
                        data:{},
                        error : error,
                        message: "Ha ocurrido un error de seguridad"
                    });
                }
            } );
        }

        function csrfValidate () {
            return $q( function ( resolve, reject ) {
                $http.get(URLS.csrfRest)
                    .then( successCallback )
                    .catch( errorCallback );

                function successCallback (csrf) {
                    sessionStorage.setItem('__csrf',csrf.headers('X-CSRF-TOKEN'));
                    resolve({
                        success : true
                    });
                }

                function errorCallback (error) {
                    reject({
                        success: false,
                        data:{},
                        error : error,
                        message: "Ha ocurrido un error de seguridad"
                    });
                }
            });
        }
    }
})();