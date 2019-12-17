(function() {
    "use strict";

    function loginCtrl($http, Auth) {
        var vm = this;
        vm.service = {
            error: "",
            mensaje: ""
        };
        vm.blur = "";
        vm.login = function(credentials) {
            vm.spinner = true;
            Auth.login(credentials.user, credentials.password).then(function successCallback(response) {
                vm.spinner = false;
                vm.service.error = !response.success;
                vm.service.mensaje = response.message;
                var url='index.html#/generic';
 
                //Redirecciona a dashboard
                for(var pos =0; pos < response.data.componentDTO.length;pos++){
                    var acceso=response.data.componentDTO[pos];
                    
                    if("asesores.InicioMenu." === acceso.trim()){
                        url="index.html#/dashboard";
                        break;
                    }else if("asesores.OperacionesPendientesMenu.Cat" === acceso.trim()){
                        url="index.html#/received"; 
                        break;
                    }


                }

                //Redirecciona a ruta 
                location.assign(url);
                //window.location.href=url;

            }, function errorCallback(error) {
                vm.spinner = false;
                vm.service.error = !error.success;
                vm.service.mensaje = error.message;
            });


        };

    }

    angular.module('actinver.services', []);
    angular.module('actinver.constants', []);
    angular
        .module('actinver', [
            'ui.bootstrap',
            'actinver.services',
            'actinver.constants',
            'ngStorage'
        ])
        .controller('loginCtrl', loginCtrl);

})();
