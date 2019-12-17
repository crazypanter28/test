(function () {
    'use strict';

    function routerProviderConfig($stateProvider) {

        $stateProvider

            .state('dinn', {
                templateUrl: '/app/dinn/adviser/dinn.html',
                url: '/dinn',
                parent: 'app',
                ncyBreadcrumb: {
                    label: 'Dinn',
                    parent: 'app.dashboard'
                },
                redirectTo: 'dinn.show',
            })
            .state('dinn.show', {
                templateUrl: '/app/dinn/adviser/dinnShow.html',
                url: '/dinnShow',
                controller: 'dinnCtrl',
                controllerAs: 'show',
                parent: 'dinn',
                ncyBreadcrumb: {
                    label: 'Citas Dinn',
                    parent: 'dinn'
                }
            })
            .state('dinn.book', {
                templateUrl: '/app/dinn/adviser/dinnBook.html',
                url: '/dinnBook',
                controller: 'dinnBookCtrl',
                controllerAs: 'book',
                parent: 'dinn',
                ncyBreadcrumb: {
                    label: 'Información citas',
                    parent: 'dinn.show'
                },
                params: {
                    informationDate: null
                }
            });
    }

    angular.module('actinver')
        .config(routerProviderConfig);

})();
