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
            templateUrl: '/scripts/directives/capitals-lumina-doll/capitals-lumina-doll.html',
            scope: {
                contract: '@',
                station: '=',
                ids: '=',
                iscuentapropia: '='
            },
            controller: 'capitalsLuminaDollCtrl',
            controllerAs: 'doll',
            link: link
        };

    }


    angular.module( 'actinver.directives' )
    .directive( 'actCapitalsLuminaDoll', station );


} )();
