(function() {
    "use strict";

    function routerProviderConfig($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
                abstract: true,
                templateUrl: '/app/app.html',
                controller: 'mainCtrl',
                resolve: {
                    'autenticacion': ['Auth', function(Auth) {
                        var data = Auth.currentUser(),
                            employeeId = data.user.employeeID;
                        return Auth.permission(employeeId).then(function successCallback() {
                            Auth.init();
                        });
                    }]
                },
            });


        $urlRouterProvider
            .otherwise('/dashboard');

    }


    angular.module('actinver')
        .config(routerProviderConfig);


})();
