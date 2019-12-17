(function() {
    "use strict";

    function GroupSrv( URLS, $q, $http, csrfSrv, ErrorMessagesSrv ) {
        /**
         *  prospect service
         */
        function Group(){}


        Group.prototype.getGroups = function () {
            return $q(function( resolve, reject ){
                $http({
                    method: 'GET',
                    url: URLS.getGroups,
                    params:{
                        language: 'SPA'
                    }
                }).then(function(response) {
                    if( !!response.data.status ){
                        resolve( response.data.result );
                    }
                    else{
                        ErrorMessagesSrv( response.data.messages );
                        reject();
                    }
                })
                .catch( reject );
            });
        };


        Group.prototype.saveGroup = function( _model ) {
            return $q(function( resolve, reject ){

                csrfSrv.csrfValidate()
                .then(successCsrf)
                .catch(errorCsrf);

                function successCsrf(){

                    var parametersSubmit = {
                        name:_model.name,
                        idEmployee:_model.employeeID,
                        language: 'SPA'
                    };

                    $http({
                        method: 'POST',
                        url: URLS.saveGroup,
                        data: $.param(parametersSubmit)
                    })
                    .then(function(response) {
                        if( !!response.data.status && response.data.status === 1 ){
                            resolve( response.data.result );
                        }else{
                            ErrorMessagesSrv( response.data.messages );
                            reject();
                        }
                    }).catch(function(res) {
                        if (!(res === 'cancel' || res === 'escape key press' || res === 'backdrop click' || typeof res === 'undefined')) {
                            throw res;
                        }
                    });
                }

                function errorCsrf(error){
                    reject(error);
                }

            });
        };

        Group.prototype.updateNameGroup = function( _model ) {
            return $q(function( resolve, reject ){

                csrfSrv.csrfValidate()
                .then(successCsrf)
                .catch(errorCsrf);

                function successCsrf(){

                    var parametersSubmit = {
                        name:_model.name,
                        idTargetGroup:_model.idTargetGroup,
                        language: 'SPA'
                    };

                    $http({
                        method: 'POST',
                        url: URLS.updateNameGroup,
                        data: $.param(parametersSubmit)
                    })
                    .then(function(response) {
                        if( !!response.data.status ){
                            resolve( response.data.result );
                        }
                    });
                }

                function errorCsrf(error){
                    reject(error);
                }

            });
        };

        Group.prototype.deleteGroup = function( _id ) {
            return $q(function( resolve, reject ){

                csrfSrv.csrfValidate()
                .then(successCsrf)
                .catch(errorCsrf);

                function successCsrf(){

                    var parametersSubmit = {
                        idTargetGroup: _id,
                        language: 'SPA'
                    };

                    $http({
                        method: 'POST',
                        url: URLS.deleteGroup,
                        data: $.param(parametersSubmit)
                    })
                    .then(function(response) {
                        if( !!response.data.status ){
                            resolve( response.data.result );
                        }else{
                            ErrorMessagesSrv( response.data.messages );
                            reject();
                        }
                    });
                }

                function errorCsrf(error){
                    reject(error);
                }

            });
        };


        Group.prototype.service = function( _type, _method, _paylod ){
            var types ={
                userGroups: 'getAllUser/',
                financialCenters: 'getFinancialCenters/',
                saveCenter: 'saveFinancialCenter/',
                saveUser: 'saveUser/',
                deleteCenter :'deleteFinancialCenter/',
                deleteUser: 'deleteUser/',
            };
            var param = { language: 'SPA'};
            if (_paylod){
                for (var par in _paylod){
                   param[par] = _paylod[par];
                }
              }

            return $q(function( resolve, reject ){
                $http({
                    method: ( _method || 'GET') ,
                    url: ( URLS.ServiceGroups + types[_type] || '/'  ),
                    params: { language: 'SPA'},
                    data: $.param(param)
                }).then(function(response) {
                    if( !!response.data.status ){
                        resolve( response.data.result );
                    }
                    else{
                        ErrorMessagesSrv( response.data.messages );
                        reject();
                    }
                });
            });

        };



        return new Group();
    }

    angular.module('actinver.services')
        .service('GroupSrv', GroupSrv);
})();
