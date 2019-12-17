( function(){
    "use strict";

    function binnacleWidgetCtrl( userConfig, binnacleInfo, binnacleReportsSrv ){
        var vm = this;

        // Binnacle
        vm.details = {
            finish: false
        }; 

        var adviser = {
            type        : 'profile',
            show_info   : '',
            filter      : ''
        };

        binnacleReportsSrv.getInfo( adviser )
        .then( function successCallback( response ){ 
            vm.details = binnacleInfo.showInfo( response, 1 );
        }, function errorCallback( error ){
            vm.details = error;
        } );

    }

    angular
    	.module( 'actinver.controllers' )
        .controller( 'binnacleWidgetCtrl', binnacleWidgetCtrl );

})();
