( function(){
    "use strict";

    function prospectsTeamCtrl( binnacleInfo, prospectModalsSrv, NgTableParams, prospectSrv, $state, userConfig ){
        var vm = this;
        var userID = userConfig.user.employeeID;

        vm.typeUserF = function(){
            var type1 = vm.user.type ? 1: 0;  //advisers
            var type2 = vm.user.type2 ? 1: 0; //admin
            vm.loadingTeamGraph = true;
            prospectSrv.getPrincipalgraphics(  type1, type2, userID   ).then(function( _res ){
                vm.details1 =prospectSrv.generateDataChart(_res.money);
                vm.details2 =prospectSrv.generateDataChart(_res.funds);
                vm.details3 =prospectSrv.generateDataChart(_res.credit , true);
                vm.details4 =prospectSrv.generateDataChart(_res.seguros, true);

                vm.noResults = _res.money || _res.fuds || _res.credit || _res.seguros;

                vm.totalProspects = vm.details3.chart.percentage + vm.details4.chart.percentage;
                vm.remainingProspects = vm.details3.remaining + vm.details4.remaining;
                vm.customersContacted = _res.customersContacted;
                vm.loadingTeamGraph = false;
                vm.viewDetail = false;
            });
        };

        vm.detailStage = function( _item ) {
            vm.spinnerDetail = true;
            prospectSrv.getTableProspects(  _item ).then(function( _dataTable ){
                var initialParams = {
                    count: 5 // initial page size
                };
                var initialSettings = {
                    dataset: _dataTable,
                    paginationMaxBlocks: 4,
                    paginationMinBlocks: 2,
                };
                vm.configTable = new NgTableParams( initialParams, initialSettings);
                vm.spinnerDetail = false;
                vm.viewDetail = true;
            });
        };

        vm.setUser = function( _user ){
            vm.adviserProspect  = _user;
            $state.go('prospects.team.idTeam', {id:40});
        };

        vm.applySearch = function() {
            var term = vm.fieldSearch;
            vm.configTable.filter({ $: term });
        };

        vm.addProspect = function(){
            prospectModalsSrv.add();
        };

        vm.downloadPDF = function(){
            prospectSrv.downloadPDF();
        };

    }

    angular
        .module( 'actinver.controllers' )
        .controller( 'prospectsTeamCtrl', prospectsTeamCtrl );

})();
