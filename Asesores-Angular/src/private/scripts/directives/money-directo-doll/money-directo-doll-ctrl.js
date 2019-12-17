( function(){
    'use strict';

    function moneyDirectoDollCtrl( $scope, dollSrv, $filter, transfersSrv, CommonModalsSrv, investmentSrv, $sessionStorage ){

        var vm = this;
        var baseStation;

        function initBuy() {
            vm.cmd = {
                type:  'titles',
                media: {}
            };
        }

        function initSell(){
            vm.cmd.typeBank = 'efectivo';
        }

        /**
        * @params {object} object datePicker
        **/
        function disableDatePicker( _datePicker ){
            var mode = _datePicker.mode;
            var date = _datePicker.date;
            var isHoliDay;

            if( mode === 'day' ){
                var isDisable = R.find( function( _date ){
                    var _dtSrv = new Date( _date.operationDate );
                    return (date.getDate() === _dtSrv.getDate() && date.getMonth() === _dtSrv.getMonth() && date.getFullYear() === _dtSrv.getFullYear());
                }, vm.dollDescription.fund.operationDatesData.operationDateItem );

                if( isDisable ){
                    var isDisableDate =   isDisable ? new Date( isDisable.operationDate ): null;
                    isHoliDay = R.find( function( _date ){
                        var _dtSrv = new Date( _date );
                        return (isDisableDate.getDate() === _dtSrv.getDate() && isDisableDate.getMonth() === _dtSrv.getMonth() && isDisableDate.getFullYear() === _dtSrv.getFullYear());
                    }, vm.dollDescription.fund.holidayDatesData.holidayDate );
                }

                return isHoliDay ? true: (isDisable ? false : true);
            }
            return false;
        }

        vm.stations = [];
        vm.currentDate = $filter('date')(new Date, 'dd/MM/yyyy');

        function loadDoll2() {
            dollSrv.getDoll2( $scope.contract, vm.cmd.station, vm.tab, vm.anticipedSell ).then(function( _res ){
                if( _res.data.outCommonHeader.result.result === 1){
                    vm.dollDescription = _res.data.outFundQuery;
                    vm.cmd.dates  = vm.dollDescription.fund.operationDatesData.operationDateItem[0];
                    vm.orderDate  = vm.cmd.dates.operationDate;
                }
            });
        }


        vm.changeAnticipedSell = function(){
            loadDoll2();
        };

        $scope.datepickerOptions ={
            showWeeks : false,
            formatMonth : 'MMM',
            yearColumns : 3 ,
            dateDisabled: disableDatePicker,
        };


        /**
        * @param {date} date to find
        * @return {object} object with operationDate, settlementDate.
        **/
        function findDateExecution( _date ){
            return R.find( function( _operationDate){
                return _operationDate.operationDate === _date;
            },  vm.dollDescription.fund.operationDatesData.operationDateItem );
        }

        /** Load stations for the input share in the doll
        * @param {int} id
        **/
        function loadStations( _new ){
            investmentSrv.getStations( $scope.contract, _new ).then(function( _res ){
                vm.stations = _res.data.outInvestmentIssuersQuery.issuer;
            });
            initBuy();
        }

        /**
        * These services are initialized when the station is changed
        **/
        function loadInit() {
            loadDoll2();
            dollSrv.getDoll( $scope.contract ).then(function( _res ){
                if( _res.data.outCommonHeader.result.result === 1){
                    vm.currentCash = _res.data.outA2KContractBalance;
                }
            });

            investmentSrv.getDetailStations( (vm.cmd.station.issuerName || vm.cmd.station.issuer), vm.cmd.station.serie ).then(function(_res){
                if( _res.data.outCommonHeader.result.result === 1){
                    var rulesArray = _res.data.outFundOperationDataQuery.fundOperationData;
                    vm.rulesBuy = R.find( function( _val){
                        return _val.movementType.trim() === 'COMPRA';
                    }, rulesArray );
                    vm.rulesSell = R.find( function( _val){
                        return _val.movementType.trim() === 'VENTA';
                    }, rulesArray );
                }
            });
        }

        transfersSrv.getMedia().then(function( _res ){
            var _media = _res.data.outContactMeansCatalog.contactMeansCatalogData.contactMeans;
            var _mediaType = [];
            angular.forEach(_media,function(value){
                _mediaType.push({
                    id : value.key,
                    text : value.description
                });
            });
            vm.Media = _mediaType;
        });

        /**
        * @param {object} station object
        * @param {string} if the origin is input or external
        **/
        function reload( _station, _from ) {
            vm.newState = _from ? false : true;
            vm.tab = _from ? vm.tab: null;
            baseStation = _station;
            vm.cmd.station = baseStation;
            cleanModels();
            loadInit();
        }

        /**  Reset doll **/
        function cleanModels(){
            vm.cmd = {
                type:  'titles',
                media: {},
                station: baseStation,
            };
            vm.captureModel = null;
            vm.confirmationModel = null;
            vm.cmd.dates = vm.dollDescription ? vm.dollDescription.fund.operationDatesData.operationDateItem[0] : null;
        }

        vm.findDate = function(){
             vm.cmd.dates = findDateExecution( new Date( vm.orderDate).getTime() );
        };

        vm.AddStation = function( _station ){
            reload( _station, 'input' );
        };

        $scope.$watch( 'contract', function ( _new, _old) {
            if( !R.equals( _new, _old) ){
                vm.newState = false;
                vm.tab = null;
                cleanModels();
                loadInit();
            }
        });

        $scope.$watch( 'station',function( _new, _old){
            if( !R.equals( _new, _old) ){
                reload(_new);
            }
        });

        $scope.$watch( 'id',function( _new, _old){
            if( !R.equals( _new, _old) ){
                loadStations(_new);
            }
        });

        /** get absolute titles
        * @param {string} 'buy' or 'sell'
        **/
        $scope.changeSettlement2 = function( _model ){
            vm.cmd[_model].typeValue = $filter('currencyCustom')( vm.cmd[_model].typeValue2/ vm.dollDescription.fund.price, 0);
        };

        /** get Importe
        * @param {string} 'buy' or 'sell'
        **/
        $scope.changeSettlement = function( _model ){
            vm.cmd[_model].typeValue2 = vm.cmd[ _model ].typeValue * vm.dollDescription.fund.price;
        };

        /** Method to change the view on the doll
        * @param {string} 'buy' or 'sell'
        **/
        vm.changeTab = function( _tab ){
            if( _tab === 'sell' ){
                initSell();
                dollSrv.getBanks( $scope.contract ).then( function( _res ){
                    if( _res.data.outCommonHeader.result.result === 1 ){
                        vm.bankModel = R.map(function( _val ){
                            _val.text = _val.bankAccounts.bankName;
                            return _val;
                        }, _res.data.outDestinationAccountQuery.outA2KBankAccountsQuery.bankAccountsList);
                    }
                    else {
                        vm.bankModel = [];
                    }
                });
            }
            vm.newState = false;
            vm.tab = _tab;
            $scope.columnsExpand= false;
            $scope.focusElement();
            if( vm.cmd.station ){
                loadInit();
            }
        };

        /** create quotation **/
        vm.confirm = function(){
            vm.cmd.evtentType = vm.tab;
            dollSrv.confirmDoll( vm.cmd, $scope.contract ).then(function(_res){
                vm.confirmationModel = _res.data;
            },
            function( _res ){
                if( _res ){
                    var error = R.find( function( _val ){
                        if( _val.responseType === 'N' ){
                            return _val.responseCategory === 'FATAL' || _val.responseCategory === 'ERROR';
                        }
                    } )( _res.data );
                    var message = error ? error.responseMessage : 'Se Encontró Un Error Favor De Intentarlo Más Tarde, Comuníquese Con Su Help desk';

                    CommonModalsSrv.error( message );
                }
                // .result.then(function() {});
            });
        };

        /** capture quotation **/
        vm.capture = function() {
            var _user = $sessionStorage.sclient.data.name + ' ' + $sessionStorage.sclient.data.lastName + ' ' + $sessionStorage.sclient.data.secondLastName;
            dollSrv.captureDoll( vm.cmd, $scope.contract, _user, vm.confirmationModel ).then(function(_res){
                if( _res.data.outCommonHeader.result.result === 1){
                    var message;
                    if(_res.data.outCommonHeader.operationName === 'FundOrderRegistration'){
                        vm.captureModel = _res.data.outFundOrderRegistration.fundOrderResult;
                        message = 'La '+ ( vm.tab==='buy' ? 'compra' : 'venta' ) +' se envió de manera correcta.';
                        message += '<br>Con el folio de la operación <b>' +vm.captureModel.issuerTitlesSold.operationReference +'</b>';
                    }else{
                        vm.captureModel = vm.confirmationModel;
                        message =  _res.data.outAdviserPendingOpRegistration.operationsDetails[0].message;
                        message += '<br>Con el ID de operación <b>' +_res.data.outAdviserPendingOpRegistration.operationsDetails[0].operationID+'</b>';
                    }
                    $scope.$emit('updateTab');
                    CommonModalsSrv.done(message);
                }
            });
        };

        vm.cleanModels = cleanModels;

        /** modify method **/
        vm.modify= function(){
            vm.confirmationModel = null;
        };

        vm.finally = function(){
            cleanModels();
        };

        loadStations( $scope.id );

    }

    angular.module( 'actinver.controllers')
        .controller( 'moneyDirectoDollCtrl', moneyDirectoDollCtrl);


})();
