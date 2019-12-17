
(function () {
    "use strict";

    function EmployeeAdminSrv(URLS, $q, $http, ErrorMessagesSrv, csrfSrv) {
        /**
         *  prospect service
         */
        function Employee() { }

        Employee.prototype.getEmployeeMap = function (_id) {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getEmployeeMap + _id,
                    params: {
                        language: 'SPA'
                    }
                }).then(function (response) {
                    if (!!response.data.status) {
                        resolve(response.data.result);
                    }
                    else {
                        ErrorMessagesSrv(response.data.messages);
                        reject();
                    }
                }).catch(reject);
            });
        };

        Employee.prototype.saveEmployeeMap = function (_model) {
            return $q(function (resolve, reject) {

                csrfSrv.csrfValidate()
                    .then(successCsrf)
                    .catch(errorCsrf);

                function successCsrf() {
                    var parametersSubmit = {
                        prevIdEmployee: _model.old,
                        idEmployee: _model.new,
                        idEmployeeRegister: _model.idEmployeeRegister,
                        language: 'SPA'
                    };
                    $http({
                        method: 'POST',
                        url: URLS.saveEmployeeMap,
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

        Employee.prototype.removeEmployeeMap = function (_id) {
            return $q(function (resolve, reject) {

                csrfSrv.csrfValidate()
                    .then(successCsrf)
                    .catch(errorCsrf);

                function successCsrf() {
                    var parametersSubmit = { 
                        idEmployeeMap: _id,
                        language: 'SPA' 
                    };
                    $http({
                        method: 'POST',
                        url: URLS.deleteEmployeMap,
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

        return new Employee();
    }

    angular.module('actinver.services')
        .service('EmployeeAdminSrv', EmployeeAdminSrv);
})();
