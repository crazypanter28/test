(function () {
    'use strict';
    function reportLargeAndShortSrv(URLS, $q, $http) {

        function reportLargeAndShort() {

        }

        reportLargeAndShort.prototype.getListaLargeAndShort = function () {
            return $q(function (resolve, reject) {
                $http({
                    method: 'Get',
                    url: URLS.getShortAndLargeReport,
                    params: {
                        language: 'SPA'
                    }
                }).then(function succees(response) {
                    if (typeof response !== 'undefined' && response.data.outCommonHeader.result.result === 1) {
                        resolve({ success: true, lista: response.data.outMoneyMarketCashByAdviserQuery.contractList.contract, msg: '' });
                    } else if (typeof response !== 'undefined' && response.data.outCommonHeader.result.result === 2) {
                        reject({ success: false, lista: [], msg: response.data.outCommonHeader.result.messages[0] });
                    }
                }).catch(function failed() {
                    reject({ success: false, lista: [], msg: 'Se encontró un error favor de intentarlo más tarde, comuníquese con su help desk' });
                });
            });
        };

        return new reportLargeAndShort();
    }
    angular
        .module('actinver.services')
        .service('reportLargeAndShortSrv', reportLargeAndShortSrv);

})();