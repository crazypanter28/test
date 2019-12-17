( function(){
    "use strict";

function routerProviderConfig ( $stateProvider ){


        $stateProvider


            .state('app.dashboard', {
                controller: 'dashboardCtrl',
                controllerAs: 'dashboard',
                templateUrl: '/app/advisers/dashboard/dashboard.html',
                url: '/dashboard',
                requiresAuthentication: true,
                ncyBreadcrumb: {
                    label: 'Módulo de Asesoría'
                },
                parent:'app',
            });


    }


    angular.module( 'actinver' )
        .config( routerProviderConfig );


})();
