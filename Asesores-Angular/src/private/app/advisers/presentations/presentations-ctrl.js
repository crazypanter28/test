( function(){
    "use strict";

    function presentationsCtrl( PresentationSrv, $state, $stateParams ){
        var vm = this;
       
        function setup () {
            var selectedTab = $stateParams.id ? $stateParams.id: 1;
            $state.go('presentations.id',{id:selectedTab});
            getClassifications();
            vm.getPresentationsByType(selectedTab);
            setupVars();
        }
        function setupVars () {
            vm.selectedTab = 1;
            vm.groupSelectedTab = 0;
        }
        vm.nextTab = function () {
            vm.groupSelectedTab++;
        };

        vm.beforeTab = function () {           
           vm.groupSelectedTab--;
        };


        function orderPresentation( _presentations ){
            var categories = {};
            _presentations.map(function( _val ){
                var category = _val.idPresentationSubType || 'generica';
                var name = _val.presentations[0].descriptionSubType || 'generica';

               
                if( !categories[category] ){
                    categories[category] = {
                        name: name,
                        list: []
                    };
                }

                categories[category].list = _val.presentations;
            });
            vm.presentationsList = categories;
            //return categories;
        }


        function getClassifications(){
            vm.loadingProducts = true;
            PresentationSrv.getTypesAsr().then( function( _res ){
                vm.products = _res;
            }, function(){
                vm.errorLoadingProducts = true;
            })
            .finally(function(){
                vm.loadingProducts = false;
            });
        }


         vm.getPresentationsByType = function( _id ){
            vm.loadingSubProducts = true;
            vm.loadingPres = true;
            vm.subProducts = [];

            PresentationSrv.getPresentations ( _id ).then(function( _listProduct ){
                
                angular.forEach( _listProduct, function( item ){
                    vm.subProducts.push( item );
                } );
                vm.loadingSubProducts = false;
                vm.loadingPres = false;
                orderPresentation( vm.subProducts );
            }).catch(function(){
                vm.loadingSubProducts = false;
                vm.loadingPres = false;
            });
        };

        vm.done = function ( _id ){
            PresentationSrv.getPresentationsFile( _id ).then(function( ){
            });
        };

        setup();
    }


    angular.module('actinver.controllers')
    .controller('presentationsCtrl', presentationsCtrl );

})();
