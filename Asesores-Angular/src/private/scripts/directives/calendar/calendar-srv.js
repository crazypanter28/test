(function() {
    'use strict';

    function CalendarSrv( $http, URLS, $q, ErrorMessagesSrv ) {

        var urls = {
            BirthDays: URLS.getBirthDays,
            messages: URLS.getCurrentMessages,
        };
        /**
        *  Calendar
        */
        function Calendar(){}

        Calendar.prototype.getMessages = function ( _type, _id ) {
            return $q(function( resolve, reject ){

                $http({
                    method: 'GET',
                    url: urls[_type] + _id,
                    params:{
                        language:'SPA'
                    },
                    ignoreLoadingBar: true
                })
                .then( function( _res){
                    if( _res.data.status === 1){
                        resolve(
                            _res.data.result
                        );
                    }
                    else{
                        reject(

                        );
                    }
                });
            });
        };

        Calendar.prototype.getAppointments = function ( _model ) {
            return $q(function( resolve, reject ){

                $http({
                    method: 'POST',
                    url: URLS.getAppointments,
                    ignoreLoadingBar: true,
                    params:{
                        language: 'SPA'
                    },
                    data: $.param(_model)
                })
                .then( function( _res){
                    if( _res.data.status === 1){
                        resolve(
                            _res.data.result
                        );
                    }
                    else{
                        reject();
                    }
                }).catch( function () {
                    reject ( { error : 'Ha ocurrido un error' } );
                });
            });
        };

        Calendar.prototype.getMessageDetail = function(idEmployee,idMessage){
            return $q(function(resolve,reject){
                $http({
                    method:'POST',
                    url:URLS.getMessageDetail,
                    params:{
                        language:'SPA'
                    },
                    data:$.param({
                        idEmployee:idEmployee,
                        idMessage:idMessage
                    })
                }).then(function(response){
                    if(response.data.status===1){
                        resolve(response.data.result[0]);
                    }
                    else{
                        ErrorMessagesSrv(response.data.messages);
                        reject();                        
                    }
                }).catch(reject);
            });
        };

        Calendar.prototype.getClientDetail = function(contract, origen ){
            var parametros = null;
                
            if(origen === "CB"){ //tipo casa
                parametros='?bankingArea=998&clientNumber=&contractNumber='+contract +'&descripcion=&language=SPA&titularFlag=true&typeQuery=2';
            }else if(origen === "BANCO"){//tipo banco
                parametros='?bankingArea=999&clientNumber=&contractNumber='+contract +'&descripcion=&language=SPA&titularFlag=true&typeQuery=2';
            }              
            
            return $http.get( URLS.getClientInfo+ parametros )
            .then( function ( _response ) {

                    if ( typeof _response !== 'undefined' && _response.data.outCommonHeader.result.result === 1 ) {
                        return _response && _response.data;
                    } else {
                        return _response.data;
                    }
                }, function error(){
                    reject( {success: false, data:[], msg:'Se encontró un error favor de intentarlo más tarde, comuníquese con su help desk'} );
                });
          };
          
        return new Calendar();
    }

    angular
        .module( 'actinver.services' )
        .service( 'CalendarSrv', CalendarSrv ) ;

})();
