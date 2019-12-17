( function(){
    'use strict';

    function adviserDetailModalCtrl( adviserInfo, $q, $uibModalInstance, goalsReportsSrv, CommonModalsSrv ){
        var vm = this;

        // Get adviser info
        vm.getAdviserInfo = function(){
            vm.get_info = true;
            vm.report_info = false;

            // centerInfo.employee
            return $q.all( [
                goalsReportsSrv.getGoalsPositionsRpt( adviserInfo.adviserID, adviserInfo.date ),
                goalsReportsSrv.getSumGoalsPositionsRpt( adviserInfo.adviserID, adviserInfo.date ),
                goalsReportsSrv.getGoalsContractsRpt( adviserInfo.adviserID, adviserInfo.date )
            ] ).then( function( data ){

                // Set information by topic
                vm.report_info = {};
                vm.report_empty = true;
                angular.forEach( data, function( item ){
                    if( vm.report_empty && item.data.length !== 0 ) vm.report_empty = false;
                    vm.report_info[ item.topic ] = item.data;
                } );
                vm.personal_data = adviserInfo;

            }, function(){

                CommonModalsSrv.error( 'Se Encontró Un Error Favor De Intentarlo Más Tarde, Comuníquese Con Su Help desk' );

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
        vm.getAdviserInfo();
    }

    angular
        .module( 'actinver.controllers' )
        .controller( 'adviserDetailModalCtrl', adviserDetailModalCtrl );

} )();