// Call controller from tooltip chart
function showAdvisersInfo( id ,mes,anio){
    'use strict';

    var scope = angular.element( $( '#goals-report' )[0] ).scope();
    scope.$apply( function(){
        scope.reports.showAdvisersInfo( id ,mes,anio);
        $( 'html, body' ).animate( {
            scrollTop: $( '.details-wrapper' ).offset().top - 100
        }, 500 );
    } );
}

( function(){
    'use strict';

    function binnacleReportsSrv( URLS, $q, $http ){

        function setTooltipInfo( info, range, filter ){
            function getIndiceMes(mes){
                mes = mes.trim();
                var arrayMonths = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
                var indice = arrayMonths.indexOf(mes.toUpperCase());
                return indice + 1;
            }

            var btn = '', opts = '';
            var fecha=info.fecha.split('/');


            if( filter[0] !== 'single' ) {
                btn = "<p><a href='javascript:void(0);' onclick='showAdvisersInfo( " + range +" , "+ getIndiceMes(fecha[0])+","+fecha[1]+ " )'>VER DETALLE</a></p>";
                opts = "<li><strong>Total de asesores:</strong> "+ info.asesores +"</li><li><strong>Total de clientes a contactar:</strong> "+info.clientes+"</li>";
            } else {
                opts = "<li><strong>Clientes a contactar:</strong> "+info.clientes+"</li>";
            }
            return "<div class='dashboard-tooltip report-tooltip top'><div class='tooltip-arrow'></div><div class='tooltip-inner'><ul>" + opts + "<li><strong>Meta por día:</strong>"+info.meta+"</li><li><strong>Clientes contactados:</strong>"+info.numContactos+"</li><li><strong>Alcance:</strong> "+info.alcance+"%</li></ul>" + btn + "</div></div>";
        }

        var obj = {

            /**
             * Search field types
             */
            search_types: [
                {
                    id: 1,
                    text: 'Número de cliente único',
                    validation: {
                        pattern: new RegExp( '^[0-9]*$' ),
                        maxlength: '11'
                    }
                },
                {
                    id: 2,
                    text: 'Número de contrato',
                    validation: {
                        pattern: new RegExp( '^[0-9]*$' ),
                        maxlength: '11'
                    }
                },
                {
                    id: 3,
                    text: 'Nombre de cliente único',
                    typeahead: true,
                    validation: {
                        pattern: '',
                        maxlength: '60'
                    }
                }
            ],

            /**
             * Get chart information
             * @param {string} adviser - Array with information to operate goals report.
             * @return  {object}
             */
            getInfo: function( adviser ){

                return $q( function( resolve, reject ){
                    var urlRest = null;
                    var paramsUrl = { language: 'SPA' };
                    if (adviser.type === "profile") {
                        urlRest = URLS.getDetailGraph + "/true";
                    } else if (adviser.type === "advisers") {
                        urlRest = URLS.getDetailGraph + "/false";
                    }
                    //profileFlag: true
                    if(adviser && adviser.show_info && adviser.show_info !== '')
                        paramsUrl.employeeID  = adviser.show_info;

                    

                    $http( {
                        method: 'GET',
                        url: urlRest,
                        params: paramsUrl,
                        ignoreLoadingBar: true
                    } ).then( function success( response ){
                        var info=[];
                        var datos;

                        if(adviser.type==="profile"){
                            datos = response.data.result.myProfile;

                        }else if(adviser.type === "advisers"){
                            datos = response.data.result.advisors;
                        }

                        angular.forEach(datos, function (_res) {  
                                var infoToolTip={
                                    asesores: _res.totalAdvisors,
                                    clientes:_res.clientsToReach,
                                    meta:_res.targetPerDay,
                                    alcance:_res.totalPercentage,
                                    numContactos:_res.clientsContacted,
                                    fecha:_res.month
                                };   

                                var position=[_res.month ,_res.totalPercentage,setTooltipInfo( infoToolTip, adviser.show_info, adviser.filter )];
                                info.push(position);
                        });

                        if ( typeof response !== 'undefined' ) {
                            // Info ultimo
                            var dataa = response.data.result.myProfile;
                            if (adviser.type === "profile") {
                                dataa = dataa[dataa.length - 1];
                                dataa.data = [dataa.clientsContacted, dataa.clientsToReach - dataa.clientsContacted];
                                dataa.percentage = parseInt(dataa.totalPercentage) + '%';
                                dataa.colors = ['#7ed321', '#517cbd'];
                            }                            
                          
                            resolve( { success: true, data: obj.displayChart( info ), finish: true, result: dataa} );
                        } else {
                            reject( { success: false, data: [], finish: true } );
                        }

                    }, function error(){

                        reject( { success: false, data: [], finish: true } );

                    } );
                } );
            },

            /**
             * Set chart styles and information
             * @param {object} chart_data - Object with chart setting.
             * @return  {object}
             */
            displayChart: function( chart_data ){
                var idxs = [],
                    data = [],
                    labels = [],
                    colors = [];

                chart_data.forEach( function( item, idx ){
                    idxs.push( idx );
                    data.push( item[ 1 ] );
                    labels.push( item[ 0 ] );
                    if( idx !== ( chart_data.length - 1 ) ){
                        colors.push( '#00bebe' );
                    } else {
                        colors.push( '#0f3f88' );
                    }
                } );

                return {
                    section: 'binnnacle-reports',
                    labels: labels,
                    data: data,
                    datasetOverride: {
                        pointBackgroundColor: colors,
                        pointHoverBackgroundColor: colors,
                        pointBorderColor: colors,
                        pointHoverBorderColor: colors
                    },
                    options: {
                        maintainAspectRatio: false,
                        animation : false,
                        events: ['click'],
                        chartArea: {
                            backgroundColor: 'rgba(0, 190, 190, .1)'
                        },
                        scales: {
                            yAxes: [{
                                display: true,
                                ticks: {
                                    beginAtZero: true,
                                    padding: 10,
                                    fontSize: 13,
                                    fontFamily: 'Proxima Regular',
                                    fontColor: '#1a5dc4',
                                    stepSize: 10,
                                    suggestedMax: 105,
                                    callback: function(value) {
                                        return ( value !== 0 && value !== 110 ) ? value + '%' : '';
                                    }
                                },
                                gridLines: {
                                    drawBorder : false,
                                    color: '#a2e6e6',
                                    borderDash: [ 2, 0, 2 ],
                                    zeroLineColor: 'rgba(0, 0, 0, 0)',
                                }
                            }],
                            xAxes: [{
                                ticks: {
                                    fontFamily: 'Proxima Semibold',
                                    fontColor: '#00bebe',
                                    fontSize: 15,
                                },
                                gridLines: {
                                    display: false,
                                },
                            }]
                        },
                        elements: {
                            line: {
                                fill: false,
                                tension: 0,
                                borderWidth: 2,
                                borderColor: '#00bebe'
                            },
                            point: {
                                radius: 8,
                                hitRadius: 8,
                                hoverRadius: 8
                            },
                        },
                        tooltips: {
                            enabled: false,
                            custom: true,
                            idxs: idxs,
                            data: chart_data,
                        },
                    }
                };
            },

            /**
             * Get report by advisers
             * @return  {object}
             */
            getAdvisersInfo: function( id ,fecha){

                return $q( function( resolve, reject ){
                    
                    $http( {
                        method: 'GET',
                        url: URLS.getAdvisersDetails + id,
                        //url: URLS.getAdvisersDetails+'53883/',
                        params:{
                            date: fecha,
                            language:'SPA'

                        }
                    } ).then( function success( response ){
                        
                        
                        if ( !!response.data.result ) {                            
                            resolve( { success: true, data: response.data.result, finish: true } );
                        } else {
                            reject( { success: false, data: [], finish: true } );
                        }

                    }, function error(){

                        reject( { success: false, data: [], finish: true } );

                    } );
                } );
            },

        };

        return obj;

    }

    angular
    	.module( 'actinver.controllers' )
        .service( 'binnacleReportsSrv', binnacleReportsSrv );

})( showAdvisersInfo );
