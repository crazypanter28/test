(function () {
    "use strict";

    function actFundBankDoll($timeout) {

        function link(scope, $element) {
            scope.focusElement = function () {
                $timeout(function () {
                    $element.find('#station').focus();
                }, 250);
            };
        }

        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/scripts/directives/fund-bank-doll/fund-bank-doll.html',
            scope: {
                contract: '=',
                selected: '=',
                stations: '=',
                orders: '=?'
            },
            controller: 'fundBankDollCtrl',
            controllerAs: 'doll',
            link: link
        };


    }


    angular.module('actinver.directives')
        .directive('actFundBankDoll', actFundBankDoll);


})();
