(function () {
    'use strict';

    function fundBankDollSrv($q, $http, URLS, csrfSrv) {

        /**
           *  DollSrv
           */
        function DollSrv() { }


        DollSrv.prototype.getCalendarBank = function (_model, _serie, _anticipedS) {
            var newUrl = '';
            for (var i in _model) {
                newUrl += _model[i] + '/';
            }
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getCalendarBank + newUrl,
                    params: {
                        language: 'SPA',
                        serie : _serie,
                        anticipatedSell : _anticipedS
                    }
                })
                    .then(function (_response) {
                        if (_response.data.outCommonHeader.result.result === 1) {
                            resolve(_response.data.outBankInvstCalendarByFundsQuery);
                        } else {
                            reject(_response.data.outCommonHeader.result);
                        }
                    });
            });
        };
        DollSrv.prototype.getMediaBank = function () {
            return $http({
                method: 'GET',
                url: URLS.getMediaBank + '?language=SPA',
            });
        };


        // Get current contract cash
        DollSrv.prototype.getCurrentCash = function (_contract) {
            return $http({
                method: 'GET',
                url: URLS.getCurrentCash + _contract + '/1/1/0',
                params: {
                    language: 'SPA'
                }
            });
        };

        // Pre-confirmation for current transaction
        DollSrv.prototype.confirmDoll = function (_model) {
            var sendModel = {
                language: "SPA",
                contract: _model.contract,
                term: _model.sinstrument.minTerm,
                netAmount: _model.invest.amount,
                rateOfReturn: _model.sinstrument.maxRate,
                valueType: _model.sinstrument.valueType,
                minTerm: _model.sinstrument.minTerm,
                maxTerm: _model.sinstrument.maxTerm,
                maxRate: _model.sinstrument.maxRate,
                minAmount: _model.sinstrument.minNetAmount,
                maxAmount: _model.sinstrument.maxNetAmount,
                minRate: _model.sinstrument.minRate,
                binnacle: _model.binnacle
            };

            return $http({
                method: 'get',
                url: URLS.confirmFundBankDoll,
                data: sendModel,
            });
        };

        // compra de fondo
        DollSrv.prototype.bankFundBuyRequest = function (_model) {
            return $q(function (resolve, reject) {
                csrfSrv.csrfValidate()
                    .then(successCsrf)
                    .catch(errorCsrf);
                function successCsrf() {
                    $http({
                        method: 'POST',
                        url: URLS.bankFundBuyRequest,
                        data: $.param(_model),
                    }).then(function (_res) {
                        resolve(_res.data);
                    });
                }
                function errorCsrf(error) {
                    reject(error);
                }
            });
        };

        //venta de fondo
        DollSrv.prototype.bankFundSellRequest = function (_model) {
            return $q(function (resolve, reject) {
                csrfSrv.csrfValidate()
                    .then(successCsrf);
                function successCsrf() {
                    $http({
                        method: 'POST',
                        url: URLS.bankFundSellRequest,
                        data: $.param(_model),
                    }).then(function (_res) {
                        if (_res.data.outCommonHeader.result.result === 1) {
                            resolve(_res.data);
                        }else{
                            reject(_res.data);
                        }
                    }).catch(function (error) {
                        reject(error.data);
                    });
                }
            });
        };



        DollSrv.prototype.bankContractBalance = function (_contract, _bankingArea) {
            return $http({
                method: 'GET',
                url: URLS.bankContractBalance+_contract+'/'+_bankingArea,
                params: {
                    language: 'SPA'
                }
            });
        };

        DollSrv.prototype.bankReportoBuyingPowerQuery = function (_contract, _date) {
            return $http({
                method: 'GET',
                url: URLS.bankReportoBuyingPowerQuery +_contract+'/' + _date,
                params: {
                    language: 'SPA'
                }
            });
        };

        DollSrv.prototype.bankInvstUserInfoQuery = function () {

            return $http({
                method: 'GET',
                url: URLS.bankInvstUserInfoQuery,
                params: {
                    language: 'SPA'
                }
            });

        };


        DollSrv.prototype.getCurrencyFundByIDAndContract = function (_idFound, _contract, type) {
            var intType = 0;
            if (type === "compra") {
                intType = 1;
            } else if (type === "venta") {
                intType = 2;
            }

            return $http({
                method: 'GET',
                url: URLS.getFundBank+_contract+"/"+intType+"/"+_idFound+"/",
               // url: URLS.getFundBank + "7366693/" + intType + "/" + _idFound,
                params: {
                    language: 'SPA'
                }
            });

        };

                //cancelacion de compra de fondo
                DollSrv.prototype.bankFundBuyCancelation = function (_model) {           
                    
                     return $q(function (resolve, reject) {
                         csrfSrv.csrfValidate()
                             .then(successCsrf)
                             .catch(errorCsrf);
                         function successCsrf() {
                             $http({
                                 method: 'POST',
                                 url: URLS.bankFundBuyCancelationRequest,
                                 data: $.param(_model),
                             }).then(function (_res) {
                                 resolve(_res.data);
                             });
                         }
         
                         function errorCsrf(error) {
                             reject(error);
                         }
                     });
         
                 };

                //cancelacion de compra de fondo                                  
                DollSrv.prototype.bankFundSellCancelation = function (_model) {           
                    
                     return $q(function (resolve, reject) {
                         csrfSrv.csrfValidate()
                             .then(successCsrf)
                             .catch(errorCsrf);
                         function successCsrf() {
                             $http({
                                 method: 'POST',
                                 url: URLS.bankFundSellCancelationRequest,
                                 data: $.param(_model),
                             }).then(function (_res) {
                                 resolve(_res.data);
                             });
                         }
         
                         function errorCsrf(error) {
                             reject(error);
                         }
                     });
         
                 };




        return new DollSrv();
    }

    angular
        .module('actinver.services')
        .service('fundBankDollSrv', fundBankDollSrv);

})();