module.exports = ( config, dest ) =>


    config.modules.gulp.task('annotate', ( ) =>

        config.modules.gulp.src( `${config.folders[dest]}/scripts/**/*.js`)
        .pipe( config.modules.plumber())
        .pipe( config.modules.ngAnnotate({
            single_quotes: true,
            add: true,
        }) )
        .pipe( config.modules.gulp.dest( `${config.folders[dest]}/scripts`) )

    )
