( function(){
    "use strict";

    function noticeActivityCtrl( $uibModalInstance, item , FileSaver){
        var vm = this;

        vm.item = item;

        b64Decoder();

        vm.close = function(){
            $uibModalInstance.dismiss();
        };



        function b64Decoder(){
            if(item.fileContent){
                var temporaryByteChar=atob(item.fileContent);
                var temporaryByteArrays=[];
                var temporaryByteNumb= new Array (temporaryByteChar.length);
                for (var i = 0 ; i<temporaryByteChar.length;i++){
                    temporaryByteNumb[i] = temporaryByteChar.charCodeAt(i);
                }

                var temporaryByteArray= new Uint8Array(temporaryByteNumb);
                temporaryByteArrays.push(temporaryByteArray);

                vm.messageFile= new Blob(temporaryByteArrays, {type:item.contentType});

                if(vm.item.contentType.search("image")!==-1){

                    vm.messageImage = "data:"+vm.item.contentType+";base64,"+item.fileContent;

                }
            }
        }


        vm.downloadFile= function(){
           FileSaver.saveAs(vm.messageFile, "adjuntoMensaje"+item.idMessage); 
        };

    }

    angular.module( 'actinver.controllers' )
        .controller( 'noticeActivityCtrl', noticeActivityCtrl );

} )();
