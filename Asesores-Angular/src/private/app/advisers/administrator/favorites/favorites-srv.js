(function() {
    "use strict";

    function FavAdminSrv( URLS, $q, $http, ErrorMessagesSrv, csrfSrv ) {
        /**
         *  prospect service
         */
        function Favorites(){}

        Favorites.prototype.saveFav = function ( _model ) {
            return $q(function( resolve, reject ){

                csrfSrv.csrfValidate()
                .then(successCsrf)
                .catch(errorCsrf);

                function successCsrf() {
                    var parametersSubmit = {
                        name:_model.issuerName, 
                        serie:_model.serie,
                        idClassification:_model.classification.idClassification,  
                        language: 'SPA'
                    };
                    $http({
                        method: 'POST',
                        url: URLS.saveFavorite,
                        data: $.param(parametersSubmit)
                    }).then(function (response) {
                        if (response.data.status === 1) {
                            resolve({ success: true, data: response.data.messages[0].description });
                        } else if (response.data.status === 2) {
                            resolve({ success: false, data: response.data.messages[0].description });
                        }
                    }).catch(function () {
                        ErrorMessagesSrv('Se encontró un error favor de intentarlo más tarde, comuníquese con su help desk');
                    });
                }

                function errorCsrf(error) {
                    reject(error);
                }

            });
        };

        Favorites.prototype.deleteClassFav = function(_model){
            return $q(function( resolve, reject ){

                csrfSrv.csrfValidate()
                .then(successCsrf)
                .catch(errorCsrf);

                function successCsrf() {
                    var parametersSubmit = {
                        idClassification:_model.classification.idClassification, 
                        language: 'SPA'
                    };
                    $http({
                        method: 'POST',
                        url: URLS.deleteClassificationFav,
                        data: $.param(parametersSubmit)
                    }).then(function (response) {
                        if (response.data.status === 1) {
                            resolve({ success: true, data: response.data.messages[0].description });
                        } else if (response.data.status === 2) {
                            resolve({ success: false, data: response.data.messages[0].description });
                        }
                    }).catch(function () {
                        ErrorMessagesSrv('Se encontró un error favor de intentarlo más tarde, comuníquese con su help desk');
                    });
                }

                function errorCsrf(error) {
                    reject(error);
                }

            });

        };

        Favorites.prototype.saveClassFav = function ( _model ) {
            return $q(function( resolve, reject ){

                csrfSrv.csrfValidate()
                .then(successCsrf)
                .catch(errorCsrf);

                function successCsrf() {
                    var parametersSubmit = {
                        nameClassification:_model.name, 
                        language: 'SPA'
                    };
                    $http({
                        method: 'POST',
                        url: URLS.saveClassificationFav,
                        data: $.param(parametersSubmit)
                    }).then(function (response) {
                        if (response.data.status === 1) {
                            resolve({ success: true, data: response.data.messages[0].description });
                        } else if (response.data.status === 2) {
                            resolve({ success: false, data: response.data.messages[0].description });
                        }
                    }).catch(function () {
                        ErrorMessagesSrv('Se encontró un error favor de intentarlo más tarde, comuníquese con su help desk');
                    });
                }

                function errorCsrf(error) {
                    reject(error);
                }

            });
        };

        Favorites.prototype.updateFav = function ( _model ) {
            return $q(function( resolve, reject ){
                csrfSrv.csrfValidate()
                .then(successCsrf)
                .catch(errorCsrf);

                function successCsrf() {
                    var parametersSubmit = {
                        idFavorite : _model.idFavorite,
                        name:_model.issuerName, 
                        serie:_model.serie,
                        idClassification:_model.classification.idClassification,  
                        language: 'SPA'
                    };
                    $http({
                        method: 'POST',
                        url: URLS.updateFavorite,
                        data: $.param(parametersSubmit)
                    }).then(function (response) {
                        if (response.data.status === 1) {
                            resolve({ success: true, data: response.data.messages[0].description });
                        } else if (response.data.status === 2) {
                            resolve({ success: false, data: response.data.messages[0].description });
                        }
                    }).catch(function () {
                        ErrorMessagesSrv('Se encontró un error favor de intentarlo más tarde, comuníquese con su help desk');
                    });
                }

                function errorCsrf(error) {
                    reject(error);
                }

            });
        };

        Favorites.prototype.removeFav = function ( _id ) {
            return $q(function( resolve, reject ){

                csrfSrv.csrfValidate()
                .then(successCsrf)
                .catch(errorCsrf);

                function successCsrf() {
                    var parametersSubmit = {
                        idFavorite:_id, 
                        language: 'SPA'
                    };
                    $http({
                        method: 'POST',
                        url: URLS.deleteFavorite,
                        data: $.param(parametersSubmit),
                    }).then(function (response) {
                        if (response.data.status === 1) {
                            resolve({ success: true, data: response.data.messages[0].description });
                        } else if (response.data.status === 2) {
                            resolve({ success: false, data: response.data.messages[0].description });
                        }
                    }).catch(function () {
                        ErrorMessagesSrv('Se encontró un error favor de intentarlo más tarde, comuníquese con su help desk');
                    });
                }
                    
                function errorCsrf(error) {
                    reject(error);
                }

            });
        };

        Favorites.prototype.getFavorites = function(){
            
                return $q( function( resolve, reject ){
                $http( {
                    method: 'GET',
                    url: URLS.getFavorites,
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
        };

        Favorites.prototype.getClassificationFavAdm = function(){

            return $q( function( resolve, reject ){
               $http( {
                   method: 'GET',
                   url: URLS.getClassificationFavAdm,
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
       };

        return new Favorites();
    }

    angular.module('actinver.services')
        .service('FavAdminSrv', FavAdminSrv);
})();
