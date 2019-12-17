( function(){
    'use strict';

    function goalsCustomSrv( URLS, $q, $http ){

        var obj = {

            /**
             * Get groups by employee
             * @param {number} employeeID - Employee ID number
             * @return {object}
             */            
            getGroupsByEmployeeRpt: function( employeeID, date ){

                return $q( function( resolve, reject ){
                    $http( {
                        method: 'GET',
                        url: decodeURIComponent( URLS.getGroupsByEmployeeRpt + '?idEmployee=' + employeeID + '&language=SPA&fechaTransaccion=' + date ),
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
             * Get information by group
             * @param {number} group - Group ID number
             * @return {object}
             */        
            getInfoByGroupRpt: function( group, date ){

                return $q( function( resolve, reject ){
                    $http( {
                        method: 'GET',
                        url: decodeURIComponent( URLS.getInfoByGroupRpt + group + '?language=SPA&fechaTransaccion=' + date ),
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
             * @param {number} center - Center ID number
             * @param {string} date - Filter information date
             * @return {object}
             */        
            getCustomCenterInfoRpt: function( center, date ){

                return $q( function( resolve, reject ){
                    $http( {
                        method: 'GET',
                        url: decodeURIComponent( URLS.getCustomCenterInfoRpt + center + '?language=SPA&fechaTransaccion=' + date ),
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
             * @param {number} center - Center ID number
             * @param {string} date - Filter information date
             * @return {object}
             */           
            getCustomCenterProductsRpt: function( center, date ){

                return $q( function( resolve, reject ){
                    $http( {
                        method: 'GET',
                        url: decodeURIComponent( URLS.getCustomCenterProductsRpt + center + '?language=SPA&fechaTransaccion=' + date ),
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
        .service( 'goalsCustomSrv', goalsCustomSrv );

})();