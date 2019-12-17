module.exports = ( config, dest ) =>


   config.modules.gulp.task('clean', ( ) =>
       config.modules.gulp
       .src( config.folders[dest] )
       .pipe( config.modules.clean() )
   )
