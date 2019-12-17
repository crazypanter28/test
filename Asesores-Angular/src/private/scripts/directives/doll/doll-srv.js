(function() {
    "use strict";

    function investmentSrv($http, URLS, $q, CommonModalsSrv, moment, contractTypeSrv ) {

        /**
        *  DollSrv
        */
        function DollSrv(){}

        DollSrv.prototype.getDoll = function( _contract ){
            return $http({
                method: 'GET',
                url: URLS.getInitDoll + _contract +'/1/1/0/?language=SPA',
            });
        };

        DollSrv.prototype.getDollFund = function( _contract , _type){
            var type = _type === 3 ? 2 : 1;
            return $http({
                method: 'GET',
                url: URLS.getInitDoll + _contract +'/' + type + '/1/0/?language=SPA',
            });
        };

        DollSrv.prototype.getDoll2 = function( _contract, _station ,_id, _anticipedSell ){
            _anticipedSell = _anticipedSell ? 1:0;
            return $http({
                method: 'GET',
                url: URLS.getInitDoll2 + _contract + '/' + ( _station.issuerName || _station.issuer ).trim() + '/'+ _station.serie + '/'+ ( _id === 'buy' ? 1:2 ) +'/0/' + _anticipedSell +'?language=SPA',
            });
        };


        DollSrv.prototype.getBanks = function( _contract) {
            return $http({
                method: 'get',
                url: URLS.getDollAccounts + '02/01/'+ _contract + '?language=SPA&accountStatus=1',
            });
        };

        DollSrv.prototype.confirmDoll = function ( _model, _contract, _anticipedSell) {
            _anticipedSell = _anticipedSell ? 1:0;
            var typeOp = _model.evtentType;
            var sendModel  = {
                contractNumber : _contract,
                buyCaptureType : 0,
                buyExecutionDate : moment(_model.dates.settlementDate).format('DDMMYYYY'),
                buyIssuerName : null,
                buyOperationDate: moment(_model.dates.operationDate).format('DDMMYYYY'),
                buySerie : null,
                buyTitlesAmount : 0,
                buyTitlesQty : 0,
                captureType : _model.type === 'titles' ? 1:2 , //1 títulos, 2 importe,
                executionDate : moment(_model.dates.settlementDate).format('DDMMYYYY'),
                movementType : _model.evtentType === 'sell' ? 2:1,
                netAmount : _model[typeOp].typeValue2,
                operationDate : moment(_model.dates.operationDate).format('DDMMYYYY'),
                settlementType : _model.BankSelected ? 'R' : null,
                titlesAmount : _model.type === 'titles' ? _model[typeOp].typeValue : _model[typeOp].typeValue2,
                titlesQty : _model[typeOp].typeValue,
                issuerName : _model.station.issuer ? _model.station.issuer : _model.station.issuerName ,
                serie : _model.station.serie,
                clabe:  _model.BankSelected ?  _model.BankSelected.bankAccounts.clabe : 0,
                anticipatedSell : _anticipedSell,
                settlementDate : moment(_model.dates.settlementDate).format('DDMMYYYY'),
                registrationType : _model.type === 'titles' ? 1:2,
                buyCLABE :  _model.BankSelected ?  _model.BankSelected.bankAccounts.clabe : 0,
                buyNetAmount : 0,
                buyRegistrationType : 0
        };

            return $q(function( resolve, reject ){
                csrf()
                    .then(successCsrf)
                    .catch(errorCsrf);

                function successCsrf () {
                    $http({
                        method: 'post',
                        url: URLS.confirmDoll,
                        data: $.param(sendModel)
                    })
                        .then(function( _res){
                            if( _res.data.outCommonHeader.result.result === 1){
                                resolve( {success: true, data: _res.data.outFundOrderQuotation.fundOrderResult } );
                            }
                            else{
                                reject( {success: true, data: _res.data.outCommonHeader.result.messages } );
                            }
                        },
                        function(){
                            CommonModalsSrv.systemError();
                            reject( null );
                        });
                }

                function errorCsrf(error) {
                    reject(error);
                }
            });
        };

        DollSrv.prototype.captureDoll = function ( _model, _contract, _user , _confirmModel, _anticipedSell, _contractType ) {
            _anticipedSell = _anticipedSell ? 1:0;
            var typeOp = _model.evtentType;
            var _json = {
                Contrato: _contract,
                Movimiento: _model.evtentType === 'buy' ? 'COMPRA' : 'VENTA',
                Emisora: _confirmModel.issuerTitlesSold.issuerName,
                Precio:  _confirmModel.issuerTitlesSold.netAmount,
                Títulos: _confirmModel.issuerTitlesSold.titlesQty,
                "Ejecución de la orden":  moment (_confirmModel.issuerTitlesSold.operationDate).format('DD/MM/YYYY'),
                "Liquidación de la orden": moment (_confirmModel.issuerTitlesSold.settlementDate).format('DD/MM/YYYY')
            };

            _json = JSON.stringify(_json);


            var sendModel = {
                contractNumber : _contract,
                buyIssuerName : null,
                clabe:  _model.BankSelected ?  _model.BankSelected.bankAccounts.clabe : 0,
                issuerName : _model.station.issuer ? _model.station.issuer : _model.station.issuerName,
                movementType : _model.evtentType === 'sell' ? 2:1,
                operationDate : moment(_model.dates.operationDate).format('DDMMYYYY'),
                settlementDate : moment(_model.dates.settlementDate).format('DDMMYYYY'),
                registrationType : _model.type === 'titles' ? 1:2, //1 compra, 2 venta
                serie : _model.station.serie,
                titlesAmount : _model.type === 'titles' ? _model[typeOp].typeValue : _model[typeOp].typeValue2,
                titlesQty : _model[typeOp].typeValue,
                netAmount:   _model[typeOp].typeValue2,
                buyOperationDate: moment(_model.dates.operationDate).format('DDMMYYYY'),
                buyRegistrationType : 0,
                buySettlementDate:  moment(_model.dates.operationDate).format('DDMMYYYY'),
                buyTitlesAmount : 0,
                buyTitlesQty : 0,
                buySerie : null,
                settlementType : _model.BankSelected ? 'R' : null,
                anticipatedSell: _anticipedSell,
                name : _user,
                buyNetAmount : 0,
                buyCLABE :  _model.BankSelected ?  _model.BankSelected.bankAccounts.clabe : 0,
                jsonDetails: _json
            };

            sendModel = contractTypeSrv.sendBinnacle(_contractType, sendModel , _model);

            return $q(function( resolve, reject ){
                csrf()
                    .then(successCsrf)
                    .catch(errorCsrf);

                function successCsrf () {
                    $http({
                        method: 'post',
                        url: URLS.capture,
                        data: $.param(sendModel),
                    })
                        .then(function( _res){
                                if( _res.data.outCommonHeader.result.result === 1){
                                    resolve( {success: true, data: _res.data } );
                                }
                                else{
                                    reject( {success: true, data: _res.data.outCommonHeader.result.messages } );
                                }
                            },
                            function(){
                                CommonModalsSrv.systemError();
                                reject( null);
                            });
                }
                function errorCsrf(error) {
                    reject(error);
                }
            });
        };

        function csrf () {
            return $q( function ( resolve, reject ) {
                $http.get(URLS.csrfRest)
                    .then(successCallback)
                    .catch(errorCallback);

                function successCallback (csrf) {
                    sessionStorage.setItem('__csrf',csrf.headers('X-CSRF-TOKEN'));
                    resolve({
                        success : true
                    });
                }

                function errorCallback (error) {
                    reject({
                        success: false,
                        data:{},
                        error : error,
                        message: "Ha ocurrido un error de seguridad"
                    });
                }
            } );
        }

        return new DollSrv();
    }

    angular.module('actinver.services')
        .service('dollSrvFund', investmentSrv);
})();
