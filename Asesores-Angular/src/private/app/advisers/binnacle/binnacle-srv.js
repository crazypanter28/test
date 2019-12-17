(function() {
    "use strict";

    function binnacleSrv ( $http, $q, URLS, FileSaver ) {

        var api = {};


        api.getOperativeBank = function ( start, end, employeeID ) {
            var defered = $q.defer();
            var promise = defered.promise;
            var url= URLS.getBinnacleOperativeBank + '/' + start + '/' + end + '/' + employeeID + '?language=SPA';
            //var url= URLS.getBinnacleOperativeBank;
            $http.get( url ).then(
                function ( _response ){
                    if(_response && _response.data && _response.data.status === 1){
                        defered.resolve( _response.data.result );
                    }else{
                        defered.reject({});
                    }   
                },
                function ( _error ) {
                    defered.reject( _error );
                }
            );
            return promise;
        };


        api.getOperativeStockExchange = function ( start, end, employeeID ) {
            var defered = $q.defer();
            var promise = defered.promise;
            var url = URLS.getBinnacleOperativeStockExchange + '/' + start + '/' + end + '/' + employeeID + '?language=SPA';
            //var url = URLS.getBinnacleOperativeStockExchange ;

            $http.get(url).then(
                function ( _response ){
                    defered.resolve( _response.data.result );
                },
                function ( _error ) {
                    defered.reject( _error );
                }
            );
            return promise;
        };


        api.downloadPDF = function( _startDate, _endDate ){
            return $q( function( resolve, reject){
                $http.post(
                    URLS.getAdvisersBinnacleBinnacle,
                    { start: _startDate , end:_endDate},
                    { responseType: "arraybuffer" }
                ).then(
                    function ( _response ) {
                        var type = _response.headers('Content-Type');
                        var blob = new Blob([_response.data], { type: type });
                        FileSaver.saveAs(blob, 'bitacora_' + _startDate + '_' + _endDate );
                        resolve();
                    }, function ( _error ) {
                        reject( _error );
                    }
                );
            });
        };

        return api;
    }

    angular.module('actinver.services')
        .service( 'binnacleSrv', binnacleSrv );
})();
