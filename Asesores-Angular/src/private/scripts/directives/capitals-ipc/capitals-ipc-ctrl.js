( function(){
    "use strict";

    function capitalsIpcCtrl( $stomp, $scope, URLS, $log, $timeout, capitalsIpcSrv, $state ){
        var vm = this;
        var timeoutPromise;
        // var subscribe;

        vm.ipcFact = {};

        function setup() {
            initCommision();
            initLastIPC();
            initSocket();
        }


        function initCommision(){
            var contract = JSON.parse( $scope.contract );
            capitalsIpcSrv.getCommission( contract.contractNumber ).then(function( _response ){            
                vm.amount1 = _response.commissionPercentage + '0';
            });
        }
        
        function initLastIPC() {
            capitalsIpcSrv.getLastIPC().then(function( _response ){

                if(angular.isArray(_response) && _response.length>0){
                    var initRecord = JSON.parse(JSON.stringify(_response[0]));
                    _response.forEach(function(reg){
                        if(new Date (initRecord.operationDate) < new Date (reg.operationDate) ){
                            initRecord = JSON.parse(JSON.stringify(reg));
                        }
                    });
                    vm.ipcFact.percentage = initRecord.percentage;
                    vm.ipcFact.index = initRecord.index;
                }
            });
        }


        function initSocket() {
            $stomp.setDebug(function (args) {
                $log.debug(args);
            });
            wsConnect();
        }

        function wsConnect() {
            // $stomp.disconnect();
            var _url = URLS.CapitalsWebSocket + '?access_token=' + sessionStorage.getItem("__token");
            $stomp.connect(_url, {}).then(successWsConnect, failWsConnect);
        }

        $scope.$on( 'disconnectCapitals', function() {
            // subscribe.unsubscribe();
            $stomp.disconnect().then(function () {
                //$log.info('disconnect socket capitals ipc');
            });
        });

        function calculateIpc( _payload ) {
            var percentage = _payload.tendency === 'B' ? _payload.percentage *-1 : _payload.percentage;
            return {
                "index": _payload.index,
                "percentage": percentage,
            };
        }

        function successWsConnect(){
            //$log.info(' connect socket capitals ipc');

            $timeout(function(){
                $stomp.subscribe('/topic/capitales/bmvIpcFacts', function(payload){
                    $scope.$apply(function (){
                        var newIpc= calculateIpc( payload );
                        vm.ipcFact.index = newIpc.index;
                        vm.ipcFact.percentage = newIpc.percentage;
                    });
                });
            },1000);
        }

        function failWsConnect() {
            $timeout.cancel( timeoutPromise );
            if( $state.is('investment.capitals') ){
                timeoutPromise = $timeout(wsConnect, 3000);
                $log.info('STOMP: Reconecting in 3 seconds');
            }
        }


        setup();
    }

    angular
    	.module( 'actinver.controllers' )
        .controller( 'capitalsIpcCtrl', capitalsIpcCtrl );

})();
