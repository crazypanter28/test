(function () {
    "use strict";

    function performanceCtrl(PerformanceSrv, $q, $state, $filter, ErrorMessagesSrv) {
        var vm = this;

        function setup() {
            setupVars();
            getStations();
        }

        vm.goState = function () {
            var issuers = $filter('filter')(vm.allMarkets, { selected: true });

            var newIssuers = issuers.map(function (_val) {
                if(vm.selectedTab === 'funds'){
                    return {
                        issuer: _val.issuerName,
                        serie: _val.serie,
                        virtualAmount: _val.value / 100 * vm.amount,
                        percent: _val.value,
                        type: _val.type
                    };
                }else{
                    return {
                        issuer: _val.issuerName,
                        serie: _val.serie,
                        virtualAmount: _val.value / 100 * vm.amount,
                        percent: _val.value,
                        type: 'MERCADO DE CAPITALES'
                    };
                }
            });

            var endDate = new Date();
            var beginDate = new Date();
            beginDate.setFullYear(beginDate.getFullYear() - vm.slider.value);

            var sendModel = {
                send: {
                    beginDate: $filter('date')(beginDate, 'ddMMyy'),
                    endDate: $filter('date')(endDate, 'ddMMyy'),
                    issuers: newIssuers
                },
                virtualAmount: vm.amount,
            };
            $state.go('simulators.details', { model: sendModel });
        };

        vm.selectTabTable = function (_tab, _subTab) {
            if (_subTab) {
                vm.selectedSubTab = _subTab;
                vm.resultTable = vm.categories[vm.selectedSubTab.code];
            }else {
                // vm.allMarkets.map(function (_market) {
                //     _market.selected = false;
                // });
                vm.selectedTab = _tab;
                //vm.selectedSubTab = _tab === 'funds' ? vm.optionsTab1[0] : vm.optionsTab2[0];

                if(_tab==='funds'){
                    vm.selectedSubTab=vm.optionsTab1[0];
                    vm.resultTable = vm.categories[vm.selectedSubTab.code];
                }
                else{
                    vm.selectedSubTab=vm.optionsTab2[0];
                    vm.selectTabTableMarket(vm.selectedSubTab);
                }
            }
        };


        vm.selectTabTableMarket = function(_subTab){
            if(_subTab){
                vm.selectedSubTab=_subTab;
                var market=0;
                var monitor=0; 
                switch(_subTab.code){
                    case 'ipc':
                        market = 2;
                        monitor=2;
                    break;
                    case 'masbursatil':
                        market=2;
                        monitor=3;
                    break;
                    case 'menosbursatil':
                        market=2;
                        monitor=4;
                    break;
                    case 'sic':
                        market=5;
                        monitor=5;
                    break;
                    case 'tracks':
                        market=3;
                        monitor=5;
                    break;
                    case 'tracksdeuda':
                        market=4;
                        monitor=5;
                    break;
                }
                PerformanceSrv.GetStationsMarketCAP(market,monitor)
                .then(function(response){
                    if(vm.categories[_subTab.code]===undefined){
                        var temporaryArray=[];
                        var temporaryObject={};
                        angular.forEach(response, function(item){
                            temporaryObject=item.issuer;
                            temporaryObject.averagePrice=item.averagePrice;
                            temporaryObject.closingPrice=item.closingPrice;
                            temporaryObject.lastPrice=item.lastPrice;
                            temporaryObject.selected=false;
                            temporaryObject.type=_subTab.code;
                            temporaryArray.push(temporaryObject);
                            vm.allMarkets.push(temporaryObject);
                        });
                        vm.categories[_subTab.code]=temporaryArray;
                    }
                    vm.resultTable=vm.categories[_subTab.code];
                });
            }
        };

        vm.updateTotal = function () {
            vm.totalValueMarket = 0;
            vm.allMarkets.map(function (_market) {
                if (_market.selected) {
                    vm.totalValueMarket += parseInt(_market.value) || 0;
                }
            });
        };

        function setupVars() {
            vm.date = { startDate: null, endDate: null };
            vm.categories = {};
            vm.totalValueMarket = 0;
            vm.allMarkets = [];
            vm.selectedTab = 'funds';
            vm.selectedSubTab = 'debt';
            vm.amount = 1000000;
            vm.slider = {
                value: 0,
                options: {
                    floor: 1,
                    ceil: 5,
                    step: 2,
                    showSelectionBar: true,
                    translate: function (value, sliderId, label) {
                        switch (label) {
                            case 'model':
                                //return ( (Math.trunc(value/12) ? Math.trunc(value/12) + ' años ' : '') + ((value%12) ? (value%12) + ' meses' : '') || '0 meses');
                                return (value + ' años ');
                            //case 'floor':
                            //return ( value + ' años ');
                            default:
                                return '';
                        }
                    }
                }
            };

            vm.optionsTab1 = [
                { id: 3, text: 'DE DEUDA', code: 'debt' },
                { id: 2, text: 'DE RENTA VARIABLE', code: 'rent' },
                { id: 1, text: 'DINÁMICOS', code: 'din' },
            ];
            
            vm.optionsTab2 = [
                { id: 4, text: 'IPC', code: 'ipc' },
                { id: 5, text: 'MAS BURSÁTILES', code: 'masbursatil' },
                { id: 6, text: 'MENOS BURSÁTILES', code: 'menosbursatil' },
                { id: 7, text: 'SIC', code: 'sic' },
                { id: 8, text: 'TRACKS', code: 'tracks' },
                { id: 9, text: 'TRACKS DEUDA', code: 'tracksdeuda' },
            ];
        }

        function getStations() {
            vm.loading = true;

            $q.all([
                PerformanceSrv.GetStations(3),
                PerformanceSrv.GetStations(2),
                PerformanceSrv.GetStations(1),
            ]).then(function (_res) {
                if(typeof _res[0] !== 'string'  && typeof _res[1] !== 'string' && typeof _res[2] !== 'string'){
                    var options = ['debt', 'rent', 'din'];
                    _res.map(function (_val, _index) {
                        _val.issuer.map(function (_station) {
                            PerformanceSrv.getClasification(_station);
                            _station.type = options[_index];
                            vm.allMarkets.push(_station);
                        });
                        vm.categories[options[_index]] = _val.issuer;
                    });
                    vm.resultTable = vm.categories['debt'];     //se agrega debt para carga unicial de Fondos.           
                    getCapitals();
                }else{
                    ErrorMessagesSrv('Se encontró un error favor de intentarlo más tarde, comuníquese con su help desk');
                }
            });
        }

        function getCapitals() {
            PerformanceSrv.GetStationsMarket().then(function (_res) {
                vm.categories.capitals = _res.marketDataTuple;
                _res.marketDataTuple.map(function (array){
                    vm.allMarkets.push(array);
                });
                vm.selectTabTable('funds');
                vm.loading = false;
            });
        }

        setup();
    }

    angular
        .module('actinver.controllers')
        .controller('performanceCtrl', performanceCtrl);
})();
