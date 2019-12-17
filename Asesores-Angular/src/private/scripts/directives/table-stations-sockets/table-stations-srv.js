(function () {
    "use strict";

    function TableStationsSrv($http, URLS, $q) {

        /**
        *  investment Service
        */
        function TableStations() { }


        TableStations.prototype.getStations = function (_contract, _queryOpt) {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    //url: URLS.getCapitalsStation + _contract + '/' + _id1 + '/' + _id2 + '/0/0/1?language=SPA'
                    url: URLS.getNewCapitalsStation + _contract + '/' + _queryOpt + '/0/0/1?language=SPA&delFlag=false'
                })
                    .then(function (_res) {
                        if (_res.data.outCommonHeader.result.result === 1) {
                            resolve(_res.data.outContractIssuersMarketInfoQuery.marketDataTuple);
                        }
                        else {
                            reject('error');
                        }
                    });
            });
        };

        TableStations.prototype.getStationsLumina = function (_contract, _queryOpt, _instrumentType, _operationtype) {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    //url: URLS.getCapitalsStation + _contract + '/' + _id1 + '/' + _id2 + '/0/0/1?language=SPA&instrumentType=' + _instrumentType + '&isLumina=true&operationType=' + _operationtype
                    url: URLS.getNewCapitalsStation + _contract + '/' + _queryOpt + '/0/0/1?language=SPA&delFlag=false&isLumina=true&instrumentType=' + _instrumentType + '&isLumina=true&operationType=' + _operationtype
                })
                    .then(function (_res) {
                        if (_res.data.outCommonHeader.result.result === 1) {
                            resolve(_res.data.outContractIssuersMarketInfoQuery.marketDataTuple);
                        }
                        else {
                            reject('error');
                        }
                    });
            });
        };

        TableStations.prototype.getOptionsTypeOperation = function ( ) {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getOptionsTypeOperation + '?language=SPA'
                })
                    .then(function (_res) {
                        if (_res.data.outCommonHeader.result.result === 1) {
                            resolve(_res.data.result);
                        }
                        else {
                            reject('error');
                        }
                    });
            });
        };


        return new TableStations();
    }

    angular.module('actinver.services')
        .service('TableStationsSrv', TableStationsSrv);
})();
