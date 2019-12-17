(function () {
    'use strict';

    function tracingFormCtrl($scope, userConfig, proposalsTracingSrv, CommonModalsSrv) {
        var vm = this;
        vm.search_form = {
            finish: false,
            sent: false,
            contract: null,
            typeContractSelected: { id: "998", text: "Casa" },
            optionTypeContract:[
                { id: "998", text: "Casa" },
                { id: "999", text: "Banco" }
            ]
        };


        // Set current adviser
        vm.sadviser = userConfig.user;
    
        var d= new Date();
        d.setDate(d.getDate()-1);

        // Datepicker options
        vm.datepicker_opts = {

            isInvalidDate: function (date) {
                return (date.day() === 0 || date.day() === 6) ? true : false;
            },
            maxDate: d
        };

        // Delete properties on false
        vm.resetChilds = function (parent, child) {
            if (!$scope.model.form[parent]) {
                delete $scope.model.form[child];
            }
        };

        // Submit search form
        vm.submitSearch = function () {
            vm.search_form.finish = false;
            vm.search_form.sent = true;
            $scope.model.form = {
                scontract: ''
            };

            proposalsTracingSrv.getContractInfo( vm.search_form.contract, vm.search_form.typeContractSelected.id)
                .then(function successCallback(response) {
                    var info = response.data;
                    if(response.success){
                        if (info.numContrato !== 0) {
                            $scope.model.form.scontract = info;
                            if(vm.search_form.typeContractSelected.id==='999'){
                                $scope.model.form.scontract.origen="BANCO";                            }
                        } else {
                            $scope.model.form.scontract = '';
                        }
                    }else{
                        $scope.model.form.scontract = '';
                        CommonModalsSrv.error(response.message);
                    }                 
                }, function errorCallback(error) {
                    CommonModalsSrv.error(error.message);                    
                }).finally(function () {
                    vm.search_form.finish = true;
                    vm.search_form.sent = false;
                });

        };
    }

    angular
        .module('actinver.controllers')
        .controller('tracingFormCtrl', tracingFormCtrl);

})();