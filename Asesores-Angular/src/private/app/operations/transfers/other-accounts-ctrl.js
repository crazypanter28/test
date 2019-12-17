( function(){
    "use strict";

    function otherAccountsCtrl( transfersSrv, fundBankDollSrv, transferModalSrv, REGEX, $scope, CommonModalsSrv, $sessionStorage, ErrorMessage ){
        var vm= this;

        vm.title = 'Transferencias';
        vm.pattern = REGEX;
        vm.viewSPEI=false; 
        vm.viewTransactions=true;
        vm.viewSPEITag=true;

        vm.cmd ={
            transfer: {
                bank : '02',
            },
        };

      
        vm.viewMoreDetail=transferModalSrv.detailTransfer;
        vm.viewMoreDetailSPEI=transferModalSrv.detailTransferSPEI;

        $scope.contractso = R.map(function(_val){
            _val.text = _val.contractNumber;
            if( _val.bankingArea === "999"){
            return _val;
            }
        }, $scope.operations.sclient.contracts_list);

        vm.makeTransfer = function(){            
            vm.cmd.typeTrans = '2';
            transferModalSrv.accept( vm.cmd ).result.then(function( _res ) {
                var message;
                    if( _res.outCommonHeader.result.result === 1 ){
                        if( _res.outTransferRequest ){
                            message = 'La transferencia se realizó de manera correcta. <br> Con el folio de la operación <b>'+
                                _res.outTransferRequest.transferResult.operationReference + '</b>' ;
                        }else if(_res.outBrokerSPEITransfer){
                            message = 'La transferencia se realizó de manera correcta. <br> Con el folio de la operación <b>'+
                                _res.outBrokerSPEITransfer.transferResult.operationReference + '</b>' ;
                        }else if(_res.outTransferExecution){
                            message = 'La transferencia se realizó de manera correcta. <br> Con el folio de la operación <b>'+
                                _res.outTransferExecution.transferResult.operationReference + '</b>' ;
                        }else if (_res.outAdviserPendingOpRegistration){
                            message = 'La transferencia se realizó de manera correcta. <br> Con el ID Solicitud <b>'+
                                _res.outAdviserPendingOpRegistration.operationsDetails[0].operationID + '</b>' ;
                        }

                        CommonModalsSrv.done( message ).result.then(function() {
                            vm.cmd.transfer = {
                                bank : '02',
                            };
                            loadTransfers();
                            if(vm.cmd.contract.companyName === "Casa"){
                                transfersSrv.getBalance( vm.cmd.contract.text ).then(function(response){
                                    vm.dataContract = response.data.outCashByDate.cashSettlement[0].cashAmount;
                                    vm.base = angular.copy( vm.cmd.contract );
                                    loadAccounts(vm.cmd.contract);
                                },function() {
                                    $scope.$ctrl.showSystemError();
                                    $scope.transferLoading = false;
                                });
                            }else{
                                fundBankDollSrv.bankContractBalance(vm.cmd.contract.text, '001')
                                    .then(function (response) {
                                        if (response.data.outCommonHeader.result.result === 1) {
                                            vm.dataContract = response.data.outBankContractBalance.balanceData.availableBalance;
                                            vm.base = angular.copy( vm.cmd.contract );
                                            loadAccounts(vm.cmd.contract);
                                        }
                                    },function() {
                                        $scope.$ctrl.showSystemError();
                                        $scope.transferLoading = false;
                                    });
                            }
                        });
                    }
                    else{
                        CommonModalsSrv.error( ErrorMessage.createError(_res.outCommonHeader.result.messages) );
                    }
                });
        };

        vm.loadContract = function(){
            $scope.$ctrl.contract = vm.cmd.contract.contractNumber;
            $scope.transferLoading = true;
            vm.cmd.transfer = {
                bank : '01',
            };
            if(vm.cmd.contract.companyName === "Casa"){
                transfersSrv.getBalance( vm.cmd.contract.text ).then(function(response){
                    if(response.data.outCommonHeader.result.result === 1){
                        $scope.transferLoading = true;
                        $scope.loadAccountsTransferNull = false;
                        vm.dataContract = response.data.outCashByDate.cashSettlement[0].cashAmount;
                        vm.base = angular.copy( vm.cmd.contract.contractNumber );
                        loadAccounts(vm.cmd.contract.contractNumber);
                    }else{
                        $scope.transferLoading = false;
                        $scope.loadAccountsTransferNull = true;
                        CommonModalsSrv.error( ErrorMessage.createError(response.data.outCommonHeader.result.messages) );
                    }
                });
            }else{
                fundBankDollSrv.bankContractBalance(vm.cmd.contract.text, '001')
                    .then(function (response) {
                        if (response.data.outCommonHeader.result.result === 1) {
                            $scope.transferLoading = true;
                            $scope.loadAccountsTransferNull = false;
                            vm.dataContract = response.data.outBankContractBalance.balanceData.availableBalance;
                            vm.base = angular.copy( vm.cmd.contract );
                            loadAccounts(vm.cmd.contract);
                        }else{
                            $scope.transferLoading = false;
                            $scope.loadAccountsTransferNull = true;
                            CommonModalsSrv.error( ErrorMessage.createError(response.data.outCommonHeader.result.messages) );
                        }
                    });
            }
        };

        function loadAccounts(_contract) {
            var _clientId = $sessionStorage.sclient.data.clientNumber;
            $scope.loadAccountsTransferNull = false;
            transfersSrv.getOtherAccounts( _contract , _clientId)
                .then(function(response){
                    vm.accounts = [];
                    if( response.data.status === 1 ){
                        vm.accounts = refactorAccounts( response.data.result.bankAccountsListFilter);
                        $scope.transferLoading = false;
                        loadTransfers();
                    }else{
                        $scope.transferLoading = false;
                        $scope.loadAccountsTransferNull = true;
                    }
            },function() {
                $scope.$ctrl.showSystemError();
                $scope.transferLoading = false;
            }).catch(function (_error) {
                var message = '';
                angular.forEach(_error, function(_value){
                    message += _value.responseMessage + '<br>';
                });

                CommonModalsSrv.error( message );
            });
        }

        function loadTransfers(){
            $scope.spinnerTransfers = true;
            transfersSrv.getTransfers( vm.cmd.contract.text , vm.cmd.contract.companyName ).then(function(res){
                if( res.data.outCommonHeader.result.result === 1){
                    if(res.data.outContractMovementsQuery.movementsList.length > 0 ){
                        vm.transfers = res.data.outContractMovementsQuery.movementsList;
                    }else{
                        vm.transfers = [];
                    }
                }
                else {
                    vm.transfers = [];
                }
                $scope.spinnerTransfers = false;
            },function() {
                vm.transfers = [];
                $scope.$ctrl.showSystemError();
                $scope.spinnerTransfers = false;
            } );
        }

        function refactorAccounts( _accounts ) {
            _accounts = _accounts || [];            
            var bankAccounts = R.map(function( _val ){
                //_val.text = _val.alias + '-' + _val.bankName;
                _val.text =  ((_val.alias !==null && _val.alias !=="" ? _val.alias + "-" : ""  ) + _val.accountNumber) ;
                _val.contractNumber = vm.cmd.contract.contractNumber;
                return _val;
            }, _accounts );

            /*var A2kBankAccounts = R.map(function( _val ){
                _val.text = _val.bankAccounts.bankName + ' - ' + _val.bankAccounts.clabe;
                return _val;
            }, _accounts.outA2KBankAccountsQuery.bankAccountsList );

            return vm.cmd.contract.companyName === "Casa" ? A2kBankAccounts : bankAccounts;*/

            return vm.cmd.contract.companyName === "Casa" ? '' : bankAccounts;

        }
        vm.loadSPEI = function(){
                vm.transfersSPEI=[];
                vm.viewSPEI=true;
                vm.viewTransactions=false;
                $scope.loadAccountsTransferNull = false;                
                var model={
                    contractNumber:vm.cmd.contract.text,
                    bankingArea: vm.cmd.contract.companyName === "Banco" ? 999 :998 ,
                    requirementFlag:0,
                    language:'SPA'

                };


                transfersSrv.getBankContractSPEIMovementsQuery( model)
                    .then(function(res){
                       if( res.data.outCommonHeader.result.result === 1){
                            if(res.data.outBankContractSPEIMovementsQuery.speitransactionsList.length > 0 ){
                                vm.transfersSPEI = res.data.outBankContractSPEIMovementsQuery.speitransactionsList;
                            }else{
                                vm.transfersSPEI = [];
                        }
                    }
                        
                        
                }).catch(function (_error) {
                    var message = '';
                    angular.forEach(_error, function(_value){
                        message += _value.responseMessage + '<br>';
                    });
    
                    CommonModalsSrv.error( message );
                });

                

        };
        vm.loadTransactions = function(){           
            vm.viewSPEI=false;
            vm.viewTransactions=true;
    };

    }

    angular
    	.module( 'actinver.controllers' )
        .controller( 'otherAccountsCtrl', otherAccountsCtrl );

})();
