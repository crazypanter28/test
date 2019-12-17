(function(){
    "use strict";

    function lastNews(){

        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/scripts/directives/last-news/last-news.html',
            controller: 'lastNewsCtrl',
            controllerAs: 'lastNewsWidget'
        };

    }

    angular
        .module( 'actinver.directives' )
        .directive( 'lastNews', lastNews );
} )();