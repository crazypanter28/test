( function(){
    'use strict';

    function moneyDirectDollCtrl( $sessionStorage, moneyDirectDollSrv, ErrorMessage, CommonModalsSrv, contractTypeSrv, $rootScope, $scope, transfersSrv, loginSrvc){

        var vm = this;
        vm.stepA = true;
        vm.isDistribuida = false;
        vm.validoNumTitulos = false;
        vm.totalTitles = 0;
        vm.cmd = {
            binnacle:{
                comments:'',
                date : new Date()
            },
            type:  'titles',
            media: {}
        };
        var _issuer, _serie;
        var contract = JSON.parse(localStorage.getItem('contractSelected'));
        vm.contractType = contractTypeSrv.contractType( contract.isPropia , contract.isEligible, contract.isDiscretionary);

        vm.tipoMedio={
            msg : '',
            showMsg:false
        };
        
        
        function resetTipoMedio(success, msg){
            vm.tipoMedio.msg =  success ? '': msg;
            vm.tipoMedio.showMsg = !success; 
        }

        function init() {
            vm.table = '62';
            vm.contractNumber =  $scope.contract.contractNumber;
            if(vm.stepA === true){
               $rootScope.bands = null;
            }

            $rootScope.distOrder = false;

            $rootScope.pageConfig = {
               itemsPerPage: 5,
               fillLastPage: true
            };

            resetTipoMedio(true,'');

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

           moneyDirectDollSrv.getMoneyMarketContactMeansCatalogs('3', 'MONEDA', 'currency').then(function( _res ){
               var _media = _res.data.outMoneyMarketContactMeansCatalogs.contactMeans;
               var _mediaType = [];
               angular.forEach(_media,function(value){
                   _mediaType.push({
                       id : value.key,
                       text : value.description,
                       shortKey : value.shortKey,
                       numericKey : value.numericKey
                   });
               });
               vm.Currency = _mediaType.splice(1,6); //Se quita elemento duplicado del arreglo
           });

            moneyDirectDollSrv.getMoneyMarketContactMeansCatalogs('23', 'VOR','operationType').then(function( _res ){
                var _media = _res.data.outMoneyMarketContactMeansCatalogs.contactMeans;
                var _mediaType = [];
                angular.forEach(_media,function(value){
                    _mediaType.push({
                        id : value.key,
                        text : value.description,
                        shortKey : value.shortKey,
                        numericKey : value.numericKey
                    });
                });
                vm.operationType = _mediaType;
            });

            moneyDirectDollSrv.getMoneyMarketContactMeansCatalogs('23', 'RCTIPINS', 'instrument').then(function( _res ){
                var _media = _res.data.outMoneyMarketContactMeansCatalogs.contactMeans;
                var _mediaType = [];
                angular.forEach(_media,function(value){
                    _mediaType.push({
                        id : value.key,
                        text : value.description,
                        shortKey : value.shortKey,
                        numericKey : value.numericKey
                    });
                });
                vm.titleType = _mediaType;
            });

            moneyDirectDollSrv.getMoneyMarketContactMeansCatalogs('3', 'VALOR', 'settlement').then(function( _res ){
                var _media = _res.data.outMoneyMarketContactMeansCatalogs.contactMeans;
                var _mediaType = [];
                angular.forEach(_media,function(value){
                    _mediaType.push({
                        id : value.key,
                        text : value.description,
                        shortKey : value.shortKey,
                        numericKey : value.numericKey
                    });
                });
                vm.settlementType = _mediaType;
            });

       }


        function validaTitulo(){
            if(vm.isDistribuida)//si tiene la opcion de distibuida
            {
                if(parseFloat(vm.titlesQty) < parseFloat(vm.totalTitles)){
                    vm.validoNumTitulos=false;
                    vm.msgTitulos="El número de titulos operados no debe ser mayor al de titulos distribuidos";           
    
                }else{
                    vm.msgTitulos=null;
                    vm.validoNumTitulos=true;
                }
            }else{
                vm.msgTitulos=null;
                vm.validoNumTitulos=true;
            }

        }

        vm.isValidoTitulo = function(){       
           validaTitulo();
        };

        /**  Reset doll **/
        function cleanModels(){
            vm.cmd.media = null;
            vm.operationTimeNumber = null;
            vm.currencyTypeDesc = null;
            vm.table = null;
            vm.instrumentType = null;
            vm.captureModel = null;
            vm.confirmationModel = null;
            vm.settlement = null;
            vm.term = null;
            vm.instrument = null;
            vm.vencimiento = null;
            vm.reporto = null;
            vm.typeTitles = null;
            vm.typeImport = null;
            vm.titlesQty = null;
            vm.amount = null;
            vm.operationTypeV = null;
            vm.price = null;
            vm.adviserPrice = null;
            vm.adviserSurtaxRate = null;
            vm.adviserRate = null;
            vm.adviserDiscountRate = null;
            vm.adviserRate  = null;
            vm.adviserDiscountRate  = null;
            vm.adviserSurtaxRate  = null;
            vm.surtaxRate  = null;
            vm.price  = null;
            vm.discountRate  = null;
            vm.rate  = null;
            vm.issuerReporto = null;
            vm.serieReporto = null;
            vm.amount = null;
            $rootScope.bands = null;
            resetTipoMedio(true, '');
        }

        vm.changeOperationType = function ( type ) {            
            if ( type === 'titles' ) {
                vm.import = null;
            } else {
                vm.titles = null;
            }
        };

        vm.changeTab = function( _tab ){
            vm.tab = _tab;
            vm.loading = null;
            vm.confirmModel = null;
            vm.confirmationModel = null;
            vm.stepA = false;
            vm.stepB = true;
            vm.cleanModels();
            init();
        };

        vm.getType = function (_type) {
            vm.getBands(_type.id);
            if(_type.id === '2'){
                vm.issuerReporto = '';
                vm.serieReporto = '';
                vm.cmd.type =  'titles';
                if(vm.term !== null && vm.term !== undefined){
                    moneyDirectDollSrv.getMoneyMarketIssuersSeriesQuery( vm.settlement.shortKey, vm.term ).then( function( _res ){
                        $rootScope.bands = _res;
                    }).catch(function (error) {
                        cleanModels();
                        CommonModalsSrv.error( ErrorMessage.createError( error.data.messages ) );
                    });
                }
            }
        };

        vm.getBands = function (_operationTypeV) {
            if(_operationTypeV.id === '2'){
                if(vm.term !== null && vm.term !== undefined){
                    moneyDirectDollSrv.getMoneyMarketIssuersSeriesQuery( vm.settlement.shortKey, vm.term ).then( function( _res ){
                        $rootScope.bands = _res;
                    }).catch(function (error) {
                        cleanModels();
                        CommonModalsSrv.error( ErrorMessage.createError( error.data.messages ) );
                    });
                }
            }else{
                vm.cmd.type =  'import';
                $rootScope.bands = null;
            }
        };

        vm.distributedOrder = function () {
            $rootScope.distOrder = true;
            vm.totalTitles=0;
            vm.advider = '9055';

            moneyDirectDollSrv.getMoneyMarketAdviserContractsQuery( vm.advider, vm.contractNumber ).then( function( _res ){
                $rootScope.adviserContracts = _res.contract.contracts;
                vm.isDistribuida = false;
            }).catch(function (error) {
                cleanModels();
                CommonModalsSrv.error( ErrorMessage.createError( error.data.messages ) );
            });

        };

        function getIsser(){
            if(vm.issuerReporto && vm.serieReporto){
                _issuer = vm.issuerReporto;
                _serie = vm.serieReporto;
            }else if (vm.instrument){
                _issuer =  vm.instrument.issuer;
                _serie = vm.instrument.serie;
            }else if(!vm.issuerReporto && !vm.serieReporto || !vm.instrument){
                _issuer = ' ';
                _serie = ' ';
            }
        }

        vm.confirm = function () {
            getIsser();
            vm.stepA = false;
            vm.stepB = false; 
            vm.confirmModel = true;
            var _operationTimeNumber = vm.operationTimeNumber.replace(":", ".");
            var _model = {
                language : 'SPA',
                contractNumber: vm.contractNumber,
                issuer: _issuer,
                serie:  _serie,
                transactionType: vm.tab === 'buy' ? 1 : 2, //compra = 1 o venta = 2
                term: vm.term,
                amount: vm.amount ? vm.amount : 0,
                titlesQty: vm.titlesQty ? vm.titlesQty : 0,
                operationType: vm.operationTypeV.shortKey,
                settlementType: vm.settlement.shortKey,
                rate: vm.rate ? vm.rate : 0,
                discountRate: vm.discountRate ? vm.discountRate : 0,
                price: vm.price ? vm.price : 0,
                surtaxRate: vm.surtaxRate ? vm.surtaxRate : 0,
                distributedIndicator: vm.isDistribuida ? 'SI' : 'NO',
                distributedTitlesQty: vm.totalTitles,
                distributedTitlesAmount: 0,
                instrumentType: vm.instrumentType.shortKey,
                tableNumber: vm.table, //
                operationTimeNumber: _operationTimeNumber,
                currencyTypeDesc: vm.currencyTypeDesc.numericKey,
                adviserRate: vm.adviserRate ? vm.adviserRate : 0,
                adviserDiscountRate: vm.adviserDiscountRate ? vm.adviserDiscountRate : 0,
                adviserPrice: vm.adviserPrice ? vm.adviserPrice : 0,
                adviserSurtaxRate: vm.adviserSurtaxRate ? vm.adviserSurtaxRate : 0,
            };

            moneyDirectDollSrv.getMoneyMarketOrderQuotation(_model).then( function( _res ){
                vm.confirmModel = _res;
            }).catch(function (error) {
                vm.stepB = true;
                vm.stepA = false;
                vm.confirmModel = null;
                CommonModalsSrv.error( ErrorMessage.createError( error.data.messages ) );
            });
        };


        vm.capture =function () {
            var _user = $sessionStorage.sclient.data.name + ' ' + $sessionStorage.sclient.data.lastName + ' ' + $sessionStorage.sclient.data.secondLastName;
            var _model = {
                language : 'SPA',
                contractNumber: vm.confirmModel.contractNumber,
                issuer: vm.confirmModel.issuer,
                serie: vm.confirmModel.serie,
                transactionType: vm.tab === 'buy' ? 1 : 2, //compra = 1 o venta = 2
                term: vm.confirmModel.term,
                amount: vm.confirmModel.amount,
                titlesQty: vm.confirmModel.titlesQty,
                operationType: vm.confirmModel.operationType,
                settlementType: vm.confirmModel.settlementType,
                rate: vm.confirmModel.rate ? vm.confirmModel.rate : 0,
                discountRate: vm.confirmModel.discountRate ? vm.confirmModel.discountRate : 0,
                price: vm.price ? vm.confirmModel.price : 0,
                surtaxRate: vm.confirmModel.surtaxRate ? vm.confirmModel.surtaxRate : 0,
                distributedIndicator: vm.confirmModel.isDistribuida ? 'SI' : 'NO',
                distributedTitlesQty: vm.confirmModel.titlesQty,
                distributedTitlesAmount: 0,
                instrumentType: vm.confirmModel.instrumentType,
                tableNumber: vm.confirmModel.tableNumber, //
                operationTimeNumber: vm.confirmModel.operationTimeNumber,
                currencyTypeDesc: vm.confirmModel.currencyTypeDesc,
                adviserRate: vm.confirmModel.adviserInfo.adviserRate ? vm.confirmModel.adviserInfo.adviserRate : 0,
                adviserDiscountRate: vm.confirmModel.adviserInfo.adviserDiscountRate ? vm.confirmModel.adviserInfo.adviserDiscountRate : 0,
                adviserPrice: vm.confirmModel.adviserInfo.adviserPrice ? vm.confirmModel.adviserInfo.adviserPrice : 0,
                adviserSurtaxRate: vm.confirmModel.adviserInfo.adviserSurtaxRate ? vm.confirmModel.adviserInfo.adviserSurtaxRate : 0,
                requestorName: _user,
            };


            _model = contractTypeSrv.sendBinnacle(vm.contractType, _model , vm.cmd);

            moneyDirectDollSrv.getMoneyMarketOrderRegistration( _model ).then( function( _res ){
                var message;
                vm.captureModel = _res;
                var _folio = _res.length > 0 ? _res[0].operationID : vm.captureModel.operationReference;
                message = 'La '+ ( vm.tab==='buy' ? 'compra' : 'venta' ) +' se envió de manera correcta.';
                message += '<br>Con el folio de la operación <b>' +_folio+'</b>';
                CommonModalsSrv.done(message);
                $scope.$emit('updateTab');

                vm.finalStep = true;
                vm.stepA = true;
                vm.stepB = false;
                vm.confirmModel = null;
                vm.captureModel = null;
                $rootScope.bands = null;
                cleanModels();
            }).catch(function (error) {
                vm.stepB = true;
                vm.stepA = false;
                vm.confirmModel = null;
                CommonModalsSrv.error( ErrorMessage.createError( error.data.messages ) );
            });
         };

        vm.finish = function(){
            vm.stepA = true;
            vm.stepB = false;
            vm.confirmModel = null;
            vm.captureModel = null;
            $rootScope.bands = null;
            cleanModels();

        };

        vm.modify = function () {
            vm.stepB = true;
            vm.stepA = false;
            vm.confirmModel = false;
        };

        vm.cleanModels = cleanModels;

        $rootScope.getInstrument = function( _instrument) {
            vm.instrument = _instrument;
        };

        $rootScope.getValue=function( ) {
            var listJson=$rootScope.totalTitles;
            vm.totalTitles=0;
                angular.forEach(listJson,function(value){
                          if(value !== ''){
                            vm.totalTitles+=parseFloat(value) ;
                        }
                });
            validaTitulo();

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
    }
    angular.module( 'actinver.controllers')
        .controller( 'moneyDirectDollCtrl', moneyDirectDollCtrl);


})();

