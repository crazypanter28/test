(function () {
    "use strict";

    function factSheet($http, $q, URLS) {
        return {
            getImage: getImage
        };

        function getImage(id) {
            return $q(function (resolve, reject) {

                $http({
                    method: 'GET',
                    url:    URLS.getProductFactsheetImg + id,
                    responseType: 'arraybuffer',
                    params: {
                        language: 'SPA'
                    }
                }).then(function (response) {
                        var image = _arrayBufferToBase64(response.data);
                        resolve(image);
                    }).catch(function (error) {
                        reject({ error: error.data });
                    });

                function _arrayBufferToBase64(buffer) {
                    var binary = '';
                    var bytes = new Uint8Array(buffer);
                    var len = bytes.byteLength;
                    for (var i = 0; i < len; i++) {
                        binary += String.fromCharCode(bytes[i]);
                    }
                    return window.btoa(binary);
                    }

            });
        }
    }

    angular.module('actinver.services')
        .service('factSheetSrv', factSheet);
})();