( function(){
    "use strict";

    function errorModalCtrl( $uibModalInstance, message ){
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
        .controller( 'errorModalCtrl', errorModalCtrl );

} )();
