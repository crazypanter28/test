(function(){
    "use strict";

    function tableStations(){


        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/scripts/directives/table-stations-sockets/table-socket.html',
            scope: {
                contract: '@',
                ids: '=',
                selected: '=?',
                columnsExpand: '=?',
            },
            controller: 'tableSocketCtrl',
            controllerAs: 'socket',
            // link : link,
        };


    }


    angular.module( 'actinver.directives' )
    .directive( 'actTableStationsSocket', tableStations );


} )();
