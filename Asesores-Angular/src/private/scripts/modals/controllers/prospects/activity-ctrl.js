(function () {
    "use strict";

    function addActivityProsModalCtrl($uibModalInstance, title, activity, $scope, prospectSrv, userConfig, $stateParams, $filter, SectionActivitySrv )  {
        var vm = this;
        vm.title = title || 'NUEVA ACTIVIDAD';

        function setup() {
            setupVars();
            getStageProspect();
            setActivity();
            getOptions(activity.contactType);
        }

        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };

        function refactorDropdowns(_model, _property) {
            var idActivity = '';
            _model.forEach(function (_val) {
                idActivity = (_val.description === _property) ? _val.idActivity : 1;
            });
            return idActivity;
        }

        function getOptions( _description) {
            SectionActivitySrv.getMedia().then(function (_options) {
                vm.idActivity = refactorDropdowns(_options,_description);
            });
        }

        vm.saveActivity = function () {
            console.log("userConfig:",userConfig);
            console.log("vm.detailProspect:",vm.detailProspect);
            console.log("vm.varsActivity:",vm.varsActivity);
            console.log("activity:",activity);
            //return;

           $scope.$broadcast('updateDetailProspect');   
            var timeActivity = vm.varsActivity && vm.varsActivity.activity && vm.varsActivity.activity.time ? vm.varsActivity.activity.time.split('-') : ['', ''];
                                           
            if (vm.title === 'NUEVA ACTIVIDAD') {
                var _activity = {
                    language        : 'SPA',
                    idProspect      : $stateParams.id,
                    idEmployee      : userConfig.user.employeeID,
                    idStage         : vm.detailProspect.idStage,
                    contactDate     : vm && vm.varsActivity.activity && vm.varsActivity.activity.date ? $filter('date')(vm.varsActivity.activity.date._d, 'yyyy-MM-dd') : '',
                    idActivity      : vm.varsActivity.activity.media.idActivity,
                    startTime       : timeActivity[0].replace(/ /g,''),
                    endTime         : timeActivity[1].replace(/ /g,''),
                    notes           : vm && vm.varsActivity && vm.varsActivity.activity && vm.varsActivity.activity.note ? vm.varsActivity.activity.note : '',
                    mail            : userConfig.user.mail,
                    temp            : '',
                    subject         : vm && vm.varsActivity && vm.varsActivity.activity && vm.varsActivity.activity.affair ? vm.varsActivity.activity.affair : '',
                    location        : vm && vm.varsActivity && vm.varsActivity.activity &&  vm.varsActivity.activity.place ? vm.varsActivity.activity.place : '',
                    name            : activity.name,
                    prospectMail    : activity.mail,
                    sendNotification: vm && vm.varsActivity && vm.varsActivity.activity && vm.varsActivity.activity.notify ? vm.varsActivity.activity.notify   : false 
                };
                prospectSrv.saveActivity(_activity).then(function () {
                    $uibModalInstance.close();
                });
            }else {

                var _activity_update = {
                    language        : 'SPA',
                    idActivityStage : activity.idActivityStage,
                    contactDate     : vm && vm.varsActivity.activity && vm.varsActivity.activity.date ? $filter('date')(vm.varsActivity.activity.date._d, 'yyyy-MM-dd') : '',
                    idActivity      : (typeof vm.varsActivity.activity.media.idActivity === 'undefined') ? vm.idActivity : vm.varsActivity.activity.media.idActivity,
                    startTime       : timeActivity[0].replace(/ /g,''),
                    endTime         : timeActivity[1].replace(/ /g,''),
                    notes           : vm && vm.varsActivity && vm.varsActivity.activity && vm.varsActivity.activity.note ? vm.varsActivity.activity.note : '',
                    mail            : userConfig.user.mail,
                    temp            : '',
                    subject         : vm && vm.varsActivity && vm.varsActivity.activity && vm.varsActivity.activity.affair ? vm.varsActivity.activity.affair : '',
                    location        : vm && vm.varsActivity && vm.varsActivity.activity &&  vm.varsActivity.activity.place ? vm.varsActivity.activity.place : '',
                    name            : activity.prospectDetail.nombreProspecto,
                    prospectMail    : activity.prospectDetail.mailProspect,
                    sendNotification: vm && vm.varsActivity && vm.varsActivity.activity && vm.varsActivity.activity.notify ? vm.varsActivity.activity.notify   : false,
                    outlookId       : activity.outlookId
                };

                prospectSrv.updateActivity(_activity_update).then(function () {
                    $uibModalInstance.close();
                });
            }
            
        };

        function getStageProspect(){
            prospectSrv.getStageProspect(userConfig.user.employeeID,$stateParams.id).then(function( _prospect ) {
                vm.detailProspect = _prospect;
                getDetailProspect();
            });
            
        }

        function getDetailProspect() {
            prospectSrv.getDetailProspect($stateParams.id,vm.detailProspect.idStage)
                .then(function (_res) {
                    vm.prospectDetail = _res;
                });
        }

        function setActivity() {
            if (activity) {
                vm.varsActivity = {
                    activity: {
                        type: activity.contactType,
                        note: activity.notes,
                        place: activity.location,
                        affair: activity.subject,
                        time: activity.schedule,
                        date: activity.date,
                        agendar : (activity.subject || activity.location ) ? true : false,
                        media: {
                            "description": activity.contactType,
                             "text": activity.contactType
                        }
                    }
                };
                vm.varsActivity.activity.date =  activity.date ? moment(activity.date) : moment();
            }
            return '';
        }


        function setupVars() {
            $scope.dateConfiguration = {
                singleDatePicker: true
            };
            vm.configdate ={            
                singleDatePicker: true,
                //initDate: activity.date ? activity.date : moment(),                
                minDate: moment(),
                maxDate : activity.closeDate,
                locale: {
                    format: "DD/MM/YYYY"
                }            
            };
        }


        setup();

    }

    angular.module('actinver.controllers')
        .controller('addActivityProsModalCtrl', addActivityProsModalCtrl);

})();
