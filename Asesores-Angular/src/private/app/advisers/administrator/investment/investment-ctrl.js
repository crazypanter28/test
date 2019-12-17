(function () {
    "use strict";

    function investmentCtrl(administratorModalsSrv, CommonModalsSrv, proposalsProposalSrv, InvestmentAdminSrv, NgTableParams) {
        
        var vm = this;

        function setup() {
            getFundTypes();
        }

        vm.showModalCreateInvestment = function () {
            administratorModalsSrv.admonInvestment('Agregar nuevo')
                .then(function (_model) {
                    InvestmentAdminSrv.saveInvestment(_model)
                        .then(function (result) {
                            if (result.success) {
                                if (_model.type === 'fund') {
                                    CommonModalsSrv.done(result.data);
                                    getFundTypes();
                                    return;
                                }
                                CommonModalsSrv.done(result.data);
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

        vm.showModalEditInvestment = function (_investment) {
            administratorModalsSrv.admonInvestment('Editar fondo', _investment)
                .then(function (_model) {
                    InvestmentAdminSrv.updateInvestment(_model)
                        .then(function (result) {
                            if (result.success) {
                                CommonModalsSrv.done(result.data);                               
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

        vm.showModalRemoveInvestment = function (_id) {
            CommonModalsSrv.warning('¿Estás seguro de eliminar el fondo ACTIREN?').result
                .then(function () {
                    InvestmentAdminSrv.removeInvestment(_id)
                        .then(function (result) {
                            if (result.success) {
                                CommonModalsSrv.done(result.data);
                                getFundTypes();
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

        function getFundTypes() {
            vm.loadingInvest = true;
            InvestmentAdminSrv.getFundTypes().then(function (_res) {
                getFunds(_res);
            }, function () {
                vm.errorLoadginInvest = true;
                vm.loadingInvest = false;
            });
        }

        function refactoringFunds(_funds, _types) {
            var type;
            return _funds.map(function (_fund) {
                type = R.find(function (_type) {
                    return _type.idFundType === _fund.idFundType;
                }, _types || []);
                _fund.clasification = type || '';
                return _fund;
            });
        }

        function getFunds(_types) {
            proposalsProposalSrv.getIssuersInfo().then(function (_res) {
                setTable(refactoringFunds(_res.data, _types));
                vm.loadingInvest = false;
            });
        }

        function setTable(_list) {
            var defaults = {
                page: 1,
                count: 6,
            };

            vm.configTable = new NgTableParams(defaults, {
                paginationMaxBlocks: 4,
                paginationMinBlocks: 2,
                dataset: _list,
            });
        }

        setup();
    }

    angular.module('actinver.controllers')
        .controller('adminInvestmentCtrl', investmentCtrl);
})();
