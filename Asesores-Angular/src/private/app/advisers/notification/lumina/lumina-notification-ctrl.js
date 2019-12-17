(function () {
    'use strict';
    function luminaNotificationCtrl($scope, notificationLuminaSrv,ErrorMessagesSrv) {

        var vm = this;
        vm.modal = false;
        vm.listNotification = [];

        function onStart() {
            vm.getNotificacion();
        }

        function getPositionElemento(_key) {
            var indice = -1;
            indice = vm.listNotification.findIndex(function (element) {                
                return element.adviserNotificationID === _key;
            });
            return indice;
        }

        function showLoading(opcion) {
            vm.modal = opcion;
        }

        vm.getNotificacion = function () {
            notificationLuminaSrv.getNotifications(sessionStorage.__username).then(function success(record) {
                vm.listNotification = record.notificaciones;
                $scope.$emit('mensajesLuminaNoLeidos', record.totalNoLeido);
            }).catch(function error(error) {
                ErrorMessagesSrv(error.message);
                vm.listNotification = [];
            });
        };

        vm.showMessage = function (_adviserNotificationId) {
            var indice = getPositionElemento(_adviserNotificationId);
            if (indice > -1) {
                if (!vm.listNotification[indice].readNotificationFlag) {
                    vm.saveStateNotificaction(_adviserNotificationId);
                } else {
                    vm.listNotification[indice].accion = 1;
                }
            }
        };

        vm.hideMessage = function (_adviserNotificationId) {
            var indice = getPositionElemento(_adviserNotificationId);
            if (indice > -1) {
                vm.listNotification[indice].accion = 0;
            }
        };

        vm.saveStateNotificaction = function (_adviserNotificationId) {
            var indice = -1;
            indice = getPositionElemento(_adviserNotificationId);
            notificationLuminaSrv.saveStateNotification({ adviserNotificationID: _adviserNotificationId }).then(function () {
                if (indice > -1) {
                    vm.listNotification[indice].readNotificationFlag = true;
                    $scope.$emit('mensajesLuminaNoLeidos', vm.listNotification.filter(function (record) {
                        return !record.readNotificationFlag;
                    }).length);
                    showLoading(false);
                }
                vm.listNotification[indice].accion = 1;

            }).catch(function () {
                showLoading(false);
                vm.listNotification[indice].accion = 0;
            });
        };

        onStart();
    }
    angular
        .module('actinver.controllers')
        .controller('luminaNotificationCtrl', luminaNotificationCtrl);
})();