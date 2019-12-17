(function () {
    "use strict";

    function sectionActivity(SectionActivitySrv) {
        
        function link(scope ) {

            function setup() {
                if (!scope.ngModel) {
                    scope.ngModel = {
                        activity: {}
                    };
                }
                if (!scope.ngConfigdate) {
                    scope.ngConfigdate = {
                        locale: {
                            format: "DD/MM/YYYY"
                        },
                        singleDatePicker: true
                    };
                }

                scope.options = {
                    locale: {
                        format: "DD/MM/YYYY"
                    },
                    singleDatePicker: true
                };

                getOptions();
            }

            scope.changeDateActivity = function (_date) {
                scope.ngModel.activity.date = _date;
            };

            function refactorDropdowns(_model, _property) {
                return R.map(function (_val) {
                    _val.text = _val[_property];
                    return _val;
                }, _model);
            }

            function getOptions() {
                SectionActivitySrv.getMedia().then(function (_options) {
                    scope.optionsDropdowm = refactorDropdowns(_options, 'description');
                });
            }

            setup();

        }


        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/scripts/directives/section-activity/section.html',
            link: link,
            scope: {
                ngModel: '=',
                ngConfigdate: '=?'
            },
        };

    }

    angular
        .module('actinver.directives')
        .directive('sectionActivity', sectionActivity);
})();
