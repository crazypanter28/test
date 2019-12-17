(function () {
    "use strict";

    function dinnSrv(URLS, $q, $http, ErrorMessagesSrv) {

        function dinnSrv() { }

        dinnSrv.prototype.getDCScheduleQuery = function (_params) {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getDCScheduleQuery,
                    params: {
                        interviewNumber: _params.interviewNumber,
                        clientId: _params.clientId,
                        registryType: 2,
                        language: 'SPA'
                    }
                }).then(function (response) {
                    if (response.data.outCommonHeader.result.result === 1) {
                        resolve(response.data.outDCScheduleQuery.scheduleInfo.otherPhoneNumber);
                    } else if (response.data.outCommonHeader.result.result === 2) {
                        resolve('response.data.outCommonHeader.result.messages[0].responseMessage');
                    }
                }).catch(function (error) {
                    ErrorMessagesSrv('Se encontró un error favor de intentarlo más tarde, comuníquese con su help desk');
                    reject({ error: error.data });
                });
            });
        };

        dinnSrv.prototype.getDCDocumentQuery = function (_documentID) {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getDCDocumentQuery + _documentID,
                    params: {
                        language: 'SPA'
                    }
                }).then(function (response) {
                    if (response.data.outCommonHeader.result.result === 1) {
                        resolve(response.data.outDCDocumentQuery.documentInfo[0].arrayFile);
                    } else if (response.data.outCommonHeader.result.result === 2) {
                        resolve('response.data.outCommonHeader.result.messages[0].responseMessage');
                    }
                }).catch(function (error) {
                    ErrorMessagesSrv('Se encontró un error favor de intentarlo más tarde, comuníquese con su help desk');
                    reject({ error: error.data });
                });
            });
        };

        dinnSrv.prototype.getDCDocumentQueryByClient = function (_clientId) {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getDCDocumentQueryByClient + _clientId,
                    params: {
                        language: 'SPA'
                    }
                }).then(function (response) {
                    if (response.data.outCommonHeader.result.result === 1) {
                        resolve(response.data.outDCDocumentQueryByClient.documentInfo);
                    } else if (response.data.outCommonHeader.result.result === 2) {
                        resolve(response.data.outCommonHeader.result.messages[0].responseMessage);
                    }
                }).catch(function (error) {
                    ErrorMessagesSrv('Se encontró un error favor de intentarlo más tarde, comuníquese con su help desk');
                    reject({ error: error.data });
                });
            });
        };

        dinnSrv.prototype.getDCScheduleQueryByDate = function (_interviewDate, _operationType) {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getDCScheduleQueryByDate + _interviewDate + '/' + _operationType,
                    params: {
                        language: 'SPA'
                    }
                }).then(function (response) {
                    if (response.data.outCommonHeader.result.result === 1) {
                        resolve(response.data.outDCScheduleQueryByDate);
                    } else if (response.data.outCommonHeader.result.result === 2) {
                        resolve('response.data.outCommonHeader.result.messages[0].responseMessage');
                    }
                }).catch(function (error) {
                    ErrorMessagesSrv('Se encontró un error favor de intentarlo más tarde, comuníquese con su help desk');
                    reject({ error: error.data });
                });
            });
        };

        dinnSrv.prototype.getDCScheduleQueryByDateDetails = function (_interviewDate, _operationType) {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getDCScheduleQueryByDateDetails + _interviewDate + '/' + _operationType,
                    params: {
                        language: 'SPA'
                    }
                }).then(function (response) {
                    resolve(response.data.result);
                    /*if (typeof response.data.result !== 'undefined' && response.data.result !== null) {
                        resolve(response.data.result);
                    } else if (response.data.outCommonHeader.result.result === 2) {
                        resolve('response.data.outCommonHeader.result.messages[0].responseMessage');
                    }*/
                }).catch(function (error) {
                    ErrorMessagesSrv('Se encontró un error favor de intentarlo más tarde, comuníquese con su help desk');
                    reject({ error: error.data });
                });
            });
        };

        dinnSrv.prototype.getDCInvestmentProspectQueryById = function (_clientId) {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getDCInvestmentProspectQueryById + _clientId,
                    params: {
                        language: 'SPA'
                    }
                }).then(function (response) {
                    if (response.data.outCommonHeader.result.result === 1) {
                        resolve(response.data.outDCInvestmentProspectQueryById);
                    } else if (response.data.outCommonHeader.result.result === 2) {
                        resolve('response.data.outCommonHeader.result.messages[0].responseMessage');
                    }
                }).catch(function (error) {
                    ErrorMessagesSrv('Se encontró un error favor de intentarlo más tarde, comuníquese con su help desk');
                    reject({ error: error.data });
                });
            });
        };

        dinnSrv.prototype.getDCInvestmentProspectQuery = function (_email) {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getDCInvestmentProspectQuery,
                    params: {
                        language: 'SPA',
                        email: _email
                    }
                }).then(function (response) {
                    if (response.data.outCommonHeader.result.result === 1) {
                        resolve(response.data.outDCInvestmentProspectQuery);
                    } else if (response.data.outCommonHeader.result.result === 2) {
                        resolve('response.data.outCommonHeader.result.messages[0].responseMessage');
                    }
                }).catch(function (error) {
                    ErrorMessagesSrv('Se encontró un error favor de intentarlo más tarde, comuníquese con su help desk');
                    reject({ error: error.data });
                });
            });
        };

        return new dinnSrv();
    }

    angular
        .module('actinver.services')
        .factory('dinnSrv', dinnSrv);
})();