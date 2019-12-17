(function () {
    "use strict";

    function addProspect(URLS, $http, $q, csrfSrv, $filter, ErrorMessagesSrv, $sessionStorage) {
        
        var user = JSON.parse($sessionStorage.user);

        return {
            setOpportunity: setOpportunity,
            getStrategy: getStrategy,
            getSegment : getSegment
        };

        function setOpportunity(_opportunity, _activity) {
            return $q(function (resolve, reject) {

                csrfSrv.csrfValidate()
                    .then(successCsrf)
                    .catch(errorCsrf);

                function successCsrf() {

                    //var closeDate = $filter('date')(_prospect.closeDate, 'yyyy-MM-dd');
                    var idStage;
                    var comment='';
                    var clientNumber;
                    var segment;
                    if(_opportunity.strategy.idStrategy === 2){
                        idStage = 8;
                        comment = 'Se inicia como prospecto';
                        clientNumber = _opportunity.clientNumber;
                        segment = '';
                    }else {
                        idStage = 7;
                        comment = 'Se inicia como posibilidad';
                        clientNumber = 0;
                        segment = _opportunity.segment ? _opportunity.segment.segment : '';
                    }


                    var sendModel = {
                        nameOpportunity     : _opportunity.clientName,
                        idStrategy          : _opportunity.strategy.idStrategy,
                        phone               : _opportunity.phone,
                        mail                : _opportunity.email,
                        idStage             : idStage,
                        segment             : segment,
                        comment             : comment,
                        idEmployee          : user.employeeID,
                        clientNumber        : clientNumber,
                        language            : 'SPA'
                    };

                    
                    $http({
                        method: 'POST',
                        url: URLS.saveOpportunity,
                        data: $.param(sendModel)
                    }).then(function (response) {
                        if (response.data.status === 1) {
                            resolve({ success: true, data: response.data.messages[0].description });
                        }else {
                            resolve({ success: false, data: response.data.messages[0].description });
                        }
                    }).catch(function (error) {
                        ErrorMessagesSrv('Se encontró un error favor de intentarlo más tarde, comuníquese con su help desk');
                        reject({ error: error.data });
                    });
                }

                function errorCsrf(error) {
                    //reject( { success: false } );
                    reject(error);
                }

            });
        }


       function getStrategy(){

            return $q( function( resolve, reject ){
               $http( {
                   method: 'GET',
                   url: URLS.getStrategy,
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
       };

       function getSegment(){

        return $q( function( resolve, reject ){
           $http( {
               method: 'GET',
               url: URLS.getSegment,
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
   };
        
    }

    angular.module('actinver.services')
        .service('addProspectSrv', addProspect);
})();
