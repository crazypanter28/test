( function(){
    'use strict';

    function routerProviderConfig ( $stateProvider ){
        var tpl = '/app/advisers/goals';

        $stateProvider

            .state('goals', {
                templateUrl: tpl + '/goals.html',
                url: '/reporte-metas',
                parent: 'app',
                ncyBreadcrumb: {
                  label: 'Reporte de metas',
                  parent: 'app.dashboard'
                },
                controller: 'goalsCtrl',
                controllerAs: 'goals'
            })

            .state('goals.report', {
                templateUrl: tpl + '/views/report/report.html',
                url: '/reporte',
                ncyBreadcrumb: {
                    label: 'Reporte',

                },
                controller: 'reportCtrl',
                controllerAs: 'report'
            })

            .state('goals.supervisor', {
                templateUrl: tpl + '/views/supervisor/supervisor.html',
                url: '/reporte-supervisor',
                ncyBreadcrumb: {
                    label: 'Reporte de Supervisor',

                },
                controller: 'supervisorCtrl',
                controllerAs: 'supervisor'
            })

            .state('goals.custom', {
                templateUrl: tpl + '/views/custom/custom.html',
                url: '/reporte-personalizado',
                ncyBreadcrumb: {
                    label: 'Reporte Personalizado',

                },
                controller: 'customCtrl',
                controllerAs: 'custom'
            })

            .state('goals.manager', {
                templateUrl: tpl + '/views/report/manager.html',
                url: '/reporte-manager',
                ncyBreadcrumb: {
                    label: 'Reporte de Gestión',

                },
                controller: 'managerCtrl',
                controllerAs: 'manager'
            })

            .state('goals.reportLargeAndShort', {
                templateUrl: tpl + '/views/report/reportLargeAndShort.html',
                url: '/reporte-reportLargeAndShort',
                ncyBreadcrumb: {
                    label: 'Reporte de largos y cortos',

                },
                controller: 'reportLargeAndShortCtrl',
                controllerAs: 'reportLargeAndShort'
            })

            .state('goals.accountStatus', {
                templateUrl: tpl + '/views/accountState/accountState.html',
                url: '/account-state',
                ncyBreadcrumb: {
                    label: 'Estados de cuenta',

                },
                controller: 'accountStateCtrl',
                controllerAs: 'accountState'
            });

    }

    angular
        .module( 'actinver' )
        .config( routerProviderConfig );

})();
