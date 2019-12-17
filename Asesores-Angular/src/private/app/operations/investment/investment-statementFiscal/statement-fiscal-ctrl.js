( function(){
    "use strict";

    function statementFiscalCtrl( $scope, accountSrv, CommonModalsSrv, ErrorMessage, statementFiscalSrv ){
        var vm = this;

        vm.ListConstancias = getCatalogoConstancias();

        vm.ListConstanciasFiscales = [];
        vm.ListConstanciasPormenorizadas = [];
        vm.EmailConstancias = [];
        vm.contract = 0;
        vm.sendMail = sendMail;
        vm.onChangeStatementFiscal = onChangeStatementFiscal;

            init();
        function init() {
            var contract = JSON.parse(localStorage.getItem('contractSelected'));
            vm.contract = contract.contractNumber;
            //console.log("INIT: " + vm.contract);
            vm.EmailConstancias = getEmail();
        }

        function getCatalogoConstancias(){
            return [
                {id: 4, text: "Constancia Fiscal"},
                {id: 9, text: "Constancia Fiscal Pormenorizada"},
                {id: 3, text: "Estados de Cuenta"}
            ];
        }

        function getCatalogoFormatos(  ){
            return [
                {id: 1, text: "PDF"},
                {id: 2, text: "XML"},
                {id: 3, text: "PDF/XML"},
            ];

        }

        function getEmail() {
            var _typeContract = JSON.parse(localStorage.getItem('contractSelected')).bankingArea;
            var _model = {
                contractNumber: vm.contract,//$scope.contract.contractNumber,
                bankingArea: _typeContract
            };
            var _listaObtenida = [];
            accountSrv.getContractInfoDetail( _model ).then(function (_res) {
                if ( _res.holder.emailList.email.length === 0 ) {
                    CommonModalsSrv.error("No tiene Correos Asignados");
                } else {
                    angular.forEach( _res.holder.emailList.email, function ( item, key ) {
                        _listaObtenida.push({
                            id: key,
                            text: item.toLowerCase()
                        });
                    });
                }
            }).catch(function ( _res ) {
                var _error = _res.data.outCommonHeader.result.messages;
                CommonModalsSrv.error( ErrorMessage.createError( _error ) );
            });
            return _listaObtenida;
        }

        function getListaConstanciasFiscales ( _type ) {
            var _listaObtenida = [];
            statementFiscalSrv.getStatementFiscales( vm.contract, _type ) 
                .then(function (_res) {
                    if ( _res.resultSet !== 0 ) {
                        angular.forEach( _res.resultSet, function ( item ) {
                            _listaObtenida.push({
                                id: item.period, //'1',
                                text: _type === 3 ? returnMonth(item.period) : Number( item.period ), //"2018", //period //Hay que restar un día
                                contractNumber: item.contractNumber, //'00084445',//contractNumber
                                typeAccountStatement: item.typeAccountStatement, //"2",//typeAccountStatement
                                fileNameExtension: item.fileNameExtension //'PDF'//fileNameExtension
                            }); 
                        });
                    }
                }).catch(function ( _res ) {
                    CommonModalsSrv.error( ErrorMessage.createError( _res.data.outCommonHeader.result.messages ) );
                });
            return _listaObtenida;
        }

        function returnMonth( data ) {
            return data.substring(0,2)  + '/' + data.substring(2,6);
        }

        function getListaConstanciasFiscalesPormenorizada ( _type ) {
            var _typeContract = JSON.parse(localStorage.getItem('contractSelected')).bankingArea;
            _type = _typeContract === '999' ? 1 : 2;
            var _listaObtenida = [];
            statementFiscalSrv.getStatementFiscalesPormenorizadas( vm.contract, _type )
                .then(function (_res) {
                    if ( _res.resultSet !== 0 ) {
                        angular.forEach( _res.resultSet, function ( item ) {
                            _listaObtenida.push({
                                id: item.period, //'1',
                                text: Number( item.period ) -1, //"2018", //period //Hay que restar un día
                                contractNumber: item.contractNumber, //'00084445',//contractNumber
                                typeAccountStatement: item.typeAccountStatement ? item.typeAccountStatement : 9, //"2",//typeAccountStatement
                                fileNameExtension: item.fileNameExtension, //'PDF'//fileNameExtension
                                documentTypeID: item.documentTypeID //9 documentTypeID
                            }); 
                        });
                    }
                }).catch(function ( _res ) {
                    var _error = _res.data.outCommonHeader.result.messages;
                    CommonModalsSrv.error( ErrorMessage.createError( _error ) );
                });
            return _listaObtenida;
        }

        function limpiar () {
            //console.log("Entra a Limpiar: " );
            vm.ListConstanciasFiscales  = [];
            vm.ListConstanciasPormenorizadas = [];
            var _cmd = (typeof vm.cmd !== 'undefined') ? vm.cmd : null;
            if ( _cmd !== null ) {
                var _email = (typeof _cmd.dataEmailConstancias !== 'undefined') ? _cmd.dataEmailConstancias : null;
                var _idStatementFiscal = (typeof _cmd.dataListConstanciasFiscales !== 'undefined') ? _cmd.dataListConstanciasFiscales : null;
                var _idStatementPorme = (typeof _cmd.dataListConstanciasPormenorizadas !== 'undefined') ? _cmd.dataListConstanciasPormenorizadas : null;
                var _idFormat = (typeof _cmd.dataListFormats !== 'undefined') ? _cmd.dataListFormats : null;
    
                if ( _email !== null ) {
                    vm.cmd.dataEmailConstancias.type = [];
                }
                if ( _idStatementFiscal !== null ) {
                    vm.cmd.dataListConstanciasFiscales.type = [];
                }
                if ( _idStatementPorme !== null ) {
                    vm.cmd.dataListConstanciasPormenorizadas.type = [];
                }
                if ( _idFormat !== null ) {
                    vm.cmd.dataListFormats.type = [];
                }
            }
            
        }

        $scope.validate = function ( ) {
            var _typeStatement = (typeof vm.cmd.dataStatementFiscal !== 'undefined') ? vm.cmd.dataStatementFiscal.type : null;
            var _email = (typeof vm.cmd.dataEmailConstancias !== 'undefined') ? vm.cmd.dataEmailConstancias.type : null;
            var _idStatementFiscal = (typeof vm.cmd.dataListConstanciasFiscales !== 'undefined') ? vm.cmd.dataListConstanciasFiscales.type : null;
            var _idStatementPorme = (typeof vm.cmd.dataListConstanciasPormenorizadas !== 'undefined') ? vm.cmd.dataListConstanciasPormenorizadas.type : null;
            var _idFormat = (typeof vm.cmd.dataListFormats !== 'undefined') ? vm.cmd.dataListFormats.type : null;
            if ( _typeStatement === null) {
                    CommonModalsSrv.error( "Seleccione un tipo de Constancia" );
                    return false;
            } else {
                if ( _typeStatement.id === 4 ) { //Constancias Fisicas
                        return _email !== null && _idStatementFiscal !== null && _idFormat !== null ;
                } else if ( _typeStatement.id === 9 ) {//Constancias Pormenorizada
                        return _email !== null && _idStatementPorme !== null && _idFormat !== null;
                } 
            }
            return false;
        };

        function sendMail () {
            var _typeContract = JSON.parse(localStorage.getItem('contractSelected')).bankingArea;
            var _email = [];
            _email.push(vm.cmd.dataEmailConstancias.type.text);
            var _params = {
                contract: vm.contract,
                businessType: _typeContract === '999' ? 1 : 2,
                documentKeyValue: 1,
                month: vm.cmd.dataListConstanciasFiscales.type.typeAccountStatement === 3 ?
                    vm.cmd.dataListConstanciasFiscales.type.text.substring(0,2) : 0,
                year: vm.cmd.dataListConstanciasFiscales.type.typeAccountStatement === 3 ?
                    vm.cmd.dataListConstanciasFiscales.type.text.substring(3,7) :
                    vm.cmd.dataListConstanciasFiscales.type.text + 1,
                typeAccountStatement: vm.cmd.dataListConstanciasFiscales.type.typeAccountStatement,
                documentTypeID: vm.cmd.dataListFormats.type.id,
                email: _email
            };
            statementFiscalSrv.sendEmailNotificationStatementFiscalNew( _params ).then( function ( response ) {
                if (response.status) {
                    CommonModalsSrv.done(response.message);
                }
            }).catch( function ( error ) {
                CommonModalsSrv.error(error.message);
            });
        }

        function onChangeStatementFiscal (lastValue, newValue) {
            limpiar();
            switch( newValue.id ){
                case 4:
                    vm.ListFormats = getCatalogoFormatos( newValue.id );
                    vm.ListConstanciasFiscales  = getListaConstanciasFiscales( newValue.id );
                    break;
                case 9:
                    vm.ListFormats = getCatalogoFormatos( newValue.id );
                    vm.ListConstanciasFiscales = getListaConstanciasFiscalesPormenorizada( newValue.id );
                    break;
                case 3:
                    vm.ListFormats = getCatalogoFormatos( newValue.id );
                    vm.ListConstanciasFiscales  = getListaConstanciasFiscales( newValue.id );
                    break;
            }
        };
    }

    angular.module( 'actinver.controllers' )
        .controller( 'statementFiscalCtrl', statementFiscalCtrl );

})();