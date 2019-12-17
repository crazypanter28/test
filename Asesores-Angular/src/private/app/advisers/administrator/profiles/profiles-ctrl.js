(function () {
    "use strict";

    function profilesCtrl(administratorModalsSrv, CommonModalsSrv, ProfilesSrv, NgTableParams, userConfig) {

        var vm = this;
        var tableRoles;
        var employeeID = userConfig.user.employeeID;

        function setup() {
            setupVars();
            getRoles();
        }

        vm.changeTab = function (_tab) {
            vm.selectedTabPresent = _tab.description;
            vm.selectedTab = _tab.idRole;
            setTable(_tab.description);
        };

        vm.showModalCreateProfiles = function () {
            administratorModalsSrv.admonProfiles('Nuevo perfil', {})
                .then(function (_profile) {
                    _profile.employeeID = employeeID;
                    ProfilesSrv.saveProfile(_profile)
                        .then(function (result) {
                            if (result.success) {
                                CommonModalsSrv.done(result.data);
                                getRoles();
                            } else {
                                CommonModalsSrv.error(result.data);
                            }
                        });
                    }
                ).catch(function(res) {
                    if (!(res === 'cancel' || res === 'escape key press' || res === 'backdrop click' || typeof res === 'undefined')) {
                        throw res;
                    }
                });
        };

        vm.showModalRemoveProfiles = function (_id) {
            CommonModalsSrv.warning('¿Estás seguro de eliminar el perfil?').result
                .then(function () {
                    ProfilesSrv.removeProfile(_id)
                        .then(function (result) {
                            if (result.success) {
                                CommonModalsSrv.done(result.data);
                                getRoles();
                            } else {
                                CommonModalsSrv.error(result.data);
                            }
                        });
                }).catch(function (res) {
                    if (!(res === 'cancel' || res === 'escape key press' || res === 'backdrop click')) {
                        throw res;
                    }
                });
        };

        vm.nextTab = function () {
            vm.groupSelectedTab++;
        };

        vm.beforeTab = function () {
            vm.groupSelectedTab--;
        };

        function getRoles() {
            vm.loadingRoles = true;
            ProfilesSrv.getRoles().then(function (_res) {
                vm.listTabs = _res;
                getUserRoles(_res);
            });
        }

        function refactoringUsers(_listUsers, _roles) {
            var role;
            var categories = [];

            _roles.map(function (_role) {
                categories[_role.description] = [];
            });

            _listUsers.map(function (_user) {
                role = R.find(function (_role) {
                    return _role.description === _user.roleDescription;
                }, _roles || []);

                if (role) {
                    categories[role.description].push(_user);
                }
            });
            return categories;
        }

        function getUserRoles( _roles ) {
            ProfilesSrv.getUserRoles( 1 ).then(function( _res ) {
                tableRoles = refactoringUsers( _res, _roles );
                if (vm.selectedTabPresent !== ''){ setTable(vm.selectedTabPresent);
                } else { setTable( _roles[0].description );}
                vm.loadingRoles = false;
            });
        }

        function setTable(_category) {
            var table = tableRoles[_category];
            var defaults = {
                page: 1,
                count: 5,
            };

            vm.listLength = table.length;
            vm.configTable = new NgTableParams(defaults, {
                paginationMaxBlocks: 4,
                paginationMinBlocks: 2,
                dataset: table,
            });
        }

        function setupVars() {
            vm.selectedTab = 4;
            vm.groupSelectedTab = 0;
            vm.selectedTabPresent = '';
            // vm.listTabs = [ 'Administrador', 'Asesor', 'Contraloria', 'Reportes', 'Director', 'Gerente', 'Lorem1', 'Lorem2', 'Lorem3', 'Lorem4', 'Lorem5', 'Lorem6' ];
        }

        setup();
    }

    angular.module('actinver.controllers')
        .controller('profilesCtrl', profilesCtrl);
})();
