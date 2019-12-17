(function(){
    "use strict";

    function socialFeedCtrl(socialFeedInfo){
        var vm = this;

        // Get information
        vm.posts = {success: false};
        socialFeedInfo.getInfo()
            .then(function successCallback(response){
                vm.posts = response;
            }, function errorCallback(error){
                vm.posts = error;
            });


    }

    angular
        .module( 'actinver.controllers' )
        .controller( 'socialFeedCtrl', socialFeedCtrl );
} )();
