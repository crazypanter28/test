(function(){
    'use strict';

    function portfolioDetailsBank(){

        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/scripts/directives/portfolio-details/details-bank.html',
            scope: {
                title: '@',
                infoResume: '=',
            },
            controller: 'portfolioDetailsBankCtrl',
            controllerAs: 'details'
        };

    }

    angular
        .module( 'actinver.directives' )
        .directive( 'portfolioDetailsBank', portfolioDetailsBank );

} )();