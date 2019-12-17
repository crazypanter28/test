(function () {
    "use strict";

    function messagesCtrl(userConfig, MessagesSrv, CommonModalsSrv,modalActivity,$uibModal) {

        var vm = this;
        vm.uploaderOptions = [
            { formats: ["image/png", "image/jpeg", "image/jpg"], size: 2097152 },
            { formats: ["application/pdf"], size: 10485760 }
        ];
        vm.resetFile = false;
        vm.modal = false;
        vm.fieldSearch = "";
        vm.messages = [];

        function setup() {
            setupVars();
            vm.getDatedMessages();
        }

        vm.messageInfo = function (message){
            modalActivity.notice(message);
        };

        vm.previewFile = function (_blob, _file) {
            vm.model.file = _file;
        };

        vm.errorFile = function (_error) {
            vm.model.file = false;
            CommonModalsSrv.warning(_error);
        };

        vm.cleanFields = function () {
            vm.model = {};
            vm.model.file = false;
            vm.resetFile = true;
        };

        vm.filter = function (condition) {
            return function (record) {
                var creacion = moment(record.creationDate).format("yyyy-MM-dd HH:mm");
                var expiracion = moment(record.expirationDate).format("YYYY-MM-DD");
                if(record.userCode.toUpperCase().includes(condition.toUpperCase()))
                    return true;
                if(record.message.toUpperCase().includes(condition.toUpperCase()))
                    return true;
                if (creacion.includes(condition) || expiracion.includes(condition) )
                    return true;
                return false;
            };
        };

        vm.done = function () {

            if (vm.model.file) {
                MessagesSrv.saveMessageImg(userConfig.user.employeeID, vm.model, vm.model.file)
                    .then(function (result) {
                        if (result.success) {
                            $uibModal.open({
                                templateUrl: '/scripts/modals/views/commons/done.html',
                                size: 'sm',
                                windowClass : 'commons done',
                                controller: 'doneModalCtrl',
                                backdrop: 'static',
                                keyboard : false,
                                controllerAs: 'done',
                                resolve:{
                                    message: function(){
                                        return result.data.messages[0].description;
                                    }
                                }
                             }).closed.then(function(){
                                vm.getDatedMessages();
                                vm.cleanFields();
                            });
                        } else {
                            CommonModalsSrv.error('Se Encontró Un Error Favor De Intentarlo Más Tarde, Comuníquese Con Su Help desk');
                            vm.cleanFields();
                        }
                    });
            } else {

                vm.model.file = {
                    formData: [],
                    disabledMultipart: false,
                    method: 'POST',
                    alias: 'file',
                };

                MessagesSrv.saveMSG(userConfig.user.employeeID, vm.model)
                    .then(function (result) {
                        $uibModal.open({
                            templateUrl: '/scripts/modals/views/commons/done.html',
                            size: 'sm',
                            windowClass: 'commons done',
                            controller: 'doneModalCtrl',
                            backdrop: 'static',
                            keyboard: false,
                            controllerAs: 'done',
                            resolve: {
                                message: function () {
                                    return result.msg;
                                }
                            }
                        }).closed.then(function () {
                            vm.getDatedMessages();
                            vm.cleanFields();
                        });
                    }).catch(function () {
                        CommonModalsSrv.error('Se Encontró Un Error Favor De Intentarlo Más Tarde, Comuníquese Con Su Help desk');
                    });
            }
        };

        vm.getDatedMessages= function(){
            vm.fieldSearch="";
            vm.modal = true;
            MessagesSrv.getDatedMessages(vm.startDate,vm.endDate)
            .then(function(_res){
                vm.messages=_res;
                vm.modal = false;
            }).catch(function(){
                vm.modal = false;
            });
        };

        function setupVars() {
            vm.title = "Crea un nuevo mensaje";
            vm.model = {};
            vm.endDate= new Date();
            vm.startDate = new Date(vm.endDate.getFullYear(),vm.endDate.getMonth(),1);

        }

        setup();
    }

    angular.module('actinver.controllers')
        .controller('messagesCtrl', messagesCtrl);
})();
