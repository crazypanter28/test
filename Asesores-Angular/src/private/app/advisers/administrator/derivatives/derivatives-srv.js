(function() {
    "use strict";

    function derivativesSrv( URLS, $q, $http, ErrorMessagesSrv, csrfSrv ) {
        
        function Derivatives(){}

        Derivatives.prototype.getDerivatives = function () {
            return $q(function( resolve, reject ){
                $http({
                    method: 'GET',
                    url: URLS.getDerivatives,
                    params:{
                        language: 'SPA'
                    }
                }).then(function(response) {
                    resolve( response.data );
                })
                .catch( reject );
            });
        };

        Derivatives.prototype.saveCSV = function ( _csv ) {
            var txt = _csv;
            txt = txt.replace(/([^\t]+)/i, 'nota');
            txt = txt.replace(/\t/g,'|');
            var json = csvJSON(txt);
            _csv = transformar(json);
              return $q(function( resolve, reject ){
  
                  csrfSrv.csrfValidate()
                  .then(successCsrf)
                  .catch(errorCsrf);
  
                  function successCsrf(){
                      var parametersSubmit = {
                        derivatives:_csv
                      };
                      $http({
                          method: 'POST',
                          url: URLS.updateDerivatives,
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


          function csvJSON(csv) {
            var lines = csv.split("\n");
            var result = [];
            var headers = lines[0].split("|");
  
            for (var i = 1; i < lines.length; i++) {
              var obj = {};
              var currentline = lines[i].split("|");
  
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
                    if (kk !== 'nota'){
                        rv2['a' + kk] = vv;
                    } else {
                        rv2[kk] = vv;
                    }
                });
                rv[k] = rv2;
            });
            return JSON.stringify(rv);
        }


        return new Derivatives();
    }

    angular.module('actinver.services')
        .service('derivativesSrv', derivativesSrv);
})();