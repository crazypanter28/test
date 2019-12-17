( function(){
    'use strict';

    function goalsReportsSrv( URLS, $q, $http ){

        function validateRol(roleSearch){
			var user = JSON.parse(JSON.parse(sessionStorage["ngStorage-user"]));
            var indice = -1;
            if (angular.isDefined(user.roles) && angular.isArray(user.roles)) {
                indice = user.roles.findIndex(function (rol) {
                    return rol.toUpperCase() === roleSearch;
                });
            }
            return indice > -1;
		}

        var obj = {

            /**
             * Get goals position information
             * @param {number} employeeID - Employee ID number
             * @param {string} date - Filter information date
             * @return {object}
             */            
            getGoalsPositionsRpt: function( employeeID, date ){
                var url = validateRol("ASESOR") ? URLS.getGoalsPositions : URLS.getGoalsPositionsRpt;

                return $q( function( resolve, reject ){
                    $http( {
                        method: 'GET',
                        url: decodeURIComponent( url + employeeID + '?language=SPA&fechaTransaccion=' + date ),
                    } ).then( function success( response ){

                        if ( typeof response !== 'undefined' && response.data.status === 1 ) {
                            resolve( { success: true, data: response.data.result, topic: 'goals-positions' } );
                        } else {
                            reject( { success: false, data: [] } );
                        }

                    }, function error(){

                        reject( { success: false, data: [] } );

                    } );
                } );
            },

            /**
             * Get sum information about goals positions
             * @param {number} employeeID - Employee ID number
             * @param {string} date - Filter information date
             * @return {object}
             */            
            getSumGoalsPositionsRpt: function( employeeID, date ){
                var url = validateRol("ASESOR") ? URLS.getSumGoalsPositions : URLS.getSumGoalsPositionsRpt;
                return $q( function( resolve, reject ){
                    $http( {
                        method: 'GET',
                        url: decodeURIComponent( url + employeeID + '?language=SPA&fechaTransaccion=' + date ),
                    } ).then( function success( response ){

                        if ( typeof response !== 'undefined' && response.data.status === 1 ) {
                            resolve( { success: true, data: response.data.result, topic: 'sum-goals-positions' } );
                        } else {
                            reject( { success: false, data: [] } );
                        }

                    }, function error(){

                        reject( { success: false, data: [] } );

                    } );
                } );
            },

            /**
             * Get contracts for goals
             * @param {number} employeeID - Employee ID number
             * @param {string} date - Filter information date
             * @return {object}
             */        
            getGoalsContractsRpt: function( employeeID, date ){
                var url = validateRol("ASESOR") ? URLS.getGoalsContracts : URLS.getGoalsContractsRpt;
                return $q( function( resolve, reject ){
                    $http( {
                        method: 'GET',
                        url: decodeURIComponent( url + employeeID + '?language=SPA&fechaTransaccion=' + date ),
                    } ).then( function success( response ){

                        if ( typeof response !== 'undefined' && response.data.status === 1 ) {
                            resolve( { success: true, data: response.data.result, topic: 'goals-contracts' } );
                        } else {
                            reject( { success: false, data: [] } );
                        }

                    }, function error(){

                        reject( { success: false, data: [] } );

                    } );
                } );
            }

        };

        return obj;

    }

    angular
    	.module( 'actinver.services' )
        .service( 'goalsReportsSrv', goalsReportsSrv );

})();