(function(){
    'use strict';

    function tableList(NgTableParams, binnacleModalSrv, userConfig){

        function link(scope){
            scope.tableInfo = new NgTableParams(scope.tableSet.initialParams, scope.tableSet.initialSettings);
            scope.tableType = scope.type;
            scope.emptyTable = scope.empty;
            scope.resourceCrashed = scope.crashed;

            // Hide preloader
            scope.$watch('tableInfo.data', function(){
                if(scope.tableInfo.total() > 0 || (scope.tableInfo.data.loading === false)){
                    scope.tableSet.loading = false;
                }
            });

            scope.outlineClient = function( record ){
                binnacleModalSrv.outlineClient( userConfig.user.employeeID, record.numSolContrato, record.tipoOrigenTO.id ,record.tipoServicioTO.value.idTipoServicio,record.cliente.value.tipoPersonaTO.id,scope.type );
            };
        }

        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/scripts/directives/table-list/table-list.html',
            link: link,
            scope: {
                crashed: "@",
                empty: '@',
                tableSet: '=',
                type: '@',
                origin: '@?'
            }
        };

    }

    angular
        .module( 'actinver.directives' )
        .directive( 'tableList', tableList );

} )();