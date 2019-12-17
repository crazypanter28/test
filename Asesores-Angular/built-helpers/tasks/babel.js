module.exports = ( config, dest ) =>{

    var jshint = require( '../.jshint' )
    var urls = require( '../bowerUrls' )

    config.modules.gulp.task('js:worker', ( ) =>
        config.modules.gulp
        .src( urls.jsWorker )
        .pipe( config.modules.concat('worker.js'))
        .pipe( config.modules.gulp.dest( `${config.folders[dest]}/bower` ) )
    )

    config.modules.gulp.task('js:dependencies', ( ) =>
        config.modules.gulp
        .src( urls.js )
        .pipe( config.modules.concat('dependencies.js'))
        .pipe( config.modules.gulp.dest( `${config.folders[dest]}/bower` ) )
    )

    config.modules.gulp.task('js:private', ( ) =>
        config.modules.gulp
        .src( config.folders.js.src.private )
        .pipe( config.modules.jshint( jshint ) )
        .pipe( config.modules.jshint.reporter( ) )
        .pipe( config.modules.plumber())
        .pipe( config.modules.concat('all.js'))
        .pipe( config.modules.gulp.dest( `${config.folders[dest]}/scripts` ) )
    )


    config.modules.gulp.task('js:public', ( ) =>
        config.modules.gulp
        .src( config.folders.js.src.public )
        .pipe( config.modules.jshint( jshint ) )
        .pipe( config.modules.jshint.reporter( ) )
        .pipe( config.modules.plumber())
        .pipe( config.modules.concat('login-ctrl.js'))
        .pipe( config.modules.gulp.dest( `${config.folders[dest]}/scripts` ) )
    )


    config.modules.gulp.task( 'babel', [ 'js:public', 'js:private','js:worker' ] )

}
