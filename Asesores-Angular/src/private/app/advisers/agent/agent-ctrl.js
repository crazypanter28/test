(function () {
    "use strict";

    function agentCtrl (URLS,$q,$http,CommonModalsSrv) {
        var vm = this;
        vm.pageSize = 25;
        vm.currentPage = 1;
        vm.totalPages;
        vm.selectAll = false;
        vm.openSearch = true;
        vm.agentes = [];
        vm.buttonTextToggle = "AGREGAR";
        vm.editToggle = false;
        vm.posicionPaginado = 10;
        getAgent();
        vm.indexEdit;
        vm.listBussines = [
            {id:1, text:"ARRENDAMIENTO"},
            {id:2, text:"CB Y BANCO"},
            {id:3, text:"CREDITO"}
        ];
        vm.columns = [{
                name: 'asesor',
                value: 'Nombre Asesor'
            }, {
                name: 'claveMapfre',
                value: 'ID Mapfre'
            }, {
                name: 'idEmpleado',
                value: 'ID Asesor'
            }, {
                name: 'puesto',
                value: 'Puesto'
            }, {
                name: 'idNegocio',
                value: 'Negocio'
            }];
        
        vm.checkAll = function () {
            if (vm.selectAll) {
                vm.agentsArray = [];
                angular.forEach(vm.agents, function(val, key) {
                    console.log("key: ", key);
                    console.log("value: ", val);
                    //vm.agentsArray.push(val);
                });
            } else {
                vm.agentsArray = [];
            }
        };

         vm.getAgent = getAgent
         function getAgent(param) {
             return $q(function (resolve, reject) {
                 $http({
                     method: 'POST',
                     url: URLS.getAgentQuery,
                     params: {
                            language: 'SPA',
                            operation: 'PARAMS',
                            idEmpleado: param === undefined ? "" : param.idEmpleado ,
                            claveMapfre: param === undefined ? "" : param.claveMapfre,
                            idNegocio: param === undefined ? "" : param.idNegocio,
                            asesor:param === undefined ? "" : param.asesor,
                            puesto:param === undefined ? "" : param.puesto
                     }
                 }).then(function success(response) {
                     if (response.data.return.status === 1) {
                        vm.responseAgente = response.data.return.data.insuranceAgentBeanList;
                        vm.totalPages = parseInt(vm.responseAgente.length / 5);
                        if(vm.totalPages === 0){
                            vm.totalPages = 1
                        }
                         resolve({success: true, info: vm.responseAgente});
                     } else {
                         reject({success: false, info: response.data.return.message});
                     }
                 }, function error() {
                     reject({success: false, type: 'not-found'});
                 });
             });
         }

          vm.getAgentAdd = getAgentAdd
          function getAgentAdd(_idEmpleado,_claveMapfre,_negocio,_asesor,_puesto) {
              return $q(function (resolve, reject) {
                  $http({
                      method: 'POST',
                      url: URLS.getAgentAddQuery,
                      params: {
                          language: 'SPA',
                         operation: 'PARAMS',
                          idEmpleado:_idEmpleado ,
                          claveMapfre:_claveMapfre,
                          idNegocio: _negocio,
                          asesor:_asesor,
                          puesto:_puesto
                      }
                  }).then(function success(response) {
                      if (response.data.return.status === 1) {
                         vm.responseAgenteAdd = response.data.return.data.insuranceAgentBeanList;
                          getAgent();
                          CommonModalsSrv.done("Se agrego agente con exito");
                          resolve({success: true, info: vm.responseAgenteAdd});
                      } else {
                          reject({success: false, info: response.data.return.message});
                      }
                  }, function error() {
                      reject({success: false, type: 'not-found'});
                  });
              });
          }

         vm.getAgentDelete = getAgentDelete
         function getAgentDelete(_idEmpleado, _idNegocio) {
             return $q(function (resolve, reject) {
                 $http({
                     method: 'POST',
                     url: URLS.getAgentDeleteQuery,
                     params: {
                         language: 'SPA',
                         idEmpleado: _idEmpleado,
                         idNegocio: _idNegocio,
                     }
                 }).then(function success(response) {
                     if (response.data.return.status === 1) {
                        vm.responseAgenteDelete = response.data.return.data.insuranceAgentBeanList;
                         getAgent();
                         CommonModalsSrv.done("Borrado exitoso");
                         resolve({success: true, info: vm.responseAgenteDelete});
                     } else {
                         reject({success: false, info: response.data.return.message});
                     }
                 }, function error() {
                     reject({success: false, type: 'not-found'});
                 });
             });
         }

         vm.getAgentUpdate = getAgentUpdate
         function getAgentUpdate(_idEmpleado,_claveMapfre,_idNegocio,_asesor,_puesto) {
             return $q(function (resolve, reject) {
                 $http({
                     method: 'POST',
                     url: URLS.getAgentUpdateQuery,
                     params: {
                        language: 'SPA',
                        idEmpleado: _idEmpleado,
                        claveMapfre: _claveMapfre,
                        idNegocio: _idNegocio,
                        asesor:_asesor,
                        puesto:_puesto
                     }
                 }).then(function success(response) {
                     console.log(response)
                     if (response.data.return.status === 1) {
                        vm.responseAgenteUpdate = response.data.return.data.insuranceAgentBeanList;
                         getAgent();
                         CommonModalsSrv.done("Actualización exitosa");
                         resolve({success: true, info: vm.responseAgenteUpdate});
                     } else {
                         reject({success: false, info: response.data.return.message});
                     }
                 }, function error() {
                     reject({success: false, type: 'not-found'});
                 });
             });
         }


        vm.selectAgent = function (idEmpleado, idNegocio) {
            /*vm.operacion = operacion;
            var _id = parseInt(id);
            var _index = vm.po.indexOf(_id);
            if (_index > -1) {
                vm.po.splice(_index, 1);
            }else{
                    vm.po.push(_id);
            }
            if (vm.po.length === 0) {vm.selectAll    = false; } */
            console.log("Empleado Seleccionado: " + idEmpleado + ", Negocio: " + idNegocio);
        };
        vm.submitSearch = function () {

        };

        vm.editRow = function () {

        };

        vm.deleteRow = function () {

        };

        vm.nextPage = function () {
            if(vm.responseAgente.length > vm.posicionPaginado){
                vm.posicionPaginado += 5;
                vm.currentPage++
            }
        };
        vm.soloNumero = soloNumero;
        function soloNumero(event) {
            var regex = new RegExp("^[0-9]+$");
            var echc = (typeof event.charCode !== 'undefined') ? event.charCode : event.which;
            var key = String.fromCharCode(echc);
            if (!regex.test(key) && event.charCode !== 0) {
                event.preventDefault();
                return false;
            }
        }

        vm.prevPage = function () {
            if(vm.posicionPaginado > 10){
                vm.posicionPaginado -= 5;
                vm.currentPage--
            }
        };
        vm.addAgents = function () {
            if(vm.editToggle){
                getAgentUpdate(vm.idEmpleado,vm.claveMapfre,vm.negocio.text,vm.asesor,vm.puesto);
                vm.editToggle = false;
                vm.buttonTextToggle = "AGREGAR";
            }else{
                getAgentAdd(vm.idEmpleado,vm.claveMapfre,vm.negocio.text,vm.asesor,vm.puesto);
            }
            vm.limpiarAgentes();
        };

        vm.deleteAgents = function (_idEmpleado,_idNegocio) {
            vm.editToggle = false;
            vm.buttonTextToggle = "AGREGAR";
            getAgentDelete(_idEmpleado,_idNegocio);
            // vm.agentes.splice(index,1)
            vm.limpiarAgentes();
        };

        vm.modifyAgents = function (_idEmpleado,_claveMapfre,_idNegocio,_asesor,_puesto) {
            vm.editToggle = true;
            vm.idEmpleado = _idEmpleado;
            vm.claveMapfre =_claveMapfre;
            vm.asesor = _asesor;
            vm.puesto = _puesto;
            vm.negocio = {
                text:_idNegocio
            }
            //vm.indexEdit= index;
            vm.buttonTextToggle = "EDITAR";
        };

        vm.limpiarAgentes = function(){
            vm.idEmpleado = "";
            vm.claveMapfre = "";
            vm.asesor = "";
            vm.puesto = "";
            vm.negocio = "";
        };

        vm.buscarAgente = function(){
            var params = {
                idEmpleado: vm.idEmpleado,
                claveMapfre: vm.claveMapfre,
                idNegocio: vm.negocio === undefined? "" : vm.negocio.text,
                asesor:vm.asesor === undefined ? "" : vm.asesor.toUpperCase(),
                puesto:vm.puesto === undefined ? "" : vm.puesto.toUpperCase()

            }
            getAgent(params)
            // vm.claveMapfre,vm.negocio,vm.asesor,vm.puesto
        }
    }

    angular
        .module('actinver.controllers')
        .controller('agentCtrl', agentCtrl);

})();
