(function () {
    'use strict';

    function clientInfoModalCtrl($timeout, $uibModalInstance, CommonModalsSrv, clientInfo, binnacleBirthdaysSrv) {
        var vm = this;

        vm.reminder = {};
        vm.sent_reminder = false;
        vm.info = clientInfo.info;
        vm.reminder.congratulation = false;

        vm.sendReminder = function () {
            vm.sent_reminder = true;
            var sendModel = vm.reminder;

            var modelTemp = {
                language: 'SPA',
                nameClient: clientInfo.info.name,
                contract: clientInfo.info.contract,
                phoneNumber: clientInfo.info.phoneNumber,
                message: sendModel.message,
                subject: sendModel.subject,
                email: clientInfo.info.email
                //email:'jlmartineza@actinver.com.mx'

            };


            //PENDIENTE
            binnacleBirthdaysSrv.sendMessage(modelTemp).then(function (_response) {

                if (_response.status === 1) {
                    CommonModalsSrv.done("El mensaje se ha enviado exitosamente.");
                } else if (_response.status === 2) {
                    CommonModalsSrv.error(_response.message[0].description);
                }
                vm.loading = false;
            }).catch(function () {
                var message = "Error al enviar el correo";
                CommonModalsSrv.error(message);
            }).finally(function () {
                vm.done();

            });




        };

        vm.close = function () {
            $uibModalInstance.dismiss();
        };

        vm.done = function () {
            $uibModalInstance.close();
        };

    }

    angular
        .module('actinver.controllers')
        .controller('clientInfoModalCtrl', clientInfoModalCtrl);

})();
