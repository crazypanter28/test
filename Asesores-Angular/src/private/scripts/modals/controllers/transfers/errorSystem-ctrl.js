( function(){
    "use strict";

    function errorSystemModalCtrl( $uibModalInstance ){ //message
        var vm = this;
        vm.close = function(){
            $uibModalInstance.dismiss();
        };

    }

    angular.module( 'actinver.controllers' )
        .controller( 'errorSystemModalCtrl', errorSystemModalCtrl );

} )();
