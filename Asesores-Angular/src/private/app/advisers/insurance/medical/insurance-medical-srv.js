(function () {
    'use strict';

    function insuranceMedicalSrv(URLS, $q, $http) {

        function InsuranceMedicalSrv() { }

        InsuranceMedicalSrv.prototype.getCotizacionSrv = function (_params) {
            return $q(function (resolve, reject) {

                _params.language = "SPA";
                
                $http({
                    method: 'POST',
                    url: URLS.getMedicalExpenseInsuranceQuotation,
                    data: $.param(_params)
                    // params: _params
                }).then(function success(response) {
                    var _response;
                    if(response.data.outCommonHeader.result.result === 1){
                        _response = response.data.outMedicalExpenseInsuranceQuotation;
                        resolve({success: true, info: _response});
                    }else{
                        reject({success: false, info: response.data.outCommonHeader.result});
                    }
                    
                 }),function error() {
                     reject({success: false, type: 'not-found'});
                 };

            });
        };

        InsuranceMedicalSrv.prototype.getDetalleCotizacion = function (_idCotizacion) {
            return $q(function (resolve, reject) {
                $http({
                    method: 'POST',
                    url: URLS.getMedExpInsuranceDetailQuotationQuery,
                    params: {
                        language: 'SPA',
                        quotationNumber: _idCotizacion
                    }
                }).then(function success(response) {
                    var _response;
                    console.log(response);
                    if (response.data.outCommonHeader.result.result === 1) {
                        _response = response.data.outMedExpInsuranceDetailQuotationQuery;
                        resolve({success: true, info: _response});
                    } else {
                        reject({success: false, info: response.data.outCommonHeader.result});
                    }

                }), function error() {
                    reject({success: false, type: 'not-found'});
                };
            });
        };
        
        InsuranceMedicalSrv.prototype.sendEmailNotificationEmisionPMM = function (objectJson) {
            return $q(function (resolve, reject) {
                $http({
                    method: 'POST',
                    url: URLS.sendEmailNotificationEmisionPMM,
                    params: objectJson
                }).then(function success(response) {
                    var _response;
                    if (response.data.outCommonHeader.result.result === 1) {
                        _response = response.data.outCommonHeader.result;
                        resolve({success: true, info: _response});
                    } else {
                        reject({success: false, info: response.data.outCommonHeader.result});
                    }
                }, function error() {
                    reject({success: false, type: 'not-found'});
                });
            });
        };

        InsuranceMedicalSrv.prototype.sendEmailNotificationCotizationPMM = function (objectJson) {
            return $q(function (resolve, reject) {
                $http({
                    method: 'POST',
                    url: URLS.sendEmailNotificationCotizationPMM,
                    params: objectJson
                }).then(function success(response) {
                    var _response;
                    if (response.data.outCommonHeader.result.result === 1) {
                        _response = response.data.outCommonHeader.result;
                        resolve({success: true, info: _response});
                    } else {
                        reject({success: false, info: response.data.outCommonHeader.result});
                    }
                }, function error() {
                    reject({success: false, type: 'not-found'});
                });
            });
        };

        InsuranceMedicalSrv.prototype.getCatalogExpenseJob = function () {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getMedicalExpenseJobQuery,
                    params: {
                        language: 'SPA'
                    }
                }).then(function success(response) {
                    var _response;
                    if(response.data.outCommonHeader.result.result === 1){
                        _response = response.data.outMedicalExpenseJobQuery.medicalExpenseJob;
                        resolve({success: true, info: _response});
                    }else{
                        reject({success: false, info: response.data.outCommonHeader.result});
                    }
                    
                 }),function error() {
                     reject({success: false, type: 'not-found'});
                 };
            });
        };


        
        InsuranceMedicalSrv.prototype.getCatalogProfesiones = function () {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getMedicalExpenseJobQuery,
                    params: {
                        language: 'SPA'
                    }
                }).then(function success(response) {
                    var _response;
                    if(response.data.outCommonHeader.result.result === 1){
                        _response = response.data.outMedicalExpenseJobQuery.medicalExpenseJob;
                        resolve({success: true, info: _response});
                    }else{
                        reject({success: false, info: response.data.outCommonHeader.result});
                    }
                    
                 }),function error() {
                     reject({success: false, type: 'not-found'});
                 };
            });
        };

        InsuranceMedicalSrv.prototype.getCatalogPolicyNumber = function () {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getMedicalExpensePolicyHolderNumQuery,
                    params: {
                        language: 'SPA'
                    }
                }).then(function success(response) {
                    var _response;
                    if(response.data.outCommonHeader.result.result === 1){
                        _response = response.data.outMedicalExpensePolicyHolderNumQuery.medicalExpensePolicyHolderNum;
                        resolve({success: true, info: _response});
                    }else{
                        reject({success: false, info: response.data.outCommonHeader.result});
                    }
                    
                 }),function error() {
                     reject({success: false, type: 'not-found'});
                 };
            });
        };

        InsuranceMedicalSrv.prototype.getCatalogMedicalState = function () {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getMedicalExpenseStateQuery,
                    params: {
                        language: 'SPA'
                    }
                }).then(function success(response) {
                    var _response;
                    if(response.data.outCommonHeader.result.result === 1){
                        _response = response.data.outMedicalExpenseStateQuery.medicalExpenseState;
                        resolve({success: true, info: _response});
                    }else{
                        reject({success: false, info: response.data.outCommonHeader.result});
                    }
                    
                 }),function error() {
                     reject({success: false, type: 'not-found'});
                 };
            });
        };

        InsuranceMedicalSrv.prototype.getCatalogMedicalLocation = function (idEntity) {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getMedicalExpenseLocationQuery,
                    params: {
                        language: 'SPA',
                        stateID: idEntity
                    }
                }).then(function success(response) {
                    var _response;
                    if(response.data.outCommonHeader.result.result === 1){
                        _response = response.data.outMedicalExpenseLocationQuery.medicalExpenseLocation;
                        resolve({success: true, info: _response});
                    }else{
                        reject({success: false, info: response.data.outCommonHeader.result});
                    }
                    
                 }),function error() {
                     reject({success: false, type: 'not-found'});
                 };
            });
        };

        InsuranceMedicalSrv.prototype.getMedicalExpenseRelationship = function () {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getMedicalExpenseRelationshipQuery,
                    params: {
                        language: 'SPA',
                    }
                }).then(function success(response) {
                    var _response;
                    if(response.data.outCommonHeader.result.result === 1){
                        _response = response.data.outMedicalExpenseRelationshipQuery.medicalExpenseRelationship;
                        resolve({success: true, info: _response});
                    }else{
                        reject({success: false, info: response.data.outCommonHeader.result});
                    }
                    
                 }),function error() {
                     reject({success: false, type: 'not-found'});
                 };
            });
        };

        InsuranceMedicalSrv.prototype.getCatalogExpenseSports = function () {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getMedicalExpenseSportsQuery,
                    params: {
                        language: 'SPA'
                    }
                }).then(function success(response) {
                    var _response;
                    if(response.data.outCommonHeader.result.result === 1){
                        _response = response.data.outMedicalExpenseSportsQuery.medicalExpenseSport;
                        resolve({success: true, info: _response});
                    }else{
                        reject({success: false, info: response.data.outCommonHeader.result});
                    }
                    
                 }),function error() {
                     reject({success: false, type: 'not-found'});
                 };
            });
        };

        InsuranceMedicalSrv.prototype.getCatalogExpenseProfessions = function () {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getMedicalExpenseProfessionsQuery,
                    params: {
                        language: 'SPA'
                    }
                }).then(function success(response) {
                    var _response;
                    if(response.data.outCommonHeader.result.result === 1){
                        _response = response.data.outMedicalExpenseProfessionsQuery.medicalExpenseProfession;
                        resolve({success: true, info: _response});
                    }else{
                        reject({success: false, info: response.data.outCommonHeader.result});
                    }
                    
                 }),function error() {
                     reject({success: false, type: 'not-found'});
                 };
            });
        };

        InsuranceMedicalSrv.prototype.getCatalogExpenseProfessions = function () {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getMedicalExpenseProfessionsQuery,
                    params: {
                        language: 'SPA'
                    }
                }).then(function success(response) {
                    var _response;
                    if(response.data.outCommonHeader.result.result === 1){
                        _response = response.data.outMedicalExpenseProfessionsQuery.medicalExpenseProfession;
                        resolve({success: true, info: _response});
                    }else{
                        reject({success: false, info: response.data.outCommonHeader.result});
                    }
                    
                 }),function error() {
                     reject({success: false, type: 'not-found'});
                 };
            });
        };

    //Deducible    
        InsuranceMedicalSrv.prototype.getMedicalExpenseDeductible = function (newValue) {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getMedicalExpenseDeductibleQuery,
                    params: {
                        language: 'SPA',
                        deductibleDesc: newValue
                    }
                }).then(function success(response) {
                    var _response;
                    if(response.data.outCommonHeader.result.result === 1){
                        _response = response.data.outMedicalExpenseDeductibleQuery.medicalExpenseDeductible;
                        resolve({success: true, info: _response});
                    }else{
                        reject({success: false, info: response.data.outCommonHeader.result});
                    }
                    
                 }),function error() {
                     reject({success: false, type: 'not-found'});
                 };
            });
        };

    //Coaseguro
        InsuranceMedicalSrv.prototype.getMedicalExpenseCoinsurance = function (newValue) {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getMedicalExpenseCoinsuranceQuery,
                    params: {
                        language: 'SPA',
                        deductibleDesc:newValue
                    }
                }).then(function success(response) {
                    var _response;
                    if(response.data.outCommonHeader.result.result === 1){
                        _response = response.data.outMedicalExpenseCoinsuranceQuery.medicalExpenseCoinsurance;
                        resolve({success: true, info: _response});
                    }else{
                        reject({success: false, info: response.data.outCommonHeader.result});
                    }
                    
                 }),function error() {
                     reject({success: false, type: 'not-found'});
                 };
            });
        };

    //Deducible red
        InsuranceMedicalSrv.prototype.getMedicalExpenseDeductibleRed = function (newValue) {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getMedicalExpenseDeductibleRedQuery,
                    params: {
                        language: 'SPA',
                        deductibleDesc: newValue
                    }
                }).then(function success(response) {
                    var _response;
                    if(response.data.outCommonHeader.result.result === 1){
                        _response = response.data.outMedicalExpenseDeductibleRedQuery.medicalExpenseDeductibleRed;
                        resolve({success: true, info: _response});
                    }else{
                        reject({success: false, info: response.data.outCommonHeader.result});
                    }
                    
                 }),function error() {
                     reject({success: false, type: 'not-found'});
                 };
            });
        };

    //Tope coaseguro
        InsuranceMedicalSrv.prototype.getMedicalExpenseMaxCoinsurance = function (newValue) {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getMedicalExpenseMaxCoinsuranceQuery,
                    params: {
                        language: 'SPA',
                        deductibleDesc: newValue
                    }
                }).then(function success(response) {
                    var _response;
                    if(response.data.outCommonHeader.result.result === 1){
                        _response = response.data.outMedicalExpenseMaxCoinsuranceQuery.medicalExpenseMaxCoinsurance;
                        resolve({success: true, info: _response});
                    }else{
                        reject({success: false, info: response.data.outCommonHeader.result});
                    }
                    
                 }),function error() {
                     reject({success: false, type: 'not-found'});
                 };
            });
        };


        InsuranceMedicalSrv.prototype.getMedicalInsuranceFiscalIDNumber = function (_params) {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getMedicalInsuranceFiscalIDNumberQuery,
                    params: _params
                }).then(function success(response) {
                    var _response;
                    if (response.data.outCommonHeader.result.result === 1) {
                        _response = response.data.outInsuranceFiscalIDNumberQuery;
                        resolve({success: true, info: _response});
                    } else {
                        reject({success: false, info: response.data.outCommonHeader.result});
                    }
                }), function error() {
                    reject({success: false, type: 'not-found'});
                };
            });
        };

        InsuranceMedicalSrv.prototype.getMedicalExpenseInsuranceRequotation = function (paramsRecotizacion) {
            
            paramsRecotizacion.language = 'SPA';
            return $q(function (resolve, reject) {
                $http({
                    method: 'POST',
                    url: URLS.getMedicalExpenseInsuranceRequotationQuery,
                   
                    data: $.param(paramsRecotizacion)
                }).then(function success(response) {
                        var _response;
                        if(response.data.outCommonHeader.result.result === 1){
                            _response = response.data.outMedicalExpenseInsuranceRequotation;
                            resolve({success: true, info: _response});
                        }else{
                            reject({success: false, info: response.data.outCommonHeader.result});
                        }
                        
                     }),function error() {
                         reject({success: false, type: 'not-found'});
                     };      

            });
        };
        
        InsuranceMedicalSrv.prototype.getInsuranceCountryQuery = function (_params) {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getInsuranceCountryQuery,
                    params: _params
                }).then(function success(response) {
                    var _response;
                    if (response.data.outCommonHeader.result.result === 1) {
                        _response = response.data.outInsuranceCountryQuery.insuranceCountry;
                        resolve({success: true, info: _response});
                    } else {
                        reject({success: false, info: response.data.outCommonHeader.result});
                    }
                }), function error() {
                    reject({success: false, type: 'not-found'});
                };
            });
        };
        
        InsuranceMedicalSrv.prototype.getInsuranceBusinessActivityQuery = function () {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getInsuranceBusinessActivityQuery,
                    params: {
                        language: 'SPA'
                    }
                }).then(function success(response) {
                    var _response;
                    if (response.data.outCommonHeader.result.result === 1) {
                        _response = response.data.outInsuranceBusinessActivityQuery.businessActivityData;
                        resolve({success: true, info: _response});
                    } else {
                        reject({success: false, info: response.data.outCommonHeader.result});
                    }
                }), function error() {
                    reject({success: false, type: 'not-found'});
                };
            });
        };

        InsuranceMedicalSrv.prototype.getInsuranceIdentificationTypeQuery = function () {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getInsuranceIdentificationTypeQuery,
                    params: {
                        language: 'SPA'
                    }

                }).then(function success(response) {
                    var _response;
                    if (response.data.outCommonHeader.result.result === 1) {
                        _response = response.data.outInsuranceIdentificationTypeQuery.identificationTypeData;
                        resolve({success: true, info: _response});
                    } else {
                        reject({success: false, info: response.data.outCommonHeader.result});
                    }
                }), function error() {
                    reject({success: false, type: 'not-found'});
                };
            });
        };


        return new InsuranceMedicalSrv();
    }

    angular
        .module('actinver.controllers')
        .service('insuranceMedicalSrv', insuranceMedicalSrv);

})();
