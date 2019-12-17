(function() {
    'use strict';

    function moneyDirectDollSrv( $http, URLS, csrfSrv, $q, CommonModalsSrv ) {

        function DollSrv(){}

        DollSrv.prototype.getMoneyMarketIssuersSeriesQuery = function( _settlementType, _term ){
            return $q(function( resolve, reject ){
                csrfSrv.csrfValidate()
                    .then(successCsrf)
                    .catch(errorCsrf);

                function successCsrf() {
                    $http({
                        method: 'POST',
                        url: URLS.getMoneyMarketIssuersSeriesQuery,
                        params : {
                            language : 'SPA',
                            settlementType : _settlementType ,
                            term : _term
                        },
                    }).then(function(response) {
                        if(response.data.outCommonHeader.result.result === 1){
                            resolve( response.data.outMoneyMarketIssuersSeriesQuery.issuerData);
                        } else{
                            reject( {success: true, data: response.data.outCommonHeader.result} );
                        }
                    },function(){
                        CommonModalsSrv.systemError();
                        reject( null );
                    });
                }

                function errorCsrf(error) {
                    reject(error);
                }
            });
        };

        DollSrv.prototype.getMoneyMarketContactMeansCatalogs = function(_areaKey, _catalogName ) {
            return $http({
                method: 'GET',
                url: URLS.getMoneyMarketContactMeansCatalogs + _areaKey + '/' + _catalogName,
                params: {
                    language : 'SPA',
                }
            });
        };

        DollSrv.prototype.getMoneyMarketAdviserContractsQuery = function( _idAdviser, _contract ){
            return $q(function( resolve, reject ){
                csrfSrv.csrfValidate()
                    .then(successCsrf)
                    .catch(errorCsrf);

                function successCsrf() {

                    $http({
                        method: 'POST',
                        url: URLS.getMoneyMarketAdviserContractsQuery,
                        params : {
                         language : 'SPA',
                         adviserNumber : _idAdviser,
                         contractNumber : _contract
                         },
                    }).then(function(response) {
                        if(response.data.outCommonHeader.result.result === 1){
                            resolve( response.data.outMoneyMarketAdviserContractsQuery );
                         } else{
                            reject( {success: true, data: response.data.outCommonHeader.result} );
                         }
                    },function(){
                        CommonModalsSrv.systemError();
                        reject( null );
                    });
                }

                function errorCsrf(error) {
                    reject(error);
                }
            });
        };




        DollSrv.prototype.getMoneyMarketOrderQuotation = function(_model){
            return $q(function( resolve, reject ){
                csrfSrv.csrfValidate()
                    .then(successCsrf)
                    .catch(errorCsrf);

                function successCsrf() {
                    $http({
                        method: 'POST',
                        url: URLS.getMoneyMarketOrderQuotation,
                        data: $.param(_model)                       
                    }).then(function(response) {
                        if(response.data.outCommonHeader.result.result === 1){
                            resolve( response.data.outMoneyMarketOrderQuotation.orderQuotation);
                        } else{
                            reject( {success: true, data: response.data.outCommonHeader.result} );
                        }
                    },function(){
                        CommonModalsSrv.systemError();
                        reject( null );
                    });
                }

                function errorCsrf(error) {
                    reject(error);
                }
            });
        };

        DollSrv.prototype.getMoneyMarketOrderRegistration = function(_model){
            return $q(function( resolve, reject ){
                csrfSrv.csrfValidate()
                    .then(successCsrf)
                    .catch(errorCsrf);

                function successCsrf() {
                    console.log('modelo directo',_model);
                    var _json =  {
                        Instrumento: _model.issuer,
                        "Tipo inversión": "DIRECTO",
                        Plazo: _model.term,
                        "Tasa descuento cliente": _model.discountRate,
                        "Tasa descuento asesor": _model.adviserDiscountRate,
                        Titulos: _model.titlesQty
                    };
                    _model.jsonDetails = JSON.stringify(_json);
                    $http({
                        method: 'POST',
                        url: URLS.getMoneyMarketOrderRegistration,
                        data: $.param(_model)
                    }).then(function(response) {
                        if(response.data.outCommonHeader.result.result === 1){
                            if(response.data.outAdviserPendingOpRegistration){
                                resolve( response.data.outAdviserPendingOpRegistration.operationsDetails);
                            }else{
                                resolve( response.data.outMoneyMarketOrderRegistration.orderRegistration);
                            }

                        } else{
                            reject( {success: true, data: response.data.outCommonHeader.result} );
                        }
                    },function(){
                        CommonModalsSrv.systemError();
                        reject( null );
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
        .service( 'moneyDirectDollSrv', moneyDirectDollSrv ) ;

})();