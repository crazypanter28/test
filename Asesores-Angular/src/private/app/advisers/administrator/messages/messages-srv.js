(function () {
    "use strict";

    function MessagesSrv(URLS, $q, $http, ErrorMessagesSrv, csrfSrv, $filter) {
        /**
         *  prospect service
         */
        function Messages() { }

        Messages.prototype.getMessages = function () {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getMessages,
                    params: {
                        language: 'SPA'
                    }
                }).then(function (response) {
                    if (!!response.data.status) {
                        resolve(response.data.result);
                    }
                    else {
                        ErrorMessagesSrv(response.data.messages);
                        resolve();
                    }
                }).catch(reject);
            });
        };

        Messages.prototype.getDatedMessages= function(start,end){

            var _beginDate = $filter('date')(start,'yyyyMMdd');
            var _endDate = $filter('date')(end,'yyyyMMdd');

            if(start._d){
                _beginDate =  moment(start._d).format("YYYYMMDD");
            }
            if(end._d){
                _endDate =  moment(end._d).format("YYYYMMDD");
            }



            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getAllMessagesByRange + _beginDate + "/" + _endDate,
                    params: {
                        language: 'SPA'
                    }
                }).then(function (response) {
                    if (response.data.status===1) {
                        resolve(response.data.result);
                    }
                    else {
                        ErrorMessagesSrv(response.data.messages);
                        resolve([]);
                    }
                }).catch(reject);
            });
        };

        Messages.prototype.getMessageDetail=function(idEmployee,idMessage){
            return $q(function(resolve,reject){
                $http({
                    method:'POST',
                    url:URLS.getMessageDetail,
                    params:{
                        language:'SPA'
                    },
                    data:$.param({
                        idEmployee:idEmployee,
                        idMessage:idMessage
                    })
                }).then(function(response){
                    if(response.data.status===1){
                        resolve(response.data.result[0]);
                    }
                    else{
                        ErrorMessagesSrv(response.data.messages);
                        reject();                        
                    }

                }).catch(reject);
            });
        };

        Messages.prototype.saveMessageImg = function (idEmployee, _model, file) {
            return $q(function (resolve, reject) {

                csrfSrv.csrfValidate()
                    .then(successCsrf)
                    .catch(errorCsrf);

                function successCsrf() {
                    file.url = URLS.messageRegistration;
                    file.alias = 'file';
                    file.formData.push({ idEmployee: idEmployee });
                    file.formData.push({ message: _model.message });
                    file.formData.push({ descriptionMessage: _model.descriptionMessage });
                    file.formData.push({ expirationDate: moment(_model.expirationDate).format("DDMMYYYY") });
                    if(_model.destinations!==undefined){
                        file.formData.push({ destinations: _model.destinations });
                    }
                    file.formData.push({ language: 'SPA' });

                    file.upload();
                    file.onSuccess = function (msg) {
                        resolve({ success: true, data: msg });
                    };
                    file.onError = function () {
                        resolve({ success: false, data: null });
                    };
                }

                function errorCsrf(error) {
                    reject(error);
                }

            });
        };

        Messages.prototype.saveMSG = function(idEmployee,_model){

            var temporaryFormData = new FormData();

            temporaryFormData.append('idEmployee',idEmployee);
			temporaryFormData.append('file',undefined);
            temporaryFormData.append('message', _model.message);
            temporaryFormData.append('descriptionMessage', _model.descriptionMessage);
            temporaryFormData.append( 'expirationDate',moment(_model.expirationDate).format("DDMMYYYY") );
            temporaryFormData.append('language','SPA');
            if(_model.destinations!==undefined){
                temporaryFormData.append('destinations', _model.destinations);
            }


            return $q(function(resolve,reject){
                $http({
                    method:'POST',
                    url:URLS.messageRegistration,
                    data:temporaryFormData,
                    headers:{
                        'Content-Type': undefined,
                        'ocupateMyHeader': true
                    }
                }).then(function(response){
                    resolve({ success: true, msg : response.data.messages[0].description });
                }).catch(function(){
                    reject({ success: false });
                });
            });
        };
        


        return new Messages();
    }

    angular.module('actinver.services')
        .service('MessagesSrv', MessagesSrv);
})();