(function () {
    "use strict";

    function transfersCtrl(transfersSrv, CommonModalsSrv, $scope) {
        var vm = this;
        transfersSrv.getMedia().then(function (_res) {
            var _media = _res.data.outContactMeansCatalog.contactMeansCatalogData.contactMeans;
            var _mediaType = [];
            angular.forEach(_media, function (value) {
                if (value.key !== '4') {
                    if (value.key !== '5') {
                        _mediaType.push({
                            id: value.key,
                            text: value.description
                        });
                    }
                }
            });
            vm.Media = _mediaType;
        });

        vm.showSystemError = CommonModalsSrv.systemError;

        $scope.contractso = R.map(function(_val){
            _val.text = _val.contractNumber;
            return _val;
        }, $scope.operations.sclient.contracts_list);
    }

    angular
        .module('actinver.controllers')
        .controller('transfersCtrl', transfersCtrl);

})();
