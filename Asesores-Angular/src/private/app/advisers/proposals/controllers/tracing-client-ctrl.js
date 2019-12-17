( function(){
    "use strict";

    function tracingClientCtrl( $q, userConfig, proposalSrv, CommonModalsSrv ){
        var vm = this;
        vm.selectedInfo = { };
        vm.optionTypeContract=[];
        vm.optionSelected={id:"1",text:"Casa"};

        // Set current adviser
        vm.sadviser = userConfig.user;

        function setup () {
            setupVars();
        }
        function resetListContracts(){
            vm.listContracts=[];
            vm.input = '';
        }


        function setupVars () {
            vm.type =  'contract';
            vm.lengthInput = 8;
            vm.placeholderInput = 'Número de contrato';
            vm.input = '';
            vm.listContracts = [];
            vm.listSummaryContracts = [];
            vm.showSpinner = false;
            vm.optionTypeContract.push({id:"1",text:"Casa"});
            vm.optionTypeContract.push({id:"2",text:"Banco"});
        }

        function doStructureForPosition(_response) {
            var registerFormat = {};
            _response.map(function (_element) {
                if (registerFormat[_element.issuer]) {
                    registerFormat[_element.issuer].rows.push(_element);
                    registerFormat[_element.issuer].total.position += _element.position;
                    registerFormat[_element.issuer].total.valuation += _element.valuation;
                } else {
                    registerFormat[_element.issuer] = {
                        rows: [_element],
                        total: {
                            position: _element.position,
                            valuation: _element.valuation
                        }
                    };
                }
            });
            return registerFormat;
        }

        vm.setType = function ( _type ) {
            vm.type = _type;
            vm.placeholderInput = _type === 'contract' ? 'Número de contrato' : 'Cliente único';
            vm.input = '';
            vm.lengthInput =  8;
            resetListContracts();
        };

        vm.getContract = function() {
            vm.listContracts =  [];
            vm.listSummaryContracts = [];
            vm.positionContract = false;
            vm.showSpinner = true;

            var model = {};
            model.type = vm.type;            
            model.optionTypeContract=vm.optionSelected;
            model.employeeID=vm.sadviser.employeeID;
            model.field = vm.input; 

   
            //***************************** Manda la peticion a los servicios[1] ********************************/
            proposalSrv.getContractIdClient( model ).then(function ( _res ) {
                var client =null;
                var message='';
                var responseClient=_res;
                var _error='';
                   
                if(responseClient.outCommonHeader.result.result === 2){
                     _error=responseClient.outCommonHeader.result.messages;
                    angular.forEach(_error, function (_res) {
                        if (_res.responseMessage) {
                            message += _res.responseMessage + '<br>';
                        }
                    });
                    CommonModalsSrv.error(message);
                    return;
                }

                client=responseClient.outClientOrContractClientInfoQuery.client;
                if(client.length === 0){
                         _error=responseClient.outCommonHeader.result.messages;
                        angular.forEach(_error, function (_res) {
                            if (_res.responseMessage) {
                                message += _res.responseMessage + '<br>';
                            }
                        });
                        CommonModalsSrv.error(message);
                        return;
                }else{
                    var clientNumber= Number(client[0].clientNumber);
                    vm.cliente=client[0];
                    vm.clientName = client[0].name + ' ' + client[0].lastName + ' ' + client[0].secondLastName;
                    vm.clientId = client[0].clientNumber;

                    //***************************** Manda la peticion a los servicios[3] ********************************/
                    proposalSrv.getContractSummary(vm.sadviser.employeeID, clientNumber).then(function (_response) {
                        vm.detailClient = {
                            brokerHouseValue: _response.brokerHouseValue,
                            bankValue: _response.bankValue,
                            totalValue: _response.totalValue
                        };
                        vm.listContracts = _response.contractsList.outContractsBalancesByPortfolioQuery.contractInformation;
                        if(_response.contractsList.outContractsBalancesByPortfolioQuery.contractInformation.length === 0){
                            CommonModalsSrv.error("No se encontraron contratos permitidos.");
                        }
                    }).catch(function () {
                        vm.showSpinner = false;
                        CommonModalsSrv.error("Lo sentimos ocurrio un error.");
                    }).finally(
                    );
                }
            }).catch(function(){
                CommonModalsSrv.error( "Lo sentimos ocurrio un error." );
            }).finally(function(){
                vm.showSpinner = false;
            });
        };


        vm.viewSummaryContract = function ( record ) {
            var _contractNumber = record.contractNumber;
            vm.selectedInfo = {
                tipo : record.companyName,
                isGeneral: false
            };

            vm.showSpinner = true;
            vm.listSummaryContracts = [];
            vm.positionContract = false;
            vm.contractNumbers=[_contractNumber];
            var typeContract=null;

            //for para saber si es banco o casa
            for(var index in vm.listContracts){
                if(vm.listContracts[index].contractNumber ===_contractNumber ){
                    var temp=vm.listContracts[index].companyName;
                    if("Casa"===temp){
                        typeContract='CB';
                    }else if("Banco"===temp){
                        typeContract='B';
                    }
                    break;
                }                    
            }
   
            proposalSrv.getDetailedSummaryContract( _contractNumber,typeContract )
                .then(function ( _element ) {
                    
                    var portfolioValue = 0;
                    var totalFounds=0;
                    var totalCasa=0;
                    var totalMC=0;
                    var contract=[];
                    var data={};
                    var totalCash=0;

                    var objeto={};
                    angular.forEach(_element.result, function(value, key) {                       
                        objeto[key]=value;

                        if("moneyMarket" === key){
                            totalCasa+=parseFloat(value);
                        }else if("capitalMarket" === key){
                            totalMC+=parseFloat(value);
                        }else if("debtFund"=== key || "rentFund"=== key || "coverFund"=== key){   
                            totalFounds+=parseFloat(value);
                        }                  

                        if("cashPesos" === key || "cashDollars" === key || "cashEuros" === key ){
                            totalCash+=parseFloat(value);
                        }

                        if("portfolioValue" !== key){
                            portfolioValue+=parseFloat(value);
                        }
                    });

                        data=objeto;
                        contract.data=data;
                        contract.contractNumber =_element.contractNumber;

                    vm.listSummaryContracts = {
                        listContracts: [contract],
                        portfolioValue: portfolioValue,
                        totalCasa:totalCasa,
                        totalFounds:totalFounds,
                        totalMC:totalMC,
                        totalCash:totalCash
                    };

                    vm.positionContract = false;
                }).catch(function(){
                    vm.showSpinner = false;
                    CommonModalsSrv.error( "Lo sentimos ocurrio un error." );
                }).finally(function(){
                    vm.showSpinner = false;
                });
            };

        vm.detailGeneral = function () {

            vm.selectedInfo = {
                tipo : null,
                isGeneral: true
            };

            vm.showSpinner = true;
            vm.listSummaryContracts.listContracts = [];
            vm.listSummaryContracts.portfolioValue = 0;
            vm.listSummaryContracts.totalCasa = 0;
            vm.listSummaryContracts.totalFounds = 0;
            vm.listSummaryContracts.totalMC = 0;
            vm.listSummaryContracts.totalCash = 0;
            vm.positionContract = false;
           
            var contractNumbers = vm.listContracts.map(function (contract) {
                return contract.contractNumber;
            });

            vm.contractNumbers=contractNumbers;
            //for para iterar cara contrato 
            for (var index = 0; index < contractNumbers.length; index++) {
                var contractonum = contractNumbers[index];
                var typeContract = null;
                //for para saber si es banco o casa
                for (var indexContract in vm.listContracts) {
                    if (vm.listContracts[indexContract].contractNumber === contractonum) {
                        var temp = vm.listContracts[indexContract].companyName;
                        if ("Casa" === temp) {
                            typeContract = 'CB';
                        } else if ("Banco" === temp) {
                            typeContract = 'B';
                        }
                        break;
                    }
                }
                llamada(contractonum, typeContract);
            }

                function llamada(contractonum, typeContract){
                    proposalSrv.getDetailedSummaryContract(contractonum, typeContract).then(function (_element) {

                        var portfolioValue = 0;
                        var totalFounds=0;
                        var totalCasa=0;
                        var totalMC=0;
                        var totalCash=0;

                        var contract = {};
                        var data = {};
                        var objeto = {};
                        angular.forEach(_element.result, function (value, key) {
                            objeto[key] = value;

                            if("moneyMarket" === key){
                                totalCasa+=parseFloat(value);
                            }else if("capitalMarket" === key){
                                totalMC+=parseFloat(value);
                            }else if("debtFund"=== key || "rentFund"=== key || "coverFund"=== key){   
                                totalFounds+=parseFloat(value);
                            }   
                            
                            if("cashPesos" === key || "cashDollars" === key || "cashEuros" === key ){
                                totalCash+=parseFloat(value);
                            }

                            if (key !== "portfolioValue") {
                                portfolioValue += parseFloat(value);
                            }

                        });

                        data = objeto;
                        contract.data = data;
                        contract.contractNumber = _element.contractNumber;

                        vm.listSummaryContracts.listContracts.push(contract);
                        vm.listSummaryContracts.portfolioValue = portfolioValue + vm.listSummaryContracts.portfolioValue;
                        vm.listSummaryContracts.totalCash = totalCash + vm.listSummaryContracts.totalCash;
                        vm.listSummaryContracts.totalCasa = totalCasa + vm.listSummaryContracts.totalCasa;
                        vm.listSummaryContracts.totalFounds = totalFounds + vm.listSummaryContracts.totalFounds;
                        vm.listSummaryContracts.totalMC = totalMC + vm.listSummaryContracts.totalMC;

                        vm.positionContract = false;
                    }).catch(function () {
                        vm.showSpinner = false;
                        CommonModalsSrv.error("Lo sentimos ocurrio un error.");
                    }).finally(function () {
                        vm.showSpinner = false;
                    });
                }


        };


        vm.changePositionContract = function () {
            if (!vm.positionContract) {
                return;
            }
            vm.showSpinner = true;
            vm.listPositionContracts = [];

            // si quiere ver las posiciones de todos los contratos
            if (vm.selectedInfo.isGeneral) { 
                var typeBank = [], typeHouse = [];
                var lista = vm.listSummaryContracts.listContracts;                
                for (var i = 0; i < lista.length; i++) {
                    for (var j = 0; j < vm.listContracts.length; j++) {
                        if (lista[i].contractNumber === vm.listContracts[j].contractNumber) {
                            if (vm.listContracts[j].companyName === "Casa") {
                                typeHouse.push(lista[i].contractNumber);
                            } else { //Banco
                                typeBank.push(lista[i].contractNumber);
                            }
                            j = vm.listContracts.length;
                        }
                    }
                }

                proposalSrv.getPositionTypeBankAndHouse(typeHouse,typeBank ).then(function(response){
                    vm.listPositionContracts = doStructureForPosition(response);
                    vm.showSpinner = false;
                })
                .catch(function(){
                    vm.showSpinner = false;
                    vm.listPositionContracts = [];
                });

            } else { // si quiere ver la posicion de un contrato
                if (vm.selectedInfo.tipo === 'Casa') {
                    proposalSrv.getPosition(vm.contractNumbers).then(function (_response) {
                        if (_response) {                           
                            vm.listPositionContracts = doStructureForPosition(_response);
                        }
                        vm.showSpinner = false;
                    }).catch(function () {
                        vm.showSpinner = false;
                        CommonModalsSrv.error("Lo sentimos ocurrio un error.");
                    }
                    );
                } else {
                    proposalSrv.getPositionTypeBank(vm.contractNumbers).then(function (_response) {
                        if (_response) {                           
                            vm.listPositionContracts = doStructureForPosition(_response);
                        }
                        vm.showSpinner = false;
                    }).catch(function (error) {
                        vm.showSpinner = false;
                        vm.listPositionContracts = error;
                    });
                }
            }
        };


        vm.generaReporte = function() {            
            var clientNumber= Number(vm.cliente.clientNumber);            
            var contratos=[];
            var productos=[];
            var lista = vm.listSummaryContracts.listContracts;
            
            for (var i = 0; i < lista.length; i++) {
                for (var j = 0; j < vm.listContracts.length; j++) {
                    if (lista[i].contractNumber === vm.listContracts[j].contractNumber) {
                        contratos.push({
                            contract: vm.listContracts[j].contractNumber,
                            source: vm.listContracts[j].companyName === "Casa" ? 'CB':'B'
                        });                       
                        j = vm.listContracts.length;
                    }
                }
            }

            if(vm.listPositionContracts) {
                for( var indexPosContract in vm.listPositionContracts) {
                    var t = vm.listPositionContracts[indexPosContract].rows[0];
                    productos.push({"contractNumber":t.contractNumber,"issuer":t.issuer,"position":t.position,"price":t.lastPrice,"valuation":t.valuation});
                }
            } else {
                productos = 0;
            }

            var model = {
                language: 'SPA',                        
                contracts: window.btoa(JSON.stringify(contratos)),
                clientId: clientNumber,
                totalCash: vm.listSummaryContracts.totalCash,                       
                totalFunds: vm.listSummaryContracts.totalFounds,                        
                totalMoney: vm.listSummaryContracts.totalCasa,                        
                totalCapitals: vm.listSummaryContracts.totalMC,   
                //products: window.btoa(JSON.stringify(productos)),    
                //name:  vm.clientName,                        
                name: userConfig.user.name,
                mail: userConfig.user.mail,
                createEnvironment: true,
                createForecast: true
            };

            //si esta activado posicion
            if (vm.positionContract) {
                model.products= window.btoa(JSON.stringify(productos)),    
                proposalSrv.getDetailedCustomerTrackingReport(model).then(function (response) {
                    if (/access/i.test(navigator.userAgent)) {
						var b64encoded = btoa(Uint8ToString(new Uint8Array(response.data)));
						var popupWin = window.open('Propuesta', '_blank', 'width=1000px,height=905px,resizable=0');
						popupWin.document.open();
						popupWin.document.write('<html><head></head><body><iframe width="100%" height="100%" src="data:application/pdf;base64,' + b64encoded + '"></iframe></body></html>');
						popupWin.document.close();
					} else {
                        var file = new Blob([response.data], { type: 'application/pdf' });
                        var fileURL = URL.createObjectURL(file);
                        window.open(fileURL, '_blank', 'Reporte');
                    }
                }).catch(function (err) {
                    CommonModalsSrv.error("Lo sentimos ocurrio un error. " + err);
                });

            } else {
                proposalSrv.getCustomerTrackingReport(model).then(function (response) {
                    if (/access/i.test(navigator.userAgent)) {
                        var b64encoded = btoa(Uint8ToString(new Uint8Array(response.data)));
						var popupWin = window.open('Propuesta', '_blank', 'width=1000px,height=905px,resizable=0');
						popupWin.document.open();
						popupWin.document.write('<html><head></head><body><iframe width="100%" height="100%" src="data:application/pdf;base64,' + b64encoded + '"></iframe></body></html>');
						popupWin.document.close();
                    } else {
                        var file = new Blob([response.data], { type: 'application/pdf' });
                        var fileURL = URL.createObjectURL(file);
                        window.open(fileURL, '_blank', 'Reporte');
                    }
                }).catch(function (err) {
                    CommonModalsSrv.error("Lo sentimos ocurrio un error. " + err);
                });
            }
        };

        function Uint8ToString(u8) {
			var CHUNK_SZ = 0x8000, c = [];
			for (var i = 0; i < u8.length; i += CHUNK_SZ) {
				c.push(String.fromCharCode.apply(null, u8.subarray(i, i + CHUNK_SZ)));
			}
			return c.join("");
		}

        setup();
    }

    angular
        .module( 'actinver.controllers' )
        .controller( 'tracingClientCtrl', tracingClientCtrl );

})();
