( function(){
    'use strict';

    function operationCtrl(  $state, $sessionStorage, CommonModalsSrv ){
        var vm = this;

        // Get current client information
        vm.sclient = ( $sessionStorage.sclient ) ? $sessionStorage.sclient : {};
        vm.showSystemError = CommonModalsSrv.systemError;

        // Get selected client
        vm.getSelectedClient = function( state, _contract){
            localStorage.setItem('contractSelected', JSON.stringify(_contract));
            if( typeof vm.sclient.data !== 'undefined' ){
                vm.show_instructions = false;
                $state.go( state );
            }
        };

    }

    angular
        .module( 'actinver.controllers' )
        .controller( 'operationCtrl', operationCtrl );

})();