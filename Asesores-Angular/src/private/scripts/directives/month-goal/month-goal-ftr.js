( function() {
    "use strict";

    function monthGoalInfo(URLS, $http, $q) {

        return {

            /**
             * Get month goal widget information
             * @return  {function}
             */
            getInfo: function(){

                return $q(function(resolve, reject){

                    $http({
                        method: 'GET',
                        url: URLS.dashboardMonthGoal,
                    }).then(function success(response){

                        var info = {};

                        // Set information
                        info = {
                            amount: null,
                            grow: null,
                            goal_left: null,
                            percentage: null,
                            chart: {
                                colors: ['#7ed321', '#00bebe', '#3c86f6', '#f5f047'],
                                labels: ['DINERO', 'SEGUROS', 'CRÉDITOS', 'FONDOS'],
                                data: [35, 25, 30, 10]
                            },
                            modal_info: {
                                col1: {
                                    title: 'Productos'
                                }
                            }
                        };

                        if ( !!response.data.status ) {
                            info.amount = response.data.result.amount;
                            info.grow = response.data.result.grow;
                            info.goal_left = (info.grow >= info.amount) ? 0 : info.amount - info.grow,
                            info.percentage = info.grow * 100 / info.amount;
                            info.infoModal = response.data.result.infoModal;

                            if(Math.round(info.percentage) !== info.percentage) {
                                info.percentage = info.percentage.toFixed(1);
                            }
                            resolve({success: true, data: info, finish: true});
                        } else {
                            reject({success: false, finish: true});
                        }

                    }, function error(){

                        reject({success: false, finish: true});

                    });

                });

            }

        };

    }

    angular
        .module( 'actinver.services' )
        .factory( 'monthGoalInfo', monthGoalInfo );

})();
