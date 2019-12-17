( function(){
    "use strict";

    function modals( $uibModal, $timeout ) {
        var api  = {};

        api.show = function( _time ){
            var modal = $uibModal.open({
                templateUrl: '/scripts/directives/refresh-session/refresh-session-modal.html',
                windowClass : 'session',
                controllerAs: 'session',
                controller: function( $uibModalInstance ) {
                    var vm = this;
                    var initTime = _time;

                    vm.refreshSession = refreshSession;

                    function refreshSession () {
                        $uibModalInstance.close();
                    }

                    function updateReloj() {
                        if( initTime <= 10 ){
                            console.log('se acabo');
                            //location.assign('/asesoria/login');
                            return "";
                        }

                        vm.time = initTime;
                        initTime-= 1;
                        $timeout(function(){updateReloj();}, 1000 );
                    }

                    vm.close = function(){
                        $uibModalInstance.dismiss();
                    };

                    vm.done = function(){
                        $uibModalInstance.close();
                    };

                    updateReloj();
                }
            });

            return modal;
        };

        return api;
    }


    angular.module( 'actinver.services' )
        .service( 'RemainingModal', modals );


})();
