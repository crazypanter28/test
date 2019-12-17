( function(){
	'use strict';

	function accountStateLoginCtrl( $scope, $uibModalInstance, $sessionStorage,$rootScope , accountStateSrv, CommonModalsSrv){
		var vm = this;
		var user = JSON.parse($sessionStorage.user);
		
    
    vm.sendType =  function(object){
       var isReport = user.roles.includes('RRHH');
	if(isReport){

		accountStateSrv.getAccountStateRh($rootScope.month,$rootScope.year, $rootScope.employeeId, object.user, object.password, isReport)
		.then(function (result) {
					 reset();
					if (result.data.outCommonHeader.result.result !== 1 ) {
						CommonModalsSrv.error(result.data.outCommonHeader.result.messages[0].responseMessage);
						
					}else{
						$rootScope.detailAccountState = result.data;
						$rootScope.detail = true;
					 }
				}
		).catch(function(res) {
			if (!(res === 'cancel' || res === 'escape key press' || res === 'backdrop click' || typeof res === 'undefined')) {
				throw res;
			}
		});
		
	}else{
		accountStateSrv.getAccountState($rootScope.month,$rootScope.year, $rootScope.employeeId, object.user, object.password, isReport)
		.then(function (result) {
					 reset();
					if (result.data.outCommonHeader.result.result !== 1 ) {
						CommonModalsSrv.error(result.data.outCommonHeader.result.messages[0].responseMessage);
						
					}else{
						$rootScope.detailAccountState = result.data;
						$rootScope.detail = true;
					 }
				}
		).catch(function(res) {
			if (!(res === 'cancel' || res === 'escape key press' || res === 'backdrop click' || typeof res === 'undefined')) {
				throw res;
			}
		});
	}
		
    };

    vm.close = function(){
        $uibModalInstance.dismiss();
        console.log('cerrar');
	};
	
	function reset(){
		$uibModalInstance.dismiss();
	}

	}

	angular
		.module( 'actinver.controllers' )
		.controller( 'accountStateLoginCtrl', accountStateLoginCtrl );

})();