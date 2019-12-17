( function(){
    'use strict';

    function proposalsProposalSrv( URLS, $q, $http ,csrfSrv,loginSrvc){ 

        var obj = {

            /**
             * Search field types
             */
            client_types: [
                {
                    'key': 1,
                    'description': 'Física'
                }, {
                    'key': 2,
                    'description': 'Moral'
                }
            ],

            /**
             * Get information about issuers
             * @return {object}
             */
            getIssuersInfo: function(){

                return $q( function( resolve, reject ){
                    var url;
                    loginSrvc.makeDataUser().then( function( _response){  
                        for(var pos=0 ;pos< _response.user.scope.length; pos++) {        
                            var _element= _response.user.scope[pos];        
                                if (_element === 'ADMINISTRADOR') {        
                                    url=URLS.getIssuersProposal;        
                                    break;        
                                }else if ( _element === 'ASESOR'){        
                                    url=URLS.getIssuersInfo;        
                                    break;        
                                } 
                        }

                        $http( {
                            method: 'GET',
                            url: url,
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





                    });
                } );
            },

            /**
             * Get information about issuers
             * @return {object}
             */
            getProducts: function(){

                return $q( function( resolve, reject ){
                    $http( {
                        method: 'GET',
                        url: URLS.getProducts,
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
             * Get information about issuers
             * @return {object}
             */
            getSubProducts: function( product ){

                return $q( function( resolve, reject ){
                    $http( {
                        method: 'GET',
                        url: URLS.getSubProducts + product,
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
             * Get available types of profiles
             * @return {object}
             */
            getProfiles: function(){

                return $q( function( resolve, reject ){
                    $http( {
                        method: 'GET',
                        url: URLS.getProfiles,
                        params: {
                            language: 'SPA'
                        }
                    } ).then( function success( response ){

                        if ( typeof response !== 'undefined' && response.data.status === 1 ) {
                            resolve( { success: true, data: response.data.result.outClientProfileCatalog.profileList } );
                        } else {
                            reject( { success: false, data: [] } );
                        }

                    }, function error(){

                        reject( { success: false, data: [] } );

                    } );
                } );
            },

            /**
             * Get available strategies
             * @return {object}
             */
            getStrategies: function( profile ){
                var promises = [];

                function promise( type ){

                    return $q( function( resolve, reject ){
                        $http( {
                            method: 'GET',
                            url: URLS.getStrategies + type,
                            params: {
                                language: 'SPA'
                            }
                        } ).then( function success( response ){

                            if ( typeof response !== 'undefined' && response.data.outCommonHeader.result.result === 1 ) {
                                resolve( { success: true, data: response.data.outModelPortfolioByCriterionQuery.modelPortfolios } );
                            } else {
                                reject( { success: false, data: [] } );
                            }

                        }, function error(){

                            reject( { success: false, data: [] } );

                        } );

                    } );
                }

                for( var i = profile; i > 0; i-- ){

                    promises.push( promise( i ) );
                }

                return $q.all( promises );
            },

            /**
             * Get available strategies
             * @return {object}
             */
            getStrategyDetail: function( strategy ){

                 return $q( function( resolve, reject ){
                    $http( {
                        method: 'GET',
                        url: URLS.getStrategyDetail + strategy,
                        params: {
                            language: 'SPA'
                        }
                    } ).then( function success( response ){

                        if ( typeof response !== 'undefined' && response.data.outCommonHeader.result.result === 1 ) {
                            resolve( { success: true, data: response.data.outModelPortfolioDetailQuery.modelPortfolios } );
                        } else {
                            reject( { success: false, data: [] } );
                        }

                    }, function error(){

                        reject( { success: false, data: [] } );

                    } );
                } );
            },


            /**
             * Get investment issuers catalog
             * @param {string} type - Person type key
             * @return {object}
             */
            getInvIssuersCatalog: function( type ){

                 return $q( function( resolve, reject ){
                    $http( {
                        method: 'GET',
                        url: URLS.getInvIssuersCatalog + type,
                        params: {
                            language: 'SPA'
                        }
                    } ).then( function success( response ){

                        if ( typeof response !== 'undefined' && response.data.outCommonHeader.result.result === 1 ) {
                            resolve( { success: true, data: response.data.outInvestmentIssuersProspectQuery.issuer, topic: 'invIssuersCatalog' } );
                        } else {
                            reject( { success: false, data: [] } );
                        }

                    }, function error(){

                        reject( { success: false, data: [] } );

                    } );
                } );
            },

            /**
             * Get bands catalog
             * @param {string} type - Person type key
             * @return {object}
             */
            getBandsCatalog: function( type ){

                 return $q( function( resolve, reject ){
                    $http( {
                        method: 'GET',
                        url: URLS.getBandsCatalog + type,
                        params: {
                            language: 'SPA'
                        }
                    } ).then( function success( response ){

                        if ( typeof response !== 'undefined' && response.data.outCommonHeader.result.result === 1 ) {
                            resolve( { success: true, data: response.data.outBondMarketBandsProspectQuery.band, topic: 'bandsCatalog' } );
                            //resolve( { success: true, data: [], topic: 'bandsCatalog' } );
                        } else {
                            reject( { success: false, data: [] } );
                        }

                    }, function error(){

                        reject( { success: false, data: [] } );

                    } );
                } );
            },

            /**
             * Get issuers catalog
             * @param {string} type - Person type key
             * @return {object}
             */
            getIssuersCatalog: function( type ){

                 return $q( function( resolve, reject ){
                    $http( {
                        method: 'GET',
                        url: URLS.getIssuersCatalog + type,
                        params: {
                            language: 'SPA'
                        }
                    } ).then( function success( response ){

                        if ( typeof response !== 'undefined' && response.data.outCommonHeader.result.result === 1 ) {
                            resolve( { success: true, data: response.data.outBondMarketIssuerProspectQuery.issuer, topic: 'issuersCatalog' } );
                        } else {
                            reject( { success: false, data: [] } );
                        }

                    }, function error(){

                        reject( { success: false, data: [] } );

                    } );
                } );
            },

            getDerivativesCatalog: function( type ){

                return $q( function( resolve, reject ){
                   $http( {
                       method: 'GET',
                       url: URLS.getDerivativesAsr ,
                       params: {
                           language: 'SPA'
                       }
                   } ).then(function(response) {

                       if ( typeof response !== 'undefined'  ) {
                           var data  = response.data;
                           resolve( { success: true, data: data, topic: 'derivatives' } );
                       } else {
                           reject( { success: false, data: [] } );
                       }

                   }, function error(){

                       reject( { success: false, data: [] } );

                   } );
               } );
           },


            /**
             * Get all issuers information
             * @return {object}
             */
            getAllIssuers: function(){

                 return $q( function( resolve, reject ){
                    $http( {
                        method: 'GET',
                        url: URLS.getAllIssuers,
                        params: {
                            language: 'SPA'
                        }
                    } ).then( function success( response ){

                        if ( typeof response !== 'undefined' && response.data.outCommonHeader.result.result === 1 ) {
                            resolve( { success: true, data: response.data.outClientIssuersMarketInfoQuery.marketDataTuple, topic: 'issuers' } );
                        } else {
                            reject( { success: false, data: [] } );
                        }

                    }, function error(){

                        reject( { success: false, data: [] } );

                    } );
                } );
            },

            /**
             * Get favorites information
             * @return {object}
             */
            getFavorites: function(){

                 return $q( function( resolve, reject ){
                    $http( {
                        method: 'GET',
                        url: URLS.getFavoritesAsr,
                        params: {
                            language: 'SPA'
                        }
                    } ).then( function success( response ){

                        if ( typeof response !== 'undefined' && response.data.status === 1 ) {
                            resolve( { success: true, data: response.data.result, topic: 'favorites' } );
                        } else {
                            reject( { success: false, data: [] } );
                        }

                    }, function error(){

                        reject( { success: false, data: [] } );

                    } );
                } );
            },

            /**
             * Get classification favorites information
             * @return {object}
             */
            getClassificationFav: function(){

                return $q( function( resolve, reject ){
                   $http( {
                       method: 'GET',
                       url: URLS.getClassificationFav,
                       params: {
                           language: 'SPA'
                       }
                   } ).then( function success( response ){

                       if ( typeof response !== 'undefined' && response.data.status === 1 ) {
                           resolve( { success: true, data: response.data.result, topic: 'classificationFav' } );
                       } else {
                           reject( { success: false, data: [] } );
                       }

                   }, function error(){

                       reject( { success: false, data: [] } );

                   } );
               } );
           },

            /**
             * Post proposal document
             * @param {object} info - Array with all information to post inside proposal
             * @return  {object}
             */
            doProposal: function( info ){

                return $q( function( resolve, reject ){
                    csrfSrv.csrfValidate()
                    .then(successCsrf)
                    .catch(errorCsrf);

                    function successCsrf(){
                        $http( {
                            method: 'POST',
                            url: URLS.doProposal,
                            data: (info),
                    } ).then( function success( response ){

                        if ( typeof response !== 'undefined' && response.data.status === 1 ) {
                            resolve( { success: true } );
                        } else {
                            reject( { success: false } );
                        }

                    } );
                    }

                    function errorCsrf(error){
                        reject( error);

                    }




                } );
            },

            generaReportePropuesta: function( model ){                
                return $q( function( resolve, reject ){
                    csrfSrv.csrfValidate()
                    .then(successCsrf)
                    .catch(errorCsrf);

                    function successCsrf(){
                        $http( {
                            method: 'POST',
                            url: URLS.getCustomerProposal,
                            data: $.param(model),
                            responseType: 'arraybuffer'
                    } ).then(function (response) {
                        resolve(response);                      
                    }).catch(function(error){
                        console.error(error);
                        reject(error);
                    });
                    }

                    function errorCsrf(error){
                        reject( error);

                    }
                } );
            }




        };

        return obj;

    }

    angular
    	.module( 'actinver.controllers' )
        .service( 'proposalsProposalSrv', proposalsProposalSrv );

})();