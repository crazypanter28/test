(function() {
    "use strict";

    function reactivateSrv( URLS, $q, $http ) {
        /**
         *  prospect service
         */
        function Reactivate(){}

        Reactivate.prototype.getProfile = function ( _model ) {

            return $q(function( resolve ){
                $http({
                    method: 'POST',
                    url: URLS.genericPost,
                    data : _model
                }).then(function(response) {
                    if( response.data.status ){
                        resolve( response.data.result );
                    }
                });
            });
        };


        Reactivate.prototype.reactivate = function ( _prospect, _activity ) {

            return $q(function( resolve ){
                $http({
                    method: 'POST',
                    url: URLS.genericPost,
                    data : {
                        prospect :_prospect,
                        activity: _activity
                    }
                }).then(function(response) {
                    if( response.data.status ){
                        resolve( response.data.result );
                    }
                });
            });
        };


        return new Reactivate();
    }

    angular.module('actinver.services')
        .service('reactivateSrv', reactivateSrv);
})();
