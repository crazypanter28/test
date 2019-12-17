(function () {
    'use strict';

    function proposalsPropTracingSrv($filter, URLS, $q, $http, csrfSrv, $sessionStorage /*,ErrorMessagesSrv*/) {

        var issuers;

        function getDescripcion(issuer) {

            for (var pos = 0; pos < issuers.length; pos++) {
                if (issuers[pos].name.trim() === issuer.trim()) {
                    return issuers[pos].description;
                }
            }

            return '';
        }

        function doJsonData(_array, montoTotal) {
            var json = [];
            var jsonSubGroup = {};
            var jsonBase = {};

            angular.forEach(_array, function (value, key) {

                if (key === 'Fondo de Fondos') {
                    angular.forEach(value, function (value2) {
                        angular.forEach(value2, function (value3) {
                            jsonBase = {
                                name: key,
                                subGroups: []
                            };
                            jsonSubGroup = {
                                name: value3.subGroup.name,
                                instruments: []

                            };
                            angular.forEach(value3.productLimits, function (instrument) {
                                var jsonInstrument = {
                                    percentage: instrument.percentage,
                                    issuer: instrument.product.issuer.name,
                                    amount: montoTotal * (instrument.percentage) / 100,
                                    description: getDescripcion(instrument.product.issuer.name)
                                };

                                jsonSubGroup.instruments.push(jsonInstrument);
                            });
                            jsonBase.subGroups.push(jsonSubGroup);
                            json.push(jsonBase);
                        });
                    });

                } else if (key === 'Renta Variable') {
                    angular.forEach(value, function (value2) {
                        angular.forEach(value2, function (value3) {
                            jsonBase = {
                                name: key,
                                subGroups: []
                            };
                            jsonSubGroup = {
                                name: unescape(encodeURIComponent(value3.subGroup.name)),
                                instruments: []

                            };
                            angular.forEach(value3.productLimits, function (instrument) {
                                var jsonInstrument = {
                                    percentage: instrument.percentage,
                                    issuer: instrument.product.issuer.name,
                                    amount: montoTotal * (instrument.percentage) / 100,
                                    description: getDescripcion(instrument.product.issuer.name)
                                };

                                jsonSubGroup.instruments.push(jsonInstrument);
                            });
                            jsonBase.subGroups.push(jsonSubGroup);
                            json.push(jsonBase);
                        });
                    });

                } else if (key === 'Fibras') {
                    angular.forEach(value, function (value2) {
                        angular.forEach(value2, function (value3) {
                            jsonBase = {
                                name: key,
                                subGroups: []
                            };
                            jsonSubGroup = {
                                name: value3.subGroup.name,
                                instruments: []

                            };
                            angular.forEach(value3.productLimits, function (instrument) {
                                var jsonInstrument = {
                                    percentage: instrument.percentage,
                                    issuer: instrument.product.issuer.name,
                                    amount: montoTotal * (instrument.percentage) / 100,
                                    description: getDescripcion(instrument.product.issuer.name)
                                };

                                jsonSubGroup.instruments.push(jsonInstrument);
                            });
                            jsonBase.subGroups.push(jsonSubGroup);
                            json.push(jsonBase);
                        });
                    });

                } else if (key === 'Riesgo Cambiario') {
                    angular.forEach(value, function (value2) {
                        angular.forEach(value2, function (value3) {
                            jsonBase = {
                                name: key,
                                subGroups: []
                            };
                            jsonSubGroup = {
                                name: value3.subGroup.name,
                                instruments: []

                            };
                            angular.forEach(value3.productLimits, function (instrument) {
                                var jsonInstrument = {
                                    percentage: instrument.percentage,
                                    issuer: instrument.product.issuer.name,
                                    amount: montoTotal * (instrument.percentage) / 100,
                                    description: getDescripcion(instrument.product.issuer.name)
                                };

                                jsonSubGroup.instruments.push(jsonInstrument);
                            });
                            jsonBase.subGroups.push(jsonSubGroup);
                            json.push(jsonBase);
                        });
                    });


                } else if (key === 'Deuda') {
                    angular.forEach(value, function (value2) {
                        angular.forEach(value2, function (value3) {
                            jsonBase = {
                                name: key,
                                subGroups: []
                            };
                            jsonSubGroup = {
                                name: value3.subGroup.name,
                                instruments: []

                            };

                            angular.forEach(value3.productLimits, function (instrument) {
                                var jsonInstrument = {
                                    percentage: instrument.percentage,
                                    issuer: instrument.product.issuer.name,
                                    amount: montoTotal * (instrument.percentage) / 100,
                                    description: getDescripcion(instrument.product.issuer.name)
                                };

                                jsonSubGroup.instruments.push(jsonInstrument);
                            });
                            jsonBase.subGroups.push(jsonSubGroup);
                            json.push(jsonBase);
                        });

                    });


                }

            });

            return json;
        }

        //var options = ['Sociedades de Inversión', 'Reportos', 'Mercado de dinero', 'Acciones'];
        function doJson(_array) {
            var json = [];
            angular.forEach(_array, function (value, key) {
                angular.forEach(value, function (value2) {
                    if (key === 'invest') {
                        json.push({ 'producto': value2.issuer, 'monto': value2.amount, 'porcentajeInversion': value2.percentage * 100, 'descripcion': value2.description, 'instrumento': 'SOCIEDADES DE INVERSION' });
                    } else if (key === 'actions') {
                        json.push({ 'producto': value2.issuer, 'monto': value2.amount, 'porcentajeInversion': value2.percentage * 100, 'instrumento': 'ACCIONES' });
                    } else if (key === 'money') {
                        json.push({ 'producto': value2.issuer, 'monto': value2.amount, 'porcentajeInversion': value2.percentage * 100, 'instrumento': 'MERCADO DE DINERO' });
                    } else if (key === 'reportos') {
                        json.push({ 'producto': value2.issuer, 'monto': value2.amount, 'porcentajeInversion': value2.percentage * 100, 'instrumento': 'REPORTOS' });
                    }
                });
            });
            return json;
        }

        var obj = {

            /**
             * Post proposal tracing document
             * @param {object} info - Array with all information to post inside proposal
             * @return  {object}
             */

            doProposalTracing: function (info) {
                
                issuers = info.issuers;

                return $q(function (resolve, reject) {
                    var user = JSON.parse($sessionStorage.user);
                    var productsSent = [];
                    
                    if (info.products) {
                        angular.forEach(info.products, function (value) {
                            if (value) {
                                angular.forEach(value.subproducts, function (subproducts, id) {
                                    productsSent.push({ "product": id, "value": 1 });
                                });
                            }
                        });
                    }
                    
                    var dataSent;
                    var dataSentPortafolio=[];
                    
                    if(info.brief.form.portfolio[0].type==='model'){
                        dataSent=doJsonData(info.brief.form.portfolio[0]?info.brief.form.portfolio[0].strategyItems:[],info.brief.form.portfolio[0].value);				
                    }else if(info.brief.form.portfolio[0].type==='manual'){
                        dataSent = doJson(info.brief.form.portfolio[0] ? info.brief.form.portfolio[0].invest : []);				
                    }

                    if(info.brief.form.portfolio[1] && info.brief.form.portfolio[1].type === 'model'){
                        dataSentPortafolio=doJsonData(info.brief.form.portfolio[1] ? info.brief.form.portfolio[1].strategyItems : [] ,info.brief.form.portfolio[1].value);
                    }else if(info.brief.form.portfolio[1] && info.brief.form.portfolio[1].type === 'manual'){
                        dataSentPortafolio = doJson(info.brief.form.portfolio[1] ? info.brief.form.portfolio[1].invest : []);
                    }

                    csrfSrv.csrfValidate()
                        .then(successCsrf)
                        .catch(errorCsrf);

                    function successCsrf() {
                        var sendModel = {
                            language: 'SPA',
                            data:dataSent.length === 0 ? 0:window.btoa(unescape(encodeURIComponent(JSON.stringify(dataSent)))),
                            contract: info.tracing.form.scontract.numContrato ? info.tracing.form.scontract.numContrato : '',
                            confidential: info.tracing.form.confidential && info.tracing.form.confidential === true ? 1 : 0,
                            startDate:info.tracing.form.scontract.origen=== 'CB' ? ($filter('date')(info.tracing.form.tir.startDate._d, 'ddMMyyyy')):'',
                            endDate:info.tracing.form.scontract.origen=== 'CB' ? ($filter('date')(info.tracing.form.tir.endDate._d, 'ddMMyyyy')):'',
                            valorPortafolio: info.brief.form.portfolio[0] ? info.brief.form.portfolio[0].value : '0',
                            name: user.name ? user.name : '',
                            mail: user.mail ? user.mail : '',
                            ext: info.adviser.form.adviser_ext ? info.adviser.form.adviser_ext : '0',
                            mobile: info.adviser.form.adviser_mobile ? info.adviser.form.adviser_mobile : '0',
                            phone: info.adviser.form.adviser_phone ? info.adviser.form.adviser_phone : '0',
                            clientType: info.tracing.form.person_type && info.tracing.form.person_type === true ? 1 : 0,
                            serviceType: info.tracing.form.service_type && info.tracing.form.service_type === true ? 1 : 0,
                            comments: info.tracing.form.comment_tracing ? info.tracing.form.comment_tracing : '',
                            commentsProposal: info.brief.form.portfolio[0].comment ? info.brief.form.portfolio[0].comment : '',
                            source: info.tracing.form.scontract.origen ? info.tracing.form.scontract.origen : '',
                            clientName: info.tracing.form.scontract.nombreCliente ? info.tracing.form.scontract.nombreCliente : '',
                            products: productsSent.length === 0 ? 0 : window.btoa(unescape(encodeURIComponent(JSON.stringify(productsSent)))),
                            plusvalia: info.tracing.form.capital_gain && info.tracing.form.capital_gain === true ? '1' : '0',
                            portfolio:(dataSentPortafolio && dataSentPortafolio.length === 0) ? 0:window.btoa(unescape(encodeURIComponent(JSON.stringify(dataSentPortafolio)))),
                            valorPortafolio2: info.brief.form.portfolio[1] ? info.brief.form.portfolio[1].value : '0',
                            comments2: info.brief.form.portfolio[1] ? info.brief.form.portfolio[1].comment : '',
                            idEmployee: user.employeeID ? user.employeeID : 0,
                            portfolioType1: info.brief.form.portfolio[0] && info.brief.form.portfolio[0].type === 'manual' ? 1 : 2,
                            portfolioType2: info.brief.form.portfolio[1] && info.brief.form.portfolio[1].type && info.brief.form.portfolio[1].type === 'manual' ? 1 : 2,
                            createEnvironment: true,
                            createForecast: true
                        };
                        $http({
                            method: 'POST',
                            url: URLS.getCustomerTrackingAndProposal,
                            data: $.param(sendModel),
                            responseType: 'arraybuffer'
                        }).then(function (response) {
                            resolve(response);
                        }).catch(function (error) {
                            reject(error);
                        });
                        /*.then(function (response) {
                            if (response.data.status === 1) {
                                resolve({ success: true, data: response.data.messages[0].description });
                            }else {
                                resolve({ success: false, data: response.data.messages[0].description });
                            }
                        }).catch(function (error) {
                            ErrorMessagesSrv('Se encontró un error favor de intentarlo más tarde, comuníquese con su help desk');
                            reject({ error: error.data });
                        });*/
                    }

                    function errorCsrf(error) {
                        //reject( { success: false } );
                        reject(error);
                    }

                });
            },


            getCurrentPortfolio: function (_employeeID, _contract, _sr) {

                return $q(function (resolve, reject) {
                    $http({
                        method: 'GET',
                        url: URLS.getCurrentPortfolio + _employeeID + '/' + _contract + '/' + _sr,
                        params: {
                            language: 'SPA'
                        }
                    }).then(function success(response) {

                        if (!!response.data.status) {
                            resolve(response.data.result);
                        } else {
                            reject({ success: false });
                        }

                    }, function error() {

                        reject({ success: false });

                    });
                });
            }
        };

        return obj;

    }

    angular
        .module('actinver.controllers')
        .service('proposalsPropTracingSrv', proposalsPropTracingSrv);

})();
