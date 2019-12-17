/* global moment */

(function () {
    'use strict';
    angular
        .module('actinver.controllers')
        .controller('insuranceMedicalCtrl', insuranceMedicalCtrl);

    function insuranceMedicalCtrl(validateIn, insuranceMedicalSrv, insuranceMedicalEmission, insuranceMedicalQuotation, insuranceHousesSrv, $state, $stateParams, $scope, $timeout, CommonModalsSrv) {
        var vm = this;
        var model = $stateParams.model, redHospAmp;
        vm.numeroCliente = model ? model.numeroCliente : "";
        vm.contrato = model ? model.contract : "";
        vm.cliente = model ? model.client : "";
        vm.person = model ? model.person : {};
        vm.primaN = "";
        vm.flujoCompleto = true;

        vm.datosCliente = model ? model.datosCliente : undefined;
        vm.nombres = model ? model.nombres : "";
        vm.primerApellido = model ? model.apePaterno : "";
        vm.segundoApellido = model ? model.apeMaterno : "";
        vm.nombreCliente = model ? model.nombreCliente : "";
        vm.fechaNacimiento = model ? model.birthDay : "";
        vm.fiscalIDNumber = model ? model.fiscalIDNumber : "";
        vm.email = model ? model.emailUser : "";
        vm.tipoPersona = model ? model.personType : '1';
        vm.telefono = model ? model.phoneUser : "";

        vm.disabledRFC = model ? model.disabledRFC : false;
        vm.mostrarDatos = model ? model.mostrarDatos : false;
        vm.validatePopup = model ? model.validatePopup : false;
        vm.validatePerson = model ? model.validatePerson : false;
        vm.roles = model ? model.roles : [];
        
        vm.sexo = undefined; // sexo del cliente actinver, se llenará cuando se
        // agregue a la lista de dependientes con el valor de sexoCliente
        vm.sexoCliente = "Masculino";
        vm.checkDisabled = true;
       
        vm.fechaNacimientoCliente = moment();
        

        // vm.cuestionarioMedico = getCuestionarioEmision();
        vm.clienteEsTitularAsegurado='2';
        vm.typePeopleContract = "1";
        vm.emitContratante = {
            sexContract : 'masculino',
            fechaNacimiento : moment().subtract(18, 'years')
        };
        vm.faltaTitular = true;
        vm.primaNeta = 3698;
        vm.emission = {};
        vm.indexFormaPago = 0;
        vm.indexPaquete = 0;
        vm.indexPago = 0;
        vm.dependientes = [];
        vm.dependientesFront = [];
        vm.paquetes = [];
        vm.asegurados = [];
        vm.mensajeN = false;
        vm.toggleCoberturaText = "OCULTAR";
        vm.ListOcupacion = getCatalagoOcupaciones();
        vm.ListNumAsegurados = getCatalogoNumAsegurados();
        vm.ListMedicalEstados = getCatalogoMedicalEntidades();  
        vm.ListMedicalParentescos = getCatalogoMedicalParentescos();
        vm.ListMedicalDeportes = getCatalagoDeportes();
        vm.ListMedicalProfesiones = getCatalogoMedicalProfesiones();
        vm.ListMedicalIdentificacion = getCatalogoIdentificacion();
        vm.ListMedicalLocacion;
        vm.ListMedicalLocacionEmission;
        vm.ListMunicipios = [];
        vm.validaMun = true;
        vm.validaMunEmission = true;
        vm.margenInferior = "Inferior";
        vm.bandera=undefined;
        vm.comboDependientes = [];
        
        vm.dataParentescoList = {};
        vm.dataOcupacionList = {};
        vm.dataDeporteList = {};
        
        vm.nombreBotonAgregar = "AGREGAR";
        vm.nombreBotonModificar = "MODIFICAR";
        vm.nombreBotonLimpiar = "LIMPIAR";
        vm.nombreBotonCancelar = "CANCELAR";
        vm.editandoCliente = false;
        vm.buttonNameClientData = vm.nombreBotonAgregar;
        vm.buttonNameCleanData = vm.nombreBotonLimpiar;
        
        vm.esValidoFirmar = false;
        
        
        vm.contractProfesion = null;
        vm.ListProfesionContract = [{ "id": "1", "text": "PROGRAMADOR" }, { "id": "2", "text": "ABOGADO" }, { "id": "3", "text": "PROJECT MANAGER" }, { "id": "4", "text": "CONTADOR" }];

        vm.Imc = [];
        
        // -------------Variables colorean colapsables-------------
        vm.colorCollapsables = "colorCollapsables";
        vm.colapse1 = false;
        vm.colapse2 = false;
        vm.colapse3 = false;
        vm.colapse4 = false;
        vm.colapse5 = false;
        vm.colapse6 = false;
        vm.colapse7 = false;
        vm.colapse8 = false;
        vm.colapse9 = false;
        //--------------Variables que colorean colapsables de emision---------------
        vm.colapseEmision1 = false;
        vm.colapseEmision2 = [];
        vm.colapseEmision3 = false;
        vm.colapseEmision4 = false;

        //---------Variables para cambio de pestañas cotizacion/emision/entrega---------

        vm.pestCotiza = true;
        vm.pestEmision = false;
        vm.pestEntrega = false;
        vm.trianguloAzul = "triangulo";
        vm.trianguloBlanco = "trianguloBlanco";
        vm.trianguloBorde = "trianguloBorde";
        // -------------------------Variables de avance entre páginas------------------
        
        getAvailableQuotation();
        
        vm.optionsdpx = {
            autoApply: true,
            showDropdowns: true,
            minDate: moment().subtract(65, 'years'),
            maxDate: moment(),
            singleDatePicker: true,
            locale: {
                format: "DD/MM/YYYY",
                daysOfWeek: [
                    "DO",
                    "LU",
                    "MA",
                    "MI",
                    "JU",
                    "VI",
                    "SA"
                ],
                monthNames: [
                    "Enero",
                    "Febrero",
                    "Marzo",
                    "Abril",
                    "Mayo",
                    "Junio",
                    "Julio",
                    "Agosto",
                    "Septiembre",
                    "Octubre",
                    "Noviembre",
                    "Diciembre"
                ],
                firstDay: 0
            },
            eventHandlers: {
                'apply.daterangepicker': function () {
                    calcularEdadCliente('cliente');
                    calcularRFCCliente();
                }
            }
        };

        vm.optionsdpxContract = {
            autoApply: true,
            showDropdowns: true,
            minDate: moment().subtract(100, 'years'),
            maxDate: moment().subtract(18, 'years'),
            singleDatePicker: true,
            locale: {
                format: "DD/MM/YYYY",
                daysOfWeek: [
                    "DO",
                    "LU",
                    "MA",
                    "MI",
                    "JU",
                    "VI",
                    "SA"
                ],
                monthNames: [
                    "Enero",
                    "Febrero",
                    "Marzo",
                    "Abril",
                    "Mayo",
                    "Junio",
                    "Julio",
                    "Agosto",
                    "Septiembre",
                    "Octubre",
                    "Noviembre",
                    "Diciembre"
                ],
                firstDay: 0
            },
            eventHandlers: {
                'apply.daterangepicker': function () {
                    calcularEdadCliente('contratante');
                    calcularRFCContratante();
                }
            }
        };
        
        $scope.sendEmailEmission = function(){
           var params = {
                'nombre': vm.emitContratante.nombres.toUpperCase() + " " + vm.emitContratante.primerApellido.toUpperCase() + " " + vm.emitContratante.segundoApellido.toUpperCase(),
                'numTramite': vm.emission.numeroTramite,
                'language': 'SPA',
                'emailFrom': 'seguros@actinver.com.mx',
                'idTemplate': 'buildDBTemplate|24',
                'emailSubject': 'Solicitud de póliza Gastos Médicos Folio ' + vm.emission.numeroTramite,
                'mailTo': vm.email,
                'mailCC': '',
            }

            insuranceMedicalQuotation.sendEmailEmision(params);
        }
        

        $scope.sendEmail = function(tipo){
            var params= {};
            var elemental = '';
            var redHospitalaria = '';
            var tabulador = '';
            var deducible = '';
            var gastosHospitalarios = '';
            var honorariosMedicos = '';
            var auxiliaresDeDiagnostico = '';
            var medicamentos = '';
            var ambulancia = '';
            var asistenciaTelefonica = '';
            var asistenciaEnViaje = '';
            var protesisYAparatosOrtopedicos = '';
            var rehabilitaciones = '';
            var tratamientosDentales = '';
            var tratamientosReconstructivosYEsteticos = '';
            var complicacionesDeGastosNoCubiertos = '';
            var procedimientosDeVanguardia = '';
            var padecimientosPreexistentesDeclarados = '';
            var padecimientosPreexistentesNoDeclarados = '';
            var homeopatiaQuiropracticaYAcupuntura = '';
            var psiquiatraYPsicologo = '';
            var emergenciaEnElExtranjero = '';
            var enfermedadesCatastroficasEnElExtranjero = '';
            var internacional = '';
            var dental = '';
            var vision = '';
            var prevision = '';
            var atencionNacionalTotal = '';
            var reduccionDeDeduciblePorAccidente = '';
            var hogar = '';
            var funeraria = '';
            var enfermedadesFrecuentes = '';
            var enfermedadesCatastroficas = '';
            var hombre = '';
            var cancer = '';
            var muerteAccidental = '';
            var perdidasOrganicas = '';
            var hospitalizacion = '';
            var maternidad = '';
            var mujer = '';
            var infantil = '';
            var incapacidad = '';
            var primaTotal = 0;
            var primaNeta = 0;
            var iva = 0;
            var gastosEspedicion = 0;
            var recargos = 0;
            var paquete = 0;
            var pago = 0;
            var coverageData = [];

                paquete = vm.paquetes[vm.indexPaquete];
                pago = vm.formasPago[vm.indexFormaPago].pagos[vm.indexPago];
                pago.montos.forEach(function(p){
                    if(p.cod_paquete === paquete.cod_paquete){
                        primaTotal= p.primatotal;
                        iva = p.impuestos;
                        gastosEspedicion = p.derechos;
                        primaNeta = p.primaneta;
                        recargos = p.recargos;
                    }
                });
                vm.grupos.forEach(function(grup){
                    if(grup.grupo_id === "GCE"){
                        grup.coberturas.forEach(function(cob){
                            if(cob.cod_cob === '1'){
                                elemental = cob.intervalos.sa.intervaloSelected.id;
                                redHospitalaria = cob.intervalos.redHosp.intervaloSelected.text;
                                tabulador = cob.intervalos.tabulador.intervaloSelected.text;
                                deducible =  cob.intervalos.deducible.intervaloSelected.id;
                            }
                            if(cob.cod_cob === '2'){
                                if(cob.sa_def === 'Amparada')
                                    gastosHospitalarios = 'AMPARADA';
                            }
                            if(cob.cod_cob === '3'){
                                if(cob.sa_def === 'Amparada')
                                    honorariosMedicos = 'AMPARADA';
                            }
                            if(cob.cod_cob === '4'){
                                if(cob.sa_def === 'Amparada')
                                    auxiliaresDeDiagnostico = 'AMPARADA';
                            }
                            if(cob.cod_cob === '5'){
                                if(cob.sa_def === 'Amparada')
                                    medicamentos = 'AMPARADA';
                            }
                            if(cob.cod_cob === '6'){
                                if(cob.sa_def === 'Amparada')
                                    ambulancia = 'AMPARADA';
                            }
                            if(cob.cod_cob === '10'){
                                if(cob.sa_def === 'Amparada')
                                    asistenciaTelefonica = 'AMPARADA';
                            }
                            if(cob.cod_cob === '11'){
                                if(cob.sa_def === 'Amparada')
                                    asistenciaEnViaje = 'AMPARADA';
                            }
                        });
                    }
                    if(grup.grupo_id === "GCH"){
                        grup.coberturas.forEach(function(cob){
                            if(cob.cod_cob === '12'){
                                cob.paquetes.forEach(function(p){
                                    if(p.cod_paquete === paquete.cod_paquete){
                                        protesisYAparatosOrtopedicos = p.mod_chk === '1'? 'AMPARADA' : '';
                                    }
                                });
                            }
                            if(cob.cod_cob === '13'){
                                cob.paquetes.forEach(function(p){
                                    if(p.cod_paquete === paquete.cod_paquete){
                                        rehabilitaciones = p.mod_chk === '1'? 'AMPARADA' : '';
                                    }
                                });
                            }
                            if(cob.cod_cob === '14'){
                                cob.paquetes.forEach(function(p){
                                    if(p.cod_paquete === paquete.cod_paquete){
                                        tratamientosDentales = p.mod_chk === '1'? 'AMPARADA' : '';
                                    }
                                });
                            }
                            if(cob.cod_cob === '15'){
                                cob.paquetes.forEach(function(p){
                                    if(p.cod_paquete === paquete.cod_paquete){
                                        tratamientosReconstructivosYEsteticos = p.mod_chk === '1'? 'AMPARADA' : '';
                                    }
                                });
                            }
                        });
                    }
                    if(grup.grupo_id === "GC2"){
                        grup.coberturas.forEach(function(cob){
                            if(cob.cod_cob === '16'){
                                cob.paquetes.forEach(function(p){
                                    if(p.cod_paquete === paquete.cod_paquete){
                                        complicacionesDeGastosNoCubiertos = p.mod_chk === '1'? 'AMPARADA' : '';
                                    }
                                });
                            }
                            if(cob.cod_cob === '17'){
                                cob.paquetes.forEach(function(p){
                                    if(p.cod_paquete === paquete.cod_paquete){
                                        procedimientosDeVanguardia = p.mod_chk === '1'? 'AMPARADA' : '';
                                    }
                                });
                            }
                            if(cob.cod_cob === '18'){
                                cob.paquetes.forEach(function(p){
                                    if(p.cod_paquete === paquete.cod_paquete){
                                        padecimientosPreexistentesDeclarados = p.mod_chk === '1'? 'AMPARADA' : '';
                                    }
                                });
                            }
                            if(cob.cod_cob === '19'){
                                cob.paquetes.forEach(function(p){
                                    if(p.cod_paquete === paquete.cod_paquete){
                                        padecimientosPreexistentesNoDeclarados = p.mod_chk === '1'? 'AMPARADA' : '';
                                    }
                                });
                            }
                        });
                    }
                    if(grup.grupo_id === "GEA"){
                        grup.coberturas.forEach(function(cob){
                            if(cob.cod_cob === '20'){
                                cob.paquetes.forEach(function(p){
                                    if(p.cod_paquete === paquete.cod_paquete){
                                        homeopatiaQuiropracticaYAcupuntura = p.mod_chk === '1'? 'AMPARADA' : '';
                                    }
                                });
                            }
                            if(cob.cod_cob === '21'){
                                cob.paquetes.forEach(function(p){
                                    if(p.cod_paquete === paquete.cod_paquete){
                                        psiquiatraYPsicologo = p.mod_chk === '1'? 'AMPARADA' : '';
                                    }
                                });
                            }
                        });
                    }
                    if(grup.grupo_id === "GIE"){
                        grup.coberturas.forEach(function(cob){
                            if(cob.cod_cob === '22'){
                                cob.paquetes.forEach(function(p){
                                    if(p.cod_paquete === paquete.cod_paquete){
                                        emergenciaEnElExtranjero = p.mod_chk === '1'? cob.intervalos.sa.intervaloSelected.id : '';
                                    }
                                });
                            }
                            if(cob.cod_cob === '23'){
                                cob.paquetes.forEach(function(p){
                                    if(p.cod_paquete === paquete.cod_paquete){
                                        enfermedadesCatastroficasEnElExtranjero = p.mod_chk === '1'? 'AMPARADA' : '';
                                    }
                                });
                            }
                            if(cob.cod_cob === '24'){
                                cob.paquetes.forEach(function(p){
                                    if(p.cod_paquete === paquete.cod_paquete){
                                        internacional = p.mod_chk === '1'? cob.intervalos.sa.intervaloSelected.id : '';
                                    }
                                });
                            }
                        });
                    }
                    if(grup.grupo_id === "GCO"){
                        grup.coberturas.forEach(function(cob){
                            if(cob.cod_cob === '25'){
                                cob.paquetes.forEach(function(p){
                                    if(p.cod_paquete === paquete.cod_paquete){
                                        dental = p.mod_chk === '1'? cob.intervalos.planDental.intervaloSelected.text : '';
                                    }
                                });
                            }
                            if(cob.cod_cob === '26'){
                                cob.paquetes.forEach(function(p){
                                    if(p.cod_paquete === paquete.cod_paquete){
                                        vision = p.mod_chk === '1'? cob.intervalos.planVision.intervaloSelected.text : '';
                                    }
                                });
                            }
                            if(cob.cod_cob === '28'){
                                cob.paquetes.forEach(function(p){
                                    if(p.cod_paquete === paquete.cod_paquete){
                                        maternidad = p.mod_chk === '1'? cob.intervalos.sa.intervaloSelected.id : '';
                                    }
                                });
                            }
                            if(cob.cod_cob === '29'){
                                cob.paquetes.forEach(function(p){
                                    if(p.cod_paquete === paquete.cod_paquete){
                                        prevision = p.mod_chk === '1'? 'AMPARADA' : '';
                                    }
                                });
                            }
                            if(cob.cod_cob === '30'){
                                cob.paquetes.forEach(function(p){
                                    if(p.cod_paquete === paquete.cod_paquete){
                                        atencionNacionalTotal = p.mod_chk === '1'? 'AMPARADA' : '';
                                    }
                                });
                            }
                            if(cob.cod_cob === '31'){
                                cob.paquetes.forEach(function(p){
                                    if(p.cod_paquete === paquete.cod_paquete){
                                        reduccionDeDeduciblePorAccidente = p.mod_chk === '1'? cob.intervalos.sa.intervaloSelected.id : '';
                                    }
                                });
                            }
                        });
                    }
                    if(grup.grupo_id === "GAA"){
                        grup.coberturas.forEach(function(cob){
                            if(cob.cod_cob === '34'){
                                cob.paquetes.forEach(function(p){
                                    if(p.cod_paquete === paquete.cod_paquete){
                                        hogar = p.mod_chk === '1'? 'AMPARADA' : '';
                                    }
                                });
                            }
                            if(cob.cod_cob === '36'){
                                cob.paquetes.forEach(function(p){
                                    if(p.cod_paquete === paquete.cod_paquete){
                                        funeraria = p.mod_chk === '1'? 'AMPARADA' : '';
                                    }
                                });
                            }
                        });
                    }
                    if(grup.grupo_id === "GTE"){
                        grup.coberturas.forEach(function(cob){
                            if(cob.cod_cob === '40'){
                                cob.paquetes.forEach(function(p){
                                    if(p.cod_paquete === paquete.cod_paquete){
                                        enfermedadesFrecuentes = p.mod_chk === '1'? cob.intervalos.sa.intervaloSelected.id : '';
                                    }
                                });
                            }
                            if(cob.cod_cob === '41'){
                                cob.paquetes.forEach(function(p){
                                    if(p.cod_paquete === paquete.cod_paquete){
                                        enfermedadesCatastroficas = p.mod_chk === '1'? cob.intervalos.sa.intervaloSelected.id : '';
                                    }
                                });
                            }
                            if(cob.cod_cob === '42'){
                                cob.paquetes.forEach(function(p){
                                    if(p.cod_paquete === paquete.cod_paquete){
                                        mujer = p.mod_chk === '1'? cob.intervalos.sa.intervaloSelected.id : '';
                                    }
                                });
                            }
                            if(cob.cod_cob === '43'){
                                cob.paquetes.forEach(function(p){
                                    if(p.cod_paquete === paquete.cod_paquete){
                                        hombre = p.mod_chk === '1'? cob.intervalos.sa.intervaloSelected.id : '';
                                    }
                                });
                            }
                            if(cob.cod_cob === '44'){
                                cob.paquetes.forEach(function(p){
                                    if(p.cod_paquete === paquete.cod_paquete){
                                        infantil = p.mod_chk === '1'? cob.intervalos.sa.intervaloSelected.id : '';
                                    }
                                });
                            }
                            if(cob.cod_cob === '45'){
                                cob.paquetes.forEach(function(p){
                                    if(p.cod_paquete === paquete.cod_paquete){
                                        cancer = p.mod_chk === '1'? cob.intervalos.sa.intervaloSelected.id : '';
                                    }
                                });
                            }
                            if(cob.cod_cob === '47'){
                                cob.paquetes.forEach(function(p){
                                    if(p.cod_paquete === paquete.cod_paquete){
                                        muerteAccidental = p.mod_chk === '1'? cob.intervalos.sa.intervaloSelected.id : '';
                                    }
                                });
                            }
                            if(cob.cod_cob === '48'){
                                cob.paquetes.forEach(function(p){
                                    if(p.cod_paquete === paquete.cod_paquete){
                                        perdidasOrganicas = p.mod_chk === '1'? cob.intervalos.sa.intervaloSelected.id : '';
                                    }
                                });
                            }
                        });
                    }
                    if(grup.grupo_id === "GAE"){
                        grup.coberturas.forEach(function(cob){
                            if(cob.cod_cob === '50'){
                                cob.paquetes.forEach(function(p){
                                    if(p.cod_paquete === paquete.cod_paquete){
                                        hospitalizacion = p.mod_chk === '1'? cob.intervalos.saCarencia.intervaloSelected.id : '';
                                    }
                                });
                            }
                            if(cob.cod_cob === '51'){
                                cob.paquetes.forEach(function(p){
                                    if(p.cod_paquete === paquete.cod_paquete){
                                        incapacidad = p.mod_chk === '1'? cob.intervalos.saCarencia.intervaloSelected.id : '';
                                    }
                                });
                            }
                        });
                    }
                });

                
            
            params = {
                'language': 'SPA',
                'emailFrom': 'seguros@actinver.com.mx',
                'idTemplate':  'buildDBTemplate|22',
                'emailSubject': 'Num de Cotización '+ vm.jsonCotizacion.quotationNumber,
                'mailTo': vm.email,
                'mailCC': '',
                'elemental' : elemental,
                'redHospitalaria' : redHospitalaria,
                'tabulador' : tabulador,
                'deducible' : deducible,
                'gastosHospitalarios' : gastosHospitalarios,
                'honorariosMedicos' : honorariosMedicos,
                'auxiliaresDeDiagnostico' : auxiliaresDeDiagnostico,
                'medicamentos' : medicamentos,
                'ambulancia' : ambulancia,
                'asistenciaTelefonica' : asistenciaTelefonica,
                'asistenciaEnViaje' : asistenciaEnViaje,
                'protesisYAparatosOrtopedicos' : protesisYAparatosOrtopedicos,
                'rehabilitaciones' : rehabilitaciones,
                'tratamientosDentales' : tratamientosDentales,
                'tratamientosReconstructivosYEsteticos' : tratamientosReconstructivosYEsteticos,
                'complicacionesDeGastosNoCubiertos' : complicacionesDeGastosNoCubiertos,
                'procedimientosDeVanguardia' : procedimientosDeVanguardia,
                'padecimientosPreexistentesDeclarados' : padecimientosPreexistentesDeclarados,
                'padecimientosPreexistentesNoDeclarados' : padecimientosPreexistentesNoDeclarados,
                'homeopatiaQuiropracticaYAcupuntura' : homeopatiaQuiropracticaYAcupuntura,
                'psiquiatraYPsicologo' : psiquiatraYPsicologo,
                'emergenciaEnElExtranjero' : emergenciaEnElExtranjero,
                'enfermedadesCatastroficasEnElExtranjero' : enfermedadesCatastroficasEnElExtranjero,
                'internacional' : internacional,
                'dental' : dental,
                'vision' : vision,
                'prevision' : prevision,
                'atencionNacionalTotal' : atencionNacionalTotal,
                'reduccionDeDeduciblePorAccidente' : reduccionDeDeduciblePorAccidente,
                'hogar' : hogar,
                'funeraria' : funeraria,
                'enfermedadesFrecuentes' : enfermedadesFrecuentes,
                'enfermedadesCatastroficas' : enfermedadesCatastroficas,
                'hombre' : hombre,
                'cancer' : cancer,
                'muerteAccidental' : muerteAccidental,
                'perdidasOrganicas' : perdidasOrganicas,
                'hospitalizacion' : hospitalizacion,
                'incapacidad' : incapacidad,
                'iva' : iva,
                'maternidad' : maternidad,
                'coverageData' : JSON.stringify(coverageData),
                'mujer' : mujer,
                'infantil' : infantil,
                'gastosEspedicion' : gastosEspedicion,
                'primaNeta' : primaNeta,
                "recargos" : recargos,
                'primaTotalAnual' : primaTotal
            };

            if(tipo === 'cotizacion'){
                insuranceMedicalQuotation.sendEmailQuotation(params);
            }
        };

        vm.steps = { 
            search: false,
            cotizacion: false,
            recotizacion: false,
            emision: false,
            entrega: false
        };

        vm.showCollapseDatosCliente = false;
        vm.collapseInClassDatosCliente = false;
        vm.collapseInClassDatosRiesgo = true;
        vm.collapseDatosCliente = "desc";
        vm.collapseQuotationDetail = "plus";
        // vm.isPersonalizada = false;
        // vm.isPerfilador = false;


        vm.setArrows = setArrows;
        function setArrows(){
            vm.flechasCollapse = [];
            for(var i = 0; i< vm.grupos.length;i++){
                vm.flechasCollapse.push(false);
            }
            vm.toggleColapse = toggleColapse;
            function toggleColapse(indiceGrupo){
                vm.flechasCollapse[indiceGrupo] = !vm.flechasCollapse[indiceGrupo];
                
            }

        }

        vm.collQuotationDetail = collQuotationDetail;
        function collQuotationDetail() {
            vm.collapseQuotationDetail = vm.collapseQuotationDetail === "plus" ? "minus" : "plus";
        }
        
        vm.goRegresarMain = goRegresarMain;
        function goRegresarMain(){
            $state.go('insurance.main');
        }

            vm.goDatosRiesgo = goDatosRiesgo;
        function goDatosRiesgo() {
            vm.steps.search = false;
            vm.steps.entrega = false;
            vm.steps.cotizacion = true;
            //Si el flujo es completo el valor es true;
            vm.flujoCompleto = true;
            
            vm.collapseInClassDatosRiesgo = true;
            vm.dependientes = [];
            if (vm.cmd) {
                vm.cmd.estado = undefined;
                vm.cmd.municipio = undefined;
            }
            vm.clienteEsTitularAsegurado = '2';
            if (vm.dataNumAseguradosList) {
                vm.dataNumAseguradosList.type = undefined;
            }
            if (vm.dataParentescoList) {
                vm.dataParentescoList.type = vm.ListMedicalParentescos[0];
            }
        }
        vm.btnVolver = btnVolver;
        function btnVolver(){
            vm.steps.emision = false;
            vm.steps.entrega = false;
            if(vm.flujoCompleto){
                vm.steps.cotizacion = true;
                vm.steps.recotizacion = true;
            }else{
                vm.steps.recotizacion = false;
                vm.steps.cotizacion = false;
                getAvailableQuotation();
                vm.flujoCompleto = true;
            }
            vm.pestCotiza = true;
            vm.pestEmision = false;
            vm.trianguloAzul = "triangulo";
            vm.trianguloBorde = "trianguloBlanco";
        }

        vm.goCotizacion = goCotizacion;
        function goCotizacion() {
            getJsonCotizacion();
        }

        vm.goRecotizacion = goRecotizacion;
        function goRecotizacion() {
           
            
            vm.recotizacionDisabled = true;
            vm.emailDisabled = true;
            
            getJsonRecotizacion();
        }
        
        vm.createEmisionAmbiente = createEmisionAmbiente;
        function createEmisionAmbiente(){
            vm.ListGiroMercantil = getCatalogoGiroMercantil();
            vm.ListNacionalidad = getMedicalNacionalidad();
            asignaNacionalidadDefault();
            vm.getCuestionarioEmision = getCuestionarioEmision();
        }
        
        vm.goEmision = goEmision;
        function goEmision() {
            
            vm.ListMedicalLocacion=[];
            getCatalogoMedicalEntidadesEmision();
            vm.steps.cotizacion = false;
            vm.steps.recotizacion = false;
            vm.steps.emision = true;
            vm.steps.entrega = false;
            vm.trianguloAzul = "trianguloBlanco";
            vm.trianguloBorde = "triangulo";
            vm.pestCotiza = false;
            vm.pestEmision = true;
            
            datosEmision(vm.jsonCotizacion.quotationNumber);
            
            createEmisionDependientes();
            createEmisionAmbiente();
        }
        
        vm.goEntrega = goEntrega;
        function goEntrega() {

            if (!validaContratante()) {
                CommonModalsSrv.error("Debe completar los datos requeridos del Contratante");
                return false;
            }

            for (var i = 0; i < vm.emitDependientes.length; i++) {
                if (!validaDependiente(i)) {
                    CommonModalsSrv.error("Debe completar los datos requeridos de " + vm.emitDependientes[i].relationship);
                    return false;
                }
            }
            
            vm.firmasjuntas = document.getElementById("firmasJuntas");
            vm.steps.search = false;
            vm.steps.cotizacion = false;
            vm.steps.recotizacion = false;
            console.log("go entrega");
            if (vm.fileB64) {
                cargaDocumento();
            }
            registroCuestionario();
        }

        vm.dibujarFirmasJuntas = dibujarFirmasJuntas;
        function dibujarFirmasJuntas() {
            
            html2canvas(vm.firmasjuntas, {
                onrendered: function (canvas) {
                  vm.firmasEnBase64 = canvas.toDataURL("image/jpeg");
                  servicioEnvioDeFirmas();
                }
            });
        }

        vm.formatCurrency = formatCurrency;
        function formatCurrency(amount) {
            return validateIn.formatCurrency(amount);
        }

        vm.charrepeatText = charrepeatText;
        function charrepeatText(event, idValue) {
            return validateIn.charrepeatText(event, idValue);
        }

        vm.soloNumAndPunto = soloNumAndPunto;
        function soloNumAndPunto(event, idValue) {
            return validateIn.soloNumAndPunto(event, idValue);
        }

        vm.soloText = soloText;
        function soloText(e, espacios, valor) {
            return validateIn.soloText(e, espacios,valor);
        }


        vm.soloNum = soloNum;
        function soloNum(e) {
            return validateIn.soloNum(e);
        }

        vm.cambiaN = cambiaN;
        function cambiaN(e) {
             validateIn.cambiaN(e);
        }
        

        vm.soloTextAndNum = soloTextAndNum;
        function soloTextAndNum(e, espacios) {
            return validateIn.soloTextAndNum(e, espacios);
        }

        vm.calcularEdadRfc = calcularEdadRfc;
        function calcularEdadRfc(rfc, type) {
            return validateIn.calcularEdadRfc(rfc, type);
        }
        
        vm.onValidateDuplicateTel = onValidateDuplicateTel;
        function onValidateDuplicateTel (newValue, type) {
            var telefono = 0;
            var celular = 0;
            if (type === 'c') {
                telefono = (typeof vm.emitContratante.telefono !== 'undefined') ? vm.emitContratante.telefono : 0;
                celular = (typeof newValue !== 'undefined') ? newValue : 0;
                //console.log("Tipo: " + type + "Telefono Particular: " + telefono + " Celular: " + celular);
                if (telefono === celular && telefono !== 0 && celular !== 0) {
                    CommonModalsSrv.error("Favor de Capturar un Celular Diferente");
                    return false;
                }
            } else if (type === 'f') {
                telefono = (typeof newValue !== 'undefined') ? newValue : 0;
                celular = (typeof vm.emitContratante.celular !== 'undefined') ? vm.emitContratante.celular : 0;
                //console.log("Tipo: " + type + "Telefono Particular: " + telefono + " Celular: " + celular);
                if (telefono === celular && telefono !== 0 && celular !== 0) {
                    CommonModalsSrv.error("Favor de Capturar un Teléfono Diferente");
                    return false;
                }
            }
        }

        vm.colorTablaMontos = colorTablaMontos;
        function colorTablaMontos(e, x, y, z) {
            colorMontos(x, y, z);
        }
        vm.comparaTitularD = true;

        function comparaTitularDoble(){
            angular.forEach(vm.dependientes, function (value) {
                if(value.relationship === "TITULAR"){
                    vm.comparaTitularD= false;
                }
            });
        }

        vm.agregarFamiliar = agregarFamiliar;
        function agregarFamiliar() {
            
            agregarDependiente();
        }
        
        vm.limpiarDependiente = limpiarDependiente;
        function limpiarDependiente() {
            
            if (vm.dependientes.length !== 0) {
                vm.dataParentescoList.type = undefined;
            }

            if(!vm.dependientes || vm.dependientes.length === 0){
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
            
            vm.sexoCliente = "Masculino";
            vm.dataOcupacionList.type = undefined;
            vm.dataDeporteList.type = undefined;
            vm.deporteCliente = "";
            
            vm.isClienteBanco = false;
            vm.editandoCliente = false;
            vm.buttonNameClientData = vm.nombreBotonAgregar;
            vm.buttonNameCleanData = vm.nombreBotonLimpiar;
        }

        vm.borrarDependientes = borrarDependientes;
        function borrarDependientes(index){
            vm.banderaPrimerMayor18 = true;
            if(vm.dependientes[index].relationship === 'TITULAR'){
                angular.forEach(vm.dependientes, function (value) {
                    if(vm.banderaPrimerMayor18){
                        if(value.age >= 18 && value.relationshipID !== 1){
                             value.relationshipID = 1;
                             value.relationship = 'TITULAR';
                             vm.banderaPrimerMayor18 = false;
                        }
                    }
                });
                vm.clienteEsTitularAsegurado = "2";
            }
            vm.dependientes.splice(index,1);
            vm.editandoCliente = false;
            limpiarDependiente();

            if (vm.dependientes.length === 0 || !vm.dependientes) {
                //vm.ListMedicalParentescos = getCatalogoMedicalParentescos();
                vm.dataParentescoList.type = vm.ListMedicalParentescos[0];
            }
        }

        vm.editarDependientes = editarDependientes;
        function editarDependientes(index){
            vm.dataParentescoList.type = {
                id: vm.dependientes[index].relationshipID,
                text : vm.dependientes[index].relationship
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
                text : vm.dependientes[index].jobDescription
            };
            vm.dataDeporteList.type = {
                id: vm.dependientes[index].sportID,
                text: vm.dependientes[index].sport
            };
            vm.indexTitular = index;
            
            vm.editandoCliente = true;
            vm.buttonNameClientData = vm.nombreBotonModificar;
            vm.buttonNameCleanData = vm.nombreBotonCancelar;
            
            if(vm.clienteEsTitularAsegurado === "1" && vm.rfcCliente === vm.fiscalIDNumber){
                vm.isClienteBanco = true;
            }
        }

        vm.agregarEditados = agregarEditados;
        function agregarEditados(index){
            vm.dependientes[index].relationshipID = vm.dataParentescoList.type.id;
            vm.dependientes[index].relationship = vm.dataParentescoList.type.text;
            vm.dependientes[index].name = vm.nombresCliente;
            vm.dependientes[index].lastName = vm.primerApellidoCliente;
            vm.dependientes[index].secondLastName = vm.segundoApellidoCliente;
            vm.dependientes[index].birthDate = moment(vm.fechaNacimientoCliente).format('YYYY-MM-DD');
            vm.dependientes[index].age = calculaEdad(vm.fechaNacimientoCliente);
            vm.dependientes[index].fiscalIDNumber = vm.rfcCliente;
            vm.dependientes[index].gender = vm.sexoCliente === "Masculino" ? 1 : 0,
            vm.dependientes[index].genderDesc = vm.sexoCliente;
            vm.dependientes[index].jobID = vm.edadCliente>=18 && vm.dataOcupacionList.type !== undefined ? vm.dataOcupacionList.type.id : "";
            vm.dependientes[index].jobDescription = vm.edadCliente>=18 && vm.dataOcupacionList.type !== undefined ? vm.dataOcupacionList.type.text : "";
            vm.dependientes[index].sportID = vm.dataDeporteList.type.id === "1" || vm.dataDeporteList.type === undefined ? "":vm.dataDeporteList.type.id ;
            vm.dependientes[index].sport = vm.dataDeporteList.type.text === "NINGUNO" || vm.dataDeporteList.type === undefined ? "": vm.dataDeporteList.type.text ;
            
            vm.isClienteBanco = false;
        }

    

        vm.agregarTitularAsegurado = agregarTitularAsegurado;
        function agregarTitularAsegurado() {
           
                vm.nombresCliente = vm.nombres;
                vm.primerApellidoCliente = vm.primerApellido;
                vm.segundoApellidoCliente = vm.segundoApellido;
                vm.rfcCliente=vm.fiscalIDNumber;
                vm.fechaNacimientoCliente = moment(vm.fechaNacimiento, 'DD/MM/YYYY');
                vm.edadCliente = calculaEdad(vm.fechaNacimientoCliente);
                
                vm.isClienteBanco = true;
         }
        
        
        vm.calcularEdadCliente = calcularEdadCliente;
        function calcularEdadCliente(tipo) {
            if (vm.fechaNacimientoCliente && tipo === 'cliente'){
                vm.edadCliente = calculaEdad(vm.fechaNacimientoCliente);
            }
            if (vm.emitContratante.fechaNacimiento && tipo === 'contratante'){
                vm.emitContratante.edad = calculaEdad(vm.emitContratante.fechaNacimiento);
            }
        }
        
        vm.calculaEdad = calculaEdad;
        function calculaEdad(fechaMoment) {
            return moment().diff(fechaMoment, 'years');
        }

        vm.calcularRFCContratante = calcularRFCContratante;
        function calcularRFCContratante(){
            if(vm.emitContratante.nombres && vm.emitContratante.primerApellido && vm.emitContratante.segundoApellido && vm.emitContratante.fechaNacimiento){
                    var name = vm.emitContratante.nombres.replace(/Ñ/g, 'N').replace(/ñ/g, 'n');
                    var lastName = vm.emitContratante.primerApellido.replace(/Ñ/g, 'N').replace(/ñ/g, 'n');
                    var secondLastName = vm.emitContratante.segundoApellido.replace(/Ñ/g, 'N').replace(/ñ/g, 'n');
                    calcularRFC(name, lastName, secondLastName,
                        moment(vm.emitContratante.fechaNacimiento).format('YYYY-MM-DD'), 'contratante');
                }
                
        }
        
        vm.calcularRFCCliente = calcularRFCCliente;
        function calcularRFCCliente() {
            if (vm.nombresCliente && vm.primerApellidoCliente && vm.segundoApellidoCliente && vm.fechaNacimientoCliente) {

                var name = vm.nombresCliente.replace(/Ñ/g, 'N').replace(/ñ/g, 'n');
                var lastName = vm.primerApellidoCliente.replace(/Ñ/g, 'N').replace(/ñ/g, 'n');
                var secondLastName = vm.segundoApellidoCliente.replace(/Ñ/g, 'N').replace(/ñ/g, 'n');

                calcularRFC(name, lastName, secondLastName,
                    moment(vm.fechaNacimientoCliente).format('YYYY-MM-DD'), 'cliente');
            }
        }
        
        vm.calcularRFC = calcularRFC;
        function calcularRFC(name, lastName, secondLastName, birthdate, tipo) {
            
            var _params = {
                language: "SPA",
                name: name,
                lastName: lastName,
                secondLastName: secondLastName,
                birthDate: birthdate
            };

            insuranceMedicalSrv.getMedicalInsuranceFiscalIDNumber(_params).then(function (response) {
                if (response.success) {
                    if(tipo === 'cliente'){
                        vm.rfcCliente = response.info.fiscalIDNumber;
                        vm.homoclaveRFCCliente = response.info.fiscalSingleKey;
                    }

                    if(tipo === 'contratante'){
                        vm.emitContratante.rfc = response.info.fiscalIDNumber;
                        vm.homoclaveRFCContratante = response.info.fiscalSingleKey;
                    }
                    if(vm.emitDependientes){
                    validaRfcContratanteAsegurados();
                    }
                }
            });
        }
        
        vm.agregarDependiente = agregarDependiente;
        function agregarDependiente() {
            
            if (vm.nombresCliente && vm.primerApellidoCliente && vm.segundoApellidoCliente && vm.fechaNacimientoCliente) {

                var name = vm.nombresCliente.replace(/Ñ/g, 'N').replace(/ñ/g, 'n');
                var lastName = vm.primerApellidoCliente.replace(/Ñ/g, 'N').replace(/ñ/g, 'n');
                var secondLastName = vm.segundoApellidoCliente.replace(/Ñ/g, 'N').replace(/ñ/g, 'n');

                var _params = {
                    language: "SPA",
                    name: name,
                    lastName: lastName,
                    secondLastName: secondLastName,
                    birthDate: moment(vm.fechaNacimientoCliente).format('YYYY-MM-DD')
                };

                insuranceMedicalSrv.getMedicalInsuranceFiscalIDNumber(_params).then(function (response) {
                    if (response.success) {
                        vm.rfcCliente = response.info.fiscalIDNumber;
                        vm.homoclaveRFCCliente = response.info.fiscalSingleKey;

                        if (!vm.editandoCliente) {
                            if (parseInt(vm.dataNumAseguradosList.type.text) > vm.dependientes.length) {

                                if (vm.dependientes.length === 0 && vm.clienteEsTitularAsegurado === '1') {
                                    vm.sexo = vm.sexoCliente;
                                }

                                vm.comparaTitularD = true;

                                if (vm.dataParentescoList.type.text === 'TITULAR') {
                                    comparaTitularDoble();
                                }

                                if (vm.comparaTitularD) {

                                    var ultimo = vm.dependientes.length + 1;

                                    vm.edadCliente = calculaEdad(vm.fechaNacimientoCliente);

                                    vm.dependientes.push({
                                        riskNumber: ultimo,
                                        relationshipID: vm.dataParentescoList.type.id,
                                        relationship: vm.dataParentescoList.type.text,
                                        name: vm.nombresCliente,
                                        lastName: vm.primerApellidoCliente,
                                        secondLastName: vm.segundoApellidoCliente,
                                        birthDate: moment(vm.fechaNacimientoCliente).format('YYYY-MM-DD'),
                                        age: vm.edadCliente,
                                        fiscalIDNumber: vm.rfcCliente,
                                        curp: "",
                                        gender: vm.sexoCliente === "Masculino" ? 1 : 0,
                                        genderDesc: vm.sexoCliente,
                                        jobID: vm.edadCliente >= 18 && vm.dataOcupacionList.type !== undefined ? vm.dataOcupacionList.type.id : "",
                                        jobDescription: vm.edadCliente >= 18 && vm.dataOcupacionList.type !== undefined ? vm.dataOcupacionList.type.text : "",
                                        sport: vm.dataDeporteList.type === undefined || vm.dataDeporteList.type.text === "NINGUNO" ? "" : vm.dataDeporteList.type.text,
                                        sportID: vm.dataDeporteList.type === undefined || vm.dataDeporteList.type.text === "NINGUNO" ? "" : vm.dataDeporteList.type.id
                                    });

                                    limpiarDependiente();
                                    vm.faltaTitular = false;
                                } else {
                                    CommonModalsSrv.error("Solo puede existir un solo TITULAR");
                                }


                            } else {
                                CommonModalsSrv.error("El límite de dependientes económicos es " + vm.dataNumAseguradosList.type.text);
                            }

                        } else {
                            agregarEditados(vm.indexTitular);
                            limpiarDependiente();
                        }

                    }
                });
            
            }
        }
        
        vm.onChangeNombre = onChangeNombre;
        function onChangeNombre(){
            calcularEdadCliente('cliente');
            calcularRFCCliente();
        }
        
        vm.onChangeNombreContrc = onChangeNombreContrc;
        function onChangeNombreContrc(){
            calcularEdadCliente('contratante');
            calcularRFCContratante();
            

        }
        
        vm.validaAseg = validaAseg;
        function validaAseg() {
            vm.cont = 0;
            vm.cotizarDisabled = true;
            if($scope.$parent.agentSelected === undefined || $scope.$parent.agentSelected === null){
                CommonModalsSrv.error("Favor de seleccionar un Agente para continuar.");
                vm.cotizarDisabled = false;
                 return;
            }
            angular.forEach(vm.dependientes, function (val) {
                if (val.relationship === "TITULAR") {
                    vm.cont++;
                }
            });

            if (vm.dependientes.length === parseInt(vm.dataNumAseguradosList.type.text)) {
                if (vm.cont === 1) {
                    goCotizacion();
                } else {
                    if (vm.cont === 0) {
                        CommonModalsSrv.error("Favor de agregar un Titular.");
                    } else {
                        CommonModalsSrv.error("Solo puede haber un asegurado Titular.");
                    }
                    vm.cotizarDisabled = false;
                }
            } else {
                CommonModalsSrv.error("El número de dependientes registrados es distinto al número de asegurados seleccionados. Favor de actualizar los dependientes registrados.");
                vm.cotizarDisabled = false;
            }
        }



        vm.colorMontos = colorMontos;
        function colorMontos(x, y, z) {
            vm.indexFormaPago = x;
            vm.indexPaquete = y;
            vm.indexPago = z;
            
            var formaPago = vm.jsonCotizacion.ofertaComercial.formasPago.formaPago;
            var paquete = getPaquetes();
            
            actualizarSolicitud(vm.paquetes[vm.indexPaquete].nom_paquete, vm.paquetes[vm.indexPaquete].cod_paquete, vm.jsonCotizacion.quotationNumber);
            guardarSeleccion(vm.paquetes[vm.indexPaquete].cod_paquete, formaPago[vm.indexFormaPago].pagoID, vm.jsonCotizacion.quotationNumber);

            vm.cajasMontos = new Array(formaPago.length);

            for (var i = 0; i < formaPago.length; i++) {

                vm.cajasMontos[i] = new Array(paquete.length);

                for (var j = 0; j < paquete.length; j++) {

                    if (Array.isArray(formaPago[i].pagos.pago)) {
                        vm.cajasMontos[i][j] = new Array(formaPago[i].pagos.pago.length);
                        for (var k = 0; k < formaPago[i].pagos.pago.length; k++) {
                            vm.cajasMontos[i][j][k] = false;
                        }
                    } else {
                        vm.cajasMontos[i][j] = false;
                    }
                }
            }

            if (Array.isArray(formaPago[x].pagos.pago)) {
                vm.cajasMontos[x][y][z] = true;
            } else {
                vm.cajasMontos[x][y] = true;
            }
            getResumenCotizacion(vm.oferta);
        }

        vm.getJsonCotizacion = getJsonCotizacion;
        function getJsonCotizacion() {
            
            vm.collapseInClassDatosRiesgo = true;
            
            var i = 0;
            angular.forEach(vm.dependientes, function (value) {
                value.riskNumber = ++i;
            });
            
            vm.emission.fechaInicioVigCotizacion = moment().format('DD/MM/YYYY');
            vm.emission.fechaFinVigCotizacion = moment().add(1, 'years').format('DD/MM/YYYY');

            var paramsCotizacion = {
                insurancePolicyDate: moment(vm.emission.fechaInicioVigCotizacion, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                policyMaturityDate: moment(vm.emission.fechaFinVigCotizacion, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                customizeInsuranceQuotationFlag: 0,
                businessPackage: 'N',
                insuredPersonsQuantity: vm.dependientes.length,
                //package: '',
                //discountCode: '',
//                discountCampaignID: '',
                discountCampaignValue: 0,
                dependientes: JSON.stringify(vm.dependientes),
                commissionCessionFlag: 0,
                federalEntityID: vm.cmd.estado.id,
                federalEntity: vm.cmd.estado.text,
                delegationMunicipalityID: vm.cmd.municipio.id,
                delegationOrMunicipality: vm.cmd.municipio.text,
                agentCode: $scope.$parent.agentSelected.id,
                clientNumber : vm.numeroCliente,
                adviserID : '951753'
            };

            insuranceMedicalSrv.getCotizacionSrv(paramsCotizacion).then(function (response) {

                if (response.success) {
                    vm.jsonCotizacion = response.info;
                    vm.oferta = vm.jsonCotizacion.ofertaComercial.asegurados.asegurado;
                    colorMontos(0, 0, 0);
                    getResumenCotizacion(vm.oferta);
                    getIntervalos();
                    getGrupos();
                    setArrows();
                    getFormasPago(vm.jsonCotizacion.ofertaComercial.formasPago.formaPago);
                    
                    vm.primaN = vm.formasPago[vm.indexFormaPago].pagos[vm.indexPago].montos[vm.indexPaquete].primaneta;
                    vm.trianguloAzul = "triangulo";
                    vm.trianguloBorde = "trianguloBorde";
                    vm.pestCotiza = true;
                    vm.pestEmision = false;
                    
                    guardarCotizacionBD();

                } else {
                    vm.cotizarDisabled = false;
                }
            }).catch(function (error) {
                console.log(error);
                CommonModalsSrv.error("El servicio de cotización no está disponible por el momento.");
                vm.cotizarDisabled = false;
            });
        }

        vm.getJsonDetalleCotizacion = getJsonDetalleCotizacion;
        function getJsonDetalleCotizacion(idCotizacion) {

            insuranceMedicalSrv.getDetalleCotizacion(idCotizacion).then(function (response) {

                if (response.success) {
                    vm.jsonCotizacion = response.info;
                    vm.oferta = vm.jsonCotizacion.ofertaComercial.asegurados.asegurado;
                    getResumenCotizacion(vm.oferta);
                    
                    createEmisionDependientesFromDetail();
                    createEmisionAmbiente();
                    
//                    colorMontos(0, 0, 0);
//                    getResumenCotizacion();
//                    getIntervalos();
//                    getGrupos();
//                    setArrows();
//                    getFormasPago(vm.jsonCotizacion.ofertaComercial.formasPago.formaPago);
                }else{
                    CommonModalsSrv.error("Error al cargar esta Cotizacion.");
                    btnVolver();
                }
            }).catch(function () {
                CommonModalsSrv.error("Error al cargar esta Cotizacion.");
                btnVolver();
            });
        }

        vm.getIntervalos = getIntervalos;
        function getIntervalos() {
            /*
             * Rellena los combos y nombres de cada cobertura en Elemental
             */

            for (var group = 0; group < vm.jsonCotizacion.xmlCoberturas.agrupado.grupo.length; group++) {
                for (var renglon = 0; renglon < vm.jsonCotizacion.xmlCoberturas.agrupado.grupo[group].coberturas.cobertura.length; renglon++) {
                    var int = vm.jsonCotizacion.xmlCoberturas.agrupado.grupo[group].coberturas.cobertura[renglon].intervalos;
                    angular.forEach(int, function (value, key) {
                        if (group !== 7 && !(group === 5 && renglon === 4)) {
                            switch (key) {
                                case "sa":
                                    if (int.sa) {
                                        int.sa.name = "Suma asegurada";
                                    }
                                    break;
                                case "deducible":
                                    if (int.deducible) {
                                        int.deducible.name = "Deducible";
                                    }
                                    break;
                                case "coaseguro":
                                    if (int.coaseguro) {
                                        int.coaseguro.name = "Coaseguro";
                                    }
                                    break;
                                case "topecoaseguro":
                                    if (int.topecoaseguro) {
                                        int.topecoaseguro.name = "Tope de Coaseguro";
                                    }
                                    break;
                                case "deduciblePad":
                                    if (int.deduciblePad) {
                                        int.deduciblePad.name = "Deducible Pad.";
                                    }
                                    break;
                                case "tabulador":
                                    if (int.tabulador) {
                                        int.tabulador.name = "Tabulador";
                                    }
                                    break;
                                case "redHosp":
                                    if (int.redHosp) {
                                        int.redHosp.name = "Red hosp.";
                                    }
                                    break;
                                case "planDental":
                                    if (int.planDental) {
                                        int.planDental.name = "Plan Dental";
                                    }
                                    break;
                                case "planVision":
                                    if (int.planVision) {
                                        int.planVision.name = "Plan Visión";
                                    }
                                    break;
                                case "diaCarencia":
                                    if (int.diaCarencia) {
                                        int.diaCarencia.name = "Días de carencia";
                                    }
                                    break;
                                case "saCarencia":
                                    if (int.saCarencia) {
                                        int.saCarencia.name = "Renta Diaria";
                                    }
                                    break;
                                default:
                                    break;
                            }
                        }
                        if (value && value.intervalo) {
                            value.listIntervalo = createListCotizacionCmd(value.intervalo);

                            if (vm.cmd.estado.id === "23" && key === "redHosp" && group === 0) {

                                switch (vm.cmd.municipio.id) {
                                    case "23001":
                                    case "23003":
                                    case "23005":
                                    case "23008":
                                        redHospAmp = value.listIntervalo.pop();
                                        break;
                                    default:
                                        break;
                                }
                            }

                            angular.forEach(value.listIntervalo, function (v) {
                                if (v.id === value.valDef) {
                                    value.intervaloSelected = v;
                                }
                            });
                        }

                    });
                }
            }

            angular.forEach(int, function (value) {
                if (value && value.intervalo) {
                    value.listIntervalo = createListCotizacionCmd(value.intervalo);
                }
                
            });
        }

        vm.createListCotizacionCmd = createListCotizacionCmd;
        function createListCotizacionCmd(list) {
            var _listaObtenida = [];

            if (Array.isArray(list)) {
                angular.forEach(list, function (value) {
                    _listaObtenida.push(
                        {
                            id: value.key,
                            text: value.value
                        }
                    );
                });
                vm.listaQuinta = _listaObtenida;
                return _listaObtenida;
            
            } else if (list === "") {
                return 0;
            } else {
                angular.forEach(createListObject(list), function (value) {
                    _listaObtenida.push(
                        {
                            id: value.key,
                            text: value.value
                        }
                    );
                });
                return _listaObtenida;
            }
        }



        vm.getResumenCotizacion = getResumenCotizacion;
        function getResumenCotizacion(ase) {

            var _lista = [];
            var asegurado = ase;

            if (Array.isArray(asegurado)) {
                angular.forEach(asegurado, function (value, index) {
                    _lista.push(getAsegurado(value, index));
                });
            } else {
                _lista.push(getAsegurado(asegurado));
            }

            vm.asegurados = _lista;
            return vm.asegurados;
        }

        vm.getAsegurado = getAsegurado;
        function getAsegurado(value) {
            var paquetes = getPaquetesAsegurado(value);

            return {
                edad: value.edad,
                nombre: value.nombre,
                num_riesgo: value.numRiesgo,
                ocupacion: value.ocupacion,
                parentesco: value.parentesco,
                sexo: value.sexo,
                suma_asegu: value.sumaAseg,
                paquete: paquetes[vm.indexPaquete].nomPaquete,
                formaPago: paquetes[vm.indexPaquete].formasPago.formaPago[vm.indexFormaPago].nomForma,
                prima: paquetes[vm.indexPaquete].formasPago.formaPago[vm.indexFormaPago].prima
            };
        }

        vm.getPaqueteAsegurado = getPaqueteAsegurado;
        function getPaqueteAsegurado(value) {
            return {
                codPaquete: value.codPaquete,
                nomPaquete: value.nomPaquete,
                formasPago: value.formasPago
            };
        }

        vm.getPaquetesAsegurado = getPaquetesAsegurado;
        function getPaquetesAsegurado(asegurado) {

            var _lista = [];
            var paquete = asegurado.paquetes.paquete;

            if (Array.isArray(paquete)) {
                angular.forEach(paquete, function (value) {
                    _lista.push(getPaqueteAsegurado(value));
                });
            } else {
                _lista.push(getPaqueteAsegurado(paquete));
            }

            return _lista;
        }

        vm.getPaqueteCobertura = getPaqueteCobertura;
        function getPaqueteCobertura(value) {
            return {
                cod_paquete: value.codPaquete,
                mca_opc: value.mcaOpc,
                mod_chk: value.modChk
            };
        }

        vm.getPaquetesCoberturas = getPaquetesCoberturas;
        function getPaquetesCoberturas(cobertura) {
            var _lista = [];
            var paquete = cobertura.paquetes.paquete;

            if (Array.isArray(paquete)) {
                angular.forEach(paquete, function (value) {
                    _lista.push(getPaqueteCobertura(value));
                });
            } else {
                _lista.push(getPaqueteCobertura(paquete));
            }

            return _lista;
        }

        vm.getGrupos = getGrupos;
        function getGrupos() {

            vm.grupos = [];
            var grupo = vm.jsonCotizacion.xmlCoberturas.agrupado.grupo;

            for (var i = 0; i < grupo.length; i++) {

                var grup = {
                    grupo_desc: grupo[i].grupoDesc,
                    grupo_id: grupo[i].grupoId
                };

                var coberturas = [];
                var cobertura = grupo[i].coberturas.cobertura;

                for (var j = 0; j < cobertura.length; j++) {

                    coberturas.push({
                        cod_cob: cobertura[j].codCob,
                        intervalos: cobertura[j].intervalos,
                        nom_cob: cobertura[j].nomCob,
                        paquetes: getPaquetesCoberturas(cobertura[j]),
                        sa_def: cobertura[j].saDef,
                        sa_des: cobertura[j].saDes,
                        tool_tip: cobertura[j].toolTip
                    });
                }
                grup.coberturas = coberturas;
                vm.grupos.push(grup);
            }
            return vm.grupos;
        }

        vm.getPaquete = getPaquete;
        function getPaquete(value) {
            return {
                cod_paquete: value.codPaquete,
                nom_paquete: value.nomPaquete
            };
        }


        vm.getPaquetes = getPaquetes;
        function getPaquetes() {

            var _lista = [];
            var paquete = vm.jsonCotizacion.ofertaComercial.paquetes.paquete;

            if (Array.isArray(paquete)) {
                angular.forEach(paquete, function (value) {
                    _lista.push(getPaquete(value));
                });
            } else {
                _lista.push(getPaquete(paquete));
            }
            vm.paquetes = _lista;
            return _lista;
        }







        vm.getPagos = getPagos;
        function getPagos(value) {

            var _lista = [];

            if (Array.isArray(value)) {
                angular.forEach(value, function (v) {
                    _lista.push(getPago(v));
                });
            } else {
                _lista.push(getPago(value));
            }
            return _lista;
        }

        vm.getPago = getPago;
        function getPago(value) {

            return {
                montos: getMontos(value.montospaquetes.montos),
                numPagos: value.numPagos
            };
        }



        vm.getMontos = getMontos;
        function getMontos(value) {

            var _lista = [];

            if (Array.isArray(value)) {
                angular.forEach(value, function (v) {
                    _lista.push(getMonto(v));
                });
            } else {
                _lista.push(getMonto(value));
            }
            return _lista;

        }

        vm.getMonto = getMonto;
        function getMonto(value) {

            return {
                cod_paquete: value.codPaquete,
                derechos: value.derechos,
                impuestos: value.impuestos,
                monto: value.monto,
                primaneta: value.primaneta,
                primatotal: value.primatotal,
                recargos: value.recargos
            };
        }


        vm.getFormasPago = getFormasPago;
        function getFormasPago(formasPago) {

            vm.formasPago = [];
            var formaPago = formasPago;

            /**}
             * 
             * Varias formas = contado, semestral, trimestral, mensual
             */
            for (var i = 0; i < formaPago.length; i++) {

                /**
                 * valida si pago es lista (contado (1) o cuando es 1 pago y 11 pagos (2) etc)
                 */
                vm.formasPago.push({
                    pagoDesc: formaPago[i].pagoDesc,
                    pagoID: formaPago[i].pagoID,
                    pagos: getPagos(formaPago[i].pagos.pago)
                });
            }
            return vm.formasPago;
        }

        vm.createListObject = createListObject;
        function createListObject(objeto) {

            var listaOb = [];

            listaOb.push(objeto);

            return listaOb;
        }

        vm.revisaCombosContratante = revisaCombosContratante;
        function revisaCombosContratante() {
            var js =vm.emitContratante;
            if(vm.emitContratante.edad >= 18){
                if(!js.tipoIdentificacion  || !js.estado || !js.municipio || !js.profesion){
                        return true;
                }else{
                return false;
                }
            }else if(!js.tipoIdentificacion || !js.estado || !js.municipio){
                    return true;
                }else{
                     return false;
                }
        }


        vm.revisaCombosDependientes = revisaCombosDependientes;
        function revisaCombosDependientes(index) {

            if (index === 0) {
                return revisaCombosContratante();
            } else {
                var ind = index - 1;
                if(vm.emitDependientes[ind].age >=18){
                    if (!vm.emitDependientes[ind].businessID || !vm.emitDependientes[ind].professionID) {
                        return true;
                    } else {
                        return false;
                    }
                }else{
                    if (!vm.emitDependientes[ind].businessID) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        }


        vm.onChangeList = onChangeList;
        function onChangeList(lastValue, newValue, grupo, codigoCobertura, keyIntervalo, valueIntervalo) {
            var llave = "";
            var keyVarCob = "";
            if(keyIntervalo === "deducible" && grupo === 0){
                vm.grupos[grupo].coberturas[0].intervalos.deduciblePad.intervaloSelected.text = "PADECIMIENTO";
                vm.grupos[grupo].coberturas[0].intervalos.deduciblePad.intervaloSelected.id= "1";
                 llave = vm.grupos[0].coberturas[0].intervalos.deduciblePad.nomDv;
                 keyVarCob = toCamelCase(llave);
                 vm.jsonCotizacion.ofertaComercial.datosVarCob[keyVarCob] = vm.grupos[grupo].coberturas[0].intervalos.deduciblePad.intervaloSelected.id;
                getCatalogoMedicalCoaseguro(newValue.id);
                getCatalogoMedicalDeducible(newValue.id);
                getCatalogoMedicalDeducibleRed(newValue.id);
            }
            if(keyIntervalo === "sa" && grupo === 0){
                vm.grupos[grupo].coberturas[0].intervalos.topecoaseguro.intervaloSelected.text ="SIN LÍMITE";
                vm.grupos[grupo].coberturas[0].intervalos.topecoaseguro.intervaloSelected.id = "1";
                llave = vm.grupos[0].coberturas[0].intervalos.topecoaseguro.nomDv;
                keyVarCob = toCamelCase(llave);
                vm.jsonCotizacion.ofertaComercial.datosVarCob[keyVarCob] = vm.grupos[grupo].coberturas[0].intervalos.topecoaseguro.intervaloSelected.id;
                getCatalogoMedicalTopeCoaseguro(newValue.id);
                
            }
            
            if(vm.cmd.estado.id === "23" && grupo === 0 && keyIntervalo === "tabulador") {
                if(vm.cmd.municipio.id === "23001" || vm.cmd.municipio.id === "23003" || vm.cmd.municipio.id === "23005" || vm.cmd.municipio.id === "23008") {
                    $timeout(function () {
                        if(redHospAmp === null && (valueIntervalo.intervaloSelected.text === 'A' || valueIntervalo.intervaloSelected.text === 'B' || valueIntervalo.intervaloSelected.text === 'C')) {
                            redHospAmp = vm.grupos[0].coberturas[0].intervalos.redHosp.listIntervalo.pop();
                            vm.grupos[0].coberturas[0].intervalos.redHosp.intervaloSelected = vm.grupos[0].coberturas[0].intervalos.redHosp.listIntervalo[0];
                        } else if(redHospAmp !== null && (valueIntervalo.intervaloSelected.text === 'D' || valueIntervalo.intervaloSelected.text === 'E' || valueIntervalo.intervaloSelected.text === 'F')) { 
                            vm.grupos[0].coberturas[0].intervalos.redHosp.listIntervalo.push(redHospAmp);
                            vm.grupos[0].coberturas[0].intervalos.redHosp.intervaloSelected = vm.grupos[0].coberturas[0].intervalos.redHosp.listIntervalo[0];
                            redHospAmp = null;
                        }
                    }, 100);
                }
            }

            if (keyIntervalo === "planDental") {
                vm.grupos[grupo].coberturas[1].intervalos.planVision.intervaloSelected = newValue;
                 llave = vm.grupos[grupo].coberturas[1].intervalos.planVision.nomDv;
                keyVarCob = toCamelCase(llave);
                vm.jsonCotizacion.ofertaComercial.datosVarCob[keyVarCob] = newValue.id;
            } else if (keyIntervalo === "planVision") {
                vm.grupos[grupo].coberturas[0].intervalos.planDental.intervaloSelected = newValue;
                 llave = vm.grupos[grupo].coberturas[0].intervalos.planDental.nomDv;
                keyVarCob = toCamelCase(llave);
                vm.jsonCotizacion.ofertaComercial.datosVarCob[keyVarCob] = newValue.id;
            }

            vm.recotizacionDisabled = false;
            vm.emailDisabled = true;
            
            keyVarCob = toCamelCase(valueIntervalo.nomDv);
            
            vm.jsonCotizacion.ofertaComercial.datosVarCob[keyVarCob] = newValue.id;

        }
        
        function toCamelCase(cadena){
            var arreglo = cadena.split('_');
            for (var i = 1; i < arreglo.length; i++) {
                arreglo[i] = arreglo[i].charAt(0).toUpperCase() + arreglo[i].slice(1);
            }
            
            return arreglo.join('');
        }
        
        vm.clickCheckBox = clickCheckBox;
        function clickCheckBox(){
            vm.recotizacionDisabled = false;
            vm.emailDisabled = true;
        }

         vm.validarCheckbox = validarCheckbox;
         function validarCheckbox(grupoIndex,coberturaIndex,paqueteIndex){
             if (grupoIndex === 5 && coberturaIndex === 0) {
                 vm.grupos[grupoIndex].coberturas[1].paquetes[paqueteIndex].mod_chk = vm.grupos[grupoIndex].coberturas[coberturaIndex].paquetes[paqueteIndex].mod_chk;
             } else if (grupoIndex === 5 && coberturaIndex === 1) {
                 vm.grupos[grupoIndex].coberturas[0].paquetes[paqueteIndex].mod_chk = vm.grupos[grupoIndex].coberturas[coberturaIndex].paquetes[paqueteIndex].mod_chk;
             } else if (grupoIndex === 1 && coberturaIndex === 0) {
                 vm.grupos[grupoIndex].coberturas[1].paquetes[paqueteIndex].mod_chk = vm.grupos[grupoIndex].coberturas[coberturaIndex].paquetes[paqueteIndex].mod_chk;
             } else if (grupoIndex === 1 && coberturaIndex === 1) {
                 vm.grupos[grupoIndex].coberturas[0].paquetes[paqueteIndex].mod_chk = vm.grupos[grupoIndex].coberturas[coberturaIndex].paquetes[paqueteIndex].mod_chk;
             }
         }
        // ------------------------Funciones para seccion de Firmas-------------------------
         vm.firmaDibujadaServicioTitular = false;
         vm.firmaDibujadaServicioContratante = false;
         vm.firmaDibujadaServicioAgente = false;
         
         vm.empezarDibujoTitular = empezarDibujoTitular;
         function empezarDibujoTitular() {
             vm.firmaDibujadaServicioTitular = true;
             vm.pintarLineaTitular = true;
             vm.lineasTitular.push([]);
         }

         vm.dibujarLineaTitular = dibujarLineaTitular;
         function dibujarLineaTitular(event) {
            event.preventDefault();
            if (vm.pintarLineaTitular) {

                // Estilos de linea
                vm.ctxTitular.lineJoin = vm.ctxTitular.lineCap = 'round';
                vm.ctxTitular.lineWidth = 2;
                // Color de la linea
                vm.ctxTitular.strokeStyle = 'black';
                // Marca el nuevo punto
                vm.nuevaPosicionXTitular = 0;
                vm.nuevaPosicionYTitular = 0;
                if (event.changedTouches === undefined) {
                    // Versión ratón
                    vm.nuevaPosicionXTitular = event.offsetX;
                    vm.nuevaPosicionYTitular = event.offsetY;
                } else {
                    // Versión touch, pantalla tactil
                    vm.nuevaPosicionXTitular = event.changedTouches[0].pageX - vm.correccionXTitular;
                    vm.nuevaPosicionYTitular = event.changedTouches[0].pageY - vm.correccionYTitular;
                }
                // Guarda la linea
              
                vm.lineasTitular[vm.lineasTitular.length - 1].push({
                    x: vm.nuevaPosicionXTitular,
                    y: vm.nuevaPosicionYTitular
                });
                // Redibuja todas las lineasContratante guardadas
               
                vm.ctxTitular.beginPath();
                    vm.lineasTitular.forEach(function (segmento) {
                            vm.ctxTitular.moveTo(segmento[0].x, segmento[0].y);
                            segmento.forEach(function (punto) {
                                vm.ctxTitular.lineTo(punto.x, punto.y);
                            });
                    });
                vm.ctxTitular.stroke();
            }
        }

        vm.pararDibujarTitular = pararDibujarTitular;
        function pararDibujarTitular() {
            vm.pintarLineaTitular = false;
        }


        vm.activarVariablesFirmaTitular = activarVariablesFirmaTitular;
        function activarVariablesFirmaTitular() {
            
            if (vm.steps.emision) {
                vm.canvasTitular = document.querySelector('#canvasFirmaTitular');
                vm.ctxTitular = vm.canvasTitular.getContext('2d');

                vm.lineasTitular = [];
                vm.correccionXTitular = 0;
                vm.correccionYTitular = 0;
                vm.pintarLineaTitular = false;

                vm.posicionTitular = vm.canvasTitular.getBoundingClientRect();
                vm.correccionXTitular = vm.posicionTitular.x;
                vm.correccionYTitular = vm.posicionTitular.y;

                vm.canvasTitular.width = 500;
                vm.canvasTitular.height = 200;
            }
        }

        vm.empezarDibujoContratante = empezarDibujoContratante;
        function empezarDibujoContratante() {
            vm.firmaDibujadaServicioContratante = true;
            vm.pintarLineaContratante = true;
            vm.lineasContratante.push([]);
        }

        vm.dibujarLineaContratante = dibujarLineaContratante;
        function dibujarLineaContratante(event) {
            event.preventDefault();
            if (vm.pintarLineaContratante) {

                // Estilos de linea
                vm.ctxContratante.lineJoin = vm.ctxContratante.lineCap = 'round';
                vm.ctxContratante.lineWidth = 2;
                // Color de la linea
                vm.ctxContratante.strokeStyle = 'black';
                // Marca el nuevo punto
                vm.nuevaPosicionXContratante = 0;
                vm.nuevaPosicionYContratante = 0;
                if (event.changedTouches === undefined) {
                    // Versión ratón
                    vm.nuevaPosicionXContratante = event.offsetX;
                    vm.nuevaPosicionYContratante = event.offsetY;
                } else {
                    // Versión touch, pantalla tactil
                    vm.nuevaPosicionXContratante = event.changedTouches[0].pageX - vm.correccionXContratante;
                    vm.nuevaPosicionYContratante = event.changedTouches[0].pageY - vm.correccionYContratante;
                }
                // Guarda la linea
                vm.lineasContratante[vm.lineasContratante.length - 1].push({
                    x: vm.nuevaPosicionXContratante,
                    y: vm.nuevaPosicionYContratante
                });
                // Redibuja todas las lineasContratante guardadas
                vm.ctxContratante.beginPath();
                vm.lineasContratante.forEach(function (segmento) {
                    vm.ctxContratante.moveTo(segmento[0].x, segmento[0].y);
                    segmento.forEach(function (punto) {
                        vm.ctxContratante.lineTo(punto.x, punto.y);
                    });
                });
                vm.ctxContratante.stroke();
            }
            
        }

        vm.pararDibujarContratante = pararDibujarContratante;
        function pararDibujarContratante() {
            vm.pintarLineaContratante = false;
            
        }


        vm.activarVariablesFirmaContratante = activarVariablesFirmaContratante;
        function activarVariablesFirmaContratante() {
            if (vm.steps.emision) {
                vm.canvasContratante = document.querySelector('#canvasFirmaContratante');
                vm.ctxContratante = vm.canvasContratante.getContext('2d');

                vm.ctxContratante.fillStyle = '#fff';  /// set white fill style
                vm.ctxContratante.fillRect(0, 0, vm.canvasContratante.width, vm.canvasContratante.height);

                vm.lineasContratante = [];
                vm.correccionXContratante = 0;
                vm.correccionYContratante = 0;
                vm.pintarLineaContratante = false;

                vm.posicionContratante = vm.canvasContratante.getBoundingClientRect();
                vm.correccionXContratante = vm.posicionContratante.x;
                vm.correccionYContratante = vm.posicionContratante.y;

                vm.canvasContratante.width = 500;
                vm.canvasContratante.height = 200;
            }
        }


        vm.empezarDibujoAgente = empezarDibujoAgente;
        function empezarDibujoAgente() {
            vm.firmaDibujadaServicioAgente = true;
            vm.lineasAgente.push([]);
            vm.pintarLineaAgente = true;
        }

        vm.dibujarLineaAgente = dibujarLineaAgente;
        function dibujarLineaAgente(event) {
            event.preventDefault();
            if (vm.pintarLineaAgente) {
                // Estilos de linea
                vm.ctxAgente.lineJoin = vm.ctxAgente.lineCap = 'round';
                vm.ctxAgente.lineWidth = 2;
                // Color de la linea
                vm.ctxAgente.strokeStyle = 'black';
                // Marca el nuevo punto
                vm.nuevaPosicionXAgente = 0;
                vm.nuevaPosicionYAgente = 0;
                if (event.changedTouches === undefined) {
                    // Versión ratón
                    vm.nuevaPosicionXAgente = event.offsetX;
                    vm.nuevaPosicionYAgente = event.offsetY;
                } else {
                    // Versión touch, pantalla tactil
                    vm.nuevaPosicionXAgente = event.changedTouches[0].pageX - vm.correccionXAgente;
                    vm.nuevaPosicionYAgente = event.changedTouches[0].pageY - vm.correccionYAgente;
                }
                // Guarda la linea
                vm.lineasAgente[vm.lineasAgente.length - 1].push({
                    x: vm.nuevaPosicionXAgente,
                    y: vm.nuevaPosicionYAgente
                });
                if(vm.lineasAgente)
                    // Redibuja todas las lineasContratante guardadas
                    vm.ctxAgente.beginPath();
                    vm.lineasAgente.forEach(function (segmento) {
                    vm.ctxAgente.moveTo(segmento[0].x, segmento[0].y);
                    segmento.forEach(function (punto) {
                        vm.ctxAgente.lineTo(punto.x, punto.y);
                    });
                });
                vm.ctxAgente.stroke();
            }
            
        }

        vm.pararDibujarAgente = pararDibujarAgente;
        function pararDibujarAgente() {
            vm.pintarLineaAgente = false;
        }


        vm.activarVariablesFirmaAgente = activarVariablesFirmaAgente;
        function activarVariablesFirmaAgente() {
            if (vm.steps.emision) {
                vm.canvasAgente = document.querySelector('#canvasFirmaAgente');
                vm.ctxAgente = vm.canvasAgente.getContext('2d');

                vm.ctxAgente.fillStyle = '#fff';  /// set white fill style
                vm.ctxAgente.fillRect(0, 0, vm.canvasAgente.width, vm.canvasAgente.height);

                vm.lineasAgente = [];
                vm.correccionXAgente = 0;
                vm.correccionYAgente = 0;
                vm.pintarLineaAgente = false;

                vm.posicionAgente = vm.canvasAgente.getBoundingClientRect();
                vm.correccionXAgente = vm.posicionAgente.x;
                vm.correccionYAgente = vm.posicionAgente.y;

                vm.canvasAgente.width = 500;
                vm.canvasAgente.height = 200;
            }
        }

        vm.limpiarFirmaContratante = limpiarFirmaContratante;
        function limpiarFirmaContratante() {
            
            vm.ctxContratante.clearRect(0, 0, vm.canvasContratante.width, vm.canvasContratante.height);
            vm.lineasContratante = [];
            vm.correccionXContratante = 0;
            vm.correccionYContratante = 0;
            vm.pintarLineaContratante = false;
            vm.firmaDibujadaServicioContratante = false;
        }

        vm.esFumador = esFumador;
        function esFumador(indiceAsegurado){
            if(vm.jsonCuestionario[0].answerDataList.answerSelected[indiceAsegurado].id === "1"){
                
                for(var i=0; i<vm.jsonCuestionario[0].subquestionDataList.subquestionData.length;i++){
                    vm.jsonCuestionario[0].subquestionDataList.subquestionData[i].answerDataList.answerSelected[indiceAsegurado] = vm.jsonCuestionario[0].subquestionDataList.subquestionData[i].answerDataList.answerList[0];
                } 
                return true;
            }else{
                return false;
            }
        }

               function tieneInput(){
                    var _input = [];
                        for(var i = 0 ;  i< vm.asegurados.length;  i++){
                        _input[i] ="";
                   }
    
                return _input;
            }
                    
                   
                 
             


        //  }

        vm.limpiarFirmaAgente = limpiarFirmaAgente;
        function limpiarFirmaAgente() {
            
            vm.ctxAgente.clearRect(0, 0, vm.canvasAgente.width, vm.canvasAgente.height);
            vm.lineasAgente = [];
            vm.correccionXAgente = 0;
            vm.correccionYAgente = 0;
            vm.pintarLineaAgente = false;
            vm.firmaDibujadaServicioAgente = false;
        }

        vm.limpiarFirmaTitular = limpiarFirmaTitular;
        function limpiarFirmaTitular() {
            
            vm.ctxTitular.clearRect(0, 0, vm.canvasTitular.width, vm.canvasTitular.height);
            vm.lineasTitular = [];
            vm.correccionXTitular = 0;
            vm.correccionYTitular = 0;
            vm.pintarLineaTitular = false;
            vm.firmaDibujadaServicioTitular = false;
        }
        

        vm.cargaDocumento = cargaDocumento;
        function cargaDocumento() {

            var params = {
                language: 'SPA',
                usuario: vm.emitContratante.nombres,
                nombreUsuario: vm.emitContratante.nombres,
                apellidoUsuario: vm.emitContratante.primerApellido,
                fecNacimiento: moment(vm.emitContratante.fechaNacimiento).format("DD/MM/YYYY"),
                nacionalidad: 'MEXICANA',
                rfc: vm.emitContratante.rfc,
                nombre: vm.fileName,
                contenido: vm.fileB64
            };

            insuranceMedicalEmission.setMedicalExpenseDocsRegistration(params).then(function (response) {

                if (response.success) {
                    console.log("setMedicalExpenseDocsRegistration correcto");
                }
                
            }).catch(function (error) {
                console.log("error carga de documento: ", error);
            });
        }
        
    vm.getCatalagoOcupaciones = getCatalagoOcupaciones;
        function getCatalagoOcupaciones() {
             var _listaObtenida = [];
            insuranceMedicalSrv.getCatalogExpenseJob().then(function (response) {
                
                if (response.success) {
                     angular.forEach(response.info, function (value) {
                          _listaObtenida.push({
                              id: value.jobID,
                              text: value.jobDescription
                          });
                     });
                 }
                 vm.listaCatalagoOcupaciones = _listaObtenida;
            });
            return _listaObtenida;
        }

        

        vm.getCatalagoDeportes = getCatalagoDeportes;
        function getCatalagoDeportes() {
             var _listaObtenida = [];
            insuranceMedicalSrv.getCatalogExpenseSports().then(function (response) {
                
                
                if (response.success) {
                    _listaObtenida.push({
                        id: "1",
                        text: "NINGUNO"
                    });
                     angular.forEach(response.info, function (value) {
                          _listaObtenida.push({
                              id: value.sportID,
                              text: value.sport
                          });
                     });
                 }
                // vm.listaCatalogoDeportes = _listaObtenida;
            });
            return _listaObtenida;
        }

        vm.getCatalogoNumAsegurados = getCatalogoNumAsegurados;
        function getCatalogoNumAsegurados() {
             var _listaObtenida = [];
            insuranceMedicalSrv.getCatalogPolicyNumber().then(function (response) {
                
                if (response.success) {
                     angular.forEach(response.info, function (value) {
                          _listaObtenida.push({
                              id: value.policyHolderID,
                              text: value.policyHolderDescription
                          });
                     });
                 }
            });
            return _listaObtenida;
        }

        vm.validaMuniciEmission = validaMuniciEmission;
        function validaMuniciEmission() {
            if(vm.emitContratante.municipio){
                vm.validaMunEmission =  false;
            }else{
                vm.validaMunEmission =  true;
            }  
        }

        vm.validaMunici = validaMunici;
        function validaMunici() {
            if(vm.cmd.municipio){
                vm.validaMun =  false;
            }else{
                vm.validaMun =  true;
            }  
        }




        vm.getCatalogoMedicalEntidadesEmision = getCatalogoMedicalEntidadesEmision;
        function getCatalogoMedicalEntidadesEmision() {
            var _listaObtenida = [];
            insuranceMedicalSrv.getCatalogMedicalState().then(function (response) {

                if (response.success) {
                    angular.forEach(response.info, function (value) {
                        _listaObtenida.push({
                            id: value.stateID,
                            text: value.stateDescription
                        });
                    });
                }
            });
            vm.entidadesEmision = _listaObtenida;
            return vm.entidadesEmision;
        }

        vm.getCatalogoMedicalEntidades = getCatalogoMedicalEntidades;
        function getCatalogoMedicalEntidades() {
            var _listaObtenida = [];
            insuranceMedicalSrv.getCatalogMedicalState().then(function (response) {

                if (response.success) {
                    angular.forEach(response.info, function (value) {
                        _listaObtenida.push({
                            id: value.stateID,
                            text: value.stateDescription
                        });
                    });
                }
            });
            return _listaObtenida;
        }
        vm.selectRadio = selectRadio;
        function selectRadio(lastValue, newValue, indexAsegurado, indexSub, indexPreg, indexResp){
            
            if(indexSub !== null && indexSub !== ''){
                vm.jsonCuestionario[indexPreg].answerDataList.answerSelected[indexAsegurado] = vm.jsonCuestionario[indexPreg].answerDataList.answerList[indexResp] ;
            }else{
                vm.jsonCuestionario[indexPreg].subquestionDataList.subquestionData[indexSub].answerDataList.answerSelected[indexAsegurado] = vm.jsonCuestionario[indexPreg].subquestionDataList.subquestionData[indexSub].answerDataList.answerList[indexResp];
            }
        }
        
        vm.onChangeNumAsegurados = onChangeNumAsegurados;
        function onChangeNumAsegurados(lastValue, newValue) {
            vm.showCollapseDatosCliente = true;
            vm.collapseInClassDatosCliente = true;

            if (parseInt(newValue.text) < vm.dependientes.length) {
                CommonModalsSrv.error("El número de dependientes registrados es mayor al número de asegurados seleccionados. Favor de actualizar los dependientes registrados.");
            }
        }

        vm.onChangeListEntityEmission = onChangeListEntityEmission;
        function onChangeListEntityEmission(newValue) {
            var _listaObtenida = [];
            insuranceMedicalSrv.getCatalogMedicalLocation(newValue.id).then(function (response) {

                if (response.success) {
                    angular.forEach(response.info, function (value) {
                        _listaObtenida.push({
                            id: value.locationID,
                            text: value.locationDescription
                        });
                    });
                }
                if (!vm.emitContratante) {
                    vm.emitContratante = {};
                }
                vm.emitContratante.municipio = null;
                vm.ListMedicalLocacionEmission = _listaObtenida;
                validaMuniciEmission();
            });
            return vm.ListMedicalLocacionEmission;
        }


        vm.onChangeListEntity = onChangeListEntity;
        function onChangeListEntity(newValue) {
            var _listaObtenida = [];
            insuranceMedicalSrv.getCatalogMedicalLocation(newValue.id).then(function (response) {

                if (response.success) {
                    angular.forEach(response.info, function (value) {
                        _listaObtenida.push({
                            id: value.locationID,
                            text: value.locationDescription
                        });
                    });
                }
                if (!vm.cmd) {
                    vm.cmd = {};
                }
                vm.cmd.municipio = null;
                vm.ListMedicalLocacion = _listaObtenida;
                validaMunici();
            });
            return vm.ListMedicalLocacion;
        }

        vm.getCatalogoMedicalParentescos = getCatalogoMedicalParentescos;
        function getCatalogoMedicalParentescos() {
             var _listaObtenida = [];
            insuranceMedicalSrv.getMedicalExpenseRelationship().then(function (response) {
                
                if (response.success) {
                     angular.forEach(response.info, function (value) {
                          _listaObtenida.push({
                              id: value.expenseRelationshipID,
                              text: value.expenseRelationshipDescription
                          });
                     });
                     
                     vm.dataParentescoList = {};
                     vm.dataParentescoList.type = _listaObtenida[0];
                 }
            });
            return _listaObtenida;
        }

        vm.getCatalogoMedicalProfesiones = getCatalogoMedicalProfesiones;
        function getCatalogoMedicalProfesiones() {
             var _listaObtenida = [];
            insuranceMedicalSrv.getCatalogExpenseProfessions().then(function (response) {
                
                if (response.success) {
                     angular.forEach(response.info, function (value) {
                          _listaObtenida.push({
                              id: value.professionID,
                              text: value.profession
                          });
                     });
                 }
            });
            return _listaObtenida;
        }

        // 4 servicios coaseguro, Tope coaseguro, deducible, deducible red
            
        vm.getCatalogoMedicalDeducible = getCatalogoMedicalDeducible;
        function getCatalogoMedicalDeducible(newValue) {
             var _listaObtenida = [];
            insuranceMedicalSrv.getMedicalExpenseDeductible(newValue).then(function (response) {
                
                if (response.success) {
                     angular.forEach(response.info, function (value) {
                           _listaObtenida.push({
                               id: value.deductibleID,
                               text: value.deductibleDescription
                           });
                     });
                     vm.listaDeduciblePad = _listaObtenida;
                     vm.grupos[0].coberturas[0].intervalos.deduciblePad.listIntervalo = vm.listaDeduciblePad;
                 }
            });
        }

        vm.getCatalogoMedicalCoaseguro = getCatalogoMedicalCoaseguro;
        function getCatalogoMedicalCoaseguro(newValue) {
             var _listaObtenida = [];
            insuranceMedicalSrv.getMedicalExpenseCoinsurance(newValue).then(function (response) {
                
                if (response.success) {
                     angular.forEach(response.info, function (value) {
                           _listaObtenida.push({
                               id: value.coinsuranceID,
                               text: value.coinsuranceDescription
                           });
                     });
                     vm.listaCoaseguro = _listaObtenida;
                     vm.grupos[0].coberturas[0].intervalos.coaseguro.listIntervalo = vm.listaCoaseguro;
                 }
            });
        }

        vm.getCatalogoMedicalDeducibleRed = getCatalogoMedicalDeducibleRed;
        function getCatalogoMedicalDeducibleRed(newValue) {
             var _listaObtenida = [];
            insuranceMedicalSrv.getMedicalExpenseDeductibleRed(newValue).then(function (response) {
                
                if (response.success) {
                     angular.forEach(response.info, function (value) {
                           _listaObtenida.push({
                               id: value.deductibleRedID,
                               text: value.deductibleRedDescription
                           });
                     });
                     vm.listaDeducibleRed = _listaObtenida;
                     if(vm.grupos.length === 5){
                        vm.grupos[1].coberturas[4].intervalos.sa.listIntervalo = vm.listaDeducibleRed;
                     }else{
                         vm.grupos[5].coberturas[4].intervalos.sa.listIntervalo = vm.listaDeducibleRed;
                     }
                 }
            });
        }

        vm.getCatalogoMedicalTopeCoaseguro = getCatalogoMedicalTopeCoaseguro;
        function getCatalogoMedicalTopeCoaseguro(newValue) {
             var _listaObtenida = [];
            insuranceMedicalSrv.getMedicalExpenseMaxCoinsurance(newValue).then(function (response) {
                
                if (response.success) {
                     angular.forEach(response.info, function (value) {
                           _listaObtenida.push({
                               id: value.maxCoinsuranceID,
                               text: value.maxCoinsuranceDescription
                           });
                     });
                     vm.listaTopeCoaseguro = _listaObtenida;
                     vm.grupos[0].coberturas[0].intervalos.topecoaseguro.listIntervalo = vm.listaTopeCoaseguro;
                 }
            });
        }
        
        
        vm.getMedicalNacionalidad = getMedicalNacionalidad;
        function getMedicalNacionalidad(){
            
            var _listaObtenida = [];
            
            var _params = {
                language: 'SPA'
            };

            insuranceMedicalSrv.getInsuranceCountryQuery(_params).then(function (response) {

                if (response.success) {
                    angular.forEach(response.info, function (value) {
                        _listaObtenida.push({
                            id: value.countryISO,
                            text: value.country
                        });
                    });
                }
            });

            return _listaObtenida;
        }
        
        vm.asignaNacionalidadDefault = asignaNacionalidadDefault;
        function asignaNacionalidadDefault() {
            
            if (!vm.emitContratante) {
                vm.emitContratante = {};
            }
            vm.emitContratante.paisNacimiento = {
                type: {
                    id: "MEX",
                    text: "MEXICO"
                }
            };

            vm.emitContratante.nacionalidad = {
                type: {
                    id: "MEX",
                    text: "MEXICO"
                }
            };

            for (var i = 0; i < vm.emitDependientes.length; i++) {

                if (!vm.comboDependientes[i]) {
                    vm.comboDependientes[i] = {};
                }

                vm.comboDependientes[i].pais = {
                    id: "MEX",
                    text: "MEXICO"
                };
                
                vm.comboDependientes[i].nacionalidad = {
                    id: "MEX",
                    text: "MEXICO"
                };
                
                vm.emitDependientes[i].nacionality = "MEX";
                vm.emitDependientes[i].countryISO = "MEX";
            }
        }
        
        vm.getCatalogoGiroMercantil = getCatalogoGiroMercantil;
        function getCatalogoGiroMercantil() {
            var _listaObtenida = [];
            insuranceMedicalSrv.getInsuranceBusinessActivityQuery().then(function (response) {

                if (response.success) {
                    angular.forEach(response.info, function (value) {
                        _listaObtenida.push({
                            id: value.businessID,
                            text: value.businessName
                        });
                    });
                }
            });
            return _listaObtenida;
        }
        
        
        vm.getCatalogoIdentificacion = getCatalogoIdentificacion;
        function getCatalogoIdentificacion() {
             var _listaObtenida = [];
            insuranceMedicalSrv.getInsuranceIdentificationTypeQuery().then(function (response) {

                if (response.success) {
                     angular.forEach(response.info, function (value) {
                             _listaObtenida.push({
                              id: value.identificationTypeID,
                              text: value.identificationType
                          });
                     });
                }
            });
             return _listaObtenida;
        }

        //SETVICIO DE FIRMAS 

        vm.servicioEnvioDeFirmas = servicioEnvioDeFirmas;
        function servicioEnvioDeFirmas() {
            var _paramsFirmas ={
                 language : "SPA",
                 usuario : vm.emitContratante.nombres,
                 nombreUsuario : vm.emitContratante.nombres,
                 apellidoUsuario : vm.emitContratante.primerApellido,
                 fecNacimiento : moment(vm.emitContratante.fechaNacimiento).format("DD/MM/YYYY"),
                 nacionalidad :"MEXICANA" ,
                 rfc : vm.emitContratante.rfc ,
                 nomArchivo :"FIRMA" + vm.emission.policyNumber + ".jpg",
                 base64: vm.firmasEnBase64
             };
            insuranceMedicalEmission.servicioFirmas(_paramsFirmas).then(function (response) {
                if (response.success) {
                    
                }
            });
        }

        //Guardar Selección

        vm.guardarSeleccion = guardarSeleccion;
        function guardarSeleccion(codigoPaquete,metodoPago,numeroCotizacion) {
            var _paramsGuardaSeleccion = {
                language : 'SPA',
                quotationNumber :numeroCotizacion,
                packageCode : codigoPaquete,
                paymentMethod : metodoPago
            };
            insuranceMedicalEmission.saveSelection(_paramsGuardaSeleccion).then(function (response) {
                if (response.success) {
                }
            });
        }

        //Actualizar Solicitud

        vm.actualizarSolicitud = actualizarSolicitud;
        function actualizarSolicitud(nombrePaquete,paqueteCodigo,numeroDeCotizacion) {
            var _paramsActualizarSolicitud ={
                language : 'SPA',
                quotationNumber : numeroDeCotizacion,
                _package : nombrePaquete,
                packageCode : paqueteCodigo
            };
            insuranceMedicalEmission.updateRequest(_paramsActualizarSolicitud).then(function (response) {
                if (response.success) {
                }
            });
        }

        //SERVICIO DE EMISION

        vm.getJsonEmision = getJsonEmision;  
        function getJsonEmision() {
            console.log("comienza a emitir");
            vm.clientData={ 
                name : vm.emitContratante.nombres, 
                lastName : vm.emitContratante.primerApellido, 
                secondLastName : vm.emitContratante.segundoApellido, 
                birthDate : moment(vm.emitContratante.fechaNacimiento, 'DD/MM/YYYY').format('YYYY-MM-DD'), 
                age : vm.emitContratante.edad ? vm.emitContratante.edad : "" , 
                gender : vm.emitContratante.sexContract === "masculino" ? "1" : "0", 
                curp : vm.emitContratante.curp ? vm.emitContratante.curp.toUpperCase() : "", 
                fiscalIDNumber : vm.emitContratante.rfc, 
                renewalNumber : "0", 
                imcAttemps : "0", 
                countryISO : vm.emitContratante.paisNacimiento ? vm.emitContratante.paisNacimiento.type.id : "", 
                nacionality : vm.emitContratante.nacionalidad.type.id,
                professionID : vm.emitContratante.profesion ? vm.emitContratante.profesion.type.id : ""
            };
    
            vm.notificationMeansData={
                email : vm.emitContratante.email ? vm.emitContratante.email : "", 
                cellPhone : vm.emitContratante.celular ? vm.emitContratante.celular : "" , 
                phoneNumber : vm.emitContratante.telefono ? vm.emitContratante.telefono : ""
            };
    
            vm.addressData={
                street: vm.emitContratante.calle, 
                outdoorNumber: vm.emitContratante.numeroExterior, 
                interiorNumber: vm.emitContratante.numeroInterior ? vm.emitContratante.numeroInterior : "", 
                postalCode: vm.emitContratante.codigoPostal, 
                federalEntityID: vm.emitContratante.estado.id, 
                delegationMunicipalityID: vm.emitContratante.municipio.id, 
                neighborhood: vm.emitContratante.colonia
            };
    
                //  vm.dependentDataList = [{
                //      riskNumber : "1", 
                //      name : "LUIS", 
                //      lastName : "CASTANEDA", 
                //      secondLastName : "MEDINA", 
                //      birthDate : "1970-05-06", 
                //      age : "49", 
                //      genderDesc : "Masculino",
                //      gender : "1", 
                //      jobDescription : "-", 
                //      sport : "-", 
                //      relationshipID : "1", 
                //      relationship : "TITULAR", 
                //      fiscalIDNumber : "TETS7005065E4", 
                //      renewalNumber : "0", 
                //      weight : "60", 
                //      height : "1.60", 
                //      imc : "23.44", 
                //      imcAttemps : "0", 
                //      countryISO : "MEX", 
                //      nacionality : "MEX", 
                //      businessID : "0", 
                //      handlesMachineryFlag :"0", //vm.emitTitular.tipoMaquinaria ? "1" : 
                //      excludedFlag : "0", 
                //      professionID : ""
                //      }]

                    var paramsEmision = {
                        language:'SPA',
                        clientData: JSON.stringify(vm.clientData),
                        notificationMeansData: JSON.stringify(vm.notificationMeansData),
                        addressData: JSON.stringify(vm.addressData),
                        dependentDataList : JSON.stringify(vm.emitDependientes),
                        accidentalDeathFlag:false, 
                        insurancePolicyDate:moment().format('YYYY-MM-DD'), 
                        policyMaturityDate:moment().add(1, 'years').format('YYYY-MM-DD'),
                        quotationNumber:vm.emission.quotationNumber,
                        quotationName:"", 
                        agentCode:$scope.$parent.agentSelected.id, 
                        personType: vm.tipoPersona ="1" ? "F" : "M", 
                        companyName:"",
                        establishmentDate:"1996-08-10",
                        businessID:0,
                        identificationTypeID:vm.emitContratante.tipoIdentificacion.type.id, 
                        numberID:64464654654546,
                        clientNumber : vm.numeroCliente,
                        adviserID : '951753'
                    };
             insuranceMedicalEmission.getMedExpInsurancePolicyRegistration(paramsEmision).then(function (response) {

                if (response.success) {
                    console.log("éxito al emitir", response.info);
                    vm.jsonEmision =  response.info;

                    vm.emission.policyNumber = vm.jsonEmision.policyNumber;
                    if(vm.firmaDibujadaServicioTitular && vm.firmaDibujadaServicioAgente && vm.firmaDibujadaServicioContratante && vm.firmaLabel){
                        dibujarFirmasJuntas();
                    }
                    setAperturaTramite(paramsEmision, response);

                } else {
                    
                    if (response.info.result === 2 && response.info.messages && response.info.messages.length > 0 && response.info.messages[0].responseMessage.includes('LA FECHA DE NACIMIENTO ES DIFERENTE A LA FECHA CONTENIDA EN EL RFC')) {
                        CommonModalsSrv.error("No se ha podido realizar la emisión. La fecha de nacimiento es diferente a la fecha contenida en el RFC.");
                    } else {
                        CommonModalsSrv.error("No se ha podido realizar la emisión. Intente más tarde. Error 1");
                    }
                    vm.emitirDisabled = false;
                }
            }).catch(function (error) {
                console.log("error emision: ", error);
                CommonModalsSrv.error("No se ha podido realizar la emisión. Intente más tarde. Error 2");
                vm.emitirDisabled = false;
            });
        }
        
        // servicio de cuestionario
        vm.getCuestionarioEmision = getCuestionarioEmision;
        function getCuestionarioEmision() {
            insuranceMedicalEmission.getMedExpInsuranceQuestionnaireQuery().then(function (response) {
                if (response.success) {
                        vm.jsonCuestionario = response.info.questionData;
                        angular.forEach(vm.jsonCuestionario, function(res){
                            if(res.freeTextFlag){
                                res.answerDataList.answerInput=tieneInput();
                            }
                            if(res.answerDataList.answerData !== undefined && res.answerDataList.answerData.length !== 0){
                                res.answerDataList.answerList = getRespuestas(res.answerDataList.answerData);
                                angular.forEach(res.answerDataList.answerData, function(resp){
                                    if(res.value === resp.key){
                                        res.answerDataList.answerSelected = getSelecteds(resp);
                                    }
                                });
                            }
                            angular.forEach(res.subquestionDataList.subquestionData, function(ques){
                                if(ques.answerDataList.answerData !== undefined && ques.answerDataList.answerData.length !== 0){
                                    ques.answerDataList.answerList = getRespuestas(ques.answerDataList.answerData);
                                    angular.forEach(ques.answerDataList.answerData, function(subres){
                                        if(ques.value === subres.key){
                                            ques.answerDataList.answerSelected = getSelecteds(subres);
                                        }
                                    });
                                }
                            });

                        });
                     
                        console.log(vm.jsonCuestionario);      
                 }
            });
        }

        function getSelecteds(object){
            var _selected = [];
            for(var i = 0 ;  i< vm.asegurados.length;  i++){
                _selected[i] = {id : object.key, text :  object.value};
            }

            return _selected;
        }

        function getRespuestas(list){
            var _listaObtenida = [];

            if (Array.isArray(list)) {
                angular.forEach(list, function (value) {
                    _listaObtenida.push(
                        {
                            id: value.key,
                            text: value.value
                        }
                    );
                });
                return _listaObtenida;
            
            } else if (list === "") {
                return 0;
            } else {
                angular.forEach(createListObject(list), function (value) {
                    _listaObtenida.push(
                        {
                            id: value.key,
                            text: value.value
                        }
                    );
                });
                return _listaObtenida;
            }
        }
        
        
        vm.registroCuestionario = registroCuestionario;
        function registroCuestionario() {
            
            vm.emitirDisabled = true;
            
            vm.answer = {
                answerDataList: []
            };

            angular.forEach(vm.jsonCuestionario, function (value) {

                var _dependentDataList = [];

                angular.forEach(value.answerDataList.answerSelected, function (v, index) {

                    var dD = {
                        riskNumber: vm.asegurados[index].num_riesgo,
                        answer: v.id
                    };

                    if (value.freeTextFlag) {
                        console.log("value.freeTextFlag ", value.freeTextFlag, value.questionID);
                        if (v.id === '2') {
                            dD.freeText = value.answerDataList.answerInput[index];
                        }
                    }

                    _dependentDataList.push({
                        dependentData: dD
                    });
                });

                if (_dependentDataList.length > 0) {
                    vm.answer.answerDataList.push({
                        answerData: {
                            questionID: value.questionID,
                            dependentDataList: _dependentDataList
                        }
                    });
                }

                if (value.subquestionDataList && value.subquestionDataList.subquestionData && value.subquestionDataList.subquestionData.length > 0) {

                    angular.forEach(value.subquestionDataList.subquestionData, function (sub) {

                        var _dependentDataList = [];
                        if (sub.answerDataList.answerSelected) {
                            angular.forEach(sub.answerDataList.answerSelected, function (subAnsDep, index) {
                                _dependentDataList.push({
                                    dependentData: {
                                        riskNumber: vm.asegurados[index].num_riesgo,
                                        answer: subAnsDep.id
                                    }
                                });
                            });

                            if (_dependentDataList.length > 0) {
                                vm.answer.answerDataList.push({
                                    answerData: {
                                        questionID: sub.questionID,
                                        dependentDataList: _dependentDataList
                                    }
                                });
                            }
                        }
                    });
                }
            });

            console.log("vm.answer, ", vm.answer);
            var params = {
                language: 'SPA',
                quotationNumber: vm.emission.quotationNumber,
                answerDataList: JSON.stringify(vm.answer)
            };

            insuranceMedicalEmission.getMedExpInsuranceQuestRegistration(params).then(function (response) {

                if (response.success) {
                    console.log("éxito al mandar cuestionario 1");
                    validaCuestionario();
                    console.log("éxito al mandar cuestionario 2");
                    
                    
                }
                else{
                    vm.emitirDisabled = false;
                }
            }).catch(function (error) {
                console.log("error registro cuestionario: ", error);
                vm.emitirDisabled = false;
            });
        }
        
        vm.validaCuestionario = validaCuestionario;
        function validaCuestionario() {
            
            var params = {
                language: 'SPA',
                numSolicitud: vm.emission.quotationNumber
            };
            
            insuranceMedicalEmission.getMedExpInsuranceQuestValidation(params).then(function (response) {

                console.log("validar cuestionario", response);
                if (response.success) {
                    console.log("éxito al validar cuestionario", response.info);
                    
                    vm.jsonValidacionC = response.info;

                    var excluido = false;
                    var aseguradosExcluidos = "";

                    angular.forEach(vm.jsonValidacionC, function (asegurado) {
                        if (asegurado.padExcl !== '' || asegurado.padPunt !== '' || asegurado.padRechazo !== '') {
                            excluido = true;
                            aseguradosExcluidos += asegurado.nomRiesgo + ", ";
                        }
                    });

                    if (!excluido) {
                        getJsonEmision();
                    } else {
                        CommonModalsSrv.error("Debido a que no cumple con los parámetros aceptados de suscripción, no es posible asegurar a " + aseguradosExcluidos + " por lo cual se procederá a la cancelación de la cotización.");
                        cancelarCotizacionBD();
                        $state.go('insurance.main');
                    }
                } else {
                    CommonModalsSrv.error("No se ha podido realizar la emisión de la póliza. Inténtelo más tarde.");
                    vm.emitirDisabled = false;
                }
            }).catch(function (error) {
                console.log("error validacion: ", error);
                CommonModalsSrv.error("No es posible realizar la emisión de la póliza en este momento. Inténtelo más tarde.");
                vm.emitirDisabled = false;
            });
        }
        
        vm.setAperturaTramite = setAperturaTramite;
        function setAperturaTramite(paramsEmision, respEmision) {

            var _params = {
                language: 'SPA',
                codSecc: '2', //fijo
                ntSegCAcceso: '99687', //fijo
                wfSisCDocu: '1', //fijo
                codAgente: $scope.$parent.agentSelected.id,
                contratante: '0', //fijo
                complementarios: '0', //fijo
                rfcAsegStr: vm.titular.fiscalIDNumber,
                nomTercero: vm.titular.name,
                apePaterno: vm.titular.lastName,
                apeMaterno: vm.titular.secondLastName,
                domicilio: vm.emitContratante.calle + " " + vm.emitContratante.numeroExterior + " " + vm.emitContratante.numeroInterior,
                codPostal: vm.emitContratante.codigoPostal,
                colonia: vm.emitContratante.colonia,
                fechaNacimiento: moment(vm.titular.birthDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
                pTipoPersona: 'F', // persona Fisica (Asegurado Titular)
                pNacionalidad: vm.emitContratante.nacionalidad.type.id,
                fecIniVig: moment().format('DD-MM-YYYY'),
                fecFinVig: moment().add(1, 'years').format('DD-MM-YYYY'),
                productoAeInt: '34', //fijo
                planAeInt: '3401', //fijo
                codRamo: '288', //fijo
                contrato: '28801', //fijo
                observaciones: 'SE EMITE LA PÓLIZA: ' + vm.emission.policyNumber + ' FAVOR DE LIBERAR EN CASO DE QUE LA INFORMACIÓN SEA CORRECTA, SALUDOS Y GRACIAS.',
                numPoliza: vm.emission.policyNumber,
                movimientoPoli: '0'
            };

            insuranceMedicalEmission.setMedicalExpenseProcessingRequest(_params).then(function (response) {

                if (response.success) {
                    console.log("apertura correcta ", response);

                    vm.emission.numeroTramite = response.info.wfOtMOt;

                    actualizarCotizacionBD(paramsEmision, respEmision);
                } else {
                    CommonModalsSrv.error("No se ha podido realizar la apertura del trámite. Inténtelo más tarde. Error 1");
                    vm.emitirDisabled = false;
                }
            }).catch(function (error) {
                console.log("error tramite: ", error);
                CommonModalsSrv.error("No se ha podido realizar la apertura del trámite. Inténtelo más tarde. Error 2");
                vm.emitirDisabled = false;
            });
        }

        

       
            
            
        // vm.dependentDataList = [
        //     {
        //       riskNumber: 1,
        //       relationshipID: 1,
        //       relationship: "TITULAR",
        //       name: "ABRAHAM",
        //       lastName: "GUERRERO",
        //       secondLastName: "FLORES",
        //       gender: 1,
        //       genderDesc: "MASCULINO",
        //       jobID: 2,
        //       jobDescription: "ABODADO",
        //       birthDate: "2019-07-08",
        //       age: 37,
        //       fiscalIDNumber: "GUFA820331C49",
        //       curp: "",
        //       sportID: 0,
        //       sport: ""
        //     }
        // ];

        vm.createCoverageDataList = createCoverageDataList;
        function createCoverageDataList() {

            vm.coverageDataList = [];

            angular.forEach(vm.grupos, function (grup) {

                angular.forEach(grup.coberturas, function (cob) {

                    var insuredSumSelected = "1";
                    if (cob.intervalos.sa) {
                        insuredSumSelected = cob.intervalos.sa.intervaloSelected.id;
                    }

                    var packageList = [];
                    angular.forEach(cob.paquetes, function (paq) {

                        var flagPaquete = false;
                        if ((paq.mca_opc === "S" && paq.mod_chk === "1") || paq.mca_opc === "N") {
                            flagPaquete = true;
                        }

                        packageList.push({
                            packageCode: parseInt(paq.cod_paquete),
                            contractedPackageFlag: flagPaquete
                        });
                    });

                    vm.coverageDataList.push({
                        coverageCode: parseInt(cob.cod_cob),
                        insuredSum: parseInt(insuredSumSelected),
                        packageDataList: packageList
                    });
                });
            });
        }

          vm.datosVarCob = {
            codDeducible2800: "1",
            codPlanDental2824: "1",
            codPlanVision2825: "1",
            codRedHosp2800: "1",
            codTabulador2800: "1",
            codZonaInt: "",
            codZonaInt2821: "",
            fecAntigMat: "",
            impDeducible2800: "15000",
            impDeducible2821: "",
            impDeducible2823: "2000",
            impGtosRecienNac: "",
            numDiasCar2848: "0",
            numDiasCar2850: "0",
            pctCoaseguro2800: "10",
            pctCoaseguro2821: "0",
            pctCoaseguro2823: "10",
            pctTopeCoaseguro2800: "1",
            pctTopeCoaseguro2823: "6",
            sumaAseg2800: "40000000",
            sumaAseg2821: "25000",
            sumaAseg2823: "1000000",
            sumaAseg2826: "",
            sumaAseg2827: "",
            sumaAseg2830: "4000",
            sumaAseg2839: "10000",
            sumaAseg2840: "10000",
            sumaAseg2841: "",
            sumaAseg2842: "10000",
            sumaAseg2843: "",
            sumaAseg2844: "10000",
            sumaAseg2845: "",
            sumaAseg2846: "50000",
            sumaAseg2847: "50000",
            sumaAseg2849: "",
            sumaAseg2851: "",
            sumaAseg2852: "",
            sumaAseg2853: "",
            sumaAsegCar2848: "250",
            sumaAsegCar2850: "250"
          };

          

          

        //SERVICIO DE RECOTIZACIÓN

        vm.getJsonRecotizacion = getJsonRecotizacion;
        function getJsonRecotizacion() {
            
            createCoverageDataList();

            var paramsRecotizacion = {
                language : 'SPA',
                dependentDataList: JSON.stringify(vm.dependientes),
                coverageDataList: JSON.stringify(vm.coverageDataList),
                datosVarCob: JSON.stringify(vm.jsonCotizacion.ofertaComercial.datosVarCob),
                quotationNumber: vm.jsonCotizacion.quotationNumber,
                insurancePolicyDate: moment().format('YYYY-MM-DD'),
                policyMaturityDate: moment().add(1, 'years').format('YYYY-MM-DD'),
                customizeInsuranceQuotationFlag: 0,
                businessPackage: 'N',
                insuredPersonsQuantity: vm.dependientes.length,
                _package: vm.paquetes[vm.indexPaquete].nom_paquete,
                discountCode: '',
                discountCampaignID: '',
                discountCampaignValue: 0,
                commissionCessionFlag: 0,
                federalEntityID: vm.cmd.estado.id,
                federalEntity: vm.cmd.estado.text,
                delegationMunicipalityID: vm.cmd.municipio.id,
                delegationOrMunicipality: vm.cmd.municipio.text,
                agentCode: $scope.$parent.agentSelected.id
            };

            insuranceMedicalSrv.getMedicalExpenseInsuranceRequotation(paramsRecotizacion).then(function (response) {

                if (response.success) {
                    
                    vm.jsonRecotizacion = response.info;
                    vm.formasPago = getFormasPago(vm.jsonRecotizacion.ofertaComercial.formasPago.formaPago);
                    vm.oferta = vm.jsonRecotizacion.ofertaComercial.asegurados.asegurado;
                    getResumenCotizacion(vm.oferta);
                    vm.emailDisabled = false;
                    vm.recotizacionDisabled = true;
                }
                else{
                    vm.recotizacionDisabled = false;
                    CommonModalsSrv.error("El servicio de recotización  no está disponible por el momento.");
                }
            
            });
        }


        
        vm.guardarCotizacionBD = guardarCotizacionBD;
        function guardarCotizacionBD(){
            
            vm.titular = {};

            angular.forEach(vm.dependientes, function (val) {
                if (val.relationship === "TITULAR") {
                    vm.titular = val;
                }
            });

            var typePeople = vm.tipoPersona;

            if(vm.tipoPersona === '1' || vm.tipoPersona === 'F'){
                typePeople = '1';
            }else{
                typePeople = '2';
            }

            var _params = {
                language: 'SPA',
                idCliente: vm.numeroCliente,
                idCotizacion: vm.jsonCotizacion.quotationNumber,
                idPoliza: 0,
                fechaCotizacion: moment(new Date()).format('YYYY-MM-DD'),
                vigenciaCotizacion: moment(new Date(), 'YYYY-MM-DD').add(15, 'days').format('YYYY-MM-DD'),
                monto: 0,
                tipoCliente: typePeople,
                isCliente: vm.numeroCliente === "9999" ? '0' : '1',
                nombreCliente: typePeople === '1' ? vm.datosCliente ? vm.datosCliente.name : vm.titular.name.toUpperCase() : vm.datosCliente ? vm.datosCliente.companyName.toUpperCase() : vm.titular.name.toUpperCase(),
                apellidoPaternoCliente: typePeople === '1' ? vm.datosCliente ? vm.datosCliente.lastName : vm.titular.lastName.toUpperCase() : vm.datosCliente ? "" : vm.titular.lastName.toUpperCase(),
                apellidoMaternoCliente: typePeople === '1' ? vm.datosCliente ? vm.datosCliente.secondLastName : vm.titular.secondLastName.toUpperCase() : vm.datosCliente ? "" : vm.titular.secondLastName.toUpperCase(),
                fechaNacimiento: vm.datosCliente ? moment(vm.fechaNacimiento, 'DD/MM/YYYY').format('YYYY-MM-DD') : vm.titular.birthDate,
                rfcCliente: vm.datosCliente ? vm.datosCliente.fiscalIDNumber : vm.titular.fiscalIDNumber,
                sexoCliente: vm.datosCliente ? '1' : vm.titular.gender === 1 ? '1' : '2',
                mailCliente: vm.datosCliente ? vm.email : "email@email.com",
                telefonoCliente: vm.datosCliente ? vm.telefono : "5555555555",
                quotationJsonInit: {},
                quotationJsonEnd: {},
                productKey: 'PMM'
            };
            
            
            insuranceHousesSrv.getCotizationAdd(_params).then(function (_res) {
                if (_res.success) {
                    
                    vm.steps.recotizacion = true;
                    vm.collapseInClassDatosRiesgo = false;
                    vm.collapseInClassRequotationDetail = true;
                    
                    vm.recotizacionDisabled = true;
                    vm.emailDisabled = false;
                    
                    CommonModalsSrv.done("Envío de Cotización exitosa Número de Cotización: " + vm.jsonCotizacion.quotationNumber);
                    
                } else {
                    CommonModalsSrv.error("Envío de Cotización no fue exitoso.");
                }
                vm.cotizarDisabled = false;
            }).catch(function () {
                vm.cotizarDisabled = false;
            });
        }
        
        vm.actualizarCotizacionBD = actualizarCotizacionBD;
        function actualizarCotizacionBD() {

            var _data = {
                language: 'SPA',
                idCotizacion: vm.emission.quotationNumber,
                idPoliza: vm.emission.policyNumber,
                quotationJsonInit: {},
                quotationJsonEnd: {},
                numberAuthorizer: vm.emission.numeroTramite
            };

            insuranceMedicalEmission.procedureQuotation(_data).then(function (response) {

                if (response.success) {
                    CommonModalsSrv.done("Proceso Exitoso. Número de trámite asignado: " + vm.emission.numeroTramite);

                    vm.steps.emision = false;
                    vm.steps.entrega = true;
                } else {
                    CommonModalsSrv.error("El servicio de emisión no está disponible por el momento. Error 1");
                }
                vm.emitirDisabled = false;
            }).catch(function (error) {
                console.log("error actualizar: ", error);
                CommonModalsSrv.error("El servicio de emisión no está disponible por el momento. Error 2");
                vm.emitirDisabled = false;
            });

        }
        
        vm.cancelarCotizacionBD = cancelarCotizacionBD;
        function cancelarCotizacionBD() {

            var _data = {
                language: 'SPA',
                idCotizacion: vm.emission.quotationNumber,
                idPoliza: vm.emission.quotationNumber,
                quotationJsonInit: {},
                quotationJsonEnd: {},
                numberAuthorizer: '0'
            };

            // procedureJson
            insuranceMedicalEmission.cancelQuotation(_data).then(function (response) {

                if (response.success) {
                    console.log("cancelacion exitosa");
                }
                else{
                    console.log("cancelacion no exitosa 1");
                }

            }).catch(function () {
                console.log("cancelacion no exitosa 2");
            });
        }

        /*
        *
        * PANTALLA DE COTIZACIONES VIGENTES
        *
        * */

        function getAvailableQuotation() {

            var _clientData = model;

            var _params = {
                language: 'SPA',
                estado: 'VIGENTE',
                idCliente: _clientData.numeroCliente,
                productKey: 'PMM'
            };

            insuranceHousesSrv.getListQuotations(_params).then(function (list) {
                if (list.info !== "not-found" && list.info.length > 0) {
                    vm.steps.search = true;
                    angular.forEach(list.info, function (item, key) {
                        list.info[key].fechaCotizacion = moment(new Date(item.fechaCotizacion)).format('DD/MM/YYYY');
                        list.info[key].vigenciaCotizacion = moment(new Date(item.vigenciaCotizacion)).format('DD/MM/YYYY');
                        if(!item.apellidoPaternoCliente){
                            item.apellidoPaternoCliente = "";
                        }
                        if(!item.apellidoMaternoCliente){
                            item.apellidoMaternoCliente = "";
                        }
                        list.info[key].nombreCompleto = item.nombreCliente + " " + item.apellidoPaternoCliente + " " + item.apellidoMaternoCliente;
                    });
                    vm.responseAvailableQuotation = list.info;
                } else {
                    goDatosRiesgo();
                }

            });

        }

        vm.emitFromQuotation = function emitFromQuotation( q ) {
            localStorage.setItem('__quotation', JSON.stringify(q));
            vm.steps.search = false;
            vm.steps.cotizacion = false;
            vm.steps.recotizacion = false;
            vm.steps.emision = true;
            vm.trianguloAzul = "trianguloBlanco";
            vm.trianguloBorde = "triangulo";
            vm.pestCotiza = false;
            vm.pestEmision = true;
            getCatalogoMedicalEntidadesEmision();
            //Si el flujo se pasa directo desde la lista de cotizacion es false
            vm.flujoCompleto = false;
            
            datosEmision(q.idCotizacion);
            getJsonDetalleCotizacion(q.idCotizacion);
        };
        
        function datosEmision(idCotizacion){
            vm.emission.quotationNumber = idCotizacion;
        }


        vm.validaRfcContratanteAsegurados = validaRfcContratanteAsegurados;
        function validaRfcContratanteAsegurados() {
            
            var i;
            if (vm.dependientes.length > 0) {
                for (i = 0; i < vm.dependientes.length; i++) {
                    if ((vm.emitContratante.rfc === vm.dependientes[i].fiscalIDNumber) && (vm.emitContratante.sexContract.toLowerCase() !== vm.dependientes[i].genderDesc.toLowerCase())) {
                        CommonModalsSrv.error("El sexo del contratante no es igual al del asegurado " + vm.dependientes[i].relationship);
                        return true;
                    }

                }
            } else if((vm.dependientes.length === 0)) {
                for (i = 0; i < vm.emitDependientes.length; i++) {
                    if ((vm.emitContratante.rfc === vm.emitDependientes[i].fiscalIDNumber) && (vm.emitContratante.sexContract.toLowerCase() !== vm.emitDependientes[i].genderDesc.toLowerCase())) {
                        CommonModalsSrv.error("El sexo del contratante no es igual al del asegurado " + vm.emitDependientes[i].relationship);
                        return true;
                    }

                }

            }else{

            }
        }

        vm.validaRfcAseguradoContratante = validaRfcAseguradoContratante;
        function validaRfcAseguradoContratante() {
            
            var i;
            if (vm.dependientes.length > 0) {
                for (i = 0; i < vm.dependientes.length; i++) {
                    if ((vm.emitDependientes[i].fiscalIDNumber === vm.emitContratante.rfc) && (vm.emitDependientes[i].genderDesc.toLowerCase() !== vm.emitContratante.sexContract.toLowerCase())) {
                        CommonModalsSrv.error("El sexo del asegurado " + vm.emitDependientes[i].relationship + " no es igual al del contratante");
                        return true;
                    }

                }
            } else if((vm.dependientes.length === 0))  {
                for (i = 0; i < vm.emitDependientes.length; i++) {
                    if ((vm.emitDependientes[i].fiscalIDNumber === vm.emitContratante.rfc) && (vm.emitDependientes[i].genderDesc.toLowerCase() !== vm.emitContratante.sexContract.toLowerCase())) {
                        CommonModalsSrv.error("El sexo del asegurado " + vm.emitDependientes[i].relationship + " no es igual al del contratante");
                        return true;
                    }

                }
            }else{

            }
        }
        

        //FUNCIÓN PARA CALCULAR IMC
        vm.calcularImc = calcularImc;
        function calcularImc(index) {
            if (vm.emitDependientes[index].weight && vm.emitDependientes[index].height) {
                vm.Imc[index] = vm.emitDependientes[index].weight / Math.pow(vm.emitDependientes[index].height, 2);
                if (vm.Imc[index] >= 35) {
                    CommonModalsSrv.error("Índice de masa corporal. No es posible asegurar, debido a que no cumple con los parámetros aceptados de peso y estatura");
                    vm.emitDependientes[index].weight = undefined;
                    vm.emitDependientes[index].height = undefined;
                }
            }
            vm.emitDependientes[index].imc = vm.Imc[index];
        }
        
        vm.validaContratante = validaContratante;
        function validaContratante() {
            var invalid = angular.element(document.getElementById("collapseDatosdelContratante")).scope().formEmitContractor.$invalid;
            return (!invalid && !revisaCombosContratante());
        }

        vm.validaDependiente = validaDependiente;
        function validaDependiente(ind) {
            var invalid = angular.element(document.getElementById('accordion_' + ind)).scope()['formEmitDependent_' + ind].$invalid;
            return (!invalid && !revisaCombosDependientes(ind + 1));
        }
        
        vm.validaSiDependiente = validaSiDependiente;
        function validaSiDependiente(index) {

            var invalid = false;
            var relation = "";
            validaRfcContratanteAsegurados();

            if (index === 0) {
                invalid = angular.element(document.getElementById("collapseDatosdelContratante")).scope().formEmitContractor.$invalid;
                relation = "Contratante";
            } else {
                var ind = index - 1;
                invalid = angular.element(document.getElementById('accordion_' + ind)).scope()['formEmitDependent_' + ind].$invalid;
                relation = vm.emitDependientes[ind].relationship;
            }
            
            var id = "collapseDatos_" + index;
            if (invalid || revisaCombosDependientes(index) || validaRfcContratanteAsegurados()) {
                $('#' + id).on('show.bs.collapse', function (e) {
                    e.preventDefault();
                });
                vm.colapseEmision2[index] = false;
                CommonModalsSrv.error("Es necesario completar los datos requeridos de la sección \"Datos de " + relation + "\"");
                return false;
            } else {
                if(vm.emitDependientes[index].age >= 18){
                    vm.emitDependientes[index].asteriscoRequerido = "*";
                }else{
                    vm.emitDependientes[index].asteriscoRequerido = "";
                }
                    
                $('#' + id).unbind('show.bs.collapse');
                return true;
            }

        }

        vm.validaSiCuestionario = validaSiCuestionario;
        function validaSiCuestionario() {
            validaRfcAseguradoContratante();
            

            var ind = vm.emitDependientes.length - 1;
            var relation = vm.emitDependientes[ind].relationship;
            var invalid = angular.element(document.getElementById('accordion_' + ind)).scope()['formEmitDependent_' + ind].$invalid;
            
            if (invalid || revisaCombosDependientes(vm.emitDependientes.length) || validaRfcAseguradoContratante() || validaRfcContratanteAsegurados() ) {
                $('#collapseCuestionarioMedico').on('show.bs.collapse', function (e) {
                    e.preventDefault();
                });
                vm.colapseEmision3 = false;
                CommonModalsSrv.error("Es necesario completar los datos requeridos de la sección \"Datos de " + relation + "\"");
                // CommonModalsSrv.done("Envío de Cotización exitosa Número de Cotización: " + vm.jsonCotizacion.quotationNumber);
                return false;
            } else {
                $('#collapseCuestionarioMedico').unbind('show.bs.collapse');
                vm.esValidoFirmar = true;
                return true;
            }
        }

           vm.validaSiFirmaElectronica = validaSiFirmaElectronica;
           function validaSiFirmaElectronica() {

               var invalid = angular.element(document.getElementById("collapseCuestionarioMedico")).scope().formEmitSurvey.$invalid;
               if(invalid){
                   $('#collapseFirmaElectronica').on('show.bs.collapse', function (e) {
                       e.preventDefault();
                   });
                   vm.colapseEmision4 = false;
                   CommonModalsSrv.error("Favor de Completar sus respuestas para continuar");
               }else{

                   $('#collapseFirmaElectronica').on('show.bs.collapse', function (e) {
                       e.preventDefault();
                   });
                   vm.colapseEmision4 = false;
    
                   CommonModalsSrv.warning('Este seguro no cubre ningún padecimiento o enfermedad preexistente, entendiendo como tal, aquella enfermedad, lesión o defecto congénito y/o físico y/o mental que hayan sido diagnosticados o sea aparente a la vista, que se presuma se hayan originado con anterioridad a la fecha de la contratación del seguro. Favor de confirmar que no cuenta con ningún padecimiento preexistente.')
                       .result.then(
                           function ( ) {
    
                               if (vm.esValidoFirmar) {
    
                                   $('#collapseFirmaElectronica').unbind('show.bs.collapse');
                                   vm.colapseEmision4 = true;
                               }
    
                           }
                       ).catch(function () {
                        
    
                   });
               }
      
           }
        
        vm.getValoresEmision = getValoresEmision;
       function getValoresEmision(newValue,nombreCombo,index){
           switch (nombreCombo){
                case 'nacionalidad':
                    vm.emitDependientes[index].nacionality = newValue.id;
                    break;
                case 'profesion':
                    vm.emitDependientes[index].professionID = newValue.id ? newValue.id : "";
                    break;
                case 'pais':
                    vm.emitDependientes[index].countryISO = newValue.id ? newValue.id : "";
                    break;
                case 'giro':
                    vm.emitDependientes[index].businessID = newValue.id;
                    break;
           }

       }

        vm.createEmisionDependientes = createEmisionDependientes;
        function createEmisionDependientes() {
            
            vm.emitDependientes = [];
            angular.forEach(vm.dependientes, function (v) {

                vm.emitDependientes.push({
                    age: v.age !== undefined ? v.age : "",
                    birthDate: v.birthDate,
                    fiscalIDNumber: v.fiscalIDNumber,
                    gender: v.gender === 1 ? "1" : "0",
                    genderDesc: v.gender === 1 ? "Masculino" : "Femenino",
                    jobDescription: v.jobDescription ? v.jobDescription : "",
                    jobID: v.jobID ? v.jobID : "",
                    lastName: v.lastName,
                    name: v.name,
                    relationship: v.relationship,
                    relationshipID: v.relationshipID,
                    riskNumber: v.riskNumber,
                    secondLastName: v.secondLastName,
                    sport: v.sport ? v.sport : "",
                    sportID: v.sportID ? v.sportID : "",
                    handlesMachineryFlag: "0",
                    renewalNumber : "0",
                    imcAttemps:"0",
                    excludedFlag:"0"
            
                });
            });

        }
        
        vm.createEmisionDependientesFromDetail = createEmisionDependientesFromDetail;
        function createEmisionDependientesFromDetail(){
            
            vm.emitDependientes = [];
            angular.forEach(vm.jsonCotizacion.cotizar.datosVar.dependientes.dependiente, function (v) {
                
                console.log("fecha ", v.fechaNac);
                var fechaN = v.fechaNac.toString();
                if (fechaN.length < 8) {
                    fechaN = '0' + fechaN;
                }
                
                console.log("fecha1 ", fechaN);

                vm.emitDependientes.push({
                    age: v.edad !== undefined ? v.edad : "",
                    birthDate: moment(fechaN, 'DDMMYYYY').format("YYYY-MM-DD"),
                    fiscalIDNumber: v.rfc,
                    gender: v.sexo,
                    genderDesc: v.sexoDesc,
                    jobDescription: v.ocupacionDesc !== undefined && v.ocupacionDesc !== null && v.ocupacionDesc !== 'null' ? v.ocupacionDesc : '',
                    jobID: v.idOcupacion !== undefined && v.idOcupacion !== null && v.idOcupacion !== 'null' ? v.idOcupacion : '',
                    lastName: v.apllPat,
                    name: v.nombre,
                    relationship: v.parentescoDesc,
                    relationshipID: v.idParentesco,
                    riskNumber: v.numRiesgo,
                    secondLastName: v.apllMat,
                    sport: v.deporteDesc !== undefined && v.deporteDesc !== null && v.deporteDesc !== 'null' ? v.deporteDesc : '',
                    sportID: v.idDeporte !== undefined && v.idDeporte !== null && v.idDeporte !== 'null' ? v.idDeporte : '',
                    handlesMachineryFlag: "0",
                    renewalNumber : v.numRenovacion,
                    imcAttemps:"0",
                    excludedFlag:"0"
            
                });
            });

            vm.titular = {};

            angular.forEach(vm.emitDependientes, function (val) {
                if (val.relationship === "TITULAR") {
                    vm.titular = val;
                }
            });
        }
        
        vm.handleFileSelect = handleFileSelect;
        function handleFileSelect(evt) {

            if (evt.target.files.length > 0) {

                console.log("event fileSelector: ", evt);

                var f = evt.target.files[0]; // FileList object
                var reader = new FileReader();
                // Closure to capture the file information.
                reader.onload = (function () {
                    return function (e) {
                        var binaryData = e.target.result;
                        //Converting Binary Data to base 64
                        var base64String = window.btoa(binaryData);
                        //showing file converted to base64
                        vm.fileB64 = base64String;
                    };
                })(f);
                // Read in the image file as a data URL.
                vm.fileName = f.name;
                reader.readAsBinaryString(f);
            }
        }
        
    }
})();
