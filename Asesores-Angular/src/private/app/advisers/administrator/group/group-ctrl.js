( function(){
    "use strict";

    function groupCtrl( administratorModalsSrv, CommonModalsSrv, GroupSrv, userConfig, $uibModal ){
        var vm = this;

        var employeeID = userConfig.user.employeeID;

        function setup () {
            getGroups();
        }

        vm.editName = function( _group ){
            $uibModal.open({
               templateUrl: '/app/advisers/administrator/group/modal/group-modal.html',
               size: 'lg',
               windowClass : 'administrator',
               controller: 'admonGroupModalCtrl',
               controllerAs: 'modal',
               resolve:{
                   group: function(){
                       return _group;
                   }
               }
           }).result.catch(function(res){
            throw res;
           });
        };


        vm.showModalCreateGroup = function () {
            administratorModalsSrv.admonGroup('Agregar nuevo', {})
                .then(
                    function ( _model ){
                        _model.employeeID = employeeID;
                        GroupSrv.saveGroup( _model ).then(function() {
                            CommonModalsSrv.done( 'El grupo se agregó de manera exitosa.' );
                            getGroups();
                        }).catch(function(res) {
                            if (!(res === 'cancel' || res === 'escape key press' || res === 'backdrop click' || typeof res === 'undefined')) {
                                throw res;
                            }
                        });
                    }
                ).catch(function(res) {
                    if (!(res === 'cancel' || res === 'escape key press' || res === 'backdrop click' || typeof res === 'undefined')) {
                        throw res;
                    }
                });
            };


        vm.showModalEditGroup = function ( _group ) {
            administratorModalsSrv.admonGroup('Editar grupo', _group )
                .then(
                    function ( _model ){
                        GroupSrv.updateNameGroup( _model ).then(function() {
                            CommonModalsSrv.done( 'El grupo se modificó de manera exitosa.' );
                            getGroups();
                        });
                    }
                ).catch(function(res) {
                    if (!(res === 'cancel' || res === 'escape key press' || res === 'backdrop click' || typeof res === 'undefined')) {
                        throw res;
                    }
                });
            };


        vm.showModalRemoveGroup = function ( _idGroup ) {
            CommonModalsSrv.warning('¿Estás seguro de eliminar el grupo?')
                .result.then(
                    function ( ){
                        GroupSrv.deleteGroup( _idGroup ).then(function() {
                            CommonModalsSrv.done( 'El grupo se eliminó de manera exitosa.' );
                            getGroups();
                        });
                    }
                ).catch(function(res) {
                    if (!(res === 'cancel' || res === 'escape key press' || res === 'backdrop click')) {
                        throw res;
                    }
                });
            };

        function getGroups(){
            vm.loadingGroups = true;
            GroupSrv.getGroups().then(function( _res ){
                vm.groups = _res;
            })
            .finally(function(){
                vm.loadingGroups = false;
            });
        }

        setup();
    }


    angular.module('actinver.controllers')
    .controller('groupCtrl', groupCtrl );

})();
