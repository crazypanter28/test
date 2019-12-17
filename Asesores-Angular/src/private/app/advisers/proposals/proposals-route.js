( function(){
    'use strict';

    function routerProviderConfig ( $stateProvider ){
        var tpl = '/app/advisers/proposals';

        $stateProvider
            .state('proposals', {
                templateUrl: tpl + '/proposals.html',
                url: '/propuestas',
                parent: 'app',
                ncyBreadcrumb: {
                    label: 'Propuestas',
                    parent: 'app.dashboard'
                }//,redirectTo: 'proposals.proposal'
            })

            .state('proposals.proposal', {
                templateUrl: tpl + '/views/proposal/proposal.html',
                url: '/propuesta',
                ncyBreadcrumb: {
                    label: 'Propuesta'
            },
            controller: 'proposalCtrl',
            controllerAs: 'proposal'
            })

            .state('proposals.tracing', {
                templateUrl: tpl + '/views/tracing/tracing.html',
                url: '/seguimiento',
                ncyBreadcrumb: {
                    label: 'Seguimiento'
                },
                controller: 'tracingCtrl',
                controllerAs: 'tracing'
            })

            .state('proposals.proposal-tracing', {
                templateUrl: tpl + '/views/proposal-tracing/proposal-tracing.html',
                url: '/propuesta-seguimiento',
                ncyBreadcrumb: {
                    label: 'Propuesta Seguimiento'
                },
                controller: 'propTracingCtrl',
                controllerAs: 'propTracing'
            })

            .state('proposals.tracing-client', {
                templateUrl: tpl + '/views/tracing-client.html',
                url: '/seguimiento-cliente-unico',
                ncyBreadcrumb: {
                    label: 'Seguimiento por cliente único'
                },
                controller: 'tracingClientCtrl',
                controllerAs: 'ctrl'
            })

            .state('proposals.activity', {
                templateUrl: tpl + '/views/activity.html',
                url: '/registro-actividades',
                ncyBreadcrumb: {
                    label: 'Registro de actividades'
                },
                controller: 'activityCtrl',
                controllerAs: 'ctrl'
            });

    }

    angular
        .module( 'actinver' )
        .config( routerProviderConfig );

})();
