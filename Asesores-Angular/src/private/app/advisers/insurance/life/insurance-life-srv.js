(function () {
    'use strict';

    function insuranceLifeSrv(URLS, $q, $http, $filter) {
        var obj = {
            getLifeInsuranceStateQuery: function () {
                return $q(function (resolve, reject) {
                    $http({
                        method: 'GET',
                        url: URLS.getCatalogEntityFederal,
                        params: {
                            language: 'SPA'
                        }
                    }).then(function success(response) {
                        var _response;
                        if (response.data.outCommonHeader.result.result === 1) {
                            _response = response.data.outFederalEntityQuery.federalEntityCatalogData.federalEntity;
                            resolve({
                                success: true,
                                info: _response
                            });
                        } else {
                            reject({
                                success: false,
                                info: response.data.outCommonHeader.result
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

            getInsuranceLifeHighRiskJobValidation: function (_idJob) {
                return $q(function (resolve, reject) {
                    $http({
                        method: 'GET',
                        url: URLS.getinsuranceLifeHighRiskJobValidation,
                        params: {
                            language: 'SPA',
                            jobID: _idJob,
                            insuranceTypeID: '100'
                        }

                    }).then(function success(response) {
                        var _response;
                        if (response.data.outCommonHeader.result.result === 1) {
                            _response = response.data.outInsuranceLifeHighRiskJobValidation.operationResult;
                            resolve({
                                success: true,
                                info: _response
                            });
                        } else {
                            reject({
                                success: false,
                                info: response.data.outCommonHeader.result
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

            getAccumulatedRisksValidation: function (_idEntityValidar, _params) {
                return $q(function (resolve, reject) {
                    $http({
                        method: 'GET',
                        url: URLS.getinsuranceAccumulatedRisksValidation,
                        params: {
                            insuranceTypeID: '100',
                            packageCode: '10011',
                            currencyID: '1',
                            age: _params.riskValidation.edad,
                            name: _params.riskValidation.nombre,
                            lastName: _params.riskValidation.apePaterno,
                            secondLastName: _params.riskValidation.apeMaterno,
                            birthDate: _params.riskValidation.birthDate,
                            insuredSum: _idEntityValidar,
                            validityDate: moment().format("YYYY-MM-DD"),
                            language: 'SPA'
                        }
                    }).then(function success(response) {
                        var _response;
                        if (response.data.outCommonHeader.result.result === 1) {
                            _response = response.data.outInsuranceAccumulatedRisksValidation;
                            resolve({
                                success: true,
                                info: _response
                            });
                        } else {
                            reject({
                                success: false,
                                info: response.data.outCommonHeader.result
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

            getCatalogPostalCode: function (_idMunicipality) {
                return $q(function (resolve, reject) {
                    $http({
                        method: 'GET',
                        url: URLS.getCatalogPostalCodeQuery + _idMunicipality,
                        params: {
                            language: 'SPA',
                            MunicipalityID: _idMunicipality
                        }
                    }).then(function success(response) {
                        var _response;
                        if (response.data.outCommonHeader.result.result === 1) {
                            _response = response.data.outPostalCodeQuery.postalCodeList;
                            resolve({
                                success: true,
                                info: _response
                            });
                        } else {
                            reject({
                                success: false,
                                info: response.data.outCommonHeader.result
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

            getCuestionario: function () {
                return $q(function (resolve, reject) {
                    $http({
                        method: 'GET',
                        url: URLS.getLifeInsuranceQuestionnaireQuery,
                        params: {
                            insuranceTypeID: '100',
                            language: 'SPA'
                        }
                    }).then(function success(response) {
                        var _response;
                        if (response.data.outCommonHeader.result.result === 1) {
                            _response = response.data.outLifeInsuranceQuestionnaireQuery.condition;
                            resolve({
                                success: true,
                                info: _response
                            });
                        } else {
                            reject({
                                success: false,
                                info: response.data.outCommonHeader.result
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

            getSumaryQuery: function () {
                return $q(function (resolve, reject) {
                    $http({
                        method: 'GET',
                        url: URLS.getInsuranceInsuredSumQuery,
                        params: {
                            language: 'SPA',
                            insuranceTypeID: '100',
                            currencyID: '1',
                            validityDate: '2019-09-09'
                        }
                    }).then(function success(response) {
                        var _response;
                        if (response.data.outCommonHeader.result.result === 1) {
                            _response = response.data.outInsuranceInsuredSumQuery.insuranceInsuredSumQueryEntity;
                            resolve({
                                success: true,
                                info: _response
                            });
                        } else {
                            reject({
                                success: false,
                                info: response.data.outCommonHeader.result
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

            getLifeinsuranceNationalityQuery: function () {
                return $q(function (resolve, reject) {
                    $http({
                        method: 'GET',
                        url: URLS.getInsuranceCountryQuery,
                        params: {
                            language: 'SPA',
                            insuranceTypeID: '100'
                        }
                    }).then(function success(response) {
                        var _response;
                        _response = response;
                        resolve({
                            success: true,
                            info: _response
                        });
                        if (response.data.outCommonHeader.result.result === 1) {
                            _response = response.data.outInsuranceCountryQuery.insuranceCountry;
                            resolve({
                                success: true,
                                info: _response
                            });
                        } else {
                            reject({
                                success: false,
                                info: response.data.outCommonHeader.result
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

            getInsuranceMaritalStatusQuery: function () {
                return $q(function (resolve, reject) {
                    $http({
                        method: 'GET',
                        url: URLS.getInsuranceMaritalStatusQuery,
                        params: {
                            insuranceTypeID: '100',
                            language: 'SPA'
                        }
                    }).then(function success(response) {
                        var _response;
                        if (response.data.outCommonHeader.result.result === 1) {
                            _response = response.data.outInsuranceMaritalStatusQuery.insuranceMaritalStatus;
                            resolve({
                                success: true,
                                info: _response
                            });
                        } else {
                            reject({
                                success: false,
                                info: response.data.outCommonHeader.result
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

            getCatalogExpenseJob: function () {
                return $q(function (resolve, reject) {
                    $http({
                        method: 'GET',
                        url: URLS.getLifeInsuranceExpenseJobQuery,
                        params: {
                            language: 'SPA',
                            insuranceTypeID: 100
                        }
                    }).then(function success(response) {
                        var _response;
                        if (response.data.outCommonHeader.result.result === 1) {
                            _response = response.data.outLifeInsuranceJobQuery.ocupationList;
                            resolve({
                                success: true,
                                info: _response
                            });
                        } else {
                            reject({
                                success: false,
                                info: response.data.outCommonHeader.result
                            });
                        }
                    }), function error() {
                        reject({
                            success: false,
                            type: 'not-found'
                        });
                    };
                });
            },

            getLifeInsuranceRelationshipQuery: function () {
                return $q(function (resolve, reject) {
                    $http({
                        method: 'GET',
                        url: URLS.getLifeInsuranceRelationshipQuery,
                        params: {
                            language: 'SPA',
                            insuranceTypeID:'100'
                        }
                    }).then(function success(response) {
                        var _response;
                        if (response.data.outCommonHeader.result.result === 1) {
                            _response = response.data.outLifeInsuranceRelationshipQuery.relationships;
                            resolve({
                                success: true,
                                info: _response
                            });
                        } else {
                            reject({
                                success: false,
                                info: response.data.outCommonHeader.result
                            });
                        }
                    }), function error() {
                        reject({
                            success: false,
                            type: 'not-found'
                        });
                    };
                });
            },

            getCatalogPaymentTypeQuery: function () {
                return $q(function (resolve, reject) {
                    $http({
                        method: 'GET',
                        url: URLS.getCatalogPaymentTypeQuery,
                        params: {
                            language: 'SPA'
                        }
                    }).then(function success(response) {
                        var _response;
                        if (response.data.outCommonHeader.result.result === 1) {
                            _response = response.data.outPaymentTypeQuery.paymentTypeList;
                            resolve({
                                success: true,
                                info: _response
                            });
                        } else {
                            reject({
                                success: false,
                                info: response.data.outCommonHeader.result
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

            getCatalogBanks: function () {
                return $q(function( resolve, reject ) {
                    $http({
                        method: 'GET',
                        url: URLS.getCatalogBanks,
                        params: {
                            language : 'SPA'
                        }
                    }).then(function success( response ) {
                        if ( response.data.outCommonHeader.result.result === 1 ) {
                            resolve({ success: true, info: response.data.outInsuranceBanksQuery.insuranceBanksCatalogData.bank });
                        }else{
                            reject( {success: false, info: response.data.outCommonHeader.result });
                        }
                    }, function error(){
                        reject( {success: false, type: 'not-found'} );
                    });
                });
            },

            getLifeInsuranceMunicipalityQuery: function (_idEntityFederative) {
                return $q(function (resolve, reject) {
                    $http({
                        method: 'GET',
                        url: URLS.getCatalogMunicipalityCars + _idEntityFederative,
                        params: {
                            language: 'SPA'
                        }
                    }).then(function success(response) {
                        var _response;
                        if (response.data.outCommonHeader.result.result === 1) {
                            _response = response.data.outMunicipalityQuery.municipalityCatalogData.municipality;
                            resolve({
                                success: true,
                                info: _response
                            });
                        } else {
                            reject({
                                success: false,
                                info: response.data.outCommonHeader.result
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

            getCatalogCardTypeQuery: function () {
                return $q(function (resolve, reject) {
                    $http({
                        method: 'GET',
                        url: URLS.getCatalogCardTypeQuery,
                        params: {
                            language: 'SPA'
                        }
                    }).then(function success(response) {
                        var _response;
                        if (response.data.outCommonHeader.result.result === 1) {
                            _response = response.data.outInsuranceCardTypeQuery.cardTypeList;
                            resolve({
                                success: true,
                                info: _response
                            });
                        } else {
                            reject({
                                success: false,
                                info: response.data.outCommonHeader.result
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
            
            getServiceLifeInsuranceQuotation: function (_datos) {
                return $q(function (resolve, reject) {
                    $http({
                        method: 'POST',
                        url: URLS.getLifeInsuranceQuotation,
                        params: {
                            language: _datos.language,
                            insurancePolicyDate: _datos.insurancePolicyDate,
                            policyMaturityDate: _datos.policyMaturityDate,
                            agentCode: _datos.agentCode,
                            paymentManagerID: _datos.paymentManagerID,
                            smokerFlag: _datos.smokerFlag,
                            clientNumber: _datos.clientNumber,
                            adviserID: _datos.adviserID,
                            contractingData: JSON.stringify({
                                name: _datos.contractingData.name,
                                lastName: _datos.contractingData.lastName,
                                secondLastName: _datos.contractingData.secondLastName,
                                fiscalIDNumber: _datos.contractingData.fiscalIDNumber,
                                street: _datos.contractingData.street,
                                outdoorNumber: _datos.contractingData.outdoorNumber,
                                neighborhood: _datos.contractingData.neighborhood,
                                postalCode: _datos.contractingData.postalCode,
                                federalEntityID: _datos.contractingData.federalEntityID,
                                delegationMunicipalityID: _datos.contractingData.delegationMunicipalityID,
                                countryID: _datos.contractingData.countryID,
                                phoneNumber: _datos.contractingData.phoneNumber,
                                birthDate: _datos.contractingData.birthDate,
                                gender: _datos.contractingData.gender,
                                maritalStatusID: _datos.contractingData.maritalStatusID,
                                nacionality: _datos.contractingData.nacionality,
                                personType: _datos.contractingData.personType,
                                email: _datos.contractingData.email,
                                insuranceBeneficiaryTypeID: _datos.contractingData.insuranceBeneficiaryTypeID,
                                professionID: _datos.contractingData.professionID,
                                jobID: _datos.contractingData.jobID,
                                height: _datos.contractingData.height,
                                weight: _datos.contractingData.weight,
                                age: _datos.contractingData.age
                            }),

                            basicCoverage: JSON.stringify({
                                insuredSum: _datos.accidentalDeathCoverage.insuredSum
                            }),
                            accidentalDeathCoverage: JSON.stringify({
                                insuredSum: _datos.accidentalDeathCoverage.insuredSum
                            })
                        }
                    }).then(function success(response) {
                        var _response;
                        if (response.data.outCommonHeader.result.result.toString() === "1") {
                            _response = response.data.outLifeInsuranceQuotation;
                            resolve({
                                success: true,
                                info: _response,
                                response: response.data
                            });
                        } else {
                            resolve({
                                success: false,
                                info: response.data.outCommonHeader.result
                            });
                        }
                    }), function error() {
                        reject({
                            success: false,
                            type: 'not-found'
                        });
                    };
                });
            },
            
            getServiceLifeInsurancePolicyRegistration: function (_datos) {
                return $q(function (resolve, reject) {
                    $http({
                        method: 'POST',
                        url: URLS.getLifeInsurancePolicyRegistration,
                        params: {
                            language: _datos.language,
                            insurancePolicyDate: _datos.insurancePolicyDate,
                            policyMaturityDate: _datos.policyMaturityDate,
                            agentCode: _datos.agentCode,
                            paymentManagerID: _datos.paymentManagerID,
                            smokerFlag: _datos.smokerFlag,
                            clientNumber: _datos.clientNumber,
                            adviserID: _datos.adviserID,
                            chargeManager: _datos.chargeManager,
                            contractingData: JSON.stringify(_datos.contractingData),
                            insuredData: JSON.stringify(_datos.insuredData),
                            beneficiaryDataList: JSON.stringify(_datos.beneficiaryDataList),
                            basicCoverage: JSON.stringify(_datos.basicCoverage),
                            accidentalDeathCoverage: JSON.stringify(_datos.accidentalDeathCoverage),
                            bankingData: JSON.stringify(_datos.bankingData)
                        }
                    }).then(function success(response) {
                        var _response;
                        if (response.data.outCommonHeader.result.result === 1) {
                            _response = response.data.outLifeInsurancePolicyRegistration;
                            resolve({
                                success: true,
                                info: _response
                            });
                        } else {
                            resolve({
                                success: false,
                                info: response.data.outCommonHeader.result
                            });
                        }
                    }), function error() {
                        reject({
                            success: false,
                            type: 'not-found'
                        });
                    };
                });
            },
            
            getServiceInsuranceBeneficiaryTypeQuery: function () {
                return $q(function (resolve, reject) {
                    $http({
                        method: 'GET',
                        url: URLS.getInsuranceBeneficiaryTypeQuery,
                        params: {
                            language: 'SPA',
                            insuranceTypeID: '100'
                        }
                    }).then(function success(response) {
                        if (response.data.outCommonHeader.result.result === 1) {
                            resolve({
                                success: true,
                                info: response.data.outInsuranceBeneficiaryTypeQuery.beneficiary
                            });
                        } else {
                            reject({
                                success: false,
                                info: response.data.outCommonHeader.result
                            });
                        }
                    }), function error() {
                        reject({
                            success: false,
                            type: 'not-found'
                        });
                    };
                });
            },

            ServiceEmailSendingAsesoriaSolicitudUsuario: function (_mailTo, _nombre, _noPoliza, _agente, _smoke, ocupacion, kg, mts, edad, AMBT) {
                var urlSolicitudPRO = "https://zonaliados.mapfre.com.mx/impresionSeGA/TWImpSolicitudMarco.aspx?noPoliza=" + _noPoliza + "&sector=1&usuario=actinver&agente=" + _agente + "&eMail=&btnPoliza=N&RelSol=MEXICO|" + (_smoke === "false" ? "NO" : "SI") + "|" + ocupacion + "|TEMPORAL 1 AÑO|" + kg + "|" + mts + "|" + edad + "|X|X|X|X|";
                var urlSolicitudUAT = "https://10.184.62.77/impresionSeGA/TWImpSolicitudMarco.aspx?noPoliza=" + _noPoliza + "&sector=1&usuario=actinver&agente=" + _agente + "&eMail=&btnPoliza=N&RelSol=MEXICO|" + (_smoke === "false" ? "NO" : "SI") + "|" + ocupacion + "|TEMPORAL 1 AÑO|" + kg + "|" + mts + "|" + edad + "|X|X|X|X|";

                return $q(function (resolve, reject) {
                    $http({
                        method: 'POST',
                        url: URLS.sendCustomizedEmailNotificationSending,
                        params: {
                            language: 'SPA',
                            emailFrom: 'seguros@actinver.com.mx',
                            idTemplate: 'buildDBTemplate|26',
                            emailSubject: 'Estas a un paso de obtener tu Seguro de Vida Inversión Actinver.',
                            mailTo: [_mailTo],
                            mailCC: [''],
                            nombre: _nombre,
                            noPoliza: _noPoliza,
                            urlSolicitud: (AMBT === 'PRO' ? urlSolicitudPRO : urlSolicitudUAT)
                        }
                    }).then(function success(response) {
                        var _response;
                        if (response.data.outCommonHeader.result.result === 1) {
                            _response = response.data.outCommonHeader.result.messages[0];
                            resolve({
                                success: true,
                                info: _response
                            });
                        } else {
                            resolve({
                                success: false,
                                info: response.data.outCommonHeader.result
                            });
                        }
                    }),
                    function error() {
                        reject({
                            success: false,
                            type: 'not-found'
                        });
                    };
                });
            },

            ServiceEmailSendingAsesoriaNotificacionAsesor: function (_mailTo, _noPoliza) {
                return $q(function (resolve, reject) {
                    $http({
                        method: 'POST',
                        url: URLS.sendCustomizedEmailNotificationSending,
                        params: {
                            language: 'SPA',
                            emailFrom: 'seguros@actinver.com.mx',
                            idTemplate: 'buildDBTemplate|27',
                            emailSubject: 'La póliza ' + _noPoliza + ' esta lista en el módulo.',
                            mailTo: [_mailTo],
                            mailCC: [''],
                            noPoliza: _noPoliza
                        }
                    }).then(function success(response) {
                        var _response;
                        if (response.data.outCommonHeader.result.result === 1) {
                            _response = response.data.outCommonHeader.result.messages[0];
                            resolve({
                                success: true,
                                info: _response
                            });
                        } else {
                            resolve({
                                success: false,
                                info: response.data.outCommonHeader.result
                            });
                        }
                    }),
                    function error() {
                        reject({
                            success: false,
                            type: 'not-found'
                        });
                    };
                });
            },

            ServiceEmailSendingAsesoriaPolizaLista: function (_mailTo, _nombre, _noPoliza, _inicioVigencia, _finVigencia, _urlPoliza, _urlSolicitud, _urlCondiciones) {
                return $q(function (resolve, reject) {
                    $http({
                        method: 'POST',
                        url: URLS.sendCustomizedEmailNotificationSending,
                        params: {
                            language: 'SPA',
                            emailFrom: 'seguros@actinver.com.mx',
                            idTemplate: 'buildDBTemplate|26',
                            emailSubject: 'Póliza emitida seguro de vida inversión Actinver ' + _noPoliza,
                            mailTo: [_mailTo],
                            mailCC: [''],
                            nombre: _nombre,
                            noPoliza: _noPoliza,
                            inicioVigencia: _inicioVigencia,
                            finVigencia: _finVigencia,
                            urlPoliza: _urlPoliza,
                            urlSolicitud: _urlSolicitud,
                            urlCondiciones: _urlCondiciones                            
                        }
                    }).then(function success(response) {
                        var _response;
                        if (response.data.outCommonHeader.result.result === 1) {
                            _response = response.data.outCommonHeader.result.messages[0];
                            resolve({
                                success: true,
                                info: _response
                            });
                        } else {
                            resolve({
                                success: false,
                                info: response.data.outCommonHeader.result
                            });
                        }
                    }),
                    function error() {
                        reject({
                            success: false,
                            type: 'not-found'
                        });
                    };
                });
            },

            ListaPolizasVida: function (employeeRole) {
                return $q(function (resolve, reject) {
                    $http({
                        method: 'GET',
                        url: URLS.getPolizasVida,
                        params: {
                            language: 'SPA',
                            employeeRole: employeeRole
                        }
                    }).then(function success(response) {
                        var _response;
                        if (response.data.return.status === 1) {
                            _response = response.data.return.data.polizaVidaListRs;
                            resolve({
                                success: true,
                                info: _response
                            });
                        } else {
                            reject({
                                success: false,
                                info: response.data.return
                            });
                        }
                    }),
                    function error() {
                        reject({
                            success: false,
                            type: 'not-found'
                        });
                    };
                });
            },

            ListaPolizasVidaUp: function (_noPoliza, _estatusPoliza) {
                return $q(function (resolve, reject) {
                    $http({
                        method: 'GET',
                        url: URLS.PolizaVidaUp,
                        params: {
                            language: 'SPA',
                            policyId: _noPoliza,
                            policyStatus: _estatusPoliza
                        }
                    }).then(function success(response) {
                        resolve({
                            success: true,
                            info: response
                        });
                    }),
                    function error() {
                        resolve({
                            success: false,
                            type: 'not-found'
                        });
                    };
                });
            },

            ListaPolizasVidaAdd: function (_noPoliza, _polizaDate, _polizaDateEnd, _polizaAmount,
                _polizaStatus, _clientName, _clientLastname, _clientSecondname, _clientEmail, _idAgente, _agentEmail) {
                return $q(function (resolve, reject) {
                    $http({
                        method: 'GET',
                        url: URLS.PolizaVidaAdd,
                        params: {
                            language: 'SPA',
                            policyId: _noPoliza,
                            policyDate: _polizaDate,
                            policyDateEnd: _polizaDateEnd,
                            policyAmount: _polizaAmount,
                            policyStauts: _polizaStatus,
                            clientName: _clientName,
                            clientLastname: _clientLastname,
                            clientSecondname: _clientSecondname,
                            clientEmail: _clientEmail,
                            idAgente: _idAgente,
                            agentEmail: _agentEmail
                        }
                    }).then(function success(response) {

                        var _response;
                        if (response.data.return.status === 1) {
                            _response = response.data.return;
                            resolve({
                                success: true,
                                info: _response
                            });
                        } else {
                            reject({
                                success: false,
                                info: response.data.return
                            });
                        }
                    }),
                    function error() {

                        reject({
                            success: false,
                            type: 'not-found'
                        });
                    };
                });
            }
        };
        
        return obj;
    }

    angular
        .module('actinver.controllers')
        .service('insuranceLifeSrv', insuranceLifeSrv);

})();