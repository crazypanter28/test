( function(){
    "use strict";

    function monthGoalCtrl(monthGoalInfo, $uibModal){
        var vm = this;

        // Chart
        vm.details = {
            finish: false,
            data: null
        };
        monthGoalInfo.getInfo()
            .then(function successCallback(response){

                // Set information
                vm.details = response;

                // Open month goal modal
                vm.openMonthGoalDetails = function(){
                    var modalInstance = $uibModal.open({
                        controller: 'monthGoalModalCtrl',
                        controllerAs: 'monthGoalModal',
                        templateUrl: '/scripts/directives/month-goal/month-goal-modal.html',
                        resolve: {
                            info: response.data
                        }
                    });
                    modalInstance.result.then(function (selectedItem) {
                        vm.selected = selectedItem;
                    }, function () {
                        return false;
                    });
                };

            }, function errorCallback(error){
                vm.details = error;
            });

    }

    angular
    	.module( 'actinver.controllers' )
        .controller( 'monthGoalCtrl', monthGoalCtrl );

})();
