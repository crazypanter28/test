( function(){
    "use strict";

    function modals( $uibModal ) {

        var api  = {};

        api.addActivity = function( title, it ){
            return $uibModal.open({
                templateUrl: '/scripts/modals/views/activity/add.html',
                controller: 'addActivityCtrl',
                controllerAs: 'activity',
                resolve: {
                    title: function () {
                        return title || 'Actividad';
                    },
                    item: function(){
                        return it;
                    }
                }
            });
        };


        api.notice = function( it ){

            return $uibModal.open({
                templateUrl: '/scripts/modals/views/activity/notice.html',
                controller: 'noticeActivityCtrl',
                controllerAs: 'activity',
                resolve: {
                    item: function () {
                        return it;
                    }
                }
            });
        };


        return api;
    }


    angular.module( 'actinver.services' )
        .service( 'modalActivity', modals );


})();
