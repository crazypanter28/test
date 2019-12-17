(function () {
    "use strict";

    function prospectsModalCtrl($injector, $state, $filter, $uibModalInstance, prospectSrv, $scope, userConfig, msg, IDOpportunity, CommonModalsSrv, addProspectSrv ) {
        var vm = this;
        vm.oldValueContract = '';
        var userID = userConfig.user.employeeID; 
        vm.title = msg || 'NUEVA OPORTUNIDAD';

        vm.date =  $filter('date')(new Date(), 'dd/MM/yyyy');
         
        vm.isReactivation = false;
        vm.isNewOpportunity = false;
        vm.readonly =false;

        vm.opportunity;
        
        

        vm.lowMotive = {
            optionMotive: [
                { id: "01", text: "SIN POTENCIAL" },
                { id: "02", text: "ILOCALIZABLE" },
                { id: "03", text: "CIERRE" }
            ]
        };


        vm.changeStrategy =  function(obj){
            if(obj.idStrategy == "2"){
                vm.isReactivation = true;
                vm.isNewOpportunity = false;
                vm.readonlyNoClient = false;
                vm.readonly =true;
            }else if(obj.idStrategy == "3"){
                vm.isNewOpportunity = true;
                vm.isReactivation = false;
                vm.readonly =false;
            }else{
                vm.isReactivation = false;
                vm.readonly =false;
            }
            setupVars();
        };

        

        vm.lostFocusClient = function () {
            if (vm.opportunity && vm.opportunity.clientNumber) {
                vm.oldValueContract =vm.opportunity.clientNumber;
                var model = getModelForClientContract(vm.contracts.typeContractSelected.id, vm.opportunity.typeClient, vm.opportunity.clientNumber);
                prospectSrv.getInfoClient(model).then(function success(_record) {
                    if (_record.success) {
                        var info = _record.data[0];
                        var name = info.name.trim() + " " + info.lastName.trim() + " " + info.secondLastName.trim();
                        vm.opportunity.clientName = info.personType === "1" ? name : info.companyName;
                    } else {
                        vm.opportunity.clientName = "";
                        vm.readonly =true;
                        CommonModalsSrv.info(_record.msg);
                    }
                }).catch(function error(error) {
                    CommonModalsSrv.info(error.msg);
                });
            }
        };

        function setup() {
            // vm.status = false;
             if (IDOpportunity) {
                 vm.isUpdateOp = true;
                 getOpportunity();
             }else {
                 vm.isUpdateOp = false;
                 setupVars();
                 //setupOptions();
             }
             getStrategy();
             getSegmenty();
             inicializarWatch();
         };

         function inicializarWatch() {
            //observamos los cambios de la fecha de cierre para actualizar la fecha maxima de contacto
            if (vm.opportunity && vm.opportunity.highDate) {
                $scope.$watch('add.opportunity.highDate', function () {
                    var config = getConfigContactDate();
                    config.maxDate = vm.prospect.highDate;
                    if (vm.addActivity && vm.varsActivity && vm.varsActivity.activity && vm.varsActivity.activity.date && vm.prospect && vm.prospect.highDate) {
                        var fecha = vm.varsActivity.activity.date;
                        vm.varsActivity.activity.date = vm.prospect.highDate >= fecha ? fecha : moment();
                    }
                    vm.datepicker_opts_Actividad = config;
                });
            }
        }; 


        function getStrategy() {
            addProspectSrv.getStrategy()
                .then(function (result) {
                    if(result.success){
                        vm.strategy = result.data.map(function (_val) {
                            _val.text = _val.strategy;
                            return _val;
                        });
                    }else{
                        CommonModalsSrv.error('Se Encontró Un Error Favor De Intentarlo Más Tarde, Comuníquese Con Su Help desk');
                    }  
                });
        };
        
        function getSegmenty() {
            addProspectSrv.getSegment()
                .then(function (result) {
                    if(result.success){
                        vm.segment = result.data.map(function (_val) {
                            _val.text = _val.segment;
                            return _val;
                        });
                    }else{
                        CommonModalsSrv.error('Se Encontró Un Error Favor De Intentarlo Más Tarde, Comuníquese Con Su Help desk');
                    }  
                });
        }; 

        vm.done = function () {
            if (IDOpportunity) {

                if(validateStage(vm.opportunity.stage)){

                    vm.disabledModal = true;
                CommonModalsSrv.warning('¿Deseas modificar los datos personales del prospecto?').result.then(function () {
                    updateOpportunity(IDOpportunity);
                }, function () {
                    vm.disabledModal = false;
                });

                }

                
            }else {
                saveOpportunity();
            }
        };

        function saveOpportunity() {
            addProspectSrv.setOpportunity(vm.opportunity, vm.varsActivity)
                .then(function (result) {
                    if(result.success){
                        $uibModalInstance.close();
                    }else{
                        $uibModalInstance.dismiss();
                        CommonModalsSrv.error(result.data);
                        
                    }  
                });
        }

         function validateStage(obj){
            /*var modelUpdate ={
                language: 'SPA',
                idOpportunity: vm.detailOpportunity.idOpportunity,
                idEmployee : userConfig.user.employeeID,
                idNextStage: obj.idStage,
            };*/
            

            var op = obj.idStage - vm.detailOpportunity.asrStage.idStage;

            if(obj.idStage === 8 && vm.detailOpportunity.contacted == false){
                CommonModalsSrv.error('Para cambiar de etapa, el cliente debe ser contactado');
                return false;

            }else if(op >= 2 && obj.idStage != 10 ){
                CommonModalsSrv.error('Te falta seleccionar la Etapa PROSPECTO');
                return false;
            }else if(!vm.opportunity.lowMotive && vm.activeLowMotive ){
                CommonModalsSrv.error('Seleccione el origen de la Baja');
                return false;
            }

            return true;

        
        };

        vm.changeStage =  function(obj){
            vm.activeLowMotive = obj.idStage === 10 ? true : false;
            vm.opportunity.lowMotive = null;


        }



















        /* codigo viejo */

        vm.contracts = {
            optionTypeContract: [
                { id: "998", text: "Casa" },
                { id: "999", text: "Banco" }
            ],
            typeContractSelected: { id: "998", text: "Casa" }
        };

        vm.changeTypeProspect = function(){
            vm.prospect.DTP = null;
            resetDataReferido();
        };
        vm.changeContractClient = function(){
            if(vm.prospect.typeClient !== "contract"){
                vm.contracts.typeContractSelected= { id: "998", text: "Casa" };
            }
            resetDataReferido();       
        };

        vm.changeTypeContract = function(){
            resetDataReferido();
        };

        vm.lostFocusClientContract = function () {
            if (vm.prospect && vm.prospect.clientNumber) {
                vm.oldValueContract =vm.prospect.clientNumber;
                var model = getModelForClientContract(vm.contracts.typeContractSelected.id, vm.prospect.typeClient, vm.prospect.clientNumber);
                prospectSrv.getInfoClient(model).then(function success(_record) {
                    if (_record.success) {
                        var info = _record.data[0];
                        var name = info.name.trim() + " " + info.lastName.trim() + " " + info.secondLastName.trim();
                        vm.prospect.refersName = info.personType === "1" ? name : info.companyName;
                    } else {
                        vm.prospect.refersName = "";
                        CommonModalsSrv.info(_record.msg);
                    }
                }).catch(function error(error) {
                    CommonModalsSrv.info(error.msg);
                });
            }
        };

        vm.changeActivity = function(){
            if(!vm.addActivity){
                vm.varsActivity = null;

            }

        };

        $scope.$watch('add.addActivity', function () {
            if (!vm.varsActivity && vm.addActivity ) {
                vm.varsActivity = {
                    activity: {
                        date: moment()
                    }
                };
            }
        });
       
        function resetDataReferido() {
            vm.prospect.refersName = '';
            vm.prospect.clientNumber = '';
        }

        function getModelForClientContract(bankingArea, type, clientOrContract ) {
            var model = {
                type: 0,
                titularFlag: true,
                bankingArea: bankingArea,
                contractNumber: '',
                clientNumber: ''
            };
            if(type === "contract"){
                model.type = 2;
                model.contractNumber = clientOrContract;
            }else{
                model.type = 1;
                model.clientNumber = clientOrContract;
            }
            return model;
        }

          

        

        vm.close = function () {
            $uibModalInstance.dismiss();
        };

        


        function updateOpportunity(IDOpportunity) {
            prospectSrv.updateOpportunity(vm.opportunity,IDOpportunity)
                .then(function (result) {
                    if(result.success){
                        $uibModalInstance.close();
                        CommonModalsSrv.done(result.data);
                        if(vm.opportunity.stage.idStage == 10){
                            $state.go('prospects.myProfile');
                        }
                    }else{
                        $uibModalInstance.dismiss();
                        CommonModalsSrv.error(result.data);
                    } 
                });
        }

        
        function getOpportunity() {

            prospectSrv.getOpportunityById(IDOpportunity).then(function( _opportunity ) {
                 vm.detailOpportunity = _opportunity;
                 setupDetail();
                 getStages();
                // setupOptions();
            }).catch(function () {
                CommonModalsSrv.error("Ha ocurrido un error.");
            });
                
        }

        function getStages(){
            var stage = vm.detailOpportunity.asrStage.idStage;
            var listStage = [];
            prospectSrv.getStages().then(function( _stages ){
                _stages.forEach(function(res){
                    if(res.idStage >= stage){
                        if(stage != 9){
                            listStage.push(res);
                        }
                        
                    }
                });
                 vm.stageList =listStage.map(function (_val) {
                    _val.text = _val.description;
                    return _val;
                });
    
            });

                   
        }

        function setupDetail() {
            
            
            if(vm.detailOpportunity.asrStrategy.idStrategy == "2"){
                vm.isReactivation = true;
                vm.isNewOpportunity = false;
                vm.readonlyNoClient = true;
                vm.readonly =true;
            }else if(vm.detailOpportunity.asrStrategy.idStrategy == "3"){
                vm.isNewOpportunity = true;
                vm.isReactivation = false;
                vm.readonly =false;
            }else{
                vm.isReactivation = false;
                vm.readonly =false;
            }

            vm.detailOpportunity.asrStrategy.text =  vm.detailOpportunity.asrStrategy.strategy;
            vm.detailOpportunity.segmentObject = {};
            vm.detailOpportunity.segmentObject.id =  vm.detailOpportunity.idSegment;
            vm.detailOpportunity.segmentObject.text =  vm.detailOpportunity.segment;
            vm.detailOpportunity.asrStage.text =  vm.detailOpportunity.asrStage.description;
            vm.opportunity = {};

            //vm.opportunity.strategy.text = vm.detailOpportunity.asrStrategy.strategy;
            
            

            vm.opportunity.stage = vm.detailOpportunity.asrStage;
            vm.opportunity.strategy = vm.detailOpportunity.asrStrategy;
            vm.opportunity.clientNumber = vm.detailOpportunity.clientNumber;
            vm.opportunity.clientName = vm.detailOpportunity.nameOpportunity;
            vm.opportunity.segment = vm.detailOpportunity.segmentObject;
            vm.opportunity.phone = vm.detailOpportunity.phone;
            vm.opportunity.email = vm.detailOpportunity.mail;
            vm.opportunity.highDate = vm.detailOpportunity.creationDate;


            vm.stageBlockade = vm.opportunity.stage.idStage; 


            /*vm.datepicker_opts_Fecha_Alta = {
	        	parentEl: "idDateEnd",
	        	singleDatePicker: true,
	        	initDate:vm.opportunity.highDate,
	            minDate: moment()
            };*/
        }
       
        function setupVars() {
            vm.prospect = {
                type: 'prospect',
                referred: 'false',
                typeClient: 'contract',
                highDate: moment()
            };

            //config Calendar Fecha Cierre
            vm.datepicker_opts_Fecha_Alta = {
	        	parentEl: "idDateEnd",
	        	singleDatePicker: true,
                minDate: moment(),
                locale: {
                    format: "DD/MM/YYYY"
                }
            };
            
            //config Calendar Actividad
            vm.datepicker_opts_Actividad = getConfigContactDate();

            /*----------*/
            
            
            if(vm.opportunity){
                 vm.opportunity.clientName = "";
                 vm.opportunity.phone = "";
                 vm.opportunity.email = "";
                 vm.opportunity.clientNumber = "";
                 vm.opportunity.segment = null;

            }
            

            
            //$scope.varsActivity = {};          
        }

        function getConfigContactDate() {
            return {
                singleDatePicker: true,
                initDate: moment(),
                minDate: moment(),
                maxDate: moment(),
                locale: {
                    format: "DD/MM/YYYY"
                }
            };
        }
        

        function refactorDropdowns(_model, _property) {
            return R.map(function (_val) {
                _val.text = _val[_property];
                return _val;
            }, _model);
        }

        function setupOptions() {            

            /*prospectSrv.getProspectProfile().then(function (_options) {
                vm.profileTypes = refactorDropdowns(_options, 'description');
            });
            // prospectSrv.getProspectTPC().then(function(_options){
            //     vm.optionsTPC = refactorDropdowns(_options, 'description');
            // });*/
            var _options = [{ description: 'Contrato complementario cliente actual' },
            { description: 'Recomendación de cliente' },
            { description: 'Familiar/conocido del Asesor' }];
            vm.optionsDTPR = refactorDropdowns(_options, 'description');

            _options = [{ description: 'Cliente no asesorado' },
            { description: 'Walk in' },
            { description: 'CAT' },
            { description: 'Prospección en Frío' }];
            vm.optionsDTPNR = refactorDropdowns(_options, 'description');

            prospectSrv.getStages().then(function (_options) {
                //Se realiza el filtro de los estados a los cuales podra acceder
                //Modificacion
                if(!vm.mod){
                    var data = _options.filter(function (record) {
                        return record.idStage >= vm.detailProspect.idStage;
                    });
                    vm.optionsStages = refactorDropdowns(data, 'description');    
                }else{//Agregar
                    vm.optionsStages = refactorDropdowns(_options, 'description');    
                }     
            });
            /*prospectSrv.prospecsPT().then(function (_options) {
                vm.phoneTypes = refactorDropdowns(_options, 'PhoneTypeName');
            });*/
        }


        setup();

    }

    angular.module('actinver.controllers')
        .controller('prospectsModalCtrl', prospectsModalCtrl);

})();
