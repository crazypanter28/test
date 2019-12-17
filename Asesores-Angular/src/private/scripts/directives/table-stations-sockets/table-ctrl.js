(function() {
    "use strict";

    function tableSocketCtrl( $stomp, URLS, $log, $scope, $timeout, $state, TableStationsSrv, investmentModalSrv, $rootScope, $filter, $window ) {
        var vm = this;
        var subscribe;
        var timeoutPromise;
        vm.indice = -1;
        vm.worker = null;  
         //objeto que contendra las confgiuraciones de los sockets
         vm.socket = {
            client: null,
            subscription: null
        };    
        
        //close the socket when the windows are refresh or closed
        $window.onbeforeunload = function(){                        
            unscribe();            
        };

        $scope.$on( 'disconnectCapitals', function() {            
            unscribe();
                });

        $scope.$watch('ids', function( _old, _new ){
            if( _old !== _new ){
                unscribe();
                update(2);
            }
        });
       
        vm.ChangeDoll = function( _station,type ){
            vm.indice = _station.indice;
            $scope.selected = _station;
            $rootScope.actionStation = {type:type, origen:'stations', station:$scope.selected, operationType: 'Casa', rand:Math.random()};
        };

        vm.viewMore = function( _station ){
            investmentModalSrv.moreInfoMarket(_station);
        };

        //recibe el vento del muñeco
        $rootScope.$on('select-emisora-toTable-cb',function(event, reg){
            searchEmisora(reg);

        });


        function unscribe() {
            if (vm.worker !== null) {
                $log.info('disconnect socket capitals2.1');
                vm.worker.postMessage({config:null, step:2 }); 
                vm.worker = null;               
            }
        }

        function removeColor( element, color){
            setTimeout(function () {                         
                element.removeClass(color);
           }, 300);  
        }

        function verifyChangePrices(lastValue, newValue, id) {            
            var element = angular.element(document.querySelector('#' + id));            
            if (element && newValue > lastValue) {   
                element.scope().$digest();                            
                element.addClass("refresh-prices-green");                           
                removeColor(element, "refresh-prices-green");

            } else if (element && newValue < lastValue) {
                element.scope().$digest();               
                element.addClass("refresh-prices-red");                  
                removeColor(element, "refresh-prices-red");
            }
           
        }

        //Seccion para configurar worker
        function createWorker(fn){            
            return new Worker(URL.createObjectURL(new Blob(['('+fn+')()'])));
        };




        var myThread = function(){               
            var intentoconexion = 0;         
            var config = null;                             
            var socket ={
                client:null
            };
            //evento que escucha al treed principal.
            onmessage = function (reg) {
                switch (reg.data.step) {
                    case 1: //open socket
                        config = reg.data.config;
                        loadResources(config.urlResource+"/bower/worker.js");                                                
                        break;
                    case 2: //close socket                        
                        if(socket.client !== null){
                            socket.client.disconnect();                            
                        }
                        break;
                    default:
                        break;
                }               
            }

            function loadResources(urlResource){
                importScripts(urlResource); 
                function init(){
                    wsConnect();                 
                }
                init();
            }

            function wsConnect() {                
                intentoconexion++;
                var _socket = new SockJS(config.url);
                socket.client = Stomp.over(_socket);
                socket.client.debug = null;
                socket.client.connect({},successWsConnect, failWsConnect);                                                            
            }

            function failWsConnect() {                            
                if( config.throwSocket && intentoconexion < 4 ){
                    setTimeout(wsConnect, 3000);                    
                }
            };

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
            }

            function successWsConnect() {
                var data = removeDuplicateEmisorasEndPoint(config.emisoras);
                data.forEach(function(reg){
                    socket.client.subscribe('/topic/capitales/bmvAll/' + reg, function (payload) {
                        var data = JSON.parse(payload.body);                    
                        searchRecordInEmisora(data);                    
                    });
                });              
            };

            function searchRecordInEmisora (_payload){
                var indice =  config.emisoras.findIndex(function (_val) {
                    return _val.issuer.issuerSerie === _payload.issuer.issuerSerie && _val.feed === _payload.feed;
                });                                    
                if (indice >= 0) {                    
                    var reg = JSON.parse(JSON.stringify(config.emisoras[indice]));
                    if(reg.lastPrice > _payload.lastPrice || reg.lastPrice < _payload.lastPrice )
                        postMessage({last: reg.lastPrice, nuevo: _payload.lastPrice, id:config.emisoras[indice].idIssuerSerie+"lastPrice", lastRecord:reg, newRecord: _payload, indice:indice});
                    if(reg.tradeBuyPrice > _payload.tradeBuyPrice || reg.tradeBuyPrice < _payload.tradeBuyPrice )
                        postMessage({last: reg.tradeBuyPrice, nuevo: _payload.tradeBuyPrice, id:config.emisoras[indice].idIssuerSerie+"tradeBuyPrice",lastRecord:reg,newRecord: _payload, indice:indice});
                    if(reg.tradeSellPrice > _payload.tradeSellPrice || reg.tradeSellPrice < _payload.tradeSellPrice )
                        postMessage({last: reg.tradeSellPrice, nuevo: _payload.tradeSellPrice, id:config.emisoras[indice].idIssuerSerie+"tradeSellPrice",lastRecord:reg, newRecord: _payload, indice:indice});                                       
                    
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
                }
            };  
            
            
        }

        function initWorkerEmisoras() {            
            if (typeof (Worker) !== "undefined") {
                var BASE_PATH = (!window.location.port) ? (window.location.protocol + '//' + window.location.hostname +'/'+"asesoria" ):(window.location.protocol + '//' + window.location.hostname + ':' + window.location.port+'/'+"asesoria");
                vm.worker = createWorker(myThread);                  
                //enviamos el array al thread                
                var config = {
                    emisoras: $scope.stations,
                    url: URLS.CapitalsWebSocket + '?access_token=' + sessionStorage.getItem("__token"),
                    urlResource:BASE_PATH,
                    throwSocket: $state.is('investment.capitals')
                };
                vm.worker.postMessage({config:config, step:1 });                
                vm.worker.onmessage = function(reg){                    
                    $scope.stations[reg.data.indice].lastRegisters = reg.data.lastRecord;
                    $scope.stations[reg.data.indice].averagePrice = reg.data.newRecord.averagePrice;
                    $scope.stations[reg.data.indice].minPrice = reg.data.newRecord.minPrice;
                    $scope.stations[reg.data.indice].maxPrice = reg.data.newRecord.maxPrice;
                    $scope.stations[reg.data.indice].tradeDateTime = reg.data.newRecord.tradeDateTime;
                    $scope.stations[reg.data.indice].tradeSell = reg.data.newRecord.tradeSell;
                    $scope.stations[reg.data.indice].tradeSellPrice = reg.data.newRecord.tradeSellPrice;
                    $scope.stations[reg.data.indice].tradeBuyPrice = reg.data.newRecord.tradeBuyPrice;
                    $scope.stations[reg.data.indice].tradeBuy = reg.data.newRecord.tradeBuy;
                    $scope.stations[reg.data.indice].lastPrice = reg.data.newRecord.lastPrice;
                    $scope.stations[reg.data.indice].priceVar = reg.data.newRecord.priceVar;
                    verifyChangePrices(reg.data.last, reg.data.nuevo, reg.data.id);            
                }                
            }         
        }



        function searchEmisora(reg) {
            if ($scope.stations && reg) {
                var register = $scope.stations.filter(function (item) {
                    return item.issuer.issuerSerie === reg.issuer.issuerSerie && item.feed === reg.feed;
                });
                if(angular.isArray(register) && register.length > 0){
                    vm.indice =register[0].indice ;
                }else{
                    vm.indice = -1;
                }

            } else {
                vm.indice = -1;
            }
        }

        function update(estado) {            
            $scope.loading = true;
            $scope.stations = [];
            TableStationsSrv.getStations($scope.contract, $scope.ids.val1).then(function (_arrayStations) {
                    var arrayStations = $filter('orderBy')(_arrayStations, 'issuer.issuerSerie');
                    arrayStations.forEach(function (reg, indice) {
                        var record = JSON.parse(JSON.stringify(reg));
                        reg.indice = indice;
                        reg.lastRegisters = record;
                        if (reg.feed !== null && reg.issuer !== null && reg.issuer.issuerSerie !== null) {
                            //agregamos un identificador para agregar el id a los campos
                            reg.idIssuerSerie = reg.issuer.issuerSerie.replace(/\s/g, '').replace(/\*/g, '-').replace(/\&/g, '-') + reg.feed.replace(/\s/g, '').replace(/\*/g, '-').replace(/\&/g, '-');
                        } else {
                            reg.idIssuerSerie = indice;
                        }
                    });
                    $scope.stations = arrayStations;
                    if (estado === 2)
                        $rootScope.$broadcast('select-emisora-toTable-changeTab-cb');
                    //create the worker
                    initWorkerEmisoras()
                })
                .catch(function (error) {
                    $log.info('get stations error');
                    $scope.stations = [];                    
                })
                .finally(function () {
                    $scope.loading = false;
                });
        }

        update();
    }

    angular.module('actinver.controllers')
        .controller('tableSocketCtrl', tableSocketCtrl);


})();
