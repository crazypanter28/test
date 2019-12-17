(function() {
    "use strict";

    function proposalSrv ( $http, $q, $filter, URLS, csrfSrv,loginSrvc  ) {

        var api = {};


        api.getActivityOffice = function (_date) {
            var defered = $q.defer();
            var promise = defered.promise;
            var date =  $filter('date')( _date, 'MM/yyyy');            
            var url;
            loginSrvc.makeDataUser().then( function( _response){                    
                for(var pos=0 ;pos< _response.user.scope.length; pos++) {
                    var _element= _response.user.scope[pos];
                        if ( _element === 'ASESOR'){
                            url=URLS.getActivityRecord;
                            
                        }else 
                        if (_element === 'ADMINISTRADOR') {
                            url=URLS.getActivityRecordAdm;
                            
                        }

                }

                $http.get( url + '/getReport/'+date+'/6?language=SPA'  
                    ).then(
                    function ( _response ){
                        if( _response.data.status === 1 ) {
                            defered.resolve( _response.data.result );
                        }
                        defered.reject( _response.data.messages );
                    },
                    function ( _error ) {
                        defered.reject( _error );
                    }
                );

            
            
            
            });
            

            return promise;
        };

        api.validateAdviserContract = function ( _idEmployee, _idContract ) {
            return $http.get( URLS.getAdviserContract + _idEmployee + '/' + _idContract + '?language=SPA' )
                .then( function ( _response ) {
                    if ( typeof _response !== 'undefined' && _response.data.response.status === 1 ) {
                        return _response && _response.data;
                    } else {
                        return null;
                    }
                });
        };

        api.getContractIdClient = function ( _model ) {
            var parametros=null;
            if(_model.type === "contract"){ //tipo de busqueda contrato 
                if(_model.optionTypeContract.text === "Casa"){ //tipo casa
                    parametros='?bankingArea=998&clientNumber=&contractNumber='+_model.field +'&descripcion='+_model.field +'&language=SPA&titularFlag=true&typeQuery=2';
                }else if(_model.optionTypeContract.text === "Banco"){//tipo banco
                    parametros='?bankingArea=999&clientNumber=&contractNumber='+_model.field +'&descripcion='+_model.field +'&language=SPA&titularFlag=true&typeQuery=2';
                }              
            
            }else{///Cliente unico
                    parametros='?bankingArea=&clientNumber='+_model.field +'&contractNumber=&descripcion='+_model.field +'&language=SPA&titularFlag=true&typeQuery=1';
            }
           
          
            return $http.get( URLS.getClientInfo+ parametros )
            .then( function ( _response ) {

                    if ( typeof _response !== 'undefined' && _response.data.outCommonHeader.result.result === 1 ) {
                        return _response && _response.data;
                    } else {
                        return _response.data;
                    }
                });
        };

        api.getTracingClientByClient = function (  _idClient ) {     
           return $http.get( URLS.getContracts + '?bankingArea=&clientID='+_idClient+'&language=SPA' )
                .then( function ( _response ) {
                     if ( typeof _response !== 'undefined' && _response.data.outCommonHeader.result.result === 1 ) {
                        return _response && _response.data.outContractsBalancesByPortfolioQuery.contractInformation;
                    } else {
                        return null;
                    }
                });
        };

        api.getContractSummary = function (_idEmployee, _idClient) {

            // return $http.get( URLS.getContractSummary + '95356523/53883?language=SPA' )
            return $http.get(URLS.getContractSummary + _idClient + '/' + _idEmployee + '?language=SPA')
                .then(function (_response) {
                    if (typeof _response !== 'undefined' && _response.data.status === 1) {
                        return _response && _response.data.result;
                    } else {
                        return null;
                    }
                });
        };


        api.getDetailedSummaryContract = function ( _contractNumber,typeContract ) {
     
                return $q(function (resolve, reject) {
                    csrfSrv.csrfValidate()
                        .then(successCsrf)
                        .catch(errorCsrf);
                    function successCsrf() {                        

                        $http({
                            method: 'POST',
                            url: URLS.getDetailedSummary,
                            params:{
                                language:'SPA',
                                contracts: window.btoa(JSON.stringify([{ contract: _contractNumber, source: typeContract }]) ),
                                headers:{ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                            }
                        }).then(function (_res) {
                           
                            if(_res.data.status === 1){
                                resolve({contractNumber:_contractNumber,result:_res.data.result});
                            }else{
                                resolve(null);
                            }
                            
                        });
                    }

                    function errorCsrf(error) {
                        reject(error);
                    }
                });

        };

        api.getPositionTypeBankAndHouse = function (_contractHouse, _contractBank) {
            var defered = $q.defer();
            var promise = defered.promise;
            var promiseHouse = api.getPosition(_contractHouse);
            var promiseBank = api.getPositionTypeBank(_contractBank);
            Promise.all([promiseHouse, promiseBank]).then(function (response) {                                   
                defered.resolve(response[0].concat(response[1]));
            }).catch(function ( ) {
                defered.resolve([]);
            });
            return promise;
        };

        api.getPosition = function (_contractNumbers) {
            var defered = $q.defer();
            var promise = defered.promise;
            $http.get(URLS.getTracingClient + '/Contract/getBrokerHousePositionList/' + _contractNumbers.join(',') + '?language=SPA')
                .then(function (_response) {
                        defered.resolve(_response.data.result);
                    },
                    function () {
                        defered.resolve([]);
                    });
            return promise;
        };       

        api.getPositionTypeBank = function (_contractNumbers) {
            var defered = $q.defer();
            var promise = defered.promise;
            var bankPosition = api.getBankPosition(_contractNumbers);
            var bankWarrantyPosition = api.getBankWarrantyPositionList(_contractNumbers);
            Promise.all([bankPosition, bankWarrantyPosition]).then(function (response) {
                var lista = response[0].concat(response[1]);
                lista.forEach(function (record) {
                    record.lastPrice = record.price;
                });
                defered.resolve(lista);
            }).catch(function () {
                defered.resolve([]);
            });
            return promise;
        };

        api.getBankPosition = function (_contractNumbers) {
            var defered = $q.defer();
            var promise = defered.promise;
            $http.get(URLS.getBankPositionList + _contractNumbers.join(',') + '?language=SPA')
                .then(function (_response) {
                    if (_response.data.status === 1)
                        defered.resolve(_response.data.result);
                    else
                        defered.resolve([]);
                })
                .catch(function () {
                    defered.resolve([]);
                });
            return promise;
        };

        api.getBankWarrantyPositionList = function(_contractNumbers){
            var defered = $q.defer();
            var promise = defered.promise;
            $http.get(URLS.getBankWarrantyPositionList + _contractNumbers.join(',') + '?language=SPA')
                .then(function (_response) {
                    if (_response.data.status === 1)
                        defered.resolve(_response.data.result);
                    else
                        defered.resolve([]);
                })
                .catch(function () {
                    defered.resolve([]);
                });
            return promise;
        };

        api.getDetailedCustomerTrackingReport=function(_model){
            return $q(function (resolve, reject) {
                csrfSrv.csrfValidate()
                .then(successCsrf)
                .catch(errorCsrf);

                function successCsrf() {   
                    $http({
                        method: 'POST',
                        url: URLS.getDetailedCustomerTrackingReport,
                        data:$.param(_model),
                        responseType: 'arraybuffer'
                    }).then(function (response) {
                        resolve(response);                      
                    }).catch(function(error){
                        reject(error);
                    });
                }
                function errorCsrf(error) {
                    reject(error);
                }
                });
        };

        api.getCustomerTrackingReport=function(_model){
            return $q(function (resolve, reject) {
                csrfSrv.csrfValidate()
                .then(successCsrf)
                .catch(errorCsrf);

                function successCsrf() {   
                    $http({
                        method: 'POST',
                        url: URLS.getCustomerTrackingReport,
                        data:$.param(_model),
                        responseType: 'arraybuffer'
                    }).then(function (response) {
                        resolve(response);                      
                    }).catch(function(error){
                        reject(error);
                    });
                }
                function errorCsrf(error) {
                    reject(error);
                }
                });
        };


        return api;
    }

    angular.module('actinver.services')
        .service( 'proposalSrv', proposalSrv );
})();
