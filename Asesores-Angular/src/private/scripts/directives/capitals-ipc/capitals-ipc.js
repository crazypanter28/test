(function(){
    "use strict";

    function capitalsIpc(){

        return {
            restrict: 'A',
            replace: true,
            scope: {
                contract : '@',
            },
            templateUrl: '/scripts/directives/capitals-ipc/ipc.html',
            controller: 'capitalsIpcCtrl',
            controllerAs: 'ipc'
        };

    }

    angular
        .module( 'actinver.directives' )
        .directive( 'capitalsIpc', capitalsIpc );
} )();
