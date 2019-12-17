( function(){
    'use strict';

    function pResumeSrv( URLS, $q, $http, $filter ){
        var chart_colors = ['#00bebe','#fa596d','#f9be00','#7ed321','#e21599','#ccc', '#B39DDB', '#3c86f6','#f5f047','#ff6f00' ],
            tooltip_set = {'type': 'string', 'role': 'tooltip', 'p': {'html': true}};

        function setTooltipInfo( info ){
            return "<div class='operations-portfolio-tp " + $filter( 'lowercase' )( info.abbr ) + "'><span>" + info.name + "</span><br />" + info.percent + "%</div>";
        }

        var obj = {

            /**
             * Set chart styles and information
             * @param {object} chart_data - Object with chart setting.
             * @return  {object}
             */
            displayChart: function( chart_data ){
                var idxs = [],
                    data = [],
                    colors = [],
                    labels = [];

                chart_data.forEach( function( item, idx ){
                    if( idx > 0 && item[ 1 ] > 0 ){
                        idxs.push( idx );
                        data.push( item[ 1 ] );
                        colors.push( chart_colors[ idx - 1 ] );
                        labels.push( item[ 0 ] );
                    }
                } );

                return {
                    data: data,
                    colors: colors,
                    cutoutPercentage: 60,
                    labels: labels,
                    pieceLabel: {
                        mode: 'label',
                        fontFamily: 'Proxima Semibold',
                    },
                    tooltips: {
                        custom: true,
                        idxs: idxs,
                        data: chart_data
                    }
                };
            },

            /**
             * Get contract resume list
             * @param {string} contract - Desired contract ID
             * @return  {object}
             */
            getContractResume: function( contract ){

                return $q(function( resolve, reject ){

                    $http({
                        method: 'GET',
                        url: URLS.getPortfolioResume + contract,
                        params: {
                            language: 'SPA'
                        }
                    }).then( function success( response ) {
                        if(response.data.status === 1){
                            resolve( {success: true, data: response.data} );
                        }else{
                            reject( response.data );
                        }
                    }, function error(){
                        reject( {success: false, type: 'not-found'} );
                    } );

                });
            },

            /**
             * Set information for display section chart
             * @param {array} info - All information to display inside the chart
             * @return  {object}
             */
            setChartInfo: function( info ){
                var chart_info = [];

                angular.forEach( info, function( item, index ){
                    var chart_percent = ( Number( item.percent ) > 0 ) ? Number( item.percent ) : 0;

                    if( index === 0 ){
                        chart_info.push( [ 'Tarea', 'Porcentaje', tooltip_set ] );
                    }

                    if( item.abbr ){
                        chart_info.push( [ item.abbr, chart_percent, setTooltipInfo( item ) ] );
                    }
                });

                return obj.displayChart( chart_info );
            },

            /**
             * Get credits list
             * @param {string} client - Desired client ID
             * @return  {object}
             */
            getCreditsList: function( client ){

                return $q(function( resolve, reject ){

                    $http({
                        method: 'GET',
                        url: URLS.getCreditsList + client + '?language=SPA',
                    }).then( function success( response ) {
                        if (response.data.status === 1) {
                            resolve( {success: true, data: response.data} );
                        } else {
                            reject( {success: false, data: response.data, type: 'empty' } );
                        }

                    }, function error(){
                        reject( {success: false, type: 'not-found'} );
                    } );

                });
            },

            /**
             * Get insurances list
             * @param {string} client - Desired client ID
             * @return  {object}
             */
           /* getInsurancesList: function( client ){

                return $q(function( resolve, reject ){

                    $http({
                        method: 'GET',
                        url: URLS.getInsurancesList + client,
                    }).then( function success( response ) {

                        if (typeof response !== 'undefined' && response.data.outCommonHeader.result.result === 1) {
                            resolve( {success: true, data: response.data.outInsurancePortfolioQuery} );
                        } else {
                            reject( {success: false, data: response.data, type: 'empty' } );
                        }

                    }, function error(){
                        reject( {success: false, type: 'not-found'} );
                    } );

                });
            },*/

        };

        return obj;

    }

    angular
    	.module( 'actinver.controllers' )
        .service( 'pResumeSrv', pResumeSrv );

})();