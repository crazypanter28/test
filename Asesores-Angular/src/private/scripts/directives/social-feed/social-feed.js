(function(){
    "use strict";

    function socialFeed(){

        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/scripts/directives/social-feed/social-feed.html',
            controller: 'socialFeedCtrl',
            controllerAs: 'socialFeedWidget'
        };

    }

    angular
        .module( 'actinver.directives' )
        .directive( 'socialFeed', socialFeed );
} )();