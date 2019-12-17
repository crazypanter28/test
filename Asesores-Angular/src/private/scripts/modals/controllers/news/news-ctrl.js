(function () {
    'use strict';

    function newsModalCtrl($uibModalInstance, $window, data) {
        var vm = this;
        vm.data = data;
        vm.contenido = '';

        vm.close = function () {
            $uibModalInstance.close();
        };

        vm.linkTo = function (record) {
            $window.open(record.uri, '_blank');
        };
        vm.filter = function (condition) {
            return function (item) {
                var creacion = moment(item.publishedDate).format("yyyy-MM-dd HH:mm");
                if (item.title.toUpperCase().includes(condition.toUpperCase()) || creacion.includes(condition))
                    return true;
                return false;
            };
        };

    }

    angular.module('actinver.controllers')
        .controller('newsModalCtrl', newsModalCtrl);
})();