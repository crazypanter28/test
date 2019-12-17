(function () {
    "use strict";

    function actTableOrdersLumina(investmentSrv, investmentModalSrv, CommonModalsSrv, ErrorMessage) {

        var link = function (scope) {
            var isLoad = false;

            /** This function loads the orders of the day
            * @param {boolean}  Indicates if the function is loading
            **/
            function loadOrders(_isLoad) {
                scope.sortReverse = true;
                scope.sortType = 'order.orderReference';
                scope.loading = true;
                scope.orders = [];

                if (isLoad !== _isLoad) {
                    isLoad = _isLoad;
                    investmentSrv.getOrdersLumina(scope.contract, scope.type, scope.fechaordenes).then(function (_res) {
                        if (_res.data.outCommonHeader.result.result === 1) {
                            //TODO optimizar este codigo
                            var orden;
                            if (_res.data.outCapitalMarketOrderQuery.orderData && _res.data.outCapitalMarketOrderQuery.orderData.length > 0) {
                                orden = _res.data.outCapitalMarketOrderQuery.orderData;
                                var _details = [];
                                R.forEach(function (_val) {
                                    _details.push({
                                        orderReference: _val.orderReference,
                                        contractNumber: _val.contractNumber,
                                        operationDate: _val.captureDate.date,
                                        movementDescription: _val.operationType,
                                        operationType: _val.operationType === 'COMPRA' ? 'buy' : 'sell',
                                        modify: true,
                                        issuer: _val.instrumentDesc.operationType,
                                        amountTitles: _val.orderTitles.titlesQty,
                                        price: _val.orderPrice.price,
                                        titlesAssigned: _val.assignedTitles.titlesQty === -1 ? 0 : _val.assignedTitles.titlesQty,
                                        assignedPrice: _val.assignedPrice.price,
                                        pricev: _val.orderValuation.valuation,
                                        status: _val.orderStatus.operationType,
                                        secancela: _val.canceled === '1' ? true : false,
                                        statusDesc : _val.statusDesc
                                    });
                                }, orden);
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

            scope.modificar = function (_station) {
                scope.selected = _station;
            };

            scope.showinfostatus = function(message){
                CommonModalsSrv.info(message);
            };

            scope.delete = function (_order) {
                var message = '¿Estás seguro de cancelar la orden seleccionada?';
                CommonModalsSrv.warning(message).result.then(function () {
                    investmentSrv.deleteOrderLumina(_order)
                        .then(function () {
                            loadOrders();
                            // CommonModalsSrv.done(response.data.outCommonHeader.result.messages[0].responseMessage);
                            CommonModalsSrv.done("Solicitud de cancelación recibida");
                        })
                        .catch(function (error) {
                            CommonModalsSrv.error(ErrorMessage.createError(error.message));
                        });
                });
            };

            loadOrders();

            scope.$watch('contract', function () {
                loadOrders();
            });
            scope.$watch('fechaordenes', function () {
                loadOrders();
            });

            /**
            * This assignment allows to use the function from the controller or the view
            **/
            scope.update = loadOrders;
        };

        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/scripts/directives/table-orders-lumina/table-orders-lumina.html',
            scope: {
                contract: '@',
                tag: '@',
                update: '=?',
                type: '@?',
                fechaordenes: '=',
                selected: '=?',
            },
            link: link,
        };


    }


    angular.module('actinver.directives')
        .directive('actTableOrdersLumina', actTableOrdersLumina);


})();
