(function(){
    "use strict";

    function actMoneyDirectoDoll( $timeout ){

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
            templateUrl: '/scripts/directives/money-directo-doll/money-directo-doll.html',
            scope: {
                station: '=',
                id: '=',
                contract: '@',
                columnsExpand : '=?',
                tipooperacion : '='
            },
            controller: 'moneyDirectoDollCtrl',
            controllerAs: 'doll',
            link: link
        };


    }


    angular.module( 'actinver.directives' )
    .directive( 'actMoneyDirectoDoll', actMoneyDirectoDoll );


} )();
