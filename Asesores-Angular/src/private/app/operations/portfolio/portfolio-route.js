( function(){
    'use strict';

    function routerProviderConfig ( $stateProvider ){

        $stateProvider

            .state('portfolio', {
                templateUrl: '/app/operations/portfolio/portfolio.html',
                url: '/portfolio',
                controller: 'portfolioCtrl',
                controllerAs: 'portfolio',
                parent: 'operations',
                data: {
                    needClient: true
                },
                ncyBreadcrumb: {
                  label: 'Portafolio',
                },
                redirectTo: 'portfolio.resume'
            })

            .state('portfolio.resume', {
                templateUrl: '/app/operations/portfolio/presume.html',
                url: '/resume',
                controller: 'pResumeCtrl',
                controllerAs: 'presume',
                data: {
                    needClient: true
                },
                ncyBreadcrumb: {
                  label: 'Resumen',
                }
            })

            .state('portfolio.detail', {
                templateUrl: '/app/operations/portfolio-detail/portfolio-detail.html',
                url: '/detail',
                controller: 'portfoli-detail.controller',
                controllerAs: 'pdetailCtrl',
                data: {
                    needClient: true
                },
                ncyBreadcrumb: {
                  label: 'Detalle',
                }
            });

    }

    angular.module( 'actinver' )
        .config( routerProviderConfig );

})();
