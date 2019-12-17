( function(){
    "use strict";

    function modals( $uibModal ) {

        var api  = {};

        api.warning = function( message ){
            var modal = $uibModal.open({
                templateUrl: '/scripts/modals/views/commons/warning.html',
                size: 'sm',
                windowClass : 'commons warning',
                controller: 'warningModalCtrl',
                controllerAs: 'warning',
                resolve:{
                    message: function(){
                        return message;
                    }
                }
            });

            return modal;
        };
        
       api.confirm = function( message ){
            var modal = $uibModal.open({
                templateUrl: '/scripts/modals/views/commons/confirm.html',
                size: 'sm',
                windowClass : 'commons confirm',
                controller: 'warningModalCtrl',
                controllerAs: 'warning',
                resolve:{
                    message: function(){
                        return message;
                    }
                }
            });

            return modal;
        };
        

        api.done = function( message ){
            var modal = $uibModal.open({
                templateUrl: '/scripts/modals/views/commons/done.html',
                size: 'sm',
                windowClass : 'commons done',
                controller: 'doneModalCtrl',
                backdrop: 'static',
                keyboard : false,
                controllerAs: 'done',
                resolve:{
                    message: function(){
                        return message;
                    }
                }
            });

            return modal;
        };

        api.info = function( message ){
            var modal = $uibModal.open({
                templateUrl: '/scripts/modals/views/commons/info.html',
                size: 'sm',
                windowClass : 'commons info',
                controller: 'doneModalCtrl',
                backdrop: 'static',
                keyboard : false,
                controllerAs: 'done',
                resolve:{
                    message: function(){
                        return message;
                    }
                }
            });

            return modal;
        };

        api.error = function( message){
            var modal = $uibModal.open({
              templateUrl: '/scripts/modals/views/commons/error.html',
              size: 'sm',
              windowClass : 'commons error',
              controller: 'errorModalCtrl',
              controllerAs: 'error',
              resolve: {
                  message: function(){
                      return message;
                  }
              }
            }).result.catch(function(res){
                if (!(res === 'cancel' || res === 'escape key press' || res === 'backdrop click' || typeof res === 'undefined')) {
                    throw res;
                }
            });

            return modal;
        };

        api.systemError =  function( message ){
            return $uibModal.open({
              templateUrl: '/scripts/modals/views/commons/system-error.html',
              size: 'sm',
              windowClass : 'commons errorSystem',
              controller: 'errorSystemModalCtrl',
              controllerAs: 'error',
              resolve: {
                  message: function(){
                      return message;
                  }
              }
            }).result.catch(function(res) {
                if (!(res === 'cancel' || res === 'escape key press')) {
                    throw res;
                }
            });
        };


        api.user = {};

        return api;
    }


    angular.module( 'actinver.services' )
        .service( 'CommonModalsSrv', modals );


})();
