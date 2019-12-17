(function() {
    "use strict";

    function userConfig() {
        var api = {};
        api.user = {};
        api.user_permissions = {};
        return api;
    }

    angular.module('actinver.services')
        .service('userConfig', userConfig);
})();
