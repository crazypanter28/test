(function(){
    'use strict';

    function tableReportoBank( reportoBankSrv ){

        var link = function( scope ){

            function init(){
                scope.loading = true;
                scope.bandsReporto = [];
                scope.bandsDirect = [];
                scope.bandsAuction = [];
            }

            // Show doll form
            scope.showDoll = function( _band ){
                scope.instrument = _band;
            };

            function reporto() {
                reportoBankSrv.getReportoBands( scope.contract ).then( function( _res ){
                    var info;
                    if( _res.data.outCommonHeader.result.result === 1 ){
                        info = _res.data.outMoneyMarketBandsReportoQuery.bandsReportData;
                        scope.bandsReporto = ( info.length > 0 ) ? info : [];
                    }
                } )
                .finally( function(){
                    scope.loading = false;
                } );
            }

            function direct() {
                reportoBankSrv.getDirectBands().then(function( _res ){
                    var info;
                    if( _res.data.outCommonHeader.result.result === 1 ){
                        info = _res.data.outMoneyMarketBandsDirectQuery.bandsDirectData;
                        if(info !== null && info.length > 0 ){
                            info.forEach(function(r){
                                if(r.priceType !== null && r.priceType.toUpperCase() === "YIELD"){
                                    r.averagePurchaseMargin = r.averagePurchaseMargin * 100;
                                }
                            });
                        }
                        scope.bandsDirect = ( info.length > 0 ) ? info : [];
                    }
                })
                .finally( function(){
                    scope.loading = false;
                } );
            }

            function auctionBands(){
                reportoBankSrv.getAuctionBands().then(function( _res ){
                    var info;
                    if( _res.data.outCommonHeader.result.result === 1 ){
                        info = _res.data.outMMAuctionsQuery.auction;
                        scope.bandsAuction = ( info.length > 0 ) ? info : [];
                    }
                })
                .finally( function(){
                    scope.loading = false;
                } );
            }

            scope.$watch('tab', function(){
                init();
                switch ( scope.tab ){
                    case 3:
                        auctionBands();
                        break;
                    case 2:
                        reporto();
                        break;
                    case 1:
                        direct();
                        break;
                    default:
                        break;
                }
            });

            init();

        };

        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/scripts/directives/table-reporto-bank/table-reporto-bank.html',
            scope: {
                contract: '@',
                instrument: '=',
                tab: '=',
                id: '@',
                bandsDirect:"=?"
            },
            link : link,
        };

    }

    angular
        .module( 'actinver.directives' )
        .directive( 'actTableReportoBank', tableReportoBank );

} )();