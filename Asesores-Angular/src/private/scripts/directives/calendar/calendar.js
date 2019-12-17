(function(){
    "use strict";

    function actCalendar( modalActivity, CommonModalsSrv, CalendarSrv, userConfig, $filter, binnacleModalSrv, $uibModal ){

        var link = function( scope ){

            function setup(){
                loadBirthDays();
                loadMessages();
                loadAppointments( new Date() );
                scope.tooltip={
                    data: false
                };
            }


            function loadAppointments( _date ){
                scope.appointmentFilterIsToday=true;
                var newDate = $filter('date')( _date, 'yyyy-MM-dd');
                var modelAppointments = {
                    languaje: 'SPA',
                    mail    : userConfig.user.mail,
                    date    : newDate,
                    temp    : ''
                };
                CalendarSrv.getAppointments(  modelAppointments ).then(function(_res){
                    scope.appointments = _res;
                }).catch( function () {
                    scope.appointments = [];
                    //console.error( 'Error de parametros' );
                });
            }

            scope.appointmentFilterIsToday=true;

            scope.toggleAppointmentFilter= function(){
                if(scope.appointmentFilterIsToday){
                    scope.updateCalendar();
                    scope.appointmentFilterIsToday=!scope.appointmentFilterIsToday;
                }
                else{
                    scope.updateCalendar();
                }
            };

            scope.isInAppointmentFilter= function(appointment){
                if(appointment.group==="Today" && scope.appointmentFilterIsToday){
                    return appointment;
                }
                else{
                    if(appointment.group!=="Today" && scope.appointmentFilterIsToday===false){
                        return appointment;
                    }
                }
            };

            function concantWeeks( _weeks ){
                return R.concat(
                    R.concat( _weeks.lastWeek, _weeks.currentWeek  ),
                    _weeks.nextWeek
                );
            }

            function loadBirthDays(){
                CalendarSrv.getMessages( 'BirthDays', userConfig.user.employeeID ).then(function(_res){
                    scope.birthdaysCurrentWeek = _res.currentWeek;
                    scope.BirthDays = concantWeeks( _res );
                });
            }

            function loadMessages(){
                CalendarSrv.getMessages( 'messages', userConfig.user.employeeID ).then(function(_res){
                    scope.messages = _res;
                });
            }


            scope.updateCalendar = function(){
                loadAppointments( scope.dateCalendar );
            };


            scope.addActivity=function(){

                var modalInstance = $uibModal.open({
                    templateUrl: '/scripts/modals/views/activity/add.html',
                    controller: 'addActivityCtrl',
                    controllerAs: 'activity',
                    resolve: {
                        title: function () {
                            return 'Agregar Actividades del día';
                        },
                        item: function(){
                            return undefined;
                        }
                    }
                }).closed.then(function(){
                    scope.updateCalendar();
                });
            };

            //scope.addActivity= R.curry( modalActivity.addActivity)( 'Agregar Actividades del día' );
            scope.editActivity= R.curry( modalActivity.addActivity)( 'Editar Actividades del día' );
            scope.notice=  modalActivity.notice;
            scope.deleteActivity= CommonModalsSrv.warning;


            scope.showNotice= function(message){
                CalendarSrv.getMessageDetail(userConfig.user.employeeID, message.idMessage)
                    .then(function(result){
                    modalActivity.notice(result).closed.then(function(){
                        loadMessages();
                    });
                });
            };

            scope.more = function(){
                scope.mores = true;
            };

            scope.close = function(){
                scope.mores = false;
            };

            scope.showClientInfo = function (client){               
              
                var message='';
                var _error='';

                CalendarSrv.getClientDetail(client.contract, client.origen.trim())
                .then(function(result){
                    if(result.outCommonHeader.result.result === 2){
                        _error=result.outCommonHeader.result.messages;
                       angular.forEach(_error, function (_res) {
                           if (_res.responseMessage) {
                               message += _res.responseMessage + '<br>';
                           }
                       });
                       CommonModalsSrv.error(message);
                       return;
                   }
  
                if( result.outClientOrContractClientInfoQuery && result.outClientOrContractClientInfoQuery.client && result.outClientOrContractClientInfoQuery.client.length != 0
                  && result.outClientOrContractClientInfoQuery.client[0].email.length != 0 ){
                   client.email = result.outClientOrContractClientInfoQuery.client[0].email[0].email;
                   client.phoneNumber =  result.outClientOrContractClientInfoQuery.client[0].telephoneData.length != 0 ? Number(result.outClientOrContractClientInfoQuery.client[0].telephoneData[0].phoneNumber) : '';
                   binnacleModalSrv.showClientInfo( client );
                }else{
                    CommonModalsSrv.error('No se encontró información del cliente.');
                }

                }, function (error) {
                    CommonModalsSrv.error(error.msg);
                }).finally(function () {

                });

               
            };

            setup();
        };

        return {
            restrict: 'EA',
            replace: true,

            templateUrl: '/scripts/directives/calendar/calendar.html',
            scope: true,
            link : link
        };


    }


    angular.module( 'actinver.directives' )
    .directive( 'actCalendar', actCalendar );


} )();
