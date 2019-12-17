( function(){
    'use strict';

    function goalsResumeCtrl( $scope, $filter, $timeout, goalsSupervisorSrv, goalsModalSrv ){
        var vm = this,
            initDate = moment().businessSubtract( 1 );

        // Search filter types
        vm.filter_types = goalsSupervisorSrv.search_filter_types;

        // Update report
        vm.updateReport = function( date ){
            var formatted_date = moment( date ).format( 'DD/MM/YY' );
            vm.current_date = formatted_date;
            $scope.$emit( 'changeDate', formatted_date );
            resetSearch();
        };

        // Set current filters
        vm.getFilter = function( filter ){
            vm.search = null;

            switch( filter.id ) {

                case 1:
                    filterInfo( $scope.search.info.elements, 'elements', 'total' );
                    break;

                case 2:
                    filterInfo( $scope.search.info.maxAdviser, 'maxAdviser', 'maxAdviserTotal' );
                    break;

                case 3:
                    filterInfo( $scope.search.info.minAdviser, 'minAdviser', 'minAdviserTotal' );
                    break;

                case 4:
                    filterInfo( $scope.search.info.maxFinancialCenter, 'maxFinancialCenter', 'maxFinancialCenterTotal' );
                    break;

                case 5:
                    filterInfo( $scope.search.info.minFinancialCenter, 'minFinancialCenter', 'minFinancialCenterTotal' );
                    break;
            }
        };

        // Get search filter info
        vm.getSearchInfo = function(){
            $timeout( function(){
                filterInfo( $filter( 'filter' )( $scope.search.info[ vm.filters.filter ], vm.search ), vm.filters.filter, vm.filters.totals );
            }, 100);
        };

        // Show center information
        vm.getCenterGoals = function( type, center ){
            // $scope.goals.sadviser.employeeID
            goalsModalSrv.showCenterDetail( type, $scope.$parent.$parent.goals.sadviser.employeeID, center, vm.current_date );
        };

        // Show adviser info
        vm.getAdviserGoals = function( adviserID, name ){
            goalsModalSrv.showAdviserDetail( adviserID, name, vm.current_date );
        };

        // Init
        function setup(){
            vm.updateReport( initDate );
        }

        // Reset search form
        function resetSearch(){
            vm.search = null;
            vm.selected_filter_type = {
                text: vm.filter_types[ 0 ].text
            };
        }

        // Set information by filter
        function filterInfo( info, filter_type, total_topic ){
            var filtered_info = $filter( 'orderBy' )( info, 'centroFinanciero' );

            // Group and format information
            vm.centers = $filter( 'groupJSON' )( filtered_info, 'centroFinanciero' );
            vm.totals = $scope.search.info[ total_topic ];
            vm.filters = {
                filter: filter_type,
                totals: total_topic
            };
            vm.filtered_report_empty = ( filtered_info.length === 0 ) ? true : false;
        }

        // Init
        setup();

        // Observable for changes in model
        $scope.$watch( 'search.info', function( newv ){
            if( typeof newv !== 'undefined' ){
                if( $scope.search.info.elements.length > 0 ){
                    filterInfo( $scope.search.info.elements, 'elements', 'total' );
                }
            }
        } );
    }

    angular
        .module( 'actinver.controllers' )
        .controller( 'goalsResumeCtrl', goalsResumeCtrl );

})();
