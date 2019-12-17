( function(){
    "use strict";

    function administratorModalsSrv( $q, $uibModal ) {

        var api  = {};

        api.admonFactsheet = function( _title, _factsheet ){
            var modal = $uibModal.open({
                templateUrl: '/scripts/modals/views/administrator/admon-factsheet.html',
                size: 'md',
                windowClass : 'administrator',
                //backdrop: 'static',
                //keyboard: false,
                controller: 'admonFactsheetModalCtrl',
                controllerAs: 'ctrl',
                resolve:{
                    title: function(){
                        return _title;
                    },
                    factsheet: function () {
                        return _factsheet;
                    }
                }
            });
            return modal.result;
        };


        api.admonGroup = function( _title, _group ){
            var modal = $uibModal.open({
                templateUrl: '/scripts/modals/views/administrator/admon-group.html',
                size: 'sm',
                windowClass : 'administrator',
                // backdrop: 'static',
                // keyboard : false,
                controller: 'admonGroupModalCtrl',
                controllerAs: 'ctrl',
                resolve:{
                    title: function(){
                        return _title;
                    },
                    group: function () {
                        return _group;
                    }
                }
            });
            return modal.result;
        };


        api.admonPresentations = function ( _title, _group ){
            var modal = $uibModal.open({
                templateUrl: '/scripts/modals/views/administrator/admon-presentations.html',
                size: 'lg',
                windowClass : 'administrator',
                //backdrop: 'static',
                //keyboard : false,
                controller: 'admonPresentationsModalCtrl',
                controllerAs: 'ctrl',
                resolve:{
                    title: function(){
                        return _title;
                    },
                    presentations: function () {
                        return _group;
                    }
                }
            });
            return modal.result;
        };


        api.admonInvestment = function( _title, _investment ){
            var modal = $uibModal.open({
                templateUrl: '/scripts/modals/views/administrator/admon-investment.html',
                windowClass : 'administrator investment',
                // backdrop: 'static',
                // keyboard : false,
                controller: 'admonInvestmentModalCtrl',
                controllerAs: 'ctrl',
                resolve:{
                    title: function(){
                        return _title;
                    },
                    investment: function () {
                        return _investment;
                    }
                }
            });
            return modal.result;
        };


        api.admonFavorites = function( _title, _favorite ){
            var modal = $uibModal.open({
                templateUrl: '/scripts/modals/views/administrator/admon-favorites.html',
                windowClass : 'administrator',
                // backdrop: 'static',
                // keyboard : false,
                controller: 'admonFavoriteModalCtrl',
                controllerAs: 'ctrl',
                resolve:{
                    title: function(){
                        return _title;
                    },
                    favorite: function () {
                        return _favorite;
                    }
                }
            });
            return modal.result;
        }; 
        

        api.admonEmployee = function( _title, _employee ){
            var modal = $uibModal.open({
                templateUrl: '/scripts/modals/views/administrator/admon-employee.html',
                windowClass : 'administrator',
                // backdrop: 'static',
                // keyboard : false,
                controller: 'admonEmployeeModalCtrl',
                controllerAs: 'ctrl',
                resolve:{
                    title: function(){
                        return _title;
                    },
                    employee: function () {
                        return _employee;
                    }
                }
            });
            return modal.result;
        };


        api.admonProfiles = function( _title, _profile ){
            var modal = $uibModal.open({
                templateUrl: '/scripts/modals/views/administrator/admon-profiles.html',
                windowClass : 'administrator',
                // backdrop: 'static',
                // keyboard : false,
                controller: 'admonProfilesModalCtrl',
                controllerAs: 'ctrl',
                resolve:{
                    title: function(){
                        return _title;
                    },
                    profile: function () {
                        return _profile;
                    }
                }
            });
            return modal.result;
        };


        api.admonMessages = function( _title, _profile ){
            var modal = $uibModal.open({
                templateUrl: '/scripts/modals/views/administrator/admon-messages.html',
                windowClass : 'administrator',
                // backdrop: 'static',
                // keyboard : false,
                controller: 'admonProfilesModalCtrl',
                controllerAs: 'ctrl',
                resolve:{
                    title: function(){
                        return _title;
                    },
                    profile: function () {
                        return _profile;
                    }
                }
            });
            return modal.result;
        };


        return api;
    }


    angular.module( 'actinver.services' )
        .service( 'administratorModalsSrv', administratorModalsSrv );


})();
