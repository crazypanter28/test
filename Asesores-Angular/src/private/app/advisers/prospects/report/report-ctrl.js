( function(){
    "use strict";

    function reportOppCtrl( binnacleInfo, prospectModalsSrv, $filter,  $scope, NgTableParams, exportTableToExcel, prospectSrv, $state, userConfig ,$uibModal){
        var vm = this; 
        var userID = userConfig.user.employeeID;
        vm.name = userConfig.user.name;
        vm.filterTable = {};
         
        vm.activeFilters = false;
       
        
        vm.datepicker_opts_Fecha_Alta = {
            parentEl: "idDateEnd",
            singleDatePicker: true,
            minDate: moment(),
            locale: {
                format: "DD/MM/YYYY"
            }
        };

        
        function setup(){
           // vm.submitSearch();
           setupVars();
            getReport();
        }

        

         function getReport(){
            prospectSrv.getReportOpportunity( userID, vm.date ).then(function( result ){
                vm.listReport = result.result;
            }).catch(function () {
            });
        }

        

        vm.getDetailReport = function( obj, type ){
            var title = type == 1 ? 'REPORTE ESPECIAL DEL USUARIO: ' + obj.name : 'REPORTE ESPECIAL DEL CF: ' + obj.financialCenter 
            return $uibModal.open({
                templateUrl: '/scripts/modals/views/prospects/report-detail.html',
                controller: 'reportDetailCtrl',
                controllerAs: 'reportDetail',
                resolve: {
                    adviserInfo: function(){
                        return {
                            adviserID: obj.idEmployee,
                            idCF: obj.idFC,
                            name: title,
                            type: type
                        };
                    },
                    dateInfo: function(){
                        return {
                            date : vm.date
                        };
                    }
                }
            }).result.finally( angular.noop ).then( angular.noop, angular.noop );
        };

        vm.report = function () {
			var exportHref = exportTableToExcel.tableToExcel('#idTablaResultadosReport', 'Reporte General');
			var link = document.createElement('a');
			link.download = 'Reporte General.xls';
			link.href = exportHref;
			link.click();
        };
        
        
        function setupVars () {
            vm.date = new Date();
            vm.openedCalendar = false;
            vm.dateOptions = {
                minMode: 'month'
            };
        }

        vm.getInfoTabs = function(option){
            getReport();
        }

        vm.activfilters = function(){
            if(vm.activeFilters){
                vm.activeFilters = false; 
            }else{
                vm.activeFilters = true;
            }
            $scope.search = undefined;
        } 

        setup();

    
    }

    angular
        .module( 'actinver.controllers' )
        .controller( 'reportOppCtrl', reportOppCtrl );

})();
