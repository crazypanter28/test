( function() {
    "use strict";

    function lastNewsInfo(URLS, $http, $q) {

        return {

            /**
             * Get last news widget information
             * @return  {function}
             */
            getInfo: function(){

                return $q(function(resolve, reject) {

                    $http({
                        method: 'GET',
                        url: URLS.dashboardNews || '',
                        ignoreLoadingBar: true,
                        params:{
                            language: 'SPA'
                        } 
                    }).then(function success(response) {
                        if ( !!response.status ) {
                            resolve({success: true, data: response.data, finish: true});
                        }
                        else {
                            reject({success: false, finish: true});
                        }

                    }, function error(){
                        console.log("error");

                        reject({success: false, finish: true});

                    });

                });
            }

        };

    }

    angular
        .module( 'actinver.services' )
        .factory( 'lastNewsInfo', lastNewsInfo );

})();
