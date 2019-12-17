( function(){
	'use strict';

	function tracingCtrl( proposalsTracingSrv, CommonModalsSrv ){
		var vm = this;

		// Reset form
		vm.resetForm = function(){
			vm.form = {};
			vm.scontract = false;
		};

		// Validate form
		vm.validateForm = function( form ){
			var msg = false;
			
			if( typeof vm.form.tir === 'undefined' && vm.form.scontract.origen==='CB' ){
				msg = 'Los datos del periodo para calculo de TIR-1 son incorrectos o incompletos, favor de revisarlos';
			}else if( vm.form.tir && vm.form.other_calculus && typeof vm.form.tir2 === 'undefined' && vm.form.scontract.origen==='CB' ){
				msg = 'Los datos del periodo para calculo de TIR-2 son incorrectos o incompletos, favor de revisarlos';
			}else if(vm.form.scontract.origen==='CB' && vm.form.tir && (vm.form.tir.startDate._d.getDate() === vm.form.tir.endDate._d.getDate()) && (vm.form.tir.startDate._d.getMonth() === vm.form.tir.endDate._d.getMonth()) && (vm.form.tir.startDate._d.getFullYear() === vm.form.tir.endDate._d.getFullYear()) ){
                msg = 'Los datos del periodo para calculo de TIR-1 no pueden ser iguales, favor de revisarlos';
            }else if (vm.form.scontract.origen==='CB' && vm.form.other_calculus && vm.form.tir2 && (vm.form.tir2.startDate._d.getDate() === vm.form.tir2.endDate._d.getDate()) && (vm.form.tir2.startDate._d.getMonth() === vm.form.tir2.endDate._d.getMonth()) && (vm.form.tir2.startDate._d.getFullYear() === vm.form.tir2.endDate._d.getFullYear()) ){
                msg = 'Los datos del periodo para calculo de TIR-2 no pueden ser iguales, favor de revisarlos';
            }else if( !form.ext.$valid ){
				msg = 'El número de extension es obligatorio, favor de revisarlo.';
			}
			
			if( msg ){
				CommonModalsSrv.error( msg );
			} else {
				vm.submitForm();
			}
		};

		// Submit form
		vm.submitForm = function(){
            proposalsTracingSrv.doTracing( vm.form ).then( function(response){
				try {
					if (/access/i.test(navigator.userAgent)) {
						var b64encoded = btoa(Uint8ToString(new Uint8Array(response.data)));
						var popupWin = window.open('Propuesta', '_blank', 'width=1000px,height=905px,resizable=0');
						popupWin.document.open();
						popupWin.document.write('<html><head></head><body><iframe width="100%" height="100%" src="data:application/pdf;base64,' + b64encoded + '"></iframe></body></html>');
						popupWin.document.close();
					} else {
						var file = new Blob([response.data], {type: 'application/pdf'});
						var fileURL = URL.createObjectURL(file);
						window.open(fileURL,'_blank', 'Reporte');
					}
				} catch(error) {
					CommonModalsSrv.error(error);
				}
            }, function() {
                CommonModalsSrv.error( 'Error al generar la propuesta<br/>Intente más tarde.' );
            });
		};

		function Uint8ToString(u8) {
			var CHUNK_SZ = 0x8000, c = [];
			for (var i = 0; i < u8.length; i += CHUNK_SZ) {
				c.push(String.fromCharCode.apply(null, u8.subarray(i, i + CHUNK_SZ)));
			}
			return c.join("");
		}

	}

	angular
		.module( 'actinver.controllers' )
		.controller( 'tracingCtrl', tracingCtrl );

})();