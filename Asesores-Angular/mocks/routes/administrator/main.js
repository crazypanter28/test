const routes = require('express').Router();

const routerAdvisersBinnacle = require('./advisers-binnacle.js')
const routeGroup = require('./groups.js')
const routePres = require('./presentations.js')
const routeParameters = require('./parameters.js')
const routeInvest = require('./investment.js')
const routeEmployee = require('./employee.js')
const routeProfiles = require('./profiles.js')
const routeMessages = require('./messages.js')

routes.use('/administrator/advisers-binnacle', routerAdvisersBinnacle )
routes.use('/', routeGroup )
routes.use('/', routePres )
routes.use('/', routeParameters )
routes.use('/', routeInvest )
routes.use('/', routeEmployee )
routes.use('/', routeProfiles )
routes.use('/', routeMessages )

module.exports = routes;
