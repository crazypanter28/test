( function(){
    'use strict';

    function routerProviderConfig ( $stateProvider ){

        $stateProvider

            .state('operations', {
                templateUrl: '/app/operations/operation.html',
                parent: 'app',
                controller: 'operationCtrl',
                controllerAs: 'operations',
                redirectTo: 'account',
                url: '/operations',
                ncyBreadcrumb: {
                  label: 'Operaciones',
                  parent: 'app.dashboard'
                },
            });

    }

    angular.module( 'actinver' )
        .config( routerProviderConfig );

})();
