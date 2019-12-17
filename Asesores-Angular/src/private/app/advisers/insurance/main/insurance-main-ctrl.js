/* global moment */

(function () {
    'use strict';
    angular
            .module('actinver.controllers')
            .controller('insuranceMainCtrl', insuranceMainCtrl);

    function insuranceMainCtrl(insuranceMainSrv, $uibModal, $state, $stateParams, pResumeSrv, $scope, $q, $sessionStorage, CommonModalsSrv, accountModalSrv, $rootScope, ErrorMessage) {
        var vm = this;

        vm.cleanForm = cleanForm;
        vm.clean = clean;
        vm.seleccionaPersonalidad = seleccionaPersonalidad;
        vm.buscar = true;

        vm.mostrarDatos = false;
        vm.nombreCliente = "";

        vm.personType = '1';
        vm.datosCliente = [];

        vm.client = '';
        vm.person = {};
        vm.contract = '';
        vm.personType = '1';
        vm.contractUser = 0;
        vm.fiscalIDNumber = "";
        vm.curp = "";
        vm.disabledRFC = false;

        var user = JSON.parse(JSON.parse(sessionStorage["ngStorage-user"]));
        vm.roles = user.roles;

        vm.validatePopup = false;

        vm.reinicia = reinicia;
        vm.pagina1 = pagina1;
        vm.pagina2 = pagina2;
        vm.pagina2regreso = pagina2regreso;
        vm.pagina3 = pagina3;
        vm.submitSearch = submitSearch;
        vm.cotizar = cotizar;
        vm.valCotizar = valCotizar;
        vm.valCotizarVida = valCotizarVida;
        vm.valCotizarCasas = valCotizarCasas;
        vm.cotizarNoCliente = cotizarNoCliente;
        vm.ValCotizarPyme= ValCotizarPyme;
        var model;

        vm.valCotizarProteccionMedica = valCotizarProteccionMedica;

        vm.stepForm = {
            step: 0,
            stepA: false,
            stepB: false,
            stepC: false,
            stepD: false,
            stepDB: false,
            stepE: false,
            stepF: false,
            stepG: false,
            stepH: false
        };

        pagina1();
        pagina2regreso();

        function clean() {
            vm.contract = null;
            vm.client = null;
            vm.person = null;
        }

        function cleanForm() {
            vm.stepForm = {
                step: 0,
                stepA: false,
                stepB: false,
                stepC: false,
                stepD: false,
                stepDB: false,
                stepE: false,
                stepF: false,
                stepG: false,
                stepH: false
            };
        }

        function reinicia() {
            vm.numeroCliente = "";
            vm.emailUser = "";
            vm.personType = '1';

            vm.datosCliente = [];
            vm.nombres = "";
            vm.apePaterno = "";
            vm.apeMaterno = "";
            vm.contract = '';
            vm.fiscalIDNumber = "";
            vm.curp = "";
            vm.disabledRFC = false;
            vm.mostrarDatos = false;
            vm.nombreCliente = "";
            vm.birthDay = "";
            vm.client = '';
            vm.person = {};
            vm.validatePerson = false;
            vm.validatePopup = false;

            vm.tipoVehiculo = "";

            $stateParams = null;
        }

        function pagina1() {
            vm.contract = "";
            vm.validatePopup = false;

            vm.cleanForm();
            vm.stepForm.step = 1;
            vm.stepForm.stepA = true;

            vm.buscar = true;
            vm.tipoPersonalidad = false;
        }

        function pagina2regreso() {
            $scope.$parent.agentDisabled = false;
            
            if ($stateParams.model) {
                model = $stateParams.model;

                vm.numeroCliente = model.numeroCliente;
                vm.emailUser = model.emailUser;
                vm.tipoVehiculo = model.tipoVehiculo;
                vm.personType = model.personType;

                vm.datosCliente = model.datosCliente;
                vm.nombres = model.nombres;
                vm.apePaterno = model.apePaterno;
                vm.apeMaterno = model.apeMaterno;
                vm.contract = model.contract;
                vm.fiscalIDNumber = model.fiscalIDNumber;
                vm.curp = model.curp;
                vm.disabledRFC = model.disabledRFC;
                vm.mostrarDatos = model.mostrarDatos;
                vm.nombreCliente = model.nombreCliente;
                vm.birthDay = model.birthDay;
                vm.client = model.client;
                vm.person = model.person;
                vm.validatePopup = model.validatePopup;
                vm.validatePerson = model.validatePerson;
                vm.roles = model.roles;
                
                if (model.numeroCliente !== "") {
                    pagina2();
                    submitSearch();
                }
            }
        }

        function pagina2() {
            vm.cleanForm();
            vm.stepForm.step = 2;
            vm.stepForm.stepB = true;
        }

        function pagina3() {
            vm.cleanForm();
            vm.stepForm.step = 3;
            vm.stepForm.stepB = true;
        }


        function seleccionaPersonalidad(persona) {
            vm.personType = persona;
            pagina2();
        }

        function cotizarNoCliente() {
            vm.datosCliente = "";
            vm.fiscalIDNumber = "";
            vm.curp = "";
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

        function llenaModelo() {
            var mod = {
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
                curp: vm.curp,
                disabledRFC: vm.disabledRFC,
                mostrarDatos: vm.mostrarDatos,
                nombreCliente: vm.nombreCliente,
                birthDay: vm.birthDay,
                client: vm.client,
                person: vm.person,
                validatePopup: vm.validatePopup,
                validatePerson: vm.validatePerson,
                roles: vm.roles,
                phoneUser: vm.phoneUser
                
            };

            return mod;
        }

        function valCotizar() {
            //pagina3();
            var sendModel = llenaModelo();
            $scope.$parent.agentDisabled = true;
            $state.go('insurance.cars', {model: sendModel});
        }
        
        
        function valCotizarVida() {
            //pagina3();
            var sendModel = llenaModelo();
            $scope.$parent.agentDisabled = true;
            $state.go('insurance.life', {model: sendModel});
        }

        
        function ValCotizarPyme(){
            if ($scope.$parent.agentLength <= 0) {
                CommonModalsSrv.warning("Estimado usuario, te informamos que aún no estas registrado en esta plataforma, "
                    + "por favor ponte en contacto con el equipo de seguros en la extensión 4444 para solicitar tu acceso.");
                //return;
            }

            if (vm.nombreCliente !== "" && vm.validatePopup === false) {
                CommonModalsSrv.confirm("¿" + vm.nombreCliente + " es el asegurado titular de la cuenta?")
                        .result.then(
                                function () {
                                    var _validateEmail = (typeof vm.datosCliente.email === 'undefined') ? false : true;
                                    if (_validateEmail) {
                                        cotizar(true, vm.nombreCliente, vm.datosCliente.email[0].email);
                                    } else {
                                        cotizar(false, "", "");
                                    }
                                    vm.validatePopup = true;

                                    var sendModel = llenaModelo();
                                    $scope.$parent.agentDisabled = true;
                                    $state.go('insurance.pyme', {model: sendModel});
                                }
                        ).catch(function (res) {
                    if ((res === "cancel" || res === "escape key press" || res === "backdrop click")) {
                        vm.client = '';
                        vm.person = {};
                        vm.contract = '';
                        vm.datosCliente = [];
                        vm.fiscalIDNumber = "";
                        vm.curp = "";
                        vm.disabledRFC = false;
                        vm.nombreCliente = "";
                        vm.nombres = "";
                        vm.apePaterno = "";
                        vm.apeMaterno = "";
                        vm.contract = "";
                        vm.validatePopup = true;
                        vm.mostrarDatos = false;
                        cotizar(false, "", "");

                        var sendModel = llenaModelo();
                        $scope.$parent.agentDisabled = true;
                        $state.go('insurance.pyme', {model: sendModel});
                    }
                });
            } else {
                var sendModel = llenaModelo();
                $scope.$parent.agentDisabled = true;
                $state.go('insurance.pyme', {model: sendModel});
            }
        }
          
        
        
        function valCotizarCasas() {
            if ($scope.$parent.agentLength <= 0) {
                CommonModalsSrv.warning("Estimado usuario, te informamos que aún no estas registrado en esta plataforma, "
                    + "por favor ponte en contacto con el equipo de seguros en la extensión 4444 para solicitar tu acceso.");
                //return;
            }

            if (vm.nombreCliente !== "" && vm.validatePopup === false) {
                CommonModalsSrv.confirm("¿" + vm.nombreCliente + " es el asegurado titular de la cuenta?")
                        .result.then(
                                function () {
                                    var _validateEmail = (typeof vm.datosCliente.email === 'undefined') ? false : true;
                                    if (_validateEmail) {
                                        cotizar(true, vm.nombreCliente, vm.datosCliente.email[0].email);
                                    } else {
                                        cotizar(false, "", "");
                                    }
                                    vm.validatePopup = true;

                                    var sendModel = llenaModelo();
                                    sendModel.flujo = 1;
                                    $scope.$parent.agentDisabled = true;
                                    $state.go('insurance.houses', {model: sendModel});
                                }
                        ).catch(function (res) {
                    if ((res === "cancel" || res === "escape key press" || res === "backdrop click")) {
                        vm.client = '';
                        vm.person = {};
                        vm.contract = '';
                        vm.datosCliente = [];
                        vm.fiscalIDNumber = "";
                        vm.curp = "";
                        vm.disabledRFC = false;
                        vm.nombreCliente = "";
                        vm.nombres = "";
                        vm.apePaterno = "";
                        vm.apeMaterno = "";
                        vm.contract = "";
                        vm.validatePopup = true;
                        vm.mostrarDatos = false;
                        cotizar(false, "", "");

                        var sendModel = llenaModelo();
                        sendModel.flujo = 1;
                        $scope.$parent.agentDisabled = true;
                        $state.go('insurance.houses', {model: sendModel});
                    }
                });
            } else {
                var sendModel = llenaModelo();
                sendModel.flujo = 1;
                $scope.$parent.agentDisabled = true;
                $state.go('insurance.houses', {model: sendModel});
            }
        }

        function calcularEdad(rfc){
            var log = moment(new Date()).format("YY")
            var fecha  = rfc.substring(3, 9);
            var anio = fecha.substring(0,2);
            var mes = fecha.substring(2,4);
            var dia = fecha.substring(4,6);
            if(anio>log){
                anio = "19"+anio;
            }else{
                anio= "20"+anio;
            }
            fecha = dia+"/"+mes+"/"+anio;
            return fecha;
        }

        function cotizar(personaExistente, nombreCompleto, emailUser) {

            vm.validatePerson = personaExistente;

            if (vm.validatePerson === true) {
                vm.emailUser = emailUser;
            }

        }

        function getPhone(datosCliente) {
            var num = new Number((typeof datosCliente.phoneNumber === 'undefined') ? 0 : datosCliente.phoneNumber);
            var lada = new Number((typeof datosCliente.areaCode === 'undefined') ? 0 : datosCliente.areaCode);
            vm.phoneUser = lada.toString() + num.toString();
        }

        function valCotizarProteccionMedica() {
            
            if (vm.datosCliente) {
                if (vm.datosCliente.email) {
                    cotizar(true, vm.nombreCliente, vm.datosCliente.email[0].email);
                } else {
                    cotizar(false, "", "");
                }
                if (vm.datosCliente.telephoneData) {
                    getPhone(vm.datosCliente.telephoneData[0]);
                }
            }

            $scope.$parent.agentDisabled = true;
            var sendModel = llenaModelo();
            $state.go('insurance.medical', {model: sendModel});
        }

        function submitSearch() {
            if (vm.client) {
                insuranceMainSrv.getContractByAdviser(vm.client).then(
                        function successCallback(response) {
                            if (response.success) {
                                vm.personType = response.data.client[0].personType;
                                vm.datosCliente = response.data.client[0];
                                vm.nombres = response.data.client[0].name;
                                vm.apePaterno = response.data.client[0].lastName;
                                vm.apeMaterno = response.data.client[0].secondLastName;
                                vm.contract = response.data.client[0].contractNumber;
                                vm.fiscalIDNumber = response.data.client[0].fiscalIDNumber;
                                vm.curp = response.data.client[0].curp;
                                vm.disabledRFC = true;
                                vm.mostrarDatos = true;
                                vm.numeroCliente = vm.client;

                                getPhone(vm.datosCliente.telephoneData[0]);

                                try {
                                    vm.contract = response.data.contract[0].contractNumber;
                                } catch (e) {
                                    vm.contract = "";
                                }

                                if (vm.personType === '1') {
                                    vm.nombreCliente = response.data.client[0].name + " " + response.data.client[0].lastName + " " + response.data.client[0].secondLastName;
                                    vm.birthDay = moment(response.data.client[0].birthDate).format('DD/MM/YYYY');
                                } else {
                                    vm.nombreCliente = response.data.client[0].companyName;
                                    //vm.birthDay = moment(response.data.client[0].registryData).format('DD/MM/YYYY');
                                    vm.birthDay = calcularEdad(vm.fiscalIDNumber);
                                }
                                pagina2();

                            } else {
                                CommonModalsSrv.error(response.msg);
                                cotizarNoCliente();
                            }
                        }, function errorCallback(error) {
                    if (error.type === 'not-found') {
                        $scope.operations.showSystemError();
                        cotizarNoCliente();
                    } else {
                        CommonModalsSrv.error(ErrorMessage.createError(error.messages));
                        cotizarNoCliente();
                    }
                });
            } else if (vm.contract) {

                insuranceMainSrv.getClientInfo(vm.contract, vm.contract, 999).then(//BANCO
                        function successCallback(response) {
                            vm.personType = response.info[0].personType;
                            vm.datosCliente = response.info[0];//Datos cliente
                            vm.nombres = response.info[0].name;
                            vm.apePaterno = response.info[0].lastName;
                            vm.apeMaterno = response.info[0].secondLastName;
                            vm.fiscalIDNumber = response.info[0].fiscalIDNumber;
                            vm.curp = response.info[0].curp;
                            vm.disabledRFC = true;
                            vm.mostrarDatos = true;
                            vm.numeroCliente = response.clientId;
                            //vm.birthDay = moment(response.info[0].birthDate).format('DD/MM/YYYY');
                            getPhone(vm.datosCliente.telephoneData[0]);
                            if (vm.personType === '1') {
                                vm.nombreCliente = response.info[0].name + " " + response.info[0].lastName + " " + response.info[0].secondLastName;
                                vm.birthDay = moment(response.info[0].birthDate).format('DD/MM/YYYY');
                            } else {
                                vm.nombreCliente = response.info[0].companyName;
                                //vm.birthDay = moment(response.info[0].registryData).format('DD/MM/YYYY');
                                vm.birthDay =  calcularEdad(vm.fiscalIDNumber);

                            }
                            pagina2();
                        }, function errorCallback(error) {
                    insuranceMainSrv.getClientInfo(vm.contract, vm.contract, 998).then(///CASA
                            function successCallback(response) {
                                vm.personType = response.info[0].personType;
                                vm.datosCliente = response.info[0];//Datos cliente
                                vm.nombres = response.info[0].name;
                                vm.apePaterno = response.info[0].lastName;
                                vm.apeMaterno = response.info[0].secondLastName;
                                vm.fiscalIDNumber = response.info[0].fiscalIDNumber;
                                vm.curp = response.info[0].curp;
                                vm.disabledRFC = true;
                                vm.mostrarDatos = true;
                                vm.numeroCliente = response.clientId;
                                //vm.birthDay = moment(response.info[0].birthDate).format('DD/MM/YYYY');
                                getPhone(vm.datosCliente.telephoneData[0]);
                                if (vm.personType === '1') {
                                    vm.nombreCliente = response.info[0].name + " " + response.info[0].lastName + " " + response.info[0].secondLastName;
                                    vm.birthDay = moment(response.info[0].birthDate).format('DD/MM/YYYY');
                                } else {
                                    vm.nombreCliente = response.info[0].companyName;
                                    //vm.birthDay = moment(response.info[0].registryData).format('DD/MM/YYYY');
                                    vm.birthDay =  calcularEdad(vm.fiscalIDNumber);
                                }
                                pagina2();

                            }, function errorCallback() {
                        CommonModalsSrv.error(error.info.error.responseMessage);
                        cotizarNoCliente();
                    });
                });

            } else if (vm.person) {
                var message;
                if (vm.person.name) {
                    var search = (vm.person.name ? vm.person.name.toUpperCase() : "");
                    accountModalSrv.detail({
                        list: [],
                        wordToSearch: search,
                        personType: '1'
                    }).result.then(
                            function () {
                                insuranceMainSrv.getContractByAdviser($rootScope.selectedClient.uniqueClientNumber)
                                        .then(function successCallback(response) {
                                            if (response.success) {
                                                vm.personType = response.data.client[0].personType;
                                                vm.datosCliente = response.data.client[0];
                                                vm.nombres = response.data.client[0].name;
                                                vm.apePaterno = response.data.client[0].lastName;
                                                vm.apeMaterno = response.data.client[0].secondLastName;
                                                vm.fiscalIDNumber = response.data.client[0].fiscalIDNumber;
                                                vm.curp = response.data.client[0].fiscalIDNumber;
                                                vm.numeroCliente = response.data.client[0].clientNumber;
                                                vm.disabledRFC = true;
                                                try {
                                                    vm.contract = response.data.contract[0].contractNumber;

                                                } catch (e) {
                                                    vm.contract = "";
                                                }
                                                vm.mostrarDatos = true;
                                                if (vm.personType === '1') {
                                                    vm.nombreCliente = response.data.client[0].name + " " + response.data.client[0].lastName + " " + response.data.client[0].secondLastName;
                                                    vm.birthDay = moment(response.data.client[0].birthDate).format('DD/MM/YYYY');
                                                } else {
                                                    vm.nombreCliente = response.data.client[0].companyName;
                                                    //vm.birthDay = moment(response.data.client[0].registryData).format('DD/MM/YYYY');
                                                    vm.birthDay =  calcularEdad(vm.fiscalIDNumber);
                                                }
                                                pagina2();
                                            } else {
                                                CommonModalsSrv.error(response.msg);
                                                cotizarNoCliente();
                                            }
                                        }, function errorCallback(error) {
                                            var message;
                                            if (error.type === 'not-found') {
                                                $scope.operations.showSystemError();
                                                cotizarNoCliente();
                                            } else {
                                                message = error.info.error.responseMessage ? error.info.error.responseMessage : 'No se han encontrado los datos con el criterio seleccionado.<br />Te pedimos vuelvas a intentar.';
                                                CommonModalsSrv.error(message);
                                                cotizarNoCliente();
                                            }
                                        });
                            });
                } else if (vm.person.fiscalIDNumber) {
                    insuranceMainSrv.getClientName(vm.person)
                            .then(function successCallback(response) {
                                if (response.info[0]) {
                                    accountModalSrv.detail({
                                        list: response.info,
                                        wordToSearch: '',
                                        personType: '2'
                                    }).result.then(function () {
                                        insuranceMainSrv.getContractByAdviser($rootScope.selectedClient.clientNumber)
                                                .then(function successCallback(response) {
                                                    if (response.success) {
                                                        vm.datosCliente = response.data.client[0];
                                                        vm.nombreCliente = response.data.client[0].name + " " + response.data.client[0].lastName + " " + response.data.client[0].secondLastName;
                                                        vm.nombres = response.data.client[0].name;
                                                        vm.apePaterno = response.data.client[0].lastName;
                                                        vm.apeMaterno = response.data.client[0].secondLastName;
                                                        vm.fiscalIDNumber = response.data.client[0].fiscalIDNumber;
                                                        vm.curp = response.data.client[0].curp;
                                                        vm.disabledRFC = true;
                                                        try {
                                                            vm.contract = response.data.contract[0].contractNumber;

                                                        } catch (e) {
                                                            vm.contract = "";
                                                        }
                                                        vm.mostrarDatos = true;
                                                        pagina2();
                                                    } else {
                                                        CommonModalsSrv.error(response.msg);
                                                        cotizarNoCliente();
                                                    }
                                                }, function errorCallback(error) {
                                                    var message;
                                                    if (error.type === 'not-found') {
                                                        $scope.operations.showSystemError();
                                                        cotizarNoCliente();
                                                    } else {
                                                        message = error.info.error.responseMessage ? error.info.error.responseMessage : 'No se han encontrado los datos con el criterio seleccionado.<br />Te pedimos vuelvas a intentar.';
                                                        CommonModalsSrv.error(message);
                                                        cotizarNoCliente();
                                                    }
                                                });
                                    });
                                } else {
                                    message = 'No se han encontrado los datos con el criterio seleccionado.<br />Te pedimos vuelvas a intentar.';
                                    CommonModalsSrv.error(message);
                                    cotizarNoCliente();
                                }
                            }, function errorCallback(error) {
                                if (error.type === 'not-found') {
                                    $scope.operations.showSystemError();
                                    cotizarNoCliente();
                                } else {
                                    message = error.info.messages ? error.info.messages[0].responseMessage : 'No se han encontrado los datos con el criterio seleccionado.<br />Te pedimos vuelvas a intentar.';
                                    CommonModalsSrv.error(message);
                                    cotizarNoCliente();
                                }
                            });
                } else {
                    CommonModalsSrv.info("Se cotizará a un no cliente");
                    cotizarNoCliente();
                }
            }
            pagina2();
        }





    }

})();
