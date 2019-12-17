(function () {
    'use strict';

    function proposalFormCtrl($scope, $filter, $q, proposalsProposalSrv, CommonModalsSrv, proposalsPropTracingSrv, userConfig, $rootScope) {
        var vm = this,
            form = $scope.model.form,
            portfolio = form.portfolio;

        vm.fields = {
            strategies: []
        };
        vm.selected_portfolio = false;

        // Dropdown config
        function configTypes(type, types) {
            return R.map(function (val) {
                switch (type) {

                    case 'client':
                        val.text = val.description;
                        break;

                    default:
                        val.text = val.name;

                }

                return val;
            }, types);
        }

        // Setup info
        function setup() {
            vm.fields.client_types = configTypes('client', proposalsProposalSrv.client_types);
            proposalsProposalSrv.getIssuersInfo()
                .then(function (response) {
                    vm.issuers = response.data;
                });
        }

        // Reset form
        vm.resetPortfolioChilds = function (idx) {
            if (idx === 0 && portfolio.length > 1) {
                portfolio.pop();
            }

            // Delete previous object
            delete portfolio[idx].strategyItems;
            delete portfolio[idx].invest;
            delete portfolio[idx].profile_type;
            delete portfolio[idx].client_type;
            delete vm.manual_info;
            portfolio[idx].totals = 0;

            if (portfolio[idx].type === 'model') {

                // Get profiles
                proposalsProposalSrv.getProfiles()
                    .then(function successCallback(response) {
                        vm.fields.profiles_types = configTypes('profiles', response.data);
                    });
            }

        };

        // Check portfolio type information
        vm.checkPortfolio = function (profile, idx) {
            portfolio[idx].value = 1000000;

            if ($scope.model.form.portfolio[$scope.idx].invest) {
                $scope.model.form.portfolio[$scope.idx].invest.invest = [];
                portfolio[idx].totals = 0;                
                vm.openIinvest = false;
            }

            if (portfolio[idx].type === 'model') {
                vm.modelConfig(profile, idx);// Get strategies
            } else {
                vm.manualConfig(profile.key);// Manual information
                vm.getClassFav();
            }
        };

        // Get model information
        vm.modelConfig = function (profile, idx) {

            var key = profile.key,
                strategies = [];

            // Defaults
            vm.hide_strategies = false;
            //Reseteamos la vista de las opciones de Estrategia
            //Reseteamos model de estrategia
            portfolio[idx].strategyItems = {};
            portfolio[ idx ].strategy='';

            if (key < 0) {
                vm.hide_strategies = true;
                vm.fields.strategies[idx] = configTypes('strategies', $filter('orderBy')(strategies, 'key'));                
            } else {
                
                proposalsProposalSrv.getStrategies(key)
                    .then(function (response) {
                        angular.forEach(response, function (type) {
                            angular.forEach(type.data, function (strategy) {
                                strategies.push(strategy);
                            });
                        });

                        angular.forEach(strategies, function (item) {
                            item.key = parseInt(item.key);
                        });

                        vm.fields.strategies[idx] = configTypes('strategies', $filter('orderBy')(strategies, 'key'));

                    }, function () {

                        CommonModalsSrv.error('Se Encontró Un Error Favor De Intentarlo Más Tarde, Comuníquese Con Su Help desk');

                    });
                    
                 }
            };

            // Get strategy information
            vm.getStrategyDetails = function (strategy, idx) {
                portfolio[idx].strategyItems = {};
                proposalsProposalSrv.getStrategyDetail(strategy.key)
                    .then(function (response) {

                        angular.forEach(response.data.limits, function (item) {
                            portfolio[idx].strategyItems[item.subGroup.grouper.name] = {
                                info: []
                            };
                        });

                        angular.forEach(portfolio[idx].strategyItems, function (obj, key) {
                            obj.info = $filter('filter')(response.data.limits, { subGroup: { grouper: { name: key } } });
                        });

                    });
            };

            // Get information for manual proposal
            vm.manualConfig = function (key) {
                vm.manual_info = false;
                return $q.all([
                    proposalsProposalSrv.getInvIssuersCatalog(key),
                    proposalsProposalSrv.getBandsCatalog(key),
                    proposalsProposalSrv.getIssuersCatalog(key),
                    proposalsProposalSrv.getFavorites(),
                    proposalsProposalSrv.getDerivativesCatalog()
                ]).then(function (data) {
                    vm.manual_info = {};                    
                    angular.forEach(data, function (item) {
                        vm.manual_info[item.topic] = item.data;
                    });
                }, function () {
                    CommonModalsSrv.error('Se Encontró Un Error Favor De Intentarlo Más Tarde, Comuníquese Con Su Help desk');
                    vm.manual_info = null;
                });
            };

            vm.getClassFav = function (key) {
                 proposalsProposalSrv.getClassificationFav()
                .then(function (data) {                                       
                    $rootScope.listClassFav = data.data;                    
                }, function () {
                    CommonModalsSrv.error('Se Encontró Un Error Favor De Intentarlo Más Tarde, Comuníquese Con Su Help desk');
                    $rootScope.listClassFav = null;
                });
            };

            $scope.$watch('model.form', function (form) {
                if (form.portfolio.length === 0) {
                    form = $scope.model.form;
                    portfolio = form.portfolio;
                }
            }, true);

            $scope.chargerPortfolio = function () {
                var number = $scope.contract.numContrato;
                //var id = $scope.contract.idSponsor;
                var employeeID = userConfig.user.employeeID;
                var origen = $scope.contract.origen;
                if (vm.changePortfolio) {
                    proposalsPropTracingSrv.getCurrentPortfolio(employeeID, number, origen).then(function (_res) {
                        $scope.model.form.portfolio[$scope.idx].invest.invest = _res.portfolio.map(function (_val) {
                            var newObj = {};
                            newObj.amount = _val.monto;
                            newObj.description = _val.description;
                            newObj.description = _val.description;
                            newObj.issuer = _val.producto;
                            newObj.percentage = _val.monto / _res.portfolioValue;
                            return newObj;
                        });
                        $scope.model.form.portfolio[$scope.idx].value = _res.portfolioValue;
                        vm.openIinvest = true;
                    });
                }
                else {
                    $scope.model.form.portfolio[$scope.idx].invest.invest = [];
                    vm.openIinvest = false;
                }
            };

            // Init application
            setup();
        }

        angular
            .module('actinver.controllers')
            .controller('proposalFormCtrl', proposalFormCtrl);

    } ) ();
