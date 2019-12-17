
(function () {
    "use strict";

    function dinnCtrl(dinnSrv, $filter, $state) {

        var vm = this;

        function setup() {
            vm.getDCScheduleQueryByDate();
        }

        vm.getDCScheduleQueryByDate = function () {
            if (typeof vm.dateCalendar === "undefined") {
                vm.dateCalendar = new Date();
            }

            vm.informationData = [];
            var interviewDate = $filter('date')(vm.dateCalendar, 'yyyy-MM-dd');
            var operationType = "2";

            dinnSrv.getDCScheduleQueryByDateDetails(interviewDate, operationType)
                .then(function (_response) {
                    vm.informationData = $filter('orderBy')(_response,'interviewTime');
                }).catch(function () {
                    vm.informationData = [];
                });
        };

        vm.getDetail = function (_informationDate) {
            $state.go("dinn.book", { informationDate: _informationDate });
        };

        vm.getType = function (_branchID){
            var dateType;
            var branch = _branchID.branchID;
            if(branch === "0"  || branch === "1"  || branch === "2" ){
                dateType="Visita a CF";
            }else if (branch === '-1' || branch.phoneNumber !== null || branch.otherPhoneNumber !== null){
                dateType="Llamada ";
            }

            return dateType;
            
        };

        setup();
    }

    angular
        .module('actinver.controllers')
        .controller('dinnCtrl', dinnCtrl);

})();