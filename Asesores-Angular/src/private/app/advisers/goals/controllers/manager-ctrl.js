( function(){
	'use strict';

	function managerCtrl( $scope, URLS ,$http){
		var vm = this;
		$scope.goals.datepicker_opts.initDate = new Date();
		var frame = document.getElementById("frame");
		
		// Get information from service
		vm.getReportInfo = function( date ){

			
			var fecha=moment(date).format('DDMMYYYY');
			var parametro="xxx";
			var employeeID=$scope.goals.sadviser.employeeID;
			//employeeID=53883;
			var parametros=parametro+'/'+parametro+'/'+employeeID+'/'+fecha+'/pdf';
			//var parametros='6e676172636961/2a6e6f7669656d62726532303137/53883/30102017/pdf';
			//frame.src=URLS.getSharedReport+parametros;

			vm.search_form_sent = false;
					
			$http({
				method: 'GET',
                url:URLS.getSharedReport+parametros,
                params: {
                    language: 'SPA'
				},
				responseType: 'arraybuffer'
			}).then(function (response) {
				var file = new Blob([response.data], {type: 'application/pdf'});
				var fileURL = URL.createObjectURL(file);
				frame.src = fileURL;
				//vm.search_form_sent = true;


			}).catch(function(error){
				console.error(error);
			}).finally(function(){
				vm.search_form_sent = false;
			});

		};


	}

	angular
		.module( 'actinver.controllers' )
		.controller( 'managerCtrl', managerCtrl );

})();