(function () {

    'use strict';

    function notificationLuminaSrv(URLS, $q, $http, ErrorMessagesSrv) {

        function NotificacionLuminaServices() {

        }

        NotificacionLuminaServices.prototype.saveStateNotification = function (_datos) {
            return $q(function (resolve, reject) {
                _datos.language= 'SPA'; 
                $http({
                    method: 'POST',
                    url: URLS.updateStatusLumina,
                    data: $.param(_datos)                   
                }).then(function (response) {                    
                    resolve(response.data);
                }).catch(function (error) {
                    ErrorMessagesSrv('Se encontró un error favor de intentarlo más tarde, comuníquese con su help desk');
                    reject({ status: 'failed', error: error });
                });
            });
        };

        NotificacionLuminaServices.prototype.getNotifications = function () {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getNotificationLumina,
                    params: {
                        language: 'SPA'
                    }
                }).then(function success(response) {
                  
                    if (typeof response !== 'undefined' && response.data.outCommonHeader.result.result === 1) {
                        var lista = response.data.result;
                        var regNoLeidos = lista.filter(function (record) {
                            return !record.readNotificationFlag;
                        }).length;
                        resolve({ success: true, totalNoLeido: regNoLeidos, totalRegistro: lista.length, notificaciones: lista });
                    } else if (typeof response !== 'undefined' && response.outCommonHeader.result.result === 2) {
                        reject({ success: false, totalNoLeido: 0, totalRegistro: 0, notificaciones: [], message: response.data.outCommonHeader.result.messages[0].responseMessage });
                    } else {
                        reject({ success: false, totalNoLeido: 0, totalRegistro: 0, notificaciones: [], message: 'Se encontró un error favor de intentarlo más tarde, comuníquese con su help desk' });
                    }

                }).catch(function failed() {
                    reject({ success: false, totalNoLeido: 0, totalRegistro: 0, notificaciones: [], message: 'Se encontró un error favor de intentarlo más tarde, comuníquese con su help desk' });
                });
            });

        };

        return new NotificacionLuminaServices();
    }
    angular.module('actinver.services')
        .service('notificationLuminaSrv', notificationLuminaSrv);
})();