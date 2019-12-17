

( function(){
    "use strict";

    function fundsCtrl( $scope, $state){
        var vm = this;

        if( !$scope.investment.contract ){
            $state.go('investment');
        }

        $scope.$on('updateTab', function(){
           // $scope.activeTab === 0 ?  vm.updateFunds() : vm.updateOrders();
            switch($scope.activeTab){
                    case 0:  vm.updateFunds(); break;
                    case 1:  vm.updateOrders(); break;
                    case 2:  vm.clean(); break;
            }
            
        });

        vm.selected = function( _id ){
            vm.tabSelect = _id;
        };
    }

    angular.module( 'actinver.controllers' )
        .controller( 'fundsCtrl', fundsCtrl );

})();
