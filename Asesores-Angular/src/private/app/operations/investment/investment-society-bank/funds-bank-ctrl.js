

( function(){
    "use strict";

    function fundsBankCtrl( $scope){
        var vm = this;

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
        .controller( 'fundsBankCtrl', fundsBankCtrl );

})();
