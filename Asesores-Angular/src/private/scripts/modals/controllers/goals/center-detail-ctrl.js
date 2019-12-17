( function(){
    'use strict';

    function centerDetailModalCtrl( centerInfo, $q, $uibModalInstance, goalsSupervisorSrv, goalsCustomSrv, CommonModalsSrv ){
        var vm = this;

        // Get adviser info
        vm.getCenterInfo = function(){
            var services = [];
            vm.get_info = true;
            vm.report_info = false;

            // Check modal type
            switch( centerInfo.type ) {

                case 'supervisor':
                    services.push(
                        goalsSupervisorSrv.getCenterInfo( centerInfo.employee, centerInfo.center, centerInfo.date ),
                        goalsSupervisorSrv.getCenterProducts( centerInfo.employee, centerInfo.center, centerInfo.date )
                    );
                    break;

                case 'custom':
                    services.push(
                        goalsCustomSrv.getCustomCenterInfoRpt( centerInfo.center, centerInfo.date ),
                        goalsCustomSrv.getCustomCenterProductsRpt( centerInfo.center, centerInfo.date )
                    );
                    break;

            }

            return $q.all( services ).then( function( data ){

                // Set information by topic
                vm.report_info = {};
                vm.report_empty = true;
                angular.forEach( data, function( item ){
                    if( vm.report_empty && item.data.length !== 0 ) vm.report_empty = false;
                    vm.report_info[ item.topic ] = item.data.elements || item.data;
                } );

            }, function(){

                CommonModalsSrv.error( 'Se Encontró Un Error Favor De Intentarlo Más Tarde, Comuníquese Con Su Help desk' );
                vm.done();

            } ).finally( function(){
                vm.get_info = false;
            } );
        };

        // Close modal
        vm.close = function(){
            $uibModalInstance.dismiss();
        };

        // Another way to close modal
        vm.done = function(){
            $uibModalInstance.close();
        };

        // Init setup
        vm.getCenterInfo();
    }

    angular
        .module( 'actinver.controllers' )
        .controller( 'centerDetailModalCtrl', centerDetailModalCtrl );

} )();