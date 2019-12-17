(function(){
    'use strict';

    /*function adviserForm( proposalSrv, CommonModalsSrv ){*/
    function adviserForm(){
        function link( scope ){

            function setup() {
             /*   proposalSrv.getActivityOffice()
                    .then( function ( _res ){

                        scope.offices = _res.map( function( _element ){
                            _element.text = _element.financialCenter;
                            return _element;
                        });

                    }, function(){
                        CommonModalsSrv.error( "Lo sentimos ocurrio un error." );
                    } );*/
            }

            // Delete properties on false
            scope.resetChilds = function( parent, child ){
                if( !scope.model.form[ parent ] ){
                    delete scope.model.form[ child ];
                }
            };

            setup();

        }

        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/scripts/directives/adviser-form/adviser-form.html',
            scope: {
                model: '='
            },
            link: link
        };
    }

    angular
        .module( 'actinver.directives' )
        .directive( 'adviserForm', adviserForm );

} )();