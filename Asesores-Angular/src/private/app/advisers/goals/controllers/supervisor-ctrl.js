( function(){
	'use strict';

	function supervisorCtrl( $scope, goalsSupervisorSrv, CommonModalsSrv ){
		var vm = this;
		$scope.goals.datepicker_opts.initDate = moment().businessSubtract( 1 );

		// Get information from service
		function getReportInfo( date ){
			vm.search_form_sent = true;
			vm.report_empty = true;

            //$scope.goals.sadviser.employeeID
            goalsSupervisorSrv.getSupervisorInfo( $scope.goals.sadviser.employeeID, date )
            	.then( function( response ){

            		if( response.data.elements.length > 0 ){
            			vm.info = response.data;
		                vm.report_empty = false;
		                vm.filtered_report_empty = false;
	            	} else {
	            		vm.report_empty = true;
	            	}

	            }, function(){

	                CommonModalsSrv.error( 'Se Encontró Un Error Favor De Intentarlo Más Tarde, Comuníquese Con Su Help desk' );

	            } ).finally( function(){
					vm.search_form_sent = false;
	            } );
    	}

    	// Listen for changes in date
		$scope.$on( 'changeDate', function( ev, date ){
			getReportInfo( date );
		} );

	}

	angular
		.module( 'actinver.controllers' )
		.controller( 'supervisorCtrl', supervisorCtrl );

})();