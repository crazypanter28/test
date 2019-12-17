const routes = require('express').Router();



routes.get('/Asesores/InvestmentSociety/getInvestmentIssuersQuery/55/0/0/0/:Stage/0/', (req, res) => {
    var param = req.params;

    var stage = param.Stage;


    res.json(require('../../models/advisers/simulators/InvestmentIssuersQuery'+ stage +'.json'));
});



routes.get('/Asesores/MarketInfo/clientIssuersMarketInfoQuery/0/1/1/0/0/0/', (req, res) => {

    res.json(require('../../models/advisers/simulators/clientIssuersMarketInfoQuery.json'));
});



routes.post('/ficha-valor-restful/SimulatorRest/:id', (req, res) => {
    var param = req.params;

    res.json(require('../../models/advisers/simulators/'+ param.id +'.json'));
});


routes.post('/getCreditDetail', (req, res) => {
    var param = req.params;

    res.json(require('../../models/advisers/simulators/creditDetail.json'));
});


routes.post('/getSimPayment/', (req, res) => {
    var param = req.params;

    res.json(require('../../models/advisers/simulators/payment.json'));
});



module.exports = routes;
