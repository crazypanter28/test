module.exports = ( config ) =>


    config.modules.gulp.task('server', () =>


        config.modules.gulp.src( config.folders.build )
        .pipe( config.modules.server({
            directoryListing: {
                enable: false,
                path: config.folders.build
            },
            livereload: true,
            open: true,
            port: 3000
        }))

    )
