(function () {
    "use strict";

    function binnacleStrategyCtrl($scope, $state, $timeout, $q, CalendarSrv, binnacleModalSrv, binnacleStrategySrv, binnacleBirthdaysSrv, CommonModalsSrv, binnacleStrategyCommercialFtr, NgTableParams) {
        var vm = this;
        //Objeto que contiene la lista de today, lastweek, nextweek de los cumpleaños
        vm.listDateBirthday = {};
        //lista que contiene los fechas y si es que hay cumpleaños del tipo de radio seleccionado
        vm.listDatesSelected = [];
        //filtro de cumpleaños
        vm.birthday_filter = "today";
        //bandera que indica que tiene registros con cumpleaños
        vm.hasBirthday = false;      
        //Contiene los filtros del ng-table
        vm.filterTable = {}; 
        
        var ctrlTimer;

        vm.menu = {
            showSlide: false,
            position: 0,
            showButtonLeft: false,
            showButtonRight: false
        };

        vm.clients = [];
        vm.listClasification = [
        {
            title: "A",
            id: "A"
        },{
            title: "AA",
            id: "AA"
        },{
            title: "AAA",
            id: "AAA"
        },{
            title: "B",
            id: "B"
        },{
            title: "C",
            id: "C"
        },{
            title: "R",
            id: "R"
        }];
        vm.listTipos = [
        {
            title: "Banco",
            id: "Banco"
        }, {
            title: "Casa de Bolsa",
            id: "Casa de Bolsa"
        }];
        vm.listEstatus = [
        {
            title: "Pendiente",
            id: "Pendiente"
        }, {
            title: "Contactado",
            id: "Contactado"
        }];
    
        // Clients search
        vm.clients_search = {
            finish: false,
            sent: false
        };
        // Carousel configuration
        $scope.myInterval = 5000;
        $scope.active = 0;

        function setup() {
            setupVars();
            getBinnacleCatalog();
            var month = moment().format( 'M' ),
            year = moment().format( 'YYYY' );
            getCommentsDetailsByContract(month, year);
        }

        function init() {            
            vm.submitSearch();
            getMonth();        
        }

        function setTablestage(data) {

            //configurando ng-table
            var defaults = {
                page: 1,
                count: data.length,
                filter: {}
            };

            //Se configura los filtros iniciales del ng-table
            if (vm.filterTable.nombreCliente)
                defaults.filter.nombreCliente = vm.filterTable.nombreCliente;
            if (vm.filterTable.idSponsor)
                defaults.filter.idSponsor = vm.filterTable.idSponsor;
            if (vm.filterTable.numContrato)
                defaults.filter.numContrato = vm.filterTable.numContrato;
            if (vm.filterTable.typeOrigin)
                defaults.filter.typeOrigin = vm.filterTable.typeOrigin;
            if (vm.filterTable.clasification)
                defaults.filter.clasification = vm.filterTable.clasification;
            if (vm.filterTable.contactNameStatus)
                defaults.filter.contactNameStatus = vm.filterTable.contactNameStatus;

            vm.configTable = new NgTableParams(defaults, {
                dataset: data,
                filterOptions: {
                    //se configuran filtros manuales para cada columna
                    filterFn: function (data, filterValues) {
                        var filtro = data;
                        vm.filterTable = filterValues;

                        if (filterValues.nombreCliente) {
                            filtro = filtro.filter(function (item) {
                                return item.nombreCliente.search(new RegExp(filterValues.nombreCliente, 'i')) > -1;
                            });
                        }

                        if (filterValues.idSponsor) {
                            filtro = filtro.filter(function (item) {
                                return item.idSponsor.toString().search(new RegExp(filterValues.idSponsor, 'i')) > -1;
                            });
                        }

                        if (filterValues.numContrato) {
                            filtro = filtro.filter(function (item) {
                                return item.numContrato.toString().search(new RegExp(filterValues.numContrato, 'i')) > -1;
                            });
                        }

                        if (filterValues.typeOrigin) {
                            filtro = filtro.filter(function (item) {
                                return item.typeOrigin.search(new RegExp(filterValues.typeOrigin, 'i')) > -1;
                            });
                        }

                        if (filterValues.contactNameStatus) {
                            filtro = filtro.filter(function (item) {
                                return item.contactNameStatus.search(new RegExp(filterValues.contactNameStatus, 'i')) > -1;
                            });
                        }

                        if (filterValues.clasification) {
                            filtro = filtro.filter(function (item) {
                                return item.clasification.toLowerCase() === filterValues.clasification.toLowerCase();
                            });
                        }

                        return filtro;
                    }
                }
            });

            //Seleccionamos los tipos de filtros para cada columna
            vm.filter = {
                nombreCliente: {
                    nombreCliente: {
                        id: "text",
                        placeholder: "Buscar"
                    }
                },
                idSponsor: {
                    idSponsor: {
                        id: "text",
                        placeholder: "Buscar"
                    }
                },
                numContrato: {
                    numContrato: {
                        id: "text",
                        placeholder: "Buscar"
                    }
                },
                typeOrigin: {
                    typeOrigin: {
                        id: "select",
                        placeholder: "Buscar"
                    }
                },
                clasification: {
                    clasification: {
                        id: "select",
                        placeholder: "Buscar"
                    }
                },
                contactNameStatus: {
                    contactNameStatus: {
                        id: "select",
                        placeholder: "Buscar"
                    }
                }
            };
        }                
       
        vm.saveStateView = function (client) {
            binnacleStrategyCommercialFtr.saveState(vm.filterTable);
            $state.go('binnacle.commercial.strategy.id', { id: client.numContrato, sponsor: client.idSponsor, clasificacion:client.clasification});
            getMonth();
        };

        vm.comeBack = function(){
            $state.go('binnacle.commercial.strategy');
            vm.goToLastState();            
        };

        vm.goToLastState = function(){            
            var record = binnacleStrategyCommercialFtr.infoStrategyCommercial;
            vm.filterTable = record === null || record === undefined  ? {}:record;       
            vm.submitSearch();

        };

        // Submit search form
        vm.submitSearch = function () {

            vm.clients_search = {
                finish: false,
                sent: true
            };
            
            binnacleStrategySrv.getBinnacleClients($scope.binnacle.sadviser.employeeID)
                .then(function successCallback(response) {
                    var sponsors = [];

                    if (response.data && response.data.length > 0) {
                        // Combine information in a single array
                        angular.forEach(response.data, function (obj) {
                            angular.forEach(obj.contractsList, function (item) {
                                item.idSponsor = obj.idSponsor;
                                item.typeOrigin = item.origen.trim() === "CB" ? "CASA DE BOLSA" : item.origen.trim();
                                item.contactNameStatus = item.contactStatus ? " CONTACTADO" : " PENDIENTE";
                                sponsors.push(item);
                            });
                        });                                                            
                    } else {
                        vm.clients = [];
                    }
                    vm.clients = sponsors;     
                    setTablestage(sponsors);   
                    vm.clients_search.finish = true;                                            
                }, function errorCallback() {
                    vm.clients = [];
                    vm.clients_search.finish = true;
                    setTablestage(vm.clients);
                });
        };

        // Get binnacle birthdays
        vm.empty_birthdays = true;

        vm.getBirthdays = function (filter) {

            if (vm.status.open && vm.listDatesSelected.length === 0) {
                vm.dates = {
                    finish: false
                };
                binnacleBirthdaysSrv.getInfo($scope.binnacle.sadviser.employeeID)
                    .then(function successCallback(response) {
                        vm.listDateBirthday = response.data;
                        vm.getBirthdayFilter(filter);
                        vm.dates = response;
                    }, function errorCallback(error) {
                        vm.dates = error;
                    });
            }
        };

        // Select birthday filter
        vm.getBirthdayFilter = function (filter) {
            var i = 0, j = 0;
            vm.birthday_filter = filter;
            vm.listDatesSelected = [];
            switch (filter) {
                case "today":
                    vm.hasBirthday = vm.listDateBirthday.flag.hasBirhtdayToday;
                    for (i = 0; i < vm.listDateBirthday.lista.today.length; i++)
                        for (j = 0; j < vm.listDateBirthday.lista.today[i].records.length; j++)
                            vm.listDatesSelected.push(vm.listDateBirthday.lista.today[i].records[j]);
                    break;
                case "prev":
                    vm.hasBirthday = vm.listDateBirthday.flag.hasBirthdayLastweek;
                    for (i = 0; i < vm.listDateBirthday.lista.lastWeek.length; i++)
                        for (j = 0; j < vm.listDateBirthday.lista.lastWeek[i].records.length; j++)
                            vm.listDatesSelected.push(vm.listDateBirthday.lista.lastWeek[i].records[j]);
                    break;
                case "next":
                    vm.hasBirthday = vm.listDateBirthday.flag.hasBirthdayNextweek;
                    for (i = 0; i < vm.listDateBirthday.lista.nextWeek.length; i++)
                        for (j = 0; j < vm.listDateBirthday.lista.nextWeek[i].records.length; j++)
                            vm.listDatesSelected.push(vm.listDateBirthday.lista.nextWeek[i].records[j]);
                    break;
                default:
                    vm.hasBirthday = false;
                    break;
            }
        };

        // Show client information
        vm.showClientInfo = function (client) {      
            var message='';
            var _error='';

            CalendarSrv.getClientDetail(client.contract, client.origen.trim())
            .then(function(result){
                if(result.outCommonHeader.result.result === 2){
                    _error=result.outCommonHeader.result.messages;
                   angular.forEach(_error, function (_res) {
                       if (_res.responseMessage) {
                           message += _res.responseMessage + '<br>';
                       }
                   });
                   CommonModalsSrv.error(message);
                   return;
               }

               if( result.outClientOrContractClientInfoQuery && result.outClientOrContractClientInfoQuery.client && result.outClientOrContractClientInfoQuery.client.length != 0
                && result.outClientOrContractClientInfoQuery.client[0].email.length != 0 ){
                client.email = result.outClientOrContractClientInfoQuery.client[0].email[0].email;
                client.phoneNumber =  result.outClientOrContractClientInfoQuery.client[0].telephoneData.length != 0 ? Number(result.outClientOrContractClientInfoQuery.client[0].telephoneData[0].phoneNumber) : '';
                
                binnacleModalSrv.showClientInfo( client );
               }else{
                    CommonModalsSrv.error('No se encontró información del cliente.');
               }

            }, function (error) {
                CommonModalsSrv.error(error.msg);
            }).finally(function () {

            });

        };

        // Get client details
        vm.getClientDetails = function (employeeID, sponsor, contract) {           
            vm.client_data = false;

            return $q.all([
                binnacleStrategySrv.getClientDetails(employeeID, sponsor, contract),
                binnacleStrategySrv.getClientType(employeeID, contract),
                binnacleStrategySrv.getClientProfile(contract)
            ]).then(function (data) {
                vm.client_data = {};

                angular.forEach(data, function (topic) {
                    vm.client_data[topic.type] = topic.data;
                });
                vm.client_data.clasificacion = $state.params.clasificacion;

                // Init application
                setup();

            }, function () {

                vm.client_data = null;
                CommonModalsSrv.error('Se Encontró Un Error Favor De Intentarlo Más Tarde, Comuníquese Con Su Help desk');

            });
        };

        /** add new Trace client
        * @param {object} child trace
        * @param {boolean}
        **/
        vm.addChild = function (_child, _principal, _level) {
            vm.lastSelectedOpt = _child.idActivity;
            if (_principal) {
                vm.catalogOption = vm.lastSelectedOpt;
                vm.binnacleCatalogChild = [];
                vm.selectedOptions = {};
            }

            binnacleStrategySrv.getBinnacleCatalogChild(vm.lastSelectedOpt).then(function (_res) {
                var child = _res.data;
                var find;
                var size = vm.binnacleCatalogChild.length;
                if (size > 0) {
                    find = findCatalogChild(_res.data);
                }


                if (!find) {

                    // Remove unnecessary items
                    if (typeof vm.binnacleCatalogChild[_level + 1] !== 'undefined') {
                        vm.binnacleCatalogChild.length = _level + 1;
                    }
                    if (child.length > 0) {
                        vm.binnacleCatalogChild.push({
                            model: 'level_' + size,
                            options: child,
                            text: child[0].descriptionCode
                        });
                    }
                }

            }, function () {
                CommonModalsSrv.error('Se Encontró Un Error Favor De Intentarlo Más Tarde, Comuníquese Con Su Help desk');
            });
        };

        vm.sent_binnacle = false;
        vm.saveCatalog = function (form) {

            // Send information
            if (vm.lastSelectedOpt && form.$valid) {
                var info = {
                    idContract: $state.params.id,
                    name: vm.client_data.details.nombreCliente,
                    idEmployee: $scope.binnacle.sadviser.employeeID,
                    sponsorNumber: $state.params.sponsor,//vm.client_data.type.idSponsor,
                    idActivity: vm.lastSelectedOpt,
                    description: vm.catalogComments,
                    especification: '',
                    clasification: $state.params.clasificacion,
                    language: 'SPA'
                };

                binnacleStrategySrv.doBinnacleComment(info).then(function () {
                    vm.submitSearch();
                    CommonModalsSrv.done("El mensaje se ha enviado exitosamente.");
                }, function (error) {
                    CommonModalsSrv.error(error.msg);
                }).finally(function () {
                    vm.sent_binnacle = false;
                    setup();
                });

            } else {
                CommonModalsSrv.error('Para guardar cambios es necesario llenar los campos requeridos');
            }
        };

        /**
        * @param {object}  child trace
        **/
        function findCatalogChild(_child) {
            return R.find(function (_val) {
                return angular.equals(_val.options, _child);
            }, vm.binnacleCatalogChild);

        }

        function getBinnacleCatalog() {
            binnacleStrategySrv.getBinnacleCatalog().then(function (_res) {
                vm.binnacleCatalog = _res.data;
            }, function () {
                CommonModalsSrv.error('Se Encontró Un Error Favor De Intentarlo Más Tarde, Comuníquese Con Su Help desk');
            });
        }

        /** get comments details by contract**/
        function getCommentsDetailsByContract(month, year) {
            binnacleStrategySrv.getCommentsDetailsByContract($scope.binnacle.sadviser.employeeID, $state.params.sponsor, $state.params.id, month, year).then(function (_res) {
                vm.CommentsByContract = _res && _res.commentSection.length > 0 ? _res:[];
            }, function () {
                vm.CommentsByContract = [];
            });
        }
        
        function setupVars() {
            vm.binnacleCatalogChild = [];
            vm.selectedOptions = {};
            vm.lastSelectedOpt = null;
            vm.catalogOption = null;
            vm.catalogComments = null;
        }

        function getMonth() {
            var nameMonth = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
            var date = new Date();
            var month = date.getMonth() + 1;
            var year = date.getFullYear();
            var listMonths = [];
            for (var i = 0; i < 24; i++) {
                if (month === 0) {
                    year = year - 1;
                    month = 12;
                }

                month = month - 1;

                listMonths.push({
                    year: year,
                    month: month+1, 
                    monthDesc: nameMonth[month],
                    select : month === date.getMonth() && year ===  date.getFullYear() ?  true : false 
                });
            }
            vm.listMonths = listMonths;            
        }

        vm.getComment = function(item){
            resetSelectMonth(item);
            getCommentsDetailsByContract(item.month, item.year)

        }
        
        vm.mouseOver = function(tipo){   
            if (tipo === 1)
                vm.slideMenuLeft();
            else
                vm.slideMenuRight();
        };

        vm.mouseLeave = function () {
            if (ctrlTimer && ctrlTimer !== null)
                $timeout.cancel(ctrlTimer);
        };

        vm.slideMenuLeft = function () {    
            vm.menu.position = vm.menu.position <= 0 ? 0 : (vm.menu.position - 30);
             showButtonsMenu();
             document.getElementById("contentMonth").style.right = (vm.menu.position+"px");                        
             if (vm.menu.position <= 0) {
                 $timeout.cancel(ctrlTimer);
             } else {
                 ctrlTimer = $timeout(vm.slideMenuLeft, 150);
             }
        };

        vm.slideMenuRight = function () {            
            var size = getDiferentsWidthMenu();         
            vm.menu.position = vm.menu.position > size.restantes ? size.restantes: vm.menu.position + 30;               
            showButtonsMenu();           
            document.getElementById("contentMonth").style.right = (vm.menu.position+"px");                        
            if (vm.menu.position > size.restantes) {
                $timeout.cancel(ctrlTimer);
            } else {
                ctrlTimer = $timeout(vm.slideMenuRight, 150);
            }
        };

        function showButtonsMenu () {
            var size = getDiferentsWidthMenu();
            //boton izquierdo
            vm.menu.showButtonLeft = (vm.menu.position <= 0 ? false:true);
            //boton derecho
            vm.menu.showButtonRight = (vm.menu.position >= size.restantes ? false: true);
        }

        function getDiferentsWidthMenu(){    
            var obj = {
                divMenu: document.getElementById("contentPrin").getBoundingClientRect().width + 2,
                ulMenu: document.getElementById("contentMonth").getBoundingClientRect().width
            };
            
            if (obj.ulMenu > obj.divMenu)
                obj.restantes = obj.ulMenu - obj.divMenu;
            else{               
                    obj.restantes = 0;
            }                 
            return obj;
        }

        function resetSelectMonth(item){
            angular.forEach(vm.listMonths, function (element) {
                element.select = false;
            });
            item.select = true;
        }

        vm.resize = function(){
            vm.menu.position = 0;
            document.querySelector("#contentMonth").style.right = "0px"; 
            showButtonsMenu();
            $scope.$apply();
        };

        init();
    }

    angular
        .module('actinver.controllers')
        .controller('binnacleStrategyCtrl', binnacleStrategyCtrl);

})();
