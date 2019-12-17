( function(){
    "use strict";

    function prospectsCtrl( /*prospectSrv*/ ){
        //var vm = this;

        function setup(){
            getCatalogSearch();
        }

        function getCatalogSearch(){
            /*prospectSrv.getCatalogSearch().then(function( _res ){
                vm.options = _res;
            });*/
        }

        setup();
    }

    angular
        .module( 'actinver.controllers' )
        .controller( 'prospectsCtrl', prospectsCtrl );

})();
