( function(){
    'use strict';

    function pResumeCtrl( $scope, $q, CommonModalsSrv, pResumeSrv, $sessionStorage ){
        var vm = this,
//            resume_reqs = [],
            resume_mock = $scope.portfolio.topics;
        vm.clientNumber = $sessionStorage.sclient.data.clientNumber;
        vm.topics = resume_mock;
        // Get resume by contract
        pResumeSrv.getContractResume(  vm.clientNumber   ).then( function( contracts ) {


            vm.exchange_rates = [];
            vm.portfolio_totals = 0;
            vm.portfolio_totals = contracts.data.result.totalValue;
            var _mn = contracts.data.result.positionHouseMN;
            var _eur = contracts.data.result.positionHouseEUR;
            var _dlls = contracts.data.result.positionHouseDLLS;
            var _percent = contracts.data.result.positionHousePercentage;
            vm.totlaMXN = _mn.totalFinal;
            vm.totalDLL = _dlls.totalFinal;
            vm.totalEUR = _eur.totalFinal;
            vm.exchangeRateDLL = _dlls.exchangeRate;
            vm.exchangeRateEUR = _eur.exchangeRate;

            var _tablePortafolio = [
                {"topic": "totalSD", "name": "Fondos de Deuda", "nom": "SD", "abbr": "FD", "totalDebtInstruments": 0, "percent": 0},
                {"topic": "totalSI", "name": "Fondos de Renta Variable", "nom": "SI", "abbr": "RV", "totalPledgedValues": 0, "percent": 0},
                {"topic": "totalSC", "name": "Fondos de Cobertura", "nom": "SC", "abbr": "FC", "notDefined2": 0, "percent": 0},
                {"topic": "totalMD", "name": "Mercado de Dinero", "nom": "MD", "abbr": "MD", "notDefined": 0, "percent": 0},
                {"topic": "totalMC", "name": "Mercado de Capitales", "nom": "MC", "abbr": "MC", "totalCapitalInstruments": 0, "percent": 0},
                {"topic": "totalSettlementOperations", "name": "Pendientes por Liquidar", "nom": "OL", "abbr": "OL", "totalSettlementOperations": 0, "percent": 0},
                {"topic": "totalBlockedBalance", "name": "Efectivo en Tránsito", "nom": "ET", "abbr": "ET", "totalBlockedBalance": 0, "percent": 0},
                {"topic": "totalCash", "name": "Efectivo", "nom": "EF", "abbr": "EF", "totalCash": 0, "percent": 0},
                {"topic": "totalPortfolioValue", "totalPortfolioValue": 0},
            ];

            angular.forEach( _tablePortafolio, function ( item, key ) {
                _tablePortafolio [ key ].mn =  _mn [item.topic];
                _tablePortafolio [ key ].eur =  _eur [item.topic];
                _tablePortafolio [ key ].dlls =  _dlls [item.topic];
                _tablePortafolio [ key ].percent = _percent [item.topic];
            } );
            vm.portfolioTable = _tablePortafolio;
            vm.chart_info = {
                chart:  pResumeSrv.setChartInfo(vm.portfolioTable)
            };

        }, function errorCallback( info ){
                var message;
                if( info.type === 'not-found' ){
                    $scope.operations.showSystemError();
                } else {
                    vm.portfolio_totals = 0;
                    message = info.result ? info.result : 'Se Encontró Un Error Favor De Intentarlo Más Tarde';
                    CommonModalsSrv.error( message );
                }
            } );
    }

    angular
        .module( 'actinver.controllers' )
        .controller( 'pResumeCtrl', pResumeCtrl );

})();
