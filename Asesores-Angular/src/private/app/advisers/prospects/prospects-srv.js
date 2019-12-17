(function () {
    "use strict";

    function prospectSrv(URLS, $q, $http, $filter, FileSaver, ErrorMessagesSrv, csrfSrv, userConfig) {

        var userID = userConfig.user.employeeID;
        /**
         *  prospect service
         */
        function Prospects() { }

        Prospects.prototype.nextStage = function (_model) {

            return $q(function (resolve) {
                $http({
                    method: 'POST',
                    url: URLS.nextStage,
                    data: $.param(_model),
                    params: {
                        language: 'SPA'
                    }
                }).then(function (response) {
                    if (response.data.status) {
                        resolve();
                    }
                });
            });
        };

        Prospects.prototype.downloadPDF = function () {
            return $q(function (resolve, reject) {
                $http.post(
                    URLS.downloadPDF,
                    {},
                    { responseType: "arraybuffer" }
                ).then(
                    function (_response) {
                        var type = _response.headers('Content-Type');
                        var blob = new Blob([_response.data], { type: type });
                        FileSaver.saveAs(blob, 'bitacora_');
                        resolve();
                    }, function (_error) {
                        reject(_error);
                    }
                    );
            });
        };

        Prospects.prototype.getDetailProspect = function (_id, _band) {
            var newUrl = _band ? (_id + '/' + _band) : _id;
            return $q(function (resolve) {
                $http({
                    method: 'GET',
                    url: URLS.getDetailProspect + newUrl,
                    params: {
                        language: 'SPA'
                    }
                }).then(function (response) {
                    if (response.data.status) {
                        response.data.result.stage = {};
                        response.data.result.stage.idStage = _band;
                        resolve(response.data.result);
                    }
                });
            });
        };
        Prospects.prototype.getInfoClient = function(model){
            return $q(function( resolve, reject ){
                $http({
                    method: 'GET',
                    url: URLS.getClientInfo,
                    params: {            
                        typeQuery: model.type,                                    
                        language : 'SPA',                        
                        titularFlag: true,
                        bankingArea : model.bankingArea,
                        contractNumber : model.contractNumber,
                        clientNumber :  model.clientNumber
                    }
                }).then(function success( response ) {
                    var _response;
                    var _msg = '';
                    if (typeof response !== 'undefined' && response.data.outCommonHeader.result.result === 1) {
                        _response = response.data.outClientOrContractClientInfoQuery.client;                        
                        _msg = response.data.outCommonHeader.result.messages[0].responseMessage;
                        resolve({ success: angular.isArray(_response) && _response.length > 0, data: _response, msg: _msg });
                    } else {                        
                        _msg = response.data.outCommonHeader.result.messages[0].responseMessage;
                        resolve({ success: false, data: [], msg: _msg });
                    }

                }, function error(){
                    reject( {success: false, data:[], msg:'Se encontró un error favor de intentarlo más tarde, comuníquese con su help desk'} );
                });
            });
        };

        Prospects.prototype.getStages = function () {
            return $q(function (resolve) {
                $http({
                    method: 'GET',
                    url: URLS.getStages,
                    params: {
                        language: 'SPA'
                    }
                }).then(function (response) {
                    resolve(response.data.result);
                });
            });
        };

        Prospects.prototype.getListByEmployee = function (_id) {
            return $q(function (resolve) {
                $http({
                    method: 'GET',
                    url: URLS.getListOpportunity + _id,
                    params: {
                        language: 'SPA'
                    }
                }).then(function (response) {
                    resolve(response.data.result);
                });
            });
        };

        Prospects.prototype.getStageProspect = function (_id , _idProspect) {
            return $q(function (resolve) {
                $http({
                    method: 'GET',
                    url: URLS.getListByEmployee + _id,
                    params: {
                        language: 'SPA'
                    }
                }).then(function (response) {
                    var listProspect = response.data.result.prospects;
                    var detailProspect = {};
                    listProspect.forEach(function(element) {
                            if (element.idProspect === _idProspect){
                                detailProspect = element;
                            }              
                    }, this);

                    resolve(detailProspect);
                });
            });
        };   

        Prospects.prototype.getOpportunityById = function (idOpportunity) {
            return $q(function (resolve) {
                $http({
                    method: 'GET',
                    url: URLS.getOpportunityById + idOpportunity,
                    params: {
                        language: 'SPA'
                    }
                }).then(function (response) {
                    resolve(response.data.result);
                });
            });
        };

        Prospects.prototype.updateContacted = function (_id) {
            return $q(function (resolve, reject) {
                $http({
                    method: 'POST',
                    url: URLS.updateContacted,
                    params: {
                        idOpportunity : _id,
                        language: 'SPA'
                    }
                }).then(function (response) {
                    if (response.data.status === 1) {
                        resolve(response.data);
                    }
                    else {
                        reject(false);
                    }
                });
            });
        };

        Prospects.prototype.getCatalogSearch = function () {
            return $q(function (resolve) {

                $http({
                    method: 'GET',
                    url: URLS.getCatalogSearch,
                    params: {
                        language: 'SPA'
                    }
                }).then(function (response) {
                    resolve(response.data);
                });
            });
        };

        Prospects.prototype.getTableProspects = function (_item) {
            return $q(function (resolve) {
                $http({
                    method: 'GET',
                    url: URLS.getTableProspects + _item,
                }).then(function (response) {
                    resolve(response.data.results);
                });
            });
        };

        Prospects.prototype.prospecsPT = function () {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.prospecsPT,
                }).then(function (response) {
                    if (response.data.outCommonHeader.result.result === 1) {
                        resolve(response.data.outTelephoneTypeCatalog);
                    }
                    else {
                        reject(true);
                    }
                });
            });
        };

        Prospects.prototype.getProspectTPC = function () {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getProspectTPC,
                }).then(function (response) {

                    if (response.data.status === 1) {
                        resolve(response.data.result);
                    }
                    else {
                        reject(null);
                    }
                });
            });
        };

        Prospects.prototype.getProspectProfile = function () {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getProspectProfile,
                }).then(function (response) {
                    if (response.data.length > 0) {
                        resolve(response.data);
                    }
                    else {
                        reject(null);
                    }
                });
            });
        };

        Prospects.prototype.getPrincipalgraphics = function (_type1, _type2, _userID) {
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getProsGraphics  + _type1 + '/' + _type2 + '/' + _userID,
                    params: {
                        language: 'SPA'
                    }
                }).then(function (response) {
                    if (response.data.status === 1) {
                        resolve(response.data.payload);
                    }
                    else {
                        reject(false);
                    }
                });
            });
        };

        Prospects.prototype.getProsReports = function (_date, _type, _userID) {
            var newDate = $filter('date')(_date, 'MM-yyyy');
            var type = _type === 'mes' ? 0 : 1;
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getProsReports + newDate + '/' + type + '/' + _userID,
                }).then(function (response) {
                    if (response.data.status === 1) {
                        resolve(response.data.payload);
                    }
                    else {
                        reject(false);
                    }
                });
            });
        };

        Prospects.prototype.getReportOpportunity = function ( _userID, _date) { 
            var date =  $filter('date')( _date, 'MM/yyyy');         
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getOpportunityReport + _userID +'/'+ date,
                    params: {
                        language: 'SPA'
                    }
                }).then(function (response) {
                    if (response.data.status === 1) {
                        resolve(response.data);
                    }
                    else {
                        reject(false);
                    }
                });
            });
        };

        Prospects.prototype.getReportOpportunityDetail = function ( _userID, _date) {
            var date =  $filter('date')( _date, 'MM/yyyy');           
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getReportOpportunityDetail + _userID +'/'+ date,
                    params: {
                        language: 'SPA'
                    }
                }).then(function (response) {
                    if (response.data.status === 1) {
                        resolve(response.data);
                    }
                    else {
                        reject(false);
                    }
                });
            });
        };

        Prospects.prototype.getReportOpportunityDetailFC = function ( _idFC, _date) {
            var date =  $filter('date')( _date, 'MM/yyyy');           
            return $q(function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getReportOpportunityDetailFC + _idFC +'/'+ date,
                    params: {
                        language: 'SPA'
                    }
                }).then(function (response) {
                    if (response.data.status === 1) {
                        resolve(response.data);
                    }
                    else {
                        reject(false);
                    }
                });
            });
        };

        Prospects.prototype.saveActivity = function (_activity) {
            return $q(function (resolve, reject) {
                csrfSrv.csrfValidate().
                    then(successCsrf).
                    catch(errorCsrf);
                function successCsrf() {

                    $http({
                        method: 'POST',
                        url: URLS.saveActivity,
                        data: $.param(_activity)
                    }).then(function (response) {
                        if (response.data.status === 1) {
                            resolve(response.data.payload);
                        }
                        else {
                            reject(false);
                        }
                    }).catch(function (error) {
                        ErrorMessagesSrv('Se encontró un error favor de intentarlo más tarde, comuníquese con su help desk');
                        reject({ error: error.data });
                    });
                }

                function errorCsrf(error) {
                    reject(error);
                }

            });
        };

        Prospects.prototype.updateOpportunity = function (_opportunity, _IDOpportunity) {
            return $q(function (resolve, reject) {
                csrfSrv.csrfValidate().
                    then(successCsrf).
                    catch(errorCsrf);

                var comment='';    
                if(_opportunity.stage.idStage === 8){
                    comment = 'Cambio a Prospecto';
                }else if(_opportunity.stage.idStage === 9) {
                    comment = 'Cambio a Apertura';
                }else if(_opportunity.stage.idStage === 10){
                     comment = _opportunity.lowMotive.text;
                }

                var sendModel = {
                    language: 'SPA',
                    idOpportunity: _IDOpportunity,
                    nameOpportunity: _opportunity.clientName,
                    phone: _opportunity.phone,
                    mail: _opportunity.email,
                    idStage: _opportunity.stage.idStage,
                    segment: _opportunity.segment.text,
                    comment: comment 

                };

                function successCsrf() {
                    $http({
                        method: 'POST',
                        url: URLS.updateOpportunity,
                        data: $.param(sendModel)
                    }).then(function (response) {
                        if (response.data.status === 1) {
                            resolve({ success: true, data: response.data.messages[0].description });
                        }else {
                            resolve({ success: false, data: response.data.messages[0].description });
                        }
                    }).catch(function (error) {
                        ErrorMessagesSrv('Se encontró un error favor de intentarlo más tarde, comuníquese con su help desk');
                        reject({ error: error.data });
                    });
                }

                function errorCsrf(error) {
                    reject(error);
                }

            });
        };

        Prospects.prototype.removeActivity = function (_model) {
            return $q(function (resolve, reject) {
                csrfSrv.csrfValidate().
                    then(successCsrf).
                    catch(errorCsrf);

                function successCsrf() {
                    $http({
                        method: 'POST',
                        url: URLS.deleteActivity,
                        data: $.param( _model)
                    }).then(function (response) {
                        if (response.data.status === 1) {
                            resolve(response.data.payload);
                        }
                        else {
                            reject(false);
                        }
                    });
                }

                function errorCsrf(error) {
                    reject(error);
                }

            });
        };

        Prospects.prototype.updateActivity = function (_model) {
            return $q(function (resolve, reject) {
                csrfSrv.csrfValidate().
                    then(successCsrf).
                    catch(errorCsrf);
                function successCsrf() {
                    $http({
                        method: 'POST',
                        url: URLS.updateActivity,
                        data: $.param( _model)
                    }).then(function (response) {
                        if (response.data.status === 1) {
                            resolve(response.data.payload);
                        }
                        else {
                            reject(false);
                        }
                    }).catch(function (error) {
                        ErrorMessagesSrv('Se encontró un error favor de intentarlo más tarde, comuníquese con su help desk');
                        reject({ error: error.data });
                    });
                }

                function errorCsrf(error) {
                    reject(error);
                }

            });
        }; 

        Prospects.prototype.completeActivity = function (_id) {
            return $q(function (resolve, reject) {
                $http({
                    method: 'POST',
                    url: URLS.closeActivity,
                    params: {
                        idActivityStage : _id,
                        language: 'SPA'
                    }
                }).then(function (response) {
                    if (response.data.status === 1) {
                        resolve(response.data.payload);
                    }
                    else {
                        reject(false);
                    }
                });
            });
        };

        function generateOptions(_total, isDiferent) {
            var options = [];
            var total = 0;
            var remaining = 0;

            R.mapObjIndexed(function (_val, id) {
                if (isDiferent) {
                    options.push(_val);
                    total += _val;
                    if (id === 'clients') {
                        remaining += _val;
                    }
                }
                else {
                    if (id === "value") {
                        options.push(_val);
                    }
                }
            }, _total);

            return {
                "options": options,
                "percentage": isDiferent ? total : (_total.value + _total.quantity),
                "remaining": remaining
            };
        }

        Prospects.prototype.generateDataChart = function (_data, isDiferent) {
            var options = generateOptions(_data, isDiferent);

            var config = {
                chart: {
                    data: options.options,
                    percentage: options.percentage,
                    cutoutPercentage: 70,
                    colors: [
                        "#00bebe",
                        "#f5f047"
                    ],
                },
                remaining: options.remaining,
            };

            if (isDiferent) {
                config.chart.pieceLabel = {
                    fontFamily: "Proxima Semibold",
                    mode: "value",
                    fontSize: 10,
                    fontStyle: 'bold',
                    fontColor: '#0f3f88',
                    arc: true,
                };
            }

            return config;
        };

        return new Prospects();
    }

    angular.module('actinver.services')
        .service('prospectSrv', prospectSrv);
})();
