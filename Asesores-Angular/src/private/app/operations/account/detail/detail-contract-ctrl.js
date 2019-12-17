( function(){
    "use strict";

    function detailContractCtrl( $uibModalInstance, data ){
        var vm = this;
        vm.beneficiarios = data.beneficiaryList.beneficiary;
        vm.attorneyList  = data.attorneyList.attorney;
        vm.personAuthorizedList  = data.personAuthorizedList.personAuthorized;
        vm.cotitulares = data.coownerList.coowner;
        vm.titular = data.holder;
        vm.investmentProfile = data.investmentProfile.description;
        vm.phoneNumberList = data.holder.phonesList.phone;
        vm.emailList = data.holder.emailList.email;
        vm.adviserName = data.adviser.description;
        vm.financialCenter = data.branch.description;
        vm.discretionaryContractFlag = data.discretionaryContractFlag;
        vm.eligibleClientFlag = data.eligibleClientFlag;
        vm.ownPositionFlag = data.ownPositionFlag;
        vm.contractNumber = data.contractNumber;


        vm.close = function(){
            $uibModalInstance.dismiss();
        };

        vm.done = function(){
            $uibModalInstance.close();
        };

    }

    angular.module( 'actinver.controllers' )
        .controller( 'detailContractCtrl', detailContractCtrl );

} )();
