( function(){
    'use strict';

    function capitalsDollCtrl( $rootScope, $scope, capitalsDollSrv, contractTypeSrv, moneyDollSrv, transfersSrv, TableStationsSrv, $log, CommonModalsSrv, investmentSrv, $sessionStorage, ErrorMessage , moment, loginSrvc){
        var vm = this;
        var titlesForOrders;
        var userName = $sessionStorage.sclient.data.name + ' ' + $sessionStorage.sclient.data.lastName + ' ' + $sessionStorage.sclient.data.secondLastName;
        vm.regex = '\\d+MK|\\d+mk|\\d+mK|\\d+Mk|\\d+K|\\d+k|\\d';

        var sendModel;
        var contract = JSON.parse(localStorage.getItem('contractSelected'));
        vm.contractType = contractTypeSrv.contractType( contract.isPropia , contract.isEligible, contract.isDiscretionary);
        vm.isPropia = contract.isPropia;
        vm.isEligible = contract.isEligible;

        vm.validateTitles = function (_orderType, _titles) {
            vm.LPmessage = false;
            vm.VOmessage = false;
            if(_orderType !== undefined) {
                if ((_orderType.shortKey.trim() === 'LP' || _orderType.shortKey.trim() === 'DC') && _titles < 100) {
                    vm.LPmessage = true;
                    vm.VOmessage = false;
                } else if ((_orderType.shortKey.trim() === 'VO' || _orderType.shortKey.trim() === 'MA') && _titles < 2000) {
                    vm.VOmessage = true;
                    vm.LPmessage = false;
                }
            }
        };
        vm.tipoMedio={
            msg : '',
            showMsg:false
        };

        vm.onChangeTypeMedio = function (_last, _new) {
            //Medios electronicos id = 4
            if(_new.id === "4"){
                loginSrvc.validateUserTokens().then(function success(response){
                    resetTipoMedio(response.success, response.msg);
                }).catch(function error(error){
                    resetTipoMedio(error.success, error.msg);
                });
            }else{
                resetTipoMedio(true, '');
            }
        };

        function resetTipoMedio(success, msg){
            vm.tipoMedio.msg =  success ? '': msg;
            vm.tipoMedio.showMsg = !success;
        }

        function setup(){
            setupVars();
            getAllStations(); //carga todas la emisoras para el filtro
            initLoads();
            getTitles();
        }

        vm.cleanModels = function(){
            newState( false );
            /*resetTipoMedio(true, '');
            //se resetea el tipo de media
            vm.cmd.media.type = null;*/
            vm.cmd.station = null;
            vm.cmd.priceStation = null;
            vm.cmd.binnacle.comments = null;
        };

        $scope.$watch( 'stations', function () {
            if ( $scope.stations ) {
                vm.stations = $scope.stations;
            }
        });

        //determina si el clic fue venta o compra del stations
        $rootScope.$watch( 'actionStation', function(){
            if( $rootScope.actionStation && $rootScope.actionStation.operationType === 'Casa'){
                    vm.confirmationModel = null;
                    vm.loading = true;
                    vm.AddStation($rootScope.actionStation.station );                
                    vm.changeTab($rootScope.actionStation.type);
                }
            }
        );


        vm.getOrderValidity = function (_id) {            
            vm.cmd.orderValidity = undefined;
            vm.orderValidity = undefined;
            if(_id === 'BMV'){
                _id = '1';
            }else if(_id === 'BIVA'){
                _id = '2';
            }else if(vm.cmd.order.value.stockMarketValueType.trim() == '0'){
                _id = '0';
            }

            capitalsDollSrv.getOrderValidity(_id, vm.cmd.order.value.shortKey).then(function( _res ){
                var _order = _res.data.outOrderValidityQuery.orderType;
                var _orderValidity = [];
                angular.forEach(_order,function(value){
                    _orderValidity.push({id : value.key, text : value.businessKey});
                });
                vm.orderValidity = _orderValidity;
            });
        };

        vm.changeOperationType = function (_order) {

            if($rootScope.actionStation !== undefined){
                vm.cmd.typeStock = $rootScope.actionStation.station.feed;
            }else{
                vm.cmd.typeStock = '0';
            }

            if(_order.stockMarketValueType === '99' &&  vm.cmd.typeStock === 'BMV'){
                vm.cmd.typeStock = '1';
            }else if(_order.stockMarketValueType === '99' &&  vm.cmd.typeStock === 'BIVA'){
                vm.cmd.typeStock = '2';
            }else if(_order.stockMarketValueType === '99' &&  vm.cmd.typeStock === 'SOR'){
                vm.cmd.typeStock = '0';    
            }else if( _order.stockMarketValueType === '2'){
                vm.cmd.typeStock = '2';
            }else if( _order.stockMarketValueType === '1' || _order.stockMarketValueType === '99'){
                vm.cmd.typeStock = '1';
            }else if( _order.stockMarketValueType === '0' ){
                vm.cmd.typeStock = '0';
            }

            if(vm.cmd.order.value.shortKey.trim() !== 'SL' && vm.cmd.order.value.shortKey.trim() !== 'TS'){
                vm.getOrderValidity(vm.cmd.typeStock);
            }
            vm.showPrice = false;
            vm.showLimitPrice = false;
            vm.showVolume = false;
            vm.showVolMin = false;
            vm.cmd.operatorTypeRL = false;
            vm.cmd.operatorTypeRO = false;


            if(vm.cmd.order.value.shortKey.trim() === 'LP' || vm.cmd.order.value.shortKey.trim() === 'VO' ||
                vm.cmd.order.value.shortKey.trim() === 'BQ' || vm.cmd.order.value.shortKey.trim() === 'ET' ||
                vm.cmd.order.value.shortKey.trim() === 'EV' || vm.cmd.order.value.shortKey.trim() === 'PA'){
                vm.showPrice = true;
            }

            if(vm.cmd.order.value.shortKey.trim() === 'PR' || vm.cmd.order.value.shortKey.trim() === 'MA' ||
                vm.cmd.order.value.shortKey.trim() === 'MP' || vm.cmd.order.value.shortKey.trim() === 'LO' ||
                vm.cmd.order.value.shortKey.trim() === 'MO' || vm.cmd.order.value.shortKey.trim() === 'PA' ||
                vm.cmd.order.value.shortKey.trim() ==='XM'){
                vm.showLimitPrice = true;
            }

            if(vm.cmd.order.value.shortKey.trim() === 'VO' || vm.cmd.order.value.shortKey.trim() === 'LO' ){
                vm.showVolume = true;
            }

            if( vm.cmd.order.value.shortKey.trim() ==='XM'){
                vm.showVolMin = true;
            }

            if( vm.cmd.order.value.shortKey.trim() === 'BQ' || vm.cmd.order.value.shortKey.trim() === 'ET' ||
                vm.cmd.order.value.shortKey.trim() === 'EV' || vm.cmd.order.value.shortKey.trim() === 'LO' ||
                vm.cmd.order.value.shortKey.trim() === 'LP' || vm.cmd.order.value.shortKey.trim() === 'MC' ||
                vm.cmd.order.value.shortKey.trim() === 'PA' || vm.cmd.order.value.shortKey.trim() ==='XM' ||
                vm.cmd.order.value.shortKey.trim() === 'ML'){
                vm.cmd.operatorTypeRO = true;
            }

            if(vm.cmd.order.value.shortKey.trim() === 'HC' || vm.cmd.order.value.shortKey.trim() === 'LO' ||
                vm.cmd.order.value.shortKey.trim() === 'LP' || vm.cmd.order.value.shortKey.trim() === 'MA' ||
                vm.cmd.order.value.shortKey.trim() === 'MC' || vm.cmd.order.value.shortKey.trim() === 'MP' ||
                vm.cmd.order.value.shortKey.trim() === 'PA' || vm.cmd.order.value.shortKey.trim() === 'VO' ||
                vm.cmd.order.value.shortKey.trim() === 'XM' || vm.cmd.order.value.shortKey.trim() === 'ML'){
                vm.cmd.operatorTypeRL = true;
            }

            if(vm.cmd.operatorTypeRO === true && vm.cmd.operatorTypeRL === true){
                vm.cmd.operatorType = 'RL';
            }else if(vm.cmd.operatorTypeRO === true){
                vm.cmd.operatorType = 'RO';
            }else if(vm.cmd.operatorTypeRL === true){
                vm.cmd.operatorType = 'RL';
            }
        };

        function validateStation( _station){
            var name;
            var newStation = angular.copy( _station );
            if( typeof newStation.issuer !== 'object'){
                name = newStation.issuer;
                newStation.issuer ={
                    issuerName: name,
                    serie: newStation.serie
                };
            }
            return newStation;
        }

        vm.AddStation = function( _station ){
            var _id = '0';
            if( _station){
                vm.cmd.station = validateStation(_station);
                if(_station.issuer && _station.issuer.issuerName){
                    vm.cmd.priceStation = _station.lastPrice;
                    vm.cmd.order.model.maxPrice = _station.tradeBuyPrice;
                }else{
                    vm.cmd.priceStation = _station.weightedLastPrice;
                    vm.cmd.order.model.maxPrice = _station.weightedLastPrice;
                }
                searchTtitles();
                changeEmisora();
            
                if(_station.feed === 'BMV'){
                    _id = '1';
                }else if(_station.feed === 'BIVA'){
                    _id = '2';
                }
                vm.cmd.typeStock = _id;
            }
        };

        function changeEmisora () {
            $rootScope.$broadcast('select-emisora-toTable-cb', vm.cmd.station);
        }

        vm.modify = function(){
            vm.confirmationModel = null;
        };

        vm.changeTab = function( _tab ){
            vm.tab = _tab;
            newState(false);
            vm.cmd.evtentType = _tab;
            $scope.columnsExpand= false;
            $scope.focusElement();
            vm.cmd.order.type = 'basic';
            vm.dataListTipoOrdenesFilter = vm.statusOrders;
            vm.dataListTipoOrdenesFilterSell = vm.statusOrdersSell;

            var _orders;
            if(vm.tab === 'sell'){
                _orders = vm.statusOrdersSell;
            }else{
                _orders = vm.statusOrders;
            }
            if( _orders.length > 0){
                var item = R.find(function(_val){
                    return  _val.orderType === 'LP';
                },  _orders);
                vm.cmd.order.value = item;
                vm.cmd.typeStock = '1';
                vm.getOrderValidity('1');
                vm.changeOperationType(item);
            }
        };


        function getTitleValue( _str) {
            var str = _str;
            var _title;
            str.toUpperCase();
            if((/MK/i.test(str))){
                _title = str.replace(/\D+/g,'');
                _title = parseInt(_title)  * 1000000;
            }else if((/K/i.test(str))){
                _title = str.replace(/\D+/g,'');
                _title = parseInt(_title);
                _title = _title * 1000;
            }else{
                _title =  vm.cmd.order.model.titles;
            }
            return _title;
        }
        vm.confirm = function(){
            vm.cmd.titlesMK = getTitleValue(vm.cmd.order.model.titles);
            vm.loading = true;
            if(vm.cmd.order.value.shortKey === 'SL' || vm.cmd.order.value.shortKey === 'TS'){
                sendModel = {
                    contractNumber : $scope.contract,
                    coupon: 0,
                    issuerName: vm.cmd.station.issuer.issuerName,
                    serie: vm.cmd.station.issuer.serie,
                    movement: vm.cmd.order.value.shortKey.trim(),
                    lowerPercentage: vm.cmd.order.value.shortKey.trim() === 'TS' ? vm.cmd.order.model.floorPricePercentage : 0,
                    higherPercentage: vm.cmd.order.value.shortKey.trim() === 'TS' ? vm.cmd.order.model.ceilingPricePercentage : 0,
                    lowerPrice: vm.cmd.order.value.shortKey.trim() === 'SL' ? vm.cmd.order.model.floorPrice : 0,
                    higherPrice: vm.cmd.order.value.shortKey.trim() === 'SL' ? vm.cmd.order.model.ceilingPrice : 0,
                    stopType: 'MA',
                    sellingTitles: vm.cmd.titlesMK,
                    name: $sessionStorage.sclient.data.name + ' ' + $sessionStorage.sclient.data.lastName + ' ' + $sessionStorage.sclient.data.secondLastName,
                    /*instructionDate: moment(vm.cmd.date).format('DDMMYYYY'),
                    instructionTime: vm.cmd.media.type.text === 'TELEFONO' ? vm.cmd.binnacle.time + ':00' : null,
                    extensionNumber: vm.cmd.media.type.text === 'TELEFONO' ? vm.cmd.binnacle.phone : null,
                    tracingKey: vm.cmd.media.type.id,
                    comments: vm.cmd.binnacle.comments,*/
                };
                sendModel = contractTypeSrv.sendBinnacle(vm.contractType, sendModel , vm.cmd);
                vm.confirmationModel = sendModel;
                vm.loading = false;
            }else{
                capitalsDollSrv.confirmDoll( vm.cmd, $scope.contract, userName, vm.contractType)
                    .then(function( _res ){
                        vm.confirmationModel = _res.outCMOrderManagement.capitalMarketOrder;
                    })
                    .catch( function(_res){
                        var error = R.find( function( _val ){
                            if( _val.responseType === 'N' ){
                                return _val.responseCategory === 'FATAL' || _val.responseCategory === 'ERROR' || _val.responseCategory === 'INFO' ;
                            }
                        } )( _res);

                        var message = error ? error.responseMessage : 'Se Encontró Un Error Favor De Intentarlo Más Tarde, Comuníquese Con Su Help desk';
                        CommonModalsSrv.error( message );
                    })
                    .finally(function(){
                        vm.loading = false;
                    });
            }
        };

        vm.capture = function(){
            vm.loading = true;
            if(vm.cmd.order.value.shortKey === 'SL' || vm.cmd.order.value.shortKey === 'TS'){
                confirmStop ();
            }else{
                capitalsDollSrv.captureDoll( vm.cmd, $scope.contract, userName, vm.confirmationModel, vm.contractType)
                    .then(function( _res ){
                        vm.titlesMK  = getTitleValue(vm.cmd.order.model.titles);
                        var _total = (vm.cmd.priceStation * vm.cmd.titlesMK).toFixed(2);
                        var message;
                        if(_res.outCommonHeader.operationName === 'CMOrderManagement'){
                            vm.captureModel = {
                                res : _res.outCMOrderManagement.capitalMarketOrder,
                                outCMOrderManagement : {
                                    capitalMarketOrder : {
                                        netAmount : _total
                                    }
                                }
                            };
                            message = 'La '+ ( vm.tab==='buy' ? 'compra' : 'venta' ) +' se envió  de manera correcta.';
                            message += '<br>Con el folio de la operación <b>' +vm.captureModel.res.operationReference +'</b>';
                        }else{
                            vm.captureModel = vm.confirmationModel;
                            message =  _res.outAdviserPendingOpRegistration.operationsDetails[0].message;
                            message += '<br>Con el ID Registro <b>' +_res.outAdviserPendingOpRegistration.operationsDetails[0].operationID+'</b>';
                        }
                        $scope.$emit('updateCapitalsTab');
                        CommonModalsSrv.done(message);
                        vm.confirmationModel = null;
                        vm.captureModel = null;
                        newState(false);
                        if(vm.cmd.binnacle){
                            vm.cmd.binnacle = {
                                date: vm.cmd.binnacle.date
                            };
                        }
                    }).catch(function (_error) {
                    vm.loading = false;
                    var message = '';
                    angular.forEach(_error, function(_value){
                        message += _value.responseMessage + '<br>';
                    });
                    CommonModalsSrv.error(message);
                })
                    .finally(function(){
                        vm.loading = false;
                    });
            }


        };

        //recibe el evento que ha cambiado de tabs
        $rootScope.$on('select-emisora-toTable-changeTab-cb',function(){
            changeEmisora();
        });

        function confirmStop () {
            vm.loading = true;
            capitalsDollSrv.confirmStopLoss( sendModel )
                .then(function( _res ){
                    vm.captureModel = _res;
                    $scope.$emit('updateCapitalsTab');
                    var message = 'La venta se realizó de manera correcta.';
                    message += '<br>Con el folio de la operación <b>' +vm.captureModel.stopLoss[0].shares.operationReference +'</b>';
                    CommonModalsSrv.done(message);
                })
                .catch(function (_error) {
                    vm.loading = false;
                    var message = '';
                    angular.forEach(_error, function(_value){
                        message += _value.responseMessage + '<br>';
                    });

                    CommonModalsSrv.error(message);
                })
                .finally(function(){
                    vm.loading = false;
                });
        }

        vm.finish = function() {
            vm.confirmationModel = null;
            vm.captureModel = null;
            newState(false);
            vm.cmd.binnacle = {
                date: vm.cmd.binnacle.date
            };
        };

        function getTitles(){
            investmentSrv.getPortfolioInvestment( $scope.contract, 'MC')
            .then(function( _res ){
                if( _res.data.outCommonHeader.result.result === 1 ){
                    titlesForOrders = _res.data.outPortfolioDetailQuery.portfolios.portfolioDetail;
                }
            });
        }

        function searchTtitles(){
            if(titlesForOrders !== undefined){
                vm.titlesForSell = R.find( function( _station){
                    return _station.issuerName === vm.cmd.station.issuer.issuerName && vm.cmd.station.issuer.serie === _station.serie;
                }, titlesForOrders );
            }
        }

        function setupVars(){
            vm.statusOrders={
                close: [],
                advance: [],
                basic: [],
                stops: []
            };

            vm.confirmationModel = false;
            vm.captureModel = false;
            vm.cmd = {
                order:{
                    options:{
                        type: 'any'
                    },
                    model:{
                        term: 1,
                        maxPrice: '0'
                    }
                }
            };
        }

        function initLoads(){
            // Get current media list
            transfersSrv.getMedia().then(function( _res ){
                var _media = _res.data.outContactMeansCatalog.contactMeansCatalogData.contactMeans;
                var _mediaType = [];
                angular.forEach(_media,function(value){
                    if(value.key !== '5'){
                        _mediaType.push({id : value.key,text : value.description});
                    }
                });
                vm.Media = _mediaType;
            });
            loadStations();
        }

        function getCurrentCash(){
            moneyDollSrv.getCurrentCash( $scope.contract ).then(function( _res ) {
                if( _res.data.outCommonHeader.result.result === 1 ){
                    vm.currentCash = _res.data.outA2KContractBalance.balance.buyingPowerData.cash48;
                    $rootScope.currentCash = vm.currentCash;
                }
            })
            .finally(function(){
                vm.loading = false;
            });
        }

        function getOrderCatalog(){
            capitalsDollSrv.getOrderCatalog().then(function(_res){
                refactorSelect(_res);
            }).catch(function (error) {
                CommonModalsSrv.error( ErrorMessage.createError( error.result.messages ) );
                vm.statusOrders = null;
            });
        }

        function loadStations(){
                vm.cmd.station = $scope.station; 
                getOrderCatalog();
        }

        function refactorSelect( _types ) {
            vm.statusOrders = _types.orderType;
            vm.statusOrdersSell = [];
            vm.statusRouting = _types.stockMarketType;
            R.forEach( function( _val ){
                _val.shortKey = _val.orderType;
                _val.description = _val.orderDescription;
            }, _types.orderType );

            R.forEach( function( _val ){
                vm.statusOrdersSell.push(_val);
            }, vm.statusOrders );
            vm.statusOrdersSell.push({areaKey: 1, key: "-1", shortKey: "TS", description: "TRAILING STOP"}, {areaKey: 1, key: "-1", shortKey: "SL", description: "STOP LOSS"});
        }

        function newState( _newState ) {
            vm.cmd.orderValidity = undefined;
            vm.orderValidity = undefined;
            if( vm.cmd.station ){
                searchTtitles();
            }
            if( _newState ){
                vm.tab = null;
                vm.cmd.media ={};
            }
            vm.newState = _newState;
            getCurrentCash();
            // vm.cmd.binnacle = {
            //     date: vm.cmd.binnacle.date
            // };
            vm.cmd.order = {
                options:{
                    type: 'any'
                },
                model:{
                    term: 1,
                    maxPrice: vm.cmd.order.model.maxPrice
                }
            };

        }


        /** obtiene todas la emisoras para el el filtro del muñeco */
        function getAllStations(){
            TableStationsSrv.getStations( $scope.contract,1 ,5 ).then(function( _arrayStations ){
                $rootScope.statiosnTable = _arrayStations;    
                //console.info("Total Emisoras:"+_arrayStations.length);
                //console.info("Emisoras por pestaña:"+(vm.stations?vm.stations.length:0));          
            })
            .catch( function(){
                $log.info('get stations error');
                $scope.stations = [];
            } )
            .finally(function(){
                //getOrderCatalog();
            });

        }

        setup();
    }

    angular.module( 'actinver.controllers')
        .controller( 'capitalsDollCtrl', capitalsDollCtrl);


})();
