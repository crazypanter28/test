(function(){
    "use strict";

    function tableStationsBank( investmentSrv, investmentModalSrv){

        var link = function( scope ){

            function update(){
                scope.loading = true;
                investmentSrv.getStationsBank( scope.contract )
                .then(function(_res){
                    if( _res.data.outCommonHeader.result.result === 1 ){
                            var _fundType = _res.data.outBankInvstFundsByContractQuery.funds.fund;
                            var _stations = [];
                            if(scope.id === '3'){
                                angular.forEach( _fundType , function( item ){
                                    if( item.instrumentIDDescription.description === "FONDOS DE DEUDA"){
                                        _stations.push( item );
                                    }
                                } );
                            }else if(scope.id === '2'){
                                angular.forEach( _fundType , function( item ){
                                    if( item.instrumentIDDescription.description === "RENTA VARIABLE"){
                                        _stations.push( item );
                                    }
                                } );
                            }else if(scope.id === '1'){
                                angular.forEach( _fundType , function( item ){
                                    if( item.instrumentIDDescription.description === "FONDOS DE COBERTURA"){
                                        _stations.push( item );
                                    }
                                } );
                            }
                            scope.stations = _stations;
                    }
                    else{
                        scope.stations = [];
                    }
                    scope.bandera=true;

                })
                .finally(function(){
                    scope.loading = false;
                });
            }
            scope.bandera=false;
            scope.update = scope.update ? update : null;

            scope.viewMore = function( _station ){
                investmentModalSrv.moreInfoStationsBank( _station );
            };

            scope.$watch( 'contract', function() {
                update();
            } );

            scope.$watch( 'id', function() {
                update();
            } );

            scope.ChangeDoll = function( _station ){
                    scope.style = 1;
                    scope.selected  = _station;
            };


            //update();

        };

        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/scripts/directives/table-stations-bank/table.html',
            scope: {
                contract: '@',
                id: '@',
                update: '=?',
                selected: '=?',
                columnsExpand: '=?',
                stations: '=',
                bandera:'='
            },
            link : link,
        };


    }


    angular.module( 'actinver.directives' )
    .directive( 'actTableStationsBank', tableStationsBank );


} )();
