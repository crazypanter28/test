(function(){
    'use strict';

    function searchList(){

        return {
            restrict: 'E',
            replace: true,
            templateUrl: function( el, $attr ){
                var template = '/scripts/directives/search-list/' + $attr.tmpl;
                return template;
            },
            scope: {
                typeoperation: '@?',
                employee: '@?',
                info: '=',
                tmpl: '@',
                settings: '=?',
                cb: '=?',
                estado: '=?',
                invocacion:'=?',
                ctrl:'=?'
            },
            controller: 'searchListCtrl',
            controllerAs: 'search_list'
        };
    }

    angular
        .module( 'actinver.directives' )
        .directive( 'searchList', searchList );

} )();
