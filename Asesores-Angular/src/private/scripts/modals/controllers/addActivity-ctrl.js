( function(){
    "use strict";

    function addActivityCtrl( $uibModalInstance, title, item, $filter, $http, URLS, $q, CommonModalsSrv){

        var vm = this;

        vm.title = title;
        vm.temporaryDate="";
        vm.temporaryTime="";
        vm.temporaryAssistants="";
        vm.multipleEmailRegex=/^[\W]*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,4}[\W]*;{1}[\W]*)*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,4})[\W]*$/;
        // vm.item = item || {};
        vm.newActivity={};

        function limit( _text, _size) {
            return $filter( 'limitTo' )( _text, _size );
        }

        function setup(){
            if( item ){
                vm.timeActivity = limit( item.start, 5 ) + " - " + limit( item.end, 5 );
                vm.text = item.subject;
            }
        }

        vm.close = function(){
            $uibModalInstance.dismiss();
        };

        vm.done = function(){
            $uibModalInstance.close();
        };


        vm.submitActivity= function(){

            if(vm.temporaryDate!==""){
                vm.newActivity.date=$filter('date')(vm.temporaryDate._d,'yyyy-MM-dd');
            }
            else{
                vm.newActivity.date=$filter('date')(new Date(),'yyyy-MM-dd');
            }
            
            var res= vm.temporaryTime.split(" - ");

            vm.newActivity.startTime=res[0];
            vm.newActivity.endTime=res[1];
            

            if(vm.temporaryAssistants!==""){

                var emails = vm.temporaryAssistants.split(";");


                var temporaryObject=[];

                angular.forEach(emails, function(element){
                    if(element.length>0){
                        temporaryObject.push({email:element});
                    }
                });

                vm.newActivity.assistants=JSON.stringify(temporaryObject);
            }

            else{
                vm.newActivity.assistants=vm.temporaryAssistants;
            }
            

            $q(function( resolve, reject ){

                $http({
                    method: 'POST',
                    url: URLS.addNewActivity,
                    ignoreLoadingBar: true,
                    params:{
                        language: 'SPA'
                    },
                    data: $.param(vm.newActivity)
                })
                .then( function( _res){
                    if( _res.data.status === 1){
                        vm.done();
                        CommonModalsSrv.done("Actividad agregada correctamente");                    }
                    else{
                        vm.close();
                        CommonModalsSrv.error("Ocurrio un error al intentar agregar la actividad");
                    }
                }).catch( function () {
                    reject ( { error : 'Ha ocurrido un error' } );
                });
            });
        };

        setup();
    }

    angular.module( 'actinver.controllers' )
        .controller( 'addActivityCtrl', addActivityCtrl );


} )();
