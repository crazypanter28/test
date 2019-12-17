(function () {
    "use strict";

    function favoritesCtrl(administratorModalsSrv, CommonModalsSrv, NgTableParams, proposalsProposalSrv, FavAdminSrv) {
        var vm = this;

        function setup() {
            getFavorites();
        }

        vm.updateSearch = function () {
            var term = vm.name;
            vm.tableParams.filter({ $: term });
        };

        vm.deleteClassification = function () {
            administratorModalsSrv.admonFavorites('Eliminar clasificacón')
                .then(function (_model) {
                       FavAdminSrv.deleteClassFav(_model)
                        .then(function (result) {
                            if (result.success) {
                                CommonModalsSrv.done(result.data);
                            } else {
                                CommonModalsSrv.error(result.data);
                            }
                        });


                   
                }).catch(function (res) {
                    if (!(res === 'cancel' || res === 'escape key press' || res === 'backdrop click' || typeof res === 'undefined')) {
                        throw res;
                    }
                });
        }


        vm.showModalCreateFavorites = function () {
            administratorModalsSrv.admonFavorites('Nuevo favorito')
                .then(function (_model) {
                    if(_model.idSelected === 'clasification'){

                        FavAdminSrv.saveClassFav(_model)
                            .then(function (result) {
                                if (result.success) {
                                    CommonModalsSrv.done(result.data);
                                    getFavorites();
                                } else {
                                    CommonModalsSrv.error(result.data);
                                }
                            });

                    }else if(_model.idSelected === 'favorite'){

                        FavAdminSrv.saveFav(_model)
                            .then(function (result) {
                                if (result.success) {
                                    CommonModalsSrv.done(result.data);
                                    getFavorites();
                                } else {
                                    CommonModalsSrv.error(result.data);
                                }
                            });
                    }
                }
                ).catch(function(res) {
                    if (!(res === 'cancel' || res === 'escape key press' || res === 'backdrop click' || typeof res === 'undefined')) {
                        throw res;
                    }
                });
        };

        vm.showModalRemoveFavorites = function (_id) {
            CommonModalsSrv.warning('¿Estás seguro de eliminar la emisora?')
                .result.then(function () {
                    FavAdminSrv.removeFav(_id)
                        .then(function (result) {
                            if (result.success) {
                                CommonModalsSrv.done(result.data);
                                getFavorites();
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

        vm.showModalEditFavorites = function(id){
            administratorModalsSrv.admonFavorites('Editar favorito', id)
                .then(function (_model) {
                    _model.idFavorite = id.idIssuer;
                    FavAdminSrv.updateFav(_model)
                        .then(function (result) {
                            if (result.success) {
                                CommonModalsSrv.done(result.data);
                                getFavorites();
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

        }

        function getFavorites() {
            vm.loadingFav = true;
            FavAdminSrv.getClassificationFavAdm().then(function (_res) {
                getFav(_res.data);
            }, function () {
                vm.errorLoadingFav = true;
                vm.loadingFav = false;
            });
        }

        function getFav(_types) {
            FavAdminSrv.getFavorites().then(function (_res) {
                setupTable(refactoringFunds(_res.data, _types));
                vm.loadingFav = false;
            });
        }

        function refactoringFunds(_favs, _types) {
            var type;
            return _favs.map(function (_fav) {
                type = R.find(function (_type) {
                    return _type.idClassification === _fav.idClassification;
                }, _types || []);
                _fav.classification = type || '';
                return _fav;
            });
        }

        function setupTable(_list) {
            vm.tableParams = new NgTableParams(
                { count: 10 },
                { dataset: _list }
            );
        }

        setup();
    }

    angular.module('actinver.controllers')
        .controller('favoritesCtrl', favoritesCtrl);
})();
