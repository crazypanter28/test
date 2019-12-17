(function(){
    "use strict";

    function incomes(){

        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/scripts/directives/incomes/incomes.html',
            controller: 'incomesWidgetCtrl',
            controllerAs: 'incomesWidget',
            scope: true,
        };

    }

    angular
        .module( 'actinver.directives' )
        .directive( 'incomes', incomes );
} )();
