(function () {
    "use strict";

    angular.module('actinver.controllers').controller('detailPerformCtrl', detailPerformCtrl);

    function detailPerformCtrl(PerformanceSrv, $stateParams, $state,cfpLoadingBar) {

        var vm = this;
        var model;
        var doc;
       

        if (!$stateParams.model) {
            $state.go('simulators.performance');
            return '';
        }

        setup();

        function setup() {
            setupVars();
            loadSmt01();
        }

        function setupVars() {
            model = $stateParams.model;
            doc = document.getElementById('chartjs-tooltip2');
        }

        function loadSmt01() {
            var sendModel = PerformanceSrv.sendModel(model);
            loadSmt02(sendModel);
            PerformanceSrv.SimulatorRest('smt01', sendModel.send)
                .then(function (_res) {
                    vm.amounts = PerformanceSrv.calculate(model.virtualAmount, _res);
                    vm.smt01 = _res.issuers;
                    vm.chartLine = PerformanceSrv.setupDataLine(_res.simulator);
                    vm.chartDonut = PerformanceSrv.setDonutChart(vm.smt01, doc, model);
                });
        }

        function loadSmt02(sendModel){
            //vm.spinner = true;
            PerformanceSrv.SimulatorRest('smt02', sendModel.send)
                .then(function(_res){
                    vm.smt02 = _res;
                });
        }

        vm.viewDetail = function () {
            vm.viewMore = true;
            vm.newCharts = [];
            var graphs = [];
            
            graphs.push(PerformanceSrv.getType('debt', model.send.issuers,vm.smt01, 'DEUDA'));
            graphs.push(PerformanceSrv.getType('rent', model.send.issuers,vm.smt01, 'RENTA VARIABLE'));
            graphs.push(PerformanceSrv.getType('din', model.send.issuers,vm.smt01, 'DINÁMICOS'));
            graphs.push(PerformanceSrv.getType('MERCADO DE CAPITALES', model.send.issuers,vm.smt01, 'MERCADO DE CAPITALES'));
            
            vm.newCharts = PerformanceSrv.getGraps(graphs,doc,model);          
        };

        vm.downloadPDF =  function () {
            cfpLoadingBar.start();
            setTimeout(unBlockDetail, 5000);

        };

        function unBlockDetail(){
            cfpLoadingBar.complete();
        }



    }
})();
