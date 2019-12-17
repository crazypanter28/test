( function(){
    "use strict";

    function routerProviderConfig ( $stateProvider ){


        $stateProvider


            .state('app.generic', {
                controller: 'genericCtrl',
                controllerAs: 'generic',
                templateUrl: '/app/advisers/generic/generic.html',
                url: '/generic',
                requiresAuthentication: true,
                ncyBreadcrumb: {
                    label: ' '
                },
                parent:'app',
            });


    }


    angular.module( 'actinver' )
        .config( routerProviderConfig );


})();
