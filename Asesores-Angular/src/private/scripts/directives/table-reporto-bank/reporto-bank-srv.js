(function(){
    'use strict';

    function reportoBankSrv( $http, URLS){
        /**
         *  Reporto Bank Service
         */
        function ReportoBank(){}

        ReportoBank.prototype.getReportoBands = function () {
            return $http({
                method: 'GET',
                url: URLS.getReportoBands,
                params: {
                    language: 'SPA'
                }
            });
        };

        ReportoBank.prototype.getDirectBands = function () {
            return $http({
                method: 'GET',
                url: URLS.getDirectBands + 'DINERO-DIRECTO',
                params: {
                    language: 'SPA'
                }
            });
        };

        ReportoBank.prototype.getAuctionBands = function () {
            return $http({
                method: 'GET',
                url: URLS.getAuctionBands,
                params: {
                    language: 'SPA'
                }
            });
        };
        return new ReportoBank();
    }

    angular
        .module('actinver.services')
        .service('reportoBankSrv', reportoBankSrv);
})();