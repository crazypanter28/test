(function(){
    "use strict";
    angular
        .module('actinver.services')
        .factory('ErrorMessage',errorMessage);

    function errorMessage () {
        return {
            createError : createError
        };

        function createError (messages) {
            var _message = '';
            angular.forEach(messages, function(_value){
                _message += _value.responseMessage + '<br>';
            });
            return _message;
        }
    }

})();