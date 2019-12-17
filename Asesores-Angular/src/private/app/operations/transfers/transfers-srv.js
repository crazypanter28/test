(function() {
    "use strict";

    function transfersSrv($http, $q, URLS, csrfSrv, $filter) {

        /**
         *  Login service user and password are required
         */
        function Transfers(){}

        Transfers.prototype.getBalance = function ( _id ) {
            var currency = 0;
            var settlementKey = 1;
            return $http({
                method: 'GET',
                url: URLS.getBalance + _id +'/'+currency+'/'+settlementKey +'?language=SPA'
            });
        };

        Transfers.prototype.getAccounts = function( _id ) {
            return $http({
                method: 'GET',
                url: URLS.getAccounts + _id + '/0/1/',
            });
        };


        Transfers.prototype.makeTransfer = function( _infoTransfer, date, _clientId, _user) {
                var time = $filter('date')(date, 'yyyy/dd/MM' );
                var dateNow = $filter('date')(date, 'HH:mm:ss' );
                var originAccount = _infoTransfer.contract.companyName;
                var destinationAccount =_infoTransfer.transfer.account.companyName ;
                var _destinationAccountTypeID;
                var _contract = _infoTransfer.transfer.account.contractNumber;

                if(originAccount === 'Casa' && destinationAccount === 'Casa' || originAccount === 'Banco' && destinationAccount === 'Banco'){
                    _destinationAccountTypeID = '01';
                }else if(originAccount === 'Casa' && destinationAccount === 'Banco' || originAccount === 'Banco' && destinationAccount === 'Casa'){
                    _destinationAccountTypeID = '04';
                }else if(_infoTransfer.transfer.account.destinationAccountType === 1){
                    _destinationAccountTypeID = '02';
                    _contract =  _infoTransfer.transfer.account.accountNumber;
                }else{
                    _destinationAccountTypeID = '03';
                    _contract =  _infoTransfer.transfer.account.accountNumber;
                }

                var _json = {
                    Contrato: _infoTransfer.contract.contractNumber,
                    Movimiento: 'Retiro',
                    Importe:  _infoTransfer.transfer.import,
                    Concepto: _infoTransfer.transfer.concepto
                };
                _json = JSON.stringify(_json);

                var json= {
                    businessType: _infoTransfer.contract.companyName === 'Casa' ? '02' : '01', // _infoTransfer.transfer.bank, 01=Banco 02=Casa
                    destinationAccountTypeID: _destinationAccountTypeID, // Tipo de transferencia
                    clientID: _clientId, //Cliente unico
                    contractNumber: _infoTransfer.contract.contractNumber, //Contrato origen
                    name: _user,                    
                    beneficiaryName:  (_infoTransfer.transfer.account.alias && _infoTransfer.transfer.account.alias !=="") ? _infoTransfer.transfer.account.alias : _infoTransfer.transfer.account.beneficiaryName , //opcional para terceros
                    destinationAccount: _contract, //accountNumber
                    amount: _infoTransfer.transfer.import, //Cantidad a transferir
                    currency: 1,
                    transferDetails: _infoTransfer.transfer.concepto, //Detalles capturados por cliente
                    notificationFlag: 0,
                    comments:  _infoTransfer.transfer.binnacle.observation,
                    instructionDate: dateNow,
                    instructionTime: time,
                    sPEIReference: '1',
                    bankID : _infoTransfer.transfer.account.bankID,
                    extensionNumber: _infoTransfer.transfer.media.text === 'TELEFONO' ? _infoTransfer.transfer.media.phone : null,
                    tracingKey: _infoTransfer.transfer.media.id,
                    jsonDetails: _json
                };

                return $q(function( resolve, reject ){
                    csrfSrv.csrfValidate()
                        .then(successCsrf)
                        .catch(errorCsrf);
                    function successCsrf() {
                        $http({
                            method: 'POST',
                            url: URLS.makeTransfer,
                            data: $.param(json),
                        })
                            .then(function( _res ){
                                resolve( _res.data );
                            });
                    }
                    function errorCsrf(error) {
                        reject(error);
                    }
                });
        };

        Transfers.prototype.makeTransferOtherAccount = function( _infoTransfer, date, _clientId, _user) {
            var time = $filter('date')(date, 'ddMMyyyy' );
            var dateNow = $filter('date')(date, 'HH:mm:ss' );

            var _json = {
                Contrato: _infoTransfer.contract.contractNumber,
                Movimiento: 'Retiro',
                Importe:  _infoTransfer.transfer.import,
                Concepto: _infoTransfer.transfer.concepto
            };
            _json = JSON.stringify(_json);

            var json= {
                contractNumber : _infoTransfer.contract.contractNumber, //Contrato origen
                amount :_infoTransfer.transfer.import, //Cantidad a transferir
                CLABE: _infoTransfer.transfer.account.bankAccounts.clabe ? _infoTransfer.transfer.account.bankAccounts.clabe : _infoTransfer.transfer.account.bankAccounts.accountNumber,
                observations: _infoTransfer.transfer.concepto, //Detalles capturados por cliente
                name : _user,
                transactionDate: time,
                transactionTime : dateNow,
                extensionNumber : _infoTransfer.transfer.media.text === 'TELEFONO' ? _infoTransfer.transfer.media.phone : null,
                key : _infoTransfer.transfer.media.id,
                comments : _infoTransfer.transfer.binnacle.observation,
                tracingKey: _infoTransfer.transfer.media.id,
                jsonDetails: _json
            };

            return $q(function( resolve, reject ){
                csrfSrv.csrfValidate()
                    .then(successCsrf)
                    .catch(errorCsrf);
                function successCsrf() {
                    $http({
                        method: 'POST',
                        url: URLS.makeTransferOtherAccount,
                        data: $.param(json),
                    }).then(function( _res ){
                        resolve( _res.data );
                    });
                }
                function errorCsrf(error) {
                    reject(error);
                }
            });
        };

        Transfers.prototype.getOtherAccounts = function( _contract, _clientId ) {
            var _type = _contract.companyName === 'Casa' ? '02' : '01'; //01 banco, 02 casa
            return $http({
                method: 'GET',
                url: URLS.getOtherAccounts + _type + '/' + _clientId + '/' +  _contract.contractNumber  + '?language=SPA&accountStatus=1',
            });
        };


        Transfers.prototype.getTransfers = function( _id , _contractType) {
            var _type =   _contractType === 'Casa' ? '02' : '01';
            var date= new Date();
            var day = date.getDate() < 10 ? '0'+date.getDate() : date.getDate();
            var month = (date.getMonth()+1) < 10 ? '0'+ (date.getMonth() +1 ) : (date.getMonth() +1);
            //var monthB = (date.getMonth()+1) < 10 ? '0'+ (date.getMonth() -1 ) : (date.getMonth() -1);
            var stringDate = day  +'' + month +''+ date.getFullYear();
            //var stringLastDate = day  +'' + monthB +''+ date.getFullYear();

            return $http({
                method: 'GET',
                url: URLS.getTransfers + _id  + '/' + stringDate + '/' + stringDate + '/' + _type +'?language=SPA',
            });
        };


        Transfers.prototype.getMedia = function( ) {
            return $http({
                method: 'GET',
                url: URLS.getMedia,
            });
        };

        Transfers.prototype.getMediaBnak = function( ) {
            return $http({
                method: 'GET',
                url: URLS.getMediaBank + '?language=SPA'
            });
        };


        Transfers.prototype.getBankContractSPEIMovementsQuery = function( _model) {
            return $http({
                method: 'GET', 
                url: URLS.getBankContractSPEIMovementsQuery,
               // url:URLS.getTemporal,
                params:{
                    contractNumber:_model.contractNumber,
                    bankingArea:_model.bankingArea,
                    requirementFlag:_model.requirementFlag,
                    language:'SPA'

                } 
            });
        };

        return new Transfers();
    }

    angular.module('actinver.services')
        .service('transfersSrv', transfersSrv);
})();
