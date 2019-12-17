( function(){
    "use strict";

    function admonDerivativeModalCtrl( $uibModalInstance, title, favorite ){
        var vm = this;


        


        vm.close = function(){
            $uibModalInstance.dismiss();
        };


        vm.done = function(){
            $uibModalInstance.close( vm.fav );
        };



    }

    angular.module( 'actinver.controllers' )
        .controller( 'admonDerivativeModalCtrl', admonDerivativeModalCtrl );

} )();
