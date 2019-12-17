(function(){
    "use strict";

    function onFinishRender($timeout){

        return {
            restrict: 'A',
            link: function () {
                if($("#ipc-ticker ul li").length === 8 && !$('#ipc-ticker').hasClass('initialized')){
                    $timeout(function(){
                        $('#ipc-ticker').addClass('initialized').liMarquee({
                            drag: false,
                            hoverstop: true,
                            scrollamount: 50,
                            runshort: false,
                        });
                    }, 50);
                }
            }
        };

    }

    angular
        .module( 'actinver.directives' )
        .directive( 'onFinishRender', onFinishRender );
} )();