(function () {
    'use strict';

    function menuCtrl($sessionStorage, URLS, $scope, $timeout, notificationLuminaSrv, LuminaModalsSrv, ErrorMessagesSrv, Auth) {
        var vm = this;
        var ctrlTimer;
        vm.sclient = JSON.parse($sessionStorage.user);
        vm.numeroNotificacionesLumina = 0;

        vm.socketNotification = {
            stompclient: null,
            susbcribe: null
        };

        vm.menu = {
            showSlide: false,
            position: 0,
            showButtonLeft: false,
            showButtonRight: false
        };

        $scope.$on('closeSocketNotificationLumina', function () {
            if (validRole("ASESOR"))
                cerrarsocket();
        });

        $scope.$on('mensajesLuminaNoLeidos', function (event, numMensajes) {
            vm.numeroNotificacionesLumina = numMensajes;
        });

        function validRole(roleSearch) {
            var user = JSON.parse(JSON.parse(sessionStorage["ngStorage-user"]));
            var indice = -1;
            if (angular.isDefined(user.roles) && angular.isArray(user.roles)) {
                indice = user.roles.findIndex(function (rol) {
                    return rol.toUpperCase() === roleSearch;
                });
            }
            return indice > -1;
        }

        function cerrarsocket() {
            if (vm.socketNotification.stompclient !== null) {
                vm.socketNotification.susbcribe.unsubscribe();
                vm.socketNotification.stompclient.disconnect();
            }
        }

        function onstart() {
            if (validRole("ASESOR")) {
                getNotificationLumina();
                $timeout(inicializarSocket, 3000);
            }   
            showButtonsMenu();

        }

        function getNotificationLumina() {
            notificationLuminaSrv.getNotifications(sessionStorage.__username).then(function success(record) {
                vm.numeroNotificacionesLumina = record.totalNoLeido;
            }).catch(function error(error) {
                ErrorMessagesSrv(error.message);
                vm.numeroNotificacionesLumina = 0;
            });
        }

        function inicializarSocket() {
            var _url = URLS.LuminaWebSocket + '?access_token=' + sessionStorage.getItem("__token");
            var socket = new SockJS(_url);
            vm.socketNotification.stompclient = Stomp.over(socket);
            vm.socketNotification.stompclient.debug = null;
            vm.socketNotification.stompclient.connect({}, function () {
                var user = JSON.parse(JSON.parse(sessionStorage["ngStorage-user"]));
                var subscribe = '/topic/notifications/' + user.userName;
                vm.socketNotification.susbcribe = vm.socketNotification.stompclient.subscribe(subscribe, function (response) {
                    var data = JSON.parse(response.body);
                    LuminaModalsSrv.information(data);
                });
            }, function () {
                $timeout(inicializarSocket, 3000);
            });
        }


        function getDiferentsWidthMenu(){    
            var obj = {
                divMenu: document.getElementById("idMenuDiv").getBoundingClientRect().width - 5,
                ulMenu: document.getElementById("idContentMenu").getBoundingClientRect().width + 30
            };
            if (obj.ulMenu > obj.divMenu)
                obj.restantes = obj.ulMenu - obj.divMenu;
            else{               
                    obj.restantes = 0;
            }                   
            return obj;
        }

        function showButtonsMenu () {
            var size = getDiferentsWidthMenu();            
            //boton izquierdo
            vm.menu.showButtonLeft = (vm.menu.position <= 0 ? false:true);
            //boton derecho
            vm.menu.showButtonRight = (vm.menu.position >= size.restantes ? false: true);
        }

        vm.validatePermiso = function(permiso){
            if (Auth.userHasPermission(permiso))
                return true;
            return false;
        };

        vm.slideMenuLeft = function () {       
            vm.menu.position = vm.menu.position <= 0 ? 0 : (vm.menu.position - 30);
            showButtonsMenu();
            document.getElementById("idContentMenu").style.right = (vm.menu.position+"px");                        
            if (vm.menu.position <= 0) {
                $timeout.cancel(ctrlTimer);
            } else {
                ctrlTimer = $timeout(vm.slideMenuLeft, 150);
            }
        };

        vm.slideMenuRight = function () {            
            var size = getDiferentsWidthMenu();         
            vm.menu.position = vm.menu.position > size.restantes ? size.restantes: vm.menu.position + 30;                
            showButtonsMenu();           
            document.getElementById("idContentMenu").style.right = (vm.menu.position+"px");                        
            if (vm.menu.position > size.restantes) {
                $timeout.cancel(ctrlTimer);
            } else {
                ctrlTimer = $timeout(vm.slideMenuRight, 150);
            }
        };

        vm.resize = function(){
            vm.menu.position = 0;
            document.querySelector("#idContentMenu").style.right = "0px"; 
            showButtonsMenu();
            $scope.$apply();
        };

        vm.mouseOver = function(tipo){
            if (tipo === 1)
                vm.slideMenuLeft();
            else
                vm.slideMenuRight();
        };

        vm.mouseLeave = function () {
            if (ctrlTimer && ctrlTimer !== null)
                $timeout.cancel(ctrlTimer);
        };


        onstart();

    }
    angular
        .module('actinver.controllers')
        .controller('menuCtrl', menuCtrl);

})();