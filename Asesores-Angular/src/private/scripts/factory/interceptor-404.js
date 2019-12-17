( function() {
    "use strict";

    function interceptor404( $q, $injector, cfpLoadingBar ) {
        var showModal = false;
        var done = function(){
            window.location = "/asesoria/login";
        };
        var flag;
        var interceptor404 ={
            'request': function( config ){
                flag = config.exclude;
                return config;
            },
            'responseError': function( rejection ) {
                if( flag ) return $q.reject(rejection );
                var CommonModalsSrv = $injector.get('CommonModalsSrv');
                //console.log( rejection );
                cfpLoadingBar.complete();
                if(rejection.status === 401){
                    CommonModalsSrv.info("Su sesión ha terminado.").result.then(
                        function(){
                            showModal = false;
                            done();
                        }
                    );
                   
                }else if(rejection.status !== 200 || rejection.status !== 404 || rejection.status !== 401){
                    if( !showModal ){
                        showModal = true;
                        CommonModalsSrv.systemError().result.then(function(){
                            },
                            function() {
                                showModal = false;
                        });

                    }
                }
                return $q.reject(rejection );
            }
        };

        return interceptor404;
    }

    angular
        .module( 'actinver.services' )
        .factory( 'interceptor404', interceptor404 );

})();
