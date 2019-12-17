(function() {
    "use strict";

    loginCtrl.$inject = ['$http', 'Auth'];
    function loginCtrl($http, Auth) {
        var vm = this;
        vm.service = {
            error: "",
            mensaje: ""
        };
        vm.blur = "";
        vm.login = function(credentials) {
            vm.spinner = true;
            Auth.login(credentials.user, credentials.password).then(function successCallback(response) {
                vm.spinner = false;
                vm.service.error = !response.success;
                vm.service.mensaje = response.message;
                var url='index.html#/generic';
 
                //Redirecciona a dashboard
                for(var pos =0; pos < response.data.componentDTO.length;pos++){
                    var acceso=response.data.componentDTO[pos];
                    
                    if("asesores.InicioMenu." === acceso.trim()){
                        url="index.html#/dashboard";
                        break;
                    }else if("asesores.OperacionesPendientesMenu.Cat" === acceso.trim()){
                        url="index.html#/received"; 
                        break;
                    }


                }

                //Redirecciona a ruta 
                location.assign(url);
                //window.location.href=url;

            }, function errorCallback(error) {
                vm.spinner = false;
                vm.service.error = !error.success;
                vm.service.mensaje = error.message;
            });


        };

    }

    angular.module('actinver.services', []);
    angular.module('actinver.constants', []);
    angular
        .module('actinver', [
            'ui.bootstrap',
            'actinver.services',
            'actinver.constants',
            'ngStorage'
        ])
        .controller('loginCtrl', loginCtrl);

})();

(function() {
    "use strict";

    auth.$inject = ['$sessionStorage', '$q', 'userConfig', 'loginSrvc'];
    function auth($sessionStorage, $q, userConfig, loginSrvc) {
        /**
         *  User profile resource
         */
        var Profile = {
            login: function(_credentials) {
                return loginSrvc.makeRequestLogin(_credentials);
            },
            permisos: function(_employeeNumber) {
                return loginSrvc.makeRequestPermissions(_employeeNumber);
            },
            csrf : function () {
                return loginSrvc.makeCsrfToken();
            },
            logout : function () {
                return loginSrvc.makeRequestLogout();
            }
        };

        var auth = {};

        var userHasPermissionForView = function(view) {
            if (!auth.isLoggedIn()) {
                return false;
            }

            if (!view.permissions || !view.permissions.length) {
                return true;
            }

            return auth.userHasPermission(view.permissions);
        };


         auth.currentUser = function() {
            return {
                user: JSON.parse($sessionStorage.user),
                user_permissions: JSON.parse($sessionStorage.user_permissions)
            };
        };


        /**
         *  Saves the current user in the root scope
         *  Call this in the app run() method
         */
        auth.init = function() {
            if (auth.isLoggedIn()) {
                userConfig.user =  auth.currentUser().user;
                userConfig.user_permissions =  auth.currentUser().user_permissions;
            }
        };

        auth.csrf = function () {
            return $q(function (resolve, reject) {
                Profile.csrf()
                    .then(successCallback)
                    .catch(errorCallback);

                function successCallback () {
                    resolve(true);
                }

                function errorCallback(error){
                    reject(error);
                }
            });
        };


        auth.login = function(username, password) {
            return $q(function(resolve, reject) {
                auth.csrf()
                    .then(successCallBack)
                    .catch();

                function successCallBack () {
                    Profile.login({
                        username: username,
                        password: password
                    }).then(function successCallback(response) {
                        $sessionStorage.user = JSON.stringify(response.data);
                        userConfig.user = response.data;
                        resolve(
                            auth.permission(response.data.employeeID)
                        );
                    }).catch(function(error) {
                        reject(error);
                    });
                }

            });
        };

        auth.permission = function(employeeID) {
            return $q(function(resolve, reject) {
                Profile.permisos(
                    employeeID
                ).then(function successCallback(response) {
                    $sessionStorage.user_permissions = JSON.stringify(response.data);
                    userConfig.user_permissions = response.data;
                    resolve(response);
                }).catch(function(error) {
                    reject(error);
                });
            });
        };

        auth.logout = function() {
            loginSrvc.makeCsrfToken()
                .then(doLogout)
                .catch();

            function doLogout (csrf) {
                Profile.logout(csrf)
                    .then(successCallback)
                    .catch(errorCallback);

                function successCallback () {
                    // delete $sessionStorage.user;
                    // delete $sessionStorage.user_permissions;
                    // delete $sessionStorage.sclient;
                    // delete userConfig.user;
                    // delete userConfig.user_permissions;
                    sessionStorage.clear();
                    location.assign('/asesoria/login');
                }

                function errorCallback (error) {
                    //login for errors in server
                    console.error(error);
                }
            }
        };


        auth.checkPermissionForView = function(view) {
            if (!view.requiresAuthentication) {
                return true;
            }

            return userHasPermissionForView(view);
        };


        auth.userHasPermission = function(permissions) {

            if (!auth.isLoggedIn()) {
                return false;
            }

            var found = R.find(function(permission) {
                return userConfig.user_permissions.componentDTO.indexOf(permission) >= 0;
            }, permissions);

            return found;
        };


        auth.isLoggedIn = function() {
            return $sessionStorage.user !== null && $sessionStorage.user !== undefined;
        };

        return auth;
    }


    angular.module('actinver.services')
        .factory('Auth', auth);


})();

(function() {
    "use strict";

    loginSrvc.$inject = ['$http', '$q', 'URLS', 'CommonModalsSrv'];
    function loginSrvc($http, $q, URLS, CommonModalsSrv) {
        /**
         *  Login service user and password are required
         */
        var ls = this;
        //var errorMessage;

        ls.makeCsrfToken = function() {
            return $q(function (resolve, reject) {
                var _url = location.href;
                $http.head(_url)
                    .then(successCallback)
                    .catch(errorCallback);

                function successCallback(csrf) {
                    var _csrf = csrf.headers('X-CSRF-TOKEN');
                    sessionStorage.setItem('__csrf',csrf.headers('X-CSRF-TOKEN'));
                    resolve({
                        success: true,
                        data: _csrf,
                        message: "Operación realizada con éxito"
                    });
                }

                function errorCallback(){
                    reject({
                        success: false,
                        data: {},
                        message: "Ha ocurrido un error de seguridad"
                    });
                }
            });
        };

        ls.makeRequestLogout = function () {
            return $q(function(resolve, reject) {
                $http({
                    method: 'POST',
                    url: URLS.logout,
                    headers:{
                        'X-HTTP-Method-Override' : 'POST',
                        'Content-Type' : 'application/x-www-form-urlencoded'
                    }
                }).then(function successCallback(response) {
                    if (typeof response.data !== 'undefined') {

                        resolve({
                            success: true,
                            data : {},
                            message: "Operación realizada con éxito"
                        });
                    }
                    else {
                        reject({
                            success: false,
                            data: {},
                            message: "El usuario o contraseña que ingresaste es incorrecto, te pedimos volver a intentar."
                        });
                    }
                }, function errorCallback(error) {
                    reject({
                        success: false,
                        data: error,
                        message: "Falla en el servidor."
                    });
                });
            });
        };

        ls.makeDataUser  =function () {
            return $q(function ( resolve, reject ) {
                $http({
                    method: 'GET',
                    url : URLS.userInfo,
                    headers:{
                        'Authorization': 'bearer ' + sessionStorage.getItem('__token')
                    },
                    ignoreLoadingBar: true
                })
                    .then( successCallback )
                    .catch( errorCallback );
                function successCallback (response) {
                    resolve({
                        success : true,
                        user : response.data
                    });
                }
                function errorCallback (error) {
                    reject({
                        success : false,
                        error : error,
                        messagge : 'Ha ocurrido un error'
                    });
                }
            });
        };

        ls.makeRequestLogin = function(credentials) {
            return $q(function(resolve, reject) {
                $http({
                    method: 'POST',
                    url: URLS.login,
                    data: $.param(credentials),
                    headers:{
                        'X-CSRF-TOKEN': sessionStorage.getItem('__csrf'),
                        'X-HTTP-Method-Override' : 'POST',
                        'Content-Type' : 'application/x-www-form-urlencoded'
                    }
                }).then(function successCallback(response) {
                    if (typeof response.data !== 'undefined' && response.data.access_token !== '') {
                        sessionStorage.setItem('__token',response.data.access_token);                    
                        ls.makeDataUser()
                            .then( function  (response) {

                                angular.forEach(response.user.scope,function(scope){
                                   
                                    if(scope === "INCOMPLETE"){
                                        reject({
                                            success: false,
                                            data: {},
                                            error : "error",
                                            message: "El usuario no está registrado en LDAP. Favor de comunicarse al CAT"
                                        });
    
                                    }else{
                                        var _user = {
                                            "name": response.user.firstName + ' ' + response.user.lastName,
                                            "mail": response.user.clientId + '@actinver.com.mx',
                                            "employeeID": "-2147483648",                                            
                                            "userName": credentials.username,
                                            "roles": response.user.scope,
                                            "enviroment":response.user.systemTO.profile

                                        };
                                        resolve({
                                            success: true,
                                            data: _user,
                                            message: "Operación realizada con éxito"
                                        });
    
                                    }

                                });                   


                            })
                            .catch(function (error) {
                                reject({
                                    success: false,
                                    data: {},
                                    error : error,
                                    message: "Ha ocurrido un error al obtener los datos de usuario"
                                });
                            });
                    }
                    else {
                        reject({
                            success: false,
                            data: {},
                            message: "El usuario o contraseña que ingresaste es incorrecto, te pedimos volver a intentar."
                        });
                    }
                }, function errorCallback(error) {
                    
                    //errorMesagge(error.data.error_description);
                    reject({
                        success: false,
                        data: error,
                        message: error.data.error_description ,
                    });
                });
            });
        };

        /*function errorMesagge(_message){
            if(_message === 'Bad Credentials'){
                errorMessage = "El usuario o contraseña que ingresaste es incorrecto, te pedimos volver a intentar.";
            }else if (_message === 'User account is locked'){
                errorMessage = "Ha rebasado el número de intentos disponibles";
            }else if( _message === 'Ya existe una sesión activa para este cliente único') {
                errorMessage = "Ya existe una sesión activa para este usuario";
            }else{
                errorMessage = _message;
            }

        }*/

        /**
         *  Permission service employye number is required
         */
        ls.makeRequestPermissions = function(_employeeNumber) {
            return $q(function(resolve, reject) {
                $http({
                    method: 'GET',
                    url: URLS.getPermiso + '/' + parseInt(_employeeNumber) + '?language=SPA',
                    headers:{
                       'X-CSRF-TOKEN': sessionStorage.getItem('__csrf'),
                       'Authorization' : 'bearer ' + sessionStorage.getItem("__token")
                   },
                   ignoreLoadingBar: true
                }).then(function successCallback(response) {
                    if (typeof response.data !== 'undefined' && response.data.status === 1) {
                        resolve({
                            success: true,
                            data: JSON.parse(response.data.result.restrictionsString),
                            message: "Operación realizada con éxito"
                        });
                    }
                    else {
                        reject({
                            success: false,
                            data: {},
                            message: "No se pudo obetener información del usuario consultado, intente más tarde"
                        });
                    }
                }, function errorCallback(error) {
                    window.location.href = "/asesoria/login.html";
                    CommonModalsSrv.systemError();
                    reject({
                        success: false,
                        data: error,
                        message: "Falla en el servidor."
                    });
                });
            });
        };

        ls.validateUserTokens = function () {
            return $q(function (resolve, reject) {
                $http({
                        method: 'GET',
                        url: URLS.validateUserTokens + "?language=SPA",
                        headers: {
                            'Authorization': 'bearer ' + sessionStorage.getItem('__token')
                        }
                    })
                    .then(function success(response) {
                        if (typeof response !== 'undefined' && response.data.outCommonHeader.result.result === 1) {
                            resolve({
                                success: true,
                                msg: response.data.outCommonHeader.result.messages[0].responseMessage
                            });
                        } else {
                            reject({
                                success: false,
                                msg: response.data.outCommonHeader.result.messages[0].responseMessage
                            });
                        }
                    })
                    .catch(function error() {
                        reject({
                            success: false,
                            msg: 'Ha ocurrido un error'
                        });
                    });
            });
        };

        ls.saveAdviserNumber = function (adviserType, adviserNumber) {
            return $q(function (resolve, reject) {
                $http({
                    method: 'POST',
                    url: URLS.saveAdviserNumber,
                    data: $.param({
                        adviserNumber: adviserNumber,
                        adviserType: adviserType,
                        language: 'SPA'
                    }),
                    headers: {
                        'X-HTTP-Method-Override': 'POST',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(function successCallback(response) {
                    if (typeof response.data !== 'undefined' && response.data.outCommonHeader.result.result === 1) {
                        resolve({
                            success: true,
                            data: {},
                            message: response.data.outCommonHeader.result.messages[0].responseMessage
                        });
                    } else {
                        reject({
                            success: false,
                            data: {},
                            message: response.data.outCommonHeader.result.messages[0].responseMessage
                        });
                    }
                }, function errorCallback(error) {
                    reject({
                        success: false,
                        data: error,
                        message: "Ha ocurrido un error !!"
                    });
                });
            });
        };
    }

    angular.module('actinver.services')
        .service('loginSrvc', loginSrvc);
})();

(function() {
    "use strict";

    function userConfig() {
        var api = {};
        api.user = {};
        api.user_permissions = {};
        return api;
    }

    angular.module('actinver.services')
        .service('userConfig', userConfig);
})();


            /*
                Este archivo solo es declarativo, para agregar nuevas urls hacerlo en config.yml
            */
            ( function(){
                "use strict";
                function url(){
                    var urls = {"userInfo":"/asesoria-restful/api/asesoria/user","csrfRest":"/asesoria-restful/api/asesoria/validate","validateUserTokens":"/asesoria-restful/api/asr/orchestrate/validateUserTokens","saveAdviserNumber":"/asesoria-restful/api/asr/orchestrate/saveAdviserNumber","login":"/asesoria/login","logout":"/asesoria/logout","getPermiso":"/asesoria-restful/api/all/Asesores/UserRole/getRoleAllow","getBalance":"/asesoria-restful/api/asr/investmentSociety/v1_1/cashByDate/","getTransfers":"/asesoria-restful/api/asr/movements/v1_0/contractMovementsQuery/","getBankContractSPEIMovementsQuery":"/asesoria-restful/api/asr/movements/v1_0/bankContractSPEIMovementsQuery/","getOtherAccounts":"/asesoria-restful/api/asr/orchestrate/destinationAccountQuery/","getMedia":"/asesoria-restful/api/asr/catalogs/v1_0/contactMeansCatalog?language=SPA","webSocketUrl":"http://vsdlapafro01.actinver.com.mx/Asesores/ws/stock/","makeTransfer":"/asesoria-restful/api/asr/financialOps/v1_0/transferExecution?language=SPA","makeTransferOtherAccount":"/asesoria-restful/api/asr/financialOps/v1_0/brokerSPEITransfer?language=SPA","getIPC":"/asesoria-restful/api/asr/Asesores/GraphicsInfo/getIPC","dashboardWebSocket":"/asesoria-restful/api/asr/ws","getIssuers2":"/issuers2","dashboardNews":"/asesoria-restful/api/asr/orchestrate/getLastNews","dashboardMonthGoal":"","dashboardIncomes":"","dashboardSchedule":"/asesoria-restful/api/asr/Asesores/ActivityLog/getUncontactedCustomers/","dashboardSocial":"","getAppointments":"/asesoria-restful/api/asr/Asesores/Mail/getAppointments/","getCurrentMessages":"/asesoria-restful/api/asr/Asesores/Message/getCurrentMessages/","addNewActivity":"/asesoria-restful/api/asr/Asesores/ActivityDay/addActivityDay/","getGoalsPositions":"/asesoria-restful/api/asr/Asesores/Meta/metaPosiciones/","getSumGoalsPositions":"/asesoria-restful/api/asr/Asesores/Meta/sumMetaPosiciones/","getGoalsContracts":"/asesoria-restful/api/asr/Asesores/Meta/metaContratos/","getSupervisorInfo":"/asesoria-restful/api/asr/Asesores/Meta/reporteSupervisor/","getCenterInfo":"/asesoria-restful/api/asr/Asesores/Meta/metaPosicionesCFSuper/","getCenterProducts":"/asesoria-restful/api/asr/Asesores/Meta/metaContratosCFSuper/","getGroupsByEmployee":"/asesoria-restful/api/asr/Asesores/Meta/getGroupsByEmployee/","getInfoByGroup":"/asesoria-restful/api/asr/Asesores/Meta/reporteSupervisorPorGrupo/","getCustomCenterInfo":"/asesoria-restful/api/asr/Asesores/Meta/metaPosicionesCF/","getCustomCenterProducts":"/asesoria-restful/api/asr/Asesores/Meta/metaContratosCF/","getSharedReport":"/asesoria-restful/api/asr/Asesores/SharedReport/getSharedReport/","getGroupsByEmployeeRpt":"/asesoria-restful/api/rpt/Asesores/Meta/getGroupsByEmployee/","getInfoByGroupRpt":"/asesoria-restful/api/rpt/Asesores/Meta/reporteSupervisorPorGrupo/","getGoalsPositionsRpt":"/asesoria-restful/api/rpt/Asesores/Meta/metaPosiciones/","getSumGoalsPositionsRpt":"/asesoria-restful/api/rpt/Asesores/Meta/sumMetaPosiciones/","getGoalsContractsRpt":"/asesoria-restful/api/rpt/Asesores/Meta/metaContratos/","getCustomCenterInfoRpt":"/asesoria-restful/api/rpt/Asesores/Meta/metaPosicionesCF/","getCustomCenterProductsRpt":"/asesoria-restful/api/rpt/Asesores/Meta/metaContratosCF/","getBinnacleClients":"/asesoria-restful/api/asr/Asesores/Contract/getSponsorList/","getBirthDays":"/asesoria-restful/api/asr/Asesores/ActivityLog/getBirthDays/","getClientDetails":"/asesoria-restful/api/asr/Asesores/Contract/getDetailsOfContract/","getCommentsDetailsByContract":"/asesoria-restful/api/asr/Asesores/Contract/getDetailsOfContract/","sendMessangeBirthday":"/asesoria-restful/api/asr/Asesores/ActivityLog/sendCongratulations","getDetailGraph":"/asesoria-restful/api/asr/Asesores/ActivityLog/getReportMetas","getAdvisersDetails":"/asesoria-restful/api/asr/Asesores/ActivityLog/getReportMetasDetail/","getClientType":"/asesoria-restful/api/asr/Asesores/Contract/validateUser/","getClientProfile":"/asesoria-restful/api/asr/Asesores/Contract/getProfile/","getBinnacleAdvGoal":"/asesoria-restful/api/asr/Asesores/ActivityLog/getReport/","getBinnacleCatalog":"/asesoria-restful/api/asr/Asesores/ActivityLog/getActivityCatalogRoot/TPC/","getBinnacleCatalogChild":"/asesoria-restful/api/asr/Asesores/ActivityLog/getActivityCatalogChild/","doBinnacleComment":"/asesoria-restful/api/asr/Asesores/ActivityLog/saveComment/","getOutlineInfo":"/asesoria-restful/api/asr/Asesores/PracticasVenta/","getSellsPracticeUrl":"/asesoria-restful/api/asr/Asesores/PracticasVenta/getUrlVentas","getIssuersInfo":"/asesoria-restful/api/asr/Asesores/Fund/getFunds/","getProducts":"/asesoria-restful/api/asr/Asesores/Product/getClassifications/","getSubProducts":"/asesoria-restful/api/asr/Asesores/Product/getProductsByClassification/","getProfiles":"/asesoria-restful/api/asr/Asesores/Catalogs/getClientProfileCatalog/","getStrategies":"/asesoria-restful/api/asr/Asesores/Portfolio/getModelPortfolioByCriterionQuery/","getStrategyDetail":"/asesoria-restful/api/asr/Asesores/Portfolio/getModelPortfolioDetailQuery/","getInvIssuersCatalog":"/asesoria-restful/api/asr/Asesores/InvestmentSociety/getIssuersCatalog/","getBandsCatalog":"/asesoria-restful/api/asr/Asesores/BondMarket/getBandsCatalog/","getIssuersCatalog":"/asesoria-restful/api/asr/Asesores/BondMarket/getIssuersCatalog/","getAllIssuers":"/asesoria-restful/api/asr/Asesores/MarketInfo/getIssuersCatalog/","doProposal":"/asesoria-restful/api/asr/Asesores/ActivityLog/saveComment/","getContractInfo":"/asesoria-restful/api/asr/orchestrate/validateContractUserOrchestrate/","doTracing":"/Asesores/ActivityLog/saveComment/","getCustomerTrackingAndProposal":"/asesoria-restful/api/asr/Asesores/Report/getCustomerTrackingAndProposal","getCustomerTracking":"/asesoria-restful/api/asr/Asesores/Report/getCustomerTracking/","getAdviserContract":"/asesoria-restful/api/asr/Asesores/Contract/validateUser/","getContractIdClient":"/eActinver_Admin/jaxrs/AdministrativeManagerEnrollmentRest/getIdClient/","getContractSummary":"/asesoria-restful/api/asr/Asesores/Portfolio/getSummary/","getinsuranceAccumulatedRisksValidation":"/asesoria-restful/api/asr/insurance/v1_0/insuranceAccumulatedRisksValidation","getDetailedSummary":"/asesoria-restful/api/asr/Asesores/Portfolio/getDetailedSummary","getDetailedSummaryGral":"/asesoria-restful/api/asr/Asesores/Portfolio/getDetailedSummary","getBrokerHousePositionList":"/api/asr/Asesores/Contract/getBrokerHousePositionList/","getBankPositionList":"/asesoria-restful/api/asr/Asesores/Contract/getBankPositionList/","getBankWarrantyPositionList":"/asesoria-restful/api/asr/Asesores/Contract/getBankWarrantyPositionList/","getInsuranceInsuredSumQuery":"/asesoria-restful/api/asr/insurance/v1_0/insuranceInsuredSumQuery","getCurrentPortfolio":"/Asesores/Portfolio/getCurrentPortfolio/","getCustomerProposal":"/asesoria-restful/api/asr/Asesores/Report/getCustomerProposal","getFavoritesAsr":"/asesoria-restful/api/asr/Asesores/Issuer/getFavorites/","getClientInfo":"/asesoria-restful/api/asr/client/v1_0/clientOrContractClientInfoQuery/","getContractByAdviser":"/asesoria-restful/api/asr/orchestrate/contractByClientID/","getContracts":"/asesoria-restful/api/asr/balance/v1_0/contractsBalancesByPortfolioQuery","getContractHistorical":"/asesoria-restful/api/asr/balance/v1_0/brokerMonthlyBalanceQuery","getClientName":"/asesoria-restful/api/asr/clientInfo/v1_0/clientInfoQuery","getBrokerHistoricalBalanceQuery":"/asesoria-restful/api/asr/balance/v1_0/brokerHistoricalBalanceQuery","getPortfolioResume":"/asesoria-restful/api/asr/orchestrate/summaryPortfolio/","getCreditsList":"/asesoria-restful/api/asr/orchestrate/loans/","getInsurancesList":"/portfolio-insurances/","getContractDetail":"/asesoria-restful/api/asr/portfolio/v1_0/portfolioDetailQuery/","getContractDetailBank":"/asesoria-restful/api/asr/portfolio/v1_0/fIXISSecuritiesPortfolioQuery/","getInitDoll":"/asesoria-restful/api/asr/balance/v1_0/a2KContractBalance/","getInitDoll2":"/asesoria-restful/api/asr/investmentSociety/v1_0/fundQuery/","confirmDoll":"/asesoria-restful/api/asr/investmentSociety/v1_2/fundOrderQuotation?language=SPA","capture":"/asesoria-restful/api/asr/investmentSociety/v1_2/fundOrderRegistration?language=SPA","getDetailStations":"/asesoria-restful/api/asr/investmentSociety/v1_2/fundOperationDataQuery/","getDollAccounts":"/asesoria-restful/api/asr/orchestrate/destinationAccountQuery/","getOrderDetail":"/asesoria-restful/api/asr/movements/v1_0/contractMovementsQuery","getOrders":"/asesoria-restful/api/asr/orders/v1_2/ordersByDateQuery/","getPortfolio":"/asesoria-restful/api/asr/portfolio/v1_0/portfolioDetailQuery/","getInvestmentSocietyRest":"/asesoria-restful/api/asr/investmentSociety/v1_2/investmentIssuersQuery/","getMoreInfo":"/asesoria-restful/api/asr/orders/v1_0/fundsOrderDetailQuey/","getMoreInfoCapital":"/asesoria-restful/api/asr/orders/v1_0/capitalMarketOrderDetailQuery/","cancellation":"/asesoria-restful/api/asr/investmentSociety/v1_2/fundOrderCancelation","cancellationMarket":"/asesoria-restful/api/asr/capitalMarket/v1_1/stockMarketOrderCancelation","cancellationStopLoss":"/asesoria-restful/api/asr/capitalMarket/v1_1/stopLossTrailingStopCancelation/","getReporto":"/asesoria-restful/api/asr/bondMarket/v1_1/bondMarketBands/","getCurrentCash":"/asesoria-restful/api/asr/balance/v1_0/a2KContractBalance/","confirmMoneyDoll":"/asesoria-restful/api/asr/bondMarket/v1_1/bondMarketOrderQuotation?language=SPA","doMoneyTransaction":"/asesoria-restful/api/asr/bondMarket/v1_1/bondMarketOrderRegistration?language=SPA","getCapitalsStation":"/asesoria-restful/api/asr/marketinfo/v1_1/clientIssuersMarketInfoQuery/","getNewCapitalsStation":"/asesoria-restful/api/asr/marketinfo/v1_1/contractIssuersMarketInfoQuery/","CapitalsWebSocket":"/asesoria-restful/api/asr/ws","getLastIPC":"/asesoria-restful/api/asr/marketinfo/v1_0/stockMarketIndexQuery","getCommission":"/asesoria-restful/api/asr/contractInfo/v1_0/contractCommissionAndValuationQuery/","getCommission34":"/asesoria-restful/api/asr/catalogs/v1_0/capitalBandCatalog/","getCapitalStop":"/asesoria-restful/api/asr/capitalMarket/v1_0/securitiesForStopLossQuery/","getAcciones":"/asesoria-restful/api/asr/portfolio/v1_1/securitiesPortfolioQuery/","confirmStopLoss":"/asesoria-restful/api/asr/capitalMarket/v1_1/stopLossTrailingStopRegistration?language=SPA","getOrderValidity":"/asesoria-restful/api/asr/orders/v1_0/orderValidityQuery/","getOptionsTypeOperation":"/asesoria-restful/api/asr/catalogs/v1_1/getOptionsTypeOperation","getAccionesLumina":"/asesoria-restful/api/asr/capitalMarket/v1_0/capitalMarketPositionQuery","getOrdersLumina":"/asesoria-restful/api/asr/capitalMarket/v1_0/capitalMarketOrderQuery","cancellationLumina":"/asesoria-restful/api/asr/capitalMarket/v1_0/cMEquityOrderCancelation","confirmCapitalDollLumina":"/asesoria-restful/api/asr/capitalMarket/v1_0/cMEquityOrderRegistration","getOrdertypeCatalog":"/asesoria-restful/api/asr/orchestrate/orderTypeCatalog/","getClientElegible":"/asesoria-restful/api/asr/contractInfo/v1_0/bankContractQuery/","geturlpracticasventa":"/asesoria-restful/api/asr/orchestrate/generateUrlSelling/","LuminaWebSocket":"/asesoria-restful/api/asr/ws","updateStatusLumina":"/asesoria-restful/api/asr/adviser/v1_0/adviserNotificationStsModification","getNotificationLumina":"/asesoria-restful/api/asr/orchestrate/notificationQuery","getOrderCatalog":"/asesoria-restful/api/asr/orders/v1_0/ordersTypeQuery","confirmCapitalDoll":"/asesoria-restful/api/asr/capitalMarket/v1_0/cMOrderManagement?language=SPA","getBinnacleOperativeBank":"/asesoria-restful/api/asr/Asesores/OperativeLogBook/getBankLog","getBinnacleOperativeStockExchange":"/asesoria-restful/api/asr/Asesores/OperativeLogBook/getCBLog","getInvestmentIssuersQuery":"/asesoria-restful/api/asr/Asesores/InvestmentSociety/getInvestmentIssuersQuery/","clientIssuersMarketInfoQuery":"/asesoria-restful/api/asr/Asesores/MarketInfo/clientIssuersMarketInfoQuery/","SimulatorRest":"/ficha-valor-restful/SimulatorRest/","getCreditDetail":"/getCreditDetail/","getSimPayment":"/getSimPayment/","clientIssuersMarketInfoQueryV1":"/asesoria-restful/api/asr/marketinfo/v1_0/clientIssuersMarketInfoQuery/","getTableProspects":"/tableAdmin/","getProsGraphics":"/asesoria-restful/api/asr/Asesores/getProsGraphics/","getProsReports":"/getProsReports/","getCatalogSearch":"/asesoria-restful/api/asr/Asesores/Prospect/catalogSearch/","getListByEmployee":"/asesoria-restful/api/asr/Asesores/Prospect/getListByEmployee/","getStages":"/asesoria-restful/api/asr/Asesores/Prospect/getStagesCatalog","prospecsPT":"/asesoria-restful/api/asr/Asesores/Prospect/prospect/PT/","getDetailProspect":"/asesoria-restful/api/asr/Asesores/Prospect/getDetail/","getProspectTPC":"/asesoria-restful/api/asr/Asesores/Prospect/TPC/","getProspectProfile":"/asesoria-restful/api/asr/Asesores/Prospect/Prospect/profile/","saveProspect":"/asesoria-restful/api/asr/Asesores/Prospect/save/","updateProspect":"/asesoria-restful/api/asr/Asesores/Prospect/update/","saveActivity":"/asesoria-restful/api/asr/Asesores/Prospect/saveActivity/","deleteActivity":"/asesoria-restful/api/asr/Asesores/Prospect/deleteActivity/","closeActivity":"/asesoria-restful/api/asr/Asesores/Prospect/closeActivity/","updateActivity":"/asesoria-restful/api/asr/Asesores/Prospect/updateActivity/","getActivityRecord":"/asesoria-restful/api/asr/Asesores/ActivityRecord","getActivityRecordAdm":"/asesoria-restful/api/adm/Asesores/ActivityRecord","getActivityOffices":"/asesoria-restful/api/asr/Asesores/Meta/getFinancialCenters/?language=SPA","getTracingClient":"/asesoria-restful/api/asr/Asesores","getDetailedCustomerTrackingReport":"/asesoria-restful/api/asr/Asesores/Report/getDetailedCustomerTrackingReport","getCustomerTrackingReport":"/asesoria-restful/api/asr/Asesores/Report/getCustomerTrackingReport","getPresentations":"/asesoria-restful/api/asr/Asesores/Presentation/getPresentationsByType/","getIssuersProposal":"/asesoria-restful/api/adm/Asesores/Fund/getFunds/","getClassifications":"/asesoria-restful/api/adm/Asesores/Product/getClassifications/","getProductsByClassification":"/asesoria-restful/api/adm/Asesores/Product/getProductsByClassification/","deleteProduct":"/asesoria-restful/api/adm/Asesores/Product/delete/","saveProduct":"/asesoria-restful/api/adm/Asesores/Product/save/","updateProduct":"/asesoria-restful/api/adm/Asesores/Product/updateName/","doFactsheet":"/asesoria-restful/api/adm/Asesores/Product/save/","updateFactsheetImg":"/asesoria-restful/api/asr/Asesores/Product/updateProduct/","getProductFactsheetImg":"/asesoria-restful/api/adm/Asesores/Product/getImage/","updateFactsheetProduct":"/asesoria-restful/api/adm/Asesores/Product/updateName/","deleteFactsheetProduct":"/asesoria-restful/api/adm/Asesores/Product/delete/","getGroups":"/asesoria-restful/api/adm/Asesores/Meta/getGroups/","saveGroup":"/asesoria-restful/api/adm/Asesores/Meta/saveGroup/","updateNameGroup":"/asesoria-restful/api/adm/Asesores/Meta/updateNameGroup/","deleteGroup":"/asesoria-restful/api/adm/Asesores/Meta/deleteGroup/","ServiceGroups":"/asesoria-restful/api/adm/Asesores/Meta/","getTypesAsr":"/asesoria-restful/api/asr/Asesores/Presentation/getTypes/","getTypes":"/asesoria-restful/api/adm/Asesores/Presentation/getTypes/","getPresentationsByType":"/asesoria-restful/api/adm/Asesores/Presentation/getPresentationsByType/","getPresentationSubTypes":"/asesoria-restful/api/asr/Asesores/PresentationSubType/getPresentationSubTypes/","getPresentationSubTypesByClassification":"/asesoria-restful/api/adm/Asesores/PresentationSubType/getPresentationSubTypesByClassification/","savePresentation":"/asesoria-restful/api/adm/Asesores/Presentation/save/","updatePresentationImg":"/asesoria-restful/api/asr/Asesores/Presentation/update/","getPresentationFile":"/asesoria-restful/api/asr/Asesores/Presentation/getFile/","getPresentationFileAdm":"/asesoria-restful/api/adm/Asesores/Presentation/getFile/","deletePresentation":"/asesoria-restful/api/adm/Asesores/Presentation/delete/","updateNamePresentation":"/asesoria-restful/api/adm/Asesores/Presentation/updateName/","saveClasification":"/asesoria-restful/api/adm/Asesores/PresentationType/saveClassification/","saveSubClasification":"/asesoria-restful/api/asr/Asesores/PresentationSubType/save/","getGlobalForecasts":"/asesoria-restful/api/adm/Asesores/Parameters/getGlobalForecasts/","updateGlobalForecasts":"/asesoria-restful/api/adm/Asesores/Parameters/updateGlobalForecasts/","getLocalForecasts":"/asesoria-restful/api/adm/Asesores/Parameters/getLocalForecasts/","updateLocalForecasts":"/asesoria-restful/api/adm/Asesores/Parameters/updateLocalForecasts/","getEconomicEnvironment":"/asesoria-restful/api/adm/Asesores/Parameters/getEconomicEnvironment/","updateEconomicEnvironment":"/asesoria-restful/api/adm/Asesores/Parameters/updateEconomicEnvironment/","getAnnoucement":"/asesoria-restful/api/adm/Asesores/Parameters/getAnnoucement/","updateAnnouncement":"/asesoria-restful/api/adm/Asesores/Parameters/updateAnnouncement/","getDerivatives":"/asesoria-restful/api/adm/Asesores/Parameters/getDerivatives/","updateDerivatives":"/asesoria-restful/api/adm/Asesores/Parameters/updateDerivatives/","getDerivativesAsr":"/asesoria-restful/api/asr/Asesores/Parameters/getDerivatives/","getFundTypes":"/asesoria-restful/api/adm/Asesores/Fund/getFundTypes/","saveFund":"/asesoria-restful/api/adm/Asesores/Fund/saveFund/","deleteFund":"/asesoria-restful/api/adm/Asesores/Fund/deleteFund/","updateFund":"/asesoria-restful/api/adm/Asesores/Fund/updateFund/","saveFavorite":"/asesoria-restful/api/adm/Asesores/Issuer/saveFavorite/","deleteFavorite":"/asesoria-restful/api/adm/Asesores/Issuer/deleteFavorite/","updateFavorite":"/asesoria-restful/api/adm/Asesores/Issuer/updateFavorite/","getFavorites":"/asesoria-restful/api/adm/Asesores/Issuer/getFavorites/","getClassificationFav":"/asesoria-restful/api/asr/Asesores/ClassificationFav/getClassificationFav/","getClassificationFavAdm":"/asesoria-restful/api/adm/Asesores/ClassificationFav/getClassificationFav/","saveClassificationFav":"/asesoria-restful/api/adm/Asesores/ClassificationFav/saveClassificationFav/","deleteClassificationFav":"/asesoria-restful/api/adm/Asesores/ClassificationFav/deleteClassificationFav/","getEmployeeMap":"/asesoria-restful/api/adm/Asesores/employeeMap/getEmployeeMap/","deleteEmployeMap":"/asesoria-restful/api/adm/Asesores/employeeMap/deleteEmployeMap/","saveEmployeeMap":"/asesoria-restful/api/adm/Asesores/employeeMap/saveEmployeeMap/","getRoles":"/asesoria-restful/api/adm/Asesores/UserRole/getRoles/","getUserRoles":"/asesoria-restful/api/adm/Asesores/UserRole/getUserRoles/","saveUserRole":"/asesoria-restful/api/adm/Asesores/UserRole/saveUserRole/","deleteUserRole":"/asesoria-restful/api/adm/Asesores/UserRole/deleteUserRole/","getMessages":"/asesoria-restful/api/adm/Asesores/Message/getAllMessages/","messageRegistration":"/asesoria-restful/api/adm/Asesores/Message/messageRegistration/","getMessageDetail":"/asesoria-restful/api/asr/Asesores/Message/getMessageDetail/","getAllMessagesByRange":"/asesoria-restful/api/adm/Asesores/Message/getAllMessagesByRangeDate/","getAdvisersBinnacleMessage":"/asesoria-restful/api/adm/Asesores/Message/getMessage/","getAdvisersBinnacleBinnacle":"/asesoria-restful/api/adm/Asesores/ActivityLog/getReportCommentsXls/","getMediaBank":"/asesoria-restful/api/asr/orchestrate/contactMeansCatalog","getOrdersBank":"/asesoria-restful/api/asr/funds/v1_0/bankFundsAndMoneyMarketMvmntsQuery","getOrdersMoneyMarketBank":"/asesoria-restful/api/asr/movements/v1_0/bankContractInvstMovementsQuery","deleteReportoBuy":"/asesoria-restful/api/asr/moneyMarket/v1_0/moneyMarketReportoBuyCancellation","deleteDirectBuy":"/asesoria-restful/api/asr/moneyMarket/v1_0/moneyMarketDirectBuyCancellation/","deleteDirectSell":"/asesoria-restful/api/asr/moneyMarket/v1_0/moneyMarketDirectSellCancellation","getReportoBands":"/asesoria-restful/api/asr/moneyMarket/v1_0/moneyMarketBandsReportoQuery","getDirectBands":"/asesoria-restful/api/asr/moneyMarket/v1_0/moneyMarketBandsDirectQuery/","getAuctionBands":"/asesoria-restful/api/asr/moneyMarket/v1_0/mMAuctionsQuery","getMoneyMarketCalculation":"/asesoria-restful/api/asr/moneyMarket/v1_0/mMBondPriceCalculationQuery/","getMoneyMarketRate":"/asesoria-restful/api/asr/moneyMarket/v1_0/moneyMarketCalculationByRateQuery/","getMoneyMarketPrice":"/asesoria-restful/api/asr/moneyMarket/v1_0/moneyMarketCalculationByDPriceQuery","getPortfolioBank":"/asesoria-restful/api/asr/portfolio/v1_0/bankInvstFundsAndMMPositionsQuery/","getPortfolioReporto":"/asesoria-restful/api/asr/moneyMarket/v1_0/moneyMarketIntradayPositionQuery/","getAuctionsPrice":"/asesoria-restful/api/asr/moneyMarket/v1_0/moneyMarketAuctionsPriceQuery/","getMaturityDateQuery":"/asesoria-restful/api/asr/moneyMarket/v1_0/moneyMarketMaturityDateQuery/","getReportoConfirmLtr":"/asesoria-restful/api/asr/orchestrate/getReportoConfirmLetterQuery/","sendEmailReportoLtr":"/asesoria-restful/api/asr/orchestrate/sendEmailReportoConfirmLetter","getFundBank":"/asesoria-restful/api/asr/funds/v1_0/bankInvstFundsByContractQuery/","getCalendarBank":"/asesoria-restful/api/asr/funds/v1_0/bankInvstCalendarByFundsQuery/","bankFundBuyRequest":"/asesoria-restful/api/asr/investment/v1_0/bankFundBuyRequest","captureDirectBank":"/asesoria-restful/api/asr/moneyMarket/v1_0/mMDirectBondOrdersRegistration/","captureReportoBank":"/asesoria-restful/api/asr/moneyMarket/v1_0/mMReportoBondOrdersRegistration/","bankContractBalance":"/asesoria-restful/api/asr/balance/v1_0/bankContractBalance/","bankReportoBuyingPowerQuery":"/asesoria-restful/api/asr/portfolio/v1_0/bankReportoBuyingPowerQuery/","bankPortfolioQuery":"/asesoria-restful/api/asr/portfolio/v1_1/bankPortfolioQuery/","getPortfolioGlobalDetailQuery":"/asesoria-restful/api/asr/portfolio/v1_0/portfolioGlobalDetailQuery/","bankInvstUserInfoQuery":"/asesoria-restful/api/asr/funds/v1_0/bankInvstUserInfoQuery/","bankFundSellRequest":"/asesoria-restful/api/asr/investment/v1_0/bankFundSellRequest","bankFundBuyCancelationRequest":"/asesoria-restful/api/asr/investment/v1_0/bankFundBuyCancelation","bankFundSellCancelationRequest":"/asesoria-restful/api/asr/investment/v1_0/bankInvstFundOperationCancelation","getMoneyMarketIssuersSeriesQuery":"/asesoria-restful/api/asr/moneyMarket/v1_0/moneyMarketIssuersSeriesQuery","getMoneyMarketAdviserContractsQuery":"/asesoria-restful/api/asr/moneyMarket/v1_0/moneyMarketAdviserContractsQuery","getMoneyMarketContactMeansCatalogs":"/asesoria-restful/api/asr/moneyMarket/v1_0/moneyMarketContactMeansCatalogs/","getMoneyMarketOrderQuotation":"/asesoria-restful/api/asr/moneyMarket/v1_0/moneyMarketOrderQuotation","getMoneyMarketOrderRegistration":"/asesoria-restful/api/asr/moneyMarket/v1_0/moneyMarketOrderRegistration","getQuestions":"/getQuestions","getVideos":"/getVideos","getPendingOperations":"/asesoria-restful/api/asr/contractManagemen/v1_0/eBPendingOpQuery/","PendingOperationsApprove":"/asesoria-restful/api/asr/contractManagemen/v1_0/eBPendingOpExecution/","PendingOperationsReject":"/asesoria-restful/api/asr/contractManagemen/v1_0/eBPendingOpModification/","PendingOperationsApproveNotification":"/asesoria-restful/api/asr/contractManagemen/v1_0/adviserPendingOpsExecution/","PendingOperationsRejectNotification":"/asesoria-restful/api/asr/contractManagemen/v1_0/adviserPendingOpsModification/","getPendingOperationsCat":"/asesoria-restful/api/cat/contractManagemen/v1_0/eBPendingOpQuery/","PendingOperationsApproveCat":"/asesoria-restful/api/cat/contractManagemen/v1_0/eBPendingOpExecution/","PendingOperationsRejectCat":"/asesoria-restful/api/cat/contractManagemen/v1_0/eBPendingOpModification/","PendingOperationsApproveCatNotification":"/asesoria-restful/api/cat/contractManagemen/v1_0/adviserPendingOpsExecution/","PendingOperationsRejectCatNotification":"/asesoria-restful/api/cat/contractManagemen/v1_0/adviserPendingOpsModification/","PendingOperationsHistoric":"/asesoria-restful/api/asr/contractManagemen/v1_0/eBHistoricalPendingOpQuery/","PendingOperationsHistoricCat":"/asesoria-restful/api/cat/contractManagemen/v1_0/eBHistoricalPendingOpQuery/","getPendingOperationsSent":"/asesoria-restful/api/asr/contractManagemen/v1_0/eBSentPendingOpQuery","getBankContractsByClientQuery":"/asesoria-restful/api/asr/contractInfo/v1_0/bankContractsByClientQuery/","rejectAdviser":"/api/operations/rejectAuth","approveAdviser":"/api/operations/requestAuth","orderTypeA2K":"/asesoria-restful/api/asr/orchestrate/orderTypeA2K/","getTemporal":"/asesoria/img/temp.json","getShortAndLargeReport":"/asesoria-restful/api/asr/moneyMarket/v1_0/moneyMarketCashByAdviserQuery","getEmpleadoReport":"/asesoria-restful/api/asr/moneyMarket/v1_0/moneyMarketCashByAdviserQuery","getContractInfoDetail":"/asesoria-restful/api/asr/contractInfo/v1_0/simplifiedBankContractQuery/","getContractSelection":"/asesoria-restful/api/asr/orchestrate/contractSelection/","getMarketValidation":"/asesoria-restful/api/asr/clientConfigurations/v1_0/contractMarketValidation/","getDCInvestmentProspectQueryById":"/asesoria-restful/api/dinnAsesoria/digitalChannelsManagment/v1_0/dCInvestmentProspectQueryById/","getDCInvestmentProspectQuery":"/asesoria-restful/api/dinnAsesoria/digitalChannelsManagment/v1_0/dCInvestmentProspectQuery/","getDCScheduleQueryByDate":"/asesoria-restful/api/dinnAsesoria/digitalChannelsManagment/v1_0/dCScheduleQueryByDate/","getDCScheduleQueryByDateDetails":"/asesoria-restful/api/dinnAsesoria/digitalChannelsManagment/v1_0/dCScheduleQueryByDateDetails/","getDCDocumentQuery":"/asesoria-restful/api/dinnAsesoria/digitalChannelsManagment/v1_0/dCDocumentQuery/","getDCDocumentQueryByClient":"/asesoria-restful/api/dinnAsesoria/digitalChannelsManagment/v1_0/dCDocumentQueryByClient/","getDCScheduleQuery":"/asesoria-restful/api/dinnAsesoria/digitalChannelsManagment/v1_0/dCScheduleQuery/","getStrategy":"/asesoria-restful/api/asr/Asesores/Opportunity/getStrategy/","getSegment":"/asesoria-restful/api/asr/Asesores/Opportunity/getSegment/","saveOpportunity":"/asesoria-restful/api/asr/Asesores/Opportunity/saveOpportunity/","getListOpportunity":"/asesoria-restful/api/asr/Asesores/Opportunity/getOpportunity/","getOpportunityById":"/asesoria-restful/api/asr/Asesores/Opportunity/getOpportunityById/","updateContacted":"/asesoria-restful/api/asr/Asesores/Opportunity/updateContacted/","nextStage":"/asesoria-restful/api/asr/Asesores/Opportunity/nextStage/","updateOpportunity":"/asesoria-restful/api/asr/Asesores/Opportunity/updateOpportunity/","getOpportunityReport":"/asesoria-restful/api/asr/Asesores/Opportunity/getOpportunityReport/","getReportOpportunityDetail":"/asesoria-restful/api/asr/Asesores/Opportunity/getReportOpportunityDetail/","getReportOpportunityDetailFC":"/asesoria-restful/api/asr/Asesores/Opportunity/getReportOpportunityDetailFC/","outOfProfileContractQuery":"/asesoria-restful/api/asr/contractInfo/v1_0/outOfProfileContractQuery/","getCatalogEntityFederal":"/asesoria-restful/api/asr/insurance/v1_0/federalEntityQuery/","getCatalogMarksCars":"/asesoria-restful/api/asr/insurance/v1_1/carBrandQuery/","getCatalogModelsCars":"/asesoria-restful/api/asr/insurance/v1_1/carModelQuery/","getCatalogMunicipalityCars":"/asesoria-restful/api/asr/insurance/v1_0/municipalityQuery/","getCatalogBanksCars":"/asesoria-restful/api/asr/insurance/v1_0/insuranceBanksQuery/","getCatalogBanks":"/asesoria-restful/api/asr/insurance/v1_0/insuranceBanksQuery/","getServiceEmision":"/asesoria-restful/api/asr/insurance/v1_1/carInsurancePolicyRegistration/","getServiceCotizacion":"/asesoria-restful/api/asr/insurance/v1_1/carInsuranceQuotation/","getBankType":"/asesoria-restful/api/asr/insurance/v1_1/bankType/","sendCustomizedEmailNotificationSending":"/asesoria-restful/api/asr/notificationsAndAlertsWS/1_2/customizedEmailNotificationSendingLifeInsurance/","sendEmailNotificationCotization":"/asesoria-restful/api/asr/notificationsAndAlertsWS/1_2/customizedEmailNotificationSendingInsuranceCotizar/","sendEmailNotificationCompraSeguro":"/asesoria-restful/api/asr/notificationsAndAlertsWS/1_2/customizedEmailNotificationSendingInsuranceCompraSeguro/","getStatementFiscal":"/asesoria-restful/api/asr/statement/v1_0/accountStatementAvailabilityQuery/","getStatementFiscalPormenorizadas":"/asesoria-restful/api/asr/statement/v1_0/fiscalCertificateAvailableQuery/","sendEmailNotificationStatementFiscalQuery":"/asesoria-restful/api/asr/orchestrate/sendEmailNotificationStatementFiscalQuery/","getAccountState":"/asesoria-restful/api/asr/orchestrate/getAccountState/","getAccountStateRh":"/asesoria-restful/api/rh/orchestrate/getAccountState/","getCatalogPostalCodeQuery":"/asesoria-restful/api/asr/insurance/v1_0/postalCodeQuery/","getCatalogInsuranceRiskTypeQuery":"/asesoria-restful/api/asr/insurance/v1_0/insuranceRiskTypeQuery/","getCatalogWallTypeQuery":"/asesoria-restful/api/asr/insurance/v1_0/wallTypeQuery/","getCatalogRoofTypeQuery":"/asesoria-restful/api/asr/insurance/v1_0/roofTypeQuery/","getCatalogStreetTypeQuery":"/asesoria-restful/api/asr/insurance/v1_0/streetTypeQuery/","getCatalogCardTypeQuery":"/asesoria-restful/api/asr/insurance/v1_0/insuranceCardTypeQuery/","getCatalogPaymentTypeQuery":"/asesoria-restful/api/asr/insurance/v1_0/PaymentTypeQuery/","getCatalogInsuranceCardTypeQuery":"/asesoria-restful/api/asr/insurance/v1_0/streetTypeQuery/","getServiceCotizacionHome":"/asesoria-restful/api/asr/insurance/v1_0/homeInsuranceQuotation/","getServiceEmisionHomegetServiceEmisionHome":"/asesoria-restful/api/asr/insurance/v1_0/homeInsurancePolicyRegistration/","getServiceEmisionPyme":"/asesoria-restful/api/asr/insurance/v1_0/homeInsurancePolicyRegistration/","getCatalogEntityFederalPyme":"/asesoria-restful/api/asr/insurance/v1_0/federalEntityQuery/","getCatalogMunicipalityPyme":"/asesoria-restful/api/asr/insurance/v1_0/municipalityQuery/","getCatalogBanksPyme":"/asesoria-restful/api/asr/insurance/v1_0/insuranceBanksQuery/","getServiceCotizacionPyme":"/asesoria-restful/api/asr/insurance/v1_0/homeInsuranceQuotation/","getCatalogClasificationQuery":"/asesoria-restful/api/asr/insurance/v1_0/streetTypeQuery/","getCoverage":"/asesoria-restful/api/asr/insuranceCoverageService/v1_0/insuranceCoverageQuery/","getCotizationAdd":"/asesoria-restful/api/asr/insuranceQuotationService/v1_0/insuranceQuotationAdd/","getCotizationSearch":"/asesoria-restful/api/asr/insuranceQuotationService/v1_0/insuranceQuotationQuery/","getCotizationUpdate":"/asesoria-restful/api/asr/insuranceQuotationService/v1_0/insuranceQuotationUpdateJson/","getCotizationProcedure":"/asesoria-restful/api/asr/insuranceQuotationService/v1_0/insuranceQuotationProcedureJson/","getCotizationCancel":"/asesoria-restful/api/asr/insuranceQuotationService/v1_0/insuranceQuotationCancelJson/","getAgentQuery":"/asesoria-restful/api/asr/insuranceJpaService/v1_0/insuranceAgentQuery/","getAgent":"/asesoria-restful/api/asr/insuranceJpaService/v1_0/insuranceAgent/","getAgentAddQuery":"/asesoria-restful/api/asr/insuranceJpaService/v1_0/insuranceAgentAdd/","getAgentUpdateQuery":"/asesoria-restful/api/asr/insuranceJpaService/v1_0/insuranceAgentUpdate/","getAgentDeleteQuery":"/asesoria-restful/api/asr/insuranceJpaService/v1_0/insuranceAgentDelete/","sendEmailNotificationCotizationHome":"/asesoria-restful/api/asr/notificationsAndAlertsWS/1_2/customizedEmailNotificationSendingInsuranceCotizarHogar","sendEmailNotificationEmisionHome":"/asesoria-restful/api/asr/notificationsAndAlertsWS/1_2/customizedEmailNotificationSendingInsuranceCompraSeguroHogar","sendEmailNotificationCotizationPyme":"/asesoria-restful/api/asr/notificationsAndAlertsWS/1_2/customizedEmailNotificationSendingInsuranceCotizarHogar","sendEmailNotificationEmisionPyme":"/asesoria-restful/api/asr/notificationsAndAlertsWS/1_2/customizedEmailNotificationSendingInsuranceCompraSeguroHogar","getMedicalExpenseInsuranceQuotation":"/asesoria-restful/api/asr/insurance/v1_0/medicalExpenseInsuranceQuotation","getMedExpInsuranceDetailQuotationQuery":"/asesoria-restful//api/asr/insurance/v1_0/medExpInsuranceDetailQuotationQuery","getMedicalExpenseJobQuery":"/asesoria-restful/api/asr/insurance/v1_0/medicalExpenseJobQuery","getMedicalExpensePolicyHolderNumQuery":"/asesoria-restful/api/asr/insurance/v1_0/medicalExpensePolicyHolderNumQuery","getMedicalExpenseStateQuery":"/asesoria-restful/api/asr/insurance/v1_0/medicalExpenseStateQuery","getMedicalExpenseLocationQuery":"/asesoria-restful/api/asr/insurance/v1_0/medicalExpenseLocationQuery","getMedicalExpenseRelationshipQuery":"/asesoria-restful/api/asr/insurance/v1_0/medicalExpenseRelationshipQuery","sendEmailNotificationCotizationPMM":"/asesoria-restful/api/asr/notificationsAndAlertsWS/1_2/customizedEmailNotificationSendingInsuranceCotizarPMM","sendEmailNotificationEmisionPMM":"/asesoria-restful/api/asr/notificationsAndAlertsWS/1_2/customizedEmailNotificationSendingInsuranceEmisionPMM","getMedicalExpenseSportsQuery":"/asesoria-restful/api/asr/insurance/v1_0/medicalExpenseSportsQuery","getMedicalExpenseProfessionsQuery":"/asesoria-restful/api/asr/insurance/v1_0/medicalExpenseProfessionsQuery","getMedicalInsuranceFiscalIDNumberQuery":"/asesoria-restful/api/asr/insurance/v1_0/insuranceFiscalIDNumberQuery","getMedicalExpenseDeductibleQuery":"/asesoria-restful/api/asr/insurance/v1_0/medicalExpenseDeductibleQuery","getMedicalExpenseCoinsuranceQuery":"/asesoria-restful/api/asr/insurance/v1_0/medicalExpenseCoinsuranceQuery","getMedicalExpenseDeductibleRedQuery":"/asesoria-restful/api/asr/insurance/v1_0/medicalExpenseDeductibleRedQuery","getMedicalExpenseMaxCoinsuranceQuery":"/asesoria-restful/api/asr/insurance/v1_0/medicalExpenseMaxCoinsuranceQuery","getMedicalExpenseInsuranceRequotationQuery":"/asesoria-restful/api/asr/insurance/v1_0/medicalExpenseInsuranceRequotation","setMedicalExpenseDocsRegistration":"/asesoria-restful/api/asr/insurance/v1_0/medicalExpenseDocsRegistration","getMedExpInsurancePolicyRegistration":"/asesoria-restful/api/asr/insurance/v1_0/medExpInsurancePolicyRegistration","getInsuranceCountryQuery":"/asesoria-restful/api/asr/insurance/v1_0/insuranceCountryQuery","getInsuranceBusinessActivityQuery":"/asesoria-restful/api/asr/insurance/v1_0/insuranceBusinessActivityQuery","getInsuranceIdentificationTypeQuery":"/asesoria-restful/api/asr/insurance/v1_0/insuranceIdentificationTypeQuery","getMedExpInsuranceQuestRegistration":"/asesoria-restful/api/asr/insurance/v1_0/medExpInsuranceQuestRegistration","getMedExpInsuranceQuestionnaireQuery":"/asesoria-restful/api/asr/insurance/v1_0/medExpInsuranceQuestionnaireQuery","getMedicalExpenseQuestValidation":"/asesoria-restful/api/asr/insurance/v1_0/medicalExpenseQuestValidation","getInsuranceMaritalStatusQuery":"/asesoria-restful/api/asr/insurance/v1_0/insuranceMaritalStatusQuery","getInsuranceSumQuery":"/asesoria-restful/api/asr/insurance/v1_0/insuranceInsuredSumQuery","getCatalogCardTypeQueryLife":"{https://negociosuat.mapfre.com.mx/Zonaliados.Negocio/Api/_AYESalud/Identificacion?ramo=100","getLifeinsuranceNationalityQuery":"https://negociosuat.mapfre.com.mx/Zonaliados.Negocio/Api/_AYESalud/Pais?ramo=100","getLifeInsuranceQuotation":"/asesoria-restful/api/asr/insurance/v1_0/lifeInsuranceQuotation","getLifeInsuranceQuestionnaireQuery":"/asesoria-restful/api/asr/insurance/v1_0/lifeInsuranceQuestionnaireQuery","getinsuranceLifeHighRiskJobValidation":"/asesoria-restful/api/asr/insurance/v1_0/insuranceLifeHighRiskJobValidation","getLifeInsurancePolicyRegistration":"/asesoria-restful/api/asr/insurance/v1_0/lifeInsurancePolicyRegistration","getPoliza":"https://10.184.62.77/impresionSeGA/TWImpPolizaMarco.aspx","getSolicitud":"https://10.184.62.77/impresionSeGA/TWImpSolicitudMarco.aspx","getCondiciones":"https://zonaliados.mapfre.com.mx/zonaaliadosextra/vida/pdf/Plan%20de%20Vida%20Individual.pdf","getInsuranceBeneficiaryTypeQuery":"/asesoria-restful/api/asr/insurance/v1_0/insuranceBeneficiaryTypeQuery","getPolizasVida":"/asesoria-restful/api/asr/polizaVidaServiceController/v1_0/polizaVidaQueryOp","PolizaVidaUp":"/asesoria-restful/api/asr/polizaVidaServiceController/v1_0/polizaVidaUpOp","PolizaVidaAdd":"/asesoria-restful/api/asr/polizaVidaServiceController/v1_0/polizaVidaAddOp","PolizaVidaFindId":"/asesoria-restful/api/asr/polizaVidaServiceController/v1_0/polizaVidaFindIdOp","setMedicalExpenseProcessingRequest":"/asesoria-restful/api/asr/insurance/v1_0/medicalExpenseProcessingRequest","getMedicalExpenseSignRegistration":"/asesoria-restful/api/asr/insurance/v1_0/medicalExpenseSignRegistration","getMedicalExpensePackageRegistration":"/asesoria-restful/api/asr/insurance/v1_0/medicalExpensePackageRegistration","getMedicalExpensePackageUpdate":"/asesoria-restful/api/asr/insurance/v1_0/medicalExpensePackageUpdate","getLifeInsuranceExpenseJobQuery":"/asesoria-restful/api/asr/insurance/v1_0/lifeInsuranceJobQuery","getLifeInsuranceRelationshipQuery":"/asesoria-restful/api/asr/insurance/v1_0/lifeInsuranceRelationshipQuery"};
                    return urls;
                }

                angular.module('actinver.constants')
                .constant('URLS', new url() );
            })();
        
( function(){
    "use strict";

    modals.$inject = ['$uibModal'];
    function modals( $uibModal ) {

        var api  = {};

        api.warning = function( message ){
            var modal = $uibModal.open({
                templateUrl: '/scripts/modals/views/commons/warning.html',
                size: 'sm',
                windowClass : 'commons warning',
                controller: 'warningModalCtrl',
                controllerAs: 'warning',
                resolve:{
                    message: function(){
                        return message;
                    }
                }
            });

            return modal;
        };
        
       api.confirm = function( message ){
            var modal = $uibModal.open({
                templateUrl: '/scripts/modals/views/commons/confirm.html',
                size: 'sm',
                windowClass : 'commons confirm',
                controller: 'warningModalCtrl',
                controllerAs: 'warning',
                resolve:{
                    message: function(){
                        return message;
                    }
                }
            });

            return modal;
        };
        

        api.done = function( message ){
            var modal = $uibModal.open({
                templateUrl: '/scripts/modals/views/commons/done.html',
                size: 'sm',
                windowClass : 'commons done',
                controller: 'doneModalCtrl',
                backdrop: 'static',
                keyboard : false,
                controllerAs: 'done',
                resolve:{
                    message: function(){
                        return message;
                    }
                }
            });

            return modal;
        };

        api.info = function( message ){
            var modal = $uibModal.open({
                templateUrl: '/scripts/modals/views/commons/info.html',
                size: 'sm',
                windowClass : 'commons info',
                controller: 'doneModalCtrl',
                backdrop: 'static',
                keyboard : false,
                controllerAs: 'done',
                resolve:{
                    message: function(){
                        return message;
                    }
                }
            });

            return modal;
        };

        api.error = function( message){
            var modal = $uibModal.open({
              templateUrl: '/scripts/modals/views/commons/error.html',
              size: 'sm',
              windowClass : 'commons error',
              controller: 'errorModalCtrl',
              controllerAs: 'error',
              resolve: {
                  message: function(){
                      return message;
                  }
              }
            }).result.catch(function(res){
                if (!(res === 'cancel' || res === 'escape key press' || res === 'backdrop click' || typeof res === 'undefined')) {
                    throw res;
                }
            });

            return modal;
        };

        api.systemError =  function( message ){
            return $uibModal.open({
              templateUrl: '/scripts/modals/views/commons/system-error.html',
              size: 'sm',
              windowClass : 'commons errorSystem',
              controller: 'errorSystemModalCtrl',
              controllerAs: 'error',
              resolve: {
                  message: function(){
                      return message;
                  }
              }
            }).result.catch(function(res) {
                if (!(res === 'cancel' || res === 'escape key press')) {
                    throw res;
                }
            });
        };


        api.user = {};

        return api;
    }


    angular.module( 'actinver.services' )
        .service( 'CommonModalsSrv', modals );


})();
