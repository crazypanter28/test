( function(){
    'use strict';

    function binnacleStrategySrv( URLS, $q, $http, moment ,csrfSrv){

        var obj = {

            /**
             * Search field types
             */
            search_types: [
                {
                    id: 1,
                    text: 'Nombre del cliente',
                    field: 'nombreCliente',
                    validation: {
                        maxlength: '60'
                    }
                },
                {
                    id: 2,
                    text: 'Número de contrato',
                    field: 'numContrato',
                    validation: {
                        pattern: new RegExp( '^[0-9]*$' ),
                        maxlength: '11'
                    }
                },
                {
                    id: 3,
                    text: 'Clasificación',
                    field: 'clasification',
                    validation: {
                        maxlength: '60'
                    }
                },
                {
                    id: 4,
                    text: 'Tipo de contrato',
                    //field: 'origen',
                    field:'typeOrigin',
                    validation: {
                        maxlength: '60'
                    }
                },
                {
                    id: 5,
                    text: 'Estatus',
                    field:'contactNameStatus',
                    //field: 'contactStatus',
                    validation: {
                        maxlength: '60'
                    }
                },
                {
                    id: 6,
                    text: 'Todos'
                }
            ],

            /**
             * Get binnacle for searching clients to contact
             * @param {string} employee - Adviser ID number
             * @return  {object}
             */
            getBinnacleClients: function( employee ){
                var month = moment().format( 'M' ),
                    year = moment().format( 'YYYY' );

                return $q( function( resolve, reject ){
                     $http( {
                        method: 'GET',
                        url: URLS.getBinnacleClients + employee + '/' + month + '/' + year + '/TODOS/',
                        //url: URLS.getBinnacleClients,
                        params: {
                            language: 'SPA'
                        }
                    } ).then( function success( response ){

                        if ( typeof response !== 'undefined' && response.data.response.status === 1 ) {
                            if(response.data.response.result){
                                resolve( { success: true, data: response.data.response.result.sponsorList } );
                            }else{
                                reject( { success: false, data: [] } );
                            }
                        } else {
                            reject( { success: false, data: [] } );
                        }

                    }, function error(){

                        reject( { success: false, data: [] } );

                    } );
                } );
            },

            /**
             * Get client information
             * @param {string} employee - Adviser ID number
             * @param {string} contract - Client contract number
             * @return  {object}
             */
            getClientDetails: function( employee, sponsor, contract ){
                var month = moment().format( 'M' ),
                year = moment().format( 'YYYY' );
                return $q( function( resolve, reject ){
                    $http( {
                        method: 'GET',
                        url: URLS.getClientDetails + employee + '/' + sponsor + '/' + contract + '/' + month + '/' + year,                        
                        //url: URLS.getClientDetails + '53883' + '/' + sponsor + '/' + contract + '/' + month + '/' + year,
                        params: {
                            language: 'SPA'
                        }
                    } ).then( function success( response ){
                        
                        if ( typeof response !== 'undefined' && response.data.response.status === 1 && !R.isEmpty( response.data.response.result ) ) {
                            resolve( { success: true, data: response.data.response.result, type: 'details' } );
                        } else {
                            reject( { success: false, data: [] } );
                        }

                    }, function error(){

                        reject( { success: false, data: [] } );

                    } );
                } );
            },

            /**
             * Get client type
             * @param {string} employee - Adviser ID number
             * @param {string} contract - Client contract number
             * @return  {object}
             */
            getClientType: function( employee, contract ){

                return $q( function( resolve, reject ){
                    $http( {
                        method: 'GET',
                        url: URLS.getClientType + employee + '/' + contract,
                        params: {
                            language: 'SPA'
                        }
                    } ).then( function success( response ){

                        if ( typeof response !== 'undefined' && response.data.response.status === 1 ) {
                            resolve( { success: true, data: response.data.response.result, type: 'type' } );
                        } else {
                            reject( { success: false, data: [] } );
                        }

                    }, function error(){

                        reject( { success: false, data: [] } );

                    } );
                } );
            },

            /**
             * Get client profile
             * @param {string} contract - Client contract number
             * @return  {object}
             */
            getClientProfile: function( contract ){

                return $q( function( resolve, reject ){
                    $http( {
                        method: 'GET',
                        url: URLS.getClientProfile + contract + '/2/2',
                        params: {
                            language: 'SPA'
                        }
                    } ).then( function success( response ){

                        if ( typeof response !== 'undefined' && response.data.outCommonHeader.result.result === 1 ) {
                            resolve( { success: true, data: response.data.outProfileByContractQuery.contractResult, type: 'profile' } );
                        } else {
                            reject( { success: false, data: [] } );
                        }

                    }, function error(){

                        reject( { success: false, data: [] } );

                    } );
                } );
            },

            /**
             * Get binnacle catalog
             * @return  {object}
             */
            getBinnacleCatalog: function(){

                return $q( function( resolve, reject ){
                    $http( {
                        method: 'GET',
                        url: URLS.getBinnacleCatalog,
                        params: {
                            language: 'SPA'
                        }
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
             * Get binnacle child catalog
             * @param {number} item - ID of parent activity
             * @return  {object}
             */
            getBinnacleCatalogChild: function( item ){

                return $q( function( resolve, reject ){
                    $http( {
                        method: 'GET',
                        url: URLS.getBinnacleCatalogChild + item,
                        params: {
                            language: 'SPA'
                        }
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
             * Get comments by contract
             * @param {number} contract - ID
             * @return  {object}
             */
            getCommentsDetailsByContract: function(employeeID, sponsor, _contract, month, year ){                
                return $q( function( resolve, reject ){
                   // var month = moment().format( 'M' ),
                   // year = moment().format( 'YYYY' );
                    
                    $http( {
                        method: 'GET',
                        
                        //url: URLS.getCommentsDetailsByContract + '53883' +'/'+sponsor+'/'+_contract+'/'+month+'/'+year+'/',
                        url: URLS.getCommentsDetailsByContract + employeeID +'/'+sponsor+'/'+_contract+'/'+month+'/'+year+'/',
                       // url: URLS.getCommentsDetailsByContract + _contract +'/732/3029939/10/2017/',
                        params: {
                            language: 'SPA'
                        }
                    } ).then( function success( response ){
                        if ( typeof response !== 'undefined' &&  response.data &&  response.data.response !== null && response.data.response.status === 1 ) {
                            resolve( response.data.response.result );
                        } else {
                            reject( { success: false } );
                        }

                    }, function error(){

                        reject( { success: false } );

                    } );
                } );
            },

            /**
             * Post binnacle comment on some
             * @param {object} info - Array with all information to post inside binnacle
             * @return  {object}
             */
            doBinnacleComment: function( info ){

                return $q( function( resolve, reject ){

                    csrfSrv.csrfValidate()
                    .then(successCsrf)
                    .catch(errorCsrf);

                    function successCsrf(){
                        $http( {
                            method: 'POST',
                            url: URLS.doBinnacleComment,
                            data:  $.param(info),
                        } ).then( function success( response ){
                            
                            if ( typeof response !== 'undefined' && response.data.status === 1 ) {
                                resolve( { success: true, msg:"El mensaje se ha enviado exitosamente." } );
                            } else {
                                reject( { success: false, msg:response.data.messages[0].description  } );
                            }
    
                        }, function error(){
    
                            reject( { success: false, msg:'Se Encontró Un Error Favor De Intentarlo Más Tarde, Comuníquese Con Su Help desk' } );
    
                        } );

                    }

                    function errorCsrf(error){
                        reject(error);
                    }


                } );
            }
        };

        return obj;

    }

    angular
    	.module( 'actinver.controllers' )
        .service( 'binnacleStrategySrv', binnacleStrategySrv );

})();
