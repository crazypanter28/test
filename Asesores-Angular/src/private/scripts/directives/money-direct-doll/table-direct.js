(function(){
    'use strict';

    function tableDirect(){

        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/scripts/directives/money-direct-doll/table-direct.html',
            scope: {
                contract: '@',
                instrument: '=',
                tab: '=',
            },
            controller: 'moneyDirectDollCtrl',
            controllerAs: 'doll',

        };

    }

    angular
        .module( 'actinver.directives' )
        .directive( 'actTableDirect', tableDirect );

} )();