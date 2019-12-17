(function(){
    'use strict';

    function portfolioDetailsCurrencyCtrl(){
        var vm = this;

        // Settings
        vm.propertyName = 'issuer';
        vm.reverse = false;

        // Sort details table
        vm.sortBy = function(propertyName) {
            vm.reverse = (vm.propertyName === propertyName) ? !vm.reverse : false;
            vm.propertyName = propertyName;
        };

    }

    angular
        .module( 'actinver.controllers' )
        .controller( 'portfolioDetailsCurrencyCtrl', portfolioDetailsCurrencyCtrl );

} )();