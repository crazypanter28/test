( function(){
    "use strict";

    function binnacleBankCtrl( $scope, $filter, binnacleSrv, CommonModalsSrv ){
        var vm = this;
        vm.datepicker_opts = {
            isInvalidDate: function( date ){
                return ( date.day() === 0 || date.day() === 6 ) ? true : false;
            },
            maxDate: moment().format( 'DD/MM/YY' )
        };

        function setup () {
            setupVars();
        }


        function setupVars () {
            vm.dataOperativeBinnacle = [];
        }


        vm.changeDate = function ( _date ) {
            vm.date = _date;

            var startDate = moment( _date.startDate._d ).format( 'YYYYMMDD' );
            var endDate = moment( _date.endDate._d ).format( 'YYYYMMDD' );

            binnacleSrv.getOperativeBank( startDate, endDate, $scope.binnacle.sadviser.employeeID ).then (
                function ( _response ){
                    vm.dataOperativeBinnacle = _response;
                    vm.setData( vm.dataOperativeBinnacle );
                },
                function ( ) {
                    CommonModalsSrv.error( "Lo sentimos ocurrio un error." );
                }
            );
        };

        vm.downloadPDF = function(){
           
           var printContents="<div align='center'> <table border='1'>";

           printContents+="<tr bgcolor='#3920A9'>";
           printContents+="<th>REGION</th>"; 
           printContents+="<th>C.FINANCIERO</th>";
           printContents+="<th>CONTRATO</th>";
           printContents+="<th>CLIENTE</th>";
           printContents+="<th>OPERACION</th>";
           printContents+="<th>ASESOR</th>";
           printContents+="<th>F.OPERACIÓN</th>";
           printContents+="<th>IMPORTE</th>";
           printContents+="</tr>";

           angular.forEach(vm.dataOperativeBinnacle, function (_res) {

            printContents+="<tr>";

            printContents+="<td>"; 
            printContents+=_res.region;
            printContents+="</td>"; 

            printContents+="<td>"; 
            printContents+=_res.centroFinanciero;
            printContents+="</td>";

            printContents+="<td>"; 
            printContents+=_res.contrato;
            printContents+="</td>";

            printContents+="<td>"; 
            printContents+=_res.nombreCliente;
            printContents+="</td>";

            printContents+="<td>"; 
            printContents+=_res.tipoOperacion;
            printContents+="</td>";

            printContents+="<td>"; 
            printContents+=_res.nombreAsesor;
            printContents+="</td>";

            printContents+="<td>"; 
            printContents+= moment(_res.fechaOperacion).format("YYYY-MM-DD");  
            printContents+="</td>";

            printContents+="<td>"; 
            printContents+=  $filter('currency')(_res.importe,'$',2);
            printContents+="</td>";

            printContents+="</tr>"; 
            });

            printContents+="</table></div>";

            var popupWin = window.open('IMPRESIÓN', '_blank', 'width='+screen.width+'px,height='+screen.height+'px,resizable=0');
            popupWin.document.open();
            popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
            popupWin.document.close();
        };


        setup();
    }

    angular
        .module( 'actinver.controllers' )
        .controller( 'binnacleBankCtrl', binnacleBankCtrl );

})();
