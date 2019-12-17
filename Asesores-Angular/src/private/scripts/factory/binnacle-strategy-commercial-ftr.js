(function () {
    "use strict";

    function binnacleStrategyCommercialFtr() {
        var state = {};       
        state.infoStrategyCommercial =null;
        state.saveState = function(reg){
            state.infoStrategyCommercial = reg;
        };

        return state;
    }

    angular
        .module('actinver.services')
        .factory('binnacleStrategyCommercialFtr', binnacleStrategyCommercialFtr);

})();
