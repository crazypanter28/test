(function () {
    "use strict";

    function reportoLetterModalSrv( URLS, $q, $http ) {
        var fun = {
            getConfirmLtr: function (_params) {
                return $q(function (resolve, reject) {
                    $http({
                        method: 'GET',
                        url: URLS.getReportoConfirmLtr,
                        params: _params
                    }).then(
                        function success(response) {
                            if (response.data.outCommonHeader.result.result == 1) {
                                resolve({success: true, info: response.data.result.file});
                            } 
                            else {
                                reject({success: false, info: response.data.outCommonHeader.result.messages[0].responseMessage});
                            }
                        }, 
                        
                        function error() {
                            reject({success: false, info: 'Ocurrió un problema (Bad Request)'});
                        }
                    );
                });
            },
    
            sendEmail: function (_params) {
                return $q(function (resolve, reject) {
                    $http({
                        method: 'POST',
                        url: URLS.sendEmailReportoLtr,
                        params: _params
                    }).then(
                        function success(response) {
                            var _response;
                        
                            if (response.data.outCommonHeader.result.result == 1) {
                                _response = "Envío de correo exitoso";
                                resolve({success: true, info: _response});
                            } 
                            else {
                                _response = response.data.outCommonHeader.result.messages[0].responseMessage;
                                reject({success: false, info: _response});
                            }
                        }, 
                        
                        function error() {
                            reject({success: false, info: 'Ocurrió un problema (Bad Request)'});
                        }
                    );
                });
            }
        };

        return fun;
    }

    angular.module('actinver.services')
           .service('reportoLetterModalSrv', reportoLetterModalSrv);
})();
