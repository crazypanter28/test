(function () {
    "use strict";

    function employeeCtrl(administratorModalsSrv, CommonModalsSrv, NgTableParams, EmployeeAdminSrv, userConfig) {

        var vm = this;

        function setup() {
            setupVars();
            getEmployeeMap();
        }

        vm.updateSearch = function () {
            var term = vm.name;
            vm.tableParams.filter({ $: term });
        };

        vm.showModalCreateEmployee = function () {
            administratorModalsSrv.admonEmployee('Nuevo mapeo')
                .then(function (_model) {
                    _model.idEmployeeRegister = vm.sadviser.employeeID;
                    EmployeeAdminSrv.saveEmployeeMap(_model)
                        .then(function (result) {
                            if (result.success) {
                                CommonModalsSrv.done(result.data);
                                getEmployeeMap();
                            } else {
                                CommonModalsSrv.error(result.data);
                            }
                        });
                    }
                ).catch(function(res) {
                    if (!(res === 'cancel' || res === 'escape key press' || res === 'backdrop click' || typeof res === 'undefined')) {
                        throw res;
                    }
                });
        };

        vm.showModalRemoveEmployee = function (_id) {
            CommonModalsSrv.warning('¿Estás seguro de eliminar el mapeo?').result
                .then(function () {
                    EmployeeAdminSrv.removeEmployeeMap(_id)
                        .then(function (result) {
                            if (result.success) {
                                CommonModalsSrv.done(result.data);
                                getEmployeeMap();
                            } else {
                                CommonModalsSrv.error(result.data);
                            }
                        });
                }).catch(function (res) {
                    if (!(res === 'cancel' || res === 'escape key press' || res === 'backdrop click')) {
                        throw res;
                    }
                });
        };

        function getEmployeeMap() {
            vm.loadingEmpl = true;
            EmployeeAdminSrv.getEmployeeMap(vm.sadviser.employeeID)
                .then(function (_res) {
                    setTable(_res);
                }).catch(function () {
                    vm.errorLoadingEmpl = true;
                }).finally(function () {
                    vm.loadingEmpl = false;
                });
        }

        function setupVars() {
            vm.sadviser = userConfig.user;
        }

        function setTable(_list) {
            vm.tableParams = new NgTableParams(
                { count: 10 },
                { dataset: _list }
            );
        }

        setup();
    }

    angular.module('actinver.controllers')
        .controller('employeeCtrl', employeeCtrl);
})();
