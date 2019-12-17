(function () {
    "use strict";

    function resize($window) {
        return {
            restrict: 'A',
            scope: {
                onSizeChanged: '&'
            },
            link: function (scope) {             
                $window.addEventListener('resize', onWindowResize);                
                function onWindowResize() {                                                            
                    scope.onSizeChanged();
                }
            }
        };


    }

    angular.module('actinver.directives')
        .directive('onSizeChanged', resize);


})();
