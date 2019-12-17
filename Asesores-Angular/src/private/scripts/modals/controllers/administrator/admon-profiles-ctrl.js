( function(){
    "use strict";

    function admonProfilesModalCtrl( $uibModalInstance, title, profile, ProfilesSrv ){
        var vm = this;


        function setup () {
            setupVars();
            getRoles();
            getClassifications();
        }

        function getRoles(){
            ProfilesSrv.getRoles().then(function( _res ){
                vm.listTabs = _res;
            });
        }

        function setupVars () {
            vm.title = title;
            vm.profile = profile;
        }

        function getClassifications(){
            ProfilesSrv.getRoles().then(function( _res ){
                vm.products = _res.map( function( _product ) {
                    _product.text = _product.description;
                    return _product;
                });
            });
        }

        vm.close = function(){
            $uibModalInstance.dismiss();
        };

        vm.changeOptionSelectedDropdowm = function ( _option ) {
          vm.profile.idRole = _option.idRole;
      };

        vm.done = function(){
            $uibModalInstance.close( vm.profile );
        };


        setup();

    }

    angular.module( 'actinver.controllers' )
        .controller( 'admonProfilesModalCtrl', admonProfilesModalCtrl );

} )();
