(function () {
    'use strict';
    angular
            .module('actinver.controllers')
            .controller('insuranceCtrl', insuranceCtrl);

    function insuranceCtrl(insuranceSrv, $scope, $sessionStorage) {
        var vm = this;
        var user = JSON.parse($sessionStorage.user);
        vm.role = user.roles.includes('SEGUROS'); 
        vm.agentList = [];
        $scope.agentDisabled = false;
        
        if ($scope.agentLength === undefined) {
            insuranceSrv.getAgent().then(function (_res) {
                if(_res.success) {
                    $scope.agentLength = 0;
                    angular.forEach(_res.info, function (value) {
                        vm.agentList.push({
                            id: value.claveMapfre,
                            text: value.claveMapfre + ' | ' + value.idNegocio
                        });
                        if (value.idNegocio.toString().toUpperCase().startsWith("CB"))
                            $scope.agentSelected = vm.agentList[$scope.agentLength];
                        ++$scope.agentLength;
                    });
                    if ($scope.agentLength === 0) 
                        vm.agentList.push({
                            id: 5988,
                            text: '5988' + ' | ' + 'Actinver'
                        });
                    if ($scope.agentSelected === undefined)
                        $scope.agentSelected = vm.agentList[0];
                } else {
                    vm.agentList = [];
                    $scope.agentSelected = [];
                }
            });
        }
    }
})();
