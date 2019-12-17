(function () {

    'use strict';

    function randomNamesSrv() {
        var vm = this;

        function randomString() {
            var text = "";
            var cadena = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (var i = 0; i < 5; i++) {
                for (var j = 0; j < 6; j++)
                    text += cadena.charAt(Math.floor(Math.random() * cadena.length));
                text += i === 4 ? '' : '-';
            }
            return text;
        }

        vm.getNameFile = function () {
            var array = [];
            var name = "";
            try {
                array = new Uint16Array(5);
                var values = window.crypto.getRandomValues(array);
                name = values.join('-');
            } catch (error) {
                name = randomString();
            }
            return name;
        };
    }
    angular.module('actinver.services')
        .service('randomNamesSrv', randomNamesSrv);
})();