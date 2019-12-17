(function () {
    "use strict";

    function luminaModalCtrl($uibModalInstance, notificationLuminaSrv, data) {
        
        var vm = this;
        vm.data = data;

        vm.close = function () {
            $uibModalInstance.dismiss('cancel');
        };

        vm.done = function (adviserNotificationId) {
            notificationLuminaSrv.saveStateNotification({ adviserNotificationID: adviserNotificationId }).then(function(){
                $uibModalInstance.close();
            }).catch(function(){
                $uibModalInstance.close();
            });
        };
    }

    angular.module('actinver.controllers')
        .controller('luminaModalCtrl', luminaModalCtrl);

})();
