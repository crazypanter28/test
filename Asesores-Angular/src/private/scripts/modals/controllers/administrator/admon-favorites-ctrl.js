(function () {
    "use strict";

    function admonFavoriteModalCtrl($uibModalInstance, title, favorite, FavAdminSrv) {
        var vm = this;

        if (favorite) {
            vm.idIssuer = favorite.idIssuer;
            vm.issuerName = favorite.issuerName;
            vm.serie = favorite.serie;
            vm.idClassification = favorite.idClassification;
        }



        if (title === "Nuevo favorito") {
            vm.type = 'newFav';
        } else if (title === 'Editar favorito') {
            vm.type = 'updateFav';
        } else if (title === 'Eliminar clasificacón') {
            vm.type = 'deleteClassification';
        }  


        function setup() {
            setupVars();
            getClassFav();
        }


        function setupVars() {
            if (favorite) {
                favorite.classification.text = favorite.classification.description;
            }

            vm.title = title;
            vm.favorite = favorite;
            vm.states = ['Chiapas', 'Veracruz', 'Paracio de hierro', 'Liverpool', 'Sams', 'Fabricas de francia'];
            // vm.type = favorite ? 'favoriteEje' : '';
            // investment.clasification.text = investment.clasification.description;
            vm.fav = favorite ? favorite : {};
            //vm.classification.text = 'Emisoras principales';
        }


        vm.close = function () {
            $uibModalInstance.dismiss();
        };


        vm.done = function () {
            $uibModalInstance.close(vm.fav);
        };

        vm.setType = function (_type) {
            vm.type = _type;
        };

        function getClassFav() {
            FavAdminSrv.getClassificationFavAdm().then(function (_res) {
                vm.classification = _res.data.map(function (_val) {
                    _val.text = _val.description;
                    return _val;
                });
            }, function () {
                CommonModalsSrv.error('Se Encontró Un Error Favor De Intentarlo Más Tarde, Comuníquese Con Su Help desk');
                $rootScope.listClassFav = null;
            });
        };


        setup();

    }

    angular.module('actinver.controllers')
        .controller('admonFavoriteModalCtrl', admonFavoriteModalCtrl);

})();
