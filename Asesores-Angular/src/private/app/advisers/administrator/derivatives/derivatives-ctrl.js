(function () {
    "use strict";

    function derivativesCtrl(userConfig, MessagesSrv, CommonModalsSrv,modalActivity,$uibModal, administratorModalsSrv, derivativesSrv) {
        var vm = this;
        vm.table ={
            headers:[],
            body:[]
        };

      

        function setup () {
            getDerivatives();
        }

        function getDerivatives(){
            vm.table.headers =[];
            vm.table.body =[];   
            vm.loadingDer = true;
            derivativesSrv.getDerivatives().then(function(_res){            
                vm.table.headers.push({name:"Nota", originalName:"nota"});
                if(_res && _res.length > 0){                 
                    _res.forEach(function(row, indice){                            
                        for(var key in row){
                            var value;
                            if(indice == 0){
                                if(key.toString() !== "nota" ){
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
                vm.loadingDer = false;
            });
        }

        vm.saveCSV = function(){
            derivativesSrv.saveCSV( vm.csv ).then(function(){
                CommonModalsSrv.done( 'El CSV se a guardado de manera exitosa.' );
                vm.csv = '';
                getDerivatives();
            });
        };


        setup();
    
    };

   
    angular.module('actinver.controllers')
        .controller('derivativesCtrl', derivativesCtrl);
})();
