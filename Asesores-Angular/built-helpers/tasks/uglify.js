module.exports = ( config ) =>


    config.modules.gulp.task('uglify', () =>


        config.modules.gulp.src( [
            `${config.folders.dist}/scripts/**/*.js`,
            `!${config.folders.dist}/scripts/templates.js`
        ])
        .pipe( config.modules.minify({
            ext:{
                min:'.min.js'
            }
        }) )
        .pipe( config.modules.gulp.dest( `${config.folders.dist}/scripts` ) )


    )
