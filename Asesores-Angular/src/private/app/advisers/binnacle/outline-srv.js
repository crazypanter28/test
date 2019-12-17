( function(){
    'use strict';

    function binnacleOutlineSrv( URLS, $q, $http ){

        var obj = {

            /**
             * Get clients soon / expired contacted info
             * @param {string} employeeID - User ID
             * @param {type} employeeID - Filter to get information about clients
             * @return  {object}
             */
            getClientsInfo: function( employeeID, type ){

                return $q( function( resolve, reject ){
                    var infotype = ( type === 'soon' ) ? 'consultarContratosPerfilVencer' : 'consultarContratosPerfilVencido';

                    $http( {
                        method: 'GET',
                        url: URLS.getOutlineInfo + infotype + '/' + employeeID,
                      //  url: URLS.getOutlineInfo + infotype + '/53883',
                        params: {
                            language: 'SPA'
                        }
                    } ).then( function success( response ){

                        if ( typeof response !== 'undefined' && response.data.resultadoOperacionServicioTO.status === 1 ) {
                            resolve( { success: true, data: response.data.contratosVencimientoTO } );
                        } else {
                            reject( { success: false, data: [] } );
                        }

                    }, function error(){

                        reject( { success: false, data: [] } );

                    } );
                } );
            },

            /**
             * Get sells practice url
             * @return  {object}
             */
            getSellsPracticeUrl: function(parametros){

                return $q( function( resolve, reject ){
                    $http( {
                        method: 'GET',
                        url: URLS.getSellsPracticeUrl,
                        params: parametros 
                    } ).then( function success( response ){

                        resolve(response);
                       /* if ( typeof response !== 'undefined' && response.data.status === 1 ) {
                            resolve( { success: true, data: response.data.result } );
                        } else {
                            reject( { success: false, data: [] } );
                        }*/

                    }, function error(){

                         reject( { success: false, data: [] } );

                    } );
                } );
            },

        };

        return obj;

    }

    angular
    	.module( 'actinver.controllers' )
        .service( 'binnacleOutlineSrv', binnacleOutlineSrv );

})();