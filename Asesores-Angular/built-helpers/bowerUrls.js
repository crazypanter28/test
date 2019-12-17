var content = './bower_components';
var src = './src/private';

var config ={    
    js: [
        
        `${src}/assets/scripts/modernizr.js`,
        `${content}/jquery/dist/jquery.min.js`,
        `${content}/nanoscroller/bin/javascripts/jquery.nanoscroller.min.js`,
        `${content}/angular/angular.min.js`,
        `${src}/assets/scripts/angular-locale_es-mx.js`,
        `${src}/assets/scripts/underscore.min.js`,
        `${content}/angular-animate/angular-animate.min.js`,
        `${content}/angular-sanitize/angular-sanitize.min.js`,
        `${content}/angular-bootstrap/ui-bootstrap.min.js`,
        `${content}/angular-bootstrap/ui-bootstrap-tpls.min.js`,
        `${content}/angular-ui-router/release/angular-ui-router.min.js`,
        `${content}/bootstrap/dist/js/bootstrap.min.js`,
        `${content}/ngstorage/ngStorage.min.js`,
        `${content}/oclazyload/dist/ocLazyLoad.min.js`,
        `${content}/ramda/dist/ramda.min.js`,
        `${content}/chart.js/dist/Chart.min.js`,
        `${content}/angular-chart.js/dist/angular-chart.min.js`,
        //`${src}/assets/scripts/sockjs-0.3.4.js`,
        `${content}/ngMask/dist/ngMask.min.js`,
        `${src}/assets/scripts/sockjs-1.1.4.js`,
        `${src}/assets/scripts/stomp.js`,
        `${content}/ng-stomp/dist/ng-stomp.min.js`,
        `${content}/angular-breadcrumb/dist/angular-breadcrumb.min.js`,
        `${content}/angular-resource/angular-resource.min.js`,
        `${content}/moment/min/moment.min.js`,
        `${content}/moment-business-days/index.js`,
        `${content}/angular-moment/angular-moment.js`,
        `${src}/assets/scripts/ng-table.min.js`,
        `${src}/assets/scripts/scrollable.js`,
        `${src}/assets/scripts/isotope.pkgd.min.js`,
        `${src}/assets/scripts/jquery.liMarquee.js`,
        `${content}/moment/locale/es.js`,
        `${content}/bootstrap-daterangepicker/daterangepicker.js`,
        `${content}/angular-daterangepicker/js/angular-daterangepicker.min.js`,
        `${content}/angular-file-upload/dist/angular-file-upload.min.js`,
        `${content}/angular-file-saver/dist/angular-file-saver.bundle.min.js`,
        `${content}/textAngular/dist/textAngular-rangy.min.js`,
        `${content}/textAngular/dist/textAngular-sanitize.min.js`,
        `${content}/textAngular/dist/textAngular.min.js`,
        `${content}/angularjs-slider/dist/rzslider.min.js`,
        `${content}/ng-currency/dist/ng-currency.js`,
        `${content}/ng-percent/dist/ng-percent.min.js`,
        `${src}/scripts/filters/percentage.js`,
        `${content}/Chart.PieceLabel.js/build/Chart.PieceLabel.min.js`,
        `${content}/angularUtils-pagination/dirPagination.js`,
        `${src}/assets/scripts/chart-area-bg.js`,
        `${content}/angular-loading-bar/src/loading-bar.js`, 
        `${content}/jsPDF/dist/jspdf.debug.js` ,       
        `${content}/html2canvas/build/html2canvas.min.js`,
        `${content}/angular-save-html-to-pdf/dist/saveHtmlToPdf.min.js`

             
    ],
    css: [
        `${src}/assets/styles/ng-table.min.css`,
        `${content}/nanoscroller/bin/css/nanoscroller.css`,
        `${content}/bootstrap/dist/css/bootstrap.min.css`,
        `${content}/font-awesome/css/font-awesome.min.css`,
        `${content}/bootstrap-daterangepicker/daterangepicker.css`,
        `${content}/textAngular/dist/textAngular.css`,
        `${content}/angularjs-slider/dist/rzslider.min.css`,
        `${content}/angular-loading-bar/src/loading-bar.css`
    ],
    jsWorker:[
        `${src}/assets/scripts/sockjs-1.1.4.js`,
        `${src}/assets/scripts/stomp.js`
    ]
};

module.exports = config;
