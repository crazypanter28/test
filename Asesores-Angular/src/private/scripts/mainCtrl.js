(function () {
    "use strict";

    function mainCtrl($scope, $sessionStorage ) {


        $scope.modelForView = {};


        $scope.$watch(function () {
            return angular.toJson($sessionStorage);
        }, function (nval, oval) {

            if ((oval !== undefined) && (nval !== oval)) {
                if (R.isEmpty(JSON.parse(nval)) || !JSON.parse(oval).sclient && !JSON.parse(nval).sclient) {
                    window.location.href = "/login.html";
                }
            }
        });
        
    }

    angular.module('actinver.controllers')
        .controller('mainCtrl', mainCtrl);

})();
