(function () {
    "use strict";

    function PerformanceSrv(URLS, $q, $http, csrfSrv, $filter, ErrorMessagesSrv ) {
        /**
         *  prospect service
         */
        function Performance() { }

        Performance.prototype.GetStations = function (_id) {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',                    
                    url: URLS.getInvestmentIssuersQuery + '55/0/0/0/' + _id + '/0',
                    params: {
                        language: 'SPA'
                    }
                }).then(function (response) {
                    if (response.data.outCommonHeader.result.result === 1 ) {
                        resolve(response.data.outInvestmentIssuersQuery);
                    }else if (response.data.outCommonHeader.result.result === 2 ){
                        resolve('response.data.outCommonHeader.result.messages[0].responseMessage');
                    }
                }).catch(function (error) {
                    ErrorMessagesSrv('Se encontró un error favor de intentarlo más tarde, comuníquese con su help desk');
                    reject({ error: error.data });
                });
            });
        };


        Performance.prototype.GetStationsMarket = function () {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',                    
                    url: URLS.clientIssuersMarketInfoQuery + '0/1/1/0/0/0/' ,
                    params: {
                        language: 'SPA'
                    }
                }).then(function (response) {
                    if (response.data.outCommonHeader.result.result === 1) {
                        resolve(response.data.outClientIssuersMarketInfoQuery);
                    }
                    else {
                        reject(response.data.outCommonHeader);
                    }
                });
            });
        };

        Performance.prototype.GetStationsMarketCAP = function(_market,_monitor){
            return $q(function(resolve,reject){
                $http({
                    method:'GET',
                    url: URLS.clientIssuersMarketInfoQueryV1 + '55/'+_market+'/'+_monitor+'/0/0/1',
                    params:{
                        language: 'SPA'
                    }
                }).then(function(response){
                    if(response.data.outCommonHeader.result.result === 1){
                        resolve(response.data.outClientIssuersMarketInfoQuery.marketDataTuple);
                    }else{
                        if(response.data.outCommonHeader.result.result === 2){
                            resolve(response.data.outCommonHeader.result.messages[0].responseMessage);
                        }
                    }
                }).catch(function (error){
                    ErrorMessagesSrv('Se encontró un error favor de intentarlo más tarde, comuníquese con su help desk');
                    reject({error:error.data});
                });
            });
        };

        Performance.prototype.SimulatorRest = function (_id, _model) {
            return $q(function (resolve, reject) {
                csrfSrv.csrfValidate()
                    .then(successCsrf)
                    .catch(errorCsrf);

                function successCsrf() {
                    var parametersSubmit = {
                        beginDate: _model.beginDate,
                        endDate: _model.endDate,
                        issuers: JSON.stringify(_model.issuers),
                        language: 'SPA'
                    };
                    $http({
                        method: 'POST',
                        //url: URLS.SimulatorRest + _id,
                        //url: 'http://vsdlapafro01.actinver.com.mx/ficha-valor-restful/SimulatorRest/' + _id,
                        url: 'https://bursanet.actinver.com/ficha-valor-restful/SimulatorRest/' + _id,
                        data: $.param(parametersSubmit)
                    }).then(function (response) {
                        if (response.data.status === 1) {
                            resolve(response.data.result);
                        }
                        else {
                            reject(response.data.messages);
                        }
                    });
                }

                function errorCsrf(error) {
                    reject(error);
                }

            });
        };

        Performance.prototype.getClasification = function (obj) {
            switch (obj.familyFundClassification) {
                case 1:
                    obj.clasificacion = "Alternativos";
                    break;
                case 2:
                    obj.clasificacion = "Relativo a Indices de Mercado";
                    break;
                case 3:
                    obj.clasificacion = "Paises / Economías";
                    break;
                case 4:
                    obj.clasificacion = "México Estilos de Inversión";
                    break;
                case 5:
                    obj.clasificacion = "Pesos";
                    break;
                case 6:
                    obj.clasificacion = "Dólares";
                    break;
                case 7:
                    obj.clasificacion = "Activos Locales";
                    break;
                case 8:
                    obj.clasificacion = "Activos Globales";
                    break;
                default:
                    obj.clasificacion = "";
            }
        };

        Performance.prototype.calculate = function (virtualAmount, _res) {
            var lnResult = _res.simulator.length - 1;
            var finalAmount = _res.simulator[lnResult].investmentFinal;
            return {
                start: virtualAmount,
                end: finalAmount,
                pesos: (finalAmount - virtualAmount),
                services: (virtualAmount > 0) ? (((finalAmount - virtualAmount) * 100) / virtualAmount) : 0
            };
        };

        Performance.prototype.setupDataLine = function (_simulator) {
            var historicalInfo = _simulator.map(function (_val) {
                var newDate = new Date(_val.datePrice);
                return {
                    amount: _val.investmentFinal,
                    paymentPeriod: $filter('date')(newDate, 'yyyyMMdd')
                };
            });

            return {
                chart: [{
                    historical: {
                        contractNumber: 'Valuación',
                        historicalInfo: historicalInfo
                    }
                }]
            };
        };

        Performance.prototype.sendModel = function (model) {
            var newIssuers = model.send.issuers.map(function (_val) {
                return {
                    issuer: _val.issuer,
                    serie: _val.serie,
                    virtualAmount: _val.virtualAmount
                };
            });
            return {
                send: {
                    beginDate: model.send.beginDate,
                    endDate: model.send.endDate,
                    issuers: newIssuers
                },
            };
        };

        function getValue(_name, _arrays) {
            var result = _arrays.filter(function (array) {
                return array.issuer === _name;
            });

            return result[0].percent;
        }

        Performance.prototype.setDonutChart = function (_issuers, tooltipEl, model) {
            var size;
            var chartData = [];

            _issuers.map(function (_issuer) {
                size = _issuer.elements.length - 1;
                _issuer.finalAmount = _issuer.elements[size];
                chartData.push(_issuer.finalAmount.virtualValue);
            });

            return {
                chart: {
                    labels: _issuers,
                    data: chartData,
                    cutoutPercentage: 60,
                    colors: ['#517cbd', '#f5f047', '#3366cc', '#dc3912', '#ff9900', '#109618', '#990099', '#0099c6', '#dd4477', '#66aa00', '#b82e2e', '#316395', '#994499', '#22aa99', '#aaaa11', '#6633cc', '#e67300', '#8b0707', '#651067', '#329262', '#5574a6', '#3b3eac', '#b77322', '#16d620', '#b91383', '#f4359e', '#9c5935', '#a9c413', '#2a778d', '#668d1c', '#bea413', '#0c5922', '#743411'],
                    tooltips: {
                        custom: function (tooltipModel) {
                            var positionY = this._chart.canvas.offsetTop;
                            var positionX = this._chart.canvas.offsetLeft;

                            if (tooltipModel.opacity === 0) {
                                tooltipEl.style.display = 'none';
                                return;
                            }

                            if (tooltipModel.dataPoints) {
                                tooltipEl.style.display = 'block';
                                tooltipEl.style.left = positionX + tooltipModel.caretX + 'px';
                                tooltipEl.style.top = positionY + tooltipModel.caretY + 'px';
                            }

                            return tooltipEl;
                        },
                        callbacks: {
                            label: function (tooltipModel, data) {
                                var newModel = data.labels[tooltipModel.index];
                                var percent = getValue(newModel.issuer, model.send.issuers);
                                var template = "";
                                template += '<div class="row margin-0 title">';
                                template += '<div class="col-xs-6 padding-left-10 padding-right-0">' + newModel.issuer + ' ' + newModel.serie + ' <br/> <em>Renta variable</em></div>';
                                template += '<div class="col-xs-6 percentage">' + percent + '% </div>';
                                template += '</div>';

                                template += '<div class="row margin-0 description">';
                                template += '<div class="col-xs-6">';
                                template += '<label>Monto asignado: </label>' + $filter('currency')(newModel.virtualAmount);
                                template += '</div>';
                                template += '<div class="col-xs-6 ">';
                                template += '<label>Importe final:</label>' + $filter('currency')(newModel.finalAmount.virtualValue);
                                template += '</div>';
                                template += '</div>';

                                template += '<div class="row margin-0 description">';
                                template += '<div class="col-xs-6">';
                                template += '<label>$ Plusvalía en pesos:</label>' + $filter('currency')(newModel.finalAmount.virtualValue - newModel.virtualAmount);
                                template += '</div>';
                                template += '<div class="col-xs-6">';
                                template += '<label>% Plusvalía por servicio:</label>' + $filter('currency')((newModel.virtualAmount > 0) ? (((newModel.finalAmount.virtualValue - newModel.virtualAmount) * 100) / newModel.virtualAmount) : 0, '') + '%';
                                template += '</div>';
                                template += '</div>';

                                tooltipEl.innerHTML = template;
                            },
                        },
                    },
                }
            };
        };

        Performance.prototype.getType = function (_type, _arrays, _smt01, _nameGroup) {
            var tree = [];
            var send = [];
            var amount = 0;
            var amountFinal = 0;
            var percent = 0;
            
            _arrays.filter(function (array) {
                if (array.type === _type) {
                    _smt01.filter(function (_smt01Array) {
                        if (_smt01Array.issuer === array.issuer) {
                            send.push(_smt01Array);
                            amount += parseInt(array.virtualAmount);
                            amountFinal += parseInt(_smt01Array.finalAmount.virtualValue);
                            percent += parseInt(array.percent);
                        }
                    });
                }
            });

            tree.push(send);
            tree.push(amount);
            tree.push(amountFinal);
            tree.push(percent);
            tree.push(_nameGroup);

            if(percent === 0){
                return [];
            }else{
                return tree;
            }
        };

        Performance.prototype.getGraps = function(_graphs,_doc,_model){
            var array = [];
            _graphs.filter(function (graph){
                if(graph.length !== 0){
                    var newchart  = {
                        chart: per.setDonutChart(graph[0], _doc, _model),
                        name: graph[4],
                        investmentFinal: graph[2],
                        investment: graph[1],
                    };
                    newchart.chart.chart.tooltips = {};
                    newchart.chart.chart.percentage = graph[3]+'%';
                    array.push(newchart);
                }
            });
            return array;
        };

        var per = new Performance();
        return new Performance();
    }

    angular.module('actinver.services')
        .service('PerformanceSrv', PerformanceSrv);
})();
