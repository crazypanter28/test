( function () {
    "use strict";

    function portfolioDetailService ( $http, $q, URLS ) {
        return {
            detailsBanks : detailsBanks,
            detailsBanksLumina : detailsBanksLumina,
            detailsBanksMoney : detailsBanksMoney,
            detail : detail
        };

        function detailsBanks ( contractNumber, _type ) {

            return $q( function ( resolve, reject ) {
                $http({
                    method: 'GET',
                    url: URLS.getPortfolioBank + contractNumber + '/' + _type + '/0',
                    params: {
                        language: 'SPA'
                    }
                }).then( function success( response ) {
                    if ( typeof response !== 'undefined' && response.data.outCommonHeader.result.result === 1 ){
                        resolve( {success: true, data: response.data.outBankInvstFundsAndMMPositionsQuery.positions.positionInformation, contract: contractNumber});
                    } else {
                        reject( {success: false, data: response.data, type: 'empty' } );
                    }

                }, function error(){
                    reject( {success: false, type: 'not-found'} );
                } );

            });

        }

        function detailsBanksMoney ( contractNumber, _date ) {
            return $q( function ( resolve, reject ) {
                return $http({
                    method: 'GET',
                    url: URLS.getPortfolioReporto + contractNumber + '/' + _date,
                    params: {
                        language: 'SPA'
                    }
                }).then( function success( response ) {
                    if ( typeof response !== 'undefined' && response.data.outCommonHeader.result.result === 1 ){
                        resolve( {success: true, data: response.data.outMoneyMarketIntradayPositionQuery.positionData, contract: contractNumber});
                    } else {
                        reject( {success: false, data: response.data, type: 'empty' } );
                    }

                }, function error(){
                    reject( {success: false, type: 'not-found'} );
                } );

            });

        }

        function detailsBanksLumina ( contractNumber, _date ) {
            return $q( function ( resolve, reject ) {
                return $http({
                    method: 'POST',
                    url: URLS.getAccionesLumina + '?contractNumber=' + contractNumber + '&date=' + _date,
                    params: {
                        language: 'SPA'
                    }
                }).then( function success( response ) {
                    if ( typeof response !== 'undefined' && response.data.outCommonHeader.result.result === 1 ){
                        resolve( {success: true, data: response.data.outCapitalMarketPositionQuery.positionData, contract: contractNumber});
                    } else {
                        reject( {success: false, data: response.data, type: 'empty' } );
                    }

                }, function error(){
                    reject( {success: false, type: 'not-found'} );
                } );

            });

        }

        function detail ( contract ) {
            return $q( function ( resolve, reject ) {
                $http({
                    method: 'GET',
                    url: URLS.getContractDetail + contract.toString() + '/TM',
                    params: {
                        language: 'SPA'
                    }
                }).then( function ( response ) {
                    if ( typeof response !== 'undefined' && response.data.outCommonHeader.result.result === 1 ){
                        resolve( {success: true, data: response.data.outPortfolioDetailQuery.portfolios.portfolioDetail, contract: contract} );
                    } else {
                        reject( {success: false, data: response.data, type: 'empty' } );
                    }

                }).catch( function (){
                    reject( {success: false, type: 'not-found'} );
                });
            });
        }
    }

    angular
        .module( 'actinver.controllers' )
        .service( 'portfolioDetailService', portfolioDetailService );
})();