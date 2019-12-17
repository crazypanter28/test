(function () {

    'use strict';

    function routerProviderConfig($stateProvider) {

        $stateProvider
            .state('insurance', {
                templateUrl: '/app/advisers/insurance/insurance.html',
                url: '/insurance',
                ncyBreadcrumb: {
                    label: 'Seguros',
                    parent: 'app.dashboard'
                },
                controller: 'insuranceCtrl',
                controllerAs: 'insCtrl',
                parent: 'app',
                redirectTo: 'insurance.main'
            })
            .state('insurance.main', {
                templateUrl: '/app/advisers/insurance/main/insurance-main.html',
                url: '/main',
                params: {
                    model: null
                },
                controller: 'insuranceMainCtrl',
                controllerAs: 'insMainCtrl',
                parent: 'insurance',
                ncyBreadcrumb: {
                    label: 'Cuenta',
                    parent: 'insurance'
                },

            })
            .state('insurance.cars', {
                templateUrl: '/app/advisers/insurance/cars/insurance-cars.html',
                url: '/cars',
                params: {
                    model: null
                },
                controller: 'insuranceCarsCtrl',
                controllerAs: 'carsCtrl',
                parent: 'insurance',
                ncyBreadcrumb: {
                    label: 'Automóviles',
                    parent: 'insurance'
                }
            })
            .state('insurance.houses', {
                templateUrl: '/app/advisers/insurance/houses/insurance-houses.html',
                url: '/houses',
                params: {
                    model: null
                },
                controller: 'insuranceHousesCtrl',
                controllerAs: 'housesCtrl',
                parent: 'insurance',
                ncyBreadcrumb: {
                    label: 'Hogar',
                    parent: 'insurance'
                }
            })
            .state('insurance.medical', {
                templateUrl: '/app/advisers/insurance/medical/insurance-medical.html',
                url: '/medical',
                params: {
                    model: null
                },
                controller: 'insuranceMedicalCtrl',
                controllerAs: 'medicalCtrl',
                parent: 'insurance',
                ncyBreadcrumb: {
                    label: 'PMM',
                    parent: 'insurance'
                }
            })
            .state('insurance.life', {
                templateUrl: '/app/advisers/insurance/life/insurance-life.html',
                url: '/life',
                params: {
                    model: null
                },
                controller: 'insuranceLifeCtrl',
                controllerAs: 'lifeCtrl',
                parent: 'insurance',
                ncyBreadcrumb: {
                    label: 'Vida',
                    parent: 'insurance'
                }
            })
            .state('insurance.repor', {
                templateUrl: '/app/advisers/insurance/main/views/reporte/misreportes.html',
                url: '/reporte',
                controller: 'misreportesCtrl',
                controllerAs: 'misreportes',
                ncyBreadcrumb: {
                    label: 'Reportes'
                }

            })
            .state('insurance.pyme', {
                templateUrl: '/app/advisers/insurance/pyme/insurance-pyme.html',
                url: '/pyme',
                params: {
                    model: null
                },
                controller: 'insurancePymeCtrl',
                controllerAs: 'pymeCtrl',
                parent: 'insurance',
                ncyBreadcrumb: {
                    label: 'PYMES',
                    parent: 'insurance'
                }
            })
            ;
    }
    angular.module('actinver')
        .config(routerProviderConfig);

})();