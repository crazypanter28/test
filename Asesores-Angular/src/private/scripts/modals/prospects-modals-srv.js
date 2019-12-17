( function(){
    "use strict";

    function prospectModalsSrv( $uibModal ) {

        var api  = {};

        /** Add prospects **/
        api.addOpportunity = function( _message, _id ){
            return $uibModal.open({
                templateUrl: '/scripts/modals/views/prospects/add.html',
                controller: 'prospectsModalCtrl',
                controllerAs: 'add',
                size : 'lg',
                resolve: {
                    msg: function(){
                        return _message;
                    },
                    IDOpportunity: function(){
                        return _id;
                    }
                }
            });
        };

        /** Add activity **/
        api.addActivity = function( _title, _activity ){
            var modal = $uibModal.open({
                templateUrl: '/scripts/modals/views/prospects/activity.html',
                size: 'lg',
                controller: 'addActivityProsModalCtrl',
                controllerAs: 'activity',
                resolve:{
                    activity:function() {
                        return _activity;
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
        .service( 'prospectModalsSrv', prospectModalsSrv );


})();
