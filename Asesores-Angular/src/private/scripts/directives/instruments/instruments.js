(function(){
    'use strict';

    function instruments(){

        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/scripts/directives/instruments/instruments.html',
            scope: {
                idx: '=',
                type: '@',
                title: '@',
                portfolioValue: '=',
                productsList: '=',
                invest: '=',
                totals: '=',
                issuers: '=?',
                isOpen:"=?"
            },
            controller: 'proposalsInstrumentsCtrl',
            controllerAs: 'ins'
        };
    }

    angular
        .module( 'actinver.directives' )
        .directive( 'instruments', instruments );

} )();
