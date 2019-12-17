( function(){
    "use strict";

    function pendingModalsSrv( $uibModal ) {

        var api  = {};

        /** Add reason**/
        api.addReason = function( _title, _params ){
            var modal = $uibModal.open({
                templateUrl: '/scripts/modals/views/pending/reason.html',
                size: 'md',
                controller: 'addPendingModalCtrl',
                controllerAs: 'pending',
                resolve:{
                    params:function() {
                        return _params;
                    },
                    title: function(){
                        return _title;
                    }
                }
                });

            return modal;
        };

        return api;
    }


    angular.module( 'actinver.services' )
        .service( 'pendingModalsSrv', pendingModalsSrv );


})();
