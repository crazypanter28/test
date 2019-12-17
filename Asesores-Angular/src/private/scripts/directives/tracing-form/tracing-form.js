(function(){
    'use strict';

    function tracingForm(){

        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/scripts/directives/tracing-form/tracing-form.html',
            scope: {
                model: '=',
                formType: '=?'
            },
            controller: 'tracingFormCtrl',
            controllerAs: 'tracingForm'
        };
    }

    angular
        .module( 'actinver.directives' )
        .directive( 'tracingForm', tracingForm );

} )();