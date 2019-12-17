

( function(){
    "use strict";

    function capitalsLuminaCtrl( $scope ){
        var vm = this;

        var categories = {
            ipc:{
                val1: 2,
                val2: 2,
                text: 'IPC'
            },
            bmv:{
                val1: 3,
                val2: 5,
                text: 'BMV'
            },
            sic:{
                val1: 4,
                val2: 5,
                text: 'SIC'
            },
            trackInt:{
                val1: 5,
                val2: 5,
                text: 'TRACKINT'
            },
            trackDeuda:{
                val1: 6,
                val2: 5,
                text: 'TRACKNAC'
            },
            plusBursatiles:{
                val1: 7,
                val2: 3,
                text: '10MAS'
            },
            minusBursatiles:{
                val1: 8,
                val2: 4,
                text: '10MENOS'
            },
            all:{
                val1: 1,
                val2: 5,
                text: 'TODAS'
            }
        };
        
        vm.selected = function( _id ){
            vm.categorySelected = categories[_id];
            vm.tabSelect = _id;
        };

        $scope.$on( 'updateCapitalsTab', function(){
            switch ($scope.activeTab) {
                case 0:
                    vm.updateFunds();
                break;
                case 1:
                    vm.updateOrders();
                break;
            }
        });

        vm.categorySelected = categories.ipc;
    }

    angular.module( 'actinver.controllers' )
        .controller( 'capitalsLuminaCtrl', capitalsLuminaCtrl );

})();
