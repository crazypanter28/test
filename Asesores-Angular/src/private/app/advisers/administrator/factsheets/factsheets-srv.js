(function() {
    "use strict";

    function FactsheetsSrv( URLS, $q, $http, ErrorMessagesSrv ,csrfSrv) {

        /**
         *  prospect service
         */
        function Factsheets(){}

        Factsheets.prototype.getClassifications = function () {
            return $q(function( resolve, reject ){
                $http({
                    method: 'GET',
                    url: URLS.getClassifications,
                    params:{
                        language: 'SPA'
                    }
                }).then(function(response) {
                    if( !!response.data.status ){
                        resolve( response.data.result );
                    }
                    else{
                        ErrorMessagesSrv( response.data.messages );
                        reject();
                    }
                })
                .catch( reject );
            });
        };

        Factsheets.prototype.getProductsByClassification = function ( _id ) {
            return $q(function( resolve, reject ){
                $http({
                    method: 'GET',
                    url: URLS.getProductsByClassification + _id,
                    params:{
                        language: 'SPA'
                    }
                }).then(function(response) {
                    if( !!response.data.status ){
                        resolve( response.data.result );
                    }
                    else{
                        ErrorMessagesSrv( response.data.messages );
                        reject();
                    }
                })
                .catch( reject );
            });
        };

        Factsheets.prototype.doFactsheet = function( info ){
            return $q( function( resolve, reject ){

                csrfSrv.csrfValidate()
                    .then(successCsrf)
                    .catch(errorCsrf);

                function successCsrf(){
                    var type = '',
                        url = '',
                        params = {
                            name: info.name,
                            language: 'SPA'
                        };

                    if( !info.idProduct ){
                        type = 'add';
                        url = URLS.doFactsheet;
                        params.idClassification = info.clasification.idClassification;
                    } else {
                        type = 'edit';
                        url = URLS.updateFactsheetProduct;
                        params.idProduct = info.idProduct;
                    }

                    $http( {
                        method: 'POST',
                        url: url,
                        params: params,
                    } ).then( function( response ) {

                        if ( typeof response !== 'undefined' && response.data.status === 1 ) {
                            resolve( { success: true, data: ( response.data.result ) ? response.data.result : info.idProduct, type: type } );
                        } else {
                            resolve( { success: false, data: null } );
                        }

                    });

                }

                function errorCsrf(error){
                    reject(error);
                }
            });
        };

        Factsheets.prototype.updateImg = function ( idProduct, file ) {
            return $q( function( resolve, reject ){

                csrfSrv.csrfValidate()
                    .then(successCsrf)
                    .catch(errorCsrf);

                function successCsrf(){
                    file.url = URLS.updateFactsheetImg;
                    file.alias = 'image';
                    file.formData.push( { idProduct: idProduct } );
                    file.formData.push( { language: 'SPA' } );
                    file.upload();
                    file.onSuccess = function( msg ){
                        resolve( { success: true, data: msg } );
                    };
                    file.onError = function( msg ){
                        resolve( { success: false, data: msg } );
                    };
                }

                function errorCsrf(error){
                    reject(error);
                }
            });
        };

        Factsheets.prototype.removeClassifications = function ( _id ) {
            return $q(function( resolve, reject ){

                /**Token de seguridad */
                  csrfSrv.csrfValidate().
                        then(successCsrf).
                        catch(errorCsrf);

                function successCsrf(){
                        $http({
                            method: 'POST',
                            url: URLS.deleteProduct,
                            data: $.param({idProduct:_id,language: 'SPA'})
                        }).then(function(response) {
                            if( !!response.data.status ){
                                resolve( response.data.result );
                            }
                            else{
                                ErrorMessagesSrv( response.data.messages );
                                reject();
                            }
                        });
                        }

                    function errorCsrf(error){
                            reject(error);
                    }

                    });

        };

        return new Factsheets();
    }

    angular.module('actinver.services')
        .service('FactsheetsSrv', FactsheetsSrv);
})();
