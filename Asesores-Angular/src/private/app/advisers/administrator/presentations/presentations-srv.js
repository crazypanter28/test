(function() {
    "use strict";

    function PresentationsAdminSrv( URLS, $q, $http, ErrorMessagesSrv, csrfSrv ) {
        /**
         *  prospect service
         */
        function Presentations(){}

        Presentations.prototype.getTypes = function () {
            return $q(function( resolve, reject ){
                $http({
                    method: 'GET',
                    url: URLS.getTypes,
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
                .catch(reject);
            });
        };

        Presentations.prototype.getPresentationSubTypes = function () {
            return $q(function( resolve, reject ){
                $http({
                    method: 'GET',
                    url: URLS.getPresentationSubTypes,
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
                .catch(reject);
            });
        };

        Presentations.prototype.getPresentationSubTypesByClassification = function ( _id ) {
            return $q(function( resolve, reject ){
                $http({
                    method: 'GET',
                    url: URLS.getPresentationSubTypesByClassification + _id,
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
                });
            });
        };

        Presentations.prototype.getPresentationsByType = function ( _id ) {
            return $q(function( resolve, reject ){
                $http({
                    method: 'GET',
                    url: URLS.getPresentationsByType+ _id,
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
                });
                
            });
        };

        Presentations.prototype.savePresentation = function ( _presentation ) {
            return $q(function( resolve, reject ){

                csrfSrv.csrfValidate()
                .then(successCsrf)
                .catch(errorCsrf);

                function successCsrf(){
                    var url = '',
                        type = '',
                        parametersSubmit = {
                            name:_presentation.name,
                            language: 'SPA'
                        };

                    if( _presentation.clasification ){
                        type = 'add';
                        url = URLS.savePresentation;
                        parametersSubmit.idPresentationType = _presentation.clasification.idPresentationType;
                        parametersSubmit.idPresentationSubType = _presentation.subClasification.idPresentationSubType;
                    } else {
                        type = 'edit';
                        url = URLS.updateNamePresentation;
                        parametersSubmit.idPresentation = _presentation.idPresentation;
                    }

                    $http({
                        method: 'POST',
                        url: url,
                        data: $.param(parametersSubmit)
                    }).then(function( response ) {
                        if ( typeof response !== 'undefined' && response.data.status === 1 ) {
                            resolve( { success: true, data: ( response.data.result ) ? response.data.result : _presentation.idPresentation, params: parametersSubmit, type: type } );
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

        Presentations.prototype.saveClasification = function ( _clas ) {
            return $q(function( resolve, reject ){

                csrfSrv.csrfValidate()
                .then(successCsrf)
                .catch(errorCsrf);

                function successCsrf(){

                    var parametersSubmit = {
                        classification: _clas.name,
                        language: 'SPA'
                    };
                    $http({
                        method: 'POST',
                        url: URLS.saveClasification,
                        data: $.param(parametersSubmit)
                    }).then(function(response) {

                        if ( typeof response !== 'undefined' && response.data.status === 1 ) {
                            resolve( { success: true, data: true } );
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

        Presentations.prototype.saveSubClasification = function ( _subclas, _idclas ) {
            return $q(function( resolve, reject ){

                csrfSrv.csrfValidate()
                .then(successCsrf)
                .catch(errorCsrf);

                function successCsrf(){
                    var parametersSubmit = {
                        idPresentationType : _idclas,
                        description: _subclas.name,
                        language: 'SPA'
                    };
                    $http({
                        method: 'POST',
                        url: URLS.saveSubClasification,
                        data: $.param(parametersSubmit)
                    }).then(function(response) {
                        if ( typeof response !== 'undefined' && response.data.status === 1 ) {
                            resolve( { success: true, data: true } );
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

        Presentations.prototype.updateFile = function ( idPresentation, idPresentationSubType, file, idPresentationType ) {
            return $q( function( resolve, reject ){
                csrfSrv.csrfValidate()
                    .then(successCsrf)
                    .catch(errorCsrf);

                function successCsrf(){
                    file.url = URLS.updatePresentationImg;
                    file.alias = 'file';
                    file.formData.push( { idPresentation: idPresentation } );
                    if( idPresentationSubType ){
                        file.formData.push( { idPresentationSubType: idPresentationSubType } );
                    }
                    file.formData.push( { language: 'SPA' } );
                    file.formData.push( { idPresentationType: idPresentationType } );
                    file.upload();
                    file.onSuccess = function( msg ){
                        resolve( { success: true, data: msg } );
                    };
                    file.onError = function(){
                        resolve( { success: false, data: null } );
                    };
                }

                function errorCsrf(error){
                    reject(error);
                }
            });
        };

        Presentations.prototype.updateNamePresentation = function ( _presentation ) {
            return $q(function( resolve, reject ){

                csrfSrv.csrfValidate()
                .then(successCsrf)
                .catch(errorCsrf);

                function successCsrf(){
                    var parametersSubmit = {
                        idPresentation:_presentation.idPresentation,
                        file:'',
                        idPresentationSubType:_presentation.idPresentationSubType,
                        language: 'SPA'
                    };
                    $http({
                        method: 'POST',
                        url: URLS.updateNamePresentation,
                        data: $.param(parametersSubmit)
                    }).then(function(response) {
                        if( !!response.data.status ){
                            resolve( response.data.result );
                        }else{
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

        Presentations.prototype.deletePresentation = function ( _id ) {
            return $q(function( resolve, reject ){

                csrfSrv.csrfValidate()
                .then(successCsrf)
                .catch(errorCsrf);

                function successCsrf(){
                    var parametersSubmit = {
                        idPresentation:_id,
                        language: 'SPA'
                    };
                    $http({
                        method: 'POST',
                        url: URLS.deletePresentation,
                        data: $.param(parametersSubmit)
                    }).then(function(response) {
                        if( !!response.data.status ){
                            resolve( response.data.result );
                        }else{
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

        return new Presentations();
    }

    angular.module('actinver.services')
        .service('PresentationsAdminSrv', PresentationsAdminSrv);
})();
