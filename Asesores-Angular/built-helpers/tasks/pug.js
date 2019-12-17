module.exports = ( config, dest ) =>{
    const opt = {
        pretty: (dest === 'build' ? true : false ),
        basedir: __dirname + '/../../src/private'
    };

    const templateCache = require('gulp-angular-templatecache');


    config.modules.gulp.task('pug:index', ( ) =>
        config.modules.gulp
        .src( config.folders.pug.index )
        .pipe( config.modules.plumber())
        .pipe( config.modules.pug(opt))
        .pipe( config.modules.gulp.dest( config.folders[dest] ) )
    )

    config.modules.gulp.task('pug:login', ( ) =>
        config.modules.gulp
        .src( config.folders.pug.login )
        .pipe( config.modules.plumber())
        .pipe( config.modules.pug(opt))
        .pipe( config.modules.gulp.dest( config.folders[dest] ) )
    )


    config.modules.gulp.task('pug:views', ( ) =>

        config.modules.gulp
        .src( config.folders.pug.src )
        .pipe( config.modules.plumber())
        .pipe( config.modules.pug(opt))
        .pipe( templateCache({
            module :'actinver.templates',
            transformUrl: function(url) {
                return url.replace( 'private', '')
            }
        }) )
        .pipe( config.modules.gulp.dest( `${config.folders[dest]}/scripts` ) )

    )


    config.modules.gulp.task('pug', ['pug:views'] )

    config.modules.gulp.task('pug:indexes', config.modules.sync.sync([
        [ 'pug:index', 'pug:login'],
        'replace'
    ] ))

}
