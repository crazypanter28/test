(function () {
    'use strict';

    function dollCtrl($rootScope, $scope, dollSrvFund, $filter, transfersSrv, contractTypeSrv, CommonModalsSrv, investmentSrv, $sessionStorage, ErrorMessage, loginSrvc) {

        var vm = this;
        var baseStation;
        var contract = JSON.parse(localStorage.getItem('contractSelected'));
        vm.contractType = contractTypeSrv.contractType(contract.isPropia, contract.isEligible, contract.isDiscretionary);
        vm.tipoMedio = {
            msg: '',
            showMsg: false
        };

        function resetTipoMedio(success, msg) {
            vm.tipoMedio.msg = success ? '' : msg;
            vm.tipoMedio.showMsg = !success;
        }

        function initBuy() {
            vm.cmd = {
                type: 'titles',
                media: {}
            };
            resetTipoMedio(true, '');
        }

        function initSell() {
            vm.cmd.typeBank = 'efectivo';
        }

        /**
         * @params {object} object datePicker
         **/
        function disableDatePicker(_datePicker) {
            var mode = _datePicker.mode;
            var date = _datePicker.date;
            var isHoliDay;

            if (mode === 'day') {
                var isDisable = R.find(function (_date) {
                    var _dtSrv = new Date(_date.operationDate);
                    return (date.getDate() === _dtSrv.getDate() && date.getMonth() === _dtSrv.getMonth() && date.getFullYear() === _dtSrv.getFullYear());
                }, vm.dollDescription.fund.operationDatesData.operationDateItem);

                if (isDisable) {
                    var isDisableDate = isDisable ? new Date(isDisable.operationDate) : null;
                    isHoliDay = R.find(function (_date) {
                        var _dtSrv = new Date(_date);
                        return (isDisableDate.getDate() === _dtSrv.getDate() && isDisableDate.getMonth() === _dtSrv.getMonth() && isDisableDate.getFullYear() === _dtSrv.getFullYear());
                    }, vm.dollDescription.fund.holidayDatesData.holidayDate);
                }

                return isHoliDay ? true : (isDisable ? false : true);
            }
            return false;
        }

        vm.stations = [];
        vm.currentDate = $filter('date')(new Date, 'dd/MM/yyyy');

        function loadDoll2() {
            dollSrvFund.getDoll2($scope.contract, vm.cmd.station, vm.tab, vm.anticipedSell).then(function (_res) {
                if (_res.data.outCommonHeader.result.result === 1) {
                    vm.dollDescription = _res.data.outFundQuery;
                    vm.cmd.dates = vm.dollDescription.fund.operationDatesData.operationDateItem[0];
                    vm.orderDate = vm.cmd.dates.operationDate;
                }
            });
        }


        vm.changeAnticipedSell = function () {
            loadDoll2();
        };

        $scope.datepickerOptions = {
            showWeeks: false,
            formatMonth: 'MMM',
            yearColumns: 3,
            dateDisabled: disableDatePicker,
        };


        /**
         * @param {date} date to find
         * @return {object} object with operationDate, settlementDate.
         **/
        function findDateExecution(_date) {
            return R.find(function (_operationDate) {
                return _operationDate.operationDate === _date;
            }, vm.dollDescription.fund.operationDatesData.operationDateItem);
        }

        /** Load stations for the input share in the doll
         * @param {int} id
         **/
        function loadStations(_new) {
            investmentSrv.getStations($scope.contract, _new).then(function (_res) {
                vm.stations = _res.data.outInvestmentIssuersQuery.issuer;
            });
            initBuy();

        }

        /**
         * These services are initialized when the station is changed
         **/
        function loadInit() {
            loadDoll2();
            dollSrvFund.getDollFund($scope.contract, vm.typeFund).then(function (_res) {
                if (_res.data.outCommonHeader.result.result === 1) {
                    vm.currentCash = _res.data.outA2KContractBalance;
                    $rootScope.currentCash = vm.currentCash;
                }
            });

            investmentSrv.getDetailStations((vm.cmd.station.issuerName || vm.cmd.station.issuer), vm.cmd.station.serie).then(function (_res) {
                if (_res.data.outCommonHeader.result.result === 1) {
                    var rulesArray = _res.data.outFundOperationDataQuery.fundOperationData;
                    vm.rulesBuy = R.find(function (_val) {
                        return _val.movementType.trim() === 'COMPRA';
                    }, rulesArray);
                    vm.rulesSell = R.find(function (_val) {
                        return _val.movementType.trim() === 'VENTA';
                    }, rulesArray);
                }
            });
        }

        transfersSrv.getMedia().then(function (_res) {
            var _media = _res.data.outContactMeansCatalog.contactMeansCatalogData.contactMeans;
            var _mediaType = [];
            angular.forEach(_media, function (value) {
                _mediaType.push({
                    id: value.key,
                    text: value.description
                });
            });
            vm.Media = _mediaType;
        });

        /**
         * @param {object} station object
         * @param {string} if the origin is input or external
         **/
        function reload(_station, _from) {
            vm.newState = false;
            //vm.tab = _from ? vm.tab: null;
            baseStation = _station;
            vm.cmd.station = baseStation;
            cleanModels();
            loadInit();
        }

        /**  Reset doll **/
        function cleanModels() {
            vm.cmd = {
                type: 'titles',
                media: {},
                station: baseStation,
            };
            vm.tipoMedio.showMsg = false;
            vm.captureModel = null;
            vm.confirmationModel = null;
            vm.cmd.dates = vm.dollDescription ? vm.dollDescription.fund.operationDatesData.operationDateItem[0] : null;
            resetTipoMedio(true, '');
        }

        vm.findDate = function () {
            vm.cmd.dates = findDateExecution(new Date(vm.orderDate).getTime());
        };

        vm.AddStation = function (_station) {
            vm.priceSelected = _station.lastPrice;
            reload(_station, 'input');
        };

        $scope.$watch('contract', function (_new, _old) {
            if (!R.equals(_new, _old)) {
                vm.newState = false;
                vm.tab = null;
                cleanModels();
                loadInit();
            }
        });

        $scope.$watch('station', function (_new, _old) {
            if ($scope.station) {
                if ($scope.station.lastPrice) {
                    vm.tab = 'buy';
                    vm.priceSelected = $scope.station.lastPrice;
                } else if ($scope.station.weightedLastPrice) {
                    vm.tab = 'sell';
                    vm.priceSelected = $scope.station.weightedLastPrice;

                }
            }
            if (!R.equals(_new, _old)) {
                reload(_new);
            }
        });

        $scope.$watch('id', function (_new, _old) {
            vm.typeFund = $scope.id;
            if (!R.equals(_new, _old)) {
                loadStations(_new);
            }
        });

        /** get absolute titles
         * @param {string} 'buy' or 'sell'
         **/
        $scope.changeSettlement2 = function (_model) {
            vm.cmd[_model].typeValue = $filter('currencyCustom')(vm.cmd[_model].typeValue2 / vm.priceSelected, 0);
        };

        /** get Importe
         * @param {string} 'buy' or 'sell'
         **/
        $scope.changeSettlement = function (_model) {
            vm.cmd[_model].typeValue2 = vm.cmd[ _model ].typeValue * vm.priceSelected;
        };

        /** Method to change the view on the doll
         * @param {string} 'buy' or 'sell'
         **/
        vm.changeTab = function (_tab) {
            if (_tab === 'sell') {
                initSell();
                dollSrvFund.getBanks($scope.contract).then(function (_res) {

                    if (_res.data && angular.isDefined(_res.data.outCommonHeader) && _res.data.outCommonHeader.result.result === 1) {
                        vm.bankModel = R.map(function (_val) {
                            _val.text = _val.bankAccounts.bankName;
                            return _val;
                        }, _res.data.outDestinationAccountQuery.outA2KBankAccountsQuery.bankAccountsList);
                    } else {
                        vm.bankModel = [];
                    }
                });
            }
            vm.newState = false;
            vm.tab = _tab;
            $scope.columnsExpand = false;
            $scope.focusElement();
            if (vm.cmd.station) {
                loadInit();
            }
        };

        /** create quotation **/
        vm.confirm = function () {
            vm.cmd.evtentType = vm.tab;
            dollSrvFund.confirmDoll(vm.cmd, $scope.contract, vm.anticipedSell).then(function (_res) {
                vm.confirmationModel = _res.data;

                if (vm.confirmationModel.issuerTitlesSold.amount === 0) {
                    vm.confirmationModel.issuerTitlesSold.amount = vm.confirmationModel.issuerTitlesSold.titlesQty * vm.priceSelected;
                }

                vm.confirmationModel.issuerTitlesSold.price = vm.priceSelected;
            },
                    function (_res) {
                        if (_res) {
                            var error = R.find(function (_val) {
                                if (_val.responseType === 'N') {
                                    return _val.responseCategory === 'FATAL' || _val.responseCategory === 'ERROR';
                                }
                            })(_res.data);
                            var message = error ? error.responseMessage : 'Se Encontró Un Error Favor De Intentarlo Más Tarde, Comuníquese Con Su Help desk';

                            CommonModalsSrv.error(message);
                        }
                        // .result.then(function() {});
                    });
        };

        /** capture quotation **/
        vm.capture = function () {
            var _user = $sessionStorage.sclient.data.name + ' ' + $sessionStorage.sclient.data.lastName + ' ' + $sessionStorage.sclient.data.secondLastName;

            dollSrvFund.captureDoll(vm.cmd, $scope.contract, _user, vm.confirmationModel, vm.anticipedSell, vm.contractType).then(function (_res) {
                if (_res.data.outCommonHeader.result.result === 1) {
                    var message;
                    if (_res.data.outCommonHeader.operationName === 'FundOrderRegistration') {
                        vm.captureModel = _res.data.outFundOrderRegistration.fundOrderResult;
                        message = 'La ' + (vm.tab === 'buy' ? 'compra' : 'venta') + ' se envió de manera correcta.';
                        message += '<br>Con el folio de la operación <b>' + vm.captureModel.issuerTitlesSold.operationReference + '</b>';
                    } else {
                        vm.captureModel = vm.confirmationModel;
                        message = _res.data.outAdviserPendingOpRegistration.operationsDetails[0].message;
                        message += '<br>Con el ID Registro <b>' + _res.data.outAdviserPendingOpRegistration.operationsDetails[0].operationID + '</b>';
                    }
                    cleanModels();
                    $scope.$emit('updateTab');
                    CommonModalsSrv.done(message);
                }
            }).catch(function (_res) {
                CommonModalsSrv.error(ErrorMessage.createError(_res.data));
            });
        };

        vm.cleanModels = cleanModels;

        /** modify method **/
        vm.modify = function () {
            vm.confirmationModel = null;
        };

        vm.finally = function () {
            cleanModels();
        };

        vm.onChangeTypeMedio = function (_last, _new) {
            //Medios electronicos id = 4
            if (_new.id === "4") {
                loginSrvc.validateUserTokens().then(function success(response) {
                    resetTipoMedio(response.success, response.msg);
                }).catch(function error(error) {
                    resetTipoMedio(error.success, error.msg);
                });
            } else {
                resetTipoMedio(true, '');
            }
        };

        loadStations($scope.id);

    }

    angular.module('actinver.controllers')
            .controller('dollCtrl', dollCtrl);


})();
