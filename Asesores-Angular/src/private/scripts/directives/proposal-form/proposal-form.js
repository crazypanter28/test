(function(){
    'use strict';

    function proposalForm(){

        function link( scope ){
            scope.idx = Number( scope.idx );
        }

        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/scripts/directives/proposal-form/proposal-form.html',
            scope: {
                edit: '=?',
                obj: '=',
                model: '=',
                idx: '=',
                contract: '=?'
            },
            link: link,
            controller: 'proposalFormCtrl',
            controllerAs: 'propForm'
        };
    }

    angular
        .module( 'actinver.directives' )
        .directive( 'proposalForm', proposalForm );

} )();
