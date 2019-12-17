(function() {
    'use strict';

    function ipcCtrl( URLS, $scope, $http, $timeout ) {
        var set_ipc = {},
            set_issuers = {},
            ipc = this;
            ipc.objIPC = {};
            ipc.objIPCFact = {};
            ipc.streamWS = [];
            ipc.streamWSFact = [];
            ipc.finish = false;
            ipc.socketIpc = {
                stompclient: null,
                susbcribeBmvIpc: null,
                susbcribeBmvIpcFacts: null
            };

        $scope.$on('close-socket-ipc-status', function () {
            closeSocket();
        });

        // Set IPC objct
        set_ipc = {
            disconnect: function(){
                if(R.isEmpty(ipc.objIPCFact)){
                    $http({
                        method: 'GET',
                        url: URLS.getIPC,
                        ignoreLoadingBar: true,
                        params: {
                            language: 'SPA'
                        } 
                    }).then(function success(info) {
                        var payload = info.data;
                        ipc.objIPCFact = set_ipc.info(payload.ipcIndex, payload.ipcVar);
                    }, function error(){
                    });
                }
            },
            info: function(pindex, ppercentage) {
                ipc.finish = true;
                return {
                    "index": pindex.toString(),
                    "percentage": ppercentage.toString(),
                    "class": getClass(ppercentage.toString())
                };
            }
        };

        // Issuers widget
        set_issuers = {
            disconnect: function(){
                if(R.isEmpty(ipc.objIPC)){
                    /*
                    $http({
                        method: 'GET',
                        url: URLS.getIssuers,
                        params: {
                            language: 'SPA'
                        } 
                    }).then(function success(info) {
                        var issuers = info.data;
                        angular.forEach(issuers.outClientIssuersMarketInfoQuery.marketDataTuple, function(payload){
                            ipc.objIPC[payload.issuer.issuerSerie] = set_issuers.info(payload);
                        });
                    }, function error(error){
                        $log.info(error);
                    });*/
                }
            },
            info: function(payload){
                ipc.finish = true;
                return {
                    "issuerSerie": payload.issuer.issuerSerie,
                    "lastPrice": payload.lastPrice.toString(),
                    "priceVar": payload.priceVar.toString(),
                    "class": getClass(payload.priceVar.toString())
                };
            }
        };

        function getClass(string) {
            var c = true;
            if (string.indexOf("-") !== -1) {
                c = false;
            }
            return c;
        }

        function initWidget(){
            set_ipc.disconnect();
            set_issuers.disconnect();
        }

        function inicializarsocket(){
            var _url = URLS.CapitalsWebSocket + '?access_token=' + sessionStorage.getItem("__token");
            var socket = new SockJS(_url);
            ipc.socketIpc.stompclient = Stomp.over(socket);
            ipc.socketIpc.stompclient.debug = null;
            ipc.socketIpc.stompclient.connect({}, function () {

                ipc.socketIpc.susbcribeBmvIpcFacts = ipc.socketIpc.stompclient.subscribe('/topic/capitales/bmvIpcFacts', function (payload) {
                    $scope.$apply(function(){
                        var data = JSON.parse(payload.body);
                        ipc.objIPCFact = set_ipc.info(data.index, data.percentage);
                    });                   
                });

                ipc.socketIpc.susbcribeBmvIpc = ipc.socketIpc.stompclient.subscribe('/topic/capitales/bmvIpc', function (payload) {
                    $scope.$apply(function(){
                        var data = JSON.parse(payload.body);
                        ipc.objIPC[data.issuer.issuerSerie] = set_issuers.info(data);
                    });                   
                });

            }, function () {
                $timeout(inicializarsocket, 3000);
            });
            
        }

         function closeSocket() {
            if (ipc.socketIpc.stompclient !== null) {
                ipc.socketIpc.susbcribeBmvIpc.unsubscribe();                
                ipc.socketIpc.susbcribeBmvIpcFacts.unsubscribe(); 
                ipc.socketIpc.stompclient.disconnect();                                                              
            }
        }


        function wsConnect(){
            initWidget();
            inicializarsocket();
        }

        wsConnect();

    }

    angular
        .module( 'actinver.controllers' )
        .controller( 'ipcCtrl', ipcCtrl );

})();
