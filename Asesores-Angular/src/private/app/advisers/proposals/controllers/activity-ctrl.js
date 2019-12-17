( function(){
    "use strict";

    function activityCtrl( NgTableParams, proposalSrv, CommonModalsSrv ){
        var vm = this;
       

        function setup () {
            setupVars();
            getOffices("Todos");

        }



        function setupVars () {
            vm.date = new Date();
            vm.openedCalendar = false;
            vm.dateOptions = {
                minMode: 'month'
            };
            vm.showTable = false;
            vm.dropdownOptions = [];
            vm.dropdownSelected={ text: 'Todos' ,id:0};
            vm.showSpinner = false;
        }


       function getOffices(option) {

        vm.showSpinner = true;
        vm.showTable = false;
        //carga datos todos los datos
        proposalSrv.getActivityOffice( vm.date ).then(
            function ( _data ){
                vm.showSpinner = false;               
                vm.dropdownOptions=[];
                var optionSelect;
                var datosCombo=_data.financialCentersList;
                
                if(!option){
                    optionSelect={
                        text:'Todos'
                    };
                }else if(option === "Todos"){
                    optionSelect={
                        text:option
                    };
                }else{
                    optionSelect=option;
                }

                //llenado de tablas
                if(optionSelect.text === 'Todos'){ ///||( option && option.text  ==='Todos') ){
                    vm.dataInfoTabs = _data;   
                }else{
                    var datos = vm.dataInfoTabs.records && vm.dataInfoTabs.records.length <= _data.records.length ? _data.records:vm.dataInfoTabs.records;
                    var temporal=[];
                    vm.dataInfoTabs.totalLogins=0;
                    vm.dataInfoTabs.totalProposalReports=0;
                    vm.dataInfoTabs.totalTrackingAndProposalReports=0;
                    vm.dataInfoTabs.totalClientQueries=0;
                    vm.dataInfoTabs.totalTrackingReports=0;
                    vm.dataInfoTabs.totalFundSell=0;
                    vm.dataInfoTabs.totalTransferCash=0;
                    vm.tableParams=[];
                    vm.dataRowTableActivity=[];
                   // vm.showTable = false;
    
                    for(var row in datos){
                        if(datos[row].financialCenter === optionSelect.text){
                            if(datos[row].component==="Login"){
                                vm.dataInfoTabs.totalLogins+=1;
                            }
                            if(datos[row].component==="Reporte de Propuesta"){
                                vm.dataInfoTabs.totalProposalReports+=1;
                            }
                            if(datos[row].component==="Reporte de Propuesta con seguimiento"){
                                vm.dataInfoTabs.totalTrackingAndProposalReports+=1;
                            }
                            if(datos[row].component==="Consulta de cliente"){
                                vm.dataInfoTabs.totalClientQueries+=1;
                            }
                            if(datos[row].component==="Reporte de Seguimiento"){
                                vm.dataInfoTabs.totalTrackingReports+=1;
                            }
                            if(datos[row].component==="Venta de Fondos de Inversion"){
                                vm.dataInfoTabs.totalFundSell+=1;
                            }
                            if(datos[row].component==="Transferencia de Efectivo"){
                                vm.dataInfoTabs.totalTransferCash+=1;
                            }
                            temporal.push(datos[row]);
                        }
                    }
    
                    vm.dataInfoTabs.totalRecords = vm.dataInfoTabs.totalLogins + vm.dataInfoTabs.totalProposalReports + vm.dataInfoTabs.totalClientQueries + vm.dataInfoTabs.totalTrackingReports + vm.dataInfoTabs.totalFundSell + vm.dataInfoTabs.totalTransferCash;
                    vm.dataInfoTabs.records = temporal;
                }

                // cargar datos del combo de centros financiero
                for(var x in datosCombo){
                    vm.dropdownOptions.push({ text: datosCombo[x].financialCenter ,id: datosCombo[x].keyCenter});
                }
                vm.dropdownOptions.push({ text: 'Todos' ,id:0});

            },
            function () {
                CommonModalsSrv.error( "Lo sentimos ocurrio un error." );
                vm.showSpinner = false;
            }
        );

        }


        vm.getInfoTabs = function (option) {
            getOffices(option);
        };


        vm.getMoreInfoTab = function ( _tabActive ) {
            vm.tabActive = _tabActive;
            vm.dataRowTableActivity=[];
            var datos = vm.dataInfoTabs.records;
            var rowData=null;

            if(_tabActive ==="tab1"){
                for( rowData in datos){
                    if(datos[rowData].component==="Login"){
                        vm.dataRowTableActivity.push(datos[rowData]);
                    }
                }

            }else if(_tabActive ==="tab2"){                
                for( rowData in datos){                    
                    if(datos[rowData].component === "Reporte de Propuesta"){
                        vm.dataRowTableActivity.push(datos[rowData]);
                    }
                }
            }else if(_tabActive ==="tab3"){
                for( rowData in datos){                    
                    if(datos[rowData].component === "Reporte de Propuesta con seguimiento"){
                        vm.dataRowTableActivity.push(datos[rowData]);
                    }
                }
                
            }else if(_tabActive ==="tab4"){
                for( rowData in datos){                    
                    if(datos[rowData].component === "Consulta de cliente"){
                        vm.dataRowTableActivity.push(datos[rowData]);
                    }
                }
                
            }else if(_tabActive ==="tab5"){
                for( rowData in datos){                    
                    if(datos[rowData].component === "Reporte de Seguimiento"){
                        vm.dataRowTableActivity.push(datos[rowData]);
                    }
                }
                
            }else if(_tabActive ==="tab6"){
                for( rowData in datos){                    
                    if(datos[rowData].component === "Venta de Fondos de Inversion"){
                        vm.dataRowTableActivity.push(datos[rowData]);
                    }
                }
                
            }else if(_tabActive ==="tab7"){
                for( rowData in datos){                    
                    if(datos[rowData].component === "Transferencia de Efectivo"){
                        vm.dataRowTableActivity.push(datos[rowData]);
                    }
                }
                
            }


             if( vm.dataRowTableActivity ) {
                vm.tableParams = new NgTableParams(
                    { count: 10 },
                    { dataset: ( vm.dataRowTableActivity ) }
                );
            }

            vm.showTable = true;
        };


        vm.generaExcel=function(){
            /*
            var htmltable= document.getElementById('table-result');
            var html = htmltable.outerHTML;
            window.open('data:application/vnd.ms-excel;filename=Resultado.xls,' + encodeURIComponent(html));
*/
            var blob = new Blob([document.getElementById('table-result').outerHTML], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
            });
            saveAs(blob, "Report.xls");
        };

        function saveAs(blob, fileName) {
            if (window.navigator.msSaveOrOpenBlob) { // For IE:
                navigator.msSaveBlob(blob, fileName);
            } else { // For other browsers:
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = fileName;
                link.click();
                window.URL.revokeObjectURL(link.href);
            }
        }


        setup();

    }

    angular
        .module( 'actinver.controllers' )
        .controller( 'activityCtrl', activityCtrl );

})();
