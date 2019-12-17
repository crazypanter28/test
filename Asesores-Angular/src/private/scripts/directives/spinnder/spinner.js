(function(){
    "use strict";

    function loading(){


        return {
            restrict: 'A',
            replace: true,
            template: '<div class="spinner" ng-show="show">'+
                    '<i class="fa fa-refresh fa-spin fa-3x fa-fw"></i>'+
                    '<span class="sr-only">Loading...</span>'+
                '</div>',
            scope:{
                show : "="
            },
        };


    }


    angular.module( 'actinver.directives' )
    .directive( 'spinner', loading );


} )();
