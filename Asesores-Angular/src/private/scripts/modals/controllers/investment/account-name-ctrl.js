( function(){
    "use strict";

    function accountNameCtrl( $uibModalInstance, info, $rootScope, NgTableParams, accountSrv){
        var vm = this;
        vm.showEmptyMessage = false;

        vm.info = info;

        function setup(){

            if(info.personType==='1'){
                configTable();
            }                
            else{
                configTablePersonasMorales(info);
            }
        }

        function configTable() {
            var defaults = {
                count: 20
            };

            vm.configTable = new NgTableParams(defaults, {                
                getData: function( params ){                    
                    return getRecords(info.wordToSearch, params,  defaults.count );
                }
            });
        }
        function getRecords(search, params, rows) {
            return accountSrv.getBankContractsByClientQuery(search, params.page(), rows).then(function success(response) {
                if (response.success) {
                    params.total(response.data.pagination.totalResult);      
                    vm.showEmptyMessage = response.data.pagination.totalResult === 0 ? true : false;
                    return response.data.clientsList.client;
                } else {
                    return [];
                }
            }).catch(function error() {
                return [];
            });
        }

        function configTablePersonasMorales(reg){
            var defaults = {
                count: 20
            };
            vm.configTable = new NgTableParams(defaults, {                
                dataset: reg.list
            });
        }

        vm.close = function(){
            $uibModalInstance.dismiss();
        };

        vm.done = function(){
            $uibModalInstance.close();
        };

        vm.nameSelected = function( _selected ){
            $rootScope.selectedClient = _selected;
            $uibModalInstance.close();
        };

        setup();
    }

    angular.module( 'actinver.controllers' )
        .controller( 'accountNameCtrl', accountNameCtrl );

} )();
