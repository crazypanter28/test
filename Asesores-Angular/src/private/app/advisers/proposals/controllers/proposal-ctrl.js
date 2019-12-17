(function () {
	'use strict';

	function proposalCtrl($filter, proposalsProposalSrv, CommonModalsSrv, $sessionStorage) {
		var vm = this;

		function setup() {
			vm.form = {
				portfolio: []
			};
			proposalsProposalSrv.getIssuersInfo()
				.then(function (response) {
					vm.issuers = response.data;
				});
		}

		// Reset form
		vm.resetForm = function () {
			setup();
			vm.client_name = null;
			vm.adviser_ext = null;
			vm.adviser_mobile = null;
			vm.adviser_phone = null;
			vm.change_location = null;
		};

		// Validate form
		vm.validateForm = function (form) {
			var msg = false;

			if (!form.name.$valid) {
				msg = 'El nombre del cliente es obligatorio, favor de revisarlo.';
			} else if (!form.ext.$valid) {
				msg = 'El número de extension es obligatorio, favor de revisarlo.';
			} else {
				angular.forEach(vm.form.portfolio, function (item) {
					var countPortfolio = 0;
					var invest_left = item.value - item.totals;
					if (item.type === 'manual' && !msg) {
						if (Number(invest_left.toFixed(2)) < 0) {
							msg = 'El valor del portafolio '+countPortfolio+' es menor a la inversión.';
						} else if (Number(invest_left.toFixed(2)) !== 0) {
							msg = 'Te falta invertir (<strong>' + $filter('currency')(Number(invest_left.toFixed(2))) + '</strong>) para poder continuar.';
						}
					}
					countPortfolio++;
				});
			}

			if (msg) {
				CommonModalsSrv.error(msg);
			} else {
				vm.submitForm();
			}
		};

		// Submit form
		vm.submitForm = function () {

			var user = JSON.parse($sessionStorage.user);
			var valorPortafolio1 = 0;
			var valorPortafolio2 = 0;
			var comments = '';
			var comments2 = '';
			var tipoPortafolio1 = 0;
			var tipoPortafolio2 = 0;
			var clientType = 0;

			
			valorPortafolio1 = vm.form.portfolio[0].value;
			comments = vm.form.portfolio[0].comment;
			if (vm.form.portfolio[0].type === 'model') {
				tipoPortafolio1 = 2;
				clientType = 0;
			} else if (vm.form.portfolio[0].type === 'manual') {
				tipoPortafolio1 = 1;
				clientType = 1;
				if(vm.form.portfolio[0].client_type.description === 'Moral'){
					clientType = 2;
				}
			}
			
			if (vm.form.portfolio[1]) {
				valorPortafolio2 = vm.form.portfolio[1].value;
				comments2 = vm.form.portfolio[1].comment;
				if (vm.form.portfolio[1].type === 'model') { //validar esta paret por ue creo esta entrando un 0 en tipo de portafolio al ingresar dos vecces manual
					tipoPortafolio2 = 2;
				} else if (vm.form.portfolio[1].type === 'manual') {
					tipoPortafolio2 = 1;
				}
			}

			var productos = [];
			if (vm.form.products) {
				angular.forEach(vm.form.products, function (value) {
					if (value) {
						angular.forEach(value.subproducts, function (subproducts, id) {
							productos.push({ "product": id, "value": 1 });
						});
					}
				});
			}

			var dataSent;
			var dataSentPortafolio=[];
			if (vm.form.portfolio[0].type === 'model') {
				dataSent = doJsonData(vm.form.portfolio[0] ? vm.form.portfolio[0].strategyItems : [], vm.form.portfolio[0].value);
			} else if (vm.form.portfolio[0].type === 'manual') {
				dataSent = doJson(vm.form.portfolio[0] ? vm.form.portfolio[0].invest : []);				
			}

			if (vm.form.portfolio[1] && vm.form.portfolio[1].type === 'model') {
				dataSentPortafolio = doJsonData(vm.form.portfolio[1] ? vm.form.portfolio[1].strategyItems : [], vm.form.portfolio[1].value);
			} else if (vm.form.portfolio[1] && vm.form.portfolio[1].type === 'manual') {
				dataSentPortafolio = doJson(vm.form.portfolio[1] ? vm.form.portfolio[1].invest : []);
			}

			var model = {
				language: 			'SPA',
				data: 				dataSent.length === 0 ? 0 : window.btoa(unescape(encodeURIComponent(JSON.stringify(dataSent)))),
				nameProposal:	 	vm.form.client_name,
				clientType: 		clientType,
				name: 				user.name,
				mail: 				user.mail,
				ext: 				vm.form.adviser_ext,
				idEmployee: 		user.employeeID,
				portfolioType1: 	tipoPortafolio1,
				portfolioType2: 	tipoPortafolio2,
				mobile: 			vm.form.adviser_mobile?vm.form.adviser_mobile:0,
				phone: 				vm.form.adviser_phone?vm.form.adviser_phone:0,
				valorPortafolio: 	valorPortafolio1,
				clientTypeFlag: 	0,
				comments: 			comments,
				portfolio: 			(dataSentPortafolio && dataSentPortafolio.length === 0) ? 0 : window.btoa(unescape(encodeURIComponent(JSON.stringify(dataSentPortafolio)))),
				valorPortafolio2:	valorPortafolio2,
				comments2: 			comments2,
				products: 			productos.length === 0 ? 0 : window.btoa(unescape(encodeURIComponent(JSON.stringify(productos)))),
				createEnvironment: true,
				createForecast: true
			};

			proposalsProposalSrv.generaReportePropuesta(model)
				.then(function (response) {
					try {
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
					} catch(error) {
						CommonModalsSrv.error(error);
					}
				}).catch(function (error) {
					CommonModalsSrv.error("Estatus: "+error.status +" "+ error.statusText);
				});
		};

		function Uint8ToString(u8) {
			var CHUNK_SZ = 0x8000, c = [];
			for (var i = 0; i < u8.length; i += CHUNK_SZ) {
				c.push(String.fromCharCode.apply(null, u8.subarray(i, i + CHUNK_SZ)));
			}
			return c.join("");
		}

		function doJson(_array) {
			var json = [];
			angular.forEach(_array, function (value, key) {
				angular.forEach(value, function (value2) {
					if (key === 'invest') {
						json.push({ 'producto': value2.issuer, 'monto': value2.amount, 'porcentajeInversion': value2.percentage * 100, 'descripcion': value2.description ? value2.description : '' , 'instrumento': 'SOCIEDADES DE INVERSION' });
					} else if (key === 'actions') {
						json.push({ 'producto': value2.issuer, 'monto': value2.amount, 'porcentajeInversion': value2.percentage * 100, 'instrumento': 'ACCIONES' });
					} else if (key === 'money') {
						json.push({ 'producto': value2.issuer, 'monto': value2.amount, 'porcentajeInversion': value2.percentage * 100, 'instrumento': 'MERCADO DE DINERO' });
					} else if (key === 'reportos') {
						json.push({ 'producto': value2.issuer, 'monto': value2.amount, 'porcentajeInversion': value2.percentage * 100, 'instrumento': 'REPORTOS' });
					} else if (key === 'derivatives') {
						json.push({ 'producto': value2.issuer, 'monto': value2.amount, 'porcentajeInversion': value2.percentage * 100, 'descripcion': value2.description ? value2.description : '' , 'instrumento': 'DERIVADOS' });
					}
				});
			});
			return json;
		}

		function getDescripcion(issuer) {
			for (var pos = 0; pos < vm.issuers.length; pos++) {
				if (vm.issuers[pos].name.trim() === issuer.trim()) {
					return vm.issuers[pos].description;
				}
			}

			return '';
		}

		function doJsonData(_array, montoTotal) {
			var json = [];
			var jsonSubGroup = {};
			var jsonBase = {};

			angular.forEach(_array, function (value, key) {
				if (key === 'Fondo de Fondos') {
					angular.forEach(value, function (value2) {
						angular.forEach(value2, function (value3) {
							jsonBase = {
								name: key,
								subGroups: []
							};
							jsonSubGroup = {
								name: value3.subGroup.name,
								instruments: []
							};
							angular.forEach(value3.productLimits, function (instrument) {
								var jsonInstrument = {
									percentage: instrument.percentage,
									issuer: instrument.product.issuer.name,
									amount: montoTotal * (instrument.percentage) / 100,
									description: getDescripcion(instrument.product.issuer.name)
								};
								jsonSubGroup.instruments.push(jsonInstrument);
							});
							jsonBase.subGroups.push(jsonSubGroup);
							json.push(jsonBase);
						});
					});

				} else if (key === 'Renta Variable') {
					angular.forEach(value, function (value2) {
						angular.forEach(value2, function (value3) {
							jsonBase = {
								name: key,
								subGroups: []
							};
							jsonSubGroup = {
								name: value3.subGroup.name,
								instruments: []
							};
							angular.forEach(value3.productLimits, function (instrument) {
								var jsonInstrument = {
									percentage: instrument.percentage,
									issuer: instrument.product.issuer.name,
									amount: montoTotal * (instrument.percentage) / 100,
									description: getDescripcion(instrument.product.issuer.name)
								};
								jsonSubGroup.instruments.push(jsonInstrument);
							});
							jsonBase.subGroups.push(jsonSubGroup);
							json.push(jsonBase);
						});
					});

				} else if (key === 'Fibras') {
					angular.forEach(value, function (value2) {
						angular.forEach(value2, function (value3) {
							jsonBase = {
								name: key,
								subGroups: []
							};
							jsonSubGroup = {
								name: value3.subGroup.name,
								instruments: []
							};
							angular.forEach(value3.productLimits, function (instrument) {
								var jsonInstrument = {
									percentage: instrument.percentage,
									issuer: instrument.product.issuer.name,
									amount: montoTotal * (instrument.percentage) / 100,
									description: getDescripcion(instrument.product.issuer.name)
								};
								jsonSubGroup.instruments.push(jsonInstrument);
							});
							jsonBase.subGroups.push(jsonSubGroup);
							json.push(jsonBase);
						});
					});

				} else if (key === 'Riesgo Cambiario') {
					angular.forEach(value, function (value2) {
						angular.forEach(value2, function (value3) {
							jsonBase = {
								name: key,
								subGroups: []
							};
							jsonSubGroup = {
								name: value3.subGroup.name,
								instruments: []
							};
							angular.forEach(value3.productLimits, function (instrument) {
								var jsonInstrument = {
									percentage: instrument.percentage,
									issuer: instrument.product.issuer.name,
									amount: montoTotal * (instrument.percentage) / 100,
									description: getDescripcion(instrument.product.issuer.name)
								};
								jsonSubGroup.instruments.push(jsonInstrument);
							});
							jsonBase.subGroups.push(jsonSubGroup);
							json.push(jsonBase);
						});
					});

				} else if (key === 'Deuda') {
					angular.forEach(value, function (value2) {
						angular.forEach(value2, function (value3) {
							jsonBase = {
								name: key,
								subGroups: []
							};
							jsonSubGroup = {
								name: value3.subGroup.name,
								instruments: []
							};
							angular.forEach(value3.productLimits, function (instrument) {
								var jsonInstrument = {
									percentage: instrument.percentage,
									issuer: instrument.product.issuer.name,
									amount: montoTotal * (instrument.percentage) / 100,
									description: getDescripcion(instrument.product.issuer.name)
								};
								jsonSubGroup.instruments.push(jsonInstrument);
							});
							jsonBase.subGroups.push(jsonSubGroup);
							json.push(jsonBase);
						});
					});
				}
			});

			return json;
		}
		
		// Init application
		setup();
	}

	angular
		.module('actinver.controllers')
		.controller('proposalCtrl', proposalCtrl);

})();