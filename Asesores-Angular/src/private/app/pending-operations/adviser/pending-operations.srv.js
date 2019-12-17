(function(){
    "use strict";
    angular
        .module( 'actinver.services' )
        .factory( 'pendingOperationsAdviser', pendingOperationsFactory );

   
    function pendingOperationsFactory( $http, $q, URLS, csrfSrv, ErrorMessagesSrv,loginSrvc, $sessionStorage ){
        return {
            getOperations           : getOperations,
            sendPendingOperations   : sendPendingOperations,
            cancelation             : cancelation,
            getOperationsHistoric   : getOperationsHistoric,
            getOperationsSent       : getOperationsSent
        };

    function getOperations( _type ){
            var _url; //= URLS.getPendingOperations + _type + '?language=SPA';
            return $q ( function ( resolve,reject ) {

                loginSrvc.makeDataUser().then( function( _response){                    
                    for(var pos=0 ;pos< _response.user.scope.length; pos++) {
                        var _element= _response.user.scope[pos];
                            if (_element === 'CAT') {
                                _url=URLS.getPendingOperationsCat+_type + '?language=SPA';
                                break;
                            }else if ( _element === 'ASESOR'){
                                _url=URLS.getPendingOperations+ _type + '?language=SPA';
                                break;
                            } 
                    }

                    $http.get(_url)
                    .then(successPO)
                    .catch(errorPO);

                    function successPO(response){
                        if ( response.data.type === 'ERROR' ) {
                            reject ({
                                status : false,
                                response : response.data,
                                responseMsg : 'No existen operaciones pendientes'
                            });
                        } else {
                            resolve ({
                                status : true,
                                response : response
                            });
                        }
                    }

                    function errorPO(){
                        //Logica
                        return;
                    }

                    });

            });
        }

        function sendPendingOperations(params,type){
            var info = JSON.parse($sessionStorage.user);
            var enviroment = info.enviroment;
            
      
            var _url; // = type === 'reject' ? URLS.PendingOperationsReject : URLS.PendingOperationsApprove;
            return $q ( function ( resolve ) {

                loginSrvc.makeDataUser().then( function( _response){                    
                    for(var pos=0 ;pos< _response.user.scope.length; pos++) {
                        var _element= _response.user.scope[pos];
                            if (_element === 'CAT') {
                                _url= type === 'reject' ? (URLS.PendingOperationsRejectCatNotification ) : (URLS.PendingOperationsApproveCatNotification);
                                break;
                            }else if ( _element === 'ASESOR'){
                                _url= type === 'reject' ? (URLS.PendingOperationsRejectNotification) :( URLS.PendingOperationsApproveNotification );
                                break;
                            } 
                    }
                    
                    csrfSrv.csrfValidate()
                    //$http.post(_url,$.param(params))
                    .then(successCsrf)
                    .catch(errorCsrf);
        
                    function successCsrf(){
        
                        $http({
                            method: 'POST',
                            url: _url,
                            data: $.param(params),
                        }).then(function (response) {
                            if (response.data.error) {//remover este if y els;  cuando ya se tenga los cambios de banca
                                if (typeof response !== 'undefined' && response.data.outCommonHeader.result.result === 1) {
                                    resolve ({status : true, response : response.data});
                                }else{
                                    return {
                                        status : false,
                                        responseMessage : response.data.error.responseMessage
                                        //Esperando cambios en Banca
                                        //responseMessage : response.data.outCommonHeader.result.messages
                                    };
                                }
                            }else{
                                resolve ({status : true,response : response.data}); 
                            }
                            
                        }).catch(function () {
                            ErrorMessagesSrv('Se encontró un error favor de intentarlo más tarde, comuníquese con su help desk');
                        });
        
                    }
        
                    function errorCsrf(){}
                
                
                
                });
               
            });
 
        }

        function cancelation ( typeOperation ) {
            return $q( function ( resolve ) {
                var _reason = null;
                switch ( typeOperation ) {
                    case 'Otro' :
                        _reason = -1;
                        break;
                    case 'COMPRA/VENTA DE TITULOS DE EMISORAS SOCIEDADES DE INVERSIÓN' :
                        _reason = 0;
                        break;
                    case 'TRASPASO SPEI DESDE CONTRATO DE CASA DE BOLSA' :
                        _reason = 3;
                        break;
                    case 'REGISTRO DE ORDEN PARA MERCADO DE DINERO (BONOS)' :
                        _reason = 2;
                        break;
                    case 'REGISTRO DE ORDEN DE MERCADO DE CAPITALES' :
                        _reason = 1;
                        break;
                    case 'REGISTRO STOPLOSS DE UNA EMISORA DE MERCADO DE CAPITALES' :
                        _reason = 1;
                        break;
                    case 'COMPRA DE FONDOS DE INVERSIÓN DE BANCO' :
                        _reason = 0;
                        break;
                    case 'VENTA DE FONDOS DE INVERSIÓN DE BANCO' :
                        _reason = 0;
                        break;
                    case 'REGISTRO DE VENTA DE DIRECTO MERCADO DE DINERO' :
                        _reason = 2;
                        break;
                    case 'REGISTRO DE COMPRA DE DIRECTO MERCADO DE DINERO' :
                        _reason = 2;
                        break;
                    case 'REGISTRO DE VENTA DE REPORTO MERCADO DE DINERO' :
                        _reason = 2;
                        break;
                    case 'TransferExecution No se tiene desc' :
                        _reason = 3;
                        break;
                }
                resolve(_reason);
            });
        }

        function getOperationsHistoric( screenId ){
            var _url; //= URLS.getPendingOperations + _type + '?language=SPA';
            return $q ( function ( resolve,reject ) {

                loginSrvc.makeDataUser().then( function( _response){                    
                    for(var pos=0 ;pos< _response.user.scope.length; pos++) {
                        var _element= _response.user.scope[pos];
                            if (_element === 'CAT') { 
                                _url=URLS.PendingOperationsHistoricCat+ screenId + '?language=SPA';
                                break;
                            }else if ( _element === 'ASESOR'){
                                _url=URLS.PendingOperationsHistoric+ screenId + '?language=SPA';
                                break;
                            } 
                    }

                    $http.get(_url)
                    .then(successPO)
                    .catch(errorPO);

                    function successPO(response){
                        if ( response.data.type === 'ERROR' ) {
                            reject ({
                                status : false,
                                response : response.data,
                                responseMsg : 'No existen operaciones pendientes'
                            });
                        } else {
                            resolve ({
                                status : true,
                                response : response
                            });
                        }
                    }

                    function errorPO(){
                        //Logica
                        return;
                    }

                    });

            });
        }

        function getOperationsSent(){
            var _url = URLS.getPendingOperationsSent + '?language=SPA';
            return $q ( function ( resolve,reject ) {


                    $http.get(_url)
                    .then(successPO)
                    .catch(errorPO);

                    function successPO(response){
                        if ( response.data.type === 'ERROR' ) {
                            reject ({
                                status : false,
                                response : response.data,
                                responseMsg : 'No existen operaciones pendientes'
                            });
                        } else {
                            resolve ({
                                status : true,
                                response : response
                            });
                        }
                    }

                    function errorPO(){
                        //Logica
                        return;
                    }

            });
        }
    }
    

})();