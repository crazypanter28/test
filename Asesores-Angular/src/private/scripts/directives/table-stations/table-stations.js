(function(){
    "use strict";

    function tableStations( investmentSrv, investmentModalSrv ){

        var link = function( scope ){

            function update(){
                scope.loading = true;
                investmentSrv.getStations( scope.contract, scope.id ).then(function(_res){
                    if( _res.data.outCommonHeader.result.result === 1 ){
                        scope.stations = _res.data.outInvestmentIssuersQuery.issuer;
                    }
                    else{
                        scope.stations = [];
                    }
                })
                .finally(function(){
                    scope.loading = false;
                });
            }

            scope.update = scope.update ? update : null;

            scope.viewMore = function( _station ){
                investmentSrv.getDetailStations( _station.issuerName, _station.serie ).then(function(_res){
                    if(_res.data.outCommonHeader.result.result === 1){
                        investmentModalSrv.moreInfoStations( _res.data, _station);
                    }
                });
            };

            scope.$watch( 'contract', function() {
                update();
            } );

            scope.$watch( 'id', function() {
                update();
            } );

            scope.ChangeDoll = function( _station ){
                scope.selected = _station;
            };

            update();

        };

        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/scripts/directives/table-stations/table.html',
            scope: {
                contract: '@',
                id: '@',
                update: '=?',
                selected: '=?',
                columnsExpand: '=?',
            },
            link : link,
        };


    }


    angular.module( 'actinver.directives' )
    .directive( 'actTableStations', tableStations );


} )();
