( function(){
    "use strict";

    function modals( $uibModal) {

        var api  = {};
        api.detail = function( _array ){
            var modal = $uibModal.open({
                templateUrl: '/scripts/modals/views/investment/account-name.html',
                controller: 'accountNameCtrl',
                controllerAs: 'accountName',
                resolve:{
                    info:function(){
                        return _array;
                    }
                },
            });
            return modal;
        };

        return api;
    }
    angular.module( 'actinver.services' )
        .service( 'accountModalSrv', modals );
})();
