(function(){
    "use strict";

    function actMoneyBankDoll( $timeout ){

        function link( scope, $element) {

            scope.focusElement = function(){
                $timeout(function(){
                    $element.find('#station').focus();
                }, 250);
            };
        }

        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/scripts/directives/money-bank-doll/money-bank-doll.html',
            scope: {
                type: '=?',
                contract: '=',
                instrument: '=',
                selected: '=',
                orders: '=?'
            },
            controller: 'moneyBankDollCtrl',
            controllerAs: 'doll',
            link: link
        };


    }


    angular.module( 'actinver.directives' )
        .directive( 'actMoneyBankDoll', actMoneyBankDoll );


} )();
