( function(){
    'use strict';

    function accountSrv( URLS, $q, $http, $filter ){
        var chart_line_colors = ['#517cbd','#f5f047','#3366cc','#dc3912','#ff9900','#109618','#990099','#0099c6','#dd4477','#66aa00','#b82e2e','#316395','#994499','#22aa99','#aaaa11','#6633cc','#e67300','#8b0707','#651067','#329262','#5574a6','#3b3eac','#b77322','#16d620','#b91383','#f4359e','#9c5935','#a9c413','#2a778d','#668d1c','#bea413','#0c5922','#743411'],
            tooltip_set = {'type': 'string', 'role': 'tooltip', 'p': {'html': true}};

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
             * Set chart styles and information
             * @param {object} chart_data - Object with chart setting.
             * @return  {object}
             */
            displayChart: function( chart_data ){

                return {
                    data: chart_data,
                    options: {
                        colors: chart_line_colors,
                        vAxis: {
                            gridlines: {
                                color: '#7fdade'
                            },
                            textStyle : {
                                color: '#333333',
                                fontSize: 10,
                                fontName: 'Proxima Regular'
                            },
                        },
                        hAxis: {
                            textStyle : {
                                color: '#333333',
                                fontSize: 10,
                                fontName: 'Proxima Regular'
                            }
                        },
                        chartArea: {
                            left: 70,
                            right: 20,
                            backgroundColor: {
                                fill: '#f4f8ff',
                            },
                        },
                    }
                };
            },
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

            getContractByAdviser: function( _clientNumber ){
                return $q(function( resolve, reject ){

                    $http({
                        method: 'GET',
                        url: URLS.getContractByAdviser + _clientNumber,
                        params: {
                            language : 'SPA',

                        }
                    }).then(function success(response) {
                        if (response.data.outCommonHeader.result.result === 1) {
                            resolve({
                                success: true,
                                data: response.data.result,
                                msg: response.data.outCommonHeader.result.messages[0].responseMessage
                            });
                        } else {
                            resolve({
                                success: false,
                                data: [],
                                msg: response.data.outCommonHeader.result.messages[0].responseMessage
                            });
                        }
                    }, function error() {
                        reject({
                            success: false,
                            type: 'not-found',
                            data: [],
                            msg: 'Ha ocurrido un error Interno'
                        });
                    });
                });
            },

            getClientInfo: function (type, search, contractType) {
                return $q(function (resolve, reject) {

                    $http({
                        method: 'GET',
                        url: URLS.getClientInfo,
                        params: {
                            descripcion: search,
                            typeQuery: type,
                            language: 'SPA',
                            titularFlag: true,
                            bankingArea: contractType,
                            contractNumber: type === 1 ? '' : search,
                            clientNumber: type === 1 ? search : ''
                        }
                    }).then(function success(response) {
                        var _response;
                        var _clientId;
                        if (typeof response !== 'undefined' && response.data.outCommonHeader.result.messages[0].responseCategory !== 'ERROR') {
                            _response = response.data.outClientOrContractClientInfoQuery.client;
                            _clientId = response.data.outClientOrContractClientInfoQuery.client[0].clientNumber;
                            resolve({
                                success: true,
                                info: _response,
                                clientId: _clientId
                            });
                        } else {
                            response.data = {
                                error: {
                                    responseMessage: response.data.outCommonHeader.result.messages[0].responseMessage
                                }
                            };
                            reject({
                                success: false,
                                info: response.data,
                                type: 'empty'
                            });
                        }

                    }, function error() {
                        reject({
                            success: false,
                            type: 'not-found'
                        });
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
            }

        };

        return obj;

    }

    angular
    	.module( 'actinver.controllers' )
        .service( 'accountSrv', accountSrv );

})();
