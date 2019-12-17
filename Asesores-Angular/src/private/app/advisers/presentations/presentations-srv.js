
(function() {
    "use strict";

    function PresentationSrv( URLS, $q, $http, ErrorMessagesSrv,loginSrvc ) {
        /**
         *  prospect service
         */
        function Presentations(){}

        Presentations.prototype.getTypesAsr = function () {
            var url;

            return $q(function( resolve, reject ){
                loginSrvc.makeDataUser().then( function( _response){                    
                    for(var pos=0 ;pos< _response.user.scope.length; pos++) {
                        var _element= _response.user.scope[pos];
                            if (_element === 'ADMINISTRADOR') {
                                url=URLS.getTypes;
                                break;
                            }else if ( _element === 'ASESOR'){
                                url=URLS.getTypesAsr;
                                break;
                            } 
                    }
                             
                    $http({
                        method: 'GET',
                        url: url,
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
            });                     
        };

        Presentations.prototype.getPresentations = function ( _id ) {
            return $q(function( resolve, reject ){
                var url;
                loginSrvc.makeDataUser().then( function( _response){                    
                    for(var pos=0 ;pos< _response.user.scope.length; pos++) {
                        var _element= _response.user.scope[pos];
                            if (_element === 'ADMINISTRADOR') {
                                url=URLS.getPresentationsByType;
                                break;
                            }else if ( _element === 'ASESOR'){
                                url=URLS.getPresentations;
                                break;
                            } 
                    }
                    $http({
                        method: 'GET',
                        url: url + _id,    
                        params:{
                            language: 'SPA'
                        }
                    }).then(function(response) {
                        if( response.data.status === 1 ){
                            resolve( response.data.result );
                        }
                        else{
                            //reject( {error:null} );
                            reject();
                        }
                    });
                });    
            });
        };  

        Presentations.prototype.getPresentationsFile = function ( _id ) {
            return $q(function (resolve, reject) {
                var url;
                loginSrvc.makeDataUser().then( function( _response){                    
                    for(var pos=0 ;pos< _response.user.scope.length; pos++) {
                        var _element= _response.user.scope[pos];
                            if (_element === 'ADMINISTRADOR') {
                                url=URLS.getPresentationFileAdm;
                                break;
                            }else if ( _element === 'ASESOR'){
                                url=URLS.getPresentationFile;
                                break;
                            } 
                    }
                    $http({
                        method: 'GET',
                        url:    url + _id,
                        responseType: 'arraybuffer',
                        params: {
                            language: 'SPA'
                        }
                    }).then(function (response) {
                            var file = new Blob([response.data], {type: 'application/pdf'});
                            var fileURL = URL.createObjectURL(file);
                            window.open(fileURL,'_blank', 'Presentación');

                            resolve({ response: response.data });
                        }).catch(function (error) {
                            reject({ error: error.data });
                    });
                });        

            });
        };



        return new Presentations();
    }

    angular.module('actinver.services')
        .service('PresentationSrv', PresentationSrv);
})();
