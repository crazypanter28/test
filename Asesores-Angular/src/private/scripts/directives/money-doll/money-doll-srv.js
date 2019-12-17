(function() {
    'use strict';

    function moneyDollSrv( $http, URLS, $q, csrfSrv, moment, contractTypeSrv ) {

        /**
        *  DollSrv
        */
        function DollSrv(){}

        // Get current contract cash
        DollSrv.prototype.getCurrentCash = function( _contract ){
            return $http({
                method: 'GET',
                url: URLS.getCurrentCash + _contract +'/1/1/0',
                params: {
                    language: 'SPA'
                }
            });
        };

        // Pre-confirmation for current transaction
        DollSrv.prototype.confirmDoll = function ( _model ) {
            var sendModel = {
                contractNumber: _model.contract.contractNumber,
                term: _model.term,
                netAmount: _model.invest.amount,
                rateOfReturn: _model.sinstrument.maxRate,
                valueType: _model.sinstrument.valueType,
                minTerm: _model.sinstrument.minTerm,
                maxTerm: _model.sinstrument.maxTerm,
                maxRate: _model.sinstrument.maxRate,
                minAmount: _model.sinstrument.minNetAmount,
                maxAmount: _model.sinstrument.maxNetAmount,
                minRate: _model.sinstrument.minRate,
                optimumRate : _model.optimumRate ? _model.optimumRate :  _model.sinstrument.maxRate,
                promoter: 0,
            };

            if( _model.operationReference){
                sendModel.operationReference = _model.operationReference;
            }

            return $q(function( resolve, reject ){
                csrfSrv.csrfValidate()
                    .then(successCsrf)
                    .catch(errorCsrf);
                function successCsrf() {
                    $http({
                        method: 'POST',
                        url: URLS.confirmMoneyDoll,
                        data: $.param(sendModel),
                    })
                        .then(function( _res ){
                            if( _res.data.outCommonHeader.result.result === 1 ){
                                resolve( _res.data.outBondMarketOrderQuotation.bondMarketData);
                            }
                            else{
                                reject( _res.data.outCommonHeader.result.messages);
                            }
                        });
                }
                function errorCsrf(error) {
                    reject(error);
                }
            });

        };

        // Second and final confirmation
        DollSrv.prototype.captureDoll = function ( _model, _modelB, _user, _contractType) {

            var _json = {
                Instrumento: _model.sinstrument.description,
                "Tipo inversión": "REPORTO",
                Plazo: _model.sinstrument.minTerm,
                Tasa: _model.sinstrument.maxRate,
                "Fecha vencimiento": moment (_model.sinstrument.dueDate).format('DD/MM/YYYY'),
                Importe: _model.invest.amount
            };
            _json = JSON.stringify(_json);

            var sendModel = {
                contractNumber: _model.contract.contractNumber,
                term: _model.term,
                netAmount: _model.invest.amount,
                rateOfReturn: _model.optimumRate ? _model.optimumRate :  _model.sinstrument.maxRate,
                valueType: _model.sinstrument.valueType,
                minTerm: _model.sinstrument.minTerm,
                maxTerm: _model.sinstrument.maxTerm,
                maxRate: _model.sinstrument.maxRate,
                minAmount: _model.sinstrument.minNetAmount,
                maxAmount: _model.sinstrument.maxNetAmount,
                minRate: _model.sinstrument.minRate,
                optimumRate : _model.optimumRate ? _model.optimumRate :  _model.sinstrument.maxRate,
                promoter: 0,
                promoterNumber: 0,
                recordStatus: 'V',
                status: 'I',
                name: _user,
                jsonDetails: _json
            };

            if( _model.operationReference){
                sendModel.operationReference = _model.operationReference;
            }

            sendModel = contractTypeSrv.sendBinnacle(_contractType, sendModel , _modelB);

            return $q(function( resolve, reject ){
                csrfSrv.csrfValidate()
                    .then(successCsrf)
                    .catch(errorCsrf);
                function successCsrf() {
                    $http({
                        method: 'POST',
                        url: URLS.doMoneyTransaction,
                        data: $.param(sendModel),
                    })
                        .then(function( _res ){
                            if( _res.data.outCommonHeader.result.result === 1 ){
                                resolve( _res.data);
                            }
                            else{
                                reject( _res.data.outCommonHeader.result.messages);
                            }
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
        .module( 'actinver.services' )
        .service( 'moneyDollSrv', moneyDollSrv ) ;

})();