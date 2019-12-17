( function(){
    'use strict';

    function routerProviderConfig ( $stateProvider ){

        $stateProvider

            .state('account', {
                templateUrl: '/app/operations/account/account.html',
                url: '/account',
                controller: 'accountCtrl',
                controllerAs: 'account',
                parent: 'operations',
                ncyBreadcrumb: {
                  label: 'Cuenta',
                }
            });

    }

    angular.module( 'actinver' )
        .config( routerProviderConfig );

})();
