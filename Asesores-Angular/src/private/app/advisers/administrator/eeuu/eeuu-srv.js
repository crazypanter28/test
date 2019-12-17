(function() {
    "use strict";

    function EeuuSrv( URLS, $q, $http, csrfSrv ) {
        /**
         *  prospect service
         */
        function Eeuu(){}

        Eeuu.prototype.getGlobalForecasts = function () {
            return $q(function( resolve, reject ){
                $http({
                    method: 'GET',
                    url: URLS.getGlobalForecasts,
                    params:{
                        language: 'SPA'
                    }
                }).then(function(response) {
                    resolve( response.data );
                })
                .catch( reject );
            });
        };

        function csvJSON(csv) {
          var lines = csv.split("\n");
          var result = [];
          var headers = lines[0].split(",");

          for (var i = 1; i < lines.length; i++) {
            var obj = {};
            var currentline = lines[i].split(",");

            for (var j = 0; j < headers.length; j++) {
              obj[headers[j]] = currentline[j];
            }
            result.push(obj);
          }
        //return result; //JavaScript object
        return JSON.stringify(result); //JSON
      }

       function transformar(jason) {
          var rv = [];
          var rv2 = {};

          $.each(JSON.parse(jason), function (k, v) {
              rv2 = {};
              $.each(v, function (kk, vv) {
                  if (kk !== 'indicador')
                      rv2['a' + kk] = vv.replace(/,/g, '.');
                  else
                      rv2[kk] = vv;
              });
              rv[k] = rv2;
          });
          return JSON.stringify(rv);
      }

        Eeuu.prototype.saveCSV = function ( _csv ) {
          var txt = _csv;
          txt = txt.replace(/([^\t]+)/i, 'indicador');
          txt = txt.replace(/\t/g,',');
          var json = csvJSON(txt);
          _csv = transformar(json);
            return $q(function( resolve, reject ){

                csrfSrv.csrfValidate()
                .then(successCsrf)
                .catch(errorCsrf);

                function successCsrf(){
                    var parametersSubmit = {
                        globalForecasts:_csv
                    };
                    $http({
                        method: 'POST',
                        url: URLS.updateGlobalForecasts,
                        data: $.param(parametersSubmit),
                        transformResponse: function(data){
                            data = {"status":1,"messages":[{"type":null,"criticality":null,"code":null,"description":"OPERACIÓN EXITOSA"}],"result":null};
                            return data;
                        }
                    }).then(function(response) {
                        resolve( response.data );
                    });
                }

                function errorCsrf(error){
                    reject(error);
                }

            });
        };

        return new Eeuu();
    }

    angular.module('actinver.services')
        .service('EeuuSrv', EeuuSrv);
})();
