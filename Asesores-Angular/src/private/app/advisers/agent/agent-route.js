(function () {
    'use strict';

    function routerProviderConfig($stateProvider) {

        $stateProvider
            .state('agent', {
                url: '/agent',
                parent: 'app',
                templateUrl: '/app/advisers/agent/agent.html',
                controller: 'agentCtrl',
                controllerAs: 'agent',
                ncyBreadcrumb: {
                  label: 'Agentes',
                  parent: 'app.dashboard'
                }
            });

    }

    angular.module('actinver')
           .config(routerProviderConfig);

})();
