(function () {
    "use strict";

    function PresentationAdminSrv($http, $q, URLS) {
        return {
            getPDF: getPDF
        };

        function getPDF(id) {
            return $q(function (resolve, reject) {

                $http({
                    method: 'GET',
                    url:    URLS.getPresentationFileAdm + id,
                    responseType: 'arraybuffer',
                    params: {
                        language: 'SPA'
                    }
                }).then(function (response) {
                        var file = new Blob([response.data], {type: 'application/pdf'});
                        var fileURL = URL.createObjectURL(file);
                        window.open(fileURL,'_blank', 'Presentación');

                        resolve({ response: response.data });
                    }).catch(function (error) {
                        reject({ error: error.data });
                    });
            });
        }
    }

    angular.module('actinver.services')
        .service('PresentationAdminSrv', PresentationAdminSrv);
})();