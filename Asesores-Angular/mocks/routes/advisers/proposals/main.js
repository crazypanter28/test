const routes = require('express').Router();

const routerActivity = require('./activity.js')
const routerProposal = require('./proposal')
const routerTracing = require('./tracing')
const routerTracingClient = require('./tracingClient')
const routerActivityRecord = require('./ActivityRecord')

routes.use('/proposals/activity', routerActivity )
routes.use('/', routerProposal )
routes.use('/', routerTracing )
routes.use('/', routerTracingClient )
routes.use('/', routerActivityRecord )

module.exports = routes;
