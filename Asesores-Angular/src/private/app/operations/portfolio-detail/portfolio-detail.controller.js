( function () {
    "use strict";

    function portfolioDetail ( $scope, portfolioDetailService, pResumeSrv, $filter, moment ) {
        var vm = this;
        vm.showDetail = showDetails;
        vm.typeFundsFilter=['DEUDA','VARIABLE','COBERTURA'];
         getDetail();

        function showDetails(topic){
            topic.show = topic.show ? false : true;
        }

        function getDetail(){
            var _contractList = $scope.operations.sclient.contracts_list;
            var _detail = [];
            var _detailBank = [];


            angular.forEach( _contractList, function( contract ){
                if( contract.companyName === 'Casa' ){
                    var _groupOrders = [];
                    portfolioDetailService.detail( contract.contractNumber ).then( function ( response ){
                       var fundsTypeDesk=[];
                        angular.forEach ( _.groupBy( response.data, 'marketTypeDesc' ) , function( value){
                           // Si es FONDOS DE INVERSIÓN clasifica
                            if(value[0].marketType === '1'){
                                //sub-clasifica para fondos por fundsTypeDesk para A2k
                                angular.forEach ( value , function( emisora){
                                    var subClassication=emisora.fundTypeDesc !==''? emisora.fundTypeDesc:'SIN CLASIFICAR';
                                    fundsTypeDesk.push({
                                        title : subClassication,
                                        emisora : emisora,
                                        show : false
                                    });
                                });
                            }

                            _groupOrders.push({
                                title : value[0].marketTypeDesc,
                                marketType:value[0].marketType,
                                ordersValue : value,
                                fundsTypeDesk:fundsTypeDesk,
                                show : false
                            });


                        });
                        _detail.push( {
                            detail : _groupOrders,
                            contractNumber : contract.contractNumber
                        } );
                    }).catch( function ( ) {
                        //console.log( error.data.outCommonHeader.result.messages);
                        //CommonModalsSrv.error( ErrorMessage.createError(  error.data.outCommonHeader.result.messages  ));
                    });



                }else{
                    var _groupOrdersBank = [];
                    portfolioDetailService.detailsBanks( contract.contractNumber , '2').then( function ( response ){
                        angular.forEach ( _.groupBy( response.data, 'valueTypeDesc' ) , function( value){
                            _groupOrdersBank.push({
                                title : 'FONDOS DE INVERSIÓN',
                                typeOp: '2',
                                ordersValue : value
                            });
                        });

                    }).catch( function ( ) {
                        //console.log( error.data.outCommonHeader.result.messages);
                        //CommonModalsSrv.error( ErrorMessage.createError(  error.data.outCommonHeader.result.messages  ));
                    });

                    var _date =  moment(new Date()).format('YYYYMMDD');
                    portfolioDetailService.detailsBanksMoney( contract.contractNumber , _date ).then( function ( response ){
                        angular.forEach ( _.groupBy( response.data, 'valueTypeDesc' ) , function( value){
                            _groupOrdersBank.push({
                                title : 'MERCADO DE DINERO',
                                typeOp: '1',
                                ordersValue : value
                            });
                        });
                    }).catch( function ( ) {
                        //console.log( error.data.outCommonHeader.result.messages);
                        //CommonModalsSrv.error( ErrorMessage.createError(  error.data.outCommonHeader.result.messages  ));
                    });

                    var _date =  $filter('date')(new Date(), 'ddMMyyyy');
                    portfolioDetailService.detailsBanksLumina( contract.contractNumber , _date ).then( function ( response ){
                        angular.forEach ( _.groupBy( response.data, 'valueTypeDesc' ) , function( value){
                            _groupOrdersBank.push({
                                title : 'MERCADO DE CAPITALES',
                                typeOp: '3',
                                ordersValue : value
                            });
                        });
                    }).catch( function ( ) {
                        //console.log( error.data.outCommonHeader.result.messages);
                        //CommonModalsSrv.error( ErrorMessage.createError(  error.data.outCommonHeader.result.messages  ));
                    });
                    _detailBank.push( {
                        detail : _groupOrdersBank,
                        contractNumber : contract.contractNumber
                    });
                }
            } );

            vm.detailBank = _detailBank;
            vm.detail = _detail;
            //groupDetail(_detailBank.detail,'fundType');
        }

        vm.resume_credits = false;
        pResumeSrv.getCreditsList($scope.operations.sclient.data.clientNumber)
            .then( function successCallback( response ){
                vm.resume_credits = response.data.result.outBankClientLoansQuery.currentLoans.bankLoan;
            }, function errorCallback(){
                vm.resume_credits = 'no-data';
            } );

        /*function groupDetail ( detail, type ){
            var _groupOrders = [];
            angular.forEach ( _.groupBy( detail, type ) , function( value, key ){
                _groupOrders.push({
                    title : value[0].marketTypeDesc,
                    type: value[0].portfolioTypeDesc,
                    ordersValue : value
                });
            });

            console.log('_groupOrders',_groupOrders);
        }*/

    }

    angular
        .module( 'actinver.controllers' )
        .controller( 'portfoli-detail.controller', portfolioDetail );
})();