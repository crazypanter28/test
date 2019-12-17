( function(){
    "use strict";

    function modals( $uibModal, $sce ) {

        var api  = {};

        api.moreInfo = function( _model ){
            return $uibModal.open({
                templateUrl: '/scripts/modals/views/investment/detail.html',
                controller: 'invModalCtrl',
                controllerAs: 'inv',
                windowClass : 'transfer-detail',
                resolve:{
                    info:function(){
                        return _model;
                    }
                }
            });
        };

        api.moreInfoMarketOrder = function( _model, _order){
            return $uibModal.open({
                templateUrl: '/scripts/modals/views/investment/detailMarket.html',
                controller: 'invModalCtrl',
                controllerAs: 'inv',
                windowClass : 'transfer-detail',
                resolve:{
                    info:function(){
                        _model.order = _order;
                        return _model;
                    }
                }
            });
        };


        api.moreInfoStations = function( _model, station ) {
            return $uibModal.open({
                templateUrl: '/scripts/modals/views/investment/detail-stations.html',
                controller: 'invModalCtrl',
                controllerAs: 'inv',
                windowClass : 'table-detail',
                resolve:{
                    info:function(){
                        _model.station = station;
                        return _model;
                    }
                }
            });
        };

        api.moreInfoStationsBank = function( _model ) {
            return $uibModal.open({
                templateUrl: '/scripts/modals/views/investment/detail-stations.html',
                controller: 'invModalCtrl',
                controllerAs: 'inv',
                windowClass : 'table-detail',
                resolve:{
                    info:function(){
                        return _model;
                    }
                }
            });
        };

        api.moreInfoMarket = function(_station ) {
            _station.url = $sce.trustAsResourceUrl('https://bursanet.actinver.com/static/ficha-valor/#/index?emisora=' + _station.issuer.issuerName + '&serie=' + _station.issuer.serie);
            return $uibModal.open({
                templateUrl: '/scripts/directives/table-stations-sockets/fichaValor.html',
                controller: 'invModalCtrl',
                controllerAs: 'inv',
                windowClass : 'table-detail',
                resolve:{
                    info:function(){
                        return _station;
                    }
                }
            });
        };

        api.moreInfoTitles = function( _order ) {
            return $uibModal.open({
                templateUrl: '/scripts/directives/table-portfolio-investment/info-titles.html',
                controller: 'invModalCtrl',
                controllerAs: 'inv',
                windowClass : 'table-detail',
                resolve:{
                    info:function(){
                        return _order;
                    }
                }
            });
        };

        api.moreInfoFundsBank = function (_order) {
            return $uibModal.open({
                templateUrl: '/scripts/modals/views/investment/detail-funds-bank.html',
                controller: 'invModalCtrl',
                controllerAs: 'inv',
                windowClass : 'table-detail',
                resolve:{
                    info:function(){
                        return _order;
                    }
                }
            });

        };

        api.reportoConfirmLetter = function(opID, opDate, hold) {
            var modal = $uibModal.open({
                templateUrl: '/scripts/modals/views/money-market/reporto-letter.html',
                size: 'sm',
                windowClass : 'commons confirm',
                controller: 'reportoLetterModalCtrl',
                controllerAs: 'reportoLtr',
                resolve: { // estas variables se inyectan en el controlador
                    operation: function () {return opID;},
                    operDate: function () {return opDate;},
                    holder: function () {return hold;},
                    mailConfirm: function () {return false;}
                }
            });

            return modal;
        };

        return api;
    }

    angular.module( 'actinver.services' )
        .service( 'investmentModalSrv', modals );

})();
