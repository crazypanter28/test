var plato = require('plato');

var files = [
  'src/private/app/**/*',
  'src/private/scripts/**/*',
];

var outputDir = './report';
// null options for this example
var options = {
  title: 'Actinver'
};

var callback = function (report){
// once done the analysis,
// execute this
    console.log('finish report');
};

plato.inspect(files, outputDir, options, callback);
