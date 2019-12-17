(function () {
    "use strict";

    function admonFactsheetModalCtrl($uibModalInstance, title, factsheet, FactsheetsSrv, CommonModalsSrv, URLS, factSheetSrv) {
        var vm = this;
        vm.loading = false;
        vm.uploaderOptions = [
            { formats: ["image/png", "image/jpeg", "image/jpg"], size: 2097152 }
        ];

        if (factsheet.idProduct) {
            factSheetSrv.getImage(factsheet.idProduct)
                .then(function (response) {
                    vm.product_factsheet_img_url = response;
                })
                .catch(function (error) {
                    CommonModalsSrv.error(error.error);
                });
        }

        function setup() {
            setupVars();
            if (!factsheet.name) {
                getClassifications();
            }
        }

        function getClassifications() {
            vm.loading = true;
            FactsheetsSrv.getClassifications().then(function (_res) {
                vm.products = _res.map(function (_product) {
                    _product.text = _product.description;
                    return _product;
                });
                vm.loading = false;
            });
        }

        function setupVars() {
            vm.title = title;
            vm.factsheet = factsheet;
        }


        vm.previewFile = function (_img, _file) {
            vm.imgPreview = _img;
            vm.factsheet.file = _file;
        };

        vm.errorFile = function (_error) {
            vm.imgPreview = false;
            vm.factsheet.file = false;
            CommonModalsSrv.error(_error);
        };

        vm.cleanFields = function () {
            vm.imgPreview = false;
            vm.factsheet = {};
        };

        vm.close = function () {
            $uibModalInstance.close();
        };

        vm.done = function () {
            vm.loading = true;

            FactsheetsSrv.doFactsheet(vm.factsheet)
                .then(function (result) {
                    if (result.data !== null) {
                        if (vm.factsheet.file) {
                            FactsheetsSrv.updateImg(result.data, vm.factsheet.file)
                                .then(function () {
                                    $uibModalInstance.close('success');
                                }).catch(function () {
                                    $uibModalInstance.close('error');
                                }).finally(function () {
                                    vm.loading = false;
                                    vm.cleanFields();
                                });
                        } else {
                            $uibModalInstance.close('success');
                        }
                    } else {
                        vm.close();
                        CommonModalsSrv.error('Se Encontró Un Error Favor De Intentarlo Más Tarde, Comuníquese Con Su Help desk');
                    }
                });
        };


        setup();

    }

    angular.module('actinver.controllers')
        .controller('admonFactsheetModalCtrl', admonFactsheetModalCtrl);

})();
