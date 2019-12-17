( function(){
    "use strict";

    function prospectsDetailCtrl( $scope, prospectSrv, prospectModalsSrv, $stateParams, userConfig, CommonModalsSrv ){
        var vm = this;
        vm.isOpenProgramadas = true;
        vm.isOpenVencidas = true;
       // var idProspect = $stateParams.model;
        var idOpportunity = $stateParams.id;

        function setup(){
            getStageOpportunity();
        }

        $scope.$on( 'updateDetailProspect', function(){
            getDetailProspect();
        });

        vm.addProspect = function(){
            prospectModalsSrv.addActivity('NUEVA ACTIVIDAD',vm.prospectDetail).result.then(function(){
                CommonModalsSrv.done( 'La actividad se guardo de manera exitosa.' );
                    getDetailProspect();
                    
            }).catch(function(res){
                if (!(res === 'cancel' || res === 'escape key press' || res === 'backdrop click' || typeof res === 'undefined')) {
                    throw res;
                }
            });
        };

        vm.modify = function(){
            prospectModalsSrv.addOpportunity( 'DATOS PERSONALES', idOpportunity).result.then(function () {
                //getDetailProspect();
                getStageOpportunity();
            }, function () {
            });
        };

        vm.updateStage = function( _id ){
            var modelUpdate ={
                language: 'SPA',
                idOpportunity: idOpportunity,
                idEmployee : userConfig.user.employeeID,
                idNextStage: _id,
            };
            

            if(_id === 8 && vm.detailOpportunity.contacted == false){
                CommonModalsSrv.error('Para cambiar de etapa, el cliente debe ser contactado');

            }else if((vm.detailOpportunity.asrStage.idStage +1 ) != _id){
                CommonModalsSrv.error('Te falta seleccionar la Etapa PROSPECTO');
            }else{
                CommonModalsSrv.warning('¿Estás seguro de cambiar de etapa al prospecto?')
                   .result.then(function () {
                    prospectSrv.nextStage(modelUpdate).then(function () {
                        CommonModalsSrv.done('El cambio de etapa se realizó de manera correcta.');
                        getStageOpportunity();
                    });
                }).catch(function(res){
                    if (!(res === 'cancel' || res === 'escape key press' || res === 'backdrop click' || typeof res === 'undefined')) {
                        throw res;
                    }
                });
            }
        };

        function getStageOpportunity(){
            prospectSrv.getOpportunityById(idOpportunity).then(function( _opportunity ) {
                vm.detailOpportunity = _opportunity;
            });
        }

        function getDetailProspect() {
            prospectSrv.getDetailProspect(idProspect,vm.detailProspect.idStage)
                .then(function (_res) {
                    if(angular.isArray(_res.scheduledActivities)){
                        _res.scheduledActivities.forEach(function(reg){
                            reg.closeDate = _res.closeDate;
                            reg.prospectDetail = { 
                                nombreProspecto : _res.name,
                                mailProspect: _res.mail  
                            };
                        });
                    }
                    vm.prospectDetail = _res;
                });
        }


        setup();
    }

    angular
        .module( 'actinver.controllers' )
        .controller( 'prospectsDetailCtrl', prospectsDetailCtrl );

})();
