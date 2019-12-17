(function () {
    'use strict';

    function prospectActivity(CommonModalsSrv, prospectModalsSrv, prospectSrv, $sessionStorage ) {

        function link(scope) {
            
            scope.edit = function () {
                prospectModalsSrv.addActivity('Modificar actividad', scope.ngModel).result.then(function () {
                    CommonModalsSrv.done('La actividad se actualizo de manera exitosa.');
                    scope.$emit('updateDetailProspect');
                });
            };

            scope.complete = function () {
                CommonModalsSrv.warning('¿Esta seguro que desea completar la actividad seleccionada?').result.then(function () {
                    prospectSrv.completeActivity(scope.ngModel.idActivityStage).then(function () {
                        CommonModalsSrv.done('La actividad se completo de manera exitosa.');
                        scope.$emit('updateDetailProspect');
                    });
                });
            };

            scope.close = function () {
                var user = JSON.parse($sessionStorage.user);
                CommonModalsSrv.warning('¿Deseas eliminar esta actividad?').result.then(function () {

                    var modelRemove = {
                        language: 'SPA',
                        idActivityStage: scope.ngModel.idActivityStage,
                        mail: user.mail,
                        temp: '',
                        sendNotification: true,
                        outlookId: scope.ngModel.outlookId
                    };
                    prospectSrv.removeActivity(modelRemove).then(function () {
                        CommonModalsSrv.done('La actividad se eliminó de manera exitosa.');
                        scope.$emit('updateDetailProspect');
                    });
                });
            };
        }

        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '/scripts/directives/prospect-activity/activity.html',
            scope: {
                ngModel: '=',
                hiddeTool:'=?'
            },
            link: link,
        };

    }

    angular
        .module('actinver.directives')
        .directive('prospectActivity', prospectActivity);

})();
