(function(){
    'use strict';

    function goalsTotals(){

        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/scripts/directives/goals/totals.html',
            scope: {
                data: '=',
                modal: '=?'
            }
        };
    }

    angular
        .module( 'actinver.directives' )
        .directive( 'goalsTotals', goalsTotals );

} )();