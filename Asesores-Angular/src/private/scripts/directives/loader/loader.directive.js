(function(){
    'use strict';

    angular 
        .module( 'actinver.directives' )
        .directive( 'loading', loader );

    function loader($http){
        return {
            restrict: 'A',
            link: function (scope, elm)
            {
                scope.isLoading = function () {
                    return $http.pendingRequests.length > 0;
                };

                scope.$watch(scope.isLoading, function (v)
                {
                    if(v){
                        elm.show();
                    }else{
                        elm.hide();
                    }
                });
            }
        };
    }

})();
