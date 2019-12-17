(function() {
    "use strict";

    function ErrorMessagesSrv ( CommonModalsSrv ) {

        function ErrorMessages( _model ){
            var error = R.find( function( _val ){
                if( _val.responseType === 'N' ){
                    return _val.responseCategory === 'FATAL' || _val.responseCategory === 'ERROR';
                }
            } )( _model );

            var message = error ? error.responseMessage : 'Se Encontró Un Error Favor De Intentarlo Más Tarde, Comuníquese Con Su Help desk';

            CommonModalsSrv.error( message );
        }


        return ErrorMessages;
    }
    angular.module('actinver.services')
        .service( 'ErrorMessagesSrv', ErrorMessagesSrv );
})();
