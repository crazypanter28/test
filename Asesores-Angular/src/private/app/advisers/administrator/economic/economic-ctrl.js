
(function () {
    "use strict";

    function economicCtrl(CommonModalsSrv, EconomicSrv) {
        var vm = this;

        function setup() {
            setupVars();
            getEconomicEnvironment();
        }

        function getEconomicEnvironment() {
            EconomicSrv.getEconomicEnvironment().then(function (_res) {
                vm.html = _res;
            }, function () {
                vm.html = 'Intentarlo más tarde';
            });
        }

        function setupVars() {
            vm.taOptions = [['bold', 'italics', 'ol', 'ul']];
            vm.htmlVariable = '';
            vm.html = '';
        }

        vm.clearEditor = function () {
            vm.htmlVariable = '';
        };

        vm.setTextEconomic = function () {
          if(vm.htmlVariable.length >= 5800 ){
            CommonModalsSrv.error('Ha excedido el limite de caracteres. El número máximo permitido es de 5800');
          }else {
                EconomicSrv.saveCSV(vm.htmlVariable).then(function (response) {
                if (response.status === 1) {
                    CommonModalsSrv.done('El texto se guardó de manera exitosa.');
                    vm.html = vm.htmlVariable;
                    vm.htmlVariable = '';
                }else{
                    CommonModalsSrv.error(response.messages[0].description);
                }
            });
          }
        };
        setup();
    }

    angular.module('actinver.controllers')
        .controller('economicCtrl', economicCtrl);
})();
