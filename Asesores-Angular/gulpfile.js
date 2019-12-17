'use strict'
var config = require('./built-helpers/config');
var mock = config.modules.argv.mock || false;
var dist = config.modules.argv['_'][0] === 'dist' ? 'dist': 'build';

var taskDev = [
    'clean',
    'copy',
    'js:dependencies',
    'yaml',
    [
        'sass',
        'babel',
    ],
    'pug:indexes',
    'pug',
    // 'annotate',
    'server',
];

config.fn.readFolder( './tasks', dist );

if( mock ){
    taskDev.push("server:mocks");
}


taskDev.push("watch");

config.modules.gulp.task('default', () =>
    console.log( 'No se puede hacer nada en defatul!!!')
)

config.modules.gulp.task('dev', config.modules.sync.sync(taskDev) );

config.modules.gulp.task('dist', config.modules.sync.sync([
        'clean',
        'yaml',
        'copy',
        'js:dependencies',
        [
            'sass',
            'babel',
        ],
        'annotate',
        'pug:indexes',
        'pug',
        'uglify',
        'copy-data'
    ])
);

config.modules.gulp.task('copy-data', function () {
    return config.modules.gulp.src('./dist/**')
        .pipe(config.modules.gulp.dest('C:\\wildfly-11.0.0.Final\\standalone\\deployments\\asesoria.war\\WEB-INF\\site'));
});


var Server = require('karma').Server;

config.modules.gulp.task('test',(done) =>

    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start()

)
