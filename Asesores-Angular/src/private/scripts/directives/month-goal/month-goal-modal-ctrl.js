( function(){
    "use strict";

    function monthGoalModalCtrl($uibModalInstance, info){
        var vm = this;
        vm.modal_info = info.modal_info;
        vm.infoModal = info.infoModal;

        // Close modal
        vm.close_modal = function(){
            $uibModalInstance.dismiss('cancel');
        };
    }

    angular
    	.module( 'actinver.controllers' )
        .controller( 'monthGoalModalCtrl', monthGoalModalCtrl );

} )();
