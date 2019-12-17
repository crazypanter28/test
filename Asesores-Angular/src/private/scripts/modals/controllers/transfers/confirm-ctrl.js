( function(){
    "use strict";

    function transferModalCtrl( $uibModalInstance, info, transfersSrv, $scope, $sessionStorage ){
        var vm = this;
        vm.info = info;
        vm.info.transfer.import = vm.info.transfer.import.replace(/[^\d|\-+|\.+]/g, '');
        if(info.transfer.account && info.transfer.account.bankAccounts && info.transfer.account.bankAccounts.beneficiaryName){
            vm.info.transfer.account.beneficiaryName = info.transfer.account.bankAccounts.beneficiaryName;
        }
        if(info.transfer.account.contractNumber){
            vm.info.transfer.account.contractNumber = info.transfer.account.contractNumber;
        }else if(info.transfer.account.bankAccounts.clabe){
            vm.info.transfer.account.contractNumber = info.transfer.account.bankAccounts.clabe;
        }
        vm.date = new Date();

        vm.close = function(){
            $uibModalInstance.dismiss();
        };

        vm.done = function(){
            $scope.loadingMakeTransfer = true;
            var _clientId = $sessionStorage.sclient.data.clientNumber;
            var _user = $sessionStorage.sclient.data.name + ' ' + $sessionStorage.sclient.data.lastName + ' ' + $sessionStorage.sclient.data.secondLastName;
            if(info.typeTrans === '2' && info.contract.companyName === 'Casa'){
                transfersSrv.makeTransferOtherAccount( info, vm.date, _clientId, _user).then(function( _res){
                    $uibModalInstance.close( _res );
                });
            }else{
                transfersSrv.makeTransfer( info, vm.date, _clientId, _user).then(function( _res){
                    $uibModalInstance.close( _res );
                });
            }


        };

    }

    angular.module( 'actinver.controllers' )
        .controller( 'transferModalCtrl', transferModalCtrl );

} )();
