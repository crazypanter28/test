(function () {
    "use strict";

    function ContractTypeSrv( moment ) {
        return {
            contractType :  contractType,
            sendBinnacle :  sendBinnacle
    };

        function contractType( _propia, _eligible, _discretionary  ) {
            if( _propia || _discretionary ){
                return true;
            }
        }

        function sendBinnacle( _contractType,  _sendModel , _model) {
            if( _contractType){
                _sendModel.instructionDate = moment(new Date()).format('DDMMYYYY');
                _sendModel.instructionTime =  '00:00:01';
                _sendModel.extensionNumber =  '0001';
                _sendModel.tracingKey =  '2';
                _sendModel.comments = 'Sin comentarios';
                _sendModel.instructionTimeNumber = '0001';
                _sendModel.requestType = '2';
                _sendModel.requestHour_RD = '00:00:01';
                _sendModel.requestType_RD = '2';
                _sendModel.extensionNumber_RD = '0001';
                _sendModel.userName = 'NO APLICA';
                _sendModel.instructionTimeNumber = '0001';
            }else{
                _sendModel.instructionDate = moment(_model.binnacle.date).format('DDMMYYYY');
                _sendModel.instructionTime = _model.media.type.text === 'TELEFONO' ? _model.binnacle.time + ':00' : '00:00:01';
                _sendModel.extensionNumber = _model.media.type.text === 'TELEFONO' ? _model.binnacle.phone : '0001';
                _sendModel.tracingKey = _model.media.type.id;
                _sendModel.comments = _model.binnacle.comments ? _model.binnacle.comments :'Sin comentarios';
                _sendModel.instructionTimeNumber = _model.media.type.text === 'TELEFONO' ? _model.binnacle.time + ':00' : '00:00:01';
                _sendModel.requestType =  _model.media.type.id;
                _sendModel.requestHour_RD = _model.binnacle.time ? _model.binnacle.time + ':00' : '00:00:01';
                _sendModel.requestType_RD = _model.media.type.identifier;
                _sendModel.extensionNumber_RD = _model.binnacle.phoneNumber ? _model.binnacle.phoneNumber : '0001';
                _sendModel.userName = _model.binnacle.usserName ? _model.binnacle.usserName : 'NO APLICA';
                _sendModel.instructionTimeNumber = '0001';
            }

            return _sendModel;
        }

    }
    angular.module('actinver.services')
        .service( 'contractTypeSrv', ContractTypeSrv );
})();