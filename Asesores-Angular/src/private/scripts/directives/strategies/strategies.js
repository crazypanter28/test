(function(){
    'use strict';

    function strategies( $timeout ){

        function link( scope ){

            // Callback
            scope.onSelect = function() {
                $timeout( function(){
                    scope.show_info = true;
                } );
            };
        }

        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/scripts/directives/strategies/strategies.html',
            scope: {
                index: '=',
                amount: '=',
                model: '=',
                issuers: '='
            },
            link: link
        };
    }

    angular
        .module( 'actinver.directives' )
        .directive( 'strategies', strategies );
} )();