(function () {
    'use strict';

    function insuranceMainSrv(URLS, $q, $http, $filter) {


        var obj = {

            getContractByAdviser: function (_clientNumber) {
                return $q(function (resolve, reject) {

                    $http({
                        method: 'GET',
                        url: URLS.getContractByAdviser + _clientNumber,
                        params: {
                            language: 'SPA'

                        }
                    }).then(function success(response) {
                        if (response.data.outCommonHeader.result.result === 1) {
                            resolve({
                                success: true,
                                data: response.data.result,
                                msg: response.data.outCommonHeader.result.messages[0].responseMessage
                            });
                        } else {
                            resolve({
                                success: false,
                                data: [],
                                msg: response.data.outCommonHeader.result.messages[0].responseMessage
                            });
                        }
                    }, function error() {
                        reject({
                            success: false,
                            type: 'not-found',
                            data: [],
                            msg: 'Ha ocurrido un error Interno'
                        });
                    });
                });
            },

            getClientInfo: function (type, search, contractType) {
                return $q(function (resolve, reject) {

                    $http({
                        method: 'GET',
                        url: URLS.getClientInfo,
                        params: {
                            descripcion: search,
                            typeQuery: type,
                            language: 'SPA',
                            titularFlag: true,
                            bankingArea: contractType,
                            contractNumber: type === 1 ? '' : search,
                            clientNumber: type === 1 ? search : ''
                        }
                    }).then(function success(response) {
                        var _response;
                        var _clientId;
                        if (typeof response !== 'undefined' && response.data.outCommonHeader.result.messages[0].responseCategory !== 'ERROR') {
                            _response = response.data.outClientOrContractClientInfoQuery.client;
                            _clientId = response.data.outClientOrContractClientInfoQuery.client[0].clientNumber;
                            resolve({
                                success: true,
                                info: _response,
                                clientId: _clientId
                            });
                        } else {
                            response.data = {
                                error: {
                                    responseMessage: response.data.outCommonHeader.result.messages[0].responseMessage
                                }
                            };
                            reject({
                                success: false,
                                info: response.data,
                                type: 'empty'
                            });
                        }

                    }, function error() {
                        reject({
                            success: false,
                            type: 'not-found'
                        });
                    });

                });

            },

            /**
             * Get client information
             * @param {string} _client - Search type
             * @return  {object}
             */

            getClientName: function (_client) {
                return $q(function (resolve, reject) {
                    $http({
                        method: 'GET',
                        url: URLS.getClientName,
                        params: {
                            language: 'SPA',
                            lastName: _client.lastName ? _client.lastName.toUpperCase() : ' ',
                            surname: _client.surname ? '' : '',
                            name: _client.name ? _client.name.toUpperCase() : ' ',
                            companyName: _client.companyName,
                            personType: _client.name ? 1 : 2,
                            tIN: _client.fiscalIDNumber
                        }
                    }).then(function success(response) {
                        var _response;
                        if (response.data.outCommonHeader.result.result === 1) {
                            _response = response.data.outClientInfoQuery.clientList.client;
                            resolve({success: true, info: _response});
                        } else {
                            reject({success: false, info: response.data.outCommonHeader.result});
                        }
                    }, function error() {
                        reject({success: false, type: 'not-found'});
                    });
                });
            },

            /**
             * Get current contracts list
             * @param {string} client - Search item
             * @return  {object}
             */
            getContracts: function (client, contractType) {

                return $q(function (resolve, reject) {

                    $http({
                        method: 'GET',
                        url: URLS.getContracts,
                        params: {
                            language: 'SPA',
                            bankingArea: contractType || 999,
                            clientID: client
                        }
                    }).then(function success(response) {
                        if (typeof response !== 'undefined' && response.data.outContractsBalancesByPortfolioQuery) {
                            resolve({success: true, contracts: response.data.outContractsBalancesByPortfolioQuery.contractInformation});
                        } else {
                            reject({success: false, data: response.data, type: 'empty'});
                        }

                    }, function error() {
                        reject({success: false, type: 'not-found'});
                    });

                });

            },

            /**
             * Get unique contract information
             * @param {string} contract - Contract ID
             * @return  {object}
             */
            getContractHistorical: function (contract) {

                return $q(function (resolve, reject) {
                    $http({

                        method: 'GET',
                        url: URLS.getContractHistorical,
                        params: {
                            language: 'SPA',
                            contractNumber: '[{"idContrato":"' + contract + '"}]'
                        }
                    }).then(function success(response) {

                        if (response.data.outCommonHeader.result.result === 1) {

                            var info = response.data.outBrokerMonthlyBalanceQuery.clients.client[0],
                                    empty = true, historicalInfo = [];
                            //generamos los meses para el año
                            historicalInfo = getMonthsYears();
                            angular.forEach(info.historicalInfo, function (data) {
                                if (empty && data.amount !== 0) {
                                    empty = false;
                                }
                                for (var j = 0; j < historicalInfo.length; j++) {
                                    if (historicalInfo[j].paymentPeriod === data.paymentPeriod) {
                                        historicalInfo[j].amount = parseFloat(data.amount);
                                        j = historicalInfo.length;
                                    }
                                }
                            });
                            info.historicalInfo = historicalInfo;
                            resolve({success: true, historical: info, empty: empty});
                        } else {
                            resolve({success: false, data: response.data.outCommonHeader.result});
                        }
                    }, function error() {
                        reject({success: false});
                    });
                });
            },

            /**
             * Get unique contract information
             * @param {string} contract - Contract ID
             * @return  {object}
             */
            getBrokerHistoricalBalanceQuery: function (_contractNumber, _numberPeriods) {

                return $q(function (resolve, reject) {
                    $http({
                        method: 'GET',
                        url: URLS.getBrokerHistoricalBalanceQuery + '/' + _contractNumber + '/' + _numberPeriods,
                        params: {
                            language: 'SPA'
                        }
                    }).then(function success(response) {
                        if (response.data.outCommonHeader.result.result === 1) {

                            var info = response.data.outBrokerHistoricalBalanceQuery.balanceFound,
                                    empty = true, historicalInfo = [], historical = {}, contractNumbre;

                            historicalInfo = getMonthsYears();

                            angular.forEach(info, function (data) {
                                if (empty && data.contractBalance !== 0) {
                                    empty = false;
                                }
                                for (var j = 0; j < historicalInfo.length; j++) {
                                    if (historicalInfo[j].paymentPeriod === data.period) {
                                        historicalInfo[j].amount = parseFloat(data.contractBalance);
                                        j = historicalInfo.length;
                                    }
                                }
                                contractNumbre = data.contractNumber;
                            });

                            historical = {contractNumber: contractNumbre, historicalInfo: historicalInfo};
                            resolve({success: true, historical: historical, empty: empty});
                        } else {
                            resolve({success: false, data: response.data.outCommonHeader.result});
                        }
                    }, function error() {
                        reject({success: false});
                    });
                });
            },

            /**
             * Get unique contract information
             * @param {string} contract - Contract ID
             */
            getBankContractBalance: function (_contractNumber) {

                return $q(function (resolve, reject) {
                    $http({
                        method: 'GET',
                        url: URLS.bankPortfolioQuery + _contractNumber,
                        params: {
                            language: 'SPA'
                        }
                    }).then(function success(response) {
                        if (response.data.outCommonHeader.result.result === 1 && response.data.outBankPortfolioQuery.bankPortfolio !== null) {
                            resolve({success: true, contractNumber: _contractNumber, totalBalance: response.data.outBankPortfolioQuery.bankPortfolio.bankPortfolioElement[10].actualValue});
                        } else {
                            resolve({success: false, data: response.data.outCommonHeader.result});
                        }
                    }, function error() {
                        reject({success: false});
                    });
                });
            },

            /**
             * Get unique contract information
             * @param {string} contract - Contract ID
             */
            getPortfolioGlobalDetailQuery: function (_contractNumber) {

                return $q(function (resolve, reject) {
                    $http({
                        method: 'GET',
                        url: URLS.getPortfolioGlobalDetailQuery + _contractNumber,
                        params: {
                            language: 'SPA'
                        }
                    }).then(function success(response) {
                        if (response.data.outCommonHeader.result.result === 1) {
                            resolve({success: true, contractNumber: _contractNumber, totalBalance: response.data.outPortfolioGlobalDetailQuery.totalValuation});
                        } else {
                            resolve({success: false, data: response.data.outCommonHeader.result});
                        }
                    }, function error() {
                        reject({success: false});
                    });
                });
            },

            getContractInfoDetail: function (_model) {

                return $q(function (resolve, reject) {

                    $http({
                        method: 'GET',
                        url: URLS.getContractInfoDetail + _model.contractNumber + '/' + _model.bankingArea,
                        params: {
                            language: 'SPA'
                        }
                    }).then(function success(response) {


                        if (typeof response !== 'undefined' && response.data.outCommonHeader.result.result === 1) {
                            resolve(response.data.outSimplifiedBankContractQuery.contract);
                        } else {
                            reject(response.data.outCommonHeader.result);
                        }
                    }, function error(error) {
                        reject(error);
                    });

                });

            },

            getBankContractsByClientQuery: function (wordToSearch, page, rowsByPage) {
                return $q(function (resolve, reject) {

                    $http({
                        method: 'GET',
                        url: URLS.getBankContractsByClientQuery + wordToSearch + '/1/Modulo Asesor/' + page + '/' + rowsByPage,
                        params: {
                            language: 'SPA'
                        }
                    }).then(function success(response) {
                        var record = {
                            success: true,
                            data: null,
                            msg: response.data.outCommonHeader.result.messages[0].responseMessage
                        };
                        if (typeof response !== 'undefined' && response.data.outCommonHeader.result.result === 1) {
                            record.data = response.data.outBankContractsByClientQuery;
                            resolve(record);
                        } else {
                            record.success = false;
                            resolve(record);
                        }
                    }, function error( ) {
                        reject({success: false, data: null, msg: "Error Interno"});
                    });
                });
            }







        };

        return obj;

    }

    angular
            .module('actinver.controllers')
            .service('insuranceMainSrv', insuranceMainSrv);

})();
