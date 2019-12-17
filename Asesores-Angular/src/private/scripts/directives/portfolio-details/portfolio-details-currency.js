(function(){
    'use strict';

    function portfolioDetailsCurrency(){

        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/scripts/directives/portfolio-details/details-currency.html',
            scope: {
                title: '@',
                infoResume: '=',
            },
            controller: 'portfolioDetailsCurrencyCtrl',
            controllerAs: 'details'
        };

    }

    angular
        .module( 'actinver.directives' )
        .directive( 'portfolioDetailsCurrency', portfolioDetailsCurrency );

} )();