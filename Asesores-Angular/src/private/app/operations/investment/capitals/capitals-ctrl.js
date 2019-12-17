

( function(){
    "use strict";

    function capitalsCtrl( $scope ){
        var vm = this;

        var categories = {
            all:{
                val1: 1,
                val2: 5,
                text: 'TODAS'
            },
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
            trackNac:{
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
                case 2:
                    vm.stopLoss();
                break;
                case 3:
                    vm.trailingStop();
                break;
                case 4:
                    vm.clean();
                break;
            }
        });

        vm.categorySelected = categories.ipc;
    }

    angular.module( 'actinver.controllers' )
        .controller( 'capitalsCtrl', capitalsCtrl );

})();
