(function () {
    "use strict";

    function classFocus( ) {
        return {
            restrict: 'A',
            scope: {
                classFocus: '@'
            },
            link: function (scope, element) {
                scope.$watch(function () {
                    return element.attr('class');
                }, function () {
                    if (element.hasClass(scope.classFocus)) {
                        element.focus();
                    }
                });
            }
        };
    }
    
    angular.module('actinver.directives')
        .directive('classFocus', classFocus);
})();
