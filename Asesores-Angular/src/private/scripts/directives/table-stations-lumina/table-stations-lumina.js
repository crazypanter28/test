(function(){
    "use strict";

    function tableStations(){


        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/scripts/directives/table-stations-lumina/table-stations-lumina.html',
            scope: {
                contract: '@',
                ids: '=',
                selected: '=?',
                columnsExpand: '=?',
            },
            controller: 'tableSocketLuminaCtrl',
            controllerAs: 'socket',
            // link : link,
        };


    }


    angular.module( 'actinver.directives' )
    .directive( 'actTableStationsLumina', tableStations );


} )();
