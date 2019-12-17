(function () {
    'use strict';
    angular
        .module('actinver.controllers')
        .controller('insuranceCarsCtrl', insuranceCarsCtrl);

    function insuranceCarsCtrl($state, $stateParams, $scope, $rootScope, $window, $sessionStorage, CommonModalsSrv, insuranceCarSrv) {
        var vm = this;
        var scrSize = $window.matchMedia("(max-width: 767px)");
        scrSize.onchange = function (ev) {
            vm.txtClass = ev.target.matches ? 'text-left' : 'text-right';
        };
        
        if (!$stateParams.model) {
            $state.go('insurance.main');
            return '';
        }

        $scope.validatePerson = false;
        $scope.nombreCompleto = '';
        $scope.emailUser = '';
        $scope.ListEntidades = [];
        $scope.ListMarks = [];
        $scope.ListModels = [];
        $scope.ListYears = [];
        $scope.ListPoblaciones = [];
        $scope.ListBanks = [];
        vm.yearExpirationList = [];
        vm.monthExpirationList = [];
        vm.cvvLen = 3;
        vm.accLen = 16;
        vm.txtClass = scrSize.matches ? 'text-left' : 'text-right';
        vm.validatePoup = false;
        vm.client = '';
        vm.person = {};
        vm.contract = '';
        vm.personType = '1';
        vm.contractUser = 0;
        vm.reinicia = reinicia;
        vm.cotizarNoCliente = cotizarNoCliente;
        vm.soloNumero = soloNumero;
        vm.numberSecuential = numberSecuential;
        vm.charrepeatText = charrepeatText;
        vm.soloTextAndNum = soloTextAndNum;
        vm.selectTypeCard = selectTypeCard;
        vm.soloText = soloText;
        vm.forceKeyPressUppercase = forceKeyPressUppercase;
        vm.pagina1 = pagina1;
        vm.pagina2 = pagina2;
        vm.valCotizar = valCotizar;
        vm.cotizar = cotizar;
        vm.cotizarDos = cotizarDos;
        vm.cotizarDosB = cotizarDosB;
        vm.cotizarTres = cotizarTres;
        vm.cotizarTresB = cotizarTresB;
        vm.cotizarCuatro = cotizarCuatro;
        vm.cotizarCinco = cotizarCinco;
        vm.emisionPoliza = emisionPoliza;
        vm.imprimirPoliza = imprimirPoliza;
        vm.imprimirAviso = imprimirAviso;
        vm.imprimirCondiciones = imprimirCondiciones;
        vm.datosCliente = [];
        vm.fiscalIDNumber = "";
        vm.disabledRFC = false;
        vm.bnd = false;
        vm.mostrarDatos = false;
        vm.nombreCliente = "";
        vm.nombres = "";
        vm.apePaterno = "";
        vm.apeMaterno = "";
        vm.sexo = "1";
        vm.numeroCliente = "";
        vm.emailUser = "";
        vm.tipoVehiculo = "";
        vm.marcaVehiculo = "";
        vm.modeloVehiculo = "";
        vm.anioVehiculo = "";
        vm.estado = "";
        vm.poblacion = "";
        vm.codigoPostal = "";
        vm.uso = "";
        vm.intUser = "";
        vm.autoSustituto = false;
        vm.garantiaSobreRuedas = false;
        vm.catastrofica = false;
        vm.charrepeat = charrepeat;
        vm.typeCobertura = "";
        vm.formaPago = "";
        vm.cmd = {};
        vm.formaPagoUser = "";
        vm.activaBoton = false;
        vm.poliza = "";
        vm.placasVehiculo = '';
        vm.fechaNacimiento = "";
        vm.birthDay = "";
        vm.phoneUser = "";
        vm.mobileUser = "";
        vm.PrimaTotal = 0;
        vm.PrimaTotalRecibo = 0;
        vm.Recibossubcuentes = 0;
        vm.PrimaTotalReciboSubcuentes = 0;
        vm.InstitucionText = "";
        vm.NumeroTarjeta = "";
        vm.errorMessagePerMoral = "Por el momento no se puede cotizar a personas Morales";
        vm.errorMessageAsociado = "El cliente solicitado no está asociado al Asesor";
        vm.mostrarFactura = false;
        vm.mostrarFacturaDos = false;
        vm.validaFechaFactura = validaFechaFactura;
        vm.validaFormaCotizacion = validaFormaCotizacion;
        vm.validaFormaFactura = false;
        vm.fechaFactura = "";
        vm.numeroFactura = "";
        vm.importeFactura = "";
        vm.buscar = true;
        vm.tipoPersonalidad = false;
        vm.seleccionaPersonalidad = seleccionaPersonalidad;

        pagina1();

        function forceKeyPressUppercase(e) {
            var charInput = e.keyCode;
            if ((charInput >= 97) && (charInput <= 122)) { // lowercase
                if (!e.ctrlKey && !e.metaKey && !e.altKey) { // no modifier key
                    var newChar = charInput - 32;
                    var start = e.target.selectionStart;
                    var end = e.target.selectionEnd;
                    e.target.value = e.target.value.substring(0, start) + String.fromCharCode(newChar) + e.target.value.substring(end);
                    e.target.setSelectionRange(start + 1, start + 1);
                    e.preventDefault();
                }
            }
        }

        function imprimirPoliza() {
            window.open(vm.urlPoliza, '_blank', 'width=' + screen.width + 'px,height=' + screen.height + 'px,resizable=0');
        }

        function imprimirAviso() {
            window.open('img/pdfs/aviso-seguro.pdf', '_blank', 'width=' + screen.width + 'px,height=' + screen.height + 'px,resizable=0');
        }


        function imprimirCondiciones() {
            window.open('img/pdfs/condiciones-generales-mapfre.pdf', '_blank', 'width=' + screen.width + 'px,height=' + screen.height + 'px,resizable=0');
        }

        function reinicia() {
            vm = null;
            vm = this;
            $scope.validatePerson = false;
            $scope.nombreCompleto = '';
            $scope.emailUser = '';
            $scope.ListEntidades = [];
            $scope.ListMarks = [];
            $scope.ListModels = [];
            $scope.ListYears = [];
            $scope.ListPoblaciones = [];
            $scope.ListBanks = [];
            vm.yearExpirationList = [];
            vm.monthExpirationList = [];
            vm.accLen = 16;
            vm.cvvLen = 3;
            vm.client = '';
            vm.person = {};
            vm.contract = '';
            vm.personType = '1';
            vm.contractUser = 0;
            vm.soloNumero = soloNumero;
            vm.numberSecuential = numberSecuential;
            vm.charrepeatText = charrepeatText;
            vm.soloTextAndNum = soloTextAndNum;
            vm.selectTypeCard = selectTypeCard;
            vm.soloText = soloText;
            vm.forceKeyPressUppercase = forceKeyPressUppercase;
            vm.pagina1 = pagina1;
            vm.pagina2 = pagina2;
            vm.valCotizar = valCotizar;
            vm.cotizar = cotizar;
            vm.cotizarDos = cotizarDos;
            vm.cotizarDosB = cotizarDosB;
            vm.cotizarTres = cotizarTres;
            vm.cotizarTresB = cotizarTresB;
            vm.cotizarCuatro = cotizarCuatro;
            vm.cotizarCinco = cotizarCinco;
            vm.emisionPoliza = emisionPoliza;
            vm.imprimirPoliza = imprimirPoliza;
            vm.imprimirAviso = imprimirAviso;
            vm.imprimirCondiciones = imprimirCondiciones;
            vm.datosCliente = [];
            vm.mostrarDatos = false;
            vm.nombreCliente = "";
            vm.nombres = "";
            vm.apePaterno = "";
            vm.apeMaterno = "";
            vm.sexo = "1";
            vm.numeroCliente = "";
            vm.emailUser = "";
            vm.tipoVehiculo = "";
            vm.marcaVehiculo = "";
            vm.modeloVehiculo = "";
            vm.anioVehiculo = "";
            vm.estado = "";
            vm.poblacion = "";
            vm.codigoPostal = "";
            vm.uso = "";
            vm.intUser = "";
            vm.autoSustituto = false;
            vm.garantiaSobreRuedas = false;
            vm.catastrofica = false;
            vm.charrepeat = charrepeat;
            vm.typeCobertura = "";
            vm.formaPago = "";
            vm.cmd = {};
            vm.formaPagoUser = "";
            vm.activaBoton = false;
            vm.poliza = "";
            vm.placasVehiculo = '';
            vm.fechaNacimiento = "";
            vm.birthDay = "";
            vm.phoneUser = "";
            vm.mobileUser = "";
            vm.PrimaTotal = 0;
            vm.PrimaTotalRecibo = 0;
            vm.Recibossubcuentes = 0;
            vm.PrimaTotalReciboSubcuentes = 0;
            vm.InstitucionText = "";
            vm.NumeroTarjeta = "";
            vm.errorMessagePerMoral = "Por el momento no se puede cotizar a personas Morales";
            vm.errorMessageAsociado = "El cliente solicitado no está asociado al Asesor";
            vm.mostrarFactura = false;
            vm.mostrarFacturaDos = false;
            vm.validaFechaFactura = validaFechaFactura;
            vm.validaFormaCotizacion = validaFormaCotizacion;
            vm.validaFormaFactura = false;
            vm.fechaFactura = "";
            vm.numeroFactura = "";
            vm.importeFactura = "";
            vm.buscar = true;
            vm.tipoPersonalidad = false;
            vm.seleccionaPersonalidad = seleccionaPersonalidad;
            vm.formaPagoUser = "";
            vm.contract = "";
            vm.placasVehiculo = "";
            vm.motorVehiculo = "";
            vm.serieVehiculo = "";
            vm.garantiaSobreRuedas = "";
            vm.autoSustituto = "";
            vm.cmd = [];
            vm.formaPago = "";
            vm.nombreCard = "";
            vm.nombres = "";
            vm.apellidoPCard = "";
            vm.apePaterno = "";
            vm.apellidoMCard = "";
            vm.apeMaterno = "";
            vm.email1 = "";
            vm.nombres = "";
            vm.apePaterno = "";
            vm.apeMaterno = "";
            vm.emailUser = "";
            vm.typeAcount = "";
            vm.acount = "";
            vm.typeCard = "";        
            vm.cvv = "";
            vm.codigoPostal = "";
            vm.calleUser = "";
            vm.extUser = "";
            vm.intUser = "";
            vm.colonia = "";
            vm.numeroCliente = "";
            vm.birthDay = "";
            vm.fechaNacimiento = "";
            vm.mobileUser = "";
            vm.phoneUser = "";
            vm.nacionality = "";
            vm.profesion = "";
            vm.identificacion = "";
            vm.identificationNumber = "";

            $state.go('insurance.main', {model: null});
        }

        function pagina1() {
            var model = $stateParams.model;
            $scope.validatePerson = false;
            $scope.nombreCompleto = '';
            $scope.emailUser = '';
            $scope.ListEntidades = [];
            $scope.ListMarks = [];
            $scope.ListModels = [];
            $scope.ListYears = [];
            $scope.ListPoblaciones = [];
            $scope.ListBanks = [];
            vm.personType = model.personType;
            vm.mostrarDatos = model.mostrarDatos;
            vm.nombreCliente = model.nombreCliente;
            vm.nombres = model.nombres;
            vm.apePaterno = model.apePaterno;
            vm.apeMaterno = model.apeMaterno;
            vm.sexo = "1";
            vm.numeroCliente = model.numeroCliente;
            vm.emailUser = model.emailUser;
            vm.tipoVehiculo = model.tipoVehiculo;
            vm.marcaVehiculo = "";
            vm.modeloVehiculo = "";
            vm.anioVehiculo = "";
            vm.estado = "";
            vm.poblacion = "";
            vm.codigoPostal = "";
            vm.uso = "";
            vm.intUser = "";
            vm.autoSustituto = false;
            vm.garantiaSobreRuedas = false;
            vm.catastrofica = false;
            vm.typeCobertura = "";
            vm.formaPago = "";
            vm.cmd = {};
            vm.formaPagoUser = "";
            vm.activaBoton = false;
            vm.poliza = "";
            vm.placasVehiculo = '';
            vm.birthDay = model.birthDay;
            vm.fechaNacimiento = "";
            vm.phoneUser = "";
            vm.mostrarFactura = false;
            vm.mostrarFacturaDos = false;
            vm.validaFechaFactura = validaFechaFactura;
            vm.validaFormaCotizacion = validaFormaCotizacion;
            vm.validaFormaFactura = false;
            vm.fechaFactura = "";
            vm.numeroFactura = "";
            vm.importeFactura = "";
            vm.buscar = true;
            vm.tipoPersonalidad = false;
            vm.seleccionaPersonalidad = seleccionaPersonalidad;
            vm.validatePoup = model.validatePopup;
            vm.client = model.client;
            vm.person = model.person;
            vm.contract = model.contract;
            vm.datosCliente = model.datosCliente;
            vm.fiscalIDNumber = model.fiscalIDNumber;
            vm.disabledRFC = model.disabledRFC;
            vm.stepForm = {
                step: 3,
                stepA: false,
                stepB: false,
                stepC: true,
                stepD: false,
                stepDB: false,
                stepE: false,
                stepF: false,
                stepG: false,
                stepH: false
            };
            valCotizar();
        }

        function pagina2() {
            vm.stepForm = {
                step: 2,
                stepA: false,
                stepB: true,
                stepC: false,
                stepD: false,
                stepDB: false,
                stepE: false,
                stepF: false,
                stepG: false,
                stepH: false
            };

            var sendModel = {
                numeroCliente: vm.numeroCliente,
                emailUser: vm.emailUser,
                tipoVehiculo: vm.tipoVehiculo,
                personType: vm.personType,
                datosCliente: vm.datosCliente,
                nombres: vm.nombres,
                apePaterno: vm.apePaterno,
                apeMaterno: vm.apeMaterno,
                contract: vm.contract,
                fiscalIDNumber: vm.fiscalIDNumber,
                disabledRFC: vm.disabledRFC,
                mostrarDatos: vm.mostrarDatos,
                contract: vm.contract,
                nombreCliente: vm.nombreCliente,
                birthDay: vm.birthDay,
                client: vm.client,
                person: vm.person,
                validatePopup: vm.validatePoup
            };
            $state.go('insurance.main', { model: sendModel });
        }


        function pagina4_1() {

            vm.stepForm = {
                step: 4,
                stepA: false,
                stepB: false,
                stepC: false,
                stepD: false,
                stepDB: true,
                stepE: false,
                stepF: false,
                stepG: false,
                stepH: false
            };

        }
        /*
         function formatNumber(num) {
         if (!num || num === 'NaN')
         return '-';
         if (num === 'Infinity')
         return '&#x221e;';
         num = num.toString().replace(/\$|\,/g, '');
         if (isNaN(num))
         num = "0";
         var sign = (num === (num = Math.abs(num)));
         num = Math.floor(num * 100 + 0.50000000001);
         var cents = num % 100;
         num = Math.floor(num / 100).toString();
         if (cents < 10)
         cents = "0" + cents;
         for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
         num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
         return (((sign) ? '' : '') + num + ":" + cents);
         }*/

        function validaFechaFactura() {
            var fechaFac = moment(vm.fechaFactura);
            var hoy = moment(new Date());

            //Este codigo esta mal construido
            //var diasFactura = (hoy.diff(fechaFac, 'days'), ' dias de diferencia');

            //if (!diasFactura <= 60) {
            //                vm.mostrarFacturaDos = true;
            //            } else {
            //    CommonModalsSrv.error("Esta Factura no es Válida, solo se puede Cotizar Valor Comercial + 10% ");
            //}
        }

        function validaFormaCotizacion() {

            if (vm.cotizacionFactura === "true") {
                vm.mostrarFacturaDos = true;
                vm.validaFormaFactura = true;
            } else {
                vm.mostrarFacturaDos = false;
                vm.validaFormaFactura = false;
            }
        }

        //opción fecha factura
        var dateDropDownEnd = moment();
        var dateDropDownStart = moment().subtract(60, 'days');
        
        vm.optionsFechaFactura = {
            initDate: $rootScope.getTodayDate,
            showWeeks : false,
            formatMonth : 'MMM',
            yearColumns : 3 , 
            minDate: dateDropDownStart,
            dateDisabled: disableDatePickerFactura
        };
        
        function disableDatePickerFactura( _datePicker ) {
            var mode = _datePicker.mode;
            var date = _datePicker.date;
            var _dateCompare = new Date();
            _dateCompare.setTime( date );
            var isDisable = _dateCompare.getTime() >= dateDropDownStart &&  _dateCompare.getTime() <= dateDropDownEnd;
            
            return  mode === 'day' &&  (isDisable ? false : true);
        }

        function getYearExpirationList() {
            var _list = [];
            
            for (var _year = (new Date()).getFullYear(), i = 0; i < 9; i++) 
                _list.push({
                    id: _year + i,
                    text: _year + i
                });
            
            return _list;
        }

        function getMonthExpirationList() {
            var _list = [];
            
            for (var _month, i = 1; i <= 12; i++) {
                _month = i < 10 ? '0' + i : i;
                _list.push({
                    id: _month,
                    text: _month
                });
            }

            return _list;
        }

        //SERVICIO DE MOVIMIENTO ABRAHAM
        function getCatalogoYears() {
            var _listObtenida = [];
            var _dateNew = new Date();
            var _dateNew2 = new Date(_dateNew.getFullYear(), _dateNew.getMonth() + 12, 0);
            var _year = _dateNew2.getFullYear();
            var i = 0;
            for (i = 0; i < 40; i++) {
                _listObtenida.push({
                    id: _year - i,
                    text: _year - i
                });
            }
            return _listObtenida;
        }

        function getCatalogoEntidades() {
            var _listaObtenida = [];

            insuranceCarSrv.getCatalogEntityFederative().then(function (_res) {
                if (_res.success) {
                    angular.forEach(_res.info, function (value) {
                        _listaObtenida.push({
                            id: value.federalEntityID,
                            text: value.federalEntityDescription
                        });
                    });
                }
            });

            return _listaObtenida;
        }

        $scope.onChangeListMarks = function (lastValue, newValue) {
            $scope.ListMarks = [];
            if(!newValue) return;
            $scope.years = newValue.id;
            vm.anioVehiculo = newValue.text;
            var anioActual = (new Date()).getFullYear();
            
            if (vm.anioVehiculo >= anioActual - 1) {
                vm.mostrarFactura = true;
                vm.mostrarFacturaDos = false;
            } else {
                vm.mostrarFactura = false;
                vm.mostrarFacturaDos = false;
                vm.cotizacionFactura = undefined;
            }

            insuranceCarSrv.getCatalogMarksCars($scope.years).then(function (_res) {
                if (_res.success) {
                    angular.forEach(_res.info, function (value) {
                        $scope.ListMarks.push({
                            id: value.brandID,
                            text: value.brand
                        });
                    });
                }
            });
        };

        $scope.onChangeModels = function () {
            $scope.ListModels = [];
            if(vm.cmd.dataCarsModels !== undefined) vm.cmd.dataCarsModels = [];
            if(!(vm.cmd.dataCarsMarks && $scope.years)) return;
            $scope.marks = vm.cmd.dataCarsMarks.id;
            vm.marcaVehiculo = vm.cmd.dataCarsMarks.text;
            
            insuranceCarSrv.getCatalogModelsCars($scope.years, vm.cmd.dataCarsMarks.id).then(function (_res) {
                if (_res.success) {
                    angular.forEach(_res.info, function (value) {
                        $scope.ListModels.push({
                            id: value.modelID,
                            text: value.model
                        });
                    });
                }
            });
        };

        $scope.selectModelsCar = function (lastValue, newValue) {
            $scope.models = newValue.id;
            vm.modeloVehiculo = newValue.text;
        };

        $scope.onChangeListEntity = function () {
            $scope.ListPoblaciones = [];
            if(!vm.cmd.dataCarsEntity) return;
            vm.estado = vm.cmd.dataCarsEntity.text;
            $scope.entityId = vm.cmd.dataCarsEntity.id;
            
            insuranceCarSrv.getCatalogMunicipalityCars(vm.cmd.dataCarsEntity.id).then(function (_res) {
                if (_res.success) {
                    angular.forEach(_res.info, function (value) {
                        $scope.ListPoblaciones.push({
                            id: value.municipalityID,
                            text: value.delegationOrMunicipality
                        });
                    });
                }
            });
        };

        $scope.selectPoblacion = function () {
            if(!vm.cmd.dataCarsMunicipality) return;
            $scope.poblacionId = vm.cmd.dataCarsMunicipality.id;
            vm.poblacion = vm.cmd.dataCarsMunicipality.text;
        };

        function getCatalogoBanks() {
            var _listaObtenida = [];
            
            insuranceCarSrv.getCatalogBanksCars().then(function (_res) {
                if (_res.success) {
                    angular.forEach(_res.info, function (value) {
                        _listaObtenida.push({
                            id: value.bankID,
                            text: value.bankName
                        });
                    });
                    _listaObtenida.sort(function(a, b) {
                        if (a.text.toLowerCase() < b.text.toLowerCase()) return -1;
                        if (a.text.toLowerCase() > b.text.toLowerCase()) return 1;
                        return 0;
                    });
                }
            });
            
            return _listaObtenida;
        }

        $scope.selectBankId = function () {
            vm.cvv = "";
            vm.acount = "";
            $scope.bankID = vm.cmd.dataCarsAccountIdBanks.id;

            if(vm.cmd.dataCarsAccountIdBanks.text.toString().toUpperCase().startsWith("AMERICAN EXPRESS")) {
                vm.accLen = 15;
                vm.cvvLen = 4;
                vm.typeCard = "3";
            } else {
                vm.accLen = 16;
                vm.cvvLen = 3;
                vm.typeCard = "";
            }
        };
        
        function showResultRecibos(_recibos) {
            vm.PrimaTotalRecibo = 0;
            vm.Recibossubcuentes = 0;
            vm.PrimaTotalReciboSubcuentes = 0;
            var str = _recibos.split("</Recibo>");
            var str2 = "";
            var i = 0;
            var iteration = str.length - 1;
            vm.Recibossubcuentes = iteration - 1;
            var max = 1;
            for (i = 0; i < iteration; i++) {
                str2 = str[i];
                if (i === 0) {
                    vm.PrimaTotalRecibo = str2.substring(str2.indexOf("<PrimaTotal>") + 12, str2.indexOf("</PrimaTotal>"));
                } else if (i === max) {
                    vm.PrimaTotalReciboSubcuentes = str2.substring(str2.indexOf("<PrimaTotal>") + 12, str2.indexOf("</PrimaTotal>"));
                }
            }
        }
        
        function emisionPoliza() {
            var _sendModel = {
                language: 'SPA',
                agentID: $scope.$parent.agentSelected.id
            };

            _sendModel = getDataModelEmision(_sendModel);
            insuranceCarSrv.getServiceEmision(_sendModel).then(function (_res) {
                if (_res.success) {
                    var XMLDocument = _res.info;
                    var valdato = XMLDocument.indexOf("<Poliza>");
                    var r = XMLDocument.toString();

                    if (valdato === -1) {
                        var messages = "";
                        var validaDato = XMLDocument.indexOf("<error>");
                        if (validaDato !== -1) {
                            messages = r.substring(r.indexOf("<error>") + 7, r.indexOf("</error>"));
                        }
                        validaDato = XMLDocument.indexOf("<poliza error=\"true\" NUM_POLIZA=\"\">");

                        if (validaDato !== -1) {
                            messages = r.substring(r.indexOf("<poliza error=\"true\" NUM_POLIZA=\"\">") + 35, r.indexOf("</poliza>"));
                        }

                        CommonModalsSrv.error("Error en la Emision CODE: " + messages);
                    } else {
                        var _recibos = r.substring(r.indexOf("<Recibos>") + 9, r.indexOf("</Recibos>"));
                        vm.poliza = r.substring(r.indexOf("<Poliza>") + 8, r.indexOf("</Poliza>"));
                        vm.PrimaTotal = r.substring(r.indexOf("<PrimaTotal>") + 12, r.indexOf("</PrimaTotal>"));
                        vm.urlPoliza = window.location.href.indexOf("asesoria.actinver.com/asesoria") !== -1 ?
                        'https://negocios.mapfre.com.mx/VIPII/wImpresion/MarcoImpresion.aspx?Poliza=' + vm.poliza + '&Endoso=0':
                        'https://negociosuat.mapfre.com.mx/VIPII/wImpresion/MarcoImpresion.aspx?Poliza=' + vm.poliza + '&Endoso=0';
                        
                        showResultRecibos(_recibos);
                        var _TextBanco = (typeof vm.cmd.dataCarsAccountIdBanks !== 'undefined') ? vm.cmd.dataCarsAccountIdBanks.text : "";
                        var _NumeroTarjeta = (typeof vm.acount !== 'undefined') ? vm.acount : "";
                        if (_TextBanco !== "") {
                            vm.InstitucionText = _TextBanco;
                            vm.NumeroTarjeta = _NumeroTarjeta;
                        }
                        
                        CommonModalsSrv.done("Emisión Exitosa. Número de póliza: " + vm.poliza + '');
                        vm.stepForm = {
                            step: 8,
                            stepA: false,
                            stepB: false,
                            stepC: false,
                            stepD: false,
                            stepDB: false,
                            stepE: false,
                            stepF: false,
                            stepG: false,
                            stepH: true
                        };
                    }
                } else {
                    CommonModalsSrv.error("Error en la Emision.");
                }
            });

        }
        vm.datepicker_opts = {
            minDate: new Date(),
            isInvalidDate: function (date) {
                return (date.day() === 0 || date.day() === 6) ? true : false;
            }
        };
        //opción fecha nacimiento no cliente
        vm.optionsdpx = {
            minDate: moment(new Date().setYear(new Date().getFullYear() - 150)).format('DD/MM/YYYY'),
            maxDate: moment(new Date().setYear(new Date().getFullYear() - 18)).format('DD/MM/YYYY')
        };
        vm.optionsdpxPM = {
            maxDate: moment(new Date().setYear(new Date().getFullYear())).format('DD/MM/YYYY')
        };
        
        vm.Banks = (typeof vm.cmd.dataCarsAccountIdBanks !== 'undefined') ? vm.cmd.dataCarsAccountIdBanks.text : null;
        vm.datosCotizacion = {};

        function getDataModelEmision(_sendModel) {
            var _Marks = (typeof vm.cmd.dataCarsMarks !== 'undefined') ? vm.cmd.dataCarsMarks.id : null;
            var _Models = (typeof vm.cmd.dataCarsModels !== 'undefined') ? vm.cmd.dataCarsModels.id : null;
            var _Years = (typeof vm.cmd.dataCarsYears !== 'undefined') ? vm.cmd.dataCarsYears.type.id : null;
            var _catastrofica = (typeof vm.catastrofica !== 'undefined') ? (vm.catastrofica ? 1 : 0) : null;
            var _cotizacionFactura = (typeof vm.cotizacionFactura !== 'undefined') ? vm.cotizacionFactura : false;

            _sendModel.cobertura = vm.typeCobertura;
            _sendModel.SumAssured = _catastrofica === 1 ? 3000000 : 0;
            _sendModel.instruPago = vm.formaPagoUser;
            _sendModel.InsurancePolicyDate = moment(vm.fechaAprox).format('DD/MM/YYYY');
            _sendModel.contrato = vm.contract;
            _sendModel.BrandID = _Marks;
            _sendModel.ModelID = _Models;
            _sendModel.placa = vm.placasVehiculo;
            _sendModel.numMotor = vm.motorVehiculo;
            _sendModel.numSerie = vm.serieVehiculo;
            _sendModel.Year = _Years;
            _sendModel.garRueda = (typeof vm.garantiaSobreRuedas !== 'undefined') ? (vm.garantiaSobreRuedas ? 1 : 0) : null;
            _sendModel.garCatastr = _catastrofica;
            _sendModel.garAutoSus = (typeof vm.autoSustituto !== 'undefined') ? (vm.autoSustituto ? 1 : 0) : null;
            _sendModel.bancoId = (typeof vm.cmd.dataCarsAccountIdBanks !== 'undefined') ? vm.cmd.dataCarsAccountIdBanks.id : 0;
            _sendModel.fraccPago = (typeof vm.formaPago !== 'undefined') ? vm.formaPago : 0;
            _sendModel.DelegationMunicipalityID = (typeof vm.cmd.dataCarsMunicipality !== 'undefined') ? vm.cmd.dataCarsMunicipality.id : null;
            _sendModel.nomCard = (typeof vm.nombreCard !== 'undefined') ? vm.nombreCard : vm.nombres;
            _sendModel.ape1Card = (typeof vm.apellidoPCard !== 'undefined') ? vm.apellidoPCard : vm.apePaterno;
            _sendModel.ape2TCard = (typeof vm.apellidoMCard !== 'undefined') ? vm.apellidoMCard : vm.apeMaterno;
            _sendModel.emailCard = (typeof vm.email1 !== 'undefined') ? vm.email1 : "";
            _sendModel.emailTercero = (typeof vm.email1 !== 'undefined') ? vm.email1 : vm.emailUser;

            if (vm.formaPagoUser === 'domCredito') {
                vm.typeAcount = "TA";
            } else if (vm.formaPagoUser === 'domDebito') {
                vm.typeAcount = "BA";
            }
            if (vm.personType === '1') {
                _sendModel.MCA_FISICO = "S";
                _sendModel.nomTercero = vm.nombres;
                _sendModel.ape1Tercero = vm.apePaterno;
                _sendModel.ape2Tercero = vm.apeMaterno;
            } else if (vm.personType === '2') {
                _sendModel.MCA_FISICO = "N";
                _sendModel.nomTercero = vm.nombreCliente;
                _sendModel.ape1Tercero = null;
                _sendModel.ape2Tercero = null;
            }
            _sendModel.MCA_SEXO = vm.sexo;
            _sendModel.tipoPago = (typeof vm.typeAcount !== 'undefined') ? vm.typeAcount : null;
            _sendModel.numTarj = (typeof vm.acount !== 'undefined') ? vm.acount : null;
            _sendModel.tipoTarj = (typeof vm.typeCard !== 'undefined') ? vm.typeCard : null;
            _sendModel.fechVencTarj = (typeof vm.comboYearExpiration !== 'undefined') && (typeof vm.comboMonthExpiration !== 'undefined') ? ['01', vm.comboMonthExpiration.id, vm.comboYearExpiration.id].join('/') : null;
            _sendModel.codTarj = (typeof vm.cvv !== 'undefined') ? vm.cvv : null;
            _sendModel.codPostal = vm.codigoPostal;
            _sendModel.calleNumeros = vm.calleUser + " " + vm.extUser + " " + vm.intUser;
            _sendModel.colonia = vm.colonia;
            _sendModel.StateID = (typeof vm.cmd.dataCarsEntity.id !== 'undefined') ? vm.cmd.dataCarsEntity.id : null;
            _sendModel.DES_VIP = vm.numeroCliente;
            _sendModel.COD_DOCUM = vm.fiscalIDNumber;
            _sendModel.FEC_NACIMIENTO = (typeof vm.birthDay !== 'undefined' && vm.birthDay !== "") ? vm.birthDay : moment(vm.fechaNacimiento).format('DD/MM/YYYY');
            _sendModel.TLF_MOVIL = vm.mobileUser;
            _sendModel.TLF_NUMERO = vm.phoneUser;
            _sendModel.InvoiceFlag = _cotizacionFactura;
            
            if (_cotizacionFactura) {
                _sendModel.NUM_FACTURA = vm.numeroFactura;
                _sendModel.VAL_FACTURA = vm.importeFactura;
                _sendModel.FEC_FACTURA = moment(vm.fechaFactura).format('DDMMYYYY');
            } else {
                _sendModel.NUM_FACTURA = null;
                _sendModel.VAL_FACTURA = null;
                _sendModel.FEC_FACTURA = null;
            }
            
            return _sendModel;
        }

        function getDataModelCotizacion() {
            var _sendModel = {};
            var _entityFederative = (typeof vm.cmd.dataCarsEntity.id !== 'undefined') ? vm.cmd.dataCarsEntity.id : null;
            var _Municipality = (typeof vm.cmd.dataCarsMunicipality !== 'undefined') ? vm.cmd.dataCarsMunicipality.id : null;
            var _Marks = (typeof vm.cmd.dataCarsMarks !== 'undefined') ? vm.cmd.dataCarsMarks.id : null;
            var _Models = (typeof vm.cmd.dataCarsModels !== 'undefined') ? vm.cmd.dataCarsModels.id : null;
            var _cotizacionFactura = (typeof vm.cotizacionFactura !== 'undefined') ? vm.cotizacionFactura : false;
            if (_Marks !== null) {
                _sendModel.BrandID = _Marks;
            } else {
                _sendModel.BrandID = "3"; //hardcode
            }
            if (_Municipality !== null) {
                _sendModel.DelegationMunicipalityID = _Municipality;
            } else {
                _sendModel.DelegationMunicipalityID = "9001";//harcode
            }
            if (_Models !== null) {
                _sendModel.ModelID = _Models;
            } else {
                _sendModel.ModelID = "517";//hardcode
            }
            if (_entityFederative !== null) {
                _sendModel.StateID = _entityFederative;
            } else {
                _sendModel.StateID = "9";//hardcode
            }

            _sendModel.InvoiceFlag = _cotizacionFactura;//vm.mostrarFacturaDos;

            if (_cotizacionFactura) {
                _sendModel.InvoiceNumber = vm.numeroFactura;
                _sendModel.InvoiceValue = vm.importeFactura;
                _sendModel.InvoiceDate = moment(vm.fechaFactura).format('YYYY-MM-DD');

            } else {
                _sendModel.InvoiceNumber = null;
                _sendModel.InvoiceValue = null;
                _sendModel.InvoiceDate = null;
            }

            _sendModel.SubstituteCarCoverageFlag = vm.autoSustituto;
            _sendModel.WarrantyCoverageFlag = vm.garantiaSobreRuedas;
            _sendModel.CatastrophicCoverageFlag = vm.catastrofica;
            //_sendModel.SumAssured = vm.catastrofica;
            if (vm.catastrofica) {
                _sendModel.SumAssured = 3000000;
            } else {
                _sendModel.SumAssured = 0;
            }
            _sendModel.PaymentType = "AG";
            _sendModel.PaymentMethod = vm.formaPago;
            //_sendModel.PolicyMaturityDate = fechaFinCotizacion;
            //_sendModel.InsurancePolicyDate = new Date();
            _sendModel.Year = vm.cmd.dataCarsYears.type.id;
            _sendModel.planType = vm.typeCobertura;
            _sendModel.idCliente = vm.numeroCliente !== "" ? vm.numeroCliente : "0";
            _sendModel.agentID = $scope.$parent.agentSelected.id;
            
            return _sendModel;
        }
        
        $scope.onValidateDuplicateTel = function (newValue, type) {
            var telefono = 0;
            var celular = 0;
            if (type === 'c') {
                telefono = (typeof vm.phoneUser !== 'undefined') ? vm.phoneUser : 0;
                celular = (typeof newValue !== 'undefined') ? newValue : 0;
                
                if (telefono === celular && telefono !== 0 && celular !== 0) {
                    CommonModalsSrv.error("Favor de Capturar un Celular Diferente");
                    return false;
                }
            } else if (type === 'f') {
                telefono = (typeof newValue !== 'undefined') ? newValue : 0;
                celular = (typeof vm.mobileUser !== 'undefined') ? vm.mobileUser : 0;
                //console.log("Tipo: " + type + "Telefono Particular: " + telefono + " Celular: " + celular);
                if (telefono === celular && telefono !== 0 && celular !== 0) {
                    CommonModalsSrv.error("Favor de Capturar un Telefono Diferente");
                    return false;
                }
            }
        };
        //SERVICIO DE MOVIMIENTO ABRAHAM

        //INICIO DE SERVICIO DE CAMAÑO
        $scope.onClicSendEmailNotificationCotization = function () {
            var _fCotizacion = (typeof vm.cotizacionFactura === 'undefined') ? "false" : vm.cotizacionFactura;
            try {

                $scope.obJsonMail = {
                    'language': 'SPA',
                    'emailFrom': "seguros@actinver.com.mx",
                    'idTemplate': "buildDBTemplate|9",
                    'emailSubject': "Envío de cotización seguro de auto Actinver " + vm.nombreCliente,
                    'mailTo': [vm.emailUser],
                    'mailCC': [""],
                    'fCotizacion': _fCotizacion,
                    'packageType': vm.typeCobertura,
                    'ldrDanosMateriales': '',
                    'ldrRoboTotal': '',
                    'deducibleDanosMateriales': '',
                    'ldrRespCivilBienes': '',
                    'ldrRespCivilPersonas': '',
                    'ldrGastosMedicosOcup': '',
                    'ldrAsistenciaCompleta': '',
                    'ldrDefensaJuridica': '',
                    'ldrRoboParcial': '',
                    'ldrDevPrimaDeducible': '',
                    'ldrCoberIntegralExtranjero': '',
                    'ldrAutoSustituto': '',
                    'ldrGarantiaSobreRuedas': '',
                    'ldrRCCatastroficaMuerteAccidental': '',
                    'deducibleRoboTotal': '',
                    'deducibleRespCivilBienes': '',
                    'deducibleRespCivilPersonas': '',
                    'deducibleGastMedicOcupantes': '',
                    'deducibleAsistenciaCompleta': '',
                    'deducibleDefensaJuridica': '',
                    'deducibleRoboParcial': '',
                    'deducibleDevPrimaDeducible': '',
                    'deducibleCoberIntegralExtranjero': '',
                    'deducibleAutoSustituto': '',
                    'deducibleGarantiaSobreRuedas': '',
                    'deducibleRCCatastroficaMuerteAccidental': '',
                    'primaTotalAnual': vm.datosCotizacion.insurancePaymentData.totalPayments,
                    'tipoVehiculo': vm.tipoVehiculo,
                    'marcaVehiculo': vm.marcaVehiculo,
                    'modeloVehiculo': vm.modeloVehiculo,
                    'anioVehiculo': vm.anioVehiculo

                };
                angular.forEach(vm.datosCotizacion.coverageList.coverageInformation, function (value) {
                    if (value.code.toString() === "4000") {
                        if (value.sumAssured === '1') {
                            $scope.obJsonMail.ldrDanosMateriales = "AMPARADA";
                        } else {
                            $scope.obJsonMail.ldrDanosMateriales = value.sumAssured;
                        }
                        $scope.obJsonMail.deducibleDanosMateriales = value.deductible;
                    }

                    if (value.code.toString() === "4001") {
                        if (value.sumAssured === '1') {
                            $scope.obJsonMail.ldrRoboTotal = "AMPARADA";
                        } else {
                            $scope.obJsonMail.ldrRoboTotal = value.sumAssured;
                        }
                        $scope.obJsonMail.deducibleRoboTotal = value.deductible;
                    }

                    if (value.code.toString() === "4003") {
                        if (value.sumAssured === '1') {
                            $scope.obJsonMail.ldrAsistenciaCompleta = "AMPARADA";
                        } else {
                            $scope.obJsonMail.ldrAsistenciaCompleta = value.sumAssured;
                        }
                        $scope.obJsonMail.deducibleAsistenciaCompleta = value.deductible;
                    }

                    if (value.code.toString() === "4004") {
                        if (value.sumAssured === '1') {
                            $scope.obJsonMail.ldrDefensaJuridica = "AMPARADA";
                        } else {
                            $scope.obJsonMail.ldrDefensaJuridica = value.sumAssured;
                        }

                        $scope.obJsonMail.deducibleDefensaJuridica = value.deductible;
                    }

                    if (value.code.toString() === "4006") {
                        if (value.sumAssured === '1') {
                            $scope.obJsonMail.ldrGastosMedicosOcup = "AMPARADA";
                        } else {
                            $scope.obJsonMail.ldrGastosMedicosOcup = value.sumAssured;
                        }

                        $scope.obJsonMail.deducibleGastMedicOcupantes = value.deductible;
                    }

                    if (value.code.toString() === "4010") {
                        if (value.sumAssured === '1') {
                            $scope.obJsonMail.ldrRespCivilBienes = "AMPARADA";
                        } else {
                            $scope.obJsonMail.ldrRespCivilBienes = value.sumAssured;
                        }

                        $scope.obJsonMail.deducibleRespCivilBienes = value.deductible;
                    }

                    if (value.code.toString() === "4011") {
                        if (value.sumAssured === '1') {
                            $scope.obJsonMail.ldrRespCivilPersonas = "AMPARADA";
                        } else {
                            $scope.obJsonMail.ldrRespCivilPersonas = value.sumAssured;
                        }

                        $scope.obJsonMail.deducibleRespCivilPersonas = value.deductible;
                    }

                    if (value.code.toString() === "4014") {
                        if (value.sumAssured === '1') {
                            $scope.obJsonMail.ldrDevPrimaDeducible = "AMPARADA";
                        } else {
                            $scope.obJsonMail.ldrDevPrimaDeducible = value.sumAssured;
                        }

                        $scope.obJsonMail.deducibleDevPrimaDeducible = value.deductible;
                    }

                    if (value.code.toString() === "4022") {
                        if (value.sumAssured === '1') {
                            $scope.obJsonMail.ldrRoboParcial = "AMPARADA";
                        } else {
                            $scope.obJsonMail.ldrRoboParcial = value.sumAssured;
                        }

                        $scope.obJsonMail.deducibleRoboParcial = value.deductible;
                    }

                    if (value.code.toString() === "4024") {
                        if (value.sumAssured === '1') {
                            $scope.obJsonMail.ldrAutoSustituto = "AMPARADA";
                        } else {
                            $scope.obJsonMail.ldrAutoSustituto = value.sumAssured;
                        }

                        $scope.obJsonMail.deducibleAutoSustituto = value.deductible;
                    }

                    if (value.code.toString() === "4048") {
                        if (value.sumAssured === '1') {
                            $scope.obJsonMail.ldrCoberIntegralExtranjero = "AMPARADA";
                        } else {
                            $scope.obJsonMail.ldrCoberIntegralExtranjero = value.sumAssured;
                        }

                        $scope.obJsonMail.deducibleCoberIntegralExtranjero = value.deductible;
                    }

                    if (value.code.toString() === "4053") {
                        if (value.sumAssured === '1') {
                            $scope.obJsonMail.ldrGarantiaSobreRuedas = "AMPARADA";
                        } else {
                            $scope.obJsonMail.ldrGarantiaSobreRuedas = value.sumAssured;
                        }

                        $scope.obJsonMail.deducibleGarantiaSobreRuedas = value.deductible;
                    }

                    if (value.code.toString() === "4068") {
                        if (value.sumAssured === '1') {
                            $scope.obJsonMail.ldrRCCatastroficaMuerteAccidental = "AMPARADA";
                        } else {
                            $scope.obJsonMail.ldrRCCatastroficaMuerteAccidental = value.sumAssured;
                        }

                        $scope.obJsonMail.deducibleRCCatastroficaMuerteAccidental = value.deductible;
                    }
                });

                var copia = $scope.obJsonMail;
                insuranceCarSrv.sendEmailNotificationCotizationCars(copia).then(function (_response) {
                    if (_response.success) {
                        CommonModalsSrv.done("Correo Enviado");
                    } else {
                        CommonModalsSrv.error("Error al enviar el correo. " + _response.info);
                    }
                });
            } catch (e) {

            }


        };

        $scope.onClicSendEmailNotificationCompraSeguro = function () {
            $scope.obJsonMail = {
                'language': 'SPA',
                'emailFrom': 'seguros@actinver.com.mx',
                'idTemplate': 'buildDBTemplate|10',
                'emailSubject': 'Póliza emitida seguro de auto Actinver ' + vm.nombreCliente + ' ' + vm.poliza,
                'mailTo': [vm.emailUser],
                'mailCC': '',
                'polizaSeguro': vm.poliza,
                'anioVigencia': vm.cmd.dataCarsYears.type.id,
                'pagoPolizaFecha': moment(vm.fechaAprox).format('DD/MM/YYYY'),
                'marcaVehiculo': vm.marcaVehiculo,
                'modeloVehiculo': vm.modeloVehiculo,
                'serieVehiculo': vm.serieVehiculo,
                'urlPolizaImpresion': vm.urlPoliza
            };

            insuranceCarSrv.sendEmailNotificationCompraSeguroCars($scope.obJsonMail).then(function (_response) {
                if (_response.success) {
                    CommonModalsSrv.done("Correo Enviado");
                } else {
                    CommonModalsSrv.error("Error al enviar el correo. " + _response.info);
                 }
            });
        };
        //FIN DE SERVICIO DE CAMAÑO

        function valCotizar() {
            $scope.ListYears = getCatalogoYears();
            $scope.ListBanks = getCatalogoBanks();
            $scope.ListEntidades = getCatalogoEntidades();
            vm.yearExpirationList = getYearExpirationList();
            vm.monthExpirationList = getMonthExpirationList();
            
            if (vm.nombreCliente !== "" && vm.validatePoup === false) {
                CommonModalsSrv.confirm("¿" + vm.nombreCliente + " es el asegurado titular de la cuenta?")
                    .result.then(
                        function () {
                            var _validateEmail = (typeof vm.datosCliente.email === 'undefined') ? false : true;
                            if (_validateEmail) {
                                cotizar(true, vm.nombreCliente, vm.datosCliente.email[0].email);
                            } else {
                                cotizar(false, "", "");
                            }
                            vm.validatePoup = true;
                        }
                    ).catch(function (res) {
                        if ((res === "cancel" || res === "escape key press" || res === "backdrop click")) {
                            vm.client = '';
                            vm.person = {};
                            vm.contract = '';
                            vm.datosCliente = [];
                            vm.fiscalIDNumber = "";
                            vm.disabledRFC = false;
                            vm.nombreCliente = "";
                            vm.nombres = "";
                            vm.apePaterno = "";
                            vm.apeMaterno = "";
                            vm.contract = "";
                            vm.validatePoup = true;
                            vm.mostrarDatos = false;
                            cotizar(false, "", "");
                        }
                    });
            } else {
                cotizar(false, "", "");
            }
        }


        function cotizar(personaExistente, nombreCompleto, emailUser) {
            vm.stepForm = {
                step: 3,
                stepA: false,
                stepB: false,
                stepC: true,
                stepD: false,
                stepDB: false,
                stepE: false,
                stepF: false,
                stepG: false,
                stepH: false
            };

            vm.validatePerson = personaExistente;
            
            if (vm.validatePerson === true) {
                vm.emailUser = emailUser;
            }
        }

        function cotizarDos() {
            vm.nombreCliente = vm.nombres + " " + vm.apePaterno + " " + vm.apeMaterno;
            vm.stepForm = {
                step: 4,
                stepA: false,
                stepB: false,
                stepC: false,
                stepD: true,
                stepDB: false,
                stepE: false,
                stepF: false,
                stepG: false,
                stepH: false
            };
        }

        function cotizarDosB() {
            try {
                var _cotizacionFactura = (typeof vm.cotizacionFactura !== 'undefined') ? true : false;
                if (_cotizacionFactura) {
                    if (vm.mostrarFacturaDos && vm.cotizacionFactura === "true" && vm.fechaFactura === "") {
                        CommonModalsSrv.error("Favor de Capturar el campo de Fecha de Factura");
                        return false;
                    }
                }
                
                window.scrollTo(0, angular.element('cotizacion').offsetTop);
                vm.datosCotizacion = {};
                var _sendModel = getDataModelCotizacion();

                insuranceCarSrv.getServiceCotizacion(_sendModel).then(function (_res) {
                    if (_res.success) {
                        vm.datosCotizacion = _res.info;

                        pagina4_1();
                    } else {
                        CommonModalsSrv.error("Error en el Servicio, no se encuentra disponible - code: " + _res.info.transactionID);
                    }
                });
            } catch (e) {
                CommonModalsSrv.error("Error en el Servicio, no se encuentra disponible - faltaron llenar datos en las paginas Anteriores ");
            }


        }

        function cotizarTres() {
            window.scrollTo(0, angular.element('pantallaCinco').offsetTop);
            if (vm.numeroCliente === "" || vm.numeroCliente === "0") {
                CommonModalsSrv.error("Para el proceso de contratación, el interesado debe ser cliente Actinver");
            } else {
                vm.stepForm = {
                    step: 5,
                    stepA: false,
                    stepB: false,
                    stepC: false,
                    stepD: false,
                    stepDB: false,
                    stepE: true,
                    stepF: false,
                    stepG: false,
                    stepH: false
                };
            }
        }

        function cotizarTresB() {
            vm.yearExpirationList = getYearExpirationList();
            vm.monthExpirationList = getMonthExpirationList();


            if (vm.formaPagoUser === "sinDom") {
                cotizarTres();
            } else {
                window.scrollTo(0, angular.element('pantallaSeis').offsetTop);
                if (vm.numeroCliente === "" || vm.numeroCliente === "0") {
                    CommonModalsSrv.error("Para el proceso de contratación, el interesado debe ser cliente Actinver");
                } else {
                    vm.stepForm = {
                        step: 6,
                        stepA: false,
                        stepB: false,
                        stepC: false,
                        stepD: false,
                        stepDB: false,
                        stepE: false,
                        stepF: true,
                        stepG: false,
                        stepH: false
                    };
                }
            }
        }

        function cotizarCuatro() {
            if (!vm.disabledRFC) {
                if (vm.fechaNacimiento === "") {
                    if (vm.personType === '1') {
                        CommonModalsSrv.error("Favor de Capturar el campo de Fecha de Nacimiento");
                        return;
                    } else {
                        CommonModalsSrv.error("Favor de Capturar el campo de Fecha Constitutiva");
                        return;
                    }
                } else {
                    calculaRFC();
                }
            } else vm.bnd = true;

            if(vm.bnd) {
                vm.email1 = vm.emailUser;
                
                if (vm.formaPagoUser === "sinDom") {
                    cotizarCinco();
                } else {
                    vm.stepForm = {
                        step: 6,
                        stepA: false,
                        stepB: false,
                        stepC: false,
                        stepD: false,
                        stepDB: false,
                        stepE: false,
                        stepF: true,
                        stepG: false,
                        stepH: false
                    };
                }
            }
        }

        function cotizarCinco() {

            vm.stepForm = {
                step: 7,
                stepA: false,
                stepB: false,
                stepC: false,
                stepD: false,
                stepDB: false,
                stepE: false,
                stepF: false,
                stepG: true,
                stepH: false
            };
        }

        vm.sclient = ($sessionStorage.sclient) ? $sessionStorage.sclient : {};
        vm.showSystemError = CommonModalsSrv.systemError;

        // Get selected client
        vm.getSelectedClient = function (state, _contract) {
            localStorage.setItem('contractSelected', JSON.stringify(_contract));
            if (typeof vm.sclient.data !== 'undefined') {
                vm.show_instructions = false;
                $state.go(state);
            }
        };

        //obtener Datos Cliente
        vm.type_contract = {
            id: 0
        };

        vm.search_types = insuranceCarSrv.search_types;
        vm.contract_type = insuranceCarSrv.type_contract;
        vm.person_type = insuranceCarSrv.type_person;

        vm.contracts_search = {
            finish: false,
            sent: false
        };

        vm.clean = function () {
            vm.client = '';
            vm.person = {};
        };

        vm.cleanForm = function () {
            vm.contract = null;
            vm.client = null;
            vm.person = null;
        };

        // Submit search form
        function cotizarNoCliente() {
            vm.datosCliente = "";
            vm.fiscalIDNumber = "";
            vm.disabledRFC = false;
            vm.nombreCliente = "";
            vm.nombres = "";
            vm.apePaterno = "";
            vm.apeMaterno = "";
            vm.contract = "";
            vm.mostrarDatos = false;
            vm.numeroCliente = "9999";
            vm.birthDay = "";
            vm.fechaNacimiento = "";
            vm.buscar = false;
            vm.tipoPersonalidad = true;
        }

        function seleccionaPersonalidad(persona) {
            vm.personType = persona;
            pagina2();
        }

        vm.contractSelection = function (_contract, _type) {
            localStorage.setItem('contractSelected', JSON.stringify(_contract));
            var marketType;
            if (_contract.bankingArea === '999' && _type === 'MC') {
                marketType = 'CM';
            } else {
                marketType = _type;
            }
            localStorage.setItem('_marketType', JSON.stringify(marketType));
            $state.go('investment.funds');
        };

        //Funciones para las validaciones de campos
        function soloNumero(e) {
            var regex = new RegExp("^[0-9]+$");
            var echc = (typeof event.charCode !== 'undefined') ? event.charCode : event.which;
            var key = String.fromCharCode(echc);
            if (!regex.test(key) && event.charCode !== 0) {
                event.preventDefault();
                return false;
            }
        }

        function soloText(e) {
            var regex = new RegExp("^[\u00F1a-zA-Z ]+$");
            var echc = (typeof event.charCode !== 'undefined') ? event.charCode : event.which;
            var key = String.fromCharCode(echc);
            if (!regex.test(key) && event.charCode !== 0) {
                event.preventDefault();
                return false;
            }
        }

        function soloTextAndNum(e, espacios) {
            var regex = espacios ? new RegExp("^[a-zA-Z0-9 ]+$") : new RegExp("^[a-zA-Z0-9]+$");
            var echc = (typeof event.charCode !== 'undefined') ? event.charCode : event.which;
            var key = String.fromCharCode(echc);
            if (event.which === 241 || event.which === 209 || event.which === 225 ||
                event.which === 233 || event.which === 237 || event.which === 243 ||
                event.which === 250 || event.which === 193 || event.which === 201 ||
                event.which === 205 || event.which === 211 || event.which === 218)
                return true;
            else {
                if (!regex.test(key) && event.charCode !== 0) {
                    event.preventDefault();
                    return false;
                }
            }
        }

        function selectTypeCard() {
            if(vm.acount) {
                switch (vm.acount.toString().substr(0, 1)) {
                    case '3':
                        vm.typeCard = "3";
                        break;
                    case '4':
                        vm.typeCard = "1";
                        break;
                    case '5':
                        vm.typeCard = "2";
                        break;
                }
            }
        }

        var begin;
        var first;
        var second;

        function charrepeat(e, value) {
            var echc = (typeof event.charCode !== 'undefined') ? event.charCode : event.which;
            var tb = (typeof value !== 'undefined') ? value.toUpperCase() : String.fromCharCode(echc).toUpperCase();
            if (tb.length > 2) {
                var message = tb.substring(tb.length - 3, tb.length);
                if (checkRate(message)) {
                    begin = message.substring(0, 1);
                    first = message.substring(1, 2);
                    second = message.substring(2, 3);
                    if (begin.toString() === first.toString() && first.toString() === second.toString()) {
                        event.preventDefault();
                        return false;
                    }
                } else {
                    begin = message.substring(0, 1);
                    first = message.substring(1, 2);
                    second = message.substring(2, 3);
                    if (parseInt(first) === parseInt(second) - 1 && parseInt(begin) === parseInt(first) - 1) {
                        event.preventDefault();
                        return false;
                    }
                }
            }
            return false;
        }
        function checkRate(input) {
            //var re =/^[a-zA-Z0-9 ]+$/;
            var re = /^[1-9]+[0-9]*]*$/;
            if (!re.test(input)) {
                return true;
            } else {
                return true;
            }
        }

        function numberSecuential(event, idValue) {
            var strNum = "01234567890000000000111111111122222222223333333333444444444455555555556666666666777777777788888888889999999999";
            var inputValue = angular.element("#" + idValue).val();
            inputValue = (typeof inputValue === 'undefined') ? "" : inputValue;
            if (inputValue.toString() !== '01' && inputValue.toString() !== '001') {
                if (inputValue.toString().length > 5 && strNum.includes(inputValue.toString())) {
                    event.preventDefault();
                    return false;
                } else {
                    return true;
                }
            } else {
                event.preventDefault();
                return false;
            }
        }

        function charrepeatText(event, idValue) {
            var echc = (typeof event.charCode !== 'undefined') ? event.charCode : event.which;
            var key = String.fromCharCode(echc).toUpperCase();
            var inputValue = angular.element("#" + idValue).val().toString().toUpperCase();
            inputValue = (typeof inputValue === 'undefined') ? "" : inputValue;
            //console.log("inputValue:" + inputValue + "   >>   key:" + key);
            if (inputValue.substring(inputValue.length - 1, inputValue.length) === key && inputValue.substring(inputValue.length - 2, inputValue.length - 1) === key) {
                event.preventDefault();
                return false;
            }
        }

        vm.emailFormat = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;

        function calculaRFC() {
            vm.bnd = false;
            var fecha = vm.fechaNacimiento;
            fecha = moment(fecha).format('DD/MM/YYYY');//$("#F_NACIMIENTO").val();
            var rfcOri = vm.fiscalIDNumber;
            var rfc = "";

            var arrayFecha = fecha.split("/");
            rfc += arrayFecha[2].substring(2, 4);
            rfc += arrayFecha[1];
            rfc += arrayFecha[0];
            if (vm.personType === '1') {
                if (rfc === rfcOri.substring(4, 10)) {
                    vm.bnd = true;
                } else {
                    CommonModalsSrv.error("La fecha de nacimiento no coincide con la fecha del RFC");
                }
            } else if (vm.personType === '2') {
                if (rfc === rfcOri.substring(3, 9)) {
                    vm.bnd = true;
                } else {
                    CommonModalsSrv.error("La fecha constitutiva no coincide con la fecha del RFC");
                }
            }
        }
    }

})();
