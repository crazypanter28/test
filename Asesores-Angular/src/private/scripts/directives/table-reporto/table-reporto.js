(function(){
    'use strict';

    function tableReporto( reportoSrv ){

        var link = function( scope ){

            function init(){
                scope.loading = true;
                scope.bands = [];
            }

            function reporto() {
                // Get information
                reportoSrv.getReporto( scope.contract ).then( function( _res ){
                    var info;

                    if( _res.data.outCommonHeader.result.result === 1 ){
                        info = _res.data.outBondMarketBands.bondMarketBandsByInstrumentIDData[0].bondMarketBandsData;
                        scope.bands = ( info.length > 0 ) ? info : [];
                    }
                } )
                    .finally( function(){
                        scope.loading = false;
                    } );
            }

            function direct() {
                console.log('DIRECTO');
            }


            scope.$watch('tab', function(){
                init();
                switch ( scope.tab ){
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

            // Show doll form
            scope.showDoll = function( _band ){
                scope.instrument = _band;
            };

            init();

        };

        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/scripts/directives/table-reporto/table-reporto.html',
            scope: {
                contract: '@',
                instrument: '=',
                tab: '=',
            },
            link : link,
        };

    }

    angular
        .module( 'actinver.directives' )
        .directive( 'actTableReporto', tableReporto );

} )();