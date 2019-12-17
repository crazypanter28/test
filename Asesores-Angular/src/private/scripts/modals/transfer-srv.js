( function(){
    "use strict";

    function modals( $uibModal, $http, URLS ) {

        var api  = {};

        api.accept = function( _info ){
            var modal = $uibModal.open({
              templateUrl: '/scripts/modals/views/transfers/confirm.html',
              controller: 'transferModalCtrl',
              controllerAs: 'transfer',
              backdrop: 'static',
              keyboard : false,
              windowClass : 'confirm-transfer',
              resolve:{
                  info:function(){
                      return _info;
                  }
              }
            });

            return modal;
        };

        api.detail = function( _contract, _orderReference ){
            var modal = $uibModal.open({
              templateUrl: '/scripts/modals/views/transfers/detail.html',
              controller: 'detailModalCtrl',
              controllerAs: 'detail',
            //   backdrop: 'static',
            //   keyboard : false,
              windowClass : 'transfer-detail',
              resolve:{
                info: function(){
                    return $http({
                        method: 'GET',
                        url: URLS.getOrderDetail + '/' + _contract +'/' + _orderReference + '?language=SPA',
                    });
                 }
                }
            
            });

            return modal;
        };

        api.detailTransfer = function( detail ){
            
                        var movementsDetail=[];
                        movementsDetail.push(detail);
                        var modal = $uibModal.open({
                          templateUrl: '/scripts/modals/views/transfers/detail.html',
                          controller: 'detailModalCtrl',
                          controllerAs: 'detail',
                        //   backdrop: 'static',
                        //   keyboard : false,
                          windowClass : 'transfer-detail',
                          resolve:{
                              info:function () {
                                return movementsDetail;
                                 }
                              }
                          
            
                        });
            
                        return modal;
        };
        
        api.detailTransferSPEI = function( detail ){
            
                        //var movementsDetail=[];
                        //movementsDetail.push(detail);
                        var modal = $uibModal.open({
                        templateUrl: '/scripts/modals/views/transfers/detailSPEI.html',
                        controller: 'detailModalCtrl',
                        controllerAs: 'detail',
                        //   backdrop: 'static',
                        //   keyboard : false,
                          windowClass : 'transfer-detail-SPEI',
                          resolve:{
                              info:function () {
                                return detail;
                                 }
                              }
                          
            
                        });
            
                        return modal;
        };


        return api;
    }


    angular.module( 'actinver.services' )
        .service( 'transferModalSrv', modals );


})();
