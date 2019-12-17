( function(){
    "use strict";

    function factsheetsCtrl( administratorModalsSrv, CommonModalsSrv, FactsheetsSrv  ){
        var vm = this;

        function setup () {
            setupVars();
            getClassifications();
        }


        function setupVars () {
            vm.selectedTab = 1;
        }


        vm.showModalCreateFactsheet = function () {
            administratorModalsSrv.admonFactsheet('Agregar nuevo', {})
                .then(
                    function ( msg ){
                        if( typeof msg !== 'undefined' ){
                            if( msg === 'success' ){
                                CommonModalsSrv.done( 'El producto se agregó de manera exitosa.' );
                                getSubProducts( vm.selectedTab );
                            } else {
                                CommonModalsSrv.error( 'Se Encontró Un Error Favor De Intentarlo Más Tarde, Comuníquese Con Su Help desk' );
                            }
                        }
                    }
                ).catch(function(res) {
                    if (!(res === 'cancel' || res === 'escape key press' || res === 'backdrop click')) {
                        throw res;
                    }
                });
            };

        vm.showModalEditFactsheet = function ( _factsheet ) {
            administratorModalsSrv.admonFactsheet('Editar producto', _factsheet )
                .then(
                    function ( msg ){
                        if( typeof msg !== 'undefined' ){
                            if( msg === 'success' ){
                                CommonModalsSrv.done( 'El producto se modificó de manera exitosa.' );
                                getSubProducts( vm.selectedTab );
                            } else {
                                CommonModalsSrv.error( 'Se Encontró Un Error Favor De Intentarlo Más Tarde, Comuníquese Con Su Help desk' );
                            }
                        }
                    }
                ).catch(function(res) {
                    if (!(res === 'cancel' || res === 'escape key press' || res === 'backdrop click')) {
                        throw res;
                    }
                });
            };


        vm.showModalRemoveFactsheet = function ( _idFactsheet ) {
            CommonModalsSrv.warning('¿Estás seguro de eliminar el producto?')
                .result.then(
                    function ( ){
                        FactsheetsSrv.removeClassifications( _idFactsheet ).then(function() {
                            CommonModalsSrv.done( 'El producto se eliminó de manera exitosa.' );
                            getSubProducts( vm.selectedTab );
                        });
                    }
                ).catch(function(res) {
                    if (!(res === 'cancel' || res === 'escape key press' || res === 'backdrop click')) {
                        throw res;
                    }
                });
            };

        vm.changeTab = function( _id){
            vm.selectedTab = _id;
            getSubProducts( _id );
        };


        function getClassifications(){
            vm.loadingProducts = true;
            FactsheetsSrv.getClassifications().then( function( _res ){
                vm.products = _res;

                getSubProducts( vm.products[0].idClassification );
            }, function(){
                vm.errorLoadingProducts = true;
            })
            .finally( function(){
                vm.loadingProducts = false;
            });

        }

        /**
        * @param {id} produdct
        **/
        function getSubProducts( _id ){
            vm.loadingSubProducts = true;
            FactsheetsSrv.getProductsByClassification( _id ).then(function( _listProduct ){
                vm.subProducts = _listProduct;
                vm.loadingSubProducts = false;
            }, function(){
                vm.subProducts = [];
            });
        }


        setup();
    }


    angular.module('actinver.controllers')
    .controller('factsheetsCtrl', factsheetsCtrl );

})();
