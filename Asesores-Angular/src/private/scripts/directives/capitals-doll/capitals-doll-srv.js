(function() {
    'use strict';

    function capitalsDollSrv( $http, URLS, $q, csrfSrv, contractTypeSrv, $filter) {

        var volOculto, price, priceLimit, minimumVolume;
        var date = $filter('date')(new Date(), 'yyyy-MM-dd' );
        /**
        *  capitalsDoll
        */
        function capitalsDoll(){}

        // Get current catalog type order
        capitalsDoll.prototype.getOrderCatalog = function(){
            return $q(function( resolve, reject ){
                $http({
                    method: 'GET',
                    url: URLS.getOrderCatalog + '?language=SPA'
                })
                .then( function( _res){
                    if( _res.data.outCommonHeader.result.result === 1){
                        resolve(
                            _res.data.outOrdersTypeQuery.orderTypeCatalogData
                        );
                    }
                    else{
                        reject(
                            _res.data.outCommonHeader
                        );
                    }
                });
            });
        };

        capitalsDoll.prototype.confirmStopLoss = function (  sendModel ) {
            return $q(function( resolve, reject ){
                csrfSrv.csrfValidate()
                    .then(successCsrf)
                    .catch(errorCsrf);

                function successCsrf() {
                    $http({
                        method: 'POST',
                        url: URLS.confirmStopLoss,
                        data: $.param(sendModel),
                    })
                        .then(function( _res ){
                            if( _res.data.outCommonHeader.result.result === 1 ){
                                resolve( _res.data.outStopLossTrailingStopRegistration );
                            }
                            else{
                                reject( _res.data.outCommonHeader.result.messages);
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

        function validationType ( _type, _model ) {
            if(_type === 'LP' || _type === 'BQ' || _type === 'ET' || _type === 'EV' || _type === 'PA'){
                price = _model.priceStation ? _model.priceStation : _model.station.tradeSellPrice;
            }else if(_type === 'ML' ||_type === 'PD'||_type === 'XM'||_type === 'MP' ||_type === 'MC' || _type === 'MO' || _type === 'PR' || _type === 'MA' || _type === 'HC' || _type === 'LO' || _type === 'HC' || _type ==='DC'){
                price = 0;
            }else if(_type === 'VO'){
                price =_model.priceStation;
            }

            if(_type === 'VO' || _type === 'LO'){
                volOculto = _model.order.model.volOculto;
            }else{
                volOculto = 0;
            }

            if(_type === 'XM' || _model.orderValidity.text === 'MINFI'){
                minimumVolume = _model.order.model.volMin;
            }else{
                minimumVolume = 0;
            }

            if(_type === 'XM'|| _type === 'PR' || _type === 'MA' || _type === 'MP' || _type === 'LO' || _type === 'PA' || _type === 'MO' || _type === 'MP'){
               priceLimit  = _model.order.model.maxPrice;
            }else{
                priceLimit = 0;
            }

        }

        capitalsDoll.prototype.getOrderValidity = function (_id, _type){
            return $http({
                method: 'GET',
                url: URLS.getOrderValidity + _type + '/' + _id + '?language=SPA',
            });
        };

        capitalsDoll.prototype.confirmDoll = function ( _model, _contract, _user, _contractType ) {
            validationType(_model.order.value.shortKey, _model );
            var _sendModel = {
                contractNumber: _contract,
                issuerName:_model.station.issuer.issuerName,
                serie:_model.station.issuer.serie,
                iMovement: _model.evtentType === 'buy' ? 1 : 2,
                orderType: _model.order.value.shortKey,
                term: _model.order.model.term,
                securities:_model.titlesMK,
                price:price,
                priceLimit:priceLimit,
                percentage: volOculto,
                hiddenVolume:volOculto,
                minimumVolume: minimumVolume,
                fillOrKill:'N',
                actionType:'1', //Cotizacion
                agreementType: _model.order.value.agreementType,
                brokerageID: _model.typeStock,
                routing:_model.operatorType,
                name: _user,validityOrderTime: _model.order.options.time !== undefined ?  _model.order.options.time + ':00' : '00:00:00',
                validityType: _model.orderValidity.id,
                jsonDetails : ''
            };

            _sendModel = contractTypeSrv.sendBinnacle(_contractType, _sendModel , _model);

            return $q(function( resolve, reject ){
                csrfSrv.csrfValidate()
                    .then(successCsrf)
                    .catch(errorCsrf);
                function successCsrf() {
                    $http({
                        method: 'POST',
                        url: URLS.confirmCapitalDoll,
                        data: $.param(_sendModel),
                    })
                        .then(function( _res ){
                            if( _res.data.outCommonHeader.result.result === 1 ){
                                resolve( _res.data );
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

        capitalsDoll.prototype.captureDoll = function (  _model, _contract, _user, _contractType) {
            var tipooperacion = '';
            if(_model.evtentType === 'buy'){
                tipooperacion = 'Compra';
            }else if(_model.evtentType === 'sell'){
                tipooperacion = 'Venta';
            }

            var _json = {
                Contrato: _contract,
                "Tipo de orden": tipooperacion,
                Emisora: _contractType.issuerName ,
                Precio: _contractType.price,
                Títulos: _contractType.titlesQty
                //Plazo: _model.order.model.term,
                //Comisión: _confirmModel.stockMarketOrderQuotation.orderQuotation.operationFeeAmount,
                //IVA: _confirmModel.stockMarketOrderQuotation.orderQuotation.vat
            };
            _json = JSON.stringify(_json);

            validationType(_model.order.value.shortKey, _model );
            var _sendModel = {
                contractNumber: _contract,
                issuerName:_model.station.issuer.issuerName,
                serie:_model.station.issuer.serie,
                iMovement: _model.evtentType === 'buy' ? 1 : 2,
                orderType: _model.order.value.shortKey,
                term: _model.order.model.term,
                securities:_model.titlesMK,
                price:price,
                priceLimit:priceLimit,
                percentage: volOculto,
                hiddenVolume:volOculto,
                minimumVolume: minimumVolume,
                fillOrKill:'N',
                actionType:'2',
                agreementType: _model.order.value.agreementType,
                brokerageID: _model.typeStock ? _model.typeStock : '0',
                routing:_model.operatorType,
                name: _user,
                validityOrderTime: _model.order.options.time !== undefined ?   _model.order.options.time + ':00' :  '00:00:00',
                validityType: _model.orderValidity.id, 
                jsonDetails : _json
            };
             //_model, _contract, _user, _contractType  var contract = JSON.parse(localStorage.getItem('contractSelected'));
            
            var contract =JSON.parse(localStorage.getItem('contractSelected'));
            _contractType = contractTypeSrv.contractType( contract.isPropia , contract.isEligible, contract.isDiscretionary);
            _sendModel = contractTypeSrv.sendBinnacle(_contractType, _sendModel , _model);

            return $q(function( resolve, reject ){
                csrfSrv.csrfValidate()
                    .then(successCsrf)
                    .catch(errorCsrf);
                function successCsrf () {
                    $http({
                        method: 'POST',
                        url: URLS.confirmCapitalDoll,
                        data: $.param(_sendModel),
                    })
                        .then(function( _res ){
                            if( _res.data.outCommonHeader.result.result === 1 ){
                                resolve( _res.data );
                            }
                            else{
                                reject( _res.data.outCommonHeader.result.messages );
                            }
                        });
                }

                function errorCsrf(error) {
                    reject(error);
                }

            });
        };


        return new capitalsDoll();
    }

    angular
        .module( 'actinver.services' )
        .service( 'capitalsDollSrv', capitalsDollSrv ) ;

})();
