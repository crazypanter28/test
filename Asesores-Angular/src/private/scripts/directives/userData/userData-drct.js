(function(){
    "use strict";

    function userData(){


        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/scripts/directives/userData/userData.html',
            link : function() {

            }, 
            controller : "userDataCtrl",
            controllerAs : "udc"
        };


    }

    angular.module( 'actinver.directives' )
    .directive( 'userData', userData );


} )();
