(function () {
    'use strict';

    function validateIn() {

        function ValidateIn() { }

        ValidateIn.prototype.formatCurrency = function (amount) {

            var decimals = 2;
            amount += ''; // por si pasan un numero en vez de un string
            amount = parseFloat(amount.replace(/[^0-9\.]/g, '')); // elimino cualquier cosa que no sea numero o punto

            decimals = decimals || 0; // por si la variable no fue fue pasada
            // si no es un numero o es igual a cero retorno el mismo cero
            if (isNaN(amount) || amount === 0)
                return parseFloat(0).toFixed(decimals);
            // si es mayor o menor que cero retorno el valor formateado como numero
            amount = '' + amount.toFixed(decimals);

            var amount_parts = amount.split('.'),
                regexp = /(\d+)(\d{3})/;

            while (regexp.test(amount_parts[0]))
                amount_parts[0] = amount_parts[0].replace(regexp, '$1' + ',' + '$2');

            return amount_parts.join('.');
        };

        ValidateIn.prototype.calcularEdadRfc = function (rfc, type) {
            var log = moment(new Date()).format("YY");
            var fecha = type === "1" ? rfc.substring(4, 10) : rfc.substring(3, 9);
            var anio = fecha.substring(0, 2);
            var mes = fecha.substring(2, 4);
            var dia = fecha.substring(4, 6);
            if (anio > log) {
                anio = "19" + anio;
            } else {
                anio = "20" + anio;
            }
            fecha = dia + "/" + mes + "/" + anio;
            return fecha;
        };

        ValidateIn.prototype.charrepeatText = function (event, idValue) {
            var echc = (typeof event.charCode !== 'undefined') ? event.charCode : event.which;
            var key = String.fromCharCode(echc).toUpperCase();
            var inputValue = angular.element("#" + idValue).val().toString().toUpperCase();
            inputValue = (typeof inputValue === 'undefined') ? "" : inputValue;
            //console.log("inputValue:" + inputValue + "   >>   key:" + key);
            if (inputValue.substring(inputValue.length - 1, inputValue.length) === key && inputValue.substring(inputValue.length - 2, inputValue.length - 1) === key) {
                event.preventDefault();
                return false;
            }
        };

    
        ValidateIn.prototype.soloNumAndPunto = function (e, espacios) {
            var regex = espacios ? new RegExp("^[0-9.]+$") : new RegExp("^[0-9.]+$");
            var echc = (typeof e.charCode !== 'undefined') ? e.charCode : e.which;
            var key = String.fromCharCode(echc);
            if (e.which === 241 || e.which === 209 || e.which === 225 ||
                e.which === 233 || e.which === 237 || e.which === 243 ||
                e.which === 250 || e.which === 193 || e.which === 201 ||
                e.which === 205 || e.which === 211 || e.which === 218 || e.which === 32)
                return true;
            else {
                if (!regex.test(key) && e.charCode !== 0) {

                    e.preventDefault();
                    return false;
                }
            }
        };

        ValidateIn.prototype.soloText = function (e, espacios) {
            var regex = espacios ? new RegExp("^[a-zA-Z]+$") : new RegExp("^[a-zA-Z]+$");
            var echc = (typeof e.charCode !== 'undefined') ? e.charCode : e.which;
            var key = String.fromCharCode(echc);
            if (e.which === 241 || e.which === 209 || e.which === 225 ||
                e.which === 233 || e.which === 237 || e.which === 243 ||
                e.which === 250 || e.which === 193 || e.which === 201 ||
                e.which === 205 || e.which === 211 || e.which === 218 || e.which === 32)
                return true;
            else {
                if (!regex.test(key) && e.charCode !== 0) {

                    e.preventDefault();
                    return false;
                }
            }
        };

        ValidateIn.prototype.soloTextAndNum = function (e, espacios) {
            var regex = espacios ? new RegExp("^[a-zA-Z0-9 ]+$") : new RegExp("^[a-zA-Z0-9]+$");
            var echc = (typeof event.charCode !== 'undefined') ? event.charCode : event.which;
            var key = String.fromCharCode(echc);
            if (event.which === 241 || event.which === 209 || event.which === 225 ||
                event.which === 233 || event.which === 237 || event.which === 243 ||
                event.which === 250 || event.which === 193 || event.which === 201 ||
                event.which === 205 || event.which === 211 || event.which === 218)
                return true;
            else {
                if (!regex.test(key) && event.charCode !== 0) {
                    event.preventDefault();
                    return false;
                }
            }
        };

        ValidateIn.prototype.soloNum = function () {
            var regex = new RegExp("^[0-9]+$");
            var echc = (typeof event.charCode !== 'undefined') ? event.charCode : event.which;
            var key = String.fromCharCode(echc);
            if (event.which === 241 || event.which === 209 || event.which === 225 ||
                event.which === 233 || event.which === 237 || event.which === 243 ||
                event.which === 250 || event.which === 193 || event.which === 201 ||
                event.which === 205 || event.which === 211 || event.which === 218)
                return true;
            else {
                if (!regex.test(key) && event.charCode !== 0) {
                    event.preventDefault();
                    return false;
                }
            }
        };

        ValidateIn.prototype.forceKeyPressUppercase = function (e) {
            var charInput = e.keyCode;
            if ((charInput >= 97) && (charInput <= 122)) { // lowercase
                if (!e.ctrlKey && !e.metaKey && !e.altKey) { // no modifier key
                    var newChar = charInput - 32;
                    var start = e.target.selectionStart;
                    var end = e.target.selectionEnd;
                    e.target.value = e.target.value.substring(0, start) + String.fromCharCode(newChar) + e.target.value.substring(end);
                    e.target.setSelectionRange(start + 1, start + 1);
                    e.preventDefault();
                }
            }
        };
        
        ValidateIn.prototype.cambiaN = function (e) {
            e.target.value = e.target.value.replace(/Ñ/g, 'N').replace(/ñ/g, 'n');
        };

        return new ValidateIn();

    }

    angular
        .module('actinver.controllers')
        .service('validateIn', validateIn);

})();
