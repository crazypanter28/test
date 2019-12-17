const routes = require('express').Router();

routes.get('/Asesores/Fund/getFunds/', (req, res) => {
    setTimeout(function() {
        res.json(require('../../../models/advisers/proposals/proposal/get-issuers-info.json'));
    }, 150);
});

routes.get('/Asesores/Product/getClassifications/', (req, res) => {
    setTimeout(function() {
        res.json(require('../../../models/advisers/proposals/proposal/get-products.json'));
    }, 150);
});

routes.get('/Asesores/Product/getProductsByClassification/:product', (req, res) => {
    var params = req.params;
    var product = parseInt( params.product );
    setTimeout(function() {
        if( product === 1 || product === 2 ){
            res.json(require('../../../models/advisers/proposals/proposal/get-sub-products-' + params.product + '.json'));
        } else {
            res.json(require('../../../models/advisers/proposals/proposal/get-sub-products-empty.json'));
        }
    }, 150);
});

routes.get('/Asesores/Catalogs/getClientProfileCatalog/', (req, res) => {
    setTimeout(function() {
        res.json(require('../../../models/advisers/proposals/proposal/get-profiles.json'));
    }, 150);
});

routes.get('/Asesores/Portfolio/getModelPortfolioByCriterionQuery/:type', (req, res) => {
    var params = req.params;
    setTimeout(function() {
        res.json(require('../../../models/advisers/proposals/proposal/get-strategies-' + params.type + '.json'));
    }, 150);
});

routes.get('/Asesores/Portfolio/getModelPortfolioDetailQuery/:strategy', (req, res) => {
    var params = req.params;
    setTimeout(function() {
        res.json(require('../../../models/advisers/proposals/proposal/get-strategy-detail-' + params.strategy + '.json'));
    }, 150);
});

routes.get('/Asesores/InvestmentSociety/getIssuersCatalog/:type', (req, res) => {
    var params = req.params;
    setTimeout(function() {
        res.json(require('../../../models/advisers/proposals/proposal/get-inv-issuers-catalog-' + params.type + '.json'));
    }, 150);
});

routes.get('/Asesores/BondMarket/getBandsCatalog/:type', (req, res) => {
    var params = req.params;
    setTimeout(function() {
        res.json(require('../../../models/advisers/proposals/proposal/get-bands-catalog-' + params.type + '.json'));
    }, 150);
});

routes.get('/Asesores/BondMarket/getIssuersCatalog/:type', (req, res) => {
    var params = req.params;
    setTimeout(function() {
        res.json(require('../../../models/advisers/proposals/proposal/get-issuers-catalog-' + params.type + '.json'));
    }, 150);
});

routes.get('/Asesores/MarketInfo/getIssuersCatalog/', (req, res) => {
    setTimeout(function() {
        res.json(require('../../../models/advisers/proposals/proposal/get-all-issuers.json'));
    }, 150);
});

routes.get('/Asesores/Issuer/getFavorites/', (req, res) => {
    setTimeout(function() {
        res.json(require('../../../models/advisers/proposals/proposal/get-favorites.json'));
    }, 150);
});

module.exports = routes;