(function () {
	'use strict';

	function reportLargeAndShortCtrl($scope, URLS, $http, $timeout, exportTableToExcel, randomNamesSrv, reportLargeAndShortSrv, ErrorMessagesSrv) {
		var vm = this;
		vm.modal=false;

		vm.listRegister = [];

		function init(){
			vm.getLista();
		}

		// Get information from service
		vm.getLista = function () {
			vm.modal=true;
			reportLargeAndShortSrv.getListaLargeAndShort().then(function success(data) {
				if (data.success) {
					vm.listRegister = data.lista;
				} else {
					vm.listRegister = [];
					ErrorMessagesSrv(data.message);
				}
				vm.modal=false;
			}).catch(function error(error) {
				vm.modal=false;
				ErrorMessagesSrv(error.message);
			});
		};

		vm.exportData = function () {
			var exportHref = exportTableToExcel.tableToExcel('#idTablaResultados', 'Reporte Cortos y Largos');
			var link = document.createElement('a');
			link.download = randomNamesSrv.getNameFile() + '.xls';
			link.href = exportHref;
			link.click();
		};
		
		init();
	}

	angular
		.module('actinver.controllers')
		.controller('reportLargeAndShortCtrl', reportLargeAndShortCtrl);

})();