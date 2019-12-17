(function() {
    "use strict";

    function tableSocketLuminaCtrl( $stomp, URLS, $log, $scope, $timeout, $state, TableStationsSrv, investmentModalSrv, $rootScope, $filter, workerConfigSrv ) {
        var vm = this;
        vm.indiceSeleccionado = -1;  

       // var subscribe;
        var timeoutPromise;
        vm.worker = null;
        
        $scope.$on( 'disconnectCapitals', function() {
            unscribe();
        });

        //recibe el vento del muñeco 
        $rootScope.$on('select-emisora-toTable',function(event, reg){
            searchEmisora(reg);
           
        });

        //detecta el cambio de tabs en mercado de capitales
        $scope.$watch('ids', function( _old, _new ){
            if( _old !== _new ){
                unscribe();
                update(2);                                              
            }
        });    

        vm.ChangeDoll = function( _station, type ){
            vm.tab = type;
            vm.indiceSeleccionado = _station.indice; 
            $scope.selected = _station;         
            $rootScope.actionStation = {type:type, origen:'stations', contract:$scope.contract, station:$scope.selected, operationType: 'Banco', rand:Math.random()};
        };

        vm.viewMore = function( _station ){
            investmentModalSrv.moreInfoMarket(_station);
        };

        function searchEmisora(reg) {
            if ($scope.stations && reg) {
                var register = $scope.stations.filter(function (item) {
                    return item.issuer.issuerSerie === reg.issuer.issuerSerie && item.feed === reg.feed;
                });
                if(angular.isArray(register) && register.length > 0){
                    vm.indiceSeleccionado =register[0].indice ;
                }else{
                    vm.indiceSeleccionado = -1;
                }

            } else {
                vm.indiceSeleccionado = -1;
            }            
        }


        function unscribe() {
            if(vm.worker !==null){
                $log.info('disconnect socket capitals2.1');
                vm.worker.postMessage({config:null, step:2 }); 
                vm.worker = null;  
            }
        }

        function initWorkerEmisoras() {            
            if (typeof (Worker) !== "undefined") {
                var BASE_PATH = (!window.location.port) ? (window.location.protocol + '//' + window.location.hostname +'/'+"asesoria" ):(window.location.protocol + '//' + window.location.hostname + ':' + window.location.port+'/'+"asesoria");
                vm.worker = new Worker(URL.createObjectURL(new Blob(['('+workerConfigSrv.principal+')()'])));                
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



        function update(estado){
            $scope.loading = true;
            $scope.stations = [];
            TableStationsSrv.getStationsLumina($scope.contract, $scope.ids.val1, 'EQUITY', 'B').then(function(_arrayStations){
                var arrayStations = $filter ('orderBy')(_arrayStations, 'issuer.issuerSerie');
                arrayStations.forEach(function(reg, indice){
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
                $rootScope.statiosnTable = arrayStations;
                //Es llamado desde el evento si ha cambiado de tabs
                if(estado === 2 )
                    $rootScope.$broadcast('select-emisora-toTable-changeTab');  
                initWorkerEmisoras()
                //$timeout( initSocket(), 100000 );
            })
            .catch( function(){
                $log.info('get stations error');
                $scope.stations = [];
            } )
            .finally(function(){
                $scope.loading = false;
            });
        }

        update();
    }

    angular.module('actinver.controllers')
        .controller('tableSocketLuminaCtrl', tableSocketLuminaCtrl);


})();
