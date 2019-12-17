(function () {
    'use strict';

    function insurancePymeSrv(URLS, $q, $http) {
        /**
         *  prospect service
         */
        function InsurancePymeSrv() {}

        InsurancePymeSrv.prototype.getCatalogPostalCode = function (_idMunicipality) {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getCatalogPostalCodeQuery + _idMunicipality,
                    params: {
                        language: 'SPA',
                        MunicipalityID: _idMunicipality
                    }
                }).then(function success(response) {
                    var _response;
                    if (response.data.outCommonHeader.result.result === 1) {
                        _response = response.data.outPostalCodeQuery.postalCodeList;
                        resolve({success: true, info: _response});
                    } else {
                        reject({success: false, info: response.data.outCommonHeader.result});
                    }
                }, function error() {
                    reject({success: false, type: 'not-found'});
                });
            });
        };

        InsurancePymeSrv.prototype.getCatalogInsuranceRiskType = function (_businessActivity, _businessActivitySubtype) {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getCatalogInsuranceRiskTypeQuery + _businessActivity + "/" + _businessActivitySubtype,
                    params: {
                        language: 'SPA',
                        BusinessActivity: _businessActivity,
                        BusinessActivitySubtype: _businessActivitySubtype
                    }
                }).then(function success(response) {
                    var _response;
                    if (response.data.outCommonHeader.result.result === 1) {
                        _response = response.data.outInsuranceRiskTypeQuery.riskTypeList.riskTypeDetail;
                        resolve({success: true, info: _response});
                    } else {
                        reject({success: false, info: response.data.outCommonHeader.result});
                    }
                }, function error() {
                    reject({success: false, type: 'not-found'});
                });
            });
        };

        InsurancePymeSrv.prototype.getCatalogWallType = function () {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getCatalogWallTypeQuery,
                    params: {
                        language: 'SPA'
                    }
                }).then(function success(response) {
                    var _response;
                    if (response.data.outCommonHeader.result.result === 1) {
                        _response = response.data.outWallTypeQuery.wallTypeList.wallTypeDetail;
                        resolve({success: true, info: _response});
                    } else {
                        reject({success: false, info: response.data.outCommonHeader.result});
                    }
                }, function error() {
                    reject({success: false, type: 'not-found'});
                });
            });
        };

        InsurancePymeSrv.prototype.getCatalogRoofType = function (_wallTypeID) {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getCatalogRoofTypeQuery + _wallTypeID,
                    params: {
                        language: 'SPA',
                        WallTypeID: _wallTypeID
                    }
                }).then(function success(response) {
                    var _response;
                    if (response.data.outCommonHeader.result.result === 1) {
                        _response = response.data.outRoofTypeQuery.roofTypeList.roofTypeDetail;
                        resolve({success: true, info: _response});
                    } else {
                        reject({success: false, info: response.data.outCommonHeader.result});
                    }
                }, function error() {
                    reject({success: false, type: 'not-found'});
                });
            });
        };

        InsurancePymeSrv.prototype.getCatalogStreetTypeQuery = function () {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getCatalogStreetTypeQuery,
                    params: {
                        language: 'SPA'
                    }
                }).then(function success(response) {
                    var _response;
                    if (response.data.outCommonHeader.result.result === 1) {
                        _response = response.data.outStreetTypeQuery.streetTypeList;
                        resolve({success: true, info: _response});
                    } else {
                        reject({success: false, info: response.data.outCommonHeader.result});
                    }
                }, function error() {
                    reject({success: false, type: 'not-found'});
                });
            });
        };

        InsurancePymeSrv.prototype.getCatalogCardTypeQuery = function () {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getCatalogCardTypeQuery,
                    params: {
                        language: 'SPA'
                    }
                }).then(function success(response) {
                    var _response;
                    if (response.data.outCommonHeader.result.result === 1) {
                        _response = response.data.outInsuranceCardTypeQuery.cardTypeList;
                        resolve({success: true, info: _response});
                    } else {
                        reject({success: false, info: response.data.outCommonHeader.result});
                    }
                }, function error() {
                    reject({success: false, type: 'not-found'});
                });
            });
        };

        InsurancePymeSrv.prototype.getCatalogPaymentTypeQuery = function () {
            console.log("hiola desde houses svr ");
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getCatalogPaymentTypeQuery,
                    params: {
                        language: 'SPA'
                    }
                }).then(function success(response) {
                    var _response;
                    if (response.data.outCommonHeader.result.result === 1) {
                        _response = response.data.outPaymentTypeQuery.paymentTypeList;
                        resolve({success: true, info: _response});
                    } else {
                        reject({success: false, info: response.data.outCommonHeader.result});
                    }
                }, function error() {
                    reject({success: false, type: 'not-found'});
                });
            });
        };



        InsurancePymeSrv.prototype.getListQuotations = function (_params) {
            return $q(function (resolve, reject) {
                $http({
                    method: 'POST',
                    url: URLS.getCotizationSearch,
                    params: _params
                }).then(function success(response) {
                    if (response.data.return.status === 1) {
                        var _response = response.data.return.data.listInsuranceQuotationRs;
                        resolve({success: true, info: _response});
                    } else {
                        resolve({success: false, info: "not-found"});
                    }
                }, function error() {
                    reject({success: false, type: 'not-found'});
                }
                );
            });
        };

        //modificado nombre y URL de la funcion
        InsurancePymeSrv.prototype.getServiceCotizacionPyme = function (_datos) {

            return $q(function (resolve, reject) {
                $http({
                    method: 'POST',
                    url: URLS.getServiceCotizacionPyme,
                    params: _datos

                }).then(function success(response) {
                    var _response;
                    if (response.data.outCommonHeader.result.result.toString() === "1") {
                        _response = response.data.outHomeInsuranceQuotation;
                        resolve({success: true, info: _response,response:response.data});
                    } else {
                        resolve({success: false, info: response.data.outCommonHeader.result});
                    }
                }, function error() {
                    reject({success: false, type: 'not-found'});
                });
            });
        };

        //modificado nombre y URL de la funcion
        InsurancePymeSrv.prototype.getServiceEmisionPyme = function (_datos) {

            return $q(function (resolve, reject) {
                $http({
                    method: 'POST',
                    url: URLS.getServiceEmisionPyme,
                    params: _datos

                }).then(function success(response) {
                    var _response;
                    if (response.data.outCommonHeader.result.result === 1) {
                        _response = response.data.outHomeInsurancePolicyRegistration;
                        resolve({success: true, info: _response, response: response.data});
                    } else {
                        resolve({success: false, info: response.data.outCommonHeader.result});
                    }
                }, function error() {
                    reject({success: false, type: 'not-found'});
                });
            });
        };

        InsurancePymeSrv.prototype.updateQuotation = function (_datos) {

            return $q(function (resolve, reject) {
                $http({
                    method: 'POST',
                    url: URLS.getCotizationUpdate,
                    params: _datos

                }).then(function success(response) {
                    console.log('response update', response);
                    var _response;
                    if (response.data.return.status === 1) {
                        _response = response.data.return.data.listInsuranceQuotationRs[0];
                        resolve({success: true, info: _response, response: response.data});
                    } else {
                        resolve({success: false, info: response.data.outCommonHeader.result});
                    }
                }, function error() {
                    console.log('response update', error);
                    reject({success: false, type: 'not-found'});
                });
            });
        };

        InsurancePymeSrv.prototype.getCoverage = function () {

            return $q(function (resolve, reject) {
                $http({
                    method: 'POST',
                    url: URLS.getCoverage + "?language=SPA"
                }).then(function success(response) {
                    console.log("Original:");
                    console.log(response);
                    if (response.data.return.status === 1) {
                        //console.log(response.data.listInsuranceCoverageRs);
                        var _response = response.data.return.data.listInsuranceCoverageRs;
                        console.log("Lista de Coberturas: " + _response);
                        resolve({success: true, info: _response});
                    } else {
                        resolve({success: false, info: "not-found"});
                    }
                    /*if ( _response.status === 1 ) {
                     _response = response.data.listInsuranceCoverageRs;
                     resolve( {success: true, info: _response } );
                     }else{
                     resolve( {success: false, info: response.data.outCommonHeader.result });
                     }*/
                }, function error() {
                    reject({success: false, type: 'not-found'});
                });
            });
        };

        InsurancePymeSrv.prototype.getCotizationAdd = function (_datos) {

            return $q(function (resolve, reject) {
                $http({
                    method: 'POST',
                    url: URLS.getCotizationAdd,
                    params: _datos
                }).then(function success(response) {
                    console.log("respuesta");
                    console.log(response);
                    if (response.data.return.status === 1) {
                        var _response = response.data.return.data.listInsuranceQuotationRs;
                        resolve({success: true, info: _response});
                    } else {
                        resolve({success: false, info: "not-found"});
                    }
                }, function error() {
                    reject({success: false, type: 'not-found'});
                }
                );
            });
        };

        InsurancePymeSrv.prototype.getCotizationUpdate = function (_datos) {

            return $q(function (resolve, reject) {
                $http({
                    method: 'POST',
                    url: URLS.getCotizationUpdate,
                    params: _datos

                }).then(function success(response) {
                    var _response;
                    if (response.data.outCommonHeader.result.result.toString() === "1") {
                        _response = response.data.outHomeInsurancePolicyRegistration;
                        resolve({success: true, info: _response});
                    } else {
                        resolve({success: false, info: response.messages});
                    }
                }, function error() {
                    reject({success: false, type: 'not-found'});
                });
            });
        };

        //modificado nombre y URL de la funcion
        InsurancePymeSrv.prototype.sendEmailNotificationCotizationPyme = function (objectJson) {
            return $q(function (resolve, reject) {
                $http({
                    method: 'POST',
                    url: URLS.sendEmailNotificationCotizationPyme,
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

        //modificado nombre y URL de la funcion
        InsurancePymeSrv.prototype.sendEmailNotificationEmisionPyme = function (objectJson) {
            return $q(function (resolve, reject) {
                $http({
                    method: 'POST',
                    url: URLS.sendEmailNotificationEmisionPyme,
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

        //inicio funciones añadidas 12-11-2019 G.E.
        InsurancePymeSrv.prototype.getCatalogEntityFederativePyme = function () {
            return $q(function( resolve, reject ){
                $http({
                    method: 'GET',
                    url: URLS.getCatalogEntityFederalPyme,
                    params: {
                        language : 'SPA'
                    }
                }).then(function success( response ) {
                    var _response;
                    if ( response.data.outCommonHeader.result.result === 1) {
                        _response = response.data.outFederalEntityQuery.federalEntityCatalogData.federalEntity;
                        resolve( {success: true, info: _response } );
                    }else{
                        reject( {success: false, info: response.data.outCommonHeader.result });
                    }
                }, function error(){
                    reject( {success: false, type: 'not-found'} );
                });
            });
        };

        InsurancePymeSrv.prototype.getCatalogMunicipalityPyme = function ( _idEntityFederative ) {
            return $q(function( resolve, reject ){
                $http({
                    method: 'GET',
                    url: URLS.getCatalogMunicipalityPyme + _idEntityFederative,
                    params: {
                        language : 'SPA'
                    }
                }).then(function success( response ) {
                    var _response;
                    if ( response.data.outCommonHeader.result.result === 1) {
                        _response = response.data.outMunicipalityQuery.municipalityCatalogData.municipality;
                        resolve( {success: true, info: _response } );
                    }else{
                        reject( {success: false, info: response.data.outCommonHeader.result });
                    }
                }, function error(){
                    reject( {success: false, type: 'not-found'} );
                });
            });
        };

        InsurancePymeSrv.prototype.getCatalogBanksPyme = function ( ) {
            return $q(function( resolve, reject ){
                $http({
                    method: 'GET',
                    url: URLS.getCatalogBanksPyme,
                    params: {
                        language : 'SPA'
                    }
                }).then(function success( response ) {
                    var _response;
                    if ( response.data.outCommonHeader.result.result === 1 ) {
                        _response = response.data.outInsuranceBanksQuery.insuranceBanksCatalogData.bank;
                        resolve( {success: true, info: _response } );
                    }else{
                        reject( {success: false, info: response.data.outCommonHeader.result });
                    }
                }, function error(){
                    reject( {success: false, type: 'not-found'} );
                });
            });
        };

        InsurancePymeSrv.prototype.getCatalogClasificationQuery = function () {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getCatalogClasificationQuery,
                    params: {
                        language: 'SPA'
                    }
                }).then(function success(response) {
                    var _response;
                    if (response.data.outCommonHeader.result.result === 1) {
                        _response = response.data.outStreetTypeQuery.streetTypeList; //modificar
                        resolve({success: true, info: _response});
                    } else {
                        reject({success: false, info: response.data.outCommonHeader.result});
                    }
                }, function error() {
                    reject({success: false, type: 'not-found'});
                });
            });
        };
        //fin funciones añadidas 12-11-2019 G.E.

        return new InsurancePymeSrv();

    }

    angular
            .module('actinver.controllers')
            .service('insurancePymeSrv', insurancePymeSrv);

})();
