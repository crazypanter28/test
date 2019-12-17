(function () {
    "use strict";

    function directsBandsMdlCtrl($uibModalInstance, data, fn) {
        
        var vm = this;
        vm.selected = null;
        vm.data = data;       

        vm.close = function () {
            $uibModalInstance.dismiss('cancel');
        };

        vm.calculate = function(){
            vm.close();            
            fn(vm.selected);
        };

        vm.changeSelected = function( reg ){
            if(vm.data !== null){
                vm.data.forEach(function(r){
                    r.selected = false;
                    if(r.instrumentDesc === reg.instrumentDesc && r.term === reg.term){
                        r.selected = true;
                    }
                });
                vm.selected = reg;
            }            
        }
    }

    angular.module('actinver.controllers')
        .controller('directsBandsMdlCtrl', directsBandsMdlCtrl);

})();
