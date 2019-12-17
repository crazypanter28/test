(function () {
    'use strict';

    function capitalsLuminaDollCtrl($scope, $rootScope, capitalsLuminaDollSrv, ErrorMessage, TableStationsSrv, $log, CommonModalsSrv, $sessionStorage, loginSrvc) {
        var vm = this;
        //var titlesForOrders;
        var statusOrders = [
            { value: 'LP', type: 'basic' },
            { value: 'MC', type: 'basic' }
        ];
        vm.stepA = true;
        vm.bankingArea = '999';
        var contractSelected = JSON.parse(localStorage.getItem('contractSelected'));
        $scope.iscuentapropia = contractSelected.isPropia;
        vm.listTypeOperation  = [];
        vm.tipoMedio={
            msg : '',
            showMsg:false
        };

        setup();

        //recibe el evento que ha cambiado de tabs
        $rootScope.$on('select-emisora-toTable-changeTab',function(){
            changeEmisora();
        });

        function resetTipoMedio(success, msg){
            vm.tipoMedio.msg =  success ? '': msg;
            vm.tipoMedio.showMsg = !success;
        }

        function setup() {
            vm.stepA = true;
            setupVars();
            initLoads();
            getCurrentCash();
            searchTitles();
            getAllStations();
            loadTypeOperation();
        }

        vm.changeSelect = function () {
            vm.dataListTipoOrdenesFilter = vm.statusOrders[ 'basic'];
            vm.cmd.order.model = {
                term: 1
            };
        };

        vm.cleanModels = function () {
            setupVars();
            newState(false);
            resetTipoMedio(true, '');
        };

        vm.recalcularMontoAprox = function () {
            vm.montoaprox = vm.cmd.order.model.titles * vm.cmd.priceStation;
        };

        vm.changeOrdeType = function(){
            if(vm.cmd && vm.cmd.order && vm.cmd.order.value && vm.cmd.order.value.key !== 3 && vm.cmd.libroomesa === 'Desk'){ //si no es mercado
                vm.cmd.order.orderTypeOperation = null;               
            }
            vm.recalcularMontoAprox();

        };

        function changeEmisora () {
            $rootScope.$broadcast('select-emisora-toTable', vm.cmd.station);
        }

        $rootScope.$watch( 'actionStation', function(){
            if( $rootScope.actionStation && $rootScope.actionStation.operationType === 'Banco' ){
                vm.confirmationModel = null;
                vm.loading = false;
                vm.AddStation($rootScope.actionStation.station);
                $scope.contract = $rootScope.actionStation.contract;
                vm.changeTab($rootScope.actionStation.type);
            }
        });


        vm.changeTime = function () {
            $scope.time = true;
            if (parseInt(vm.cmd.order.model.term) > 1) {
                $scope.time = false;
            }
        };

        function validateStation(_station) {
            var name;
            var newStation = angular.copy(_station);
            if (typeof newStation.issuer !== 'object') {
                name = newStation.issuer;
                newStation.issuer = {
                    issuerName: name,
                    serie: newStation.serie
                };
            }
            return newStation;
        }

        vm.AddStation = function (_station) {
            if (_station) {
                vm.cmd.typeStock = '0'; //SE DEJA SOLO '0' ya que solo aplica para SOR --MC BCO
                vm.cmd.station = validateStation(_station);
                vm.cmd.priceStation = _station.tradeBuyPrice !== undefined ? _station.lastPrice : _station.weightedLastPrice;
                vm.cmd.ultimoecho = _station.lastPrice;
                //vm.tab = $rootScope.actionStation ? $rootScope.actionStation.type : ( vm.tab ? vm.tab : 'sell');
                vm.cmd.evtentType = vm.tab;
                vm.cmd.modify = _station.modify;
                vm.cmd.orderReference = _station.orderReference;
                searchTitles();
            }
        };


        function searchTitles(){
            if($rootScope.capitalsPortfolioBank !== undefined){
                vm.titlesForSell = R.find( function( _station){
                    if(vm.cmd.station !== undefined){
                        if(vm.cmd.station.weightedLastPrice ){
                            return _station.instrumentDesc.operationType === vm.cmd.station.issuer.issuerName;
                        }else{
                            return _station.instrumentDesc.operationType === vm.cmd.station.instrumentDesc;
                        }
                    }
                }, $rootScope.capitalsPortfolioBank );
            }
        }

        vm.AddStationfromdoll = function (_station) {
            vm.AddStation(_station);
            changeEmisora();
            getOrderCatalog();
        };

        vm.modify = function () {
            vm.confirmationModel = null;
        };

        vm.changeTab = function (_tab) {
            vm.tab = _tab;
            newState(false);
            vm.cmd.evtentType = _tab;
            $scope.columnsExpand = false;
            $scope.focusElement();
        };

        vm.cambioBolsaOperar = function (tipo){
            vm.typeStock = tipo.feed;
            vm.montoaprox = tipo === 'SOR' ? vm.montoaprox : null ;
            if($rootScope.statiosnTableBank && vm.cmd.station){
                var record = $rootScope.statiosnTableBank.filter(function(reg){
                    return reg.issuer.issuerSerie ===  vm.cmd.station.issuer.issuerSerie && reg.feed === tipo;
                });
                if(record && record.length>0){
                   vm.AddStationfromdoll(record[0]);
                }
            }
        };

        vm.confirm = function () {
            vm.loading = true;
            if (vm.cmd.order.type === 'stops') {
                confirmStop();
            } else {
                capitalsLuminaDollSrv.confirmDoll(vm.cmd, $scope.contract)
                    .then(function (_res) {
                        vm.confirmationModel = _res;
                    })
                    .catch(function (_res) {
                        var error = null;
                        if (_res.length >= 2) {
                            error = _res[1];
                        } else {
                            error = R.find(function (_val) {
                                if (_val.responseType === 'N' || _val.responseType === 'T') {
                                    return _val.responseCategory === 'FATAL' || _val.responseCategory === 'ERROR' || _val.responseCategory === 'INFO';
                                }
                            })(_res);
                        }


                        var message = error !== null ? error.responseMessage : 'Se Encontró Un Error Favor De Intentarlo Más Tarde, Comuníquese Con Su Help desk';
                        CommonModalsSrv.error(message);
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            }
        };

        vm.capture = function () {
            vm.loading = true;
            // var _user = $sessionStorage.sclient.data.name + ' ' + $sessionStorage.sclient.data.lastName + ' ' + $sessionStorage.sclient.data.secondLastName;
            capitalsLuminaDollSrv.captureDoll(vm.cmd, $scope.contract)
                .then(function (_res) {
                    var _total = (vm.cmd.priceStation * vm.cmd.order.model.titles).toFixed(2);
                    var message;

                    if (_res.outCommonHeader.operationName === 'CMEquityOrderRegistration') {
                        vm.captureModel = {
                            res: _res.outCMEquityOrderRegistration.orderDetail,
                            CMEquityOrderRegistration: {
                                orderDetail: {
                                    netAmount: _total
                                }
                            }
                        };
                        message = 'Orden enviada con folio: ' + _res.outCMEquityOrderRegistration.orderDetail.orderID;
                        getCurrentCash();
                    } else {
                        vm.captureModel = vm.confirmationModel;
                        message = _res.outAdviserPendingOpRegistration.operationsDetails[0].message;
                        message += '<br>Con el ID Registro <b>' + _res.outAdviserPendingOpRegistration.operationsDetails[0].operationID + '</b>';
                    }
                    $scope.$emit('updateCapitalsTab');
                    CommonModalsSrv.done(message);
                    vm.confirmationModel = null;
                    vm.captureModel = null;
                    newState(false);
                    vm.cmd.binnacle = {
                        date: vm.cmd.binnacle.date
                    };
                }).catch(function (_error) {
                    vm.loading = false;
                    var message = '';
                    angular.forEach(_error, function (_value) {
                        message += _value.responseMessage + '<br>';
                    });
                    CommonModalsSrv.error(message);
                })
                .finally(function () {
                    vm.loading = false;
                });
        };

        function confirmStop() {
            vm.loading = true;
            var _user = $sessionStorage.sclient.data.name + ' ' + $sessionStorage.sclient.data.lastName + ' ' + $sessionStorage.sclient.data.secondLastName;
            capitalsLuminaDollSrv.confirmStopLoss(vm.cmd, $scope.contract, _user)
                .then(function (_res) {
                    vm.captureModel = _res;
                    $scope.$emit('updateCapitalsTab');
                    var message = 'La venta se envió de manera correcta.';
                    CommonModalsSrv.done(message);
                })
                .catch(function (_error) {
                    vm.loading = false;
                    var message = '';
                    angular.forEach(_error, function (_value) {
                        message += _value.responseMessage + '<br>';
                    });

                    CommonModalsSrv.error(message);
                })
                .finally(function () {
                    vm.loading = false;
                });
        }

        vm.finish = function () {
            vm.confirmationModel = null;
            vm.captureModel = null;
            newState(false);
            vm.cmd.binnacle = {
                date: vm.cmd.binnacle.date
            };
        };

        function setupVars() {
            vm.statusOrders = {
                close: [],
                advance: [],
                basic: [],
                stops: []
            };

            vm.confirmationModel = false;
            vm.captureModel = false;
            vm.cmd = {
                order: {
                    type: 'basic',
                    options: {
                        type: 'any'
                    }
                }
            };
            vm.dataListTipoOrdenesFilter = vm.statusOrders[vm.cmd.order.type];
            vm.cmd.libroomesa = 'Book';
            vm.elegible = contractSelected.isEligible;
        }

        function initLoads() {
            // Get current media list
            capitalsLuminaDollSrv.getMediaBank().then(function (_res) {
                var _media = _res.data.result;
                var _mediaType = [];
                angular.forEach(_media, function (value) {
                    if(value.key !== "5"){
                    _mediaType.push({
                        id: value.identifier,
                        text: value.instructionTypeDescription
                    });
                }
                });
                vm.Media = _mediaType;
            });
            if($scope.iscuentapropia){
                vm.cmd.media =
                {
                    type : {"id":"7","text":"E-MAIL"}
                };
            }
            //loadStations();
        }

        function getCurrentCash() {
            var contractBalance = null;
            capitalsLuminaDollSrv.bankContractBalance($scope.contract, vm.bankingArea)
                .then(function (_res) {
                    if (_res.data.outCommonHeader.result.result === 1) {
                        contractBalance = _res.data.outBankContractBalance.balanceData;
                        vm.balance = contractBalance;
                    } else {
                        CommonModalsSrv.error(ErrorMessage.createError(_res.data.outCommonHeader.result.messages));
                        vm.newStateInit = true;
                        vm.confirmationModel = false;
                        vm.loading = false;
                    }
                }).catch(function (_res) {
                    CommonModalsSrv.error(ErrorMessage.createError(_res.data.outCommonHeader.result.messages));
                    vm.newStateInit = true;
                    vm.confirmationModel = false;
                    vm.loading = false;
                });
        }



        function getOrderCatalog() {
            var orderType = [];
            /*if (vm.tab === 'sell') {
                orderType = [
                    { areaKey: 1, key: "2", shortKey: "LP", description: "LIMITADA POR PRECIO " },
                    { areaKey: 1, key: "3", shortKey: "MC", description: "A MERCADO " }
                ];
                refactorSelect(orderType);
            } else {
                if (vm.cmd.station) {
                    capitalsLuminaDollSrv.getOrderCatalog(vm.cmd.station, $scope.contract, vm.bankingArea)
                        .then(function (_res) {
                            orderType = _res;
                            refactorSelect(orderType);
                        })
                        .catch(function (_error) {
                            //vm.loading = false;
                            var message = '';
                            angular.forEach(_error, function (_value) {
                                message += _value.responseMessage + '<br>';
                            });
                            CommonModalsSrv.error(message);
                        });
                }
            }*/

            if (vm.cmd.station) {
                capitalsLuminaDollSrv.getOrderCatalog(vm.cmd.station, $scope.contract, vm.bankingArea)
                    .then(function (_res) {
                        orderType = _res;
                        refactorSelect(orderType);
                    })
                    .catch(function (_error) {
                        //vm.loading = false;
                        var message = '';
                        angular.forEach(_error, function (_value) {
                            message += _value.responseMessage + '<br>';
                        });
                        CommonModalsSrv.error(message);
                    });
            }

        }

        function getAllStations(){
            TableStationsSrv.getStationsLumina( $scope.contract, $scope.ids.val1 ,"EQUITY","B")
                .then(function( _arrayStations ){
                    $rootScope.statiosnTableBank = _arrayStations;
                }).catch( function(){
                    $log.info('get stations error');
                    $scope.stations = [];
                } );
        }

        function loadStations() {
            TableStationsSrv.getStationsLumina( $scope.contract, $scope.ids.val1, "EQUITY","B")
                .then(function (_arrayStations) {
                // vm.cmd.station = $scope.station;
                vm.stations = _arrayStations;
            })
                .catch(function () {
                    $log.info('get stations error');
                    $scope.stations = [];
                })
                .finally(function () {
                    getOrderCatalog();
                });
        }

        function refactorSelect(_types) {
            vm.statusOrders.basic = [];
            R.forEach(function (_val) {
                var item = R.find(R.propEq('value', _val.shortKey.trim()))(statusOrders);
                if (item) {
                    vm.statusOrders[item.type].push(_val);
                }
            }, _types);
            vm.dataListTipoOrdenesFilter = vm.statusOrders[vm.cmd.order.type];
            getOrderType();
        }

        function newState(_newState) {
            vm.stepA = false;
            if (_newState) {
                //vm.tab = null;
                vm.cmd.media = {};
                //getOrderCatalog();
            }
            searchTitles();
            getOrderCatalog();
            vm.newState = _newState;
            getCurrentCash();
            vm.montoaprox = null;
            vm.cmd.order = {
                type: 'basic',
                model: {
                    term: 1,
                    titles: null
                },
                options: {
                    type: 'any'
                }
            };
            vm.dataListTipoOrdenesFilter = vm.statusOrders[vm.cmd.order.type];
            getOrderType();
        }

        function  getOrderType() {
            if($scope.ids.text === 'SIC'){
                vm.cmd.order.value = vm.dataListTipoOrdenesFilter[0];
            }
        }

        function loadTypeOperation(){
            TableStationsSrv.getOptionsTypeOperation().then(function(response){
                vm.listTypeOperation = response;
            }).catch(function(){
                vm.listTypeOperation = [];
            });
        }

        vm.onChangeTypeMedio = function (_last, _new) {
            //Medios electronicos id = 10 o 4
            if (_new.id === "10") {
                loginSrvc.validateUserTokens().then(function success(response) {
                    resetTipoMedio(response.success, response.msg);
                }).catch(function error(error) {
                    resetTipoMedio(error.success, error.msg);
                });
            } else {
                resetTipoMedio(true, '');
            }
        };

    }

    angular.module('actinver.controllers')
        .controller('capitalsLuminaDollCtrl', capitalsLuminaDollCtrl);


})();
