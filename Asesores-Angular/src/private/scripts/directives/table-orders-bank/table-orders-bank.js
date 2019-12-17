(function(){
    "use strict";

    function actTableOrdersBank( investmentSrv, investmentModalSrv, CommonModalsSrv, ErrorMessage, fundBankDollSrv, $filter ) {

        var link = function( scope ) {
            //var isLoad = false;

            /** This function loads the orders of the day
            * @param {boolean}  Indicates if the function is loading
            **/
            function loadOrders(_date){
                var startDate, endDate, _startDate, _endDate;

                if(_date){
                    startDate = $filter('date')(_date.startDate._d, 'yyyy-MM-dd HH:mm:ss');
                    endDate = $filter('date')(_date.endDate._d, 'yyyy-MM-dd HH:mm:ss');
                    _startDate = $filter('date')(_date.startDate._d, 'yyyyMMdd');
                    _endDate = $filter('date')(_date.endDate._d, 'yyyyMMdd');
                }else{
                    startDate = $filter('date')(new Date(), 'yyyy-MM-dd 00:00:00');
                    endDate = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                    _startDate = $filter('date')(new Date(), 'yyyyMMdd');
                    _endDate = $filter('date')(new Date(), 'yyyyMMdd');
                }

                scope.sortReverse = true;
                scope.sortType = 'subOrders.operationDate';
                scope.loading = true;
                scope.orders = [];
                
                if(scope.type !== '2'){
                    investmentSrv.getOrdersBank(scope.contract, scope.type, startDate, endDate).then(function (_res) {
                        if (_res.data.outBankFundsAndMoneyMarketMvmntsQuery.movements.movement.length > 0 || _res.data.outBankFundsAndMoneyMarketMvmntsQuery !== null) {
                            var _orders = _res.data.outBankFundsAndMoneyMarketMvmntsQuery.movements.movement;
                            scope.orders = _orders;
                        }
                    }).finally(function () {
                        scope.loading = false;
                    });
                }else if(scope.type === '2'){
                    //scope.mailList = investmentSrv.getEmail();
                    investmentSrv.getOrdersMoneyMarketBank(scope.contract, _startDate, _endDate).then(function (_res) {
                        if (_res.data.outBankContractInvstMovementsQuery.movements.length > 0 || _res.data.outBankContractInvstMovementsQuery !== null) {
                             var _orders = _res.data.outBankContractInvstMovementsQuery.movements;
                             scope.orders = _orders;
                         }
                    }).finally(function () {
                        scope.loading = false;
                    });
                }
            }

            scope.viewMore = function( _order ){
                investmentModalSrv.moreInfoFundsBank( _order);
            };

            scope.delete = function( _order){
                var message = '¿Estás seguro de cancelar la orden seleccionada?';
                CommonModalsSrv.warning( message ).result.then(function() {
                    
                    if(scope.type === '2'){//si proviene de MoneyBank
                        deleteMoneyMarket(_order);
                    }else{ //normalmente proviene de fundsBank
                        switch (_order.transactionType) {
                            case 1:
                                //COMPRA FONDO
                                deleteFundBuy(_order);
                                break;
                            case 2:
                                //VENTA FONDO
                                deleteFund(_order);
                                break;
                            case 30:
                                //COMPRA DIRECTO
                                deleteDirectBuy(_order);
                                break;
    
                            case 37:
                                //COMPRA REPORT
                                deleteReportoBuy(_order);
                                break;
    
                            case 29:
                                //VENTA DIRECTO
                                deleteDirectSell(_order);
                                break;
                            }
                    }                   
                });
            };

            function clean(){
                scope.orders = [];
            }

            function deleteFundBuy(_order){
                var transaction = {
                    clientBankingArea: '001',
                    clientContractNumber: scope.contract,
                    language: 'SPA',
                    orderReference: _order.orderReference
                };
                var message = '';
                fundBankDollSrv.bankFundBuyCancelation(transaction).then(function (_res) {
                    if (_res.outCommonHeader.result.result === 1) {
                        angular.forEach(_res.outCommonHeader.result.messages, function (_resultado) {
                            message += _resultado.responseMessage;
                        });
                        CommonModalsSrv.done(message);
                        loadOrders();
                    } else {
                        var _error = _res.outCommonHeader.result.messages;
                        angular.forEach(_error, function (_res) {
                            message += _res.responseMessage + '<br>';
                        });
                        CommonModalsSrv.error(message);
                    }
                })
                    .catch(function (error) {
                        CommonModalsSrv.error(ErrorMessage.createError(error.message));
                    });

            }

            function deleteFund(_order){
                var transaction = { 
                     clientBankingArea: '001',
                     clientContractNumber: scope.contract,
                     language:'SPA',
                     orderReference: _order.orderReference 
                     };
                var  message='';
                fundBankDollSrv.bankFundSellCancelation(transaction).then(function(_res){
                    if (_res.outCommonHeader.result.result === 1) {
                        angular.forEach(_res.outCommonHeader.result.messages, function (_resultado) {
                            message += _resultado.responseMessage+'<br>';
                        });
                        CommonModalsSrv.done(message);
                        loadOrders();
                    }else{
                        var _error = _res.outCommonHeader.result.messages;
                        angular.forEach(_error, function (_res) {
                            message += _res.responseMessage+'<br>';
                        });
                        CommonModalsSrv.error(message);
                    }
                })
                .catch(function(error){
                    CommonModalsSrv.error(ErrorMessage.createError(error.message));
                });
            }

            function deleteMoneyMarket(_order) {
                investmentSrv.deleteOrderLumina(_order)
                    .then(function () {
                        loadOrders();
                        CommonModalsSrv.done("Solicitud de cancelación recibida");
                    })
                    .catch(function (error) {
                        CommonModalsSrv.error(ErrorMessage.createError(error.message));
                    });
            }

            function deleteDirectSell(_order) {
                investmentSrv.deleteDirectSell( _order, scope.contract)
                    .then(function(response){
                        loadOrders();
                        CommonModalsSrv.done( ErrorMessage.createError( response.data.outCommonHeader.result.messages) );
                    })
                    .catch(function(error){
                        CommonModalsSrv.error(ErrorMessage.createError(error.message));
                    });
            }

            function deleteDirectBuy(_order) {
                investmentSrv.deleteDirectBuy( _order)
                    .then(function(response){
                        loadOrders();
                        CommonModalsSrv.done( ErrorMessage.createError( response.data.outCommonHeader.result.messages) );
                    })
                    .catch(function(error){
                        CommonModalsSrv.error(ErrorMessage.createError(error.message));
                    });
            }

            /*loadOrders();

            scope.$watch( 'contract', function() {
                loadOrders();
            } );*/

            /**
            * This assignment allows to use the function from the controller or the view
            **/
            scope.update = loadOrders;
            scope.clean = clean;

            scope.aux={ 
                sortType:undefined,
                sortReverse:false
            };

            scope.viewLetter = function(operID, operDate, titular) {
                var _operDate = $filter('date')(operDate, 'yyyyMMdd');
                investmentModalSrv.reportoConfirmLetter(operID, _operDate, titular);
            };
        };

        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/scripts/directives/table-orders-bank/table.html',
            scope: {
                contract: '@',
                tag: '@',
                update: '=?',
                type: '@?',
                orders:'=?',
                clean:'=?',
                origin:'@?',
                holder: '@'
            },
            link : link
        };
    }

    angular.module( 'actinver.directives' )
           .directive( 'actTableOrdersBank', actTableOrdersBank );
} )();