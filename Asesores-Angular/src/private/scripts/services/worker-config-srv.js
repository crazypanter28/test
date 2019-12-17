(function () {
    "use strict";

    function workerConfig() {

        var vm = this;

        vm.principal = function () {
            
            var intentoconexion = 0;
            var config = null;
            var socket = {
                client: null
            };

            //evento que escucha al treed principal.
            onmessage = function (reg) {
                switch (reg.data.step) {
                    case 1: //open socket
                        config = reg.data.config;
                        loadResources(config.urlResource + "/bower/worker.js");
                        break;
                    case 2: //close socket                        
                        if (socket.client !== null) {
                            socket.client.disconnect();
                        }
                       console.log('disconnect socket CAPITALS');
                        break;
                    default:
                        break;
                }
            };

            function loadResources(urlResource) {
                importScripts(urlResource);

                function init() {
                    wsConnect();
                }
                init();
            };

            //Configuracion del WebSocket 
            function wsConnect() {
                intentoconexion++;
                var _socket = new SockJS(config.url);
                socket.client = Stomp.over(_socket);
                socket.client.debug = null;
                socket.client.connect({}, successWsConnect, failWsConnect);
            };

            //Intenta reestablecer la configuracion del webSocket
            function failWsConnect() {
                if (config.throwSocket && intentoconexion < 4) {
                    setTimeout(work.wsConnect, 3000);
                }
            };

            // Intenta establecer los endPoint a los cuales se va a conectar.
            function successWsConnect() {
                var data = removeDuplicateEmisorasEndPoint(config.emisoras);
                data.forEach(function (reg) {
                    socket.client.subscribe('/topic/capitales/bmvAll/' + reg, function (payload) {
                        var data = JSON.parse(payload.body);
                        searchRecordInEmisora(data);
                    });
                });
            };

            //removemos los ends points que estan duplicados
            // BIVA BMV
            function removeDuplicateEmisorasEndPoint(array) {
                var data = [];
                if (array) {
                    array.forEach(function (reg) {
                        if (data.indexOf(reg.issuer.issuerSerie) < 0) {
                            data.push(reg.issuer.issuerSerie);
                        }
                    });
                }
                return data;
            };

            //Busca actualizar los precios en el Array actual; y Envia un evento al controlador que lo invocó  
            function searchRecordInEmisora(_payload) {
                var indice = config.emisoras.findIndex(function (_val) {
                    return _val.issuer.issuerSerie === _payload.issuer.issuerSerie && _val.feed === _payload.feed;
                });
                if (indice >= 0) {
                    var reg = JSON.parse(JSON.stringify(config.emisoras[indice]));

                    config.emisoras[indice].averagePrice = _payload.averagePrice;
                    config.emisoras[indice].minPrice = _payload.minPrice;
                    config.emisoras[indice].maxPrice = _payload.maxPrice;
                    config.emisoras[indice].tradeDateTime = _payload.tradeDateTime;
                    config.emisoras[indice].tradeSell = _payload.tradeSell;
                    config.emisoras[indice].tradeSellPrice = _payload.tradeSellPrice;
                    config.emisoras[indice].tradeBuyPrice = _payload.tradeBuyPrice;
                    config.emisoras[indice].tradeBuy = _payload.tradeBuy;
                    config.emisoras[indice].lastPrice = _payload.lastPrice;
                    config.emisoras[indice].priceVar = _payload.priceVar;


                    if (reg.lastPrice > _payload.lastPrice || reg.lastPrice < _payload.lastPrice)
                        postMessage({
                            last: reg.lastPrice,
                            nuevo: _payload.lastPrice,
                            id: config.emisoras[indice].idIssuerSerie + "lastPrice",
                            lastRecord: reg,
                            newRecord: _payload,
                            indice: indice
                        });
                    if (reg.tradeBuyPrice > _payload.tradeBuyPrice || reg.tradeBuyPrice < _payload.tradeBuyPrice)
                        postMessage({
                            last: reg.tradeBuyPrice,
                            nuevo: _payload.tradeBuyPrice,
                            id: config.emisoras[indice].idIssuerSerie + "tradeBuyPrice",
                            lastRecord: reg,
                            newRecord: _payload,
                            indice: indice
                        });
                    if (reg.tradeSellPrice > _payload.tradeSellPrice || reg.tradeSellPrice < _payload.tradeSellPrice)
                        postMessage({
                            last: reg.tradeSellPrice,
                            nuevo: _payload.tradeSellPrice,
                            id: config.emisoras[indice].idIssuerSerie + "tradeSellPrice",
                            lastRecord: reg,
                            newRecord: _payload,
                            indice: indice
                        });

                   
                }
            };

        };
    }
    angular.module('actinver.services')
        .service('workerConfigSrv', workerConfig);
})();