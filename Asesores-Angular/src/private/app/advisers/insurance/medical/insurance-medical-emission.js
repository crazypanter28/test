(function () {
    'use strict';

    function insuranceMedicalEmission(URLS, $q, $http) {

        function InsuranceMedicalEmission() { }
        
        InsuranceMedicalEmission.prototype.setMedicalExpenseDocsRegistration = function (params) {
            return $q(function (resolve, reject) {
                $http({
                    method: 'POST',
                    url: URLS.setMedicalExpenseDocsRegistration,
                    data: $.param(params)
                }).then(function success(response) {
                    var _response;
                    if(response.data.outCommonHeader.result.result === 1){
                        _response = response.data;
                        resolve({success: true, info: _response});
                    }else{
                        resolve({success: false, info: response.data.outCommonHeader.result});
                    }
                    
                 }),function error() {
                     reject({success: false, type: 'not-found'});
                 };
            });
        };
        
        InsuranceMedicalEmission.prototype.getMedExpInsuranceQuestionnaireQuery = function () {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getMedExpInsuranceQuestionnaireQuery,
                    params: {
                            language:'SPA'
                        }        
                }).then(function success(response) {
                    var _response;
                    if(response.data.outCommonHeader.result.result === 1){
                        _response = response.data.outMedExpInsuranceQuestionnaireQuery.questionDataList;
                        resolve({success: true, info: _response});
                    }else{
                        resolve({success: false, info: response.data.outCommonHeader.result});
                    }
                    
                 }),function error() {
                     reject({success: false, type: 'not-found'});
                 };
            });
        };
        
        InsuranceMedicalEmission.prototype.getMedExpInsuranceQuestRegistration = function (_params) {
            return $q(function (resolve, reject) {
                $http({
                    method: 'POST',
                    url: URLS.getMedExpInsuranceQuestRegistration,
                    data: $.param(_params)
                }).then(function success(response) {
                    var _response;
                    if (response.data.outCommonHeader.result.result === 1) {
                        _response = response.data.outMedExpInsuranceQuestRegistration;
                        resolve({success: true, info: _response});
                    } else {
                        resolve({success: false, info: response.data.outCommonHeader.result});
                    }

                }), function error() {
                    reject({success: false, type: 'not-found'});
                };
            });
        };

        
        InsuranceMedicalEmission.prototype.getMedExpInsuranceQuestValidation = function (_params) {
            return $q(function (resolve, reject) {
                $http({
                    method: 'POST',
                    url: URLS.getMedicalExpenseQuestValidation,
                    params: _params
                }).then(function success(response) {
                    console.log("respQuest: ", response);
                    var _response;
                    if (response.data.outCommonHeader.result.result === 1) {
                        _response = response.data.outMedicalExpenseQuestValidation.questValidationResponse;
                        resolve({success: true, info: _response});
                    } else {
                        resolve({success: false, info: response.data.outCommonHeader.result});
                    }

                }), function error() {
                    reject({success: false, type: 'not-found'});
                };
            });
        };
        
        InsuranceMedicalEmission.prototype.setMedicalExpenseProcessingRequest = function (_params) {
            return $q(function (resolve, reject) {
                $http({
                    method: 'POST',
                    url: URLS.setMedicalExpenseProcessingRequest,
                    params: _params
                }).then(function success(response) {
                    console.log("setMedicalExpenseProcessingRequest: ", response);
                    var _response;
                    if (response.data.outCommonHeader.result.result === 1) {
                        _response = response.data.outMedicalExpenseProcessingRequest.processingRequestResponse;
                        resolve({success: true, info: _response});
                    } else {
                        resolve({success: false, info: response.data.outCommonHeader.result});
                    }

                }), function error() {
                    reject({success: false, type: 'not-found'});
                };
            });
        };

        InsuranceMedicalEmission.prototype.getMedExpInsurancePolicyRegistration = function (paramsEmision) {
            return $q(function (resolve, reject) {
                $http({
                    method: 'POST',
                    url: URLS.getMedExpInsurancePolicyRegistration,
                    data: $.param(paramsEmision)
                }).then(function success(response) {
                    var _response;
                    if (response.data.outCommonHeader.result.result === 1) {
                        _response = response.data.outMedExpInsurancePolicyRegistration;
                        resolve({success: true, info: _response});
                    } else {
                        reject({success: false, info: response.data.outCommonHeader.result});
                    }
                }), function error() {
                    reject({success: false, type: 'not-found'});
                };
            });
        };
        
        InsuranceMedicalEmission.prototype.procedureQuotation = function (_datos) {

            return $q(function (resolve, reject) {
                $http({
                    method: 'POST',
                    url: URLS.getCotizationProcedure,
                    params: _datos

                }).then(function success(response) {
                    console.log('response procedure', response);
                    var _response;
                    if (response.data.return.status === 1) {
                        _response = response.data;
                        resolve({success: true, info: _response});
                    } else {
                        resolve({success: false, info: response.data.outCommonHeader.result});
                    }
                }, function error() {
                    console.log('response procedure error');
                    reject({success: false, type: 'not-found'});
                });
            });
        };
        
        InsuranceMedicalEmission.prototype.cancelQuotation = function (_datos) {

            return $q(function (resolve, reject) {
                $http({
                    method: 'POST',
                    url: URLS.getCotizationCancel,
                    params: _datos

                }).then(function success(response) {
                    console.log('response cancel', response);
                    var _response;
                    if (response.data.return.status === 1) {
                        _response = response.data;
                        resolve({success: true, info: _response});
                    } else {
                        resolve({success: false, info: response.data.outCommonHeader.result});
                    }
                }, function error() {
                    console.log('response cancel error');
                    reject({success: false, type: 'not-found'});
                });
            });
        };

         InsuranceMedicalEmission.prototype.servicioFirmas = function (_paramsFirmas) {

             return $q(function (resolve, reject) {
                 $http({
                     method: 'POST',
                     url: URLS.getMedicalExpenseSignRegistration,
                     data: $.param(_paramsFirmas)

                 }).then(function success(response) {
                     var _response;
                     if (response.data.outCommonHeader.result.result === 1) {
                         resolve({success: true, info: _response, response: response.data});
                     } else {
                         resolve({success: false, info: response.data.outCommonHeader.result});
                     }
                 }, function error() {
                     reject({success: false, type: 'not-found'});
                 });
             });
         };

         InsuranceMedicalEmission.prototype.saveSelection = function (_paramsGuardaSeleccion) {

            return $q(function (resolve, reject) {
                $http({
                    method: 'POST',
                    url: URLS.getMedicalExpensePackageRegistration,
                    params: _paramsGuardaSeleccion

                }).then(function success(response) {
                    var _response;
                    if (response.data.outCommonHeader.result.result === 1) {
                        resolve({success: true, info: _response, response: response.data});
                    } else {
                        resolve({success: false, info: response.data.outCommonHeader.result});
                    }
                }, function error() {
                    reject({success: false, type: 'not-found'});
                });
            });
        };

        InsuranceMedicalEmission.prototype.updateRequest = function (_paramsActualizarSolicitud) {

            return $q(function (resolve, reject) {
                $http({
                    method: 'POST',
                    url: URLS.getMedicalExpensePackageUpdate,
                    params: _paramsActualizarSolicitud

                }).then(function success(response) {
                    var _response;
                    if (response.data.outCommonHeader.result.result === 1) {
                        resolve({success: true, info: _response, response: response.data});
                    } else {
                        resolve({success: false, info: response.data.outCommonHeader.result});
                    }
                }, function error() {
                    reject({success: false, type: 'not-found'});
                });
            });
        };



        return new InsuranceMedicalEmission();

    }

    angular
        .module('actinver.controllers')
        .service('insuranceMedicalEmission', insuranceMedicalEmission);


    

})();
