(function() {
    "use strict";

    function capitalsIpcSrv($http, URLS, $q ) {

        /**
        *  investment Service
        */
        function Capitals(){}

        Capitals.prototype.getLastIPC = function( ){
            return $q(function(resolve, reject) {
                $http({
                    method: 'POST',
                    url: URLS.getLastIPC + '?language=SPA',
                }).then(function(_response){
                    try{
                        if ( _response.data.outCommonHeader.result.result === 1) {
                            resolve( _response.data.outStockMarketIndexQuery.stockMarketIndexTuple );
                        }
                        else{
                            reject(
                                _response.data.outCommonHeader.messages
                            );
                        }
                    }
                    catch(err){
                        console.log( 'reference error: ' + err );
                    }
                });
            });
        };

        Capitals.prototype.getCommission = function( _contractId ){
            return $q(function(resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getCommission + _contractId + '?language=SPA',
                }).then(function(_response){
                    try{
                        if ( _response.data.outCommonHeader.result.result === 1) {
                            resolve( _response.data.outContractCommissionAndValuationQuery );
                        }
                        else{
                            reject(
                                _response.data.outCommonHeader.messages
                            );
                        }
                    }
                    catch(err){
                        console.log( 'reference error: ' + err );
                    }
                });
            });
        };

        Capitals.prototype.getCommission34 = function( _contractId ){
            return $q(function(resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getCommission34 + _contractId + '?language=SPA',
                })
                .then( function( _res ){
                    if( _res.data && _res.data.outCapitalBandCatalog.capitalBand ){

                        resolve(
                            _res.data.outCapitalBandCatalog.capitalBand
                        );
                    }
                    else{
                        reject(
                            _res.data.outCommonHeader.messages
                        );
                    }
                });
            });
        };


        return new Capitals();
    }

    angular.module('actinver.services')
        .service('capitalsIpcSrv', capitalsIpcSrv);
})();
