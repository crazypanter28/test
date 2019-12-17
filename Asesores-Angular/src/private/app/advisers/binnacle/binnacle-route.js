( function(){
    'use strict';

    function routerProviderConfig ( $stateProvider ){
        var tpl = '/app/advisers/binnacle';

        $stateProvider

            .state('binnacle', {
                templateUrl: tpl + '/binnacle.html',
                url: '/bitacora',
                parent: 'app',
                ncyBreadcrumb: {
                  label: 'Bitácora',
                  parent: 'app.dashboard'
                },
                controller: 'binnacleCtrl',
                controllerAs: 'binnacle'
            })

            .state('binnacle.commercial', {
                templateUrl: tpl + '/views/commercial/commercial.html',
                url: '/comercial',
                ncyBreadcrumb: {
                    label: 'Comercial',
                }
            })

            .state('binnacle.commercial.strategy', {
                templateUrl: tpl + '/views/commercial/strategy/strategy.html',
                url: '/estrategia',
                controller: 'binnacleStrategyCtrl',
                controllerAs: 'strategy',
                ncyBreadcrumb: {
                    label: 'Estrategia',
                }
            })

            .state('binnacle.commercial.strategy.id', {
                templateUrl: tpl + '/views/commercial/strategy/id.html',
                url: '/{sponsor}/{id:[0-9]+}/{clasificacion}',
                controller: function($scope, $stateParams){
                    $scope.client_id = $stateParams.id;
                },
                ncyBreadcrumb: {
                    label: 'Cliente: {{client_id}}'
                }
            })

            .state('binnacle.commercial.reports', {
                templateUrl: tpl + '/views/commercial/reports/reports.html',
                controller: 'binnacleReportsCtrl',
                controllerAs: 'reports',
                url: '/reportes',
                ncyBreadcrumb: {
                    label: 'Reporte de Metas',
                }
            })

            .state('binnacle.commercial.reports.id', {
                templateUrl: tpl + '/views/commercial/reports/id.html',
                url: '/{id:[0-9]+}/{estado:[0-9]+}/{action:[0-9]+}/{employee}',
                controller: 'binnacleReportsCtrl',
                controllerAs: 'reports',
                requiresAuthentication: true,
                permissions: ['asesores.AdministradorMenu.'],
                ncyBreadcrumb: {
                    label: 'Asesor: {{adviser.id}}'
                }
            })

            .state('binnacle.commercial.outline', {
                templateUrl: tpl + '/views/commercial/outline/outline.html',
                controller: 'binnacleOutlineCtrl',
                controllerAs: 'outline',
                url: '/reperfilamiento',
                ncyBreadcrumb: {
                    label: 'Reperfilamiento',
                }
            })

            .state('binnacle.operative', {
                templateUrl   : tpl + '/views/operative/main.html',
                url           : '/operativa',
                ncyBreadcrumb : {
                    label : 'Operativa'
                }
            })

            .state('binnacle.operative.bank', {
                templateUrl   : tpl + '/views/operative/bank.html',
                url           : '/banco',
                ncyBreadcrumb : {
                    label : 'Banco'
                },
                controller: 'binnacleBankCtrl',
                controllerAs: 'ctrl'
            })

            .state('binnacle.operative.stock_exchange', {
                templateUrl   : tpl + '/views/operative/stock-exchange.html',
                url           : '/casa-de-bolsa',
                ncyBreadcrumb : {
                    label: 'Casa de Bolsa'
                },
                controller: 'binnacleStockExchangeCtrl',
                controllerAs: 'ctrl'
            });


    }

    angular
        .module( 'actinver' )
        .config( routerProviderConfig );

})();