(function () {
    'use strict';

    function investmentSrv($http, URLS, $filter, csrfSrv, $q) {

        /**
        *  investment Service
        */
        function Investment() { }

        Investment.prototype.getDetailStations = function (_station, _serie) {
            return $http({
                method: 'get',
                url: URLS.getDetailStations + _station + '/' + _serie + '?language=SPA'
            });
        };

        Investment.prototype.getUrlPracticasVenta = function (_contracto, _bankingarea) {
            return $http({
                method: 'get',
                url: URLS.geturlpracticasventa + _contracto + '/' + _bankingarea +'?language=SPA'
            });
        };

        Investment.prototype.getStations = function (_contract, _id) {
            return $http({
                method: 'GET',
                url: URLS.getInvestmentSocietyRest + _contract + '/' + _id + '/0/0/0/0?language=SPA'
            });
        };

        Investment.prototype.getStationsBank = function (_contract) {
            return $http({
                method: 'GET',
                // url: URLS.getFundBank+ '2638112' +'/1/0?language=SPA'
                url: URLS.getFundBank + _contract + '/1/0?language=SPA'

            });
        };

        Investment.prototype.getPortfolioInvestment = function (_id, type) {
            type = type || 'SI';
            if (type === 'MC') {
                return $http({
                    method: 'GET',
                    url: URLS.getPortfolio + _id + '/' + type + '?language=SPA'
                });
            }
            else {
                return $http({
                    method: 'GET',
                    url: URLS.getPortfolio + _id + '/' + type + '?language=SPA'
                });
            }
        };

        Investment.prototype.getPortfolioInvestmentLumina = function (_id, type) {
            type = type || 'MC';
            var date = new Date(),
                filterDate = $filter('date')(date, 'ddMMyyyy');

            if (type === 'MC') {
                return $http({
                    method: 'POST',
                    url: URLS.getAccionesLumina + '?language=SPA&contractNumber=' + _id + '&date=' + filterDate
                });
            }
        };

        Investment.prototype.getOrders = function (_id, type, startDate,endDate) {
            var date = new Date(),filterDate,filterDateEnd,parameterDate;

            type = (typeof type === 'undefined') ? 'SI' : type;



            if(startDate && endDate){
                parameterDate=_id + '/' + startDate + '/' + type +'/'+endDate+ '?language=SPA&r='+Math.random();
            }else{
                filterDate = $filter('date')(date, 'ddMMyyyy');
                filterDateEnd = $filter('date')(date, 'ddMMyyyy');
                parameterDate=_id + '/' + filterDate + '/' + type +'/'+filterDateEnd+ '?language=SPA&r='+Math.random();
            }


            return $http({
                method: 'GET',
                url: URLS.getOrders + parameterDate
            });
        };

        Investment.prototype.getOrdersLumina = function (_id, type, datecalendario) {

            datecalendario= (typeof datecalendario === 'undefined') ? new Date() : new Date(datecalendario);
            var date = new Date(datecalendario),
                filterDate = $filter('date')(date, 'ddMMyyyy');

            type = (typeof type === 'undefined') ? 'SI' : type;

            return $http({
                method: 'POST',
                url: URLS.getOrdersLumina + '?language=SPA&contractNumber=' + _id + '&startDate=' + filterDate + '&endDate=' + filterDate
            });
        };

        Investment.prototype.getOrdersBank = function (_id, type, startDate, endDate) {
            var _type = (typeof type === 'undefined') ? '1' : type;
            return $http({
                method: 'GET',
                url: URLS.getOrdersBank + '/' + _id + '/' + startDate + '/' + endDate + '/' + _type + '/99',
                params: {
                    language: 'SPA',
                }
            });
        };

        Investment.prototype.getOrdersMoneyMarketBank = function (_id, startDate, endDate) {
            return $http({
                method: 'GET',
                url: URLS.getOrdersMoneyMarketBank,
                params: {
                    language: 'SPA',
                    contractNumber: _id,
                    startDate: startDate,
                    endDate: endDate,
                    marketType: 'MD'
                }
            });
        };

        Investment.prototype.getPortfolioInvestmentBank = function (_id, _type) {
            return $http({
                method: 'GET',
                url: URLS.getPortfolioBank + _id + '/' + _type + '/0',
                params: {
                    language: 'SPA'
                }
            });
        };

        Investment.prototype.getPortfolioReportoBank = function (_id, _date) {
            return $http({
                method: 'GET',
                url: URLS.getPortfolioReporto + _id + '/' + _date,
                params: {
                    language: 'SPA'
                }
            });
        };

        Investment.prototype.moreInfo = function (_contract, _id) {
            return $http({
                method: 'GET',
                url: URLS.getMoreInfo + _contract + '/' + _id + '?language=SPA',
            });
        };

        Investment.prototype.moreInfoCapital = function (_contract, _id) {
            return $http({
                method: 'GET',
                url: URLS.getMoreInfoCapital + _id + '/' + _contract + '?language=SPA',
            });
        };

        Investment.prototype.delete = function (_contract, _order) {
            var _sendModel = {
                contractNumber: _contract,
                settlementType: 'C',
                operationReference: _order.order.orderReference
            };

            return $q(function (resolve, reject) {
                csrfSrv.csrfValidate()
                    .then(successCallback)
                    .catch(errorCallback);

                function successCallback() {

                    $http({
                        method: 'POST',
                        url: URLS.cancellation,
                        data: $.param(_sendModel),
                        params: {
                            language: 'SPA'
                        }
                    })
                        .then(function (response) {
                            if (response.data.outCommonHeader.result.result === 1) {
                                resolve({ success: true, data: response.data });
                            } else {
                                reject({ success: false, data: response.data, message: response.data.outCommonHeader.result.messages });
                            }
                        })
                        .catch(function (error) {
                            reject({ success: false, data: error.data, message: error.data.outCommonHeader.result.messages });
                        });
                }

                function errorCallback(error) {
                    reject({ success: false, data: error.data });
                }


            });
        };

        Investment.prototype.deleteMarket = function (_order) {
            return $q(function (resolve, reject) {
                csrfSrv.csrfValidate()
                    .then(successCallback)
                    .catch(errorCallback);

                function successCallback() {
                    $http({
                        method: 'POST',
                        url: URLS.cancellationMarket,
                        params: {
                            orderSubReference: '0',
                            orderReference: _order.order.orderReference,
                            language: 'SPA'
                        }
                    })
                        .then(function (response) {
                            if (response.data.outCommonHeader.result.result === 1) {
                                resolve({ success: true, data: response.data });
                            } else {
                                reject({ success: false, data: response.data, message: response.data.outCommonHeader.result.messages });
                            }
                        })
                        .catch(function (error) {
                            reject({ success: false, data: error.data, message: error.data.outCommonHeader.result.messages });
                        });
                }

                function errorCallback(error) {
                    reject({ success: false, data: error.data });
                }


            });
        };

        Investment.prototype.deleteOrderLumina = function (_order) {
            var _orderTypeDesc;
            if(_order.movementConcept === 'DIRECTOS'){
                _orderTypeDesc = 'FIXED_INCOME_ORDER';
            }else if(_order.movementConcept === 'REPORTO'){
                _orderTypeDesc = 'REPO_ORDER';
            }else{
                _orderTypeDesc = 'EQUITY_ORDER';
            }

            return $q(function (resolve, reject) {
                csrfSrv.csrfValidate()
                    .then(successCallback)
                    .catch(errorCallback);

                function successCallback() {
                    var _ordersend = {
                        language: 'SPA',
                        orderTypeDesc: _orderTypeDesc,
                        orderID: _order.orderReference || _order.operationID
                    };
                    $http({
                        method: 'POST',
                        url: URLS.cancellationLumina,
                        data: $.param(_ordersend)
                    })
                        .then(function (response) {
                            if (response.data.outCommonHeader.result.result === 1) {
                                resolve({ success: true, data: response.data });
                            } else {
                                reject({ success: false, data: response.data, message: response.data.outCommonHeader.result.messages });
                            }
                        })
                        .catch(function (error) {
                            reject({ success: false, data: error.data, message: error.data.outCommonHeader.result.messages });
                        });
                }

                function errorCallback(error) {
                    reject({ success: false, data: error.data });
                }


            });
        };


        Investment.prototype.deleteStopLoss = function (_contract, _order) {
            var _sendModel = {
                contractNumber: _contract,
                operationReference: _order.share.operationReference,
                multiAccountManager: 0
            };

            return $q(function (resolve, reject) {
                csrfSrv.csrfValidate()
                    .then(successCallback)
                    .catch(errorCallback);

                function successCallback() {

                    $http({
                        method: 'POST',
                        url: URLS.cancellationStopLoss,
                        data: $.param(_sendModel),
                        params: {
                            language: 'SPA'
                        }
                    })
                        .then(function (response) {
                            if (response.data.outCommonHeader.result.result === 1) {
                                resolve({ success: true, data: response.data });
                            } else {
                                reject({ success: false, data: response.data, message: response.data.outCommonHeader.result.messages });
                            }
                        })
                        .catch(function (error) {
                            reject({ success: false, data: error.data, message: error.data.outCommonHeader.result.messages });
                        });
                }

                function errorCallback(error) {
                    reject({ success: false, data: error.data });
                }


            });

        };

        Investment.prototype.deleteDirectBuy = function (_order) {
            return $q(function (resolve, reject) {
                csrfSrv.csrfValidate()
                    .then(successCallback)
                    .catch(errorCallback);

                function successCallback() {
                    $http({
                        method: 'POST',
                        url: URLS.deleteDirectBuy,
                        params: {
                            language: 'SPA',
                            operationReference: _order.orderReference,
                            transactionType: _order.transactionType,
                            consecutive: 1,
                            orderCancellationReason: ''
                        }
                    })
                        .then(function (response) {
                            if (response.data.outCommonHeader.result.result === 1) {
                                resolve({ success: true, data: response.data });
                            } else {
                                reject({ success: false, data: response.data, message: response.data.outCommonHeader.result.messages });
                            }
                        })
                        .catch(function (error) {
                            reject({ success: false, data: error.data, message: error.data.outCommonHeader.result.messages });
                        });
                }

                function errorCallback(error) {
                    reject({ success: false, data: error.data });
                }


            });
        };

        Investment.prototype.deleteDirectSell = function (_order, _contractNumber) {
            return $q(function (resolve, reject) {
                csrfSrv.csrfValidate()
                    .then(successCallback)
                    .catch(errorCallback);

                function successCallback() {
                    $http({
                        method: 'POST',
                        url: URLS.deleteDirectSell,
                        params: {
                            language: 'SPA',
                            amount: _order.amount,
                            consecutive: 1,
                            operationReference: _order.orderReference,
                            orderCancellationReason: '',
                            transactionType: _order.transactionType,
                            bankingArea: '001',
                            contractNumber: _contractNumber,

                        }
                    })
                        .then(function (response) {
                            if (response.data.outCommonHeader.result.result === 1) {
                                resolve({ success: true, data: response.data });
                            } else {
                                reject({ success: false, data: response.data, message: response.data.outCommonHeader.result.messages });
                            }
                        })
                        .catch(function (error) {
                            reject({ success: false, data: error.data, message: error.data.outCommonHeader.result.messages });
                        });
                }

                function errorCallback(error) {
                    reject({ success: false, data: error.data });
                }


            });
        };

        Investment.prototype.deleteReportoBuy = function (_order, _contractNumber) {
            return $q(function (resolve, reject) {
                csrfSrv.csrfValidate()
                    .then(successCallback)
                    .catch(errorCallback);

                function successCallback() {
                    $http({
                        method: 'POST',
                        url: URLS.deleteReportoBuy,
                        params: {
                            language: 'SPA',
                            consecutive: 1,
                            operationReference: _order.orderReference,
                            orderCancellationReason: '',
                            transactionType: _order.transactionType,
                            bankingArea: '001',
                            contractNumber: _contractNumber,

                        }
                    })
                        .then(function (response) {
                            if (response.data.outCommonHeader.result.result === 1) {
                                resolve({ success: true, data: response.data });
                            } else {
                                reject({ success: false, data: response.data, message: response.data.outCommonHeader.result.messages });
                            }
                        })
                        .catch(function (error) {
                            reject({ success: false, data: error.data, message: error.data.outCommonHeader.result.messages });
                        });
                }

                function errorCallback(error) {
                    reject({ success: false, data: error.data });
                }


            });
        };

        Investment.prototype.getContractSelection = function (_model) {
            return $http({
                method: 'GET',
                url: URLS.getContractSelection + _model.contractNumber + '/' + _model.bankingArea + '?language=SPA',
            });
        };

        Investment.prototype.getMarketValidation = function (_model) {
            return $http({
                method: 'GET',
                url: URLS.getMarketValidation +_model.businessType + '/' + _model.contractNumber + '/' + _model.marketType + '?language=SPA',
            });
        };

        Investment.prototype.outOfProfileContractQuery = function(_model){
            return $http({
                method: 'GET',
                url: URLS.outOfProfileContractQuery + _model.bankingArea + '/' + _model.clientNumber + '/' + _model.clientName + '/' + _model.contractNumber + '?language=SPA',
            });

        }

        return new Investment();
    }

    angular
        .module('actinver.services')
        .service('investmentSrv', investmentSrv);

})();
