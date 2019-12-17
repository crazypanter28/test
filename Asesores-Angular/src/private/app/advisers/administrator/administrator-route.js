( function(){
    "use strict";

    function routerProviderConfig ( $stateProvider ){


        $stateProvider


            .state('administrator', {
                templateUrl: '/app/advisers/administrator/administrator.html',
                url: '/administrator',
                controller: 'administratorCtrl',
                controllerAs: 'ctrl',
                parent: 'app',
                ncyBreadcrumb: {
                    label: 'Administrador',
                    parent: 'app.dashboard'
                },
                redirectTo: 'administrator.factsheets'
            })


            .state('administrator.factsheets', {
                templateUrl: '/app/advisers/administrator/factsheets/factsheets.html',
                url: '/factsheets',
                controller: 'factsheetsCtrl',
                controllerAs: 'fact',
                parent: 'administrator',
                ncyBreadcrumb: {
                    label: 'Factsheets',
                    parent: 'administrator'
                },
            })


            .state('administrator.group', {
                templateUrl: '/app/advisers/administrator/group/group.html',
                url: '/grupos',
                controller: 'groupCtrl',
                controllerAs: 'group',
                parent: 'administrator',
                ncyBreadcrumb: {
                    label: 'Grupos',
                    parent: 'administrator'
                },
            })


            .state('administrator.presentations', {
                templateUrl: '/app/advisers/administrator/presentations/presentations.html',
                url: '/presentations',
                controller: 'presentationsAdminCtrl',
                controllerAs: 'pres',
                parent: 'administrator',
                ncyBreadcrumb: {
                    label: 'Presentaciones',
                    parent: 'administrator'
                },
            })


            .state('administrator.eeuu', {
                templateUrl: '/app/advisers/administrator/eeuu/eeuu.html',
                url: '/EEUU',
                controller: 'eeuuCtrl',
                controllerAs: 'eeuu',
                parent: 'administrator',
                ncyBreadcrumb: {
                    label: 'EEUU',
                    parent: 'administrator'
                },
            })


            .state('administrator.mexico', {
                templateUrl: '/app/advisers/administrator/mexico/mexico.html',
                url: '/mexico',
                controller: 'mexicoCtrl',
                controllerAs: 'mx',
                parent: 'administrator',
                ncyBreadcrumb: {
                    label: 'México',
                    parent: 'administrator'
                },
            })


            .state('administrator.economic', {
                templateUrl: '/app/advisers/administrator/economic/economic.html',
                url: '/entorno-economico',
                controller: 'economicCtrl',
                controllerAs: 'economic',
                parent: 'administrator',
                ncyBreadcrumb: {
                    label: 'Entorno económico',
                    parent: 'administrator'
                },
            })


            .state('administrator.legal', {
                templateUrl: '/app/advisers/administrator/legal/legal.html',
                url: '/aviso-legal',
                controller: 'legalCtrl',
                controllerAs: 'legal',
                parent: 'administrator',
                ncyBreadcrumb: {
                    label: 'Aviso legal',
                    parent: 'administrator'
                },
            })


            .state('administrator.investment', {
                templateUrl: '/app/advisers/administrator/investment/investment.html',
                url: '/fondos-de-inversion',
                controller: 'adminInvestmentCtrl',
                controllerAs: 'invest',
                parent: 'administrator',
                ncyBreadcrumb: {
                    label: 'Fondos de inversión',
                    parent: 'administrator'
                },
            })


            .state('administrator.favorites', {
                templateUrl: '/app/advisers/administrator/favorites/favorites.html',
                url: '/favoritos',
                controller: 'favoritesCtrl',
                controllerAs: 'fav',
                parent: 'administrator',
                ncyBreadcrumb: {
                    label: 'Favoritos',
                    parent: 'administrator'
                },
            })

            /* //se se quiere habilitar se tiene que descomentar aqui y en el archivo administrator.pug
            .state('administrator.employee', {
                templateUrl: '/app/advisers/administrator/employee/employee.html',
                url: '/numero-de-mapeo-de-empleado',
                controller: 'employeeCtrl',
                controllerAs: 'empl',
                parent: 'administrator',
                ncyBreadcrumb: {
                    label: 'Mapeo de números de empleado',
                    parent: 'administrator'
                },
            })
            */


            .state('administrator.profiles', {
                templateUrl: '/app/advisers/administrator/profiles/profiles.html',
                url: '/asignacion-de-perfiles',
                controller: 'profilesCtrl',
                controllerAs: 'profiles',
                parent: 'administrator',
                ncyBreadcrumb: {
                    label: 'Asignación de perfiles',
                    parent: 'administrator'
                },
            })


            .state('administrator.advisers_binnable', {
                templateUrl: '/app/advisers/administrator/advisers-binnacle/advisers-binnacle.html',
                url: '/bitacora-de-asesores',
                controller: 'advisersBinnacleCtrl',
                controllerAs: 'ctrl',
                parent: 'administrator',
                ncyBreadcrumb: {
                    label: 'Bitacora de asesores',
                    parent: 'administrator'
                },
            })


            .state('administrator.messages', {
                templateUrl: '/app/advisers/administrator/messages/messages.html',
                url: '/mensajes',
                controller: 'messagesCtrl',
                controllerAs: 'msgs',
                parent: 'administrator',
                ncyBreadcrumb: {
                    label: 'Mensajes',
                    parent: 'administrator'
                },
            })

            .state('administrator.derivatives', {
                templateUrl: '/app/advisers/administrator/derivatives/derivatives.html',
                url: '/derivatives',
                controller: 'derivativesCtrl',
                controllerAs: 'dvts',
                parent: 'administrator',
                ncyBreadcrumb: {
                    label: 'Derivados',
                    parent: 'administrator'
                },
            });

    }


    angular.module( 'actinver' )
        .config( routerProviderConfig );


})();
