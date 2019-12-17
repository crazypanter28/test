(function(){
    "use strict";

    function formatCurrency( $filter ){


        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, elem, attrs, ctrl) {
                if (!ctrl) return;

                ctrl.$formatters.unshift(function () {
                    return $filter(attrs.format)(ctrl.$modelValue);
                });

                elem.bind('blur', function() {
                    var plainNumber = elem.val().replace(/[^\d|\-+|\.+]/g, '');
                    elem.val($filter(attrs.format)(plainNumber));
                });

                elem.bind( 'focus', function(){
                    elem.val( '' );
                });
            }
        };


    }


    angular.module( 'actinver.directives' )
    .directive( 'format', formatCurrency );


} )();
