(function(){
    "use strict";

    function actCalendar( $timeout ){

        function link( scope, $element) {

            scope.focusElement = function(){
                $timeout(function(){
                    $element.find('#station').focus();
                }, 250);
            };
        }

        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/scripts/directives/doll/doll.html',
            scope: {
                station: '=',
                id: '=',
                contract: '@',
                columnsExpand : '=?',
            },
            controller: 'dollCtrl',
            controllerAs: 'doll',
            link: link
        };


    }


    angular.module( 'actinver.directives' )
    .directive( 'actDoll', actCalendar );


} )();
