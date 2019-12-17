module.exports = ( config ) => {
    function log( task ){

        return function(vinyl){
            config.modules.gulp.start( task )
        }
    }

    config.modules.gulp.task('watch:assets', () =>
        config.modules.watch( `${config.folders.src}/private/assets/**/*`, log('copy') )
    )

    config.modules.gulp.task('watch:sass', () =>
        config.modules.watch( config.folders.sass.src[0], log('sass') )
    )


    config.modules.gulp.task('watch:pug', () =>
        config.modules.watch( config.folders.pug.src[0], log( 'pug' ) )
    )



    config.modules.gulp.task('watch:privateJs', () =>
        config.modules.watch( config.folders.js.src.private[0], log( config.modules.sync.sync([
                'babel',
            ]) )
        )
    )

    config.modules.gulp.task('watch:publicJs', () =>
        config.modules.watch( config.folders.js.src.public, log( config.modules.sync.sync([
                'babel',
                'annotate'
            ]) )
        )

    )
    //
    // config.modules.gulp.task('watch:index', () =>
    //     config.modules.watch( config.folders.pug.index, log( config.modules.sync.sync([
    //             'pug:index',
    //             'replace:index'
    //         ]) )
    //     )
    // )
    //
    // config.modules.gulp.task('watch:login', () =>
    //     config.modules.watch( config.folders.pug.login, log( config.modules.sync.sync([
    //             'pug:login',
    //             'replace:login'
    //         ]) )
    //     )
    // )


    return config.modules.gulp.task('watch', [
        'watch:sass', 'watch:pug', 'watch:privateJs', 'watch:publicJs'
        // ,'watch:login', 'watch:index'
    ] );

}
