(function(){
    "use strict";

    function permission( Auth ){

        function link( scope, elem ){
            scope.$watch(Auth.isLoggedIn, function(){
                if (Auth.userHasPermission(scope.permission)) {
                    elem.show();
                } else {
                    elem.hide();
                }
            });
        }


        return {
            restrict: 'A',
            scope: {
                permission: '='
            },
            link: link
        };
    }


    angular.module('actinver.directives')
    .directive('permission', permission);
})();
