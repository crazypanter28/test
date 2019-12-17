(function(){

    "use strict";

    function datesRangePiker( ){

        function link($scope){

            //Para actualizar la fecha Max que puede utilizar el calendario
            $scope.$watch('options.maxDate', function () {
                if ($scope.options && $scope.options.maxDate) {
                    $scope.options2.maxDate = $scope.options.maxDate;
                }
            });

            //Actualizamos la fecha Minina en el Calendario
            $scope.$watch('options.minDate', function () {
                if ($scope.options && $scope.options.minDate) {
                    $scope.options2.minDate = $scope.options.minDate;
                }
            });

            //Actualizamos El cambio de l fecha
            $scope.$watch('date', function (_oldValue, _newValue) {
                if ( _oldValue === _newValue) {
                    return;
                }
                if ($scope.auxDate) {
                    $scope.auxDate.newDate = $scope.date;
                }
            });  
                                


            function setup () {
                setupVars();
                setupOptions();
                setListenChangeDate();
            }

            function setupOptions(){
                var options = {
                    autoApply: true,
                    showDropdowns: true,
                    locale: {
                        format: "DD/MM/YYYY",
                        daysOfWeek: [
                            "DO",
                            "LU",
                            "MA",
                            "MI",
                            "JU",
                            "VI",
                            "SA"
                        ],
                        monthNames: [
                            "Enero",
                            "Febrero",
                            "Marzo",
                            "Abril",
                            "Mayo",
                            "Junio",
                            "Julio",
                            "Agosto",
                            "Septiembre",
                            "Octubre",
                            "Noviembre",
                            "Diciembre"
                        ],
                        firstDay: 0
                    },
                };
                if( $scope.isSingle ){
                    options.singleDatePicker= true;
                }

                $scope.options2 =  $scope.options ? angular.merge( {}, options, $scope.options): options;         
            }


            function setupVars () {
                if( $scope.date ){
                    $scope.auxDate = {
                        newDate : $scope.date
                    };
                }

                else{

                    $scope.auxDate ={
                        newDate:{
                            startDate: null,
                            endDate: null
                        }
                    };
                }
            }


            function setListenChangeDate () {
                $scope.$watch('auxDate.newDate', function ( _old, _new ) {                    
                    if ( _new === _old) {
                        return;
                    }
                    if( angular.isFunction( $scope.onChange ) ) {
                        $scope.onChange( $scope.auxDate.newDate );
                    }
                    $scope.date = $scope.auxDate.newDate;
                });
            }


            setup();
        }


        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/scripts/directives/dates-range-picker/dates-range-picker.html',
            scope:{
                label: '@',
                placeholder: '@',
                date: '=?',
                options: '=?',
                onChange: '=?',
                ngRequired: '=?',
                isSingle: '=?',
            },
            link:link
        };


    }


    angular.module( 'actinver.directives' )
    .directive( 'datesRangePicker', datesRangePiker );


} )();
