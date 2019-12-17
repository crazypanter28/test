module.exports = function(config) {

  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    //...
    files: [
        'node_modules/angular/angular.js',
        'node_modules/angular-mocks/angular-mocks.js',
        'bower_components/ngstorage/ngStorage.min.js',
        'src/private/scripts/app.js',
        'src/private/scripts/mainCtrl.js',
        'src/private/scripts/filters/**/*.js',
        'test/**/*.js'
    ],
    plugins : [
        'karma-jasmine', 'karma-phantomjs-launcher', 'karma-spec-reporter', 'karma-babel-preprocessor'
    ],
    reporters: ['spec'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: true,


    //babel-loader
    preprocessors: {
        "test/**/*.js": ["babel"]
    },
    "babelPreprocessor": {
        options: {
           presets: ['es2015'],
           sourceMap: 'inline'
        }
    }

  });

};
