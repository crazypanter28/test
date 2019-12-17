( function(){
    "use strict";

    function detailModalCtrl( $uibModalInstance , info){
        var vm = this;

        vm.info = info;

        vm.close = function(){
            $uibModalInstance.dismiss();
        };

        vm.done = function(){

            $uibModalInstance.close( );
        };

    }

    angular.module( 'actinver.controllers' )
        .controller( 'detailModalCtrl', detailModalCtrl );

} )();
