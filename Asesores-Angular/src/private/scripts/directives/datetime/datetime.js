(function(){
    "use strict";

    function actCalendar(){

        var link = function( scope ){
            scope.models = {
                modl1: null,
                modl2: null,
            };

            scope.modelInput ={
                value: scope.ngModel
            };

            var timeForSelect = [];
            scope.timeForSelect2 = [];
            var i,hour;

            if( scope.type === "HH" ){
                loadTime();
                scope.maskInput = '29:69';
            }
            else {
                loadRange();
                scope.maskInput = '29:69 - 29:69';
            }

            function loadTime() {
                for( i = 0; i< 24; i++ ){
                    hour = i < 10 ? ('0'+''+i) : i;
                    timeForSelect.push( { text: (i < 10 ? '0'+i : i) } );
                }

                for( i = 0; i< 60; i++ ){
                    scope.timeForSelect2.push( { text: (i < 10 ? '0'+i : i) } );
                }
            }


            scope.loadEndTime = function (){


                var position = (timeForSelect.indexOf(scope.models.modl1)+1);

                var temporaryArray = [];

                if(position>timeForSelect.length){
                    temporaryArray.push({text: "20:30"});
                }
                else{
                    temporaryArray = timeForSelect.slice(position);
                    temporaryArray.push({text: "20:30"});
                }

                scope.timeForSelect2=temporaryArray.slice();
            };


            function loadRange() {
                for( i = 6; i<= 20; i++ ){
                    hour = i < 10 ? ('0'+''+i) : i;
                    timeForSelect.push( { text: hour +':00' } );
                    if(hour!==20){
                        timeForSelect.push( { text: hour +':30'} );
                    }
                    
                    // timeForSelect2.push( { text: hour +':00' } );
                    // timeForSelect2.push( { text: hour +':30'} );
                }
            }

            scope.timeForSelect = timeForSelect;

            scope.$watchCollection( 'modelInput.value', function() {
                scope.ngModel = scope.modelInput.value;
            });

            scope.$watchCollection( 'models', function( _new, _old) {
                if( !angular.equals(_new,_old) ){
                    if( _new.modl1 && _new.modl2){
                        if(scope.type=== 'HH' ){
                            scope.modelInput.value = _new.modl1.text + ':' + _new.modl2.text;
                        }
                        else{
                            scope.modelInput.value = _new.modl1.text + ' - ' + _new.modl2.text;
                        }
                        scope.ngModel = scope.modelInput.value;
                    }
                }
            });
        };

        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/scripts/directives/datetime/datetime.html',
            link : link,
            scope:{
                ngModel: '=',
                title: '@',
                type: "@",
                required: '@?'
            }
        };


    }


    angular.module( 'actinver.directives' )
    .directive( 'actDatetime', actCalendar );


} )();
