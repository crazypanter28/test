(function () {
    'use strict';
    angular
        .module('actinver.controllers')
        .controller('insuranceLifeCtrl', insuranceLifeCtrl);


    function insuranceLifeCtrl($state, $scope, $filter, $window, $stateParams, $sessionStorage, insuranceLifeSrv, CommonModalsSrv) {
        var vm = this;
        var pageVisited = [];
        var agentCodeR = $scope.$parent.agentSelected.id;
        var usrRol = JSON.parse($sessionStorage.user).roles;
        var isProduccion = window.location.href.indexOf("asesoria.actinver.com/asesoria") === -1 ? false : true;
        var scrSize = $window.matchMedia("(max-width: 767px)");
        scrSize.onchange = function (ev) {
            vm.txtClass = ev.target.matches ? 'text-left' : 'text-right';
        };

        if (!$stateParams.model) {
            $state.go('insurance.main');
        }

        // VARIABLES
        vm.cmd = {};
        vm.indexUser = "";
        vm.actualPage = 0;
        vm.personType = '1';
        vm.numeroCliente = "";
        vm.disabledRFC = false;
        vm.txtClass = scrSize.matches ? 'text-left' : 'text-right';
        vm.mailRegex = /^[a-zA-Z._\-0-9]{4,}@[a-zA-Z_\-0-9]{2,}.[a-zA-Z]{2,5}([.a-zA-Z]+)?$/;
        // DATOS DEL CONTRATANTE
        vm.nombres = "";
        vm.apePaterno = "";
        vm.apeMaterno = "";
        vm.nombreCliente = "";
        vm.numeroPoliza = "";
        vm.CURP = "";
        vm.extUser = "";
        vm.intUser = "";
        vm.colonia = "";
        vm.calleUser = "";
        vm.emailUser = "";
        vm.phoneUser = "";
        vm.sexoCliente = "";
        vm.fiscalIDNumber = "";
        vm.fechaNacimiento = false;
        vm.nacionalidad = "";
        vm.ListPais = [];
        vm.ListEntidades = [];
        vm.ListEstadoCivil = [];
        vm.ListPoblaciones = [];
        vm.ListPostalCodeLife = [];
        vm.ListaBeneficiarios = [];
        vm.listaPorcentajeTotal = [];
        // DATOS DEL ASEGURADO
        vm.nombreAsegurado = "";
        vm.apePaternoAsegurado = "";
        vm.apeMaternoAsegurado = "";
        vm.fechaNacimientoAsegurado = false;
        vm.rfcAsegurado = "";
        vm.edadAsegurado = "";
        vm.generoAsegurado = "";
        vm.phoneAsegurado = "";
        vm.calleAsegurado = "";
        vm.estadoAsegurado = "";
        vm.coloniaAsegurado = "";
        vm.municipioAsegurado = "";
        vm.codigoPostalAsegurado = "";
        vm.numeroExteriorAsegurado = "";
        vm.paisAsegurado = "";
        vm.estadoCivilAsegurado = "";
        vm.ListPoblacionesAsegurado = [];
        // CUESTIONARIO MEDICO        
        vm.kgs = "";
        vm.mts = "";
        vm.fuma = null;
        vm.cuestionario = [];
        vm.ListOcupacionA = [];
        vm.estatusCuestionario = [];
        // TIPO PLAN Y COBERTURAS ADICIONALES
        vm.fechaVigencia = false;
        vm.fechaFinVigencia = "";
        vm.ListaSumAsegurada = [];
        vm.insuredSum = 0;
        vm.pBasica = {};
        vm.pMa = {};
        // DESIGNACIÓN DE BENEFICIARIOS
        vm.updateFlag = false;
        vm.tipoBeneficiario = "";
        vm.parentescoB = "";
        vm.ListParentesco = [];
        vm.ListBeneficiary = [];
        vm.nombreB = "";
        vm.apePaternoB = "";
        vm.apeMaternoB = "";
        vm.porcentajeB = "";
        vm.fechaNacB = false;
        vm.telefonoB = "";
        vm.emailB = "";
        vm.sexoB = "";
        // REGISTRO DE CUENTA PARA CARGO DEL SEGURO
        vm.nombreCard = "";
        vm.apellidoPCard = "";
        vm.apellidoMCard = "";
        vm.account = "";
        vm.clabeInter = "";
        vm.ListPaymentType = [];
        vm.ListBanks = [];
        vm.ListCardType = [];
        vm.yearExpirationList = [];
        vm.monthExpirationList = [];
        vm.comboMonthExpiration = "";
        vm.comboYearExpiration = "";
        vm.cvvLen = 3;
        vm.accLen = 16;
        vm.ListTypeCLABE = [{
            id: '1',
            text: 'CLABE'
        }, {
            id: '2',
            text: 'DEBITO'
        }];
        // OPCIONES DE CALENDARIOS
        vm.contractDatePickOp = {
            minDate: moment(new Date().setYear(new Date().getFullYear() - 64)).format('DD/MM/YYYY'),
            maxDate: moment(new Date().setYear(new Date().getFullYear() - 18)).format('DD/MM/YYYY')
        };
        vm.beneficiaryDatePickOp = {
            minDate: moment(new Date().setYear(new Date().getFullYear() - 110)).format('DD/MM/YYYY'),
            maxDate: moment(new Date()).format('DD/MM/YYYY')
        };
        vm.vigenciaDatePickOp = {
            minDate: moment(new Date()).format('DD/MM/YYYY'),
            maxDate: moment(new Date().setMonth(new Date().getMonth() + 1)).format('DD/MM/YYYY')
        };
        vm.payDatePickOp = {
            minDate: new Date(),
            maxDate: moment(new Date().setMonth(new Date().getMonth() + 1)).format('DD/MM/YYYY'),
            isInvalidDate: function (date) {
                return (date.day() === 0 || date.day() === 6) ? true : false;
            }
        };
        // DECLARACION DE FUNCIONES
        vm.go2page = go2page;
        vm.sumaanio = sumaanio;
        vm.regresoMain = regresoMain;
        vm.selectBankId = selectBankId;
        vm.selectTypeCard = selectTypeCard;
        vm.AseContratante = AseContratante;
        vm.activarCheckAseCon = activarCheckAseCon;
        vm.saveBeneficiario = saveBeneficiario;
        vm.editBeneficiario = editBeneficiario;
        vm.updateBeneficiario = updateBeneficiario;
        vm.deleteBeneficiario = deleteBeneficiario;
        vm.calculaEdadAsegurado = calculaEdadAsegurado;
        //vm.onChangeListEntity = onChangeListEntity;
        //vm.onChangeListPostalCode = onChangeListPostalCode;
        vm.forceKeyPressUppercase = forceKeyPressUppercase;
        vm.numberSecuential = numberSecuential;
        vm.soloTextAndNum = soloTextAndNum;
        vm.soloNumero = soloNumero;
        vm.charrepeat = charrepeat;
        vm.soloText = soloText;
        vm.imprimirPolizaLife = imprimirPolizaLife;
        vm.imprimirCondiciones = imprimirCondiciones;
        vm.imprimirSolicitudLife = imprimirSolicitudLife;
        vm.seleccionaPersonalidad = seleccionaPersonalidad;
        vm.ServiceEmailLifePolizaLista = ServiceEmailLifePolizaLista;
        vm.getInsuranceLifeHkJValidation = getInsuranceLifeHkJValidation;
        vm.ServiceLifeInsurancePolicyRegistration = ServiceLifeInsurancePolicyRegistration;
        //vm.ServiceEmailLifeSolicitudUsuario = ServiceEmailLifeSolicitudUsuario;
        //vm.ServiceEmailLifeNotificacionAsesor = ServiceEmailLifeNotificacionAsesor;
        //Funciones Eder Lugo
        vm.validateActinverEmail = validateActinverEmail;

        function getEmailDomain(email) {
            return email.split('@')[1];
        }

        function validateActinverEmail(email) {
            if (email != '' && email != null && email != undefined) {
                if (getEmailDomain(email.toLowerCase()) == 'actinver.com.mx') {
                    CommonModalsSrv.info("Por regulación no esta permitido ingresar un correo electrónico de Actinver");
                    return false;
                } else {
                    return true;
                }
            }
        }
        /*
        function validatedEachTotal() {
            var tipoBeneficiario = new Array(); //Creamos un array para almancear todos los tipos de beneficiarios            

            tipoBeneficiario = [
                'PRINCIPAL',
                'EN CASO DE FALLECIMIENTO',
                'EN CASO DE MINORIA DE EDAD',
                'EN CASO DE REMANANTE'
            ];

            if(vm.ListaBeneficiarios.length == 0) { //Validamos que por lo menos exista un beneficiario
                CommonModalsSrv.info('Favor de añadir por lo menos un beneficiario');
                return;
            }            

            for (var index = 0; index < tipoBeneficiario.length; index++) { //Recorremos el array que acabamos de crear. Atención, actualizar el array cuando existan más tipos de beneficiarios
                vm.totales = {}; //Creamos un objeto, el cual contendrá los totales por cada tipo de beneficiario.
                vm.totales[tipoBeneficiario[index]] = 0; //Inicializamos el total el 0
                vm.ListaBeneficiarios.forEach(function (element) { //Recorremos el array de beneficiarios y buscamos los que correspondan al tipo de beneficiario que actualmente se está iterando
                    if (tipoBeneficiario[index] == element.tipoBeneficiario) //Cuando coincidan significa que el usuario añadió un beneficiario y añadimos el total asignado
                    vm.totales[tipoBeneficiario[index]] += parseInt(element.porcentajeB, 10);
                });

                if (vm.totales[tipoBeneficiario[index]] != 100 && vm.totales[tipoBeneficiario[index]] != 0) { //Validamos el total final, si es 100 significa que ya está completo el porcentaje y si es 0 significa que no añadió ninguno beneficiario para la iteración actual
                    CommonModalsSrv.info('La suma del porcentaje de todos los beneficiarios de tipo ' + tipoBeneficiario[index] + ' debe ser igual al 100%. Actualmente tienes el ' + vm.totales[tipoBeneficiario[index]] + '%');
                    return false;
                }
            }
            return true;
        }
        //Fin funciones Eder ListCodPostalAsegurado         
        
        vm.getAvailableQuotation = getAvailableQuotation;
        vm.LiberacionConfirmada = LiberacionConfirmada;
        vm.CancelarPoliza = CancelarPoliza;
        vm.emission = emission;
        vm.liberacion = liberacion;

        ListaPolizasVida();
        */

        go2page(1);

        function go2page(pageNumber) {
            switch (pageNumber) {
                case 0:
                    vm.pageNotFound = false;
                    vm.actualPage = pageNumber;
                    break;
                case 1:
                    if (!pageVisited[pageNumber]) {
                        getCuestionario();
                        vm.ListOcupacionA = getCatalagoOcupaciones();
                        pageVisited[pageNumber] = true;
                    }
                    vm.actualPage = pageNumber;
                    break;
                case 2:
                    pagina2(pageNumber);
                    break;
                case 3:
                    if (vm.actualPage == 2) {
                        if(validaDatos()) {
                            if (!pageVisited[pageNumber]) {
                                vm.ListaSumAsegurada = getSumaryQuery();
                                pageVisited[pageNumber] = true;
                            }                        
                            vm.actualPage = pageNumber;
                        }
                    } else 
                        vm.actualPage = pageNumber;                      
                    break;
                case 4:
                    if (!pageVisited[pageNumber]) {
                        pageVisited[pageNumber] = true;
                        vm.ListParentesco = getCatalogoLifeParentescos();
                        vm.ListBeneficiary = getCatalogoLifeBeneficiarios();
                    } 
                    vm.actualPage = pageNumber;
                    break;
                case 5:
                    if(vm.ListaBeneficiarios.length > 0 && vm.listaPorcentajeTotal.every(function (benef) {
                        return benef.total == 100; })) {
                        if (!pageVisited[pageNumber]) {
                            pageVisited[pageNumber] = true;
                            vm.ListBanks = getCatalogBanks();
                            vm.ListCardType = getCatalogCardTypeQuery();
                            vm.ListPaymentType = getCatalogPaymentTypeQuery();
                            vm.monthExpirationList = getMonthExpirationList();
                            vm.yearExpirationList = getYearExpirationList();
                        }
                        vm.actualPage = pageNumber;
                    } else CommonModalsSrv.error('La suma del porcentaje por cada tipo de beneficiario debe ser igual al 100%.');
                    break;
                case 6:
                    CommonModalsSrv.info("Hago constar que el cliente actúa en nombre y cuenta propia o con las facultades suficientes otorgadas por su representada(do); y que los recursos utilizados en la o las operaciones provienen de actividades lícitas.")
                    vm.fechaVigencia = moment(vm.fechaVigencia).format("DD/MM/YYYY");
                    pageVisited[pageNumber] = true;    
                    vm.actualPage = pageNumber;
                    break;
                default:
                    vm.pageNotFound = true;
                    vm.actualPage = pageNumber;
                    CommonModalsSrv.error("No se encontró la página");
                break;
            }
        }
        
        function pagina2(pageNumber) {
            insuranceLifeSrv.getInsuranceLifeHighRiskJobValidation(vm.cmd.dataOcupacion.id).then(function (_res) {
                if (_res.success) {
                    if (_res.info === "true" || vm.kgs / (vm.mts * vm.mts) > 29.99 || !vm.estatusCuestionario.every(function (i){return i;})) {
                        CommonModalsSrv.info("Estimado Asesor lamento informarle que al ingresar los datos a nuestro sistema automático de suscripción, no nos permitió ofrecer ésta protección de manera inmediata, por lo que te invitamos a revisar con el área de seguros esta solicitud para evaluación.");
                        return;
                    }
                    if (!pageVisited[pageNumber]) {
                        valCotizar();
                        pageVisited[pageNumber] = true;
                    }
                    vm.actualPage = pageNumber;
                } else {
                    CommonModalsSrv.error("Ocurrió un error al validar la ocupación");
                }
            });
        }

        function valCotizar() {
            var datosCliente = $stateParams.model.datosCliente;
            var validatePoup = $stateParams.model.validatePopup;
            getNationality();
            vm.ListEstadoCivil = getMarital();
            vm.ListEntidades = getCatalogoEntidades();
            vm.personType = $stateParams.model.personType;
            vm.nombreCliente = $stateParams.model.nombreCliente;
            vm.nombres = $stateParams.model.nombres;
            vm.apePaterno = $stateParams.model.apePaterno;
            vm.apeMaterno = $stateParams.model.apeMaterno;
            vm.fiscalIDNumber = $stateParams.model.fiscalIDNumber;
            vm.CURP = $stateParams.model.curp;
            vm.disabledRFC = $stateParams.model.disabledRFC;
            vm.numeroCliente = $stateParams.model.numeroCliente;
            
            if (vm.nombreCliente !== "" && validatePoup === false) {
                CommonModalsSrv.confirm("¿" + vm.nombreCliente + " es el asegurado titular de la cuenta?")
                    .result.then(
                        function () {
                            vm.emailUser = (typeof datosCliente.email === 'undefined') ? '' : datosCliente.email[0].email;
                            vm.titular = true;
                            validatePoup = true;
                            vm.fechaNacimiento = $stateParams.model.birthDay;
                        }
                    ).catch(function (res) {
                        if ((res === "cancel" || res === "escape key press" || res === "backdrop click")) {
                            datosCliente = [];
                            vm.fiscalIDNumber = "";
                            vm.CURP = "";
                            vm.fechaNacimiento = false;
                            vm.disabledRFC = false;
                            vm.nombreCliente = "";
                            vm.nombres = "";
                            vm.apePaterno = "";
                            vm.apeMaterno = "";
                            validatePoup = true;
                            go2page(0);
                        }
                    });
            } else {
                vm.emailUser = '';
            }
        }
        
        function validaDatos() {
            if (!vm.fechaNacimiento) {
                if (vm.personType === '1') {
                    CommonModalsSrv.error("Favor de Capturar el campo de Fecha de Nacimiento");
                } else {
                    CommonModalsSrv.error("Favor de Capturar el campo de Fecha Constitutiva");
                }
                return false;
            }
            vm.edad = calculaEdad(moment(vm.fechaNacimiento, "DD/MM/YYYY"));
            if (!validateActinverEmail(vm.emailUser)) return false;
            if (vm.personType === '1' && (vm.edad < 18 || vm.edad > 64)) {
                CommonModalsSrv.error("La edad de contratación debe ser mayor a 18 años y menor a 64 años 11 meses");
                return false;
            } 
            if (vm.edadAsegurado != vm.edadAseguradoFake) {
                CommonModalsSrv.error("La fecha de nacimiento no corresponde con la edad capturada en el paso anterior");
                return false;
            }
            if (vm.numeroCliente == 9999)
                return validaRFCyCURP();
            
            return true;
        }

        function validaRFCyCURP() {
            var dateArray = [];
            var subDateCon = "";
            var subDateIns = "";
            var birthDateCon = moment(vm.fechaNacimiento).format('DD/MM/YYYY');
            var birthDateIns = moment(vm.fechaNacimientoAsegurado).format('DD/MM/YYYY');
            var rfcConDate = vm.personType == '1' ? vm.fiscalIDNumber.substring(4, 10) : vm.fiscalIDNumber.substring(3, 9);
            dateArray = birthDateCon.split("/");
            subDateCon += dateArray[2].substring(2, 4);
            subDateCon += dateArray[1];
            subDateCon += dateArray[0];
            dateArray = birthDateIns.split("/");
            subDateIns += dateArray[2].substring(2, 4);
            subDateIns += dateArray[1];
            subDateIns += dateArray[0];

            if (subDateCon === rfcConDate && subDateIns === vm.rfcAsegurado.substring(4, 10)) {
                if (vm.personType == '1') {
                    if (subDateCon === vm.CURP.substring(4, 10)) {
                        return true;
                    } else {
                        CommonModalsSrv.error("La fecha de nacimiento no coincide con el CURP");
                        return false;
                    }
                }
                return true;
            }
            CommonModalsSrv.error("La fecha de nacimiento" + (vm.personType == '2' ? 
                " y/o la fecha constitutiva" : "") + " no coincide" + (vm.personType == '2' ? "n" : "") + " con el RFC");
            return false;                        
        }

        function calculaEdad(fechaMoment) {
            return moment().diff(fechaMoment, 'years');
        }

        function calculaEdadAsegurado() {
            vm.edadAsegurado = vm.fechaNacimientoAsegurado ? calculaEdad(vm.fechaNacimientoAsegurado) : 0;
        }

        function sumaanio() {
            if (vm.fechaVigencia)
                vm.fechaFinVigencia = moment(new Date(vm.fechaVigencia)).add(1, 'years').format('DD/MM/YYYY');
        }
        
        function seleccionaPersonalidad(persona) {
            vm.personType = persona;
            vm.actualPage = 2;
        }

        function getCuestionario() {
            insuranceLifeSrv.getCuestionario().then(function (response) {
                vm.cuestionario = response.info;
                vm.estatusCuestionario = vm.cuestionario.map(function (i){return true;});                
            });
        }

        function getCatalagoOcupaciones() {
            var _listaObtenida = [];
            insuranceLifeSrv.getCatalogExpenseJob().then(function (response) {
                if (response.success) {
                    angular.forEach(response.info, function (value) {
                        _listaObtenida.push({
                            id: value.jobID,
                            text: value.jobDescription,
                        });
                    });
                }
            });
            return _listaObtenida;
        }

        function getMarital() {
            var _listaObtenida = [];
            insuranceLifeSrv.getInsuranceMaritalStatusQuery().then(function (response) {
                if (response.success) {
                    angular.forEach(response.info, function (value) {
                        _listaObtenida.push({
                            id: value.maritalStatusID,
                            text: value.maritalStatus
                        });
                    });
                }
            });
            return _listaObtenida;
        }

        function getNationality() {
            insuranceLifeSrv.getLifeinsuranceNationalityQuery().then(function (response) {
                if (response.success) {
                    angular.forEach(response.info.data.outInsuranceCountryQuery.insuranceCountry, function (value) {
                        vm.ListPais.push({
                            id: value.countryISO,
                            text: value.country
                        });
                    });
                    vm.nacionalidad = vm.ListPais.find(function (country) {
                        return country.text.toUpperCase().startsWith("MEX");
                    });
                    vm.paisAsegurado = vm.nacionalidad;
                    vm.cmd.dataLifeContry = vm.nacionalidad;
                }
            });
        }

        function getCatalogoEntidades() {
            var _listaObtenida = [];
            insuranceLifeSrv.getLifeInsuranceStateQuery().then(function (_res) {
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

        function getCatalogoLifeParentescos() {
            var _listaObtenida = [];
            insuranceLifeSrv.getLifeInsuranceRelationshipQuery().then(function (response) {
                if (response.success) {
                    angular.forEach(response.info, function (value) {
                        if (value.expenseRelationshipDescription !== "TITULAR") {
                            _listaObtenida.push({
                                id: value.expenseRelationshipID,
                                text: value.expenseRelationshipDescription
                            });
                        }
                    });
                }
            });
            return _listaObtenida;
        }

        function getCatalogoLifeBeneficiarios() {
            var _listaObtenida = [];
            insuranceLifeSrv.getServiceInsuranceBeneficiaryTypeQuery().then(function (response) {
                if (response.success) {
                    angular.forEach(response.info, function (value) {                    
                        _listaObtenida.push({
                            id: value.insuranceBeneficiaryTypeID,
                            text: value.insuranceBeneficiaryType
                        });                        
                    });
                    vm.tipoBeneficiario = _listaObtenida.find(function (beneficiario) {
                        return beneficiario.text.toUpperCase().startsWith("PRINCIPAL");
                    });
                }
            });
            return _listaObtenida;
        }

        function getCatalogBanks() {
            var _listaObtenida = [];
            insuranceLifeSrv.getCatalogBanks().then(function (_res) {
                if (_res.success) {
                    angular.forEach(_res.info, function (value) {
                        _listaObtenida.push({
                            id: value.bankID,
                            text: value.bankName
                        });
                    });
                    _listaObtenida.sort(function (a, b) {
                        if (a.text.toLowerCase() < b.text.toLowerCase()) return -1;
                        if (a.text.toLowerCase() > b.text.toLowerCase()) return 1;
                        return 0;
                    });
                }
            });
            return _listaObtenida;
        }

        function getCatalogPaymentTypeQuery() {
            var _listaObtenida = [];
            insuranceLifeSrv.getCatalogPaymentTypeQuery().then(function (response) {
                if (response.success) {
                    angular.forEach(response.info, function (value) {
                        if (value.paymentManagerName !== "AGENTE") {
                            _listaObtenida.push({
                                id: value.paymentManagerID,
                                text: value.paymentManagerName
                            });
                        }
                    });
                }
            });
            return _listaObtenida;
        }

        function selectBankId() {
            vm.cmd.cardType = typeof vm.cmd.cardType === 'undefined' ? "" : vm.cmd.cardType;
            if (vm.cmd.dataCarsAccountIdBanks.text.toString().toUpperCase().startsWith("AMERICAN")) {
                vm.accLen = 15;
                vm.cvvLen = 4;
                vm.cmd.cardType = vm.ListCardType.find(function (bankName) {
                    return bankName.text.toUpperCase().startsWith("AMERICAN");
                });
            } else {
                vm.accLen = 16;
                vm.cvvLen = 3;
            }
        }

        function selectTypeCard() {
            if (vm.account) {
                vm.cmd.cardType = typeof vm.cmd.cardType === 'undefined' ? "" : vm.cmd.cardType;
                vm.validCard = true;
                switch (vm.account.toString().substr(0, 1)) {
                    case '3':
                        vm.cmd.cardType = vm.ListCardType.find(function (bankName) {
                            return bankName.text.toUpperCase().startsWith("AMERICAN");
                        });
                        break;
                    case '4':
                        vm.cmd.cardType = vm.ListCardType.find(function (bankName) {
                            return bankName.text.toUpperCase().startsWith("VISA");
                        });
                        break;
                    case '5':
                        vm.cmd.cardType = vm.ListCardType.find(function (bankName) {
                            return bankName.text.toUpperCase().startsWith("MASTER");
                        });
                        break;
                    default:
                        vm.validCard = false;
                        vm.cmd.cardType = [];
                        break;
                }
            }
        }

        vm.vaciaTarjeta = function (lastValue, newValue) {
            if (newValue.text === "CLABE") {
                vm.account = "";
                vm.cmd.cardType = "";
                vm.comboMonthExpiration = "";
                vm.comboYearExpiration = "";
                vm.cvv = "";
                vm.validCard = true;
            } else {
                vm.clabeInter = "";
            }
        };

        function getCatalogCardTypeQuery() {
            insuranceLifeSrv.getCatalogCardTypeQuery().then(function (response) {
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
            })
        }

        vm.changeMunicipality = function (aseguradoSec) {
            var _listaObtenida = [];

            insuranceLifeSrv.getLifeInsuranceMunicipalityQuery(aseguradoSec ? vm.estadoAsegurado.id : vm.cmd.dataLifeEntity.id)
            .then(function (_res) {
                if (_res.success) {
                    angular.forEach(_res.info, function (value) {
                        _listaObtenida.push({
                            id: value.municipalityID,
                            text: value.delegationOrMunicipality
                        });
                    });                    
                    if(aseguradoSec) {
                        vm.ListPoblacionesAsegurado = _listaObtenida;
                        vm.municipioAsegurado = "";
                        vm.codigoPostalAsegurado = "";
                    } else {
                        vm.ListPoblaciones = _listaObtenida;
                        vm.cmd.dataLifeMunicipality = "";
                        vm.cmd.dataLifePostalCode = "";
                    }
                }
            });            
        };

        vm.changePostalCode = function (aseguradoSec) {
            var _listaObtenida = [];

            insuranceLifeSrv.getCatalogPostalCode(aseguradoSec ? vm.municipioAsegurado.id : vm.cmd.dataLifeMunicipality.id)
            .then(function (_res) {
                if (_res.success) {
                    angular.forEach(_res.info.postalCode, function (value) {
                        _listaObtenida.push({
                            id: value,
                            text: value
                        });
                    });
                    if(aseguradoSec) {
                        vm.ListCodPostalAsegurado = _listaObtenida;
                        vm.codigoPostalAsegurado = "";
                    } else {
                        vm.ListPostalCodeLife = _listaObtenida;
                        vm.cmd.dataLifePostalCode = "";
                    }
                }
            });
        };

        /*vm.onChangeListEntity = function (lastValue, newValue) {
            var _listaObtenida = [];
            var _EntityId = "";
            var _banderaEntityId = (typeof newValue.id === 'undefined') ? false : true;

            if (!_banderaEntityId) {
                CommonModalsSrv.error("Favor de Capturar una Entidad Federativa.");
            }
            _EntityId = newValue.id;
            insuranceLifeSrv.getLifeInsuranceMunicipalityQuery(_EntityId).then(function (_res) {
                if (_res.success) {
                    angular.forEach(_res.info, function (value) {
                        _listaObtenida.push({
                            id: value.municipalityID,
                            text: value.delegationOrMunicipality
                        });
                    });
                }
            });

            vm.ListPoblaciones = _listaObtenida;
            vm.ListPoblacionesAsegurado = _listaObtenida;
        };
        
        function onChangeListPostalCode(lastValue, newValue) {
            var _listaObtenida = [];
            var _MunicipalityId = "";
            var _banderaMunicipalityId = (typeof newValue.id === 'undefined') ? false : true;
            if (!_banderaMunicipalityId) {
                CommonModalsSrv.error("Favor de Capturar una Entidad Federativa.");
            }
            _MunicipalityId = newValue.id;
            insuranceLifeSrv.getCatalogPostalCode(_MunicipalityId).then(function (_res) {
                if (_res.success) {
                    angular.forEach(_res.info.postalCode, function (value) {
                        _listaObtenida.push({
                            id: value,
                            text: value
                        });
                    });
                    vm.cmd.dataHousePostalCodeRisk = {};
                    vm.ListPostalCodeLife = _listaObtenida;
                    vm.ListCodPostalAsegurado = _listaObtenida;
                }
            });
        }*/

        function AseContratante() {
            if (vm.isContratanteAsegurado) {
                vm.ListPoblacionesAsegurado = vm.ListPoblaciones;
                vm.ListCodPostalAsegurado = vm.ListPostalCodeLife;
                vm.nombreAsegurado = vm.nombres;
                vm.apePaternoAsegurado = vm.apePaterno;
                vm.apeMaternoAsegurado = vm.apeMaterno;
                vm.generoAsegurado = vm.sexoCliente;
                vm.rfcAsegurado = vm.fiscalIDNumber;
                vm.fechaNacimientoAsegurado = vm.fechaNacimiento;
                vm.calleAsegurado = vm.calleUser;
                vm.numeroExteriorAsegurado = vm.extUser;
                vm.coloniaAsegurado = vm.colonia;
                vm.edadAsegurado = calculaEdad(moment(vm.fechaNacimiento, "DD/MM/YYYY"));
                vm.phoneAsegurado = vm.phoneUser;
                vm.estadoCivilAsegurado = vm.cmd.dataLifeMarital;
                vm.estadoAsegurado = vm.cmd.dataLifeEntity;
                vm.municipioAsegurado = vm.cmd.dataLifeMunicipality;
                vm.codigoPostalAsegurado = vm.cmd.dataLifePostalCode;
                vm.paisAsegurado = vm.cmd.dataLifeContry;
            } else {
                vm.nombreAsegurado = "";
                vm.apePaternoAsegurado = "";
                vm.apeMaternoAsegurado = "";
                //vm.generoAsegurado = "";
                vm.rfcAsegurado = "";
                vm.fechaNacimientoAsegurado = false;
                vm.calleAsegurado = "";
                vm.numeroExteriorAsegurado = "";
                vm.coloniaAsegurado = "";
                vm.estadoCivilAsegurado = "";
                vm.estadoAsegurado = "";
                vm.municipioAsegurado = "";
                vm.codigoPostalAsegurado = "";
                vm.paisAsegurado = "";
                vm.phoneAsegurado = "";
                vm.edadAsegurado = "";
            }
        }

        vm.onAccumulateValidation = function (lastValue, newValue) {
            vm.insuredSum = parseFloat(newValue.id);
            serviceLifeInsuranceQuotation();

            var _params = {};
            _params.riskValidation = {
                edad: (vm.personType === '1') ? parseInt(vm.edadAsegurado) : parseInt(vm.edadAsegurado),
                nombre: (vm.personType === '1') ? vm.nombres : vm.nombreAsegurado,
                apePaterno: (vm.personType === '1') ? vm.apePaterno : vm.apePaternoAsegurado,
                apeMaterno: (vm.personType === '1') ? vm.apeMaterno : vm.apeMaternoAsegurado,
                birthDate: moment(vm.fechaNacimientoAsegurado, "DD/MM/YYYY").format("YYYY-MM-DD")
            }

            var _totalCummulo = parseFloat(vm.insuredSum) / 1.10;
            insuranceLifeSrv.getAccumulatedRisksValidation(parseInt(_totalCummulo), _params).then(function (response) {
                if (response.info.operationResult == 'N') {
                    CommonModalsSrv.info("Estimado Asesor lamento informarle que al ingresar sus datos a nuestro sistema automático de suscripción, no nos permitió ofrecerle ésta protección de manera inmediata, por lo que lo invitamos a enviar a las oficinas de MAPFRE su solicitud para su evaluación.");
                    vm.btnContinuarSA = false;
                } else {
                    vm.btnContinuarSA = true;
                    vm.primaTotal = response.info.totalBalance;
                    return vm.primaTotal;
                }
            });
        };
        
        function saveBeneficiario() {
            if (!validateActinverEmail(vm.emailB)) 
                return;            
            if(!porcentajeExcedido(vm.tipoBeneficiario.text, vm.porcentajeB)) {
                var beneficio = {
                    tipoBeneficiario: vm.tipoBeneficiario,
                    parentescoB: vm.parentescoB,
                    nombreB: vm.nombreB,
                    apePaternoB: vm.apePaternoB,
                    apeMaternoB: vm.apeMaternoB,
                    porcentajeB: vm.porcentajeB,
                    fechaNacB: vm.fechaNacB,
                    telefonoB: vm.telefonoB,
                    emailB: vm.emailB,
                    sexoB: vm.sexoB
                };
                vm.ListaBeneficiarios.push(beneficio);
                vm.tipoBeneficiario = "";
                vm.parentescoB = "";
                vm.nombreB = "";
                vm.apePaternoB = "";
                vm.apeMaternoB = "";
                vm.porcentajeB = "";
                vm.fechaNacB = false;
                vm.telefonoB = "";
                vm.emailB = "";
                vm.sexoB = "";
            } else CommonModalsSrv.error("El porcentaje total para el tipo de beneficiario "
                    + vm.tipoBeneficiario.text + " no se encuentra dentro de los límites permitidos (1 - 100)");
        }

        function editBeneficiario(index) {
            vm.tipoBeneficiario = vm.ListaBeneficiarios[index].tipoBeneficiario;
            vm.parentescoB = vm.ListaBeneficiarios[index].parentescoB;
            vm.nombreB = vm.ListaBeneficiarios[index].nombreB;
            vm.apePaternoB = vm.ListaBeneficiarios[index].apePaternoB;
            vm.apeMaternoB = vm.ListaBeneficiarios[index].apeMaternoB;
            vm.porcentajeB = vm.ListaBeneficiarios[index].porcentajeB;
            vm.porcentajeBAnterior = vm.ListaBeneficiarios[index].porcentajeB;
            vm.fechaNacB = vm.ListaBeneficiarios[index].fechaNacB;
            vm.telefonoB = vm.ListaBeneficiarios[index].telefonoB;
            vm.emailB = vm.ListaBeneficiarios[index].emailB;
            vm.sexoB = vm.ListaBeneficiarios[index].sexoB;
            vm.indexUser = index;
            vm.updateFlag = true;            
        }

        function updateBeneficiario() {
            // if (vm.porcentajeB != 0 && totalPorcentajeUp(vm.porcentajeB, vm.porcentajeBAnterior)) {
            if(!porcentajeUpdate(vm.tipoBeneficiario.text, vm.porcentajeB, vm.indexUser)) {
                vm.ListaBeneficiarios[vm.indexUser].tipoBeneficiario = vm.tipoBeneficiario;
                vm.ListaBeneficiarios[vm.indexUser].parentescoB = vm.parentescoB;
                vm.ListaBeneficiarios[vm.indexUser].nombreB = vm.nombreB;
                vm.ListaBeneficiarios[vm.indexUser].apePaternoB = vm.apePaternoB;
                vm.ListaBeneficiarios[vm.indexUser].apeMaternoB = vm.apeMaternoB;
                vm.ListaBeneficiarios[vm.indexUser].porcentajeB = vm.porcentajeB;
                vm.ListaBeneficiarios[vm.indexUser].fechaNacB = vm.fechaNacB;
                vm.ListaBeneficiarios[vm.indexUser].telefonoB = vm.telefonoB;
                vm.ListaBeneficiarios[vm.indexUser].emailB = vm.emailB;
                vm.ListaBeneficiarios[vm.indexUser].sexoB = vm.sexoB;
                vm.updateFlag = false;
                vm.tipoBeneficiario = "";
                vm.parentescoB = "";
                vm.nombreB = "";
                vm.apePaternoB = "";
                vm.apeMaternoB = "";
                vm.porcentajeB = "";
                vm.fechaNacB = false;
                vm.telefonoB = "";
                vm.emailB = "";
                vm.sexoB = "";
                vm.indexUser = "";
                vm.porcentajeBAnterior = "";
            } else CommonModalsSrv.error("El porcentaje total para el tipo de beneficiario "
                    + vm.tipoBeneficiario.text + " no se encuentra dentro de los límites permitidos (1 - 100)");
            // } else {
            //     if (vm.porcentajeB == 0) {
            //         CommonModalsSrv.info("El porcentaje asignado debe ser mayor a 0%.");
            //     } else {
            //         CommonModalsSrv.info("La suma del porcentaje de todos los beneficiarios no puede ser mayor al 100%");
            //     }
            // }
        }
        
        function deleteBeneficiario(index) {
            if (restaPorcentaje(vm.ListaBeneficiarios[index].tipoBeneficiario.text, vm.ListaBeneficiarios[index].porcentajeB)) {
                vm.ListaBeneficiarios.splice(index, 1);
                vm.tipoBeneficiario = "";
                vm.parentescoB = "";
                vm.nombreB = "";
                vm.apePaternoB = "";
                vm.apeMaternoB = "";
                vm.porcentajeB = "";
                vm.fechaNacB = false;
                vm.telefonoB = "";
                vm.emailB = "";
                vm.emailB = "";
                vm.indexUser = "";
                vm.porcentajeBAnterior = "";
            }            
        }
        
        function porcentajeExcedido(tipoBenefActual, porcentajeActual) {
            if (porcentajeActual > 100 || porcentajeActual <= 0)
                return true;
            var tiposBenef = vm.listaPorcentajeTotal.find(function (totalesObj) {
                return totalesObj.tipoBeneficiario == tipoBenefActual;
            });
            if(typeof tiposBenef === "undefined") {
                tiposBenef = {tipoBeneficiario: tipoBenefActual, total: parseInt(porcentajeActual, 10)};
                vm.listaPorcentajeTotal.push(tiposBenef);
                return false;
            } else {
                if(parseInt(tiposBenef.total, 10) + parseInt(porcentajeActual, 10) <= 100) { 
                    tiposBenef.total = parseInt(tiposBenef.total, 10) + parseInt(porcentajeActual, 10);
                    return false;
                }
            }
            return true;
        }

        function porcentajeUpdate(tipoBenefActual, porcentajeActual, index) {
            if (porcentajeActual > 100 || porcentajeActual <= 0)
                return true;
            var total = 0, count = 0;
            for(count = 0; count < vm.ListaBeneficiarios.length; count++) {
                if (count == index) 
                    continue;
                total += tipoBenefActual == vm.ListaBeneficiarios[count].tipoBeneficiario.text ? 
                    parseInt(vm.ListaBeneficiarios[count].porcentajeB, 10) : 0;                
            }
            if(total + parseInt(porcentajeActual, 10) <= 100) {
                var tiposBenef = vm.listaPorcentajeTotal.find(function (totalesObj) {
                    return totalesObj.tipoBeneficiario == tipoBenefActual;
                });
                if (tiposBenef) {
                    tiposBenef.total = parseInt(total, 10) + parseInt(porcentajeActual, 10);
                    return false;
                } else {
                    CommonModalsSrv.error("Ocurrió un error al actualizar el registro");
                    return true;
                }
            }
            return true;
        }

        function restaPorcentaje(tipoBenefActual, porcentajeActual) {
            var tiposBenef = vm.listaPorcentajeTotal.find(function (totalesObj) {
                return totalesObj.tipoBeneficiario == tipoBenefActual;
            });
            if(tiposBenef) {
                if(parseInt(tiposBenef.total, 10) - parseInt(porcentajeActual, 10) >= 0) {
                    tiposBenef.total = parseInt(tiposBenef.total, 10) - parseInt(porcentajeActual, 10);
                    return true;
                } else CommonModalsSrv.error("Ocurrió un error al eliminar el registro");
            } else CommonModalsSrv.error("Ocurrió un error al eliminar el registro");
            return false;
        }

        /*function totalPorcentaje(nuevoPorcentaje) {
            var total = 0;
            vm.ListaBeneficiarios.map(function benefunc(benef) {
                total += parseInt(benef.porcentajeB, 10);
            });
            return (total + parseInt(nuevoPorcentaje, 10)) <= 100;
        }

        function totalPorcentajeUp(nuevoPorcentaje, porcentajeBAnterior) {
            var total = 0;
            vm.ListaBeneficiarios.map(function benefunc(benef) {
                total += parseInt(benef.porcentajeB, 10);
            });
            total = total - porcentajeBAnterior;
            return total + parseInt(nuevoPorcentaje, 10) <= 100;
        }*/
        
        function getInsuranceLifeHkJValidation() {
            var _listaObtenida = [];
            insuranceLifeSrv.getInsuranceLifeHighRiskJobValidation().then(function (_res) {
                if (_res.success) {
                    angular.forEach(_res.info, function (value) {
                        _listaObtenida.push({
                            id: value.TotalBalance,
                            text: value.OperationResult
                        });
                    });
                }
            });
            return _listaObtenida;
        }

        function getSumaryQuery() {
            var _listaObtenida = [];
            insuranceLifeSrv.getSumaryQuery().then(function (_res) {
                if (_res.success) {
                    angular.forEach(_res.info, function (value) {
                        if (usrRol.includes('SEGUROS') || (usrRol.includes('ASESOR') && value.insuredSum >= 550000)) {
                            _listaObtenida.push({
                                id: value.insuredSumID,
                                text: $filter('currency')(value.insuredSum, '$', 2)
                            });
                        }
                    });
                }
            });
            return _listaObtenida;
        }

        //Funciones para las validaciones de campos
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
            var regex = new RegExp("^[\u00F1a-zA-Z]+$");
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

        function charrepeat(e, value) {
            var begin;
            var first;
            var second;
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

        function serviceLifeInsuranceQuotation() {
            var _params = {};
            _params.language = 'SPA',
                _params.insurancePolicyDate = moment(new Date()).format('YYYY-MM-DD'),
                _params.policyMaturityDate = moment(new Date(), 'YYYY-MM-DD').add(1, 'years').format('YYYY-MM-DD'),
                _params.agentCode = agentCodeR + "", //_params.agentCode='99998',
                _params.paymentManagerID = '1',
                _params.smokerFlag = vm.fuma,
                _params.clientNumber = vm.numeroCliente,
                _params.adviserID = '67890',
                _params.contractingData = {
                    name: vm.nombreAsegurado.toUpperCase(),
                    lastName: vm.apePaternoAsegurado.toUpperCase(),
                    secondLastName: vm.apeMaternoAsegurado.toUpperCase(),
                    fiscalIDNumber: vm.rfcAsegurado,
                    street: vm.calleAsegurado,
                    outdoorNumber: vm.numeroExteriorAsegurado,
                    neighborhood: vm.coloniaAsegurado,
                    postalCode: vm.codigoPostalAsegurado.id + "",
                    federalEntityID: parseInt(vm.estadoAsegurado.id),
                    delegationMunicipalityID: parseInt(vm.municipioAsegurado.id),
                    countryID: vm.paisAsegurado.id,
                    phoneNumber: vm.phoneAsegurado,
                    birthDate: moment(vm.fechaNacimientoAsegurado, "DD-MM-YYYY").format("YYYY-MM-DD"),
                    gender: vm.generoAsegurado,
                    maritalStatusID: vm.estadoCivilAsegurado.id,
                    nacionality: vm.paisAsegurado.id,
                    personType: (vm.personType === '1') ? 'F' : 'M',
                    email: vm.emailUser, //ERROR: no se actualiza
                    insuranceBeneficiaryTypeID: '6',
                    professionID: vm.cmd.dataOcupacion.id,
                    jobID: vm.cmd.dataOcupacion.id,
                    height: vm.mts,
                    weight: vm.kgs,
                    age: parseInt(vm.edadAsegurado)
                }
            _params.basicCoverage = {
                insuredSum: vm.insuredSum
            }
            _params.accidentalDeathCoverage = {
                insuredSum: vm.insuredSum
            }

            insuranceLifeSrv.getServiceLifeInsuranceQuotation(_params).then(function (response) {
                if (response.success) {
                    vm.pBasica = response.info.coverageList.coverageInformation[0].totalPremium;
                    vm.pMa = response.info.coverageList.coverageInformation[1].totalPremium;
                    vm.totalSum = vm.pBasica + vm.pMa;
                    vm.btnContinuarSAQuot = true;                    
                } else {
                    CommonModalsSrv.error("No se pudo realizar la cotización de su seguro, favor de comunicarse con el área de soporte. TX_ID: " + response.info.transactionID);
                    vm.btnContinuarSAQuot = false;
                }
            });
        }

        function ServiceLifeInsurancePolicyRegistration() {
            if (!validateActinverEmail(vm.email1)) //validamos que el correo no tenga dominio @actinver.com.mx
                return;
            if (!vm.validCard) {
                CommonModalsSrv.error("Número de Tarjeta Inválido.");
                return;
            }
            vm.AdviserID = '67890';
            vm.edad = calculaEdad(moment(vm.fechaNacimiento, "DD/MM/YYYY"));
            var numberDay;
            var nextValidDay;
            var _params = {};
            var tarjetaClabe = vm.cmd.paymentType.type.id == '2' && vm.cmd.ListTypeCLABE.type.id === '1' ? vm.cmd.ListTypeCLABE.type.text : 'TC';
            
            for (var day = 1; day < 7; day++) { //Función para encontrar el siguiente día habil
                nextValidDay = moment().add(day, 'days').format('YYYY-MM-DD'); //Automáticamente sumamos un día al día actual para obtener el día siguiente
                numberDay = moment(nextValidDay).isoWeekday(); //Obtenemos el valor numérico del día de la semana. 1 es para lunes, 7 para domingo.                
                
                if (numberDay < 6) { //Validamos que el número del día sea menor a 6, o sea, que no sea sábado o domingo
                    break; //Si es menor a 6 rompemos el ciclo for, de lo contrario continuamos hasta encontrar el siguiete día habil
                }
            }

            _params.language = 'SPA';
            _params.agentCode = agentCodeR + ""; //_params.agentCode = '99998';
            _params.clientNumber = vm.numeroCliente;
            _params.insurancePolicyDate = moment(vm.fechaVigencia).format("YYYY-MM-DD");
            _params.policyMaturityDate = moment(new Date(vm.fechaVigencia)).add(1, 'years').format('YYYY-MM-DD');
            _params.paymentManagerID = '1';
            _params.smokerFlag = vm.fuma;
            _params.adviserID = vm.AdviserID;
            _params.chargeManager = (vm.cmd.paymentType.type.id === '2') ? 'BA' : 'TA';
            _params.contractingData = {
                name: (vm.personType === '1') ? vm.nombres.toUpperCase() : vm.nombreAsegurado.toUpperCase(),
                lastName: (vm.personType === '1') ? vm.apePaterno.toUpperCase() : vm.apePaternoAsegurado.toUpperCase(),
                secondLastName: (vm.personType === '1') ? vm.apeMaterno.toUpperCase() : vm.apeMaternoAsegurado.toUpperCase(),
                fiscalIDNumber: (vm.personType === '1') ? vm.fiscalIDNumber.toUpperCase() : vm.rfcAsegurado.toUpperCase(),
                street: (vm.personType === '1') ? vm.calleUser.toUpperCase() : vm.calleAsegurado.toUpperCase(),
                outdoorNumber: (vm.personType === '1') ? vm.extUser : vm.numeroExteriorAsegurado,
                neighborhood: (vm.personType === '1') ? vm.colonia.toUpperCase() : vm.coloniaAsegurado.toUpperCase(),
                postalCode: (vm.personType === '1') ? vm.cmd.dataLifePostalCode.text : vm.codigoPostalAsegurado.id + "",
                federalEntityID: (vm.personType === '1') ? parseInt(vm.cmd.dataLifeEntity.id) : parseInt(vm.estadoAsegurado.id),
                delegationMunicipalityID: (vm.personType === '1') ? parseInt(vm.cmd.dataLifeMunicipality.id) : parseInt(vm.municipioAsegurado.id),
                countryID: (vm.personType === '1') ? vm.cmd.dataLifeContry.id : vm.paisAsegurado.id,
                phoneNumber: (vm.personType === '1') ? vm.phoneUser : vm.phoneAsegurado,
                birthDate: moment(vm.fechaNacimiento, "DD/MM/YYYY").format("YYYY-MM-DD"),
                gender: vm.sexoCliente,
                maritalStatusID: (vm.personType === '1') ? vm.cmd.dataLifeMarital.id : '0',
                nacionality: vm.nacionalidad.id,
                personType: (vm.personType === '1') ? 'F' : 'M',
                email: $filter('lowercase')(vm.emailUser),
                insuranceBeneficiaryTypeID: '6',
                professionID: vm.cmd.dataOcupacion.id + "",
                jobID: vm.cmd.dataOcupacion.id + "",
                height: parseFloat(vm.mts),
                weight: parseFloat(vm.kgs),
                age: (vm.personType === '1') ? parseInt(vm.edad) : parseInt(vm.edadAsegurado)
            };
            _params.insuredData = {
                name: vm.nombreAsegurado.toUpperCase() + "",
                lastName: vm.apePaternoAsegurado.toUpperCase() + "",
                secondLastName: vm.apeMaternoAsegurado.toUpperCase() + "",
                fiscalIDNumber: vm.rfcAsegurado.toUpperCase() + "",
                street: vm.calleAsegurado.toUpperCase() + "",
                outdoorNumber: vm.numeroExteriorAsegurado + "",
                neighborhood: vm.coloniaAsegurado.toUpperCase() + "",
                postalCode: vm.codigoPostalAsegurado.id + "",
                federalEntityID: parseInt(vm.estadoAsegurado.id),
                delegationMunicipalityID: parseInt(vm.municipioAsegurado.id),
                countryID: vm.paisAsegurado.id + "",
                phoneNumber: vm.phoneAsegurado + "",
                birthDate: moment(vm.fechaNacimientoAsegurado, "DD/MM/YYYY").format("YYYY-MM-DD"),
                gender: vm.generoAsegurado,
                maritalStatusID: vm.estadoCivilAsegurado.id + "",
                personType: (vm.personType === '1') ? 'F' : 'M',
                insuranceBeneficiaryTypeID: '6',
                jobID: vm.cmd.dataOcupacion.id + "",
                height: parseFloat(vm.mts),
                weight: parseFloat(vm.kgs),
                age: parseInt(vm.edadAsegurado)
            };
            _params.beneficiaryDataList = [];
            angular.forEach(vm.ListaBeneficiarios, function (value) {
                var beneficiaryData = {
                    name: value.nombreB.toUpperCase() + "",
                    lastName: value.apePaternoB.toUpperCase() + "",
                    secondLastName: value.apeMaternoB.toUpperCase() + "",
                    personType: (vm.personType === '1') ? 'F' : 'M',
                    jobID: '0',
                    insuranceBeneficiaryTypeID: value.tipoBeneficiario.id,
                    participationPercentage: parseInt(value.porcentajeB),
                    birthDate: moment(value.fechaNacB).format("YYYY-MM-DD"),
                    age: parseInt(calculaEdad(value.fechaNacB)),
                    relationshipID: value.parentescoB.id
                };
                _params.beneficiaryDataList.push(beneficiaryData);
            });
            _params.basicCoverage = {
                insuredSum: vm.insuredSum
            };
            _params.accidentalDeathCoverage = {
                insuredSum: vm.insuredSum
            };
            _params.bankingData = {
                paymentMethod: tarjetaClabe,
                name: vm.nombreCard.toUpperCase(),
                lastName: vm.apellidoPCard.toUpperCase(),
                secondLastName: vm.apellidoMCard.toUpperCase(),
                email: $filter('lowercase')(vm.email1),
                bankID: vm.cmd.dataCarsAccountIdBanks.id,
                expirationDate: tarjetaClabe === "CLABE" ? '2024-01-01' : moment(vm.comboYearExpiration.text + '-' + vm.comboMonthExpiration.text + '-01').format("YYYY-MM-DD"),
                cardVerificationValue: tarjetaClabe === "CLABE" ? "" : parseInt(vm.cvv),
                cardNumber: tarjetaClabe === "CLABE" ? "" : vm.account,
                cardID: tarjetaClabe === "CLABE" ? "" : vm.cmd.cardType.id + "",
                CLABE: tarjetaClabe === "CLABE" ? vm.clabeInter : "",
                cutoffDate: nextValidDay
            };

            insuranceLifeSrv.getServiceLifeInsurancePolicyRegistration(_params).then(function (response) {
                if (response.success) {
                    vm.numeroPoliza = response.info.policyNumber;
                    vm.urlCondiciones = isProduccion ?
                        'https://zonaliados.mapfre.com.mx/zonaaliadosextra/vida/pdf/Plan%20de%20Vida%20Individual.pdf' :
                        'https://10.184.62.77/zonaaliadosextra/vida/pdf/Plan%20de%20Vida%20Individual.pdf';
                    vm.urlSolicitud = isProduccion ?
                        "https://zonaliados.mapfre.com.mx/impresionSeGA/TWImpSolicitudMarco.aspx?noPoliza=" + vm.numeroPoliza + "&sector=1&usuario=actinver&agente=" + agentCodeR + "&eMail=&btnPoliza=N&RelSol=MEXICO|" + (vm.fuma === "false" ? "NO" : "SI") + "|" + vm.cmd.dataOcupacion.text + "|TEMPORAL 1 AÑO|" + vm.kgs + "|" + vm.mts + "|" + (vm.personType === '1' ? vm.edad : vm.edadAsegurado) + "|X|X|X|X|" :
                        "https://10.184.62.77/impresionSeGA/TWImpSolicitudMarco.aspx?noPoliza=" + vm.numeroPoliza + "&sector=1&usuario=actinver&agente=" + agentCodeR + "&eMail=&btnPoliza=N&RelSol=MEXICO|" + (vm.fuma === "false" ? "NO" : "SI") + "|" + vm.cmd.dataOcupacion.text + "|TEMPORAL 1 AÑO|" + vm.kgs + "|" + vm.mts + "|" + (vm.personType === '1' ? vm.edad : vm.edadAsegurado) + "|X|X|X|X|";
                    vm.urlPoliza = isProduccion ?
                        'https://zonaliados.mapfre.com.mx/impresionSeGA/TWImpPolizaMarco.aspx?noPoliza=' + vm.numeroPoliza + '&sector=1&simpol=n&usuario=actinver&agente=' + agentCodeR :
                        'https://10.184.62.77/impresionSeGA/TWImpPolizaMarco.aspx?noPoliza=' + vm.numeroPoliza + '&sector=1&simpol=n&usuario=actinver&agente=' + agentCodeR;
                    /*var agenteCorreo = JSON.parse($sessionStorage.user).mail;
                    ListaPolizasVidaAdd(vm.numeroPoliza,
                        moment(vm.fechaVigencia).format("YYYY/MM/DD"),
                        moment(new Date(vm.fechaVigencia), 'DD/MM/YYYY').add(1, 'years').format('YYYY/MM/DD'),
                        vm.totalSum,
                        "EMIT",
                        ((vm.personType === '1') ? vm.nombres : vm.nombreAsegurado).toUpperCase(),
                        ((vm.personType === '1') ? vm.apePaterno : vm.apePaternoAsegurado).toUpperCase(),
                        ((vm.personType === '1') ? vm.apeMaterno : vm.apeMaternoAsegurado).toUpperCase(),
                        $filter('lowercase')(vm.emailUser),
                        $scope.$parent.agentSelected.id,
                        $filter('lowercase')(agenteCorreo));*/
                    go2page(6);
                } else {
                    CommonModalsSrv.error("Estimado usuario su póliza no fue emitida, favor de comunicarse con el área de soporte. TX_ID: " + response.info.transactionID);
                }
            });
        }

        vm.banderasCheckAsCoArr = [false, false, false, false, false, false, false, false, false, false];
        
        function activarCheckAseCon() {
            if (vm.personType == '2') return;
            vm.activarCheck = true;

            vm.banderasCheckAsCoArr[0] = true;
            if (!vm.nombres == "") {
                vm.banderasCheckAsCoArr[0] = true;
            } else {
                vm.banderasCheckAsCoArr[0] = false;
            }
            if (!vm.apePaterno == "") {
                vm.banderasCheckAsCoArr[1] = true;
            } else {
                vm.banderasCheckAsCoArr[1] = false;
            }
            if (!vm.apeMaterno == "") {
                vm.banderasCheckAsCoArr[2] = true;
            } else {
                vm.banderasCheckAsCoArr[2] = false;
            }
            if (!vm.fiscalIDNumber == "") {
                vm.banderasCheckAsCoArr[3] = true;
            } else {
                vm.banderasCheckAsCoArr[3] = false;
            }
            if (!vm.CURP == "") {
                vm.banderasCheckAsCoArr[4] = true;
            } else {
                vm.banderasCheckAsCoArr[4] = false;
            }
            if (!vm.phoneUser == "") {
                vm.banderasCheckAsCoArr[5] = true;
            } else {
                vm.banderasCheckAsCoArr[5] = false;
            }
            if (!vm.emailUser == "") {
                vm.banderasCheckAsCoArr[6] = true;
            } else {
                vm.banderasCheckAsCoArr[6] = false;
            }
            if (!vm.calleUser == "") {
                vm.banderasCheckAsCoArr[7] = true;
            } else {
                vm.banderasCheckAsCoArr[7] = false;
            }
            if (!vm.extUser == "") {
                vm.banderasCheckAsCoArr[8] = true;
            } else {
                vm.banderasCheckAsCoArr[8] = false;
            }
            if (!vm.colonia == "") {
                vm.banderasCheckAsCoArr[9] = true;
            } else {
                vm.banderasCheckAsCoArr[9] = false;
            }
            if (!vm.fechaNacimiento == "") {
                vm.banderasCheckAsCoArr[10] = true;
            } else {
                vm.banderasCheckAsCoArr[10] = false;
            }

            for (var i = 0; i < vm.banderasCheckAsCoArr.length; i++) {
                vm.activarCheck = vm.activarCheck && vm.banderasCheckAsCoArr[i];
            }
            if (vm.activarCheck) {
                document.getElementById("checkContAse").disabled = false;
            } else {
                document.getElementById("checkContAse").disabled = true;
            }
        }

        function ServiceEmailLifePolizaLista() {
            var _inicioVigencia = moment(vm.fechaVigencia).format("YYYY-MM-DD");
            var _finVigencia = moment(new Date(vm.fechaVigencia)).add(1, 'years').format('YYYY-MM-DD');
            var nombreCompletoCon = vm.personType === '1' ? vm.nombres.toUpperCase() + " " + vm.apePaterno.toUpperCase() + " " + vm.apeMaterno.toUpperCase() : vm.nombreCliente.toUpperCase();
            
            insuranceLifeSrv.ServiceEmailSendingAsesoriaPolizaLista(vm.emailUser, nombreCompletoCon, vm.numeroPoliza, 
                _inicioVigencia, _finVigencia, vm.urlPoliza, vm.urlSolicitud, vm.urlCondiciones).then(function (response) {
                if (response.info.responseMessage === "EXITO") {
                    CommonModalsSrv.info("Estimado usuario el correo ha sido enviado correctamente.");
                } else {
                    CommonModalsSrv.error("Estimado usuario no se ha podido enviar el correo, favor de comunicarse con el área de soporte.");
                }
            });
        }

        function imprimirCondiciones() {
            window.open(vm.urlCondiciones, '_blank', 'width=' + screen.width + 'px,height=' + screen.height + 'px,resizable=0');
        }

        function imprimirSolicitudLife() {
            window.open(vm.urlSolicitud, '_blank', 'width=' + screen.width + 'px,height=' + screen.height + 'px,resizable=0');
        }

        function imprimirPolizaLife() {            
            window.open(vm.urlPoliza, '_blank', 'width=' + screen.width + 'px,height=' + screen.height + 'px,resizable=0');
        }

        /*
        function ServiceEmailLifeNotificacionAsesor(mailTo, noPoliza) {
            vm._noPoliza = noPoliza;
            vm._mailTo = mailTo;
            insuranceLifeSrv.ServiceEmailSendingAsesoriaNotificacionAsesor(vm._mailTo, vm._noPoliza).then(function (response) {
                vm.response = "EXITO";
                if (response.info.responseMessage == "EXITO") {
                    CommonModalsSrv.info("Estimado usuario el correo ha sido enviado correctamente.");
                } else {
                    CommonModalsSrv.error("Estimado usuario no se ha podido enviar el correo, favor de comunicarse con el área de soporte.");
                }
            });
        }

        function ServiceEmailLifeSolicitudUsuario(mailTo, nombre, noPoliza) {
            vm._noPoliza = noPoliza;
            vm._nombre = nombre;
            vm._mailTo = mailTo;
            insuranceLifeSrv.ServiceEmailSendingAsesoriaSolicitudUsuario(vm._mailTo, vm._nombre, vm._noPoliza, agentCodeR, vm.fuma, vm.cmd.dataOcupacion.text, vm.kgs, vm.mts, (vm.personType === '1' ? parseInt(vm.edad) : parseInt(vm.edadAsegurado)), "UAT").then(function (response) {
                vm.response = "EXITO";
                if (response.info.responseMessage == "EXITO") {
                    CommonModalsSrv.info("Estimado usuario el correo ha sido enviado correctamente.");
                } else {
                    CommonModalsSrv.error("Estimado usuario no se ha podido enviar el correo, favor de comunicarse con el área de soporte.");
                }
            });
        }

        function ListaPolizasVida() {
            var _response = [];
            var polizaApro = false;
            insuranceLifeSrv.ListaPolizasVida(usrRol).then(function (response) {
                if (response.success) {
                    angular.forEach(response.info, function (value) {
                        if (value.policyStatus === "APRO") {
                            polizaApro = true;
                        }
                        value.policyDate = moment(new Date(value.policyDate)).format('DD/MM/YYYY');
                        value.policyDateEnd = moment(new Date(value.policyDateEnd)).format('DD/MM/YYYY');
                        _response.push(value);
                    });
                    if (_response.length > 0) {
                        if (usrRol === "ASESOR" && polizaApro) {
                            getAvailableQuotation();
                        } else if (usrRol === "ASESOR" && !polizaApro) {
                            pagina1();
                        } else {
                            getAvailableQuotation();
                        }
                    } else {
                        pagina1();
                    }
                }
            });

            vm.jsonPolizaPrueba = _response;
        }
        
        function ListaPolizasVidaAdd(_noPoliza, _polizaDate, _polizaDateEnd, _polizaAmount, _polizaStatus, _clientName, _clientLastname, _clientSecondname, _clientEmail, _idAgente, _agentEmail) {
            insuranceLifeSrv.ListaPolizasVidaAdd(_noPoliza, _polizaDate, _polizaDateEnd, _polizaAmount, _polizaStatus, _clientName, _clientLastname, _clientSecondname, _clientEmail, _idAgente, _agentEmail).then(function (response) {
            });
        }

        function getAvailableQuotation() {
            vm.stepForm = {
                step: 3,
                stepA: false,
                stepB: false,
                stepC: false,
                stepD: false,
                stepDB: false,
                stepE: false,
                stepF: false,
                stepG: false,
                stepH: false,
                stepI: true
            };
        }

        function emission(index) {
            vm.idPoliza = index;
            vm.clientEmailJson = vm.jsonPolizaPrueba[vm.idPoliza].clientEmail;
            vm.nombreClienteJson = vm.jsonPolizaPrueba[vm.idPoliza].clientName;
            vm.numeroPolizaJson = vm.jsonPolizaPrueba[vm.idPoliza].policyId;
            vm.inicioVigJson = vm.jsonPolizaPrueba[vm.idPoliza].policyDate;
            vm.finVigJson = vm.jsonPolizaPrueba[vm.idPoliza].policyDateEnd;
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
                stepH: false,
                stepI: false,
                stepJ: true
            };
        }

        function liberacion(id_poliza, fecha_poliza, suma_poliza, status_poliza, nombre_cliente, apellido_pat_cliente, apellido_mat_cliente, correo_cliente, correo_agente) {
            vm.clientEmailJson = correo_cliente;
            vm.nombreClienteJson = nombre_cliente + " " + apellido_pat_cliente + " " + apellido_mat_cliente;
            vm.numeroPolizaJson = id_poliza;
            vm.sumaPolizaJson = suma_poliza;
            vm.fechaPolizaJson = fecha_poliza;
            vm.statusPolizaJson = status_poliza;
            vm.emailAgentePolizaJson = correo_agente;
            vm.liberacionPolizaEmail = vm.AMBT === 'PRO' ? $filter('lowercase')(vm.emailAgentePolizaJson) : $filter('lowercase')(vm.clientEmailJson);
            vm.stepForm = {
                step: 9,
                stepA: false,
                stepB: false,
                stepC: false,
                stepD: false,
                stepDB: false,
                stepE: false,
                stepF: false,
                stepG: false,
                stepH: false,
                stepI: false,
                stepJ: false,
                stepK: true
            };
        }

        function LiberacionConfirmada(idPoliza, mail) {
            CommonModalsSrv.confirm("Desea confirmar la liberación de la póliza con ID: " + idPoliza + ".").result.then(
                function () {
                    ListaPolizasVidaUp(idPoliza, "APRO", mail);
                }
            );
        }

        function CancelarPoliza(idPoliza) {
            CommonModalsSrv.confirm("Desea cancelar la póliza con ID: " + idPoliza + ".").result.then(
                function () {
                    ListaPolizasVidaUp(idPoliza, "RECH");
                    vm.btn1 = document.getElementById("btnCancelPol");
                    vm.btn2 = document.getElementById("btnLiberaPol");
                    vm.btn1.style.display = "none";
                    vm.btn2.style.display = "none";
                }
            );
        }
        
        function ListaPolizasVidaUp(_noPoliza, _estatusPoliza, mail) {
            vm._noPoliza = _noPoliza;
            vm._estatusPoliza = _estatusPoliza;

            insuranceLifeSrv.ListaPolizasVidaUp(vm._noPoliza, vm._estatusPoliza).then(function (response) {
                if (response.success) {
                    ListaPolizasVida();
                    if (_estatusPoliza === "APRO") {
                        vm.btn1 = document.getElementById("btnCancelPol");
                        vm.btn2 = document.getElementById("btnLiberaPol");
                        vm.btn1.style.display = "none";
                        vm.btn2.style.display = "none";
                        ServiceEmailLifeNotificacionAsesor(mail, _noPoliza);
                    }
                } else {
                    CommonModalsSrv.error("Estimado usuario no se realizó el cambio de estatus.");
                }
            });
        }

        function limpiarDependiente() {
            if (vm.dependientes.length !== 0) {
                vm.dataParentescoList.type = undefined;
            }

            if (!vm.dependientes || vm.dependientes.length === 0) {
                //vm.ListMedicalParentescos = getCatalogoMedicalParentescos();
                vm.dataParentescoList.type = vm.ListMedicalParentescos[0];
            }
            if (vm.dependientes.length !== 0 || vm.clienteEsTitularAsegurado === "2") {
                vm.nombresCliente = "";
                vm.primerApellidoCliente = "";
                vm.segundoApellidoCliente = "";
                vm.fechaNacimientoCliente = moment();
                vm.edadCliente = "";
                vm.rfcCliente = "";
            }

            vm.sexoCliente = "";
            vm.sexoB = "";
            vm.dataOcupacionList.type = undefined;
            vm.dataDeporteList.type = undefined;
            vm.deporteCliente = "";
            vm.isClienteBanco = false;
            vm.editandoCliente = false;
            vm.buttonNameClientData = vm.nombreBotonAgregar;
            vm.buttonNameCleanData = vm.nombreBotonLimpiar;
        }

        function editarDependientes(index) {
            vm.dataParentescoList.type = {
                id: vm.dependientes[index].relationshipID,
                text: vm.dependientes[index].relationship
            };
            vm.nombresCliente = vm.dependientes[index].name;
            vm.primerApellidoCliente = vm.dependientes[index].lastName;
            vm.segundoApellidoCliente = vm.dependientes[index].secondLastName;
            vm.fechaNacimientoCliente = moment(vm.dependientes[index].birthDate, 'YYYY-MM-DD');
            vm.edadCliente = vm.dependientes[index].age;
            vm.rfcCliente = vm.dependientes[index].fiscalIDNumber;
            vm.sexoCliente = vm.dependientes[index].genderDesc;
            vm.dataOcupacionList.type = {
                id: vm.dependientes[index].jobID,
                text: vm.dependientes[index].jobDescription
            };
            vm.dataDeporteList.type = {
                id: vm.dependientes[index].sportID,
                text: vm.dependientes[index].sport
            };
            vm.indexTitular = index;
            vm.editandoCliente = true;
            vm.buttonNameClientData = vm.nombreBotonModificar;
            vm.buttonNameCleanData = vm.nombreBotonCancelar;

            if (vm.clienteEsTitularAsegurado === "1" && vm.rfcCliente === vm.fiscalIDNumber) {
                vm.isClienteBanco = true;
            }
        }

        function agregarEditados(index) {
            vm.dependientes[index].relationshipID = vm.dataParentescoList.type.id;
            vm.dependientes[index].relationship = vm.dataParentescoList.type.text;
            vm.dependientes[index].name = vm.nombresCliente;
            vm.dependientes[index].lastName = vm.primerApellidoCliente;
            vm.dependientes[index].secondLastName = vm.segundoApellidoCliente;
            vm.dependientes[index].birthDate = moment(vm.fechaNacimientoCliente).format('YYYY-MM-DD');
            vm.dependientes[index].age = calculaEdad(vm.fechaNacimientoCliente);
            vm.dependientes[index].gender = vm.sexoCliente === "Masculino" ? 1 : 0,
            vm.dependientes[index].genderDesc = vm.sexoCliente;
            vm.dependientes[index].jobID = vm.edadCliente >= 18 && vm.dataOcupacionList.type != undefined ? vm.dataOcupacionList.type.id : "";
            vm.dependientes[index].jobDescription = vm.edadCliente >= 18 && vm.dataOcupacionList.type != undefined ? vm.dataOcupacionList.type.text : "";
            vm.dependientes[index].sportID = vm.dataDeporteList.type.id === "1" || vm.dataDeporteList.type === undefined ? "" : vm.dataDeporteList.type.id;
            vm.dependientes[index].sport = vm.dataDeporteList.type.text === "NINGUNO" || vm.dataDeporteList.type === undefined ? "" : vm.dataDeporteList.type.text;
            vm.isClienteBanco = false;
        }

        function getAccumulatedRisksValidation() {
            var _listaObtenida = [];
            insuranceLifeSrv.getAccumulatedRisksValidation().then(function (_res) {
                if (_res.success) {
                    angular.forEach(_res.info, function (value) {
                        _listaObtenida.push({
                            id: value.TotalBalance,
                            text: value.OperationResult
                        });
                    });
                }
            });
            return _listaObtenida;
        }
        */

        function regresoMain() {
            vm = null;
            $state.go('insurance.main');
        }
    }
})();
