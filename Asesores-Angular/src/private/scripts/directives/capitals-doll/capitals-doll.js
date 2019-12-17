(function(){
    "use strict";

    function station( $timeout ){

        function link( scope, $element ){
            scope.focusElement = function(){
                $timeout(function(){
                    $element.find('#station').focus();
                }, 200);
            };
        }


        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/scripts/directives/capitals-doll/capitals-doll.html',
            scope: {
                contract: '@',
                station: '=',
                ids: '=',
            },
            controller: 'capitalsDollCtrl',
            controllerAs: 'doll',
            link: link
        };

    }


    angular.module( 'actinver.directives' )
    .directive( 'actCapitalsDoll', station );


} )();
