( function(){
    "use strict";

    function routerProviderConfig ( $stateProvider ){


        $stateProvider


            .state('help', {
                templateUrl: '/app/advisers/help/help.html',
                parent: 'app',
                controller: 'helpCtrl',
                controllerAs: 'help',
                url: '/help',
                ncyBreadcrumb: {
                  label: 'Ayuda',
                  parent: 'app.dashboard'
                },
            });

    }


    angular.module( 'actinver' )
        .config( routerProviderConfig );


})();
