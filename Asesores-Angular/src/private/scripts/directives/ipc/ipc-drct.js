(function(){
    "use strict";

    function ipc(){

        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/scripts/directives/ipc/ipc.html',
            controller : "ipcCtrl",
            controllerAs : "ipc"
        };


    }

    angular.module( 'actinver.directives' )
    .directive( 'ipc', ipc );


} )();
