( function(){
    "use strict";

    function invModalCtrl( $uibModalInstance, info ){
        var vm = this;

        vm.info = info;
        // vm.info.transfer.import = vm.info.transfer.import.replace(/[^\d|\-+|\.+]/g, '');
        vm.date = new Date();

        vm.close = function(){
            $uibModalInstance.dismiss();
        };

        vm.done = function(){
            $uibModalInstance.close();
        };

    }

    angular.module( 'actinver.controllers' )
        .controller( 'invModalCtrl', invModalCtrl );

} )();
