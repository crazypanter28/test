( function(){
    "use strict";

    function prospectsProfileCtrl( binnacleInfo, prospectModalsSrv, NgTableParams, prospectSrv, $stateParams, userConfig, CommonModalsSrv ){
        var vm = this;
        var userID = userConfig.user.employeeID;


        function setup(){
            setUser();
            //getGraphics();
          getStages();
        }

        vm.addOpportunity = function(){
            prospectModalsSrv.addOpportunity().result.then(function(){
                CommonModalsSrv.done( 'La oportunidad se ha guardado de manera exitosa.' );
                getStages();
            });
        };

        vm.filterStage = function(){
            var term = vm.fieldSearch;
            vm.configTable.filter({ $: term});
        };

        vm.changeStage = function( _stage ){
            if( angular.isObject( _stage ) ){
                vm.typeStage= 'stage' + _stage.idStage;
            }
            else{
                vm.typeStage= _stage;
            }
            setTableStage();
        };

        vm.changeDate = function( _calendar ){
            vm.selectedReport = _calendar;
        };

        vm.getReport = function() {
            vm.loadingReports = true;
            prospectSrv.getProsReports( vm.reportDate, vm.reportType, userID ).then(function(_res){
                vm.prospectsReport = _res;
                vm.selectedReport = _res.calendar[0];
                vm.loadingReports = false;
            });
        };

        vm.downloadPDF = function(){
            prospectSrv.downloadPDF();
        };

        function setUser() {
            if( $stateParams.id ){
                userID= $stateParams.id ;
                vm.sectionForAdmin = true;
            }

            vm.dateOptions = {
                minMode: 'month'
            };
            vm.reportType = 'mes';
        }

        function setStagesCategories( _table ){
            var table = _table;
            var name;
            vm.stagesCat = [];
            R.forEach(function( _stage ){
                name = 'stage' + _stage.idStage;
                vm.stagesCat[name] = R.filter(function(  _prospect  ){
                    return _prospect.idStage === _stage.idStage;
                }, table );
            },vm.stages);
            vm.typeStage = 'stage7';
            setTableStage();
        }

        function setTableStage() {
            var term = angular.copy(vm.typeStage);
            var defaults = {
                    page: 1,
                    count: 10,
                };
                vm.configTable = new NgTableParams( defaults, {
                    paginationMaxBlocks: 4,
                    paginationMinBlocks: 2,
                    dataset: vm.stagesCat[term],
                });
        }


        function getListByEmployee(){
            vm.loadingStage = true;
            prospectSrv.getListByEmployee( userID ).then(function( _dataTable ){
                setStagesCategories( _dataTable );
                vm.stagesTable = _dataTable;
                vm.loadingStage = false;
            }).catch(function () {
                vm.loadingStage = false;
            });
        }

        function getStages(){
            prospectSrv.getStages().then(function( _stages ){
                vm.stages = _stages;
                getListByEmployee();
            });
        }

        /* //Aun no hay servicios para esta funcion
        function getGraphics(){
            console.log('my-profile-ctrl.js');
            prospectSrv.getPrincipalgraphics( 1, 0, userID).then(function( _res ){
                vm.adviserDetails = {
                    "ammount": _res.ammount,
                    "name": _res.name
                };

                vm.details1 = prospectSrv.generateDataChart(_res.money);
                vm.details2 = prospectSrv.generateDataChart(_res.funds);
                vm.details3 = prospectSrv.generateDataChart(_res.credit , true);
                vm.details4 = prospectSrv.generateDataChart(_res.seguros, true);

                vm.totalProspects = vm.details3.chart.percentage + vm.details4.chart.percentage;
                vm.remainingProspects = vm.details3.remaining + vm.details4.remaining;
                vm.customersContacted = _res.customersContacted;
            });
        }*/

        vm.contactedClient = function(element){
            //CommonModalsSrv.warning('¿Estás seguro de eliminar la emisora?')
            CommonModalsSrv.warning('¿Confirma que se ha contactado a ' + element.nameOpportunity)
            .result.then(function () {
                prospectSrv.updateContacted(element.idOpportunity).then(function( _result ){
                    getListByEmployee();
                });

                
            }).catch(function (res) {
                if (!(res === 'cancel' || res === 'escape key press' || res === 'backdrop click')) {
                    throw res;
                }
            });

            
        };

        setup();

    }

    angular
        .module( 'actinver.controllers' )
        .controller( 'prospectsProfileCtrl', prospectsProfileCtrl );

})();
