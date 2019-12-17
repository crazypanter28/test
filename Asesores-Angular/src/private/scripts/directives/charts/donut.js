(function(){
    'use strict';

    function donutChart(){

        function setChart(opts){
            var defaults = {
                animation: {
                    animateRotate: false
                },
                cutoutPercentage: 92,
                hover: false,
                tooltips: {
                    enabled: false
                },
                elements: {
                    arc: {
                        borderWidth: 0
                    }
                }
            };

            return angular.merge ({}, defaults, opts);
        }

        function link( scope ){
            scope.setChart = function(){
                scope.chartInfo = scope.model.chart;
                scope.chartSettings = setChart( scope.chartInfo );
                scope.tooltipSettings = scope.tooltip;
                scope.ready();
            };

            scope.ready = function(){
                scope.showGraphic = true;
            };
        }

        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/scripts/directives/charts/donut.html',
            link: link,
            scope: {
                model: '=',
                tooltip: '=',
                ready: '=?',
                custom: '@'
            }
        };

    }

    angular
        .module( 'actinver.directives' )
        .directive( 'donutChart', donutChart );

} )();
