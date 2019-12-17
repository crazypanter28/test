( function () {
    angular
        .module('actinver.controllers')
        .directive('numbersOnly', onlyNumbers)
        .directive('alphaNumeric', alphanNumeric)
        .directive('repeatedLetter', repeatedLetter);

        function onlyNumbers () {
            return {
                require: 'ngModel',
                link: function(scope, element, attrs, modelCtrl) {
                    modelCtrl.$parsers.push(function(inputValue) {
                        if (inputValue === undefined) return '';
                        var onlyNumeric = inputValue.replace(/[^0-9]/g, '');
                        if (onlyNumeric !== inputValue) {
                            modelCtrl.$setViewValue(onlyNumeric);
                            modelCtrl.$render();
                        }
                        return onlyNumeric;
                    });
                }
            };
        }

        function alphanNumeric() {
            return {
                require: 'ngModel',
                link: function(scope, element, attrs, modelCtrl) {
                    modelCtrl.$parsers.push(function(inputValue) {
                        if (inputValue === undefined) return '';
                        var onlyNumeric = inputValue.replace(/[^a-zA-Z0-9 ]/g, '');
                        if (onlyNumeric !== inputValue) {
                            modelCtrl.$setViewValue(onlyNumeric);
                            modelCtrl.$render();
                        }
                        return onlyNumeric;
                    });
                }
            };
        }

        function repeatedLetter () {
            return {
                require: 'ngModel',
                link: function(scope, element, attrs, modelCtrl) {
                    modelCtrl.$parsers.push(function(inputValue) {
                        if (inputValue === undefined) return '';
                        var onlyNumeric = inputValue.replace(/([a-zA-Z])\1{2,}/g, '');
                        if (onlyNumeric !== inputValue) {
                            modelCtrl.$setViewValue(onlyNumeric);
                            modelCtrl.$render();
                        }
                        return onlyNumeric;
                    });
                }
            };
        }



})();