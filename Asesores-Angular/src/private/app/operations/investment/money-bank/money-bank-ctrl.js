

( function(){
    "use strict";

    function moneyBankCtrl(){
        var vm = this;
        vm.bandsDirect = [];

        vm.selected = function( _id ){
            vm.tabSelect = _id;
            if(vm.tabSelect ===  1){
                vm.type = 'directo';
            }else if(vm.tabSelect ===  2){
                vm.type = 'reporto';
            }else if(vm.tabSelect ===  3){
                vm.type = 'subastas';
            }
        };
    }

    angular.module( 'actinver.controllers' )
        .controller( 'moneyBankCtrl', moneyBankCtrl );

})();
