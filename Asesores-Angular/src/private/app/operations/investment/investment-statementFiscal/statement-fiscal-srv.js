(function () {
    'use strict';

    function statementFiscalSrv($q, $http, URLS) {

        /**
        *  statement Fiscal Service
        */
        function StatementFiscal() { }
        StatementFiscal.prototype.getStatementFiscales = function ( _contractNumber, _typeAccountStatement ) {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getStatementFiscal + _contractNumber+'/'+_typeAccountStatement,
                    params: {
                        language: 'SPA'
                    }
                })
                    .then(function (_response) {
                        if (_response.data.outCommonHeader.result.result === 1) {
                            resolve(_response.data.outAccountStatementAvailabilityQuery);
                        } else {
                            reject(_response.data.outCommonHeader.result);
                        }
                    });
            });
        };

        StatementFiscal.prototype.getStatementFiscalesPormenorizadas = function ( _contractNumber, _businessType ) {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getStatementFiscalPormenorizadas+_contractNumber+'/'+_businessType,
                    params: {
                        language: 'SPA'
                    }
                })
                    .then(function (_response) {
                        if (_response.data.outCommonHeader.result.result === 1) {
                            resolve(_response.data.outFiscalCertificateAvailableQuery);
                        } else {
                            reject(_response.data.outCommonHeader.result);
                        }
                    });
            });
        };

        StatementFiscal.prototype.sendEmailNotificationStatementFiscal = function ( _contractNumber, _businessType, _documentKeyValue, _month, _year, _typeAccountStatement, objectJson) {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.sendEmailNotificationStatementFiscalQuery +_contractNumber+'/'+_businessType+'/'+_documentKeyValue+'/'+_month+'/'+_year+'/'+_typeAccountStatement,
                    params: objectJson
                })
                    .then(function ( response ) {
                        if ( response.data.outCommonHeader.result.result === 1) {
                            resolve( response.data.outCommonHeader );
                        } else {
                            reject( response.data.outCommonHeader.result );
                        }
                    });
            });
        };

        StatementFiscal.prototype.sendEmailNotificationStatementFiscalNew = function ( _params ) {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.sendEmailNotificationStatementFiscalQuery + _params.contract + '/' + _params.businessType + '/' + _params.documentKeyValue + '/' + _params.month + '/' + _params.year + '/' + _params.typeAccountStatement + '/' + _params.documentTypeID,
                    params: {
                        language: 'SPA',
                        emailTo: _params.email
                    }
                })
                    .then(function ( response ) {
                        if ( response.data.outCommonHeader.result.result === 1) {
                            resolve( {
                                status: true,
                                message: 'Se envió el correo correctamente'
                            } );
                        } else {
                            reject( {
                                status: false,
                                message: response.data.outCommonHeader.result.messages[0].responseMessage
                            } );
                        }
                    });
            });
        };


        return new StatementFiscal();
    }

    angular
        .module('actinver.services')
        .service('statementFiscalSrv', statementFiscalSrv);

})();