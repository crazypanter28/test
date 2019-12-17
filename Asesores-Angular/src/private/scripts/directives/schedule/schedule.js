(function(){
    "use strict";

    function schedule(){

        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/scripts/directives/schedule/schedule.html'
        };

    }

    angular
        .module( 'actinver.directives' )
        .directive( 'schedule', schedule );
} )();