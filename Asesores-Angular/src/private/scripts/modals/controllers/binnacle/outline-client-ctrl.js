( function(){
    'use strict';

    function outlineClientModalCtrl( $window, $uibModalInstance, $httpParamSerializer, binnacleOutlineSrv, CommonModalsSrv, outlineItemDetails ){
        var vm = this;

        // Defaults
        vm.form = {
           employee: outlineItemDetails.employee,
           contrato: outlineItemDetails.contrato,
           tipoOrigen: outlineItemDetails.tipoOrigen,
           typeServicio: outlineItemDetails.typeServicio,
           tipoPersona:outlineItemDetails.tipoPersona,
           typeoperation:outlineItemDetails.typeoperation,
           investmentProfile:outlineItemDetails.investmentProfile
        };
        vm.sent_type = false;

        // Send selected outline way
        vm.sendType = function(){
            vm.sent_type = true;         
            var tipo=vm.form.type;

            if(tipo === "confirm"){
                tipo=1;
            }else if(tipo === "update"){
                tipo=2;             
            }else{
                tipo=3;
            }

            var parametros = {
                type:tipo,
                contratoXactualizar:outlineItemDetails.contrato,
                origenPeticion:outlineItemDetails.tipoOrigen,
                tipoPersona:outlineItemDetails.tipoPersona,
                tipoServicio:outlineItemDetails.typeServicio,language: 'SPA',
                idEmployee: vm.form.employee

            };

            binnacleOutlineSrv.getSellsPracticeUrl(parametros)
                .then( function( response ){
                    if(response.data.status === 1){
                       //$window.location.href=response.data.result;
                        window.open(response.data.result,'_blank');
                        
                    }else{
                        CommonModalsSrv.error( 'No se puedo realizar la operación' );
                    }
                     
                }, function errorCallback(){
                    CommonModalsSrv.error( 'Se Encontró Un Error Favor De Intentarlo Más Tarde, Comuníquese Con Su Help desk' );
                    vm.done();

                } );
               
                vm.sent_type = false; 
                vm.done();
        };

        // Close modal
        vm.close = function(){
            $uibModalInstance.dismiss();
        };

        // Another way to close modal
        vm.done = function(){
            $uibModalInstance.close();
        };

    }

    angular
        .module( 'actinver.controllers' )
        .controller( 'outlineClientModalCtrl', outlineClientModalCtrl );

} )();