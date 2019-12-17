(function () {
    'use strict';

    function newsModalSrv($uibModal) {
        var news = {};
        news.showNews = function (data) {
            return $uibModal.open({
                templateUrl: '/scripts/modals/views/news/news.html',
                windowClass: 'modal-center-news info',
                controller: 'newsModalCtrl',
                controllerAs: 'news',
                resolve: {
                    data: function () {
                        return data;
                    }
                }
            }).result.catch(function (res) {
                if (!(res === 'cancel' || res === 'escape key press' || res === 'backdrop click')) {
                    throw res;
                }
            });
        };

        return news;
    }

    angular.module('actinver.services')
        .service('newsModalSrv', newsModalSrv);

})();