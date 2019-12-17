( function(){
    "use strict";

    function admonGroupModalCtrl( $uibModalInstance, title, group ){
        var vm = this;


        function setup () {
            setupVars();
        }


        function setupVars () {
            vm.title = title;
            vm.group = group;
        }

        vm.close = function(){
            $uibModalInstance.close();
        };

        vm.done = function(){
            $uibModalInstance.close( vm.group );
        };


        setup();

    }

    angular.module( 'actinver.controllers' )
        .controller( 'admonGroupModalCtrl', admonGroupModalCtrl );

} )();
