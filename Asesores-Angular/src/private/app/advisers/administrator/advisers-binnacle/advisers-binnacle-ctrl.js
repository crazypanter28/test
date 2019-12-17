(function () {
    "use strict";

    function advisersBinnacleCtrl($filter, administratorSrv, CommonModalsSrv, userConfig, MessagesSrv, FileSaver) {
        var vm = this;
        vm.modal = false;
        vm.search = {};
        vm.fieldSearch = "";

        function setup() {
            setupVars();

        }

        function setupVars() {
            vm.message = null;
            vm.rangeDate = null;
            vm.search.endDate = new Date();
            vm.search.startDate = new Date(vm.search.endDate.getFullYear(), vm.search.endDate.getMonth(), 1);
            getOptionsDropdowm(vm.search.startDate, vm.search.endDate);
        }

        function getOptionsDropdowm(startDate, endDate) {
            vm.modal = true;
            MessagesSrv.getDatedMessages(startDate, endDate).then(function (response) {
                vm.optionsDropdowm = buildOptionsDropdowm(response);
                vm.modal = false;
            }).catch(function () {
                vm.modal = false;
                CommonModalsSrv.error("Ocurrio un error al obtener los mensajes.");
            });
        }

        function buildOptionsDropdowm(_list) {
            _list.forEach(function (_item) {
                _item.text = _item.message;
            });
            return _list;
        }

        function b64Decoder(base64, contentType){
             var file = null;
            if(base64){
                var temporaryByteChar=atob(base64);
                var temporaryByteArrays=[];
                var temporaryByteNumb= new Array (temporaryByteChar.length);
                for (var i = 0 ; i<temporaryByteChar.length;i++){
                    temporaryByteNumb[i] = temporaryByteChar.charCodeAt(i);
                }
                var temporaryByteArray= new Uint8Array(temporaryByteNumb);
                temporaryByteArrays.push(temporaryByteArray);
                file = new Blob(temporaryByteArrays, {type:contentType});
            }
            return file;
        }

        vm.changeOptionSelectedDropdowm = function (_option) {
            vm.fieldSearch = _option.message;
            administratorSrv.getAdvisersBinnacleMessage(_option.idMessage)
                .then(
                    function (_response) {
                        vm.message = _response;                        
                    },
                    function () {
                        CommonModalsSrv.error("Ocurrio un error al obtener el mensaje seleccionado.");
                    }
                );
        };

        vm.getxlsx = function () {
            var startDate = $filter('date')(vm.rangeDate.startDate._d, 'yyyyMMdd');
            var endDate = $filter('date')(vm.rangeDate.endDate._d, 'yyyyMMdd');

            administratorSrv.getAdvisersBinnacleBinnacle(userConfig.user.employeeID, startDate, endDate);
        };

        vm.getSearchMessagesByDates = function () {
            getOptionsDropdowm(vm.search.startDate, vm.search.endDate);
            vm.message = null;
            vm.fieldSearch = "";
        };
        vm.downloadFile = function(record){
            var data = b64Decoder(record.fileContent, record.contentType);
            FileSaver.saveAs(data, "file_"+record.idMessage);
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

        setup();
    }

    angular.module('actinver.controllers')
        .controller('advisersBinnacleCtrl', advisersBinnacleCtrl);
})();
