( function() {
    "use strict";

    function binnacleInfo( URLS, $http, $q, moment ) {

        return {

            /**
             * Get binnacle widget information
             * @param {string} employee - Employee ID
             * @return  {function}
             */
            getInfo: function( employee ){
                var date = moment().subtract( 1, 'months' ),
                    month = date.format( 'MM' ),
                    year = date.format( 'YYYY' );

                return $q(function(resolve, reject) {

                    $http({
                        method: 'GET',
                        url: URLS.getBinnacleAdvGoal + employee + '/' + month + '/' + year,
                        params: {
                            language: 'SPA'
                        }
                    }).then(function success( response ) { 
                        if ( typeof response !== 'undefined' && response.data.status === 1 ) {
                            // Info
                            var info = response.data.result;
                            info.data = [info.clientsContacted, info.clientsToReach - info.clientsContacted];
                            info.percentage = parseInt( info.totalPercentage ) + '%';
                            info.colors = ['#7ed321', '#517cbd'];
                            resolve( { success: true, data: info, finish: true } );
                        }
                        else {
                            reject({success: false, finish: true});
                        }

                    }, function error(){

                        reject({success: false, finish: true});

                    });

                });
            },

            /**
             * Get information for setting blocks and chaarts
             * @param {object} response - Object with information to show in blocks and inside the chart.
             * @return  {object}
             */
            showInfo: function(response, type){
                var data = (type) ? response.result : response.data;
                return {
                    chart: data,
                    finish: true,
                    success: response.success
                };

            }

        };

    }

    angular
        .module( 'actinver.services' )
        .factory( 'binnacleInfo', binnacleInfo );

})();
