(function () {
    "use strict";

    function reportoLetterModalCtrl( $uibModalInstance, operation, operDate, holder, mailConfirm, userConfig, accountSrv, reportoLetterModalSrv, CommonModalsSrv, FileSaver, ErrorMessage ) {
        var vm = this;
        vm.mailTo = [];
        vm.mailConfirm = mailConfirm;
        vm.contract = JSON.parse(localStorage.getItem('contractSelected'));
        
        vm.close = function() {
            $uibModalInstance.close();
        };

        vm.confirmMail = function() {
            if(vm.mailTo.length == 0) {
                var _typeContract = JSON.parse(localStorage.getItem('contractSelected')).bankingArea;
                var _model = {
                    contractNumber: vm.contract.contractNumber,
                    bankingArea: _typeContract
                };

                accountSrv.getContractInfoDetail(_model).then(function (_res) {
                    if (_res.holder.emailList.email.length === 0) {
                        CommonModalsSrv.error("No tiene correos asignados");
                        vm.mailConfirm = false;
                    } else {
                        angular.forEach(_res.holder.emailList.email, function (item, key) {
                            vm.mailTo.push(item.toLowerCase());
                        });
                        
                        vm.mailConfirm = true;
                    }
                }).catch(function (_res) {
                    CommonModalsSrv.error(ErrorMessage.createError(_res));
                });
            } else {
                vm.mailConfirm = true;
            }
        };
        
        vm.getPdf = function() {
            $uibModalInstance.close();

            var pdfParams = {
                'language': 'SPA',
                'contractNumber': vm.contract.contractNumber,
                'operationID': operation,
                'operationDate': operDate,
                'holder': holder,
                'adviser': userConfig.user.name
            };

            reportoLetterModalSrv.getConfirmLtr(pdfParams).then( 
                function(_res) {
                    if (_res.success) {
                        FileSaver.saveAs(b64Decoder(_res.info, 'application/zip'), 'Carta_Confirmacion.zip');
                        CommonModalsSrv.done("Descarga exitosa!");
                    }
                    else {
                        CommonModalsSrv.error(_res.info);
                    }
                }).catch( 
                    function(_err) {
                        CommonModalsSrv.error(_err.info);
                });           
        };

        vm.sendMail = function() {
            $uibModalInstance.close();
            
            var mailParams = {
                'language': 'SPA',
                'emailFrom': 'info@actinver.com.mx',
                'idTemplate': 'buildDBTemplate|19',
                'emailSubject': 'Carta Confirmación Reporto',
                'mailTo': vm.mailTo,
                'mailCC': '',
                'contractNumber': vm.contract.contractNumber,
                'operationID': operation,
                'operationDate': operDate,
                'holder': holder,
                'adviser': userConfig.user.name
            };
            
            reportoLetterModalSrv.sendEmail(mailParams).then( 
                function(_res) {
                    if (_res.success) {
                        CommonModalsSrv.done(_res.info);
                    }
                    else {
                        CommonModalsSrv.error(_res.info);
                    }
                }).catch( 
                    function(_res) {
                        CommonModalsSrv.error(_res.info);
                });
        };

        function b64Decoder(base64, contentType) {
            var file = null;

            if(base64) {
                var tempCharArr = atob(base64);
                var tempNumbArr = new Array(tempCharArr.length);
                
                for (var i = 0; i < tempCharArr.length;i++){
                    tempNumbArr[i] = tempCharArr.charCodeAt(i);
                }

                var byteArrayArr = [];
                var tempByteArr = new Uint8Array(tempNumbArr);
                byteArrayArr.push(tempByteArr);
                file = new Blob(byteArrayArr, {type: contentType});
            }
           
            return file;
        }
    }

    angular.module('actinver.controllers')
           .controller('reportoLetterModalCtrl', reportoLetterModalCtrl);
})();