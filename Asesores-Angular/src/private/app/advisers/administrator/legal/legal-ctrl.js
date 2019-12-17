(function () {
    "use strict";

    function legalCtrl(CommonModalsSrv, LegalSrv) {
        var vm = this;

        function setup() {
            setupVars();
            getAnnoucement();
        }

        vm.clearEditor = function () {
            vm.htmlVariable = '';
        };

        vm.setTextLegal = function () {
            LegalSrv.saveCSV(vm.htmlVariable)
                .then(function (result) {
                    if (result !== null) {
                        vm.html = vm.htmlVariable;
                        vm.htmlVariable = '';
                        CommonModalsSrv.done(result.messages[0].description);
                    }
                });
        };

        function getAnnoucement() {
            LegalSrv.getAnnoucement()
                .then(function (_res) {
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

        setup();
    }

    angular.module('actinver.controllers')
        .controller('legalCtrl', legalCtrl);
})();
