( function(){
    'use strict';

    function searchListCtrl( $scope, $filter, NgTableParams ){
        var vm = this;

        function setInfo(){
            var defaults = {
                    page: 1,
                    count: 10,
                },
                opts = angular.merge( {}, defaults, $scope.settings );

            vm.table = new NgTableParams( opts, {
                counts: [],
                paginationMaxBlocks: 7,
                dataset: $scope.info,
            });

           
        }

        vm.filterInfo = function(){
            vm.table.filter({ $: vm.filter });
        };


        setInfo();
    }

    angular
        .module( 'actinver.controllers')
        .controller( 'searchListCtrl', searchListCtrl );

})();
