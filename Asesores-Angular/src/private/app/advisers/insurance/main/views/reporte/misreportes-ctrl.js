(function () {
    'use strict';

    function misreportestCtrl($scope, URLS, $http, $timeout, exportTableToExcel, randomNamesSrv, misreportesSrv, ErrorMessagesSrv) {
        var vm = this;
        vm.modal = false;
        vm.listRegister = [];

        function init() {
            vm.getLista();
            
        }

        // Get information from service
        vm.getLista = function () {
            console.log("========= DENTRO DE LA FUNCION GET LISTA =======");
            vm.modal = true;
            misreportesSrv.getListaReportes().then(function success(data) {
                console.log("========== DATA =========" + data);
                if (data.success) {
                    vm.listRegister = data.lista;
                    console.log("*******************" + listRegister);
                } else {
                    vm.listRegister = [];
                    ErrorMessagesSrv(data.message);
                    cosole.log("******************ERROR");
                }
                vm.modal = false;
            }).catch(function error(error) {
                vm.modal = false;
                ErrorMessagesSrv(error.message);
            });
        };

        vm.exportData = function () {
            var exportHref = exportTableToExcel.tableToExcel('#idTablaResultados', 'Mis Reportes');
            var link = document.createElement('a');
            link.download = randomNamesSrv.getNameFile() + '.xls';
            link.href = exportHref;
            link.click();
        };
        /*  Data = function () {
         var exportHref = exportTableToExcel.tableToExcel('#idTablaResultados', 'Mis Reportes');
         var link = document.createElement('a');
         link.download = randomNamesSrv.getNameFile() + '.xls';
         link.href = exportHref;
         link.click();
         };
         */
        init();
    }
    angular
            .module('actinver.controllers')
            .controller('misreportesCtrl', misreportestCtrl);

})();