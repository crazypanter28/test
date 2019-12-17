( function(){
    'use strict';

    function moneyBankDollCtrl( $scope, $q, moneyBankDollSrv, contractTypeSrv, CommonModalsSrv, ErrorMessage, fundBankDollSrv, $sessionStorage, loginSrvc, moment ){
        var vm = this;
        var moneyMarketCalc;
        var registerModel = {};
        vm.sinstrument;
        vm.directSection = {
            changeInstrument:false,            
            valueOriginalCalculator: null,
            pAndL : 0
        };
        var contract = JSON.parse(localStorage.getItem('contractSelected'));
        vm.contractType = contractTypeSrv.contractType( contract.isPropia , contract.isEligible, contract.isDiscretionary);
        vm.tipoMedio={
            msg : '',
            showMsg:false
        };
        var comments;

        function resetTipoMedio(success, msg){
            vm.tipoMedio.msg =  success ? '': msg;
            vm.tipoMedio.showMsg = !success;
        }

        function init(){
            moneyBankDollSrv.getMediaBank().then( function( response ){
            vm.loading = false;

            // Media
            if( response.data.outCommonHeader.result.result === 1 ){
                vm.Media = R.map( function( _val ){
                    _val.id = _val.identifier;
                    _val.text = _val.instructionTypeDescription;                    
                    return _val;
                }, response.data.result);                
            }

            
            getBankContractBalance();

            initialize();
        });
        }
        function getBankContractBalance(){

            if(vm.operationTypeMM === 'subastas'){
                var _date = moment(new Date(vm.sinstrument.settlementDate)).format('DDMMYYYY');
                fundBankDollSrv.bankReportoBuyingPowerQuery($scope.contract.contractNumber, _date).then( function (_res) {
                    vm.contractBalance = _res.data.outBankReportoBuyingPowerQuery.totalPosition;
                }).catch(function(){
                    vm.contractBalance = null;
                });
            }else{
                fundBankDollSrv.bankContractBalance($scope.contract.contractNumber, '001').then( function (_res) {
                    vm.contractBalance = _res.data.outBankContractBalance.balanceData.availableBalance;
                }).catch(function(){
                    vm.contractBalance = null;
                });
            }

        }

        function initialize(){
            if( $scope.type === 'directo'){
                vm.operationTypeMM = 'directo';
                vm.cmd = {
                    type:  'titles',
                    media: {}
                };

            }

            if( $scope.type === 'reporto' ){
                vm.operationTypeMM = 'reporto';
                vm.cmd = {
                    type:  'import',
                    media: {}
                };
            }

            if( $scope.type === 'subastas'){
                vm.operationTypeMM = 'subastas';
                vm.cmd = {
                    type:  'import',
                    media: {}
                };
            }
        }

        function getNumberPlazo(cadena){
            var numero = "", plazo = -1;
            if(cadena !=null && cadena.length> 0){
                for(var i = 0; i < cadena.length; i++){
                    if(cadena.charCodeAt(i) >= 48 && cadena.charCodeAt(i)<= 57){
                        numero+=cadena[i];
                    }
                }
                if(numero.length>0){
                    plazo = parseInt(numero)/24; 
                }

            }
            return parseInt(plazo);
        }

        function desplazarDecimals(value){
            var valor;
            if(value <= 100 && value >= 10  && value != null){
                valor = parseFloat( "0."+String(value).replace(".",""));                
            }else if(value < 10 && value >= 0  && value != null){
                valor = parseFloat("0.0"+String(value).replace(".",""));
            }else{
                valor = parseFloat(value/100);
            }
            return valor;
        }

        function cleanModels(){
            vm.cmd              = {};
            vm.plazo_emision    = null;
            vm.titles           = null;
            vm.import           = null;
            vm.money_calc       = {};
            vm.confirmModel     = false;
            vm.capturedModel    = false;
            vm.finishModel      = false;
            resetTipoMedio(true, '');
            vm.getValuesData = false;
            vm.infoMessage = '';
            initialize();
        }

        /*vm.changeTab = function( _tab ){
            cleanModels();
            if( typeof vm.sinstrument !== 'undefined' && vm.sinstrument !== null && vm.tab !== _tab ){
                vm.tab = _tab;
                vm.loading = true;
                init();
            }
        };*/

        vm.changeOperationType = function ( type ) {
            vm.money_calc.titles = null;
            vm.money_calc.amount = null;
          if ( type === 'titles' ) {
              vm.import = null;
          } else {
              vm.titles = null;
          }
        };

        vm.getValues = getValues;
        vm.getValuesbyImport = getValuesbyImport;

        function getValuesbyImport() {
            if(vm.money_calc.originalConvention === 'Yield' || vm.money_calc.originalConvention === 'YIELD'){
                getValues(vm.money_calc.originalConvention, vm.money_calc.originPrice);
            }else if(vm.money_calc.originalConvention === 'Residual Dirty' || vm.money_calc.originalConvention === 'RESIDUAL_DIRTY'){
                getValues(vm.money_calc.originalConvention, vm.money_calc.dirtyPrice);
            }

        }

        function getValues(_origin, _price ){
            var daysToMaturity = vm.tab === 'buy' ? getNumberPlazo(vm.sinstrument.term) : getNumberPlazo(vm.sinstrument.selectedInstrument.term);
            if(vm.titles !== null && !vm.import &&  typeof vm.titles !== 'undefined' && $scope.type === 'directo' && typeof _price === "number" || vm.import !== null && !vm.titles &&  typeof vm.import !== 'undefined' && $scope.type === 'directo' && typeof _price === "number"){
                vm.loading = true;
                vm.getValuesData = false;
                var _destinationConvention;                 
                var _exchangeRate = vm.tab === 'buy' ? vm.sinstrument.exchangeRate : vm.sinstrument.selectedInstrument.exchangeRate;
                if(_origin === 'Yield' || _origin === 'YIELD'){
                    _origin = 'YIELD';
                    _destinationConvention = 'RESIDUAL_DIRTY';                    
                    _price = Number((_price / 100).toFixed(8));
                }else if(_origin === 'Residual Dirty' || _origin === 'RESIDUAL_DIRTY'){                    
                    _origin = 'RESIDUAL_DIRTY';
                    _destinationConvention = 'YIELD';         
                    _price = _price / _exchangeRate;
                    _price = Number(_price.toFixed(8));                                        
                }
                moneyMarketCalc = {
                    instrumentDesc: vm.sinstrument.instrumentDesc,
                    price:  _price,
                    originalConvention: _origin,
                    daysToMaturity: daysToMaturity ==null ? 0: daysToMaturity,
                    destinationConvention: _destinationConvention,
                    language: 'SPA'
                };

                if( vm.cmd.type === 'titles' ){
                    moneyMarketCalc.quantity = vm.titles;
                }else if( vm.cmd.type === 'import' ){                    
                    moneyMarketCalc.amount = vm.import / _exchangeRate;
                    moneyMarketCalc.amount = Number(moneyMarketCalc.amount.toFixed(8));
                }

                moneyBankDollSrv.getMoneyMarketCalculation( moneyMarketCalc ).then( function( response ){
                    vm.calc = true;
                    vm.loading = false;
                    var _res = response.data.outMMBondPriceCalculationQuery; 
                    vm.money_calc = {
                        amount: _res.amount ? (_res.amount * _exchangeRate ) : vm.import,
                        titles: _res.quantity || vm.titles,
                        originalConvention: _res.originalConvention
                    };

                    if(_res.originalConvention === "RESIDUAL_DIRTY"){
                        vm.money_calc.originPrice = Number((_res.calculatedPrice * 100).toFixed(8));// tasa
                        vm.money_calc.dirtyPrice = _res.originPrice; // precio

                    }else if(_res.originalConvention === "YIELD"){
                        vm.money_calc.originPrice = Number((_res.originPrice * 100).toFixed(8));// tasa
                        vm.money_calc.dirtyPrice = _res.calculatedPrice; // precio
                    }

                    if($scope.type==='directo'){

                        if(vm.directSection.changeInstrument){
                            vm.directSection.changeInstrument = false;
                            vm.directSection.valueOriginalCalculator = _res;                            
                        }                        
                        var titles = vm.cmd.type === 'import'? vm.money_calc.titles : vm.titles;
                        var priceOrigin = vm.directSection.valueOriginalCalculator.dirtyPrice * _exchangeRate;
                        vm.money_calc.dirtyPrice = Number( (vm.money_calc.dirtyPrice * _exchangeRate).toFixed(8));                                                                
                        var montoBuy = (vm.money_calc.dirtyPrice - priceOrigin) * titles ;
                        var montoSell = (priceOrigin - vm.money_calc.dirtyPrice) * titles ;
                        vm.directSection.pAndL = vm.tab === 'buy' ? montoBuy : montoSell;
                        vm.directSection.pAndL = vm.directSection.pAndL;                        
                    }          
                }).catch(function(error){
                    vm.calc = false;
                    vm.loading = false;                    
                    CommonModalsSrv.error(ErrorMessage.createError(error.data));
                    cleanModels();
                });
            }
        }


        vm.cleanModels = cleanModels;

        vm.confirm = function(){
            if(vm.operationTypeMM === 'directo'){
                registerModel = {
                    instrumentDesc: vm.sinstrument.instrumentDesc,
                    priceType: vm.money_calc.originalConvention === 'RESIDUAL_DIRTY' ? 'Residual Dirty' : 'Yield',
                    bonusOrderType: 'SECURITY',
                    operationType: 'SHORT_NAME',
                    exchangeRate : 1 
                };

                if(vm.tab === 'buy')
                    registerModel.daysToMaturity = getNumberPlazo(vm.sinstrument.term);
                if(vm.tab === 'sell')
                    registerModel.daysToMaturity = getNumberPlazo(vm.sinstrument.selectedInstrument.term);

                if(vm.money_calc.originalConvention === 'Yield' || vm.money_calc.originalConvention === 'YIELD'){
                    registerModel.price = vm.money_calc.originPrice;
                }else if(vm.money_calc.originalConvention === 'Residual Dirty' || vm.money_calc.originalConvention === 'RESIDUAL_DIRTY'){
                    registerModel.price = vm.money_calc.dirtyPrice;
                }

                if( vm.cmd.type === 'titles' ){
                    registerModel.quantity = vm.titles;
                }else if( vm.cmd.type === 'import' ){
                    registerModel.amount = vm.import;
                }
                registerModel = contractTypeSrv.sendBinnacle(vm.contractType, registerModel , vm.cmd);
                moneyBankDollSrv.captureDirectBank(registerModel)
                    .then( function (_res) {
                        angular.forEach(_res.data.outCommonHeader.result.messages, function(_value){
                            vm.infoMessage += _value.responseMessage;
                        });
                        vm.confirmModel = true;
                        vm.capturedModel = false;   
                    }).catch(function (error) {
                    vm.finish();
                    CommonModalsSrv.error( ErrorMessage.createError( error.data.messages ) );
                });
            }else if(vm.operationTypeMM === 'reporto'){
                registerModel = {
                    securityGroupL1: vm.sinstrument.bondType,
                    securityGroupL2: vm.sinstrument.bondType,
                    amount: vm.import,
                    daysDuration: vm.sinstrument.period,
                    rate: desplazarDecimals(vm.money_calc.originPrice),
                    bonusOrderType: 'SECURITY'
                };
                registerModel = contractTypeSrv.sendBinnacle(vm.contractType, registerModel , vm.cmd);
                moneyBankDollSrv.captureReportoBank(registerModel)
                    .then( function (_res) {
                        angular.forEach(_res.data.outCommonHeader.result.messages, function(_value){
                            vm.infoMessage += _value.responseMessage;
                        });
                        vm.confirmModel = true;
                        vm.capturedModel = false;
                    }).catch(function (error) {
                    vm.finish();
                    CommonModalsSrv.error( ErrorMessage.createError( error.data.messages ) );
                });
            }else if(vm.operationTypeMM === 'subastas'){                 
                var _price;
                if( vm.import <= vm.contractBalance ){
                    if(vm.cmd.auctionPrice.type.priceType === 'Yield' || vm.cmd.auctionPrice.type.priceType === 'YIELD'){
                        _price =  Number((vm.cmd.auctionPrice.type.price * 100).toFixed(8));
                    }else{
                        _price = Number((vm.cmd.auctionPrice.type.price).toFixed(8));
                    }

                    registerModel = {
                        priceType: vm.cmd.auctionPrice.type.priceType,
                        price: _price,
                        amount: vm.import,
                        bonusOrderType: 'PUBLIC_OFFERING',
                        auctionName: vm.sinstrument.auctionID
                    };
                    registerModel = contractTypeSrv.sendBinnacle(vm.contractType, registerModel , vm.cmd);

                  var f1 =  moment(vm.cmd.binnacle.date).format('YYYY-MM-DD');
                  var f2 =   moment(new Date(vm.sinstrument.settlementDate)).format('YYYY-MM-DD');
                  var fFinal1 = new Date(f1);
                  var fFinal2 = new Date(f2);

                    var diasdif= fFinal2.getTime()-fFinal1.getTime();
                    var contdias = Math.round(diasdif/(1000*60*60*24));
   
                    if(Math.sign(contdias) === -1){
                        contdias = 0;
                    }

                    registerModel.daysDuration = contdias;
                    moneyBankDollSrv.captureDirectBank(registerModel)
                        .then( function (_res) {
                            angular.forEach(_res.data.outCommonHeader.result.messages, function(_value){
                                vm.infoMessage += _value.responseMessage;
                            });
                            vm.confirmModel = true;
                            vm.capturedModel = false;
                        }).catch(function (error) {
                        vm.finish();
                        CommonModalsSrv.error( ErrorMessage.createError( error.data.messages ) );
                    });
                }else{
                    CommonModalsSrv.error( 'El importe es mayor al poder de compra' );
                }

            }

            registerModel.actionType = 'VALIDATE';
            registerModel.buySell = vm.tab === 'buy' ? 'B' : 'S';
            registerModel.clientID = $scope.contract.contractNumber;
            registerModel.language = 'SPA';
            registerModel.comments = (moment(vm.cmd.binnacle.date).format('YYYY-MM-DD') + ' | ' + vm.cmd.media.type.text + ' ' + (vm.cmd.media.type.id === "3" ? (vm.cmd.binnacle.phoneNumber + ' ' + vm.cmd.binnacle.time) : ' ') + ' | ' + vm.cmd.binnacle.comments);
            registerModel.jsonDetails = '';
            comments =(moment(vm.cmd.binnacle.date).format('YYYY-MM-DD') + ' | ' + vm.cmd.media.type.text + ' ' + (vm.cmd.media.type.id === "3" ? (vm.cmd.binnacle.phoneNumber + ' ' + vm.cmd.binnacle.time) : ' ') + ' | ' + vm.cmd.binnacle.comments);
        };

        vm.modify = function(){
            vm.confirmModel = false;
            vm.infoMessage = '';
        };
        
        vm.capture = function(){
            registerModel.actionType = 'SAVE';
            var _folio, message;
            if(vm.operationTypeMM  === 'directo'){               
                moneyBankDollSrv.captureDirectBank(registerModel)
                    .then( function (_res) {
                        vm.infoMessage = ErrorMessage.createError( _res.data.outCommonHeader.result.messages );
                        _folio = _res.data.outMMDirectBondOrdersRegistration.orderData[0].orderID;
                        message = 'La orden se envió de manera correcta.' + '<br>' + 'OrderId: ' + _folio + '<br>' + vm.infoMessage;
                        CommonModalsSrv.done(message);
                        vm.loading = false;
                        getBankContractBalance();
                        vm.finish();
                    }).catch(function (error) {
                    vm.finish();
                    CommonModalsSrv.error( ErrorMessage.createError( error.data.messages ) );
                }).finally(function () {
                    cleanModels();
                    vm.finish();
                });
            }else if(vm.operationTypeMM  === 'reporto'){
                vm.loading = true;
                registerModel = contractTypeSrv.sendBinnacle(vm.contractType, registerModel , vm.cmd);
                registerModel.comments = comments;
                moneyBankDollSrv.captureReportoBank(registerModel)
                    .then( function (_res) {
                        vm.infoMessage = ErrorMessage.createError( _res.data.outCommonHeader.result.messages );
                        _folio = _res.data.outMMReportoBondOrdersRegistration.orderData[0].orderID;
                        message = 'La orden se envió de manera correcta.' + '<br>' + 'OrderId: ' + _folio + '<br>' + vm.infoMessage;
                        CommonModalsSrv.done(message);
                        vm.loading = false;
                        vm.finish();
                    }).catch(function (error) {
                    vm.finish();
                    CommonModalsSrv.error( ErrorMessage.createError( error.data.messages ) );
                }).finally(function () {
                    vm.loading = false;
                });
            }else if(vm.operationTypeMM === 'subastas'){
                registerModel = contractTypeSrv.sendBinnacle(vm.contractType, registerModel , vm.cmd);  
                moneyBankDollSrv.captureDirectBank(registerModel)
                    .then( function (_res) {
                        vm.infoMessage = ErrorMessage.createError( _res.data.outCommonHeader.result.messages );
                        _folio = _res.data.outMMDirectBondOrdersRegistration.orderData[0].orderID;
                        message = 'La orden se envió de manera correcta.' + '<br>' + 'OrderId: ' + _folio + '<br>' + vm.infoMessage;
                        CommonModalsSrv.done(message);
                        vm.loading = false;
                        vm.finish();
                    }).catch(function (error) {
                    vm.finish();
                    CommonModalsSrv.error( ErrorMessage.createError( error.data.messages ) );
                }).finally(function () {
                    cleanModels();
                    vm.finish();
                });
            }

            var _json = {
                Contrato : registerModel.clientID,
                Movimiento : registerModel.buySell
            };
            _json = JSON.stringify(_json);	

            registerModel.jsonDetails = _json;

            vm.confirmModel = false;            
            vm.capturedModel = true;
        };

        vm.finish = function(){
            cleanModels();
            vm.finishModel = true;
            vm.tab = null;
            $scope.instrument = null;

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

        function initReporto(){
            vm.tab = 'buy';
            vm.loading = true;            
            init();              
            //vm.confirmationModel = false;
        }


        // Init application only if instrument is selected
        $scope.$watch( 'type', function(){
            vm.tab = false;            
            $scope.instrument = null;
            cleanModels();
        });
                
        $scope.$watch( 'instrument', function(_newInstrument, _oldInstrument ){
                                    
            vm.sinstrument = $scope.instrument;
            if (_newInstrument !== _oldInstrument && $scope.type === 'directo'){
                vm.directSection.changeInstrument = true;                
            };

            cleanModels();
            if(typeof vm.sinstrument !== 'undefined' && vm.sinstrument !== null){
                vm.confirmModel = false;
                if(vm.sinstrument.origen === 'POSICION'&& ($scope.type === 'reporto' || $scope.type === 'subastas')) {
                    $scope.instrument = null;
                }else if($scope.type === 'reporto'){
                    vm.tab = 'buy';
                    initReporto();
                }else if($scope.type === 'directo'){
                    //Entra por bandas
                    if(vm.sinstrument.priceType === 'Yield' || vm.sinstrument.priceType === 'Residual Dirty'){
                        var totalTC = vm.sinstrument.averagePurchaseMargin * vm.sinstrument.exchangeRate;
                        var value = vm.sinstrument.priceType === 'Residual Dirty' ?  Number(totalTC.toFixed(8)) : vm.sinstrument.averagePurchaseMargin;                        
                        vm.tab = 'buy';
                        vm.titles = 1;
                        vm.cmd.type = 'titles';
                        vm.getValuesData = true;
                        getValues(vm.sinstrument.priceType, value);
                        init();
                    //Entra por posicion
                    }else if(vm.sinstrument.origen === 'POSICION'){
                        var totalTC = vm.sinstrument.selectedInstrument.averagePurchaseMargin * vm.sinstrument.selectedInstrument.exchangeRate;
                        var value = vm.sinstrument.selectedInstrument.priceType === 'Residual Dirty' ?  Number(totalTC.toFixed(8)) : Number(vm.sinstrument.selectedInstrument.averagePurchaseMargin.toFixed(8));
                        vm.tab = 'sell';
                        vm.titles = 1;
                        vm.cmd.type = 'titles';
                        vm.getValuesData = true;
                        getValues( vm.sinstrument.selectedInstrument.priceType , value);
                        init();
                    }else{
                        $scope.instrument = null;
                    }
                }else if($scope.type === 'subastas'){
                    vm.tab = 'buy';
                    moneyBankDollSrv.getAuctionsPrice(vm.sinstrument.auctionID).then(function (_res) {
                        if(_res.success){
                            vm.auctionPriceList = R.map( function( _val ){
                                _val.text = _val.priceType;
                                return _val;
                            }, _res.data.outMoneyMarketAuctionsPriceQuery.auctionsQueryList.auctionRecord );
                        }
                    }).catch(function(_res){                        
                        if(_res.success){
                            CommonModalsSrv.error(_res.msg);
                        }else{
                            CommonModalsSrv.systemError();
                        }                        
                    });
                    init();
                }
            }
        } );
    }

    angular
        .module( 'actinver.controllers')
        .controller( 'moneyBankDollCtrl', moneyBankDollCtrl );

})();
