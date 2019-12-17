(function () {
    'use strict';

    function capitalsLuminaDollSrv($http, URLS, $q, csrfSrv, moment) {

        var volOculto, price, priceLimit;
        /**
        *  capitalsLuminaDoll
        */
        function capitalsLuminaDoll() { }

        // Get current catalog type order
        capitalsLuminaDoll.prototype.getOrderCatalog = function (_issuer, _contract, _bankingArea) {
            var serie, issuerName;
            if(_issuer.issuer.issuerSerie){
                issuerName = _issuer.issuer.issuerName;
                serie = _issuer.issuer.serie;
            }else{
                issuerName = _issuer.issuerName;
                serie = _issuer.serie;
            }



            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getOrdertypeCatalog + issuerName + '/' + serie +'/' +_contract + '/' + _bankingArea + '?language=SPA'
                })
                    .then(function (_res) {
                        if (_res.data.outCommonHeader.result.result === 1) {
                            resolve(
                                _res.data.result
                            );
                        }
                        else {
                            reject(
                                _res.data.outCommonHeader
                            );
                        }
                    });
            });
        };

        capitalsLuminaDoll.prototype.bankContractBalance = function (_contract, _bankingArea) {
            return $http({
                method: 'GET',
                url: URLS.bankContractBalance + _contract + '/' + _bankingArea,
                params: {
                    language: 'SPA'
                }
            });
        };

        capitalsLuminaDoll.prototype.getClientElegible = function (_contract, _bankingArea) {
            return $http({
                method: 'GET',
                url: URLS.getClientElegible + _contract + '/' + _bankingArea,
                params: {
                    language: 'SPA'
                }
            });
        };


        capitalsLuminaDoll.prototype.confirmStopLoss = function (_model, _contract, _user) {
            var sendModel = {
                contractNumber: _contract,
                coupon: 0,
                issuerName: _model.station.issuer.issuerName,
                serie: _model.station.issuer.serie,
                movement: _model.order.value.shortKey.trim(),
                lowerPercentage: _model.order.value.shortKey.trim() === 'TS' ? _model.order.model.floorPricePercentage : 0,
                higherPercentage: _model.order.value.shortKey.trim() === 'TS' ? _model.order.model.ceilingPricePercentage : 0,
                lowerPrice: _model.order.value.shortKey.trim() === 'SL' ? _model.order.model.floorPrice : 0,
                higherPrice: _model.order.value.shortKey.trim() === 'SL' ? _model.order.model.ceilingPrice : 0,
                stopType: 'MA',
                sellingTitles: _model.order.model.titles,
                name: _user,
                instructionDate: moment(_model.date).format('DDMMYYYY'),
                instructionTime: _model.media.type.text === 'TELEFONO' ? _model.binnacle.time + ':00' : null,
                extensionNumber: _model.media.type.text === 'TELEFONO' ? _model.binnacle.phone : null,
                tracingKey: _model.media.type.id,
                comments: _model.binnacle.comments,
            };

            return $q(function (resolve, reject) {
                csrfSrv.csrfValidate()
                    .then(successCsrf)
                    .catch(errorCsrf);

                function successCsrf() {
                    $http({
                        method: 'POST',
                        url: URLS.confirmStopLoss,
                        data: $.param(sendModel),
                    })
                        .then(function (_res) {
                            if (_res.data.outCommonHeader.result.result === 1) {
                                resolve(_res.data.outStopLossTrailingStopRegistration);
                            }
                            else {
                                reject(_res.data.outCommonHeader.result.messages);
                            }
                        })
                        .catch(function (_error) {
                            reject(_error);
                        });
                }

                function errorCsrf(error) {
                    reject(error);
                }
            });
        };

        function validationType(_type, _model) {
            if (_type === 'LP') {
                price = _model.priceStation ? _model.priceStation : _model.station.tradeSellPrice;
            } else if (_type === 'MC' || _type === 'PR' || _type === 'MA' || _type === 'MP' || _type === 'LO' || _type === 'HC' || _type === 'DC') {
                price = 0;
            } else if (_type === 'MO') {
                price = _model.order.model.maxPrice;
            } else if (_type === 'VO') {
                price = _model.priceStation;
            }

            if (_type === 'VO' || _type === 'LO') {
                volOculto = _model.order.model.volOculto;
            } else {
                volOculto = 0;
            }

            if (_type === 'PR' || _type === 'MA' || _type === 'MP' || _type === 'LO') {
                priceLimit = _model.order.model.maxPrice;
            } else {
                priceLimit = 0;
            }

        }


        capitalsLuminaDoll.prototype.confirmDoll = function (_model, _contract) {
            var _modelSend = {
                requestType: _model.media.type.id,
                language: 'SPA',						//requerido	 	lenguaje de consulta
                clientID: _contract,					//				Identificador del cliente. Dependerá de la definicion del campo de CLIENT_ID_TYPE
                clientTypeID: 'CLIENT_ID',				//				Indica si en el cliente se informara el CLIENT_ID o el SHORT_NAME del contrato
                eventID: 'ADD',					//requerido		Determina que acción debe realizar lumina con la información recibida compra/venta/modif
                action: 'VALIDATE',						//requerido		Indica si solo se debe validar o si se debe realizar la captura de la orden										
                legalEntity: 'BCO ACTINVER',					//requerido		Nombre Corto de la Entidad Legal												 	por default
                operationType: _model.evtentType === 'buy' ? 'B' : 'S',						//requerido		Compra o Venta															
                orderType: 'Single',					//requerido		Indica si es una orden global o una captura individual								por default
                destination: _model.libroomesa,					//requerido		Indica si la orden sera enviada al libro o mesa
                motive: '',							//				Indica el motivo por el cual una orden a la mesa para un cliente no elegible						
                //market: _model.typeStock ? (_model.typeStock === '1' ? 'BMV' : (_model.typeStock === '2' ? 'BIVA' : 'SOR' ) ) : 'BMV', //requerido		Código (o abreviatura) del mercado en el que opera
                market: 'SOR',
                equityOrderType: 'Lot',					//requerido		Tipo de orden de Equity																Que es este tipo de orden? 
                instrumentID: _model.station.instrumentDesc ? _model.station.instrumentDesc : _model.station.issuer.issuerName,				//requerido		Identificador del instrumento
                instrumentType: 'SHORT_NAME',			//				Indica si se usa el nombre corto , nombre largo o ISIN del instrumento en el tag SECURITY_ID					
                titlesQty: _model.order.model.titles,						    //requerido		Cantidad de títulos para la orden						
                comments: moment(_model.binnacle.date).format('YYYY-MM-DD') + ' | ' + _model.media.type.text + ' ' + (_model.media.type.id === "10" ? (_model.binnacle.phone + ' ' + _model.binnacle.time) : ' ') + ' | ' + _model.binnacle.comments,	 						//				Campo para comentarios
                // captureDate : '05092017', //moment(_model.binnacle.date).format('DDMMYYYY'),
                clientIDD: 'CLIENT_01',				//requerido		Indica el código del contrato del desglose											Que es el contrato ? 
                quantity: 0,						//antes tenia 1500 se removio por cero; requerido		Indica la cantidad por desglose
                fillOrKillFlag: _model.order.orderTypeOperation && _model.order.orderTypeOperation.id === 1 ? true : false, //indica que si es Fak(id=2) agrega 1 en caso contrario es 0
                executionFlag: _model.order.orderTypeOperation && _model.order.orderTypeOperation.id === 2 ? true : false, //indica que si es Fok(id=1) agrega 1 en caso contrario es 0
                jsonDetails: '',// 													cantidad de desglose ?
            };

            /*if (_model.modify) {
                _modelSend.eventID = 'MODIFY';
                _modelSend.orderID = _model.orderReference;
            }*/

            if (_model.order.value.shortKey !== 'MC') {
                _modelSend.titlePrice = _model.priceStation;
            }



            return $q(function (resolve, reject) {
                csrfSrv.csrfValidate()
                    .then(successCsrf)
                    .catch(errorCsrf);
                function successCsrf() {
                    $http({
                        method: 'POST',
                        url: URLS.confirmCapitalDollLumina,
                        data: $.param(_modelSend)
                    })
                        .then(function (_res) {
                            if (_res.data.outCommonHeader.result.result === 1) {
                                resolve(_res.data);
                            }
                            else {
                                reject(_res.data.outCommonHeader.result.messages);
                            }
                        });
                }

                function errorCsrf(error) {
                    reject(error);
                }
            });
        };


        capitalsLuminaDoll.prototype.captureDoll = function (_model, _contract) {

            var tipooperacion = '';
            if(_model.evtentType === 'buy'){
                tipooperacion = 'Compra';
            }else if(_model.evtentType === 'sell'){
                tipooperacion = 'Venta';
            }
            var _json = {
                Contrato: _contract,
                Movimiento: tipooperacion,
                "Tipo de orden": _model.order.value.description,
                Emisora: _model.station.instrumentDesc ? _model.station.instrumentDesc : _model.station.issuer.issuerName,
                Precio: _model.order.value.shortKey !== 'MC' ? _model.priceStation : '0.0',
                Títulos: _model.order.model.titles,
                Plazo: 1,
            };

            validationType(_model.order.value.shortKey.trim(), _model);

            var _modelSend = {
                requestType: _model.media.type.id,
                language: 'SPA',						//requerido	 	lenguaje de consulta
                clientID: _contract,				//				Identificador del cliente. Dependerá de la definicion del campo de CLIENT_ID_TYPE
                clientTypeID: 'CLIENT_ID',				//				Indica si en el cliente se informara el CLIENT_ID o el SHORT_NAME del contrato
                eventID: 'ADD',					//requerido		Determina que acción debe realizar lumina con la información recibida compra/venta/modif
                action: 'SAVE',						//requerido		Indica si solo se debe validar o si se debe realizar la captura de la orden										
                legalEntity: 'BCO ACTINVER',					//requerido		Nombre Corto de la Entidad Legal												 	por default
                operationType: _model.evtentType === 'buy' ? 'B' : 'S',						//requerido		Compra o Venta															
                orderType: 'Single',					//requerido		Indica si es una orden global o una captura individual								por default
                destination: _model.libroomesa,					//requerido		Indica si la orden sera enviada al libro o mesa
                motive: '',							//				Indica el motivo por el cual una orden a la mesa para un cliente no elegible						
                //market:  _model.typeStock ? (_model.typeStock === '1' ? 'BMV' : (_model.typeStock === '2' ? 'BIVA' : 'SOR' ) ) : 'BMV',							//requerido		Código (o abreviatura) del mercado en el que opera
                market: 'SOR',
                equityOrderType: 'Lot',					//requerido		Tipo de orden de Equity																Que es este tipo de orden? 						//				Volumen Minimo						
                instrumentID: _model.station.instrumentDesc ? _model.station.instrumentDesc : _model.station.issuer.issuerName,
                instrumentType: 'SHORT_NAME',			//				Indica si se usa el nombre corto , nombre largo o ISIN del instrumento en el tag SECURITY_ID					
                titlesQty: _model.order.model.titles,						    //requerido		Cantidad de títulos para la orden						
                comments: moment(_model.binnacle.date).format('YYYY-MM-DD') + ' | ' + _model.media.type.text + ' ' + (_model.media.type.id === "1" ? _model.binnacle.phone + ' ' + _model.binnacle.time : ' ') + ' | ' + _model.binnacle.comments,	 						//				Campo para comentarios 						
                clientIDD: 'CLIENT_01',				//requerido		Indica el código del contrato del desglose											Que es el contrato ? 
                quantity: 1500,						//requerido		Indica la cantidad por desglose														cantidad de desglose ?
                fillOrKillFlag: _model.order.orderTypeOperation && _model.order.orderTypeOperation.id === 1 ? true : false, //indica que si es Fak(id=2) agrega 1 en caso contrario es 0
                executionFlag: _model.order.orderTypeOperation && _model.order.orderTypeOperation.id === 2 ? true : false, //indica que si es Fok(id=1) agrega 1 en caso contrario es 0
                jsonDetails: JSON.stringify(_json),
            };

            if (_model.order.value.shortKey !== 'MC') {
                _modelSend.titlePrice = _model.priceStation;
            }

            return $q(function (resolve, reject) {
                csrfSrv.csrfValidate()
                    .then(successCsrf)
                    .catch(errorCsrf);
                function successCsrf() {
                    $http({
                        method: 'POST',
                        url: URLS.confirmCapitalDollLumina,
                        data: $.param(_modelSend),
                    })
                        .then(function (_res) {
                            if (_res.data.outCommonHeader.result.result === 1) {
                                resolve(_res.data);
                            }
                            else {
                                reject(_res.data.outCommonHeader.result.messages);
                            }
                        });
                }

                function errorCsrf(error) {
                    reject(error);
                }

            });
        };

        capitalsLuminaDoll.prototype.getMediaBank = function () {
            return $http({
                method: 'GET',
                url: URLS.getMediaBank + '?language=SPA',
            });
        };

        return new capitalsLuminaDoll();
    }

    angular
        .module('actinver.services')
        .service('capitalsLuminaDollSrv', capitalsLuminaDollSrv);

})();
