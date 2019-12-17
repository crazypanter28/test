( function(){
    "use strict";

    function creditCtrl( creditSrv, prospectSrv ){
        var vm = this;

        function setup(){
            vm.payment = 0;
            vm.quote ={
                optionsSelectedDropdowm : null,
                type: 'fisica',
            };

            vm.optionsDropdowm=[
                {
                    id: 1,
                    text: 'Crédito Valor',
                },
                {
                    id: 2,
                    text: 'Crédito Prendario Tasa Variable',
                },
            ];
        }

        vm.changeOptionSelectedDropdowm =  function ( _option ) {
            vm.quote = {
                type: 'fisica',
            };
            vm.quote.optionsSelectedDropdowm = _option;
            vm.payment = 0;
        };

        vm.getPayment = function(){
            creditSrv.getSimPayment( vm.quote ).then(function( _res){
                vm.payment = _res.payment;
            });
        };

        vm.quotation = function(){
            creditSrv.quotation( vm.quote ).then(function( _res ){
                vm.quotationDetail =  _res;
                vm.showNewQuotation = true;
            });
        };

        vm.back = function(){
            // setup();
            vm.showNewQuotation = false;
        };

        vm.print = function(){
            prospectSrv.downloadPDF();
        };


        setup();
    }

    angular
        .module( 'actinver.controllers' )
        .controller( 'creditCtrl', creditCtrl );

})();
