(function(){
    "use strict";

    function report(){


        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/scripts/directives/reports/reports.html',
            link : function() {

            }
        };


    }

    angular.module( 'actinver.directives' )
    .directive( 'report', report );


} )();
