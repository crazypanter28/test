

(function(){
    'use strict';

    function tableColumnPosition( $timeout ){

        function link(scope, $element){
            $element.bind('scroll', function(){
            	$element.find( 'table' ).find( 'tr th:first-child' ).css('left', this.scrollLeft +"px" );
                $element.find( 'table' ).find( 'tr td:first-child' ).css('left', this.scrollLeft +"px" );
            });

            // Update labels positions
            scope.$watch( function () {
                return $element.find( 'table' ).height();
            }, function ( newv, oldv) {
                if ( newv !== oldv ) {
                    $timeout( function(){
                        $element.find( 'table tr td:first-child' ).css('left', $element.scrollLeft() +"px" );
                    }, 0 );
                }
            });
        }

        return {
            restrict: 'EA',
            link: link,
        };

    }

    angular
        .module( 'actinver.directives' )
        .directive( 'tableColumnPosition', tableColumnPosition );

} )();
