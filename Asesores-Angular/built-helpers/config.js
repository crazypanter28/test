const config = {}
const src = './src'
const build = './build'
const dist = './dist'


config.modules = {
	argv : require('yargs').argv,
	clean : require('gulp-clean'),
	concat : require('gulp-concat'),
	fs: require('fs'),
	gulp : require('gulp'),
	/*gulpTinifyImg: require('gulp-tinify-img'),*/
	jshint : require('gulp-jshint'),
	ngAnnotate : require('gulp-ng-annotate'),
	path: require('path'),
	plumber : require('gulp-plumber'),
	pug : require('gulp-pug'),
	sass : require('gulp-sass'),
	sync : require('gulp-sync')(require('gulp')),
    server: require('gulp-server-livereload'),
	minify: require('gulp-minify'),
	watch : require('gulp-watch'),
};


config.folders = {
    build: build,
	dist: dist,
    src: src,
    imgs: `${src}/img/**/*.{svg, png, jpeg,jpg}`,
    sass:{
        src: [
            `${src}/**/*.scss`,
            `${src}/public/*.scss`,
            `${src}/private/styles/*.scss`,
        ],
        build: `${build}/styles`,
        dist: `${dist}/styles`,
    },
    pug:{
        src: [
            `${src}/**/*.pug`,
            `!${src}/private/views/mixins/**/*.pug`,
            `!${src}/private/views/layout/**/*.pug`,
            `!${src}/private/views/elements/**/*.pug`,
			`!${src}/{private,public}/*.pug`,
        ],
        index: `${src}/private/index.pug`,
        login: `${src}/public/login.pug`,
        build: `${build}/views`,
        dist: `${dist}/views`,
    },
	js:{
		src:{
			private: [
				`${src}/private/**/*.js`,
				`!${src}/private/assets/**`,
			],
			public: [
				`${src}/public/**/*.js`,
				`${src}/private/scripts/factory/auth-ftr.js`,
				`${src}/private/scripts/services/login-srvc.js`,
				`${src}/private/scripts/factory/app-config.js`,
				`${src}/private/scripts/constants/urls.config.js`,
				`${src}/private/scripts/modals/commons-srv.js`
			],
		},
	}
}



config.fn = {

    readFolder: ( folder, destination ) => {
		var PATH = config.modules.path.join( __dirname, folder )
		var FILES = config.modules.fs.readdirSync(PATH)

		for( var file of FILES )
			require( `${folder}/${file}` )(config,destination)
	}

}

module.exports = config
