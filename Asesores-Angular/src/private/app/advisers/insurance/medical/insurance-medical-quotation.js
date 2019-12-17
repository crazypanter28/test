(function () {
    'use strict';

    function insuranceMedicalQuotation(URLS, $q, $http, $filter,insuranceMedicalSrv,CommonModalsSrv) {

        function InsuranceMedicalQuotation() {}

        InsuranceMedicalQuotation.prototype.sendEmailQuotation = function (_params) {
            try{
                var copia = _params;
                insuranceMedicalSrv.sendEmailNotificationCotizationPMM(copia).then(function (_response) {
                    if (_response.success) {
                        CommonModalsSrv.done("Correo Enviado");
                    }
                });
            }catch(e){

            }
            // CommonModalsSrv.done("Correo Enviado");
        };

        InsuranceMedicalQuotation.prototype.sendEmailEmision = function (_params) {
            try{
                var copia = _params;
                insuranceMedicalSrv.sendEmailNotificationEmisionPMM(copia).then(function (_response) {
                    if (_response.success) {
                        CommonModalsSrv.done("Correo Enviado");
                    }
                });
            }catch(e){

            }
            // CommonModalsSrv.done("Correo Enviado");
        };

        return new InsuranceMedicalQuotation();

    }

    angular
        .module('actinver.controllers')
        .service('insuranceMedicalQuotation', insuranceMedicalQuotation);

})();
