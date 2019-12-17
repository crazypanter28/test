(function(){
    'use strict';

    function portfolioDetails(){

        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/scripts/directives/portfolio-details/details.html',
            scope: {
                sclient: '=',
                topics: '=',
                contractInfo: '=',
                showTotals: '@'
            },
            controller: 'portfolioDetailsCtrl',
            controllerAs: 'pdetail'
        };

    }

    angular
        .module( 'actinver.directives' )
        .directive( 'portfolioDetails', portfolioDetails );

} )();