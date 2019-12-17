(function(){
    "use strict";

    function ngBlink( $timeout ){

        return {
            restrict: 'A',
            scope: {
                ngModel : '=',
                currency: '@',
            },
            template: '<div ng-class="{\'blink-me red\': red, \'blink-me green\': green }"> {{ ::currency }} {{ ngModel | currency: "" : 3 }}</div>',
            link: function( $scope ){
                var timer;
                var timer2;
                var inUse = false;

                function cleanModels(){
                    $scope.green = false;
                    $scope.red = false;
                }
                function blink( _new, _old ) {
                    if(!inUse){
                        inUse = true;

                        cleanModels();
                        $timeout.cancel( timer );
                        $timeout.cancel( timer2 );

                        $scope.green = _new > _old;
                        $scope.red = _new < _old;

                        timer = $timeout( function(){
                            cleanModels();
                        }, 1500);
                        timer2 = $timeout( function(){
                            inUse= false;
                        }, 450);
                    }
                }

                $scope.$watch('ngModel', function( _new, _old) {
                    if( _old !== _new ){
                        blink( _new, _old);
                    }
                });
            }
        };

    }

    angular
        .module( 'actinver.directives' )
        .directive( 'ngBlink', ngBlink );
} )();
