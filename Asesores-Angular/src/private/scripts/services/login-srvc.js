(function() {
    "use strict";

    function loginSrvc($http, $q, URLS, CommonModalsSrv) {
        /**
         *  Login service user and password are required
         */
        var ls = this;
        //var errorMessage;

        ls.makeCsrfToken = function() {
            return $q(function (resolve, reject) {
                var _url = location.href;
                $http.head(_url)
                    .then(successCallback)
                    .catch(errorCallback);

                function successCallback(csrf) {
                    var _csrf = csrf.headers('X-CSRF-TOKEN');
                    sessionStorage.setItem('__csrf',csrf.headers('X-CSRF-TOKEN'));
                    resolve({
                        success: true,
                        data: _csrf,
                        message: "Operación realizada con éxito"
                    });
                }

                function errorCallback(){
                    reject({
                        success: false,
                        data: {},
                        message: "Ha ocurrido un error de seguridad"
                    });
                }
            });
        };

        ls.makeRequestLogout = function () {
            return $q(function(resolve, reject) {
                $http({
                    method: 'POST',
                    url: URLS.logout,
                    headers:{
                        'X-HTTP-Method-Override' : 'POST',
                        'Content-Type' : 'application/x-www-form-urlencoded'
                    }
                }).then(function successCallback(response) {
                    if (typeof response.data !== 'undefined') {

                        resolve({
                            success: true,
                            data : {},
                            message: "Operación realizada con éxito"
                        });
                    }
                    else {
                        reject({
                            success: false,
                            data: {},
                            message: "El usuario o contraseña que ingresaste es incorrecto, te pedimos volver a intentar."
                        });
                    }
                }, function errorCallback(error) {
                    reject({
                        success: false,
                        data: error,
                        message: "Falla en el servidor."
                    });
                });
            });
        };

        ls.makeDataUser  =function () {
            return $q(function ( resolve, reject ) {
                $http({
                    method: 'GET',
                    url : URLS.userInfo,
                    headers:{
                        'Authorization': 'bearer ' + sessionStorage.getItem('__token')
                    },
                    ignoreLoadingBar: true
                })
                    .then( successCallback )
                    .catch( errorCallback );
                function successCallback (response) {
                    resolve({
                        success : true,
                        user : response.data
                    });
                }
                function errorCallback (error) {
                    reject({
                        success : false,
                        error : error,
                        messagge : 'Ha ocurrido un error'
                    });
                }
            });
        };

        ls.makeRequestLogin = function(credentials) {
            return $q(function(resolve, reject) {
                $http({
                    method: 'POST',
                    url: URLS.login,
                    data: $.param(credentials),
                    headers:{
                        'X-CSRF-TOKEN': sessionStorage.getItem('__csrf'),
                        'X-HTTP-Method-Override' : 'POST',
                        'Content-Type' : 'application/x-www-form-urlencoded'
                    }
                }).then(function successCallback(response) {
                    if (typeof response.data !== 'undefined' && response.data.access_token !== '') {
                        sessionStorage.setItem('__token',response.data.access_token);                    
                        ls.makeDataUser()
                            .then( function  (response) {

                                angular.forEach(response.user.scope,function(scope){
                                   
                                    if(scope === "INCOMPLETE"){
                                        reject({
                                            success: false,
                                            data: {},
                                            error : "error",
                                            message: "El usuario no está registrado en LDAP. Favor de comunicarse al CAT"
                                        });
    
                                    }else{
                                        var _user = {
                                            "name": response.user.firstName + ' ' + response.user.lastName,
                                            "mail": response.user.clientId + '@actinver.com.mx',
                                            "employeeID": "-2147483648",                                            
                                            "userName": credentials.username,
                                            "roles": response.user.scope,
                                            "enviroment":response.user.systemTO.profile

                                        };
                                        resolve({
                                            success: true,
                                            data: _user,
                                            message: "Operación realizada con éxito"
                                        });
    
                                    }

                                });                   


                            })
                            .catch(function (error) {
                                reject({
                                    success: false,
                                    data: {},
                                    error : error,
                                    message: "Ha ocurrido un error al obtener los datos de usuario"
                                });
                            });
                    }
                    else {
                        reject({
                            success: false,
                            data: {},
                            message: "El usuario o contraseña que ingresaste es incorrecto, te pedimos volver a intentar."
                        });
                    }
                }, function errorCallback(error) {
                    
                    //errorMesagge(error.data.error_description);
                    reject({
                        success: false,
                        data: error,
                        message: error.data.error_description ,
                    });
                });
            });
        };

        /*function errorMesagge(_message){
            if(_message === 'Bad Credentials'){
                errorMessage = "El usuario o contraseña que ingresaste es incorrecto, te pedimos volver a intentar.";
            }else if (_message === 'User account is locked'){
                errorMessage = "Ha rebasado el número de intentos disponibles";
            }else if( _message === 'Ya existe una sesión activa para este cliente único') {
                errorMessage = "Ya existe una sesión activa para este usuario";
            }else{
                errorMessage = _message;
            }

        }*/

        /**
         *  Permission service employye number is required
         */
        ls.makeRequestPermissions = function(_employeeNumber) {
            return $q(function(resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getPermiso + '/' + parseInt(_employeeNumber) + '?language=SPA',
                    headers:{
                       'X-CSRF-TOKEN': sessionStorage.getItem('__csrf'),
                       'Authorization' : 'bearer ' + sessionStorage.getItem("__token")
                   },
                   ignoreLoadingBar: true
                }).then(function successCallback(response) {
                    if (typeof response.data !== 'undefined' && response.data.status === 1) {
                        resolve({
                            success: true,
                            data: JSON.parse(response.data.result.restrictionsString),
                            message: "Operación realizada con éxito"
                        });
                    }
                    else {
                        reject({
                            success: false,
                            data: {},
                            message: "No se pudo obetener información del usuario consultado, intente más tarde"
                        });
                    }
                }, function errorCallback(error) {
                    window.location.href = "/asesoria/login.html";
                    CommonModalsSrv.systemError();
                    reject({
                        success: false,
                        data: error,
                        message: "Falla en el servidor."
                    });
                });
            });
        };

        ls.validateUserTokens = function () {
            return $q(function (resolve, reject) {
                $http({
                        method: 'GET',
                        url: URLS.validateUserTokens + "?language=SPA",
                        headers: {
                            'Authorization': 'bearer ' + sessionStorage.getItem('__token')
                        }
                    })
                    .then(function success(response) {
                        if (typeof response !== 'undefined' && response.data.outCommonHeader.result.result === 1) {
                            resolve({
                                success: true,
                                msg: response.data.outCommonHeader.result.messages[0].responseMessage
                            });
                        } else {
                            reject({
                                success: false,
                                msg: response.data.outCommonHeader.result.messages[0].responseMessage
                            });
                        }
                    })
                    .catch(function error() {
                        reject({
                            success: false,
                            msg: 'Ha ocurrido un error'
                        });
                    });
            });
        };

        ls.saveAdviserNumber = function (adviserType, adviserNumber) {
            return $q(function (resolve, reject) {
                $http({
                    method: 'POST',
                    url: URLS.saveAdviserNumber,
                    data: $.param({
                        adviserNumber: adviserNumber,
                        adviserType: adviserType,
                        language: 'SPA'
                    }),
                    headers: {
                        'X-HTTP-Method-Override': 'POST',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(function successCallback(response) {
                    if (typeof response.data !== 'undefined' && response.data.outCommonHeader.result.result === 1) {
                        resolve({
                            success: true,
                            data: {},
                            message: response.data.outCommonHeader.result.messages[0].responseMessage
                        });
                    } else {
                        reject({
                            success: false,
                            data: {},
                            message: response.data.outCommonHeader.result.messages[0].responseMessage
                        });
                    }
                }, function errorCallback(error) {
                    reject({
                        success: false,
                        data: error,
                        message: "Ha ocurrido un error !!"
                    });
                });
            });
        };
    }

    angular.module('actinver.services')
        .service('loginSrvc', loginSrvc);
})();
