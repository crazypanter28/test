(function () {
    'use strict';

    function menu() {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/scripts/directives/menu/menu.html',            
            controller: 'menuCtrl',
            controllerAs: 'menuCtrl'
        };
    }
    angular.module('actinver.directives')
        .directive('menu', menu);

})();