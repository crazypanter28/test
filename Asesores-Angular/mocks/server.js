const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const methodOverride = require('method-override')


/* dashboard */
const routesDashboard = require('./routes/advisers/dashboard/main');
/* dashboard */

/** binnacle **/
const routesBinnacle = require('./routes/advisers/binnacle/main');
/** binnacle **/

/** proposals **/
const routespProposal = require('./routes/advisers/proposals/main');
/** proposals **/

/** operations **/
const routesAccount = require('./routes/operations/account');
const routesPortfolio = require('./routes/operations/portfolio');
const routesInvestment = require('./routes/operations/investment');
const routesCapitals = require('./routes/operations/capitals');
const routesTranfers = require('./routes/operations/transfers');
/** operations **/

const routesCommons = require('./routes/commons');
const routesLogin = require('./routes/login');


const routesAdministrator = require('./routes/administrator/main');


const routesPresentations = require('./routes/advisers/presentations');
const routesSimulators = require('./routes/advisers/simulators');
const routesHelp = require('./routes/advisers/help');

const routesProspects = require('./routes/advisers/prospects/prospects');

/**
*Middelwares
**/
app.use(bodyParser.json());
app.use(methodOverride());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-CSRF-TOKEN");
    next();
});


app.use('/', routespProposal);
app.use('/', routesAccount);
app.use('/', routesPortfolio);
app.use('/', routesInvestment);
app.use('/', routesCapitals);
app.use('/', routesTranfers);
app.use('/', routesCommons);
app.use('/', routesLogin);

app.use('/', routesAdministrator);
app.use('/', routesBinnacle);
app.use('/', routesProspects);
app.use('/', routesPresentations);
app.use('/', routesDashboard);
app.use('/', routesSimulators);
app.use('/', routesHelp);

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.listen( 800, function () {
    console.log('Example app listening on port 800!');
});
