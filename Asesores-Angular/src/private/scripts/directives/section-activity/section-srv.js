(function () {
    "use strict";

    function SectionActivitySrv($http, $q, URLS) {

        function SectionActivity() { }


        SectionActivity.prototype.getMedia = function () {
            return $q(function (resolve) {
                $http({
                    method: 'GET',
                    url: URLS.getBinnacleCatalog,
                    params: {
                        language: 'SPA'
                    }
                }).then(function (response) {
                    if (!!response.data.status) {
                        resolve(response.data.result);
                    }
                });
            });
        };



        return new SectionActivity();
    }

    angular.module('actinver.services')
        .service('SectionActivitySrv', SectionActivitySrv);
})();
