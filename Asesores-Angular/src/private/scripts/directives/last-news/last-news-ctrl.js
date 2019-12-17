(function () {
    "use strict";

    function lastNewsCtrl($scope, $timeout, lastNewsInfo, newsModalSrv, URLS) {
        var vm = this;
        vm.noticias = [];
        vm.noticiasFilter = [];
        //0 Todos, 1 mostrar 10
        vm.opcionListarNoticias = 0;

        vm.socketLastNews={
            stompclient : null,
            susbcribe: null
        };        

        $scope.$on('close-socket-last-news', function() {
            cerrarsocket();
        });

        function inicializarSocket() {
            var _url = URLS.dashboardWebSocket + '?access_token=' + sessionStorage.getItem("__token");
            var socket = new SockJS(_url);
            vm.socketLastNews.stompclient = Stomp.over(socket);
            vm.socketLastNews.stompclient.debug = null;
            vm.socketLastNews.stompclient.connect({}, function () {
                vm.socketLastNews.susbcribe = vm.socketLastNews.stompclient.subscribe('/topic/feedInfosel/lastNews', function (response) {
                    var data = JSON.parse(response.body);                    
                    processNews(data);
                });
            }, function () {
                $timeout(inicializarSocket, 3000);
            });
        }

        function cerrarsocket() {            
            if (vm.socketLastNews.stompclient !== null) {
                vm.socketLastNews.susbcribe.unsubscribe();
                vm.socketLastNews.stompclient.disconnect();
            }                  
        }

        function processNews(news) {
            vm.noticias.unshift(news);
            vm.noticiasFilter = Array.from(vm.noticias);
        }

        // Get information
        vm.info = {
            success: false
        };

        lastNewsInfo.getInfo()
            .then(function successCallback(response) {
                vm.noticias = Array.from(response.data.result);
                vm.noticiasFilter = Array.from(response.data.result);
                vm.info = response;                
            }, function errorCallback(error) {
                vm.info = error;
                vm.noticias = [];
            });

        vm.changeOpcion = function (opcion) {
            vm.opcionListarNoticias = opcion;
            if (opcion === 1) {
                vm.noticiasFilter = vm.noticias.slice(0, vm.noticias.length >= 10 ? 10 : vm.noticias.length);
            } else {
                vm.noticiasFilter = Array.from(vm.noticias);
            }
            $scope.$broadcast("recalculateMarquee");
        };

        vm.verListadoNews = function () {
            newsModalSrv.showNews(vm.noticias);
        };


        inicializarSocket();

    }

    angular
        .module('actinver.controllers')
        .controller('lastNewsCtrl', lastNewsCtrl);
})();