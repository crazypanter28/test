( function(){
    "use strict";

    function routerProviderConfig ( $stateProvider ){


        $stateProvider


            .state('simulators', {
                templateUrl: '/app/advisers/simulators/simulators.html',
                url: '/simulators',
                parent: 'app',
                ncyBreadcrumb: {
                  label: 'Simuladores',
                  parent: 'app.dashboard'
                },
                redirectTo: 'simulators.performance',
            })

            .state('simulators.performance', {
                templateUrl: '/app/advisers/simulators/performance/performance.html',
                url: '/performance',
                controller: 'performanceCtrl',
                controllerAs: 'per',
                ncyBreadcrumb: {
                  label: 'Rendimiento histórico',
                },
            })

            .state('simulators.details', {
                templateUrl: '/app/advisers/simulators/performance/details.html',
                url: '/details',
                params:{
                    model:null
                },
                controller: 'detailPerformCtrl',
                controllerAs: 'detail',
                ncyBreadcrumb: {
                  label: 'Rendimiento',
                },
            })


            .state('simulators.credit', {
                templateUrl: '/app/advisers/simulators/credit/credit.html',
                controller: 'creditCtrl',
                controllerAs: 'credit',
                url: '/credit',
                ncyBreadcrumb: {
                  label: 'Crédito',
                },
            });



    }


    angular.module( 'actinver' )
        .config( routerProviderConfig );


})();
