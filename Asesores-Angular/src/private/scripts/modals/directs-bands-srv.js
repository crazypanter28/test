(function () {
    'use strict';

    function directsBandsSrv($uibModal) {

        var profile = {};
        profile.information = function (data, fn) {
            return $uibModal.open({
                templateUrl: '/scripts/modals/views/money-market/directs-bands.html',
                windowClass: 'center-modal-bands-direct modal-center-contract-out-profile info',
                controller: 'directsBandsMdlCtrl',
                controllerAs: 'directsBandsMdlCtrl',
                backdrop: 'static',
                keyboard : false,
                resolve: {
                    data: function () {
                        return data;
                    },
                    fn:function(){
                        return fn;
                    }
                }
            });
            
        };

        return profile;
    }

    angular.module('actinver.services')
        .service('directsBandsSrv', directsBandsSrv);

})();