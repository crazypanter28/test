( function(){
    'use strict';

    function accountStateSrv( URLS, $q, $http, csrfSrv ){

        function AccountEstate(){}

        AccountEstate.prototype.getAccountState = function ( month, year , employeeId, userName, password, isReport ) {
            return $q(function( resolve, reject ){

                csrfSrv.csrfValidate()
                .then(successCsrf)
                .catch(errorCsrf);

                function successCsrf() {

                    var parametersSubmit = { 
                        month : month,
                        year : year,
                        employeeId : employeeId,
                        userName : userName,
                        password : password,
                        language : 'SPA',
                        isReport :isReport
                    };

                    $http({
                        method: 'POST',
                        url: URLS.getAccountState,
                        data: $.param(parametersSubmit)
                    }).then(function(response) {                      
                        resolve(response);                        
                    });
                }

                function errorCsrf(error) {
                    reject(error);
                }
                
            });
        };

        AccountEstate.prototype.getAccountStateRh = function ( month, year , employeeId, userName, password, isReport ) {
            return $q(function( resolve, reject ){

                csrfSrv.csrfValidate()
                .then(successCsrf)
                .catch(errorCsrf);

                function successCsrf() {

                    var parametersSubmit = { 
                        month : month,
                        year : year,
                        employeeId : employeeId,
                        userName : userName,
                        password : password,
                        language : 'SPA',
                        isReport :isReport
                    };

                    $http({
                        method: 'POST',
                        url: URLS.getAccountStateRh,
                        data: $.param(parametersSubmit)
                    }).then(function(response) {                      
                        resolve(response);                        
                    });
                }

                function errorCsrf(error) {
                    reject(error);
                }
                
            });
        };

        return new AccountEstate();

    }

    angular
    	.module( 'actinver.services' )
        .service( 'accountStateSrv', accountStateSrv );

})();