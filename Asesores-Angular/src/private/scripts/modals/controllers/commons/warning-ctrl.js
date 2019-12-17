( function(){
    "use strict";

    function warningModalCtrl( $uibModalInstance, message ){
        var vm = this;

        vm.message = message;


        vm.close = function(){
            $uibModalInstance.dismiss('cancel');
        };

        vm.done = function(){
            $uibModalInstance.close();
        };

    }

    angular.module( 'actinver.controllers' )
        .controller( 'warningModalCtrl', warningModalCtrl );

} )();
