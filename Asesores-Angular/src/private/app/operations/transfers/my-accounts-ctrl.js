( function(){
    "use strict";


    function myAccountsCtrl( $scope, transfersSrv, CommonModalsSrv, transferModalSrv, REGEX, ErrorMessage, fundBankDollSrv ){
        var vm = this;

        vm.title = 'Traspasos';
        vm.pattern = REGEX;
        vm.viewTransactions = true;

        vm.cmd ={
            transfer: {
                bank : '01',
            },
        };

        vm.contracts = R.map(function(_val){
            _val.text = _val.contractNumber;
            return _val;
        }, $scope.operations.sclient.contracts_list);

       
        vm.viewMoreDetail=transferModalSrv.detailTransfer;
        vm.loadContract = loadContract;
        init();

        function init() {
            var contract = JSON.parse(localStorage.getItem('contractSelected'));
            if(contract !== ''){
                vm.cmd.contract = contract;
                loadContract();
            }
        }
        function getTotal() {
            if(vm.cmd.contract.companyName === "Casa"){
                transfersSrv.getBalance( vm.cmd.contract.contractNumber ).then(function(response){
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
                fundBankDollSrv.bankContractBalance( vm.cmd.contract.contractNumber, '001')
                    .then(function (response) {
                        if (response.data.outCommonHeader.result.result === 1) {
                            $scope.transferLoading = true;
                            $scope.loadAccountsTransferNull = false;
                            vm.dataContract = response.data.outBankContractBalance.balanceData.availableBalance;
                            vm.base = angular.copy( vm.cmd.contract.contractNumber );
                            loadAccounts(vm.cmd.contract.contractNumber);
                        }else{
                            $scope.transferLoading = false;
                            $scope.loadAccountsTransferNull = true;
                            CommonModalsSrv.error( ErrorMessage.createError(response.data.outCommonHeader.result.messages) );
                        }
                    });
            }
        }

        vm.makeTransfer = function(){
            vm.cmd.typeTrans = '1';
            transferModalSrv.accept( vm.cmd ).result
                .then( function( _res ){
                    if( _res.outCommonHeader.result.result === 1 ){
                        var message;
                        if(_res.outTransferExecution){
                            message = 'La transferencia se realizó de manera correcta. <br> Con el folio de la operación <b>'+
                                _res.outTransferExecution.transferResult.operationReference + '</b>' ;
                        }else if (_res.outAdviserPendingOpRegistration){
                            message = 'La transferencia se realizó de manera correcta. <br> Con el ID Solicitud <b>'+
                                _res.outAdviserPendingOpRegistration.operationsDetails[0].operationID + '</b>' ;
                        }
                        CommonModalsSrv.done( message ).result.then(function() {
                            vm.cmd.transfer = {
                                bank : '01',
                            };
                            loadTransfers();
                            getTotal();
                        });
                    } else{
                        CommonModalsSrv.error( ErrorMessage.createError(_res.outCommonHeader.result.messages) );
                    }
                });
        };

       function loadContract(){
            $scope.$ctrl.contract = vm.cmd.contract.contractNumber;
            $scope.transferLoading = true;
            vm.cmd.transfer = {
                bank : '01',
            };
            getTotal();
       }


        function loadTransfers(){
            $scope.spinnerTransfers = true;
            transfersSrv.getTransfers( vm.cmd.contract.contractNumber , vm.cmd.contract.companyName ).then(function(res){
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
            } ,function() {
                vm.transfers = [];
                $scope.$ctrl.showSystemError();
                $scope.spinnerTransfers = false;
            });
        }

        function loadAccounts(_contract) {
            vm.accounts = [];
            vm.accounts = refactorAccounts( $scope.operations.sclient.contracts_list, _contract.contractNumber);
            $scope.transferLoading = false;
            loadTransfers();
        }

        function refactorAccounts( _accounts, _contract ) {
            _accounts = _accounts || [];
            return R.map( function(val){
                if(val.contractNumber !== _contract){
                    val.text = val.contractNumber;
                    return val;
                }
            }, _accounts );
        }

    }

    angular
    	.module( 'actinver.controllers' )
        .controller( 'myAccountsCtrl', myAccountsCtrl );

})();
