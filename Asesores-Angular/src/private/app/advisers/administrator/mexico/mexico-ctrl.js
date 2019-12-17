( function(){
    "use strict";

    function mexicoCtrl( MexicoSrv, NgTableParams, CommonModalsSrv ){
        var vm = this;
        vm.table ={
            headers:[],
            body:[]
        };

        function setup () {
            getLocalForecasts();
        }

        function getLocalForecasts () {
            vm.table.headers =[];
            vm.table.body =[];                            
            vm.loadingEE = true;
            MexicoSrv.getLocalForecasts().then(function( _res ){
                vm.table.headers.push({name:"México", originalName:"indicador"});
                if(_res && _res.length > 0){                    
                    _res.forEach(function(row, indice){                       
                        for(var key in row){
                            var value;
                            if(indice == 0){
                                if(key.toString().length === 5 ){
                                    value = key.toString().replace("a","");
                                    vm.table.headers.push({name:value, originalName:key});
                                }
                            }                                                     
                        }
                    });
                }
                vm.table.body = _res;                           
            })
            .finally( function(){
                vm.loadingEE = false;
            });
        }


        vm.saveCSV = function(){
            MexicoSrv.saveCSV( vm.csv ).then(function(){
                CommonModalsSrv.done( 'El CSV se a guardado de manera exitosa.' );
                vm.csv = '';
                getLocalForecasts();
            });
        };

        setup();
    }


    angular.module('actinver.controllers')
    .controller('mexicoCtrl', mexicoCtrl );

})();
