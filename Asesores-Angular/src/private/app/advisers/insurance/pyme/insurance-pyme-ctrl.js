/* global parseFloat, moment */

(function () {
    'use strict';
    angular
            .module('actinver.controllers')
            .controller('insurancePymeCtrl', insurancePymeCtrl);

    function insurancePymeCtrl($state, $stateParams, $scope, $window, CommonModalsSrv, insurancePymeSrv) {
        var vm = this;
        var scrSize = $window.matchMedia("(max-width: 767px)");
        scrSize.onchange = function(ev) { vm.txtClass = ev.target.matches ? 'text-left' : 'text-right'; };
        vm.pagina1 = pagina1;
        vm.pagina2 = pagina2;
        vm.pagina3 = pagina3;
        vm.cleanForm = cleanForm;
        vm.regresarMain = regresarMain;
        vm.regresarPaginaCotizacion = regresarPaginaCotizacion;
        vm.cotizarContratar = cotizarContratar;
        vm.validateBirthdateRFC = validateBirthdateRFC;
        vm.justAlphabet = justAlphabet;
        vm.justAlphanumeric = justAlphanumeric;
        vm.justNumeric = justNumeric;
        vm.soloNumero = soloNumero;
        vm.charrepeat = charrepeat;
        vm.charrepeatText = charrepeatText;
        vm.charrepeatTextTres = charrepeatTextTres;
        vm.soloTextAndNum = soloTextAndNum;
        vm.numberSecuential = numberSecuential;
        vm.forceKeyPressUppercase = forceKeyPressUppercase;
        vm.calculaRFC = calculaRFC;
        vm.validarDatosACotizar = validarDatosACotizar;
        vm.cotizarSeguroPyme = cotizarSeguroPyme;
        vm.setValueGastosExtrasCasaHabitacion = setValueGastosExtrasCasaHabitacion;
        vm.setRemocionEscombros = setRemocionEscombros;
        vm.emisionSeguroHogar = emisionSeguroHogar;
        vm.changeSameAddress = changeSameAddress;
        vm.imprimirCondiciones = imprimirCondiciones;
        vm.printPolicy = printPolicy;
        vm.endEmission = endEmission;
        vm.isClienteObt = false;
        vm.getListaCotizaciones = getListaCotizaciones;
        vm.getRolUsuario = getRolUsuario;
        vm.backToEmission = backToEmission;
        vm.yearExpirationList = [];
        vm.monthExpirationList = [];
        vm.cvvLen = 3;
        vm.accLen = 16;
        vm.txtClass = scrSize.matches ? 'text-left' : 'text-right';
        vm.selectBankId = selectBankId;
        vm.selectTypeCard = selectTypeCard;
        vm.emissionFunction = emissionFunction;
        vm.numPoliza = '';
        vm.jsonCotizacion = {};
        vm.primatotalImpresion = '';
        vm.emission = {};
        vm.cmd = {
            kindPaid: {
                type : null
            }
        };
        vm.cmd.emission = {
            contract : null
        };
        vm.stepForm = {
            step: 0,
            stepA: false,
            stepB: false,
            stepC: false,
            stepD: false
        };
        vm.insurancePolicyDate = moment(new Date()).format('YYYY-MM-DD');
        vm.policyMaturityDate = moment(new Date(), 'YYYY-MM-DD').add(1, 'years').format('YYYY-MM-DD');
        var model = $stateParams.model;
        vm.numeroCliente = model ? model.numeroCliente : "";
        vm.contract = model ? model.contract : "";
        vm.client = model ? model.client : "";
        vm.person = model ? model.person : {};
        vm.datosCliente = model ? model.datosCliente : [];
        vm.nombres = model ? model.nombres : "";
        vm.apePaterno = model ? model.apePaterno : "";
        vm.apeMaterno = model ? model.apeMaterno : "";
        vm.nombreCliente = model ? model.nombreCliente : "";
        vm.birthDay = model ? model.birthDay : "";
        vm.fiscalIDNumber = model ? model.fiscalIDNumber : "";
        vm.emailUser = model ? model.emailUser : "";
        vm.personType = model ? model.personType : '1';
        vm.phoneUser = model ? model.phoneUser : "";
        vm.importeEdificio = "";
        vm.limiteMaximoEquipoMovil = 0;
        vm.limiteMaximoCristales = 0;
        vm.limiteMaximoRoboMenaje = 0;
        vm.limiteMaximoRcFamiliar = 0;
        vm.limiteMaximoUsoTarjetas = 0;
        vm.dineroMontoInicial = 0;
        vm.bicicletasMontoInicial = 0;
        vm.objetosMontoInicial = 0;
        vm.equipoMovilMontoInicial = 0;
        vm.botonContratar = "Cotizar";
        vm.cotizacionSeleccionada = undefined;
        vm.soloText = soloText;
        vm.pageSize = 3;
        vm.currentPage = 1;
        vm.disabledRFC = model ? model.disabledRFC : false;
        vm.mostrarDatos = model ? model.mostrarDatos : false;
        vm.validatePopup = model ? model.validatePopup : false;
        vm.validatePerson = model ? model.validatePerson : false;
        vm.roles = model ? model.roles : [];
        vm.rol = getRolUsuario();
        vm.revisaCotizaciones = revisaCotizaciones;
        vm.tieneCotizaciones = false;
        vm.cargandoCotizacion = false;
        vm.datosCotizacion = {};
        vm.datosCotizados = {};
        vm.fechaNacimiento = "";
        vm.email = "";
        vm.rfc = "";
        vm.sexo = "masculino";
        vm.telefono = "";
        vm.fechaConstitutiva = "";
        vm.ContInsuredSum = "";
        vm.ExtExpHomeInsuredSum = "";
        vm.DebRemInsuredSum = "";
        vm.FamCivLiaInsuredSum = "";
        vm.ListCotizaciones = [];
        vm.ListEntityFederativeHouse = getCatalogoEntidades();
        vm.ListMunicipalityHouse = [];
        vm.ListBanksHouse = [];
        vm.ListPostalCodeHouse = [];
        vm.ListTypeCLABE = [
            {id: '1', text: 'CLABE'},
            {id: '2', text: 'DEBITO'}
        ];
        vm.optionsdpx = {
            minDate: moment(new Date().setYear(new Date().getFullYear() - 150)).format('DD/MM/YYYY'),
            maxDate: moment(new Date().setYear(new Date().getFullYear() - 18)).format('DD/MM/YYYY')
        };
        vm.optionsdpxPM = {
            maxDate: moment(new Date().setYear(new Date().getFullYear())).format('DD/MM/YYYY')
        };
        vm.ListCurrency = getCatalogCurrency();
        vm.ListSecurityMeasurements = getCatalogSecurityMeasurements();
        vm.ListPaymentMethods = getCatalogPaymentMethods();
        vm.ListBorderWall = getCatalogBorderWall();
        vm.ListBanks = getCatalogoBanks();
        vm.jsonCoberturas = "{}";
        vm.tipoRiesgo = "";
        vm.getCatalogRoof = getCatalogRoof;
        vm.getCatalogEntity = getCatalogEntity;
        vm.getCatalogCodes = getCatalogCodes;
        vm.getJsonCoberturas = getJsonCoberturas;
        vm.getJsonCoberturasService = getJsonCoberturasService;
        vm.onChangeTipoDeRiesgo = onChangeTipoDeRiesgo;
        vm.cambiaJoyasTipoDeRiesgo = cambiaJoyasTipoDeRiesgo;
        vm.getCantidadLimite = getCantidadLimite;
        vm.realizaOperaciones = realizaOperaciones;
        vm.validarTabla = validarTabla;
        vm.validarSiCumple = validarSiCumple;
        vm.formatCurrency = formatCurrency;
        vm.validaRFCFecha = validaRFCFecha;
        vm.validaFechaConRFC = validaFechaConRFC;
        vm.onChangeListMunicipality = onChangeListMunicipality;
        vm.onChangeListEntity = onChangeListEntity;
        vm.encode = encode;
        vm.decode = decode;
        vm.eventClickCheckbox = eventClickCheckbox;
        vm.event = "";
        vm.edificio = {};
        vm.contenidos = {};
        vm.rcFamiliar = {};
        vm.roboMenaje = {};
        vm.dinero = {};
        vm.objetosPersonales = {};
        vm.electrodomesticos = {};
        vm.gastosAsalto = {};
        vm.gastosFinales = {};
        vm.gastosExtras = {};
        vm.remocionEscombros = {};
        vm.cristales = {};
        vm.asistenciaInformatica = {};
        vm.asistenciaLegal = {};
        vm.asistenciaViajes = {};
        vm.extensionViajes = {};

        revisaCotizaciones();
        getCatalogRiskType();
        getCatalogStructure();
        getCatalogClasification(); //agregada creación de Catálogo Clasificación

        function getCatalogStreetType() {
            insurancePymeSrv.getCatalogStreetTypeQuery().then(function (response) {
                var _listaObtenida = [];
                if (response.success) {
                    angular.forEach(response.info, function (value) {
                        _listaObtenida.push({
                            id: value.typeID,
                            text: value.street
                        });
                    });
                    vm.listStreetType = _listaObtenida;
                }
            }).catch(function (error) {

            });
        }

        //creada funcion para creación de Catálogo Clasification
        function getCatalogClasification() {
            insurancePymeSrv.getCatalogClasificationQuery().then(function (response) {
                var _listaObtenida = [];
                if (response.success) {
                    angular.forEach(response.info, function (value) {
                        _listaObtenida.push({
                            id: value.typeID, //modificar
                            text: value.street //modificar
                        });
                    });
                    vm.listClasification = _listaObtenida;
                }
            }).catch(function (error) {

            });
        }

        function getCatalogCardTypeQuery() {
            insurancePymeSrv.getCatalogCardTypeQuery().then(function (response) {
                var _listaObtenida = [];
                if (response.success) {
                    angular.forEach(response.info, function (value) {
                        _listaObtenida.push({
                            id: value.cardID,
                            text: value.cardType
                        });
                    });
                    vm.ListCardType = _listaObtenida;
                }
            }).catch(function (error) {

            });
        }

        function getCatalogPaymentTypeQuery() {
            var _type = !!vm.cotizacionSeleccionada;
            var _quotation = _type ? JSON.parse(vm.cotizacionSeleccionada.quotationJsonIni) : null;
            insurancePymeSrv.getCatalogPaymentTypeQuery().then(function (response) {
                var _listaObtenida = [];
                var _listaObtenidaSinAgentes = [];
                if (response.success) {
                    angular.forEach(response.info, function (value) {
                        
                        if (value.paymentManagerID === "2" || value.paymentManagerID === "8") {
                            _listaObtenidaSinAgentes.push({
                                id: value.paymentManagerID,
                                text: value.paymentManagerName
                            });
                        }
                        _listaObtenida.push({
                            id: value.paymentManagerID,
                            text: value.paymentManagerID === "1" ? "PAGO REFERENCIADO" : value.paymentManagerName
                        });
                    });

                    vm.ListPaymentTypeAll = _listaObtenida;
                    vm.ListPaymentTypeSinAgentes = _listaObtenidaSinAgentes;
                    if(_type) {
                        if(_quotation.catalogosCotizacion.kindPaid.type.id == 1 || _quotation.catalogosCotizacion.kindPaid.type.id == 2){
                            vm.ListPaymentType = _listaObtenida;
                        } else {
                            vm.ListPaymentType = _listaObtenidaSinAgentes;
                        }                        
                    } else {
                        if(vm.cmd.kindPaid.type.id == 1 || vm.cmd.kindPaid.type.id == 2){
                            vm.ListPaymentType = _listaObtenida;
                        } else {
                            vm.ListPaymentType = _listaObtenidaSinAgentes;
                        }
                    }
                }
            }).catch(function (error) {
                
            });
        }

        function getCatalogRoof(lastValue, newValue) {
            insurancePymeSrv.getCatalogRoofType(newValue.id).then(function (response) {
                var _listaObtenida = [];
                if (response.success) {
                    angular.forEach(response.info, function (value) {
                        _listaObtenida.push({
                            id: value.roofTypeID,
                            text: value.roofType
                        });
                    });
                    vm.cmd.kindRoof = {};
                    vm.listRoof = _listaObtenida;
                }
            }).catch(function (error) {

            });
        }

        function getCatalogStructure() {
            insurancePymeSrv.getCatalogWallType().then(function (response) {
                var _listaObtenida = [];
                if (response.success) {
                    angular.forEach(response.info, function (value) {
                        _listaObtenida.push({
                            id: value.wallTypeID,
                            text: value.wallType
                        });
                    });

                    vm.listStructure = _listaObtenida;
                }
            }).catch(function (error) {

            });
        }

        function getCatalogRiskType() {
            insurancePymeSrv.getCatalogInsuranceRiskType(1, 1).then(function (response) {
                var _listaObtenida = [];
                if (response.success) {
                    angular.forEach(response.info, function (value) {
                        _listaObtenida.push({
                            id: value.areaCode,
                            text: value.description
                        });
                    });
                    vm.listRiskType = _listaObtenida;
                }
            }).catch(function (error) {

            });

            return [
                {id: 1, text: 'UNIFAMILIAR'},
                {id: 2, text: 'FINES DE SEMANA'},
                {id: 3, text: 'CABAÑAS'},
                {id: 4, text: 'CONDOMINIO VERTICAL O CONDOMINIO HORIZONTAL'}
            ];
        }

        function getCatalogCurrency() {
            return [
                {id: 1, text: "PESOS"},
                {id: 2, text: "DOLARES"}
            ];
        }

        function getCatalogBorderWall() {
            return [
                {id: "true", text: "SI"},
                {id: "false", text: "NO"}
            ];
        }

        function getCatalogSecurityMeasurements() {
            return [
                {id: 1, text: "VIGILANCIA"},
                {id: 2, text: "ALARMA LOCAL/CENTRAL"},
                {id: 3, text: "VIGILANCIA Y ALARMA LOCAL/CENTRAL"},
                {id: 99999, text: "SIN MEDIDAS DE SEGURIDAD"}
            ];
        }

        function getCatalogPaymentMethods() {
            return [
                {id: 1, text: "CONTADO"},
                {id: 2, text: "SEMESTRAL"},
                {id: 3, text: "TRIMESTRAL"},
                {id: 4, text: "MENSUAL"}
            ];
        }

        function getCatalogoEntidades() {
            var _listaObtenida = [];

            insurancePymeSrv.getCatalogEntityFederativePyme().then(function (_res) {
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

        function getCatalogEntity(newValue, type) {
            var _listaObtenida = [];
            insurancePymeSrv.getCatalogMunicipalityPyme(newValue.id).then(function (_res) {
                if (_res.success) {
                    angular.forEach(_res.info, function (value) {
                        _listaObtenida.push({
                            id: value.municipalityID,
                            text: value.delegationOrMunicipality
                        });
                    });
                    switch (type) {
                        case 'fiscal':
                            vm.ListEntityFiscal = _listaObtenida;
                            break;
                        case 'contractor':
                            vm.cmd.emission.contract.entityContractor = {};
                            vm.cmd.emission.contract.pcContractor = {};
                            vm.ListEntityContractor = _listaObtenida;
                            break;
                        case 'beneficiary':
                            vm.cmd.emission.beneficiary.entityBeneficiary = {};
                            vm.cmd.emission.beneficiary.pcBeneficiary = {};
                            vm.ListEntityBeneficiary = _listaObtenida;
                            break;
                    }
                }
            });
        }

        function changeSameAddress() {
            if (vm.cmd.emission.sameAddress) {
                initEmission();
            } else {
                cleanDataEmission();
            }
        }

        function getCatalogCodes(newValue, type) {
            var _listaObtenida = [];
            insurancePymeSrv.getCatalogPostalCode(newValue.id).then(function (_res) {
                if (_res.success) {
                    angular.forEach(_res.info.postalCode, function (value) {
                        _listaObtenida.push({
                            id: value,
                            text: value
                        });
                    });
                    switch (type) {
                        case 'fiscal':
                            vm.ListPCFiscal = _listaObtenida;
                            break;
                        case 'contractor':
                            vm.cmd.emission.contract.pcContractor = {};
                            vm.ListPCContractor = _listaObtenida;
                            break;
                        case 'beneficiary':
                            vm.cmd.emission.beneficiary.pcBeneficiary = {};
                            vm.ListPCBeneficiary = _listaObtenida;
                            break;
                    }
                }
            });
        }

        function onChangeListEntity() {
            var _listaObtenida = [];
            if(!vm.cmd.dataHouseEntityRisk.type) return;
            
            insurancePymeSrv.getCatalogMunicipalityCars(vm.cmd.dataHouseEntityRisk.type.id).then(function (_res) {
                if (_res.success) {
                    angular.forEach(_res.info, function (value) {
                        _listaObtenida.push({
                            id: value.municipalityID,
                            text: value.delegationOrMunicipality
                        });
                    });
                    vm.cmd.dataHouseMunicipalityRisk = {};
                    vm.cmd.dataHousePostalCodeRisk = {};
                    vm.ListPostalCodeHouse = [];
                    vm.ListMunicipalityHouse = _listaObtenida;
                }
            });
        }

        function onChangeListMunicipality() {
            var _listaObtenida = [];
            if (!vm.cmd.dataHouseMunicipalityRisk.type) return;

            insurancePymeSrv.getCatalogPostalCode(vm.cmd.dataHouseMunicipalityRisk.type.id).then(function (_res) {
                if (_res.success) {
                    angular.forEach(_res.info.postalCode, function (value) {
                        _listaObtenida.push({
                            id: value,
                            text: value
                        });
                    });
                    vm.cmd.dataHousePostalCodeRisk = {};
                    vm.ListPostalCodeHouse = _listaObtenida;
                }
            });
        }

        function getCatalogoBanks() {
            var _listaObtenida = [];
            console.log();

            insurancePymeSrv.getCatalogBanksPyme().then(function (_res) {
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

        function getYearExpirationList() {
            var _list = [];
                        
            for (var _year = (new Date()).getFullYear(), i = 0; i < 7; i++) 
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

        function selectBankId() {
            vm.cmd.cardType = typeof vm.cmd.cardType === 'undefined' ? {} : vm.cmd.cardType;            
            if(vm.cmd.dataBanks.type.text.toString().toUpperCase().startsWith("AMERICAN EXPRESS")) {
                vm.accLen = 15;
                vm.cvvLen = 4;
                vm.cmd.cardType.type = vm.ListCardType[getIndexListCardType('AMERICAN')];
            } else {
                vm.accLen = 16;
                vm.cvvLen = 3;
                vm.cmd.cardType.type = [];
            }
        }

        function selectTypeCard() {
            if(vm.emission.payment.accountNumber) {
                switch (vm.emission.payment.accountNumber.toString().substr(0, 1)) {
                    case '3':
                        vm.cmd.cardType.type = vm.ListCardType[getIndexListCardType('AMERICAN')];
                        break;
                    case '4':
                        vm.cmd.cardType.type = vm.ListCardType[getIndexListCardType('VISA')];
                        break;
                    case '5':
                        vm.cmd.cardType.type = vm.ListCardType[getIndexListCardType('MASTER')];
                        break;
                }
            }
        }

        function getIndexListCardType(bankName) {
            for(var i = 0; i < vm.ListCardType.length; i++) {
                if(vm.ListCardType[i].text.toString().toUpperCase().startsWith(bankName))
                    return i;
            }
        }

        function cleanForm() {
            vm.stepForm = {
                step: 0,
                stepA: false,
                stepB: false,
                stepC: false,
                stepD: false
            };
        }

        function regresarMain() {
            $state.go('insurance.main', {model: $stateParams.model});
        }

        function regresarPaginaCotizacion() {
            if (vm.ListCotizaciones.length > 1) {
                pagina1();
            } else {
                var sendModel = $stateParams.model;
                $state.go('insurance.main', {model: sendModel});
            }
        }

        function cotizarContratar() {
            vm.isClienteObt = false;
            if (vm.cotizacionSeleccionada) {
                pagina3();
            } else {
                pagina2();
            }
        }

        function pagina1() {
            cleanForm();
            vm.stepForm.step = 1;
            vm.stepForm.stepA = true;
        }

        function pagina2() {
            cleanForm();
            vm.stepForm.step = 2;
            vm.stepForm.stepB = true; 
            getJsonCoberturasService();
        }

        function pagina3() {
            cleanForm();
            getCatalogStreetType();
            getCatalogCardTypeQuery();
            getCatalogPaymentTypeQuery();
            vm.yearExpirationList = getYearExpirationList();
            vm.monthExpirationList = getMonthExpirationList();
            vm.emission.payment = {};
            vm.emission.payment.email = vm.emailUser;
            vm.emissionPersonType = model.personType === '1' ? 'F' : 'M';
            if (vm.cotizacionSeleccionada) {
                vm.emissionPersonType = vm.cotizacionSeleccionada.tipoCliente === 1 ? 'F' : 'M';
                vm.jsonQuotation = JSON.parse(vm.cotizacionSeleccionada.quotationJsonFin).outHomeInsuranceQuotation.insurancePaymentData;
                vm.cmd.kindPaid.type = JSON.parse(vm.cotizacionSeleccionada.quotationJsonIni).catalogosCotizacion.kindPaid.type;
            }
            vm.stepForm.step = 3;
            vm.stepForm.stepC = true;
            window.scrollTo(0, angular.element('contratacion').offsetTop);
        }

        function revisaCotizaciones() {
            vm.tieneCotizaciones = false;
            vm.ListCotizaciones = getListaCotizaciones();
        }

        function getListaCotizaciones() {

            var _listaObtenida = [];
            var _params = {
                language: 'SPA',
                estado: "VIGENTE",
                idCliente: vm.numeroCliente,
                tipoCliente: vm.personType,
                productKey: 'PYME'
            };

            insurancePymeSrv.getListQuotations(_params).then(function (_res) {
                if (_res.success) {
                    angular.forEach(_res.info, function (value) {
                        var primerApe = vm.personType === '1' ? value.apellidoPaternoCliente : "";
                        var segundoApe = vm.personType === '1' ? value.apellidoMaternoCliente : "";
                        var name = value.nombreCliente + " " + primerApe + " " + segundoApe;
                        _listaObtenida.push({
                            cotizacion: value.idCotizacion,
                            poliza: value.idPoliza,
                            nombre: value.nombreCliente,
                            primerApellido: primerApe,
                            segundoApellido: segundoApe,
                            nombreCompleto: name,
                            fecha: moment(new Date().setTime(value.fechaCotizacion)).format('DD-MM-YYYY'),
                            vigencia: moment(new Date().setTime(value.vigenciaCotizacion)).format('DD-MM-YYYY'),
                            prima: value.monto,
                            estadoPoliza: value.estado,
                            numeroCliente: value.idCliente,
                            tipoCliente: value.tipoCliente,
                            isCliente: value.isCliente,
                            fechaNacimiento: vm.personType === '1' ? moment(new Date().setTime(value.fechaNacimiento)).format('DD-MM-YYYY') : value.fechaNacimiento,
                            rfcCliente: value.rfcCliente,
                            sexoCliente: value.sexoCliente,
                            emailCliente: value.mailCliente,
                            telefonoCliente: value.telefonoCliente,
                            quotationJsonIni: value.quotationJsonIni,
                            quotationJsonFin: value.quotationJsonFin,
                            emisionJsonIni: value.emisionJsonIni,
                            emisionJsonFin: value.emisionJsonFin,
                            status: value.vstatus
                        });
                    });
                    
                    if (_res.info.length > 0) {
                        vm.tieneCotizaciones = true;
                        pagina1();
                    } else {
                        pagina2();
                    }
                } else {
                    pagina2();
                }
            });
            return _listaObtenida;
        }

        function setCotizacion(json) {
            vm.jsonCotizacion.catalogosCotizacion = vm.cmd;
            var _fechaNacimiento = "";
            
            if (vm.validatePerson) {
                _fechaNacimiento = moment(vm.birthDay, "DD/MM/YYYY").format('YYYY-MM-DD');
            } else {
                _fechaNacimiento = moment(vm.fechaNacimiento).format('YYYY-MM-DD');
            }

            var _params = {
                language: 'SPA',
                idCliente: vm.numeroCliente,
                idCotizacion: vm.datosCotizados.numeroCotizacion,
                idPoliza: 0,
                fechaCotizacion: moment(new Date()).format('YYYY-MM-DD'),
                vigenciaCotizacion: moment(new Date(), 'YYYY-MM-DD').add(15, 'days').format('YYYY-MM-DD'),
                monto: Math.ceil(vm.datosCotizados.primaTotal),
                tipoCliente: vm.personType,
                isCliente: vm.numeroCliente === "9999" ? '0' : '1',
                nombreCliente: vm.personType.toString() === '1' ? vm.nombres.toUpperCase() : vm.nombreCliente.toUpperCase(),
                fechaNacimiento: _fechaNacimiento,
                rfcCliente: vm.fiscalIDNumber,
                sexoCliente: vm.sexo === 'masculino' ? '1' : '2',
                mailCliente: vm.emailUser,
                telefonoCliente: vm.phoneUser,
                quotationJsonInit: vm.jsonCotizacion,
                quotationJsonEnd: json,
                productKey: 'PYME'
            };

            if (vm.personType.toString() === '1') {
                _params.apellidoPaternoCliente = vm.apePaterno.toUpperCase();
                _params.apellidoMaternoCliente = vm.apeMaterno.toUpperCase();
            }

            insurancePymeSrv.getCotizationAdd(_params).then(function (_res) {
                if (_res.success) {
                    vm.datosCotizacion = vm.datosCotizados;
                    CommonModalsSrv.done("Envío de Cotización exitosa Número de Cotización: " + vm.datosCotizacion.numeroCotizacion);
                    vm.jsonQuotation = json.outHomeInsuranceQuotation.insurancePaymentData;
                } else {
                    CommonModalsSrv.error("Envío de Cotización no fue exitoso.");
                }
                vm.cargandoCotizacion = false;
            });
        }

        function getRolUsuario() {
            var user = JSON.parse(JSON.parse(sessionStorage["ngStorage-user"]));
            vm.roles = user.roles;

            if (angular.isDefined(vm.roles) && angular.isArray(vm.roles)) {
                if (vm.roles.length === 1) {
                    return vm.roles[0];
                } else {
                    if (vm.roles.length > 1) {

                        var prioridad = 999;

                        for (var i = 0; i < vm.roles.length; i++) {
                            if (vm.roles[i] === "SEGUROS") {
                                if (prioridad > 1) {
                                    prioridad = 1;
                                }
                            }
                            if (vm.roles[i] === "ASESOR") {
                                if (prioridad > 2) {
                                    prioridad = 2;
                                }
                            }
                        }

                        switch (prioridad) {
                            case 1:
                                vm.rol = "SEGUROS";
                                return "SEGUROS";
                            case 2:
                                vm.rol = "ASESOR";
                                return "ASESOR";
                        }
                    }
                }
            }
        }

        function validateBirthdateRFC() {
            var v_birthday = moment(vm.fechaNacimiento).format('DD/MM/YYYY') + '';
            var v_constitutive_date = vm.fechaConstitutiva + '';
            var v_rfc = vm.rfc;
            var birthdayFromRFC = v_rfc.replace(/^([A-ZÑ\x26]{3,4})(([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1]))(((([A-Z]|[a-z]|[0-9]){3}))?)$/, "$2") + '';
            v_birthday = v_birthday.replace(/^([0-9]{2})(\/)([0-9]{2})(\/)([0-9]{2})([0-9]{2})$/, "$6$3$1") + '';

            if (v_birthday !== null && v_birthday !== '' && birthdayFromRFC !== null && birthdayFromRFC !== '' && birthdayFromRFC !== v_birthday && (vm.personType + '') === '1') {
                CommonModalsSrv.error("La fecha de nacimiento no coincide con la fecha del RFC");
                
            }

            if (v_birthday !== null && v_birthday !== '' && v_constitutive_date !== null && v_constitutive_date !== '' && v_constitutive_date !== v_birthday && vm.personType === 2) {
                CommonModalsSrv.error("La fecha constitutiva no coincide con la fecha del RFC");
                
            }
        }

        function justAlphabet(field) {
            var target = document.getElementById(field);
            var v_names = (target.value + '').split('');
            var res = "";

            for (var count = 0; count < v_names.length; count++) {
                if ((v_names[count] + '').match(/^[a-zA-ZÁÉÍÓÚÑáéíóúñ ]+$/)) {
                    res += v_names[count];
                }
            }
            target.value = res + '';
        }

        function validarDatosACotizar() {
            if (!vm.disabledRFC && !vm.validatePerson) {
                if (vm.fechaNacimiento === "") {
                    if (vm.personType === '1') {
                        CommonModalsSrv.error("Favor de Capturar el campo de Fecha de Nacimiento");
                        return false;
                    } else {
                        CommonModalsSrv.error("Favor de Capturar el campo de Fecha de Constitución");
                        return false;
                    }
                }
            }
            if (!vm.disabledRFC) {
                calculaRFC();
            } else {
                vm.bnd = true;
            }
            if (vm.bnd) {
                cotizarSeguroPyme();
            }
        }

        function cotizarSeguroPyme() {
            vm.cargandoCotizacion = true;
            var edificioSum = vm.jsonCoberturas.coberturas.edificio.monto;
            var hidroEdificioSum = vm.jsonCoberturas.coberturas.edificio.coberturasIntegrantes.hidroEdificio.monto;
            var bienesEdificioSum;
            var edificioTerminadoSum;
            var edificioDesocupadoSum;
            var edificioConstruccionSum;
            var edificioFijaSum;
            var securityId = typeof vm.cmd.securityActions === 'undefined' ? '' : vm.cmd.securityActions.type.id;
            var colindanciaId = typeof vm.cmd.borderWall === 'undefined' ? "false" : vm.cmd.borderWall.type.id;
            if (vm.jsonCoberturas.coberturas.edificio.coberturasIntegrantes.hidroEdificio.coberturasIntegrantes) {
                bienesEdificioSum = vm.jsonCoberturas.coberturas.edificio.coberturasIntegrantes.hidroEdificio.coberturasIntegrantes.bienesEdificio.monto;
                edificioTerminadoSum = vm.jsonCoberturas.coberturas.edificio.coberturasIntegrantes.hidroEdificio.coberturasIntegrantes.limTerminado.monto;
                edificioDesocupadoSum = vm.jsonCoberturas.coberturas.edificio.coberturasIntegrantes.hidroEdificio.coberturasIntegrantes.limDesocupado.monto;
                edificioConstruccionSum = vm.jsonCoberturas.coberturas.edificio.coberturasIntegrantes.hidroEdificio.coberturasIntegrantes.limConstruccion.monto;
                edificioFijaSum = vm.jsonCoberturas.coberturas.edificio.coberturasIntegrantes.hidroEdificio.coberturasIntegrantes.limFija.monto;
            }
            var terremotoEdificioSum = vm.jsonCoberturas.coberturas.edificio.coberturasIntegrantes.terremotoEdificio.monto;
            var bienesEdificioChecked;
            var edificioTerminadoChecked;
            var edificioDesocupadoChecked;
            var edificioConstruccionChecked;
            var edificioFijaChecked;
            if (vm.jsonCoberturas.coberturas.edificio.coberturasIntegrantes.hidroEdificio.coberturasIntegrantes) {
                bienesEdificioChecked = vm.jsonCoberturas.coberturas.edificio.coberturasIntegrantes.hidroEdificio.coberturasIntegrantes.bienesEdificio.checked;
                edificioTerminadoChecked = vm.jsonCoberturas.coberturas.edificio.coberturasIntegrantes.hidroEdificio.coberturasIntegrantes.limTerminado.checked;
                edificioDesocupadoChecked = vm.jsonCoberturas.coberturas.edificio.coberturasIntegrantes.hidroEdificio.coberturasIntegrantes.limDesocupado.checked;
                edificioConstruccionChecked = vm.jsonCoberturas.coberturas.edificio.coberturasIntegrantes.hidroEdificio.coberturasIntegrantes.limConstruccion.checked;
                edificioFijaChecked = vm.jsonCoberturas.coberturas.edificio.coberturasIntegrantes.hidroEdificio.coberturasIntegrantes.limFija.checked;
            }
            var contenidosMontoSum = vm.jsonCoberturas.coberturas.contenidos.monto;
            var hidroContenidosSum = vm.jsonCoberturas.coberturas.contenidos.coberturasIntegrantes.hidroContenidos.monto;
            var bienesContenidosSum;
            var limContenidosSum;
            if (vm.jsonCoberturas.coberturas.contenidos.coberturasIntegrantes.hidroContenidos.coberturasIntegrantes) {
                bienesContenidosSum = vm.jsonCoberturas.coberturas.contenidos.coberturasIntegrantes.hidroContenidos.coberturasIntegrantes.bienesContenidos.monto;
                limContenidosSum = vm.jsonCoberturas.coberturas.contenidos.coberturasIntegrantes.hidroContenidos.coberturasIntegrantes.limContenidos.monto;
            }
            var terremotoContenidosSum = vm.jsonCoberturas.coberturas.contenidos.coberturasIntegrantes.terremotoContenidos.monto;
            var remocionEscombrosSum = vm.jsonCoberturas.coberturas.remocionEscombros.monto;
            var rcFamiliarSum = vm.jsonCoberturas.coberturas.rcFamiliar.monto;
            var rcFamiliarArrendatarioSum = vm.jsonCoberturas.coberturas.rcFamiliar.coberturasIntegrantes.rcArrendatario.monto;
            var rcFamiliarArrendatarioChecked = vm.jsonCoberturas.coberturas.rcFamiliar.coberturasIntegrantes.rcArrendatario.checked;
            var cristalesSum = vm.jsonCoberturas.coberturas.cristales.monto;
            var cristalesChecked = vm.jsonCoberturas.coberturas.cristales.checked;
            var roboMenajeSum = vm.jsonCoberturas.coberturas.roboMenaje.monto;
            var joyasSum = vm.jsonCoberturas.coberturas.roboMenaje.coberturasIntegrantes.joyas.monto;
            var gastosAsaltoSum = vm.jsonCoberturas.coberturas.gastosAsalto.monto;
            var dineroSum = vm.jsonCoberturas.coberturas.dinero.monto;
            var dineroCreditSum = vm.jsonCoberturas.coberturas.dinero.coberturasIntegrantes.usoTarjetasDinero.monto;
            var dineroCreditChecked = vm.jsonCoberturas.coberturas.dinero.coberturasIntegrantes.usoTarjetasDinero.checked;
            var objetosPersonalesSum = vm.jsonCoberturas.coberturas.objetosPersonales.monto;
            var objetosPersonalesObjetosSum;
            if (vm.jsonCoberturas.coberturas.objetosPersonales.coberturasIntegrantes.objetosObjetos) {
                objetosPersonalesObjetosSum = vm.jsonCoberturas.coberturas.objetosPersonales.coberturasIntegrantes.objetosObjetos.monto;
            }
            var objetosPersonalesBicicletaSum = vm.jsonCoberturas.coberturas.objetosPersonales.coberturasIntegrantes.bicicletasObjetos.monto;
            var objetosPersonalesObjetosChecked;
            if (vm.jsonCoberturas.coberturas.objetosPersonales.coberturasIntegrantes.objetosObjetos) {
                objetosPersonalesObjetosChecked = vm.jsonCoberturas.coberturas.objetosPersonales.coberturasIntegrantes.objetosObjetos.checked;
            }
            var electrodomesticosSum = vm.jsonCoberturas.coberturas.electrodomesticos.monto;
            var electrodomesticosMovilSum = vm.jsonCoberturas.coberturas.electrodomesticos.coberturasIntegrantes.equipoMovil.monto;
            var electrodomesticosChecked = vm.jsonCoberturas.coberturas.electrodomesticos.checked;
            var electrodomesticosMovilChecked = vm.jsonCoberturas.coberturas.electrodomesticos.coberturasIntegrantes.equipoMovil.checked;
            var asistenciaViajesSum = vm.jsonCoberturas.coberturas.asistenciaViajes.monto;
            var extensionViajesSum;
            if (vm.jsonCoberturas.coberturas.extensionViajes) {
                extensionViajesSum = vm.jsonCoberturas.coberturas.extensionViajes.monto;
            }
            var asistenciaLegalSum;
            if (vm.jsonCoberturas.coberturas.asistenciaLegal) {
                asistenciaLegalSum = vm.jsonCoberturas.coberturas.asistenciaLegal.monto;
            }
            asistenciaInformaticaSum = undefined;
            if (vm.jsonCoberturas.coberturas.asistenciaInformatica) {
                var asistenciaInformaticaSum = vm.jsonCoberturas.coberturas.asistenciaInformatica.monto;
            }
            var gastosFinalesSum = vm.jsonCoberturas.coberturas.gastosFinales.monto;
            var gastosExtrasSum = vm.jsonCoberturas.coberturas.gastosExtras.monto;
            var asistenciaViajesChecked = vm.jsonCoberturas.coberturas.asistenciaViajes.checked;
            var extensionViajesChecked;
            if (vm.jsonCoberturas.coberturas.extensionViajes) {
                extensionViajesChecked = vm.jsonCoberturas.coberturas.extensionViajes.checked;
            }
            var asistenciaLegalChecked;
            if (vm.jsonCoberturas.coberturas.asistenciaLegal) {
                asistenciaLegalChecked = vm.jsonCoberturas.coberturas.asistenciaLegal.checked;
            }
            var asistenciaInformaticaChecked;
            if (vm.jsonCoberturas.coberturas.asistenciaInformatica) {
                asistenciaInformaticaChecked = vm.jsonCoberturas.coberturas.asistenciaInformatica.checked;
            }
            var gastosFinalesChecked = vm.jsonCoberturas.coberturas.gastosFinales.checked;
            var hidroContenidosFlag = hidroContenidosSum ? "true" : "false";
            var terremotoContenidosFlag = terremotoContenidosSum ? "true" : "false";
            var hidroEdificioFlag = hidroEdificioSum ? "true" : "false";
            var terremotoEdificioFlag = terremotoEdificioSum ? "true" : "false";
            var edificioFlag = edificioSum ? "true" : "false";
            var gastosAsaltoFlag = gastosAsaltoSum === 'AMPARADO' ? "true" : "false";
            var asistenciaViajesFlag = asistenciaViajesSum === 'AMPARADO' ? "true" : "false";
            var extensionViajesFlag = extensionViajesSum === 'AMPARADO' ? "true" : "false";
            var asistenciaLegalFlag = asistenciaLegalSum === 'AMPARADO' ? "true" : "false";
            var asistenciaInformaticaFlag = asistenciaInformaticaSum === 'AMPARADO' ? "true" : "false";
            var gastosFinalesFlag = gastosFinalesSum === 'AMPARADO' ? "true" : "false";
            hidroContenidosSum = hidroContenidosSum ? hidroContenidosSum : 0;
            terremotoContenidosSum = terremotoContenidosSum ? terremotoContenidosSum : 0;
            hidroEdificioSum = hidroEdificioSum ? hidroEdificioSum : 0;
            terremotoEdificioSum = terremotoEdificioSum ? terremotoEdificioSum : 0;
            bienesEdificioSum = bienesEdificioSum ? bienesEdificioSum : 0;
            edificioTerminadoSum = edificioTerminadoSum ? edificioTerminadoSum : 0;
            edificioDesocupadoSum = edificioDesocupadoSum ? edificioDesocupadoSum : 0;
            edificioConstruccionSum = edificioConstruccionSum ? edificioConstruccionSum : 0;
            edificioFijaSum = edificioFijaSum ? edificioFijaSum : 0;
            edificioSum = edificioSum ? edificioSum : 0;
            contenidosMontoSum = contenidosMontoSum ? contenidosMontoSum : 0;
            remocionEscombrosSum = remocionEscombrosSum ? remocionEscombrosSum : 0;
            rcFamiliarSum = rcFamiliarSum ? rcFamiliarSum : 0;
            rcFamiliarArrendatarioSum = rcFamiliarArrendatarioSum === 'AMPARADO' ? rcFamiliarSum : 0;
            cristalesSum = cristalesSum ? cristalesSum : 0;
            roboMenajeSum = roboMenajeSum ? roboMenajeSum : 0;
            joyasSum = joyasSum ? joyasSum : 0;
            dineroSum = dineroSum ? dineroSum : 0;
            dineroCreditSum = dineroCreditSum ? dineroCreditSum : 0;
            objetosPersonalesSum = objetosPersonalesSum ? objetosPersonalesSum : 0;
            objetosPersonalesObjetosSum = objetosPersonalesObjetosSum ? objetosPersonalesObjetosSum : 0;
            objetosPersonalesBicicletaSum = objetosPersonalesBicicletaSum ? objetosPersonalesBicicletaSum : 0;
            electrodomesticosSum = electrodomesticosSum ? electrodomesticosSum : 0;
            electrodomesticosMovilSum = electrodomesticosMovilSum ? electrodomesticosMovilSum : 0;
            gastosExtrasSum = gastosExtrasSum ? gastosExtrasSum : 0;
            remocionEscombrosSum = remocionEscombrosSum ? remocionEscombrosSum : 0;
            var beachFrontCode = hidroContenidosFlag === "true" ? 2 : 1;
            var _params = {};
            _params.language = 'SPA';
            _params.agentID = $scope.$parent.agentSelected.id;
            _params.ClientNumber = vm.numeroCliente;
            _params.InsurancePolicyDate = moment(new Date()).format('YYYY-MM-DD');
            _params.PolicyMaturityDate = moment(new Date(), 'YYYY-MM-DD').add(1, 'years').format('YYYY-MM-DD');
            switch (vm.cmd.currency.type.id) {
                case 1:
                    _params.Currency = "MXN";
                    break;
                case 2:
                    _params.Currency = "USD";
                    break;
            }
            _params.PaymentMethod = vm.cmd.kindPaid.type.id;
            _params.FederalEntityID = vm.cmd.dataHouseEntityRisk.type.id;
            _params.DelegationMunicipalityID = vm.cmd.dataHouseMunicipalityRisk.type.id;
            _params.PostalCode = vm.cmd.dataHousePostalCodeRisk.type.id;
            _params.Street = vm.calle;
            _params.WallTypeID = vm.cmd.kindStructure.type.id;
            _params.RoofTypeID = vm.cmd.kindRoof.type.id;
            _params.RiskTypeDetailAreaCode = vm.cmd.kindRisk.type.id;
            _params.BeachFrontCode = beachFrontCode;
            _params.ContInsuredSum = contenidosMontoSum;
            _params.ContHydromPhenomCoverageFlag = hidroContenidosFlag;
            _params.ContHydromPhenomCoverageInsuredSum = hidroContenidosSum;
            _params.ContHydromPhenomCoverageStoredItemsInsuredSum = bienesEdificioSum;
            _params.ContEarthquakeEruptCoverageFlag = terremotoContenidosFlag;
            _params.ContEarthquakeEruptCoverageInsuredSum = terremotoContenidosSum;
            _params.ExtExpHomeInsuredSum = gastosExtrasSum;
            _params.ExtExpHomeHydromPhenomCoverageFlag = hidroContenidosFlag;
            _params.ExtExpHomeHydromPhenomInsuredSum = "0";
            _params.ExtExpHomeEarthquakeEruptCoverageFlag = terremotoContenidosFlag;
            _params.ExtExpHomeEarthquakeEruptInsuredSum = "0";
            _params.DebRemInsuredSum = remocionEscombrosSum;
            _params.DebRemHydromPhenomCoverageFlag = hidroContenidosFlag;
            _params.DebRemHydromPhenomInsuredSum = "0";
            _params.DebRemEarthquakeEruptCoverageFlag = terremotoContenidosFlag;
            _params.DebRemEarthquakeEruptInsuredSum = "0";
            _params.FamCivLiaInsuredSum = rcFamiliarSum;
            if (rcFamiliarArrendatarioChecked) {
                _params.FamCivLiaTenCivLiaInsuredSum = rcFamiliarArrendatarioSum;
            }
            _params.BuilCoverageFlag = edificioFlag;
            _params.BuilInsuredSum = edificioSum;
            _params.BuilHydromPhenomCoverageFlag = hidroEdificioFlag;
            _params.BuilHydromPhenomInsuredSum = hidroEdificioSum;
            _params.BuilHydromPhenomFinishedBuildingInsuredSum = edificioTerminadoSum;
            _params.BuilHydromPhenomVacatedBuildingInsuredSum = edificioDesocupadoSum;
            _params.BuilHydromPhenomConstructionBuildingInsuredSum = edificioConstruccionSum;
            _params.BuilHydromPhenomFixedAdaptationsInsuredSum = edificioFijaSum;
            _params.BuilEarthquakeEruptCoverageFlag = terremotoEdificioFlag;
            _params.BuilEarthquakeEruptInsuredSum = terremotoEdificioSum;
            if (cristalesChecked) {
                _params.CrystalsInsuredSum = cristalesSum;
            }
            _params.HouseholdEquipmentTheftInsuredSum = roboMenajeSum;
            _params.JewelryAndValuablesInsuredSum = joyasSum;
            _params.MedicalExpensesCoverage = gastosAsaltoFlag;
            _params.CashSecInsuredSum = dineroSum;
            if (dineroCreditChecked) {
                _params.CashSecCreditCardFraudInsuredSum = dineroCreditSum;
            }
            _params.PerItemsInsuredSum = objetosPersonalesSum;
            _params.PerItemsPersonalItemsInsuredSum = objetosPersonalesObjetosSum;
            _params.PerItemsBicycleInsuredSum = objetosPersonalesBicicletaSum;
            _params.SecurityMeasuresCode = securityId;
            _params.AdjoiningHomeFlag = colindanciaId;
            if (electrodomesticosChecked) {
                _params.ElecEquipInsuredSum = electrodomesticosSum;
            }
            if (electrodomesticosMovilChecked) {
                _params.ElecEquipMobileInsuredSum = electrodomesticosMovilSum;
            }
            if (asistenciaViajesChecked) {
                _params.HomeAssistanceCoverageFlag = asistenciaViajesFlag;
            }
            if (extensionViajesChecked) {
                _params.TravelsCoverageFlag = extensionViajesFlag;
            }
            if (asistenciaLegalChecked) {
                _params.LegalAssistanceCoverageFlag = asistenciaLegalFlag;
            }
            if (asistenciaInformaticaChecked) {
                _params.CompAssistServCoverageFlag = asistenciaInformaticaFlag;
            }
            if (gastosFinalesChecked) {
                _params.FinalExpensesCoverageFlag = gastosFinalesFlag;
            }

            vm.jsonCotizacion.Street = _params.Street;
            
            insurancePymeSrv.getServiceCotizacionPyme(_params).then(function (_res) {
                if (_res.success) {
                    vm.datosCotizados = {
                        primaNeta: _res.info.insurancePaymentData.netPremium,
                        derechosPoliza: _res.info.insurancePaymentData.entitlement,
                        recargos: _res.info.insurancePaymentData.surcharge,
                        iva: _res.info.insurancePaymentData.vat,
                        primaTotal: _res.info.insurancePaymentData.totalPremium,
                        numeroCotizacion: _res.info.quotationNumber,
                        coberturas: _res.info.coverageList

                    };
                    var jsonEnd = _res.response;
                    vm.primatotalImpresion = _res.info.insurancePaymentData.totalPremium;
                    jsonEnd.outCommonHeader = {};
                    setCotizacion(jsonEnd);

                } else {
                    CommonModalsSrv.error("Error en el Servicio, no se encuentra disponible - code: " + _res.info.transactionID);
                    vm.cargandoCotizacion = false;
                }
            });
        }

        function cleanDataEmission() {
            vm.isClienteObt = false;
            vm.emission.contract = {
                gender: '1',
                name: '',
                lastName: '',
                secondLastName: '',
                birthdate: moment(new Date()).format('YYYY-MM-DD'),
                fiscalIDNumber: '',
                email: '',
                phone: '',
                street: '',
                numberExt: '',
                numberInt: '',
                neighboarhood: '',
                stateContractor: {
                    type: {}
                },
                entityContractor: {
                    type: {}
                },
                pcContractor: {
                    type: {}
                }
            };
            vm.cmd.emission.contract = {
                stateContractor: {
                    type: null
                },
                entityContractor: {
                    type: null
                },
                pcContractor: {
                    type: null
                }
            };
        }

        function initEmission() {
            var fecha = "";
            var fechaSeleccion = "";
            var _type = !!vm.cotizacionSeleccionada;
            var _quotation = _type ? JSON.parse(vm.cotizacionSeleccionada.quotationJsonIni) : null;
            vm.flagSameAddressCheckBox = !!vm.cotizacionSeleccionada;
            vm.isClienteObt = true;
            
            if (vm.numeroCliente === "9999") {
                if (typeof vm.fechaNacimiento === 'string') {
                    fecha = vm.fechaNacimiento;
                } else {
                    fecha = moment(vm.fechaNacimiento).format("DD/MM/YYYY");
                    if (typeof fecha === 'undefined' || fecha === 'Invalid date') {
                        fecha = moment(vm.fechaNacimiento, "DD/MM/YYYY");
                        fecha = moment(fecha).format("DD/MM/YYYY");
                    }
                }
            } else {
                if (typeof vm.birthDay === 'string') {
                    fecha = vm.birthDay;
                } else {
                    fecha = moment(vm.birthDay).format("DD/MM/YYYY");
                    if (typeof fecha === 'undefined' || fecha === 'Invalid date') {
                        fecha = moment(vm.birthDay, "DD/MM/YYYY");
                        fecha = moment(fecha).format("DD/MM/YYYY");
                    }
                }
            }

            vm.isClienteObt = true;

            switch (vm.emissionPersonType) {
                case 'F':
                    fecha = calcularEdad(_type ? vm.cotizacionSeleccionada.rfcCliente : vm.fiscalIDNumber, "1");
                    vm.emission.contract = {
                        gender: _type ? vm.cotizacionSeleccionada.sexoCliente === '1' ? '1' : '2' : vm.sexo === 'masculino' ? '1' : '2',
                        name: _type ? vm.cotizacionSeleccionada.nombre : vm.nombres,
                        lastName: _type ? vm.cotizacionSeleccionada.primerApellido : vm.apePaterno,
                        secondLastName: _type ? vm.cotizacionSeleccionada.segundoApellido : vm.apeMaterno,
                        birthdate: fecha,
                        fiscalIDNumber: _type ? vm.cotizacionSeleccionada.rfcCliente : vm.fiscalIDNumber,
                        email: _type ? vm.cotizacionSeleccionada.emailCliente : vm.emailUser,
                        phone: _type ? vm.cotizacionSeleccionada.telefonoCliente : vm.phoneUser,
                        street: _type ? _quotation.Street : vm.calle,
                        numberExt: vm.emission.riskNumberExt,
                        numberInt: vm.emission.riskInterior,
                        neighboarhood: vm.emission.riskNeighborhood,
                        stateContractor: {
                            type: _type ? _quotation.catalogosCotizacion.dataHouseEntityRisk.type : vm.cmd.dataHouseEntityRisk.type
                        },
                        entityContractor: {
                            type: _type ? _quotation.catalogosCotizacion.dataHouseMunicipalityRisk.type : vm.cmd.dataHouseMunicipalityRisk.type
                        },
                        pcContractor: {
                            type: _type ? _quotation.catalogosCotizacion.dataHousePostalCodeRisk.type : vm.cmd.dataHousePostalCodeRisk.type
                        }
                    };
                    vm.cmd.emission.contract = {
                        stateContractor: {
                            type: _type ? _quotation.catalogosCotizacion.dataHouseEntityRisk.type : vm.cmd.dataHouseEntityRisk.type
                        },
                        entityContractor: {
                            type: _type ? _quotation.catalogosCotizacion.dataHouseMunicipalityRisk.type : vm.cmd.dataHouseMunicipalityRisk.type
                        },
                        pcContractor: {
                            type: _type ? _quotation.catalogosCotizacion.dataHousePostalCodeRisk.type : vm.cmd.dataHousePostalCodeRisk.type
                        }

                    };
                    break;
                
                case 'M':
                    if (_type) {
                        if (vm.cotizacionSeleccionada.isCliente === 1) {
                            if (typeof vm.cotizacionSeleccionada.fechaNacimiento === 'string') {
                                fechaSeleccion = vm.cotizacionSeleccionada.fechaNacimiento;
                            } else {
                                fechaSeleccion = moment(vm.cotizacionSeleccionada.fechaNacimiento).format("DD/MM/YYYY");
                                if (typeof fechaSeleccion === 'undefined' || fechaSeleccion === 'Invalid date') {
                                    fechaSeleccion = moment(vm.cotizacionSeleccionada.fechaNacimiento, "DD/MM/YYYY");
                                    fechaSeleccion = moment(fechaSeleccion).format("DD/MM/YYYY");
                                }
                            }
                        } else {
                            if (typeof vm.cotizacionSeleccionada.fechaNacimiento === 'string') {
                                fechaSeleccion = vm.cotizacionSeleccionada.fechaNacimiento;
                            } else {
                                fechaSeleccion = moment(vm.cotizacionSeleccionada.fechaNacimiento).format('DD/MM/YYYY');
                                if (typeof fechaSeleccion === 'undefined' || fechaSeleccion === 'Invalid date') {
                                    fechaSeleccion = moment(vm.cotizacionSeleccionada.fechaNacimiento, "DD/MM/YYYY");
                                    fechaSeleccion = moment(fecha).format("DD/MM/YYYY");
                                }
                            }
                        }
                    }

                    fechaSeleccion = calcularEdad(_type ? vm.cotizacionSeleccionada.rfcCliente : vm.fiscalIDNumber, "2");
                    vm.emission.contract = {
                        gender: '1',
                        name: _type ? vm.cotizacionSeleccionada.nombre : vm.nombreCliente,
                        lastName: '',
                        secondLastName: '',
                        birthdate: fechaSeleccion,
                        fiscalIDNumber: _type ? vm.cotizacionSeleccionada.rfcCliente : vm.fiscalIDNumber,
                        email: _type ? vm.cotizacionSeleccionada.emailCliente : vm.emailUser,
                        phone: _type ? vm.cotizacionSeleccionada.telefonoCliente : vm.phoneUser,
                        street: _type ? _quotation.Street : vm.calle,
                        numberExt: vm.emission.riskNumberExt,
                        numberInt: vm.emission.riskInterior,
                        neighboarhood: vm.emission.riskNeighborhood,
                        stateContractor: {
                            type: _type ? _quotation.catalogosCotizacion.dataHouseEntityRisk.type : vm.cmd.dataHouseEntityRisk.type
                        },
                        entityContractor: {
                            type: _type ? _quotation.catalogosCotizacion.dataHouseMunicipalityRisk.type : vm.cmd.dataHouseMunicipalityRisk.type
                        },
                        pcContractor: {
                            type: _type ? _quotation.catalogosCotizacion.dataHousePostalCodeRisk.type : vm.cmd.dataHousePostalCodeRisk.type
                        }
                    };
                    vm.cmd.emission.contract = {
                        stateContractor: {
                            type: _type ? _quotation.catalogosCotizacion.dataHouseEntityRisk.type : vm.cmd.dataHouseEntityRisk.type
                        },
                        entityContractor: {
                            type: _type ? _quotation.catalogosCotizacion.dataHouseMunicipalityRisk.type : vm.cmd.dataHouseMunicipalityRisk.type
                        },
                        pcContractor: {
                            type: _type ? _quotation.catalogosCotizacion.dataHousePostalCodeRisk.type : vm.cmd.dataHousePostalCodeRisk.type
                        }

                    };
                    break;
            }
        }

        function calcularEdad(rfc, type) {
            var log = moment(new Date()).format("YY");
            var fecha = type === "1" ? rfc.substring(4, 10) : rfc.substring(3, 9);
            var anio = fecha.substring(0, 2);
            var mes = fecha.substring(2, 4);
            var dia = fecha.substring(4, 6);
            if (anio > log) {
                anio = "19" + anio;
            } else {
                anio = "20" + anio;
            }
            fecha = dia + "/" + mes + "/" + anio;
            return fecha;
        }

        function emissionFunction() {
            var _fechaExpiracionYear = typeof vm.comboYearExpiration === 'undefined' ? '' : vm.comboYearExpiration.id;
            var _fechaExpiracionMonth = typeof vm.comboMonthExpiration === 'undefined' ? '' : vm.comboMonthExpiration.id;
            var _typeCardByClabe = typeof vm.cmd.ListTypeCLABE === 'undefined' ? '' : vm.cmd.ListTypeCLABE.type.text;
            var _fechaPago = typeof vm.emission.payment.dateAprox === 'undefined' ? moment(new Date()).format('YYYY-MM-DD') : moment(vm.emission.payment.dateAprox).format('YYYY-MM-DD');
            var _numeroTarjeta = typeof vm.emission.payment.accountNumber === 'undefined' ? '' : vm.emission.payment.accountNumber;
            var _claveTarjeta = typeof vm.emission.payment.cvv === 'undefined' ? '' : vm.emission.payment.cvv;
            var _clabeInterbancaria = typeof vm.emission.payment.clabe === 'undefined' ? '' : vm.emission.payment.clabe;
            var _fechaVencimiento = "";
            var _fechaProximaPago = "";
            var fechaBirthDate = "";
            
            if (typeof vm.emission.contract.birthdate === 'string') {
                fechaBirthDate = vm.emission.contract.birthdate.split("/").reverse().join("-");
            } else {
                fechaBirthDate = moment(new Date(vm.emission.contract.birthdate)).format('YYYY-MM-DD');
            }
            if (vm.cmd.paymentType.type.id === '8' || vm.cmd.paymentType.type.id === '2') {
                _fechaVencimiento = _fechaExpiracionYear + '-' + _fechaExpiracionMonth + "-01";
                _fechaProximaPago = _fechaPago;
            }
            if (vm.cmd.paymentType.type.id === '2' && _typeCardByClabe === 'CLABE') {
                _fechaVencimiento = _fechaPago;
                _fechaProximaPago = _fechaPago;
            }
            var _params = {
                QuotationNumber: vm.datosCotizacion.numeroCotizacion || vm.cotizacionSeleccionada.cotizacion,
                InsuInsurancePolicyDate: moment(new Date()).format('YYYY-MM-DD'),
                InsuPolicyMaturityDate: moment(new Date(), 'YYYY-MM-DD').add(1, 'years').format('YYYY-MM-DD'),
                InsuNumberOfFloors: vm.emission.floors,
                InsuNumberOfBasements: vm.emission.basements,
                InsuPaymentManagerID: vm.cmd.paymentType.type.id,
                RiskStreetTypeID: vm.cmd.emission.streetType.type.id,
                RiskStreet: vm.emission.riskStreet,
                RiskInteriorNumber: vm.emission.riskInterior,
                RiskOutdoorNumber: vm.emission.riskNumberExt,
                RiskNeighborhood: vm.emission.riskNeighborhood,
                RiskSameAddressContractingPartyFlag: vm.cmd.emission.sameAddress === true ? '1' : '0',
                ContractPersonType: vm.emissionPersonType,
                ContractFiscalIDNumber: vm.emission.contract.fiscalIDNumber,
                ContractName: vm.emission.contract.name,
                ContractLastName: vm.emission.contract.lastName,
                ContractSecondLastName: vm.emission.contract.secondLastName,
                ContractBirthDate: fechaBirthDate,
                ContractGender: vm.emissionPersonType === 'F' ? vm.emission.contract.gender : '1',
                ContractPhoneNumber: vm.emission.contract.phone,
                ContractEmail: vm.emission.contract.email,
                ContractStreet: vm.emission.contract.street,
                ContractNeighborhood: vm.emission.contract.neighboarhood,
                ContractFederalEntityID: vm.cmd.emission.contract.stateContractor.type.id,
                ContractDelegationMunicipalityID: vm.cmd.emission.contract.entityContractor.type.id,
                ContractPostalCode: vm.cmd.emission.contract.pcContractor.type.id,
                CheckBeneficiary: vm.checkBeneficiary ? 'true' : 'false',
                BeneficiaryPersonType: vm.checkBeneficiary ? vm.emission.beneficiary.type : '',
                BeneficiaryFiscalIDNumber: vm.checkBeneficiary ? vm.emission.beneficiary.rfc : '',
                BeneficiaryName: vm.checkBeneficiary ? vm.emission.beneficiary.type === 'F' ? vm.emission.beneficiary.name : vm.emission.beneficiary.social : '',
                BeneficiaryLastName: vm.checkBeneficiary ? vm.emission.beneficiary.lastName : '',
                BeneficiarySecondLastName: vm.checkBeneficiary ? vm.emission.beneficiary.secondLastName : '',
                BeneficiaryStreet: vm.checkBeneficiary ? vm.emission.beneficiary.street : '',
                BeneficiaryNeighborhood: vm.checkBeneficiary ? vm.emission.beneficiary.neighboarhood : '',
                BeneficiaryFederalEntityID: vm.checkBeneficiary ? vm.cmd.emission.beneficiary.stateBeneficiary.type.id : '',
                BeneficiaryDelegationMunicipalityID: vm.checkBeneficiary ? vm.cmd.emission.beneficiary.entityBeneficiary.type.id : '',
                BeneficiaryPostalCode: vm.checkBeneficiary ? vm.cmd.emission.beneficiary.pcBeneficiary.type.id : '',
                //DATOS DE TITULAR LOS MISMOS QUE DATOS DE CONTRATANTE
                TitularPersonType: vm.emissionPersonType,
                TitularFiscalIDNumber: vm.emission.contract.fiscalIDNumber,
                TitularName: vm.emission.contract.name,
                TitularLastName: vm.emission.contract.lastName,
                TitularSecondLastName: vm.emission.contract.secondLastName,
                TitularBirthDate: fechaBirthDate,
                TitularGender: vm.emissionPersonType === 'F' ? vm.emission.contract.gender : '1',
                TitularPhoneNumber: vm.emission.contract.phone,
                TitularEmail: vm.emission.contract.email,
                TitularStreet: vm.emission.contract.street,
                TitularNeighborhood: vm.emission.contract.neighboarhood,
                TitularFederalEntityID: vm.cmd.emission.contract.stateContractor.type.id,
                TitularDelegationMunicipalityID: vm.cmd.emission.contract.entityContractor.type.id,
                TitularPostalCode: vm.cmd.emission.contract.pcContractor.type.id,
                //fin datos de titular
                BankingPaymentMethod: vm.cmd.paymentType.type.id === '8' ? 'TC' : vm.cmd.paymentType.type.id === '1' ? '' : vm.cmd.ListTypeCLABE.type.text,
                BankingBankID: (vm.cmd.paymentType.type.id === '8' || vm.cmd.paymentType.type.id === '2') && (typeof vm.cmd.dataBanks.type !== 'undefined') ? vm.cmd.dataBanks.type.id : '',
                BankingName: vm.emission.payment.name,
                BankingLastName: vm.emission.payment.lastName,
                BankingSecondLastName: vm.emission.payment.secondLastName,
                BankingEmail: vm.emission.payment.email,
                BankingAccountNumber: _numeroTarjeta,
                BankingCardVerificationValue: _claveTarjeta,
                BankingExpirationDate: _fechaVencimiento,
                BankingCardID: (vm.cmd.paymentType.type.id === '8' || vm.cmd.paymentType.type.id === '2') && (typeof vm.cmd.cardType.type !== 'undefined') ? vm.cmd.cardType.type.id : '',
                BankingCLABE: _clabeInterbancaria,
                BankingPaymentDate: _fechaProximaPago,
                TypeCardByClabe: vm.cmd.ListTypeCLABE === undefined ? '' : vm.cmd.ListTypeCLABE.type.text,
                language: 'SPA'
            };

            insurancePymeSrv.getServiceEmisionPyme(_params).then(function (_res) {
                if (_res.success) {
                    vm.datosCotizacion = _res.info;
                    vm.numPoliza = _res.info.policyNumber;
                    vm.stepForm.stepD = false;
                    vm.stepForm.stepE = true;

                    var _data = {
                        language: 'SPA',
                        idCotizacion: _params.QuotationNumber,
                        idPoliza: vm.numPoliza,
                        quotationJsonInit: JSON.stringify(_params),
                        quotationJsonEnd: JSON.stringify(_res.response),
                        numberAuthorizer: 0
                    };

                    insurancePymeSrv.updateQuotation(_data).then(function (response) {
                        
                        CommonModalsSrv.done("Emisión Exitosa. Número de póliza: " + vm.numPoliza + '');
                    }).catch();
                } else {
                    CommonModalsSrv.error("Error en el Servicio, no se encuentra disponible - code: " + _res.info.transactionID);

                }
            });
        }

        vm.datepicker_opts = {
            minDate: new Date(),
            isInvalidDate: function (date) {
                return (date.day() === 0 || date.day() === 6) ? true : false;
            }
        };

        function printPolicy() {
            var _url = window.location.href.indexOf('asesoria.actinver.com/asesoria') !== -1 ?
                    'https://negocios.mapfre.com.mx/VIPII/wImpresion/MarcoImpresion.aspx?Poliza=' + vm.numPoliza + '&Endoso=0' :
                    'https://negociosuat.mapfre.com.mx/VIPII/wImpresion/MarcoImpresion.aspx?Poliza=' + vm.numPoliza + '&Endoso=0';

            window.open(_url, '_blank', 'width=' + screen.width + 'px,height=' + screen.height + 'px,resizable=0');
        }

        function imprimirCondiciones() {
            var _urlCondiciones;
            _urlCondiciones = 'img/pdfs/actinver-condiciones-generales-mapfre-hogar30052019.pdf';
            window.open(_urlCondiciones, '_blank', 'width=' + screen.width + 'px,height=' + screen.height + 'px,resizable=0');
        }

        function endEmission() {
            $state.go('insurance.main', {model: null});
        }

        function emisionSeguroHogar() {
            if (Number(vm.emission.floors) <= 0) {
                CommonModalsSrv.error("El número de PISOS debe ser MAYOR a CERO");
                return;
            }
            
            if (validaRFCFecha()) {
                vm.stepForm.stepC = false;
                vm.stepForm.stepD = true;
            }
        }

        function backToEmission() {
            vm.stepForm.stepC = true;
            vm.stepForm.stepD = false;
        }

        function validaRFCFecha() {
            var fechaC = moment(vm.emission.contract.birthdate).format("DD/MM/YYYY");

            if (!validaFechaConRFC(fechaC, vm.emission.contract.fiscalIDNumber, vm.personType, "Contratante")) {
                return false;
            }

            if (vm.checkBeneficiary) {
                var fechaB = "";
                var personaPY = "";

                if (vm.emission.beneficiary.type === "F") {
                    personaBeneficiario = "1";
                } else {
                    if (vm.emission.beneficiary.type === "M") {
                        personaBeneficiario = "2";
                    }
                }

                if (personaBeneficiario === "1") {
                    if (vm.emission.beneficiary.dateF) {
                        fechaB = vm.emission.beneficiary.dateF;
                    } else {
                        CommonModalsSrv.error("Favor de Capturar el campo de Fecha de Nacimiento del Beneficiario");
                    }
                } else {
                    if (personaBeneficiario === "2") {
                        if (vm.emission.beneficiary.dateM) {
                            fechaB = vm.emission.beneficiary.dateM;
                        } else {
                            CommonModalsSrv.error("Favor de Capturar el campo de Fecha de Constitución del Beneficiario");
                        }
                    }
                }

                fechaB = moment(fechaB).format("DD/MM/YYYY");

                if (!validaFechaConRFC(fechaB, vm.emission.beneficiary.rfc, personaBeneficiario, "Beneficiario")) {
                    return false;
                }
            }

            return true;
        }

        function validaFechaConRFC(fecha, rfcOri, tipoPersona, persona) {
            if (!vm.isClienteObt) {
                var rfc = "";
                var arrayFecha = fecha.split("/");
                rfc += arrayFecha[2].substring(2, 4);
                rfc += arrayFecha[1];
                rfc += arrayFecha[0];
                if (tipoPersona === '1') {
                    if (rfc === rfcOri.substring(4, 10)) {
                        vm.bnd = true;       
                    } else {
                        CommonModalsSrv.error("La fecha de nacimiento del " + persona + " no coincide con la fecha del RFC.");    
                        return false;
                    }
                } else if (tipoPersona === '2') {
                    if (rfc === rfcOri.substring(3, 9)) {
                        vm.bnd = true;
                    } else {
                        if (rfcOri.length > 12 && tipoPersona === '2') {
                            CommonModalsSrv.error("El RFC del " + persona + " no cumple con la longitud correcta. ");
                            return false;
                        } else {
                            CommonModalsSrv.error("La fecha constitutiva del " + persona + " no coincide con la fecha del RFC.");
                            return false;
                        }
                    }
                }
                return true;
            } else {
                return true;
            }
        }

        function calculaRFC() {
            vm.bnd = false;

            if (!vm.isClienteObt) {
                var fecha = vm.disabledRFC ? vm.birthDay : vm.fechaNacimiento;
                fecha = typeof fecha === 'string' ? fecha : moment(fecha).format('DD/MM/YYYY');//$("#F_NACIMIENTO").val();
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
                        CommonModalsSrv.error("La fecha de nacimiento no coincide con la fecha del RFC.");
                    }
                } else if (vm.personType === '2') {
                    if (rfc === rfcOri.substring(3, 9)) {
                        vm.bnd = true;
                    } else {
                        if (rfcOri.length > 12 && vm.personType === '2') {
                            CommonModalsSrv.error("El RFC no cumple con la longitud correcta. ");
                        } else {
                            CommonModalsSrv.error("La fecha constitutiva no coincide con la fecha del RFC.");
                        }
                    }
                }
            } else {
                vm.bnd = true;
            }
        }

        function justAlphanumeric(field) {            
            var target = document.getElementById(field);
            var v_names = (target.value + '').split('');
            var res = "";

            for (var count = 0; count < v_names.length; count++) {
                if ((v_names[count] + '').match(/^[0-9a-zA-ZÁÉÍÓÚÑáéíóúñ ]+$/)) {
                    res += v_names[count];
                }
            }
            target.value = res + '';
        }

        function justNumeric(field) {        
            var target = document.getElementById(field);
            var v_names = (target.value + '').split('');
            var res = "";

            for (var count = 0; count < v_names.length; count++) {
                if ((v_names[count] + '').match(/^[0-9]+$/)) {
                    res += v_names[count];
                }
            }
            target.value = res + '';
        }

        function soloNumero(e) {
            var regex = new RegExp("^[0-9]+$");
            var echc = (typeof event.charCode !== 'undefined') ? event.charCode : event.which;
            var key = String.fromCharCode(echc);
            if (!regex.test(key) && event.charCode !== 0) {
                event.preventDefault();
                return false;
            }
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

        function charrepeatText(event, idValue) {
            var echc = (typeof event.charCode !== 'undefined') ? event.charCode : event.which;
            var key = String.fromCharCode(echc).toUpperCase();
            var inputValue = angular.element("#" + idValue).val().toString().toUpperCase();
            inputValue = (typeof inputValue === 'undefined') ? "" : inputValue;
            
            if (inputValue.substring(inputValue.length - 1, inputValue.length) === key && inputValue.substring(inputValue.length - 2, inputValue.length - 1) === key) {
                event.preventDefault();
                return false;
            }
        }

        function charrepeatTextTres(event, idValue) {
            var echc = (typeof event.charCode !== 'undefined') ? event.charCode : event.which;
            var key = String.fromCharCode(echc).toUpperCase();
            var inputValue = angular.element("#" + idValue).val().toString().toUpperCase();
            inputValue = (typeof inputValue === 'undefined') ? "" : inputValue;
            
            if (inputValue.substring(inputValue.length - 1, inputValue.length) === key && inputValue.substring(inputValue.length - 2, inputValue.length - 1) === key && inputValue.substring(inputValue.length - 3, inputValue.length - 2) === key) {
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

        function soloText(e, espacios, valor) {
            var regex = espacios ? new RegExp("^[a-zA-Z]+$") : new RegExp("^[a-zA-Z]+$");
            var echc = (typeof e.charCode !== 'undefined') ? e.charCode : e.which;
            var key = String.fromCharCode(echc);
            if (e.which === 241 || e.which === 209 || e.which === 225 ||
                    e.which === 233 || e.which === 237 || e.which === 243 ||
                    e.which === 250 || e.which === 193 || e.which === 201 ||
                    e.which === 205 || e.which === 211 || e.which === 218 || e.which === 32)
                return true;
            else {
                if (!regex.test(key) && e.charCode !== 0) {

                    e.preventDefault();
                    return false;
                }
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

        function setValueGastosExtrasCasaHabitacion() {
            
            var imp_edificio = vm.importeEdificio * 1;
            vm.sumaGastosExtras = (imp_edificio + (imp_edificio * 0.1)) + '';
            document.getElementById("sumaGastosExtras").disabled = "true";
        }

        function setRemocionEscombros() {
            var imp_edificio = vm.importeEdificio * 1;
            vm.sumaRemEsco = (imp_edificio + (imp_edificio * 0.1)) + '';
            document.getElementById("sumaRemEsco").disabled = "true";
        }

        function onChangeTipoDeRiesgo(tipoRiesgo) {
            vm.tipoRiesgo = tipoRiesgo;
            cambiaJoyasTipoDeRiesgo();
        }

        function cambiaJoyasTipoDeRiesgo() {
            if (vm.tipoRiesgo.id === "2") {
                vm.roboMenaje.c.checked = false;
                vm.roboMenaje.ci.joyas.checked = false;
                vm.dinero.c.checked = false;
                vm.dinero.ci.usoTarjetasDinero.checked = false;

                if (vm.rol === "SEGUROS") {
                    vm.roboMenaje.c.montoDisabled = true;
                    vm.roboMenaje.c.obligatorio = true;
                    vm.dinero.c.montoDisabled = true;
                    vm.dinero.c.obligatorio = true;
                }
            } else {
                if (vm.rol === "ASESOR") {
                    vm.roboMenaje.c.checked = true;
                    vm.dinero.c.checked = true;
                    vm.roboMenaje.ci.joyas.checked = true;
                } else {
                    if (vm.rol === "SEGUROS") {
                        vm.roboMenaje.c.montoDisabled = false;
                        vm.roboMenaje.c.obligatorio = false;
                        vm.dinero.c.montoDisabled = false;
                        vm.dinero.c.obligatorio = false;
                    }
                }
            }
            realizaOperaciones();
        }

        function getJsonCoberturasService(newValue) {
            var _listaObtenida = [];
            insurancePymeSrv.getCoverage().then(function (_res) {
                angular.forEach(_res.info, function (value) {

                    var jS = {};
                    try {
                        jS = JSON.parse(decode(value.json));
                    } catch (err) {
                        try {
                            jS = JSON.parse(value.json);
                        } catch (err) {
                            CommonModalsSrv.error("No fue posible obtener las coberturas.");
                        }
                    }

                    _listaObtenida.push({
                        id: value.idCobertura,
                        isCliente: value.isCliente,
                        json: jS,
                        moneda: value.moneda,
                        rollUsuario: value.rollUsuario,
                        status: value.status,
                        tipoCliente: value.tipoCliente
                    });
                });
                
                for (var i = 0; i < _listaObtenida.length; i++) {
                    if ("ASESOR" === _listaObtenida[i].rollUsuario && "MXN" === _listaObtenida[i].moneda) {
                        vm.jsonCoberturasAsesorMXN = _listaObtenida[i].json;
                    }
                    if ("ASESOR" === _listaObtenida[i].rollUsuario && "USD" === _listaObtenida[i].moneda) {
                        vm.jsonCoberturasAsesorUSD = _listaObtenida[i].json;
                    }
                    if ("SEGUROS" === _listaObtenida[i].rollUsuario && "MXN" === _listaObtenida[i].moneda) {
                        vm.jsonCoberturasSegurosMXN = _listaObtenida[i].json;
                    }
                    if ("SEGUROS" === _listaObtenida[i].rollUsuario && "USD" === _listaObtenida[i].moneda) {
                        vm.jsonCoberturasSegurosUSD = _listaObtenida[i].json;
                    }
                }

                getJsonCoberturas(newValue);
            });
        }

        function getJsonCoberturas(newValue) {
            var moneda = 1;

            if (newValue) {
                moneda = newValue.id;
            }
            if (vm.rol === "ASESOR") {
                switch (moneda) {
                    case 1:
                        vm.jsonCoberturas = vm.jsonCoberturasAsesorMXN;
                        break;
                    case 2:
                        vm.jsonCoberturas = vm.jsonCoberturasAsesorUSD;
                        break;
                }
            }
            if (vm.rol === "SEGUROS") {
                switch (moneda) {
                    case 1:
                        vm.jsonCoberturas = vm.jsonCoberturasSegurosMXN;
                        break;
                    case 2:
                        vm.jsonCoberturas = vm.jsonCoberturasSegurosUSD;
                        break;
                }
            }

            vm.limiteMaximoEquipoMovil = vm.jsonCoberturas.coberturas.electrodomesticos.coberturasIntegrantes.equipoMovil.limiteMaximo;
            vm.limiteMaximoCristales = vm.jsonCoberturas.coberturas.cristales.limiteMaximo;
            vm.limiteMaximoRoboMenaje = vm.jsonCoberturas.coberturas.roboMenaje.limiteMaximo;
            vm.limiteMaximoRcFamiliar = vm.jsonCoberturas.coberturas.rcFamiliar.limiteMaximo;
            vm.dineroMontoInicial = vm.jsonCoberturas.coberturas.dinero.monto;
            vm.limiteMaximoUsoTarjetas = vm.jsonCoberturas.coberturas.dinero.coberturasIntegrantes.usoTarjetasDinero.limiteMaximo;
            vm.bicicletasMontoInicial = vm.jsonCoberturas.coberturas.objetosPersonales.coberturasIntegrantes.bicicletasObjetos.monto;
            vm.objetosObjetosMontoInicial = vm.jsonCoberturas.coberturas.objetosPersonales.coberturasIntegrantes.objetosObjetos.monto;
            vm.objetosMontoInicial = vm.jsonCoberturas.coberturas.objetosPersonales.monto;
            vm.equipoMovilMontoInicial = vm.jsonCoberturas.coberturas.electrodomesticos.coberturasIntegrantes.equipoMovil.monto;

            vm.edificio = {
                "c": vm.jsonCoberturas.coberturas.edificio,
                "ci": vm.jsonCoberturas.coberturas.edificio.coberturasIntegrantes
            };
            vm.contenidos = {
                "c": vm.jsonCoberturas.coberturas.contenidos,
                "ci": vm.jsonCoberturas.coberturas.contenidos.coberturasIntegrantes
            };
            vm.rcFamiliar = {
                "c": vm.jsonCoberturas.coberturas.rcFamiliar,
                "ci": vm.jsonCoberturas.coberturas.rcFamiliar.coberturasIntegrantes
            };
            vm.roboMenaje = {
                "c": vm.jsonCoberturas.coberturas.roboMenaje,
                "ci": vm.jsonCoberturas.coberturas.roboMenaje.coberturasIntegrantes
            };
            vm.dinero = {
                "c": vm.jsonCoberturas.coberturas.dinero,
                "ci": vm.jsonCoberturas.coberturas.dinero.coberturasIntegrantes
            };
            vm.objetosPersonales = {
                "c": vm.jsonCoberturas.coberturas.objetosPersonales,
                "ci": vm.jsonCoberturas.coberturas.objetosPersonales.coberturasIntegrantes
            };
            vm.electrodomesticos = {
                "c": vm.jsonCoberturas.coberturas.electrodomesticos,
                "ci": vm.jsonCoberturas.coberturas.electrodomesticos.coberturasIntegrantes
            };
            vm.remocionEscombros = {
                "c": vm.jsonCoberturas.coberturas.remocionEscombros,
                "ci": vm.jsonCoberturas.coberturas.remocionEscombros.coberturasIntegrantes
            };
            vm.gastosAsalto = {
                "c": vm.jsonCoberturas.coberturas.gastosAsalto,
                "ci": vm.jsonCoberturas.coberturas.gastosAsalto.coberturasIntegrantes
            };
            vm.gastosFinales = {
                "c": vm.jsonCoberturas.coberturas.gastosFinales,
                "ci": vm.jsonCoberturas.coberturas.gastosFinales.coberturasIntegrantes
            };
            vm.gastosExtras = {
                "c": vm.jsonCoberturas.coberturas.gastosExtras,
                "ci": vm.jsonCoberturas.coberturas.gastosExtras.coberturasIntegrantes
            };

            vm.cristales = {
                "c": vm.jsonCoberturas.coberturas.cristales,
                "ci": vm.jsonCoberturas.coberturas.cristales.coberturasIntegrantes
            };
            if (vm.jsonCoberturas.coberturas.asistenciaInformatica) {
                vm.asistenciaInformatica = {
                    "c": vm.jsonCoberturas.coberturas.asistenciaInformatica,
                    "ci": vm.jsonCoberturas.coberturas.asistenciaInformatica.coberturasIntegrantes
                };
            }
            if (vm.jsonCoberturas.coberturas.asistenciaLegal) {
                vm.asistenciaLegal = {
                    "c": vm.jsonCoberturas.coberturas.asistenciaLegal,
                    "ci": vm.jsonCoberturas.coberturas.asistenciaLegal.coberturasIntegrantes
                };
            }
            vm.asistenciaViajes = {
                "c": vm.jsonCoberturas.coberturas.asistenciaViajes,
                "ci": vm.jsonCoberturas.coberturas.asistenciaViajes.coberturasIntegrantes
            };
            if (vm.jsonCoberturas.coberturas.extensionViajes) {
                vm.extensionViajes = {
                    "c": vm.jsonCoberturas.coberturas.extensionViajes,
                    "ci": vm.jsonCoberturas.coberturas.extensionViajes.coberturasIntegrantes
                };
            }

            cambiaJoyasTipoDeRiesgo();
            realizaOperaciones();

        }

        function getCantidadLimite(amount) {

            if (!isNaN(amount)) {
                return "$" + formatCurrency(amount);
            } else {
                if ("NA" === amount) {
                    return "";
                }
            }

        }

        function eventClickCheckbox($event) {
            var tarjet = $event.currentTarget;

            if (tarjet.id === "edificio1") {
                if (tarjet.checked) {
                    vm.edificio.c.monto = vm.edificio.c.limiteMinimo;
                    vm.edificio.c.montoDisabled = false;
                    vm.edificio.ci.incendioEdificio.checked = true;

                    if (vm.contenidos.ci.hidroContenidos.checked) {
                        vm.edificio.ci.hidroEdificio.checked = true;
                    }
                    if (vm.contenidos.ci.terremotoContenidos.checked) {
                        vm.edificio.ci.terremotoEdificio.checked = true;
                    }

                    vm.rcFamiliar.ci.rcArrendatario.checked = false;
                    vm.rcFamiliar.ci.rcArrendatario.monto = undefined;
                    vm.rcFamiliar.ci.rcArrendatario.montoDisabled = true;
                } else {
                    vm.edificio.c.monto = undefined;
                    vm.edificio.c.montoDisabled = true;
                    vm.edificio.ci.incendioEdificio.checked = false;
                    vm.edificio.ci.incendioEdificio.monto = undefined;
                    vm.edificio.ci.incendioEdificio.montoDisabled = true;
                    vm.edificio.ci.hidroEdificio.checked = false;
                    vm.edificio.ci.hidroEdificio.monto = undefined;
                    vm.edificio.ci.hidroEdificio.montoDisabled = true;
                    vm.edificio.ci.terremotoEdificio.checked = false;
                    vm.edificio.ci.terremotoEdificio.monto = undefined;
                    vm.edificio.ci.terremotoEdificio.montoDisabled = true;
                    vm.rcFamiliar.ci.rcArrendatario.checked = true;
                    vm.rcFamiliar.ci.rcArrendatario.obligatorio = true;
                    vm.rcFamiliar.ci.rcArrendatario.monto = "AMPARADO";
                }
            }

            // si es hidrometeorologicos de edificio
            if (tarjet.id === "hidroEdificio1" && vm.edificio.c.checked) {

                if (tarjet.checked) {
                    vm.contenidos.ci.hidroContenidos.checked = true;
                } else {
                    vm.edificio.ci.hidroEdificio.monto = undefined;

                    vm.contenidos.ci.hidroContenidos.checked = false;
                    vm.contenidos.ci.hidroContenidos.monto = undefined;

                }
            }
            
            if (vm.edificio.ci.hidroEdificio.coberturasIntegrantes) {
                if (!vm.edificio.ci.hidroEdificio.checked) {
                    vm.edificio.ci.hidroEdificio.coberturasIntegrantes.bienesEdificio.checked = false;
                    vm.edificio.ci.hidroEdificio.coberturasIntegrantes.bienesEdificio.monto = undefined;
                    vm.edificio.ci.hidroEdificio.coberturasIntegrantes.bienesEdificio.montoDisabled = true;

                    vm.edificio.ci.hidroEdificio.coberturasIntegrantes.limConstruccion.checked = false;
                    vm.edificio.ci.hidroEdificio.coberturasIntegrantes.limConstruccion.monto = undefined;
                    vm.edificio.ci.hidroEdificio.coberturasIntegrantes.limConstruccion.montoDisabled = true;

                    vm.edificio.ci.hidroEdificio.coberturasIntegrantes.limDesocupado.checked = false;
                    vm.edificio.ci.hidroEdificio.coberturasIntegrantes.limDesocupado.monto = undefined;
                    vm.edificio.ci.hidroEdificio.coberturasIntegrantes.limDesocupado.montoDisabled = true;

                    vm.edificio.ci.hidroEdificio.coberturasIntegrantes.limFija.checked = false;
                    vm.edificio.ci.hidroEdificio.coberturasIntegrantes.limFija.monto = undefined;
                    vm.edificio.ci.hidroEdificio.coberturasIntegrantes.limFija.montoDisabled = true;

                    vm.edificio.ci.hidroEdificio.coberturasIntegrantes.limTerminado.checked = false;
                    vm.edificio.ci.hidroEdificio.coberturasIntegrantes.limTerminado.monto = undefined;
                    vm.edificio.ci.hidroEdificio.coberturasIntegrantes.limTerminado.montoDisabled = true;
                }
            }

            //si es hidrometeorologicos de contenidos
            if (tarjet.id === "hidroContenidos1") {
                if (tarjet.checked) {
                    if (vm.edificio.c.checked) {
                        vm.edificio.ci.hidroEdificio.checked = true;
                    }
                } else {
                    vm.contenidos.ci.hidroContenidos.monto = undefined;
                    vm.edificio.ci.hidroEdificio.checked = false;
                    vm.edificio.ci.hidroEdificio.monto = undefined;

                    if (vm.contenidos.ci.hidroContenidos.coberturasIntegrantes !== undefined) {
                        vm.contenidos.ci.hidroContenidos.coberturasIntegrantes.bienesContenidos.checked = false;
                        vm.contenidos.ci.hidroContenidos.coberturasIntegrantes.bienesContenidos.monto = undefined;
                        vm.contenidos.ci.hidroContenidos.coberturasIntegrantes.bienesContenidos.montoDisabled = true;

                        vm.contenidos.ci.hidroContenidos.coberturasIntegrantes.limContenidos.checked = false;
                        vm.contenidos.ci.hidroContenidos.coberturasIntegrantes.limContenidos.monto = undefined;
                        vm.contenidos.ci.hidroContenidos.coberturasIntegrantes.limContenidos.montoDisabled = true;
                    }
                }
            }


            /**
             * bienes de edificio
             */
            if (vm.edificio.ci.hidroEdificio.coberturasIntegrantes) {
                vm.edificio.ci.hidroEdificio.coberturasIntegrantes.bienesEdificio.checked = false;
            }

            /*
             * si limitaciones
             */
            if (tarjet.id === "limConstruccion1") {
                if (tarjet.checked) {
                    vm.edificio.ci.hidroEdificio.coberturasIntegrantes.limConstruccion.montoDisabled = false;
                    
                } else {
                    vm.edificio.ci.hidroEdificio.coberturasIntegrantes.limConstruccion.monto = undefined;
                    vm.edificio.ci.hidroEdificio.coberturasIntegrantes.limConstruccion.montoDisabled = true;
                }
            }
            if (tarjet.id === "limDesocupado1") {
                if (tarjet.checked) {
                    vm.edificio.ci.hidroEdificio.coberturasIntegrantes.limDesocupado.montoDisabled = false;
                    
                } else {
                    vm.edificio.ci.hidroEdificio.coberturasIntegrantes.limDesocupado.monto = undefined;
                    vm.edificio.ci.hidroEdificio.coberturasIntegrantes.limDesocupado.montoDisabled = true;
                }
            }
            if (tarjet.id === "limFija1") {
                if (tarjet.checked) {
                    vm.edificio.ci.hidroEdificio.coberturasIntegrantes.limFija.montoDisabled = false;
                    
                } else {
                    vm.edificio.ci.hidroEdificio.coberturasIntegrantes.limFija.monto = undefined;
                    vm.edificio.ci.hidroEdificio.coberturasIntegrantes.limFija.montoDisabled = true;
                }
            }
            if (tarjet.id === "limTerminado1") {
                if (tarjet.checked) {
                    vm.edificio.ci.hidroEdificio.coberturasIntegrantes.limTerminado.montoDisabled = false;
                    
                } else {
                    vm.edificio.ci.hidroEdificio.coberturasIntegrantes.limTerminado.monto = undefined;
                    vm.edificio.ci.hidroEdificio.coberturasIntegrantes.limTerminado.montoDisabled = true;
                }
            }

            if (vm.edificio.ci.hidroEdificio.coberturasIntegrantes) {
                if (vm.edificio.ci.hidroEdificio.coberturasIntegrantes.limConstruccion.checked ||
                    vm.edificio.ci.hidroEdificio.coberturasIntegrantes.limDesocupado.checked ||
                    vm.edificio.ci.hidroEdificio.coberturasIntegrantes.limTerminado.checked ||
                    vm.edificio.ci.hidroEdificio.coberturasIntegrantes.limFija.checked) {
                    vm.edificio.ci.hidroEdificio.coberturasIntegrantes.bienesEdificio.checked = true;
                }
            }

            /**
             * bienes de contenidos
             */
            if (tarjet.id === "bienesContenidos1") {
                if (tarjet.checked) {
                    vm.contenidos.ci.hidroContenidos.coberturasIntegrantes.bienesContenidos.montoDisabled = false;
                } else {
                    vm.contenidos.ci.hidroContenidos.coberturasIntegrantes.bienesContenidos.monto = undefined;
                    vm.contenidos.ci.hidroContenidos.coberturasIntegrantes.bienesContenidos.montoDisabled = true;
                }
            }

            if (tarjet.id === "limContenidos1") {
                if (tarjet.checked) {
                    vm.contenidos.ci.hidroContenidos.coberturasIntegrantes.limContenidos.montoDisabled = false;
                } else {
                    vm.contenidos.ci.hidroContenidos.coberturasIntegrantes.limContenidos.monto = undefined;
                    vm.contenidos.ci.hidroContenidos.coberturasIntegrantes.limContenidos.montoDisabled = true;
                }
            }

            /*
             * si es terremoto de edificio
             */
            if (tarjet.id === "terremotoEdificio1" && vm.edificio.c.checked) {

                if (tarjet.checked) {
                    vm.contenidos.ci.terremotoContenidos.checked = true;
                } else {
                    vm.edificio.ci.terremotoEdificio.monto = undefined;

                    vm.contenidos.ci.terremotoContenidos.checked = false;
                    vm.contenidos.ci.terremotoContenidos.monto = undefined;
                }
            }

            /*
             * si es terremoto de contenidos
             */
            if (tarjet.id === "terremotoContenidos1") {

                if (tarjet.checked) {
                    if (vm.edificio.c.checked) {
                        vm.edificio.ci.terremotoEdificio.checked = true;
                    }
                } else {
                    vm.contenidos.ci.terremotoContenidos.monto = undefined;

                    vm.edificio.ci.terremotoEdificio.checked = false;
                    vm.edificio.ci.terremotoEdificio.monto = undefined;
                }
            }

            /**
             * si cristales
             */
            if (tarjet.id === "cristales1") {
                if (tarjet.checked) {
                    vm.cristales.c.montoDisabled = false;
                } else {
                    vm.cristales.c.monto = undefined;
                    vm.cristales.c.montoDisabled = true;
                }
            }

            /**
             * si robo menaje
             */
            if (tarjet.id === "roboMenaje1") {
                if (tarjet.checked) {
                    if (vm.rol === "SEGUROS") {
                        vm.roboMenaje.c.montoDisabled = false;
                    }
                } else {
                    if (vm.rol === "SEGUROS") {
                        vm.roboMenaje.c.montoDisabled = true;
                    }

                    vm.roboMenaje.c.monto = undefined;
                    vm.roboMenaje.ci.joyas.checked = false;
                }
            }

            /**
             * si joyas
             */
            if (tarjet.id === "joyas1") {
                if (tarjet.checked) {
                    if (vm.rol === "SEGUROS") {
                        vm.roboMenaje.ci.joyas.montoDisabled = false;
                    }
                } else {
                    if (vm.rol === "SEGUROS") {
                        vm.roboMenaje.ci.joyas.montoDisabled = true;
                    }
                    vm.roboMenaje.ci.joyas.monto = undefined;
                }
            }

            /**
             * si dinero
             */
            if (tarjet.id === "dinero1") {
                if (tarjet.checked) {
                    vm.dinero.c.montoDisabled = false;
                } else {
                    vm.dinero.c.monto = undefined;
                    vm.dinero.c.montoDisabled = true;

                    vm.dinero.ci.usoTarjetasDinero.checked = false;
                }
            }

            /**
             * si tarjetas
             */
            if (tarjet.id === "usoTarjetasDinero1") {
                if (tarjet.checked) {
                    vm.dinero.ci.usoTarjetasDinero.montoDisabled = false;
                } else {
                    vm.dinero.ci.usoTarjetasDinero.monto = undefined;
                    vm.dinero.ci.usoTarjetasDinero.montoDisabled = true;
                }
            }

            /**
             * si objetos personales
             */
            if (tarjet.id === "objetosPersonales1") {
                if (!tarjet.checked) {
                    vm.objetosPersonales.c.monto = undefined;

                    vm.objetosPersonales.ci.objetosObjetos.checked = false;
                    vm.objetosPersonales.ci.objetosObjetos.monto = undefined;
                    vm.objetosPersonales.ci.objetosObjetos.montoDisabled = true;

                    vm.objetosPersonales.ci.bicicletasObjetos.checked = false;
                    vm.objetosPersonales.ci.bicicletasObjetos.monto = undefined;
                    vm.objetosPersonales.ci.bicicletasObjetos.montoDisabled = true;
                }
            }

            /**
             * si objetos personales de objetos
             */
            if (tarjet.id === "objetosObjetos1") {
                if (tarjet.checked) {
                    vm.objetosPersonales.ci.objetosObjetos.montoDisabled = false;
                } else {
                    vm.objetosPersonales.ci.objetosObjetos.monto = undefined;
                    vm.objetosPersonales.ci.objetosObjetos.montoDisabled = true;
                }
            }

            /**
             * si bicicletas 
             */
            if (tarjet.id === "bicicletasObjetos1") {
                if (tarjet.checked) {
                    if (vm.rol === "SEGUROS") {
                        vm.objetosPersonales.ci.bicicletasObjetos.montoDisabled = false;
                    }
                } else {
                    if (vm.rol === "SEGUROS") {
                        vm.objetosPersonales.ci.bicicletasObjetos.montoDisabled = true;
                    }
                }
            }

            /**
             * si electrodomesticos
             */
            if (tarjet.id === "electrodomesticos1") {
                if (tarjet.checked) {
                    vm.electrodomesticos.c.montoDisabled = false;
                } else {
                    vm.electrodomesticos.c.monto = undefined;
                    vm.electrodomesticos.c.montoDisabled = true;

                    vm.electrodomesticos.ci.equipoMovil.checked = false;
                    vm.electrodomesticos.ci.equipoMovil.monto = undefined;
                    vm.electrodomesticos.ci.equipoMovil.montoDisabled = true;
                }
            }

            /**
             * si equipo movil 
             */
            if (tarjet.id === "equipoMovil1") {
                if (tarjet.checked) {
                    if (vm.rol === "SEGUROS") {
                        vm.electrodomesticos.ci.equipoMovil.montoDisabled = false;
                    }
                } else {
                    if (vm.rol === "SEGUROS") {
                        vm.electrodomesticos.ci.equipoMovil.montoDisabled = true;
                    }
                    vm.electrodomesticos.ci.equipoMovil.monto = undefined;
                }
            }

            if (tarjet.id === "asistenciaViajes1") {
                if (!tarjet.checked) {
                    if (vm.jsonCoberturas.coberturas.extensionViajes) {
                        vm.extensionViajes.c.checked = false;
                    }
                }
            }

            if (tarjet.id === "extensionViajes1") {
                if (tarjet.checked) {
                    vm.asistenciaViajes.c.checked = true;
                }
            }

            realizaOperaciones();
        }

        function realizaOperaciones() {
            var montoEdificio = vm.edificio.c.monto ? vm.edificio.c.monto : 0;
            var montoContenido = vm.contenidos.c.monto ? vm.contenidos.c.monto : 0;
            var percMontCont = 0.1 * (parseFloat(montoEdificio) + parseFloat(montoContenido));

            /*
             * 10 por ciento de suma de edificio y contenidos
             */
            vm.gastosExtras.c.monto = percMontCont;
            vm.remocionEscombros.c.monto = percMontCont;


            /*
             * incendios, hidrometereologicos, terremoto de edificio
             * mismo valor que edificio
             */
            if (vm.edificio.ci.incendioEdificio.checked) {
                vm.edificio.ci.incendioEdificio.monto = montoEdificio;
            }
            if (vm.edificio.ci.hidroEdificio.checked) {
                vm.edificio.ci.hidroEdificio.monto = montoEdificio;
            }
            if (vm.edificio.ci.terremotoEdificio.checked) {
                vm.edificio.ci.terremotoEdificio.monto = montoEdificio;
            }

            /*
             * incendios, hidrometereologicos, terremoto de contenidos
             * mismo valor que contenidos
             */
            if (vm.contenidos.ci.incendioContenidos.checked) {
                vm.contenidos.ci.incendioContenidos.monto = vm.contenidos.c.monto;
            }
            if (vm.contenidos.ci.hidroContenidos.checked) {
                vm.contenidos.ci.hidroContenidos.monto = vm.contenidos.c.monto;
            }
            if (vm.contenidos.ci.terremotoContenidos.checked) {
                vm.contenidos.ci.terremotoContenidos.monto = vm.contenidos.c.monto;
            }

            /**
             * limites hidrometeorologicos Edificio
             */
            var percContenido = 0.3 * montoEdificio;
            if (vm.edificio.ci.hidroEdificio.coberturasIntegrantes) {
                vm.edificio.ci.hidroEdificio.coberturasIntegrantes.bienesEdificio.limiteMaximo = percContenido;
                vm.edificio.ci.hidroEdificio.coberturasIntegrantes.limConstruccion.limiteMaximo = percContenido;
                vm.edificio.ci.hidroEdificio.coberturasIntegrantes.limDesocupado.limiteMaximo = percContenido;
                vm.edificio.ci.hidroEdificio.coberturasIntegrantes.limFija.limiteMaximo = percContenido;
                vm.edificio.ci.hidroEdificio.coberturasIntegrantes.limTerminado.limiteMaximo = percContenido;
            }

            /**
             * monto de bienes Edificio
             */
            if (vm.edificio.ci.hidroEdificio.coberturasIntegrantes) {
                if (vm.edificio.ci.hidroEdificio.coberturasIntegrantes.limConstruccion.checked ||
                    vm.edificio.ci.hidroEdificio.coberturasIntegrantes.limDesocupado.checked ||
                    vm.edificio.ci.hidroEdificio.coberturasIntegrantes.limFija.checked ||
                    vm.edificio.ci.hidroEdificio.coberturasIntegrantes.limTerminado.checked) {
                    var lim = vm.edificio.ci.hidroEdificio.coberturasIntegrantes;
                    var monto1 = lim.limConstruccion.monto ? lim.limConstruccion.monto : 0;
                    var monto2 = lim.limDesocupado.monto ? lim.limDesocupado.monto : 0;
                    var monto3 = lim.limFija.monto ? lim.limFija.monto : 0;
                    var monto4 = lim.limTerminado.monto ? lim.limTerminado.monto : 0;

                    vm.edificio.ci.hidroEdificio.coberturasIntegrantes.bienesEdificio.monto = monto1 + monto2 + monto3 + monto4;
                } else {
                    vm.edificio.ci.hidroEdificio.coberturasIntegrantes.bienesEdificio.monto = undefined;
                }
            }

            /**
             * limites bienes Contenidos
             */
            var percContenido = 0.3 * montoContenido;
            if (vm.contenidos.ci.hidroContenidos.coberturasIntegrantes) {
                vm.contenidos.ci.hidroContenidos.coberturasIntegrantes.bienesContenidos.limiteMaximo = percContenido;
                vm.contenidos.ci.hidroContenidos.coberturasIntegrantes.limContenidos.limiteMaximo = percContenido;
            }

            /**
             * limite maximo de cristales
             */
            percContenido = 0.15 * parseFloat(montoContenido);

            if (percContenido < vm.limiteMaximoCristales) {
                vm.cristales.c.limiteMaximo = percContenido;
            } else {
                vm.cristales.c.limiteMaximo = vm.limiteMaximoCristales;
            }

            /**
             * limite maximo de robo menaje
             */
            percContenido = 0.8 * parseFloat(montoContenido);

            if (percContenido < vm.limiteMaximoRoboMenaje) {
                vm.roboMenaje.c.limiteMaximo = percContenido;
            } else {
                vm.roboMenaje.c.limiteMaximo = vm.limiteMaximoRoboMenaje;
            }

            /**
             * monto de robo de menaje en asesor
             */
            if (vm.tipoRiesgo.id === "2") {
                vm.roboMenaje.c.monto = undefined;
            } else {
                if (vm.rol === "ASESOR") {
                    vm.roboMenaje.c.montoDisabled = true;
                    percContenido = 0.5 * parseFloat(montoContenido);
                    if (percContenido < vm.limiteMaximoRoboMenaje) {
                        vm.roboMenaje.c.monto = percContenido;
                    } else {
                        vm.roboMenaje.c.monto = vm.limiteMaximoRoboMenaje;
                    }
                }
            }

            /**
             * limite maximo de joyas
             */
            percContenido = 0.5 * parseFloat(vm.roboMenaje.c.monto);
            vm.roboMenaje.ci.joyas.limiteMaximo = percContenido;

            /**
             * monto de joyas en asesor
             */
            if (vm.rol === "ASESOR") {
                vm.roboMenaje.ci.joyas.monto = vm.roboMenaje.c.monto * 0.5;
            }

            if (!vm.roboMenaje.c.monto) {
                vm.roboMenaje.ci.joyas.checked = false;
                vm.roboMenaje.ci.joyas.monto = undefined;
                vm.roboMenaje.ci.joyas.montoDisabled = true;
            }

            /**
             * monto de dinero en asesor
             */
            if (vm.tipoRiesgo.id === "2") {
                vm.dinero.c.monto = undefined;
            } else {
                if (vm.rol === "ASESOR") {
                    vm.dinero.c.monto = vm.dineroMontoInicial;
                }
            }

            /**
             * limiteMaximo de tarjetas
             */

            if (vm.dinero.c.monto) {
                if (vm.dinero.c.monto < vm.limiteMaximoUsoTarjetas) {
                    vm.dinero.ci.usoTarjetasDinero.limiteMaximo = vm.dinero.c.monto;
                } else {
                    vm.dinero.ci.usoTarjetasDinero.limiteMaximo = vm.limiteMaximoUsoTarjetas;
                }
            }

            /**
             * monto de tarjetas
             */
            if (!vm.dinero.c.monto) {
                vm.dinero.ci.usoTarjetasDinero.checked = false;
                vm.dinero.ci.usoTarjetasDinero.monto = undefined;
                vm.dinero.ci.usoTarjetasDinero.montoDisabled = true;
            }

            /**
             * monto de bicicletas de objetos personales
             */
            if (vm.rol === "ASESOR") {
                if (vm.objetosPersonales.ci.bicicletasObjetos.checked) {
                    vm.objetosPersonales.ci.bicicletasObjetos.monto = vm.bicicletasMontoInicial;
                } else {
                    vm.objetosPersonales.ci.bicicletasObjetos.monto = undefined;
                }
            }

            /**
             * monto de objetos de objetos personales
             */
            if (vm.rol === "ASESOR") {
                if (vm.objetosPersonales.ci.objetosObjetos.checked) {
                    vm.objetosPersonales.ci.objetosObjetos.monto = vm.objetosObjetosMontoInicial;
                } else {
                    vm.objetosPersonales.ci.objetosObjetos.monto = undefined;
                }
            }

            /**
             * monto de objetos personales
             */
            if (vm.objetosPersonales.c.checked) {
                var cob = vm.objetosPersonales.ci;

                var monto1 = cob.objetosObjetos.monto ? cob.objetosObjetos.monto : 0;
                var monto2 = cob.bicicletasObjetos.monto ? cob.bicicletasObjetos.monto : 0;

                vm.objetosPersonales.c.monto = monto1 + monto2;
            }

            /**
             * limite de electrodomesticos
             */
            percContenido = 0.5 * parseFloat(montoContenido);
            vm.electrodomesticos.c.limiteMaximo = percContenido;

            /*
             * limite de equipomovil
             * 30 por ciento de electrodomesticos o [15000 (vm.limiteMaximoEquipoMovil)]
             */
            var percElectro = 0.3 * parseFloat(vm.electrodomesticos.c.monto);

            if (vm.rol === "SEGUROS") {
                if (percElectro < vm.limiteMaximoEquipoMovil) {
                    vm.electrodomesticos.ci.equipoMovil.limiteMaximo = percElectro;
                } else {
                    vm.electrodomesticos.ci.equipoMovil.limiteMaximo = vm.limiteMaximoEquipoMovil;
                }

                if (!vm.electrodomesticos.c.monto) {
                    vm.electrodomesticos.ci.equipoMovil.checked = false;
                    vm.electrodomesticos.ci.equipoMovil.monto = undefined;
                    vm.electrodomesticos.ci.equipoMovil.montoDisabled = true;
                }
            }

            /*
             * monto de equipomovil
             * 30 por ciento de electrodomesticos o [15000 (vm.limiteMaximoEquipoMovil)]
             */
            if (vm.rol === "ASESOR") {
                if (vm.electrodomesticos.ci.equipoMovil.checked) {
                    if (percElectro < vm.equipoMovilMontoInicial) {
                        vm.electrodomesticos.ci.equipoMovil.monto = percElectro;
                    } else {
                        vm.electrodomesticos.ci.equipoMovil.monto = vm.equipoMovilMontoInicial;
                    }
                } else {
                    vm.electrodomesticos.ci.equipoMovil.monto = undefined;
                }
            }

            vm.gastosAsalto.c.monto = undefined;
            vm.asistenciaViajes.c.monto = undefined;
            vm.gastosFinales.c.monto = undefined;
            if (vm.extensionViajes.c) {
                vm.extensionViajes.c.monto = undefined;
            }
            if (vm.asistenciaInformatica.c) {
                vm.asistenciaInformatica.c.monto = undefined;
            }
            if (vm.asistenciaLegal.c) {
                vm.asistenciaLegal.c.monto = undefined;
            }


            /**
             * siempre cambia montos si están seleccionados
             */
            if (vm.gastosAsalto.c.checked) {
                vm.gastosAsalto.c.monto = "AMPARADO";
            }
            if (vm.asistenciaViajes.c.checked) {
                vm.asistenciaViajes.c.monto = "AMPARADO";
            }
            if (vm.extensionViajes.c) {
                if (vm.extensionViajes.c.checked) {
                    vm.extensionViajes.c.monto = "AMPARADO";
                }
            }
            if (vm.asistenciaInformatica.c) {
                if (vm.asistenciaInformatica.c.checked) {
                    vm.asistenciaInformatica.c.monto = "AMPARADO";
                }
            }
            if (vm.asistenciaLegal.c) {
                if (vm.asistenciaLegal.c.checked) {
                    vm.asistenciaLegal.c.monto = "AMPARADO";
                }
            }

            if (vm.gastosFinales.c.checked) {
                vm.gastosFinales.c.monto = "AMPARADO";
            }

        }

        function validarTabla() {
            var tablaValida = false;

            if (validarSiCumple(vm.edificio.c)) {
                return true;
            }
            if (vm.edificio.ci.hidroEdificio.coberturasIntegrantes) {
                if (validarSiCumple(vm.edificio.ci.hidroEdificio.coberturasIntegrantes.bienesEdificio)) {
                    return true;
                }
                if (validarSiCumple(vm.edificio.ci.hidroEdificio.coberturasIntegrantes.limTerminado)) {
                    return true;
                }
                if (validarSiCumple(vm.edificio.ci.hidroEdificio.coberturasIntegrantes.limDesocupado)) {
                    return true;
                }
                if (validarSiCumple(vm.edificio.ci.hidroEdificio.coberturasIntegrantes.limConstruccion)) {
                    return true;
                }
                if (validarSiCumple(vm.edificio.ci.hidroEdificio.coberturasIntegrantes.limFija)) {
                    return true;
                }
            }
            if (validarSiCumple(vm.contenidos.c)) {
                return true;
            }
            if (vm.contenidos.ci.hidroContenidos.coberturasIntegrantes) {
                if (validarSiCumple(vm.contenidos.ci.hidroContenidos.coberturasIntegrantes.bienesContenidos)) {
                    return true;
                }
                if (validarSiCumple(vm.contenidos.ci.hidroContenidos.coberturasIntegrantes.limContenidos)) {
                    return true;
                }
            }
            if (validarSiCumple(vm.rcFamiliar.c)) {
                return true;
            }

            if (validarSiCumple(vm.cristales.c)) {
                return true;
            }

            if (validarSiCumple(vm.roboMenaje.c)) {
                return true;
            }

            if (validarSiCumple(vm.roboMenaje.ci.joyas)) {
                return true;
            }

            if (validarSiCumple(vm.dinero.c)) {
                return true;
            }

            if (validarSiCumple(vm.dinero.ci.usoTarjetasDinero)) {
                return true;
            }

            if (vm.objetosPersonales.ci.objetosObjetos) {
                if (validarSiCumple(vm.objetosPersonales.ci.objetosObjetos)) {
                    return true;
                }
            }

            if (validarSiCumple(vm.objetosPersonales.ci.bicicletasObjetos)) {
                return true;
            }

            if (validarSiCumple(vm.electrodomesticos.c)) {
                return true;
            }

            if (validarSiCumple(vm.electrodomesticos.ci.equipoMovil)) {
                return true;
            }

            return tablaValida;
        }

        function validarSiCumple(v) {
            if (v.checked) {
                if (v.monto < v.limiteMinimo || v.monto > v.limiteMaximo || v.monto === "" || v.monto === undefined) {
                    return true;
                }
            }
            return false;
        }

        $scope.onClicSendEmailNotificationCotizationHogar = function () {
            var clienteNombre = "";
            try {
                if (vm.personType.toString() === '1') {
                    clienteNombre = vm.apePaterno + ' ' + ' ' + vm.apeMaterno + ' ' + vm.nombres;
                }
                if (vm.personType.toString() === '2') {
                    clienteNombre = vm.nombreCliente;
                }
                $scope.obJsonMail = {
                    'language': 'SPA',
                    'emailFrom': "seguros@actinver.com.mx",
                    'idTemplate': "buildDBTemplate|17",
                    'emailSubject': "Envío de cotización seguro de hogar Actinver " + clienteNombre.toUpperCase() + "(" + vm.datosCotizacion.numeroCotizacion + ")",
                    'mailTo': [vm.emailUser],
                    'mailCC': [""],
                    'ldrEdificio': '',
                    'ldrIncendioAdicionalesEdificio': '',
                    'ldrExplosionEdificio': '',
                    'ldrHuelAlbPopEdificio': '',
                    'ldrNavAreaVehiHumoEdificio': '',
                    'ldrFenHidroEdificio': '',
                    'ldrTerrErupVolcEdificio': '',
                    'ldrTodoRiesIncAdicEdificio': '',
                    'ldrContenido': '',
                    'ldrIncendioAdicionalesCont': '',
                    'ldrExplosionCont': '',
                    'ldrHuelAlbPopCont': '',
                    'ldrNavAereaVehiHumoCont': '',
                    'ldrFenHidroCont': '',
                    'ldrTerrErupVolcCont': '',
                    'ldrTodoRiesIncAdicCont': '',
                    'ldrRemocionEscombros': '',
                    'ldrIncendioRemocion': '',
                    'ldrFenHidroRemocion': '',
                    'ldrTerrErupVolcRemocion': '',
                    'ldrGasExtraCasaHabitacion': '',
                    'ldrIncendioGastExtras': '',
                    'ldrFenHidroGatExtras': '',
                    'ldrTerrErupVolcGastExtras': '',
                    'ldrRCFamiliar': '',
                    'ldrRCArrendatario': '',
                    'ldrRCTrabDomestico': '',
                    'ldrRoboDeMenaje': '',
                    'ldrRoboConViolencia': '',
                    'ldrRoboPorAsalto': '',
                    'ldrJoyasArtValor': '',
                    'ldrGtosMedAsaltDomicilio': '',
                    'ldrDineroValores': '',
                    'ldrCristales': '',
                    'ldrObjPersonales': '',
                    'lbrEqElectro': '',
                    'ldrAsistHogarViajes': '',
                    'ldrExtGarEnViajesNalEInt': '',
                    'ldrAsistLegal': '',
                    'ldrServDeAsistInformatica': '',
                    "dataHouseEntityRisk": vm.cmd.dataHouseEntityRisk.type.text,
                    "dataHouseMunicipalityRisk": vm.cmd.dataHouseMunicipalityRisk.type.text,
                    "dataHousePostalCodeRisk": vm.cmd.dataHousePostalCodeRisk.type.text,
                    "kindPaid": vm.cmd.kindPaid.type.text,
                    "currency": vm.cmd.currency.type.text,
                    "calle": vm.calle,
                    "kindRisk": vm.cmd.kindRisk.type.text,
                    "kindClasification": vm.cmd.kindClasification.type.text, //creada nueva variable para clasificación
                    "kindStructure": vm.cmd.kindStructure.type.text,
                    "kindRoof": vm.cmd.kindRoof.type.text,
                    "securityActions": vm.cmd.securityActions.type.text,
                    'primaTotalAnual': vm.datosCotizacion.primaTotal,
                    "insurancePolicyDate" : vm.insurancePolicyDate,
                    "netPremium": vm.datosCotizados.primaNeta,
                    "surcharge": vm.datosCotizados.recargos,
                    "entitlement":  vm.datosCotizados.derechosPoliza,
                    "vat": vm.datosCotizados.iva,
                    "adjoiningHomeFlag" : vm.cmd.borderWall.type.id

                };
                angular.forEach(vm.datosCotizacion.coberturas.coverageInformation, function (value) {
                    if (value.code.toString() === "3000") {
                        if (value.insuredSum === undefined || value.insuredSum === null || value.insuredSum === 0) {
                            $scope.obJsonMail.ldrEdificio = "";
                        } else {
                            $scope.obJsonMail.ldrEdificio = value.insuredSum;
                        }
                    }

                    if (value.code.toString() === "3001") {
                        if ($scope.obJsonMail.ldrEdificio.toString() !== "") {
                            if ($scope.obJsonMail.ldrEdificio.toString() === value.insuredSum.toString() || value.insuredSum.toString() === '1') {
                                $scope.obJsonMail.ldrIncendioAdicionalesEdificio = "AMPARADA";
                            } else {
                                $scope.obJsonMail.ldrIncendioAdicionalesEdificio = value.insuredSum;
                            }
                        }
                    }

                    if (value.code.toString() === "3002") {
                        if ($scope.obJsonMail.ldrEdificio.toString() !== "") {
                            if ($scope.obJsonMail.ldrEdificio.toString() === value.insuredSum.toString() || value.insuredSum.toString() === '1') {
                                $scope.obJsonMail.ldrExplosionEdificio = "AMPARADA";
                            } else {
                                $scope.obJsonMail.ldrExplosionEdificio = value.insuredSum;
                            }
                        }
                    }

                    if (value.code.toString() === "3003") {
                        if ($scope.obJsonMail.ldrEdificio.toString() !== "") {
                            if ($scope.obJsonMail.ldrEdificio.toString() === value.insuredSum.toString() || value.insuredSum.toString() === '1') {
                                $scope.obJsonMail.ldrHuelAlbPopEdificio = "AMPARADA";
                            } else {
                                $scope.obJsonMail.ldrHuelAlbPopEdificio = value.insuredSum;
                            }
                        }
                    }
                    if (value.code.toString() === "3004") {
                        if ($scope.obJsonMail.ldrEdificio.toString() !== "") {
                            if ($scope.obJsonMail.ldrEdificio.toString() === value.insuredSum.toString() || value.insuredSum.toString() === '1') {
                                $scope.obJsonMail.ldrNavAereaVehiHumoEdificio = "AMPARADA";
                            } else {
                                $scope.obJsonMail.ldrNavAereaVehiHumoEdificio = value.insuredSum;
                            }
                        }
                    }

                    if (value.code.toString() === "3020") {
                        if ($scope.obJsonMail.ldrEdificio.toString() !== "") {
                            if ($scope.obJsonMail.ldrEdificio.toString() === value.insuredSum.toString() || value.insuredSum.toString() === '1') {
                                $scope.obJsonMail.ldrFenHidroEdificio = "AMPARADA";
                            } else {
                                $scope.obJsonMail.ldrFenHidroEdificio = value.insuredSum;
                            }
                        }
                    }

                    if (value.code.toString() === "3021") {
                        if ($scope.obJsonMail.ldrEdificio.toString() !== "") {
                            if ($scope.obJsonMail.ldrEdificio.toString() === value.insuredSum.toString() || value.insuredSum.toString() === '1') {
                                $scope.obJsonMail.ldrTerrErupVolcEdificio = "AMPARADA";
                            } else {
                                $scope.obJsonMail.ldrTerrErupVolcEdificio = value.insuredSum;
                            }
                        }
                    }

                    if (value.code.toString() === "3030") {
                        if ($scope.obJsonMail.ldrEdificio.toString() !== "") {
                            if ($scope.obJsonMail.ldrEdificio.toString() === value.insuredSum.toString() || value.insuredSum.toString() === '1') {
                                $scope.obJsonMail.ldrTodoRiesIncAdicEdificio = "AMPARADA";
                            } else {
                                $scope.obJsonMail.ldrTodoRiesIncAdicEdificio = value.insuredSum;
                            }
                        }
                    }

                    if (value.code.toString() === "3050") {
                        if (value.insuredSum === undefined || value.insuredSum === null || value.insuredSum === 0) {
                            $scope.obJsonMail.ldrContenido = "";
                        } else {
                            $scope.obJsonMail.ldrContenido = value.insuredSum;
                        }
                    }

                    if (value.code.toString() === "3051") {
                        if ($scope.obJsonMail.ldrContenido.toString() !== "") {
                            if ($scope.obJsonMail.ldrContenido.toString() === value.insuredSum.toString() || value.insuredSum.toString() === '1') {
                                $scope.obJsonMail.ldrIncendioAdicionalesCont = "AMPARADA";
                            } else {
                                $scope.obJsonMail.ldrIncendioAdicionalesCont = value.insuredSum;
                            }
                        }
                    }

                    if (value.code.toString() === "3052") {
                        if ($scope.obJsonMail.ldrContenido.toString() !== "") {
                            if ($scope.obJsonMail.ldrContenido.toString() === value.insuredSum.toString() || value.insuredSum.toString() === '1') {
                                $scope.obJsonMail.ldrExplosionCont = "AMPARADA";
                            } else {
                                $scope.obJsonMail.ldrExplosionCont = value.insuredSum;
                            }
                        }
                    }

                    if (value.code.toString() === "3053") {
                        if ($scope.obJsonMail.ldrContenido.toString() !== "") {
                            if ($scope.obJsonMail.ldrContenido.toString() === value.insuredSum.toString() || value.insuredSum.toString() === '1') {
                                $scope.obJsonMail.ldrHuelAlbPopCont = "AMPARADA";
                            } else {
                                $scope.obJsonMail.ldrHuelAlbPopCont = value.insuredSum;
                            }
                        }
                    }

                    if (value.code.toString() === "3054") {
                        if ($scope.obJsonMail.ldrContenido.toString() !== "") {
                            if ($scope.obJsonMail.ldrContenido.toString() === value.insuredSum.toString() || value.insuredSum.toString() === '1') {
                                $scope.obJsonMail.ldrNavAereaVehiHumoCont = "AMPARADA";
                            } else {
                                $scope.obJsonMail.ldrNavAereaVehiHumoCont = value.insuredSum;
                            }
                        }
                    }

                    if (value.code.toString() === "3070") {
                        if ($scope.obJsonMail.ldrContenido.toString() !== "") {
                            if ($scope.obJsonMail.ldrContenido.toString() === value.insuredSum.toString() || value.insuredSum.toString() === '1') {
                                $scope.obJsonMail.ldrFenHidroCont = "AMPARADA";
                            } else {
                                $scope.obJsonMail.ldrFenHidroCont = value.insuredSum;
                            }
                        }
                    }

                    if (value.code.toString() === "3071") {
                        if ($scope.obJsonMail.ldrContenido.toString() !== "") {
                            if ($scope.obJsonMail.ldrContenido.toString() === value.insuredSum.toString() || value.insuredSum.toString() === '1') {
                                $scope.obJsonMail.ldrTerrErupVolcCont = "AMPARADA";
                            } else {
                                $scope.obJsonMail.ldrTerrErupVolcCont = value.insuredSum;
                            }
                        }
                    }

                    if (value.code.toString() === "3080") {
                        if ($scope.obJsonMail.ldrContenido.toString() !== "") {
                            if ($scope.obJsonMail.ldrContenido.toString() === value.insuredSum.toString() || value.insuredSum.toString() === '1') {
                                $scope.obJsonMail.ldrTodoRiesIncAdicCont = "AMPARADA";
                            } else {
                                $scope.obJsonMail.ldrTodoRiesIncAdicCont = value.insuredSum;
                            }
                        }
                    }

                    if (value.code.toString() === "3210") {
                        if (value.insuredSum === undefined || value.insuredSum === null || value.insuredSum === 0) {
                            $scope.obJsonMail.ldrRemocionEscombros = "";
                        } else {
                            $scope.obJsonMail.ldrRemocionEscombros = value.insuredSum;
                        }
                    }

                    if (value.code.toString() === "3211") {
                        if ($scope.obJsonMail.ldrRemocionEscombros.toString() !== "") {
                            if ($scope.obJsonMail.ldrRemocionEscombros.toString() === value.insuredSum.toString() || value.insuredSum.toString() === '1') {
                                $scope.obJsonMail.ldrIncendioRemocion = "AMPARADA";
                            } else {
                                $scope.obJsonMail.ldrIncendioRemocion = value.insuredSum;
                            }
                        }
                    }

                    if (value.code.toString() === "3212") {
                        if ($scope.obJsonMail.ldrRemocionEscombros.toString() !== "") {
                            if ($scope.obJsonMail.ldrRemocionEscombros.toString() === value.insuredSum.toString() || value.insuredSum.toString() === '1') {
                                $scope.obJsonMail.ldrFenHidroRemocion = "AMPARADA";
                            } else {
                                $scope.obJsonMail.ldrFenHidroRemocion = value.insuredSum;
                            }
                        }
                    }

                    if (value.code.toString() === "3213") {
                        if ($scope.obJsonMail.ldrRemocionEscombros.toString() !== "") {
                            if ($scope.obJsonMail.ldrRemocionEscombros.toString() === value.insuredSum.toString() || value.insuredSum.toString() === '1') {
                                $scope.obJsonMail.ldrTerrErupVolcRemocion = "AMPARADA";
                            } else {
                                $scope.obJsonMail.ldrTerrErupVolcRemocion = value.insuredSum;
                            }
                        }
                    }

                    if (value.code.toString() === "3220") {
                        if (value.insuredSum === undefined || value.insuredSum === null || value.insuredSum === 0) {
                            $scope.obJsonMail.ldrGasExtraCasaHabitacion = "";
                        } else {
                            $scope.obJsonMail.ldrGasExtraCasaHabitacion = value.insuredSum;
                        }
                    }

                    if (value.code.toString() === "3221") {
                        if ($scope.obJsonMail.ldrGasExtraCasaHabitacion.toString() !== "") {
                            if ($scope.obJsonMail.ldrGasExtraCasaHabitacion.toString() === value.insuredSum.toString() || value.insuredSum.toString() === '1') {
                                $scope.obJsonMail.ldrIncendioGastExtras = "AMPARADA";
                            } else {
                                $scope.obJsonMail.ldrIncendioGastExtras = value.insuredSum;
                            }
                        }
                    }

                    if (value.code.toString() === "3222") {
                        if ($scope.obJsonMail.ldrGasExtraCasaHabitacion.toString() !== "") {
                            if ($scope.obJsonMail.ldrGasExtraCasaHabitacion.toString() === value.insuredSum.toString() || value.insuredSum.toString() === '1') {
                                $scope.obJsonMail.ldrFenHidroGatExtras = "AMPARADA";
                            } else {
                                $scope.obJsonMail.ldrFenHidroGatExtras = value.insuredSum;
                            }
                        }
                    }

                    if (value.code.toString() === "3223") {
                        if ($scope.obJsonMail.ldrGasExtraCasaHabitacion.toString() !== "") {
                            if ($scope.obJsonMail.ldrGasExtraCasaHabitacion.toString() === value.insuredSum.toString() || value.insuredSum.toString() === '1') {
                                $scope.obJsonMail.ldrTerrErupVolcGastExtras = "AMPARADA";
                            } else {
                                $scope.obJsonMail.ldrTerrErupVolcGastExtras = value.insuredSum;
                            }
                        }
                    }

                    if (value.code.toString() === "3401") {
                        if (value.insuredSum === undefined || value.insuredSum === null || value.insuredSum === 0) {
                            $scope.obJsonMail.ldrRCFamiliar = "";
                        } else {
                            $scope.obJsonMail.ldrRCFamiliar = value.insuredSum;
                        }
                    }

                    if (value.code.toString() === "3442") {
                        if ($scope.obJsonMail.ldrRCFamiliar.toString() !== "") {
                            if ($scope.obJsonMail.ldrRCFamiliar.toString() === value.insuredSum.toString() || value.insuredSum.toString() === '1') {
                                $scope.obJsonMail.ldrRCArrendamiento = "AMPARADA";
                            } else {
                                $scope.obJsonMail.ldrRCArrendamiento = value.insuredSum;
                            }
                        }
                    }

                    if (value.code.toString() === "3441") {
                        if ($scope.obJsonMail.ldrRCFamiliar.toString() !== "") {
                            if ($scope.obJsonMail.ldrRCFamiliar.toString() === value.insuredSum.toString() || value.insuredSum.toString() === '1') {
                                $scope.obJsonMail.ldrRCTrabDomestico = "AMPARADA";
                            } else {
                                $scope.obJsonMail.ldrRCTrabDomestico = value.insuredSum;
                            }
                        }
                    }

                    if (value.code.toString() === "3500") {
                        if (value.insuredSum === undefined || value.insuredSum === null || value.insuredSum === 0) {
                            $scope.obJsonMail.ldrRoboDeMenaje = "";
                        } else {
                            $scope.obJsonMail.ldrRoboDeMenaje = value.insuredSum;
                        }
                    }

                    if (value.code.toString() === "3501") {
                        if ($scope.obJsonMail.ldrRoboDeMenaje.toString() !== "") {
                            if ($scope.obJsonMail.ldrRoboDeMenaje.toString() === value.insuredSum.toString() || value.insuredSum.toString() === '1') {
                                $scope.obJsonMail.ldrRoboConViolencia = "AMPARADA";
                            } else {
                                $scope.obJsonMail.ldrRoboConViolencia = value.insuredSum;
                            }
                        }
                    }

                    if (value.code.toString() === "3502") {
                        if ($scope.obJsonMail.ldrRoboDeMenaje.toString() !== "") {
                            if ($scope.obJsonMail.ldrRoboDeMenaje.toString() === value.insuredSum.toString() || value.insuredSum.toString() === '1') {
                                $scope.obJsonMail.ldrRoboPorAsalto = "AMPARADA";
                            } else {
                                $scope.obJsonMail.ldrRoboPorAsalto = value.insuredSum;
                            }
                        }
                    }

                    if (value.code.toString() === "3503") {
                        if ($scope.obJsonMail.ldrRoboDeMenaje.toString() !== "") {
                            if ($scope.obJsonMail.ldrRoboDeMenaje.toString() === value.insuredSum.toString() || value.insuredSum.toString() === '1') {
                                $scope.obJsonMail.ldrJoyasArtValor = "AMPARADA";
                            } else {
                                $scope.obJsonMail.ldrJoyasArtValor = value.insuredSum;
                            }
                        }
                    }

                    if (value.code.toString() === "3504") {
                        if (value.insuredSum === undefined || value.insuredSum === null || value.insuredSum === 0) {
                            $scope.obJsonMail.ldrGtosMedAsaltDomicilio = "";
                        } else {
                            $scope.obJsonMail.ldrGtosMedAsaltDomicilio = value.insuredSum;
                        }
                    }

                    if (value.code.toString() === "3520") {
                        if (value.insuredSum === undefined || value.insuredSum === null || value.insuredSum === 0) {
                            $scope.obJsonMail.ldrDineroValores = "";
                        } else {
                            $scope.obJsonMail.ldrDineroValores = value.insuredSum;
                        }
                    }

                    if (value.code.toString() === "3530") {
                        if (value.insuredSum === undefined || value.insuredSum === null || value.insuredSum === 0) {
                            $scope.obJsonMail.ldrCristales = "";
                        } else {
                            $scope.obJsonMail.ldrCristales = value.insuredSum;
                        }
                    }


                    if (value.code.toString() === "3550") {
                        if (value.insuredSum === undefined || value.insuredSum === null || value.insuredSum === 0) {
                            $scope.obJsonMail.ldrObjPersonales = "";
                        } else {
                            $scope.obJsonMail.ldrObjPersonales = value.insuredSum;
                        }
                    }

                    if (value.code.toString() === "3660") {
                        if ($scope.obJsonMail.ldrObjPersonales.toString() !== "") {
                            if ($scope.obJsonMail.ldrObjPersonales.toString() === value.insuredSum.toString() || value.insuredSum.toString() === '1') {
                                $scope.obJsonMail.lbrEqElectro = "AMPARADA";
                            } else {
                                $scope.obJsonMail.lbrEqElectro = value.insuredSum;
                            }
                        }
                    }

                    if (value.code.toString() === "3910") {
                        if (value.insuredSum === undefined || value.insuredSum === null || value.insuredSum === 0) {

                        } else {
                            if (value.insuredSum.toString() === '1') {
                                $scope.obJsonMail.ldrAsistHogarViajes = "AMPARADA";
                            } else {
                                $scope.obJsonMail.ldrAsistHogarViajes = value.insuredSum;
                            }
                        }
                    }

                    if (value.code.toString() === "3911") {
                        if (value.insuredSum === undefined || value.insuredSum === null || value.insuredSum === 0) {
                        } else {
                            if (value.insuredSum.toString() === '1') {
                                $scope.obJsonMail.ldrExtGarEnViajesNalEInt = "AMPARADA";
                            } else {
                                $scope.obJsonMail.ldrExtGarEnViajesNalEInt = value.insuredSum;
                            }
                        }
                    }

                    if (value.code.toString() === "3920") {
                        if (value.insuredSum === undefined || value.insuredSum === null || value.insuredSum === 0) {
                        } else {
                            if (value.insuredSum.toString() === '1') {
                                $scope.obJsonMail.ldrAsistLegal = "AMPARADA";
                            } else {
                                $scope.obJsonMail.ldrAsistLegal = value.insuredSum;
                            }
                        }
                    }

                    if (value.code.toString() === "3921") {
                        if (value.insuredSum === undefined || value.insuredSum === null || value.insuredSum === 0) {
                        } else {
                            if (value.insuredSum.toString() === '1') {
                                $scope.obJsonMail.ldrServDeAsistInformatica = "AMPARADA";
                            } else {
                                $scope.obJsonMail.ldrServDeAsistInformatica = value.insuredSum;
                            }
                        }
                    }

                });


                var copia = $scope.obJsonMail;
                insurancePymeSrv.sendEmailNotificationCotizationPyme(copia).then(function (_response) {
                    if (_response.success) {
                        CommonModalsSrv.done("Correo Enviado");
                    }
                });
            } catch (e) {

                
            }

        };

        $scope.onClicSendEmailNotificationCompraSeguro = function () {
            var _urlPoliza = window.location.href.indexOf("asesoria.actinver.com/asesoria") !== -1 ?
                'https://negocios.mapfre.com.mx/VIPII/wImpresion/MarcoImpresion.aspx?Poliza=' + vm.numPoliza + '&Endoso=0':
                'https://negociosuat.mapfre.com.mx/VIPII/wImpresion/MarcoImpresion.aspx?Poliza=' + vm.numPoliza + '&Endoso=0';
            var clienteNombre = vm.personType.toString() === '1' ? vm.apePaterno + ' ' + ' ' + vm.apeMaterno + ' ' + vm.nombres : vm.nombreCliente;
            var _email = (typeof vm.emailUser === 'undefined') ? "" : vm.emailUser;
            var _calle = (typeof vm.calle === 'undefined') ? "" : vm.calle;
            var _entidadFederativa = (typeof vm.cmd.dataHouseEntityRisk === 'undefined') ? "" : vm.cmd.dataHouseEntityRisk.type.text;
            var _minicipio = (typeof vm.cmd.dataHouseMunicipalityRisk === 'undefined') ? "" : vm.cmd.dataHouseMunicipalityRisk.type.text;
            var _codePostal = (typeof vm.cmd.dataHousePostalCodeRisk === 'undefined') ? "" : vm.cmd.dataHousePostalCodeRisk.type.text;
            var _tipoPago = (typeof vm.cmd.kindPaid === 'undefined') ? "" : vm.cmd.kindPaid.type.text;
            var _tipoMoneda = (typeof vm.cmd.currency === 'undefined') ? "" : vm.cmd.currency.type.text;
            var _tipoRiesgo = (typeof vm.cmd.kindRisk === 'undefined') ? "" : vm.cmd.kindRisk.type.text;
            var _tipoMuro = (typeof vm.cmd.kindStructure === 'undefined') ? "" : vm.cmd.kindStructure.type.text;
            var _tipoTecho = (typeof vm.cmd.kindRoof === 'undefined') ? "" : vm.cmd.kindRoof.type.text;
            var _tipoSecuridad = (typeof vm.cmd.securityActions === 'undefined') ? "" : vm.cmd.securityActions.type.text;
            var _type = !!vm.cotizacionSeleccionada;
            var _quotation = _type ? JSON.parse(vm.cotizacionSeleccionada.quotationJsonIni) : null;

            if (_quotation && _quotation.catalogosCotizacion) {
                var cat = _quotation.catalogosCotizacion;
                _email = vm.cotizacionSeleccionada.emailCliente;
                _calle = _quotation.Street;
                _entidadFederativa = cat.dataHouseEntityRisk.type.text;
                _minicipio = cat.dataHouseMunicipalityRisk.type.text;
                _codePostal = cat.dataHousePostalCodeRisk.type.text;
                _tipoPago = cat.kindPaid.type.text;
                _tipoMoneda = cat.currency.type.text;
                _tipoRiesgo = cat.kindRisk.type.text;
                _tipoMuro = cat.kindStructure.type.text;
                _tipoTecho = cat.kindRoof.type.text;
                _tipoSecuridad = cat.securityActions.type.text;
            }

            $scope.obJsonMail = {
                'language': 'SPA',
                'emailFrom': 'seguros@actinver.com.mx',
                'idTemplate': 'buildDBTemplate|18',
                'emailSubject': 'Póliza emitida seguro de hogar  ' + clienteNombre + ' ' + vm.numPoliza,
                'mailTo': _email,
                'mailCC': '',
                'polizaSeguro': (typeof vm.numPoliza === 'undefined') ? "" : vm.numPoliza,
                'fechaInicioVigencia': (typeof vm.insurancePolicyDate === 'undefined') ? "" : moment(vm.insurancePolicyDate).format("DD/MM/YYYY"),
                'fechaFinVigencia': (typeof vm.policyMaturityDate === 'undefined') ? "" : moment(vm.policyMaturityDate).format("DD/MM/YYYY"),
                'fechaLimitePago': (typeof vm.emission.payment.dateAprox === 'undefined') ? moment(new Date()).format('DD/MM/YYYY') : moment(vm.emission.payment.dateAprox).format("DD/MM/YYYY"),
                "dataHouseEntityRisk": _entidadFederativa,
                "dataHouseMunicipalityRisk": _minicipio,
                "dataHousePostalCodeRisk": _codePostal,
                "kindPaid": _tipoPago,
                "currency": _tipoMoneda,
                "calle": _calle,
                "kindRisk": _tipoRiesgo,
                "kindStructure": _tipoMuro,
                "kindRoof": _tipoTecho,
                "securityActions": _tipoSecuridad,
                "urlPolizaImpresion": _urlPoliza
            };

            if (_entidadFederativa !== "") {
                insurancePymeSrv.sendEmailNotificationEmisionPyme($scope.obJsonMail).then(function (_response) {
                    if (_response.success) {
                        CommonModalsSrv.done("Correo Enviado.");
                    } else {
                        CommonModalsSrv.error("El correo no fue enviado.");
                    }
                });
            } else {
                CommonModalsSrv.error("El correo no fue enviado.");
            }
        };

        function formatCurrency(amount) {
            var decimals = 2;
            amount += ''; // por si pasan un numero en vez de un string
            amount = parseFloat(amount.replace(/[^0-9\.]/g, '')); // elimino cualquier cosa que no sea numero o punto

            decimals = decimals || 0; // por si la variable no fue fue pasada
            // si no es un numero o es igual a cero retorno el mismo cero
            if (isNaN(amount) || amount === 0)
                return parseFloat(0).toFixed(decimals);
            // si es mayor o menor que cero retorno el valor formateado como numero
            amount = '' + amount.toFixed(decimals);

            var amount_parts = amount.split('.'),
                    regexp = /(\d+)(\d{3})/;

            while (regexp.test(amount_parts[0]))
                amount_parts[0] = amount_parts[0].replace(regexp, '$1' + ',' + '$2');

            return amount_parts.join('.');
        }

        function encode(string) {
            string = string.replace(/\r\n/g, "\n");

            var utftext = "";
            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }
            return utftext;
        }

        function decode(utftext) {
            var string = "";
            var i = 0;
            var c = 0;
            var c1 = 0;
            var c2 = 0;

            while (i < utftext.length) {
                c = utftext.charCodeAt(i);
                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                } else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                } else {
                    c2 = utftext.charCodeAt(i + 1);
                    var c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }
            }
            return string;
        }

        $scope.updateSelection = function (position, elemento, list, $event) {

            var cot = elemento.cotizacion;

            if ($event.currentTarget.checked) {
                vm.cotizacionSeleccionada = elemento;
                vm.botonContratar = "Contratar";
            } else {
                vm.cotizacionSeleccionada = undefined;
                vm.botonContratar = "Cotizar";
            }

            angular.forEach(list, function (option, index) {
                if (cot !== list[index].cotizacion) {
                    option.checked = false;
                }
            });
        };
    }

})();
