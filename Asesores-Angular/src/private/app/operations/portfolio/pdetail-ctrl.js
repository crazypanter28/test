( function(){
    'use strict';

    function pDetailCtrl( $scope, $q, CommonModalsSrv, pDetailSrv ){
        var vm = this,
            contract_types = [ 'common', 'asset' ],
            contracts_reqs = [];

        // Settings
        vm.contracts = {
            common: false,
            asset: false
        };

        // Set all request
        angular.forEach( vm.contracts, function( val, type ){
                contracts_reqs.push( pDetailSrv.getAllContractsDetails( type, $scope.operations.sclient.contracts_list ) );

        } );

        // Make all requests
        $q.all( contracts_reqs ).then( function successCallback( response ){
                var types_counter = 0;

                // Assign information
                angular.forEach( response, function( info ){
                    var type = contract_types[types_counter];
                    vm.contracts[ type ] = info;
                    types_counter++;
                } );

            }, function errorCallback( info ){
                var message;

                // Hide preloader
                vm.contracts = {
                    common: [],
                    asset: []
                };

                if( info.type === 'not-found' ){
                    $scope.operations.showSystemError();
                } else {

                    var error = R.find(function( val ){
                        if( val.responseType === 'N' ){
                            return val.responseCategory === 'ERROR' || val.responseCategory === 'FATAL';
                        }
                    } )( info.data.outCommonHeader.result.messages );

                    message = error ? error.responseMessage : 'Se Encontró Un Error Favor De Intentarlo Más Tarde, Comuníquese Con Su Help desk';
                    CommonModalsSrv.error( message );

                }

            } );

    }

    angular
    	.module( 'actinver.controllers' )
        .controller( 'pDetailCtrl', pDetailCtrl );

})();