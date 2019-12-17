(function(){
    "use strict";

    function binnacle(){

        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/scripts/directives/binnacle/binnacle.html',
            controller: 'binnacleWidgetCtrl',
            controllerAs: 'binnacleWidget'
        };

    }

    angular
        .module( 'actinver.directives' )
        .directive( 'binnacle', binnacle );
} )();