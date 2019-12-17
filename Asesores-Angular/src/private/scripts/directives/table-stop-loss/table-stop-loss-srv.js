(function() {
    "use strict";

    function TableStopLossSrv($http, URLS ) {

        /**
        *  investment Service
        */
        function TableStopLoss(){}


        TableStopLoss.prototype.getCapitalStop = function( _contract, type ){
            return $http({
                method: 'GET',
                url: URLS.getCapitalStop + _contract + '/' + ( type || 'SL' ) + '?language=SPA',
            });
        };


        return new TableStopLoss();
    }

    angular.module('actinver.services')
        .service('TableStopLossSrv', TableStopLossSrv);
})();
