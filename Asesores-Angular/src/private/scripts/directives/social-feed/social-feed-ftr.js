( function() {
    "use strict";

    function socialFeedInfo(URLS, $http, $q) {

        var obj = {

            /**
             * Get social feed widget information
             * @return  {function}
             */
            getInfo: function(){

                return $q(function(resolve, reject) {

                    $http({
                        method: 'GET',
                        url: URLS.dashboardSocial,
                    }).then(function success(response) {

                        if ( !!response.data.status ) {
                            resolve({success: true, data: response.data.result, finish: true});
                        } else {
                            reject({success: false, finish: true});
                        }

                    }, function error(){

                        reject({success: false, finish: true});

                    });

                });
            }

        };

        return obj;

    }

    angular
        .module( 'actinver.services' )
        .factory( 'socialFeedInfo', socialFeedInfo );

})();
