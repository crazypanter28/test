( function(){
    "use strict";

    function prospectsReactivateCtrl( reactivateSrv, $state, $stateParams, $scope, CommonModalsSrv, prospectSrv ){
        var vm = this;


        if( !$stateParams.model ){
            $state.go( 'prospects.myProfile' );
            return '';
        }

        function setup(){
            setDetails();
            getStages();
        }

        function setDetails(){
            vm.profile = $stateParams.model;
        }

        function getStages(){
            prospectSrv.getStages().then(function( _stages ){
                vm.stages = _stages.map(function( _val ){
                    _val.text = _val.description;
                    return _val;
                });
            });
        }
        // function getDetail(){
        //     reactivateSrv.getProfile().then( function( _profile ){
        //         vm.profile = _profile;
        //     });
        // }


        vm.reactivate = function(){
            var activity = vm.varsActivity ? vm.varsActivity.activity : null;
            reactivateSrv.reactivate( vm.profile,  activity ).then( function(){

                CommonModalsSrv.done( 'Se a reactivado correctamente el perfil').result
                .then( function(){
                    $state.go('prospects.myProfile');
                });
            });
        };

        setup();
    }

    angular
        .module( 'actinver.controllers' )
        .controller( 'prospectsReactivateCtrl', prospectsReactivateCtrl );

})();
