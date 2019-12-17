(function(){
    'use strict';

    function actMoneyDoll( $timeout ){

        function link( scope, $element) {

            scope.focusElement = function(){
                $timeout(function(){
                    $element.find('#invest').focus();
                }, 250);
            };
        }

        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/scripts/directives/money-doll/money-doll.html',
            scope: {
                contract: '=',
                instrument: '=',
            },
            controller: 'moneyDollCtrl',
            controllerAs: 'doll',
            link: link,
        };

    }

    angular
        .module( 'actinver.directives' )
        .directive( 'actMoneyDoll', actMoneyDoll );

} )();
