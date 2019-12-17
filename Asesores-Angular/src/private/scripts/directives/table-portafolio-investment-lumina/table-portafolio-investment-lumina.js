(function () {
    'use strict';

    function tablePortfolioInvLumina(investmentSrv, $rootScope) {

        var link = function (scope) {
            var isLoad = false;

            /** This function loads the funds of the day
            * @param {boolean}  Indicates if the function is loading
            **/
            function loadPortfolio(_isLoad) {
                scope.sortReverse = true;
                scope.sortType = 'subOrders.operationDate';
                scope.orders = [];

                scope.loading = true;
                if (isLoad !== _isLoad) {
                    isLoad = _isLoad;
                    investmentSrv.getPortfolioInvestmentLumina(scope.contract, scope.type).then(function (_res) {

                        if (_res.data.outCommonHeader.result.result === 1) {
                            //TODO optimizar este codigo
                            var portfolio;
                            if (_res.data.outCapitalMarketPositionQuery.positionData && _res.data.outCapitalMarketPositionQuery.positionData.length > 0) {
                                portfolio = _res.data.outCapitalMarketPositionQuery.positionData;
                                var _details = [];

                                R.forEach(function (_val) {
                                    var _issuerName = (_val.instrumentDesc.operationType).split(' ');
                                    _details.push({
                                        issuer: _val.instrumentDesc.operationType,
                                        issuerName: _issuerName[1],
                                        serie: _issuerName[2],
                                        finalPosition: _val.titlesQty.titlesQty,
                                        virtualCost: _val.unitCost.price,
                                        weightedLastPrice: _val.closingPrice.price,
                                        valuationLastPrice: _val.valuation.valuation,
                                        capitalGain: _val.capitalGain.price,
                                        accumulatedVariance: _val.calculatedCapitalGain.price,
                                        instrumentDesc : _val.instrumentDesc.operationType
                                    });
                                }, portfolio);
                                $rootScope.capitalsPortfolioBank = portfolio;
                                scope.orders = _details;
                            }                            

                        }

                    })
                        .finally(function () {
                            scope.loading = false;
                            isLoad = false;
                        });
                }
            }

            loadPortfolio();

            scope.$watch('contract', function () {
                loadPortfolio();
            });

            // Show no data message
            scope.nodata = (typeof scope.nodata === 'undefined') ? 'No hay información' : scope.nodata;

            // This assignment allows to use the function from the controller or the view
            scope.update = loadPortfolio;

            scope.ChangeDoll = function (_station) {
                scope.selected = _station;
                $rootScope.actionStation={type:'sell', origen:'portafolio', station: scope.selected, contract: scope.contract, operationType: 'Banco',  rand:Math.random()};
            };
        };

        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/scripts/directives/table-portafolio-investment-lumina/table-lumina.html',
            scope: {
                contract: '@',
                update: '=?',
                selected: '=?',
                type: '@?',
                nodata: '@?'
            },
            link: link,
        };


    }

    angular
        .module('actinver.directives')
        .directive('tablePortfolioInvLumina', tablePortfolioInvLumina);

})();
