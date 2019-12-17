(function () {
    "use strict";

    function dinnImageCtrl(dataResolve, $uibModalInstance) {
        var vm = this;

        function setup() {
            vm.image = dataResolve.image;
            vm.title = dataResolve.title;
        }

        vm.close = function () {
            $uibModalInstance.dismiss();
        };

        setup();
    }

    angular.module('actinver.controllers')
        .controller('dinnImageCtrl', dinnImageCtrl);

})();