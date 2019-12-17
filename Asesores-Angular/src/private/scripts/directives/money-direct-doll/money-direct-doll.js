(function(){
    'use strict';

    function actMoneyDirectDoll( ){

        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/scripts/directives/money-direct-doll/money-direct-doll.html',
            scope: {
                contract: '='
            },
            controller: 'moneyDirectDollCtrl',
            controllerAs: 'doll',

        };

    }

    angular
        .module( 'actinver.directives' )
        .directive( 'actMoneyDirectDoll', actMoneyDirectDoll );

} )();
