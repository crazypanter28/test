(function () {
    'use strict';

    function accountStateResumeCtrl($scope, $uibModal, CommonModalsSrv, $rootScope, $sessionStorage, accountStateSrv) {
        var vm = this;

        var user = JSON.parse($sessionStorage.user);
        vm.year = moment().format('YYYY');
        var isRRHHH = user.roles.includes('RRHH');

        getYear();
        getMonth();

        $scope.colours = ['#1750a7', '#4868F5', '#609FF4', '#F1F50B', '#0DEDEA'];

        $scope.datasetOverride = [{
            fill: true,
            backgroundColor: [
                "#1750a7"
            ]
        }
        ];

        vm.monthSelected = null;
        vm.yearSelected = null;
        vm.employeeId = null;
        vm.banderaGeneration = false;
        vm.banderaIntegration = false;
        vm.banderaPayments = false;
        vm.detail = false;

        $scope.chartLabelsBank = ['BANCO %', 'CASA DE BOLSA %', 'CAMBIOS %', 'SEGUROS %'];
        $scope.chartDataBank = [];

        $scope.labelsHouse = [];
        $scope.dataHouse = [];

        $scope.labelsPayments = [];
        $scope.dataPayments = [];


        
     
        function getMonth(){
            if (vm.year == 2019) {

                vm.listMonth = {
                    optionMonth: [
                        { id: "05", text: "Mayo" },
                        { id: "06", text: "Junio" },
                        { id: "07", text: "Julio" },
                        { id: "08", text: "Agosto" },
                        { id: "09", text: "Septiembre" },
                        { id: "10", text: "Octubre" },
                        { id: "11", text: "Noviembre" },
                        { id: "12", text: "Diciembre" }
                    ]
                };

            }else{
                vm.listMonth = {
                    optionMonth: [
                        { id: "01", text: "Enero" },
                        { id: "02", text: "Febrero" },
                        { id: "03", text: "Marzo" },
                        { id: "04", text: "Abril" },
                        { id: "05", text: "Mayo" },
                        { id: "06", text: "Junio" },
                        { id: "07", text: "Julio" },
                        { id: "08", text: "Agosto" },
                        { id: "09", text: "Septiembre" },
                        { id: "10", text: "Octubre" },
                        { id: "11", text: "Noviembre" },
                        { id: "12", text: "Diciembre" }
                    ]
                };
            }

        } 

        //vm.listYear=[];
        function getYear() {
            if (vm.year == 2019) {
                vm.listYear = {
                    optionYear: [
                        { id: vm.year, text: vm.year }
                    ]
                };
            } else {
                vm.listYear = {
                    optionYear: [
                        { id: vm.year, text: vm.year },
                        { id: vm.year - 1, text: vm.year - 1 }
                    ]
                };
            }
        };

        //getInfo();






        $rootScope.detailAccountState = undefined;

        vm.getInfoIntegration = function () {
            if (vm.banderaIntegration == false) {
                vm.banderaIntegration = true;
            } else {
                vm.banderaIntegration = false;
            }
        }
        vm.getInfoGeneration = function () {
            if (vm.banderaGeneration == false) {
                vm.banderaGeneration = true;
            } else {
                vm.banderaGeneration = false;
            }
        }

        vm.getInfoPayments = function () {
            if (vm.banderaPayments == false) {
                vm.banderaPayments = true;
            } else {
                vm.banderaPayments = false;
            }
        }

        $rootScope.$watch('detailAccountState', function () {
            vm.detailAccountState = $rootScope.detailAccountState;
            getPercentageGeneration(vm.detailAccountState.result.generation);
            getPercentageIntegration(vm.detailAccountState.result.integration);
            getPercentagePayments(vm.detailAccountState.result);
        });

        $rootScope.$watch('detail', function () {
            vm.detail = $rootScope.detail;
        });

        vm.sendLogin = function () {
            var msg = false;
            if (vm.monthSelected == null) {
                msg = 'Seleccione un mes a consultar';
            } else if (vm.yearSelected == null) {
                msg = 'Seleccione un año a consultar';
            } else if (typeof vm.employeeId === 'undefined' || vm.employeeId == null) {
                msg = 'Ingrese numero de empleado';
            }

            if (msg) {
                CommonModalsSrv.error(msg);
            } else {
                $rootScope.month = vm.monthSelected.id;
                $rootScope.year = vm.yearSelected.id;
                $rootScope.employeeId = vm.employeeId;

                if (isRRHHH) {
                    accountStateSrv.getAccountStateRh($rootScope.month, $rootScope.year, $rootScope.employeeId, user.userName, "xxxxxxx", isRRHHH)
                        .then(function (result) {
                            //reset();
                            if (result.data.outCommonHeader.result.result !== 1) {
                                CommonModalsSrv.error(result.data.outCommonHeader.result.messages[0].responseMessage);

                            } else {
                                $rootScope.detailAccountState = result.data;
                                $rootScope.detail = true;
                            }
                        }
                        ).catch(function (res) {
                            if (!(res === 'cancel' || res === 'escape key press' || res === 'backdrop click' || typeof res === 'undefined')) {
                                throw res;
                            }
                        });
                } else {
                    openLogin();
                }

            }


        };

        function openLogin() {

            return $uibModal.open({
                templateUrl: '/app/advisers/goals/views/accountState/account-state-login.html',
                controller: 'accountStateLoginCtrl',
                controllerAs: 'login'
            }).result.finally(angular.noop).then(angular.noop, angular.noop);
        };

        vm.reset = function () {
            $rootScope.detail = false;
            vm.detail = $rootScope.detail;
            vm.monthSelected = null;
            vm.yearSelected = null;
            vm.employeeId = null;
            vm.banderaGeneration = false;
            vm.banderaIntegration = false;
            vm.banderaPayments = false;
        }

        vm.help = function () {
           
            return $uibModal.open({
                templateUrl: '/app/advisers/goals/views/accountState/account-state-help.html',
                controller: 'accountStateHelpCtrl',
                controllerAs: 'help'
            }).result.finally(angular.noop).then(angular.noop, angular.noop);
        }

        //$scope.chartLabels = ['Series A', 'Series B', 'Series C'];
        //$scope.chartData = [500, 200, 30];          

        function getPercentageGeneration(detail) {
            detail.commissionPercentage = Math.round((detail.commissionPercentage) * 100);
            $scope.chartDataBank = [];
            var total = detail.generationBank.bank + detail.generationBrokerageHouse.brokerageHouse + detail.generationChanges.changes + detail.generationInsurance.insurance;
            $scope.chartDataBank.push(Math.round((detail.generationBank.bank / total) * 100));
            $scope.chartDataBank.push(Math.round((detail.generationBrokerageHouse.brokerageHouse / total) * 100));
            $scope.chartDataBank.push(Math.round((detail.generationChanges.changes / total) * 100));
            $scope.chartDataBank.push(Math.round((detail.generationInsurance.insurance / total) * 100));


        }

        function getPercentageIntegration(detail) {

            $scope.labelsHouse = [];
            $scope.seriesHouse = [];
            $scope.dataHouse = [];
            vm.dataHouseFinal = [];
            var porBase = (detail.percentageBase) * 100;

            var listRespaldo = detail.listDetailIntegrationChart;

            listRespaldo.forEach(function (element) {

                $scope.labelsHouse.push(new String(element.name));
                $scope.dataHouse.push(element.percentage);

            });
            
            detail.percentageBase = Math.round((detail.percentageBase) * 100);
            $scope.seriesHouse.push(" % ");

            vm.dataHouseFinal.push( $scope.dataHouse);

        };
        function getPercentagePayments(detail) {

            $scope.labelsPayments = [];
            $scope.dataPayments = [];

            $scope.labelsPayments.push("Comisiones del Mes" + "%");
            $scope.labelsPayments.push("Referenciados" + "%");
            $scope.labelsPayments.push("Seguros" + "%");
            $scope.labelsPayments.push("Arrendamientos" + "%");
            $scope.labelsPayments.push("Crédito" + "%");
            $scope.dataPayments.push(Math.round((detail.generation.commission / detail.payments.total) * 100));
            $scope.dataPayments.push(Math.round((detail.payments.referenced / detail.payments.total) * 100));
            $scope.dataPayments.push(Math.round((detail.payments.insurance / detail.payments.total) * 100));
            $scope.dataPayments.push(Math.round((detail.payments.leases / detail.payments.total) * 100));
            $scope.dataPayments.push(Math.round((detail.payments.credit / detail.payments.total) * 100));


        };




    }

    angular
        .module('actinver.controllers')
        .controller('accountStateResumeCtrl', accountStateResumeCtrl);

})();
