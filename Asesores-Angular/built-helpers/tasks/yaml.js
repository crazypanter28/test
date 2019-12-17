module.exports = ( config, dest ) => {

    var YAML = require('yamljs');
    var rename = require('gulp-rename');
    var replacement = require('gulp-replace');
    var file = require('gulp-file');

    config.modules.gulp.task('yaml',() =>{
        var nativeObject = YAML.load('config.yml');
        var ref = dest === 'build' ?  'hostDev' : 'hostProd';
        var src = `
            /*
                Este archivo solo es declarativo, para agregar nuevas urls hacerlo en config.yml
            */
            ( function(){
                "use strict";
                function url(){
                    var urls = 'urls';
                    return urls;
                }

                angular.module('actinver.constants')
                .constant('URLS', new url() );
            })();
        `
        var host = nativeObject[ref];
        var urls = nativeObject.urls;

        var urlsResponse = {};
        for( var url in urls ){
            urlsResponse[url] = urls[url].replace( '{{host}}', '' );
        }

        var template = src.replace( "'urls'", JSON.stringify(urlsResponse) )

        file('urls.config.js', template )
        .pipe( config.modules.gulp.dest( './src/private/scripts/constants/' ) );

    })

}
