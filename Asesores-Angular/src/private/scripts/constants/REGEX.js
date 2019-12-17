
( function(){
    "use strict";

    function REGEX(){
        return {
            numeric: '\\d+',
            alphanumeric: '\[a-z0-9A-ÑñZáéíóúÁÉÍÓÚ ]+',
            letter: '\[a-zA-ZáéíóúÁÉÍÓÚ ]+',
            date: '\[(\d{1,2})/(\d{1,2})/(\d{4})]+'
        };

    }

    angular.module('actinver.constants')
    .constant('REGEX', new REGEX() );
})();
