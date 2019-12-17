(function () {
    'use strict';

    function portfolioDetailsCtrl($filter) {
        var vm = this,
            totals_topics = {
                valuation: 0,
                appreciation: 0
            };

        // Settings
        vm.contracts = false;
        vm.contracts_totals = totals_topics;
        vm.contract_totals = [];
        vm.contract_info = [];
        vm.topic_by_currency = [];

        vm.topicsbank = {
            "ACCIONES DE SOCIEDADES DE INVERSION DE INSTRUMENTOS DE DEUDA": 'siid',
            "ACCIONES DE SOCIEDADES DE INVERSION": 'asi'
        };


        // Get available topics by contract
        vm.getContractTopicInfo = function (contract) {
            var contract_info = contract.data,
                topic_info = $filter('groupJSON')(contract_info, 'market'),
                current_value = $filter('sumByColumn')(contract_info, 'lastPrice'),
                plus_value = $filter('sumByColumn')(contract_info, 'appreciation');

            // Contract subtotal
            vm.contract_totals.push([current_value, plus_value]);
            vm.contract_info.push([topic_info]);

            // Contracts totals
            vm.contracts_totals.valuation += current_value;
            vm.contracts_totals.appreciation += plus_value;
        };

        // Get available currencies by topic
        vm.getTopicInfoCurrency = function (info) {
            return $filter('groupJSON')(info, 'currencyTypeDesc');
        };
        // Get available currencies by topic
        vm.getFundTypes = function (info) {
            return $filter('groupJSON')(info, 'fundType');
        };

    }

    angular
        .module('actinver.controllers')
        .controller('portfolioDetailsCtrl', portfolioDetailsCtrl);

})();
