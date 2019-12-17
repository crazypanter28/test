(function () {
    'use strict';

    function luminaModalSrv($uibModal) {

        var lumina = {};
        lumina.information = function (data) {
            return $uibModal.open({
                templateUrl: '/scripts/modals/views/notification/lumina.html',
                windowClass: 'lumina modal-center-lumina done',
                controller: 'luminaModalCtrl',
                controllerAs: 'lumina',
                resolve: {
                    data: function () {
                        return data;
                    }
                }
            }).result.catch(function (res) {
                if (!(res === 'cancel' || res === 'escape key press' || res === 'backdrop click')) {
                    throw res;
                }
            });
        };

        return lumina;
    }

    angular.module('actinver.services')
        .service('LuminaModalsSrv', luminaModalSrv);

})();