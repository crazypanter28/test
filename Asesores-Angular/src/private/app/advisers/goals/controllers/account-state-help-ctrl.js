( function(){
	'use strict';

	function accountStateHelpCtrl( $scope, $uibModalInstance, $sessionStorage,$rootScope , accountStateSrv, CommonModalsSrv){
		var vm = this;
	

    vm.close = function(){
        $uibModalInstance.dismiss();
        console.log('cerrar');
	};
	
	

	}

	angular
		.module( 'actinver.controllers' )
		.controller( 'accountStateHelpCtrl', accountStateHelpCtrl );

})();