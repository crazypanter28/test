(function(){
    'use strict';

    function accountStateResume(){

        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/scripts/directives/goals/accountState-resume.html',
            scope: {
                type: '@',
                obj: '=',
                datepicker: '=',
                search: '='
            },
            controller: 'accountStateResumeCtrl',
            controllerAs: 'resume'
        };
    }    

    angular
        .module( 'actinver.directives' )
        .directive( 'accountStateResume', accountStateResume );

} )();