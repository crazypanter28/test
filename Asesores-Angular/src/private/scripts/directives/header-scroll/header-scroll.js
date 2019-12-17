(function(){
    'use strict';

    function headerScroll(){

        function link( scope, elem ){
            var lastScrollLeft = 0;

            $( window ).scroll( function(){

                if( $(window).width() < 1055 ){
                    var documentScrollLeft = $( document ).scrollLeft();

                    if ( lastScrollLeft !== documentScrollLeft ){
                        lastScrollLeft = documentScrollLeft;
                        elem.css( 'left', -documentScrollLeft );
                    }
                }
            } );

            $( window ).resize( function(){
                if( $(window).width() > 1054 ){
                    elem.css( 'left', 0 );
                }
            } );
        }

        return {
            restrict: 'A',
            link: link
        };

    }

    angular
        .module( 'actinver.directives' )
        .directive( 'headerScroll', headerScroll );

} )();
