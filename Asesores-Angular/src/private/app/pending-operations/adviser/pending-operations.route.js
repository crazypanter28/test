( function(){
    'use strict';

    function routerProviderConfig ( $stateProvider ){

        $stateProvider

            .state('pending-operations', {
                templateUrl: '/app/pending-operations/adviser/pending-operation.html',
                parent: 'app',
                url: '/pending-operations',
                ncyBreadcrumb: {
                    label: 'Operaciones Pendientes',
                    parent: 'app.dashboard'
                },
                redirectTo: 'received',
            })

            .state('received', {
                templateUrl: '/app/pending-operations/adviser/pending-operations-received.html',
                parent: 'pending-operations',
                url: '/received',
                ncyBreadcrumb: {
                    label: 'Recibidas',
                    parent: 'pending-operations'
                },
                redirectTo: 'pending-operations-adviser',
            })

            .state('sent', {
                templateUrl: '/app/pending-operations/adviser/pending-operations-sent.html',
                parent: 'pending-operations',
                url: '/sent',
                controller: 'pending-operations-sent-ctrl',
                controllerAs: 'poCtrl',
                ncyBreadcrumb: {
                    label: 'Enviadas',
                    parent: 'pending-operations'
                }
            })

            .state('pending-operations-adviser', {
                templateUrl: '/app/pending-operations/adviser/pending-operations.html',
                parent: 'received',
                controller: 'pending-operations-adviser.controller',
                controllerAs: 'poCtrl',
                url: '/pending-operations-adviser',
                ncyBreadcrumb: {
                    label: 'Operaciones Pendientes',
                    parent: 'received'
                }
            })
            .state('pending-operations-historic', {
                templateUrl: '/app/pending-operations/adviser/historic.html',
                parent: 'received',
                controller: 'pending-operations-historic',
                controllerAs: 'poCtrl',
                url: '/historic',
                ncyBreadcrumb: {
                    label: 'Historico',
                    parent: 'received'
                }
            })
            .state('pending-operations-adviser-result', {
                templateUrl: '/app/pending-operations/adviser/pending-operations-result.html',
                parent: 'app',
                controller: 'pending-operations-adviser-result.controller',
                controllerAs: 'porCtrl',
                url: '/pending-operations-adviser-result',
                ncyBreadcrumb: {
                    label: 'Resultado',
                    parent: 'pending-operations-adviser'
                },
                params : {
                    poResult : null,
                    typeOperation : null,
                    operations : null,
                    views : null
                }
            });

    }

    angular.module( 'actinver' )
        .config( routerProviderConfig );

})();
