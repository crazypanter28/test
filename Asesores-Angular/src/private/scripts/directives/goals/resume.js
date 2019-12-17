(function(){
    'use strict';

    function goalsResume(){

        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/scripts/directives/goals/resume.html',
            scope: {
                type: '@',
                obj: '=',
                datepicker: '=',
                search: '='
            },
            controller: 'goalsResumeCtrl',
            controllerAs: 'resume'
        };
    }

    angular
        .module( 'actinver.directives' )
        .directive( 'goalsResume', goalsResume );

} )();