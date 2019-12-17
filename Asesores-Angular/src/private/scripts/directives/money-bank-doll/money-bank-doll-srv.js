(function() {
    'use strict';

    function moneyBankDollSrv( $http, URLS, csrfSrv, $q, CommonModalsSrv) {
        /**
         *  DollSrv
         */
        function DollSrv(){}

        DollSrv.prototype.getMoneyMarketCalculation = function( data ){
            return $q(function( resolve, reject ){
                csrfSrv.csrfValidate()
                    .then(successCsrf)
                    .catch(errorCsrf);

                function successCsrf() {
                    $http({
                        method: 'POST',
                        url: URLS.getMoneyMarketCalculation,
                        params: data,
                    }).then(function(response) {
                        if(response.data.outCommonHeader.result.result === 1){
                            resolve( response );
                        } else{
                            reject( {success: true, data: response.data.outCommonHeader.result.messages} );
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

        DollSrv.prototype.getMediaBank = function( ) {
            return $http({
                method: 'GET',
                url: URLS.getMediaBank + '?language=SPA',
            });
        };

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

        // Second and final confirmation
        DollSrv.prototype.captureDirectBank = function (_data) {
            return $q(function( resolve, reject ){
                csrfSrv.csrfValidate()
                    .then(successCsrf)
                    .catch(errorCsrf);

                function successCsrf() {
                    $http({
                        method: 'POST',
                        url: URLS.captureDirectBank,
                        params: _data
                    }).then(function(response) {
                        if(response.data.outCommonHeader.result.result === 1){
                            resolve( response);
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

        DollSrv.prototype.getAuctionsPrice = function (_instrument) {

            return $q(function( resolve, reject ){
                csrfSrv.csrfValidate()
                    .then(successCsrf)
                    .catch(errorCsrf);
                function successCsrf() {
                    $http({
                        method: 'POST',
                        url: URLS.getAuctionsPrice,
                        data: $.param({
                            auctionName:_instrument,
                            language:'SPA'
                        })
                    }).then(function(response) {
                        if(response.data.outCommonHeader.result.result === 1){                            
                            resolve({success : true, data: response.data , msg:response.data.outCommonHeader.result.messages[0].responseMessage });
                        } else{
                            reject({success : true, data: null  , msg:response.data.outCommonHeader.result.messages[0].responseMessage });
                        }
                    },function(){                        
                        reject({success : false, data: null , msg:'' });
                    });
                }

                function errorCsrf(error) {
                    reject(error);
                }
            });
        };

        DollSrv.prototype.captureReportoBank = function (_data) {
            return $q(function( resolve, reject ){
                csrfSrv.csrfValidate()
                    .then(successCsrf)
                    .catch(errorCsrf);

                function successCsrf() {
                    $http({
                        method: 'POST',
                        url: URLS.captureReportoBank,
                        params: _data
                    }).then(function(response) {
                        if(response.data.outCommonHeader.result.result === 1){
                            resolve( response);
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
        .service( 'moneyBankDollSrv', moneyBankDollSrv ) ;

})();