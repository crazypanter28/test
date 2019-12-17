(function () {
    'use strict';

    function proposalsInstrumentsCtrl($scope, $filter, proposalsProposalSrv, CommonModalsSrv, $rootScope) {
        var vm = this,
            type = $scope.type,
            totals = 0;

        // Defaults
        $scope.invest[type] = [];
        vm.issuers_list = [];
        vm.form = {};
        vm.sissuer = {};
        vm.editing = {};
       

        
        vm.listCF = configTypes('client', $rootScope.listClassFav);
        

        if ($scope.productsList) {
            vm.products = setProducts($scope.productsList);
        }

        vm.listClassFav = {
            optionClas: vm.listCF
        };
        //vm.prueba= $rootScope.listClassFav;
           

       

        // Dropdown products
        function setProducts(list) {
            vm.listPrueba = [];
            return R.map(function (val) {
                val.text = val.issuerName + ' ' + val.serie;

                if ($scope.type === 'reportos') {
                    val.text = val.investmentType + ' ' + $filter('currency')(val.minNetAmount) + ' - ' + $filter('currency')(val.maxNetAmount);
                }

                if ($scope.type === 'derivatives') {
                    val.text = val.nota ;
                }

                if ($scope.type === 'actions') {
                    val.text = null;
                    vm.listPrueba.push(val);
                }

                return val;

            }, list);
        }

        // Deselect current product
        function deselect() {
            vm.editing = {};
            vm.sissuer = {};
        }

        //Valida que la suma de los montos de los productos no sobrepase el valor del portafolio propuesto
        function validateProduct(totalProduct) {
            var total = 0, option = { tipo: 0, monto: totalProduct };
            if (angular.isDefined($scope.invest)) {
                Object.values($scope.invest).forEach(function (data) {
                    if (angular.isArray(data)) {
                        data.forEach(function (record) {
                            total += record.amount;
                        });
                    }
                });
                if ($scope.portfolioValue < Number((total + totalProduct).toFixed(2))) {
                    option = { tipo: 1, monto: $scope.portfolioValue - total };//indica que la sumatoria de los productos sobresa al valor del portafolio propuesto
                }
            }
            return option;
        }

        //Da formato a moneda
        function formatMoney(n, currency) {
            return currency + " " + n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
        }

        // Get all issuers info
        vm.getIssuersInfo = function () {
            vm.form.issuer = null;

            if (vm.issuers === 'all') {

                // Get profiles
                proposalsProposalSrv.getAllIssuers()
                    .then(function successCallback(response) {

                        angular.forEach(response.data, function (item) {
                            if (vm.issuers_list.indexOf(item.issuer.issuerSerie) === -1) {
                                vm.issuers_list.push(item.issuer.issuerSerie);
                            }
                        });

                    });
            }
        };

        // Calculate amount based on portfolio value
        vm.calcAmount = function (model) {
            var total = $scope.portfolioValue;

            if (typeof model.percentage !== 'undefined' && model.percentage !== '') {
                model.amount = model.percentage * total;
            }
        };

        // Calculate percentage based on portfolio value
        vm.calcPercent = function (model) {
            var total = $scope.portfolioValue;
            if (typeof model.amount !== 'undefined' && model.amount !== '') {
                model.percentage = model.amount / total;
                /*if( Math.round( model.percentage ) !== model.percentage ){
                    model.percentage = model.percentage.toFixed(2);
                }*/
            }
        };
        vm.recCalPercent = function () {
            var total = $scope.portfolioValue;
            if (angular.isDefined($scope.invest) && angular.isDefined($scope.invest[type]) && angular.isArray($scope.invest[type])) {
                $scope.invest[type].forEach(function (record) {
                    record.amount = record.percentage * total;
                });
            }
        };

        // Add one kind product to proposal
        vm.addProduct = function () {
            var issuer = (typeof vm.form.issuer === 'object') ? vm.form.issuer.text : vm.form.issuer,
                yet = R.findIndex(R.propEq('issuer', issuer))($scope.invest[type]),
                info,
                optionProduct = {};

            optionProduct = validateProduct(vm.form.amount);
            if (optionProduct.tipo > 0) {
                CommonModalsSrv.info('Solo puedes invertir una cantidad menor o igual a ' + formatMoney(optionProduct.monto, '$'));                
            } else {
                if (typeof issuer !== 'undefined') {
                    if (yet === -1) {
                        info = {
                            id: Math.floor(Math.random() * (1000000 + 1) + 1),
                            issuer: issuer,
                            amount: vm.form.amount,
                            percentage: vm.form.percentage
                        };
                        if (type === 'invest' && $filter('filter')($scope.issuers, vm.form.issuer.issuerName).length > 0) {
                            info.description = $filter('filter')($scope.issuers, vm.form.issuer.issuerName)[0].description;
                        }
                        if(type === 'derivatives'){
                            info.description = vm.form.issuer.aDetalle; 
                        }

                        $scope.invest[type].push(info);
                        vm.form = {};
                    } else {
                        CommonModalsSrv.error('El producto seleccionado ya se ha agregado anteriormente');
                    }
                } else {
                    CommonModalsSrv.error('El producto no ha sido seleccionado');
                }
            }
        };

        // Set object for editing products
        for (var i = 0; i < $scope.invest[type].length; i++) {
            vm.editing[$scope.invest[type][i].id] = false;
        }

        // Make copy from original object for reset purpose
        vm.edit = function (item) {
            vm.reset(vm.sissuer.id);
            vm.editing[item.id] = true;
            vm.sissuer = angular.copy(item);
        };

        // Delete item from invest array
        vm.delete = function (id) {
            var index = R.findIndex(R.propEq('id', id))($scope.invest[type]),
                message = '¿Estás seguro de eliminar el registro?';

            vm.reset(vm.sissuer.id);
            CommonModalsSrv.warning(message).result.then(function () {
                if (index !== -1) {
                    $scope.invest[type].splice(index, 1);
                    CommonModalsSrv.done('El registro se ha eliminado exitosamente.');
                } else {
                    message = 'Se Encontró Un Error Favor De Intentarlo Más Tarde, Comuníquese Con Su Help desk';
                    CommonModalsSrv.error(message);
                }
            }).finally(angular.noop).then(angular.noop, angular.noop);
        };

        // Deselect current issuer
        vm.reset = function (id) {
            var index = R.findIndex(R.propEq('id', id))($scope.invest[type]);

            $scope.invest[type][index] = vm.sissuer;
            deselect();
        };

        // Update information
        vm.save = function (id) {
            var optionProduct,
                index,
                record,
                saldoRestante;
            index = R.findIndex(R.propEq('id', id))($scope.invest[type]);
            record = $scope.invest[type][index];
            optionProduct = validateProduct(0);
            saldoRestante = $scope.portfolioValue - ($scope.totals - record.amount);
            if (optionProduct.tipo > 0) {
                CommonModalsSrv.info('Solo puedes invertir una cantidad menor o igual a ' + formatMoney(saldoRestante, '$'));
            } else {
                deselect();
            }
        };

        vm.classificationFav = function (profile) {

            vm.pruebaFilterFav = [];
            vm.prueba =  vm.listPrueba.map(function( _val ){
                if(profile.idClassification ==  _val.idClassification){
                    _val.text = _val.issuerName;
                    vm.pruebaFilterFav.push(_val);
                } 
                
                return _val;
            }); 
        
        
          vm.form.issuer = null;
        };

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

        // Get information from portfolio value
        $scope.$watch('portfolioValue', function () {
            vm.calcPercent(vm.form);
            vm.recCalPercent();
        });

        // Show totals block
        $scope.$watch('invest', function () {
            totals = 0;
            if (angular.isDefined($scope.invest)) {
                Object.values($scope.invest).forEach(function (data) {
                    if (angular.isArray(data)) {
                        data.forEach(function (record) {
                            totals += record.amount;
                        });
                    }
                });
            }
            $scope.totals = totals;
        }, true);
    }

    angular
        .module('actinver.controllers')
        .controller('proposalsInstrumentsCtrl', proposalsInstrumentsCtrl);

})();