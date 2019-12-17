( function(){
    "use strict";

    function helpCtrl( PresentationSrv, $state, HelpModals, CommonModalsSrv, HelpSrv ){
        var vm = this;

        function setup(){
            getVideos();
            getQuestions();
        }

        vm.showVideo = function( _id){
            HelpModals.show( _id );
        };

        vm.sendComment = function(){
            var message = "Tu pregunta se ha enviado de manera correcta. Agradecemos tu participación en esta sección.";

            HelpSrv.sendComment().then(function(){
                CommonModalsSrv.done( message ).result.then(function(){
                    vm.comments = '';
                });
            });
        };


        function getVideos(){
            HelpSrv.getVideos().then(function( _res ){
                vm.videos = _res;
            });
        }

        function getQuestions(){
            vm.loadingQuestions = true;
            HelpSrv.getQuestions().then(function( _res ){
                vm.questions = _res;
                vm.loadingQuestions = false;
            })
            .finally(function(){
                vm.loadingQuestions = false;
            });


        }

        setup();

    }


    angular.module('actinver.controllers')
    .controller('helpCtrl', helpCtrl );

})();
