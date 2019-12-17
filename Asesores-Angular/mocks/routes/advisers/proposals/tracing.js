const routes = require('express').Router();

routes.get('/Asesores/Contract/validateUser/:employee/:contract', (req, res) => {
    setTimeout(function() {
        res.json(require('../../../models/advisers/proposals/tracing/get-contract-info.json'));
    }, 150);
});

module.exports = routes;
