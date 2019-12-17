( function(){
    "use strict";

    function incomesWidgetCtrl(incomesInfo){
        var vm = this;

        // Incomes
        vm.details = {finish: false};
        incomesInfo.getInfo(69,4,2)
            .then(function successCallback(response){
                vm.details = response;
            }, function errorCallback(error){
                vm.details = error;
            });

    }

    angular
    	.module( 'actinver.controllers' )
        .controller( 'incomesWidgetCtrl', incomesWidgetCtrl );

})();