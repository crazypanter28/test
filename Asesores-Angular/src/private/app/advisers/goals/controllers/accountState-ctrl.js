( function(){
	'use strict';

	function accountStateCtrl( $scope ){
		var vm = this;
		getReportInfo();

		function getReportInfo(  ){
		}
		
		vm.getInfoIntegration = function(){
		}


	}

	angular
		.module( 'actinver.controllers' )
		.controller( 'accountStateCtrl', accountStateCtrl );

})();