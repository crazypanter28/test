(function(){
    "use strict";

    function fileUploader( FileUploader ){

        function link( scope ){

            function resetFileWatch() {
                if (angular.isDefined(scope.onReset)) {
                    scope.$watch('onReset', function (newValue) {
                        if (newValue) {
                            if (scope.uploader && scope.uploader.removeFromQueue && scope.uploader.removeFromQueue.length > 0) {
                                scope.uploader.removeFromQueue(0);
                            }
                        }
                    });
                }
            }

            function setup () {
                setupVars();
                setFilterUploader();
                setListenerUploader();
                resetFileWatch();
            }


            function setupVars () {
                scope.uploader = new FileUploader({
                    queueLimit: 2,
                    onBeforeUploadItem: function (item) {
                        item.headers = {
                            "Authorization": "bearer " + sessionStorage.getItem('__token'),
                            "X-CSRF-TOKEN": sessionStorage.getItem('__csrf')
                        };
                    }
                });
            }


            function setFilterUploader () {
                if( scope.filter ) {
                    scope.uploader.filters.push({
                        name: 'formatsAndSize',
                        fn: filterUploader
                    });
                }
            }


            function filterUploader ( _item ) {
                var isValid = R.find( function ( _val ) {
                    return ( _val.formats.indexOf(_item.type) >= 0 && _item.size <= _val.size  );
                })(scope.filter);

                if( isValid ) {
                    return true;
                }

                if( scope.onErrorSetFile && typeof scope.onErrorSetFile === "function" ){
                    scope.onErrorSetFile( "El formato o tamaño no es permitido." );
                    scope.uploader.removeFromQueue(0);
                }
            }


            function setListenerUploader () {
                scope.uploader.onAfterAddingFile = function( _item ) {
                    if( scope.uploader.queue.length > 1 ){
                        scope.uploader.removeFromQueue(0);
                    }

                    /*if( scope.uploader.queue[0].file.type.search('image') === -1 ){
                        if( scope.onErrorSetFile && typeof scope.onErrorSetFile === "function" ){
                            scope.onErrorSetFile( "Type" );
                        }
                        return;
                    }*/

                    var reader = new FileReader();
                    reader.onload = function(event) {
                        scope.$apply(function(){
                            if( scope.onSuccessSetFile && typeof scope.onSuccessSetFile === "function") {
                                scope.onSuccessSetFile( event.target.result, _item );
                            }
                        });
                    };
                    reader.readAsDataURL( _item._file );
                };
            }



            scope.uploaderFile =  function () {
                document.getElementById('file-uploader').click();
                if(angular.isDefined(scope.onReset)){
                    scope.onReset = false;
                }
            };


            setup();
        }


        return {
            restrict: 'EA',
            replace: true,
            template:   "<div class='file-uploader'>" +
                            "<div class='icon-file' ng-class='{ active: uploader.queue.length > 0, pdf: uploader.queue[0].file.type === &quot;application/pdf&quot; }' ng-click='uploaderFile()'></div>" +
                            "<input id='file-uploader' type='file' ng-if='uploader' nv-file-select uploader='uploader'>" +
                            "<div class='info-file' ng-show='uploader.queue.length > 0'>" +
                                "<div class='name'>{{ uploader.queue[0].file.name }}</div>" +
                                "<button class='change-file' ng-click='uploaderFile()'>Cambiar</button>" +
                            "<div>" +
                        "</div>",
            scope:{
                filter: '=?',
                onSuccessSetFile: '=?',
                onErrorSetFile: '=?',
                onReset: '=?'
            },
            link:link
        };


    }


    angular.module( 'actinver.directives' )
    .directive( 'fileUploader', fileUploader );


} )();
