(function(){
    "use strict";
    function refreshSession( $timeout, $filter, RemainingModal, RefreshSrv, $interval ){

        return{
            restrict: 'EA',
            replace: false,
            templateUrl: '/scripts/directives/refresh-session/refresh-session.html',
            link: function( $scope ){
                $scope.today = new Date();
                var initTime;
                var timeOut;
                var showModal = false;

                $scope.updateReloj = updateTime;

                $interval(function(){
                    getTime();
                },60000);

                function getTime(){
                    RefreshSrv.getTime().then( function( _res ){
                        initTime = _res;
                        $timeout.cancel( timeOut );
                        updateReloj();
                    });
                }

                function updateTime () {
                    RefreshSrv.updateSession()
                        .then( successCallback )
                        .catch( errorCallback );

                    function successCallback ( response ) {
                        sessionStorage.setItem('__token',response.token);
                        getTime();
                    }

                    function errorCallback () {}
                }

                function updateReloj() {
                    if( initTime <= 300 && !showModal ){ 
                        updateTime();
                       showModal = true;
                        RemainingModal.show( initTime ).result.then(function() {
                            updateTime();
                            showModal = false;
                        }).catch( function () {
                            showModal = false;
                        });
                    }

                    if( initTime <= 10 ){
                        // console.log('se acabo');
                        //redirect
                        // Auth.logout();
                        location.assign('/asesoria/login');

                        return "";
                    }


                    $scope.time = $filter( 'remainingTime' )( initTime );
                    initTime-= 1;
                    timeOut = $timeout(function(){updateReloj();}, 1000);
                }

                getTime();

            },
        };
    }

    angular.module( 'actinver.directives')
    .directive('refreshSession', refreshSession );


} )();
