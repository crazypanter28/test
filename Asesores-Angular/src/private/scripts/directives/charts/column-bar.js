/*global Chart */

(function(){
    'use strict';

    function columnBarChart(){

        function setChart( opts ){
            var defaults = {
                layout: {
                    padding: {
                        top: 20
                    }
                },
                animation: {
                    duration: 0,
                    onComplete: function(){
                        var chartInstance = this.chart,
                            ctx = chartInstance.ctx;

                        // Annotation style
                        ctx.font = Chart.helpers.fontString( 12, 'normal', 'Proxima Semibold' );
                        ctx.fillStyle = '#0e539a';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'bottom';

                        // Loop through all items
                        this.data.datasets.forEach( function ( dataset, i ){
                            var meta = chartInstance.controller.getDatasetMeta( i );

                            // Get value
                            meta.data.forEach( function( bar, index ){
                                var data = dataset.data[ index ] + '%';
                                ctx.fillText( data, bar._model.x, bar._model.y - 2 );
                            } );
                        } );

                    }
                },
                hover: false,
                tooltips: {
                    enabled: false
                },
                scales: {
                    xAxes: [{
                        categoryPercentage: 1,
                        barPercentage: 0.75,
                        gridLines: {
                            display: false,
                            zeroLineColor: '#9b9b9b'
                        },
                        ticks: {
                            fontSize: 9,
                            fontFamily: "'Proxima Regular'",
                            fontColor: "#0f3f88"
                        }
                    }],
                    yAxes: [{
                        display: false,
                        ticks: {
                            beginAtZero: true
                        }
                    }],
                },
                elements: {
                    rectangle: {
                        borderWidth: 0
                    }
                }
            };

            return angular.merge ({}, defaults, opts);
        }

        function link(scope){
            scope.chartSettings = setChart(scope.model.chart);
        }

        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/scripts/directives/charts/column-bar.html',
            link: link,
            scope: {
                model: '='
            }
        };

    }

    angular
        .module( 'actinver.directives' )
        .directive( 'columnBarChart', columnBarChart );

} )();