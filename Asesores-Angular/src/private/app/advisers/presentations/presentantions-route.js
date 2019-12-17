( function(){
    "use strict";

    function routerProviderConfig ( $stateProvider ){


        $stateProvider

            .state('presentations', {
                templateUrl: '/app/advisers/presentations/presentations.html',
                url: '/presentations',
                parent: 'app',
                //redirectTo: 'presentations.id',
                controller: 'presentationsCtrl',
                controllerAs: 'presentations',
                ncyBreadcrumb: {
                label: 'Presentaciones',
                parent: 'app.dashboard'
                },
            })

            .state('presentations.id', {
                templateUrl: '/app/advisers/presentations/list.html',
                url: '/{id:int}',
                //redirectTo: 'presentations.institute',
                controller: 'presentationsCtrl',
                controllerAs: 'presentations',
                ncyBreadcrumb: {
                  label: ' ',
                },
            });

    }


    angular.module( 'actinver' )
        .config( routerProviderConfig );


})();
