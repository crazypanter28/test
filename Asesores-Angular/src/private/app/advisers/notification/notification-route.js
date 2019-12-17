(function () {

    'use strict';

    function routerProviderConfig ( $stateProvider ) {

        $stateProvider
            .state('notification', {                
                templateUrl: '/app/advisers/notification/notification.html',
                url: '/notification',
                ncyBreadcrumb: {
                    label: 'Notificaciones',
                    parent: 'app.dashboard'
                },
                parent: 'app',
                redirectTo: 'notification.lumina'                
            })
            .state('notification.lumina', {
                templateUrl: '/app/advisers/notification/lumina/lumina-notification.html',
                url: '/Lumina',
                controller: 'luminaNotificationCtrl',
                controllerAs: 'lumina',
                parent: 'notification',
                ncyBreadcrumb: {
                    label: 'Lumina',
                    parent: 'notification'
                }
            })
            ;
    }
    angular.module('actinver')
        .config(routerProviderConfig);

})();