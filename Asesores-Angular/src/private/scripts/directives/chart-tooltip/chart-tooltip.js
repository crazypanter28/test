( function(){
    'use strict';

    function chartTooltip(){

        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/scripts/directives/chart-tooltip/chart-tooltip.html',
            scope: {
                tooltipData: '='
            },
            link: function( scope ){
                var tp = scope.tooltipData;

                function init( tooltip ){

                    // Tooltip element
                    var tooltipEl = document.getElementById( scope.tooltipData.id ),
                        positionY = this._chart.canvas.offsetTop,
                        positionX = this._chart.canvas.offsetLeft;

                    // Hide if no tooltip
                    if( tooltip.opacity === 0 ){
                        tooltipEl.style.opacity = 0;
                        return;
                    }

                    // Set Text
                    if( tooltip.dataPoints ){
                        tooltipEl.style.opacity = 1;
                        tooltipEl.style.left = positionX + tooltip.caretX + 'px';
                        tooltipEl.style.top = positionY + tooltip.caretY + 'px';
                        tooltipEl.innerHTML = tp.idxs ? tp.data[ tp.idxs[ tooltip.dataPoints[ 0 ].index ] ][ 2 ] : '';
                    }

                    return tooltipEl;

                }

                // Init custom tooltip
                scope.tooltipData.id = tp.id || 'chartjs-tooltip';
                tp.custom = init;

            }
        };

    }

    angular
        .module( 'actinver.directives' )
        .directive( 'chartTooltip', chartTooltip );

} )();
