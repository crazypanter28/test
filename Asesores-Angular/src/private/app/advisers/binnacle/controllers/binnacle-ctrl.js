( function(){
    "use strict";

    function binnacleCtrl( $rootScope, $scope, $state, userConfig ){
        var vm = this;
        vm.type = $state.current.name;

        // Set current adviser
        vm.sadviser = userConfig.user;

        // Current state
        vm.currentState = function(){
            if($state.$current.includes['binnacle.commercial']){
                vm.type = 'binnacle.commercial';
            }

            if($state.is('binnacle') || $state.is('binnacle.commercial') ){
                $state.go('binnacle.commercial.strategy');
            }

            if ($state.is('binnacle.operative'))
            {
                $state.go('binnacle.operative.bank');
            }
        };

        // Get type
        vm.getType = function(value){
            $state.go('binnacle.' + value);
        };

        $rootScope.$on('$stateChangeSuccess', function(){
            vm.currentState();
        });
    }

    angular
        .module( 'actinver.controllers' )
        .controller( 'binnacleCtrl', binnacleCtrl );

})();
