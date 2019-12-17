(function () {
    "use strict";

    function ProfilesSrv(URLS, $q, $http, ErrorMessagesSrv, csrfSrv) {
        /**
         *  prospect service
         */
        function Profiles() { }

        Profiles.prototype.getRoles = function () {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getRoles,
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
                });
            });
        };

        Profiles.prototype.getUserRoles = function (_id) {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getUserRoles + _id,
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
                });
            });
        };

        Profiles.prototype.saveProfile = function (_model) {
            return $q(function (resolve, reject) {

                csrfSrv.csrfValidate()
                    .then(successCsrf)
                    .catch(errorCsrf);

                function successCsrf() {
                    var parametersSubmit = {
                        userCodeRegister: _model.userCodeRegister,
                        idRole: _model.idRole,
                        idEmployeeRegister: _model.employeeID,
                        language: 'SPA'
                    };
                    $http({
                        method: 'POST',
                        url: URLS.saveUserRole,
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

        Profiles.prototype.removeProfile = function (_id) {
            return $q(function (resolve, reject) {

                csrfSrv.csrfValidate()
                    .then(successCsrf)
                    .catch(errorCsrf);

                function successCsrf() {
                    var parametersSubmit = {
                        idUserRole: _id,
                        language: 'SPA'
                    };
                    $http({
                        method: 'POST',
                        url: URLS.deleteUserRole,
                        data: $.param(parametersSubmit)
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

        return new Profiles();
    }

    angular.module('actinver.services')
        .service('ProfilesSrv', ProfilesSrv);
})();
