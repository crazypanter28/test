(function () {
    'use strict';

    function sumByColumn() {

        return function (collection, column) {
            var total = 0;

            collection.forEach(function (item) {
                total += parseFloat(item[column]);
            });

            return total;
        };
    }

    angular
        .module('actinver.filters')
        .filter('sumByColumn', sumByColumn);

})();
(function () {
    'use strict';

    function sumByColumnProp() {

        return function (collection, column) {
            var total = 0;
            collection.forEach(function (item) {
                total += parseFloat(item[column].valuation);
            });

            return total;
        };
    }

    angular
        .module('actinver.filters')
        .filter('sumByColumnProp', sumByColumnProp);

})();
