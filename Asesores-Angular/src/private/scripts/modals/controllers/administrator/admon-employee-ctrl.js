( function(){
    "use strict";

    function admonEmployeeModalCtrl( $uibModalInstance, title, employee ){
        var vm = this;


        function setup () {
            setupVars();
        }


        function setupVars () {
            vm.title = title;
            vm.employee = employee;
        }


        vm.close = function(){
            $uibModalInstance.dismiss();
        };


        vm.done = function(){
            $uibModalInstance.close( vm.employee );
        };


        setup();

    }

    angular.module( 'actinver.controllers' )
        .controller( 'admonEmployeeModalCtrl', admonEmployeeModalCtrl );

} )();
