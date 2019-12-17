(function(){
    'use strict';

    function lineChart( $filter ){



        function link($scope){
            // $scope.onClick = function (points, evt) {
            //     console.log(points, evt);
            // };

            var arrayMonths = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            var series = [];
            var months = [];
            var dataChart = [];
            var datasetOverride = [];
            var yAxes =[];
            var minValue=0;
            var maxValue=0;

            function dataOverride( _contract, _index ){
                var idAxes = 'y-axis-'+_contract;
                datasetOverride.push({
                    label: _contract,
                    yAxisID: idAxes,
                    fill: false,
                    pointRadius: 5,
                });
                
                yAxes.push({
                    id: idAxes,
                    type: 'linear',
                    display: _index < 1 ? true : false,
                    position: 'left',
                    ticks: {
                        fontFamily: 'Proxima Semibold',
                        min: parseInt(minValue),
                        max: (parseInt(parseInt(maxValue)/50000)+1)*50000
                    }
                });
            }

            function setMonth( _date ) {
                var newDate = _date.substring( 4 );
                var year = _date.substring(2, 4 );
                var newMonth = arrayMonths[ newDate - 1];

                newDate = newMonth.substring(0, 3).toUpperCase() + '. ' + year;
                if( months.indexOf( newDate ) === -1 ){
                    months.push( newDate );
                }
            }

            function setData( _amount, _index ) {
                if( !dataChart[_index] ){
                    dataChart[_index] = [];
                }
                dataChart[_index].push( _amount );
            }

            function setupChart( data, index ){
                data.map(function( _val ){
                    setMonth( _val.paymentPeriod );
                    setData( _val.amount, index );
                });
            }

            function setup( data ){
   
                if( typeof data.chart.section === 'undefined' ){

                    data.chart.map( function( _val){
                        if(_val && _val.historical && _val.historical.historicalInfo){
                            _val.historical.historicalInfo.forEach(function(element) {
                                maxValue = (element.amount > maxValue && element.amount !== null) ? element.amount : maxValue;
                                minValue = (element.amount < minValue && element.amount !== null) ? element.amount : minValue;
                            });
                        }
                    });

                    data.chart.map( function( _val, _index){
                        if( !_val.empty ){
                            var contract = _val.historical;
                            series.push( contract.contractNumber );
                            dataOverride( contract.contractNumber, _index );
                            setupChart( contract.historicalInfo, _index );
                        }
                    });

                    $scope.colors = $scope.color;
                    $scope.labels = months;
                    $scope.data = dataChart;
                    $scope.series = series;
                    $scope.datasetOverride = datasetOverride;
                    $scope.options = {
                        // hoverMode: 'index',

                        scales: {
                            yAxes: yAxes,
                            xAxes: [{
                                ticks: {
                                    fontSize: 10,
                                    fontFamily: "Proxima Bold",
                                }
                            }]
                        },
                        tooltips: {
                            caretSize: 0,
                            custom: function( tooltipModel ){
                                tooltipModel.backgroundColor = 'rgba(41, 215, 135, 0.4)';
                                tooltipModel.yPadding = 10;
                                tooltipModel.height = 55;
                                tooltipModel.titleFontSize = 14;
                                tooltipModel.width = 194;
                                tooltipModel.xPadding = 10;
                                tooltipModel.bodyFontColor = '#0f3f88';
                                tooltipModel.titleFontColor = '#0f3f88';
                                tooltipModel.displayColors = false;

                                // tooltipModel.xAlign = 'center';
                                // tooltipModel._bodyAlign = 'center';
                                // tooltipModel._footerAlign = 'center';
                                // tooltipModel._titleAlign = 'right';
                            },
                            callbacks: {
                                label: function( tooltipModel, data){
                                        return data.datasets[ tooltipModel.datasetIndex].label + ' : ' + $filter('currency')(tooltipModel.yLabel , '$' );
                                },
                            },
                            mode: 'single',
                       }
                    };

                } else {

                    $scope.labels = data.chart.labels;
                    $scope.data = data.chart.data;                   
                    $scope.options = data.chart.options;
                    $scope.datasetOverride = data.chart.datasetOverride;

                }

            }

            setup( $scope.model );
        }

        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/scripts/directives/charts/line.html',
            link: link,
            scope: {
                model: '=',
                color: '=',
                custom: '@?'
            }
        };

    }

    angular
        .module( 'actinver.directives' )
        .directive( 'lineChart', lineChart );

} )();
