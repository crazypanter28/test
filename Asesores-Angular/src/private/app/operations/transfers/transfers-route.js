( function(){
    "use strict";

    function routerProviderConfig ( $stateProvider ){


        $stateProvider

            .state('transfers', {
                // abstract: true,
                templateUrl: '/app/operations/transfers/transfers.html',
                url: '/transfers',
                controller: 'transfersCtrl',
                controllerAs: '$ctrl',
                parent: 'operations',
                redirectTo: 'transfers.myAccounts',
                data: {
                    needClient: true
                },
                ncyBreadcrumb: {
                  label: 'Transferencias',
                },
            })

            .state('transfers.myAccounts', {
                controller: 'myAccountsCtrl',
                controllerAs: 'accounts',
                templateUrl: '/app/operations/transfers/accounts.html',
                url: '/myAccounts',
                data: {
                    needClient: true
                },
                ncyBreadcrumb: {
                  label: 'A cuentas actinver',
                },
            })

            .state('transfers.otherAccounts', {
                controller: 'otherAccountsCtrl',
                controllerAs: 'accounts',
                templateUrl: '/app/operations/transfers/accounts.html',
                url: '/otherAccounts',
                data: {
                    needClient: true
                },
                ncyBreadcrumb: {
                  label: 'A otras cuentas',
                },
            })


            .state('transfers.reports', {
                template: '<h2>h2</h2>',
                url: '/reports',
                data: {
                    needClient: true
                }
            });


    }


    angular.module( 'actinver' )
        .config( routerProviderConfig );


})();
