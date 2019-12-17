(function(){
    "use strict";

    function actTableOrders( TableStopLossSrv, investmentModalSrv, CommonModalsSrv, investmentSrv ){

        var link = function( scope ){
            var isLoad = false;

            /** This function loads the orders of the day
            * @param {boolean}  Indicates if the function is loading
            **/
            function loadOrders( _isLoad ){
                scope.sortReverse = true;
                scope.sortType = 'subOrders.operationDate';
                scope.loading = true;

                if( isLoad !== _isLoad ){
                    isLoad = _isLoad;
                    TableStopLossSrv.getCapitalStop( scope.contract, scope.type ).then( function(_res){
                        if( _res.data.outCommonHeader.result.result === 1 ){
                            scope.orders = _res.data.outSecuritiesForStopLossQuery.issuerList;
                        }
                    } )
                    .finally(function(){
                        scope.loading = false;
                        isLoad = false;
                    });
                }
            }

            /** This function delete one order
            * @param {object}  order
            **/
            scope.delete = function( _order){
                var message = '¿Estás seguro de cancelar la orden seleccionada?';
                CommonModalsSrv.warning( message ).result.then(function() {
                    investmentSrv.deleteStopLoss( scope.contract, _order ).then(function(_res){
                        if(_res.data.outCommonHeader.result.result === 1){
                            loadOrders();
                            CommonModalsSrv.done( 'Se ha realizado la cancelación de manera exitosa.' );

                        }
                        else {
                            message = 'Se Encontró Un Error Favor De Intentarlo Más Tarde, Comuníquese Con Su Help desk';

                           CommonModalsSrv.error( message );
                        }
                    });

                });
            };


            /**
            * This assignment allows to use the function from the controller or the view
            **/
            scope.update = loadOrders;
        };

        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/scripts/directives/table-stop-loss/table.html',
            scope: {
                contract : '@',
                update : '=?',
                type: '@?'
            },
            link : link,
        };


    }


    angular.module( 'actinver.directives' )
    .directive( 'tableStopLoss', actTableOrders );


} )();
