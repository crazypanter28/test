(function () {
    'use strict';

    function outProfileModal($uibModal) {

        var profile = {};
        profile.information = function () {
            return $uibModal.open({
                templateUrl: '/scripts/modals/views/contract-out-profile/contract-out-profile.html',
                windowClass: 'center-modal modal-center-contract-out-profile error',
                controller: 'outProfile',
                controllerAs: 'outProfile'
            }).result.catch(function (res) {
                if (!(res === 'cancel' || res === 'escape key press' || res === 'backdrop click')) {
                    throw res;
                }
            });
        };

        return profile;
    }

    angular.module('actinver.services')
        .service('outProfileSrv', outProfileModal);

})();