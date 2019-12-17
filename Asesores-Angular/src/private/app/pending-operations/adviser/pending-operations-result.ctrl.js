(function(){
    "use strict";
    angular
        .module( 'actinver.controllers' )
        .controller( 'pending-operations-adviser-result.controller', resultPendingOperations );

    function resultPendingOperations( $state, $stateParams ){
        var vm = this;
        vm.result;
        vm.show;
        vm.showDetail = showDetails;
        vm.typeOperation = $stateParams.typeOperation === 'approve' ? 'Aprobación' : 'Rechazo';
        var _resultPO = $stateParams.poResult;
        vm.nameoperation = $stateParams.operations;
        vm.views = $stateParams.views;

        validateResult();

        function validateResult(){
            if(_resultPO === null){
                $state.go('pending-operations-adviser');
            }else{
                try {
                    if (_resultPO.response.outCommonHeader.result.result === 3){
                     vm.result = [];
                     
                     var obj = {};
                     obj.message = {};
                     obj.message.message = _resultPO.response.result;
                     obj.message.estatus = _resultPO.response.outCommonHeader.result.messages[0].responseSystemCode;
                     obj.message.tipoOperacion = _resultPO.response.outCommonHeader.result.messages[0].responseMessage;
                     obj.show = false;
                     obj.icon = '+';
                     obj.text = 'Más Información';
                     vm.result.push(obj);
                    }
                } catch (otro){
                    var _pendingOperations = _resultPO;
                    angular.forEach(_pendingOperations,function(value,key){
                        if (vm.typeOperation === 'Aprobación') { _pendingOperations[key].message = JSON.parse(_pendingOperations[key].message);}
                        if (vm.typeOperation === 'Rechazo') {
                            var temp = _pendingOperations[key].message;
                            _pendingOperations[key].message = {}; 
                            _pendingOperations[key].message.message = temp;
                            (value.successFlag)?(_pendingOperations[key].message.estatus='Éxito'):(_pendingOperations[key].message.estatus='Error');
                            vm.nameoperation.forEach(function(id){
                                if(id.id === value.operationID) {
                                    _pendingOperations[key].message.tipoOperacion = id.tipoOperacion.description;
                                }
                            });
                    
                        }
                        _pendingOperations[key].show = false;
                        _pendingOperations[key].icon = '+';
                        _pendingOperations[key].text = 'Más Información';
                        _pendingOperations[key].key = key;
                    });
                    vm.result = _pendingOperations;
                }
                
            }
        }

        function showDetails(id){ 
            try {
                    vm.result[id].show = vm.result[id].show ? false : true;
                    vm.result[id].icon = vm.result[id].icon === '+' ? '-' : '+';
                    vm.result[id].text = vm.result[id].text === 'Más Información' ? 'Cerrar' : 'Más Información';
                    vm.detail = vm.result[id];
            }catch (error){
                vm.result[0].show = vm.result[0].show ? false : true;
                vm.result[0].icon = vm.result[0].icon === '+' ? '-' : '+';
                vm.result[0].text = vm.result[0].text === 'Más Información' ? 'Cerrar' : 'Más Información';
                vm.detail = vm.result[0];
            }
                
        }

        vm.Change = function (){
            if (vm.views === 'operations'){
                $state.go('pending-operations-adviser');
            }else{
                $state.go('pending-operations-historic');
            }
        };
    }

})();