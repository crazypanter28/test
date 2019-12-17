(function(){
    'use strict';

    function tablePortfolioInv( investmentSrv, $rootScope, investmentModalSrv, CommonModalsSrv ){

        var link = function( scope ){
            var isLoad = false;


            /** This function loads the funds of the day
            * @param {boolean}  Indicates if the function is loading
            **/
            function loadPortfolio( _isLoad ){
                scope.sortReverse = true;
                scope.sortType = 'subOrders.operationDate';
                scope.orders = [];

                scope.loading = true;
                if( isLoad !== _isLoad ){
                    isLoad = _isLoad;
                    investmentSrv.getPortfolioInvestment( scope.contract, scope.type ).then( function(_res){
                        if( _res.data.outCommonHeader.result.result === 1  ){
                            //TODO optimizar este codigo
                            var portfolio;
                            if( _res.data.outPortfolioDetailQuery && _res.data.outPortfolioDetailQuery.portfolios.portfolioDetail.length > 0 ){
                                portfolio = _res.data.outPortfolioDetailQuery.portfolios.portfolioDetail;
                                var _details = [];
                                R.forEach(function( _val ){
                                    _details.push({
                                        issuer : _val.issuerName,
                                        serie : _val.serie.trim(),
                                        virtualCost : _val.cost,
                                        valuation : _val.titlesQty,
                                        accumulatedVariance : _val.appreciationPercentage,
                                        capitalGain : _val.appreciation,
                                        finalPosition : _val.finalPositionTitles,
                                        valuationLastPrice : _val.positionValuation,
                                        weightedLastPrice : _val.lastPrice,
                                        marketTypeDesc : _val.marketTypeDesc,
                                        portfolioType : _val.portfolioType,
                                        portfolioTypeDesc : _val.portfolioTypeDesc,
                                        currencyTypeKey : _val.currencyTypeKey,
                                        foreingExchangeRate : _val.foreingExchangeRate,
                                        finalPositionTitles  : _val.finalPositionTitles,
                                        settlementPosMoreThan72H: _val.settlementPosMoreThan72H,
                                        settlementPosition48H: _val.settlementPosition48H,
                                        settlementPosition24H: _val.settlementPosition24H,
                                        settlementPositionToday: _val.settlementPositionToday,
                                        saleAvailableTitles: _val.saleAvailableTitles,
                                        suspendedIndicator: _val.suspendedIndicator
                                    });
                                },portfolio);
                                _details.sort(_details.portfolioType);

                                var _groupOrders = [];
                                angular.forEach ( _.groupBy( _details, 'portfolioTypeDesc' ) , function( value){
                                    _groupOrders.push({
                                        title : value[0].portfolioTypeDesc,
                                        portfolioType:value[0].portfolioType,
                                        portfolio : value,
                                    });
                                });

                                $rootScope.capitalsPortfolio = portfolio;
                                scope.orders = _groupOrders;
                            }else{
                                scope.orders = [];
                            }
                        }
                    } )
                    .finally(function(){
                        scope.loading = false;
                        isLoad = false;
                    });
                }
            }

            loadPortfolio();

            scope.viewMoreTitles = function( _order ){
                investmentModalSrv.moreInfoTitles(_order);
            };

            scope.showInfoEmisora = function(order){        
                if(order && order.suspendedIndicator === '1'){
                    CommonModalsSrv.error("La emisora <b>" + order.issuer + " " + order.serie + "</b> se encuentra actualmente suspendida.");

                }else if(order){
                    $rootScope.ChangeDoll(order);
                }                              
            };
            scope.$watch( 'contract', function() {
                loadPortfolio();
            } );

            // Show no data message
            scope.nodata = ( typeof scope.nodata === 'undefined' ) ? 'No hay información' : scope.nodata;

            // This assignment allows to use the function from the controller or the view
            scope.update = loadPortfolio;

            $rootScope.ChangeDoll = function( _station ){
                scope.selected = _station;
                $rootScope.actionStation={type:'sell', origen:'portafolio', station: scope.selected, operationType: 'Casa', rand:Math.random()};
            };

            $rootScope.showDetails = function(topic){
                topic.show = topic.show ? false : true;
            };
        };

        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/scripts/directives/table-portfolio-investment/table.html',
            scope: {
                contract : '@',
                update : '=?',
                selected : '=?',
                type: '@?',
                nodata: '@?'
            },
            link : link,
        };


    }

    angular
        .module( 'actinver.directives' )
        .directive( 'tablePortfolioInv', tablePortfolioInv );

})();
