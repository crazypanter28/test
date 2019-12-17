module.exports = ( config ) =>{

    var nodemon = require('gulp-nodemon');

    config.modules.gulp.task("server:mocks", () =>
        nodemon({
            script: './mocks/server.js'
            , ext: 'js'
            , env: { 'NODE_ENV': 'development' }
        })
    )


}
