(function() {
    "use strict";

    function administratorSrv ( $http, $q, URLS ) {

        var api = {};


        api.getAdvisersBinnacleMessage = function ( idMessage ) {
            var defered = $q.defer();
            var promise = defered.promise;
            $http.get( 
                URLS.getAdvisersBinnacleMessage + 
                idMessage + 
                '?language=SPA' 
            ).then(
                function ( _response ){
                    if( _response.data.status === 1 ) {
                        defered.resolve( _response.data.result );
                    }
                    defered.reject( _response.data.messages );
                },
                function ( _error ) {
                    defered.reject( _error );
                }
            );
            return promise;
        };


        api.getAdvisersBinnacleBinnacle = function (_idEmployee, _startDate, _endDate) {
            return $q(function () {
                $http({
                    method: 'GET',
                    url: URLS.getAdvisersBinnacleBinnacle + _idEmployee + '/' + _startDate + '/' + _endDate,
                    responseType: 'arraybuffer',
                    params: {
                        language: 'SPA'
                    }
                }).then(function (response) {
                    var blob = new Blob([response.data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                    saveAs(blob, 'Bitacora' +_startDate+'-'+_endDate+'.xlsx');
                });

                function saveAs(blob, fileName) {
                    if (window.navigator.msSaveOrOpenBlob) { // For IE:
                        navigator.msSaveBlob(blob, fileName);
                    } else { // For other browsers:
                        var link = document.createElement('a');
                        link.href = window.URL.createObjectURL(blob);
                        link.download = fileName;
                        link.click();
                        window.URL.revokeObjectURL(link.href);
                    }
                }

            });
        };

        return api;
    }

    angular.module('actinver.services')
        .service( 'administratorSrv', administratorSrv );
})();
