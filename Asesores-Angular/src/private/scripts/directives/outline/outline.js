(function(){
    "use strict";

    function outline(){

        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/scripts/directives/outline/outline.html'
        };

    }

    angular
        .module( 'actinver.directives' )
        .directive( 'outline', outline );
} )();