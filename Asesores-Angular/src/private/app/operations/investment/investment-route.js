( function(){
    "use strict";

    function routerProviderConfig ( $stateProvider ){


        $stateProvider

            .state('investment', {
                templateUrl: '/app/operations/investment/investment.html',
                url: '/investment',
                controller: 'investmentCtrl',
                controllerAs: 'investment',
                parent: 'operations',
                data: {
                    needClient: true
                },
                ncyBreadcrumb: {
                  label: 'Inversiones',
                },
            })

            .state('investment.funds', {
                templateUrl: '/app/operations/investment/investment-society/funds.html',
                url: '/funds',
                controller: 'fundsCtrl',
                controllerAs: 'funds',
                data: {
                    needClient: true
                },
                ncyBreadcrumb: {
                  label: 'Fondos de inversión',
                },
            })

            .state('investment.capitals', {
                templateUrl: '/app/operations/investment/capitals/capitals.html',
                url: '/capitals',
                controller: 'capitalsCtrl',
                controllerAs: 'capitals',
                data: {
                    needClient: true
                },
                ncyBreadcrumb: {
                  label: 'Mercado de Capitales',
                },

            })

            .state('investment.money', {
                templateUrl: '/app/operations/investment/money/money.html',
                url: '/money',
                controller: 'moneyCtrl',
                controllerAs: 'money',
                data: {
                    needClient: true
                },
                ncyBreadcrumb: {
                  label: 'Mercado de Dinero',
                },
            })

            .state('investment.moneyBank',{
                templateUrl: '/app/operations/investment/money-bank/moneyBank.html',
                url: '/moneyBank',
                controller: 'moneyBankCtrl',
                controllerAs: 'moneyBank',
                data:{
                    needClient: true
                },
                ncyBreadcrumb:{
                    label: 'Mercado de Dinero',
                },
            })

            .state('investment.fundsBank', {
                templateUrl: '/app/operations/investment/investment-society-bank/fundsBank.html',
                url: '/fundsBank',
                controller: 'fundsBankCtrl',
                controllerAs: 'fundsBank',
                data: {
                    needClient: true
                },
                ncyBreadcrumb: {
                    label: 'Fondos de inversión',
                },
            })
            
            .state('investment.capitalsLumina', {
                templateUrl: '/app/operations/investment/capitals-lumina/capitals-lumina.html',
                url: '/capitalsLumina',
                controller: 'capitalsLuminaCtrl',
                controllerAs: 'capitalsLumina',
                data: {
                    needClient: true
                },
                ncyBreadcrumb: {
                  label: 'Mercado de Capitales',
                },
            })

            .state('investment.statementFiscal',{
                templateUrl: '/app/operations/investment/investment-statementFiscal/statement-fiscal.html',
                url: '/statementFiscal',
                controller: 'statementFiscalCtrl',
                controllerAs: 'statementFiscal',
                data: {
                    needClient: true
                },
                ncyBreadcrumb: {
                  label: 'Constancias Fiscales',
                },
            });


    }


    angular.module( 'actinver' )
        .config( routerProviderConfig );


})();
