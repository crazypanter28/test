( function(){
    "use strict";

    function admonInvestmentModalCtrl( $uibModalInstance, title, investment, InvestmentAdminSrv ){
        var vm = this;

        function setup () {
            setupVars();
            getFundTypes();
        }

        function getFundTypes(){
            InvestmentAdminSrv.getFundTypes().then(function(_res){
                vm.clasification =  _res.map(function( _val ){
                    _val.text = _val.description;
                    return _val;
                });
            });
        }


        function setupVars () {
            vm.title = title;
            // vm.investment = investment;
            if( investment ){
                investment.clasification.text = investment.clasification.description;
            }
            
            vm.type = investment ? 'fund' : '';
            vm.fund = investment ?  investment : {};
        }


        vm.setType = function ( _type ) {
            vm.type = _type;
        };


        vm.close = function(){
            $uibModalInstance.dismiss();
        };


        vm.done = function(){
            vm.fund.type = vm.type;
            $uibModalInstance.close( vm.fund );
        };


        setup();

    }

    angular.module( 'actinver.controllers' )
        .controller( 'admonInvestmentModalCtrl', admonInvestmentModalCtrl );

} )();
