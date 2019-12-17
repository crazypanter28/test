( function(){
    "use strict";

    function routerProviderConfig ( $stateProvider ){


        $stateProvider


            .state('prospects', {
                templateUrl: '/app/advisers/prospects/prospects.html',
                url: '/prospects',
                controller: 'prospectsCtrl',
                controllerAs: 'prospect',
                redirectTo: 'prospects.myProfile',
                ncyBreadcrumb: {
                  label: 'Prospectos',
                  parent: 'app.dashboard'
                },
                parent: 'app',
            })


            .state('prospects.myProfile', {
                templateUrl: '/app/advisers/prospects/my-profile/my-profile.html',
                url: '/myProfile',
                controller: 'prospectsProfileCtrl',
                controllerAs: 'myProfile',
                ncyBreadcrumb: {
                    label: 'Mi perfil',
                },
            })

            .state('prospects.id', {
                templateUrl: '/app/advisers/prospects/detail/detail-prospect.html',
                url: '/myProfile/{id:int}',
                controller: 'prospectsDetailCtrl',
                controllerAs: 'detail',
                ncyBreadcrumb: {
                    label: 'Datos del prospecto',
                },
            })

            .state('prospects.reactivate', {
                templateUrl: '/app/advisers/prospects/reactivate/reactivate.html',
                url: '/myProfile/reactivate',
                controller:'prospectsReactivateCtrl',
                controllerAs:'reactivate',
                ncyBreadcrumb: {
                    label: 'Reactivar',
                },
                params:{
                    model:null
                },
            })


            .state('prospects.team', {
                templateUrl: '/app/advisers/prospects/team/team.html',
                url: '/team',
                controller: 'prospectsTeamCtrl',
                controllerAs: 'admin',
                ncyBreadcrumb: {
                    label: 'Mi equipo',
                },
            })

            .state('prospects.report', {
                templateUrl: '/app/advisers/prospects/report/report.html',
                url: '/report',
                controller: 'reportOppCtrl',
                controllerAs: 'rep',
                ncyBreadcrumb: {
                    label: 'Reportes',
                },
            })

            .state('prospects.team.idTeam', {
                templateUrl: '/app/advisers/prospects/my-profile/my-profile.html',
                url: '/adviser/:id',
                controller: 'prospectsProfileCtrl',
                controllerAs: 'myProfile',
                ncyBreadcrumb: {
                    label: 'Perfil',
                },
            });


    }


    angular.module( 'actinver' )
        .config( routerProviderConfig );


})();
