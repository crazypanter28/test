(function() {
    "use strict";

    function auth($sessionStorage, $q, userConfig, loginSrvc) {
        /**
         *  User profile resource
         */
        var Profile = {
            login: function(_credentials) {
                return loginSrvc.makeRequestLogin(_credentials);
            },
            permisos: function(_employeeNumber) {
                return loginSrvc.makeRequestPermissions(_employeeNumber);
            },
            csrf : function () {
                return loginSrvc.makeCsrfToken();
            },
            logout : function () {
                return loginSrvc.makeRequestLogout();
            }
        };

        var auth = {};

        var userHasPermissionForView = function(view) {
            if (!auth.isLoggedIn()) {
                return false;
            }

            if (!view.permissions || !view.permissions.length) {
                return true;
            }

            return auth.userHasPermission(view.permissions);
        };


         auth.currentUser = function() {
            return {
                user: JSON.parse($sessionStorage.user),
                user_permissions: JSON.parse($sessionStorage.user_permissions)
            };
        };


        /**
         *  Saves the current user in the root scope
         *  Call this in the app run() method
         */
        auth.init = function() {
            if (auth.isLoggedIn()) {
                userConfig.user =  auth.currentUser().user;
                userConfig.user_permissions =  auth.currentUser().user_permissions;
            }
        };

        auth.csrf = function () {
            return $q(function (resolve, reject) {
                Profile.csrf()
                    .then(successCallback)
                    .catch(errorCallback);

                function successCallback () {
                    resolve(true);
                }

                function errorCallback(error){
                    reject(error);
                }
            });
        };


        auth.login = function(username, password) {
            return $q(function(resolve, reject) {
                auth.csrf()
                    .then(successCallBack)
                    .catch();

                function successCallBack () {
                    Profile.login({
                        username: username,
                        password: password
                    }).then(function successCallback(response) {
                        $sessionStorage.user = JSON.stringify(response.data);
                        userConfig.user = response.data;
                        resolve(
                            auth.permission(response.data.employeeID)
                        );
                    }).catch(function(error) {
                        reject(error);
                    });
                }

            });
        };

        auth.permission = function(employeeID) {
            return $q(function(resolve, reject) {
                Profile.permisos(
                    employeeID
                ).then(function successCallback(response) {
                    $sessionStorage.user_permissions = JSON.stringify(response.data);
                    userConfig.user_permissions = response.data;
                    resolve(response);
                }).catch(function(error) {
                    reject(error);
                });
            });
        };

        auth.logout = function() {
            loginSrvc.makeCsrfToken()
                .then(doLogout)
                .catch();

            function doLogout (csrf) {
                Profile.logout(csrf)
                    .then(successCallback)
                    .catch(errorCallback);

                function successCallback () {
                    // delete $sessionStorage.user;
                    // delete $sessionStorage.user_permissions;
                    // delete $sessionStorage.sclient;
                    // delete userConfig.user;
                    // delete userConfig.user_permissions;
                    sessionStorage.clear();
                    location.assign('/asesoria/login');
                }

                function errorCallback (error) {
                    //login for errors in server
                    console.error(error);
                }
            }
        };


        auth.checkPermissionForView = function(view) {
            if (!view.requiresAuthentication) {
                return true;
            }

            return userHasPermissionForView(view);
        };


        auth.userHasPermission = function(permissions) {

            if (!auth.isLoggedIn()) {
                return false;
            }

            var found = R.find(function(permission) {
                return userConfig.user_permissions.componentDTO.indexOf(permission) >= 0;
            }, permissions);

            return found;
        };


        auth.isLoggedIn = function() {
            return $sessionStorage.user !== null && $sessionStorage.user !== undefined;
        };

        return auth;
    }


    angular.module('actinver.services')
        .factory('Auth', auth);


})();
