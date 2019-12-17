( function(){
    'use strict';

    function insuranceCarSrv( URLS, $q, $http, $filter ){

        function setTooltipInfo( info ){
            return "<div class='operations-account-tp'><span>" + info.month + "</span><div>" + info.id + ": " + $filter('currency')(info.amount) + "</div></div>";
        }

        function getMonthsYears(){
            var history =[],
                fechaActual = new Date();
            var fechaMes = fechaActual.getMonth() + 1;
            var anio = fechaActual.getFullYear() - 1;

            for (var i = 1; i <= 13; i++) {
                history.push({
                    paymentPeriod: fechaMes < 10 ? anio + '0' + fechaMes : anio + '' + fechaMes,
                    amount: null
                });
                if (fechaMes < 12) {
                    fechaMes++;
                } else {
                    fechaMes = 1;
                    anio = anio + 1;
                }
            }
            return history;
        }

        var obj = {

            /**
             * Search field types
             */

            type_contract : [
                {
                    id: 999,
                    text: 'Banco'
                },
                {
                    id: 998,
                    text: 'Casa'
                }
            ],

            type_person : [
                {
                    text: 'Física'
                },
                {
                    text: 'Moral'
                }
            ],

            /**
             * Search field types
             */
            search_types: [
                {
                    id: 1,
                    text: 'Número de cliente único',
                    validation: {
                        pattern: new RegExp( '^[0-9]*$' ),
                        maxlength: '10'
                    }
                },
                {
                    id: 2,
                    text: 'Número de contrato',
                    validation: {
                        pattern: new RegExp( '^[0-9]*$' ),
                        maxlength: '10'
                    }
                },
                {
                    id: 3,
                    text: 'Nombre de cliente único',
                    typeahead: true,
                    validation: {
                        pattern: '',
                        maxlength: '60'
                    }
                }
            ],

           
            /**
             * Get client information
             * @param {string} type - Search type
             * @param {string} search item - Searched client
             * @return  {object}
             */

            getClientName: function( _client){
                return $q(function( resolve, reject ){
                    $http({
                        method: 'GET',
                        url: URLS.getClientName,
                        params: {
                            language : 'SPA',
                            lastName :  _client.lastName ? _client.lastName.toUpperCase() : ' ',
                            surname : _client.surname ? '' : '',
                            name : _client.name ? _client.name.toUpperCase() : ' ',
                            companyName: _client.companyName,
                            personType: _client.name ? 1 : 2,
                            tIN: _client.fiscalIDNumber
                        }
                    }).then(function success( response ) {
                        var _response;
                        if ( response.data.outCommonHeader.result.result === 1) {
                            _response = response.data.outClientInfoQuery.clientList.client;
                            resolve( {success: true, info: _response } );
                        }else{
                            reject( {success: false, info: response.data.outCommonHeader.result });
                        }
                    }, function error(){
                        reject( {success: false, type: 'not-found'} );
                    });
                });
            },
            
            /**
             * Get current contracts list
             * @param {string} client - Search item
             * @return  {object}
             */
            getContracts: function (client, contractType) {

                return $q(function (resolve, reject) {

                    $http({
                        method: 'GET',
                        url: URLS.getContracts,
                        params:{
                            language: 'SPA',
                            bankingArea : contractType || 999,
                            clientID : client
                        }
                    }).then(function success( response ) {
                       if (typeof response !== 'undefined' && response.data.outContractsBalancesByPortfolioQuery) {
                            resolve( {success: true, contracts: response.data.outContractsBalancesByPortfolioQuery.contractInformation} );
                        } else {
                            reject( {success: false, data: response.data, type: 'empty' } );
                        }

                    }, function error(){
                        reject( {success: false, type: 'not-found'} );
                    });

                });

            },

            /**
             * Get unique contract information
             * @param {string} contract - Contract ID
             * @return  {object}
             */
            getContractHistorical: function( contract ){

                return $q(function( resolve, reject ){
                    $http({

                        method: 'GET',
                        url: URLS.getContractHistorical,
                        params: {
                            language: 'SPA',
                            contractNumber: '[{"idContrato":"' + contract + '"}]'
                        }
                    }).then(function success( response ){

                        if(response.data.outCommonHeader.result.result === 1){

                            var info = response.data.outBrokerMonthlyBalanceQuery.clients.client[0],
                                empty = true, historicalInfo=[];
                                //generamos los meses para el año
                            historicalInfo = getMonthsYears();                            
                            angular.forEach( info.historicalInfo, function( data ){
                                if( empty && data.amount !== 0 ){
                                    empty = false;
                                }
                                for(var j=0; j<historicalInfo.length;j++){                                    
                                    if(historicalInfo[j].paymentPeriod === data.paymentPeriod){
                                        historicalInfo[j].amount = parseFloat(data.amount);
                                        j = historicalInfo.length;
                                    }
                                }
                            } );
                            info.historicalInfo = historicalInfo;
                            resolve( {success: true, historical: info, empty: empty} );
                        }else{
                            resolve( {success: false, data: response.data.outCommonHeader.result} );
                        }
                    }, function error(){
                        reject( {success: false} );
                    });
                });
            },

            /**
             * Get unique contract information
             * @param {string} contract - Contract ID
             * @return  {object}
             */
            getBrokerHistoricalBalanceQuery: function (_contractNumber, _numberPeriods) {

                return $q(function (resolve, reject) {
                    $http({
                        method: 'GET',
                        url: URLS.getBrokerHistoricalBalanceQuery + '/' + _contractNumber + '/' + _numberPeriods,
                        params: {
                            language: 'SPA'
                        }
                    }).then(function success(response) {
                        if (response.data.outCommonHeader.result.result === 1) {

                            var info = response.data.outBrokerHistoricalBalanceQuery.balanceFound,
                                empty = true, historicalInfo = [], historical={},contractNumbre;

                            historicalInfo = getMonthsYears();

                            angular.forEach(info, function (data) {
                                if (empty && data.contractBalance !== 0) {
                                    empty = false;
                                }
                                for(var j=0; j<historicalInfo.length;j++){                                    
                                    if(historicalInfo[j].paymentPeriod === data.period){
                                        historicalInfo[j].amount = parseFloat(data.contractBalance);
                                        j = historicalInfo.length;
                                    }
                                }                                
                                contractNumbre=data.contractNumber;
                            });
                           
                            historical={contractNumber:contractNumbre,historicalInfo:historicalInfo};
                            resolve({ success: true, historical: historical, empty: empty });
                        } else {
                            resolve({ success: false, data: response.data.outCommonHeader.result });
                        }
                    }, function error() {
                        reject({ success: false });
                    });
                });
            },

            /**
             * Get unique contract information
             * @param {string} contract - Contract ID
             */
            getBankContractBalance: function (_contractNumber ) {

                return $q(function (resolve, reject) {
                    $http({
                        method: 'GET',
                        url: URLS.bankPortfolioQuery  + _contractNumber,
                        params: {
                            language: 'SPA'
                        }
                    }).then(function success(response) {
                        if (response.data.outCommonHeader.result.result === 1 && response.data.outBankPortfolioQuery.bankPortfolio !== null ) {
                            resolve({ success: true, contractNumber :_contractNumber, totalBalance: response.data.outBankPortfolioQuery.bankPortfolio.bankPortfolioElement[10].actualValue });
                        } else {
                            resolve({ success: false, data: response.data.outCommonHeader.result });
                        }
                    }, function error() {
                        reject({ success: false });
                    });
                });
            },

            /**
             * Get unique contract information
             * @param {string} contract - Contract ID
             */
            getPortfolioGlobalDetailQuery: function (_contractNumber) {

                return $q(function (resolve, reject) {
                    $http({
                        method: 'GET',
                        url: URLS.getPortfolioGlobalDetailQuery  + _contractNumber,
                        params: {
                            language: 'SPA'
                        }
                    }).then(function success(response) {
                        if (response.data.outCommonHeader.result.result === 1) {
                            resolve({ success: true, contractNumber :_contractNumber, totalBalance: response.data.outPortfolioGlobalDetailQuery.totalValuation });
                        } else {
                            resolve({ success: false, data: response.data.outCommonHeader.result });
                        }
                    }, function error() {
                        reject({ success: false });
                    });
                });
            },

            /**
             * Set account information in array
             * @return  {object}
             */
            setInfo: function( historical ){
                var chart_data = [],
                    months = historical[0].historicalInfo;
                for( var i = 0; i <= months.length; i++ ){
                    if( i === 0 ){
                        chart_data[i] = ['Mes'];
                    } else {
                        var date = months[i - 1].paymentPeriod,
                            year = parseInt( date.substr( 0, 4 ) ),
                            month = parseInt( date.substr( 4, 2 ) ),
                            current = new Date( year,month - 1 );

                        chart_data[i] = [$filter( 'date' )( current, 'MMM' ).toUpperCase() + '.' + $filter( 'date' )( current, 'yy' )];
                    }
                }

                for( var x = 0; x < historical.length; x++ ){
                    chart_data[0].push( historical[x].contractNumber );
                    chart_data[0].push( tooltip_set );

                    for( var y = 0; y < historical[x].historicalInfo.length; y++ ){
                        var info = {
                                id: historical[x].contractNumber,
                                month: chart_data[y + 1][0],
                                amount: historical[x].historicalInfo[y].amount
                            };
                        chart_data[y + 1].push( info.amount );
                        chart_data[y + 1].push( setTooltipInfo( info ) );
                    }
                }

                return obj.displayChart( chart_data );

            },

            getContractInfoDetail: function (_model) {

                return $q(function (resolve, reject) {

                    $http({
                        method: 'GET',
                        url: URLS.getContractInfoDetail + _model.contractNumber + '/' + _model.bankingArea,
                        params: {
                            language: 'SPA'
                        }
                    }).then(function success(response) {


                        if (typeof response !== 'undefined' && response.data.outCommonHeader.result.result === 1) {
                            resolve(response.data.outSimplifiedBankContractQuery.contract);
                        } else {
                            reject(response.data.outCommonHeader.result);
                        }
                    }, function error(error) {
                        reject(error);
                    });

                });

            },
            getBankContractsByClientQuery:function(wordToSearch, page, rowsByPage ){
                return $q(function(resolve, reject){

                    $http({
                        method: 'GET',
                        url: URLS.getBankContractsByClientQuery + wordToSearch + '/1/Modulo Asesor/' + page + '/' + rowsByPage,
                        params: {
                            language: 'SPA'
                        }
                    }).then(function success(response) {
                        var record = {
                            success: true,
                            data: null,
                            msg: response.data.outCommonHeader.result.messages[0].responseMessage
                        };
                        if (typeof response !== 'undefined' && response.data.outCommonHeader.result.result === 1) {
                            record.data = response.data.outBankContractsByClientQuery;
                            resolve(record);
                        } else {
                            record.success = false;
                            resolve(record);
                        }
                    }, function error( ) {
                        reject({success:false, data:null, msg:"Error Interno"});
                    });
                });
            },//SERVICIO DE MOVIMIENTO ABRAHAM
            getCatalogEntityFederative: function () {
                return $q(function( resolve, reject ){
                    $http({
                        method: 'GET',
                        url: URLS.getCatalogEntityFederal,
                        params: {
                            language : 'SPA'
                        }
                    }).then(function success( response ) {
                        var _response;
                        if ( response.data.outCommonHeader.result.result === 1) {
                            _response = response.data.outFederalEntityQuery.federalEntityCatalogData.federalEntity;
                            resolve( {success: true, info: _response } );
                        }else{
                            reject( {success: false, info: response.data.outCommonHeader.result });
                        }
                    }, function error(){
                        reject( {success: false, type: 'not-found'} );
                    });
                });
            },
            getCatalogMarksCars: function ( _years ) {
                return $q(function( resolve, reject ){
                    $http({
                        method: 'GET',
                        url: URLS.getCatalogMarksCars + _years,
                        params: {
                            language : 'SPA'
                        }
                    }).then(function success( response ) {
                        var _response;
                        if ( response.data.outCommonHeader.result.result === 1) {
                            _response = response.data.outCarBrandQuery.carBrandDataList.carBrandData;
                            resolve( {success: true, info: _response } );
                        }else{
                            resolve( {success: false, info: response.data.outCommonHeader.result });
                        }
                    }, function error(){
                        reject( {success: false, type: 'not-found'} );
                    });
                });
            },
            getCatalogModelsCars: function ( _years, _mark ) {
                return $q(function( resolve, reject ){
                    $http({
                        method: 'GET',
                        url: URLS.getCatalogModelsCars + _mark +"/"+_years,
                        params: {
                            language : 'SPA'
                        }
                    }).then(function success( response ) {
                        var _response;
                        if ( response.data.outCommonHeader.result.result === 1) {
                            _response = response.data.outCarModelQuery.carModelDataList.carModelData;
                            resolve( {success: true, info: _response } );
                        }else{
                            reject( {success: false, info: response.data.outCommonHeader.result });
                        }
                    }, function error(){
                        reject( {success: false, type: 'not-found'} );
                    });
                });
            },
            getCatalogMunicipalityCars: function ( _idEntityFederative ) {
                return $q(function( resolve, reject ){
                    $http({
                        method: 'GET',
                        url: URLS.getCatalogMunicipalityCars + _idEntityFederative,
                        params: {
                            language : 'SPA'
                        }
                    }).then(function success( response ) {
                        var _response;
                        if ( response.data.outCommonHeader.result.result === 1) {
                            _response = response.data.outMunicipalityQuery.municipalityCatalogData.municipality;
                            resolve( {success: true, info: _response } );
                        }else{
                            reject( {success: false, info: response.data.outCommonHeader.result });
                        }
                    }, function error(){
                        reject( {success: false, type: 'not-found'} );
                    });
                });
            },
            getCatalogBanksCars: function ( ) {
                return $q(function( resolve, reject ){
                    $http({
                        method: 'GET',
                        url: URLS.getCatalogBanksCars,
                        params: {
                            language : 'SPA'
                        }
                    }).then(function success( response ) {
                        var _response;
                        if ( response.data.outCommonHeader.result.result === 1 ) {
                            _response = response.data.outInsuranceBanksQuery.insuranceBanksCatalogData.bank;
                            resolve( {success: true, info: _response } );
                        }else{
                            reject( {success: false, info: response.data.outCommonHeader.result });
                        }
                    }, function error(){
                        reject( {success: false, type: 'not-found'} );
                    });
                });
            },
            getServiceEmision: function ( _models ) {
                
                return $q(function( resolve, reject ){
                    $http({
                        method: 'POST',
                        url: URLS.getServiceEmision,
                        data: $.param(_models)
                    }).then(function success( response ) {
                        var _response;
                        if ( response.data.outCommonHeader.result.result.toString() === "1" ) {
                            _response = response.data.outCarInsurancePolicyRegistration.xmldata;
                            resolve( {success: true, info: _response } );
                        }else{
                            reject( {success: false, info:  response.data.outCommonHeader.outCarInsurancePolicyRegistration.xmldata });
                        }
                    }, function error(){
                        reject( {success: false, type: 'not-found'} );
                    });
                });
            },
            //SERVICIO DE MOVIMIENTO ABRAHAM
            //Servicio de Cotizacion Jorge
            getServiceCotizacion: function (_datos) {

                return $q(function (resolve, reject) {
                    $http({
                        method: 'POST',
                        url: URLS.getServiceCotizacion,
                        params: {
                            language: 'SPA',
                            agentID: _datos.agentID,
                            BrandID: _datos.BrandID,
                            DelegationMunicipalityID: _datos.DelegationMunicipalityID,
                            InsurancePolicyDate: _datos.InsurancePolicyDate,
                            InvoiceFlag: _datos.InvoiceFlag,
                            InvoiceNumber: _datos.InvoiceNumber,
                            InvoiceValue: _datos.InvoiceValue,
                            InvoiceDate: _datos.InvoiceDate,
                            ModelID: _datos.ModelID,
                            SubstituteCarCoverageFlag: _datos.SubstituteCarCoverageFlag,
                            WarrantyCoverageFlag: _datos.WarrantyCoverageFlag,
                            CatastrophicCoverageFlag: _datos.CatastrophicCoverageFlag,
                            SumAssured: _datos.SumAssured,
                            PaymentType: _datos.PaymentType,
                            PaymentMethod: _datos.PaymentMethod,
                            StateID: _datos.StateID,
                            Year: _datos.Year,
                            planType: _datos.planType,
                            idCliente:_datos.idCliente
                        }

                    }).then(function success(response) {
                        var _response;
                        
//                        response.data= JSON.parse("{\"outCarInsuranceQuotation\":{\"coverageList\":{\"coverageInformation\":[{\"code\":\"4000\",\"description\":\"DANOSMATERIALES\",\"sumAssured\":\"807936\",\"deductible\":\"5.0\",\"totalPremium\":\"8788.88\"}]},\"insuranceNextPaymentData\":{\"paymentMethod\":\"11recibosadicionalesde:\",\"netPremium\":\"1984.78\",\"surcharge\":\"175.65\",\"entitlement\":\"0.0\",\"vat\":\"345.67\",\"totalPremium\":\"2506.1\"},\"insurancePaymentData\":{\"entitlement\":\"0.0\",\"netPremium\":\"1984.82\",\"paymentMethod\":\"Pagomensual12recibosde:\",\"surcharge\":\"175.69\",\"totalPayments\":\"30595.26\",\"totalPremium\":\"3028.16\",\"vat\":\"345.65\"},\"insurancePaymentData\":{\"surcharge\":\"2107.84\",\"entitlement\":\"0.0\",\"vat\":\"4148.02\",\"totalPremium\":\"23817.4\"},\"quotationNumber\":\"1230104129288\"},\"outCommonHeader\":{\"clientID\":\"PRUEBABUS\",\"date\":{\"day\":0,\"eon\":0,\"eonAndYear\":0,\"fractionalSecond\":0,\"hour\":0,\"millisecond\":0,\"minute\":0,\"month\":0,\"second\":0,\"timezone\":0,\"valid\":true,\"xmlschemaType\":{\"localPart\":\"string\",\"namespaceURI\":\"string\",\"prefix\":\"string\"},\"year\":0},\"ipaddress\":\"127.0.0.1\",\"operationName\":\"CarInsuranceQuotation\",\"operationVersion\":\"1_1\",\"responseSystem\":\"MAPFRE\",\"result\":{\"messages\":[{\"responseSystemCode\":\"ACTIB001\",\"responseMessage\":\"EXITO\",\"responseType\":\"N\",\"responseCategory\":\"INFO\"}],\"nativeErrorCode\":\"string\",\"result\":\"1\",\"transactionID\":\"60bab7d9-62c5-4755-8f1a-10f06cfdfd55\"},\"sessionID\":\"3285\",\"time\":{\"day\":0,\"eon\":0,\"eonAndYear\":0,\"fractionalSecond\":0,\"hour\":0,\"millisecond\":0,\"minute\":0,\"month\":0,\"second\":0,\"timezone\":0,\"valid\":true,\"xmlschemaType\":{\"localPart\":\"string\",\"namespaceURI\":\"string\",\"prefix\":\"string\"},\"year\":0}}}");
                                
                        if ( response.data.outCommonHeader.result.result.toString() === "1" ) {
                            _response = response.data.outCarInsuranceQuotation;
                            resolve( {success: true, info: _response } );
                        }else{
                            resolve( {success: false, info: response.data.outCommonHeader.result });
                        }
                    }, function error(){
                        reject( {success: false, type: 'not-found'} );
                    });
                });
            },
            //Servicio de Cotizacion Jorge

            //INICIA SERVICIOs DE SEND EMAIL CAMAÑO
            sendEmailNotificationCotizationCars: function ( objectJson ) {
                return $q(function( resolve, reject ){
                    $http({
                        method: 'POST',
                        url: URLS.sendEmailNotificationCotization,
                        params: objectJson
                    }).then(function success( response ) {
                        var _response;
                        if ( response.data.outCommonHeader.result.result === 1) {
                            _response = response.data.outCommonHeader.result;
                            resolve( {success: true, info: _response } );
                        }else{
                            reject( {success: false, info: response.data.outCommonHeader.result });
                        }
                    }, function error(){
                        reject( {success: false, info: 'not-found'} );
                    });
                });
            },

            sendEmailNotificationCompraSeguroCars: function ( objectJson ) {
                return $q(function( resolve, reject ){
                    $http({
                        method: 'POST',
                        url: URLS.sendEmailNotificationCompraSeguro,
                        params: objectJson
                    }).then(function success( response ) {
                        var _response;
                        if ( response.data.outCommonHeader.result.result === 1) {
                            _response = response.data.outCommonHeader.result;
                            resolve( {success: true, info: _response } );
                        }else{
                            reject( {success: false, info: response.data.outCommonHeader.result });
                        }
                    }, function error(){
                        reject( {success: false, type: 'not-found'} );
                    });
                });
            }
            //TERMINA SERVICIO DE SEND EMAIL CAMAÑO
        };

        return obj;

    }

    angular
    	.module( 'actinver.controllers' )
        .service( 'insuranceCarSrv', insuranceCarSrv );

})();
