( function () {
    "use strict";

    function pendingOperationsSent ( pendingOperationsAdviser, $timeout ) {
        var vm = this;

        function setup () {
            getOp();
        }

        vm.po = [];
        vm.columns = [
            {
                name : 'operationID',
                value : 'Id'
            },
            {
                name : 'statusID',
                value : 'Estatus'
            },
            {
                name : 'JSON.parse(moduleDescription)',
                value : 'Operación'
            },
            {
                name : 'instructionDate',
                value : 'Fecha'
            }
        ];
        vm.showDetail = showDetails;
        vm.searchPO = '';
        vm.detail;
        vm.pendingOp = [];
        vm.modeIdPo = [];
        vm.show;
        vm.disabled = false;
        vm.pageSize = '20';
        vm.currentPage = 1;
        vm.sortType     = 'operationID';
        vm.sortReverse  = true;
    
        function showDetails(id){
            vm.pendingOp[id].show = vm.pendingOp[id].show ? false : true;
            vm.pendingOp[id].icon = vm.pendingOp[id].icon === '+' ? '-' : '+';
            vm.detail = vm.pendingOp[id];
        }
        vm.primero = 1;
        vm.preview = function(){
            vm.expand();
            vm.primero = 0; 
            $timeout(function() {
                vm.primero = 1;
                var el = document.getElementById('segundo');
                angular.element(el).triggerHandler('click');
            }, 0);  
        };

        vm.expand = function () {
            for(var i = (vm.currentPage * vm.pageSize) - vm.pageSize ; i < (vm.pendingOp.length || vm.currentPage * vm.pageSize) ; i++ ){
                if (vm.pendingOp[i].icon === '+'){
                    showDetails(i);
                }  
            }
        };


        function getOp(){
            pendingOperationsAdviser.getOperationsSent()
                .then(successPO)
                .catch( errorPo );

                function successPO(response){
    
                    if (response.response.data.outEBPendingOpQuery !== null) { 
                        var _pendingOperations = response.response.data.outEBPendingOpQuery.operationList.operation;
                         (response.response.data.outEBPendingOpQuery.operationList.operation.length === 0 ) ? vm.data = true : vm.data = false;
                        angular.forEach(_pendingOperations,function(value,key){
                            try { 
                                var obj = JSON.parse(_pendingOperations[key].operation);
                                _pendingOperations[key].operation = obj;
                             }
                            catch(err) { 
                                _pendingOperations[key].operation = {}; }
        
                            _pendingOperations[key].show = false;
                            _pendingOperations[key].icon = '+';
                            _pendingOperations[key].key = key;
        
                        });
                        vm.pendingOp = _pendingOperations;
                    }else {
                        vm.data = true;
                    }
                    
    
                }

            function errorPo (  ) {
                //CommonModalsSrv.warning( error.responseMsg );
            }
        }

        setup();
    }

    angular
        .module( 'actinver.controllers' )
        .controller( 'pending-operations-sent-ctrl', pendingOperationsSent );

})();