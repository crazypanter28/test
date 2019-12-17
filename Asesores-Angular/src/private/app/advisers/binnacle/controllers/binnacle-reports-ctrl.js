( function(){
    "use strict";

    function binnacleReportsCtrl( Auth, $scope, $state, $stateParams, binnacleReportsSrv ,$rootScope){
        var vm = this,
            adviser = {
                adviser: $scope.binnacle.sadviser,
            };

            vm.estado=0;
            vm.action=0;
            vm.employee;
            vm.idCliente;
            vm.typeSelect;
            vm.adviser;
            vm.name;
            vm.adviserList=[];
            vm.nombreAsesor="";
        
        function inicializar() {
            vm.nombreAsesor = $scope.binnacle.sadviser.name;
            vm.idEmpleado = $scope.binnacle.sadviser.employeeID;
            vm.filters = { };
            vm.filters.advisers = 'profile';
            vm.getType('profile');
        }        

        function showSelectedInfo( type, filters, user_id ){

            if(type === "profile"){
                adviser.show_info = user_id;
                vm.idCliente=user_id;
            }else if(type === "advisers"){
                 //si tiene estado
                $scope.adviser = {
                    id: $stateParams.id
                };
                //implementar storages
                var storageList = $rootScope.adviserList;
                if(parseInt($stateParams.estado) !== 0){
                    vm.estado = parseInt($stateParams.estado);
                }

                if(storageList){      
                    if( $stateParams.action === '2'){//siguiente
                        $rootScope.adviserList[vm.estado]={id:$stateParams.id,name:$stateParams.employee};
                        vm.idCliente=$stateParams.id;
                        vm.name = $stateParams.employee;
                    }else if( $stateParams.action === '1'){//atras
                        $rootScope.adviserList[vm.estado]=$rootScope.adviserList[vm.estado];
                        vm.idCliente=$rootScope.adviserList[vm.estado].id;
                        vm.name = $rootScope.adviserList[vm.estado].name;
                    }                    
                    adviser.show_info =  vm.idCliente;
                }else{
                    $rootScope.adviserList=[];
                    //caso del padre envia el de session
                   // adviser.show_info = "97781";//user_id;
                   // vm.idCliente="97781";//user_id;
                    adviser.show_info = user_id;
                    vm.idCliente=user_id;

                }
            }
           

            adviser.type = type;
            adviser.filter=filters;
            vm.selected_type = true;
            vm.getInfo( adviser );
        }

        vm.changeAdviser = function (record) {
            vm.idEmpleado = record.employeeID;
            vm.nombreAsesor = record.name;
            vm.filters = {};
            vm.filters.advisers = 'profile';
            vm.getType('profile');
        };

        vm.getType = function(type){

           vm.typeSelect=type;     
           if(type === "profile"){
                showSelectedInfo( type, [ 'single' ], vm.idEmpleado );
            }else if(type === "advisers"){
                showSelectedInfo( type, [ 'advisers' ],  vm.idEmpleado );
            }

        };

        vm.getInfo = function( adviser ){
            vm.finish = false;
            vm.reports_info = false;
            vm.adviser= adviser ;
            binnacleReportsSrv.getInfo( adviser )
                .then( function successCallback( response ){
                    vm.reports_info = {
                        chart: response.data                        
                    };
                    vm.advisers_range = false;
                    vm.advisers = false;
                    vm.finish = true;
                }, function errorCallback(){
                    vm.finish = true;
                } );
        };

        vm.showAdvisersInfo = function( range,mes,anio ){
            vm.advisers_range = range;
            vm.advisers = false;
            var fecha=null;
            var mesTemp=parseInt(mes);

            if(mesTemp < 10){
                fecha='0'+mes+'/'+anio;
            }else{
                fecha=mes+'/'+anio;
            }

            binnacleReportsSrv.getAdvisersInfo( vm.idCliente, fecha )
                .then( function successCallback( response ){
                    vm.advisers = response.data;
                }, function errorCallback(){
                    vm.advisers = [];
                } );
        };

        vm.showAdviserResume = function(){
            showSelectedInfo( 'advisers', [ 'advisers' ], $stateParams.id );
        };
        
        inicializar();
    }

    angular
        .module( 'actinver.controllers' )
        .controller( 'binnacleReportsCtrl', binnacleReportsCtrl );

})();