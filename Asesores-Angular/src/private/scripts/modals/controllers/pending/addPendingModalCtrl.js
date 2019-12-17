(function () {
    "use strict";

    function addPendingModalCtrl($uibModalInstance, title, params )  {
        var vm = this;
        vm.title = title;
        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };

        vm.done = function(){
            if (vm.reason.description === 'Otro') {
                var res = {id:0, text:vm.reasontext, description:vm.reasontext};
                $uibModalInstance.close( res );
            } else{
                $uibModalInstance.close( vm.reason);
            }
        };

        vm.catalogo =  [
            {
                id : 0,
                title : 'Fondos de Inversión',
                items : [
                    {id:2,text:'Orden no instruida por cliente',description:'Orden no instruida por cliente'},
                    {id:3,text:'Importe erróneo',description:'Importe erróneo'},
                    {id:4,text:'Error en N° de títulos',description:'Error en N° de títulos'},
                    {id:5,text:'Fondo Inversión erróneo',description:'Fondo Inversión erróneo'},
                    {id:6,text:'Forma o cuenta de liquidación errónea',description:'Forma o cuenta de liquidación errónea'}
                ]

            },
            {
                id : 1,
                title : 'Mercado de Capitales',
                items : [
                    {id:8,text:'Orden no instruida por cliente'},
                    {id:9,text:'Importe erróneo'},
                    {id:10,text:'Error en N° de títulos'},
                    {id:11,text:'Emisora errónea'},
                    {id:12,text:'Precio erróneo'},
                    {id:13,text:'Plazo erróneo'},
                    {id:14,text:'Error en tipo de orden'}
                ]
            },
            {
                id : 2,
                title : 'Mercado de Dinero',
                items : [
                    {id:16,text:'Orden no instruida por cliente'},
                    {id:17,text:'Importe erróneo'},
                    {id:18,text:'Tipo de instrumento erróneo'},
                    {id:19,text:'Plazo erróneo'},
                    {id:20,text:'Tasa errónea'}
                ]
            },
            {
                id : 3,
                title : 'Transferencias',
                items : [
                    {id:22,text:'Orden no instruida por cliente'},
                    {id:23,text:'Importe erróneo'},
                    {id:24,text:'Contrato o Cuenta destino errónea'},
                    {id:25,text:'Contrato origen erróneo'}
                ]
            },
            {
                id : -1,
                title : 'Otro',
                items : [
                    {id:0,text:'Otro',description:'Otro'},
                    {id:2,text:'Orden no instruida por cliente',description:'Orden no instruida por cliente'},
                    {id:3,text:'Importe erróneo',description:'Importe erróneo'},
                    {id:4,text:'Error en N° de títulos',description:'Error en N° de títulos'},
                    {id:5,text:'Fondo Inversión erróneo',description:'Fondo Inversión erróneo'},
                    {id:6,text:'Forma o cuenta de liquidación errónea',description:'Forma o cuenta de liquidación errónea'},
                    {id:8,text:'Orden no instruida por cliente'},
                    {id:9,text:'Importe erróneo'},
                    {id:10,text:'Error en N° de títulos'},
                    {id:11,text:'Emisora errónea'},
                    {id:12,text:'Precio erróneo'},
                    {id:13,text:'Plazo erróneo'},
                    {id:14,text:'Error en tipo de orden'},
                    {id:16,text:'Orden no instruida por cliente'},
                    {id:17,text:'Importe erróneo'},
                    {id:18,text:'Tipo de instrumento erróneo'},
                    {id:19,text:'Plazo erróneo'},
                    {id:20,text:'Tasa errónea'},
                    {id:22,text:'Orden no instruida por cliente'},
                    {id:23,text:'Importe erróneo'},
                    {id:24,text:'Contrato o Cuenta destino errónea'},
                    {id:25,text:'Contrato origen erróneo'}
                ]
            }

        ];

        function searchReason (){
            vm.catalogo.forEach(function(element) {
                if (element.id === params.rejectionReason) {
                    vm.items = element.items;
                }
            });

            params.rejectionReason;
        }
        searchReason ();
        
    }

    angular.module('actinver.controllers')
        .controller('addPendingModalCtrl', addPendingModalCtrl);

})();
