( function(){
    'use strict';

    function goalsModalSrv( $uibModal ) {

        var api  = {};

        api.showCenterDetail = function( type, employee, center, date ){
            return $uibModal.open({
                templateUrl: '/scripts/modals/views/goals/center-detail.html',
                controller: 'centerDetailModalCtrl',
                controllerAs: 'center',
                resolve: {
                    centerInfo: function(){
                        return {
                            type: type,
                            employee: employee,
                            center: center,
                            date: date
                        };
                    }
                }
            }).result.finally( angular.noop ).then( angular.noop, angular.noop );
        };

        api.showAdviserDetail = function( adviserID, name, date ){
            return $uibModal.open({
                templateUrl: '/scripts/modals/views/goals/adviser-detail.html',
                controller: 'adviserDetailModalCtrl',
                controllerAs: 'adviser',
                resolve: {
                    adviserInfo: function(){
                        return {
                            adviserID: adviserID,
                            name: name,
                            date: date
                        };
                    }
                }
            }).result.finally( angular.noop ).then( angular.noop, angular.noop );
        };

        return api;
    }

    angular
        .module( 'actinver.services' )
        .service( 'goalsModalSrv', goalsModalSrv );

})();