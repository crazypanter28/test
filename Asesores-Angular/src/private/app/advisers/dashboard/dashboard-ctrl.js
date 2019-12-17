( function(){
    "use strict";

    function dashboardCtrl( URLS, userConfig, tableList ){
        var vm = this, sadviser = userConfig.user.employeeID;
        vm.fdc = /access/i.test(navigator.userAgent);

        // Schedule info list
        vm.scheduleInfo = tableList.tableSet({
            url: URLS.dashboardSchedule + sadviser
        });

        // Outline soon expired info list
        vm.outlineSoonInfo = tableList.tableSet({
            url: URLS.getOutlineInfo + 'consultarContratosPerfilVencer' + '/' + sadviser
        }, {
            count: 2
        });

        // Outline expired info list
        vm.outlineExpiredInfo = tableList.tableSet({
            url: URLS.getOutlineInfo + 'consultarContratosPerfilVencido' + '/' + sadviser
        }, {
            count: 2
        });

    }

    angular
    	.module( 'actinver.controllers' )
        .controller( 'dashboardCtrl', dashboardCtrl );

})();
