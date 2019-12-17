(function () {
    'use strict';
    function misreportesSrv(URLS, $q, $http) {

        function misreportes() {

        }

       misreportes.prototype.getListaReportes = function () {
           console.log("========= GetLisReportes =========");
            return $q(function (resolve, reject) {
                $http({
                    method: 'Get',
                    url: URLS.getInsuranceMaritalStatusQuery,
                    params: {
                        language: 'SPA',
                        insuranceTypeID:'100'
                    }
                }).then(function succees(response) {/*
                    if (typeof response !== 'undefined' && response.data.OutCommonHeaderReporte.result.result === 1) {
                        resolve({ success: true, lista: response.data.OutBrokerReportesQuery.reportesFound.reporteslist, msg: '' });
                    } else if (typeof response !== 'undefined' && response.data.OutCommonHeaderReporte.result.result === 2) {
                        reject({ success: false, lista: [], msg: response.data.OutCommonHeaderReporte.result.messages[0] });
                    }*/
                console.log(response);
                }).catch(function failed() {
                    reject({ success: false, lista: [], msg: 'Se encontró un error favor de intentarlo más tarde, comuníquese con su help desk' });
                });
            });
        };

        return new misreportes();
    }
    angular
        .module('actinver.services')
        .service('misreportesSrv', misreportesSrv);

})();