( function(){
    "use strict";

    function modals( $uibModal ) {
        var api  = {};

        api.show = function( _video ){
            var modal = $uibModal.open({
                controller: function( $scope, $uibModalInstance, $sce ){
                    $scope.url = _video.url;

                    $scope.trustSrc = function(src) {
                        return $sce.trustAsResourceUrl(src);
                    };

                    $scope.close = function(){
                        $uibModalInstance.dismiss();
                    };

                },
                templateUrl: '/app/advisers/help/modals/video.html',
                windowClass : 'help',
            });

            return modal;
        };

        return api;
    }


    angular.module( 'actinver.services' )
        .service( 'HelpModals', modals );


})();
