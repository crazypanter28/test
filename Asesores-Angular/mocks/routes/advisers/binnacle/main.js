const routes = require('express').Router();

const routerOperative = require('./operative.js')
const routerOutline = require('./outline')
const routerReports = require('./reports')
const routerStrategy = require('./strategy')

routes.use('/binnacle/operative', routerOperative )
routes.use('/', routerOutline )
routes.use('/', routerReports )
routes.use('/', routerStrategy )

module.exports = routes;
