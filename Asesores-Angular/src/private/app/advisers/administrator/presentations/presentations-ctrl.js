( function(){
    "use strict";

    function presentationsAdminCtrl( administratorModalsSrv, CommonModalsSrv, PresentationsAdminSrv  ){
        var vm = this;

        function setup () {
            setupVars();
            getClassifications();
        }


        function setupVars () {
            vm.selectedTab = 1;
            vm.groupSelectedTab = 0;
        }


        vm.showModalCreateFactsheet = function () {
            administratorModalsSrv.admonPresentations('Agregar nueva presentación', {})
                .then(
                    function ( res ){
                        if( typeof res.msg !== 'undefined' ){
                            if( res.msg === 'success' ){
                                CommonModalsSrv.done( 'La ' + res.type + ' se agregó de manera exitosa.' );
                                getSubProducts( vm.selectedTab );
                                getSubTypesByClassification(vm.selectedTab);
                            } else {
                                CommonModalsSrv.error( 'Se Encontró Un Error Favor De Intentarlo Más Tarde, Comuníquese Con Su Help desk' );
                            }
                    }
                    getClassifications();
                }
                ).catch(function(res) {
                    if (!(res === 'cancel' || res === 'escape key press' || res === 'backdrop click' || typeof res === 'undefined')) {
                        throw res;
                    }
                });
            };


        vm.showModalEditFactsheet = function ( _presentation ) {
        _presentation.idPresentationType = vm.selectedTab;
            administratorModalsSrv.admonPresentations('Editar presentación', _presentation )
                .then(
                    function ( res ){
                        if( typeof res.msg !== 'undefined' ){
                            if( res.msg === 'success' ){
                                CommonModalsSrv.done( 'La ' + res.type + ' se modificó de manera exitosa.' );
                                getSubProducts( vm.selectedTab );
                                getSubTypesByClassification( vm.selectedTab );
                            } else {
                                CommonModalsSrv.error( 'Se Encontró Un Error Favor De Intentarlo Más Tarde, Comuníquese Con Su Help desk' );
                            }
                        }
                    }
                ).catch(function(res) {
                    if (!(res === 'cancel' || res === 'escape key press' || res === 'backdrop click' || typeof res === 'undefined')) {
                        throw res;
                    }
                });
            };


        vm.showModalRemoveFactsheet = function ( _id ) {
            CommonModalsSrv.warning('¿Estás seguro de eliminar la presentación?')
                .result.then(
                    function(){
                        PresentationsAdminSrv.deletePresentation( _id ).then( function(){
                            CommonModalsSrv.done( 'La presentación se eliminó de manera exitosa.' );
                            getSubProducts( vm.selectedTab );
                            getSubTypesByClassification( vm.selectedTab );
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
            getSubTypesByClassification (_id);
        };


        function getClassifications(){
            vm.loadingProducts = true;
            PresentationsAdminSrv.getTypes().then( function( _res ){
                vm.products = _res;

                getSubProducts( vm.products[0].idPresentationType );
            }, function(){
                vm.errorLoadingProducts = true;
            })
            .finally(function(){
                vm.loadingProducts = false;
            });
        }

        /**
        * @param {id} produdct
        **/
        function getSubProducts( _id ){
            vm.loadingSubProducts = true;
            PresentationsAdminSrv.getPresentationsByType( _id ).then(function( _listProduct ){
                vm.subProducts = [];
                angular.forEach( _listProduct, function( item ){
                    vm.subProducts.push( item );
                } );
                vm.loadingSubProducts = false;
            });
        }

        function getSubTypesByClassification( _id  ){
            PresentationsAdminSrv.getPresentationSubTypesByClassification( _id).then( function( _res ){
                vm.ClasificationProducts = _res.map( function( _val ){
                    _val.text = _val.description;
                    return _val;
                });
            });
        }

        vm.nextTab = function () {
            vm.groupSelectedTab++;
        };

        vm.beforeTab = function () {
            vm.groupSelectedTab--;
        };
        

        /*function setTable( _list ){
            var defaults = {
                    page: 1,
                    count: 13,
                };

            vm.configTable = new NgTableParams( defaults, {
                paginationMaxBlocks: 4,
                paginationMinBlocks: 2,
                dataset: _list.presentations,
            });

            return _list;
        }*/


        setup();
    }


    angular.module('actinver.controllers')
    .controller('presentationsAdminCtrl', presentationsAdminCtrl );

})();
