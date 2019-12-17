(function () {
    "use strict";

    function userDataCtrl($rootScope, $scope, Auth, userConfig, CommonModalsSrv, loginSrvc) {
        var udc = this, data = userConfig.user;
        udc.user = {
            name: data.name,
            mail: data.mail
        };

        udc.promotorA2K={
            list:[],
            selected: null
        };

        udc.usuarioFix={
        list:[],
            selected: null
        };

        function map(data) {
            if (angular.isArray(data)) {
                var map = data.map(function (reg) {
                    return {
                        id: reg.toString(),
                        text: reg.toString()
                    };
                });
                return map;
            }
            return data;
        }

        function inicializar (){
            loginSrvc.makeDataUser().then(function success(response){
                if(response.success){
                    udc.promotorA2K.list = map(response.user.userSession.adviserNumberA2kList);
                    udc.promotorA2K.selected = {
                        id: response.user.userSession.adviserNumberA2k,
                        text: response.user.userSession.adviserNumberA2k
                    };

                    udc.usuarioFix.list = map(response.user.userSession.userIDFixList);
                    udc.usuarioFix.selected = {
                        id: response.user.userSession.userIDFix,
                        text: response.user.userSession.userIDFix
                    };
                }
            }).catch(function failed(error){
                CommonModalsSrv.error(error.messagge);
            });
        }

        udc.changePromotorA2K = function (lastValue, newValue) {
            udc.promotorA2K.selected = {
                id: lastValue.id,
                text: lastValue.text
            };

            CommonModalsSrv.warning("¿Está seguro de cambiar al Promotor A2K:" + newValue.text +" para operar?", function () {
                loginSrvc.saveAdviserNumber(2, newValue.text).then(function success(reponse) {
                    if (reponse.success) {
                        udc.promotorA2K.selected = {
                            id: newValue.id,
                            text: newValue.text
                        };
                        CommonModalsSrv.done(reponse.message);
                    } else {
                        CommonModalsSrv.error(reponse.message);
                    }
                }).catch(function error(error) {
                    CommonModalsSrv.error(error.message);
                });

            });
        };

        udc.changeUsuarioFix = function (lastValue, newValue) {
            udc.usuarioFix.selected = {
                id: lastValue.id,
                text: lastValue.text
            };
            CommonModalsSrv.warning("¿Está seguro de cambiar al Usuario Fix: " + newValue.text + " para operar?", function () {
                loginSrvc.saveAdviserNumber(1, newValue.text).then(function success(reponse) {
                    if (reponse.success) {
                        udc.usuarioFix.selected = {
                            id: newValue.id,
                            text: newValue.text
                        };
                        CommonModalsSrv.done(reponse.message);
                    } else {
                        CommonModalsSrv.error(reponse.message);
                    }
                }).catch(function error(error) {
                    CommonModalsSrv.error(error.message);
                });
            });
        };

        udc.logout = function () {
            $scope.$emit('closeSocketNotificationLumina', { tipo: 'Cerrar Socket' });
            $rootScope.$broadcast('close-socket-ipc-status');
            $rootScope.$broadcast('close-socket-last-news');
            Auth.logout();
        };
        inicializar();
    }

    angular.module('actinver.controllers')
        .controller('userDataCtrl', userDataCtrl);

})();
