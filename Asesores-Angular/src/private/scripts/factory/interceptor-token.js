( function() {
    "use strict";

    function interceptorToken( $q, $injector, cfpLoadingBar ) {

        var BASE_PATH = (!window.location.port) ? window.location.protocol + '//' + window.location.hostname : window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;
        var CONTEXT = "/asesoria-restful";

        return {
            request : request
        };

        function request(config) {

            cfpLoadingBar.complete();

            if ( (config.method === 'POST' || config.method === 'PUT' || config.method === 'DELETE') && !(config.url.indexOf('authentication/token') > 0 || config.url.indexOf('logout') > 0 ) ) {
                return getCsrf().then( function ( response ) {
                    config.headers["X-CSRF-TOKEN"] = response.csrf;
                    config.headers.Authorization = 'bearer ' + sessionStorage.getItem("__token") || '';
                    config.headers['Content-Type'] = config.headers && angular.isDefined(config.headers.ocupateMyHeader) && config.headers.ocupateMyHeader ? config.headers['Content-Type'] : 'application/x-www-form-urlencoded; charset=UTF-8';
                    return config;
                });
            }

            config.headers.Authorization = 'bearer ' + sessionStorage.getItem("__token") || '';
            config.headers['X-CSRF-TOKEN'] = sessionStorage.getItem("__csrf") || '';
            return config;
        }

        function getCsrf () {
            
            cfpLoadingBar.complete();

            return $injector.get ( '$http' ) ( {
                method: 'GET',
                url: BASE_PATH + CONTEXT + '/api/asesoria/validate'
            }).then ( function ( response ) {
                return {
                    csrf : response.headers('X-CSRF-TOKEN')
                };
            }).catch( function ( error) {
                console.log('Error', error);
            });
        }

    }

    angular
        .module( 'actinver.services' )
        .factory( 'interceptorToken', interceptorToken );

})();
