(function(){
    "use strict";

    function actTableOrders( investmentSrv, investmentModalSrv, CommonModalsSrv, ErrorMessage ){

        var link = function( scope ){
            //var isLoad = false;

            /** This function loads the orders of the day
            * @param {boolean}  Indicates if the function is loading
            **/
            function loadOrders( _date ){
                scope.sortReverse = true;
                scope.sortType = 'subOrders.operationDate';
                scope.loading = true;
                scope.orders = [];
                var startDate=null;
                var endDate =null;

               // if( isLoad !== _isLoad ){
                 //   isLoad = _isLoad;


                 if(_date){
                     
                    startDate = moment( _date.startDate._d ).format( 'DDMMYYYY' );
                    endDate = moment( _date.endDate._d ).format( 'DDMMYYYY' );
                   // console.info("Fechas",startDate,endDate);

                }


                    investmentSrv.getOrders( scope.contract, scope.type ,startDate,endDate).then( function(_res){
                        //console.info("valor:",_res.data.ordersList);
                        if( _res.data.outOrdersByDateQuery.orders){
                            var _orders = _res.data.outOrdersByDateQuery.orders;
                            angular.forEach( _orders, function( _val, _key ){
                                _orders[_key].issuer = _val.order.issuer.issuerName + ' ' + _val.order.issuer.serie;
                            });
                            scope.orders = _orders;
                        }
                    } )
                    .finally(function(){
                        scope.loading = false;
                      //  isLoad = false;
                    });
                //}
            }

            scope.viewMore = function( _order ){
                if(scope.type === 'MC'){
                    investmentSrv.moreInfoCapital( scope.contract, _order.order.orderReference).then(function(_res){
                        if(_res.data.outCommonHeader.result.result === 1){
                            investmentModalSrv.moreInfoMarketOrder( _res.data.outCapitalMarketOrderDetailQuery, _order.order);
                        }
                    });
                }else{
                    investmentSrv.moreInfo( scope.contract, _order.order.orderReference).then(function(_res){
                        if(_res.data.outCommonHeader.result.result === 1){
                            investmentModalSrv.moreInfo( _res.data.outFundsOrderDetailQuery);
                        }
                    });
                }
            };

            scope.delete = function( _order){
                var message = '¿Estás seguro de cancelar la orden seleccionada?';
                CommonModalsSrv.warning( message ).result.then(function() {
                    if(scope.type === 'MC'){
                        investmentSrv.deleteMarket( _order)
                            .then(function(response){
                                loadOrders();
                                CommonModalsSrv.done( ErrorMessage.createError(response.data.outCommonHeader.result.messages));
                            })
                            .catch(function(error){
                                CommonModalsSrv.error(ErrorMessage.createError(error.message));
                            });
                    }else{
                        investmentSrv.delete( scope.contract, _order)
                            .then(function(){
                                loadOrders();
                                CommonModalsSrv.done( 'Se ha realizado la cancelación de manera exitosa.' );
                            })
                            .catch(function(error){
                                CommonModalsSrv.error(ErrorMessage.createError(error.message));
                            });
                    }
                });
            };

            /**Funcion para limpiar las ordenes  */
            function clean(){
                scope.orders = [];
                //console.info("clean:",scope.orders);
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
        };

        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/scripts/directives/table-orders/table.html',
            scope: {
                contract : '@',
                tag: '@',
                update : '=?',
                type: '@?',
                clean:'=?',
                origin:'@?'
            },
            link : link,
        };


    }


    angular.module( 'actinver.directives' )
    .directive( 'actTableOrders', actTableOrders );


} )();
