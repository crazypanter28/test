(function() {
    "use strict";

    function InvestmentAdminSrv( URLS, $q, $http, ErrorMessagesSrv, csrfSrv ) {
        /**
         *  prospect service
         */
        function InvestmentSrv(){}

        InvestmentSrv.prototype.getFundTypes = function () {
            return $q(function( resolve, reject ){
                $http({
                    method: 'GET',
                    url: URLS.getFundTypes,
                    params:{
                        language: 'SPA'
                    }
                }).then(function(response) {
                    if( !!response.data.status ){
                        resolve( response.data.result );
                    }else{
                        ErrorMessagesSrv( response.data.messages );
                        reject();
                    }
                }).catch( reject );
            });
        };

        InvestmentSrv.prototype.saveInvestment = function ( _model ) {
            return $q(function( resolve, reject ){

                csrfSrv.csrfValidate()
                .then(successCsrf)
                .catch(errorCsrf);

                function successCsrf() {
                    var parametersSubmit = {
                        name:_model.name, description:_model.description, 
                        idFundType:_model.clasification.idFundType, 
                        language: 'SPA'
                    };
                    $http({
                        method: 'POST',
                        url: URLS.saveFund,
                        data: $.param(parametersSubmit),
                    }).then(function (response) {
                        if (response.data.status === 1) {
                            resolve({ success: true, data: response.data.messages[0].description });
                        } else if (response.data.status === 2) {
                            resolve({ success: false, data: response.data.messages[0].description });
                        }
                    }).catch(function () {
                        ErrorMessagesSrv('Se encontró un error favor de intentarlo más tarde, comuníquese con su help desk');
                    });
                }

                function errorCsrf(error) {
                    reject(error);
                }
                
            });
        };


        InvestmentSrv.prototype.updateInvestment = function ( _model ) {
            return $q(function( resolve, reject ){

                csrfSrv.csrfValidate()
                .then(successCsrf)
                .catch(errorCsrf);

                function successCsrf() {
                    var parametersSubmit = {
                        name:_model.name, 
                        description:_model.description, 
                        idFund:_model.idFund, 
                        language: 'SPA'
                    };
                    $http({
                        method: 'POST',
                        url: URLS.updateFund,
                        data: $.param(parametersSubmit),
                    }).then(function (response) {
                        if (response.data.status === 1) {
                            resolve({ success: true, data: response.data.messages[0].description });
                        } else if (response.data.status === 2) {
                            resolve({ success: false, data: response.data.messages[0].description });
                        }
                    }).catch(function () {
                        ErrorMessagesSrv('Se encontró un error favor de intentarlo más tarde, comuníquese con su help desk');
                    });
                }
                    
                function errorCsrf(error) {
                    reject(error);
                }
 
            });
        };

        InvestmentSrv.prototype.removeInvestment = function ( _id ) {
            return $q(function( resolve, reject ){

                csrfSrv.csrfValidate()
                .then(successCsrf)
                .catch(errorCsrf);

                function successCsrf() {
                    var parametersSubmit = {
                        idFund:_id, 
                        language: 'SPA'
                    };
                    $http({
                        method: 'POST',
                        url: URLS.deleteFund,
                        data: $.param(parametersSubmit),
                    }).then(function (response) {
                        if (response.data.status === 1) {
                            resolve({ success: true, data: response.data.messages[0].description });
                        } else if (response.data.status === 2) {
                            resolve({ success: false, data: response.data.messages[0].description });
                        }
                    }).catch(function () {
                        ErrorMessagesSrv('Se encontró un error favor de intentarlo más tarde, comuníquese con su help desk');
                    });
                }
                    
                function errorCsrf(error) {
                    reject(error);
                }

            });
        };

        return new InvestmentSrv();
    }

    angular.module('actinver.services')
        .service('InvestmentAdminSrv', InvestmentAdminSrv);
})();
