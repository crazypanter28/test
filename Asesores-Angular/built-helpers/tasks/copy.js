module.exports = ( config, dest ) =>{

    var urls = require( '../bowerUrls' )

    config.modules.gulp.task('copy:assets', ( ) =>
        config.modules.gulp
        .src( [
            `${config.folders.src}/private/assets/**/*`,
            `!${config.folders.src}/private/assets/scripts/**`,
        ])
        .pipe( config.modules.gulp.dest( `${config.folders[dest]}` ) )
    )

    config.modules.gulp.task('copy:bower', ( ) =>
        config.modules.gulp
        .src( urls.css )
        .pipe( config.modules.concat('dependencies.css'))
        .pipe( config.modules.gulp.dest( `${config.folders[dest]}/bower` ) )
    )

    config.modules.gulp.task('copy:fonts', ( ) =>
        config.modules.gulp
        .src( './bower_components/bootstrap/fonts/**' )
        .pipe( config.modules.gulp.dest( `${config.folders[dest]}/fonts` ) )
    )

    config.modules.gulp.task('copy', [ 'copy:assets', 'copy:bower', 'copy:fonts' ] )

}
