( function() {
    "use strict";

    function incomesInfo(URLS, $http, $q) {

        return {

            /**
             * Get incomes widget information
             * @return  {function}
             */
            getInfo: function(){

                return $q(function(resolve, reject) {

                    $http({
                        method: 'GET',
                        url: URLS.dashboardIncomes,
                    }).then(function success(response) {

                        if ( !!response.data.status) {
                            resolve({success: true, data: response.data.result, finish: true});
                        }
                        else {
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
        .factory( 'incomesInfo', incomesInfo );

})();
