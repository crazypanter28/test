const routes = require('express').Router();

routes.get('/PortfolioRest/prp00/:client', (req, res) => {
    setTimeout(function() {
        res.json(require('../../models/operaciones/portfolio/resume.json'));
    }, 150);
});

routes.get('/portfolio-credits/:client', (req, res) => {
    setTimeout(function() {
        res.json(require('../../models/operaciones/portfolio/credits.json'));
    }, 300);
});

routes.get('/portfolio-insurances/:client', (req, res) => {
    setTimeout(function() {
        res.json(require('../../models/operaciones/portfolio/insurances.json'));
    }, 300);
});

routes.get('/PortfolioRest/bpc30/:contract/0/TM/', (req, res) => {
    setTimeout(function() {
        res.json(require('../../models/operaciones/portfolio/detail.json'));
    }, 150);
});

module.exports = routes;