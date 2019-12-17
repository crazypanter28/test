(function(){
    'use strict';

    function products(){

        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/scripts/directives/products/products.html',
            scope: {
                model: '=',
            },
            controller: 'proposalsProductsCtrl',
            controllerAs: 'list'
        };
    }

    angular
        .module( 'actinver.directives' )
        .directive( 'products', products );

} )();