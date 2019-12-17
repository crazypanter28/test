

(function () {
    "use strict";

    function investmentCtrl($scope, $state, investmentSrv, CommonModalsSrv, loginSrvc,$rootScope, outProfileSrv) {
        var vm = this;
        vm.contract = null;
        vm.tabSelect = null;
        vm.markets = null;
        vm.url = false;

        vm.loadContract = loadContract;
        vm.changeContract = function(contract){
            localStorage.setItem('contractSelected', JSON.stringify(contract));
            init();

        };

        init();
        function init() {
            var contract = JSON.parse(localStorage.getItem('contractSelected'));
            var _type = JSON.parse(localStorage.getItem('_marketType'));
            if(contract !== '' && _type !== null){
                vm.contractS = contract;
                if(vm.contractS.bankingArea === '999' && _type === 'MC'){
                    _type = 'CM';
                }else if(vm.contractS.bankingArea === '998' && _type === 'CM'){
                    _type = 'MC';
                }
                loadContract(_type);
            }
        }

        angular.forEach($scope.operations.sclient.contracts_adviser, function (value, key) {
            $scope.operations.sclient.contracts_adviser[key].contractNumber = value.contractNumber;
        });

        vm.contracts = R.map(function (_val) {
            _val.text = _val.contractNumber;
            return _val;
        }, $scope.operations.sclient.contracts_adviser);


        vm.selectedTab = function(_item) {
            localStorage.setItem('_marketType', JSON.stringify(_item.shortname));
        }

        function messageOutContractProfile(){
            var clientSearch = JSON.parse(sessionStorage["ngStorage-sclient"]);
            var name = clientSearch.data.personType === "1" ? (clientSearch.data.name + " " + clientSearch.data.lastName + " " + clientSearch.data.lastName) : clientSearch.data.companyName;
            var modelOutOfProfileContractQuery = {
                bankingArea: vm.contract.bankingArea,
                clientNumber:vm.contract.clientNumber,
                clientName:name,
                contractNumber: vm.contract.contractNumber
            };

            //aqui va el nuevo servicio
            investmentSrv.outOfProfileContractQuery(modelOutOfProfileContractQuery).then(function(response){
                if(response.data.outOutOfProfileContractQuery.outOfProfileContractFlag)
                    outProfileSrv.information();
            });
        }
        function loadContract (_type) {

            vm.contract = vm.contractS;
            localStorage.setItem('contractSelected', JSON.stringify(vm.contract));
            vm.iscuentapropia = vm.contractS.isPropia;
            vm.tabSelect = 3;
            vm.navInvestment = [];

            var model = {
                contractNumber: vm.contract.contractNumber,
                bankingArea: vm.contract.bankingArea
            };

            var modelmv = {
                businessType: vm.contract.bankingArea === '999' ? '01' : '02',
                contractNumber: vm.contract.contractNumber,
                marketType: 'TD'
            };

            //llamado sincrono
            investmentSrv.getContractSelection(model).then(function (response) {                
                if(response.data.outCommonHeader.result.result === 1){                                         
                    investmentSrv.getMarketValidation(modelmv).then(function (_res) {                        
                        messageOutContractProfile();
                        if (_res.data.outContractMarketValidation !== null && _res.data.outContractMarketValidation.market && _res.data.outCommonHeader.result.result === 1 && _res.data.outContractMarketValidation.market.length ) {
                            vm.markets = _res.data.outContractMarketValidation.market;
                            var viewMarketsByVisible = [];
                            angular.forEach(vm.markets, function (value) {
                                if(value.marketType === 'SI'){
                                    viewMarketsByVisible[0] = value.operativeFlag;
                                } else if(value.marketType === 'MD'){
                                    viewMarketsByVisible[1] = value.operativeFlag;
                                } else if(value.marketType === 'CM'){
                                    viewMarketsByVisible[2] = value.operativeFlag;
                                }
                            });

                            $rootScope.viewMarketsByVisible = viewMarketsByVisible;

                            if (vm.contract) {
                                switch (vm.contract.bankingArea) {
                                    case '998':
                                        vm.navInvestment = [
                                            {
                                                name: 'Fondos de inversión',
                                                state: 'investment.funds',
                                                shortname: 'SI'
                                            },
                                            {
                                                name: 'Mercado de dinero',
                                                state: 'investment.money',
                                                shortname: 'MD'
                                            },
                                            {
                                                name: 'Mercado de capitales',
                                                state: 'investment.capitals',
                                                shortname: 'MC'
                                            }
                                        ];

                                        switch (_type){
                                            case 'SI':
                                                $state.go('investment.funds');
                                                break;
                                            case 'MD':
                                                $state.go('investment.money');
                                                break;
                                            case 'MC':
                                                $state.go('investment.capitals');
                                                break;
                                            default:
                                                $state.go('investment.funds');
                                                break;
                                        }
                                        //  localStorage.setItem('_marketType', JSON.stringify(null));
                                        break;

                                    case '999':
                                        vm.navInvestment = [
                                            {
                                                name: 'Fondos de inversión',
                                                state: 'investment.fundsBank',
                                                shortname: 'SI'
                                            },
                                            {
                                                name: 'Mercado de dinero',
                                                state: 'investment.moneyBank',
                                                shortname: 'MD'
                                            },
                                            {
                                                name: 'Mercado de capitales',
                                                state: 'investment.capitalsLumina',
                                                shortname: 'CM'
                                            }
                                        ];

                                        switch (_type){
                                            case 'SI':
                                                $state.go('investment.fundsBank');
                                                break;
                                            case 'MD':
                                                $state.go('investment.moneyBank');
                                                break;
                                            case 'CM':
                                             $state.go('investment.capitalsLumina');
                                             break;
                                            default:
                                                $state.go('investment.fundsBank');
                                                break;
                                        }
                                        //localStorage.setItem('_marketType', JSON.stringify(null));
                                        break;
                                }
                            }
                            vm.getUrlPracticasV();
                        }else{
                            CommonModalsSrv.error( _res.data.outCommonHeader.result.messages[0].responseMessage );
                            vm.markets = null;
                        }
                    }, function () {

                    });

                } else if(response.data.outCommonHeader.result.result === 2){
                    CommonModalsSrv.error( response.data.outCommonHeader.result.messages[0].responseMessage);
                    vm.markets = null;
                }else{
                    CommonModalsSrv.error( response.data.result);
                    vm.markets = null;
                }                
            }).catch(function () {

            });


        }
        $scope.mostrarcapitales = false;
        loginSrvc.makeDataUser().then(function (_response) {
            console.log('_response.user.systemTO.profile', _response.user.systemTO.profile);
            if (_response.user.systemTO.profile === 'local' || _response.user.systemTO.profile === 'qa') {
                $scope.mostrarcapitales = true;
            }
        });

        $scope.filterfn = function (car) {

            var resp = false;
            if (car.shortname === 'MC' && vm.contract.bankingArea === '999') {

                return $scope.mostrarcapitales;
            }
            vm.markets.forEach(function (_item) {
                if (_item.marketType === car.shortname && _item.operativeFlag === true) {
                    resp = true;
                }
            });
            return resp;
        };

        vm.getUrlPracticasV = function () {
            vm.url = true;
            investmentSrv.getUrlPracticasVenta(vm.contract.contractNumber,vm.contract.bankingArea).then(function (_res) {
                if (_res) {
                    vm.urlPracticaVenta = _res.data.result.url;
                    vm.paramsPracticaVneta = _res.data.result.params;
                }
            }, function () {

            });
        };

        $scope.goPV = function () {
            document.LANSA.action = vm.urlPracticaVenta ;
            document.LANSA.submit();
        };

        vm.getMarkets = function (modelmv) {
            investmentSrv.getMarketValidation(modelmv).then(function (_res) {
                if (_res.data.outCommonHeader.result.result === 1) {
                    if (_res.data.outContractMarketValidation !== null && _res.data.outContractMarketValidation.market) {
                        vm.markets = _res.data.outContractMarketValidation.market;
                    }
                }
            }, function () {

            });
        };
    }

    angular.module('actinver.controllers')
        .controller('investmentCtrl', investmentCtrl);

})();
