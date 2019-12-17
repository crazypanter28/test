(function () {

    'use strict';

    function remarkText($sce) {
        return function (text, phrase) {
            var cadena = angular.isString(text) ? text : ( text && text !== null ? text.toString() :'');
            if (phrase)
                cadena = cadena.replace(new RegExp('(' + phrase + ')', 'gi'), '<span class="search-find">$1</span>');
            return $sce.trustAsHtml(cadena);
        };
    }

    angular
        .module('actinver.filters')
        .filter('remarkText', remarkText);

})();