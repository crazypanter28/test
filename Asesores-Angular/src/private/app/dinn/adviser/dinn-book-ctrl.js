(function () {
    "use strict";

    function dinnBookCtrl(dinnSrv, $stateParams, PresentationSrv, $uibModal, $state) {
        var vm = this;
        vm.informationDate;

        function setup() {
            vm.informationDate = $stateParams.informationDate;
            console.log('vm.informationDate',vm.informationDate);
            if(vm.informationDate === null){
                $state.go('dinn.show');
            }else{
                getDCDocumentQueryByClient(vm.informationDate.clientId);
                hardCode();
            }
        }

        function hardCode() {
            vm.informationDate.contactType ="Visita a CF";
            if (vm.informationDate.branchID === "0") {
                vm.informationDate.brancheName = "Julio Verne";
            } else if (vm.informationDate.branchID === "1") {
                vm.informationDate.brancheName = "Montes Urales";
            } else if (vm.informationDate.branchID === "2") {
                vm.informationDate.brancheName = "Corporativo Santa Fe";
            } else if(vm.informationDate.branchID === "-1"){
                vm.informationDate.contactType ="Llamada" || vm.informationDate.phoneNumber !== null || vm.informationDate.otherPhoneNumber !== null;
            }

            if (vm.informationDate.clientStatus === 1) {
                vm.informationDate.statusType = "Registrado";
            } else if (vm.informationDate.clientStatus === 2) {
                vm.informationDate.statusType = "Cita agendada";
            }else if (vm.informationDate.clientStatus === 3) {
                vm.informationDate.statusType = "Llamada agendada";
            }

            var date = new Date(vm.informationDate.interviewTime);
            var hours = date.getHours() === 0 ? '00' : date.getHours();
            var minute = date.getMinutes() === 0 ? '00' : date.getMinutes();
            vm.informationDate.dateHour = hours + ':' + minute+ ' Hrs.';
        }

        vm.getDocument = function (_id) {
            PresentationSrv.getPresentationsFile(_id).then(function () { });
        };

        function getDCDocumentQueryByClient(_clientId) {
            dinnSrv.getDCDocumentQueryByClient(_clientId)
                .then(function (_reponse) {
                    if (Array.isArray(_reponse)) {
                        vm.documentInfo = _reponse;
                    }
                }).catch(function () {});
        }

        vm.dCDocumentQuery = function (_documentID) {
            dinnSrv.getDCDocumentQuery(_documentID.documentID)
                .then(function (_reponse) {
                    var base64 = atob(_reponse);

                    if (base64.includes('data:application/pdf;base64')) {
                        var dlnk = document.getElementById('dwnldLnk');
                        dlnk.href = base64;
                        dlnk.click();
                    } else if (base64.includes('data:image/jpeg;base64')) {
                        $uibModal.open({
                            templateUrl: '/app/dinn/adviser/dinnImage.html',
                            controller: 'dinnImageCtrl',
                            controllerAs: 'image',
                            size: 'lg',
                            resolve: {
                                dataResolve: function () {
                                    return { image: base64, title: _documentID.documentTypeDesc };
                                }
                            }
                        });
                    }
                }).catch(function () { });
        };

        setup();
    }

    angular
        .module('actinver.controllers')
        .controller('dinnBookCtrl', dinnBookCtrl);

})();
