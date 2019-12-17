module.exports = ( config, dest ) => {

    var rename = require('gulp-rename');
    var htmlreplace = require('gulp-html-replace');
    var ext = dest === 'dist' ? '.min.js' : '.js';

    var css={
        private: [
            'bower/dependencies.css',
            'styles/main.css',
        ],
        public: [
            'bower/dependencies.css',
            'styles/login.css',
        ]
    };

    var scriptsPrivate = [
        `bower/dependencies.js`,
        `scripts/all${ext}`, //minificado
        //`scripts/all.js`,//sin minificar
        `scripts/templates.js`,
    ];

    var scriptsLogin = [
        `bower/dependencies.js`,
        `scripts/login-ctrl${ext}`,
    ];


    config.modules.gulp.task('replace:index',() =>{
        config.modules.gulp.src( `${config.folders[dest]}/index.html`)
        .pipe( htmlreplace({
            'css': css.private,
            'js': scriptsPrivate
        }) )
        .pipe( config.modules.gulp.dest(`${config.folders[dest]}`) )
})

    config.modules.gulp.task('replace:login',() =>{
        config.modules.gulp.src(`${config.folders[dest]}/login.html`)
        .pipe(htmlreplace({
            'css': css.private,
            'js': scriptsLogin
        }) )
        .pipe( config.modules.gulp.dest(`${config.folders[dest]}` ) )
})


    config.modules.gulp.task('replace', [ 'replace:login', 'replace:index'] );

}
