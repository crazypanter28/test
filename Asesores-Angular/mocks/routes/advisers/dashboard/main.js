const routes = require('express').Router();

const routeCalendar = require('./calendar')
const routeOthers = require('./ipc')


routes.use('/', routeCalendar )
routes.use('/', routeOthers )

module.exports = routes;
