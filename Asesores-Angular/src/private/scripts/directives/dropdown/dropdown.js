(function(){
    "use strict";

    function dropdown( ){

        function link($scope){
            $scope.css = "";

            function init(){
                $scope.typeCss = angular.isDefined($scope.nameCss) && angular.isString($scope.nameCss) && $scope.nameCss !=="" ?  2 : 1;
                $scope.css = angular.isDefined($scope.nameCss) && angular.isString($scope.nameCss) && $scope.nameCss !=="" ?  $scope.nameCss : 'act-dropdown';
                //typeCss = 2 es para los combos de A2k y Fix ; es usar el css que te envian
                //typeCss = 1 es para los combos normales; es usar el css normal

            }
            // angular.element($window).bind('resize', function(){
            //     if( $window.innerWidth < 700 ){
            //         $scope.type = 'mobile';
            //     }
            //     else {
            //         $scope.type = 'default';
            //     }
            //
            //     $scope.$digest();
            // });

            $scope.placeholder = '---';
            $scope.status = {
                isopen: false
            };
            $scope.type = 'default';
            // $scope.type = $window.innerWidth < 700  ? 'mobile' : 'default';

            $scope.select = function( _option, _seleccionado ){
                $scope.selected = _option;            
                if( $scope.onChange && angular.isFunction($scope.onChange) ) {
                    $scope.onChange( _option, $scope.idx );
                }
                if ($scope.change && angular.isFunction($scope.change)) {
                    $scope.change({
                        lastValue: _seleccionado,
                        newValue: _option
                    });
                }
            };

          /*  element.find(".defaultF").on('click',function(){
                var rsssss= $(this);
                setTimeout(function(){
                    rsssss.find(".input-drop").focus();
                },250);
            });*/
            init();
        }


        return {
            restrict: 'A',
            replace: true,
            templateUrl: '/scripts/directives/dropdown/dropdown.html',
            scope:{
                ngModel: '=',
                ngDisabled: '=',
                onChange: '=?',
                selected: '=?',
                name: '@',
                idx: '@?',
                change: '&?',
                nameCss:'@?'
            },
            link:link
        };


    }


    angular.module( 'actinver.directives' )
    .directive( 'actDropdown', dropdown );


} )();