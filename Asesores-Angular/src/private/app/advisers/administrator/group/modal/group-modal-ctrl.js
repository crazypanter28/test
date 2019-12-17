( function(){
    "use strict";

    function admonGroupModalCtrl( $uibModalInstance, group, NgTableParams, GroupSrv, CommonModalsSrv ){
        var vm = this;


        function setup () {
            getDropdowns();
            setupVars();
            setTableUsers();
            setTableCenters();
        }

        vm.search = function( _id ){
            var term = vm[ _id ];
            if( _id === 'table2'){
                vm.configTable2.filter({ $: term});
            }
            else{
                vm.configTable.filter({ $: term});
            }
        };

        vm.addUser = function() {
            var sendModel ={
                idTargetGroup: group.idTargetGroup,
                idEmployee: vm.userSelected.idEmployee,
                language: 'SPA'
            };

            GroupSrv.service( 'saveUser', 'POST',  sendModel )
            .then(function(){
                vm.disabledModal = true;
                CommonModalsSrv.done( 'El Usuario se agregó de manera exitosa.' )
                .result.finally(function(){
                    vm.disabledModal = false;
                });
                group.users.push( angular.copy(vm.userSelected) );
                setTableUsers();
                vm.userSelected = null;
            });
        };

        vm.deleteUser = function( _user ){
            var sendModel ={
                idTargetGroup: group.idTargetGroup,
                idEmployee: _user.idEmployee,
                language: 'SPA'
            };
            GroupSrv.service( 'deleteUser', 'POST',  sendModel )
            .then(function(){
                vm.disabledModal = true;
                CommonModalsSrv.done( 'El Usuario se elimino de manera exitosa.' )
                .result.finally(function(){
                    vm.disabledModal = false;
                });
            });
        };

        vm.addFinancial = function() {
            var sendModel ={
                idTargetGroup: group.idTargetGroup,
                keyCenter: vm.financialCenterSelected.keyCenter,
                language: 'SPA'
            };

            GroupSrv.service( 'saveCenter', 'POST', sendModel )
            .then(function(){
                vm.disabledModal = true;
                CommonModalsSrv.done( 'El Centro Financiero se agregó de manera exitosa.' )
                .result.finally(function(){
                    vm.disabledModal = false;
                });
                group.financialCenters.push( angular.copy(vm.financialCenterSelected) );
                setTableCenters();
                vm.financialCenterSelected = null;
            });

        };

        vm.deleteFinancial = function( _center ) {
            var sendModel ={
                idTargetGroup: group.idTargetGroup,
                keyCenter: _center.keyCenter,
                language: 'SPA'
            };

            GroupSrv.service( 'deleteCenter', 'POST', sendModel )
            .then(function(){
                vm.disabledModal = true;
                CommonModalsSrv.done( 'El Centro Financiero se elimino de manera exitosa.' )
                .result.finally(function(){
                    vm.disabledModal = false;
                });
            });

        };

        vm.close = function(){
            $uibModalInstance.dismiss();
        };


        vm.done = function(){
          $uibModalInstance.close( vm.group );
            $uibModalInstance.close( vm.employee );

        };

        function getDropdowns(){
            GroupSrv.service('financialCenters').then(function(_res){
                vm.financialCenters = _res.map( function( _val){
                    _val.text = _val.financialCenter;
                    return _val;
                });
            });
            GroupSrv.service('userGroups').then(function(_res){
                vm.users = _res.map( function( _val){
                    _val.text = _val.userCode;
                    return _val;
                });
            });
        }


        function setTableCenters(){
            var initialParams = {
                count: 5 // initial page size
            };
            var initialSettings = {
                dataset: group.financialCenters,
                paginationMaxBlocks: 4,
                paginationMinBlocks: 2,
            };
            vm.configTable = new NgTableParams( initialParams, initialSettings);

        }
        function setTableUsers(){
            var initialParams = {
                count: 5 // initial page size
            };
            var initialSettings2 = {
                dataset: group.users,
                paginationMaxBlocks: 4,
                paginationMinBlocks: 2,
            };
            vm.configTable2 = new NgTableParams( initialParams, initialSettings2);
        }

        function setupVars () {
            vm.group = group;
        }

        setup();

    }

    angular.module( 'actinver.controllers' )
        .controller( 'admonGroupModalCtrl', admonGroupModalCtrl );

} )();
