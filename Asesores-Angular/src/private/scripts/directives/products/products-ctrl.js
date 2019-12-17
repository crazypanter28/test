(function(){
    'use strict';

    function proposalsProductsCtrl( $scope, proposalsProposalSrv ){
        var vm = this;
        vm.products_list = [];

        // Setup directive
        function setup(){
            proposalsProposalSrv.getProducts()
                .then( function( response ){
                    angular.forEach( response.data, function( item ){
                        item.subproducts = {};
                        vm.products_list.push( item );
                    } );
                } );
        }

        // Get subproducts
        vm.getSubproducts = function( idx, product ){
            $scope.model.products[ product ].subproducts = {};

            proposalsProposalSrv.getSubProducts( product )
                .then( function( response ){
                    vm.products_list[ idx ].subproducts = response.data;
                }, function(){
                    vm.products_list[ idx ].subproducts = [];
                } );
        };

        // Init directive
        setup();
    }

    angular
        .module( 'actinver.controllers' )
        .controller( 'proposalsProductsCtrl', proposalsProductsCtrl );

} )();