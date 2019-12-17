( function(){
    "use strict";

    function binnacleStockExchangeCtrl( $scope, $filter, binnacleSrv, CommonModalsSrv ){
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

            binnacleSrv.getOperativeStockExchange( startDate, endDate, $scope.binnacle.sadviser.employeeID ).then (
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
            /*var startDate = $filter('date')( vm.date.startDate._d, 'dd-MM-yyyy');
            var endDate = $filter('date')( vm.date.endDate._d, 'dd-MM-yyyy');

            binnacleSrv.downloadPDF( startDate, endDate );*/

            var printContents="<div align='center'> <table border='1'>";
            
                       printContents+="<tr bgcolor='#3920A9'>";
                       printContents+="<th>ASESOR</th>"; 
                       printContents+="<th>CAPTURADO</th>";
                       printContents+="<th>C.FINANCIERO</th>";
                       printContents+="<th>CLIENTE</th>";
                       printContents+="<th>EMISORA</th>";
                       printContents+="<th>EXTENSIÓN</th>";
                       printContents+="<th>CONTRATO</th>";
                       printContents+="<th>F.OPERACIÓN</th>";
                       printContents+="<th>MOVIMIENTO</th>";
                       printContents+="<th>SERIE</th>";
                       printContents+="<th>SOLICITUD</th>";
                       printContents+="<th>IMPORTE</th>";
                       printContents+="<th>TITULOS</th>";
                       printContents+="</tr>";
            
                       angular.forEach(vm.dataOperativeBinnacle, function (_res) {
            
                        printContents+="<tr>";
            
                        printContents+="<td>"; 
                        printContents+=_res.asesor;
                        printContents+="</td>"; 
            
                        printContents+="<td>"; 
                        printContents+=_res.capturado;
                        printContents+="</td>";
            
                        printContents+="<td>"; 
                        printContents+=_res.centroFinanciero;
                        printContents+="</td>";
            
                        printContents+="<td>"; 
                        printContents+=_res.cliente;
                        printContents+="</td>";

                        printContents+="<td>"; 
                        printContents+=_res.emisora;
                        printContents+="</td>";

                        printContents+="<td>"; 
                        printContents+=_res.extension;
                        printContents+="</td>";
            
                        printContents+="<td>"; 
                        printContents+=_res.contrato;
                        printContents+="</td>";

                        printContents+="<td>"; 
                        printContents+= moment(_res.fechaOperacion).format("YYYY-MM-DD"); 
                        printContents+="</td>";

                        printContents+="<td>"; 
                        printContents+= _res.movimiento;
                        printContents+="</td>";

                        printContents+="<td>"; 
                        printContents+= _res.serie;
                        printContents+="</td>";

                        printContents+="<td>"; 
                        printContents+= _res.solicitud;
                        printContents+="</td>";

                        printContents+="<td>"; 
                        printContents+=  $filter('currency')(_res.importe,'$',2);
                        printContents+="</td>";
      
                        printContents+="<td>"; 
                        printContents+= _res.titulos;
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
        .controller( 'binnacleStockExchangeCtrl', binnacleStockExchangeCtrl );

})();
