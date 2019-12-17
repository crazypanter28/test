( function(){
    'use strict';

    function moneyCtrl( $scope, $rootScope ){
        var vm = this;

        $scope.$on( 'updateItems', function(){
     
            switch($scope.activeTab){
                case 0:  vm.updateInstruments(); break;
                case 1:  vm.updateOrders(); break;
                case 2:  vm.fhClean(); break;
            }
        } );

        vm.selected = function( _id ){
            vm.tabSelect = _id;
            if( vm.tabSelect ===  1 ){
                vm.type = 'directo';
                $rootScope.bands = null;
            } else {
                vm.type = 'reporto';
            }
        };
    }

    angular
        .module( 'actinver.controllers' )
        .controller( 'moneyCtrl', moneyCtrl );

})();