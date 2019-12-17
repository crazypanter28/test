(function () {
    'use strict';

    function accountCtrl($uibModal, $state, pResumeSrv, $scope, $q, $sessionStorage, CommonModalsSrv, accountSrv, accountModalSrv, $rootScope, ErrorMessage, accountContractModalSrv) {
        var vm = this;
        vm.type_contract = {
            id: 0
        };

        $scope.operations.show_instructions = true;

        // Search types
        vm.search_types = accountSrv.search_types;
        vm.contract_type = accountSrv.type_contract;
        vm.person_type = accountSrv.type_person;

        // Selected type
        /*vm.selected_type = {};*/

        // Contract search
        vm.contracts_search = {
            finish: false,
            sent: false
        };

        vm.portfolioTable = [
            {"topic": "totalSD", "name": "Fondos de Deuda", "nom": "SD", "abbr": "FD", "totalDebtInstruments": 0, "percent": 0, "color": "#00bebe"},
            {"topic": "totalSI", "name": "Fondos de Renta Variable", "nom": "SI", "abbr": "RV", "totalPledgedValues": 0, "percent": 0, "color": "#fa596d"},
            {"topic": "totalSC", "name": "Fondos de Cobertura", "nom": "SC", "abbr": "FC", "notDefined2": 0, "percent": 0, "color": "#f9be00"},
            {"topic": "totalMD", "name": "Mercado de Dinero", "nom": "MD", "abbr": "MD", "notDefined": 0, "percent": 0, "color": "#7ed321"},
            {"topic": "totalMC", "name": "Mercado de Capitales", "nom": "MC", "abbr": "MC", "totalCapitalInstruments": 0, "percent": 0, "color": "#e21599"},
            {"topic": "totalSettlementOperations", "name": "Pendientes por Liquidar", "nom": "OL", "abbr": "OL", "totalSettlementOperations": 0, "percent": 0, "color": "#ccc"},
            {"topic": "totalBlockedBalance", "name": "Efectivo en Tránsito", "nom": "ET", "abbr": "ET", "totalBlockedBalance": 0, "percent": 0, "color": "#B39DDB"},
            {"topic": "totalIP", "name": "CEDES y Pagarés", "nom": "IP", "abbr": "IP", "totalIP": 0, "percent": 0, "color": "#fa596d"},
            {"topic": "totalVG", "name": "Valores en Garantía", "nom": "VG", "abbr": "VG", "totalVG": 0, "percent": 0, "color": "#00bebe"},
            {"topic": "totalCash", "name": "Efectivo", "nom": "EF", "abbr": "EF", "totalCash": 0, "percent": 0, "color": "#3c86f6"},
        ];

        initChart();

        function initChart () {
            if( localStorage.getItem('__chart') !== ''){
                vm.chart_info = JSON.parse(localStorage.getItem('__chart'));
                if($sessionStorage.sclient){
                    getClientContracts($sessionStorage.sclient.data.clientNumber, $sessionStorage.sclient.data, $sessionStorage.sclient.contracts_list);
                }
            }
        }

        vm.clean = function () {
            vm.client = '';
            vm.person = {};
        };

        vm.showDetail = function (contract) {
            var model = {
                contractNumber: contract.contractNumber,
                clientNumber:  $scope.operations.sclient.data.clientNumber,
                bankingArea: contract.bankingArea
            };

            accountSrv.getContractInfoDetail(model).then(function (data) {
                $uibModal.open({
                    templateUrl: '/app/operations/account/detail/detail-contract.html',
                    controller: 'detailContractCtrl',
                    controllerAs: 'detailContract',
                    windowClass: 'table-detail',
                    resolve: {
                        data: function () {
                            return data;
                        }
                    }
                });
            }).catch(function () {
                CommonModalsSrv.error("No se pudo consultar el detalle del contrato");
            });
        };

        // Available colors
        vm.chart_line_colors = accountSrv.displayChart(null).options.colors;

        vm.cleanForm = function () {
            vm.contract = null;
            vm.client = null;
            vm.person = null;
        };

        function sendContract(response) {
            if(response.length === 2){
                accountContractModalSrv.detail({
                    list: response,
                    contract : vm.contract
                }).result.then(function () {
                    getMoney($rootScope.selectedContact.clientNumber);
                });
            }else if(response.length === 1){
                getMoney(response[0].clientNumber);
            }
        }

        function getMoney(_client){
            accountSrv.getContractByAdviser(_client).then(function successCallback(response) {
                if (response.success) {
                    $scope.operations.sclient.contracts_adviser = response.data.contract;
                    getClientContracts(response.data.client[0].clientNumber, response.data.client[0], response.data.contract, 998);
                } else {
                    CommonModalsSrv.error(response.msg);
                }
            }, function errorCallback(error) {
                var message;
                if (error.type === 'not-found') {
                    $scope.operations.showSystemError();
                } else {
                    message = error.info.error.responseMessage ? error.info.error.responseMessage : 'No se han encontrado los datos con el criterio seleccionado.<br />Te pedimos vuelvas a intentar.';
                    CommonModalsSrv.error(message);
                }
                deleteCurrentClient();
            });
        }

        // Submit search form
        vm.submitSearch = function () {
            deleteCurrentClient();
            vm.contracts_search.sent = true;
            var _contractType = vm.type_contract.id || '';

            if (vm.client) {
                accountSrv.getContractByAdviser(vm.client)
                    .then(function successCallback(response) {
                        if (response.success) {
                            $scope.operations.sclient.contracts_adviser = response.data.contract;
                            getClientContracts(vm.client, response.data.client[0], response.data.contract, _contractType);
                        } else {
                            CommonModalsSrv.error(response.msg);
                        }
                    }, function errorCallback(error) {
                        if (error.type === 'not-found') {
                            $scope.operations.showSystemError();
                        } else {
                            CommonModalsSrv.error(ErrorMessage.createError(error.messages));
                        }
                        deleteCurrentClient();
                    });
            } else if (vm.contract) {
                var _list = [];
                //BANCO
                accountSrv.getClientInfo(vm.contract, vm.contract, 999)
                    .then(function successCallback(response) {
                        response.info[0].areaType = 'Banco';
                        _list.push(response.info[0]);
                        accountSrv.getClientInfo(vm.contract, vm.contract, 998)
                            .then(function successCallback(response) {
                                response.info[0].areaType = 'Casa';
                                _list.push(response.info[0]);
                                sendContract(_list);
                            }, function errorCallback() {
                                sendContract(_list);
                                //CommonModalsSrv.error(error.info.error.responseMessage);
                                //deleteCurrentClient();
                            });
                    }, function errorCallback(error) {
                        //CASA
                        accountSrv.getClientInfo(vm.contract, vm.contract, 998)
                            .then(function successCallback(response) {
                                response.info[0].areaType = 'Casa';
                                _list.push(response.info[0]);
                                sendContract(_list);
                            }, function errorCallback(_error) {
                                CommonModalsSrv.error(error.info.error.responseMessage);
                                deleteCurrentClient();
                            });
                    });

            } else if (vm.person) {
                var message;
                if (vm.person.name ) {
                    var search = (vm.person.name ? vm.person.name.toUpperCase() : "");
                    accountModalSrv.detail({
                        list: [],
                        wordToSearch: search,
                        personType: '1'
                    }).result.then(function () {
                        accountSrv.getContractByAdviser($rootScope.selectedClient.uniqueClientNumber)
                            .then(function successCallback(response) {
                                if (response.success) {
                                    $scope.operations.sclient.contracts_adviser = response.data.contract;
                                    getClientContracts(response.data.client[0].clientNumber, response.data.client[0], response.data.contract, _contractType);
                                } else {
                                    CommonModalsSrv.error(response.msg);
                                }
                            }, function errorCallback(error) {
                                var message;
                                if (error.type === 'not-found') {
                                    $scope.operations.showSystemError();
                                } else {
                                    message = error.info.error.responseMessage ? error.info.error.responseMessage : 'No se han encontrado los datos con el criterio seleccionado.<br />Te pedimos vuelvas a intentar.';
                                    CommonModalsSrv.error(message);
                                }
                                deleteCurrentClient();
                            });
                        //getClientContracts( $rootScope.selectedClient.clientNumber, $rootScope.selectedClient, '' );
                    });

                } else {
                    accountSrv.getClientName(vm.person)
                        .then(function successCallback(response) {
                            if (response.info[0]) {
                                accountModalSrv.detail({
                                    list: response.info,
                                    wordToSearch: '',
                                    personType: '2'
                                }).result.then(function () {
                                    accountSrv.getContractByAdviser($rootScope.selectedClient.clientNumber)
                                        .then(function successCallback(response) {
                                            if (response.success) {
                                                $scope.operations.sclient.contracts_adviser = response.data.contract;
                                                getClientContracts(response.data.client[0].clientNumber, response.data.client[0], response.data.contract, _contractType);
                                            } else {
                                                CommonModalsSrv.error(response.msg);
                                            }
                                        }, function errorCallback(error) {
                                            var message;
                                            if (error.type === 'not-found') {
                                                $scope.operations.showSystemError();
                                            } else {
                                                message = error.info.error.responseMessage ? error.info.error.responseMessage : 'No se han encontrado los datos con el criterio seleccionado.<br />Te pedimos vuelvas a intentar.';
                                                CommonModalsSrv.error(message);
                                            }
                                            deleteCurrentClient();
                                        });
                                    //getClientContracts( $rootScope.selectedClient.clientNumber, $rootScope.selectedClient, '' );
                                });
                            } else {
                                message = 'No se han encontrado los datos con el criterio seleccionado.<br />Te pedimos vuelvas a intentar.';
                                CommonModalsSrv.error(message);
                                deleteCurrentClient();
                            }
                        }, function errorCallback(error) {
                            if (error.type === 'not-found') {
                                $scope.operations.showSystemError();
                            } else {
                                message = error.info.messages ? error.info.messages[0].responseMessage : 'No se han encontrado los datos con el criterio seleccionado.<br />Te pedimos vuelvas a intentar.';
                                CommonModalsSrv.error(message);
                            }
                            deleteCurrentClient();
                        });

                }
            }
        };

        // Delete current selected user
        function deleteCurrentClient() {
            vm.contracts_search = {
                finish: false,
                sent: false
            };
            $scope.operations.sclient = {};
            delete $sessionStorage.sclient;
        }

        vm.contractSelection = function(_contract, _type) {
            var _model = {
                bankingArea: _contract.bankingArea,
                contractNumber: _contract.contractNumber,
                clientNumber:  $scope.operations.sclient.data.clientNumber
            }, marketType = _type; 
            _contract.isDinn = false;
            
            if(_contract.bankingArea === '999' && _type === 'MC')
                marketType = 'CM';
            
            accountSrv.getContractInfoDetail(_model).then(function (_res) {
                if(_res.contractType.contractID == '14' && _res.contractSubType.subtype == '02')
                    _contract.isDinn = true;
            }).catch(function () {
                CommonModalsSrv.error("No se pudo obtener el detalle del contrato");
            });
            
            localStorage.setItem('_marketType', JSON.stringify(marketType));
            localStorage.setItem('contractSelected', JSON.stringify(_contract));
            $state.go('investment.funds');
        };
        // Get client contracts information
        function getClientContracts(client, _user, _contracts) {
            pResumeSrv.getContractResume(  client  ).then( function( contracts ) {
                vm.exchange_rates = [];
                vm.portfolio_totals = 0;
                vm.portfolio_totals = contracts.data.result.totalValue;
                var _percent = contracts.data.result.positionHousePercentage;

                angular.forEach( vm.portfolioTable, function ( item, key ) {
                    vm.portfolioTable [ key ].percent = _percent [item.topic];
                } );

                vm.chart_info = {
                    chart:  pResumeSrv.setChartInfo(vm.portfolioTable)
                };

                localStorage.setItem('__chart',JSON.stringify(vm.chart_info));

                var promises = [];
                angular.forEach(contracts.data.result.contract, function ( contract ) {
                    var _bankingArea = contract.bankingArea;
                    if (client === 'nosaldo') {
                        contract = 'nosaldo';
                    } else if (client === 'nosaldo2') {
                        contract = 'nosaldo' + contract.contractNumber;
                    } else {
                        contract = contract.contractNumber;
                    }
                    if (_bankingArea === '998') {
                        promises.push(accountSrv.getContractHistorical(contract));
                    } else {
                        promises.push(accountSrv.getBrokerHistoricalBalanceQuery(contract, 12));
                    }
                });

                return $q.all(promises).then(function (contract) {
                    vm.porfolio = contracts.data.result.contract;
                    var _validContract = [];
                    angular.forEach(contracts.data.result.contract, function (item) {
                        R.forEach(function (value) {
                            if (value.contractNumber === item.contractNumber) {
                                if(item.portfolio !== null){
                                    value.portfolio = item.portfolio;
                                    value.totalBalance = item.portfolio.totalFinal;
                                }
                            }
                        }, _contracts);
                    });

                    angular.forEach(contract, function (item) {
                        if ( item.historical) {
                            _validContract.push(item);
                        }
                    });

                    var _contracts2 = [];
                    var emptyList;
                    vm.contracts_search.finish = true;
                    $scope.operations.sclient.contracts_list = _contracts;
                    $scope.operations.sclient.balance = true;

                    vm.colors_chart = [];
                    R.forEach(function (value) {
                        var indexcolor = 0;
                        R.forEach(function (contract) {
                            if (contract.contractNumber === value.historical.contractNumber) {
                                if (contract.totalBalance) {
                                    value.empty = false;
                                    vm.colors_chart.push(vm.chart_line_colors[indexcolor]);
                                } else {
                                    value.empty = true;

                                }
                            }
                            indexcolor++;
                        }, _contracts);

                        if (!value.empty) {
                            _contracts2.push(value);
                        }
                    }, _validContract);
                    // Set client information
                    emptyList = _contracts2.length === 0 ? true : R.find(function (_val) {
                        return _val.empty;
                    }, _contracts2);
                    if (emptyList) {
                        $scope.operations.sclient.checked_all_contracts = true;
                        $scope.operations.sclient.balance = false;
                    }
                    // ******Once fixed the service "brokerHistoricalBalanceQuery", delete this part****
                    angular.forEach(_contracts2, function (some) {
                        if(some.historical && some.historical.historicalInfo && some.historical.historicalInfo.length >= 1 && some.historical.historicalInfo.length <= 11 ){
                            var lastNumber = some.historical.historicalInfo.length;
                            var lastValue = some.historical.historicalInfo[lastNumber-1];
                            var year = lastValue.paymentPeriod.substring(0,4);
                            var month = lastValue.paymentPeriod.substring(4,6);
                            var newDate = new Date (parseInt(year),parseInt(month-1),parseInt("01"));

                            while(lastNumber < 12){
                                newDate.setMonth( newDate.getMonth() - 1 );
                                lastNumber++;
                                var dateTwo = moment( newDate ).format( 'YYYYMM' );
                                some.historical.historicalInfo.push({paymentPeriod: dateTwo, amount: null});
                            }
                            some.historical.historicalInfo.reverse();
                        }
                    });
                    // **************************** Delete until here ******************************

                    if(_user.personType === "1"){
                        $scope.operations.sclient.data = _user;
                    }else{
                        _user.name = _user.companyName;
                        $scope.operations.sclient.data = _user;
                    }

                    for(var i=0; i< $scope.operations.sclient.contracts_list.length; i++){
                        if($scope.operations.sclient.contracts_list[i].bankingArea === "998"){
                            $scope.operations.sclient.contracts_list[i].companyName = 'Casa';
                        }else{
                            $scope.operations.sclient.contracts_list[i].companyName = 'Banco';
                        }
                    }

                    // Check all contracts balance
                    $scope.operations.sclient.chart = _contracts2;

                    $sessionStorage.sclient = $scope.operations.sclient;

                }).catch(function (error) {
                    CommonModalsSrv.error(ErrorMessage.createError(error.data.messages));
                });

            }, function errorCallback( info ){
                var message;
                if( info.type === 'not-found' ){
                    $scope.operations.showSystemError();
                } else {
                    vm.portfolio_totals = 0;
                    message = info.result ? info.result : 'Se Encontró Un Error Favor De Intentarlo Más Tarde';
                    CommonModalsSrv.error( message );
                }
            } );
        }

    }

    angular
        .module('actinver.controllers')
        .controller('accountCtrl', accountCtrl);

})();
