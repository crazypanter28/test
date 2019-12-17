const routes = require('express').Router();

routes.get('/asesoria-restful/api/Asesores/Contract/validateUser/:employee/:contract', (req, res) => {
        res.json(require('../../../models/advisers/proposals/tracing/getAdviserContract.json'));
});

routes.get('/eActinver_Admin/jaxrs/AdministrativeManagerEnrollmentRest/getIdClient/:contract', (req, res) => {
        res.json(require('../../../models/advisers/proposals/tracing/getContractIdClient.json'));
});

routes.get('/asesoria-restful/api/Asesores/Portfolio/getSummary/:id/:employee', (req, res) => {
        res.json(require('../../../models/advisers/proposals/tracing/getSummary.json'));
});

routes.get('/Asesores/Contract/getBrokerHousePositionList/:contract', (req, res) => {
        res.json(require('../../../models/advisers/proposals/tracing/getPositionDetailedSummary.json'));
});

routes.post('/Asesores/Portfolio/getDetailedSummary', (req, res) => {
        res.json(require('../../../models/advisers/proposals/tracing/getDetailedSummary.json'));
});


routes.post('/Asesores/Contract/getBrokerHousePositionList/', (req, res) => {
        res.json(require('../../../models/advisers/proposals/tracing/getDetailedSummary.json'));
});

routes.get('/Asesores/Portfolio/getCurrentPortfolio/:id1/:id2/:id3', (req, res) => {
    res.json(require('../../../models/advisers/proposals/tracing/getCurrentPortfolio.json'));
});

module.exports = routes;
