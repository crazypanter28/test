( function(){
	'use strict';

	function reportCtrl( $scope, $q, userConfig, goalsReportsSrv, CommonModalsSrv ){
		var vm = this;
        $scope.goals.datepicker_opts.initDate = moment().businessSubtract( 1 );

		// Update report
		vm.updateReport = function( date ){
			getReportInfo( moment( date ).format( 'DD/MM/YY' ) );
		};

		function setup(){

	        // Init
	        vm.updateReport( $scope.goals.datepicker_opts.initDate );
		}
		
    	// Get information
    	function getReportInfo( date ){
			vm.search_form_sent = true;
			vm.report_info = false;
			
			return $q.all( [
				goalsReportsSrv.getGoalsPositionsRpt( $scope.goals.sadviser.employeeID, date ),
				goalsReportsSrv.getSumGoalsPositionsRpt( $scope.goals.sadviser.employeeID, date ),
				goalsReportsSrv.getGoalsContractsRpt( $scope.goals.sadviser.employeeID, date )
			] ).then( function( data ){

				// Set information by topic
				vm.report_info = {};
				vm.report_empty = true;
				angular.forEach( data, function( item ){
					if( vm.report_empty && item.data.length !== 0 ) vm.report_empty = false;
					vm.report_info[ item.topic ] = item.data;
				} );

			}, function(){

				CommonModalsSrv.error( 'Se Encontró Un Error Favor De Intentarlo Más Tarde, Comuníquese Con Su Help desk' );

			} ).finally( function(){
				vm.search_form_sent = false;
			} );     
    	}

    	// Init
    	setup();
	}

	angular
		.module( 'actinver.controllers' )
		.controller( 'reportCtrl', reportCtrl );

})();