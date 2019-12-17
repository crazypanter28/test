(function () {
    'use strict';

    function proposalsTracingSrv(URLS, $q, $http, userConfig, $filter, $sessionStorage, csrfSrv) {

        var obj = {

            /**
             * Get contract information
             * @return {object}
             */
            getContractInfo: function (contract, bankingArea) {

                return $q(function (resolve, reject) {
                    $http({
                        method: 'GET',
                        url: URLS.getContractInfo + contract + '/' + bankingArea,
                        params: {
                            language: 'SPA'
                        }
                    }).then(function success(response) {
                        if (typeof response !== 'undefined' && response.data.outCommonHeader.result.result === 1) {
                            resolve({ success: true, data: response.data.result, message: response.data.outCommonHeader.result.messages[0].responseMessage });
                        } else {
                            resolve({ success: false, data: [], message: response.data.outCommonHeader.result.messages[0].responseMessage });
                        }

                    }, function error() {
                        reject({ success: false, data: [], message: 'Se encontró un error favor de intentarlo más tarde, comuníquese con su help desk' });
                    });
                });
            },

            /**
             * Post tracing document
             * @param {object} info - Array with all information to post inside proposal
             * @return  {object}
             */
            doTracing: function (info) {
                var products = [];
                var y = {};
                for (var x in info.products) {
                    for (y in info.products[x].subproducts) {
                        var z = {
                            product: y,
                            value: 1
                        };
                        products.push(z);
                    }
                }
                var user = JSON.parse($sessionStorage.user);

                var parametros = {
                    language: 'SPA',
                    contract: (info.scontract.numContrato).toString(),
                    name: user.name,
                    mail: user.mail,
                    ext: info.adviser_ext,
                    confidential: info.confidential && info.confidential === true ? 1 : 0,
                    startDate:info.scontract.origen === 'CB' ?($filter('date')(info.tir.startDate._d, 'ddMMyyyy')): '',
                    endDate: info.scontract.origen === 'CB' ? ($filter('date')(info.tir.endDate._d, 'ddMMyyyy')): '',
                    mobile: info.adviser_mobile ? info.adviser_mobile : 0,
                    phone: info.adviser_phone ? info.adviser_phone : 0,
                    clientType: info.person_type && info.person_type === true ? 1 : 0,
                    serviceType: info.service_type && info.service_type === true ? 1 : 0,
                    comments: info.comment_tracing,
                    source: info.scontract.origen ? info.scontract.origen : '',
                    clientName: info.scontract.nombreCliente,
                    startDate2: info.tir2 ? ($filter('date')(info.tir2.startDate._d, 'ddMMyyyy')) : '00000000',
                    endDate2: info.tir2 ? ($filter('date')(info.tir2.endDate._d, 'ddMMyyyy')) : '00000000',
                    products: products.length === 0 ? 0 : window.btoa(JSON.stringify(products)),
                    plusvalia: info.capital_gain && info.capital_gain === true ? 1 : 0,
                    idEmployee: user.employeeID,
                    createEnvironment: true,
                    createForecast: true
                };

                return $q(function (resolve, reject) {
                    csrfSrv.csrfValidate()
                        .then(successCsrf)
                        .catch(errorCsrf);

                    function successCsrf() {

                        $http({
                            method: 'POST',
                            url: URLS.getCustomerTracking,
                            data: $.param(parametros),
                            responseType: 'arraybuffer'
                        }).then(function success(response) {
                            resolve(response);
                        }, function error(error) {
                            reject(error);
                        });

                    }

                    function errorCsrf(error) {
                        //reject( { success: false } );
                        reject(error);
                    }
                });

            }
        };

        return obj;

    }

    angular
        .module('actinver.controllers')
        .service('proposalsTracingSrv', proposalsTracingSrv);

})();