( function(){
    "use strict";

    function eeuuCtrl( EeuuSrv, NgTableParams, CommonModalsSrv ){
        var vm = this;
        vm.table ={
            headers:[],
            body:[]
        };
        
        function setup () {
            getGlobalForecasts();
        }

        function getGlobalForecasts(){
            vm.table.headers =[];
            vm.table.body =[];   
            vm.loadingEE = true;
            EeuuSrv.getGlobalForecasts().then(function(_res){                
                vm.table.headers.push({name:"Estados Unidos/ Global", originalName:"indicador"});
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
            EeuuSrv.saveCSV( vm.csv ).then(function(){
                CommonModalsSrv.done( 'El CSV se a guardado de manera exitosa.' );
                vm.csv = '';
                getGlobalForecasts();
            });
        };

        setup();
    }


    angular.module('actinver.controllers')
    .controller('eeuuCtrl', eeuuCtrl );

})();
