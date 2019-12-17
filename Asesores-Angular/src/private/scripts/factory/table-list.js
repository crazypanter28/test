( function() {
    "use strict";

    function tableList($resource, $log, $filter) {
        var obj = {};
        var vm = this;

        obj = {

            /**
             * Get resource information from certain URL
             * @param  {string}
             * @return  {function}
             */
            getResource: function(url){

                return $resource( url, {}, {
                        query: {
                            exclude : vm.exclude,
                            method: "GET",
                            ignoreLoadingBar: true
                        }
                    }
                );

            },

            /**
             * Get resource information from certain URL
             * @param {object} infoSettings - URL string or one data array.
             * @param {object} newParams - Set new parameters to returned table.
             * @param {object} newSettings - Set new settings to work with the table.
             * @see {@link http://ng-table.com|ngTable}
             * @return  {object}
             */
            tableSet: function(infoSettings, newParams, newSettings){
                var defaultParams = {
                        count: 7
                    },
                    defaultSettings = {
                        counts: []
                    },
                    initialParams, initialSettings;

                if(infoSettings.url || infoSettings.dataset){
                    //TODO omite error general en la peticiones
                    if(infoSettings.url.includes('consultarContratosPerfilVencer')){
                        vm.exclude=true;
                    }else if(infoSettings.url.includes('consultarContratosPerfilVencido')){
                        vm.exclude=true;
                    }else{
                        vm.exclude=false;
                    }

                    if(infoSettings.url){ 
                        defaultSettings.getData = function( params ){

                                        return obj.getResource( infoSettings.url ).query({


                                            language: 'SPA'
                                           
                                        }).$promise.then(function(data){

                                            if( data.result || data.contratosVencimientoTO ){
                                                var info = data.result || data.contratosVencimientoTO,
                                                    data_filtered = $filter( 'limitTo' )( info, 20 ),
                                                    ordered_data;

                                                // Information
                                                data.data = data_filtered;
                                                ordered_data = params.sorting() ? $filter( 'orderBy' )( data.data, params.orderBy() ) : data.data;
                                                params.total( ordered_data.length );
                                                data.data = ordered_data.slice( ( params.page() - 1 ) * params.count(), params.page() * params.count() );

                                            }  else {

                                                //data.total = 0;
                                                params.total(data.total);

                                            }

                                            if(data.data.constructor !== Array){
                                                data.data = [data.data];
                                            }

                                            if(params.total() === 0) {
                                                return {
                                                    loading: false,
                                                    validate: 'no-results'
                                                };
                                            }
                                           
                                            return data.data;

                                        }).catch(function(error){                                            
                                            
                                            $log.warn('Resource was not found',error);                                    
                                            return {
                                                loading: false,
                                                validate: 'error'
                                            };

                                        });

                                    };
      
                    } else {

                        defaultSettings.dataset = infoSettings.dataset;

                    }

                    // Set
                    initialParams = angular.merge({}, defaultParams, newParams);
                    initialSettings = angular.merge({}, defaultSettings, newSettings);

                    return {
                        loading: true,
                        initialParams: initialParams,
                        initialSettings: initialSettings
                    };

                } else {

                    $log.warn('You need to set a valid data resource');
                    return false;

                }
            }

        };

        return obj;

    }

    angular
        .module( 'actinver.services' )
        .factory( 'tableList', tableList );


})();
