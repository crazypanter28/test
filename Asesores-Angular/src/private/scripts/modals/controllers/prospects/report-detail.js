( function(){
    "use strict";

    function reportDetailCtrl(adviserInfo, dateInfo, $filter, $uibModalInstance, exportTableToExcel, binnacleInfo, prospectModalsSrv, NgTableParams, prospectSrv, $state, userConfig ){
        var vm = this;
        var userID = userConfig.user.employeeID;
        var date =  $filter('date')( dateInfo.date, 'MM/yyyy');  

        var employeeID = adviserInfo.adviserID;
        var idFC = adviserInfo.idCF;
        var typeReport = adviserInfo.type;
        vm.name = adviserInfo.name;

        function setup(){
            if(typeReport == 1){
                getReportDetail();
            }else
               getReportDetailFC();
            
        }

        function getReportDetail(){
            prospectSrv.getReportOpportunityDetail( employeeID, date ).then(function( result ){
                vm.listReportDetail = result.result;
            }).catch(function () {
            });
        };

        function getReportDetailFC(){
            prospectSrv.getReportOpportunityDetailFC( idFC, date ).then(function( result ){
                vm.listReportDetail = result.result;
            }).catch(function () {
            });
        };

        vm.close = function(){
            $uibModalInstance.dismiss();
        };

        

        vm.reportDetail = function () {
			var exportHref = exportTableToExcel.tableToExcel('#idTablaResultadosReportDetail', 'Reporte por estrategias');
			var link = document.createElement('a');
			link.download = 'Reporte por Estrategia.xls';
			link.href = exportHref;
			link.click();
		};  

        setup();

    }

    angular
        .module( 'actinver.controllers' )
        .controller( 'reportDetailCtrl', reportDetailCtrl );

})();
