(function(){
    'use strict';

    function outProfile ($uibModalInstance){
        var vm = this;        

        vm.close = function () {
            $uibModalInstance.dismiss('cancel');
        };

        vm.done = function () {
            $uibModalInstance.close();
        };
    }
    angular.module('actinver.controllers')
        .controller('outProfile', outProfile);


})();