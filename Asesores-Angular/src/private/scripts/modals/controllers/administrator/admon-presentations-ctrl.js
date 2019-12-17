( function(){
    "use strict";

    function admonPresentationsModalCtrl( $uibModalInstance, URLS, title, presentations, PresentationsAdminSrv, CommonModalsSrv, PresentationAdminSrv ){
        var vm = this;
        vm.loading = false;
        vm.uploaderOptions = [
            { formats: [ "application/pdf" ], size: 10485760 }
        ];

        function setup () {
            setupVars();
            getTypes();
        }

        vm.previewFile = function( _blob, _file ){
            vm.pres.file = _file;
        };

        vm.errorFile = function(_error){
            vm.pres.file = false;
            CommonModalsSrv.warning( _error );
        };

        vm.cleanFields = function () {
            vm.pres.file = false;
        };

        vm.changeOptions = function(  ){
            var type = vm.pres.type;
            vm.clas = {};
            vm.subclas = {};
            vm.pres = {
                type : type
            };
        };

        vm.close = function(){
            $uibModalInstance.dismiss();
        };

        vm.done = function( type ){
            vm.loading = true;
            if( type === 'presentation' ){ 
                PresentationsAdminSrv.savePresentation( vm.pres )
                    .then( function( result ){
                        if( result.data !== null ){ 
                            if( vm.pres.file ){ 
                                var idPresentationType = vm.pres.idPresentationType || vm.pres.clasification.idPresentationType;
                                PresentationsAdminSrv.updateFile( result.data, result.params.idPresentationSubType, vm.pres.file, idPresentationType )
                                    .then( function(){
                                        $uibModalInstance.close( { msg: 'success', type: 'presentación' } );
                                    } ).catch( function(){
                                        $uibModalInstance.close( 'error' );
                                    } ).finally( function(){
                                        vm.loading = false;
                                        vm.cleanFields();
                                    } );
                            } else {
                                $uibModalInstance.close( { msg: 'success', type: 'presentación' } );
                            }
                        } else {
                            vm.close();
                            CommonModalsSrv.error( 'Se Encontró Un Error Favor De Intentarlo Más Tarde, Comuníquese Con Su Help desk' );
                        }
                    });
            } else if( type === 'clasification' ){
                PresentationsAdminSrv.saveClasification( vm.clas )
                    .then( function( result ){
                        if( result.data !== null ){
                            $uibModalInstance.close( { msg: 'success', type: 'clasificación' } );
                            vm.loading = false;
                            vm.cleanFields();
                        } else {
                            vm.close();
                            CommonModalsSrv.error( 'Se Encontró Un Error Favor De Intentarlo Más Tarde, Comuníquese Con Su Help desk' );
                        }                    });
            } else {
                PresentationsAdminSrv.saveSubClasification( vm.subclas, vm.pres.clasification.idPresentationType )
                    .then( function( result ){
                        if( result.data !== null ){
                            $uibModalInstance.close( { msg: 'success', type: 'subclasificación' } );
                            vm.loading = false;
                            vm.cleanFields();
                        } else {
                            vm.close();
                            CommonModalsSrv.error( 'Se Encontró Un Error Favor De Intentarlo Más Tarde, Comuníquese Con Su Help desk' );
                        }
                    });
            }
        };
        
        vm.getPDF = function( idPresentation ){
            PresentationAdminSrv.getPDF(idPresentation)
                .then( function ( ) {
                })
                .catch(function ( error ) {
                    CommonModalsSrv.error( error.error );
                });
        };

        vm.getSubclasification = function( _clasification  ){
            PresentationsAdminSrv.getPresentationSubTypesByClassification( _clasification.idPresentationType ).then( function( _res ){
                vm.subProducts = _res.map( function( _val ){
                    _val.text = _val.description;
                    return _val;
                });
            });
        };



        function getTypes(){
            PresentationsAdminSrv.getTypes().then( function( _res ){
                vm.products = _res.map( function( _val ){
                    _val.text = _val.description;
                    return _val;
                });
            });
        }

        function refactorPres(){
            return presentations;
        }

        function setupVars () {
            vm.title = title;
            // vm.group = group;
            vm.pres = presentations ? refactorPres() : {};
            // vm.pres.type = presentations ? 'presentation': null;
        }

        setup();

    }

    angular.module( 'actinver.controllers' )
        .controller( 'admonPresentationsModalCtrl', admonPresentationsModalCtrl );

} )();
