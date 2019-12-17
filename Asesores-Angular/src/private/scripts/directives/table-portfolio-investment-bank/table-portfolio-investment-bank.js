(function(){
    'use strict';

    function tablePortfolioInvBank( investmentSrv, moment, CommonModalsSrv, directsBandsSrv ){

        var link = function( scope ){
            var bandsDirect = [];
            var isLoad = false;
            var instrumentoAux = null;
            scope.$watch( 'bandsDirect', function(_new, _old) {
                bandsDirect = _new;
            });

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
                    if(scope.type === '2'){
                        investmentSrv.getPortfolioInvestmentBank( scope.contract, scope.type ).then( function(_res){
                            if( _res.data.outCommonHeader.result.result === 1  ){
                                var portfolio = _res.data.outBankInvstFundsAndMMPositionsQuery.positions.positionInformation;
                                var _details = [];
                                
                                R.forEach(function( _val ){
                                    _details.push({
                                        idFund:  _val.fundID,
                                        serie:  _val.operationSource,
                                        position:_val.position,
                                        cost : _val.cost,
                                        currentPrice : _val.currentPrice,
                                        dueDate : _val.dueDate,
                                        emissionID : _val.emissionID,
                                        instrumentID : _val.emissionID,
                                        settlementDate : _val.settlementDate,
                                        titlesQty : _val.titlesQty,
                                        amount: _val.amount,
                                        netRate : _val.netRate.rate,
                                        appreciation : _val.appreciation,
                                        couponRate : _val.couponRate.rate,
                                        weightedAmount : _val.weightedAmount,
                                        foreignExchangeID: _val.foreignExchangeID
                                    });
                                },portfolio);
                                scope.orders = _details;
                            }
                        } )
                            .finally(function(){
                                scope.loading = false;
                                isLoad = false;
                            });
                    }else if(scope.type === '1'){
                        var _date =  moment(new Date()).format('YYYYMMDD');
                        investmentSrv.getPortfolioReportoBank( scope.contract, _date).then( function(_res){
                            if( _res.data.outCommonHeader.result.result === 1  ){
                                var portfolio = _res.data.outMoneyMarketIntradayPositionQuery.positionData;
                                var _details = [];
                                R.forEach(function( _val ){
                                    _details.push({
                                        idFund:  _val.instrumentID,
                                        serie:  _val.issuer,
                                        position:_val.titlesQty,
                                        cost : _val.closingPrice,
                                        currentPrice : _val.closingPrice,
                                        emissionID : _val.instrumentID,
                                        instrumentID : _val.instrumentID,
                                        positionType : _val.positionType,
                                        titlesQty : _val.titlesQty,
                                        warrantyTitles: _val.warrantyTitles,  
                                        amount: _val.unitCostValuation,
                                        netRate : _val.plusMinusCalc,
                                        appreciation : _val.plusMinusCalc,
                                        couponRate : _val.plusMinusCalc,
                                        weightedAmount : _val.unitCostValuation,
                                        lastPrice: _val.lastPrice,
                                        instrumentDesc: _val.instrumentID,
                                        origen: 'POSICION',
                                        exchangeRate:_val.exchangeRate
                                    });
                                },portfolio);
                                
                                scope.orders = _details;
                            }
                        } )
                            .finally(function(){
                                scope.loading = false;
                                isLoad = false;
                            });
                    }

                }
            }

            loadPortfolio();
            /*
           scope.$watch( 'contract', function() {
                loadPortfolio();
            } );

            */
            function selectEmisora( data){
                var temp = JSON.parse(instrumentoAux);
                temp.term= data.term;
                temp.selectedInstrument = data;                
                scope.selected = temp;
            }
            // Show no data message
            scope.nodata = ( typeof scope.nodata === 'undefined' ) ? 'No hay información' : scope.nodata;

            // This assignment allows to use the function from the controller or the view
            scope.update = loadPortfolio;

            scope.ChangeDoll = function( _station ){
                var optionsBands = [];
                instrumentoAux = JSON.stringify(_station);
                if(_station && _station.positionType && _station.positionType.toUpperCase() === 'DIRECTO' && scope && scope.tabseleccion === 1 ){
                    if(bandsDirect != null && bandsDirect.length > 0){
                        bandsDirect.forEach(function(r){
                            if(r.instrumentDesc.toUpperCase() === _station.instrumentDesc.toUpperCase() && r.averagePurchaseMargin !== null){
                                r.selected = false;
                                optionsBands.push(r);
                            }
                        });

                        if(optionsBands.length < 1){
                            CommonModalsSrv.done("No existen bandas para operar");
                        }else{
                            directsBandsSrv.information(optionsBands, selectEmisora);
                        }
                    }else{
                        CommonModalsSrv.done("No existen bandas para operar");
                    }
                }else{
                    scope.selected = _station;
                }                           
            };
            scope.aux={
                sortType:undefined ,
                sortReverse:false
            };
        };
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/scripts/directives/table-portfolio-investment-bank/table.html',
            scope: {
                contract : '@',
                update : '=?',
                selected : '=?',
                type: '@?',
                nodata: '@?',
                orders: '=?',
                bandsDirect:'=?',
                tabseleccion:'=?'
            },
            link : link,
        };


    }

    angular
        .module( 'actinver.directives' )
        .directive( 'tablePortfolioInvBank', tablePortfolioInvBank );

})();
