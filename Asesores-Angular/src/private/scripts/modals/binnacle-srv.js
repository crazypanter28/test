( function(){
    'use strict';

    function binnacleModalSrv( $uibModal ) {

        var api  = {};

        api.showClientInfo = function( client ){
            return $uibModal.open({
                templateUrl: '/scripts/modals/views/binnacle/client-info.html',
                controller: 'clientInfoModalCtrl',
                controllerAs: 'client',
                backdrop: 'static',
                resolve: {
                    clientInfo: function(){
                        return {
                            info: client
                        };
                    }
                }
            }).result.finally( angular.noop ).then( angular.noop, angular.noop );
        };

        api.outlineClient = function( employee, contrato,tipoOrigen ,typeServicio,tipoPersona,typeoperation, investmentProfile){

            return $uibModal.open({
                templateUrl: '/scripts/modals/views/binnacle/outline-client.html',
                controller: 'outlineClientModalCtrl',
                controllerAs: 'outline',
                windowClass : 'outline-client-lb',
                resolve: {
                    outlineItemDetails: function(){
                        return {
                            employee: employee,
                            contrato: contrato,
                            tipoOrigen: tipoOrigen,
                            typeServicio: typeServicio,
                            tipoPersona: tipoPersona,
                            typeoperation:typeoperation,
                            investmentProfile : investmentProfile
                        };
                    }
                }
            }).result.finally( angular.noop ).then( angular.noop, angular.noop );
        };

        return api;
    }

    angular
        .module( 'actinver.services' )
        .service( 'binnacleModalSrv', binnacleModalSrv );

})();