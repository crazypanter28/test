
(function() {
    "use strict";

    function HelpSrv( URLS, $q, $http ) {
        /**
         *  prospect service
         */
        function Help(){}


        Help.prototype.getVideos = function ( ) {
            return $q(function( resolve, reject ){
                $http({
                    method: 'GET',
                    url: URLS.getVideos,
                }).then(function(response) {
                    if( response.data.status === 1 ){
                        resolve( response.data.result );
                    }
                    else{
                        reject();
                    }
                })
                .catch( reject );
            });
        };

        Help.prototype.getQuestions = function ( ) {
            return $q(function( resolve, reject ){
                $http({
                    method: 'GET',
                    url: URLS.getQuestions,
                }).then(function(response) {
                    if( response.data.status === 1 ){
                        resolve( response.data.result );
                    }
                    else{
                        reject();
                    }
                })
                .catch( reject );
            });
        };


        Help.prototype.sendComment = function ( ) {
            return $q(function( resolve, reject ){
                $http({
                    method: 'POST',
                    url: URLS.genericPost,
                }).then(function(response) {
                    if( response.data.status === 1 ){
                        resolve( response.data.result );
                    }
                    else{
                        reject();
                    }
                })
                .catch( reject );
            });
        };



        return new Help();
    }

    angular.module('actinver.services')
        .service('HelpSrv', HelpSrv);
})();
