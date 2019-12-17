const routes = require('express').Router();

routes.get('/transfers/:id/:id/DR', (req, res) => {
    setTimeout(function() {
        res.json(require('../../models/operaciones/transferencias/transfers.json'));
    },1000 );
})


routes.post('/makeTransfer', (req, res) => {
    var amount = req.body.amount;

    setTimeout(function() {
        if( amount < 1000 ){
            res.json(require('../../models/operaciones/transferencias/transferSuccess.json'));
        }
        else{
            res.json(require('../../models/operaciones/transferencias/transferError.json'));
        }
    }, 1000);
});


routes.get('/accounts/:id/0/1', (req, res) => {
    res.json(require('../../models/operaciones/transferencias/accounts.json'));
});

routes.get('/otherAccounts/:id/0/1', (req, res) => {
    res.json(require('../../models/operaciones/transferencias/other-accounts.json'));
})


routes.get('/OrdersRest/:id/:id', (req, res) => {
    res.json(require('../../models/operaciones/transferencias/orderDetail.json'));
})

routes.get('/balance/:id', (req, res) => {
    setTimeout(function() {
        res.json(require('../../models/operaciones/transferencias/balance.json'));
    }, 1000);
})

routes.get('/contractRest/prd08/:id', (req, res) => {
    setTimeout(function() {
        res.json(require('../../models/operaciones/transferencias/balance.json'));
    }, 1000);
})


module.exports = routes;
