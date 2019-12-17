module.exports = ( config,dest ) =>{
    var options = dest == 'dist' ? {outputStyle: 'compressed'} : {};

    config.modules.gulp.task('sass', ( ) =>
        setTimeout(() => {
            return config.modules.gulp
                .src( [
                    config.folders.sass.src[1],
                    config.folders.sass.src[2],
                ] )
                .pipe( config.modules.plumber())
                .pipe( config.modules.sass( options ).on('error', config.modules.sass.logError) )
                .pipe( config.modules.gulp.dest( config.folders.sass[dest] ) )
        }, 500)
    )


}
