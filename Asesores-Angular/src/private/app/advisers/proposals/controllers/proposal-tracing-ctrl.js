( function(){
	'use strict';

	function propTracingCtrl( $scope, $filter, proposalsProposalSrv, proposalsPropTracingSrv, CommonModalsSrv ){
		var vm = this;

		function setup(){
			vm.tracing = {
				form: {}
			};
			
			vm.brief = {
	        	form: {
					portfolio: []
				}
			};

			vm.products = [];
			vm.adviser = {};

			proposalsProposalSrv.getIssuersInfo()
			.then( function( response ){
				vm.issuers = response.data;
			} );
		}

		// Reset form
		vm.resetForm = function(){
			setup();
		};

		// Validate form
		vm.validateForm = function( form ){
			var msg = false;
			
			if( typeof vm.tracing.form.tir === 'undefined' && vm.tracing.form.scontract.origen==='CB' ){
				msg = 'Los datos del periodo para calculo de TIR-1 son incorrectos o incompletos, favor de revisarlos';
			}else if( vm.tracing.form.tir && vm.tracing.form.other_calculus && typeof vm.tracing.form.tir2 === 'undefined' && vm.tracing.form.scontract.origen==='CB' ){
				msg = 'Los datos del periodo para calculo de TIR-2 son incorrectos o incompletos, favor de revisarlos';
			}else if(vm.tracing.form.scontract.origen==='CB' && vm.tracing.form.tir && (vm.tracing.form.tir.startDate._d.getDate() === vm.tracing.form.tir.endDate._d.getDate()) && (vm.tracing.form.tir.startDate._d.getMonth() === vm.tracing.form.tir.endDate._d.getMonth()) && (vm.tracing.form.tir.startDate._d.getFullYear() === vm.tracing.form.tir.endDate._d.getFullYear()) ){
                msg = 'Los datos del periodo para calculo de TIR-1 no pueden ser iguales, favor de revisarlos';
            }else if( !form.ext.$valid ){
				 msg = 'El número de extension es obligatorio, favor de revisarlo.';
			} else {
				angular.forEach( vm.brief.form.portfolio, function( item ){
					var invest_left = item.value - item.totals;

					if( item.type === 'manual' && !msg ){
						if( Number(invest_left.toFixed(2)) < 0 ){
							msg = 'El valor del portafolio es menor a la inversión.';
						}else if( Number(invest_left.toFixed(2)) !== 0 ) {
							msg = 'Te falta invertir (<strong>' + $filter( 'currency' )( Number(invest_left.toFixed(2)) ) + '</strong>) para poder continuar.';
						}
					}
				} );
			}

			if( msg ){
				CommonModalsSrv.error( msg );
			} else {
				vm.submitForm();
			}
		};

		// Submit form
		vm.submitForm = function () {
			var form = {
				tracing: vm.tracing,
				brief: vm.brief,
				products: vm.products,
				adviser: vm.adviser,
				issuers: vm.issuers
			};
			
			proposalsPropTracingSrv.doProposalTracing(form)
				.then(function (response) {
					if (/access/i.test(navigator.userAgent)) {
						var b64encoded = btoa(Uint8ToString(new Uint8Array(response.data)));
						var popupWin = window.open('Propuesta', '_blank', 'width=1000px,height=905px,resizable=0');
						popupWin.document.open();
						popupWin.document.write('<html><head></head><body><iframe width="100%" height="100%" src="data:application/pdf;base64,' + b64encoded + '"></iframe></body></html>');
						popupWin.document.close();
					} else {
						var file = new Blob([response.data], { type: 'application/pdf' });
						var fileURL = URL.createObjectURL(file);
						window.open(fileURL, '_blank', 'Reporte');
					}
				}).catch(function (error) {
					console.error("Error:", error);
				});
		};

		function Uint8ToString(u8) {
			var CHUNK_SZ = 0x8000, c = [];
			for (var i = 0; i < u8.length; i += CHUNK_SZ) {
				c.push(String.fromCharCode.apply(null, u8.subarray(i, i + CHUNK_SZ)));
			}
			return c.join("");
		}

		// Init application
		setup();

	}

	angular
		.module( 'actinver.controllers' )
		.controller( 'propTracingCtrl', propTracingCtrl );

})();