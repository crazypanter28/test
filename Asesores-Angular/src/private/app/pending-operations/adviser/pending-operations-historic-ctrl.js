( function () {
    "use strict";

    function pendingOperationsHistoric (  pendingOperationsAdviser, CommonModalsSrv, $state, loginSrvc, pendingModalsSrv, $timeout ) {
        var vm = this;

        function setup () {
            getRol();
        }
        function getRol() {
            vm.asesor = false;
            vm.cat = false;

            loginSrvc.makeDataUser().then( function( _response){

            _response.user.scope.forEach(function( _element ){
                if  ( _element === 'ASESOR'){
                    vm.asesor = true;
                } 
                if (_element === 'CAT') {
                    vm.cat = true; 
                }
            });
 
            init ();
            });
        }
        
        function init (){ 
            if (vm.asesor && vm.cat) {
                vm.selectFilter = '3';
                getOpHistoric(3);
            }else{
                if(vm.asesor) { 
                    vm.selectFilter = '1';
                    getOpHistoric(1);
                 }
                 if(vm.cat) { 
                    vm.selectFilter = '3';
                    getOpHistoric(3);
                 }

            }
            
        }

        function selectPo(id, operacion){
            vm.operacion = operacion;
            var _id = parseInt(id);
            var _index = vm.po.indexOf(_id);
            if (_index > -1) {
                vm.po.splice(_index, 1);
            }else{
                    vm.po.push(_id);
            }
            if (vm.po.length === 0) {vm.selectAll    = false; }
        }

        vm.checkAll = function() { 
            vm.po = [];
            angular.forEach(vm.pendingOp, function( val, key) {
                
                if (vm.selectAll) {
                    if (val.stateID === "0" || val.stateID === "9") {
                        vm.modeIdPo[key] = vm.selectAll;
                        selectPo(val.operationID,val.moduleDescription.description);
                    }
                } else {
                    vm.modeIdPo[key] = vm.selectAll;
                }
            });
        };

        vm.getOpHistoricFilter = function ( _type ){
            getOpHistoric( _type );
        };

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

        vm.selectPo = selectPo;
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
        vm.po = [];
        vm.sendOperation = sendOperation;
        vm.removeItemsPo = removeItemsPo;
       

        function showDetails(id){
            vm.pendingOp[id].show = vm.pendingOp[id].show ? false : true;
            vm.pendingOp[id].icon = vm.pendingOp[id].icon === '+' ? '-' : '+';
            vm.detail = vm.pendingOp[id];
        }

        function removeItemsPo(){
            vm.po           = [];
            vm.modeIdPo     = {};
            vm.selectAll    = false;
            vm.disabled     = false;
            vm.operacion    = '';
        }


        function getOpHistoric( _type ){
            pendingOperationsAdviser.getOperationsHistoric( _type )
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

        function sendOperation( typeParam ){
            
                        var idString = angular.toJson(vm.po);
                        idString = idString.replace('[','');
                        idString = idString.replace(']','');
            
                        var _params = {
                            operationID     : idString,
                            rejectionReason : vm.operacion,
                            language        : 'SPA'
                        };
                        if (typeParam === 'reject'){
                            var rejects = [];
                            if(vm.po.length > 1){
                                vm.nameOperation = "Otro";
                            } else {
                                vm.nameOperation = vm.operacion;
                            }
                            pendingOperationsAdviser.cancelation( vm.nameOperation ).then( function ( id ) {
                                _params.rejectionReason = id;
                                //vm.cancelation = reasons.CATALOG[id].items;
                                pendingModalsSrv.addReason('Agregar un Motivo', _params ).result.then(function( _response ){

                                    if ( vm.nameOperation === "Otro" ){
                                        angular.forEach(vm.po, function(id){
                                            rejects.push({"operationID":id,"rejectionReason":_response.description,"idRejection":_response.id});
                                        });
                                    } else {
                                        rejects.push({"operationID":vm.po[0],"rejectionReason":_response.description,"idRejection":_response.id});
                                    }
                                    _params = {
                                        pendingReject   : JSON.stringify(rejects),
                                        language        : 'SPA'
                                    };
                                    vm.send(_params, typeParam);
                                });
                            });
                            
                            
                        }
                    }

                    vm.send = function( _params, typeParam ){
                        vm.nameAndId = [];
                        vm.po.forEach(function(id){
                        vm.pendingOp.forEach(function(item){
                            if (id === item.operationID){
                                var temp = {
                                      'id' : id,
                                      'tipoOperacion' : item.moduleDescription 
                                };
                                vm.nameAndId.push(temp); 
                            }
                        });
                    });
            
                        pendingOperationsAdviser.sendPendingOperations( _params, typeParam )
                        .then(successSend)
                        .catch(errorSend);
                        
                    function successSend(response){
                        var info = JSON.parse($sessionStorage.user);
                        var enviroment = info.enviroment;

                        if (typeParam === 'reject'){                           
                            vm.data = response.response.outAdviserPendingOpsModification.operationsDetails;
                        }else {
                            try{
                                if (response.response.outAdviserPendingOpsExecution.operationsDetails){
                                    vm.data = response.response.outAdviserPendingOpsExecution.operationsDetails;
                                }
                                
                            }catch (otro){
                                vm.data = response;
                            } 
                        }
                        if(response.status){
                            $state.go('pending-operations-adviser-result',{poResult: vm.data ,typeOperation:typeParam, operations : vm.nameAndId, views: 'historic'});
                        }else{ 
                            CommonModalsSrv.error( response.responseMessage );
                        }
                    }
            
                    function errorSend(){}
            
                    removeItemsPo();
                    };

        
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

        setup();
    }

    angular
        .module( 'actinver.controllers' )
        .controller( 'pending-operations-historic', pendingOperationsHistoric );

})();