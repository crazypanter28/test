( function(){
    'use strict';

    function portfolioCtrl( $sessionStorage, pResumeSrv ){
        var vm = this;
        var _clientId = $sessionStorage.sclient.data.clientNumber;
        // Portfolio topics
        vm.topics = [
            {"topic": "totalSD", "name": "Fondos de Deuda", "nom": "SD", "abbr": "FD", "totalDebtInstruments": 0, "percent": 0},
            {"topic": "totalSI", "name": "Fondos de Renta Variable", "nom": "SI", "abbr": "RV", "totalPledgedValues": 0, "percent": 0},
            {"topic": "totalMC", "name": "Mercado de Capitales", "nom": "MC", "abbr": "MC", "totalCapitalInstruments": 0, "percent": 0},
            {"topic": "totalMD", "name": "Mercado de Dinero", "nom": "MD", "abbr": "MD", "notDefined": 0, "percent": 0},
            {"topic": "totalSettlementOperations", "name": "Órdenes por Liquidar", "nom": "OL", "abbr": "OL", "totalSettlementOperations": 0, "percent": 0},
            {"topic": "totalCash", "name": "Efectivo", "nom": "EF", "abbr": "EF", "totalCash": 0, "percent": 0},
            {"topic": "totalDerivative", "name": "Derivados", "nom": "DV", "abbr": "DV", "notDefined2": 0, "percent": 0},
            {"topic": "totalPortfolioValue", "totalPortfolioValue": 0},
        ];

        // Credits
        vm.resume_credits = false;
         pResumeSrv.getCreditsList( _clientId )
            .then( function successCallback( response ){
                vm.resume_credits = response.data.result.outBankClientLoansQuery.currentLoans.bankLoan;
            }, function errorCallback(){
                vm.resume_credits = 'no-data';
            } );

        // Insurances
        vm.resume_insurances = false;
        /*pResumeSrv.getInsurancesList( _clientId )
            .then( function successCallback( response ){
                vm.resume_insurances = response.data.insurances;
            }, function errorCallback(){
                vm.resume_insurances = 'no-data';
            } );*/
    }

    angular
    	.module( 'actinver.controllers' )
        .controller( 'portfolioCtrl', portfolioCtrl );

})();