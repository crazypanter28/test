( function(){
    'use strict';

    function moneyDollCtrl( $scope, transfersSrv, CommonModalsSrv, moneyDollSrv, $sessionStorage, contractTypeSrv, loginSrvc){
        var vm = this;

        // Defaults
        vm.sinstrument;
        vm.currentCash = 0;
        vm.interestCattle = 0;
        vm.transaction = {};
        vm.calculateInterest = calculateInterest;
        vm.cleanModels = cleanModels;
        vm.modify = modify;
        vm.confirm = confirm;
        vm.capture = capture;
        vm.finish = finish;
        var contract = JSON.parse(localStorage.getItem('contractSelected'));
        vm.contractType = contractTypeSrv.contractType( contract.isPropia , contract.isEligible, contract.isDiscretionary);

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

        function resetTipoMedio(success, msg) {
            vm.tipoMedio.msg = success ? '' : msg;
            vm.tipoMedio.showMsg = !success;
        }

        function init(){
            cleanModels();

            // Get current contract cash
            moneyDollSrv.getCurrentCash( $scope.contract.contractNumber ).then( function( _res ){

                if( _res.data.outCommonHeader.result.result === 1 ){
                    vm.currentCash = _res.data.outA2KContractBalance.balance.buyingPowerData.cash48;
                }

                // Get current media list
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
                vm.loading = false;

                $scope.focusElement();
            });
        }

        // Calculate interest based on invest and some variables
        function calculateInterest(){
            if( vm.invest ){
                vm.interestCattle = ( ( vm.sinstrument.maxRate / 36000 ) * vm.invest  * vm.sinstrument.minTerm  );
            } else {
                vm.interestCattle = 0;
            }
        }

        // Clean fields
        function cleanModels(){
            vm.cmd = {
                media: {}
            };
            vm.interestCattle = 0;
            vm.invest = null;
            vm.transaction = null;
            vm.confirmationModel = null;
            vm.captureModel = null;
            vm.operationReference = null;
            vm.optimumRate = null;
            vm.term = null;
            resetTipoMedio(true, '');
        }

        // Pre-confirmation for current transaction
        function confirm(){
            vm.loading = true;

            // Set info in object
            vm.transaction = {
                contract: $scope.contract,
                invest: {
                    amount: vm.invest
                },
                sinstrument: vm.sinstrument,
                operationReference : vm.operationReference,
                optimumRate : vm.optimumRate,
                term : vm.term
            };

            // Send information
            moneyDollSrv.confirmDoll( vm.transaction )
                .then( function( _res ){
                    vm.confirmationModel = _res;
                    vm.loading = false;
                } )
                .catch(function (_error) {
                    vm.loading = false;
                    var message = '';
                    angular.forEach(_error, function(_value){
                        message += _value.responseMessage + '<br>';
                    });

                    CommonModalsSrv.error(message);
                });
        }

        // Return for changes in doll
        function modify(){
            vm.confirmationModel = null;
        }

        // Second and final confirmation
        function capture(){
            vm.loading = true;
            var _user = $sessionStorage.sclient.data.name + ' ' + $sessionStorage.sclient.data.lastName + ' ' + $sessionStorage.sclient.data.secondLastName;
            // Send complete information to get transaction folio
            moneyDollSrv.captureDoll( vm.transaction, vm.cmd, _user, vm.contractType )
                .then( function( _res ){
                    var message;
                    if(_res.outCommonHeader.operationName === 'BondMarketOrderRegistration'){
                        // Set new information and show lightbox confirmation
                        vm.captureModel = _res.outBondMarketOrderRegistration.bondOrder;
                        message = 'La '+ ( vm.tab==='buy' ? 'compra' : 'venta' ) +' se envió de manera correcta.';
                        message += '<br>Con el folio de la operación <b>' +vm.captureModel.orderReference +'</b>';
                    }else{
                        vm.captureModel = vm.confirmationModel;
                        message =  _res.outAdviserPendingOpRegistration.operationsDetails[0].message;
                        message += '<br>Con el ID Registro <b>' +_res.outAdviserPendingOpRegistration.operationsDetails[0].operationID+'</b>';
                    }
                        // Update instruments / orders tables with new information
                        vm.finish();
                        $scope.$emit( 'updateItems' );
                        CommonModalsSrv.done(message);
                vm.loading = false;
            }).catch(function (_error) {
                vm.loading = false;
                var message = '';
                angular.forEach(_error, function(_value){
                    message += _value.responseMessage + '<br>';
                });
                CommonModalsSrv.error(message);
                vm.finish();
            });
        }

        // Finish purchase process
        function finish(){
            $scope.instrument = null;
            vm.operationReference = null;
            vm.optimumRate = null;
            vm.term = null;
        }

        // Init application only if instrument is selected
        $scope.$watch( 'instrument', function(){
            vm.sinstrument = $scope.instrument;

            if(vm.sinstrument !== null){
                vm.loading = true;
                init();
            }
        } );
    }

    angular
        .module( 'actinver.controllers')
        .controller( 'moneyDollCtrl', moneyDollCtrl );

})();
