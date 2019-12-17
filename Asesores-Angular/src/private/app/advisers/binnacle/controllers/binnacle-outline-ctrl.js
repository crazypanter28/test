( function(){
    'use strict';

    function binnacleOutlineCtrl( $scope, binnacleOutlineSrv, binnacleModalSrv, binnacleStrategySrv, accountSrv, CommonModalsSrv ){
        var vm = this;
        vm.soon = false;
        vm.expired = false;
        vm.all = false;

        vm.showOutlineInfo = function( type ){
            vm[ type ] = false;
            binnacleOutlineSrv.getClientsInfo( $scope.binnacle.sadviser.employeeID, type )
                .then( function successCallback( response ){
                    vm[ type ] = response.data;
                }, function errorCallback(){
                    vm[ type ] = [];
                } );
        };

        vm.getInfo = function(){
            binnacleStrategySrv.getBinnacleClients($scope.binnacle.sadviser.employeeID)
            .then(function successCallback(response) {
                var all = [];
                if (response.data && response.data.length > 0) {
                    // Combine information in a single array
                    angular.forEach(response.data, function (obj) {
                        angular.forEach(obj.contractsList, function (item) {
                            
                            all.push({
                                numSolContrato: item.numContrato,
                                tipoOrigenTO:{
                                    nombre:item.origen.trim() === "CB" ? "CASA DE BOLSA" : item.origen.trim(),
                                    id:item.origen.trim() === "CB" ?  2: 1,
                                },
                                sfechaActualizacion:'',
                                tipoServicioTO:{
                                    value:{
                                        //es asesorado
                                        idTipoServicio:1 
                                    }
                                },
                                cliente:{
                                    value:{
                                        nombre: item.nombreCliente,
                                        tipoPersonaTO:{
                                            id:null
                                        }
                                    }    
                                },
                                perfil:{
                                    value:{
                                        nombre:''
                                    }
                                }
                            });                            
                        });
                    });
                    vm.all = all;                                                            
                } else {
                    vm.all = [];
                }
            }, function errorCallback() {
                vm.all = [];
            });

        };

        vm.outlineClient = function( employeeID, contrato,tipoOrigen ,typeServicio,tipoPersona,typeoperation ){

            if(typeoperation === "all" ){
                var model = {
                    contractNumber: contrato,                    
                    bankingArea: tipoOrigen === 2 ? 998:999 
                };    
                accountSrv.getContractInfoDetail(model).then(function (data) {
                   binnacleModalSrv.outlineClient( employeeID, contrato, tipoOrigen, typeServicio, data.holder.personType.personTypeID, typeoperation, data.investmentProfile);
                }).catch(function (response) {
                    CommonModalsSrv.error(response.messages[0].responseMessage);
                });

            }else{//expired, soon
                binnacleModalSrv.outlineClient( employeeID, contrato,tipoOrigen ,typeServicio,tipoPersona,typeoperation );
            }                        
        };

    }

    angular
        .module( 'actinver.controllers' )
        .controller( 'binnacleOutlineCtrl', binnacleOutlineCtrl );

})();