( function(){
    'use strict';

    function pDetailSrv( URLS, $q, $http ){

        var obj = {

            /**
             * Available contracts
             * @param {array} contracts - Array with all available contracts by client
             * @return  {object}
             */
            getAllContractsDetails: function( type, contracts ){
                var detail_reqs = [];
                // Get detail by contract
                angular.forEach( contracts, function( contract ){
                    if(contract.companyName === 'Casa'){
                        detail_reqs.push( obj.getContractDetail( type, contract.contractNumber ) );
                    }else{
                        detail_reqs.push( obj.getContractDetailBank( contract.contractNumber ) );
                    }

                } );

                // When all information is available
                return $q.all( detail_reqs );
            },

            getContractDetailBank: function ( contractNumber ) {
                return $q(function( resolve, reject ){

                    $http({
                        method: 'GET',
                        url: URLS.getContractDetailBank + contractNumber,
                        params: {
                            language: 'SPA'
                        }
                    }).then( function success( response ) {
                        if ( typeof response !== 'undefined' && response.data.outCommonHeader.result.result === 1 ){
                            resolve( {success: true, data: response.data.outFIXISSecuritiesPortfolioQuery.fundsList[0].fundPortfolioList} );
                        } else {
                            reject( {success: false, data: response.data, type: 'empty' } );
                        }

                    }, function error(){
                        reject( {success: false, type: 'not-found'} );
                    } );

                });
            },

            /**
             * Get contract detail info
             * @param {string} contract - Desired contract ID
             * @return  {object}
             */
            getContractDetail: function( type, contract ){

                return $q(function( resolve, reject ){

                    $http({
                        method: 'GET',
                        url: URLS.getContractDetail + contract.toString() + '/TM',
                        params: {
                            type: type,
                            language: 'SPA'
                        }
                    }).then( function success( response ) {
                        if ( typeof response !== 'undefined' && response.data.outCommonHeader.result.result === 1 ){
                            resolve( {success: true, data: response.data.outPortfolioDetailQuery.details} );
                        } else {
                            reject( {success: false, data: response.data, type: 'empty' } );
                        }

                    }, function error(){
                        reject( {success: false, type: 'not-found'} );
                    } );

                });
            },

            /**
             * Set totals by topic and by contract
             * @return  {object}
             */
            setTotals: function( contracts, currency_resume ){

                angular.forEach( contracts, function( contract ){

                    for( var y = 0; y < currency_resume.length; y++ ){

                        var item = contract.data.portfolioValue.portfolioValueByCurrency[y];
                        currency_resume[y][1][0].totalDebtInstruments += item.totalDebtInstruments;
                        currency_resume[y][1][1].totalPledgedValues += item.totalPledgedValues;
                        currency_resume[y][1][2].totalCapitalInstruments += item.totalCapitalInstruments;
                        currency_resume[y][1][3].notDefined += 0;
                        currency_resume[y][1][4].totalSettlementOperations += item.totalSettlementOperations;
                        currency_resume[y][1][5].totalCash += item.totalCash;
                        currency_resume[y][1][6].notDefined2 += 0;
                        currency_resume[y][1][7].totalPortfolioValue += item.totalPortfolioValue;

                    }

                } );

                return currency_resume;
            },

            /**
             * Get percent of an amount
             * @param {number} total - Total amount
             * @param {number} amount - Portion we want to know percent
             * @return  {number}
             */
            getPercentage: function( total, amount ){
                return ( ( amount * 100 ) / total ).toFixed(2);
            }

        };

        return obj;

    }

    angular
    	.module( 'actinver.controllers' )
        .service( 'pDetailSrv', pDetailSrv );

})();