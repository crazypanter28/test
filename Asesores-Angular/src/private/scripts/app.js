(function() {
    'use strict';

    angular.module('actinver.providers', []);
    angular.module('actinver.controllers', []);
    angular.module('actinver.services', []);
    angular.module('actinver.directives', []);
    angular.module('actinver.constants', []);
    angular.module('actinver.filters', []);
    angular.module('actinver.templates', []);

    angular.module('actinver', [
        'actinver.filters',
        'actinver.providers',
        'actinver.controllers',
        'actinver.services',
        'actinver.directives',
        'actinver.constants',
        'actinver.filters',
        'actinver.templates',
        'ui.bootstrap',
        'sun.scrollable',
        'ui.router',
        'ncy-angular-breadcrumb',
        'ngStorage',
        'ngResource',
        'oc.lazyLoad',
        'chart.js',
        'ngTable',
        'ngStomp',
        'ngSanitize',
        'daterangepicker',
        'angularFileUpload',
        'ngFileSaver',
        'angularMoment',
        'textAngular',
        'rzModule',
        'ng-currency',
        'ng-percent',
        'chart.js',
        'ngMask',
        'angularUtils.directives.dirPagination',
        'angular-loading-bar',
        'htmlToPdfSave'
        //'pascalprecht.translate',
    ]);

    angular.module('actinver').config(function( $httpProvider, $locationProvider ) {
        $httpProvider.interceptors.push('interceptor404');
        $httpProvider.interceptors.push('interceptorToken');
        $locationProvider.hashPrefix('');
    });

    angular.module('actinver').run(function($rootScope, $state, $sessionStorage, Auth) {
        Auth.init();
        $rootScope.$state = $state;
        $rootScope.Object = Object;
        $rootScope.getTodayDate = new Date();

        $rootScope.$on('$stateChangeStart', function(event, next, _params) {
            // window.scrollTo(0, 0);
             $('html, body').animate({scrollTop:0},'1500');

            if (!Auth.checkPermissionForView(next)) {
                event.preventDefault();
                if( !$sessionStorage.user ){
                    //window.location.href = '/login.html';
                    location.assign('/asesoria/login');
                } else {
                    window.location.href = '/#!/dashboard';
                }
            }

            if(next.name !== 'app.dashboard' && event.currentScope.$state.$current.self.name ==="app.dashboard" ){
                $rootScope.$broadcast('close-socket-ipc-status');
                $rootScope.$broadcast('close-socket-last-news');
            }

            if (next.data && next.data.needContract && !$sessionStorage.sclient){
                event.preventDefault();
                $state.go('operations', _params, {location: 'replace'});
            }

            if(typeof next.data === 'undefined' && next.name !== 'operations' && next.name !== 'account'){
                delete $sessionStorage.sclient;
            }

            if ( next.redirectTo) {
                event.preventDefault();
                $state.go(next.redirectTo, _params, {location: 'replace'});
            }

            if( event.currentScope.$state.$current.self.name === 'investment.capitals'  ){
                $rootScope.$broadcast( 'disconnectCapitals' );
            }
            if( event.currentScope.$state.$current.self.name === 'investment.capitalsLumina'  ){
                $rootScope.$broadcast( 'disconnectCapitals' );
            }
        });

    });

})();
