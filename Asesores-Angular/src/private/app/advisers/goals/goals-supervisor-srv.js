( function(){
    'use strict';

    function goalsSupervisorSrv( URLS, $q, $http ){

        var obj = {

            /**
             * Search filter types
             */
            search_filter_types: [
                {
                    id: 1,
                    text: 'Todos',
                },
                {
                    id: 2,
                    text: 'Top 10+ Asesores',
                },
                {
                    id: 3,
                    text: 'Top 10- Asesores',
                },
                {
                    id: 4,
                    text: 'Top 10+ Centros Financieros',
                },
                {
                    id: 5,
                    text: 'Top 10- Centros Financieros',
                }
            ],

            /**
             * Get supervisor information
             * @param {number} employeeID - Employee ID number
             * @param {string} date - Filter information date
             * @return {object}
             */
            getSupervisorInfo: function( employeeID, date ){

                return $q( function( resolve, reject ){
                    $http( {
                        method: 'GET',
                        url: decodeURIComponent( URLS.getSupervisorInfo + employeeID + '?language=SPA&fechaTransaccion=' + date ),
                    } ).then( function success( response ){

                        if ( typeof response !== 'undefined' && response.data.status === 1 ) {
                            resolve( { success: true, data: response.data.result } );
                        } else {
                            reject( { success: false, data: [] } );
                        }

                    }, function error(){

                        reject( { success: false, data: [] } );

                    } );
                } );
            },

            /**
             * Get center details
             * @param {number} employeeID - Employee ID number
             * @param {number} center - Center ID number
             * @param {string} date - Filter information date
             * @return {object}
             */
            getCenterInfo: function( employeeID, center, date ){

                return $q( function( resolve, reject ){
                    $http( {
                        method: 'GET',
                        url: decodeURIComponent( URLS.getCenterInfo + center + '/' + employeeID + '?language=SPA&fechaTransaccion=' + date ),
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
             * Get center products
             * @param {number} employeeID - Employee ID number
             * @param {number} center - Center ID number
             * @param {string} date - Filter information date
             * @return {object}
             */
            getCenterProducts: function( employeeID, center, date ){

                return $q( function( resolve, reject ){
                    $http( {
                        method: 'GET',
                        url: decodeURIComponent( URLS.getCenterProducts + center + '/' + employeeID + '?language=SPA&fechaTransaccion=' + date ),
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
        .service( 'goalsSupervisorSrv', goalsSupervisorSrv );

})();