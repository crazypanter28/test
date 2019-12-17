
const routes = require('express').Router();

/* fondos de inversion*/
routes.get('/InvestmentSocietyRest/bps01/:id/:id/:id/:id/:idRes/:id', (req, res) => {
    var id = req.params.idRes;

    setTimeout(function() {
        if( id==='3' ){
            res.json(require('../../models/operaciones/InvestmentSociety/debt.json'));
        }
        else if( id==='2' ){
            res.json(require('../../models/operaciones/InvestmentSociety/VariableIncome.json'));
        }
        else if( id==='1' ){
            res.json(require('../../models/operaciones/InvestmentSociety/Dynamic.json'));
        }
    }, 500);
});

routes.get('/OrdersRest/bpc12/:id/:id/:type', (req, res) => {

    setTimeout(function() {
        if( req.params.type === 'MD' ){
            res.json(require('../../models/operaciones/investment/money/orders.json'));
        }else if( req.params.type === 'MC' ){
            res.json(require('../../models/operaciones/investment/capitals/orderRest.json'));
        } else {
            res.json(require('../../models/operaciones/InvestmentSociety/orderRest.json'));
        }
    }, 1000);
});


routes.get('/PortfolioRest/bpc30/:id/:id/:type', (req, res) => {
    setTimeout(function() {
        if( req.params.type === 'MD' ){
            res.json(require('../../models/operaciones/investment/money/instruments.json'));
        } else {
            res.json(require('../../models/operaciones/InvestmentSociety/portfolio.json'));
        }
    }, 1000);
});


/**doll**/
routes.get('/BalanceRest/prc05/:contract/:id/:id/:id', (req, res) => {
    setTimeout(function() {
        res.json(require('../../models/operaciones/InvestmentSociety/doll/BalanceRest.json'));
    }, 500);
});

routes.get('/InvestmentSocietyRest/bps03/:contract/:station/:serie/:type/:id/:anticipedSell', (req, res) => {
    var params = req.params;
    var json = require('../../models/operaciones/InvestmentSociety/doll/outFundQuery.json');
    if( params.anticipedSell === '1' ){
        json = require('../../models/operaciones/InvestmentSociety/doll/outFundQuery2.json');
    }

    json.outFundQuery.fund.price = Math.floor(Math.random() * 20) + 1;
    res.json( json );
});


routes.get('/InvestmentSocietyRest/bps15/:station/:serie', (req, res) => {
    var params = req.params;

    res.json(require('../../models/operaciones/InvestmentSociety/bps15.json'));
});

routes.post('/InvestmentSocietyRest/bps14', (req, res) => {
    var body = req.body;

    if( body.movementType == 1){
        res.json(require('../../models/operaciones/InvestmentSociety/doll/confirmDollBuy.json'));
    }
    else{
        res.json(require('../../models/operaciones/InvestmentSociety/doll/confirmDollSell.json'));
    }
});

routes.post('/InvestmentSocietyRest/bps06', (req, res) => {
    var body = req.body;

    if( body.movementType == 1){
        res.json(require('../../models/operaciones/InvestmentSociety/doll/captureBuy.json'));
    }
    else{
        res.json(require('../../models/operaciones/InvestmentSociety/doll/captureSell.json'));
    }
});


routes.get('/cancellation/bps13/:contract/C/:id', (req, res) => {
    // /bps13/3000228/C/898597
    var body = req.body;

    res.json(require('../../models/operaciones/InvestmentSociety/cancellation.json'));

});

routes.get('/doll/ContractRest/prd01/:id/:id/:contract', (req, res) => {
    // /bps13/3000228/C/898597
    var body = req.body;

    res.json(require('../../models/operaciones/InvestmentSociety/doll/ContractRestPrd01.json'));

});

/**doll**/


routes.get('/moreInfo/OrdersRest/ord04/:contract/:id', (req, res) => {
    var params = req.params;

    res.json(require('../../models/operaciones/InvestmentSociety/moreInfo.json'));
});

/* Money */
routes.get('/BondMarketRest/bpd04/:contract/1/0/0/0', (req, res) => {
    setTimeout(function() {
        res.json(require('../../models/operaciones/investment/money/reporto.json'));
    }, 150);
});

routes.post('/BondMarketRest/bpd09/', (req, res) => {
    var body = req.body;

    setTimeout(function() {
        if(body.netAmount < 8) {
            res.json(require('../../models/operaciones/investment/money/confirm-success.json'));
        } else {
            res.json(require('../../models/operaciones/investment/money/confirm-error.json'));
        }
    }, 150);
});

routes.post('/BondMarketRest/bpd08/', (req, res) => {
    var body = req.body;

    setTimeout(function() {
        res.json(require('../../models/operaciones/investment/money/transaction-success.json'));
    }, 150);
});

/*termina fondos de inversion*/


module.exports = routes;
