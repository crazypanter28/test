(function () {
    'use strict';

    function fundBankDollCtrl($scope, CommonModalsSrv, contractTypeSrv, fundBankDollSrv, $sessionStorage,$filter, ErrorMessage, moment, loginSrvc) {
        var vm = this;
        // Defaults
        vm.currentCash = 0;
        vm.transaction = {};
        vm.cleanModels = cleanModels;
        vm.modify = modify;
        vm.confirm = confirm;
        vm.capture = capture;
        vm.finish = finish;
        vm.getCalendar = getCalendar;

        $scope.date = new Date();
        vm.viewNewState = false;
        vm.newStateInit = true;
        vm.cmd = {};
        vm.cmd.binnacle = {
            comments :'',
            time : '00:01:00',
        };
        vm.isObjectSell = false;
        vm.bankingArea = '001';
        vm.cmd.importRules = 0;
        $scope.sellLiquidity = true;
        var contract = JSON.parse(localStorage.getItem('contractSelected'));
        vm.contractType = contractTypeSrv.contractType( contract.isPropia , contract.isEligible, contract.isDiscretionary);
        vm.anticipedSellCheck = false;

        vm.tipoMedio={
            msg : '',
            showMsg:false
        };

        function resetTipoMedio(success, msg){
            vm.tipoMedio.msg =  success ? '': msg;
            vm.tipoMedio.showMsg = !success; 
        }


        function init() {
            cleanModels();
            getContractBalance();
            getCatalogoMedios();
            vm.clientNumber = $sessionStorage.sclient.data.clientNumber;
            if ($scope.selected && !vm.isObjectSell) {
                vm.loading = true;
                vm.stationName = $scope.selected.slateKey + ' ' + $scope.selected.serie;
                vm.serie = $scope.selected.serie;
                vm.buyLiquidity = $scope.selected.buyLiquidity;
                vm.sellLiquidity = $scope.selected.sellLiquidity;
                vm.currentCash = $scope.selected.price;

                if($scope.selected.sellingByImportOrTitles.typeID === '1'){
                    if(vm.tab === 'buy' ){ // SOLO IMPORTE
                        vm.rulesBuy = {
                            registrationType: 'IMPORTE'
                        };
                        vm.cmd = {
                            evtentType: 'buy',
                            type: 'import'
                        };
                    }else if(vm.tab === 'sell' ){
                        vm.rulesBuy = {
                            registrationType: 'TITULOS'
                        };
                        vm.cmd = {
                            evtentType: 'sell',
                            type: 'import'
                        };
                    }
                }else if($scope.selected.sellingByImportOrTitles.typeID === '2'){
                    vm.rulesBuy = {
                        registrationType: 'AMBOS'
                    };
                }

                vm.loading = false;
                $scope.focusElement();
                findDateExecution(new Date().getTime());
                getCurrencyFundByIDAndContract();
            } else if ($scope.selected && vm.isObjectSell) {
                vm.fund = {
                    sell: {
                        titlesQty: $scope.selected.titlesQty,
                        fundID: $scope.selected.idFund,
                        settlementDate: $scope.selected.settlementDate,
                        dueDate: $scope.selected.dueDate,
                        currentPrice: $scope.selected.currentPrice,
                        position: $scope.selected.position,
                        movementType: $scope.selected.movementType,
                        stationName: $scope.selected.emissionID,
                        serie: $scope.selected.serie,
                        foreignExchangeID: $scope.selected.foreignExchangeID
                    }
                };
                vm.loading = false;
                vm.stationName = vm.fund.sell.stationName+' '+ $scope.selected.serie;
                getCurrencyFundByIDAndContract();
            }
        }

        vm.findDate = function () {
            findDateExecution(new Date(vm.orderDate).getTime());
        };

        function findDateExecution(_date) {
            vm.dateExecution = moment(_date).format('YYYY-MM-DD HH:mm:ss');
            if (vm.isObjectSell) {
                getCalendarByFondo('venta', vm.anticipedSellCheck ? '1' : '0');
            } else {
                getCalendarByFondo('compra', '0');
            }
        }

        function getCalendar( _anticipedSell ) {
            _anticipedSell = vm.anticipedSellCheck ? '1' : '0';
            _anticipedSell === '0' ? $scope.sellLiquidity = true : $scope.sellLiquidity = false;
            getCalendarByFondo('venta', _anticipedSell);
        }

        function getCalendarByFondo(tipo, _anticipedSell) {
            var model = null;
            if (tipo === "compra") {
                model = {
                    v1: $scope.selected.fundID,
                    v3: 1,
                    v4: vm.dateExecution,
                };
            } else if (tipo === "venta") {
                model = {
                    v1: $scope.selected.idFund,
                    v3: 2,
                    v4: vm.dateExecution,
                };
            }

            fundBankDollSrv.getCalendarBank(model, $scope.selected.serie, _anticipedSell)
                .then(function (_res) {
                    if(tipo === "compra"){
                        vm.cmd.calendarExc = _res.calendarsInformation.calendarInformation[0].calendarDateTime.timestamp;
                        vm.cmd.fhLiquidacion = _res.calendarsInformation.calendarInformation[0].settlementDateTime;
                        $scope.fechaLiquidacion = vm.cmd.fhLiquidacion;
                    }else{
                        if( $scope.sellLiquidity ){
                            var _opDate = [];
                            angular.forEach(_res.calendarsInformation.calendarInformation,function(value){
                                var _settlementDateTime = new Date(value.settlementDateTime);
                                var _calendarDateTime = new Date(value.calendarDateTime.timestamp);
                                _opDate.push({
                                    settlementDateTime : _settlementDateTime,
                                    text :  moment(_calendarDateTime).format("DD/MM/YYYY"),
                                    calendarOp: _calendarDateTime
                                });
                            });
                            vm.operationDate = _opDate;
                            vm.cmd.fhLiquidacion = _res.calendarsInformation.calendarInformation[0].settlementDateTime;
                            $scope.fechaLiquidacion = vm.cmd.fhLiquidacion;
                            //vm.cmd.operationDate.settlementDateTime = vm.cmd.fhLiquidacion;
                        }else{
                            vm.cmd.calendarExc = _res.calendarsInformation.calendarInformation[0].calendarDateTime.timestamp;
                            vm.cmd.fhLiquidacion = _res.calendarsInformation.calendarInformation[0].settlementDateTime;
                            $scope.fechaLiquidacion = vm.cmd.fhLiquidacion;
                            //vm.cmd.operationDate.settlementDateTime = vm.cmd.fhLiquidacion;
                        }
                    }
                }).catch(function (response){
                    CommonModalsSrv.error(ErrorMessage.createError(response.messages));
                    vm.newStateInit = true;
                    vm.confirmationModel = false;
                });

        }


        function getCatalogoMedios() {
            vm.loading = true;
            fundBankDollSrv.getMediaBank().then(function (_res) {
                var _media = _res.data.result;
                var _mediaType = [];
                angular.forEach(_media, function (value) {
                    _mediaType.push({
                        id: value.identifier,
                        text: value.instructionTypeDescription
                    });
                });
                vm.Media = _mediaType;
            });
        }

        function cleanModels() {
            vm.invest = null;
            if ($scope.selected !== null && !vm.isObjectSell) {//si es compra
                resetForm("compra");
            } else if ($scope.selected !== null && vm.isObjectSell) {//si es venta
                resetForm("venta");
            } else {
                vm.cmd = {
                    type: 'titles',
                    binnacle: {
                        date: new Date()
                    }
                };
            }
            vm.transaction = null;
            vm.confirmationModel = null;
            vm.captureModel = null;
            vm.anticipedSellCheck = false;
            resetTipoMedio(true, '');
            
        }

        function confirm() {
            var importeOperado = parseFloat(vm.cmd.importRules);
            var totalHabil = parseFloat(vm.balance.availableBalance);
            if(vm.cmd.evtentType ==='buy'){
                if(importeOperado > totalHabil){
                    CommonModalsSrv.error("No se puede realizar la compra por que el importe es mayor al saldo disponible  "+$filter('currency')(totalHabil, '$', 2));
                    return;
                }else{
                    vm.confirmationModel = $scope.selected;
                    getDetailTransation();
                }
            }else{
                vm.confirmationModel = $scope.selected;
                getDetailTransation();
            }
        }

        function modify() {
            vm.confirmationModel = null;
            findDateExecution(new Date().getTime());
        }

        vm.changeTab = function (_tab) {
            cleanModels();
            if (_tab === 'buy') {
                $scope.$emit('activeSell', false);
                vm.cmd.evtentType = 'buy';
                vm.newStateInit = false;
            }
            else if (_tab === 'sell') {
                $scope.$emit('activeSell', true);
                vm.cmd.evtentType = 'sell';
                vm.newStateInit = false;
            }
            vm.tab = _tab;
        };

        function capture() {
            if (vm.cmd.evtentType === 'buy') {
                sendTransactionBuy();
            }else if (vm.cmd.evtentType === 'sell') {
                sendTransactionSell();
            }
        }

        function finish() {
            vm.newStateInit = true;
            cleanModels();
            init();
        }

        function getContractBalance() {
            var message = '';
            var contractBalance = null;
            vm.loading = true;
            fundBankDollSrv.bankContractBalance($scope.contract.contractNumber, vm.bankingArea)
                .then(function (_res) {
                    if (_res.data.outCommonHeader.result.result === 1) {
                        contractBalance = _res.data.outBankContractBalance.balanceData;
                        vm.balance = contractBalance;
                    } else {
                        var _error = _res.data.outCommonHeader.result.messages;
                        angular.forEach(_error, function (_res) {
                            message += _res.responseMessage;
                        });
                        CommonModalsSrv.error(message);
                        vm.newStateInit = true;
                        vm.confirmationModel = false;
                        vm.loading = false;
                    }
                }).catch(function (_res) {
                    var _error = _res.data.outCommonHeader.result.messages;
                    CommonModalsSrv.error( ErrorMessage.createError(_error) );
                    vm.newStateInit = true;
                    vm.confirmationModel = false;
                    vm.loading = false;
                });
        }

        function getCurrencyFundByIDAndContract() {
            vm.loading = true;
            var contracto =  $scope.contract.contractNumber;
            var idFondo = null;
            var type = null;
            var serie=null;

            if (!vm.isObjectSell) {//es compra
                idFondo = $scope.selected.fundID;
                type = "compra";
                serie = vm.serie;
                vm.tab = 'buy';
            }else if (vm.isObjectSell) {//es venta
                idFondo = vm.fund.sell.fundID;
                type = "venta";
                serie=vm.fund.sell.serie;
                vm.tab = 'sell';
            }

            fundBankDollSrv.getCurrencyFundByIDAndContract(idFondo, contracto, type)
                .then(function (_res) {
                    var fondo = null;
                    var fondos;
                    if (_res.data.outCommonHeader.result.result === 1) {
                        fondos = _res.data.outBankInvstFundsByContractQuery.funds.fund;
                            angular.forEach(fondos, function (fondotmp) {
                                if(fondotmp.serie === serie ){
                                    fondo = fondotmp;
                                }
                            });
                    }
                    $scope.anticipedS = fondo.advanceSaleFlag;
                    if(vm.tab === 'buy' ){
                        $scope.buyLiquidity = fondo.buyLiquidity === '0' ? false : true;
                    }else{
                        if(fondo.sellLiquidity === "0" ){
                            $scope.sellLiquidity = false;
                        }else if(fondo.sellLiquidity === "1" &&  fondo.advanceSaleFlag){
                            $scope.sellLiquidity = true;
                        }else if(fondo.sellLiquidity === "1" && !fondo.advanceSaleFlag){
                            $scope.sellLiquidity = false;
                        }
                    }
                    if(type === "venta"){
                        findDateExecution(new Date().getTime());
                    }

                    if(fondo.sellingByImportOrTitles.typeID === '1'){
                        if(vm.tab === 'buy' ){ // SOLO IMPORTE
                            vm.rulesBuy = {
                                registrationType: 'IMPORTE'
                            };
                            vm.cmd = {
                                evtentType: 'buy',
                                type: 'import'
                            };
                        }else if(vm.tab === 'sell' ){
                            vm.rulesSell = {
                                registrationType: 'TITULOS'
                            };
                            vm.cmd = {
                                evtentType: 'sell',
                                type: 'titles'
                            };
                        }
                    }else if(fondo.sellingByImportOrTitles.typeID === '2'){
                        vm.rulesBuy = {
                            registrationType: 'AMBOS'
                        };
                    }

                }).catch(function (_res) {
                    var _error = _res.data.outCommonHeader.result.messages;
                    CommonModalsSrv.error(ErrorMessage.createError(_error));
                }).finally(function () {
                    vm.loading = false;
                });
        }

        function resetForm(tipo) {
            if (tipo === "compra") {
                vm.cmd = {
                    type: 'titles',
                    evtentType: 'buy',
                    binnacle: {
                        date: new Date()
                    }
                };
            } else if (tipo === "venta") {
                vm.rulesSell = {
                    registrationType: 'AMBOS'
                };
                vm.cmd = {
                    type: 'titles',
                    evtentType: 'sell',
                    binnacle: {
                        date: new Date()
                    }
                };

                vm.fund = {
                    sell: {
                        titlesQty: $scope.selected.titlesQty,
                        fundID: $scope.selected.idFund,
                        settlementDate: $scope.selected.settlementDate,
                        dueDate: $scope.selected.dueDate,
                        currentPrice: $scope.selected.currentPrice,
                        position: $scope.selected.position,
                        movementType: $scope.selected.movementType,
                        stationName: $scope.selected.emissionID
                    }
                };
                vm.anticipedSellCheck = false;
                findDateExecution(new Date().getTime());
            }
            vm.transaction = null;
            vm.confirmationModel = null;
            vm.captureModel = null;
        }

        function sendTransactionSell() {
            var flagType = false;
            var operationDate = null;
            var titulos = 0;
            var message = '';

            if (vm.cmd.type === 'titles') {//si false(titulos) true(importe)
                flagType = false;
                titulos = vm.cmd.sell.typeValue;
            }else {
                flagType = true;
                titulos = parseInt(Math.abs(parseFloat(vm.cmd.importRules).toFixed(2))/parseFloat(vm.fund.sell.currentPrice));
                vm.cmd.sell.typeValue = titulos;
            }

            if(!$scope.sellLiquidity){
                operationDate = moment(vm.cmd.calendarExc).format("DDMMYYYY");
            }else{
                operationDate = moment(vm.cmd.operationDate.calendarOp).format("DDMMYYYY");
            }

            var ai_dollarFlag;
            if(vm.fund.sell.foreignExchangeID === '0'){
                ai_dollarFlag = false;
            }else if(vm.fund.sell.foreignExchangeID === '1'){
                ai_dollarFlag = true;
            }


            getDetailTransation();
            var _json = JSON.stringify(vm.detail);
            vm.transaction = {
                language: 'SPA',
                clientContractNumber: $scope.contract.contractNumber,
                clientBankingArea: vm.bankingArea,
                time: '00:00:00',
                fundID: vm.fund.sell.fundID,
                settlementID: '9',
                titlesQty: titulos,
                ai_operationDate: operationDate,
                ai_addPaymentAmountFlag: false,
                ai_clabe: '0',
                ai_checkAccount: '0',
                ai_addFreeOfOperationFeeFlag: false,
                ai_dollarFlag: ai_dollarFlag,
                buyerContractNumber: $scope.contract.contractNumber,
                buyerFundID: vm.fund.sell.fundID,
                ca_bankingArea: vm.bankingArea,
                amount: vm.cmd.importRules,
                currencyTypeKey: 0, //currency Cta eje.
                advanceSaleFlag:  vm.anticipedSellCheck,
                jsonDetails: _json
            };

            vm.transaction = contractTypeSrv.sendBinnacle(vm.contractType, vm.transaction , vm.cmd);

            vm.loading = true;
            vm.confirmationModel = null;
            fundBankDollSrv.bankFundSellRequest(vm.transaction).then(function (_res) {
                if(_res.outCommonHeader.operationName === 'BankFundSellRequest'){
                    vm.captureModel = _res;
                    CommonModalsSrv.done( ErrorMessage.createError(_res.outCommonHeader.result.messages) );
                }else{
                    vm.captureModel = vm.confirmationModel;
                    message =  _res.outAdviserPendingOpRegistration.operationsDetails[0].message;
                    message += '<br>Con el ID Registro <b>' +_res.outAdviserPendingOpRegistration.operationsDetails[0].operationID+'</b>';
                    CommonModalsSrv.done( message );
                }
            }).catch(function (_res) {
                CommonModalsSrv.error( ErrorMessage.createError( _res.outCommonHeader.result.messages) );
                vm.captureModel = null;
                vm.cmd.evtentType = 'sell';
            }).finally(function () {
                finish();
            });


        }

        function sendTransactionBuy() {
            var titulos = 0;
            /**Parametros para compra */
            var flagType = false;
            var operationDate = moment(vm.cmd.calendarExc).format("DDMMYYYY");
            var depositDate = moment(vm.cmd.calendarExc).format("DDMMYYYY");

            if (vm.cmd.type === 'titles') {
                flagType = false;
                titulos = vm.cmd.buy.typeValue;
            }else {
                flagType = true;
                titulos = 0;
            }

            getDetailTransation();
            var _json = JSON.stringify(vm.detail);

            if(vm.cmd.media.type.id !== '3'){
                vm.cmd.binnacle = {
                    time : '00:01:00',
                    date: new Date()
                };
            };

            var operationSource;
            if($scope.selected.currency === 'MXN'){
                operationSource = 'CCEJE';
            }else if($scope.selected.currency === 'USD'){
                operationSource = 'EFECMXN';
            }

            vm.transaction = {
                language: 'SPA',
                clientBankingArea: vm.bankingArea,
                clientContractNumber: $scope.contract.contractNumber,
                addFreeOfOperationFeeFlag: false,
                addPaymentAmountFlag: flagType,
                fundID: $scope.selected.fundID,
                operationDate: operationDate,
                titlesQty: titulos,
                depositDate: depositDate,
                applyRegistrationFlag: true,
                totalAmount: parseFloat(vm.cmd.importRules).toFixed(2),
                currency: 0,
                bankingArea: vm.bankingArea,
                operationSource : operationSource,
                jsonDetails: _json
            };

            vm.transaction = contractTypeSrv.sendBinnacle(vm.contractType, vm.transaction , vm.cmd);
            vm.loading = true;
            vm.confirmationModel = null;

            fundBankDollSrv.bankFundBuyRequest(vm.transaction)
                .then(function (_res) {
                    var message = '';
                    if (_res.outCommonHeader.result.result === 1) {
                        if(_res.outCommonHeader.operationName === 'BankFundBuyRequest'){
                            vm.captureModel = _res;
                            CommonModalsSrv.done( ErrorMessage.createError(_res.outCommonHeader.result.messages) );
                        }else{
                            vm.captureModel = vm.confirmationModel;
                            message =  _res.outAdviserPendingOpRegistration.operationsDetails[0].message;
                            message += '<br>Con el ID Registro <b>' +_res.outAdviserPendingOpRegistration.operationsDetails[0].operationID+'</b>';
                            CommonModalsSrv.done( message );
                        }
                    } else {
                        CommonModalsSrv.error( ErrorMessage.createError(_res.outCommonHeader.result.messages) );
                        vm.captureModel = null;
                        vm.cmd.evtentType = 'buy';
                    }
                }).catch(function (_res) {
                    CommonModalsSrv.error(_res.outCommonHeader.result.messages);
                    vm.captureModel = null;
                }).finally(function () {
                    finish();
                });
        }

        function getDetailTransation() {
            var precio=0;
            var titulos=0;
            var importe=0;
            var fechaOrden=null;
            var fechaLiquidacion=null;
            var operacion=null;

            if(vm.cmd.evtentType === 'buy'){//si es compra
                operacion = "Compra";
                precio = $filter('currency')(vm.currentCash , '$', 6);
                titulos = vm.cmd.buy.typeValue;
                importe = $filter('currency')(vm.cmd.buy.typeValue2 , '$');
            }else if(vm.cmd.evtentType === 'sell'){//venta
                operacion ="Venta";
                precio = $filter('currency')(vm.fund.sell.currentPrice , '$', 6);
                titulos = vm.cmd.sell.typeValue;
                importe = $filter('currency')(vm.cmd.sell.typeValue2 , '$');
            }

            fechaOrden = moment(vm.cmd.calendarExc).format('YYYY-MM-DD');
            fechaLiquidacion = moment(vm.cmd.fhLiquidacion).format('YYYY-MM-DD');
            var fechaEjecucion= moment(new Date().getTime()).format('YYYY-MM-DD');
            var totalDetail = $filter('currency')(vm.cmd.importRules , '$');
            vm.detail={
                Contrato: $scope.contract.contractNumber,
                Movimiento: operacion,
                Emisora: vm.stationName,
                Serie: vm.serie,
                Titulos:titulos,
                Precio: precio,
                Importe:importe,
                Total:totalDetail,
                'Fecha Orden':fechaOrden,
                'Fecha Liquidacion':fechaLiquidacion,
                'Fecha Ejecucion':fechaEjecucion
            };
        }

        $scope.$watch('selected', function () {
            vm.isObjectSell = false;
            if ($scope.selected) {
                if ($scope.selected.instrumentID) {
                    vm.isObjectSell = true;
                }else{
                    vm.isObjectSell = false;
                }
            }
            if($scope.selected && $scope.contract.isDinn) {
                CommonModalsSrv.error("No es posible operar un contrato DINN");
                return;
            } else if ($scope.selected && !vm.isObjectSell) { //si es compra
                vm.loading = true;
                vm.viewNewState = true;
                vm.newStateInit = false;
                vm.confirmationModel = true;
                vm.captureModel = false;
                vm.tab = 'buy';
                init();
            } else if ($scope.selected && vm.isObjectSell) {//si es venta
                vm.loading = true;
                vm.viewNewState = true;
                vm.newStateInit = false;
                vm.confirmationModel = true;
                vm.captureModel = false;
                vm.tab = 'sell';
                init();
            } else {
                vm.newStateInit = true;
                vm.viewNewState = false;
                vm.loading = false;
            }
        });

        $scope.changeSettlement2 = function (_model) {
            if(vm.cmd[_model].typeValue2 !== undefined){
                vm.cmd.importRules = Math.abs(vm.cmd[_model].typeValue2);
            }else{
                vm.cmd.importRules = 0;
            }
        };

        $scope.changeSettlement = function (_model) {
            if(vm.cmd[_model].typeValue !== undefined) {
                if (vm.isObjectSell) {
                    vm.cmd.importRules = Math.abs(vm.cmd[_model].typeValue * vm.fund.sell.currentPrice);
                } else {
                    vm.cmd.importRules = Math.abs(vm.cmd[_model].typeValue * vm.currentCash);
                }
                vm.cmd.importRules = vm.cmd.importRules.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
            }else{
                vm.cmd.importRules = 0;
            }
        };

        vm.AddStation = function (_station){
            $scope.selected = _station;
            vm.captureModel = null;
            vm.confirmationModel = null;
            vm.loading = true;
            init();
        };

        vm.AddStationOrders = function (_order) {
            $scope.selected = _order;
            resetForm("venta");
            vm.loading = true;
            vm.captureModel = null;
            vm.confirmationModel = null;
        };

        vm.cleanImport = function (model) {
            if (model === 'sell') {
                if (vm.cmd.sell) {
                    vm.cmd.sell.typeValue = '';
                    vm.cmd.sell.typeValue2 = '';
                }
            } else if (model === 'buy') {
                if (vm.cmd.buy) {
                    vm.cmd.buy.typeValue = '';
                    vm.cmd.buy.typeValue2 = '';
                }
            }
            vm.cmd.importRules = '';
        };

        vm.onChangeTypeMedio = function (_last, _new) {
            //Medios electronicos id = 10
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

    angular
        .module('actinver.controllers')
        .controller('fundBankDollCtrl', fundBankDollCtrl);

})();
     