(function(){
    'use strict';

    function goalsProducts(){

        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/scripts/directives/goals/products.html',
            scope: {
                data: '=',
                type: '@?'
            }
        };
    }

    angular
        .module( 'actinver.directives' )
        .directive( 'goalsProducts', goalsProducts );

} )();