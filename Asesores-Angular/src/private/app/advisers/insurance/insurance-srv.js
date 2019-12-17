(function () {
    'use strict';

    angular
            .module('actinver.controllers')
            .service('insuranceSrv', insuranceSrv);

    function insuranceSrv(URLS, $q, $http) {

        var obj = {

            getAgent: function () {
                return $q(function (resolve, reject) {
                    $http({
                        method: 'POST',
                        url: URLS.getAgent,
                        params: {
                            language: 'SPA',
                            operation: 'AGENT'
                        }
                    }).then(function success(response) {
                        if (response.data.outCommonHeader === undefined) {
                            if (response.data.return.status === 1) {
                                resolve({success: true, info: response.data.return.data.insuranceAgentBeanList});
                            } else {
                                reject({success: false, info: response.data.return.messages[0].description});
                            }    
                        } else {
                            reject({success: false, info: response.data});
                        }
                    }, function error() {
                        reject({success: false, info: response.data});
                    }).catch(function error() {
                        reject({success: false, info: "***ERROR*** Catch getAgentSvc"});
                    });
                });
            }

        };

        return obj;
    }

})();
