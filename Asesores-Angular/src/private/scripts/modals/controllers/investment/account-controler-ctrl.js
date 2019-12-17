( function(){
    "use strict";

    function accountContractCtrl( $uibModalInstance, info, $rootScope){
        var vm = this;
        vm.info = info.list;
        vm.contract = info.contract;

        vm.close = function(){
            $uibModalInstance.dismiss();
        };

        vm.done = function(){
            $uibModalInstance.close();
        };


        vm.contractSelected = function( _selected ){
            $rootScope.selectedContact = _selected;
            $uibModalInstance.close();
        };
    }

    angular.module( 'actinver.controllers' )
        .controller( 'accountContractCtrl', accountContractCtrl );

} )();