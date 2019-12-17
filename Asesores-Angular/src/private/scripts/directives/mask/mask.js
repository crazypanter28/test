(function(){
    "use strict";

    function actCalendar(){

        function link(scope, $el ){
            var newModel;
            scope.$watch('ngModel', function (newValue) {
                if (!(newValue !== null && newValue !== undefined && newValue.toString().trim() !== "")) {
                    $el.find('~ .mask-directive').css('display', 'none');
                }
            });

            function setup(){
                if( scope.ngModel ){
                    replaceString();
                }
                setMask();
                setEvents();
            }

            function replaceString() {
                if (scope.ngModel) {
                    scope.ngModel = scope.ngModel.toString();
                    var newString = scope.ngModel.substr(2).replace(/./g, '*');

                    newModel = scope.ngModel.substr(0, 2) + newString;
                    replaceMask();
                }
            }

            function replaceMask(){
                $el.find( '~ .mask-directive' ).html( newModel ).css('display','block');
            }

            function setMask(){
                $el.after( '<div class="mask-directive" >' + (newModel || scope.placeholder || '')  + '</div>' );
            }

            function setEvents(){

                $el.bind( 'focusout', function(){
                    replaceString();
                } );

                $el.bind( 'focus', function(){
                    $el.find( '~ .mask-directive' ).css('display', 'none' );
                } );

                $el.find('~ .mask-directive').bind( 'click', function(){
                    $el.focus();
                } );
            }


            setup();
        }

        return {
            restrict: 'EA',
            templateUrl: '/scripts/directives/datetime/datetime.html',
            link : link,
            scope:{
                ngModel: '=',
                placeholder: '@',
            }
        };


    }


    angular.module( 'actinver.directives' )
    .directive( 'masks', actCalendar );


} )();
